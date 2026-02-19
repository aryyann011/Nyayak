import React, { useState, useEffect } from "react";
import { Briefcase, Clock, FileText, ChevronRight, Loader2, Shield, AlertCircle, Search, FileSignature } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { supabase } from "../../lib/supabase"; 
import { useAuth } from "../../context/Authcontext";

const MyCases = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // New Filter Tab State
  const [activeTab, setActiveTab] = useState("All"); // All, Legal, FIRs

  // --- FETCH REAL DATA ---
  useEffect(() => {
    if (!user) return;
    const fetchCases = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) setCases(data);
      setLoading(false);
    };
    fetchCases();
  }, [user]);

  // UI Helpers
  const getStatusStyle = (status) => {
    if (!status) return "text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700";
    
    const s = status.toLowerCase();
    if (s.includes("active") || s.includes("approved")) {
      return "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800";
    }
    if (s.includes("pending") || s.includes("awaiting")) {
      return "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800";
    }
    if (s.includes("reject") || s.includes("closed") || s.includes("ncr")) {
      return "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800";
    }
    return "text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700";
  };

  // Filter Logic
  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search);
    
    let matchesTab = true;
    if (activeTab === "Legal") matchesTab = c.complaint_type !== 'police_fir';
    if (activeTab === "FIRs") matchesTab = c.complaint_type === 'police_fir';

    return matchesSearch && matchesTab;
  });

  // Split filtered cases into categories for rendering if 'All' is selected
  const legalCases = filteredCases.filter(c => c.complaint_type !== 'police_fir');
  const firCases = filteredCases.filter(c => c.complaint_type === 'police_fir');

  const CaseCard = ({ legalCase }) => {
    const isFIR = legalCase.complaint_type === 'police_fir';
    
    return (
      <div 
        onClick={() => navigate(`/cases/${legalCase.id}`)}
        className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        {/* Left Side: Icon & Title */}
        <div className="flex items-start gap-4">
          <div className={`p-4 rounded-xl border shrink-0 transition-colors
            ${isFIR 
              ? 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400 group-hover:bg-red-100' 
              : 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400 group-hover:bg-blue-100'
            }`}
          >
            {isFIR ? <Shield className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                  isFIR ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' 
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}>
                {isFIR ? "Police FIR" : "Legal Case"}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono uppercase tracking-wider">
                REF: {legalCase.id.slice(0,8)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {legalCase.title}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Filed: {new Date(legalCase.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Status & Action */}
        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:border-t-0">
          <div className="flex flex-col items-start md:items-end">
             <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Current Status</span>
             <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getStatusStyle(legalCase.status)}`}>
               {legalCase.status}
             </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-[#1F2937] flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 dark:group-hover:bg-orange-900/30 dark:group-hover:text-orange-400 transition-colors shrink-0">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10 bg-slate-50 dark:bg-[#0F172A] min-h-screen font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif-heading text-slate-900 dark:text-white">Case Records</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Manage your active legal proceedings and police complaints.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/complaint')} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Find Lawyer
            </button>
            <button onClick={() => navigate('/file-fir')} className="bg-slate-900 dark:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black dark:hover:bg-orange-700 transition shadow-md text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" /> File Police FIR
            </button>
          </div>
        </div>

        {/* Controls: Search & Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#111827] p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Tabs */}
          <div className="flex w-full sm:w-auto p-1 bg-slate-50 dark:bg-[#1F2937] rounded-xl border border-slate-100 dark:border-slate-700 overflow-x-auto no-scrollbar">
            {["All", "Legal", "FIRs"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent'
                }`}
              >
                {tab === "Legal" ? "Private Cases" : tab === "FIRs" ? "Police FIRs" : "All Records"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID or Title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 outline-none"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-4" /><p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Records...</p></div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-32 bg-white dark:bg-[#111827] border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl transition-colors">
              <FileSignature className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Records Found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">You don't have any {activeTab !== "All" ? activeTab.toLowerCase() : ""} cases matching your search.</p>
            </div>
          ) : (
            <>
              {/* RENDER SECTIONS BASED ON TAB */}
              
              {/* FIR Section (Shows if Tab is 'All' or 'FIRs') */}
              {(activeTab === "All" || activeTab === "FIRs") && firCases.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 ml-2">
                    <Shield className="w-4 h-4 text-red-500" /> Police Complaints (e-FIR)
                  </h2>
                  <div className="grid gap-4">
                    {firCases.map(c => <CaseCard key={c.id} legalCase={c} />)}
                  </div>
                </div>
              )}

              {/* Legal Cases Section (Shows if Tab is 'All' or 'Legal') */}
              {(activeTab === "All" || activeTab === "Legal") && legalCases.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 ml-2">
                    <Briefcase className="w-4 h-4 text-blue-500" /> Private Legal Counsel
                  </h2>
                  <div className="grid gap-4">
                    {legalCases.map(c => <CaseCard key={c.id} legalCase={c} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyCases;