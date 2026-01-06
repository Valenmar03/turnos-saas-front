import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
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
import { Modal } from "../components/Modal";
import { resolveName, resolveServiceName } from "../utils/calendar";
import AppointmentDetail from "../components/calendar/AppointmentDetail";

export default function CalendarPage() {
  const {
    appointmentsQuery,
    createAppointmentMutation,
    updateAppointmentMutation,
    cancelAppointmentMutation,
    deleteAppointmentMutation,
  } = useAppointments();

  const { servicesQuery } = useServices();
  const { professionalsQuery } = useProfessionals();
  const { clientsQuery } = useClients();

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedStartLocal, setSelectedStartLocal] = useState<string | null>(
    null
  );
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    string | "all"
  >("all");

  // Modal detalle
  const [openDetail, setOpenDetail] = useState(false);
  const [detailAppointmentId, setDetailAppointmentId] = useState<string | null>(
    null
  );

  // Modal edición
  const [openEdit, setOpenEdit] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);

  const { data: appointments, isLoading, error } = appointmentsQuery;
  const { data: services = [] } = servicesQuery;
  const { data: professionals = [] } = professionalsQuery;
  const { data: clients = [] } = clientsQuery;

  const selectedProfessional =
    selectedProfessionalId === "all"
      ? null
      : professionals?.find((p) => p._id === selectedProfessionalId) ?? null;

  const events = useMemo(
    () =>
      (appointments ?? [])
        .filter((app) =>
          selectedProfessional
            ? (app.professional &&
                (app.professional as any)._id === selectedProfessional._id) ||
              app.professional === selectedProfessional._id
            : true
        )
        .map((app) => {
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
              isTimeOff: false,
              status: app.status,
              client: app.client,
              professional: app.professional,
              service: app.service,
              notes: app.notes,
            },
          };
        }),
    [appointments, selectedProfessional]
  );

  const businessHours = useMemo(() => {
    if (!selectedProfessional || !selectedProfessional.workingHours?.length) {
      return true;
    }

    return selectedProfessional.workingHours.map((wh) => {
      const fcDay = wh.dayOfWeek % 7;
      return {
        daysOfWeek: [fcDay],
        startTime: wh.startTime,
        endTime: wh.endTime,
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
        reason: t.reason,
      },
    }));
  }, [selectedProfessional]);

  const handleSelect = (arg: any) => {
    const startLocal = toLocalInputValue(arg.start);
    setSelectedStartLocal(startLocal);
    setOpenCreate(true);
    arg.view.calendar.unselect();
  };

  const handleEventClick = (arg: EventClickArg) => {
    const isTimeOff = (arg.event.extendedProps as any)?.isTimeOff;
    if (isTimeOff) return;

    setDetailAppointmentId(arg.event.id);
    setOpenDetail(true);
  };

  const detailAppointment = useMemo(() => {
    if (!detailAppointmentId) return null;
    return (appointments ?? []).find((a) => a._id === detailAppointmentId) ?? null;
  }, [detailAppointmentId, appointments]);

  const editingAppointment = useMemo(() => {
    if (!editingAppointmentId) return null;
    return (appointments ?? []).find((a) => a._id === editingAppointmentId) ?? null;
  }, [editingAppointmentId, appointments]);

  const closeDetailModal = () => {
    setOpenDetail(false);
    setDetailAppointmentId(null);
  };

  const closeEditModal = () => {
    setOpenEdit(false);
    setEditingAppointmentId(null);
  };

  // Cerrar con ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openDetail) closeDetailModal();
      if (openEdit) closeEditModal();
      if (openCreate) setOpenCreate(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openDetail, openEdit, openCreate]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-jordy-blue-700" />
          <div>
            <h1 className="text-2xl font-semibold text-jordy-blue-900">
              Agenda de turnos
            </h1>
            <p className="text-jordy-blue-600">
              Vista de calendario semanal / diaria.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="rounded-lg bg-jordy-blue-200 border px-4 py-2 text-jordy-blue-900"
            value={selectedProfessionalId}
            onChange={(e) =>
              setSelectedProfessionalId(
                e.target.value === "all" ? "all" : e.target.value
              )
            }
          >
            <option value="all">Todos los profesionales</option>
            {professionals?.map((p) => (
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
            className="inline-flex items-center gap-2 rounded-lg bg-jordy-blue-700 hover:bg-jordy-blue-600 text-jordy-blue-200 font-medium px-3 py-2 duration-200"
          >
            <Plus className="w-4 h-4" />
            Nuevo turno
          </button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-slate-400">Cargando turnos...</p>}
      {error && (
        <p className="text-sm text-red-400">
          Error cargando turnos. Revisá consola.
        </p>
      )}

      <div className="rounded-xl border border-jordy-blue-00 bg-jordy-blue-100 p-2 md:p-4 shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={esLocale}
          titleFormat={{ year: "numeric", month: "long" }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          allDaySlot={false}
          slotDuration="00:30:00"
          slotLabelInterval="01:00"
          slotMinTime="05:00:00"
          slotMaxTime="23:00:00"
          selectable={true}
          selectMirror={true}
          select={handleSelect}
          eventClick={handleEventClick}
          events={[...events, ...timeOffBackgroundEvents]}
          businessHours={businessHours}
          nowIndicator={true}
          height="auto"
          firstDay={1}
          eventMinHeight={44}
          eventShortHeight={44}
        />
      </div>

      <Modal
          open={openCreate}
          title="Nuevo turno"
          onClose={() => setOpenCreate(false)}
          zIndex={50}
        >
          <AppointmentForm
            services={services}
            professionals={professionals}
            clients={clients}
            loading={createAppointmentMutation.isPending}
            initialStartLocal={selectedStartLocal || undefined}
            onSubmit={async (data) => {
              await createAppointmentMutation.mutateAsync(data);
              setOpenCreate(false);
              setSelectedStartLocal(null);
            }}
          />
        </Modal>
        <Modal
          open={openDetail && !!detailAppointment}
          title="Detalle del turno"
          onClose={closeDetailModal}
          zIndex={80}
          maxWidthClassName="max-w-md"
        >
          {detailAppointment && (
            <AppointmentDetail
              detailAppointment={detailAppointment}
              setEditingAppointmentId={setEditingAppointmentId}
              setOpenEdit={setOpenEdit}
              closeDetailModal={closeDetailModal}
            />
          )}
        </Modal>

        <Modal
          open={openEdit && !!editingAppointment}
          title="Editar turno"
          onClose={closeEditModal}
          zIndex={80}
          maxWidthClassName="max-w-md"
        >
          {editingAppointment && (
            <>
              <div className="flex items-center justify-between gap-2 mb-4">
                <button
                  className="px-3 py-2 rounded-lg bg-jordy-blue-500/80 hover:bg-jordy-blue-500 text-jordy-blue-950 text-sm font-medium disabled:opacity-60 duration-200"
                  disabled={cancelAppointmentMutation.isPending}
                  onClick={() => cancelAppointmentMutation.mutate(editingAppointment._id)}
                >
                  {cancelAppointmentMutation.isPending ? "Cancelando..." : "Cancelar turno"}
                </button>

                <button
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium disabled:opacity-60 duration-200"
                  disabled={deleteAppointmentMutation.isPending}
                  onClick={async () => {
                    if (!window.confirm("¿Seguro que querés eliminar el turno?")) return;
                    await deleteAppointmentMutation.mutateAsync(editingAppointment._id);
                    closeEditModal();
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteAppointmentMutation.isPending ? "Eliminando..." : "Eliminar"}
                </button>
              </div>

              <AppointmentForm
                services={services}
                professionals={professionals}
                clients={clients}
                loading={updateAppointmentMutation.isPending}
                initialData={editingAppointment}
                onSubmit={async (data) => {
                  await updateAppointmentMutation.mutateAsync({
                    id: editingAppointment._id,
                    data,
                  });
                  closeEditModal();
                }}
              />
            </>
          )}
        </Modal>

    </div>
  );
}
