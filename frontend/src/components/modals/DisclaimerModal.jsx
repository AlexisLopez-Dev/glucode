import { useEffect, useRef, useState } from "react";
import { IconWarning, IconX } from "../icons/Icons";

const SWIPE_CLOSE_THRESHOLD = 150;

/**
 * DisclaimerModal — Aviso médico y exención de responsabilidad
 *
 * Escritorio: diálogo modal centrado.
 * Móvil (<768px): hoja inferior (bottom sheet) que sube desde abajo.
 */
export const DisclaimerModal = ({ isOpen, onClose, onAccept }) => {
  const sheetRef = useRef(null);
  const scrollRef = useRef(null);
  const touch = useRef({ startY: 0, y: 0, active: false, mode: "none" });
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const sheet = sheetRef.current;
    const onTouchMove = (e) => {
      if (!touch.current.active) return;

      const deltaY = e.touches[0].clientY - touch.current.startY;

      if (touch.current.mode === "pending") {
        if (
          deltaY < 0 ||
          (scrollRef.current?.scrollTop ?? 0) > 0 ||
          (deltaY > 0 && !e.cancelable)
        ) {
          touch.current.active = false;
          touch.current.mode = "none";
          return;
        }
        if (deltaY > 0) {
          touch.current.mode = "sheet";
          setIsDragging(true);
        } else {
          return;
        }
      }

      if (touch.current.mode !== "sheet" || deltaY <= 0) return;

      if (e.cancelable) e.preventDefault();
      touch.current.y = deltaY;
      setDragY(deltaY);
    };

    sheet?.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = "";
      sheet?.removeEventListener("touchmove", onTouchMove);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const closeOnOutsideClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const startSheetDrag = (startY) => {
    touch.current = { startY, y: 0, active: true, mode: "sheet" };
    setIsDragging(true);
    setDragY(0);
  };

  const onChromeTouchStart = (e) => {
    startSheetDrag(e.touches[0].clientY);
  };

  const onContentTouchStart = (e) => {
    if (scrollRef.current && scrollRef.current.scrollTop > 0) return;
    touch.current = { startY: e.touches[0].clientY, y: 0, active: true, mode: "pending" };
  };

  const onTouchEnd = () => {
    if (touch.current.mode === "sheet" && touch.current.y > SWIPE_CLOSE_THRESHOLD) {
      onClose();
    }
    touch.current = { startY: 0, y: 0, active: false, mode: "none" };
    setIsDragging(false);
    setDragY(0);
  };

  const sheetDragStyle = {
    "--sheet-drag": `${dragY}px`,
    transition: isDragging ? "none" : "transform 0.2s ease-out",
  };

  return (
    <div
      onClick={closeOnOutsideClick}
      className="fixed inset-0 z-50 flex animate-fade-in bg-overlay backdrop-blur-sm overscroll-none max-md:touch-none"
      aria-modal="true"
      role="dialog"
      aria-label="Aviso Médico Importante"
    >
      <div
        ref={sheetRef}
        className={`
          w-full flex flex-col overflow-hidden bg-surface shadow-2xl touch-auto
          rounded-t-3xl mt-auto max-h-[90vh] animate-slide-up
          md:m-auto md:rounded-2xl md:max-w-lg md:max-h-[75vh] md:animate-fade-in
          max-md:[transform:translateY(var(--sheet-drag))]
        `}
        style={sheetDragStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex justify-center pt-3 pb-1 md:hidden"
          onTouchStart={onChromeTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-border-strong" />
        </div>

        <div
          className="px-5 py-4 border-b flex justify-between items-center shrink-0 bg-warning-surface border-border-subtle"
          onTouchStart={onChromeTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <h3 className="font-bold flex items-center gap-2 text-warning-strong">
            <IconWarning className="w-5 h-5 shrink-0" />
            Aviso Médico Importante
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center touch-target rounded-lg transition-all duration-150 focus:outline-none
                       text-warning-muted hover:text-warning-text"
            aria-label="Cerrar aviso"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain touch-pan-y custom-scrollbar p-6 text-sm space-y-4 text-text-secondary"
          onTouchStart={onContentTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <p>
            <strong>Glucode es un simulador diseñado con fines puramente educativos y de aprendizaje.</strong>{' '}
            El metabolismo humano es extremadamente complejo y la glucosa no depende únicamente de los hidratos ingeridos y la insulina administrada.
          </p>

          <div>
            <p className="mb-1">Existen decenas de factores diarios que nuestra aplicación no puede medir ni contemplar, tales como:</p>
            <ul className="list-disc pl-5 space-y-1 text-text-muted">
              <li>El estrés y fluctuaciones hormonales (cortisol, adrenalina...).</li>
              <li>La cantidad de grasas, proteínas y fibra de tu comida.</li>
              <li>El ejercicio físico reciente y la tasa metabólica.</li>
              <li>La calidad de tu descanso y los ritmos circadianos.</li>
            </ul>
          </div>

          <p>
            Las gráficas que verás son <strong>estimaciones matemáticas orientativas</strong>. Nunca uses Glucode como única referencia para tomar decisiones médicas críticas o modificar tu pauta de insulina sin consultar con tu equipo médico.
          </p>

          <div className="pt-2 border-t border-border">
            <p className="font-bold mb-1 text-text-strong">Responsabilidad del Usuario:</p>
            <p>
              Consulte siempre a un profesional sanitario además de utilizar esta aplicación y antes de tomar cualquier decisión médica. El uso inadecuado de la aplicación, así como introducir datos incorrectos o irreales, puede causar riesgos adversos graves para la salud.
            </p>
            <p className="mt-2">
              El paciente es el único responsable de la información introducida, así como del uso que haga de los datos resultantes. La aplicación Glucode no se hace responsable de las consecuencias derivadas de un uso indebido de las simulaciones.
            </p>
          </div>
        </div>

        <div
          className="shrink-0 p-4 border-t flex justify-end gap-3 bg-surface-alt border-border-subtle"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-5 min-h-11 font-bold rounded-md transition-all duration-150 bg-control-secondary text-text-secondary hover:bg-border-strong"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="px-5 min-h-11 font-bold rounded-md transition-all duration-150 bg-dark-surface text-on-primary shadow-sm hover:bg-dark-surface-alt"
          >
            He leído y acepto
          </button>
        </div>
      </div>
    </div>
  );
};
