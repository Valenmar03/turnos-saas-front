import { Pencil, Trash2 } from 'lucide-react'
import React from 'react'
import type { Service } from '../../types'

type ServiceCardProps  = {
    service: Service;
    setEditingService: React.Dispatch<React.SetStateAction<Service | null>>
    setDeletingService:  React.Dispatch<React.SetStateAction<Service | null>>
}



export default function ServiceCard({service, setEditingService, setDeletingService} : ServiceCardProps) {
  return (
    <div
        key={service._id}
        className="rounded-xl bg-jordy-blue-100 border-2 border-jordy-blue-200 p-4 flex flex-col justify-between shadow-md hover:scale-[101%] duration-200"
    >
        <div>
            <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-jordy-blue-900">
                {service.name}
            </h2>
            {service.color && (
                <span
                className="inline-flex h-3 w-3 rounded-full border border-jordy-blue-800"
                style={{ backgroundColor: service.color }}
                />
            )}
            </div>
            {service.description && (
            <p className="text-xs text-jordy-blue-600 mt-1 line-clamp-2">
                {service.description}
            </p>
            )}
            <p className="text-sm text-jordy-blue-800 mt-2">
            Duración: {service.durationMinutes} min
            </p>
            <p className="text-lg text-jordy-blue-900 font-semibold mt-1">
            ${service.price.toLocaleString("es-AR")}
            </p>
            {service.allowOverlap && (
            <p className="text-sm font-semibold text-persian-green-700 mt-1">
                Permite hasta {service.maxConcurrentAppointments ?? 1} turnos solapados
            </p>
            )}
        </div>

        <div className="flex justify-end gap-2 mt-4 text-sm">
            <button
                onClick={() => setEditingService(service)}
                className="inline-flex items-center gap-1 rounded-lg py-1 px-3 bg-jordy-blue-700 border border-jordy-blue-700 text-jordy-blue-200 hover:text-jordy-blue-700 hover:bg-jordy-blue-200 duration-200"
            >
            <Pencil className="w-3 h-3" />
            Editar
            </button>
            <button
                onClick={() => setDeletingService(service)}
                className="inline-flex items-center gap-1 rounded-lg py-1 px-3 bg-red-700 border border-red-700 text-red-200 hover:text-red-700 hover:bg-red-200 duration-200"
            >
            <Trash2 className="w-3 h-3" />
            Eliminar
            </button>
        </div>
        </div>
  )
}
