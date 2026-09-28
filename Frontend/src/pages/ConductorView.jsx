import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PlaneCursor from "../components/PlaneCursor";
import { tripsAPI } from "../services/api";

export default function ConductorViewPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsAPI
      .getFull(id)
      .catch(() => tripsAPI.getById(id))
      .then((data) => {
        const fetchedTrip = data.trip || data;
        setTrip(fetchedTrip);

        // Flatten all items from stops or root items
        let allItems = [];
        if (Array.isArray(fetchedTrip.stops)) {
          fetchedTrip.stops.forEach((s) => {
            if (Array.isArray(s.items)) {
              allItems = allItems.concat(s.items);
            }
          });
        }
        if (allItems.length === 0) {
          allItems = data.items || fetchedTrip.items || [];
        }
        setItems(allItems);
      })
      .catch(() => {
        // Mock fallback if offline
        const seedTrip = {
          id: id || "trip_1",
          title: "Ultimate Bali Vacation",
          startDate: "Oct 15, 2026",
          endDate: "Oct 22, 2026",
        };
        const seedItems = [
          { id: "i1", title: "Sacred Monkey Forest Tour", time: "09:00 AM", location: "Ubud Center", day: "Day 1 (Oct 15)" },
          { id: "i2", title: "Traditional Balinese Lunch", time: "01:00 PM", location: "Ubud Market", day: "Day 1 (Oct 15)" },
          { id: "i3", title: "Tegallalang Rice Terrace Walk", time: "08:30 AM", location: "Tegallalang", day: "Day 2 (Oct 16)" },
          { id: "i4", title: "Seminyak Sunset & Dinner", time: "06:30 PM", location: "Potato Head Beach Club", day: "Day 4 (Oct 18)" },
          { id: "i5", title: "Kelingking Beach Snorkeling", time: "09:00 AM", location: "Nusa Penida", day: "Day 6 (Oct 20)" },
        ];
        setTrip(seedTrip);
        setItems(seedItems);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Group items by Day cleanly
  const groupedDays = items.reduce((acc, item) => {
    const d = item.day || item.scheduled_date || "Day 1";
    if (!acc[d]) acc[d] = [];
    acc[d].push({
      ...item,
      title: item.title || item.custom_name || item.name || "Scheduled Activity",
      time: item.time || item.scheduled_time || "10:00 AM",
      location: item.location || item.city_name || "Destination Area",
    });
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 sm:p-8 max-w-xl mx-auto select-none pt-24">
      {/* Plane Cursor so cursor is always active and interactive */}
      <PlaneCursor />

      {/* Subpage Header & Navigation Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-white/10 p-3 rounded-2xl shadow">
        <Link
          to={`/trips/${id}/build`}
          className="text-cyan-400 hover:text-cyan-300 font-extrabold text-xs flex items-center gap-1.5 transition-all"
        >
          <span>&larr;</span>
          <span>Back to Builder</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/trips/${id}/map`}
            className="text-xs font-bold text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
          >
            🗺️ Map
          </Link>
          <Link
            to={`/trips/${id}/timeline`}
            className="text-xs font-bold text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
          >
            📅 Timeline
          </Link>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-cyan-400/30">
            📱 Conductor
          </span>
        </div>
      </div>

      {/* Large Readability Header */}
      <div className="bg-slate-900 border border-white/15 rounded-2xl p-6 shadow-2xl mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500" />
        <span className="text-3xl block mb-2">📢</span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mb-2">
          {trip?.title || "Travel Itinerary"}
        </h1>
        <p className="text-sm font-bold text-cyan-300">
          📅 {trip?.start_date || trip?.startDate || "Trip Dates"} &mdash; {trip?.end_date || trip?.endDate || "Flexible"}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
          <span className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase">Loading conductor view...</span>
        </div>
      ) : Object.keys(groupedDays).length === 0 ? (
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-8 text-center text-zinc-400 text-xs">
          No itinerary items scheduled yet. Use the Builder to add activities!
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedDays).map(([dayLabel, dayItems]) => (
            <div
              key={dayLabel}
              className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-xl text-left"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                  <h2 className="text-lg font-black text-cyan-300 uppercase tracking-wide">
                    {dayLabel}
                  </h2>
                </div>
                <span className="text-xs font-bold text-zinc-400">
                  {dayItems.length} activities
                </span>
              </div>

              {/* Day Activities List */}
              <div className="space-y-4">
                {dayItems.map((it, idx) => (
                  <div
                    key={it.id || idx}
                    className="bg-slate-800/90 border border-white/10 rounded-xl p-4 shadow flex flex-col gap-1.5 transition-all hover:border-cyan-400/40"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-teal-300 uppercase">
                      <span>⏰ {it.time}</span>
                      {it.category && (
                        <span className="px-2 py-0.5 rounded bg-teal-400/10 text-teal-300 text-[10px] font-bold border border-teal-400/20">
                          {it.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-white leading-snug">
                      {it.title}
                    </h3>

                    {it.location && (
                      <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 mt-1">
                        <span>📍</span>
                        <span>{it.location}</span>
                      </div>
                    )}

                    {it.notes && (
                      <p className="text-xs text-zinc-400 italic bg-slate-900/70 p-2 rounded-lg mt-1 border border-white/5">
                        &quot;{it.notes}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
