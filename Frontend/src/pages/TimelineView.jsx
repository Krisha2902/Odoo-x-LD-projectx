import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import TimelineChart from "../components/TimelineChart";
import PlaneCursor from "../components/PlaneCursor";
import { tripsAPI } from "../services/api";

export default function TimelineViewPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTimelineData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripsAPI.getFull(id).catch(() => tripsAPI.getById(id));
      const fetchedTrip = data.trip || data;
      setTrip(fetchedTrip);
      setStops(data.stops || fetchedTrip.stops || []);
      setItems(data.items || fetchedTrip.items || []);
    } catch (err) {
      console.warn("API trips timeline sparse, loading seed hackathon timeline:", err);
      const seedTrip = {
        id: id || "trip_1",
        title: "Ultimate Bali & Island Hopping",
        startDate: "Oct 15, 2026",
        endDate: "Oct 22, 2026",
      };
      const seedStops = [
        { id: "s1", cityName: "Ubud", nights: 3 },
        { id: "s2", cityName: "Seminyak", nights: 2 },
        { id: "s3", cityName: "Nusa Penida", nights: 2 },
      ];
      const seedItems = [
        { id: "i1", title: "Monkey Forest Tour", day: "Day 1", time: "09:00 AM", category: "Activity", cost: 15 },
        { id: "i2", title: "Cooking Class", day: "Day 1", time: "01:00 PM", category: "Dining", cost: 45 },
        { id: "i3", title: "Rice Terrace Trek", day: "Day 2", time: "08:30 AM", category: "Sightseeing", cost: 20 },
        { id: "i4", title: "Beach Club Sunset", day: "Day 4", time: "06:30 PM", category: "Dining", cost: 120 },
        { id: "i5", title: "Kelingking Snorkeling", day: "Day 6", time: "09:00 AM", category: "Activity", cost: 75 },
      ];
      setTrip(seedTrip);
      setStops(seedStops);
      setItems(seedItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchTimelineData().then(() => {
      if (!isMounted) return;
    });

    return () => {
      isMounted = false;
    };
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
              <span>📅</span>
              <span>{trip?.title || "Trip Timeline"}</span>
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
              to={`/trips/${id}/map`}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
            >
              🗺️ Open Map
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
            <button
              onClick={fetchTimelineData}
              className="px-4 py-1 rounded-xl bg-rose-500 text-white font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400 gap-3">
            <span className="w-8 h-8 border-4 border-[#72F0D0] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading timeline schedule...</span>
          </div>
        ) : (
          <TimelineChart trip={trip} stops={stops} items={items} />
        )}
      </main>
    </div>
  );
}
