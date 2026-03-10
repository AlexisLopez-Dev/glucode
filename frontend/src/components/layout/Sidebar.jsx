import { Link } from 'react-router-dom';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* Overlay oscuro (Solo visible en móvil cuando el menú está abierto) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 ease-in-out overflow-hidden shrink-0
        ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-0 md:translate-x-0'}
      `}>
        <div className="p-8 pb-4 w-64">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            Glucode<span className="text-blue-600">.</span>
          </h1>
        </div>
        <nav className="mt-4 flex flex-col gap-2 px-4 flex-1 w-64">
            <Link 
                onClick={() => (window.innerWidth < 768) && closeSidebar()} 
                to="/dashboard" 
                className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-3"
            >
                📊 Simulador
            </Link>
            
            <Link 
                onClick={() => (window.innerWidth < 768) && closeSidebar()} 
                to="#" 
                className="text-gray-500 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3"
            >
                🕒 Historial
            </Link>
        </nav>
      </aside>
    </>
  );
};