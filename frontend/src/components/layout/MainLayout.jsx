import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const MainLayout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
            <Topbar toggleSidebar={toggleSidebar} />

            <Outlet />
            
        </div>
    </div>
  );
};