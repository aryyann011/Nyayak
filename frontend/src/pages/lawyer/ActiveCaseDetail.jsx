// pages/Lawyer/ActiveCaseDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, User, Calendar, Shield, Paperclip, 
  Clock, CheckCircle, AlertCircle, Phone, Mail 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

const ActiveCaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      // Fetch specific case + Client Info
      // Find this part inside fetchCaseDetails
const { data, error } = await supabase
  .from('cases')
  // REMOVE 'phone_number' from this line
  .select('*, users:user_id(full_name, email)') 
  .eq('id', id)
  .single();

      if (error) console.error("Error:", error);
      else setCaseData(data);
      
      setLoading(false);
    };

    if (id) fetchCaseDetails();
  }, [id]);

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

             {/* Documents Area */}
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                     <Paperclip className="w-5 h-5 text-slate-400"/> Case Documents
                   </h3>
                   <button className="text-sm font-bold text-blue-600 hover:underline">+ Upload New</button>
                </div>

                {/* Empty State for Docs */}
                <div className="p-10 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3"/>
                  <p className="text-slate-500 font-medium text-sm">No legal documents attached to this case file yet.</p>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveCaseDetails;