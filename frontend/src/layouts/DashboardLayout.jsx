import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Bell, Search, Plus, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/themeContext";

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    // Base Background: Light Gray (#F3F4F6) -> Dark Navy (#0B1120)
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0B1120] transition-colors duration-300">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <div 
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        {/* Header */}
        <header className="h-20 bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 px-8 flex items-center justify-between transition-colors duration-300">
          
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for cases..." 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* THEME TOGGLE BUTTON */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-transparent dark:border-gray-700"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>
            
            <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-slate-900/10">
              <Plus className="w-4 h-4" />
              <span>New Complaint</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;