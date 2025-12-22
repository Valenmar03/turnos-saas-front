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
        <p className="text-lg font-bold text-jordy-blue-800">
          Horarios de trabajo {" "}
          <span className="text-sm text-jordy-blue-600">
            (por día de la semana)
          </span>
        </p>
        <div className="space-y-1 rounded-lg border border-jordy-blue-200 bg-jordy-blue-200 p-3">
          {DAYS.map(day => {
            const enabled = workingHours.some(w => w.dayOfWeek === day.value);
            return (
              <div
                key={day.value}
                className="flex justify-between items-center gap-2 text-xs"
              >
                <label className="flex items-center gap-2 text-jordy-blue-900">
                  <input
                    type="checkbox"
                    className="h-3 w-3 rounded border-jordy-blue-600 bg-jordy-blue-900"
                    checked={enabled}
                    onChange={e => toggleDay(day.value, e.target.checked)}
                  />
                  {day.label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    className="h-8 w-24 rounded-md bg-jordy-blue-200 border border-jordy-blue-400 px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
                    value={getHourForDay(day.value, "startTime")}
                    onChange={e =>
                      handleChangeHour(day.value, { startTime: e.target.value })
                    }
                    disabled={!enabled}
                  />
                  <span className="text-slate-400 text-[11px]">a</span>
                  <input
                    type="time"
                    className="h-8 w-24 rounded-md bg-jordy-blue-200 border border-jordy-blue-400 px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-jordy-blue-500 disabled:opacity-40"
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
