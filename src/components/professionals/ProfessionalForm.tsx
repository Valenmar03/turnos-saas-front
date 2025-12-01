import { useState, type FormEvent } from "react";
import type { Professional, ProfessionalPayload, WorkingHour, TimeOff  } from "../../hooks/useProfessionals";
import type { Service } from "../../hooks/useServices";


interface ProfessionalFormProps {
  initialData?: Professional;
  servicesOptions: Service[];
  onSubmit: (data: ProfessionalPayload) => void;
  loading?: boolean;
}



export function ProfessionalForm({
  initialData,
  servicesOptions,
  onSubmit,
  loading
}: ProfessionalFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [color, setColor] = useState(initialData?.color ?? "#22c55e");
  const [allowOverlap, setAllowOverlap] = useState(initialData?.allowOverlap ?? false);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(
    initialData?.workingHours ?? []
  );
  const [timeOff, setTimeOff] = useState<TimeOff[]>(
    initialData?.timeOff ?? []
  );
const DAYS = [
{ label: "Lunes", value: 1 },
{ label: "Martes", value: 2 },
{ label: "Miércoles", value: 3 },
{ label: "Jueves", value: 4 },
{ label: "Viernes", value: 5 },
{ label: "Sábado", value: 6 },
{ label: "Domingo", value: 0 },
];


  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialData?.services?.map(s => s._id) ?? []
  );
  


const upsertWorkingHour = (day: number, patch: Partial<WorkingHour>) => {
  setWorkingHours(prev => {
    const existing = prev.find(w => w.dayOfWeek === day);
    if (!existing) {
      return [...prev, { dayOfWeek: day, startTime: "09:00", endTime: "18:00", ...patch }];
    }
    return prev.map(w =>
      w.dayOfWeek === day ? { ...existing, ...patch } : w
    );
  });
};

const toggleDay = (day: number, enabled: boolean) => {
  setWorkingHours(prev => {
    if (!enabled) {
      return prev.filter(w => w.dayOfWeek !== day);
    }
    // si lo activamos y no existía, creamos horario default
    if (!prev.some(w => w.dayOfWeek === day)) {
      return [...prev, { dayOfWeek: day, startTime: "09:00", endTime: "18:00" }];
    }
    return prev;
  });
};

const getHourForDay = (day: number, field: "startTime" | "endTime") => {
  const wh = workingHours.find(w => w.dayOfWeek === day);
  return wh ? wh[field] : "";
};


  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const addTimeOff = () => {
    const now = new Date();
    const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    setTimeOff(prev => [
      ...prev,
      {
        start: now.toISOString(),
        end: inTwoHours.toISOString(),
        reason: ""
      }
    ]);
  };

  const updateTimeOff = (index: number, patch: Partial<TimeOff>) => {
    setTimeOff(prev =>
      prev.map((t, i) => (i === index ? { ...t, ...patch } : t))
    );
  };

  const removeTimeOff = (index: number) => {
    setTimeOff(prev => prev.filter((_, i) => i !== index));
  };

  // helper para datetime-local
  const toLocalInput = (iso: string | undefined) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email: email || undefined,
      phone: phone || undefined,
      color,
      services: selectedServices,
      allowOverlap,
      workingHours: workingHours.filter(w => w.startTime && w.endTime),
      timeOff: timeOff.filter(t => t.start && t.end)
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">Nombre</label>
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
          Servicios que atiende
        </label>
        {servicesOptions.length === 0 ? (
          <p className="text-xs text-slate-400">
            No hay servicios cargados. Creá al menos uno primero.
          </p>
        ) : (
          <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 space-y-1">
            {servicesOptions.map(s => (
              <label
                key={s._id}
                className="flex items-center gap-2 text-xs text-slate-200"
              >
                <input
                  type="checkbox"
                  className="h-3 w-3 rounded border-slate-600 bg-slate-900"
                  checked={selectedServices.includes(s._id)}
                  onChange={() => toggleService(s._id)}
                />
                <span>
                  {s.name}{" "}
                  <span className="text-[10px] text-slate-400">
                    ({s.durationMinutes} min)
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
        <div className="flex items-center gap-2">
          <input
            id="allowOverlapProf"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-600 bg-slate-900"
            checked={allowOverlap}
            onChange={e => setAllowOverlap(e.target.checked)}
          />
          <label
            htmlFor="allowOverlapProf"
            className="text-xs font-medium text-slate-300"
          >
            Permitir turnos solapados
          </label>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Color (agenda)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="h-8 w-8 rounded-md border border-slate-700 bg-slate-900"
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

      <div className="space-y-2 mt-4">
        <p className="text-xs font-medium text-slate-300">
          Horarios de trabajo
          <span className="text-[11px] text-slate-400 ml-1">
            (por día de la semana)
          </span>
        </p>
        <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          {DAYS.map(day => {
            const enabled = workingHours.some(w => w.dayOfWeek === day.value);
            return (
              <div
                key={day.value}
                className="flex justify-between items-center gap-2 text-xs"
              >
                <label className="flex items-center gap-2 text-slate-200">
                  <input
                    type="checkbox"
                    className="h-3 w-3 rounded border-slate-600 bg-slate-900"
                    checked={enabled}
                    onChange={e => toggleDay(day.value, e.target.checked)}
                  />
                  {day.label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    className="h-8 w-24 rounded-md bg-slate-900 border border-slate-700 px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-40"
                    value={getHourForDay(day.value, "startTime")}
                    onChange={e =>
                      upsertWorkingHour(day.value, { startTime: e.target.value })
                    }
                    disabled={!enabled}
                  />
                  <span className="text-slate-400 text-[11px]">a</span>
                  <input
                    type="time"
                    className="h-8 w-24 rounded-md bg-slate-900 border border-slate-700 px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-40"
                    value={getHourForDay(day.value, "endTime")}
                    onChange={e =>
                      upsertWorkingHour(day.value, { endTime: e.target.value })
                    }
                    disabled={!enabled}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-300">
            Bloqueos / vacaciones
            <span className="text-[11px] text-slate-400 ml-1">
              (no se atiende en estos rangos)
            </span>
          </p>
          <button
            type="button"
            onClick={addTimeOff}
            className="text-[11px] px-2 py-1 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            + Agregar bloqueo
          </button>
        </div>

        {timeOff.length === 0 && (
          <p className="text-[11px] text-slate-500">
            No hay bloqueos configurados para este profesional.
          </p>
        )}

        <div className="space-y-2">
          {timeOff.map((t, index) => (
            <div
              key={t._id || index}
              className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-2 items-center rounded-lg border border-slate-800 bg-slate-900/60 p-2"
            >
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Inicio</label>
                <input
                  type="datetime-local"
                  className="w-full h-8 rounded-md bg-slate-950 border border-slate-700 px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={toLocalInput(t.start)}
                  onChange={e =>
                    updateTimeOff(index, {
                      start: new Date(e.target.value).toISOString()
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Fin</label>
                <input
                  type="datetime-local"
                  className="w-full h-8 rounded-md bg-slate-950 border border-slate-700 px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={toLocalInput(t.end)}
                  onChange={e =>
                    updateTimeOff(index, {
                      end: new Date(e.target.value).toISOString()
                    })
                  }
                />
              </div>
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  placeholder="Motivo (opcional)"
                  className="w-full h-8 rounded-md bg-slate-950 border border-slate-700 px-2 text-[11px] text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={t.reason ?? ""}
                  onChange={e =>
                    updateTimeOff(index, { reason: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => removeTimeOff(index)}
                  className="text-[11px] text-red-400 hover:text-red-300 px-2"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium py-2.5 mt-2"
      >
        {loading ? "Guardando..." : "Guardar profesional"}
      </button>
    </form>
  );
}
