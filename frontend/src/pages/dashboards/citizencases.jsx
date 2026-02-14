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
      case "Active": return "text-blue-700 bg-blue-50 border border-blue-100";
      case "Pending Acceptance": return "text-orange-700 bg-orange-50 border border-orange-100";
      case "Payment Pending": return "text-red-700 bg-red-50 border border-red-100";
      case "Closed": return "text-green-700 bg-green-50 border border-green-100";
      default: return "text-gray-600 bg-gray-50 border border-gray-100";
    }
  };

  // Filter Logic
  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search);
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif-heading text-slate-900">My Cases</h1>
          <p className="text-slate-500 mt-1">Manage and track your active legal proceedings</p>
        </div>
        <button onClick={() => navigate('/complaint')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition shadow-lg">
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
          className="px-4 py-3 border border-slate-200 rounded-xl w-full md:w-1/3 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-slate-200 rounded-xl w-full md:w-1/4 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
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
           <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No cases found.</p>
          </div>
        ) : (
          filteredCases.map((legalCase) => (
            <div key={legalCase.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Info */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition border border-slate-100">
                    <Briefcase className="w-6 h-6 text-slate-500 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900 capitalize">{legalCase.title}</h3>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(legalCase.status)}`}>
                        {legalCase.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-1 font-mono uppercase">ID: {legalCase.id.slice(0,8)}</p>
                  </div>
                </div>

                {/* Updates */}
                <div className="flex-1 md:max-w-md bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filed Date</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">
                    {new Date(legalCase.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Action - NOW WORKING */}
                <button 
                  onClick={() => navigate(`/cases/${legalCase.id}`)} // <--- FIXED NAVIGATION
                  className="flex items-center gap-2 text-blue-700 font-bold text-sm hover:underline bg-blue-50 px-4 py-2 rounded-lg transition-colors"
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