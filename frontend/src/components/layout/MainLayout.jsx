import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NAV_ITEMS } from '../../config/navigation';

/**
 * MainLayout — Shell de la app autenticada (sidebar + topbar + contenido)
 *
 * Persiste el estado abierto/cerrado del sidebar en localStorage.
 * En móvil el sidebar se superpone; en lg+ puede permanecer visible.
 */
export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const stored = localStorage.getItem('sidebarOpen');
    if (stored !== null) return stored === 'true';
    return window.innerWidth >= 1024;
  });

  const toggleSidebar = () =>
    setIsSidebarOpen(prev => {
      const next = !prev;
      localStorage.setItem('sidebarOpen', String(next));
      return next;
    });
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    localStorage.setItem('sidebarOpen', 'false');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-alt font-sans">
      <div className="hidden md:flex">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 relative">
        <main className="flex-1 overflow-y-auto pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))]">
          <Topbar />
          <Outlet />
        </main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 flex md:hidden z-50
                   h-[calc(3.5rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)]
                   bg-dark-surface border-t border-dark-surface-alt shadow-lg"
        aria-label="Navegación principal"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150
               ${isActive ? 'text-white' : 'text-dark-text-muted'}`
            }
          >
            <item.Icon className="w-6 h-6" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
