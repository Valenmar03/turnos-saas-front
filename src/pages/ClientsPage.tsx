import { useState } from "react";
import { Plus, UserCircle2 } from "lucide-react";
import { useClients} from "../hooks/useClients";
import { ClientForm } from "../components/clients/ClientForm";
import type { Client } from "../types";
import ClientCard from "../components/clients/ClientCard";
import { Modal } from "../components/Modal";

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
        <div className="flex items-center gap-3">
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

      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {clients?.map(client => (
          <ClientCard 
            key={client._id}
            client={client}
            setEditingClient={setEditingClient}
            setDeletingClient={setDeletingClient}
          />
        ))}
      </div>

      <Modal
        open={openCreate}
        title="Nuevo cliente"
        onClose={() => setOpenCreate(false)}
        zIndex={80}
        maxWidthClassName="max-w-md"
      >
        <ClientForm
          loading={createClientMutation.isPending}
          onSubmit={async (data) => {
            await createClientMutation.mutateAsync(data);
            setOpenCreate(false);
          }}
        />
      </Modal>

      <Modal
        open={!!editingClient}
        title="Editar cliente"
        onClose={() => setEditingClient(null)}
        zIndex={80}
        maxWidthClassName="max-w-md"
      >
        {editingClient && (
          <ClientForm
            initialData={editingClient}
            loading={updateClientMutation.isPending}
            onSubmit={async (data) => {
              await updateClientMutation.mutateAsync({
                id: editingClient._id,
                data,
              });
              setEditingClient(null);
            }}
          />
        )}
      </Modal>

      <Modal
        open={!!deletingClient}
        title="Eliminar cliente"
        onClose={() => setDeletingClient(null)}
        zIndex={80}
        maxWidthClassName="max-w-sm"
      >
        {deletingClient && (
          <>
            <p className="mb-4 text-sm text-jordy-blue-800">
              ¿Seguro que querés eliminar a{" "}
              <span className="font-bold text-jordy-blue-700">
                {deletingClient.name}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1.5 text-sm rounded-lg text-jordy-blue-200 bg-jordy-blue-600 hover:bg-jordy-blue-700 duration-200"
                onClick={() => setDeletingClient(null)}
              >
                Cancelar
              </button>

              <button
                className="px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-500 text-white disabled:opacity-60"
                onClick={async () => {
                  await deleteClientMutation.mutateAsync(deletingClient._id);
                  setDeletingClient(null);
                }}
                disabled={deleteClientMutation.isPending}
              >
                {deleteClientMutation.isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
