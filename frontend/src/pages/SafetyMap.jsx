import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  Search, Layers, Navigation, ShieldAlert, 
  Loader2 
} from "lucide-react";
import { useTheme } from "../context/themeContext";

// --- ICONS CONFIGURATION ---
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  station: createIcon('blue'),
  incident: createIcon('red'),
  safe: createIcon('green'),
  search: createIcon('violet') 
};

// --- MOCK DATA ---
const SAFETY_DATA = [
  { id: 1, type: 'station', lat: 28.6139, lng: 77.2090, title: "Central Police Station", desc: "Open 24/7 • 1.2km away" },
  { id: 2, type: 'incident', lat: 28.6200, lng: 77.2100, title: "Theft Reported", desc: "2 hours ago • Investigation ongoing" },
  { id: 3, type: 'safe', lat: 28.6100, lng: 77.2000, title: "Safe Zone: Sector 4", desc: "High surveillance area" },
];

const SafetyMap = () => {
  const { isDark } = useTheme();
  
  // 1. STATE FOR SEARCH & MAP CONTROL
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const [viewState, setViewState] = useState({
    center: [28.6139, 77.2090], 
    zoom: 13,
    marker: null 
  });

  const [activeLayers, setActiveLayers] = useState({
    stations: true,
    incidents: true,
    safeRoutes: true
  });

  const mapStyle = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  // --- SEARCH LOGIC ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newCoords = [parseFloat(lat), parseFloat(lon)];

        setViewState({
          center: newCoords,
          zoom: 15, 
          marker: { lat: newCoords[0], lng: newCoords[1], title: display_name }
        });
      } else {
        alert("Location not found. Try a city name or landmark.");
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecenter = () => {
    setViewState(prev => ({ ...prev, center: [28.6139, 77.2090], zoom: 13 }));
  };

  const toggleLayer = (key) => setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    // PARENT CONTAINER: Relative Z-0 ensures everything here stays under the Sidebar (which is likely Z-50)
    <div className="h-[calc(100vh-8rem)] relative z-0 font-sans rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm group">
      
      <MapContainer 
        center={viewState.center} 
        zoom={viewState.zoom} 
        style={{ height: "100%", width: "100%", background: isDark ? '#111827' : '#F3F4F6', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer attribution='&copy; OpenStreetMap' url={mapStyle} />

        {activeLayers.stations && SAFETY_DATA.filter(d => d.type === 'station').map(item => (
          <Pin key={item.id} item={item} icon={icons.station} />
        ))}
        {activeLayers.incidents && SAFETY_DATA.filter(d => d.type === 'incident').map(item => (
          <Pin key={item.id} item={item} icon={icons.incident} />
        ))}
        {activeLayers.safeRoutes && SAFETY_DATA.filter(d => d.type === 'safe').map(item => (
          <Pin key={item.id} item={item} icon={icons.safe} />
        ))}

        {viewState.marker && (
          <Marker position={[viewState.marker.lat, viewState.marker.lng]} icon={icons.search}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-slate-900 text-sm">Search Result</h3>
                <p className="text-xs text-slate-500 mt-1">{viewState.marker.title}</p>
              </div>
            </Popup>
          </Marker>
        )}

        <MapController viewState={viewState} isDark={isDark} />
      </MapContainer>

      {/* --- CONTROLS --- */}
      {/* We use z-[400] to be ABOVE the map tiles but contained within the parent z-0 */}
      
      {/* SEARCH BAR */}
      <div className="absolute top-4 left-4 z-[400] w-80">
        <form 
          onSubmit={handleSearch}
          className="bg-white/90 dark:bg-[#1F2937]/90 backdrop-blur-md p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl transition-all focus-within:ring-2 focus-within:ring-orange-500/50"
        >
          <div className="relative flex items-center">
            {isSearching ? (
              <Loader2 className="absolute left-3 w-5 h-5 text-orange-500 animate-spin" />
            ) : (
              <Search className="absolute left-3 w-5 h-5 text-slate-400" />
            )}
            
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, area..." 
              className="w-full pl-10 pr-4 py-2 bg-transparent border-none text-sm font-medium text-slate-900 dark:text-white placeholder-slate-500 focus:ring-0 outline-none"
            />
          </div>
        </form>
      </div>

      {/* LAYERS CONTROL - REMOVED 'hidden md:block' so it never disappears */}
      <div className="absolute top-20 left-4 z-[400] w-64">
        <div className="bg-white/90 dark:bg-[#1F2937]/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
            <Layers className="w-3 h-3" /> Data Layers
          </h3>
          
          <LayerToggle label="Police Stations" active={activeLayers.stations} onClick={() => toggleLayer('stations')} color="bg-blue-500" />
          <LayerToggle label="Recent Incidents" active={activeLayers.incidents} onClick={() => toggleLayer('incidents')} color="bg-red-500" />
          <LayerToggle label="Safe Zones" active={activeLayers.safeRoutes} onClick={() => toggleLayer('safeRoutes')} color="bg-emerald-500" />
        </div>
      </div>

      {/* SOS BUTTONS */}
      <div className="absolute bottom-6 right-6 z-[400] flex flex-col gap-3">
        <button 
          onClick={handleRecenter}
          className="w-12 h-12 bg-white dark:bg-[#1F2937] text-slate-700 dark:text-white rounded-xl shadow-xl flex items-center justify-center hover:bg-slate-50 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Navigation className="w-5 h-5" />
        </button>
        <button className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-xl shadow-red-600/30 flex items-center justify-center transition-all active:scale-95 animate-pulse">
          <ShieldAlert className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};

// --- HELPERS ---
const MapController = ({ viewState, isDark }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(viewState.center, viewState.zoom, { animate: true, duration: 1.5 });
  }, [viewState, map]);

  useEffect(() => {
    // Small delay ensures map resizes correctly after layout shifts
    setTimeout(() => map.invalidateSize(), 400); 
  }, [isDark, map]);

  return null;
};

const Pin = ({ item, icon }) => (
  <Marker position={[item.lat, item.lng]} icon={icon}>
    <Popup className="custom-popup">
      <div className="p-1">
        <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
      </div>
    </Popup>
  </Marker>
);

const LayerToggle = ({ label, active, onClick, color }) => (
  <button onClick={onClick} className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    </div>
    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${active ? 'bg-slate-900 dark:bg-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-4' : ''}`}></div>
    </div>
  </button>
);

export default SafetyMap;