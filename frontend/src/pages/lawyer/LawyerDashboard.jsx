import React from "react";
import { 
  Users, 
  Clock, 
  Scale, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  MoreHorizontal,
  Gavel,
  AlertCircle
} from "lucide-react";

// Mock Data
const stats = [
  { label: "Active Cases", value: "12", icon: Scale, color: "text-orange-700", bg: "bg-orange-100" },
  { label: "Pending Requests", value: "5", icon: Users, color: "text-amber-700", bg: "bg-amber-100" },
  { label: "Hours Billed", value: "34.5", icon: Clock, color: "text-slate-700", bg: "bg-slate-100" },
  { label: "Success Rate", value: "92%", icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-100" },
];

const schedule = [
  { time: "10:00 AM", title: "Bail Hearing: State vs. Kumar", type: "Court", location: "High Court, Room 402" },
  { time: "01:30 PM", title: "Client Consulation: Mrs. Desai", type: "Meeting", location: "Office / Zoom" },
  { time: "04:00 PM", title: "Filing Deadline: Case #9921", type: "Deadline", location: "E-Filing Portal" },
];

const LawyerDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Header Section - Sharper, Professional */}
      <div className="relative overflow-hidden rounded-lg bg-white dark:from-slate-800 dark:to-slate-900 border border-orange-100 dark:border-slate-800 p-8 shadow-sm">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif-heading mb-2">
            The Chamber
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg">
            Welcome back, Advocate. You have <span className="text-orange-700 font-bold dark:bg-orange-900/30 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-800">3 urgent matters</span> requiring attention.
            </p>
        </div>
        {/* Decorative Background Icon */}
        <Gavel className="absolute -right-6 -bottom-6 w-64 h-64 text-orange-500/5 rotate-[-15deg]" />
      </div>

      {/* 2. Stats Grid - Reduced Radius */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 bg-white dark:bg-slate-800 rounded-lg border border-orange-100/50 dark:border-slate-700 shadow-sm hover:shadow-md hover:shadow-orange-500/5 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-md ${stat.bg} ${stat.color} transition-colors`}>
                <stat.icon size={20} />
              </div>
              <MoreHorizontal size={18} className="text-slate-300 hover:text-slate-500 cursor-pointer transition-colors" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-orange-700 transition-colors tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Split View: Schedule & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Today's Schedule (2/3 width) - Standard Radius */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
               <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded text-orange-600">
                 <Calendar className="w-4 h-4" />
               </div>
               Today's Schedule
             </h2>
             <span className="text-xs font-bold px-2 py-1 bg-slate-50 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
               Feb 14, 2026
             </span>
           </div>

           <div className="space-y-6 relative">
             {/* Vertical Line */}
             <div className="absolute left-[15px] top-3 bottom-3 w-px bg-slate-200 dark:bg-slate-700 z-0"></div>

             {schedule.map((item, idx) => (
               <div key={idx} className="flex gap-4 relative z-10 group">
                 {/* Timeline Dot - Kept Round (Standard) */}
                 <div className="flex flex-col items-center pt-1">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 group-hover:border-orange-300 group-hover:bg-orange-50 transition-all flex items-center justify-center shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-500 group-hover:bg-orange-500 transition-colors"></div>
                    </div>
                 </div>
                 
                 {/* Content Card - Minimal Radius */}
                 <div className="flex-1 p-3 -mt-1 rounded-md hover:bg-orange-50/50 dark:hover:bg-slate-700/50 border border-transparent hover:border-orange-100 dark:hover:border-slate-600 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-700 transition-colors">
                            {item.title}
                            </div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.time}
                            </div>
                        </div>
                        {/* Tags - Sharp Edges */}
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-bold border
                            ${item.type === 'Court' ? 'bg-red-50 text-red-700 border-red-100' : 
                            item.type === 'Meeting' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                            'bg-amber-50 text-amber-700 border-amber-100'}
                        `}>
                            {item.type}
                        </span>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1.5">
                       <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                       {item.location}
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Right: Urgent Requests - Professional Dark Theme */}
        <div className="bg-[#1e293b] dark:bg-[#0f172a] rounded-lg p-6 text-white shadow-lg flex flex-col relative overflow-hidden ring-1 ring-slate-700/50">
           {/* Glows */}
           <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -ml-10 -mb-10" />
           
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-orange-500/20 rounded-md text-orange-400 border border-orange-500/20">
                    <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-base font-bold">Priority Inbox</h3>
                    <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wide">New "Cyber Crime" Leads</p>
                </div>
             </div>
             
             <div className="space-y-3 mb-8">
               {[1, 2].map((i) => (
                 <div key={i} className="p-3 bg-slate-800/50 rounded-md border border-slate-700/50 hover:bg-slate-800 hover:border-orange-500/30 transition-all cursor-pointer group shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded-sm border border-orange-500/20">Cyber Fraud</span>
                       <span className="text-[10px] text-slate-500">10m ago</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-relaxed">"My bank account was hacked via a phishing link, lost 50k..."</p>
                 </div>
               ))}
             </div>

             <div className="mt-auto">
                <button className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-orange-900/20 border border-orange-400/20">
                    View All Requests
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default LawyerDashboard;