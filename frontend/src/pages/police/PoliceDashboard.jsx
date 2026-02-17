import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, useMapEvents, Circle, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import { toast, ToastContainer } from "react-toastify"; // REMOVED as requested
// import "react-toastify/dist/ReactToastify.css";         // REMOVED as requested
import { supabase } from "../../lib/supabase"; 
import { Navigation, MapPin, CheckCircle, ArrowLeft, Phone, User, Siren, AlertTriangle, Zap } from "lucide-react";

// --- ICONS ---
const createUnitIcon = () => L.divIcon({
  className: "custom-unit-icon",
  html: `<div class="relative flex items-center justify-center w-6 h-6">
           <div class="absolute w-full h-full bg-blue-500/30 rounded-full animate-ping"></div>
           <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const createIncidentIcon = (priority) => L.divIcon({
  className: "custom-incident-icon",
  html: `<div class="relative w-8 h-8 flex flex-col items-center justify-center">
            <div class="w-6 h-6 ${priority === 'critical' ? 'bg-red-600' : 'bg-orange-500'} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <div class="w-0.5 h-3 ${priority === 'critical' ? 'bg-red-600/50' : 'bg-orange-500/50'}"></div>
         </div>`,
  iconSize: [32, 40],
  iconAnchor: [16, 40]
});

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => { map.flyTo(center, zoom, { duration: 1.2 }); }, [center, zoom, map]);
  return null;
};

// --- HEATMAP COMPONENT ---
const HeatmapDisplay = ({ locations, zoom }) => {
  const map = useMap();
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!map || !locations || locations.length === 0) return;

    // Cleanup old layers if any
    if (overlayRef.current) {
      map.removeLayer(overlayRef.current);
    }

    return () => {
      if (overlayRef.current && map) {
        try {
          map.removeLayer(overlayRef.current);
        } catch (e) {
          // Layer already removed
        }
      }
    };
  }, [locations, map, zoom]);

  // Return rectangles to be rendered by MapContainer
  if (!locations || locations.length === 0) return null;

  // Grid size calculation
  const gridSize = 0.0005 * Math.pow(2, 15 - zoom);
  const grid = {};

  locations.forEach((loc) => {
    const key = `${Math.floor(loc.latitude / gridSize)}-${Math.floor(loc.longitude / gridSize)}`;
    if (!grid[key]) {
      grid[key] = { lat: loc.latitude, lng: loc.longitude, dangerous: 0, safe: 0 };
    }
    if (loc.type === 'dangerous') {
      grid[key].dangerous += 1;
    } else {
      grid[key].safe += 1;
    }
  });

  return (
    <>
      {Object.values(grid).map((cell, idx) => {
        const total = cell.dangerous + cell.safe;
        const dangerRatio = cell.dangerous / total;
        
        let color, opacity;
        if (dangerRatio > 0.7) {
          color = '#dc2626'; // Red
          opacity = 0.3 + dangerRatio * 0.4;
        } else if (dangerRatio > 0.4) {
          color = '#f59e0b'; // Orange
          opacity = 0.2 + dangerRatio * 0.3;
        } else if (dangerRatio > 0) {
          color = '#eab308'; // Yellow
          opacity = 0.15;
        } else {
          color = '#22c55e'; // Green
          opacity = 0.25;
        }

        const bounds = [
          [cell.lat - gridSize / 2, cell.lng - gridSize / 2],
          [cell.lat + gridSize / 2, cell.lng + gridSize / 2],
        ];

        return (
          <Rectangle
            key={`heat-${idx}`} // Fixed unique key
            bounds={bounds}
            pathOptions={{
              color: color,
              weight: 1,
              opacity: 0.2,
              fillColor: color,
              fillOpacity: opacity,
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>Zone Heat</strong>
                <p>Dangerous: {cell.dangerous}</p>
                <p>Safe: {cell.safe}</p>
              </div>
            </Popup>
          </Rectangle>
        );
      })}
    </>
  );
};


// Map Event Listener Component
const MapClickListener = ({ onMapClick, markingMode }) => {
  useMapEvents({
    click(e) {
      if (markingMode) {
        onMapClick({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    },
  });
  return null;
};

const UNIT_LOCATION = { lat: 22.5726, lng: 88.3639 }; 

const PoliceDashboard = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapCenter, setMapCenter] = useState([UNIT_LOCATION.lat, UNIT_LOCATION.lng]);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [isResponding, setIsResponding] = useState(false);
  
  // New state for location marking
  const [markedLocations, setMarkedLocations] = useState([]);
  const [markingMode, setMarkingMode] = useState(null); // 'dangerous', 'safe', or null
  const [tempMarker, setTempMarker] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchLiveIncidents = async () => {
      const { data } = await supabase
        .from('emergencies')
        .select('*')
        .in('status', ['active', 'dispatching']) 
        .order('created_at', { ascending: false });
      if (data) setIncidents(data);
    };
    
    // Fetch marked locations
    const fetchMarkedLocations = async () => {
      const { data } = await supabase
        .from('location_safety')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setMarkedLocations(data);
    };

    fetchLiveIncidents();
    fetchMarkedLocations();

    const channel = supabase
      .channel('police_dashboard_map')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergencies' }, (payload) => {
        fetchLiveIncidents();
        if (payload.eventType === 'INSERT') {
           console.log("New SOS Alert:", payload.new);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'location_safety' }, (payload) => {
        fetchMarkedLocations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // --- HANDLERS ---
  const handleSelect = (incident) => {
    setSelectedIncident(incident);
    setMapCenter([incident.location_lat, incident.location_lng]);
    setZoomLevel(15);
    setIsResponding(incident.status === 'dispatching');
  };

  const handleRespond = async () => {
    if (!selectedIncident) return;
    setIsResponding(true);
    await supabase.from('emergencies').update({ status: 'dispatching' }).eq('id', selectedIncident.id);
    
    // Zoom out to show route
    const midLat = (UNIT_LOCATION.lat + selectedIncident.location_lat) / 2;
    const midLng = (UNIT_LOCATION.lng + selectedIncident.location_lng) / 2;
    setMapCenter([midLat, midLng]);
    setZoomLevel(12);
  };

  const handleMarkSafe = async () => {
    if (!selectedIncident) return;
    if (window.confirm("Mark as Resolved and close ticket?")) {
        const { error } = await supabase.from('emergencies').update({ status: 'resolved' }).eq('id', selectedIncident.id);
        
        if (!error) {
            navigate('/police/reports'); 
        }
    }
  };

  // New handlers for location marking
  const handleMarkingModeToggle = (mode) => {
    if (markingMode === mode) {
      setMarkingMode(null);
      setTempMarker(null);
    } else {
      setMarkingMode(mode);
      setTempMarker(null);
    }
  };

  const handleMapClick = async (coords) => {
    if (!markingMode) return;
    
    setTempMarker(coords);
    
    // Save to database
    const { error } = await supabase.from('location_safety').insert([{
      latitude: coords.lat,
      longitude: coords.lng,
      type: markingMode, // 'dangerous' or 'safe'
      marked_by: 'police_officer', // Can be enhanced with user info
      marked_at: new Date().toISOString(),
    }]);
    
    if (!error) {
      setTempMarker(null);
      setMarkingMode(null);
    } else {
      console.error("Failed to mark location");
    }
  };

  const handleRemoveLocation = async (locationId) => {
    const { error } = await supabase.from('location_safety').delete().eq('id', locationId);
    
    if (error) {
      console.error("Failed to remove location");
    }
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row relative">
      {/* MAP AREA */}
      <div className="flex-1 relative z-0">
         <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: "100%", width: "100%" }} zoomControl={false}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapUpdater center={mapCenter} zoom={zoomLevel} />
            <MapClickListener onMapClick={handleMapClick} markingMode={markingMode} />
            
            {/* Heatmap Display */}
            {showHeatmap && markedLocations.length > 0 && (
              <HeatmapDisplay locations={markedLocations} zoom={zoomLevel} />
            )}
            
            <Marker position={[UNIT_LOCATION.lat, UNIT_LOCATION.lng]} icon={createUnitIcon()}>
               <Popup><strong className="text-blue-700">UNIT 402</strong><br/>HQ Location</Popup>
            </Marker>

            {/* Display marked locations as circles */}
            {markedLocations.map((loc) => (
              <Circle
                key={loc.id}
                center={[loc.latitude, loc.longitude]}
                radius={100}
                pathOptions={{
                  color: loc.type === 'dangerous' ? '#ef4444' : '#22c55e',
                  fillColor: loc.type === 'dangerous' ? '#fca5a5' : '#86efac',
                  fillOpacity: 0.6,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-center">
                    <strong className={loc.type === 'dangerous' ? 'text-red-600' : 'text-green-600'}>
                      {loc.type === 'dangerous' ? '⚠️ Dangerous Zone' : '✅ Safe Zone'}
                    </strong>
                    <p className="text-xs text-slate-500 mt-1">{new Date(loc.marked_at).toLocaleString()}</p>
                    <button
                      onClick={() => handleRemoveLocation(loc.id)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </Popup>
              </Circle>
            ))}

            {incidents.map((inc) => (
              <Marker 
                key={inc.id} 
                position={[inc.location_lat, inc.location_lng]} 
                icon={createIncidentIcon(inc.priority)}
                eventHandlers={{ click: () => handleSelect(inc) }}
              />
            ))}

            {selectedIncident && isResponding && (
                <Polyline 
                    positions={[[UNIT_LOCATION.lat, UNIT_LOCATION.lng], [selectedIncident.location_lat, selectedIncident.location_lng]]}
                    pathOptions={{ color: 'blue', weight: 4, opacity: 0.6, dashArray: '10, 10' }} 
                />
            )}
         </MapContainer>
         
         {/* Map Legend */}
         {/* FIXED: Z-INDEX 500 (Higher than map layers, Lower than sidebar) */}
         <div className="absolute top-4 left-4 z-[500] bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-lg shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><div className="w-2.5 h-2.5 bg-blue-600 rounded-full border border-white shadow"></div>Your Unit</div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><div className="w-2.5 h-2.5 bg-red-600 rounded-full border border-white shadow"></div>Active Incident</div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><div className="w-2.5 h-2.5 bg-red-400 rounded-full border border-white shadow"></div>Dangerous Zone</div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><div className="w-2.5 h-2.5 bg-green-400 rounded-full border border-white shadow"></div>Safe Zone</div>
         </div>
         
         {/* Marking Controls */}
         {/* FIXED: Z-INDEX 500 */}
         <div className="absolute bottom-4 right-4 z-[500] flex gap-2">
            <button
              onClick={() => handleMarkingModeToggle('dangerous')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                markingMode === 'dangerous'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-700 hover:shadow-md'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Mark Dangerous
            </button>
            <button
              onClick={() => handleMarkingModeToggle('safe')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                markingMode === 'safe'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-700 hover:shadow-md'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Mark Safe
            </button>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                showHeatmap
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-700 hover:shadow-md'
              }`}
            >
              <Zap className="w-4 h-4" />
              Heatmap
            </button>
         </div>
      </div>

      {/* DETAIL SIDEBAR */}
      {/* FIXED: Z-INDEX 1000 (Always highest) */}
      <div className="w-full lg:w-[400px] bg-white border-l border-slate-200 flex flex-col h-[50vh] lg:h-full overflow-hidden shadow-xl z-[1000]">
        {!selectedIncident ? (
          /* LIST VIEW */
          <>
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Dispatch Queue</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Live Feed • {incidents.length} Active</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                <Siren className={`w-5 h-5 ${incidents.length > 0 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#F8FAFC]">
              {incidents.length === 0 ? (
                 <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-sm">
                    <CheckCircle className="w-8 h-8 mb-2 opacity-20" /> No Active Incidents
                 </div>
              ) : (
                incidents.map((incident) => (
                  <div key={incident.id} onClick={() => handleSelect(incident)} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${incident.priority === 'critical' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>{incident.priority}</span>
                       <span className="text-xs text-slate-400">{new Date(incident.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{incident.topic || incident.type}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2"><MapPin className="w-3 h-3" />{incident.location_address}</div>
                    {incident.status === 'dispatching' && <div className="mt-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">Units En Route</div>}
                  </div>
                ))
              )}
              
              {/* Marked Locations Section */}
              {markedLocations.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Marked Zones ({markedLocations.length})</h3>
                  <div className="space-y-2">
                    {markedLocations.map((loc) => (
                      <div key={loc.id} className={`p-3 rounded-lg border text-sm ${
                        loc.type === 'dangerous' 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-green-50 border-green-200'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className={`text-lg ${loc.type === 'dangerous' ? '⚠️' : '✅'}`}></span>
                            <div>
                              <p className={`font-bold text-xs ${loc.type === 'dangerous' ? 'text-red-700' : 'text-green-700'}`}>
                                {loc.type === 'dangerous' ? 'Dangerous Zone' : 'Safe Zone'}
                              </p>
                              <p className="text-xs text-slate-500">{new Date(loc.marked_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveLocation(loc.id)}
                            className="text-xs text-slate-400 hover:text-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* DETAIL VIEW */
          <>
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
              <button onClick={() => { setSelectedIncident(null); setIsResponding(false); setZoomLevel(13); }} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-slate-200"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Incident Details</span>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white">
               <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-4 capitalize">{selectedIncident.topic || selectedIncident.type}</h1>
               
               {isResponding && (
                    <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
                         <div className="relative">
                            <span className="absolute top-0 right-0 -mr-1 -mt-1 w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                            <Navigation className="w-5 h-5 text-blue-600" />
                         </div>
                         <div>
                             <div className="text-sm font-bold text-blue-800">Dispatching Units</div>
                             <div className="text-xs text-blue-600">Route plotted on map</div>
                         </div>
                    </div>
               )}

               <div className="space-y-6">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                   <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                     <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                     <div>
                       <div className="text-sm font-bold text-slate-800">{selectedIncident.location_address}</div>
                       <div className="text-xs text-slate-500 mt-1 font-mono">{selectedIncident.location_lat.toFixed(4)}, {selectedIncident.location_lng.toFixed(4)}</div>
                     </div>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Caller</label>
                     <div className="text-sm font-bold text-slate-700 mt-1 flex items-center gap-2"><User className="w-4 h-4" /> {selectedIncident.reporter_name}</div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                     <div className="text-sm font-bold text-slate-700 mt-1 flex items-center gap-2"><Phone className="w-4 h-4" /> {selectedIncident.reporter_phone}</div>
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                   <p className="text-sm text-slate-600 leading-relaxed p-3 bg-white border border-slate-100 rounded-lg shadow-sm">{selectedIncident.description}</p>
                 </div>
               </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-white space-y-3">
              {!isResponding ? (
                  <button onClick={handleRespond} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                    <Navigation className="w-4 h-4" /> Respond & Track
                  </button>
              ) : (
                  <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
                        <Navigation className="w-4 h-4 animate-pulse" /> En Route...
                      </button>
                      <button onClick={handleMarkSafe} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20">
                         <CheckCircle className="w-4 h-4" /> Mark Safe
                      </button>
                  </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PoliceDashboard;