import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export const Topbar = ({ toggleSidebar }) => {

  const { user, logout } = useContext(AuthContext);

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

      <div className="flex items-center gap-4 pl-6">
        <div className="text-right hidden sm:block">
            <p className="font-bold text-sm text-gray-800">{user?.name}</p>
            <button
                onClick={logout}
                className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors"
            >
                Cerrar Sesión
            </button>
        </div>
        <div 
          onClick={logout} 
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl shadow-inner cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all shrink-0"
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};