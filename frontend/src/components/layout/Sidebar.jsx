import { Link, NavLink } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { IconChevronLeft } from '../icons/Icons';
import { NAV_ITEMS } from '../../config/navigation';

/**
 * Sidebar — Navegación lateral colapsable
 *
 * Props: isOpen, closeSidebar, toggleSidebar (controladas por MainLayout).
 * En móvil muestra overlay al abrir; en escritorio se reduce a iconos.
 */
export const Sidebar = ({ isOpen, closeSidebar, toggleSidebar }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden bg-overlay-sidebar backdrop-blur-[2px]"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`flex flex-col h-full bg-dark-surface transition-[width] duration-300 ease-in-out overflow-hidden shrink-0
          ${isOpen ? 'w-[200px]' : 'w-12'}`}
        data-open={isOpen}
      >
        <div className="h-16 flex items-center justify-center border-b border-dark-surface-alt shrink-0">
          <Link
            to="/dashboard"
            className="text-white focus:outline-none"
            title="Ir al inicio"
          >
            <Logo
              variant={isOpen ? 'full' : 'icon'}
              theme="dark"
              size="lg"
              className="transition-all duration-300"
            />
          </Link>
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.to} className="relative group">
              <NavLink
                to={item.to}
                title={item.label}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg overflow-hidden min-h-11 py-2.5 transition-all duration-150 ease-out relative border-l-[3px]
                   ${isOpen ? 'justify-start pl-[13px] pr-3' : 'justify-center px-0'}
                   ${isActive
                     ? 'border-l-primary bg-dark-surface-alt text-dark-text'
                     : 'border-transparent text-dark-text-muted hover:bg-dark-surface-alt'
                   }`
                }
              >
                <span className="shrink-0 flex items-center justify-center w-5 h-5">
                  <item.Icon className="w-5 h-5" />
                </span>
                <span
                  className={`font-semibold text-sm whitespace-nowrap transition-opacity duration-200 overflow-hidden
                    ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
                >
                  {item.label}
                </span>
              </NavLink>

              {!isOpen && (
                <div
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5
                             text-xs font-semibold rounded-md shadow-lg bg-dark-surface-alt text-dark-text
                             opacity-0 group-hover:opacity-100 pointer-events-none
                             transition-opacity duration-150 whitespace-nowrap z-50"
                >
                  {item.label}
                </div>
              )}
            </div>
          ))}
        </nav>

        {toggleSidebar && (
          <div
            className={`shrink-0 flex items-center border-t border-dark-surface-alt
              ${isOpen ? 'justify-end px-3 py-2' : 'justify-center py-2'}`}
          >
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center min-w-9 min-h-9 rounded-lg transition-all duration-150 focus:outline-none
                         text-dark-text-muted hover:bg-dark-surface-alt hover:text-dark-text"
              title={isOpen ? 'Contraer menú' : 'Expandir menú'}
              aria-label={isOpen ? 'Contraer menú' : 'Expandir menú'}
            >
              <IconChevronLeft
                className={`w-5 h-5 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
              />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
