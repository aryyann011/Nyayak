// File: src/components/PoliceMap.jsx

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Circle, useMapEvents, Rectangle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { supabase } from "../../lib/supabase";

const PoliceMap = () => {
  const [locations, setLocations] = useState([]);
  const [markMode, setMarkMode] = useState(null); // 'dangerous' or 'safe'
  const [heatLayer, setHeatLayer] = useState(null);
  const mapRef = useRef();

  // Fetch all locations from Supabase
  const fetchLocations = async () => {
    const { data } = await supabase.from("location_safety").select("*");
    setLocations(data || []);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Handle map clicks to add zones
  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        if (!markMode) return;
        const { lat, lng } = e.latlng;

        await supabase.from("location_safety").insert([
          { latitude: lat, longitude: lng, type: markMode },
        ]);

        fetchLocations();
      },
    });
    return null;
  };

  // Remove a zone
  const removeZone = async (id) => {
    await supabase.from("location_safety").delete().eq("id", id);
    fetchLocations();
  };

  // Draw heat/grid overlay
  const drawHeatGrid = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map) return;

    // Remove previous heat layer if exists
    if (heatLayer) {
      map.removeLayer(heatLayer);
    }

    // Leaflet-heat
    const heatArray = locations.map((loc) => [
      loc.latitude,
      loc.longitude,
      loc.type === "dangerous" ? 1 : 0.5,
    ]);

    const heat = L.heatLayer(heatArray, {
      radius: 15, // smaller radius for realistic effect
      blur: 10,
      gradient: { 0.4: "green", 0.6: "yellow", 0.8: "orange", 1: "red" },
    }).addTo(map);

    setHeatLayer(heat);
  };

  // Draw small grid rectangles for concentration (optional)
  const drawGrid = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    const minLat = bounds.getSouthWest().lat;
    const minLng = bounds.getSouthWest().lng;
    const maxLat = bounds.getNorthEast().lat;
    const maxLng = bounds.getNorthEast().lng;

    const cellSize = 0.005; // smaller grid (~500m)
    for (let lat = minLat; lat < maxLat; lat += cellSize) {
      for (let lng = minLng; lng < maxLng; lng += cellSize) {
        const cellBounds = [
          [lat, lng],
          [lat + cellSize, lng + cellSize],
        ];
        const cellLocations = locations.filter(
          (loc) =>
            loc.latitude >= lat &&
            loc.latitude <= lat + cellSize &&
            loc.longitude >= lng &&
            loc.longitude <= lng + cellSize
        );
        let fillColor = "green";
        if (cellLocations.length) {
          const dangerousCount = cellLocations.filter((l) => l.type === "dangerous").length;
          const ratio = dangerousCount / cellLocations.length;
          if (ratio > 0.7) fillColor = "red";
          else if (ratio > 0.4) fillColor = "orange";
          else if (ratio > 0) fillColor = "yellow";
        }
        L.rectangle(cellBounds, { color: fillColor, weight: 1, fillOpacity: 0.3 }).addTo(map);
      }
    }
  };

  // Toggle heat/grid when locations change
  useEffect(() => {
    if (!locations.length) return;
    drawHeatGrid();
    // drawGrid(); // optional: comment/uncomment if you want rectangle grid overlay
  }, [locations]);

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", padding: "10px", background: "#f5f5f5", overflowY: "auto" }}>
        <h3>Marked Zones</h3>
        <button
          style={{ background: markMode === "dangerous" ? "red" : "", color: "#fff", marginRight: "5px" }}
          onClick={() => setMarkMode("dangerous")}
        >
          Mark Dangerous
        </button>
        <button
          style={{ background: markMode === "safe" ? "green" : "", color: "#fff" }}
          onClick={() => setMarkMode("safe")}
        >
          Mark Safe
        </button>
        <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
          {locations.map((loc) => (
            <li key={loc.id} style={{ marginBottom: "5px" }}>
              <strong>{loc.type}</strong> <br />
              {new Date(loc.created_at).toLocaleString()}
              <button
                style={{ marginLeft: "5px", color: "red", cursor: "pointer" }}
                onClick={() => removeZone(loc.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Map */}
      <MapContainer
        center={[22.5726, 88.3639]}
        zoom={13}
        style={{ flex: 1 }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        {/* Circle markers */}
        {locations.map((loc) => (
          <Circle
            key={loc.id}
            center={[loc.latitude, loc.longitude]}
            radius={50} // smaller radius for realistic map
            color={loc.type === "dangerous" ? "red" : "green"}
          >
            <Popup>
              {loc.type} <br />
              {new Date(loc.created_at).toLocaleString()}
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default PoliceMap;
