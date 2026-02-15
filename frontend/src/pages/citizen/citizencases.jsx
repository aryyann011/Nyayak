import React, { useState, useEffect } from "react";
import { Briefcase, Clock, FileText, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import Navigation
import { supabase } from "../../lib/supabase"; // Import Real DB
import { useAuth } from "../../context/Authcontext";

const MyCases = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Init Hook
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
    switch (status) {
      case "Active": return "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900/50";
      case "Pending Acceptance": return "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-900/50";
      case "Payment Pending": return "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50";
      case "Closed": return "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-900/50";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-900/50";
    }
  };

  // Filter Logic
  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search);
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 bg-slate-50 dark:bg-[#0F172A] min-h-screen font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif-heading text-slate-900 dark:text-white">My Cases</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your active legal proceedings</p>
        </div>
        <button onClick={() => navigate('/complaint')} className="bg-orange-600 dark:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-700 dark:hover:bg-orange-700 transition shadow-lg">
          + File New Case
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by Title or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl w-full md:w-1/3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-500/30 transition-colors"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl w-full md:w-1/4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-500/30 transition-colors"
        >
          <option value="All">All Status</option>
          <option value="Pending Acceptance">Pending</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid gap-6">
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-400 dark:text-slate-600" /></div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl transition-colors">
            <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No cases found.</p>
          </div>
        ) : (
          filteredCases.map((legalCase) => (
            <div key={legalCase.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Info */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition border border-slate-200 dark:border-slate-700">
                    <Briefcase className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{legalCase.title}</h3>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(legalCase.status)}`}>
                        {legalCase.status}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-mono uppercase">ID: {legalCase.id.slice(0,8)}</p>
                  </div>
                </div>

                {/* Updates */}
                <div className="flex-1 md:max-w-md bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Filed Date</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-100 font-medium">
                    {new Date(legalCase.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Action - NOW WORKING */}
                <button 
                  onClick={() => navigate(`/cases/${legalCase.id}`)}
                  className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold text-sm hover:underline bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-lg transition-colors border border-orange-200 dark:border-orange-900/50"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCases;