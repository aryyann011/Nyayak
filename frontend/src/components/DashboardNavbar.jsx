import React from "react";
import { Bell, Search, Plus, Sun, Moon, Menu, Calendar, Briefcase } from "lucide-react";
import { useTheme } from "../context/themeContext";
import { useAuth } from "../context/Authcontext"; // Import Auth to check Role

const DashboardNavbar = ({ toggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth(); // Get the current user
  
  // Safe check for role (default to citizen if missing)
  const role = user?.user_metadata?.role || 'citizen';

  return (
    <header className="h-20 bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 px-8 flex items-center justify-between transition-colors duration-300">
      
      {/* Left: Search or Menu Trigger */}
      <div className="flex items-center gap-4">
        {toggleSidebar && (
           <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
             <Menu size={24} />
           </button>
        )}
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder={role === 'lawyer' ? "Search case files, clients..." : "Search..."}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>
        
        {/* DYNAMIC BUTTONS BASED ON ROLE */}
        {role === 'lawyer' ? (
          <div className="hidden sm:flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-sm font-bold rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
             </button>
             <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-slate-900/10">
                <Briefcase className="w-4 h-4" />
                <span>New Case</span>
             </button>
          </div>
        ) : (
          <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-slate-900/10">
            <Plus className="w-4 h-4" />
            <span>New Complaint</span>
          </button>
        )}

      </div>
    </header>
  );
};

export default DashboardNavbar;