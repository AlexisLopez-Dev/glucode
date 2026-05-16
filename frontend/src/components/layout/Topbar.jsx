import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

export const Topbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-24 flex items-center justify-between px-6 md:px-10 bg-surface border-b border-border shadow-sm z-10 shrink-0">
      
      <div className="flex items-center gap-4">

        <button 
          onClick={toggleSidebar} 
          className="p-2 -ml-2 text-text-muted hover:bg-surface-elevated hover:text-primary rounded-xl transition-colors focus:outline-none"
          aria-label="Abrir o cerrar menú"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-text-strong tracking-tight">Panel Principal</h2>
      </div>

      <div className="relative">
        
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary-subtle-strong text-primary flex items-center justify-center font-bold text-xl shadow-inner hover:ring-2 hover:ring-primary-muted transition-all shrink-0 focus:outline-none"
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
          <div className="absolute right-0 mt-3 w-64 bg-surface rounded-2xl shadow-2xl border border-border z-50 overflow-hidden transform origin-top-right transition-all">
            
            <div className="p-5 border-b border-border-subtle bg-surface-alt/80">
              <p className="font-bold text-text-strong truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate mt-1">{user?.email}</p>
            </div>
            
            <div className="p-3">
              <button
                onClick={async () => {
                  await logout();
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm font-bold text-danger-text hover:bg-danger-subtle hover:text-danger-hover-text rounded-xl transition-all flex items-center gap-3"
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