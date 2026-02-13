import React, { useState } from "react";
import PoliceSidebar from "../pages/police/PoliceSidebar"; // <--- NEW IMPORT
import PoliceNavbar from "../pages/police/PoliceNavbar";

const PoliceLayout = ({ children }) => {
  // Default to FALSE (Completely Hidden)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden">
      
      {/* The Drawer Sidebar (Hidden by default) */}
      <PoliceSidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Navbar with Hamburger Menu */}
        <PoliceNavbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarCollapsed={!isSidebarOpen}
        />
        
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PoliceLayout;