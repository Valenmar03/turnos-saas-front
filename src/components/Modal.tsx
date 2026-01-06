import { useEffect, useState } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: number;
  maxWidthClassName?: string;
};

export function Modal({
  open,
  title,
  onClose,
  children,
  zIndex = 50,
  maxWidthClassName = "max-w-md",
}: ModalProps) {
  const [mounted, setMounted] = useState(open);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setShow(false);
      const t = window.setTimeout(() => setShow(true), 0);
      return () => window.clearTimeout(t);
    }

    setShow(false);
    const t = window.setTimeout(() => setMounted(false), 250);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div
      style={{ zIndex }}
      className="fixed inset-0 flex items-center justify-center p-4"
    >
      {/* OVERLAY → click afuera */}
      <div
        className={[
          "absolute inset-0 bg-black/50 backdrop-blur-[2px]",
          "transition-opacity duration-300 ease-out",
          show ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onMouseDown={onClose}
      />

      {/* PANEL */}
      <div
        className={[
          "relative w-full rounded-2xl bg-jordy-blue-300 p-5 shadow-xl text-jordy-blue-900",
          maxWidthClassName,
          "transition-all duration-300 ease-out will-change-transform",
          show
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-3 scale-[0.97]",
        ].join(" ")}
        onMouseDown={(e) => e.stopPropagation()} // ⛔ no cerrar si clic dentro
      >
        {title && (
          <div className="mb-4 flex items-start justify-between gap-3">
            {title ? <h2 className="text-xl font-semibold">{title}</h2> : <div />}
            <button
              className="text-jordy-blue-900/80 hover:text-jordy-blue-950 duration-150"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X />
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
