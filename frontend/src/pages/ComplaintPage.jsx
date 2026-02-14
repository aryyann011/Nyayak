import React, { useState, useEffect } from "react";
import { FilePlus, ShieldAlert, MapPin, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

// --- DUMMY DATA FOR DEMO ---
const MOCK_LOGS = [
  {
    id: "LOG-9921",
    type: "Police Intervention",
    location: "Sector 4, Market Complex",
    time: "Feb 14, 10:42 AM",
    status: "Dispatch Sent",
    priority: "Critical"
  },
  {
    id: "LOG-8821",
    type: "Medical Assistance",
    location: "Metro Station Gate 2",
    time: "Feb 12, 08:15 PM",
    status: "Resolved",
    priority: "High"
  },
  {
    id: "LOG-7723",
    type: "Suspicious Activity",
    location: "Residential Block B",
    time: "Feb 10, 02:30 PM",
    status: "Closed",
    priority: "Low"
  }
];

const ComplaintPage = () => {
  const [activeTab, setActiveTab] = useState("complaint"); 
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // 1. Get Real Logs from LocalStorage
    const localLogs = JSON.parse(localStorage.getItem('emergencyLogs') || '[]');
    
    // 2. Combine with Mock Logs for the Demo
    setLogs([...localLogs, ...MOCK_LOGS]);
  }, [activeTab]);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. Header & Toggle */}
      <div className="flex flex-col items-center mb-10">
         <h1 className="text-3xl font-bold font-serif-heading mb-6
           text-slate-900 dark:text-white
         ">
           {activeTab === 'complaint' ? 'File a New Complaint' : 'Emergency Logs'}
         </h1>

         <div className="p-1 rounded-lg inline-flex relative
           bg-slate-200 dark:bg-slate-800
         ">
            <div 
              className={`absolute top-1 bottom-1 w-[140px] rounded-md shadow-sm transition-all duration-300 ease-in-out
              bg-white dark:bg-slate-600
              ${activeTab === 'complaint' ? 'left-1' : 'left-[144px]'}
              `}
            />
            <button 
              onClick={() => setActiveTab('complaint')}
              className={`relative z-10 w-[140px] py-2 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2
                ${activeTab === 'complaint' 
                  ? 'text-slate-900 dark:text-white' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}
              `}
            >
              <FilePlus className="w-4 h-4" />
              New Complaint
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`relative z-10 w-[140px] py-2 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2
                ${activeTab === 'logs' 
                   ? 'text-slate-900 dark:text-white' 
                   : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}
              `}
            >
              <ShieldAlert className="w-4 h-4" />
              Emergency Logs
            </button>
         </div>
      </div>

      {/* 2. Content Area */}
      <div className="rounded-xl border shadow-sm overflow-hidden min-h-[500px]
        bg-white border-slate-200 
        dark:bg-[#1e293b] dark:border-slate-700
      ">
         
         {activeTab === 'complaint' ? (
           /* --- COMPLAINT FORM --- */
           <div className="p-8 md:p-12">
              <div className="max-w-2xl mx-auto space-y-6">
                 <div>
                    <label className="block text-sm font-bold mb-2
                      text-slate-700 dark:text-slate-300
                    ">Subject</label>
                    <input type="text" className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors
                      bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400
                      dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-500
                    " placeholder="e.g. Theft of Vehicle" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2
                          text-slate-700 dark:text-slate-300
                        ">Date of Incident</label>
                        <input type="date" className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors
                          bg-slate-50 border-slate-200 text-slate-900
                          dark:bg-slate-900 dark:border-slate-700 dark:text-white
                        " />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2
                          text-slate-700 dark:text-slate-300
                        ">Location</label>
                        <input type="text" className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors
                          bg-slate-50 border-slate-200 text-slate-900
                          dark:bg-slate-900 dark:border-slate-700 dark:text-white
                        " placeholder="City, Area" />
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold mb-2
                      text-slate-700 dark:text-slate-300
                    ">Description</label>
                    <textarea rows="6" className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors
                      bg-slate-50 border-slate-200 text-slate-900
                      dark:bg-slate-900 dark:border-slate-700 dark:text-white
                    " placeholder="Describe the incident in detail..."></textarea>
                 </div>

                 <button className="w-full py-4 font-bold rounded-lg transition-colors shadow-lg
                   bg-slate-900 text-white hover:bg-black
                   dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200
                 ">
                    Submit Formal Complaint
                 </button>
              </div>
           </div>
         ) : (
           /* --- EMERGENCY LOGS --- */
           <div className="p-0">
              <div className="grid grid-cols-12 p-4 border-b text-xs font-bold uppercase tracking-wider
                bg-slate-50 border-slate-100 text-slate-500
                dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-400
              ">
                 <div className="col-span-5">Emergency Details</div>
                 <div className="col-span-4">Timestamp</div>
                 <div className="col-span-3 text-right">Status</div>
              </div>

              {logs.length === 0 ? (
                <div className="p-10 text-center text-slate-400 dark:text-slate-500">No emergency logs found.</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="grid grid-cols-12 p-4 border-b transition-colors items-center
                    border-slate-100 hover:bg-slate-50
                    dark:border-slate-700/50 dark:hover:bg-slate-800/50
                  ">
                     {/* Type & Location */}
                     <div className="col-span-5 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                          ${log.priority === 'Critical' 
                            ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                            : 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'}
                        `}>
                           {log.priority === 'Critical' ? <AlertTriangle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                           <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{log.type}</div>
                           <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="w-3 h-3" /> {log.location}
                           </div>
                        </div>
                     </div>

                     {/* Time */}
                     <div className="col-span-4 text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        {log.time}
                     </div>

                     {/* Status Badge */}
                     <div className="col-span-3 text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide
                           ${log.status === 'Resolved' || log.status === 'Closed'
                             ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                             : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 animate-pulse'}
                        `}>
                           {log.status}
                        </span>
                     </div>
                  </div>
                ))
              )}
           </div>
         )}
      </div>
    </div>
  );
};

export default ComplaintPage;