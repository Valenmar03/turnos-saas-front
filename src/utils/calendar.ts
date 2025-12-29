import type { DayKey, OpeningHours } from "../types";

export const defaultOpeningHours: OpeningHours = {
  mon: { enabled: true, startTime: "09:00", endTime: "20:00" },
  tue: { enabled: true, startTime: "09:00", endTime: "20:00" },
  wed: { enabled: true, startTime: "09:00", endTime: "20:00" },
  thu: { enabled: true, startTime: "09:00", endTime: "20:00" },
  fri: { enabled: true, startTime: "09:00", endTime: "20:00" },
  sat: { enabled: true, startTime: "10:00", endTime: "14:00" },
  sun: { enabled: false, startTime: "09:00", endTime: "20:00" }
};


export const normalizeOpeningHours = (
  raw: Partial<OpeningHours> | undefined | null
): OpeningHours => {
  const base: OpeningHours = JSON.parse(
    JSON.stringify(defaultOpeningHours)
  );

  if (!raw || typeof raw !== "object") return base;

  (Object.keys(base) as DayKey[]).forEach((k) => {
    const day = raw[k];

    if (!day) return;

    base[k] = {
      enabled:
        typeof day.enabled === "boolean"
          ? day.enabled
          : base[k].enabled,
      startTime:
        typeof day.startTime === "string"
          ? day.startTime
          : base[k].startTime,
      endTime:
        typeof day.endTime === "string"
          ? day.endTime
          : base[k].endTime
    };
  });

  return base;
};
