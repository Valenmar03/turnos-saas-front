import { useForm } from "react-hook-form";
import type { Service, ServicePayload } from "../../hooks/useServices";

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: ServicePayload) => void | Promise<void>;
  loading?: boolean;
}

type ServiceFormValues = {
  name: string;
  durationMinutes: number;
  price?: number | null;
  allowOverlap: boolean;
  maxConcurrentAppointments: number;
};

export function ServiceForm({ initialData, onSubmit, loading }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ServiceFormValues>({
    defaultValues: {
      name: initialData?.name ?? "",
      durationMinutes: initialData?.durationMinutes ?? 60,
      price:
        typeof initialData?.price === "number" ? initialData.price : undefined,
      allowOverlap: initialData?.allowOverlap ?? false,
      maxConcurrentAppointments: initialData?.maxConcurrentAppointments ?? 1
    }
  });

  const allowOverlap = watch("allowOverlap");

  const onValidSubmit = async (values: ServiceFormValues) => {
    const payload: ServicePayload = {
      name: values.name.trim(),
      durationMinutes: values.durationMinutes,
      price:
        values.price === undefined || values.price === null
          ? undefined
          : values.price,
      allowOverlap: values.allowOverlap,
      maxConcurrentAppointments: values.allowOverlap
        ? values.maxConcurrentAppointments
        : 1
    };

    await onSubmit(payload);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onValidSubmit)}>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">Nombre</label>
        <input
          type="text"
          className="w-full rounded-lg bg-slate-900 border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border-slate-700"
          {...register("name", {
            required: "El nombre es obligatorio",
            minLength: {
              value: 2,
              message: "El nombre debe tener al menos 2 caracteres"
            }
          })}
        />
        {errors.name && (
          <p className="text-[11px] text-red-400 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Duración (minutos)
        </label>
        <input
          type="number"
          min={1}
          className="w-full rounded-lg bg-slate-900 border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border-slate-700"
          {...register("durationMinutes", {
            valueAsNumber: true,
            required: "La duración es obligatoria",
            min: {
              value: 1,
              message: "La duración debe ser mayor a 0"
            }
          })}
        />
        {errors.durationMinutes && (
          <p className="text-[11px] text-red-400 mt-1">
            {errors.durationMinutes.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Precio (opcional)
        </label>
        <input
          type="number"
          min={0}
          step="0.01"
          className="w-full rounded-lg bg-slate-900 border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border-slate-700"
          {...register("price", {
            valueAsNumber: true,
            validate: value => {
              if (value === undefined || value === null || value === 0) return true;
              if (Number.isNaN(value)) return "Debe ser un número";
              if (value < 0) return "El precio no puede ser negativo";
              return true;
            }
          })}
        />
        {errors.price && (
          <p className="text-[11px] text-red-400 mt-1">{errors.price.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Solapamiento
        </label>
        <div className="flex items-center gap-2">
          <input
            id="allowOverlapService"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-600 bg-slate-900"
            {...register("allowOverlap")}
          />
          <label
            htmlFor="allowOverlapService"
            className="text-xs text-slate-300"
          >
            Permitir más de un turno a la vez para este servicio
          </label>
        </div>

        {allowOverlap && (
          <div className="mt-2 space-y-1">
            <label className="text-xs text-slate-300">
              Máx. turnos simultáneos
            </label>
            <input
              type="number"
              min={1}
              className="w-32 rounded-lg bg-slate-900 border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border-slate-700"
              {...register("maxConcurrentAppointments", {
                valueAsNumber: true,
                required: "Indicá el máximo de turnos simultáneos",
                min: {
                  value: 1,
                  message: "Debe ser al menos 1"
                }
              })}
            />
            {errors.maxConcurrentAppointments && (
              <p className="text-[11px] text-red-400 mt-1">
                {errors.maxConcurrentAppointments.message}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium py-2.5 mt-2"
      >
        {loading ? "Guardando..." : "Guardar servicio"}
      </button>
    </form>
  );
}
