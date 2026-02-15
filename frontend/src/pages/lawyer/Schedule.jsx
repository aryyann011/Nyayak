import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar, Clock, AlertTriangle, Video, MapPin, Gauge, Loader2
} from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/Authcontext";
import AddEventModal from "../../components/Lawyer/AddEvenModal";

const now = () => new Date();
const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// NEW: Date Formatter
const formatDate = (date) => date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

export default function Schedule() {
  const { user } = useAuth();
  const [view, setView] = useState("day"); // 'day', 'week', 'month'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  
  // --- FETCH & DEDUPLICATE ---
  const fetchEvents = async () => {
    if(!user) return;
    const { data, error } = await supabase
      .from('legal_events')
      .select('*')
      .eq('lawyer_id', user.id)
      .order('start_time', { ascending: true });
    
    if(error) {
      console.error(error);
      toast.error("Failed to load schedule");
    } else {
      const formatted = data.map(e => ({
        ...e,
        start: new Date(e.start_time),
        end: new Date(e.end_time),
        type: e.event_type 
      }));

      // Deduplicate Logic
      const uniqueEventsMap = new Map();
      formatted.forEach((event) => {
         const distinctKey = event.case_id 
            ? `${event.case_id}-${event.type}-${event.start.getTime()}` 
            : `${event.title}-${event.type}-${event.start.getTime()}`;
         uniqueEventsMap.set(distinctKey, event);
      });
      setEvents(Array.from(uniqueEventsMap.values()));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    const subscription = supabase
      .channel('schedule_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'legal_events' }, fetchEvents)
      .subscribe();
    return () => { supabase.removeChannel(subscription); };
  }, [user]);

  // --- STATS LOGIC ---
  const upcoming = useMemo(() => events.find((e) => e.start > now()) || null, [events]);
  const workload = useMemo(() => {
    let court = 0, meetings = 0, deadlines = 0, mins = 0;
    events.forEach((e) => {
      const isToday = e.start.toDateString() === now().toDateString();
      if(isToday) {
        if (e.type === "Court") court++;
        if (e.type === "Meeting") meetings++;
        if (e.type === "Deadline") deadlines++;
        mins += (e.end - e.start) / 60000;
      }
    });
    const score = Math.min(100, Math.round((mins / 480) * 100)); 
    return { court, meetings, deadlines, mins, score };
  }, [events]);

  const handleCreateEvent = async (eventData) => {
    try {
        const { error } = await supabase.from('legal_events').insert([{ ...eventData, lawyer_id: user.id }]);
        if(error) throw error;
        toast.success("Event Added");
        setShowAdd(false);
        fetchEvents();
    } catch(e) { toast.error("Error creating event"); }
  };

  // --- HELPER COMPONENTS FOR VIEWS ---

  // 1. DAY VIEW COMPONENT (Updated with Date)
  const DayView = () => {
    // Show all events sorted by time for the day view list
    // (Or filter by "Today" if you strictly want only today's events)
    // currently showing ALL upcoming to ensure user sees dates
    const displayEvents = events; 
    
    if (displayEvents.length === 0) return (
       <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-xl">
         <p className="text-slate-400 font-bold">No events scheduled.</p>
       </div>
    );

    return (
      <div className="space-y-4">
        {displayEvents.map((e) => (
          <div key={e.id} className="relative p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${e.risk_level === 'Critical' ? 'bg-red-500' : 'bg-blue-500'}`} />
             <div className="flex justify-between items-start pl-2">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-slate-50 text-slate-700">{e.type}</span>
                      
                      {/* --- DATE ADDED HERE --- */}
                      <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(e.start)} • {formatTime(e.start)}
                      </span>
                   </div>
                   <h3 className="text-lg font-bold text-slate-900">{e.title}</h3>
                   <div className="flex items-center gap-4 text-sm text-slate-500 mt-2 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {e.location}</span>
                   </div>
                </div>
                <button className="px-3 py-1.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600">Details</button>
             </div>
          </div>
        ))}
      </div>
    );
  };

  // 2. WEEK VIEW COMPONENT
  const WeekView = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (
      <div className="grid grid-cols-7 gap-2 h-[500px] overflow-x-auto min-w-[800px]">
        {days.map((day, i) => (
          <div key={day} className="flex flex-col bg-white rounded-lg border border-slate-200 h-full">
            <div className="p-2 border-b border-slate-100 text-center font-bold text-slate-700 bg-slate-50 rounded-t-lg">
              {day}
            </div>
            <div className="p-2 flex-1 space-y-2 overflow-y-auto">
               {events.filter(e => e.start.getDay() === (i + 1)).map(e => (
                 <div key={e.id} className="p-2 bg-blue-50 border border-blue-100 rounded text-xs group hover:bg-blue-100 transition-colors">
                    <div className="font-bold text-blue-900 truncate">{e.title}</div>
                    <div className="text-[10px] text-blue-500 mt-1">{formatDate(e.start)}</div>
                    <div className="text-[10px] text-slate-500">{formatTime(e.start)}</div>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 3. MONTH VIEW COMPONENT
  const MonthView = () => {
    const daysInMonth = Array.from({length: 30}, (_, i) => i + 1);
    
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="bg-slate-50 p-2 text-center text-xs font-bold text-slate-500 uppercase">{d}</div>
          ))}
          {daysInMonth.map(day => (
            <div key={day} className="bg-white min-h-[100px] p-2 hover:bg-slate-50 transition-colors cursor-pointer relative">
              <div className="text-right text-xs font-bold text-slate-400 mb-1">{day}</div>
              <div className="space-y-1">
                 {events.filter(e => e.start.getDate() === day).slice(0, 3).map(e => (
                   <div key={e.id} className={`text-[10px] px-1 py-0.5 rounded truncate ${e.type === 'Court' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                     {formatTime(e.start)} {e.title}
                   </div>
                 ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- RENDER ---
  return (
    <div className="space-y-6 p-8 min-h-screen bg-slate-50">
      
      {/* Header Card */}
      <div className="rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white text-orange-700 border border-orange-200 shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-slate-900">Court Schedule</div>
              <div className="text-sm text-slate-600 font-medium">Manage hearings, meetings and deadlines</div>
            </div>
          </div>
          
          <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
            {['day', 'week', 'month'].map((v) => (
              <button
                key={v}
                className={`px-4 py-2 text-sm font-bold capitalize rounded-md transition-all ${
                  view === v ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => setView(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        
        {upcoming && (
           <div className="mt-6 flex items-center gap-3 p-3 bg-white/80 border border-orange-200/50 rounded-lg backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-sm font-bold text-slate-700">Next Up:</span>
              <span className="text-sm font-bold text-slate-900">{upcoming.title}</span>
              {/* --- UPDATED BANNER DATE --- */}
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded">
                 {formatDate(upcoming.start)} • {formatTime(upcoming.start)}
              </span>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Dynamic View Switching */}
        <div className="lg:col-span-2">
           {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-400"/></div>
           ) : (
             <>
               {view === 'day' && <DayView />}
               {view === 'week' && <WeekView />}
               {view === 'month' && <MonthView />}
             </>
           )}
        </div>

        {/* RIGHT COLUMN: Stats & Tools */}
        <div className="space-y-6">
           <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Gauge className="w-5 h-5 text-orange-600"/> Daily Workload
                 </div>
                 <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{Math.round(workload.mins/60)}h Scheduled</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
                 <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000" style={{width: `${workload.score}%`}}></div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                 <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{workload.court}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Hearings</div>
                 </div>
                 <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{workload.meetings}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Meetings</div>
                 </div>
                 <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{workload.deadlines}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Deadlines</div>
                 </div>
              </div>
           </div>

           <button 
             onClick={() => setShowAdd(true)}
             className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-transform active:scale-95"
           >
             + Add Custom Event
           </button>
        </div>

      </div>

      {showAdd && (
         <AddEventModal onClose={() => setShowAdd(false)} onAdd={handleCreateEvent} />
      )}

    </div>
  );
}