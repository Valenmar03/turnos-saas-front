import type { DayKey, OpeningHours, TimeRange } from "../types";

export const defaultOpeningHours: OpeningHours = {
  mon: { enabled: true, ranges: [{ startTime: "09:00", endTime: "20:00" }] },
  tue: { enabled: true, ranges: [{ startTime: "09:00", endTime: "20:00" }] },
  wed: { enabled: true, ranges: [{ startTime: "09:00", endTime: "20:00" }] },
  thu: { enabled: true, ranges: [{ startTime: "09:00", endTime: "20:00" }] },
  fri: { enabled: true, ranges: [{ startTime: "09:00", endTime: "20:00" }] },
  sat: { enabled: true, ranges: [{ startTime: "10:00", endTime: "14:00" }] },
  sun: { enabled: false, ranges: [] }
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

      ranges:
        Array.isArray(day.ranges) && day.ranges.length > 0
          ? day.ranges.filter(
              (r): r is TimeRange =>
                typeof r?.startTime === "string" &&
                typeof r?.endTime === "string"
            )
          : base[k].ranges
    };
  });

  return base;
};

export const DAYKEY_TO_FC: Record<DayKey, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

export const isValidTime = (t?: string) =>
  !!t && /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(t);



export const resolveName = (obj: any) => {
    if (!obj) return "-";
    if (typeof obj === "string") return obj;
    return obj.name || obj.email || obj._id;
  };

export   const resolveServiceName = (obj: any) => {
    if (!obj) return "-";
    if (typeof obj === "string") return obj;
    return obj.name || obj._id;
  };