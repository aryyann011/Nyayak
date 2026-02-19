import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar"; // ✅ UPDATED IMPORT
import { User, Shield, Key, Bell, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/Authcontext";

const ProfileLayout = () => {
  const {user} = useAuth()
  const menuItems = [
    { icon: User, label: "Edit Profile", path: "/profile" },
    { icon: Shield, label: "Security", path: "/profile/security" },
    // { icon: Key, label: "Password", path: "/profile/password" },
    // { icon: Bell, label: "Notifications", path: "/profile/notifications" },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0B1120] transition-colors duration-300">
      
      {/* 1. SETTINGS SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-gray-800 z-50 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
          <NavLink to={user.user_metadata?.role === "citizen" ? "/dashboard"  : "/lawyer/legal-dashboard"}
          lassName="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">Back to App</span>
          </NavLink>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          <div className="px-4 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Account Settings
          </div>
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/profile"}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                ${isActive 
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-center text-slate-400">NyayaSahayak ID v1.0</p>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="ml-64 min-h-screen flex flex-col">
        
        {/* ✅ USE NEW NAVBAR (No toggle needed here as sidebar is fixed) */}
        <DashboardNavbar />

        <main className="flex-1 p-8">
           <Outlet />
        </main>

      </div>
    </div>
  );
};

export default ProfileLayout;