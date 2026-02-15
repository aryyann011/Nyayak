import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, MapPin, FileText } from "lucide-react";

export default function AddEventModal({ onClose, onAdd, prefillData = {} }) {
  // Initialize state with prefillData if available (from Docket)
  const [title, setTitle] = useState(prefillData.title || "");
  const [type, setType] = useState(prefillData.type || "Court");
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 10));
  const [timeStr, setTimeStr] = useState("10:00");
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState(prefillData.location || "High Court");
  const [notes, setNotes] = useState("");
  const [riskLevel, setRiskLevel] = useState("Normal");

  const handleSubmit = () => {
    if (!title || !dateStr || !timeStr) return;

    // Construct ISO DateTime
    const startDateTime = new Date(`${dateStr}T${timeStr}:00`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    onAdd({
      title,
      event_type: type,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      location,
      notes,
      case_id: prefillData.case_id || null, // Link to case if provided
      risk_level: riskLevel
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            <span className="font-bold text-lg">Schedule Event</span>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {/* Title & Type */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Event Title</label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. Hearing: State vs Kumar"
              />
            </div>
            <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
               <select 
                 value={type} 
                 onChange={(e) => setType(e.target.value)}
                 className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 font-medium outline-none"
               >
                 <option value="Court">Court</option>
                 <option value="Meeting">Meeting</option>
                 <option value="Deadline">Deadline</option>
               </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Time</label>
                <input type="time" value={timeStr} onChange={(e) => setTimeStr(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Duration (m)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
             </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
             <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin className="w-3 h-3"/> Location</label>
             <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" placeholder="e.g. High Court, Room 402 or Zoom Link" />
          </div>

          {/* Priority */}
          <div className="space-y-1">
             <label className="text-xs font-bold text-slate-500 uppercase">Priority / Risk</label>
             <div className="flex gap-2">
               {['Normal', 'Important', 'Critical'].map((level) => (
                 <button 
                   key={level}
                   onClick={() => setRiskLevel(level)}
                   className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                     riskLevel === level 
                       ? level === 'Critical' ? 'bg-red-500 text-white border-red-600' 
                       : level === 'Important' ? 'bg-blue-500 text-white border-blue-600'
                       : 'bg-slate-700 text-white border-slate-800'
                       : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                   }`}
                 >
                   {level}
                 </button>
               ))}
             </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
             <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><FileText className="w-3 h-3"/> Notes</label>
             <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm h-20 resize-none" placeholder="Add details about documents, strategy..." />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg shadow-orange-200 transition-all transform active:scale-95">
            Confirm Schedule
          </button>
        </div>

      </div>
    </div>
  );
}