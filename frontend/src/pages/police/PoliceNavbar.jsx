import React from "react";
import { Menu, Bell, User } from "lucide-react";

const PoliceNavbar = ({ toggleSidebar, isSidebarCollapsed }) => {
  return (
    <header className="h-[52px] bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm">
      
      {/* LEFT: Toggle & Branding */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 cursor-pointer text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
          title={isSidebarCollapsed ? "Expand Menu" : "Collapse Menu"}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
        
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800 leading-none">DISPATCH COMMAND</span>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
            Unit 402 • Sector 4
          </span>
        </div>
      </div>

      {/* RIGHT: Status & Profile */}
      <div className="flex items-center gap-4">
        
        {/* Unit Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-emerald-100 rounded-md">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Online</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Minimal Profile (Avatar only) */}
      </div>

    </header>
  );
};

export default PoliceNavbar;