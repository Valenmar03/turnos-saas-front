import type { FieldErrors } from "react-hook-form";
import type { ProfessionalFormValues, TimeOff } from "../../types";
import { toLocalInput } from "../../utils/dates";
import { X } from "lucide-react";

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
          <div>
            <p className="text-lg font-bold text-jordy-blue-800">
              Bloqueos / vacaciones
            </p>
            <span className="text-xs text-jordy-blue-600">
              (no se atiende en estos rangos)
            </span>
          </div>
          <button
            type="button"
            onClick={addTimeOff}
            className="px-2 py-1 rounded-md border bg-jordy-blue-200 border-jordy-blue-200 text-jordy-blue-900 hover:border-jordy-blue-500 duration-300"
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
          <p className="text-sm text-jordy-blue-800">
            No hay bloqueos configurados para este profesional.
          </p>
        )}

        <div className="space-y-2">
          {timeOff.map((t, index) => (
            <div
              key={t._id || index}
              className="flex flex-col gap-2 rounded-lg border border-jordy-blue-200 bg-jordy-blue-200 p-2"
            >
              <div className="space-y-1">
                <label className=" text-jordy-blue-800">Inicio</label>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
                  value={toLocalInput(t.start)}
                  onChange={e =>
                    updateTimeOff(index, {
                      start: new Date(e.target.value).toISOString()
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className=" text-jordy-blue-800">Fin</label>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
                  value={toLocalInput(t.end)}
                  onChange={e =>
                    updateTimeOff(index, {
                      end: new Date(e.target.value).toISOString()
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className=" text-jordy-blue-800">Motivo</label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Motivo (opcional)"
                    className="w-full rounded-lg bg-jordy-blue-200 border border-jordy-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jordy-blue-500"
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
                    <X/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}
