import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { tripsAPI } from "../services/api";

export default function ConductorViewPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsAPI
      .getById(id)
      .then((data) => {
        setTrip(data.trip || data);
        setItems(data.items || data.trip?.items || []);
      })
      .catch(() => {
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

  // Group items by Day
  const groupedDays = items.reduce((acc, item) => {
    const d = item.day || "Day 1";
    if (!acc[d]) acc[d] = [];
    acc[d].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 sm:p-8 max-w-xl mx-auto select-none">
      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <Link to={`/trips/${id}/build`} className="text-cyan-400 font-extrabold text-sm flex items-center gap-1">
          &larr; Back to Builder
        </Link>
        <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-cyan-400/30">
          📱 Simplified View
        </span>
      </div>

      {/* Large Readability Header */}
      <div className="bg-slate-900 border border-white/15 rounded-2xl p-6 shadow-2xl mb-8 text-center">
        <span className="text-3xl block mb-2">📢</span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mb-2">
          {trip?.title || "Travel Itinerary"}
        </h1>
        <p className="text-sm font-bold text-cyan-300">
          📅 {trip?.startDate || "Oct 15"} &mdash; {trip?.endDate || "Oct 22"}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-zinc-400 text-sm font-bold">
          Loading simplified view...
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedDays).map(([dayLabel, dayItems]) => (
            <div key={dayLabel} className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-xl text-left">
              {/* Day Header */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <h2 className="text-lg font-black text-cyan-300 uppercase tracking-wide">
                  {dayLabel}
                </h2>
              </div>

              {/* Day Activities List (BIG TEXT & ULTRA LEGIBLE) */}
              <div className="space-y-4">
                {dayItems.map((it) => (
                  <div
                    key={it.id}
                    className="bg-slate-800/90 border border-white/10 rounded-xl p-4 shadow flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-teal-300 uppercase">
                      <span>⏰ {it.time || "10:00 AM"}</span>
                    </div>

                    <h3 className="text-lg font-black text-white leading-snug">
                      {it.title}
                    </h3>

                    {it.location && (
                      <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 mt-1">
                        <span>📍</span> {it.location}
                      </div>
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
