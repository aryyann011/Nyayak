import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/Authcontext";
import { useNotification } from "../../context/NotificationContext";
import { ShieldAlert, FileText, MapPin, Calendar, ArrowRight, Loader2 } from "lucide-react";

const FileFIR = () => {
  const { user } = useAuth();
  const { triggerToast } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    incident_date: "",
    location: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. (Optional but Recommended) Auto-find a Police Officer ID
      // If you have a specific Demo Police ID, you can skip this step and hardcode it below.
      const { data: policeUsers, error: policeError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'police')
        .limit(1);

      if (policeError) throw new Error("Failed to locate a police station.");
      if (!policeUsers || policeUsers.length === 0) throw new Error("No police units available to receive FIRs right now.");
      
      const assignedPoliceId = policeUsers[0].id;

      // 2. Insert the Case
      const { data, error } = await supabase.from('cases').insert([{
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        incident_date: formData.incident_date, 
        location: formData.location,           
        case_type: "Criminal",
        category: "Criminal",                  
        complaint_type: 'police_fir',          
        police_status: 'Pending',              
        status: 'Awaiting Police Review',
        // --- THIS IS THE FIX ---
        // We use the existing lawyer_id column to assign it to the Police Officer for now.
        lawyer_id: assignedPoliceId 
      }]).select();

      if (error) throw error;

      triggerToast("FIR Submitted", "Your request has been sent to the nearest police station.", "success");
      navigate("/cases");

    } catch (error) {
      console.error(error);
      triggerToast("Submission Failed", error.message || "Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 to-white dark:from-[#111827] dark:to-[#1F2937] p-8 md:p-10 rounded-[32px] border border-orange-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldAlert size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[11px] font-bold uppercase tracking-wider border border-red-200 dark:border-red-800 flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" /> Official e-FIR
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">File Police Complaint</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl">
            Submit incident details directly to law enforcement. Once approved, an official FIR will be registered.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Incident Title</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g., Vehicle Theft in Sector 4" className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Date of Incident</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input required type="date" value={formData.incident_date} onChange={(e) => setFormData({...formData, incident_date: e.target.value})} className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input required type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Exact address or landmark" className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Detailed Description</label>
          <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe exactly what happened..." rows="5" className="w-full p-4 bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white resize-none"></textarea>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button type="submit" disabled={loading} className="px-8 py-3 bg-slate-900 hover:bg-black dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Submit to Police <ArrowRight w-5 h-5 /></>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileFIR;