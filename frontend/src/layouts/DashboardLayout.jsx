import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import EmergencyModal from "../components/EmergencyModal";

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300
      /* LIGHT MODE: Standard Light Grey (Not Cream) */
      bg-slate-50 
      /* DARK MODE: Deep Navy */
      dark:bg-[#0f172a]
    ">
      
      {/* 1. Modal (Global Overlay) */}
      <EmergencyModal 
        isOpen={isEmergencyOpen} 
        onClose={() => setIsEmergencyOpen(false)} 
      />

      {/* 2. Sidebar (Fixed/Relative height) */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* 3. Main Content Wrapper */}
      {/* CHANGE: Added 'overflow-y-auto' HERE. This makes the whole right side scroll. */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        
        {/* Navbar is now part of the scroll flow */}
        <DashboardNavbar 
           toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
           onEmergencyClick={() => setIsEmergencyOpen(true)}
        />
        
        {/* Main content just expands */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;