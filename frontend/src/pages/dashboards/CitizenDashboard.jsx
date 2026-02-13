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
  Activity,
  Sparkles,
  ArrowRight
} from "lucide-react";

const CitizenDashboard = ({ user }) => {
  const userName = user?.user_metadata?.full_name || "Citizen";

  return (
    <div className="space-y-6 pb-10 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* 1. HERO SECTION - UNIFIED BLOCK 
          Matches image_a5a3d6.png exactly.
          It's ONE container. Text Left, AI Right (Nested).
      */}
      <div className="bg-white dark:bg-[#111827] rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          
          {/* LEFT: Welcome & Search */}
          <div className="flex-1 w-full max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-[11px] font-bold uppercase tracking-wider border border-orange-100 dark:border-orange-900/30">
                System Online
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white">
              Welcome back, <span className="text-orange-600 dark:text-orange-500">{userName}</span>
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed">
              Your legal safety net is active. How can NyayaSahayak assist you today?
            </p>

            {/* WIDE INTEGRATED SEARCH BAR */}
            <div className="relative w-full">
               <div className="relative flex items-center bg-slate-100 dark:bg-[#1F2937] rounded-xl p-1.5 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                <Search className="ml-4 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Ask a legal question (e.g. 'How to file an FIR?')" 
                  className="w-full h-11 pl-4 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 outline-none text-base"
                />
                <button className="bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-lg transition-transform active:scale-95 shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: AI Assistant (NESTED, NOT FLOATING) 
              This matches the reference where AI is a gray box INSIDE the white card.
          */}
          <div className="w-full lg:w-[380px] bg-slate-50 dark:bg-[#1F2937]/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white dark:bg-[#111827] rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-600 shadow-sm text-blue-600 dark:text-blue-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">AI Assistant</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time analysis</p>
              </div>
            </div>
            
            <div className="relative bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                 "I noticed you have an upcoming hearing on <span className="font-bold text-slate-900 dark:text-white">July 15</span>. Tap here to review the documents."
               </p>
               <button className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                 Review Documents <ArrowRight className="w-3 h-3" />
               </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. FEATURE GRID (Flat & Integrated) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          title="SOS Emergency"
          desc="Trigger instant alert"
          icon={<ShieldAlert className="w-6 h-6 text-white" />}
          iconBg="bg-red-500 shadow-red-500/20"
          btnText="Send SOS"
          btnClass="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        />
        <FeatureCard 
          title="Track Case"
          desc="View FIR status"
          icon={<FileText className="w-6 h-6 text-white" />}
          iconBg="bg-orange-500 shadow-orange-500/20"
          btnText="View Timeline"
          btnClass="bg-orange-50 hover:bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
        />
        <FeatureCard 
          title="Find Station"
          desc="Locate nearest help"
          icon={<MapPin className="w-6 h-6 text-white" />}
          iconBg="bg-blue-600 shadow-blue-600/20"
          btnText="Locate Now"
          btnClass="bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
        />
        <FeatureCard 
          title="Crime Map"
          desc="Check safety zones"
          icon={<Map className="w-6 h-6 text-white" />}
          iconBg="bg-emerald-600 shadow-emerald-600/20"
          btnText="View Heatmap"
          btnClass="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
        />
      </div>

      {/* 3. BOTTOM SECTION (Active Cases & Radar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Cases Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <Activity className="w-5 h-5 text-slate-400" />
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Cases</h3>
             </div>
             <button className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">View All</button>
          </div>

          <div className="flex-1 bg-slate-50 dark:bg-[#1F2937] rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-slate-600 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded">
                       INVESTIGATION
                     </span>
                     <span className="text-slate-400 text-xs font-mono">#FIR-2024-891</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Cyber Fraud - Credit Card Theft</h4>
               </div>
               <div className="text-right">
                  <span className="text-xs text-slate-400 block mb-1">Next Hearing</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">July 15, 2026</span>
               </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Evidence Collection</span>
                <span>60%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Radar Panel */}
        <div className="bg-white dark:bg-[#111827] rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Safety Radar</h3>
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
           </div>

           <div className="flex-1 bg-slate-100 dark:bg-[#1F2937] rounded-2xl relative overflow-hidden group min-h-[200px]">
              {/* Map Pattern BG */}
              <div className="absolute inset-0 opacity-30" style={{ 
                backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
                backgroundSize: '24px 24px' 
              }}></div>

              <div className="absolute inset-0 flex items-center justify-center">
                 <button className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-2 hover:scale-105 transition-transform">
                   <MapPin className="w-4 h-4 text-emerald-500" /> View Full Map
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- REUSABLE COMPONENT: FEATURE CARD ---
// Designed to look flat and integrated, not floating
const FeatureCard = ({ title, desc, icon, iconBg, btnText, btnClass }) => (
  <div className="bg-white dark:bg-[#111827] rounded-[24px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between h-[200px]">
    <div>
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{desc}</p>
    </div>
    
    <button className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${btnClass}`}>
      {btnText} <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

export default CitizenDashboard;