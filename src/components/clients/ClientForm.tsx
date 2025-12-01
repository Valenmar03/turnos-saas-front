import { useState, type FormEvent } from "react";
import type { Client, ClientPayload } from "../../hooks/useClients";

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: ClientPayload) => void;
  loading?: boolean;
}

export function ClientForm({ initialData, onSubmit, loading }: ClientFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email: email || undefined,
      phone: phone || undefined,
      notes: notes || undefined
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Nombre y apellido
        </label>
        <input
          type="text"
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Email</label>
          <input
            type="email"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Teléfono</label>
          <input
            type="text"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Notas (preferencias, recordatorios, etc.)
        </label>
        <textarea
          rows={3}
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
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
