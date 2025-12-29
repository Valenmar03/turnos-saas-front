import { MoreVertical, Pencil, Scissors, Trash2 } from "lucide-react";
import type { Professional } from "../../types";
import { useEffect, useRef, useState } from "react";

type ProfessionalCardProps = {
  professional: Professional;
  setEditingProfessional: React.Dispatch<React.SetStateAction<Professional | null>>;
  setDeletingProfessional: React.Dispatch<React.SetStateAction<Professional | null>>;
};

export default function ProfessionalCard({
  professional,
  setEditingProfessional,
  setDeletingProfessional
}: ProfessionalCardProps) {
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
      key={professional._id}
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

        {/* MENU smooth (siempre montado) */}
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
              setEditingProfessional(professional);
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
              setDeletingProfessional(professional);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      <div className="pr-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg capitalize font-medium text-jordy-blue-900">
              {professional.name}
            </h2>

            {professional.email && (
              <p className="text-sm text-jordy-blue-500">{professional.email}</p>
            )}
            {professional.phone && (
              <p className="text-sm text-jordy-blue-500">{professional.phone}</p>
            )}
          </div>

          {professional.color && (
            <span
              className="inline-flex h-4 w-4 rounded-full border border-jordy-blue-800 shrink-0"
              style={{ backgroundColor: professional.color }}
              title={`Color: ${professional.color}`}
            />
          )}
        </div>

        {professional.services?.length ? (
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
        ) : null}

        {professional.allowOverlap && (
          <p className="text-xs text-emerald-600 mt-2">
            Permite turnos solapados (según configuración de servicios)
          </p>
        )}
      </div>
    </div>
  );
}
