import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useClients} from "../hooks/useClients";
import { ClientForm } from "../components/clients/ClientForm";
import type { Client } from "../types";

export default function ClientsPage() {
  const {
    clientsQuery,
    createClientMutation,
    updateClientMutation,
    deleteClientMutation
  } = useClients();

  const [openCreate, setOpenCreate] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const { data: clients, isLoading, error } = clientsQuery;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Clientes</h1>
          <p className="text-sm text-slate-400">
            Gestioná la base de clientes del negocio.
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium px-3 py-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo cliente
        </button>
      </div>

      {isLoading && <p className="text-sm text-slate-400">Cargando clientes...</p>}
      {error && (
        <p className="text-sm text-red-400">
          Error cargando clientes. Revisá consola.
        </p>
      )}

      {!isLoading && clients && clients.length === 0 && (
        <p className="text-sm text-slate-400">
          Todavía no cargaste clientes. Podés empezar creando uno.
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {clients?.map(client => (
          <div
            key={client._id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-sm font-medium text-slate-50">
                {client.name}
              </h2>
              {client.email && (
                <p className="text-xs text-slate-400">{client.email}</p>
              )}
              {client.phone && (
                <p className="text-xs text-slate-400">{client.phone}</p>
              )}
              {client.notes && (
                <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                  {client.notes}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingClient(client)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
              >
                <Pencil className="w-3 h-3" />
                Editar
              </button>
              <button
                onClick={() => setDeletingClient(client)}
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
              <h2 className="text-sm font-semibold">Nuevo cliente</h2>
              <button
                className="text-xs text-slate-400 hover:text-slate-200"
                onClick={() => setOpenCreate(false)}
              >
                <X/>
              </button>
            </div>
            <ClientForm
              loading={createClientMutation.isPending}
              onSubmit={async data => {
                await createClientMutation.mutateAsync(data);
                setOpenCreate(false);
              }}
            />
          </div>
        </div>
      )}

      {editingClient && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold">Editar cliente</h2>
              <button
                className="text-xs text-slate-400 hover:text-slate-200"
                onClick={() => setEditingClient(null)}
              >
                <X/>
              </button>
            </div>
            <ClientForm
              initialData={editingClient}
              loading={updateClientMutation.isPending}
              onSubmit={async data => {
                await updateClientMutation.mutateAsync({
                  id: editingClient._id,
                  data
                });
                setEditingClient(null);
              }}
            />
          </div>
        </div>
      )}

      {deletingClient && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-xl">
            <h2 className="text-sm font-semibold mb-2">Eliminar cliente</h2>
            <p className="text-sm text-slate-300 mb-4">
              ¿Seguro que querés eliminar{" "}
              <span className="font-semibold">{deletingClient.name}</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"
                onClick={() => setDeletingClient(null)}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-1.5 text-xs rounded-lg bg-red-600 hover:bg-red-500 text-white disabled:opacity-60"
                onClick={async () => {
                  await deleteClientMutation.mutateAsync(deletingClient._id);
                  setDeletingClient(null);
                }}
                disabled={deleteClientMutation.isPending}
              >
                {deleteClientMutation.isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
