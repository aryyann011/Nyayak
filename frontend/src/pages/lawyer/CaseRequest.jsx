import React, { useState, useEffect } from "react";
import { 
  Briefcase, Clock, FileText, CheckCircle, XCircle, 
  User, MapPin, Loader2, AlertCircle, Scale 
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";

const LawyerCaseRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH REQUESTS ---
  const fetchRequests = async () => {
    if (!user) return;
    setLoading(true);
    
    // UPDATED: Now asking for 'profiles' which we linked in Step 1
    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        profiles ( 
          full_name, 
          email, 
          phone 
        )
      `)
      .eq('status', 'Pending Acceptance')
      .eq('lawyer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
    
    const channel = supabase
      .channel('lawyer_requests_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cases', filter: `lawyer_id=eq.${user?.id}` }, () => fetchRequests())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // --- HANDLERS ---
  const handleAccept = async (caseId) => {
    const { error } = await supabase.from('cases').update({ status: 'Payment Pending' }).eq('id', caseId);
    if (!error) {
        toast.success("Case Accepted");
        fetchRequests();
    } else {
        toast.error("Error accepting case");
    }
  };

  const handleReject = async (caseId) => {
    if (!window.confirm("Reject request?")) return;
    const { error } = await supabase.from('cases').update({ status: 'Rejected', lawyer_id: null }).eq('id', caseId);
    if (!error) {
        toast.info("Request Rejected");
        fetchRequests();
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold font-serif-heading text-slate-900 flex items-center gap-3">
             <Scale className="w-8 h-8" /> Case Intake
          </h1>
          <p className="text-slate-500 mt-1">Review incoming inquiries from potential clients.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-500 shadow-sm">
           {requests.length} Pending Review
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6">
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
        ) : requests.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <Briefcase className="mx-auto w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No Pending Requests</h3>
              <p className="text-slate-500 text-sm mt-1">New inquiries will appear here automatically.</p>
           </div>
        ) : (
           requests.map((item) => (
             <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6">
                   <div className="flex-1">
                      <div className="flex justify-between mb-2">
                         <div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">{item.category}</span>
                            <h3 className="text-xl font-bold text-slate-900 mt-1 capitalize">{item.title}</h3>
                         </div>
                         <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 my-4">
                         <div className="flex items-center gap-2 text-sm text-slate-600">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold">{item.profiles?.full_name || "Unknown Client"}</span>
                         </div>
                         <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{item.location}</span>
                         </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                         <p className="text-sm text-slate-600 italic line-clamp-3">"{item.description}"</p>
                      </div>
                      <div className="flex gap-4">
                         <button onClick={() => handleAccept(item.id)} className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-sm font-bold uppercase hover:bg-black transition-all flex justify-center gap-2"><CheckCircle className="w-4 h-4" /> Accept</button>
                         <button onClick={() => handleReject(item.id)} className="px-6 py-3 border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"><XCircle className="w-5 h-5" /></button>
                      </div>
                   </div>
                </div>
             </div>
           ))
        )}
      </div>
    </div>
  );
};

export default LawyerCaseRequests;