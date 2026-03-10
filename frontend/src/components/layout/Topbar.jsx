import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

export const Topbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-24 flex items-center justify-between px-6 md:px-10 bg-white border-b border-gray-200 shadow-sm z-10 shrink-0">
      
      <div className="flex items-center gap-4">

        <button 
          onClick={toggleSidebar} 
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-xl transition-colors focus:outline-none"
          aria-label="Abrir o cerrar menú"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Panel Principal</h2>
      </div>

      <div className="relative">
        
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl shadow-inner hover:ring-2 hover:ring-blue-300 transition-all shrink-0 focus:outline-none"
          title="Menú de perfil"
        >
          {user?.name?.charAt(0).toUpperCase()}
        </button>

        {/* Capa invisible a pantalla completa para detectar clics fuera del menú */}
        {isDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)}
          ></div>
        )}

        {/* Menú desplegable */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden transform origin-top-right transition-all">
            
            <div className="p-5 border-b border-gray-100 bg-gray-50/80">
              <p className="font-bold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate mt-1">{user?.email}</p>
            </div>
            
            <div className="p-3">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all flex items-center gap-3"
              >
                Cerrar Sesión
              </button>
            </div>

          </div>
        )}

      </div>
    </header>
  );
};