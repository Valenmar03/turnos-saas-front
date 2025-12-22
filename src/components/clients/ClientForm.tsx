import { useForm } from "react-hook-form";
import type { Client, ClientFormValues, ClientPayload } from "../../types";

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: ClientPayload) => void | Promise<void>;
  loading?: boolean;
}



export function ClientForm({ initialData, onSubmit, loading }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ClientFormValues>({
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? ""
    }
  });

  const onValidSubmit = async (values: ClientFormValues) => {
    const payload: ClientPayload = {
      name: values.name.trim(),
      email: values.email?.trim() || undefined,
      phone: values.phone?.trim() || undefined
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
              message: "Debe tener al menos 2 caracteres"
            }
          })}
        />
        {errors.name && (
          <p className="text-[11px] text-red-400 mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xl font-bold text-jordy-blue-800">
          Email (opcional)
        </label>
        <input
          type="email"
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
          {...register("email", {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email inválido"
            }
          })}
        />
        {errors.email && (
          <p className="text-[11px] text-red-400 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xl font-bold text-jordy-blue-800">
          Teléfono (opcional)
        </label>
        <input
          type="text"
          className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
          {...register("phone", {
            minLength: {
              value: 6,
              message: "Demasiado corto"
            }
          })}
        />
        {errors.phone && (
          <p className="text-[11px] text-red-400 mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg text-jordy-blue-200 text-lg bg-jordy-blue-600 hover:bg-jordy-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium py-2.5 mt-2 duration-200"
      >
        {loading ? "Guardando..." : "Guardar cliente"}
      </button>
    </form>
  );
}
