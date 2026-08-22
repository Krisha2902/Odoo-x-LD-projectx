import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function TripMap({ stops = [], items = [] }) {
  // Default coordinates fallback (e.g. Bali / Paris)
  const defaultCenter = [48.8566, 2.3522];

  // Extract stop coordinates for polyline route
  const polylineCoords = stops
    .filter((s) => s.lat && s.lng)
    .map((s) => [s.lat, s.lng]);

  const mapCenter = polylineCoords.length > 0 ? polylineCoords[0] : defaultCenter;

  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative select-none">
      <MapContainer
        center={mapCenter}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route Line connecting stops in order */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            color="#00d4ff"
            weight={4}
            opacity={0.8}
            dashArray="8, 8"
          />
        )}

        {/* City Markers */}
        {stops.map((stop, idx) => {
          if (!stop.lat || !stop.lng) return null;
          return (
            <Marker key={`stop-${stop.id || idx}`} position={[stop.lat, stop.lng]}>
              <Popup>
                <div className="p-1 text-slate-900 text-xs font-sans">
                  <strong className="block text-sm font-extrabold text-cyan-700">
                    Stop #{idx + 1}: {stop.cityName}
                  </strong>
                  <span className="text-[11px] text-zinc-600">
                    Nights: {stop.nights || 2}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Itinerary Item Markers */}
        {items.map((item) => {
          if (!item.lat || !item.lng) return null;
          return (
            <Marker key={`item-${item.id}`} position={[item.lat, item.lng]}>
              <Popup>
                <div className="p-1 text-slate-900 text-xs font-sans">
                  <span className="text-[9px] font-black uppercase text-cyan-600 bg-cyan-100 px-1.5 py-0.5 rounded">
                    {item.category || "Activity"}
                  </span>
                  <strong className="block text-sm font-extrabold text-slate-900 mt-1">
                    {item.title}
                  </strong>
                  <div className="text-[11px] text-zinc-600 mt-0.5">
                    📍 {item.location || "City Location"} | 🕒 {item.time || "10:00 AM"}
                  </div>
                  <div className="text-xs font-bold text-emerald-600 mt-1">
                    Cost: ${item.cost || 0}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
