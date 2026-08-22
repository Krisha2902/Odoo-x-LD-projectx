import React, { useState } from "react";
import { citiesAPI } from "../services/api";

export default function StopList({ stops, activeStopId, onSelectStop, onAddStop, onReorderStops, onDeleteStop }) {
  const [query, setQuery] = useState("");
  const [cityResults, setCityResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length < 2) {
      setCityResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await citiesAPI.search(val);
      setCityResults(results || []);
    } catch {
      // Fallback mock cities if backend endpoint sparse
      const mockCities = [
        { id: "city_bali", name: "Bali", country: "Indonesia", lat: -8.4095, lng: 115.1889 },
        { id: "city_paris", name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
        { id: "city_tokyo", name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
        { id: "city_dubai", name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
        { id: "city_rome", name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
      ].filter((c) => c.name.toLowerCase().includes(val.toLowerCase()) || c.country.toLowerCase().includes(val.toLowerCase()));
      setCityResults(mockCities);
    } finally {
      setSearching(false);
    }
  };

  const handleAddCityClick = (city) => {
    onAddStop(city);
    setQuery("");
    setCityResults([]);
  };

  const moveStop = (index, direction) => {
    const newStops = [...stops];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newStops.length) return;
    const temp = newStops[index];
    newStops[index] = newStops[targetIdx];
    newStops[targetIdx] = temp;
    onReorderStops(newStops.map((s) => s.id));
  };

  return (
    <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 flex flex-col h-full select-none text-left">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
          <span>📍</span> Ordered Stops
        </h3>
        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
          {stops.length} Cities
        </span>
      </div>

      {/* Add City Search Box (Hits GET /cities?search=) */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="+ Add city to itinerary..."
          value={query}
          onChange={handleSearchChange}
          className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        />
        {searching && (
          <span className="absolute right-3 top-2.5 w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        )}

        {/* Search Results Autocomplete */}
        {cityResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-white/20 rounded-xl shadow-2xl z-40 max-h-48 overflow-y-auto p-1 space-y-1">
            {cityResults.map((city) => (
              <div
                key={city.id || city.name}
                onClick={() => handleAddCityClick(city)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 transition-all cursor-pointer text-xs font-bold text-white"
              >
                <span>🏙️ {city.name}, {city.country}</span>
                <span className="text-[10px] text-cyan-400">+ Add</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ordered Stops List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {stops.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-400">
            No stops added yet. Use the search box above to add cities!
          </div>
        ) : (
          stops.map((stop, idx) => {
            const isActive = stop.id === activeStopId;
            return (
              <div
                key={stop.id}
                onClick={() => onSelectStop(stop.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/10 border-cyan-400 text-white shadow-lg"
                    : "bg-slate-800/60 border-white/10 hover:bg-slate-800 text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/10 text-[10px] font-black flex items-center justify-center text-cyan-300">
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="block text-xs font-bold text-white">{stop.cityName}</strong>
                    <span className="text-[10px] text-zinc-400">{stop.nights || 2} Nights ({stop.startDate || "Day " + (idx * 2 + 1)})</span>
                  </div>
                </div>

                {/* Move & Delete Controls */}
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    disabled={idx === 0}
                    onClick={() => moveStop(idx, -1)}
                    className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 text-xs"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    disabled={idx === stops.length - 1}
                    onClick={() => moveStop(idx, 1)}
                    className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 text-xs"
                    title="Move Down"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => onDeleteStop(stop.id)}
                    className="p-1 text-red-400 hover:text-red-300 text-xs ml-1"
                    title="Delete Stop"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
