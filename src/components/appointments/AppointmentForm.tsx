import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type {
  Appointment,
  AppointmentFormValues,
  AppointmentPayload,
  Client,
  Professional,
  Service
} from "../../types";
import { toLocalInputValue } from "../../utils/dates";

interface AppointmentFormProps {
  services: Service[];
  professionals: Professional[];
  clients: Client[];
  initialData?: Appointment;
  onSubmit: (data: AppointmentPayload) => void | Promise<void>;
  loading?: boolean;
  initialStartLocal?: string;
}

export function AppointmentForm({
  services,
  professionals,
  clients,
  initialData,
  initialStartLocal,
  onSubmit,
  loading
}: AppointmentFormProps) {
  const defaultValues: AppointmentFormValues = {
    clientId: initialData
      ? typeof initialData.client === "string"
        ? initialData.client
        : initialData.client?._id ?? ""
      : "",
    professionalId: initialData
      ? typeof initialData.professional === "string"
        ? initialData.professional
        : initialData.professional?._id ?? ""
      : "",
    serviceId: initialData
      ? typeof initialData.service === "string"
        ? initialData.service
        : initialData.service?._id ?? ""
      : "",
    startLocal: initialData
      ? toLocalInputValue(new Date(initialData.start))
      : initialStartLocal ?? "",
    notes: initialData?.notes ?? ""
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AppointmentFormValues>({
    defaultValues
  });

  useEffect(() => {
    if (initialStartLocal) {
      setValue("startLocal", initialStartLocal);
    }
  }, [initialStartLocal, setValue]);

  const selectedProfessionalId = watch("professionalId");
  const selectedServiceId = watch("serviceId");

  const selectedProfessional = useMemo(() => {
    if (!selectedProfessionalId) return null;
    return professionals.find(p => p._id === selectedProfessionalId) ?? null;
  }, [selectedProfessionalId, professionals]);

  const availableServices = useMemo(() => {
    if (!selectedProfessional) return [];
    const profServiceIds =
      selectedProfessional.services?.map((s: any) =>
        typeof s === "string" ? s : s?._id
      ) ?? [];


    return services.filter(s => profServiceIds.includes(s._id));
  }, [selectedProfessional, services]);

  useEffect(() => {
    if (!selectedProfessionalId) {
      if (selectedServiceId) setValue("serviceId", "");
      return;
    }

    if (selectedServiceId) {
      const ok = availableServices.some(s => s._id === selectedServiceId);
      if (!ok) setValue("serviceId", "");
    }
  }, [selectedProfessionalId, selectedServiceId, availableServices, setValue]);

  const onValidSubmit = async (values: AppointmentFormValues) => {
    const startDate = new Date(values.startLocal);

    const payload: AppointmentPayload = {
      client: values.clientId,
      professional: values.professionalId,
      service: values.serviceId,
      start: startDate.toISOString(),
      notes: values.notes || undefined
    };

    await onSubmit(payload);
  };

  const serviceDisabled = !selectedProfessionalId;

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onValidSubmit)}>
      <div className="space-y-1">
        <label className="text-xl font-bold text-jordy-blue-800">Cliente</label>
        <select
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
          {...register("clientId", {
            required: "Seleccioná un cliente"
          })}
        >
          <option value="">Seleccionar cliente...</option>
          {clients.map(c => (
            <option key={c._id} value={c._id}>
              {c.name} {c.phone ? `· ${c.phone}` : ""}
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p className="text-[11px] text-red-400 mt-1">
            {errors.clientId.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xl font-bold text-jordy-blue-800">
            Profesional
          </label>
          <select
            className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
            {...register("professionalId", {
              required: "Seleccioná un profesional"
            })}
          >
            <option value="">Seleccionar profesional...</option>
            {professionals.map(p => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.professionalId && (
            <p className="text-[11px] text-red-400 mt-1">
              {errors.professionalId.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xl font-bold text-jordy-blue-800">Servicio</label>
          <select
            className={`w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500 ${
              serviceDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={serviceDisabled}
            {...register("serviceId", {
              required: "Seleccioná un servicio"
            })}
          >
            <option value="">
              {serviceDisabled ? "Seleccioná un profesional primero..." : "Seleccionar servicio..."}
            </option>

            {availableServices.map(s => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.durationMinutes} min)
              </option>
            ))}
          </select>

          {errors.serviceId && (
            <p className="text-[11px] text-red-400 mt-1">
              {errors.serviceId.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xl font-bold text-jordy-blue-800">
          Fecha y hora de inicio
        </label>
        <input
          type="datetime-local"
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
          {...register("startLocal", {
            required: "Seleccioná fecha y hora",
            validate: value => {
              const d = new Date(value);
              if (isNaN(d.getTime())) return "Fecha/hora inválidas";
              const now = new Date();
              if (d.getTime() < now.getTime() - 5 * 60 * 1000) {
                return "El turno no puede ser en el pasado";
              }
              return true;
            }
          })}
        />
        {errors.startLocal && (
          <p className="text-[11px] text-red-400 mt-1">
            {errors.startLocal.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xl font-bold text-jordy-blue-800">Notas</label>
        <textarea
          rows={2}
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
          {...register("notes")}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg text-jordy-blue-200 text-lg bg-jordy-blue-600 hover:bg-jordy-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium py-2.5 mt-2 duration-200"
      >
        {loading ? "Guardando turno..." : "Guardar turno"}
      </button>
    </form>
  );
}
