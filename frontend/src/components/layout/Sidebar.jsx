import { Link } from 'react-router-dom';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* Overlay oscuro */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 fixed md:static inset-y-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 ease-in-out overflow-hidden shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:w-20 md:translate-x-0'}
      `}>
        
        {/* Logo */}
        <div className="h-24 flex items-center justify-center border-b border-transparent shrink-0">
          <Link 
            to="/dashboard" 
            onClick={() => window.innerWidth < 768 && closeSidebar()}
            className="focus:outline-none"
            title="Ir al inicio"
          >
            <h1 className={`font-black text-gray-900 tracking-tighter transition-all whitespace-nowrap ${isOpen ? 'text-4xl' : 'text-3xl'}`}>
              {isOpen ? <>Glucode<span className="text-blue-600">.</span></> : <>G<span className="text-blue-600">.</span></>}
            </h1>
          </Link>
        </div>

        {/* Secciones */}
        <nav className="mt-6 flex flex-col gap-2 px-3 flex-1">
          <Link 
            onClick={() => window.innerWidth < 768 && closeSidebar()} 
            to="/dashboard" 
            title="Simulador"
            className="bg-blue-50 text-blue-700 p-3 rounded-xl font-bold transition-colors flex items-center overflow-hidden"
          >
            <div className="w-8 flex items-center justify-center shrink-0"><span className="text-xl">📊</span></div>
            <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              Simulador
            </span>
          </Link>

          <Link 
            onClick={() => window.innerWidth < 768 && closeSidebar()} 
            to="/history" 
            title="Historial"
            className="text-gray-500 hover:bg-gray-50 p-3 rounded-xl font-medium transition-colors flex items-center overflow-hidden"
          >
            <div className="w-8 flex items-center justify-center shrink-0"><span className="text-xl">🕒</span></div>
            <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              Historial
            </span>
          </Link>
        </nav>
      </aside>
    </>
  );
};