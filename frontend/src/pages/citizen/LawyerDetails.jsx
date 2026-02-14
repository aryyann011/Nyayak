import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, MapPin, Briefcase, Star, Award, 
  ChevronLeft, Building2, Mail, Phone, ExternalLink, Loader2, User 
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const LawyerProfile = () => {
  const { id } = useParams();
  const locationState = useLocation().state;
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.from('lawyers').select('*').eq('id', id).single();
      if (error) console.error(error);
      else setLawyer(data);
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-slate-400" /></div>;
  if (!lawyer) return <div className="p-20 text-center">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Search
        </button>

        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="flex flex-col md:flex-row border-b border-slate-200">
             {/* --- SIDEBAR PROFILE --- */}
             <div className="w-full md:w-80 bg-slate-50 p-10 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-200">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200 flex items-center justify-center mb-6">
                  {lawyer.avatar_url ? (
                    <img src={lawyer.avatar_url} alt={lawyer.name} className="w-full h-full object-cover grayscale" />
                  ) : (
                    <User className="w-20 h-20 text-slate-400" />
                  )}
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold font-serif-heading text-slate-900">{lawyer.name}</h1>
                  <p className="text-blue-700 font-bold text-[10px] uppercase tracking-widest mt-1">{lawyer.specialization}</p>
                </div>
                <div className="mt-8 w-full space-y-4 pt-8 border-t border-slate-200">
                   <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 tracking-tighter">
                      <span>ID</span>
                      <span className="text-slate-900">BCI-29310</span>
                   </div>
                   <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 tracking-tighter">
                      <span>Status</span>
                      <span className="text-green-600 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Active</span>
                   </div>
                </div>
             </div>

             {/* --- MAIN CONTENT --- */}
             <div className="flex-1 p-8 md:p-12 bg-white">
                <div className="flex justify-between items-start mb-10">
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Jurisdiction</div>
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <MapPin className="w-4 h-4 text-slate-300" /> {lawyer.location}, India
                      </div>
                   </div>
                   <div className="text-right space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hourly Retainer</div>
                      <div className="text-3xl font-bold text-slate-900 font-serif-heading">{lawyer.hourly_rate}</div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                   <div className="p-4 bg-slate-50 border border-slate-100 flex flex-col gap-1">
                      <Briefcase className="w-5 h-5 text-slate-400 mb-2" />
                      <span className="text-xl font-bold text-slate-900">{lawyer.experience_years} Years</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Legal Tenure</span>
                   </div>
                   <div className="p-4 bg-slate-50 border border-slate-100 flex flex-col gap-1">
                      <Building2 className="w-5 h-5 text-slate-400 mb-2" />
                      <span className="text-xl font-bold text-slate-900">{lawyer.cases_won}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Successful Resolutions</span>
                   </div>
                   <div className="p-4 bg-slate-50 border border-slate-100 flex flex-col gap-1">
                      <Star className="w-5 h-5 text-orange-400 fill-orange-400 mb-2" />
                      <span className="text-xl font-bold text-slate-900">{lawyer.rating} / 5</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Satisfaction</span>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Professional Summary</h2>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{lawyer.bio}"</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-8 bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex gap-8">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest"><Phone className="w-4 h-4" /> Connect Office</div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest"><Mail className="w-4 h-4" /> Institutional Email</div>
             </div>
             <button 
                onClick={() => navigate('/find-lawyer', { state: locationState })}
                className="w-full md:w-auto bg-white text-slate-900 px-10 py-4 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl"
             >
                Return to Directory <ExternalLink className="w-4 h-4" />
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LawyerProfile;