import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import TripMap from "../components/TripMap";
import PlaneCursor from "../components/PlaneCursor";
import { tripsAPI } from "../services/api";

export default function MapViewPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    tripsAPI
      .getFull(id)
      .catch(() => tripsAPI.getById(id))
      .then((data) => {
        const fetchedTrip = data.trip || data;
        setTrip(fetchedTrip);
        const fetchedStops = data.stops || fetchedTrip.stops || [];
        setStops(fetchedStops);

        let extractedItems = [];
        if (Array.isArray(fetchedStops)) {
          fetchedStops.forEach((s) => {
            if (Array.isArray(s.items)) {
              s.items.forEach((it) => {
                extractedItems.push({
                  ...it,
                  stopId: s.id || s.stop_id,
                  cityName: s.city_name || s.cityName,
                });
              });
            }
          });
        }
        if (extractedItems.length === 0) {
          extractedItems = data.items || fetchedTrip.items || [];
        }
        setItems(extractedItems);
      })
      .catch((err) => {
        console.error("Failed to load map data:", err);
        setError("Unable to load map data. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-[#071C1C] text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />

      {/* Main container with pt-24 so it is not overlapped by fixed 72px Navbar */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-24">
        {/* Top Header & Subpage Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <Link
                to={`/trips/${id}`}
                className="text-xs font-bold text-[#72F0D0] hover:underline"
              >
                &larr; Trip Overview
              </Link>
              <span className="text-zinc-600">|</span>
              <Link
                to={`/trips/${id}/build`}
                className="text-xs font-bold text-zinc-400 hover:text-white"
              >
                Edit Itinerary
              </Link>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <span>🗺️</span>
              <span>{trip?.title || "Trip Route Map"}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to={`/trips/${id}/build`}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
            >
              ✏️ Builder
            </Link>
            <Link
              to={`/trips/${id}/timeline`}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
            >
              📅 Timeline
            </Link>
            <Link
              to={`/trips/${id}/conduct`}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs transition-all shadow"
            >
              📢 Conductor View
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 backdrop-blur-md flex items-center justify-between gap-4 text-rose-200 text-xs font-semibold">
            <span>⚠️ {error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400 gap-3">
            <span className="w-8 h-8 border-4 border-[#72F0D0] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading interactive map & routes...</span>
          </div>
        ) : (
          <TripMap stops={stops} items={items} trip={trip} />
        )}
      </main>
    </div>
  );
}
