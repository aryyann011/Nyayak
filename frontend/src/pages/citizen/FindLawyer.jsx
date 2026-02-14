import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Search, Star, MapPin, Briefcase, 
  ShieldCheck, ChevronRight, Loader2, Scale, User, Building2
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useNotification } from "../../context/NotificationContext"; // <--- Import Context

const FindLawyer = () => {
  const locationState = useLocation().state;
  const { sendNotification } = useNotification(); // <--- Init Hook
  const navigate = useNavigate();
  const caseId = locationState?.caseId; 

  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(locationState?.category || "All");
  const [requestingId, setRequestingId] = useState(null);

  const CATEGORIES = ["All", "Criminal Defense", "Civil Rights", "Family Law", "Corporate"];

  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      let query = supabase.from('lawyers').select('*').eq('is_available', true);
      
      if (selectedFilter !== "All") {
        query = query.eq('specialization', selectedFilter);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error:", error);
      } else {
        const sortedData = data?.sort((a, b) => 
          a.name.includes("(Demo)") ? -1 : 1
        ) || [];
        setLawyers(sortedData);
      }
      setLoading(false);
    };
    fetchLawyers();
  }, [selectedFilter]);

  // --- HIRE LOGIC ---
  const handleHireRequest = async (lawyerId) => {
    if (!caseId) {
      alert("No active case file found. Please file a case first.");
      navigate('/file-complaint');
      return;
    }

    setRequestingId(lawyerId);

    try {
      // 1. Assign Lawyer ID & Update Status
      const { error } = await supabase
        .from('cases')
        .update({ 
          lawyer_id: lawyerId, 
          status: 'Pending Acceptance' 
        })
        .eq('id', caseId);

      if (error) throw error;

      // 2. Notify the Lawyer
      await sendNotification(
         lawyerId, 
         "New Case Request", 
         "A citizen has requested your legal representation.", 
         "info",
         "/lawyer/requests"
      );

      alert("Request Sent! The lawyer has been notified.");
      navigate('/my-cases');
    } catch (err) {
      console.error("Hire Error:", err);
      alert("Failed to send request. Please check your connection.");
    } finally {
      setRequestingId(null);
    }
  };

  const filteredLawyers = lawyers.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">
              <Scale className="w-3 h-3" /> Professional Directory
            </div>
            <h1 className="text-3xl font-bold font-serif-heading text-slate-900 tracking-tight">Select Legal Counsel</h1>
            <p className="text-slate-500 text-sm max-w-md border-l-2 border-slate-200 pl-4">
              Review verified legal practitioners and send a request to start your consultation.
            </p>
          </div>
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search by name, location or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:ring-0 focus:border-slate-900 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-8">
        <div className="max-w-7xl mx-auto flex gap-8 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`py-4 text-[11px] uppercase font-bold tracking-widest border-b-2 transition-all shrink-0
                ${selectedFilter === cat ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-8 py-10 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
             <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Accessing Verified Records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredLawyers.map((lawyer) => (
              <div key={lawyer.id} className="bg-white border border-slate-200 hover:border-slate-400 transition-all duration-300 flex flex-col md:flex-row group">
                <div className="w-full md:w-52 bg-slate-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                      {lawyer.avatar_url ? (
                        <img src={lawyer.avatar_url} alt={lawyer.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      ) : (
                        <User className="w-12 h-12 text-slate-400" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 p-1 bg-slate-900 text-white rounded-full border-2 border-white shadow-sm"><ShieldCheck className="w-3 h-3" /></div>
                  </div>
                  <div className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     {lawyer.name.includes("(Demo)") ? "Demo Profile" : "Verified"}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 font-serif-heading capitalize">{lawyer.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-100 uppercase tracking-wide">{lawyer.specialization}</span>
                          <span className="text-slate-300 text-xs">|</span>
                          <div className="flex items-center gap-1 text-slate-500 text-xs font-bold"><Star className="w-3 h-3 text-orange-400 fill-orange-400" /> {lawyer.rating}</div>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-bold text-slate-400 uppercase">Rate</div>
                         <div className="text-lg font-bold text-slate-900 leading-none mt-1">{lawyer.hourly_rate}<span className="text-xs text-slate-400 font-normal">/hr</span></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 mb-6 border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-2 text-slate-600 text-xs"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> <span>{lawyer.experience_years} Years Exp.</span></div>
                      <div className="flex items-center gap-2 text-slate-600 text-xs"><MapPin className="w-3.5 h-3.5 text-slate-400" /> <span>{lawyer.location}</span></div>
                    </div>
                    <p className="text-xs text-slate-500 italic border-l-2 border-slate-100 pl-3 line-clamp-2">"{lawyer.bio}"</p>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                      onClick={() => navigate(`/lawyer-profile/${lawyer.id}`, { state: locationState })}
                      className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => handleHireRequest(lawyer.id)}
                      disabled={requestingId === lawyer.id}
                      className="bg-slate-900 text-white px-6 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {requestingId === lawyer.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <>Request to Hire <ChevronRight className="w-3 h-3" /></>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindLawyer;