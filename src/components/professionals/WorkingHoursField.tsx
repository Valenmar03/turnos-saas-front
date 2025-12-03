import type { WorkingHour } from '../../types';
import { DAYS } from '../../utils/professionals';

type WorkingHoursFieldProps = {
    workingHours: WorkingHour[]
    toggleDay: (day: number, enabled: boolean) => void
    getHourForDay: (day: number, field: "startTime" | "endTime") => string
    handleChangeHour: (day: number, patch: Partial<WorkingHour>) => void
}

export default function WorkingHoursField({workingHours, toggleDay, getHourForDay, handleChangeHour} : WorkingHoursFieldProps) {
  return (
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
                      handleChangeHour(day.value, { startTime: e.target.value })
                    }
                    disabled={!enabled}
                  />
                  <span className="text-slate-400 text-[11px]">a</span>
                  <input
                    type="time"
                    className="h-8 w-24 rounded-md bg-slate-900 border border-slate-700 px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-40"
                    value={getHourForDay(day.value, "endTime")}
                    onChange={e =>
                      handleChangeHour(day.value, { endTime: e.target.value })
                    }
                    disabled={!enabled}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
  )
}
