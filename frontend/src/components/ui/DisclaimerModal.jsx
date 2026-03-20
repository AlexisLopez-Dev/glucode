export const DisclaimerModal = ({ isOpen, onClose, onAccept }) => {

  if (!isOpen) return null;

  const closeOnOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={closeOnOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform transition-all">
        
        {/* Cabecera */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-amber-50">
            <h3 className="font-bold text-amber-800 flex items-center gap-2">
                <span className="text-xl">⚠️</span> Aviso Médico Importante
            </h3>
            <button 
                type="button"
                onClick={onClose} 
                className="text-amber-400 hover:text-amber-700 transition-colors text-xl font-bold p-1"
            >
                ✕
            </button>
        </div>
        
        {/* Contenido */}
        <div className="p-6 text-sm text-gray-600 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <p>
                <strong>Glucode es un simulador diseñado con fines puramente educativos y de aprendizaje.</strong> El metabolismo humano es extremadamente complejo y la glucosa no depende únicamente de los hidratos ingeridos y la insulina administrada.
            </p>
            
            <div>
                <p className="mb-1">Existen decenas de factores diarios que nuestra aplicación no puede medir ni contemplar, tales como:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-500">
                <li>El estrés y fluctuaciones hormonales (cortisol, adrenalina...).</li>
                <li>La cantidad de grasas, proteínas y fibra de tu comida.</li>
                <li>El ejercicio físico reciente y la tasa metabólica.</li>
                <li>La calidad de tu descanso y los ritmos circadianos.</li>
                </ul>
            </div>

            <p>
                Las gráficas que verás son <strong>estimaciones matemáticas orientativas</strong>. Nunca uses Glucode como única referencia para tomar decisiones médicas críticas o modificar tu pauta de insulina sin consultar con tu equipo médico.
            </p>

            <div className="pt-2 border-t border-gray-200">
                <p className="font-bold text-gray-700 mb-1">Responsabilidad del Usuario:</p>
                <p>
                Consulte siempre a un profesional sanitario además de utilizar esta aplicación y antes de tomar cualquier decisión médica. El uso inadecuado de la aplicación, así como introducir datos incorrectos o irreales, puede causar riesgos adversos graves para la salud. 
                </p>
                <p className="mt-2">
                El paciente es el único responsable de la información introducida, así como del uso que haga de los datos resultantes. La aplicación Glucode no se hace responsable de las consecuencias derivadas de un uso indebido de las simulaciones.
                </p>
            </div>
        </div>
        
        {/* Barra inferior */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
           <button 
              type="button"
              onClick={onClose} 
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
           >
              Cancelar
           </button>
           <button 
              type="button"
              onClick={onAccept} 
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
           >
              He leído y acepto
           </button>
        </div>

      </div>
    </div>
  );
};