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
  FilePlus,
  Logs
} from "lucide-react";
import { useAuth } from "../context/Authcontext";


const CITIZEN_LINKS = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: FilePlus, label: "File Complaint", path: "/complaint" },
  { icon: FileText, label: "My Cases", path: "/cases" },
  { icon: Map, label: "Safety Map", path: "/map" },
  { icon: MessageSquare, label: "Legal Assistant", path: "/chat" },
  { icon: Logs, label: "Emergency Logs", path: "/emergency-logs"}
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
    <>
      {/* 1. MOBILE BACKDROP 
        Only visible on mobile (md:hidden) when sidebar is OPEN (!isCollapsed).
        Clicking it closes the sidebar.
      */}
      {!isCollapsed && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* 2. SIDEBAR CONTAINER 
        - Mobile: fixed, inset-0, z-50. Hidden via -translate-x-full when collapsed.
        - Desktop: relative (pushes content), translate-x-0 (always visible). 
      */}
      <aside 
        className={`
          h-screen flex flex-col border-r transition-all duration-300 ease-in-out
          bg-[#FFFAF0] border-orange-100 
          dark:bg-[#111827] dark:border-slate-800 dark:text-slate-400
          
          /* --- MOBILE STYLES (Overlay) --- */
          fixed inset-y-0 left-0 z-50
          ${isCollapsed ? "-translate-x-full" : "translate-x-0 w-64 shadow-2xl"}

          /* --- DESKTOP STYLES (Push) --- */
          md:relative md:translate-x-0 md:shadow-none
          ${isCollapsed ? "md:w-20" : "md:w-60"}
        `}
      >
        {/* Header / Logo */}
        <div className={`h-20 flex items-center border-b transition-colors shrink-0
          border-orange-100 dark:border-slate-800
          ${isCollapsed ? "md:justify-center px-4 md:px-0" : "px-6"}
        `}>
          <div className="p-1.5 bg-orange-100 dark:bg-orange-500/10 rounded-lg shrink-0">
            <Scale className="w-5 h-5 text-orange-600 dark:text-orange-500" />
          </div>
          {/* Text is hidden on Desktop if collapsed, but visible on Mobile Open */}
          <span className={`ml-3 font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden text-slate-800 dark:text-white font-serif-heading
            ${isCollapsed ? "md:hidden" : "block"}
          `}>
            Nyaya<span className="text-orange-600">Sahayak</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none">
          {/* Label: Hidden on Desktop Collapsed */}
          <div className={`px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-orange-400 dark:text-slate-500
             ${isCollapsed ? "md:hidden" : "block"}
          `}>
            {roleLabel} Menu
          </div>
          
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                // On mobile, close sidebar after clicking a link
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-bold transition-all duration-200 group relative
                ${isActive
                  ? "text-orange-800 bg-orange-50 dark:from-white dark:to-slate-200 dark:text-slate-900 shadow-sm border border-orange-100 dark:border-transparent" 
                  : "text-slate-600 hover:bg-white hover:text-orange-800 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                } 
                ${isCollapsed ? "md:justify-center" : ""}`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              
              {/* Label Logic:
                  - Mobile: Always show (since sidebar is either hidden or full width)
                  - Desktop: Show only if NOT collapsed 
              */}
              <span className={`whitespace-nowrap ${isCollapsed ? "md:hidden" : "block"}`}>
                {item.label}
              </span>

              {/* Tooltip for Desktop Mini Sidebar */}
              {isCollapsed && (
                <span className="hidden md:block absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Toggle Button (Visible on Desktop to toggle mini/full) */}
        {/* On Mobile, we usually use the Navbar hamburger, but we can keep this for closing */}
        <button 
          onClick={toggleSidebar}
          className={`absolute -right-3 top-20 rounded-full p-1 shadow-sm transition-colors z-50 border
            bg-[#FFFAF0] border-orange-200 text-orange-400 hover:bg-orange-100
            dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white
            ${isCollapsed ? "rotate-180" : ""}
            /* Optional: Hide this button on mobile if you prefer only clicking backdrop/navbar to close */
            md:flex
          `}
        >
          <ChevronLeft className="w-3 h-3" />
        </button>

        {/* Footer */}
        <div className="p-3 border-t border-orange-100 dark:border-slate-800 transition-colors bg-orange-50/30 dark:bg-transparent mt-auto shrink-0">
          <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors
            ${isCollapsed ? "md:justify-center" : ""}
          `}>
            <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold bg-orange-500 text-white shadow-sm dark:bg-slate-700">
              {getUserInitials()}
            </div>
            
            <div className={`flex-1 min-w-0 overflow-hidden ${isCollapsed ? "md:hidden" : "block"}`}>
               <Link to='/profile'>
                  <p className="text-sm font-bold truncate text-slate-800 dark:text-white">
                    {getUserName()}
                  </p>
                  <p className="text-xs truncate text-slate-500 dark:text-slate-500 font-medium">
                    {roleLabel} Account
                  </p>
               </Link>
            </div>

            <button 
              onClick={handleLogout} 
              className={`p-1.5 rounded-md cursor-pointer text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors
                ${isCollapsed ? "md:hidden" : "block"}
              `}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;