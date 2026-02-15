import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { 
  ArrowLeft, CheckCircle, XCircle, Shield, User, Briefcase, 
  MapPin, Phone, Mail, Calendar, FileText, ExternalLink, Loader2 
} from "lucide-react";
import { toast } from "react-toastify";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [docUrl, setDocUrl] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      // 1. Fetch Profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setUser(data);

      // 2. Generate Signed URL for Document (if exists)
      if (data.id_document_url) {
        const { data: urlData } = await supabase.storage
          .from('id_proofs')
          .createSignedUrl(data.id_document_url, 3600); // 1 hour valid
        setDocUrl(urlData?.signedUrl);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not load user details.");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`User ${newStatus === 'verified' ? 'Approved' : 'Rejected'}!`);
      navigate("/admin"); // Go back to dashboard
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return null;

  const isPolice = user.role === 'police';
  const isLawyer = user.role === 'lawyer';

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-8">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8">
        <button 
          onClick={() => navigate("/admin")} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-4 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{user.full_name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 ${
                isPolice ? "bg-blue-100 text-blue-700" : isLawyer ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
              }`}>
                {isPolice ? <Shield size={14}/> : isLawyer ? <Briefcase size={14}/> : <User size={14}/>}
                {user.role} Application
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                user.verification_status === 'verified' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                user.verification_status === 'rejected' ? "bg-red-50 text-red-700 border-red-200" :
                "bg-orange-50 text-orange-700 border-orange-200"
              }`}>
                Status: {user.verification_status}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
             {user.verification_status === 'pending' && (
                <>
                  <button onClick={() => updateStatus('rejected')} className="px-6 py-3 bg-white border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all flex items-center gap-2">
                    <XCircle size={20} /> Reject
                  </button>
                  <button onClick={() => updateStatus('verified')} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black shadow-lg shadow-emerald-900/10 transition-all flex items-center gap-2">
                    <CheckCircle size={20} /> Approve User
                  </button>
                </>
             )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Contact */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem icon={<Mail size={18} />} label="Email Address" value={user.email} />
              <DetailItem icon={<Phone size={18} />} label="Phone Number" value={user.phone || "N/A"} />
              <DetailItem icon={<MapPin size={18} />} label="Address" value={user.address || "Not Provided"} />
              <DetailItem icon={<Calendar size={18} />} label="Date of Birth" value={user.dob || "Not Provided"} />
            </div>
          </div>

          {/* Section 2: Professional */}
          {(isPolice || isLawyer) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Professional Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isPolice && (
                  <>
                    <DetailItem icon={<Shield size={18} />} label="Badge Number" value={user.gov_id} />
                    <DetailItem icon={<MapPin size={18} />} label="Station Code" value={user.station_code} />
                  </>
                )}
                {isLawyer && (
                  <DetailItem icon={<FileText size={18} />} label="Bar Council ID" value={user.gov_id} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COL: DOCUMENT */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Identity Document</h3>
            
            <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative group">
              {docUrl ? (
                <a href={docUrl} target="_blank" rel="noreferrer" className="block w-full h-full">
                   <img src={docUrl} alt="ID Proof" className="w-full h-full object-contain" />
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white font-bold">
                        <ExternalLink size={20} /> Open Full Size
                      </div>
                   </div>
                </a>
              ) : (
                <div className="text-slate-400 text-sm font-medium flex flex-col items-center gap-2">
                  <FileText size={32} />
                  No Document Uploaded
                </div>
              )}
            </div>
            
            <div className="mt-4 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="font-bold text-blue-800 mb-1">Security Verification:</p>
              Check the Badge/Bar ID against the official government database before approving.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-slate-400">{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
      <p className="font-semibold text-slate-900 text-base">{value}</p>
    </div>
  </div>
);

export default AdminUserDetails;