import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { 
  LogOut,
  Scale,
  X,
  LayoutDashboard, 
  FileText, 
  Radio,
  Settings,
  User
} from "lucide-react";
import { useAuth } from "../../context/Authcontext";

const PoliceSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getUserInitials = () => {
    const name = user?.user_metadata?.full_name || "Officer";
    return name.substring(0, 2).toUpperCase();
  };

  const POLICE_LINKS = [
    { icon: LayoutDashboard, label: "Dispatch Map", path: "/police-dashboard" },
    { icon: FileText, label: "Incident Reports", path: "/police/reports" },
    { icon: User, label: "Profile", path: "/police/profile" },
    { icon: Radio, label: "Unit Logs", path: "/police/logs" },
    { icon: Settings, label: "Settings", path: "/police/settings" },
  ];

  return (
    <>
      {/* 1. OVERLAY (Click to close) */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        />
      )}

      {/* 2. SIDEBAR DRAWER */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-64 z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl border-r
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          bg-[#FFFAF0] border-orange-100 text-slate-600
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-orange-100 rounded-lg shrink-0">
              <Scale className="w-5 h-5 text-orange-600" />
            </div>
            <span className="font-bold text-lg text-slate-800 font-serif-heading">
              Nyaya<span className="text-orange-600">Sahayak</span>
            </span>
          </div>
          <button onClick={toggleSidebar} className="p-1 cursor-pointer hover:bg-orange-100 rounded-md text-slate-400 hover:text-orange-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-orange-400">
            Police Menu
          </div>
          
          {POLICE_LINKS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={toggleSidebar} // Auto-close on mobile/selection
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold transition-all duration-200
                ${isActive
                  ? "bg-orange-100 text-orange-800 shadow-sm" 
                  : "text-slate-600 hover:bg-orange-50 hover:text-orange-800"
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-orange-100 bg-orange-50/50">
          <div className="flex cursor-pointer items-center gap-3 p-2 rounded-lg">
            <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold bg-slate-800 text-white shadow-sm">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-slate-800">
                {user?.user_metadata?.full_name || "Officer"}
              </p>
              <p className="text-xs truncate text-slate-500 font-medium">
                Unit 402 • Active
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 cursor-pointer rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PoliceSidebar;
