import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  LogOut,
  Scale,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard, 
  FileText, 
  Map, 
  MessageSquare,
  FilePlus // New Icon for Complaint
} from "lucide-react";
import { useAuth } from "../context/Authcontext";

const CITIZEN_LINKS = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: FilePlus, label: "File Complaint", path: "/complaint" },
  { icon: FileText, label: "My Cases", path: "/cases" },
  { icon: Map, label: "Safety Map", path: "/map" },
  { icon: MessageSquare, label: "Legal Assistant", path: "/chat" },
];

const Sidebar = ({ isCollapsed, toggleSidebar, links = CITIZEN_LINKS, roleLabel = "Citizen" }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const getUserInitials = () => {
    const name = user?.user_metadata?.full_name || "User";
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getUserName = () => {
     return user?.user_metadata?.full_name || "Account";
  };

  return (
    // CHANGE 1: Removed 'fixed left-0 top-0'. Added 'relative' and 'shrink-0'.
    <aside 
      className={`relative h-screen flex flex-col z-50 transition-all duration-300 ease-in-out border-r shrink-0
        ${isCollapsed ? "w-20" : "w-64"}
        bg-[#FFFAF0] border-orange-100 
        dark:bg-[#111827] dark:border-slate-800 dark:text-slate-400
      `}
    >
      {/* 1. Header / Logo */}
      <div className={`h-20 flex items-center border-b transition-colors
        border-orange-100 dark:border-slate-800
        ${isCollapsed ? "justify-center px-0" : "px-6"}
      `}>
        <div className="p-1.5 bg-orange-100 dark:bg-orange-500/10 rounded-lg shrink-0">
          <Scale className="w-5 h-5 text-orange-600 dark:text-orange-500" />
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden text-slate-800 dark:text-white font-serif-heading">
            Nyaya<span className="text-orange-600">Sahayak</span>
          </span>
        )}
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {!isCollapsed && (
          <div className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-orange-400 dark:text-slate-500">
            {roleLabel} Menu
          </div>
        )}
        
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-bold transition-all duration-200 group relative
              ${isActive
                ? "text-orange-800 bg-orange-50 dark:from-white dark:to-slate-200 dark:text-slate-900 shadow-sm border border-orange-100 dark:border-transparent" 
                : "text-slate-600 hover:bg-white hover:text-orange-800 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`
            }
          >
            <item.icon className={`w-5 h-5 shrink-0 ${!isCollapsed ? "" : ""}`} />
            
            {!isCollapsed ? (
              <span className="whitespace-nowrap">{item.label}</span>
            ) : (
              <span className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 3. Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 rounded-full p-1 shadow-sm transition-colors z-50 border
          bg-[#FFFAF0] border-orange-200 text-orange-400 hover:bg-orange-100
          dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* 4. Footer */}
      <div className="p-3 border-t border-orange-100 dark:border-slate-800 transition-colors bg-orange-50/30 dark:bg-transparent">
        <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors
          ${isCollapsed ? "justify-center" : ""}
        `}>
          <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold
    bg-orange-500 text-white shadow-sm
    dark:bg-slate-700 dark:text-white
">

            {getUserInitials()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 overflow-hidden">
               <Link to='/profile'>
                  <p className="text-sm font-bold truncate text-slate-800 dark:text-white">
                    {getUserName()}
                  </p>
                  <p className="text-xs truncate text-slate-500 dark:text-slate-500 font-medium">
                    {roleLabel} Account
                  </p>
               </Link>
            </div>
          )}
          {!isCollapsed && (
            <button 
              onClick={handleLogout} 
              className="p-1.5 rounded-md cursor-pointer text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
