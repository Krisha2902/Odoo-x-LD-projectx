import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import TripMap from "../components/TripMap";
import PlaneCursor from "../components/PlaneCursor";
import { tripsAPI } from "../services/api";

export default function TripDetailsPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState("Day 1");

  const fetchTripDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch full trip details from backend
      const data = await tripsAPI.getFull(id).catch(() => tripsAPI.getById(id));
      const tripData = data.trip || data;
      setTrip(tripData);

      const fetchedStops = data.stops || tripData.stops || [];
      setStops(fetchedStops);

      // Extract and normalize all items from stops or root items
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
        extractedItems = data.items || tripData.items || [];
      }

      setItems(extractedItems);
    } catch (err) {
      console.error("Failed to load trip details:", err);
      setError("Unable to load trip details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchTripDetails().then(() => {
      if (!isMounted) return;
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Formatted route stops for map with stable memoization
  const routeFormatted = useMemo(() => {
    return (stops || []).map((s, idx) => ({
      id: s.id || s.stop_id || idx,
      cityName: s.cityName || s.city_name || s.name || `Stop ${idx + 1}`,
      nights: s.nights || 2,
      lat: Number(s.lat) || 0,
      lng: Number(s.lng) || 0,
    }));
  }, [stops]);

  // Dynamically constructed Day-by-Day schedule from real trip dates & items
  const daysList = useMemo(() => {
    const daysMap = {};

    // 1. If start_date and end_date exist, build calendar day slots
    if (trip?.start_date && trip?.end_date) {
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      const diffDays = Math.max(1, Math.min(30, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1));
      for (let i = 0; i < diffDays; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        const label = `Day ${i + 1}`;
        daysMap[label] = {
          dayLabel: label,
          date: dateStr,
          activities: [],
        };
      }
    }

    // 2. Put real items into their respective days
    items.forEach((it, idx) => {
      let assignedDay = it.day;
      if (!assignedDay && it.scheduled_date) {
        const found = Object.values(daysMap).find((d) => d.date === it.scheduled_date);
        if (found) assignedDay = found.dayLabel;
      }
      if (!assignedDay) {
        const keys = Object.keys(daysMap);
        assignedDay = keys.length > 0 ? keys[idx % keys.length] : "Day 1";
      }

      if (!daysMap[assignedDay]) {
        daysMap[assignedDay] = {
          dayLabel: assignedDay,
          date: it.scheduled_date || trip?.start_date || `Day ${idx + 1}`,
          activities: [],
        };
      }

      daysMap[assignedDay].activities.push({
        id: it.id || idx,
        time: it.scheduled_time || it.time || "10:00 AM",
        title: it.custom_name || it.title || "Scheduled Activity",
        category: it.category || "Activity",
        cost: Number(it.cost) || 0,
        notes: it.notes || "",
      });
    });

    // 3. Fallback: if no days at all, create Day 1 slot
    if (Object.keys(daysMap).length === 0) {
      daysMap["Day 1"] = {
        dayLabel: "Day 1",
        date: trip?.start_date || "Day 1",
        activities: [],
      };
    }

    return Object.values(daysMap);
  }, [trip, items]);

  // Keep activeDay synchronized with existing daysList
  useEffect(() => {
    if (daysList.length > 0 && !daysList.some((d) => d.dayLabel === activeDay)) {
      setActiveDay(daysList[0].dayLabel);
    }
  }, [daysList, activeDay]);

  // Dynamic budget breakdown calculated from real items
  const budgetBreakdown = useMemo(() => {
    const cats = {};
    items.forEach((it) => {
      const rawCat = it.category || "activity";
      const catName = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
      cats[catName] = (cats[catName] || 0) + (Number(it.cost) || 0);
    });
    return Object.entries(cats).map(([category, cost]) => ({ category, cost }));
  }, [items]);

  const totalSpent = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.cost) || 0), 0);
  }, [items]);

  const budgetCap = trip?.budget_cap || trip?.budgetCap || 2500;

  const currentDayActivities = useMemo(() => {
    const current = daysList.find((d) => d.dayLabel === activeDay);
    return current?.activities || [];
  }, [daysList, activeDay]);

  const gallery = [
    trip?.cover_image_url || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80",
  ];

  return (
    <div className="min-h-screen bg-[#071C1C] text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-24">
        {/* ERROR ALERT BANNER WITH RETRY */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 backdrop-blur-md flex items-center justify-between gap-4 text-rose-200 text-xs font-semibold">
            <span>⚠️ {error}</span>
            <button
              onClick={fetchTripDetails}
              className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs shadow cursor-pointer hover:bg-rose-400 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          /* Glassmorphic Skeleton Placeholder Header & Body */
          <div className="space-y-6 animate-pulse">
            <div className="h-80 rounded-3xl bg-white/10 border border-white/15" />
            <div className="h-48 rounded-2xl bg-white/10 border border-white/15" />
          </div>
        ) : !trip ? (
          /* Empty State Container */
          <div className="bg-[#0D2626] border border-[#5AD9BC]/20 rounded-3xl p-12 text-center max-w-md mx-auto my-12">
            <span className="text-4xl block mb-3">📍</span>
            <h3 className="text-xl font-bold text-white mb-2">Trip Not Found</h3>
            <p className="text-xs text-zinc-400 mb-6">The requested trip could not be loaded or was deleted.</p>
            <Link
              to="/my-trips"
              className="px-6 py-2.5 rounded-full bg-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase"
            >
              &larr; Back to My Trips
            </Link>
          </div>
        ) : (
          <>
            {/* HERO COVER SECTION */}
            <div className="relative rounded-3xl overflow-hidden mb-8 border border-white/15 shadow-2xl h-80 flex flex-col justify-end p-8 text-left">
              <img
                src={
                  trip.cover_image_url ||
                  trip.coverImage ||
                  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"
                }
                alt={trip.title}
                className="absolute inset-0 w-full h-full object-cover -z-10 brightness-65"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071C1C] via-[#071C1C]/40 to-transparent -z-10" />

              <div className="flex flex-wrap items-end justify-between gap-4 z-10">
                <div>
                  <Link to="/my-trips" className="text-xs font-bold text-[#72F0D0] mb-2 inline-block">
                    &larr; Back to My Trips
                  </Link>
                  <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                    {trip.title}
                  </h1>
                  <p className="text-xs text-zinc-300 font-medium">
                    📅 {trip.start_date && trip.end_date ? `${trip.start_date} — ${trip.end_date}` : trip.dates || "Flexible Dates"} &bull; {trip.duration || `${daysList.length} Days Trip`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/trips/${trip.id}/build`}
                    className="px-5 py-2.5 rounded-full bg-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase tracking-wider shadow hover:bg-[#72F0D0] transition-colors"
                  >
                    ✏️ Edit Itinerary
                  </Link>
                  <Link
                    to={`/trips/${trip.id}/ongoing`}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase tracking-wider shadow hover:scale-105 transition-all"
                  >
                    ⚡ Live Dashboard
                  </Link>
                </div>
              </div>
            </div>

            {/* ROUTE JOURNEY MAP SECTION */}
            <section className="mb-12 text-left bg-[#0D2626] border border-[#5AD9BC]/20 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-black uppercase text-white tracking-tight mb-4 flex items-center gap-2">
                <span>🗺️</span> Journey Route &amp; Progression Map
              </h2>

              <div className="flex items-center justify-between overflow-x-auto custom-scrollbar pb-4 mb-6">
                {routeFormatted.length === 0 ? (
                  <div className="text-xs text-zinc-400 py-2">No destination stops added yet.</div>
                ) : (
                  routeFormatted.map((r, idx) => (
                    <React.Fragment key={idx}>
                      <div className="flex items-center gap-3 bg-[#123131] border border-[#42D6B5]/40 px-4 py-3 rounded-2xl shadow min-w-[160px]">
                        <span className="w-8 h-8 rounded-full bg-[#20C9B0] text-[#063D3A] font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="block text-sm font-extrabold text-white">{r.cityName}</strong>
                          <span className="text-[10px] text-[#72F0D0] font-bold">{r.nights} Nights</span>
                        </div>
                      </div>
                      {idx < routeFormatted.length - 1 && (
                        <span className="text-[#20C9B0] font-black text-lg px-2">➔</span>
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>

              <TripMap stops={routeFormatted} items={items} trip={trip} />
            </section>

            {/* DAY-BY-DAY JOURNEY & BUDGET SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              {/* DAY-BY-DAY JOURNEY (8 COLS) */}
              <div className="lg:col-span-8 bg-[#0D2626] border border-[#5AD9BC]/20 rounded-2xl p-6 shadow-2xl text-left">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                    <span>📅</span> Day-by-Day Trip Schedule
                  </h2>
                  <Link
                    to={`/trips/${trip.id}/build`}
                    className="text-xs font-bold text-[#72F0D0] hover:underline"
                  >
                    + Add / Edit in Builder &rarr;
                  </Link>
                </div>

                <div className="flex gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto custom-scrollbar">
                  {daysList.map((d) => (
                    <button
                      key={d.dayLabel}
                      onClick={() => setActiveDay(d.dayLabel)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeDay === d.dayLabel
                          ? "bg-[#20C9B0] text-[#063D3A] font-extrabold shadow"
                          : "bg-[#123131] text-zinc-400 hover:text-white"
                      }`}
                    >
                      {d.dayLabel} {d.date ? `(${d.date})` : ""}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {currentDayActivities.length === 0 ? (
                    <div className="bg-[#123131]/40 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                      <span className="text-3xl block mb-2">🗓️</span>
                      <p className="text-xs text-zinc-400 font-medium mb-4">
                        No activities scheduled for {activeDay} yet.
                      </p>
                      <Link
                        to={`/trips/${trip.id}/build`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#20C9B0] text-[#063D3A] font-extrabold text-xs shadow hover:bg-[#72F0D0] transition-colors"
                      >
                        <span>+</span> Add Activities in Trip Builder
                      </Link>
                    </div>
                  ) : (
                    currentDayActivities.map((act, i) => (
                      <div
                        key={act.id || i}
                        className="bg-[#123131]/80 border border-white/10 rounded-xl p-4 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#72F0D0] block mb-1">
                            ⏰ {act.time} &bull; {act.category}
                          </span>
                          <strong className="text-sm font-bold text-white">{act.title}</strong>
                          {act.notes && (
                            <p className="text-[11px] text-zinc-400 mt-1 italic">{act.notes}</p>
                          )}
                        </div>
                        <span className="text-xs font-extrabold text-[#72F0D0]">${act.cost}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* BUDGET OVERVIEW SECTION (4 COLS) */}
              <div className="lg:col-span-4 bg-[#0D2626] border border-[#5AD9BC]/20 rounded-2xl p-6 shadow-2xl text-left">
                <h2 className="text-xl font-black uppercase text-white tracking-tight mb-4 flex items-center gap-2">
                  <span>💳</span> Budget Overview
                </h2>

                <div className="bg-[#123131] p-4 rounded-xl border border-white/10 mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs text-zinc-400 font-bold">Total Spent</span>
                    <strong className="text-lg font-black text-[#72F0D0]">
                      ${totalSpent.toLocaleString()} / ${Number(budgetCap).toLocaleString()}
                    </strong>
                  </div>
                  <div className="w-full bg-[#071C1C] h-2.5 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (totalSpent / (Number(budgetCap) || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {budgetBreakdown.length === 0 ? (
                    <div className="bg-[#123131]/40 border border-dashed border-white/10 rounded-xl p-4 text-center text-xs text-zinc-400">
                      No expenses logged for this trip yet.
                    </div>
                  ) : (
                    budgetBreakdown.map((b) => (
                      <div
                        key={b.category}
                        className="bg-[#123131]/60 p-3 rounded-xl flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-zinc-300">{b.category}</span>
                        <span className="font-black text-[#72F0D0]">${b.cost}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* TRIP MEMORIES PHOTO GALLERY */}
            <section className="text-left bg-[#0D2626] border border-[#5AD9BC]/20 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-black uppercase text-white tracking-tight mb-4 flex items-center gap-2">
                <span>📷</span> Trip Memories Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {gallery.map((imgUrl, i) => (
                  <div key={i} className="h-48 rounded-xl overflow-hidden border border-white/15">
                    <img
                      src={imgUrl}
                      alt={`Memory ${i}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
