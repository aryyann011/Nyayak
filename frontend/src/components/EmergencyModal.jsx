import React, { useState, useEffect } from "react";
import { Siren, X, MapPin, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmergencyModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("police");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const newLog = {
        id: Date.now(),
        type: type === 'police' ? 'Police Intervention' : 'Medical Assistance',
        location: "Lat: 28.6139, Long: 77.2090",
        time: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
        status: "Active",
        priority: "Critical"
      };

      const existingLogs = JSON.parse(localStorage.getItem('emergencyLogs') || '[]');
      localStorage.setItem('emergencyLogs', JSON.stringify([newLog, ...existingLogs]));

      setLoading(false);
      setStep(2);

      setTimeout(() => {
        onClose();
        navigate('/complaint');
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="w-full max-w-lg rounded-lg shadow-2xl overflow-hidden border relative animate-in zoom-in-95 duration-200
        bg-white border-slate-200 
        dark:bg-[#1e293b] dark:border-slate-700
      ">
        
        {/* Semantic Header Strip */}
        <div className="h-1.5 w-full bg-red-600"></div>
        
        {/* Header */}
        <div className="px-6 py-5 border-b flex justify-between items-start
          border-slate-100 dark:border-slate-700
        ">
          <div className="flex items-start gap-4">
             <div className="p-3 rounded-md shrink-0
               bg-red-50 border border-red-100 
               dark:bg-red-900/20 dark:border-red-900/30
             ">
               <Siren className="w-6 h-6 text-red-700 dark:text-red-500" />
             </div>
             <div>
               <h2 className="text-xl font-bold leading-none
                 text-slate-900 dark:text-white
               ">Emergency Protocol</h2>
               <p className="text-sm mt-1.5
                 text-slate-500 dark:text-slate-400
               ">
                 This action will be logged and sent to dispatch.
               </p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded transition-colors
              text-slate-400 hover:text-slate-700 hover:bg-slate-50
              dark:hover:text-white dark:hover:bg-slate-700
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-6">
               
               {/* Location Field */}
               <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-wider
                   text-slate-500 dark:text-slate-400
                 ">Detected Location</label>
                 <div className="flex items-center gap-3 p-3 rounded-md border
                   bg-slate-50 border-slate-200 text-slate-700
                   dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300
                 ">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium font-mono">28.6139° N, 77.2090° E (Accuracy: 5m)</span>
                 </div>
               </div>

               {/* Type Selector */}
               <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-wider
                   text-slate-500 dark:text-slate-400
                 ">Nature of Emergency</label>
                 <div className="grid grid-cols-2 gap-3">
                   <button 
                     onClick={() => setType('police')}
                     className={`py-3 px-4 rounded-md border text-sm font-bold flex items-center justify-center gap-2 transition-all
                       ${type === 'police' 
                         ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-700 dark:border-slate-600' 
                         : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-[#1e293b] dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'}
                     `}
                   >
                     <AlertTriangle className="w-4 h-4" />
                     Police / Crime
                   </button>
                   <button 
                     onClick={() => setType('medical')}
                     className={`py-3 px-4 rounded-md border text-sm font-bold flex items-center justify-center gap-2 transition-all
                       ${type === 'medical' 
                         ? 'bg-red-700 text-white border-red-700' 
                         : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-[#1e293b] dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'}
                     `}
                   >
                     <Siren className="w-4 h-4" />
                     Medical
                   </button>
                 </div>
               </div>

               {/* Notes */}
               <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-wider
                   text-slate-500 dark:text-slate-400
                 ">Situation Brief (Optional)</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Intruder in house..." 
                   className="w-full p-3 text-sm rounded-md border focus:outline-none focus:ring-2 transition-all
                     border-slate-200 focus:ring-slate-900/10 focus:border-slate-400
                     dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-500
                   "
                 />
               </div>

               {/* Actions */}
               <div className="pt-2">
                 <button 
                   onClick={handleSubmit}
                   disabled={loading}
                   className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                 >
                   {loading ? (
                     <>
                       <Loader2 className="w-4 h-4 animate-spin" />
                       Transmitting...
                     </>
                   ) : (
                     "Confirm & Dispatch"
                   )}
                 </button>
               </div>

            </div>
          ) : (
            /* Success State */
            <div className="py-8 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border
                 bg-green-50 border-green-100 
                 dark:bg-green-900/20 dark:border-green-900/30
               ">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Alert Registered</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                 Incident #LOG-{Math.floor(Math.random() * 10000)} created.
               </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 1 && (
          <div className="p-4 border-t text-center
            bg-slate-50 border-slate-100
            dark:bg-slate-900/50 dark:border-slate-700
          ">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              False reporting is a punishable offense under IPC Section 182.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyModal;