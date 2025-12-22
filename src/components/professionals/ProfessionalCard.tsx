import { Pencil, Scissors, Trash2 } from "lucide-react";
import type { Professional } from "../../types";

type ProfessionalCardProps = {
   professional: Professional;
   setEditingProfessional: React.Dispatch<
      React.SetStateAction<Professional | null>
   >;
   setDeletingProfessional: React.Dispatch<
      React.SetStateAction<Professional | null>
   >;
};

export default function ProfessionalCard({
   professional,
   setEditingProfessional,
   setDeletingProfessional,
}: ProfessionalCardProps) {
   return (
      <div
         key={professional._id}
         className="rounded-xl bg-jordy-blue-100 border-2 border-jordy-blue-200 p-4 flex flex-col justify-between shadow-md hover:scale-[101%] duration-200"
      >
         <div>
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-lg capitalize font-medium text-jordy-blue-900">
                     {professional.name}
                  </h2>
                  {professional.email && (
                     <p className="text-sm text-jordy-blue-500">
                        {professional.email}
                     </p>
                  )}
                  {professional.phone && (
                     <p className="text-sm text-jordy-blue-500">
                        {professional.phone}
                     </p>
                  )}
               </div>
               {professional.color && (
                  <span
                     className="inline-flex h-4 w-4 rounded-full border border-jordy-blue-800"
                     style={{ backgroundColor: professional.color }}
                  />
               )}
            </div>

            {professional.services && professional.services.length > 0 && (
               <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-1 text-xs text-jordy-blue-900">
                     <Scissors className="w-3 h-3" />
                     <span>Servicios:</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                     {professional.services.map((s) => (
                        <span
                           key={s._id}
                           className="px-2 py-1 rounded-full border border-jordy-blue-300 bg-jordy-blue-200 text-xs text-jordy-blue-800"
                        >
                           {s.name}
                        </span>
                     ))}
                  </div>
               </div>
            )}

            {professional.allowOverlap && (
               <p className="text-[12px] text-emerald-500 mt-2">
                  Permite turnos solapados (según configuración de servicios)
               </p>
            )}
         </div>

         <div className="flex justify-end gap-2 mt-4 ">
            <button
               onClick={() => setEditingProfessional(professional)}
               className="inline-flex items-center gap-1 rounded-lg border bg-jordy-blue-200 border-jordy-blue-300 px-2 py-1 text-sm text-jordy-blue-800 hover:bg-jordy-blue-300 duration-200"
            >
               <Pencil className="w-3 h-3" />
               Editar
            </button>
            <button
               onClick={() => setDeletingProfessional(professional)}
               className="inline-flex items-center gap-1 rounded-lg border border-red-700 bg-red-100 text-red-500 px-2 py-1 text-sm hover:bg-red-200 duration-200"
            >
               <Trash2 className="w-3 h-3" />
               Eliminar
            </button>
         </div>
      </div>
   );
}
