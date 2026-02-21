import React, { useState, useEffect } from "react";
import { Siren, X, MapPin, AlertTriangle, Loader2, CheckCircle2, Crosshair, Type, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/Authcontext";

const EmergencyModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [type, setType] = useState("police"); 
  const [topic, setTopic] = useState(""); 
  const [description, setDescription] = useState(""); 
  
  // Location States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingLoc, setIsSearchingLoc] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState({ 
    lat: null, 
    lng: null, 
    display: "Location not set" 
  });

  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  // --- MANUAL SEARCH LOGIC (Geocoding) ---
  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearchingLoc(true);
    setLocation(prev => ({ ...prev, display: "Searching..." }));

    try {
      // Using OpenStreetMap's free Nominatim API (restricted to India for better accuracy)
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=1`);
      const data = await res.json();

      if (data && data.length > 0) {
        setLocation({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          display: data[0].display_name.split(',').slice(0, 3).join(', ') // Keep it concise
        });
      } else {
        setLocation({ lat: null, lng: null, display: "Location not found in India." });
      }
    } catch (e) {
      console.error("Geocoding failed:", e);
      setLocation({ lat: null, lng: null, display: "Search failed. Try GPS." });
    } finally {
      setIsSearchingLoc(false);
    }
  };

  // --- ROBUST GPS LOCATION DETECTION ---
  const detectLocation = async () => {
    setIsLocating(true);
    setSearchQuery(""); // Clear search bar if using GPS
    setLocation(prev => ({ ...prev, display: "Triangulating signal..." }));

    const fetchIpLocation = async () => {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.latitude && data.longitude) {
                return { 
                    lat: data.latitude, 
                    lng: data.longitude, 
                    display: `${data.city}, ${data.region} (Approx via IP)` 
                };
            }
        } catch (e) {
            console.error("IP Location failed:", e);
        }
        return null;
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const acc = position.coords.accuracy;
          
          setLocation({
            lat: lat,
            lng: lng,
            display: `GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E (±${Math.round(acc)}m)`
          });
          setIsLocating(false);
        },
        async (error) => {
          console.warn("GPS failed, switching to IP fallback...", error);
          const ipLoc = await fetchIpLocation();
          
          if (ipLoc) {
             setLocation(ipLoc);
          } else {
             setLocation({ lat: 28.6139, lng: 77.2090, display: "GPS Failed. Defaulted to HQ." });
          }
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
       const ipLoc = await fetchIpLocation();
       if (ipLoc) {
           setLocation(ipLoc);
       } else {
           setLocation({ lat: 28.6139, lng: 77.2090, display: "Device not supported. Defaulted to HQ." });
       }
       setIsLocating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSending(false);
      setTopic(""); 
      setDescription("");
      setSearchQuery("");
      setLocation({ lat: null, lng: null, display: "Please set location" });
      // We no longer auto-start detectLocation() to give them a choice
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!location.lat) {
      alert("Location is required. Please search for an address or use current GPS.");
      return;
    }
    
    const finalTopic = topic.trim() || (type === 'police' ? 'General Police Alert' : 'Medical Emergency');

    setIsSending(true);

    try {
      const { error } = await supabase
        .from('emergencies')
        .insert([
          {
            user_id: user?.id,
            type: type === 'police' ? 'Police Intervention' : 'Medical Assistance',
            topic: finalTopic, 
            status: 'active',
            priority: 'critical',
            location_lat: location.lat,
            location_lng: location.lng,
            location_address: location.display,
            description: description || "Immediate assistance required.",
            reporter_name: user?.user_metadata?.full_name || "Citizen",
            reporter_phone: user?.phone || "N/A"
          }
        ]);

      if (error) throw error;

      setStep(2); 
      setIsSending(false);

      setTimeout(() => {
        onClose();
        navigate('/complaint');
      }, 2000);

    } catch (err) {
      console.error("Critical Error:", err);
      alert("Network Error: Dispatch failed. Dial 100 immediately.");
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      <div className="w-full max-w-lg rounded-lg shadow-2xl overflow-hidden border relative animate-in zoom-in-95 duration-200
        bg-white border-slate-200 dark:bg-[#1e293b] dark:border-slate-700">
        
        <div className="h-1.5 w-full bg-red-600"></div>
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b flex justify-between items-start border-slate-100 dark:border-slate-700">
          <div className="flex items-start gap-4">
             <div className="p-3 rounded-md shrink-0 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-900/30">
               <Siren className="w-6 h-6 text-red-700 dark:text-red-500 animate-pulse" />
             </div>
             <div>
               <h2 className="text-xl font-bold leading-none text-slate-900 dark:text-white">Emergency Protocol</h2>
               <p className="text-sm mt-1.5 text-slate-500 dark:text-slate-400">This action will be logged and sent to dispatch.</p>
             </div>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-colors text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:text-white dark:hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-6">
               
               {/* LOCATION SELECTOR */}
               <div className="space-y-3">
                 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                   Incident Location <span className="text-red-500">*</span>
                 </label>
                 
                 {/* Search Bar */}
                 <div className="flex gap-2">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-slate-400" />
                        </div>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
                            placeholder="Enter specific address or city..."
                            className="w-full pl-9 p-3 text-sm rounded-md border focus:outline-none focus:ring-2 transition-all border-slate-200 focus:ring-slate-900/10 focus:border-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-500"
                        />
                    </div>
                    <button 
                        onClick={handleSearchLocation}
                        disabled={isSearchingLoc || !searchQuery.trim()}
                        className="px-4 bg-slate-900 text-white rounded-md hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                        {isSearchingLoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </button>
                 </div>

                 {/* OR Separator */}
                 <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400">OR</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                 </div>

                 {/* GPS Button & Current Status */}
                 <div className="flex items-center justify-between gap-3 p-3 rounded-md border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                    <span className={`text-sm font-medium font-mono truncate ${location.lat ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                      {location.display}
                    </span>
                    <button 
                      onClick={detectLocation}
                      disabled={isLocating}
                      className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                    >
                      {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3" />}
                      Use My GPS
                    </button>
                 </div>
               </div>

               {/* TYPE SELECTOR */}
               <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nature of Emergency</label>
                 <div className="grid grid-cols-2 gap-3">
                   <button 
                     onClick={() => setType('police')}
                     className={`py-3 px-4 rounded-md border text-sm font-bold flex items-center justify-center gap-2 transition-all
                       ${type === 'police' 
                         ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-700 dark:border-slate-600' 
                         : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-[#1e293b] dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'}
                     `}
                   >
                     <AlertTriangle className="w-4 h-4" /> Police / Crime
                   </button>
                   <button 
                     onClick={() => setType('medical')}
                     className={`py-3 px-4 rounded-md border text-sm font-bold flex items-center justify-center gap-2 transition-all
                       ${type === 'medical' 
                         ? 'bg-red-700 text-white border-red-700' 
                         : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-[#1e293b] dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'}
                     `}
                   >
                     <Siren className="w-4 h-4" /> Medical
                   </button>
                 </div>
               </div>

               {/* TOPIC INPUT */}
               <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                   Specific Topic
                 </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Type className="h-4 w-4 text-slate-400" />
                   </div>
                   <input 
                     type="text" 
                     value={topic} 
                     onChange={(e) => setTopic(e.target.value)}
                     placeholder={type === 'police' ? "e.g. Armed Robbery, Kidnapping..." : "e.g. Heart Attack, Accident..."} 
                     className="w-full pl-10 p-3 text-sm rounded-md border focus:outline-none focus:ring-2 transition-all border-slate-200 focus:ring-slate-900/10 focus:border-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-500"
                   />
                 </div>
               </div>

               {/* DESCRIPTION INPUT */}
               <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Situation Brief (Optional)</label>
                 <input 
                   type="text" 
                   value={description} 
                   onChange={(e) => setDescription(e.target.value)}
                   placeholder="e.g. Intruder in house, 2 men armed..." 
                   className="w-full p-3 text-sm rounded-md border focus:outline-none focus:ring-2 transition-all border-slate-200 focus:ring-slate-900/10 focus:border-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-500"
                 />
               </div>

               {/* SUBMIT BUTTON */}
               <div className="pt-2">
                 <button 
                   onClick={handleSubmit}
                   disabled={isSending || isLocating || isSearchingLoc || !location.lat} 
                   className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                   {isSending ? <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</> : "Confirm & Dispatch"}
                 </button>
               </div>

            </div>
          ) : (
            /* SUCCESS STATE */
            <div className="py-8 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-900/30">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Alert Registered</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Dispatch units have been notified at the specified location.</p>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="p-4 border-t text-center bg-slate-50 border-slate-100 dark:bg-slate-900/50 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">False reporting is a punishable offense under IPC Section 182.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyModal;