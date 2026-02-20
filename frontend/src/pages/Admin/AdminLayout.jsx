import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  ShieldCheck, 
  BarChart3, 
  Menu, 
  X, 
  LogOut, 
  Settings,
  Search,
  Bell,
  Sun,
  Moon
} from "lucide-react";

import VerificationPortal from "./VerificationPortal";
import EarningDashboard from "./EarningDashboard";
import { useTheme } from "../../context/themeContext";
import { supabase } from "../../lib/supabase";

// --- IN-FILE COMPONENT: HUMANIZED TOGGLE ---
const HumanizedToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-5 flex items-center bg-slate-200 dark:bg-slate-800 rounded-full p-0.5 cursor-pointer transition-colors duration-300"
    >
      <motion.div
        animate={{ x: isDark ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-3.5 h-3.5 bg-white dark:bg-orange-500 rounded-full shadow-sm flex items-center justify-center z-10"
      >
        {isDark ? <Moon size={8} className="text-white" /> : <Sun size={8} className="text-orange-500" />}
      </motion.div>
      <div className="absolute inset-0 flex justify-between items-center px-1.5 pointer-events-none">
        <Sun size={6} className={`${isDark ? 'opacity-0' : 'opacity-40'} text-orange-600 transition-opacity`} />
        <Moon size={6} className={`${isDark ? 'opacity-40' : 'opacity-0'} text-slate-400 transition-opacity`} />
      </div>
    </button>
  );
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("verification");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  const menuItems = [
    { id: "verification", label: "Verification", icon: <ShieldCheck size={20} /> },
    { id: "earning", label: "Earnings", icon: <BarChart3 size={20} /> },
  ];

  const handleLogout = async () => {
      try {
          await supabase.auth.signOut();
          toast.success("Logged out successfully");
          navigate("/login");
      } catch (error) {
          console.error("Logout error:", error);
          toast.error("Error logging out");
      }
    };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-500 bg-[#FFFAF0] dark:bg-[#050505] text-slate-900 dark:text-white font-sans selection:bg-orange-500/30">
      
      {/* UNIVERSAL OVERLAY BACKDROP */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* 1. SIDEBAR (Strictly Overlay on all screens) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 
        bg-white dark:bg-[#0B0B0B] border-r border-slate-200 dark:border-white/5 
        transition-transform duration-300 ease-in-out transform shadow-2xl
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-black tracking-tighter">NYAYA ADMIN</h2>
            </div>
            {/* Close Button always visible in sidebar */}
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 mb-6">Command Center</p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false); // Auto-close sidebar on mobile/desktop when tab selected
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm transition-all group relative ${
                  activeTab === item.id 
                    ? "text-orange-600 dark:text-white bg-orange-50 dark:bg-orange-600/10" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                {activeTab === item.id && (
                  <motion.div layoutId="navGlow" className="absolute inset-0 border-l-4 border-orange-600 rounded-r-2xl pointer-events-none" />
                )}
                <span className={activeTab === item.id ? "text-orange-600" : "group-hover:scale-110 transition-transform"}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-200 dark:border-white/5 space-y-2">
            <button className="flex items-center gap-4 w-full px-4 py-3 text-slate-500 font-bold text-sm hover:text-slate-900 dark:hover:text-white transition-all">
              <Settings size={18} /> Settings
            </button>
            <button onClick={handleLogout} className="flex cursor-pointer items-center gap-4 w-full px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* STICKY HEADER - Made thinner (h-14) */}
        <header className="h-14 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 lg:px-8 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl z-30 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu - Always visible now */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search global records..." 
                className="bg-slate-100 dark:bg-white/5 border border-transparent focus:border-orange-500/30 rounded-full pl-10 pr-4 py-1.5 text-sm outline-none transition-all w-64 lg:w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden sm:flex items-center gap-3 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/5">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Mode</span>
               <HumanizedToggle />
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-600 rounded-full ring-2 ring-white dark:ring-[#050505]" />
            </button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black leading-none uppercase tracking-tighter">CHIRABRATA</p>
                <p className="text-[9px] font-bold text-orange-500 uppercase mt-0.5 tracking-widest">Super Admin</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-sm border border-white/20" />
            </div>
          </div>
        </header>

        {/* INNER CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 lg:p-8 min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "verification" ? <VerificationPortal /> : <EarningDashboard />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* FIXED AMBIENT GLOW */}
        <div className="fixed top-0 right-0 w-[40%] h-[40%] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      </main>
    </div>
  );
};

export default AdminLayout;