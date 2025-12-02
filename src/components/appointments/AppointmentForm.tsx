import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { AppointmentFormValues, AppointmentPayload, Client, Professional, Service } from "../../types";

interface AppointmentFormProps {
  services: Service[];
  professionals: Professional[];
  clients: Client[];
  onSubmit: (data: AppointmentPayload) => void | Promise<void>;
  loading?: boolean;
  initialStartLocal?: string;
}

export function AppointmentForm({
  services,
  professionals,
  clients,
  onSubmit,
  loading,
  initialStartLocal
}: AppointmentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<AppointmentFormValues>({
    defaultValues: {
      clientId: "",
      professionalId: "",
      serviceId: "",
      startLocal: initialStartLocal ?? "",
      notes: ""
    }
  });

  useEffect(() => {
    if (initialStartLocal) {
      setValue("startLocal", initialStartLocal);
    }
  }, [initialStartLocal, setValue]);

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

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onValidSubmit)}>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">Cliente</label>
        <select
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
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
          <label className="text-xs font-medium text-slate-300">
            Profesional
          </label>
          <select
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
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
          <label className="text-xs font-medium text-slate-300">Servicio</label>
          <select
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            {...register("serviceId", {
              required: "Seleccioná un servicio"
            })}
          >
            <option value="">Seleccionar servicio...</option>
            {services.map(s => (
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
        <label className="text-xs font-medium text-slate-300">
          Fecha y hora de inicio
        </label>
        <input
          type="datetime-local"
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
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
        <label className="text-xs font-medium text-slate-300">Notas</label>
        <textarea
          rows={2}
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          {...register("notes")}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium py-2.5 mt-2"
      >
        {loading ? "Guardando turno..." : "Guardar turno"}
      </button>
    </form>
  );
}
