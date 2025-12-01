import { useState, type FormEvent } from "react";
import type { Service, ServicePayload } from "../../hooks/useServices";

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: ServicePayload) => void;
  loading?: boolean;
}

export function ServiceForm({ initialData, onSubmit, loading }: ServiceFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [durationMinutes, setDurationMinutes] = useState(
    initialData?.durationMinutes?.toString() ?? "60"
  );
  const [price, setPrice] = useState(
    initialData?.price?.toString() ?? "0"
  );
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [color, setColor] = useState(initialData?.color ?? "#6366f1");
  const [allowOverlap, setAllowOverlap] = useState(
    initialData?.allowOverlap ?? false
  );
  const [maxConcurrentAppointments, setMaxConcurrentAppointments] = useState(
    (initialData?.maxConcurrentAppointments ?? 1).toString()
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description: description || undefined,
      durationMinutes: Number(durationMinutes),
      price: Number(price),
      category: category || undefined,
      color,
      allowOverlap,
      maxConcurrentAppointments: Number(maxConcurrentAppointments) || 1
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Nombre del servicio
        </label>
        <input
          type="text"
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Descripción
        </label>
        <textarea
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Duración (minutos)
          </label>
          <input
            type="number"
            min={5}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={durationMinutes}
            onChange={e => setDurationMinutes(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Precio
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Categoría
          </label>
          <input
            type="text"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="Pestañas, Uñas, Pelo..."
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Color (identificador en agenda)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="h-9 w-9 rounded-md border border-slate-700 bg-slate-900"
              value={color}
              onChange={e => setColor(e.target.value)}
            />
            <input
              type="text"
              className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={color}
              onChange={e => setColor(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 items-end">
        <div className="flex items-center gap-2">
          <input
            id="allowOverlap"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-600 bg-slate-900"
            checked={allowOverlap}
            onChange={e => setAllowOverlap(e.target.checked)}
          />
          <label
            htmlFor="allowOverlap"
            className="text-xs font-medium text-slate-300"
          >
            Permitir solapamiento
          </label>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Máx. turnos solapados
          </label>
          <input
            type="number"
            min={1}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-60"
            value={maxConcurrentAppointments}
            onChange={e => setMaxConcurrentAppointments(e.target.value)}
            disabled={!allowOverlap}
          />
        </div>
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
