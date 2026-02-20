import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useNotification } from "../../context/NotificationContext"; 
import { ArrowLeft, CheckCircle, FileWarning, XCircle, Loader2, FileText, Upload, Download, Shield, Paperclip } from "lucide-react";

const FIRDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sendNotification, triggerToast } = useNotification();
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // New Upload State

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
      const { data: updatedRow, error: updateError } = await supabase
        .from('cases')
        .update({
          police_status: decision,
          status: newMainStatus
        })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      
      if (!updatedRow || updatedRow.length === 0) {
          throw new Error("Update blocked by database security (RLS). Please check table policies.");
      }

      setCaseData(prev => ({ ...prev, police_status: decision, status: newMainStatus }));

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

    } catch (error) {
      console.error(error);
      triggerToast("Update Failed", error.message || "Could not update case.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // --- POLICE FILE UPLOAD LOGIC ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload to the same 'documents' bucket, but under a 'police_docs' folder
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `police_docs/${caseData.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // 3. Update 'police_documents' array in DB
      const currentDocs = caseData.police_documents || [];
      const updatedDocs = [...currentDocs, publicUrl];

      const { error: dbError } = await supabase
        .from('cases')
        .update({ police_documents: updatedDocs })
        .eq('id', id);

      if (dbError) throw dbError;

      // 4. Update UI & Notify Citizen
      setCaseData(prev => ({ ...prev, police_documents: updatedDocs }));

      await sendNotification(
        caseData.user_id,
        "Official Report Uploaded",
        "Police have attached an official document to your case file.",
        "info",
        `/cases/${id}`
      );

      triggerToast("Document Uploaded", "The official report is now visible to the citizen.", "success");
    } catch (error) {
      console.error("Upload error:", error);
      triggerToast("Upload Failed", "Could not upload the document.", "error");
    } finally {
      setUploading(false);
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

          {/* --- NEW: CITIZEN EVIDENCE SECTION --- */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-500" /> Attached Evidence
            </h3>
            {!caseData.documents || caseData.documents.length === 0 ? (
                <div className="text-slate-500 dark:text-slate-400 text-sm italic p-4 bg-slate-50 dark:bg-[#1F2937] rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    No evidentiary documents uploaded by the complainant.
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                   {caseData.documents.map((docUrl, i) => (
                      <a key={i} href={docUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm">
                         <FileText className="w-4 h-4 text-blue-500" /> Evidence_{i+1}.pdf
                      </a>
                   ))}
                </div>
            )}
          </div>
        </div>

        {/* --- OFFICIAL POLICE UPLOAD WORKSPACE --- */}
        {caseData.police_status !== 'Pending' && (
          <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#111827]">
             <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <Shield className="w-4 h-4" /> Official Records Workspace
                 </h3>
                 
                 <label className={`cursor-pointer bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                     {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                     {uploading ? 'Uploading...' : 'Upload Official Copy'}
                     <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.jpg,.png" />
                 </label>
             </div>

             {!caseData.police_documents || caseData.police_documents.length === 0 ? (
                 <div className="text-center p-6 bg-white dark:bg-[#1F2937] rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-sm font-medium">
                     No official reports have been uploaded to this case file yet.
                 </div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {caseData.police_documents.map((docUrl, index) => (
                         <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg flex items-center justify-center shrink-0">
                                     <FileText className="w-5 h-5" />
                                 </div>
                                 <div>
                                     <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Official_Report_v{index + 1}.pdf</div>
                                     <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Visible to Citizen</div>
                                 </div>
                             </div>
                             <a href={docUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                 <Download className="w-5 h-5" />
                             </a>
                         </div>
                     ))}
                 </div>
             )}
          </div>
        )}

        {/* ACTION BAR (Only if Pending) */}
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