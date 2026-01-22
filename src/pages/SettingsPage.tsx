import { useEffect, useMemo, useState } from "react";
import { Settings, Clock, Store } from "lucide-react";
import toast from "react-hot-toast";
import { useBusinesses } from "../hooks/useBusinesses";
import type { DayKey, OpeningHours } from "../types";

const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Lunes" },
  { key: "tue", label: "Martes" },
  { key: "wed", label: "Miércoles" },
  { key: "thu", label: "Jueves" },
  { key: "fri", label: "Viernes" },
  { key: "sat", label: "Sábado" },
  { key: "sun", label: "Domingo" }
];

const defaultOpeningHours: OpeningHours = {
  mon: { enabled: true, ranges: [{ startTime: "08:00", endTime: "13:00" }, { startTime: "14:00", endTime: "19:00" }] },
  tue: { enabled: true, ranges: [{ startTime: "08:00", endTime: "13:00" }, { startTime: "14:00", endTime: "19:00" }] },
  wed: { enabled: true, ranges: [{ startTime: "08:00", endTime: "13:00" }, { startTime: "14:00", endTime: "19:00" }] },
  thu: { enabled: true, ranges: [{ startTime: "08:00", endTime: "13:00" }, { startTime: "14:00", endTime: "19:00" }] },
  fri: { enabled: true, ranges: [{ startTime: "08:00", endTime: "13:00" }, { startTime: "14:00", endTime: "19:00" }] },
  sat: { enabled: true, ranges: [{ startTime: "10:00", endTime: "14:00" }] },
  sun: { enabled: false, ranges: [] }
};


const normalizeOpeningHours = (raw: any): OpeningHours => {
  const base: OpeningHours = JSON.parse(JSON.stringify(defaultOpeningHours));

  if (!raw || typeof raw !== "object") return base;

  (Object.keys(base) as DayKey[]).forEach((k) => {
    const d = raw[k];
    if (!d) return;

    // ✅ si ya viene nuevo formato
    if (Array.isArray(d.ranges)) {
      base[k] = {
        enabled: typeof d.enabled === "boolean" ? d.enabled : base[k].enabled,
        ranges: d.ranges.length
          ? d.ranges.map((r: any) => ({
              startTime: r.startTime ?? "08:00",
              endTime: r.endTime ?? "13:00"
            }))
          : []
      };
      return;
    }
    base[k] = {
      enabled: typeof d.enabled === "boolean" ? d.enabled : base[k].enabled,
      ranges: d.startTime && d.endTime ? [{ startTime: d.startTime, endTime: d.endTime }] : base[k].ranges
    };
  });

  return base;
};


function Toggle({
  checked,
  onChange,
  disabled
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      aria-pressed={checked}
      aria-disabled={disabled ? "true" : "false"}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full transition",
        disabled
          ? "bg-jordy-blue-200 opacity-60 cursor-not-allowed"
          : checked
          ? "bg-jordy-blue-700"
          : "bg-jordy-blue-300"
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition",
          checked ? "translate-x-6" : "translate-x-1"
        ].join(" ")}
      />
    </button>
  );
}

type BusinessForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  timezone: string;
  isActive: boolean;
  appointmentIntervalMin: number;
};

export default function SettingsPage() {
  const { myBusinessQuery, updateBusinessMutation } = useBusinesses();

  const businessId = myBusinessQuery.data?._id as string | undefined;
  const businessQuery = myBusinessQuery;


  const [businessForm, setBusinessForm] = useState<BusinessForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    timezone: "America/Argentina/Buenos_Aires",
    isActive: true,
    appointmentIntervalMin: 30
  });

  const [openingHours, setOpeningHours] = useState<OpeningHours>(defaultOpeningHours);

  useEffect(() => {
    const b = businessQuery.data;
    if (!b) return;

    setBusinessForm({
      name: b.name ?? "",
      email: b.email ?? "",
      phone: b.phone ?? "",
      address: b.address ?? "",
      timezone: b.timezone ?? "America/Argentina/Buenos_Aires",
      isActive: Boolean(b.isActive),
      appointmentIntervalMin: Number(b.appointmentIntervalMin ?? 30)
    });

    setOpeningHours(normalizeOpeningHours(b.openingHours));
  }, [businessQuery.data]);

  const enabledDaysCount = useMemo(() => {
    return Object.values(openingHours).filter((d) => d.enabled).length;
  }, [openingHours]);

  const toggleDay = (day: DayKey) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const setRangeTime = (
    day: DayKey,
    rangeIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setOpeningHours((prev) => {
      const next: OpeningHours = JSON.parse(JSON.stringify(prev));

      // si no existe ese rango, lo creamos
      if (!next[day].ranges[rangeIndex]) {
        next[day].ranges[rangeIndex] = { startTime: "08:00", endTime: "13:00" };
      }

      next[day].ranges[rangeIndex][field] = value;
      return next;
    });
  };

  const toggleLunch = (day: DayKey, withLunch: boolean) => {
    setOpeningHours((prev) => {
      const next: OpeningHours = JSON.parse(JSON.stringify(prev));
      const current = next[day];

      if (!withLunch) {
        // ✅ pasar a 1 tramo
        if (current.ranges.length >= 2) {
          const r0 = current.ranges[0];
          const r1 = current.ranges[1];

          // une: start del primero + end del segundo
          current.ranges = [{ startTime: r0.startTime, endTime: r1.endTime }];
        } else if (current.ranges.length === 0) {
          current.ranges = [{ startTime: "08:00", endTime: "19:00" }];
        }
      } else {
        // ✅ pasar a 2 tramos (con default 08-13 / 14-19)
        if (current.ranges.length === 0) {
          current.ranges = [
            { startTime: "08:00", endTime: "13:00" },
            { startTime: "14:00", endTime: "19:00" }
          ];
        } else if (current.ranges.length === 1) {
          const r = current.ranges[0];
          current.ranges = [
            { startTime: r.startTime ?? "08:00", endTime: "13:00" },
            { startTime: "14:00", endTime: r.endTime ?? "19:00" }
          ];
        }
        // si ya tiene 2+, no hacemos nada
      }

      return next;
    });
  };



  const handleSave = () => {
    if (!businessId) {
      toast.error("No hay negocio para guardar.");
      return;
    }

    const payload = {
      ...businessForm,
      openingHours
    };

    updateBusinessMutation.mutate({ id: businessId, data: payload });
  };

  const isLoading = businessQuery.isLoading;
  const isSaving = updateBusinessMutation.isPending;

  if (isLoading) {
    return <div className="p-6 text-jordy-blue-700">Cargando configuración…</div>;
  }

  if (businessQuery.isError) {
    return (
      <div className="p-6 text-red-600">
        Error al cargar el negocio. Revisá la API / permisos.
      </div>
    );
}


  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-jordy-blue-700" />
        <div>
          <h1 className="text-2xl font-semibold text-jordy-blue-900">Administración</h1>
          <p className="text-sm text-jordy-blue-600">Configuración general del negocio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INFO NEGOCIO */}
        <div className="rounded-xl bg-jordy-blue-100 border border-jordy-blue-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 text-jordy-blue-700" />
            <div>
              <h2 className="text-lg font-semibold text-jordy-blue-900">Información del negocio</h2>
              <p className="text-sm text-jordy-blue-600">Datos básicos de tu estética</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                Nombre del negocio
              </label>
              <input
                value={businessForm.name}
                onChange={(e) => setBusinessForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-jordy-blue-300 bg-white px-3 py-2 text-sm"
                placeholder="Estética Belleza Natural"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                Dirección
              </label>
              <input
                value={businessForm.address}
                onChange={(e) => setBusinessForm((p) => ({ ...p, address: e.target.value }))}
                className="w-full rounded-lg border border-jordy-blue-300 bg-white px-3 py-2 text-sm"
                placeholder="Calle Mayor 25"
              />
            </div>

            {/* Teléfono + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                  Teléfono
                </label>
                <input
                  value={businessForm.phone}
                  onChange={(e) => setBusinessForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full rounded-lg border border-jordy-blue-300 bg-white px-3 py-2 text-sm"
                  placeholder="+54 11 1234 5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                  Email
                </label>
                <input
                  value={businessForm.email}
                  onChange={(e) => setBusinessForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-lg border border-jordy-blue-300 bg-white px-3 py-2 text-sm"
                  placeholder="info@negocio.com"
                />
              </div>
            </div>

            {/* Timezone + Activo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                  Zona horaria
                </label>
                <select
                  value={businessForm.timezone}
                  onChange={(e) => setBusinessForm((p) => ({ ...p, timezone: e.target.value }))}
                  className="w-full rounded-lg border border-jordy-blue-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="America/Argentina/Buenos_Aires">Argentina (Buenos Aires)</option>
                  <option value="America/Santiago">Chile (Santiago)</option>
                  <option value="America/Montevideo">Uruguay (Montevideo)</option>
                  <option value="America/Sao_Paulo">Brasil (São Paulo)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                  Negocio activo
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-jordy-blue-300 bg-white px-3 py-2">
                  <Toggle
                    checked={businessForm.isActive}
                    onChange={(next) => setBusinessForm((p) => ({ ...p, isActive: next }))}
                  />
                  <span className="text-sm text-jordy-blue-800">
                    {businessForm.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>

            {/* Intervalo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                  Intervalo de citas (min)
                </label>
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={businessForm.appointmentIntervalMin}
                  onChange={(e) =>
                    setBusinessForm((p) => ({
                      ...p,
                      appointmentIntervalMin: Number(e.target.value || 0)
                    }))
                  }
                  className="w-full rounded-lg border border-jordy-blue-300 bg-white px-3 py-2 text-sm"
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* HORARIO DE APERTURA */}
        <div className="rounded-xl bg-jordy-blue-100 border border-jordy-blue-200 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-jordy-blue-700" />
              <div>
                <h2 className="text-lg font-semibold text-jordy-blue-900">Horario de apertura</h2>
                <p className="text-sm text-jordy-blue-600">
                  Días habilitados: <span className="font-semibold">{enabledDaysCount}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {DAYS.map(({ key, label }) => {
              const day = openingHours[key];
              const hasLunch = day.ranges.length >= 2;

              return (
                <div key={key} className="rounded-lg bg-white border border-jordy-blue-200 px-4 py-3">
                  <div className="flex flex-col items-start xl:flex-row xl:items-center gap-3">
                    <div className="flex justify-between w-full">
                      <span className="font-medium text-jordy-blue-900">{label}</span>
                      <div className="flex justify-center">
                        <Toggle checked={day.enabled} onChange={() => toggleDay(key)} />
                      </div>
                    </div>

                    {/* Rangos */}
                    <div className="w-full space-y-2">
                      {/* Rango 1 */}
                      <div className="flex items-center justify-around w-full gap-5">
                        <input
                          type="time"
                          value={day.enabled && day.ranges[0] ? day.ranges[0].startTime : ""}
                          onChange={(e) => setRangeTime(key, 0, "startTime", e.target.value)}
                          className={`w-[110px] rounded-md border border-jordy-blue-300 px-2 py-1 text-sm
                            ${!day.enabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                          disabled={!day.enabled}
                        />
                        <span className="text-jordy-blue-600 text-center">-</span>
                        <input
                          type="time"
                          value={day.enabled && day.ranges[0] ? day.ranges[0].endTime : ""}
                          onChange={(e) => setRangeTime(key, 0, "endTime", e.target.value)}
                          className={`w-[110px] rounded-md border border-jordy-blue-300 px-2 py-1 text-sm
                            ${!day.enabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                          disabled={!day.enabled}
                        />
                      </div>

                      {/* Toggle almuerzo */}
                      <div className="mt-2 flex items-center justify-between rounded-md bg-jordy-blue-50 border border-jordy-blue-200 px-3 py-2">
                        <span className="text-sm text-jordy-blue-800">Pausa de almuerzo</span>
                        <Toggle
                          checked={hasLunch}
                          onChange={(next) => toggleLunch(key, next)}
                          disabled={!day.enabled}
                        />
                      </div>

                      {/* Rango 2 (almuerzo) */}
                      {hasLunch && (
                        <div className="flex items-center justify-around w-full gap-5">
                          <input
                            type="time"
                            value={day.enabled ? day.ranges[1].startTime : ""}
                            onChange={(e) => setRangeTime(key, 1, "startTime", e.target.value)}
                            className={`w-[110px] rounded-md border border-jordy-blue-300 px-2 py-1 text-sm
                              ${!day.enabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                            disabled={!day.enabled}
                          />

                          <span className="text-jordy-blue-600 text-center">-</span>

                          <input
                            type="time"
                            value={day.enabled ? day.ranges[1].endTime : ""}
                            onChange={(e) => setRangeTime(key, 1, "endTime", e.target.value)}
                            className={`w-[110px] rounded-md border border-jordy-blue-300 px-2 py-1 text-sm
                              ${!day.enabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                            disabled={!day.enabled}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!businessId || isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-jordy-blue-700 hover:bg-jordy-blue-600 disabled:opacity-60 disabled:cursor-not-allowed px-5 py-2 text-sm font-medium text-white shadow"
        >
          {isSaving ? "Guardando..." : "Guardar configuración"}
        </button>
      </div>
    </div>
  );
}
