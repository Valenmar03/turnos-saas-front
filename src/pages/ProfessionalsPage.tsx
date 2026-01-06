import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useProfessionals } from "../hooks/useProfessionals";
import { useServices } from "../hooks/useServices";
import { ProfessionalForm } from "../components/professionals/ProfessionalForm";
import type { Professional } from "../types";
import ProfessionalCard from "../components/professionals/ProfessionalCard";
import { Modal } from "../components/Modal";

export default function ProfessionalsPage() {
  const {
    professionalsQuery,
    createProfessionalMutation,
    updateProfessionalMutation,
    deleteProfessionalMutation
  } = useProfessionals();

  const { servicesQuery } = useServices();

  const [openCreate, setOpenCreate] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [deletingProfessional, setDeletingProfessional] = useState<Professional | null>(null);

  const { data: professionals, isLoading, error } = professionalsQuery;
  const { data: services = [] } = servicesQuery;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-jordy-blue-700"/>
          <div>
            <h1 className="text-2xl font-semibold text-jordy-blue-900">
              Profesionales
            </h1>
            <p className="text-jordy-blue-600">
              Gestioná quién atiende, qué servicios realiza y su configuración básica.
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-jordy-blue-700 hover:bg-jordy-blue-600 text-jordy-blue-200 font-medium px-3 py-2 duration-200"
        >
          <Plus className="w-5 h-5" />
          Nuevo profesional
        </button>
      </div>

      {isLoading && <p className="text-jordy-blue-600">Cargando profesionales...</p>}
      {error && (
        <p className="text-sm text-red-400">
          Error cargando profesionales. Revisá consola.
        </p>
      )}

      {!isLoading && professionals && professionals.length === 0 && (
        <p className="text-sm text-slate-400">
          Todavía no cargaste profesionales. Empezá creando el primero.
        </p>
      )}

      <div className="grid gap-3 xl:grid-cols-2">
        {professionals?.map(professional => (
          <ProfessionalCard 
            key={professional._id}
            professional={professional}
            setEditingProfessional={setEditingProfessional}
            setDeletingProfessional={setDeletingProfessional}
          />
        ))}
      </div>

      <Modal
        open={openCreate}
        title="Nuevo profesional"
        onClose={() => setOpenCreate(false)}
        zIndex={80}
        maxWidthClassName="max-w-md"
      >
        <div className="max-h-[800px] overflow-auto">
          <ProfessionalForm
            servicesOptions={services || []}
            loading={createProfessionalMutation.isPending}
            onSubmit={async (data) => {
              await createProfessionalMutation.mutateAsync(data);
              setOpenCreate(false);
            }}
          />
        </div>
      </Modal>

      <Modal
        open={!!editingProfessional}
        title="Editar profesional"
        onClose={() => setEditingProfessional(null)}
        zIndex={80}
        maxWidthClassName="max-w-md"
      >
        {editingProfessional && (
          <div className="max-h-[800px] overflow-y-auto pr-2">
            <ProfessionalForm
              initialData={editingProfessional}
              servicesOptions={services || []}
              loading={updateProfessionalMutation.isPending}
              onSubmit={async (data) => {
                await updateProfessionalMutation.mutateAsync({
                  id: editingProfessional._id,
                  data,
                });
                setEditingProfessional(null);
              }}
            />
          </div>
        )}
      </Modal>


      <Modal
        open={!!deletingProfessional}
        title="Eliminar profesional"
        onClose={() => setDeletingProfessional(null)}
        zIndex={80}
        maxWidthClassName="max-w-sm"
      >
        {deletingProfessional && (
          <>
            <p className="mb-4 text-sm text-jordy-blue-800">
              ¿Seguro que querés eliminar{" "}
              <span className="font-bold text-jordy-blue-700 capitalize">
                {deletingProfessional.name}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1.5 text-sm rounded-lg text-jordy-blue-200 bg-jordy-blue-600 hover:bg-jordy-blue-700 duration-200"
                onClick={() => setDeletingProfessional(null)}
              >
                Cancelar
              </button>

              <button
                className="px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 duration-200"
                onClick={async () => {
                  await deleteProfessionalMutation.mutateAsync(
                    deletingProfessional._id
                  );
                  setDeletingProfessional(null);
                }}
                disabled={deleteProfessionalMutation.isPending}
              >
                {deleteProfessionalMutation.isPending
                  ? "Eliminando..."
                  : "Eliminar"}
              </button>
            </div>
          </>
        )}
      </Modal>

    </div>
  );
}
