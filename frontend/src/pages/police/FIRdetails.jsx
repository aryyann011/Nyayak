import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useNotification } from "../../context/NotificationContext"; 
import { ArrowLeft, CheckCircle, FileWarning, XCircle, Loader2, FileText } from "lucide-react";

const FIRDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sendNotification, triggerToast } = useNotification();
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      const { data } = await supabase.from('cases').select('*, profiles(full_name, phone)').eq('id', id).single();
      setCaseData(data);
      setLoading(false);
    };
    fetchCase();
  }, [id]);

  const handleAction = async (decision) => {
    setActionLoading(true);

    let newMainStatus = 'Awaiting Police Review';
    let notifTitle = '';
    let notifMsg = '';
    let notifType = 'info';

    if (decision === 'Approved') {
      newMainStatus = 'Active Investigation';
      notifTitle = 'FIR Registered';
      notifMsg = 'Your complaint has been converted to an official FIR.';
      notifType = 'success';
    } else if (decision === 'NCR') {
      newMainStatus = 'Closed (NCR)';
      notifTitle = 'Non-Cognizable Report (NCR)';
      notifMsg = 'Your complaint was logged as NCR. Hire a lawyer to escalate to court.';
      notifType = 'info';
    } else if (decision === 'Rejected') {
      newMainStatus = 'Rejected by Police';
      notifTitle = 'FIR Rejected';
      notifMsg = 'Police declined to register an FIR. Hire a lawyer to file a private complaint.';
      notifType = 'error';
    }

    try {
      // 1. UPDATE DATABASE (With .select() to force a return value validation)
      const { data: updatedRow, error: updateError } = await supabase
        .from('cases')
        .update({
          police_status: decision,
          status: newMainStatus
        })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      
      // CRITICAL CHECK: If RLS blocked the update, updatedRow will be empty
      if (!updatedRow || updatedRow.length === 0) {
          throw new Error("Update blocked by database security (RLS). Please check table policies.");
      }

      // 2. SAFE NOTIFICATION
      try {
          await sendNotification(
            caseData.user_id, 
            notifTitle,
            notifMsg,
            notifType,
            `/cases/${id}` 
          );
      } catch (notifErr) {
          console.warn("Notification failed, but DB updated successfully", notifErr);
      }

      triggerToast("Case Updated", `Complaint marked as ${decision}`, "success");
      navigate('/police/firs'); 

    } catch (error) {
      console.error(error);
      triggerToast("Update Failed", error.message || "Could not update case.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;
  if (!caseData) return <div className="p-20 text-center dark:text-white">Case not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-10">
      
      {/* Top Nav Bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/police/firs')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" /> Back to Records
        </button>
      </div>

      {/* PROFESSIONAL DOCUMENT CARD */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        
        {/* Document Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                REF: {caseData.id.slice(0,8).toUpperCase()}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border 
                    ${caseData.police_status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' : 
                      caseData.police_status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 
                      'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}>
                    Status: {caseData.police_status}
                </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">{caseData.title}</h1>
          </div>
          
          <div className="bg-slate-50 dark:bg-[#1F2937] p-4 rounded-xl border border-slate-100 dark:border-slate-700 min-w-[200px]">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Complainant Details</p>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">{caseData.profiles?.full_name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{caseData.profiles?.phone || 'No phone provided'}</p>
            <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-200 dark:border-slate-600 pt-2">Filed: {new Date(caseData.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Incident Statement
            </h3>
            <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed p-6 bg-slate-50 dark:bg-[#1F2937] rounded-xl border border-slate-100 dark:border-slate-700 whitespace-pre-wrap font-medium">
              {caseData.description}
            </div>
          </div>
        </div>

        {/* PROFESSIONAL ACTION BAR (Only if Pending) */}
        {caseData.police_status === 'Pending' && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                Official Determination
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button 
                  onClick={() => handleAction('Rejected')} disabled={actionLoading}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-white dark:bg-transparent border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                  <XCircle className="w-4 h-4" /> Reject
              </button>

              <button 
                  onClick={() => handleAction('NCR')} disabled={actionLoading}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-white dark:bg-transparent border border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                  <FileWarning className="w-4 h-4" /> Mark NCR
              </button>

              <button 
                  onClick={() => handleAction('Approved')} disabled={actionLoading}
                  className="flex-1 sm:flex-none px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Register FIR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FIRDetail;