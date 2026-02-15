import React, { useState, useEffect } from "react";
import { 
  Briefcase, Clock, ChevronRight, CreditCard, 
  ShieldCheck, Loader2, CalendarPlus, Edit3, CheckCircle, X
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import AddEventModal from "../../components/Lawyer/AddEvenModal";

const LawyerDocket = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Active"); 
  
  // Modal States
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [selectedCaseForSchedule, setSelectedCaseForSchedule] = useState(null);
  const [lastScheduledEvent, setLastScheduledEvent] = useState(null); 

  // --- FETCH DOCKET ---
  const fetchDocket = async () => {
    setLoading(true);
    let query = supabase
      .from('cases')
      .select('*, users:user_id(full_name, email)')
      .order('created_at', { ascending: false });

    if (activeTab === "Payment Pending") {
       query = query.eq('status', 'Payment Pending');
    } else if (activeTab === "Active") {
       query = query.eq('status', 'Active');
    } else {
       query = query.in('status', ['Resolved', 'Closed', 'Rejected']);
    }

    const { data: casesData, error } = await query;
    
    if (error) {
      console.error(error);
    } else if (casesData && casesData.length > 0) {
      const caseIds = casesData.map(c => c.id);
      
      // Get all events for these cases (removed date filter to ensure we see everything)
      const { data: eventsData } = await supabase
        .from('legal_events')
        .select('*')
        .in('case_id', caseIds);

      // Merge events into cases
      const mergedData = casesData.map(c => ({
        ...c,
        // Find the event associated with this case
        upcoming_event: eventsData?.find(e => e.case_id === c.id) || null
      }));
      
      setCases(mergedData);
    } else {
      setCases([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocket();
  }, [activeTab]);

  // --- HANDLERS ---
  const handleOpenSchedule = (caseItem) => {
    const existingEvent = caseItem.upcoming_event;
    
    setSelectedCaseForSchedule({
      case_id: caseItem.id,
      title: existingEvent ? existingEvent.title : `Hearing: ${caseItem.title}`,
      type: existingEvent ? existingEvent.event_type : 'Court',
      location: existingEvent ? existingEvent.location : 'High Court',
      start_time: existingEvent ? existingEvent.start_time : null,
      notes: existingEvent ? existingEvent.notes : '',
      id: existingEvent ? existingEvent.id : null 
    });
    setShowScheduleModal(true);
  };

  const handleCreateEvent = async (eventData) => {
    try {
      // 1. Send to DB and getting the returned data back is CRITICAL
      const { data: newEvent, error } = await supabase
        .from('legal_events')
        .upsert([{
          ...eventData,
          lawyer_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      // 2. FORCE UPDATE LOCAL STATE (Optimistic UI Update)
      // This ensures the UI changes INSTANTLY without waiting for a re-fetch
      setCases(prevCases => prevCases.map(c => {
        if (c.id === eventData.case_id) {
          return { ...c, upcoming_event: newEvent }; // Attach the new event to the case immediately
        }
        return c;
      }));
      
      setShowScheduleModal(false);
      
      // 3. Show Success Popup
      setLastScheduledEvent(newEvent);
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to schedule event");
    }
  };

  const handleViewCaseFile = (caseId) => {
    navigate(`/lawyer/active-cases/${caseId}`);
  };

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
                 <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
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

                             {/* --- SHOW SCHEDULED TIME --- */}
                             {/* This will now appear INSTANTLY after scheduling because we forced state update */}
                             {c.upcoming_event ? (
                                <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit">
                                   <Clock className="w-3 h-3" /> 
                                   Scheduled: {new Date(c.upcoming_event.start_time).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                                </div>
                             ) : (
                                <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                   <Clock className="w-3 h-3" /> Last Updated: {new Date(c.created_at).toLocaleDateString()}
                                </div>
                             )}
                          </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="text-right flex flex-col items-end gap-2">
                          {c.status === 'Payment Pending' ? (
                             <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 inline-block">
                                Awaiting Retainer
                             </div>
                          ) : c.status === 'Active' ? (
                             <div className="flex items-center gap-3">
                                
                                {/* --- DYNAMIC SCHEDULE BUTTON --- */}
                                <button 
                                  onClick={() => handleOpenSchedule(c)}
                                  className={`flex items-center gap-2 px-4 py-2 text-white text-xs font-bold uppercase rounded-lg transition-colors shadow-sm
                                    ${c.upcoming_event 
                                        ? 'bg-slate-700 hover:bg-slate-800' // Darker for Edit
                                        : 'bg-slate-900 hover:bg-orange-600' // Standard for Schedule
                                    }`}
                                >
                                   {c.upcoming_event ? (
                                      <> <Edit3 className="w-4 h-4" /> Edit Schedule </>
                                   ) : (
                                      <> <CalendarPlus className="w-4 h-4" /> Schedule </>
                                   )}
                                </button>
                                
                                <button 
                                  onClick={() => handleViewCaseFile(c.id)}
                                  className="flex items-center gap-1 text-blue-600 font-bold hover:underline text-sm"
                                >
                                   View File <ChevronRight className="w-4 h-4" />
                                </button>
                             </div>
                          ) : (
                             <span className="text-slate-400 text-sm font-bold">Closed</span>
                          )}
                       </div>
                    </div>
                 </div>
              ))
           )}
        </div>

        {/* --- SCHEDULE MODAL --- */}
        {showScheduleModal && (
          <AddEventModal 
            onClose={() => setShowScheduleModal(false)}
            onAdd={handleCreateEvent}
            prefillData={selectedCaseForSchedule}
          />
        )}

        {/* --- SUCCESS POPUP --- */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl transform transition-all scale-100 border border-slate-100">
                <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Meeting Scheduled!</h3>
                   <p className="text-slate-500 text-sm mb-6">
                      Your event has been successfully added to the docket for <span className="font-bold text-slate-800">{lastScheduledEvent && new Date(lastScheduledEvent.start_time).toLocaleDateString()}</span>.
                   </p>
                   <button 
                      onClick={() => setShowSuccessModal(false)}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                   >
                      Done
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LawyerDocket;