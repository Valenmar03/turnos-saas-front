import { useForm } from "react-hook-form";
import type { Client, ClientPayload } from "../../hooks/useClients";

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: ClientPayload) => void | Promise<void>;
  loading?: boolean;
}

type ClientFormValues = {
  name: string;
  email?: string;
  phone?: string;
};

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
      {/* Nombre */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">Nombre</label>
        <input
          type="text"
          className="w-full rounded-lg bg-slate-900 border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border-slate-700"
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

      {/* Email */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Email (opcional)
        </label>
        <input
          type="email"
          className="w-full rounded-lg bg-slate-900 border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border-slate-700"
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

      {/* Teléfono */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Teléfono (opcional)
        </label>
        <input
          type="text"
          className="w-full rounded-lg bg-slate-900 border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border-slate-700"
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
        className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium py-2.5 mt-2"
      >
        {loading ? "Guardando..." : "Guardar cliente"}
      </button>
    </form>
  );
}
