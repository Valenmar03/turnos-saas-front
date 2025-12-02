import type { WorkingHour } from "../types";


export const DAYS = [
{ label: "Lunes", value: 1 },
{ label: "Martes", value: 2 },
{ label: "Miércoles", value: 3 },
{ label: "Jueves", value: 4 },
{ label: "Viernes", value: 5 },
{ label: "Sábado", value: 6 },
{ label: "Domingo", value: 0 },
];

export function upsertWorkingHourInList(
  list: WorkingHour[],
  day: number,
  patch: Partial<WorkingHour>
): WorkingHour[] {
  const existing = list.find(w => w.dayOfWeek === day);

  if (!existing) {
    return [
      ...list,
      {
        dayOfWeek: day,
        startTime: patch.startTime ?? "09:00",
        endTime: patch.endTime ?? "18:00",
      },
    ];
  }

  return list.map(w =>
    w.dayOfWeek === day ? { ...existing, ...patch } : w
  );
}