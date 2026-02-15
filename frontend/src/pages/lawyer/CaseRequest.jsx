import React, { useState, useEffect } from "react";
import { 
  Briefcase, Clock, FileText, CheckCircle, XCircle, 
  User, MapPin, Loader2, Scale 
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

const LawyerCaseRequests = () => {
  const { sendNotification } = useNotification();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LOGIC: FETCH REQUESTS ---
  const fetchRequests = async () => {
    if (!user) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        profiles ( full_name, email, phone )
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

  // --- LOGIC: HANDLERS ---
  const handleAccept = async (caseItem) => { 
    // 1. Update DB Status
    const { error } = await supabase
        .from('cases')
        .update({ status: 'Payment Pending' })
        .eq('id', caseItem.id);
    
    if (!error) {
        // 2. Feedback for Lawyer (You)
        toast.success("Case Accepted successfully!");
        fetchRequests(); 
        
        // 3. Notification for Citizen (Them)
        if (caseItem.user_id) {
            await sendNotification(
                caseItem.user_id, 
                "Representation Accepted",
                "Your lawyer has accepted the case. Please proceed to payment.",
                "success",
                `/cases/${caseItem.id}`
            );
        }
    } else {
        console.error(error);
        toast.error("Error accepting case");
    }
  };

  const handleReject = async (caseId) => {
    if (!window.confirm("Reject request?")) return;
    const { error } = await supabase.from('cases').update({ status: 'Rejected', lawyer_id: null }).eq('id', caseId);
    if (!error) {
        toast.info("Request Declined");
        fetchRequests();
    } else {
        toast.error("Error declining request");
    }
  };

  return (
    <div className="p-8 bg-slate-50 dark:bg-[#0B1120] dark:text-slate-100 min-h-screen font-sans transition-colors">

      {/* Header */}
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold font-serif-heading text-slate-900 dark:text-white flex items-center gap-3">
             <Scale className="w-8 h-8 text-[#ff4d00]" /> Case Intake
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review incoming inquiries from potential clients.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-300 shadow-sm">
           {requests.length} Pending Review
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6">
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
        ) : requests.length === 0 ? (
           <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <Briefcase className="mx-auto w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Pending Requests</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">New inquiries will appear here automatically.</p>
           </div>
        ) : (
           requests.map((item) => (
             <div key={item.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition group">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

                   {/* Left: Icon & Title */}
                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-xl group-hover:bg-orange-50 transition">
                         <Briefcase className="w-6 h-6 text-gray-600 dark:text-slate-300 group-hover:text-[#ff4d00]" />
                      </div>
                      <div>
                         <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white capitalize">
                               {item.title}
                            </h3>
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-100">
                               {item.category}
                            </span>
                         </div>
                        <p className="text-gray-400 dark:text-slate-400 text-sm mt-1 uppercase font-semibold tracking-tighter">
                            Case ID: {item.id.slice(0, 8)}
                         </p>
                      </div>
                   </div>

                   {/* Middle: Client Details Box */}
                   <div className="flex-1 md:max-w-md bg-gray-50 dark:bg-slate-700 p-4 rounded-xl border border-gray-100 dark:border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                         <User className="w-4 h-4 text-[#ff4d00]" />
                         <span className="text-xs font-bold text-gray-500 uppercase">
                            Client Information
                         </span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-white font-bold">
                         {item.profiles?.full_name || "Unknown Client"}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-300 mt-1">
                         <MapPin className="w-3 h-3" /> {item.location || "Location not specified"}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-300 mt-3 italic line-clamp-2 border-t border-gray-200 dark:border-slate-600 pt-2">
                         "{item.description}"
                      </p>
                   </div>

                </div>

                {/* Bottom Section: Footer & Actions */}
                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">

                   {/* Meta Data */}
                   <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                         <FileText className="w-4 h-4 text-gray-400 dark:text-slate-300" />
                         <span className="text-sm text-gray-500 dark:text-slate-300">
                            Filed on: <b className="text-gray-700 dark:text-white">{new Date(item.created_at).toLocaleDateString()}</b>
                         </span>
                      </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleReject(item.id); }} 
                        className="px-6 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-300 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                      >
                         Decline
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAccept(item); }} 
                        className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#ff4d00] transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                         Accept Case
                      </button>
                      <button 
                        onClick={() => navigate(`/lawyer/case/${item.id}`)}
                        className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-xs uppercase tracking-wider"
                      >
                         View Details
                      </button>
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
