import { useEffect } from "react";
import { IconWarning } from "../icons/Icons";

/**
 * ConfirmDeleteModal — Confirmación compacta para eliminar una simulación.
 * Centrado en móvil y escritorio.
 */
export const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const closeOnBackdrop = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      onClick={closeOnBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-overlay backdrop-blur-sm"
      aria-modal="true"
      role="alertdialog"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-desc"
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl max-w-sm w-[90vw] p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <IconWarning className="w-6 h-6 shrink-0 text-warning-strong" />
          <h2 id="confirm-delete-title" className="font-semibold text-text-strong">
            ¿Eliminar simulación?
          </h2>
        </div>

        <p id="confirm-delete-desc" className="text-sm text-text-muted mt-2">
          Esta acción no se puede deshacer.
        </p>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 min-h-10 rounded-md transition-all duration-150 bg-control-secondary text-text-secondary hover:bg-border-strong"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 min-h-10 rounded-md transition-all duration-150 bg-danger-strong text-on-primary hover:opacity-90"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
