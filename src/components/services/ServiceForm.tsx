import { useForm } from "react-hook-form";
import type { Service, ServicePayload } from "../../types";

type ServiceFormValues = {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  category: string;
  color: string; // obligatorio
  allowOverlap: boolean;
  maxConcurrentAppointments: number;
};

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
    setValue, // ✅ te faltaba
    formState: { errors },
  } = useForm<ServiceFormValues>({
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      durationMinutes: initialData?.durationMinutes ?? 60,
      price: typeof initialData?.price === "number" ? initialData.price : 0,
      category: initialData?.category ?? "",
      color: initialData?.color ?? "#ffffff", // ✅ mejor default
      allowOverlap: initialData?.allowOverlap ?? false,
      maxConcurrentAppointments: initialData?.maxConcurrentAppointments ?? 1,
    },
  });

  const color = watch("color");
  const allowOverlap = watch("allowOverlap");

  const onValidSubmit = async (values: ServiceFormValues) => {
    const payload: ServicePayload = {
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      durationMinutes: values.durationMinutes,
      price: values.price,
      category: values.category.trim(),
      color: values.color.trim(),
      allowOverlap: values.allowOverlap,
      maxConcurrentAppointments: values.allowOverlap ? values.maxConcurrentAppointments : 1,
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
            minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres" },
          })}
        />
        {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xl font-bold text-jordy-blue-800">Descripción (opcional)</label>
        <textarea
          rows={3}
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
          {...register("description")}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xl font-bold text-jordy-blue-800">Duración (minutos)</label>
        <input
          type="number"
          min={1}
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
          {...register("durationMinutes", {
            valueAsNumber: true,
            required: "La duración es obligatoria",
            min: { value: 1, message: "La duración debe ser mayor a 0" },
          })}
        />
        {errors.durationMinutes && (
          <p className="text-[11px] text-red-400 mt-1">{errors.durationMinutes.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xl font-bold text-jordy-blue-800">Precio</label>
        <input
          type="number"
          min={0}
          step="0.01"
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
          {...register("price", {
            valueAsNumber: true,
            required: "El precio es obligatorio",
            validate: (value) => {
              if (value === undefined || value === null) return "El precio es obligatorio";
              if (Number.isNaN(value)) return "Debe ser un número";
              if (value < 0) return "El precio no puede ser negativo";
              return true;
            },
          })}
        />
        {errors.price && <p className="text-[11px] text-red-400 mt-1">{errors.price.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xl font-bold text-jordy-blue-800">Categoría</label>
        <input
          type="text"
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
          {...register("category")}
        />
        {errors.category && (
          <p className="text-[11px] text-red-400 mt-1">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xl font-bold text-jordy-blue-800">Color</label>

        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color || "#ffffff"}
            onChange={(e) =>
              setValue("color", e.target.value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            className="h-9 w-9 rounded-md border border-jordy-blue-200 bg-jordy-blue-200 cursor-pointer"
          />

          <input
            type="text"
            {...register("color", {
              required: "El color es obligatorio",
              validate: (value) => {
                if (!value) return "El color es obligatorio";
                if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim())) {
                  return "Usá formato HEX: #RGB o #RRGGBB";
                }
                return true;
              },
            })}
            value={color || ""}
            onChange={(e) =>
              setValue("color", e.target.value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            className="flex-1 rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
            placeholder="#ffffff"
          />
        </div>

        {errors.color && <p className="text-[11px] text-red-400 mt-1">{errors.color.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xl font-bold text-jordy-blue-800">Solapamiento</label>
        <div className="flex items-center gap-2">
          <input
            id="allowOverlapService"
            type="checkbox"
            className="h-4 w-4 rounded border-jordy-blue-600 bg-jordy-blue-900"
            {...register("allowOverlap")}
          />
          <label htmlFor="allowOverlapService" className="text-jordy-blue-700">
            Permitir más de un turno a la vez para este servicio
          </label>
        </div>

        {allowOverlap && (
          <div className="mt-2 space-y-1 flex justify-between items-center gap-2">
            <label className="font-bold text-jordy-blue-800">Máx. turnos simultáneos</label>
            <input
              type="number"
              min={1}
              className="w-1/2 rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
              {...register("maxConcurrentAppointments", {
                valueAsNumber: true,
                required: "Indicá el máximo de turnos simultáneos",
                min: { value: 1, message: "Debe ser al menos 1" },
              })}
            />
          </div>
        )}

        {errors.maxConcurrentAppointments && (
          <p className="text-[11px] text-red-400 mt-1">{errors.maxConcurrentAppointments.message}</p>
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
