import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SmartSuggestions from "../components/SmartSuggestions";
import TripMap from "../components/TripMap";
import PlaneCursor from "../components/PlaneCursor";

export default function OngoingTripPage() {
  const { id } = useParams();

  const [todaysActivities, setTodaysActivities] = useState([
    { id: 1, time: "09:00 AM", title: "Meiji Shrine Morning Walk", category: "Culture", location: "Shibuya, Tokyo", completed: true },
    { id: 2, time: "01:00 PM", title: "Ichiran Ramen Lunch", category: "Dining", location: "Shinjuku", completed: true },
    { id: 3, time: "05:00 PM", title: "Shibuya Crossing & Observation Deck", category: "Sightseeing", location: "Shibuya Sky", completed: false },
  ]);

  const trip = {
    id: id || "trip_ongoing_1",
    title: "Exploring Japan",
    currentLocation: "Tokyo, Japan",
    currentDay: 3,
    totalDays: 10,
    daysCompleted: 2,
    daysRemaining: 7,
    dates: "20 Aug — 30 Aug 2026",
    budgetCap: 3500,
    totalSpent: 1240,
    stops: [
      { id: "s1", cityName: "Tokyo", nights: 4, lat: 35.6762, lng: 139.6503 },
      { id: "s2", cityName: "Kyoto", nights: 3, lat: 35.0116, lng: 135.7681 },
      { id: "s3", cityName: "Osaka", nights: 3, lat: 34.6937, lng: 135.5023 },
    ],
  };

  const handleAddSuggestion = (sug) => {
    setTodaysActivities((prev) => [
      ...prev,
      {
        id: Date.now(),
        time: "07:30 PM",
        title: sug.title,
        category: sug.category,
        location: sug.distance,
        completed: false,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8">
        {/* Top Live Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 text-left relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 z-10 relative">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-emerald-300 uppercase tracking-widest bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/40">
                  LIVE ONGOING TRIP DASHBOARD
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                {trip.title}
              </h1>
              <p className="text-xs font-bold text-cyan-300 mt-1">
                📍 Currently at: <strong>{trip.currentLocation}</strong>
              </p>
            </div>

            {/* Days Counter Progress Badge */}
            <div className="bg-slate-800/90 border border-white/20 p-4 rounded-2xl text-center shadow-lg">
              <span className="text-xs text-zinc-400 font-bold uppercase block">Progress</span>
              <strong className="text-2xl font-black text-cyan-400">
                Day {trip.currentDay} of {trip.totalDays}
              </strong>
              <span className="text-[10px] text-emerald-300 font-bold block mt-1">
                {trip.daysCompleted} Days Done &bull; {trip.daysRemaining} Left
              </span>
            </div>
          </div>

          {/* Progress Line */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${(trip.currentDay / trip.totalDays) * 100}%` }}
            />
          </div>
        </div>

        {/* TODAY'S SCHEDULE & LIVE BUDGET */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* TODAY'S SCHEDULE (7 COLS) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h2 className="text-lg font-black uppercase text-white tracking-tight flex items-center gap-2">
                <span>⏰</span> Today&apos;s Schedule (Day {trip.currentDay})
              </h2>
              <span className="text-xs text-cyan-300 font-bold">
                {todaysActivities.filter((a) => a.completed).length} / {todaysActivities.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {todaysActivities.map((act) => (
                <div
                  key={act.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    act.completed
                      ? "bg-slate-800/40 border-white/5 text-zinc-400"
                      : "bg-slate-800 border-cyan-400/40 text-white shadow-lg"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-cyan-300 block mb-0.5">
                      {act.time} &bull; {act.category}
                    </span>
                    <strong className="text-sm font-bold block">{act.title}</strong>
                    <span className="text-[11px] text-zinc-400">📍 {act.location}</span>
                  </div>

                  <button
                    onClick={() =>
                      setTodaysActivities((prev) =>
                        prev.map((a) => (a.id === act.id ? { ...a, completed: !a.completed } : a))
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      act.completed
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {act.completed ? "✓ Completed" : "Mark Done"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE BUDGET STATUS (5 COLS) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl text-left">
            <h2 className="text-lg font-black uppercase text-white tracking-tight mb-4 flex items-center gap-2">
              <span>💳</span> Live Budget Tracking
            </h2>

            <div className="bg-slate-800 p-4 rounded-xl border border-white/10 mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-zinc-400 font-bold">Spent So Far</span>
                <strong className="text-lg font-black text-cyan-400">
                  ${trip.totalSpent} / ${trip.budgetCap}
                </strong>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                  style={{ width: `${(trip.totalSpent / trip.budgetCap) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 font-bold mt-2">
                <span>Remaining: ${trip.budgetCap - trip.totalSpent}</span>
                <span>On Budget</span>
              </div>
            </div>

            <Link
              to={`/trips/${trip.id}/details`}
              className="block w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs text-center border border-white/20"
            >
              View Full Trip Details &rarr;
            </Link>
          </div>
        </div>

        {/* CONTEXTUAL SMART SUGGESTIONS WIDGET */}
        <div className="mb-8">
          <SmartSuggestions onAddSuggestion={handleAddSuggestion} />
        </div>

        {/* LIVE ROUTE MAP */}
        <section className="text-left bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-black uppercase text-white tracking-tight mb-4 flex items-center gap-2">
            <span>🗺️</span> Live Route &amp; Remaining Stops
          </h2>
          <TripMap stops={trip.stops} />
        </section>
      </main>
    </div>
  );
}
