import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SmartSuggestions from "../components/SmartSuggestions";
import TripMap from "../components/TripMap";
import PlaneCursor from "../components/PlaneCursor";
import { tripsAPI } from "../services/api";

export default function OngoingTripPage() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [todaysActivities, setTodaysActivities] = useState([]);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    tripsAPI
      .getFull(id)
      .then((data) => {
        const fetchedTrip = data.trip || data;
        setTrip(fetchedTrip);
        
        const fetchedStops = fetchedTrip.stops || data.stops || [];
        setStops(fetchedStops);

        // Extract items for today's activity list
        const allItems = [];
        fetchedStops.forEach((stop) => {
          if (Array.isArray(stop.items)) {
            stop.items.forEach((item) => {
              allItems.push({
                id: item.id || Math.random(),
                time: item.scheduled_time || "10:00 AM",
                title: item.custom_name || item.name || "Activity",
                category: item.category || "Sightseeing",
                location: stop.city_name || "Destination",
                completed: false,
              });
            });
          }
        });

        setTodaysActivities(allItems);
      })
      .catch((err) => {
        setError(err.message || "Failed to load ongoing trip data.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddSuggestion = (sug) => {
    setTodaysActivities((prev) => [
      ...prev,
      {
        id: Date.now(),
        time: "07:30 PM",
        title: sug.title,
        category: sug.category,
        location: sug.distance || "Nearby",
        completed: false,
      },
    ]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071C1C] text-white flex items-center justify-center">
        <PlaneCursor />
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#72F0D0] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-zinc-400">Loading live trip telemetry...</span>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#071C1C] text-white flex flex-col items-center justify-center p-6 text-center">
        <PlaneCursor />
        <span className="text-5xl mb-3">⚠️</span>
        <h2 className="text-2xl font-bold text-white mb-2">Trip Not Found</h2>
        <p className="text-zinc-400 text-sm max-w-md mb-6">{error || "Unable to fetch requested trip information."}</p>
        <Link to="/my-trips" className="bg-[#72F0D0] text-[#071C1C] px-6 py-2.5 rounded-full font-bold text-sm">
          Return to My Trips
        </Link>
      </div>
    );
  }

  const budgetCap = trip.budget_cap || trip.budgetCap || 2500;
  const totalSpent = trip.total_spent || trip.totalSpent || 0;
  const currentLocation = stops.length > 0 ? stops[0].city_name : "On the road";

  return (
    <div className="min-h-screen bg-[#071C1C] text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-24">
        {/* Top Live Banner */}
        <div className="bg-gradient-to-r from-[#0D2626] via-[#0D2626]/90 to-[#123131] border border-[#5AD9BC]/30 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 text-left relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 z-10 relative">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-[#72F0D0] animate-ping" />
                <span className="text-xs font-black text-[#72F0D0] uppercase tracking-widest bg-[#42D6B5]/20 px-3 py-1 rounded-full border border-[#42D6B5]/40">
                  LIVE ONGOING TRIP DASHBOARD
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                {trip.title}
              </h1>
              <p className="text-xs font-bold text-[#72F0D0] mt-1">
                📍 Currently at: <strong>{currentLocation}</strong>
              </p>
            </div>

            {/* Days Counter Progress Badge */}
            <div className="bg-[#123131]/90 border border-white/20 p-4 rounded-2xl text-center shadow-lg">
              <span className="text-xs text-zinc-400 font-bold uppercase block">Status</span>
              <strong className="text-2xl font-black text-[#72F0D0]">
                Active Trip
              </strong>
              <span className="text-[10px] text-[#42D6B5] font-bold block mt-1">
                {stops.length} Destination Stops
              </span>
            </div>
          </div>

          {/* Progress Line */}
          <div className="w-full bg-[#071C1C] h-3 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] transition-all duration-500"
              style={{ width: "65%" }}
            />
          </div>
        </div>

        {/* TODAY'S SCHEDULE & LIVE BUDGET */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* TODAY'S SCHEDULE (7 COLS) */}
          <div className="lg:col-span-7 bg-[#0D2626] border border-[#5AD9BC]/20 rounded-2xl p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h2 className="text-lg font-black uppercase text-white tracking-tight flex items-center gap-2">
                <span>⏰</span> Today&apos;s Itinerary Items
              </h2>
              <span className="text-xs text-[#72F0D0] font-bold">
                {todaysActivities.filter((a) => a.completed).length} / {todaysActivities.length} Done
              </span>
            </div>

            {todaysActivities.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No itinerary items scheduled yet for this trip.</p>
            ) : (
              <div className="space-y-3">
                {todaysActivities.map((act) => (
                  <div
                    key={act.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                      act.completed
                        ? "bg-[#123131]/40 border-white/5 text-zinc-400"
                        : "bg-[#123131] border-[#42D6B5]/40 text-white shadow-lg"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#72F0D0] block mb-0.5">
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
                          ? "bg-[#42D6B5]/20 text-[#72F0D0] border border-[#42D6B5]/30"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {act.completed ? "✓ Completed" : "Mark Done"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LIVE BUDGET STATUS (5 COLS) */}
          <div className="lg:col-span-5 bg-[#0D2626] border border-[#5AD9BC]/20 rounded-2xl p-6 shadow-2xl text-left">
            <h2 className="text-lg font-black uppercase text-white tracking-tight mb-4 flex items-center gap-2">
              <span>💳</span> Live Budget Tracking
            </h2>

            <div className="bg-[#123131] p-4 rounded-xl border border-white/10 mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-zinc-400 font-bold">Spent So Far</span>
                <strong className="text-lg font-black text-[#72F0D0]">
                  ${totalSpent} / ${budgetCap}
                </strong>
              </div>
              <div className="w-full bg-[#071C1C] h-2.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0]"
                  style={{ width: `${Math.min(100, (totalSpent / budgetCap) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 font-bold mt-2">
                <span>Remaining: ${Math.max(0, budgetCap - totalSpent)}</span>
                <span className="text-[#72F0D0]">On Track</span>
              </div>
            </div>

            <Link
              to={`/trips/${trip.id}/details`}
              className="block w-full py-2.5 rounded-xl bg-[#123131] hover:bg-[#1a4242] text-white font-extrabold text-xs text-center border border-white/20 transition-all"
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
        <section className="text-left bg-[#0D2626] border border-[#5AD9BC]/20 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-black uppercase text-white tracking-tight mb-4 flex items-center gap-2">
            <span>🗺️</span> Live Route &amp; Remaining Stops
          </h2>
          <TripMap stops={stops} />
        </section>
      </main>
    </div>
  );
}
