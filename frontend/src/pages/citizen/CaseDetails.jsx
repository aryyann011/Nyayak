import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Clock, User, CreditCard, ArrowRight, CheckCircle, 
  FileText, Shield, AlertCircle, Loader2, Calendar, MapPin, Download 
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Validate ID before fetching
    if (!id || id === 'undefined') {
        setLoading(false);
        return;
    }

    const fetchCase = async () => {
      const { data, error } = await supabase
        .from('cases')
        .select(`*, lawyers:lawyer_id ( name, hourly_rate, location, avatar_url )`)
        .eq('id', id)
        .single();

      if (!error) setCaseData(data);
      setLoading(false);
    };

    fetchCase();

    // Realtime Listener
    const channel = supabase.channel('case_detail').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cases', filter: `id=eq.${id}` }, (payload) => {
        setCaseData(prev => ({ ...prev, ...payload.new }));
    }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  // --- LOADING STATE ---
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0F172A] transition-colors duration-300">
       <Loader2 className="w-10 h-10 animate-spin text-slate-400 dark:text-slate-600 mb-4" />
       <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Retrieving Case File...</p>
    </div>
  );

  // --- NOT FOUND STATE (Fixed UI) ---
  if (!caseData) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0F172A] p-4 transition-colors duration-300">
       <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
             <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-serif-heading">Case Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">The case ID you are looking for does not exist or you do not have permission to view it.</p>
          <button onClick={() => navigate(-1)} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold transition">
             Go Back
          </button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white p-6 md:p-10 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-orange-700 dark:text-orange-400 font-bold tracking-widest text-[10px] uppercase bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded border border-orange-200 dark:border-orange-900/50">
                 {caseData.category}
               </span>
               <span className="text-slate-500 dark:text-slate-400 text-xs font-mono uppercase">ID: {caseData.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-serif-heading capitalize">
              {caseData.title}
            </h1>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition font-bold text-xs uppercase tracking-wider flex items-center gap-2 bg-white dark:bg-slate-900 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Main Status Card */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm relative">

            <div className="relative z-10">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4" /> Current Status
              </h3>
              <div className="flex items-center gap-6">
                <div className={`p-5 rounded-2xl ${caseData.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                  {caseData.status === 'Rejected' ? <AlertCircle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{caseData.status}</p>
                  <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">
                    {caseData.status === 'Pending Acceptance' ? 'Waiting for lawyer to review.' : 'Your case is being processed.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Payment / Action Widget */}
          <div className={`p-8 rounded-2rem border transition-all flex flex-col justify-between
             ${caseData.status === 'Payment Pending' 
               ? 'bg-orange-600 dark:bg-orange-600 text-white border-orange-600 dark:border-orange-600 shadow-xl' 
               : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'}`
          }>
            <div>
               <div className="flex justify-between items-start">
                  <CreditCard className={`w-8 h-8 mb-4 ${caseData.status === 'Payment Pending' ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  {caseData.status === 'Active' && <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">PAID</span>}
               </div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                 Retainer Fee
               </h3>
               <p className="text-4xl font-black mt-2">
                 {caseData.lawyers ? caseData.lawyers.hourly_rate : "₹0"}
               </p>
            </div>
            
            {caseData.status === 'Payment Pending' ? (
              <button
                onClick={() => navigate("/payment", { state: { caseId: caseData.id, amount: 5000 } })}
                className="mt-8 w-full bg-white text-orange-600 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Pay Now <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
               <div className="mt-8 w-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 py-3 rounded-xl font-bold flex items-center justify-center text-xs uppercase tracking-wider cursor-not-allowed">
                  {caseData.status === 'Active' ? 'Invoice Paid' : 'No Action Needed'}
               </div>
            )}
          </div>

          {/* 3. Lawyer Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2rem shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
               <User className="w-4 h-4" /> Assigned Council
            </h3>
            {caseData.lawyers ? (
               <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full border-2 border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                     {caseData.lawyers.avatar_url ? (
                        <img src={caseData.lawyers.avatar_url} alt="Lawyer" className="h-full w-full object-cover" />
                     ) : (
                        <User className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                     )}
                  </div>
                  <div>
                     <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{caseData.lawyers.name}</p>
                     <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {caseData.lawyers.location}
                     </p>
                  </div>
               </div>
            ) : (
               <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 italic bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Matching in progress...</span>
               </div>
            )}
          </div>

          {/* 4. Details */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2rem shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
               <FileText className="w-4 h-4" /> Case Description
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
               "{caseData.description}"
            </p>
            
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
               <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                  <Download className="w-4 h-4" /> Evidence
               </h3>
               {!caseData.documents || caseData.documents.length === 0 ? (
                  <span className="text-sm text-slate-500 dark:text-slate-400 italic">No documents uploaded.</span>
               ) : (
                  <div className="flex gap-2">
                     {caseData.documents.map((doc, i) => (
                        <a key={i} href={doc} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition">
                           <FileText className="w-3 h-3" /> Document {i+1}
                        </a>
                     ))}
                  </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}