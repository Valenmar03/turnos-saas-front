import { useState, useMemo } from "react";
import { CalendarDays, Plus, X } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core";
import esLocale from "@fullcalendar/core/locales/es";

import { useAppointments } from "../hooks/useAppointments";
import { useServices } from "../hooks/useServices";
import { useProfessionals } from "../hooks/useProfessionals";
import { useClients } from "../hooks/useClients";
import { AppointmentForm } from "../components/appointments/AppointmentForm";
import { toLocalInputValue } from "../utils/dates";

export default function CalendarPage() {
  const {
    appointmentsQuery,
    createAppointmentMutation,
    cancelAppointmentMutation,
    deleteAppointmentMutation
  } = useAppointments();
  const { servicesQuery } = useServices();
  const { professionalsQuery } = useProfessionals();
  const { clientsQuery } = useClients();

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedStartLocal, setSelectedStartLocal] = useState<string | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | "all">("all");

  const { data: appointments, isLoading, error } = appointmentsQuery;
  const { data: services = [] } = servicesQuery;
  const { data: professionals = [] } = professionalsQuery;
  const { data: clients = [] } = clientsQuery;


  const selectedProfessional =
  selectedProfessionalId === "all"
    ? null
    : professionals?.find(p => p._id === selectedProfessionalId) ?? null;

  const resolveName = (obj: any) => {
    if (!obj) return "-";
    if (typeof obj === "string") return obj;
    return obj.name || obj.email || obj._id;
  };

  const resolveServiceName = (obj: any) => {
    if (!obj) return "-";
    if (typeof obj === "string") return obj;
    return obj.name || obj._id;
  };


  const events = useMemo(
    () =>
      (appointments ?? [])
        .filter(app =>
          selectedProfessional
            ? app.professional && (app.professional as any)._id === selectedProfessional._id ||
              app.professional === selectedProfessional._id
            : true
        )
        .map(app => {
          const serviceName = resolveServiceName(app.service);
          const clientName = resolveName(app.client);
          const professionalName = resolveName(app.professional);
          const serviceColor = (app.service as any)?.color;
          const professionalColor = (app.professional as any)?.color;

          return {
            id: app._id,
            title: `${serviceName} · ${clientName} (${professionalName})`,
            start: app.start,
            end: app.end,
            backgroundColor: serviceColor || professionalColor || "#6366f1",
            borderColor: serviceColor || professionalColor || "#4f46e5",
            textColor: "#f9fafb",
            extendedProps: {
              status: app.status,
              client: app.client,
              professional: app.professional,
              service: app.service,
              notes: app.notes
            }
          };
        }),
    [appointments, selectedProfessional]
  );

  const businessHours = useMemo(() => {
    if (!selectedProfessional || !selectedProfessional.workingHours?.length) {
      return true;
    }

    return selectedProfessional.workingHours.map(wh => {
      const fcDay = (wh.dayOfWeek % 7); 
      return {
        daysOfWeek: [fcDay],
        startTime: wh.startTime,
        endTime: wh.endTime
      };
    });
  }, [selectedProfessional]);

  const timeOffBackgroundEvents = useMemo(() => {
    if (!selectedProfessional || !selectedProfessional.timeOff?.length) {
      return [];
    }

    return selectedProfessional.timeOff.map((t, idx) => ({
      id: `timeoff-${selectedProfessional._id}-${idx}`,
      start: t.start,
      end: t.end,
      display: "background" as const,
      backgroundColor: "rgba(239,68,68,0.25)",
      overlap: true, 
      extendedProps: {
        isTimeOff: true,
        reason: t.reason
      }
    }));
  }, [selectedProfessional]);



  const handleSelect = (arg: any) => {
    const startLocal = toLocalInputValue(arg.start);
    setSelectedStartLocal(startLocal);
    setOpenCreate(true);
    arg.view.calendar.unselect();
  };


  const handleEventClick = (arg: EventClickArg) => {
    const id = arg.event.id;

    const action = window.prompt(
      "Acción sobre el turno:\n- escribir 'c' para cancelar\n- escribir 'd' para eliminar\nCualquier otra cosa para salir"
    );

    if (action === "c") {
      cancelAppointmentMutation.mutate(id);
    } else if (action === "d") {
      if (window.confirm("¿Seguro que querés eliminar el turno?")) {
        deleteAppointmentMutation.mutate(id);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-violet-400" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">
              Agenda de turnos
            </h1>
            <p className="text-sm text-slate-400">
              Vista de calendario semanal / diaria.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-slate-200"
            value={selectedProfessionalId}
            onChange={e =>
              setSelectedProfessionalId(
                e.target.value === "all" ? "all" : e.target.value
              )
            }
          >
            <option value="all">Todos los profesionales</option>
            {professionals?.map(p => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSelectedStartLocal(null);
              setOpenCreate(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium px-3 py-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo turno
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-400">Cargando turnos...</p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          Error cargando turnos. Revisá consola.
        </p>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 md:p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={esLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          selectable={true}
          selectMirror={true}
          select={handleSelect}
          eventClick={handleEventClick}
          events={[...events, ...timeOffBackgroundEvents]}
          businessHours={businessHours} 
          height="auto"
          nowIndicator={true}
          firstDay={1} 
        />
      </div>

      {openCreate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold">Nuevo turno</h2>
              <button
                className="text-xs text-slate-400 hover:text-slate-200"
                onClick={() => setOpenCreate(false)}
              >
                <X/>
              </button>
            </div>
            <AppointmentForm
              services={services || []}
              professionals={professionals || []}
              clients={clients || []}
              loading={createAppointmentMutation.isPending}
              initialStartLocal={selectedStartLocal || undefined}
              onSubmit={async data => {
                await createAppointmentMutation.mutateAsync(data);
                setOpenCreate(false);
                setSelectedStartLocal(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
