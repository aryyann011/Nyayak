import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Clock, User, CreditCard, ArrowRight, CheckCircle, 
  FileText, Shield, AlertCircle, Loader2, Calendar, MapPin, Download, Briefcase, Scale, Building2
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
       <Loader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-500 mb-4" />
       <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Retrieving Case File...</p>
    </div>
  );

  // --- NOT FOUND STATE ---
  if (!caseData) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0F172A] p-4 transition-colors duration-300">
       <div className="bg-white dark:bg-[#111827] p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
             <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-serif-heading">Case Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">The case ID you are looking for does not exist or you do not have permission to view it.</p>
          <button onClick={() => navigate(-1)} className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-black text-white py-3 rounded-xl font-bold transition">
             Go Back
          </button>
       </div>
    </div>
  );

  const isFIR = caseData.complaint_type === 'police_fir';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white p-4 md:p-8 lg:p-12 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500 space-y-6">
        
        {/* Navigation & Header Area */}
        <button 
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition font-bold text-xs uppercase tracking-wider flex items-center gap-2 mb-2"
        >
            <ArrowLeft className="w-4 h-4" /> Back to Records
        </button>

        <div className={`p-8 md:p-10 rounded-3xl border shadow-sm relative overflow-hidden transition-colors duration-300
            ${isFIR ? 'bg-gradient-to-br from-red-50 to-white border-red-100 dark:from-red-900/10 dark:to-[#111827] dark:border-red-900/20' 
                    : 'bg-gradient-to-br from-blue-50 to-white border-blue-100 dark:from-blue-900/10 dark:to-[#111827] dark:border-blue-900/20'}`}>
            
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
                {isFIR ? <Shield size={160} /> : <Scale size={160} />}
            </div>

            <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5
                        ${isFIR ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' 
                                : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50'}`}>
                        {isFIR ? <Shield className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                        {isFIR ? "Police Complaint (e-FIR)" : "Private Legal Matter"}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-mono uppercase bg-white/50 dark:bg-slate-900/50 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                        REF: {caseData.id.slice(0, 8)}
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white capitalize mb-2">
                    {caseData.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Filed on {new Date(caseData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
        </div>

        {/* Dashboard Layout: 2 Columns on Large Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Details & Facts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Incident Details (Only shown for Police FIRs) */}
            {isFIR && (caseData.incident_date || caseData.location) && (
                <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Incident Facts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {caseData.incident_date && (
                            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-[#1F2937] rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm shrink-0"><Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" /></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Date of Occurrence</p>
                                    <p className="font-semibold text-slate-900 dark:text-white mt-1">{new Date(caseData.incident_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )}
                        {caseData.location && (
                            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-[#1F2937] rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm shrink-0"><MapPin className="w-5 h-5 text-slate-500 dark:text-slate-400" /></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Reported Location</p>
                                    <p className="font-semibold text-slate-900 dark:text-white mt-1">{caseData.location}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Case Description */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-widest flex items-center gap-2">
                 <FileText className="w-4 h-4" /> Official Statement
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-[#1F2937] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap">
                 {caseData.description}
              </p>
              
              {/* Evidence Section inside Description card to keep UI tight */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                 <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <Download className="w-4 h-4" /> Attached Evidence
                 </h3>
                 {!caseData.documents || caseData.documents.length === 0 ? (
                    <span className="text-sm text-slate-500 dark:text-slate-400 italic">No evidentiary documents uploaded.</span>
                 ) : (
                    <div className="flex flex-wrap gap-3">
                       {caseData.documents.map((doc, i) => (
                          <a key={i} href={doc} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 transition-colors shadow-sm">
                             <FileText className="w-4 h-4 text-blue-500" /> Document_{i+1}.pdf
                          </a>
                       ))}
                    </div>
                 )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Status, Actions, & Lawyer */}
          <div className="space-y-6">
            
            {/* Status Card */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Tracker
              </h3>
              
              <div className="flex flex-col items-center text-center">
                <div className={`p-5 rounded-full mb-4 border-4 shadow-sm ${
                    caseData.status === 'Active' || caseData.status === 'Active Investigation' ? 'bg-emerald-100 border-white dark:bg-emerald-900/30 dark:border-[#111827] text-emerald-600' : 
                    caseData.status.includes('Rejected') || caseData.status === 'Closed (NCR)' ? 'bg-red-100 border-white dark:bg-red-900/30 dark:border-[#111827] text-red-600' : 
                    'bg-blue-100 border-white dark:bg-blue-900/30 dark:border-[#111827] text-blue-600'
                }`}>
                  {caseData.status.includes('Rejected') || caseData.status === 'Closed (NCR)' ? <AlertCircle className="w-10 h-10" /> : <Shield className="w-10 h-10" />}
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{caseData.status}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium px-4">
                    {caseData.status === 'Pending Acceptance' ? 'Your case details have been sent. Awaiting lawyer review.' : 
                     caseData.status === 'Awaiting Police Review' ? 'The nearest station is currently evaluating your FIR.' :
                     caseData.status === 'Active Investigation' ? 'Police have registered this FIR and started an investigation.' :
                     'Your case file is currently updated.'}
                </p>
              </div>
            </div>

            {/* Payment / Action Widget */}
            <div className={`p-6 md:p-8 rounded-3xl border transition-all flex flex-col justify-between shadow-sm
               ${caseData.status === 'Payment Pending' 
                 ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-600 shadow-orange-500/20' 
                 : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'}`
            }>
              <div>
                 <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl ${caseData.status === 'Payment Pending' ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700'}`}>
                        <CreditCard className={`w-6 h-6 ${caseData.status === 'Payment Pending' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    </div>
                    {caseData.status === 'Active' && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider border border-emerald-200 dark:border-emerald-800/50">Invoice Paid</span>}
                 </div>
                 <h3 className={`text-xs font-bold uppercase tracking-widest ${caseData.status === 'Payment Pending' ? 'text-orange-100' : 'text-slate-400 dark:text-slate-500'}`}>
                   Legal Retainer Fee
                 </h3>
                 <p className="text-4xl font-bold mt-2 font-serif-heading">
                   {caseData.lawyers ? `${caseData.lawyers.hourly_rate}` : "—"}
                 </p>
              </div>
              
              {caseData.status === 'Payment Pending' ? (
                <button
                  onClick={() => navigate("/payment", { state: { caseId: caseData.id, amount: caseData.lawyers?.hourly_rate || 5000 } })}
                  className="mt-8 w-full bg-white text-orange-600 py-3.5 rounded-xl font-bold hover:bg-orange-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  Complete Payment <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                 <div className={`mt-8 w-full py-3 rounded-xl font-bold flex items-center justify-center text-xs uppercase tracking-wider cursor-not-allowed border 
                    ${caseData.status === 'Active' ? 'border-emerald-200 text-emerald-600 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/10 dark:text-emerald-500' 
                                                   : 'border-slate-200 dark:border-slate-700 text-slate-400 bg-slate-50 dark:bg-slate-800'}`}>
                    {caseData.status === 'Active' ? 'Account Settled' : (!caseData.lawyers ? 'Pending Assignment' : 'No Action Required')}
                 </div>
              )}
            </div>

            {/* Lawyer Info / Hire CTA */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-widest flex items-center gap-2">
                 <Briefcase className="w-4 h-4" /> Legal Counsel
              </h3>
              
              {/* Logic Branching */}
              {caseData.lawyers ? (
                 // SCENARIO 1: Lawyer Assigned
                 <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-[#1F2937] border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <div className="h-16 w-16 rounded-full border-2 border-white dark:border-slate-700 overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0">
                       {caseData.lawyers.avatar_url ? (
                          <img src={caseData.lawyers.avatar_url} alt="Lawyer" className="h-full w-full object-cover" />
                       ) : (
                          <User className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                       )}
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Assigned Lawyer</p>
                       <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{caseData.lawyers.name}</p>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {caseData.lawyers.location}
                       </p>
                    </div>
                 </div>

              ) : isFIR && ['Approved', 'Rejected', 'NCR'].includes(caseData.police_status) ? (
                 // SCENARIO 2: FIR Processed, No Lawyer Yet -> Hire CTA
                 <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 p-5 rounded-2xl flex flex-col gap-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {caseData.police_status === 'Approved' 
                        ? "FIR Registered. Hire legal counsel to monitor the police investigation and prepare for trial." 
                        : `Police marked this as ${caseData.police_status}. Hire a lawyer immediately to file a private petition.`}
                    </p>
                    <button 
                      onClick={() => navigate('/find-lawyer', { state: { attachCaseId: caseData.id } })}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                    >
                       Find a Lawyer <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>

              ) : isFIR && caseData.police_status === 'Pending' ? (
                 // SCENARIO 3: Waiting on police
                 <div className="flex flex-col items-center justify-center text-center gap-3 bg-slate-50 dark:bg-[#1F2937] p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <Shield className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Awaiting police station determination before counsel can be assigned.</span>
                 </div>

              ) : (
                 // SCENARIO 4: Standard Direct Case
                 <div className="flex flex-col items-center justify-center text-center gap-3 bg-slate-50 dark:bg-[#1F2937] p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 animate-pulse" />
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Broadcasting request to verified professionals in your area.</span>
                 </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}