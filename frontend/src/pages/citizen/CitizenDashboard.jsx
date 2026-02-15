import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import {
  ShieldAlert,
  MapPin,
  Bot,
  ChevronRight,
  Clock,
  Gavel,
  FilePlus,
  AlertTriangle,
  Search,
  ArrowUpRight,
  Loader2,
  Send
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import CitizenCrimeMap from "./CitizenCrimeMap";

const CitizenDashboard = ({ user }) => {
  const userName = user?.user_metadata?.full_name || "Citizen";
  const [showCrimeMap, setShowCrimeMap] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // --- REDIRECT TO CHAT LOGIC ---
  const handleSearch = (e) => {
    e.preventDefault(); 
    if (searchQuery.trim()) {
      navigate("/chat", { state: { initialInput: searchQuery } });
    }
  };

  // --- DYNAMIC DATA STATE ---
  const [stats, setStats] = useState({
    activeCases: 0,
    pendingActions: 0,
    safetyScore: 98
  });

  const [activeCases, setActiveCases] = useState([]);

  // --- FETCH REAL DATA FROM SUPABASE ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        const { data: casesData, error } = await supabase
          .from('cases')
          .select('*')
          .eq('user_id', user.id)
          .neq('status', 'Closed')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const activeCount = casesData.length;
        const pendingCount = casesData.filter(c => c.status === 'Payment Pending' || c.status === 'Action Required').length;

        setStats(prev => ({
          ...prev,
          activeCases: activeCount,
          pendingActions: pendingCount
        }));

        setActiveCases(casesData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-6 pb-10 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      <CitizenCrimeMap isOpen={showCrimeMap} onClose={() => setShowCrimeMap(false)} />

      {/* 1. ENGAGING HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Welcome Section (Spans 3 cols) */}
        <div className="lg:col-span-3 bg-gradient-to-br from-orange-50 to-white dark:from-[#111827] dark:to-[#1F2937] rounded-[32px] p-8 md:p-10 border border-orange-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#E67E22 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          {/* Left: Text & Functional Search */}
          <div className="relative z-10 w-full md:w-3/5 pr-0 md:pr-8 mb-8 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[11px] font-bold uppercase tracking-wider border border-orange-200 dark:border-orange-800 flex items-center gap-2">
                <Gavel className="w-3 h-3" /> Legal Dashboard
              </span>
            </div>
            <h1 className="text-4xl font-serif-heading font-bold mb-4 tracking-tight text-slate-900 dark:text-white leading-tight">
              Welcome back,<br /><span className="text-orange-600 dark:text-orange-500">{userName}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 leading-relaxed">
              Your legal assistant is ready. You have <span className="font-bold text-slate-900 dark:text-white underline decoration-orange-300">{stats.pendingActions} pending actions</span>.
            </p>

            {/* INTEGRATED SEARCH BAR (Sends query to Chat) */}
            <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
              <div className="relative flex items-center bg-white dark:bg-[#1F2937] rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-slate-700 focus-within:ring-4 focus-within:ring-orange-100 dark:focus-within:ring-orange-900/20 transition-all">
                <Search className="ml-4 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask Nyaya AI or search case files..." 
                  className="w-full h-12 pl-4 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 outline-none text-base font-medium"
                />
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl transition-transform active:scale-95 shadow-md">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right: Engaging AI Illustration */}
          <div className="relative z-10 w-full md:w-2/5 flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm">
              <div className="absolute -top-10 -left-4 bg-white dark:bg-[#1F2937] p-4 rounded-2xl rounded-br-none shadow-md border border-slate-200 dark:border-slate-700 max-w-[260px] z-20">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 text-center">How can I help you today?</p>
              </div>
              <div className="w-full h-[320px] bg-gradient-to-t from-orange-100 to-orange-50 dark:from-slate-800 dark:to-slate-700 rounded-[40px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg relative flex items-center justify-center">
                  <Bot className="w-32 h-32 text-orange-300 dark:text-slate-500 mb-4" />
                  <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-orange-200/50 to-transparent dark:from-slate-900 opacity-50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* SOS BUTTON (Compact & Professional) */}
        <div className="lg:col-span-1 bg-white dark:bg-[#111827] border-l-4 border-red-500 rounded-2xl p-6 shadow-sm flex flex-col justify-between group cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-600">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                Emergency
              </span>
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Trigger SOS</h3>
            <p className="text-slate-500 text-xs mt-2">Instant authorities alert</p>
          </div>

          <button className="mt-4 w-full py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all">
            <MapPin size={14} /> Share Location
          </button>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ACTIVE CASES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Active Proceedings</h3>
              </div>
              <Link to="/cases" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</Link>
            </div>

            {loading ? (
              <div className="p-10 flex justify-center text-slate-400">
                <Loader2 className="animate-spin w-6 h-6" />
              </div>
            ) : activeCases.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-[#1F2937] text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                    <tr>
                      <th className="px-6 py-4">Case Details</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Filing Date</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeCases.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-[#1F2937]/50 transition-colors cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm capitalize">{item.title || "Untitled Case"}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{item.case_type || "General"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                            item.status === 'Active' 
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-500 text-sm">No active cases found.</p>
                <Link to="/complaint" className="mt-4 inline-block text-orange-600 font-bold text-sm hover:underline">File a New Complaint</Link>
              </div>
            )}
          </div>

          {/* QUICK SERVICES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ServiceCard 
              icon={<FilePlus className="w-5 h-5 text-white" />}
              iconBg="bg-orange-600"
              title="New Complaint"
              desc="File FIR or Civil Petition"
              path="/complaint"
            />
            <ServiceCard 
              icon={<MapPin className="w-5 h-5 text-white" />}
              iconBg="bg-blue-600"
              title="Find Station"
              desc="Locate Police & Courts"
              path="/map"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: WIDGETS */}
        <div className="space-y-6">
          <div className="bg-[#0f172a] rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <Bot size={80} />
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                <Bot className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold mb-1">Nyaya Assistant</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Legal advice on IPC sections, FIR drafting, and document summarization.
              </p>
              <Link to="/chat" className="inline-flex w-full justify-center items-center bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg text-sm font-bold transition-colors">
                Start Chat <ArrowUpRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>

          {/* Safety Index */}
          <div className="bg-white dark:bg-[#111827] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Safety Index</h3>
               <button onClick={() => setShowCrimeMap(true)} className="text-xs font-bold text-emerald-600 hover:underline">Full Map</button>
             </div>
             <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175" strokeDashoffset={175 - (175 * stats.safetyScore) / 100} className="text-emerald-500" />
                  </svg>
                  <span className="absolute text-sm font-bold text-slate-900 dark:text-white">{stats.safetyScore}%</span>
                </div>
                <div>
                   <p className="text-sm font-bold text-emerald-600">Safe Zone</p>
                   <p className="text-xs text-slate-500">Low criminal activity.</p>
                </div>
             </div>
             <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>Advisory:</strong> Avoid Sector 4 Park after 10 PM.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ icon, iconBg, title, desc, path }) => (
  <Link to={path} className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-orange-300 dark:hover:border-slate-600 transition-all flex items-center gap-4 group">
    <div className={`p-3 rounded-lg ${iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
    </div>
  </Link>
);

export default CitizenDashboard;