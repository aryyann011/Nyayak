import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { FileText, Clock, AlertTriangle, Loader2, ChevronRight, CheckCircle, XCircle, Search } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

const FIRManagement = () => {
  const navigate = useNavigate();
  const { triggerToast } = useNotification();
  
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending'); 

  const fetchFIRs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cases')
      .select(`*, profiles(full_name)`)
      .eq('complaint_type', 'police_fir')
      .eq('police_status', filter)
      .order('created_at', { ascending: false });

    if (error) {
        console.error("Fetch error:", error);
    }
    
    if (data) setFirs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFIRs();

    const channel = supabase
      .channel('fir_updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'cases',
        filter: `complaint_type=eq.police_fir`
      }, (payload) => {
        triggerToast("New FIR Received", "A citizen has submitted a new complaint.", "info");
        if (filter === 'Pending') {
            fetchFIRs(); 
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [filter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-10">
      
      {/* PROFESSIONAL HEADER */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Records Department</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">e-FIR Management</h1>
        </div>

        {/* Enterprise Tabs */}
        <div className="flex bg-slate-100 dark:bg-[#1F2937] p-1 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          {['Pending', 'Approved', 'Rejected', 'NCR'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${
                filter === status 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : firs.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium text-base">No {filter.toLowerCase()} FIRs found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {firs.map((fir) => (
              <div 
                key={fir.id} 
                onClick={() => navigate(`/police/fir/${fir.id}`)}
                className="p-5 hover:bg-slate-50 dark:hover:bg-[#1F2937]/50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex gap-4 items-start">
                  <div className={`mt-1 shrink-0 ${
                    filter === 'Pending' ? 'text-amber-500' :
                    filter === 'Approved' ? 'text-emerald-500' :
                    'text-slate-400 dark:text-slate-500'
                  }`}>
                    {filter === 'Pending' ? <AlertTriangle className="w-5 h-5" /> : 
                     filter === 'Approved' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{fir.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5"/> {fir.profiles?.full_name || 'Citizen'}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {new Date(fir.created_at).toLocaleString()}</span>
                      <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">REF: {fir.id.slice(0,8).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 self-end md:self-auto text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider">Review</span>
                    <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FIRManagement;