import React, { useState } from "react";
import { Bell, Search, Sun, Moon, Menu, Calendar, Briefcase, Radio, Siren } from "lucide-react"; 
import { useTheme } from "../context/themeContext";
import { useAuth } from "../context/Authcontext";
import { useNotification } from "../context/NotificationContext"; // Import Context
import NotificationCenter from "./NotificationCenter"; // Import New Component

const DashboardNavbar = ({ toggleSidebar, onEmergencyClick }) => { 
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  // Connect to Context
  const { allNotifications } = useNotification();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const role = user?.user_metadata?.role || 'citizen';
  
  // Count unread items
  const unreadCount = allNotifications.filter(n => !n.is_read).length;

  const getPlaceholder = () => {
    if (role === 'lawyer') return "Search case files, clients...";
    if (role === 'police') return "Search dispatch logs, units...";
    return "Search complaints...";
  };

  return (
    <header className="h-16 px-8 flex items-center justify-between border-b transition-colors duration-300 shrink-0
      bg-white border-slate-200
      dark:bg-[#111827] dark:border-slate-800
      relative
    ">
      
      {/* Left: Search or Menu */}
      <div className="flex items-center gap-4">
        {toggleSidebar && (
           <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg transition-colors
             text-slate-500 hover:bg-slate-100 
             dark:hover:bg-slate-800
           ">
             <Menu size={24} />
           </button>
        )}
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={getPlaceholder()}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all border border-transparent
              bg-slate-50 text-slate-700 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-200
              dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900 dark:focus:border-slate-700
            "
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl transition-all
            bg-slate-50 text-slate-600 hover:bg-slate-100
            dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700
          "
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* NOTIFICATION BELL */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 rounded-xl transition-all
              ${isNotifOpen 
                ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20' 
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}
            `}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-[#111827] animate-in zoom-in">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN COMPONENT */}
          <NotificationCenter 
            isOpen={isNotifOpen} 
            onClose={() => setIsNotifOpen(false)} 
          />
        </div>
        
        {/* DYNAMIC ROLE BUTTONS */}
        {role === 'lawyer' ? (
          <div className="hidden sm:flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-sm font-bold rounded-xl hover:bg-orange-100 transition-all">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
             </button>
             <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg">
                <Briefcase className="w-4 h-4" />
                <span>New Case</span>
             </button>
          </div>
        ) : role === 'police' ? (
           <div className="hidden sm:flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Unit 402: Online
             </div>
             <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
                <Radio className="w-4 h-4" />
                <span>Dispatch Log</span>
             </button>
          </div>
        ) : (
          <button 
            onClick={onEmergencyClick}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
          >
            <Siren className="w-4 h-4" />
            <span>SOS / Emergency</span>
          </button>
        )}

      </div>
    </header>
  );
};

export default DashboardNavbar;