import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { Service } from "../../types";

type ServiceCardProps = {
  service: Service;
  setEditingService: React.Dispatch<React.SetStateAction<Service | null>>;
  setDeletingService: React.Dispatch<React.SetStateAction<Service | null>>;
};

export default function ServiceCard({
  service,
  setEditingService,
  setDeletingService
}: ServiceCardProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      key={service._id}
      className="group relative rounded-xl bg-jordy-blue-100 border-2 border-jordy-blue-200 p-4 shadow-md hover:shadow-xl duration-300"
    >
      {/* menú arriba derecha */}
      <div ref={menuRef} className="absolute top-3 right-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-1 text-jordy-blue-700 hover:bg-jordy-blue-200 transition
                     opacity-100 md:opacity-0 md:group-hover:opacity-100"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <MoreVertical
            className={`w-5 h-5 transition-transform duration-150 ${
              open ? "rotate-90" : "rotate-0"
            }`}
          />
        </button>

        {/* MENU smooth */}
        <div
          role="menu"
          className={[
            "absolute right-0 mt-2 w-40 rounded-lg bg-white border border-jordy-blue-200 shadow-lg z-20 overflow-hidden",
            "origin-top-right transform transition-all duration-200 ease-out",
            open
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
          ].join(" ")}
        >
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false);
              setEditingService(service);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-jordy-blue-800 hover:bg-jordy-blue-50 transition"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>

          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false);
              setDeletingService(service);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* contenido (padding-right para no chocar con el menú) */}
      <div className="pr-10">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-jordy-blue-900">{service.name}</h2>

          {service.color && (
            <span
              className="inline-flex h-3 w-3 rounded-full border border-jordy-blue-800 shrink-0"
              style={{ backgroundColor: service.color }}
              title={`Color: ${service.color}`}
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
          <p className="text-xs text-emerald-600 mt-2">
            Permite hasta {service.maxConcurrentAppointments ?? 1} turnos solapados
          </p>
        )}
      </div>
    </div>
  );
}
