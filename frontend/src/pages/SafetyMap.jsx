import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { 
  Search, 
  Layers, 
  MapPin, 
  Navigation, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from "lucide-react";

const SafetyMap = () => {
  // State to manage active layers (in a real app, these would toggle map layers)
  const [layers, setLayers] = useState({
    heatmap: true,
    stations: true,
    incidents: false,
    safeRoutes: true
  });

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    // The container fills the remaining height of the dashboard content area
    <div className="h-[calc(100vh-8rem)] relative font-sans">
      
      {/* --- 1. THE MAP CONTAINER (Placeholder for Mapbox/Leaflet) --- */}
      <div className="absolute inset-0 w-full h-full rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1120] relative group">
        {/* NOTE: In a real implementation, your map component (<MapboxMap /> etc.) goes here.
            We are using a professional static placeholder image with CSS filters to simulate the look.
        */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{ 
            // Using a darker, muted map style placeholder
            backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/77.2090,28.6139,11,0/1200x800?access_token=placeholder')`,
            // CSS trick to make a standard map look like a dark mode GIS interface
            filter: 'grayscale(0.2) contrast(1.1) brightness(0.8) invert(1) hue-rotate(180deg)',
            // In dark mode, we invert it back slightly for a "dark mode map" look
            '.dark &': { filter: 'grayscale(0.2) contrast(1.2) brightness(0.6)' }
          }}
        ></div>

        {/* Simulated Heatmap Overlay (CSS Gradient) */}
        {layers.heatmap && (
          <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
               style={{ background: 'radial-gradient(circle at 60% 40%, rgba(255, 0, 0, 0.4) 0%, rgba(255, 165, 0, 0.2) 30%, transparent 70%)' }}>
          </div>
        )}

        {/* Simulated Map Pins for realism */}
        <MapMarker top="40%" left="60%" type="incident" />
        <MapMarker top="45%" left="62%" type="incident" />
        <MapMarker top="30%" left="40%" type="station" label="Central Station" />
        <MapMarker top="70%" left="20%" type="safe" label="Safe Zone Sector 4" />

      </div>

      {/* --- 2. FLOATING CONTROL PANEL (Left Side) --- */}
      <div className="absolute top-6 left-6 w-80 flex flex-col gap-4 z-10">
        
        {/* Search Bar Card */}
        <div className="bg-white/90 dark:bg-[#1F2937]/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search location or landmark..." 
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm font-medium text-slate-900 dark:text-white placeholder-slate-500 focus:ring-0 outline-none"
            />
            <div className="absolute right-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 font-mono text-xs border border-slate-200 dark:border-slate-700">
              /
            </div>
          </div>
        </div>

        {/* Layers Control Card */}
        <div className="bg-white/90 dark:bg-[#1F2937]/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4" /> Map Layers
            </h3>
            <Info className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>

          <div className="space-y-1">
            <LayerToggle 
              label="Crime Heatmap" 
              active={layers.heatmap} 
              onClick={() => toggleLayer('heatmap')}
              icon={<AlertTriangle className="w-4 h-4 text-orange-500" />}
            />
            <LayerToggle 
              label="Police Stations" 
              active={layers.stations} 
              onClick={() => toggleLayer('stations')}
              icon={<ShieldAlert className="w-4 h-4 text-blue-500" />}
            />
            <LayerToggle 
              label="Recent Incidents" 
              active={layers.incidents} 
              onClick={() => toggleLayer('incidents')}
              icon={<MapPin className="w-4 h-4 text-red-500" />}
            />
            <LayerToggle 
              label="Safe Routes" 
              active={layers.safeRoutes} 
              onClick={() => toggleLayer('safeRoutes')}
              icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            />
          </div>
        </div>

        {/* Legend Card */}
        <div className="bg-white/90 dark:bg-[#1F2937]/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Risk Density Index</h3>
          <div className="h-3 w-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-600 mb-2"></div>
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>Low Risk</span>
            <span>Moderate</span>
            <span>High Risk</span>
          </div>
        </div>
      </div>

      {/* --- 3. FLOATING ACTION BUTTONS (Bottom Right) --- */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-10">
        <MapFab icon={<Navigation className="w-5 h-5" />} label="Recenter" />
        <button className="group relative flex items-center justify-center w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg shadow-red-600/30 transition-all active:scale-95">
           <ShieldAlert className="w-6 h-6 animate-pulse" />
           {/* Tooltip */}
           <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
             Trigger SOS
           </span>
        </button>
      </div>

      {/* --- 4. STATUS BAR (Bottom Center) --- */}
       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#1F2937]/90 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 shadow-lg z-10 flex items-center gap-3">
          <div className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            You are in a <span className="font-bold text-emerald-600 dark:text-emerald-500">Safe Zone</span>. Nearest station 1.2km away.
          </p>
       </div>

    </div>
  );
};

// --- HELPER COMPONENTS FOR PROFESSIONAL LOOK ---

// 1. Layer Toggle Switch UI
const LayerToggle = ({ label, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border
      ${active 
        ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600" 
        : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent"
      }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg ${active ? 'bg-white dark:bg-slate-700 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}>
        {icon}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
        {label}
      </span>
    </div>
    {/* Professional Toggle Switch visuals */}
    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${active ? 'bg-slate-900 dark:bg-orange-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-4' : ''}`}></div>
    </div>
  </button>
);

// 2. Floating Action Button (FAB)
const MapFab = ({ icon, label }) => (
  <button className="group relative flex items-center justify-center w-12 h-12 bg-white dark:bg-[#1F2937] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition-all active:scale-95">
    {icon}
    <span className="absolute right-14 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {label}
    </span>
  </button>
);

// 3. Simulated Map Marker (For visual reference only)
const MapMarker = ({ top, left, type, label }) => {
    const colors = {
        incident: "bg-red-500 shadow-red-500/50",
        station: "bg-blue-500 shadow-blue-500/50",
        safe: "bg-emerald-500 shadow-emerald-500/50"
    };
    
    return (
        <div className="absolute flex flex-col items-center pointer-events-none" style={{ top, left, transform: 'translate(-50%, -100%)' }}>
             {label && (
                 <div className="mb-2 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold text-slate-800 dark:text-white rounded-lg shadow-md whitespace-nowrap">
                     {label}
                 </div>
             )}
             <div className="relative flex items-center justify-center">
                 <div className={`w-4 h-4 rounded-full ${colors[type]} shadow-lg z-10 relative`}></div>
                 <div className={`absolute w-10 h-10 rounded-full ${colors[type]} opacity-30 animate-ping`}></div>
             </div>
             {/* Pin stick */}
             <div className="w-0.5 h-4 bg-slate-400/50 -mt-1"></div>
        </div>
    )
}

export default SafetyMap;