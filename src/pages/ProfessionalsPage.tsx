import { useState } from "react";
import { Plus, Users, X } from "lucide-react";
import { useProfessionals } from "../hooks/useProfessionals";
import { useServices } from "../hooks/useServices";
import { ProfessionalForm } from "../components/professionals/ProfessionalForm";
import type { Professional } from "../types";
import ProfessionalCard from "../components/professionals/ProfessionalCard";

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

      <div className="grid gap-3 md:grid-cols-2">
        {professionals!.map(professional => (
          <ProfessionalCard 
            professional={professional}
            setEditingProfessional={setEditingProfessional}
            setDeletingProfessional={setDeletingProfessional}
          />
        ))}
      </div>

      {openCreate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-jordy-blue-300 p-5 shadow-xl color text-jordy-blue-800 max-h-[800px] overflow-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-semibold">Nuevo profesional</h2>
              <button
                className="text-xs text-jordy-blue-800 hover:text-jordy-blue-100 duration-100"
                onClick={() => setOpenCreate(false)}
              >
                <X />
              </button>
            </div>
            <ProfessionalForm
              servicesOptions={services || []}
              loading={createProfessionalMutation.isPending}
              onSubmit={async data => {
                await createProfessionalMutation.mutateAsync(data);
                setOpenCreate(false);
              }}
            />
          </div>
        </div>
      )}

      {editingProfessional && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-jordy-blue-300 p-5 shadow-xl color text-jordy-blue-800 max-h-[800px] overflow-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-semibold">Editar profesional</h2>
              <button
                className="text-xs text-jordy-blue-800 hover:text-jordy-blue-100 duration-100"
                onClick={() => setEditingProfessional(null)}
              >
                <X />
              </button>
            </div>
            <ProfessionalForm
              initialData={editingProfessional}
              servicesOptions={services || []}
              loading={updateProfessionalMutation.isPending}
              onSubmit={async data => {
                await updateProfessionalMutation.mutateAsync({
                  id: editingProfessional._id,
                  data
                });
                setEditingProfessional(null);
              }}
            />
          </div>
        </div>
      )}

      {deletingProfessional && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl bg-jordy-blue-300 text-jordy-blue-800 p-5 shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Eliminar profesional</h2>
            <p className="text-sm mb-4">
              ¿Seguro que querés eliminar{" "}
              <span className="font-bold text-jordy-blue-700">{deletingProfessional.name}</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1.5 text-xs rounded-lg text-jordy-blue-200 bg-jordy-blue-600 hover:bg-jordy-blue-700 duration-200"
                onClick={() => setDeletingProfessional(null)}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-1.5 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 duration-200"
                onClick={async () => {
                  await deleteProfessionalMutation.mutateAsync(
                    deletingProfessional._id
                  );
                  setDeletingProfessional(null);
                }}
                disabled={deleteProfessionalMutation.isPending}
              >
                {deleteProfessionalMutation.isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
