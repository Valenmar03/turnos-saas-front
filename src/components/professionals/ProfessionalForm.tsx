import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Professional, ProfessionalFormValues, ProfessionalPayload, Service, TimeOff, WorkingHour } from "../../types";
import { upsertWorkingHourInList } from "../../utils/professionals";
import BasicFieldsForm from "./BasicFieldsForm";
import TimeOffField from "./TimeOffField";
import WorkingHoursField from "./WorkingHoursField";


interface ProfessionalFormProps {
  initialData?: Professional;
  servicesOptions: Service[];
  onSubmit: (data: ProfessionalPayload) => void;
  loading?: boolean;
}

export function ProfessionalForm({
  initialData,
  servicesOptions,
  onSubmit,
  loading
}: ProfessionalFormProps) {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(
    initialData?.workingHours ?? []
  );
  const [timeOff, setTimeOff] = useState<TimeOff[]>(
    initialData?.timeOff ?? []
  );



  const [selectedServices, setSelectedServices] = useState<string[]>(
      initialData?.services?.map(s => s._id) ?? []
  );
  
  const { register, handleSubmit, watch, reset, setError, clearErrors, setValue, formState: { errors } } = useForm<ProfessionalFormValues>();

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        color: initialData.color ?? "#6366f1",
        allowOverlap: initialData.allowOverlap ?? false,
      });

      setSelectedServices(initialData.services?.map(s => s._id) ?? []);

      setWorkingHours(initialData.workingHours ?? []);

      setTimeOff(initialData.timeOff ?? []);
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        color: "#6366f1",
        allowOverlap: false,
      });
      setSelectedServices([]);
      setWorkingHours([]);
      setTimeOff([]);
    }
  }, [initialData, reset]);


const handleChangeHour = (day: number, patch: Partial<WorkingHour>) => {
  setWorkingHours(prev => upsertWorkingHourInList(prev, day, patch));
};

const toggleDay = (day: number, enabled: boolean) => {
  setWorkingHours(prev => {
    if (!enabled) {
      return prev.filter(w => w.dayOfWeek !== day);
    }
    // si lo activamos y no existía, creamos horario default
    if (!prev.some(w => w.dayOfWeek === day)) {
      return [...prev, { dayOfWeek: day, startTime: "09:00", endTime: "18:00" }];
    }
    return prev;
  });
};

const getHourForDay = (day: number, field: "startTime" | "endTime") => {
  const wh = workingHours.find(w => w.dayOfWeek === day);
  return wh ? wh[field] : "";
};


  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const addTimeOff = () => {
    const now = new Date();
    const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    setTimeOff(prev => [
      ...prev,
      {
        start: now.toISOString(),
        end: inTwoHours.toISOString(),
        reason: ""
      }
    ]);
  };

  const updateTimeOff = (index: number, patch: Partial<TimeOff>) => {
    setTimeOff(prev =>
      prev.map((t, i) => (i === index ? { ...t, ...patch } : t))
    );
  };

  const removeTimeOff = (index: number) => {
    setTimeOff(prev => prev.filter((_, i) => i !== index));
  };


  const onValidSubmit = (values: ProfessionalFormValues) => {
      if (selectedServices.length === 0) {
      setError("root.services", { message: "Seleccioná al menos un servicio" });
      return;
    }

    clearErrors("root.services");

    for (let i = 0; i < timeOff.length; i++) {
      const { start, end } = timeOff[i];
      if (!start || !end) {
        setError("root.timeoff", { message: "Completa las fechas de bloqueo" });
        return;
      }

      const startDate = new Date(start);
      const endDate = new Date(end);

      if (startDate >= endDate) {
        setError("root.timeoff", {
          message: "La fecha de inicio debe ser anterior a la de fin"
        });
        return;
      }
    }

    clearErrors("root.timeoff");

    const payload: ProfessionalPayload = {
      name: values.name.trim(),
      email: values.email?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
      color: values.color,
      services: selectedServices,
      allowOverlap: values.allowOverlap,
      workingHours: workingHours.filter(
        w => w.startTime && w.endTime
      ),
      timeOff: timeOff.filter(t => t.start && t.end)
    };

    onSubmit(payload);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onValidSubmit)}>
      <BasicFieldsForm
        register={register}
        watch={watch}
        setValue={setValue}
        errors={errors}
        servicesOptions={servicesOptions}
        selectedServices={selectedServices}
        toggleService={toggleService}
      />

      <WorkingHoursField 
        workingHours={workingHours}
        toggleDay={toggleDay}
        getHourForDay={getHourForDay}
        handleChangeHour={handleChangeHour}
      />
      
      <TimeOffField
        addTimeOff={addTimeOff}
        errors={errors}
        timeOff={timeOff}
        updateTimeOff={updateTimeOff}
        removeTimeOff={removeTimeOff}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg text-jordy-blue-200 text-lg bg-jordy-blue-600 hover:bg-jordy-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium py-2.5 mt-2 duration-200"
      >
        {loading ? "Guardando..." : "Guardar profesional"}
      </button>
    </form>
  );
}
