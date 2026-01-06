
import { resolveName, resolveServiceName } from '../../utils/calendar';
import { useAppointments } from '../../hooks/useAppointments';
import { Trash2 } from 'lucide-react';
import type { Appointment } from '../../types';


type AppointmentDetailProps = {
    detailAppointment: Appointment;
    setEditingAppointmentId: (value: React.SetStateAction<string | null>) => void
    setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>
    closeDetailModal: () => void
}

export default function AppointmentDetail(
    {
        detailAppointment,
        setEditingAppointmentId,
        setOpenEdit,
        closeDetailModal
    } : AppointmentDetailProps
) {

    const { cancelAppointmentMutation, deleteAppointmentMutation } = useAppointments();
  return (
    <>
        <p className="text-sm text-jordy-blue-700 -mt-2 mb-4">
            {new Date(detailAppointment.start).toLocaleString("es-AR", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
            })}{" "}
            –{" "}
            {new Date(detailAppointment.end!).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
            })}
        </p>

        <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-white/60 border border-jordy-blue-200 p-3">
                <p className="text-[11px] uppercase tracking-wide text-jordy-blue-700">
                Servicio
                </p>
                <p className="font-semibold">
                {resolveServiceName(detailAppointment.service)}
                </p>
            </div>

            <div className="rounded-xl bg-white/60 border border-jordy-blue-200 p-3">
                <p className="text-[11px] uppercase tracking-wide text-jordy-blue-700">
                Cliente
                </p>
                <p className="font-semibold">{resolveName(detailAppointment.client)}</p>
            </div>

            <div className="rounded-xl bg-white/60 border border-jordy-blue-200 p-3">
                <p className="text-[11px] uppercase tracking-wide text-jordy-blue-700">
                Profesional
                </p>
                <p className="font-semibold">
                {resolveName(detailAppointment.professional)}
                </p>
            </div>

            {detailAppointment.notes && (
                <div className="rounded-xl bg-white/60 border border-jordy-blue-200 p-3">
                <p className="text-[11px] uppercase tracking-wide text-jordy-blue-700">
                    Notas
                </p>
                <p className="whitespace-pre-wrap">{detailAppointment.notes}</p>
                </div>
            )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
            <button
                className="px-3 py-2 rounded-lg bg-jordy-blue-500/80 hover:bg-jordy-blue-500 text-jordy-blue-950 text-sm font-medium disabled:opacity-60 duration-200"
                disabled={cancelAppointmentMutation.isPending}
                onClick={() => cancelAppointmentMutation.mutate(detailAppointment._id)}
            >
                {cancelAppointmentMutation.isPending ? "Cancelando..." : "Cancelar"}
            </button>

            <div className="flex items-center gap-2">
                <button
                className="px-3 py-2 rounded-lg bg-jordy-blue-700 hover:bg-jordy-blue-600 text-jordy-blue-100 text-sm font-medium duration-200"
                onClick={() => {
                    setEditingAppointmentId(detailAppointment._id);
                    setOpenEdit(true);
                    closeDetailModal();
                }}
                >
                Editar
                </button>

                <button
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium disabled:opacity-60 duration-200"
                disabled={deleteAppointmentMutation.isPending}
                onClick={async () => {
                    if (!window.confirm("¿Seguro que querés eliminar el turno?")) return;
                    await deleteAppointmentMutation.mutateAsync(detailAppointment._id);
                    closeDetailModal();
                }}
                >
                <Trash2 className="w-4 h-4" />
                {deleteAppointmentMutation.isPending ? "Eliminando..." : "Eliminar"}
                </button>
            </div>
        </div> 
    </>
  )
}
