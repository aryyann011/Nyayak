import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { 
  CheckCircle, XCircle, Shield, User, FileText, 
  Search, Filter, ExternalLink, Loader2, RefreshCw, 
  ChevronRight, Clock, AlertCircle, LogOut // Added LogOut icon
} from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const navigate = useNavigate(); // For redirection

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('role', 'citizen')
        .neq('role', 'admin')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('verification_status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRequests(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  // --- NEW: Logout Function ---
  const handleLogout = async () => {
    try {
        await supabase.auth.signOut();
        toast.success("Logged out successfully");
        navigate("/login"); // Force redirect to login
    } catch (error) {
        console.error("Logout error:", error);
        toast.error("Error logging out");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] font-sans p-6 lg:p-10">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-slate-900/20">
                System Administrator
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-orange-200">
                Authorized Access Only
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Verification <span className="text-orange-600">Portal</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium max-w-lg">
              Review and validate official credentials for Law Enforcement and Legal Professionals entering the NyayaSahayak network.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
                onClick={fetchRequests} 
                className="group flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm hover:shadow-md"
            >
                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" /> 
                <span className="hidden sm:inline">Sync Data</span>
            </button>

            {/* LOGOUT BUTTON */}
            <button 
                onClick={handleLogout} 
                className="group flex items-center gap-2 px-5 py-3 bg-red-50 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:border-red-600 hover:text-white transition-all shadow-sm hover:shadow-md"
            >
                <LogOut size={18} /> 
                <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex gap-1">
          {['pending', 'verified', 'rejected', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === tab 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* REQUESTS GRID */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin w-10 h-10 mb-4 text-orange-500" />
            <p className="font-bold text-sm uppercase tracking-widest">Fetching Records...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Applications Found</h3>
            <p className="text-slate-400 text-sm mt-1">There are no users matching the "{filter}" criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {requests.map((user, index) => (
              <RequestCard key={user.id} user={user} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub-Component: Request Card ---
const RequestCard = ({ user, index }) => {
  const isPolice = user.role === 'police';
  const isPending = user.verification_status === 'pending';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
    >
      {/* Card Header */}
      <div className={`h-2 w-full ${isPolice ? 'bg-blue-500' : 'bg-amber-500'}`} />
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${isPolice ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
            {isPolice ? <Shield size={24} /> : <FileText size={24} />}
          </div>
          
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            user.verification_status === 'verified' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : user.verification_status === 'rejected'
            ? 'bg-red-50 text-red-700 border-red-100'
            : 'bg-orange-50 text-orange-700 border-orange-100 flex items-center gap-1.5'
          }`}>
            {isPending && <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>}
            {user.verification_status}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {user.full_name}
          </h3>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mt-1">
            {user.role} Applicant
          </p>
        </div>

        <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium text-xs uppercase">Official ID</span>
            <span className="font-mono font-bold text-slate-700">{user.gov_id || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium text-xs uppercase">
              {isPolice ? "Station Code" : "Date Applied"}
            </span>
            <span className="font-mono font-bold text-slate-700">
              {isPolice ? (user.station_code || "N/A") : new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Clock size={14} />
                {new Date(user.created_at).toLocaleDateString()}
            </div>
            
            <Link 
                to={`/admin/user/${user.id}`}
                className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors"
            >
                View Full Profile <ChevronRight size={16} />
            </Link>
        </div>
      </div>
      
      {/* Quick Action Bar (Only for Pending) */}
      {isPending && (
        <div className="bg-orange-50 p-3 px-6 flex items-center justify-between border-t border-orange-100">
             <span className="text-xs font-bold text-orange-800 flex items-center gap-2">
                <AlertCircle size={14} /> Action Required
             </span>
             <Link to={`/admin/user/${user.id}`} className="bg-white text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-200 shadow-sm hover:bg-orange-600 hover:text-white transition-all">
                Review Now
             </Link>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;