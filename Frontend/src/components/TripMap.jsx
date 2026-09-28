import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Comprehensive worldwide city coordinate catalog
const CITY_COORDINATES = {
  // India
  surat: [21.1702, 72.8311],
  ahmedabad: [23.0225, 72.5714],
  amdavad: [23.0225, 72.5714],
  mumbai: [19.076, 72.8777],
  bombay: [19.076, 72.8777],
  delhi: [28.6139, 77.209],
  newdelhi: [28.6139, 77.209],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  goa: [15.2993, 74.124],
  jaipur: [26.9124, 75.7873],
  udaipur: [24.5854, 73.7125],
  agra: [27.1767, 78.0081],
  varanasi: [25.3176, 82.9739],
  kolkata: [22.5726, 88.3639],
  chennai: [13.0827, 80.2707],
  hyderabad: [17.385, 78.4867],
  pune: [18.5204, 73.8567],
  kochi: [9.9312, 76.2673],
  manali: [32.2432, 77.1892],
  shimla: [31.1048, 77.1734],
  amritsar: [31.634, 74.8723],
  mehsana: [23.588, 72.3693],
  palanpur: [24.1724, 72.4346],
  rajkot: [22.3039, 70.8022],
  vadodara: [22.3072, 73.1812],

  // Europe
  paris: [48.8566, 2.3522],
  london: [51.5074, -0.1278],
  rome: [41.9028, 12.4964],
  venice: [45.4408, 12.3155],
  florence: [43.7696, 11.2558],
  milan: [45.4642, 9.19],
  zurich: [47.3769, 8.5417],
  geneva: [46.2044, 6.1432],
  barcelona: [41.3851, 2.1734],
  madrid: [40.4168, -3.7038],
  amsterdam: [52.3676, 4.9041],
  berlin: [52.52, 13.405],
  munich: [48.1351, 11.582],
  vienna: [48.2082, 16.3738],
  prague: [50.0755, 14.4378],
  budapest: [47.4979, 19.0402],
  athens: [37.9838, 23.7275],
  lisbon: [38.7223, -9.1393],
  dublin: [53.3498, -6.2603],
  edinburgh: [55.9533, -3.1883],
  santorini: [36.3932, 25.4615],

  // Asia & Middle East
  tokyo: [35.6762, 139.6503],
  kyoto: [35.0116, 135.7681],
  osaka: [34.6937, 135.5023],
  bali: [-8.4095, 115.1889],
  ubud: [-8.5069, 115.2625],
  seminyak: [-8.6913, 115.1682],
  nusapenida: [-8.7278, 115.5444],
  singapore: [1.3521, 103.8198],
  bangkok: [13.7563, 100.5018],
  phuket: [7.8804, 98.3923],
  kualalumpur: [3.139, 101.6869],
  seoul: [37.5665, 126.978],
  hanoi: [21.0285, 105.8542],
  dubai: [25.2048, 55.2708],
  abudhabi: [24.4539, 54.3773],
  doha: [25.2854, 51.531],

  // Americas & Oceania
  newyork: [40.7128, -74.006],
  losangeles: [34.0522, -118.2437],
  sanfrancisco: [37.7749, -122.4194],
  chicago: [41.8781, -87.6298],
  miami: [25.7617, -80.1918],
  lasvegas: [36.1699, -115.1398],
  toronto: [43.6532, -79.3832],
  vancouver: [49.2827, -123.1207],
  cancun: [21.1619, -86.8515],
  sydney: [-33.8688, 151.2093],
  melbourne: [-37.8136, 144.9631],
  auckland: [-36.8485, 174.7633],
};

/**
 * Resolve coordinates for any city name (lookup or deterministic fallback)
 */
function resolveCoords(cityName, fallbackIndex = 0) {
  if (!cityName) return [21.1702 + fallbackIndex * 0.5, 72.8311 + fallbackIndex * 0.5];

  const cleaned = cityName.toLowerCase().replace(/[^a-z]/g, "");
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return coords;
    }
  }

  // Deterministic coordinate generator based on string hash for unknown cities
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = (hash << 5) - hash + cityName.charCodeAt(i);
    hash |= 0;
  }
  const lat = 15 + (Math.abs(hash) % 350) / 10;
  const lng = 40 + (Math.abs(hash >> 3) % 700) / 10;
  return [lat, lng];
}

/**
 * Custom HTML glowing icon for Destination Pins
 */
function createDestinationIcon(index, cityName) {
  return L.divIcon({
    className: "custom-dest-pin",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; width: 120px; transform: translate(-50%, -100%); pointer-events: auto;">
        <div style="background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%); color: #071517; font-weight: 900; font-size: 12px; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 0 16px rgba(0, 242, 254, 0.9), 0 4px 8px rgba(0,0,0,0.5);">
          ${index + 1}
        </div>
        <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid #4facfe; margin-top: -1px;"></div>
        <div style="background: rgba(7, 28, 28, 0.94); border: 1px solid rgba(114, 240, 208, 0.6); color: #ffffff; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 800; white-space: nowrap; margin-top: 2px; box-shadow: 0 2px 6px rgba(0,0,0,0.6); max-width: 110px; overflow: hidden; text-overflow: ellipsis;">
          ${cityName}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -36],
  });
}

/**
 * Custom HTML icon for Itinerary Activity Pins
 */
function createActivityIcon(category) {
  const iconEmoji =
    category === "food" || category === "Dining"
      ? "🍽️"
      : category === "culture" || category === "Sightseeing"
      ? "🏛️"
      : category === "nature"
      ? "🌿"
      : category === "adventure"
      ? "⚡"
      : "📍";

  return L.divIcon({
    className: "custom-act-pin",
    html: `
      <div style="background: #0f2d2e; border: 2px solid #72F0D0; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 0 12px rgba(114, 240, 208, 0.7); transform: translate(-50%, -50%); pointer-events: auto;">
        ${iconEmoji}
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -15],
  });
}

/**
 * Auto-fit map bounds when markers or route change with ref stabilization
 */
function MapController({ coords }) {
  const map = useMap();
  const prevCoordsKey = useRef("");

  useEffect(() => {
    // Invalidate size on mount to ensure tiles render completely without grey blocks
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (!coords || coords.length === 0) return;
    const coordsKey = coords
      .map((c) => `${Number(c[0]).toFixed(3)},${Number(c[1]).toFixed(3)}`)
      .join(";");
    if (prevCoordsKey.current === coordsKey) return;
    prevCoordsKey.current = coordsKey;

    try {
      if (coords.length === 1) {
        map.setView(coords[0], 11, { animate: false });
      } else {
        const bounds = L.latLngBounds(coords);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, animate: false });
        }
      }
    } catch (e) {
      console.warn("Map bound update error:", e);
    }
  }, [coords, map]);

  return null;
}

export default function TripMap({ stops = [], items = [], trip = null }) {
  // 1. Resolve normalized stops with valid latitude & longitude
  const normalizedStops = useMemo(() => {
    let resolved = [];

    if (stops && stops.length > 0) {
      resolved = stops.map((stop, idx) => {
        const cityName =
          stop.cityName ||
          stop.city_name ||
          stop.name ||
          (trip?.title?.includes(" to ") ? trip.title.split(" to ")[idx]?.trim() : `Stop ${idx + 1}`);

        let lat = stop.lat ? Number(stop.lat) : 0;
        let lng = stop.lng ? Number(stop.lng) : 0;

        // If lat/lng missing or default 0, resolve from coordinates catalog
        if (!lat || !lng || (lat === 0 && lng === 0)) {
          const [cLat, cLng] = resolveCoords(cityName, idx);
          lat = cLat;
          lng = cLng;
        }

        return {
          ...stop,
          id: stop.id || stop.stop_id || idx,
          cityName,
          lat,
          lng,
          nights: stop.nights || 2,
        };
      });
    }

    // If trip exists but stops are empty, infer origin & destination from trip title
    if (resolved.length === 0 && trip?.title) {
      if (trip.title.includes(" to ")) {
        const parts = trip.title.replace(/Expedition|Vacation|Trip|Tour/gi, "").split(" to ");
        const originCity = parts[0]?.trim() || "Origin";
        const destCity = parts[1]?.trim() || "Destination";

        const [oLat, oLng] = resolveCoords(originCity, 0);
        const [dLat, dLng] = resolveCoords(destCity, 1);

        resolved = [
          { id: "origin", cityName: originCity, lat: oLat, lng: oLng, nights: 1 },
          { id: "dest", cityName: destCity, lat: dLat, lng: dLng, nights: 3 },
        ];
      } else {
        const [dLat, dLng] = resolveCoords(trip.title, 0);
        resolved = [{ id: "dest", cityName: trip.title, lat: dLat, lng: dLng, nights: 3 }];
      }
    }

    return resolved;
  }, [stops, trip]);

  // 2. Extract polyline points connecting destination stops
  const polylineCoords = useMemo(() => {
    return normalizedStops.map((s) => [s.lat, s.lng]);
  }, [normalizedStops]);

  // 3. Normalized items with pin locations placed logically in/around their city stop
  const normalizedItems = useMemo(() => {
    return (items || []).map((item, idx) => {
      let lat = item.lat ? Number(item.lat) : null;
      let lng = item.lng ? Number(item.lng) : null;

      if (!lat || !lng || (lat === 0 && lng === 0)) {
        // Place activity in destination stop with realistic small geographic radius
        const baseStop =
          normalizedStops.find((s) => s.id === item.stopId || s.id === item.stop_id) ||
          normalizedStops[idx % Math.max(1, normalizedStops.length)] ||
          normalizedStops[0];

        if (baseStop) {
          const angle = (idx * 65 * Math.PI) / 180;
          const radius = 0.012 + (idx % 3) * 0.008;
          lat = baseStop.lat + Math.cos(angle) * radius;
          lng = baseStop.lng + Math.sin(angle) * radius;
        }
      }

      return {
        ...item,
        id: item.id || `item-${idx}`,
        title: item.title || item.custom_name || item.name || "Activity",
        category: item.category || "activity",
        time: item.time || item.scheduled_time || "10:00 AM",
        cost: Number(item.cost) || 0,
        lat,
        lng,
      };
    });
  }, [items, normalizedStops]);

  // All coordinates for map bounds
  const allCoords = useMemo(() => {
    const list = [...polylineCoords];
    normalizedItems.forEach((it) => {
      if (it.lat && it.lng) list.push([it.lat, it.lng]);
    });
    return list;
  }, [polylineCoords, normalizedItems]);

  const defaultCenter =
    polylineCoords.length > 0 ? polylineCoords[0] : [21.1702, 72.8311];

  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-[#5AD9BC]/25 shadow-2xl relative select-none">
      {/* Inline styles to ensure Leaflet divIcon default white backgrounds are disabled */}
      <style>{`
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .custom-dest-pin, .custom-act-pin {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      {/* Route Info Badge Overlay */}
      <div className="absolute top-4 left-4 z-[400] bg-[#071C1C]/90 backdrop-blur-md border border-[#5AD9BC]/40 px-4 py-2 rounded-xl text-left shadow-lg pointer-events-none">
        <div className="text-[10px] font-black text-[#72F0D0] uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#72F0D0] animate-pulse" />
          <span>Planned Journey Route</span>
        </div>
        <div className="text-xs font-extrabold text-white mt-0.5">
          {normalizedStops.length > 0
            ? normalizedStops.map((s) => s.cityName).join(" ➔ ")
            : trip?.title || "Route Map"}
        </div>
        <div className="text-[10px] text-zinc-400 mt-0.5">
          {normalizedStops.length} Destination Stops &bull; {normalizedItems.length} Activities Plotted
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController coords={allCoords} />

        {/* Planned Route Connecting Destination Stops */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            color="#20C9B0"
            weight={5}
            opacity={0.9}
            dashArray="8, 10"
          />
        )}

        {/* Destination Pins */}
        {normalizedStops.map((stop, idx) => (
          <Marker
            key={`dest-stop-${stop.id || idx}`}
            position={[stop.lat, stop.lng]}
            icon={createDestinationIcon(idx, stop.cityName)}
          >
            <Popup>
              <div className="p-2 text-slate-900 text-xs font-sans min-w-[160px]">
                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded font-black text-[9px] uppercase tracking-wider">
                  Destination Stop #{idx + 1}
                </span>
                <strong className="block text-sm font-black text-cyan-950 mt-1">
                  {stop.cityName}
                </strong>
                <span className="text-[11px] text-zinc-600 block mt-0.5">
                  Duration: {stop.nights} Nights
                </span>
                <div className="mt-2 text-[10px] text-cyan-700 font-bold">
                  📍 {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Itinerary Activity Markers */}
        {normalizedItems.map((item) => {
          if (!item.lat || !item.lng) return null;
          return (
            <Marker
              key={`act-item-${item.id}`}
              position={[item.lat, item.lng]}
              icon={createActivityIcon(item.category)}
            >
              <Popup>
                <div className="p-2 text-slate-900 text-xs font-sans min-w-[180px]">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-teal-100 text-teal-800">
                    {item.category}
                  </span>
                  <strong className="block text-sm font-extrabold text-slate-950 mt-1">
                    {item.title}
                  </strong>
                  <div className="text-[11px] text-zinc-600 mt-1 flex items-center justify-between">
                    <span>🕒 {item.time}</span>
                    <span className="font-extrabold text-emerald-600">${item.cost}</span>
                  </div>
                  {item.notes && (
                    <p className="text-[10px] text-zinc-500 italic mt-1 border-t pt-1">
                      {item.notes}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
