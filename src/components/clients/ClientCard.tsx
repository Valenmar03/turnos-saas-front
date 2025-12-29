import React, { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Client } from "../../types";

type ClientCardProps = {
  client: Client;
  setEditingClient: React.Dispatch<React.SetStateAction<Client | null>>;
  setDeletingClient: React.Dispatch<React.SetStateAction<Client | null>>;
};

export default function ClientCard({
  client,
  setEditingClient,
  setDeletingClient
}: ClientCardProps) {
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
    <div className="group relative rounded-xl bg-jordy-blue-100 border-2 border-jordy-blue-200 p-4 shadow-md hover:shadow-xl duration-300">
      <div ref={menuRef} className="absolute top-3 right-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-1 text-jordy-blue-700 hover:bg-jordy-blue-200 transition
                     opacity-100 md:opacity-0 md:group-hover:opacity-100"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {/* MENU (siempre montado para animar) */}
        <div
          role="menu"
          className={[
            "absolute right-0 mt-2 w-40 rounded-lg bg-white border border-jordy-blue-200 shadow-lg z-20 overflow-hidden",
            "origin-top-right transform transition-all duration-150 ease-out",
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
              setEditingClient(client);
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
              setDeletingClient(client);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* contenido */}
      <div className="pr-10">
        <h2 className="text-lg font-semibold text-jordy-blue-900 capitalize">
          {client.name}
        </h2>

        {client.email && <p className="text-sm text-jordy-blue-600">{client.email}</p>}
        {client.phone && <p className="text-sm text-jordy-blue-600">{client.phone}</p>}

        {client.notes && (
          <p className="text-sm text-jordy-blue-600 mt-2 line-clamp-3">
            {client.notes}
          </p>
        )}
      </div>
    </div>
  );
}
