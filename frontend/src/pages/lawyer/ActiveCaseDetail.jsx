import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, User, Calendar, Shield, Paperclip, 
  Clock, CheckCircle, AlertCircle, Phone, Mail, Upload, Download, Loader2 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNotification } from "../../context/NotificationContext"; // Added Notification
import { toast } from "react-toastify"; // Added Toast

const ActiveCaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sendNotification } = useNotification(); // Init Notification
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Init Upload State

  useEffect(() => {
    const fetchCaseDetails = async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*, users:user_id(full_name, email)') 
        .eq('id', id)
        .single();

      if (error) console.error("Error:", error);
      else setCaseData(data);
      
      setLoading(false);
    };

    if (id) fetchCaseDetails();
  }, [id]);

  // --- UPLOAD LOGIC ADDED HERE ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `lawyer_drafts/${caseData.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents') // Assuming bucket is named 'documents'
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // 3. Update 'lawyer_documents' array in DB
      const currentDocs = caseData.lawyer_documents || [];
      const updatedDocs = [...currentDocs, publicUrl];

      const { error: dbError } = await supabase
        .from('cases')
        .update({ lawyer_documents: updatedDocs })
        .eq('id', id);

      if (dbError) throw dbError;

      // 4. Update local state so the UI shows the new file immediately
      setCaseData(prev => ({ ...prev, lawyer_documents: updatedDocs }));

      // 5. Send Notification to Citizen
      await sendNotification(
        caseData.user_id,
        "New Legal Document",
        "Your lawyer has uploaded a new document to your case file.",
        "info",
        `/cases/${id}`
      );

      toast.success("Document shared with client successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-slate-400 w-8 h-8"/></div>;
  if (!caseData) return <div className="p-10 text-center text-red-500 font-bold">Case Record Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center text-slate-500 hover:text-slate-900 mb-8 font-bold transition-colors"
        >
          <div className="p-2 bg-white border border-slate-200 rounded-lg mr-3 group-hover:border-slate-400">
            <ArrowLeft className="w-4 h-4" /> 
          </div>
          Back to Docket
        </button>

        {/* Header Badge */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{caseData.title}</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  {caseData.status}
                </span>
              </div>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" /> Case Reference ID: <span className="text-slate-900 font-mono">#{caseData.id.slice(0,8)}</span>
              </p>
            </div>
            
            <div className="flex gap-4 text-right">
              <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                 <p className="text-xs text-slate-400 font-bold uppercase">Date Opened</p>
                 <p className="text-slate-900 font-bold">{new Date(caseData.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Client Profile */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
                  <User className="w-5 h-5 text-slate-400"/> Client Profile
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-full"><User className="w-4 h-4 text-slate-600"/></div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                      <p className="text-slate-900 font-bold">{caseData.users?.full_name || 'Unknown'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-full"><Mail className="w-4 h-4 text-slate-600"/></div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                      <p className="text-slate-900 font-medium break-all">{caseData.users?.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-full"><Phone className="w-4 h-4 text-slate-600"/></div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Phone</label>
                      <p className="text-slate-900 font-medium">{caseData.users?.phone_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                  Contact Client
                </button>
             </div>
          </div>

          {/* Right Column: Case Data */}
          <div className="lg:col-span-2 space-y-6">
             
             {/* Description */}
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-400"/> Case Details
                </h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                    {caseData.description || "No detailed description provided for this case."}
                  </p>
                </div>
             </div>

             {/* --- NEW: CLIENT EVIDENCE DISPLAY --- */}
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-slate-400"/> Client Evidence & Attachments
                </h3>
                {!caseData.documents || caseData.documents.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                      <p className="text-slate-500 font-medium text-sm italic">No evidence attached by the client.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {caseData.documents.map((docUrl, index) => (
                            <a key={index} href={docUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 bg-white border border-slate-200 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="truncate">
                                        <div className="text-sm font-bold text-slate-900 truncate">Evidence_{index + 1}</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Client Upload</div>
                                    </div>
                                </div>
                                <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                            </a>
                        ))}
                    </div>
                )}
             </div>

             {/* Documents Area - LAWYER UPLOAD UI */}
             <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-sm border border-blue-200">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                     <Shield className="w-5 h-5 text-blue-500"/> Legal Workspace (Your Drafts)
                   </h3>
                   
                   {/* File Input hidden behind label */}
                   <label className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors hover:bg-blue-700 shadow-sm ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                     {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                     {uploading ? 'Uploading...' : 'Upload Draft'}
                     <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
                   </label>
                </div>

                {/* Show Empty State OR Document List */}
                {!caseData.lawyer_documents || caseData.lawyer_documents.length === 0 ? (
                    <div className="p-10 border border-dashed border-blue-200 rounded-xl text-center bg-white/50">
                      <FileText className="w-10 h-10 text-blue-300 mx-auto mb-3"/>
                      <p className="text-slate-500 font-medium text-sm">No legal documents prepared by you yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {caseData.lawyer_documents.map((docUrl, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">Legal_Draft_v{index + 1}.pdf</div>
                                        <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Shared with Client</div>
                                    </div>
                                </div>
                                <a href={docUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                    <Download className="w-5 h-5" />
                                </a>
                            </div>
                        ))}
                    </div>
                )}
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveCaseDetails;