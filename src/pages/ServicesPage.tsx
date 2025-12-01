import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useServices, type Service } from "../hooks/useServices";
import { ServiceForm } from "../components/services/ServiceForm";

export default function ServicesPage() {
  const {
    servicesQuery,
    createServiceMutation,
    updateServiceMutation,
    deleteServiceMutation
  } = useServices();

  const [openCreate, setOpenCreate] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const { data: services, isLoading, error } = servicesQuery;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Servicios</h1>
          <p className="text-sm text-slate-400">
            Listado de servicios configurados para el negocio.
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium px-3 py-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo servicio
        </button>
      </div>

      {isLoading && <p className="text-sm text-slate-400">Cargando servicios...</p>}
      {error && (
        <p className="text-sm text-red-400">
          Error cargando servicios. Revisá consola.
        </p>
      )}

      {!isLoading && services && services.length === 0 && (
        <p className="text-sm text-slate-400">
          Todavía no cargaste servicios. Empezá creando el primero.
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {services?.map(service => (
          <div
            key={service._id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-50">
                  {service.name}
                </h2>
                {service.color && (
                  <span
                    className="inline-flex h-3 w-3 rounded-full border border-slate-800"
                    style={{ backgroundColor: service.color }}
                  />
                )}
              </div>
              {service.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {service.description}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-2">
                Duración: {service.durationMinutes} min
              </p>
              <p className="text-sm font-semibold mt-1">
                ${service.price.toLocaleString("es-AR")}
              </p>
              {service.allowOverlap && (
                <p className="text-[11px] text-emerald-400 mt-1">
                  Permite hasta {service.maxConcurrentAppointments ?? 1} turnos solapados
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingService(service)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
              >
                <Pencil className="w-3 h-3" />
                Editar
              </button>
              <button
                onClick={() => setDeletingService(service)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-700/60 text-red-300 px-2 py-1 text-xs hover:bg-red-950/40"
              >
                <Trash2 className="w-3 h-3" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {openCreate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold">Nuevo servicio</h2>
              <button
                className="text-xs text-slate-400 hover:text-slate-200"
                onClick={() => setOpenCreate(false)}
              >
                <X />
              </button>
            </div>
            <ServiceForm
              loading={createServiceMutation.isPending}
              onSubmit={async data => {
                await createServiceMutation.mutateAsync(data);
                setOpenCreate(false);
              }}
            />
          </div>
        </div>
      )}

      {editingService && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold">Editar servicio</h2>
              <button
                className="text-xs text-slate-400 hover:text-slate-200"
                onClick={() => setEditingService(null)}
              >
                <X />
              </button>
            </div>
            <ServiceForm
              initialData={editingService}
              loading={updateServiceMutation.isPending}
              onSubmit={async data => {
                await updateServiceMutation.mutateAsync({
                  id: editingService._id,
                  data
                });
                setEditingService(null);
              }}
            />
          </div>
        </div>
      )}

      {deletingService && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-xl">
            <h2 className="text-sm font-semibold mb-2">Eliminar servicio</h2>
            <p className="text-sm text-slate-300 mb-4">
              ¿Seguro que querés eliminar{" "}
              <span className="font-semibold">{deletingService.name}</span>?  
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"
                onClick={() => setDeletingService(null)}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-1.5 text-xs rounded-lg bg-red-600 hover:bg-red-500 text-white disabled:opacity-60"
                onClick={async () => {
                  await deleteServiceMutation.mutateAsync(deletingService._id);
                  setDeletingService(null);
                }}
                disabled={deleteServiceMutation.isPending}
              >
                {deleteServiceMutation.isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
