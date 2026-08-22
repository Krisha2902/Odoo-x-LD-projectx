import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import TripMap from "../components/TripMap";
import PlaneCursor from "../components/PlaneCursor";

export default function TripDetailsPage() {
  const { id } = useParams();
  const [activeDay, setActiveDay] = useState("Day 1");

  // Mock Trip Details
  const trip = {
    id: id || "trip_1",
    title: "Ultimate Bali & Island Hopping",
    dates: "15 Oct — 22 Oct 2026",
    duration: "8 Days / 7 Nights",
    status: "Upcoming",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    budgetCap: 2500,
    totalSpent: 1680,
    route: [
      { city: "Ubud", nights: 3, lat: -8.5069, lng: 115.2625 },
      { city: "Seminyak", nights: 2, lat: -8.6913, lng: 115.1682 },
      { city: "Nusa Penida", nights: 2, lat: -8.7278, lng: 115.5444 },
    ],
    days: [
      {
        dayLabel: "Day 1",
        date: "Oct 15",
        location: "Ubud",
        activities: [
          { time: "09:00 AM", title: "Sacred Monkey Forest Sanctuary", category: "Activity", cost: 15 },
          { time: "01:00 PM", title: "Traditional Balinese Lunch", category: "Dining", cost: 45 },
        ],
      },
      {
        dayLabel: "Day 2",
        date: "Oct 16",
        location: "Ubud",
        activities: [
          { time: "08:30 AM", title: "Tegallalang Rice Terrace Trek", category: "Sightseeing", cost: 20 },
          { time: "05:00 PM", title: "Campuhan Ridge Sunset Walk", category: "Activity", cost: 0 },
        ],
      },
      {
        dayLabel: "Day 3",
        date: "Oct 17",
        location: "Ubud to Seminyak",
        activities: [
          { time: "11:00 AM", title: "Private Transit to Seminyak Resort", category: "Transit", cost: 35 },
          { time: "06:30 PM", title: "Potato Head Beach Club Dinner", category: "Dining", cost: 120 },
        ],
      },
    ],
    budgetBreakdown: [
      { category: "Lodging / Hotels", cost: 750, color: "from-cyan-500 to-blue-500" },
      { category: "Food & Dining", cost: 480, color: "from-amber-500 to-orange-500" },
      { category: "Activities & Tours", cost: 320, color: "from-emerald-500 to-teal-500" },
      { category: "Transport & Ferries", cost: 130, color: "from-purple-500 to-indigo-500" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80",
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8">
        {/* HERO COVER SECTION */}
        <div className="relative rounded-3xl overflow-hidden mb-8 border border-white/15 shadow-2xl h-80 flex flex-col justify-end p-8 text-left">
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="absolute inset-0 w-full h-full object-cover -z-10 brightness-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent -z-10" />

          <div className="flex flex-wrap items-end justify-between gap-4 z-10">
            <div>
              <Link to="/my-trips" className="text-xs font-bold text-cyan-300 mb-2 inline-block">
                &larr; Back to My Trips
              </Link>
              <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                {trip.title}
              </h1>
              <p className="text-xs text-zinc-300 font-medium">
                📅 {trip.dates} &bull; {trip.duration}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/trips/${trip.id}/build`}
                className="px-5 py-2.5 rounded-full bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow"
              >
                ✏️ Edit Itinerary
              </Link>
              <Link
                to={`/trips/${trip.id}/ongoing`}
                className="px-5 py-2.5 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow"
              >
                ⚡ Live Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* ROUTE JOURNEY MAP SECTION (Game-like timeline progression) */}
        <section className="mb-12 text-left bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-black uppercase text-white tracking-tight mb-4 flex items-center gap-2">
            <span>🗺️</span> Journey Route &amp; Progression Map
          </h2>

          {/* Connected Level-like Nodes */}
          <div className="flex items-center justify-between overflow-x-auto custom-scrollbar pb-4 mb-6">
            {trip.route.map((r, idx) => (
              <React.Fragment key={r.city}>
                <div className="flex items-center gap-3 bg-slate-800 border border-cyan-400/40 px-4 py-3 rounded-2xl shadow min-w-[160px]">
                  <span className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="block text-sm font-extrabold text-white">{r.city}</strong>
                    <span className="text-[10px] text-cyan-300 font-bold">{r.nights} Nights</span>
                  </div>
                </div>
                {idx < trip.route.length - 1 && (
                  <span className="text-cyan-400 font-black text-lg px-2">➔</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <TripMap stops={trip.route.map((r, i) => ({ id: i, cityName: r.city, lat: r.lat, lng: r.lng }))} />
        </section>

        {/* DAY-BY-DAY JOURNEY & BUDGET SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* DAY-BY-DAY JOURNEY (8 COLS) */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl text-left">
            <h2 className="text-xl font-black uppercase text-white tracking-tight mb-4 flex items-center gap-2">
              <span>📅</span> Day-by-Day Trip Schedule
            </h2>

            {/* Days Selector */}
            <div className="flex gap-2 border-b border-white/10 pb-4 mb-6">
              {trip.days.map((d) => (
                <button
                  key={d.dayLabel}
                  onClick={() => setActiveDay(d.dayLabel)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeDay === d.dayLabel
                      ? "bg-cyan-400 text-slate-950 font-extrabold"
                      : "bg-slate-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {d.dayLabel} ({d.date})
                </button>
              ))}
            </div>

            {/* Active Day Activities List */}
            <div className="space-y-3">
              {trip.days
                .find((d) => d.dayLabel === activeDay)
                ?.activities.map((act, i) => (
                  <div key={i} className="bg-slate-800/80 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-cyan-300 block mb-1">
                        ⏰ {act.time} &bull; {act.category}
                      </span>
                      <strong className="text-sm font-bold text-white">{act.title}</strong>
                    </div>
                    <span className="text-xs font-extrabold text-cyan-400">${act.cost}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* BUDGET OVERVIEW SECTION (4 COLS) */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl text-left">
            <h2 className="text-xl font-black uppercase text-white tracking-tight mb-4 flex items-center gap-2">
              <span>💳</span> Budget Overview
            </h2>

            <div className="bg-slate-800 p-4 rounded-xl border border-white/10 mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-zinc-400 font-bold">Total Spend</span>
                <strong className="text-lg font-black text-cyan-400">
                  ${trip.totalSpent} / ${trip.budgetCap}
                </strong>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-teal-300"
                  style={{ width: `${(trip.totalSpent / trip.budgetCap) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {trip.budgetBreakdown.map((b) => (
                <div key={b.category} className="bg-slate-800/60 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300">{b.category}</span>
                  <span className="font-black text-cyan-300">${b.cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TRIP MEMORIES PHOTO GALLERY */}
        <section className="text-left bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-black uppercase text-white tracking-tight mb-4 flex items-center gap-2">
            <span>📷</span> Trip Memories Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trip.gallery.map((imgUrl, i) => (
              <div key={i} className="h-48 rounded-xl overflow-hidden border border-white/15">
                <img src={imgUrl} alt={`Memory ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
