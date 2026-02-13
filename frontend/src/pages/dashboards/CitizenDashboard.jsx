import React from "react";
import { 
  Search, 
  Send, 
  ShieldAlert, 
  FileText, 
  Map, 
  MapPin, 
  Bot, 
  ChevronRight,
  Clock,
  Activity
} from "lucide-react";

const CitizenDashboard = ({ user }) => {
  const userName = user?.user_metadata?.full_name || "Citizen";

  return (
    <div className="space-y-8 pb-10 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* 1. HERO SECTION (Kept Dark Navy to match Reference Image) */}
      <div className="rounded-[24px] p-8 md:p-10 relative overflow-hidden shadow-lg
                bg-white dark:bg-[#111827]
                text-slate-900 dark:text-white
                transition-colors duration-300">

  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">

    {/* LEFT SIDE */}
    <div className="max-w-2xl w-full">
      
      <h1 className="text-3xl md:text-4xl font-bold mb-3">
        Welcome back, <span className="text-orange-500">{userName}</span>
      </h1>

      <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed transition-colors">
        Your legal safety net is active. How can NyayaSahayak assist you today?
      </p>

      {/* SEARCH BOX */}
      <div className="relative max-w-xl group">

        {/* Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500
                        rounded-xl opacity-10 dark:opacity-20
                        group-hover:opacity-30 transition duration-500 blur"></div>

        <div className="relative flex items-center
                        bg-gray-100 dark:bg-[#1F2937]
                        rounded-xl p-1.5
                        border border-gray-200 dark:border-slate-700
                        transition-colors duration-300">

          <Search className="ml-4 w-5 h-5 text-slate-400" />

          <input 
            type="text"
            placeholder="Ask a legal question (e.g. 'How to file an FIR?')" 
            className="w-full h-12 pl-4 bg-transparent border-none
                       text-slate-900 dark:text-white
                       placeholder-slate-400 dark:placeholder-slate-500
                       focus:ring-0 outline-none transition-colors"
          />

          <button className="bg-orange-600 hover:bg-orange-700
                             text-white p-3 rounded-lg
                             transition-transform active:scale-95">
            <Send className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>

    {/* RIGHT SIDE — AI WIDGET */}
    <div className="hidden lg:block w-[340px]">
      <div className="rounded-2xl p-5 relative shadow-xl
                      bg-gray-50 dark:bg-[#1F2937]
                      border border-gray-200 dark:border-slate-700
                      transition-colors duration-300">

        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-blue-500" />
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              AI Assistant
            </h4>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              "I noticed you have an upcoming hearing on July 15. Tap here to review documents."
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</div>


      {/* 2. FEATURE CARDS (Corrected to be Adaptive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard 
          title="SOS Emergency"
          subtitle="Trigger instant alert"
          icon={<ShieldAlert className="w-6 h-6 text-white" />}
          iconBg="bg-red-500 shadow-red-500/30"
          btnText="Send SOS"
          btnStyle="text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        />
        <ActionCard 
          title="Track Case"
          subtitle="View FIR status"
          icon={<FileText className="w-6 h-6 text-white" />}
          iconBg="bg-orange-500 shadow-orange-500/30"
          btnText="View Timeline"
          btnStyle="text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
        />
        <ActionCard 
          title="Find Station"
          subtitle="Locate nearest help"
          icon={<MapPin className="w-6 h-6 text-white" />}
          iconBg="bg-blue-600 shadow-blue-600/30"
          btnText="Locate Now"
          btnStyle="text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
        />
        <ActionCard 
          title="Crime Map"
          subtitle="Check safety zones"
          icon={<Map className="w-6 h-6 text-white" />}
          iconBg="bg-emerald-600 shadow-emerald-600/30"
          btnText="View Heatmap"
          btnStyle="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
        />
      </div>

      {/* 3. DATA SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Cases */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-[24px] border border-gray-200 dark:border-gray-800 p-8 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Activity className="w-5 h-5 text-slate-400" />
              Active Cases
            </h2>
            <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">View All</button>
          </div>

          <div className="group bg-slate-50 dark:bg-[#1F2937] rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-900/50 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold px-2.5 py-1 rounded-md">Investigation</span>
                  <span className="text-slate-400 text-xs font-mono">FIR #0123456</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cyber Fraud - Credit Card Theft</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" /> Next Hearing
                </p>
                <p className="font-bold text-slate-900 dark:text-white">July 15, 2026</p>
              </div>
            </div>
            
            <div className="relative pt-2">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                <span>Evidence Collection</span>
                <span>60%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[60%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Radar */}
        <div className="bg-white dark:bg-[#111827] rounded-[24px] border border-gray-200 dark:border-gray-800 p-8 shadow-sm flex flex-col transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Safety Radar</h2>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex-1 bg-slate-100 dark:bg-[#1F2937] rounded-2xl overflow-hidden relative group min-h-[240px]">
            <div className="absolute inset-0 opacity-40 dark:opacity-20" style={{ 
                backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
            }}></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4 text-emerald-500" />
                View Full Map
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- FIX: ADAPTIVE ACTION CARD ---
const ActionCard = ({ title, subtitle, icon, iconBg, btnText, btnStyle }) => {
  return (
    // Replaced hardcoded dark classes with adaptive ones
    <div className="bg-white dark:bg-[#111827] rounded-[24px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-200 dark:hover:border-slate-700 transition-all flex flex-col justify-between h-[220px]">
      <div>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4 shadow-sm`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>
      </div>
      
      {/* Button adapts to theme (White/Gray in Light, Navy in Dark) */}
      <button className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${btnStyle}`}>
        {btnText} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CitizenDashboard;