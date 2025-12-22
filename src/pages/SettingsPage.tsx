import { useMemo, useState } from "react";
import { Settings, Clock, Store } from "lucide-react";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

type DaySchedule = {
  enabled: boolean;
  startTime: string; // "09:00"
  endTime: string;   // "20:00"
};

type OpeningHoursState = Record<DayKey, DaySchedule>;

const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Lunes" },
  { key: "tue", label: "Martes" },
  { key: "wed", label: "Miércoles" },
  { key: "thu", label: "Jueves" },
  { key: "fri", label: "Viernes" },
  { key: "sat", label: "Sábado" },
  { key: "sun", label: "Domingo" }
];

const defaultOpeningHours: OpeningHoursState = {
  mon: { enabled: true, startTime: "09:00", endTime: "20:00" },
  tue: { enabled: true, startTime: "09:00", endTime: "20:00" },
  wed: { enabled: true, startTime: "09:00", endTime: "20:00" },
  thu: { enabled: true, startTime: "09:00", endTime: "20:00" },
  fri: { enabled: true, startTime: "09:00", endTime: "20:00" },
  sat: { enabled: true, startTime: "10:00", endTime: "14:00" },
  sun: { enabled: false, startTime: "09:00", endTime: "20:00" }
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

export default function SettingsPage() {
  const [openingHours, setOpeningHours] = useState<OpeningHoursState>(
    defaultOpeningHours
  );

  const enabledDaysCount = useMemo(() => {
    return Object.values(openingHours).filter(d => d.enabled).length;
  }, [openingHours]);

  const toggleDay = (day: DayKey) => {
    setOpeningHours(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const setTime = (day: DayKey, field: "startTime" | "endTime", value: string) => {
    setOpeningHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };


  const handleSave = () => {
    // Acá lo mandás al backend.
    // console.log(openingHours);
    alert("Configuración lista para guardar (mirá el state openingHours).");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-jordy-blue-200">
          <Settings className="w-6 h-6 text-jordy-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-jordy-blue-900">
            Administración
          </h1>
          <p className="text-sm text-jordy-blue-600">
            Configuración general del negocio
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INFO NEGOCIO */}
        <div className="rounded-xl bg-jordy-blue-100 border border-jordy-blue-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 text-jordy-blue-700" />
            <div>
              <h2 className="text-lg font-semibold text-jordy-blue-900">
                Información del negocio
              </h2>
              <p className="text-sm text-jordy-blue-600">
                Datos básicos de tu estética
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                Nombre del negocio
              </label>
              <input
                className="w-full rounded-lg border border-jordy-blue-300 bg-white px-3 py-2 text-sm"
                placeholder="Estética Belleza Natural"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                Dirección
              </label>
              <input
                className="w-full rounded-lg border border-jordy-blue-300 bg-white px-3 py-2 text-sm"
                placeholder="Calle Mayor 25"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                  Teléfono
                </label>
                <input
                  className="w-full rounded-lg border border-jordy-blue-300 bg-white px-3 py-2 text-sm"
                  placeholder="+54 11 1234 5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                  Email
                </label>
                <input
                  className="w-full rounded-lg border border-jordy-blue-300 bg-white px-3 py-2 text-sm"
                  placeholder="info@negocio.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-jordy-blue-800 mb-1">
                  Intervalo de citas (min)
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-jordy-blue-300 bg-white px-3 py-2 text-sm"
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-jordy-blue-100 border border-jordy-blue-200 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-jordy-blue-700" />
              <div>
                <h2 className="text-lg font-semibold text-jordy-blue-900">
                  Horario de apertura
                </h2>
                <p className="text-sm text-jordy-blue-600">
                  Días habilitados: <span className="font-semibold">{enabledDaysCount}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {DAYS.map(({ key, label }) => {
              const day = openingHours[key];

              return (
                <div
                  key={key}
                  className="rounded-lg bg-white border border-jordy-blue-200 px-4 py-3"
                >
                  {/* Grid fija para alinear todo */}
                  <div className="grid grid-cols-[120px_48px_110px_16px_110px] items-center gap-3">
                    {/* Día */}
                    <span className="font-medium text-jordy-blue-900">
                      {label}
                    </span>

                    {/* Toggle centrado y con ancho fijo */}
                    <div className="flex justify-center">
                      <Toggle
                        checked={day.enabled}
                        onChange={() => toggleDay(key)}
                      />
                    </div>

                    {/* Start */}
                    <input
                      type="time"
                      value={day.enabled ? day.startTime : ""}
                      onChange={e => setTime(key, "startTime", e.target.value)}
                      className={`w-[110px] rounded-md border border-jordy-blue-300 px-2 py-1 text-sm
                        ${!day.enabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                      disabled={!day.enabled}
                    />

                    {/* Separador centrado */}
                    <span className="text-jordy-blue-600 text-center">-</span>

                    {/* End (✅ acá iba endTime) */}
                    <input
                      type="time"
                      value={day.enabled ? day.endTime : ""}
                      onChange={e => setTime(key, "endTime", e.target.value)}
                      className={`w-[110px] rounded-md border border-jordy-blue-300 px-2 py-1 text-sm
                        ${!day.enabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                      disabled={!day.enabled}
                    />
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
          className="inline-flex items-center gap-2 rounded-lg bg-jordy-blue-700 hover:bg-jordy-blue-600 px-5 py-2 text-sm font-medium text-white shadow"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  );
}
