import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Calendar, MapPin, User, FileText, Download, 
  CheckCircle, XCircle, Clock, Shield, Scale, Mail, Phone, Paperclip
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-toastify";

const Casedetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH FULL DETAILS ---
  useEffect(() => {
    const fetchCaseDetails = async () => {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          profiles ( 
            full_name, 
            email, 
            phone,
            address
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching case:", error);
        toast.error("Could not retrieve case file.");
        navigate(-1);
      } else {
        setCaseData(data);
      }
      setLoading(false);
    };

    fetchCaseDetails();
  }, [id, navigate]);

  // --- ACTIONS ---
  const handleAccept = async () => {
    const { error } = await supabase.from('cases').update({ status: 'Payment Pending' }).eq('id', id);
    if (!error) {
      toast.success("Representation Accepted.");
      navigate('/lawyer/requests'); // Redirect back to inbox
    } else {
      toast.error("System Error.");
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Permanently decline this case?")) return;
    const { error } = await supabase.from('cases').update({ status: 'Rejected', lawyer_id: null }).eq('id', id);
    if (!error) {
      toast.info("Case Declined.");
      navigate('/lawyer/requests');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-serif-heading">Loading Case File...</div>;
  if (!caseData) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32">
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Docket
          </button>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            CASE ID: <span className="text-slate-900">{caseData.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Header Section */}
        <div className="mb-10">
           <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md">
                {caseData.category}
              </span>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3" /> {caseData.status}
              </span>
           </div>
           <h1 className="text-3xl md:text-4xl font-bold font-serif-heading text-slate-900 leading-tight">
             {caseData.title}
           </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* LEFT COLUMN: Case Details */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* Description Card */}
              <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Incident Statement
                 </h3>
                 <p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                    {caseData.description}
                 </p>
              </div>

              {/* Evidence / Documents */}
              <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Paperclip className="w-4 h-4" /> Evidence & Attachments
                 </h3>
                 
                 {!caseData.documents || caseData.documents.length === 0 ? (
                    <div className="text-center p-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400 text-sm italic">
                       No documents attached to this file.
                    </div>
                 ) : (
                    <div className="space-y-3">
                       {caseData.documents.map((docUrl, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors group">
                             <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                   <FileText className="w-5 h-5" />
                                </div>
                                <div className="truncate">
                                   <div className="text-sm font-bold text-slate-700 truncate">Document_Attachment_{index + 1}.pdf</div>
                                   <div className="text-xs text-slate-400">Uploaded on {new Date(caseData.created_at).toLocaleDateString()}</div>
                                </div>
                             </div>
                             <a 
                               href={docUrl} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                               title="Download / View"
                             >
                                <Download className="w-5 h-5" />
                             </a>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>

           {/* RIGHT COLUMN: Metadata Sidebar */}
           <div className="space-y-6">
              
              {/* Client Profile Card */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                 <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Client Profile</h3>
                    <User className="w-4 h-4 text-slate-400" />
                 </div>
                 <div className="p-6 space-y-6">
                    <div>
                       <div className="text-lg font-bold text-slate-900">{caseData.profiles?.full_name || "Anonymous"}</div>
                       <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {caseData.profiles?.address || caseData.location || "Location N/A"}
                       </div>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                       <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" /> 
                          <span className="truncate">{caseData.profiles?.email}</span>
                       </div>
                       <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Phone className="w-4 h-4 text-slate-400" /> 
                          <span>{caseData.profiles?.phone || "No phone provided"}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Case Stats */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                 <div className="p-6 space-y-4">
                    <div>
                       <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Incident Date</div>
                       <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {caseData.incident_date ? new Date(caseData.incident_date).toLocaleDateString() : "Not specified"}
                       </div>
                    </div>
                    <div className="pt-4 border-t border-slate-50">
                       <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Client Budget</div>
                       <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full inline-block border border-green-100">
                          {caseData.budget_range || "Standard Rates"}
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
         <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="hidden md:block">
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Action Required</div>
               <div className="text-sm font-medium text-slate-600">Review the file and decide on representation.</div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
               <button 
                 onClick={handleReject}
                 className="flex-1 md:flex-none px-8 py-3 border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2"
               >
                  <XCircle className="w-5 h-5" /> Decline
               </button>
               <button 
                 onClick={handleAccept}
                 className="flex-1 md:flex-none px-10 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-[#ff4d00] transition-all shadow-lg flex items-center justify-center gap-2"
               >
                  <CheckCircle className="w-5 h-5" /> Accept Case
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Casedetails;