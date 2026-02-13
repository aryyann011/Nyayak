import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  ShieldAlert, 
  Map, 
  MessageSquare, 
  LogOut,
  Scale,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: FileText, label: "My Cases", path: "/cases" },
    { icon: ShieldAlert, label: "Emergency", path: "/sos" },
    { icon: Map, label: "Safety Map", path: "/map" },
    { icon: MessageSquare, label: "Legal Assistant", path: "/chat" },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 ease-in-out border-r
        ${isCollapsed ? "w-20" : "w-64"}
        bg-white border-slate-200 text-slate-600 
        dark:bg-[#111827] dark:border-slate-800 dark:text-slate-400
      `}
    >
      {/* 1. Header / Logo */}
      <div className={`h-20 flex items-center border-b transition-colors
        border-slate-100 dark:border-slate-800
        ${isCollapsed ? "justify-center px-0" : "px-6"}
      `}>
        <div className="p-1.5 bg-orange-50 dark:bg-orange-500/10 rounded-lg shrink-0">
          <Scale className="w-5 h-5 text-orange-600 dark:text-orange-500" />
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden text-slate-800 dark:text-white">
            NyayaSahayak
          </span>
        )}
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {!isCollapsed && (
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Main Menu
          </div>
        )}
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
              ${isActive
                ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20"
                : "hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            
            {!isCollapsed ? (
              <span className="whitespace-nowrap">{item.label}</span>
            ) : (
              <span className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 3. The Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 rounded-full p-1 shadow-sm transition-colors z-50 border
          bg-white border-slate-200 text-slate-500 hover:bg-slate-50
          dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* 4. Footer / User Profile */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer
          hover:bg-slate-50 dark:hover:bg-slate-800/50
          ${isCollapsed ? "justify-center" : ""}
        `}>
          <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold
            bg-slate-200 text-slate-600 
            dark:bg-slate-700 dark:text-slate-300
          ">
            RV
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium truncate text-slate-900 dark:text-white">Rahul Verma</p>
              <p className="text-xs truncate text-slate-500 dark:text-slate-400">Citizen</p>
            </div>
          )}
          {!isCollapsed && <LogOut className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors shrink-0" />}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;