import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { ProfessionalFormValues, Service } from "../../types"

type BasicFieldsFormProps = {
    register : UseFormRegister<ProfessionalFormValues>
    errors:  FieldErrors<ProfessionalFormValues>
    servicesOptions : Service[]
    selectedServices : string[]
    toggleService : (id: string) => void
}

export default function BasicFieldsForm({register, errors, servicesOptions, selectedServices, toggleService} : BasicFieldsFormProps) {
   return (
      <>
         <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Nombre</label>
            <input
               type="text"
               className="w-full rounded-lg bg-slate-900 border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border-slate-700"
               {...register("name", {
                  required: "El nombre es obligatorio",
                  minLength: {
                     value: 2,
                     message: "Debe tener al menos 2 caracteres",
                  },
               })}
            />
            {errors.name && (
               <p className="text-[11px] text-red-400 mt-1">
                  {errors.name.message}
               </p>
            )}
         </div>

         <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
               <label className="text-xs font-medium text-slate-300">
                  Email
               </label>
               <input
                  type="email"
                  className="w-full rounded-lg bg-slate-900 border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border-slate-700"
                  {...register("email", {
                     required: "El email es obligatorio",
                     pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email inválido",
                     },
                  })}
               />
               {errors.email && (
                  <p className="text-[11px] text-red-400 mt-1">
                     {errors.email.message}
                  </p>
               )}
            </div>
            <div className="space-y-1">
               <label className="text-xs font-medium text-slate-300">
                  Telefono
               </label>
               <input
                  type="text"
                  className="w-full rounded-lg bg-slate-900 border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border-slate-700"
                  {...register("phone", {
                     required: "El telefono es obligatorio",
                     minLength: {
                        value: 6,
                        message: "Demasiado corto",
                     },
                  })}
               />
               {errors.phone && (
                  <p className="text-[11px] text-red-400 mt-1">
                     {errors.phone.message}
                  </p>
               )}
            </div>
         </div>

         <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
               Servicios que atiende
            </label>
            {servicesOptions.length === 0 ? (
               <p className="text-xs text-slate-400">
                  No hay servicios cargados. Creá al menos uno primero.
               </p>
            ) : (
               <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 space-y-1">
                  {servicesOptions.map((s) => (
                     <label
                        key={s._id}
                        className="flex items-center gap-2 text-xs text-slate-200"
                     >
                        <input
                           type="checkbox"
                           className="h-3 w-3 rounded border-slate-600 bg-slate-900"
                           checked={selectedServices.includes(s._id)}
                           onChange={() => toggleService(s._id)}
                        />
                        <span>
                           {s.name}{" "}
                           <span className="text-[10px] text-slate-400">
                              ({s.durationMinutes} min)
                           </span>
                        </span>
                     </label>
                  ))}
               </div>
            )}
            {errors.root?.services && (
               <p className="text-[11px] text-red-400 mt-1">
                  {errors.root.services.message}
               </p>
            )}
         </div>

         <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
            <div className="flex items-center gap-2">
               <input
                  id="allowOverlapProf"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                  {...register("allowOverlap")}
               />
               <label
                  htmlFor="allowOverlapProf"
                  className="text-xs font-medium text-slate-300"
               >
                  Permitir turnos solapados
               </label>
            </div>

            <div className="space-y-1">
               <label className="text-xs font-medium text-slate-300">
                  Color (agenda)
               </label>
               <div className="flex items-center gap-2">
                  <input
                     type="color"
                     className="h-8 w-8 rounded-md border border-slate-700 bg-slate-900"
                  />
                  <input
                     type="text"
                     className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                     {...register("color")}
                  />
               </div>
            </div>
         </div>
      </>
   );
}
