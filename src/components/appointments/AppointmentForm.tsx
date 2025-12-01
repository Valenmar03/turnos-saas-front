import { type FormEvent, useState, useEffect } from "react";
import type { AppointmentPayload } from "../../hooks/useAppointments";
import type { Service } from "../../hooks/useServices";
import type { Professional } from "../../hooks/useProfessionals";
import type { Client } from "../../hooks/useClients";

interface AppointmentFormProps {
  services: Service[];
  professionals: Professional[];
  clients: Client[];
  onSubmit: (data: AppointmentPayload) => void;
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
  const [serviceId, setServiceId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [clientId, setClientId] = useState("");
  const [startLocal, setStartLocal] = useState(initialStartLocal ?? ""); // datetime-local
  const [notes, setNotes] = useState(""); 

  useEffect(() => {
    if (initialStartLocal) {
      setStartLocal(initialStartLocal);
    }
  }, [initialStartLocal]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!serviceId || !professionalId || !clientId || !startLocal) return;

    const startISO = new Date(startLocal).toISOString();

    onSubmit({
      service: serviceId,
      professional: professionalId,
      client: clientId,
      start: startISO,
      notes: notes || undefined
      // end lo puede calcular el back con duration del service si querés
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">Cliente</label>
        <select
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={clientId}
          onChange={e => setClientId(e.target.value)}
          required
        >
          <option value="">Seleccionar cliente...</option>
          {clients.map(c => (
            <option key={c._id} value={c._id}>
              {c.name} {c.phone ? `· ${c.phone}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Profesional</label>
          <select
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={professionalId}
            onChange={e => setProfessionalId(e.target.value)}
            required
          >
            <option value="">Seleccionar profesional...</option>
            {professionals.map(p => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Servicio</label>
          <select
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={serviceId}
            onChange={e => setServiceId(e.target.value)}
            required
          >
            <option value="">Seleccionar servicio...</option>
            {services.map(s => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.durationMinutes} min)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Fecha y hora de inicio
        </label>
        <input
          type="datetime-local"
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={startLocal}
          onChange={e => setStartLocal(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">Notas</label>
        <textarea
          rows={2}
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Ej: prefiere tal profesional, recordarle tal cosa..."
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
