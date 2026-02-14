import React, { useState, useEffect } from "react";
import { 
  Briefcase, Clock, FileText, ChevronRight, CreditCard, 
  ShieldCheck, AlertCircle, Loader2 
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const LawyerDocket = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Payment Pending"); 

  // --- FETCH DOCKET ---
  useEffect(() => {
    const fetchDocket = async () => {
      setLoading(true);
      
      // Fetch cases based on the selected tab
      let query = supabase
        .from('cases')
        .select('*, users:user_id(full_name, email)')
        .order('created_at', { ascending: false });

      if (activeTab === "Payment Pending") {
         query = query.eq('status', 'Payment Pending');
      } else if (activeTab === "Active") {
         query = query.eq('status', 'Active');
      } else {
         // History/Closed
         query = query.in('status', ['Resolved', 'Closed', 'Rejected']);
      }

      const { data, error } = await query;
      if (error) console.error(error);
      else setCases(data);
      
      setLoading(false);
    };

    fetchDocket();
    
    // Subscribe to updates (e.g., when client pays, status changes to Active)
    const channel = supabase
      .channel('lawyer_docket')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cases' }, () => fetchDocket())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTab]);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
           <div>
              <h1 className="text-3xl font-bold font-serif-heading text-slate-900">My Docket</h1>
              <p className="text-slate-500 mt-1">Manage your active cases and track payments.</p>
           </div>
           
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {["Payment Pending", "Active", "History"].map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                     ${activeTab === tab 
                       ? 'bg-slate-900 text-white shadow-md' 
                       : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                 >
                   {tab}
                 </button>
              ))}
           </div>
        </div>

        {/* Case Grid */}
        <div className="grid gap-6">
           {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
           ) : cases.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                 <Briefcase className="mx-auto w-12 h-12 text-slate-300 mb-3" />
                 <h3 className="text-lg font-bold text-slate-900">No Cases Found</h3>
                 <p className="text-slate-500 text-sm">There are no cases in this category.</p>
              </div>
           ) : (
              cases.map((c) => (
                 <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                       <div className="flex gap-4">
                          <div className={`p-3 rounded-xl h-fit ${
                             c.status === 'Payment Pending' ? 'bg-amber-50 text-amber-600' :
                             c.status === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                             {c.status === 'Payment Pending' ? <CreditCard className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                          </div>
                          <div>
                             <h3 className="text-xl font-bold text-slate-900 capitalize">{c.title}</h3>
                             <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                <span className="font-semibold text-slate-700">{c.users?.full_name}</span>
                                <span>•</span>
                                <span>{c.case_type}</span>
                             </div>
                             <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                <Clock className="w-3 h-3" /> Last Updated: {new Date(c.created_at).toLocaleDateString()}
                             </div>
                          </div>
                       </div>

                       {/* Status specific indicators */}
                       {c.status === 'Payment Pending' ? (
                          <div className="text-right">
                             <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 inline-block mb-2">
                                Awaiting Retainer
                             </div>
                             <p className="text-xs text-slate-400">Client has been notified.</p>
                          </div>
                       ) : (
                          <button className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                             View Case File <ChevronRight className="w-4 h-4" />
                          </button>
                       )}
                    </div>
                 </div>
              ))
           )}
        </div>

      </div>
    </div>
  );
};

export default LawyerDocket;