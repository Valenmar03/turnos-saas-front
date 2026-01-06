import { useState } from "react";
import { Plus, Scissors } from "lucide-react";
import { useServices } from "../hooks/useServices";
import { ServiceForm } from "../components/services/ServiceForm";
import type { Service } from "../types";
import ServiceCard from "../components/services/ServiceCard";
import { Modal } from "../components/Modal";

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
        <div className="flex items-center gap-3">
          <Scissors className="w-6 h-6 text-jordy-blue-700"/>
          <div>
            <h1 className="text-2xl font-semibold text-jordy-blue-900">Servicios</h1>
            <p className=" text-jordy-blue-600">
              Listado de servicios configurados para el negocio.
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-jordy-blue-700 hover:bg-jordy-blue-600 text-jordy-blue-200 font-medium px-3 py-2 duration-200"
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

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
        {services?.map(service => (
          <ServiceCard key={service._id} service={service} setEditingService={setEditingService} setDeletingService={setDeletingService}/>
        ))}
      </div>

      <Modal
        open={openCreate}
        title="Nuevo servicio"
        onClose={() => setOpenCreate(false)}
        zIndex={80}
        maxWidthClassName="max-w-md"
      >
        <ServiceForm
          loading={createServiceMutation.isPending}
          onSubmit={async (data) => {
            await createServiceMutation.mutateAsync(data);
            setOpenCreate(false);
          }}
        />
      </Modal>

      <Modal
        open={!!editingService}
        title="Editar servicio"
        onClose={() => setEditingService(null)}
        zIndex={80}
        maxWidthClassName="max-w-md"
      >
        {editingService && (
          <ServiceForm
            initialData={editingService}
            loading={updateServiceMutation.isPending}
            onSubmit={async (data) => {
              await updateServiceMutation.mutateAsync({
                id: editingService._id,
                data,
              });
              setEditingService(null);
            }}
          />
        )}
      </Modal>

      <Modal
        open={!!deletingService}
        title="Eliminar servicio"
        onClose={() => setDeletingService(null)}
        zIndex={80}
        maxWidthClassName="max-w-sm"
      >
        {deletingService && (
          <>
            <p className="mb-4 text-sm text-jordy-blue-800">
              ¿Seguro que querés eliminar{" "}
              <span className="font-bold text-jordy-blue-700">
                {deletingService.name}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1.5 text-sm rounded-lg text-jordy-blue-200 bg-jordy-blue-600 hover:bg-jordy-blue-700 duration-200"
                onClick={() => setDeletingService(null)}
              >
                Cancelar
              </button>

              <button
                className="px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 duration-200"
                onClick={async () => {
                  await deleteServiceMutation.mutateAsync(deletingService._id);
                  setDeletingService(null);
                }}
                disabled={deleteServiceMutation.isPending}
              >
                {deleteServiceMutation.isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </>
        )}
      </Modal>

      
    </div>
  );
}
