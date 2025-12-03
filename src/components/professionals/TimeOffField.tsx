import type { FieldErrors } from "react-hook-form";
import type { ProfessionalFormValues, TimeOff } from "../../types";
import { toLocalInput } from "../../utils/dates";

type TimeOffFieldProps = {
    addTimeOff: () => void
    errors: FieldErrors<ProfessionalFormValues>
    timeOff: TimeOff[]
    updateTimeOff: (index: number, patch: Partial<TimeOff>) => void
    removeTimeOff: (index: number) => void
}

export default function TimeOffField({addTimeOff, errors, timeOff, updateTimeOff, removeTimeOff} :TimeOffFieldProps) {
  return (
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

          {errors.root?.timeoff && (
            <p className="text-[11px] text-red-400 mt-1">
              {errors.root.timeoff.message}
            </p>
          )}
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
  )
}
