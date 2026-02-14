import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, Trash2, ArrowRight, Loader2, Edit3 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/Authcontext";

const CaseDrafts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchDrafts = async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'Draft')
        .order('created_at', { ascending: false });

      if (!error) setDrafts(data);
      setLoading(false);
    };
    fetchDrafts();
  }, [user]);

  const handleResume = (draft) => {
    // Navigate to Complaint Page with Draft Data attached to state
    navigate('/complaint', { state: { draftData: draft } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Discard this draft?")) return;
    const { error } = await supabase.from('cases').delete().eq('id', id);
    if (!error) {
      setDrafts(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-end mb-8">
           <div>
              <h1 className="text-3xl font-bold font-serif-heading text-slate-900">Saved Drafts</h1>
              <p className="text-slate-500 mt-1">Continue where you left off.</p>
           </div>
           <button onClick={() => navigate('/file-complaint')} className="text-sm font-bold text-blue-600 hover:underline">
              Start New Filing
           </button>
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
        ) : drafts.length === 0 ? (
           <div className="bg-white rounded-xl border border-dashed border-slate-300 p-20 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No Drafts Found</h3>
              <p className="text-slate-500 text-sm">Your incomplete case filings will appear here.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {drafts.map((draft) => (
                 <div key={draft.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                    <div>
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                             {draft.category || "Uncategorized"}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {new Date(draft.created_at).toLocaleDateString()}
                          </span>
                       </div>
                       <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">
                          {draft.title || "Untitled Draft"}
                       </h3>
                       <p className="text-sm text-slate-500 line-clamp-2 italic mb-6">
                          {draft.description || "No description provided yet..."}
                       </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                       <button 
                         onClick={() => handleResume(draft)}
                         className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-black transition-all flex items-center justify-center gap-2"
                       >
                          Resume <ArrowRight className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleDelete(draft.id)}
                         className="px-4 border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default CaseDrafts;