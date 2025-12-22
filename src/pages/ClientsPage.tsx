import { useState } from "react";
import { Plus, Pencil, Trash2, X, UserCircle2 } from "lucide-react";
import { useClients} from "../hooks/useClients";
import { ClientForm } from "../components/clients/ClientForm";
import type { Client } from "../types";
import ClientCard from "../components/clients/ClientCard";

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
        <div className="flex items-center gap-2">
          <UserCircle2 className="w-6 h-6 text-jordy-blue-700"/>
          <div>
            <h1 className="text-2xl font-semibold text-jordy-blue-900">Clientes</h1>
            <p className=" text-jordy-blue-600">
              Gestioná la base de clientes del negocio.
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-jordy-blue-700 hover:bg-jordy-blue-600 text-jordy-blue-200 font-medium px-3 py-2 duration-200"
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
          <ClientCard 
            client={client}
            setEditingClient={setEditingClient}
            setDeletingClient={setDeletingClient}
          />
        ))}
      </div>

      {openCreate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-jordy-blue-300 p-5 shadow-xl color text-jordy-blue-800">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-semibold">Nuevo cliente</h2>
              <button
                className="text-xs text-jordy-blue-800 hover:text-jordy-blue-100 duration-100"
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
          <div className="w-full max-w-md rounded-xl bg-jordy-blue-300 p-5 shadow-xl color text-jordy-blue-800">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-semibold">Editar cliente</h2>
              <button
                className="text-xs text-jordy-blue-800 hover:text-jordy-blue-100 duration-100"
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
          <div className="w-full max-w-sm rounded-xl bg-jordy-blue-300 text-jordy-blue-800 p-5 shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Eliminar cliente</h2>
            <p className="text-sm mb-4">
              ¿Seguro que querés eliminar a{" "}
              <span className="font-bold text-jordy-blue-700">{deletingClient.name}</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
              className="px-3 py-1.5 text-xs rounded-lg text-jordy-blue-200 bg-jordy-blue-600 hover:bg-jordy-blue-700 duration-200"
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
