import { Pencil, Trash2 } from "lucide-react";
import type { Client } from "../../types";

type ClientCardProps = {
    client: Client
    setEditingClient: React.Dispatch<React.SetStateAction<Client | null>>
    setDeletingClient: React.Dispatch<React.SetStateAction<Client | null>>
}


export default function ClientCard({client, setEditingClient, setDeletingClient} : ClientCardProps) {
   return (
      <div
         key={client._id}
         className="rounded-xl bg-jordy-blue-100 border-2 border-jordy-blue-200 p-4 flex flex-col justify-between shadow-md hover:scale-[101%] duration-200"
      >
         <div>
            <h2 className="text-lg font-semibold text-jordy-blue-900 capitalize">{client.name}</h2>
            {client.email && (
               <p className="text-sm text-jordy-blue-400">{client.email}</p>
            )}
            {client.phone && (
               <p className="text-sm text-jordy-blue-400">{client.phone}</p>
            )}
            {client.notes && (
               <p className="text-sm text-jordy-blue-400 mt-2 line-clamp-3">
                  {client.notes}
               </p>
            )}
         </div>

         <div className="flex justify-end gap-2 mt-4">
            <button
               onClick={() => setEditingClient(client)}
               className="inline-flex items-center gap-1 rounded-lg py-1 px-3 bg-jordy-blue-700 border border-jordy-blue-700 text-jordy-blue-200 hover:text-jordy-blue-700 hover:bg-jordy-blue-200 duration-200"
            >
               <Pencil className="w-3 h-3" />
               Editar
            </button>
            <button
               onClick={() => setDeletingClient(client)}
               className="inline-flex items-center gap-1 rounded-lg py-1 px-3 bg-red-700 border border-red-700 text-red-200 hover:text-red-700 hover:bg-red-200 duration-200"
            >
               <Trash2 className="w-3 h-3" />
               Eliminar
            </button>
         </div>
      </div>
   );
}
