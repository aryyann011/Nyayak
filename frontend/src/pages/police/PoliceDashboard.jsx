import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  Navigation, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft,
  Phone,
  User,
  Shield,
  Siren
} from "lucide-react";

// --- CUSTOM MARKER STYLES (CSS-BASED) ---
// We use DivIcon to render cleaner, CSS-styled markers instead of blurry PNGs

// 1. The Police Unit (Blue Pulse)
const createUnitIcon = () => L.divIcon({
  className: "custom-unit-icon",
  html: `<div class="relative flex items-center justify-center w-6 h-6">
           <div class="absolute w-full h-full bg-blue-500/30 rounded-full animate-ping"></div>
           <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// 2. The Incident Pin (Matte Red)
const createIncidentIcon = (priority) => L.divIcon({
  className: "custom-incident-icon",
  html: `<div class="relative w-8 h-8 flex flex-col items-center justify-center">
            <div class="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <div class="w-0.5 h-3 bg-red-600/50"></div>
         </div>`,
  iconSize: [32, 40],
  iconAnchor: [16, 40] // Anchor at the bottom tip
});

// Mock Data (New Delhi)
const UNIT_LOCATION = { lat: 28.6139, lng: 77.2090 }; // Central Delhi

const INCIDENTS = [
  { 
    id: "INC-001", 
    type: "SOS Alert", 
    caller: "Priya Sharma",
    phone: "+91 98765 43210",
    description: "Assault reported. Victim is hiding in a shop. Perpetrators are outside.",
    priority: "Critical", 
    location: "Connaught Place, Inner Circle", 
    time: "2 mins ago", 
    status: "Active",
    lat: 28.6315, 
    lng: 77.2167 
  },
  { 
    id: "INC-002", 
    type: "Suspicious Activity", 
    caller: "Anonymous",
    phone: "N/A",
    description: "Unidentified white van parked near school gate for 40 mins.",
    priority: "High", 
    location: "India Gate Area", 
    time: "15 mins ago", 
    status: "Pending",
    lat: 28.6129, 
    lng: 77.2295 
  },
  { 
    id: "INC-003", 
    type: "Noise Complaint", 
    caller: "R.K. Gupta",
    phone: "+91 99887 77665",
    description: "Loud music in residential area post 10 PM.",
    priority: "Low", 
    location: "Lodi Gardens", 
    time: "1 hour ago", 
    status: "Resolved",
    lat: 28.5933, 
    lng: 77.2197 
  }
];

// Helper: Moves the map when selection changes
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.2 });
  }, [center, map]);
  return null;
};

const PoliceDashboard = () => {
  const [selectedIncident, setSelectedIncident] = useState(null); // Null means "Show List"
  const [mapCenter, setMapCenter] = useState([UNIT_LOCATION.lat, UNIT_LOCATION.lng]);

  const handleSelect = (incident) => {
    setSelectedIncident(incident);
    setMapCenter([incident.lat, incident.lng]);
  };

  const handleBack = () => {
    setSelectedIncident(null);
    setMapCenter([UNIT_LOCATION.lat, UNIT_LOCATION.lng]); // Return focus to Unit
  };

  return (
    <div className="h-full w-full bg-[#F1F5F9] p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
      
      {/* 1. LEFT PANE: THE MAP (Floating Card Style) */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative z-0">
         <MapContainer 
           center={mapCenter} 
           zoom={13} 
           style={{ height: "100%", width: "100%" }}
           zoomControl={false}
         >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Cleaner, professional map tiles
            />
            
            <MapUpdater center={mapCenter} />

            {/* A. The Police Unit (You) */}
            <Marker position={[UNIT_LOCATION.lat, UNIT_LOCATION.lng]} icon={createUnitIcon()}>
               <Popup className="font-sans">
                 <div className="text-center">
                   <strong className="text-blue-700">UNIT 402</strong><br/>
                   <span className="text-xs text-slate-500">Your Location</span>
                 </div>
               </Popup>
            </Marker>

            {/* B. The Incidents */}
            {INCIDENTS.map((inc) => (
              <Marker 
                key={inc.id} 
                position={[inc.lat, inc.lng]} 
                icon={createIncidentIcon(inc.priority)}
                eventHandlers={{
                  click: () => handleSelect(inc),
                }}
              />
            ))}
         </MapContainer>

         {/* Map Legend Overlay */}
         <div className="absolute top-4 left-4 z-[500] bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-lg shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
               <div className="w-2.5 h-2.5 bg-blue-600 rounded-full border border-white shadow"></div>
               Your Unit
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
               <div className="w-2.5 h-2.5 bg-red-600 rounded-full border border-white shadow"></div>
               Active Incident
            </div>
         </div>
      </div>

      {/* 2. RIGHT PANE: DYNAMIC SIDEBAR */}
      <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* --- STATE A: LIST VIEW --- */}
        {!selectedIncident ? (
          <>
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Dispatch Queue</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Sector 4 • 3 Active Alerts</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                <Siren className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {INCIDENTS.map((incident) => (
                <div 
                  key={incident.id}
                  onClick={() => handleSelect(incident)}
                  className="p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                     <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border
                       ${incident.priority === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' : 
                         incident.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                         'bg-emerald-50 text-emerald-700 border-emerald-100'}
                     `}>
                       {incident.priority}
                     </span>
                     <span className="text-xs text-slate-400">{incident.time}</span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {incident.type}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                     <MapPin className="w-3 h-3" />
                     {incident.location}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* --- STATE B: DETAIL VIEW --- */
          <>
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-slate-200"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Incident Details</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
               <div className="flex items-start justify-between mb-6">
                 <h1 className="text-2xl font-bold text-slate-900 leading-tight">{selectedIncident.type}</h1>
                 <Shield className="w-8 h-8 text-slate-200" />
               </div>

               {/* Priority Tag */}
               <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold mb-6
                 ${selectedIncident.priority === 'Critical' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-orange-50 border-orange-100 text-orange-700'}
               `}>
                 <AlertTriangle className="w-3.5 h-3.5" />
                 {selectedIncident.priority} Priority
               </div>

               {/* Data Grid */}
               <div className="space-y-6">
                 
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                   <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                     <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                     <div>
                       <div className="text-sm font-bold text-slate-800">{selectedIncident.location}</div>
                       <div className="text-xs text-slate-500 mt-1 font-mono">
                         {selectedIncident.lat}, {selectedIncident.lng}
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                   <p className="text-sm text-slate-600 leading-relaxed p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                     {selectedIncident.description}
                   </p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Caller</label>
                     <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                       <User className="w-4 h-4 text-slate-400" /> {selectedIncident.caller}
                     </div>
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</label>
                     <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                       <Phone className="w-4 h-4 text-slate-400" /> {selectedIncident.phone}
                     </div>
                   </div>
                 </div>

               </div>
            </div>

            {/* Action Footer */}
            <div className="p-5 border-t border-slate-100 bg-white space-y-3">
              <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                <Navigation className="w-4 h-4" /> Respond to Location
              </button>
              <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Mark as Resolved
              </button>
            </div>
          </>
        )}

      </div>

    </div>
  );
};

export default PoliceDashboard;