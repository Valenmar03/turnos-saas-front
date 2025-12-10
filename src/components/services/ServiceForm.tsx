import { useForm } from "react-hook-form";
import type { Service, ServiceFormValues, ServicePayload } from "../../types";

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: ServicePayload) => void | Promise<void>;
  loading?: boolean;
}

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
        <label className="text-xl font-bold text-jordy-blue-800">Nombre</label>
        <input
          type="text"
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
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
        <label className="text-xl font-bold text-jordy-blue-800">
          Duración (minutos)
        </label>
        <input
          type="number"
          min={1}
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
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
        <label className="text-xl font-bold text-jordy-blue-800">
          Precio (opcional)
        </label>
        <input
          type="number"
          min={0}
          step="0.01"
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
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
        <label className="text-xl font-bold text-jordy-blue-800">
          Solapamiento
        </label>
        <div className="flex items-center gap-2">
          <input
            id="allowOverlapService"
            type="checkbox"
            className="h-4 w-4 rounded border-jordy-blue-600 bg-jordy-blue-900"
            {...register("allowOverlap")}
          />
          <label
            htmlFor="allowOverlapService"
            className=" text-jordy-blue-700"
          >
            Permitir más de un turno a la vez para este servicio
          </label>
        </div>

        {allowOverlap && (
          <div className="mt-2 space-y-1 flex justify-between items-center">
            <label className="font-bold text-jordy-blue-800">
              Máx. turnos simultáneos
            </label>
            <input
              type="number"
              min={1}
              className="w-1/2 rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
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
        className="w-full rounded-lg text-jordy-blue-200 text-lg bg-jordy-blue-600 hover:bg-jordy-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium py-2.5 mt-2 duration-200"
      >
        {loading ? "Guardando..." : "Guardar servicio"}
      </button>
    </form>
  );
}
