import { useState } from "react";
import { Plus, Pencil, Trash2, Scissors, X } from "lucide-react";
import { useProfessionals, type Professional } from "../hooks/useProfessionals";
import { useServices } from "../hooks/useServices";
import { ProfessionalForm } from "../components/professionals/ProfessionalForm";

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
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Profesionales</h1>
          <p className="text-sm text-slate-400">
            Gestioná quién atiende, qué servicios realiza y su configuración básica.
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium px-3 py-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo profesional
        </button>
      </div>

      {isLoading && <p className="text-sm text-slate-400">Cargando profesionales...</p>}
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
        {professionals?.map(prof => (
          <div
            key={prof._id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-slate-50">
                    {prof.name}
                  </h2>
                  {prof.email && (
                    <p className="text-xs text-slate-400">{prof.email}</p>
                  )}
                  {prof.phone && (
                    <p className="text-xs text-slate-400">{prof.phone}</p>
                  )}
                </div>
                {prof.color && (
                  <span
                    className="inline-flex h-4 w-4 rounded-full border border-slate-800"
                    style={{ backgroundColor: prof.color }}
                  />
                )}
              </div>

              {prof.services && prof.services.length > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Scissors className="w-3 h-3" />
                    <span>Servicios:</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {prof.services.map(s => (
                      <span
                        key={s._id}
                        className="px-2 py-1 rounded-full bg-slate-800 text-[11px] text-slate-200"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {prof.allowOverlap && (
                <p className="text-[11px] text-emerald-400 mt-2">
                  Permite turnos solapados (según configuración de servicios)
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingProfessional(prof)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
              >
                <Pencil className="w-3 h-3" />
                Editar
              </button>
              <button
                onClick={() => setDeletingProfessional(prof)}
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
              <h2 className="text-sm font-semibold">Nuevo profesional</h2>
              <button
                className="text-xs text-slate-400 hover:text-slate-200"
                onClick={() => setOpenCreate(false)}
              >
                <X/>
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
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold">Editar profesional</h2>
              <button
                className="text-xs text-slate-400 hover:text-slate-200"
                onClick={() => setEditingProfessional(null)}
              >
                <X/>
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
          <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-xl">
            <h2 className="text-sm font-semibold mb-2">Eliminar profesional</h2>
            <p className="text-sm text-slate-300 mb-4">
              ¿Seguro que querés eliminar{" "}
              <span className="font-semibold">{deletingProfessional.name}</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"
                onClick={() => setDeletingProfessional(null)}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-1.5 text-xs rounded-lg bg-red-600 hover:bg-red-500 text-white disabled:opacity-60"
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
