import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

/**
 * Topbar — Barra superior de la zona autenticada
 *
 * Muestra avatar con inicial del usuario y menú desplegable con cierre de sesión.
 */
export const Topbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-[56px] flex items-center justify-end px-4 md:px-6 border-b shrink-0 md:sticky md:top-0 z-30 bg-surface border-border">
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-150 focus:outline-none
                     bg-primary-subtle-strong text-primary shadow-inner
                     hover:outline-2 hover:outline-primary-muted"
          title="Menú de perfil"
        >
          {user?.name?.charAt(0).toUpperCase()}
        </button>

        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}

        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-64 rounded-2xl border z-50 overflow-hidden animate-fade-in bg-surface border-border shadow-2xl">
            <div className="p-5 border-b border-border-subtle bg-surface-alt">
              <p className="font-bold truncate text-text-strong">{user?.name}</p>
              <p className="text-xs truncate mt-1 text-text-muted">{user?.email}</p>
            </div>
            <div className="p-3">
              <button
                onClick={async () => {
                  await logout();
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all duration-150 flex items-center gap-3
                           text-danger-text hover:bg-danger-subtle hover:text-danger-hover-text"
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
