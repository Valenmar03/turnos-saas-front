import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { ProfessionalFormValues, Service } from "../../types";

type BasicFieldsFormProps = {
  register: UseFormRegister<ProfessionalFormValues>;
  errors: FieldErrors<ProfessionalFormValues>;
  servicesOptions: Service[];
  selectedServices: string[];
  toggleService: (id: string) => void;

  // ✅ agregar esto
  watch: UseFormWatch<ProfessionalFormValues>;
  setValue: UseFormSetValue<ProfessionalFormValues>;
};

export default function BasicFieldsForm({
  register,
  errors,
  servicesOptions,
  selectedServices,
  toggleService,
  watch,
  setValue,
}: BasicFieldsFormProps) {
  const color = watch("color") || "#ffffff";

  return (
    <>
      <div className="space-y-1">
        <label className="text-lg font-bold text-jordy-blue-800">Nombre</label>
        <input
          type="text"
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
          {...register("user.name", {
            required: "El nombre es obligatorio",
            minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
          })}
        />
        {errors.user?.name && (
          <p className="text-[11px] text-red-400 mt-1">{errors.user.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-lg font-bold text-jordy-blue-800">Email</label>
          <input
            type="email"
            className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
            {...register("user.email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email inválido",
              },
            })}
          />
          {errors.user?.email && (
            <p className="text-[11px] text-red-400 mt-1">
              {errors.user.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-lg font-bold text-jordy-blue-800">
            Telefono
          </label>
          <input
            type="text"
            className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
            {...register("user.phone", {
              required: "El telefono es obligatorio",
              minLength: { value: 6, message: "Demasiado corto" },
            })}
          />
          {errors.user?.phone && (
            <p className="text-[11px] text-red-400 mt-1">
              {errors.user.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-lg font-bold text-jordy-blue-800">
          Servicios que atiende
        </label>
        {servicesOptions.length === 0 ? (
          <p className="text-xs text-slate-400">
            No hay servicios cargados. Creá al menos uno primero.
          </p>
        ) : (
          <div className="max-h-40 overflow-y-auto rounded-lg border border-jordy-blue-200 bg-jordy-blue-200 px-3 py-2 space-y-1">
            {servicesOptions.map((s) => (
              <label
                key={s._id}
                className="flex items-center gap-2 text-sm text-jordy-blue-900"
              >
                <input
                  type="checkbox"
                  className="h-3 w-3 rounded border-slate-600 bg-jordy-blue-200"
                  checked={selectedServices.includes(s._id)}
                  onChange={() => toggleService(s._id)}
                />
                <span>
                  {s.name}{" "}
                  <span className="text-[12px] text-jordy-blue-600">
                    ({s.durationMinutes} min)
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
        {errors.root?.services && (
          <p className="text-[11px] text-red-400 mt-1">
            {errors.root.services.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
        <div className="flex items-center gap-2">
          <input
            id="allowOverlapProf"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-600 bg-slate-900"
            {...register("allowOverlap")}
          />
          <label
            htmlFor="allowOverlapProf"
            className="text-sm font-bold text-jordy-blue-800"
          >
            Permitir turnos solapados
          </label>
        </div>

        <div className="space-y-1">
          <label className="text-lg font-bold text-jordy-blue-800">
            Color (agenda)
          </label>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) =>
                setValue("color", e.target.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className="h-8 w-8 rounded-md border border-jordy-blue-200 bg-jordy-blue-200"
            />

            <input
              type="text"
              value={color}
              {...register("color")}
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
        </div>
      </div>
    </>
  );
}
