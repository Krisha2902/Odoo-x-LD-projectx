import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  MoreHorizontal,
  Navigation,
  Plus,
  Sparkles,
  Utensils,
  WalletCards,
  X,
} from "lucide-react";
import PlaneCursor from "../../components/PlaneCursor";
import { tripsAPI } from "../../services/api";

function OngoingTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);
  const [showSuggestion, setShowSuggestion] = useState(true);

  useEffect(() => {
    tripsAPI
      .getAll()
      .then((data) => {
        setTrips(data.trips || data || []);
      })
      .catch((err) => {
        console.warn("Failed to fetch ongoing trips:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeTrip = trips[selectedTripIndex] || null;

  return (
    <main className="min-h-screen bg-[#071517] px-5 pb-24 pt-28 text-white sm:px-8 lg:px-12 select-none text-left">
      <PlaneCursor />

      <div className="mx-auto max-w-[1400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-10 h-10 border-4 border-[#8af5d7] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[#8af5d7] font-bold text-sm">Fetching active trips...</p>
          </div>
        ) : !activeTrip ? (
          <div className="rounded-[2rem] border border-[#2c5b57] bg-[#0c2829] p-12 text-center max-w-xl mx-auto">
            <Sparkles className="h-12 w-12 text-[#8af5d7] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Active Ongoing Trips</h2>
            <p className="text-white/60 text-sm mb-6">Create a trip or start an itinerary to track your journey in real time.</p>
            <Link
              to="/plan-trip"
              className="inline-flex items-center gap-2 rounded-full bg-[#8af5d7] px-6 py-3 text-sm font-bold text-[#063d3a]"
            >
              <Plus className="h-4 w-4" /> Plan a New Trip
            </Link>
          </div>
        ) : (
          <>
            <section className="relative overflow-hidden rounded-[2rem] bg-[#123d3c] shadow-2xl shadow-black/20">
              <img
                src={activeTrip.cover_image_url || activeTrip.coverImage || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1800&q=85"}
                alt="Skyline"
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#082323] via-[#082323]/80 to-transparent" />
              <div className="relative grid min-h-[390px] items-end gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_.9fr] lg:p-14">
                <div className="max-w-xl">
                  <div className="mb-7 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8af5d7]">
                    <span className="flex items-center gap-2 rounded-full bg-[#8af5d7]/15 px-3 py-2 border border-[#8af5d7]/30">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[#8af5d7]" /> Live trip
                    </span>
                    <span className="text-white/60">Active Journey</span>
                  </div>
                  <p className="mb-3 flex items-center gap-2 text-sm text-white/70">
                    <MapPin className="h-4 w-4 text-[#8af5d7]" /> {activeTrip.start_date || "Current Dates"}
                  </p>
                  <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl text-white">
                    {activeTrip.title}
                  </h1>
                  <p className="mt-5 max-w-md text-base leading-7 text-white/70">
                    {activeTrip.description || "Live tracking, budget updates, and itinerary schedule."}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-[#071517]/60 p-5 backdrop-blur-md sm:p-6 shadow-xl">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm text-white/65">Budget cap</span>
                    <span className="font-semibold text-[#8af5d7]">${activeTrip.budget_cap || activeTrip.budgetCap || 2500}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full w-[64%] rounded-full bg-[#8af5d7]" />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xl font-semibold text-white">{activeTrip.role || "Member"}</p>
                      <p className="mt-1 text-white/55">Your Role</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-[#8af5d7]">${activeTrip.budget_cap || 2500}</p>
                      <p className="mt-1 text-white/55">Target Cap</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TRIPS SELECTOR LIST */}
            {trips.length > 1 && (
              <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
                {trips.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTripIndex(idx)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                      selectedTripIndex === idx
                        ? "bg-[#8af5d7] text-[#063d3a]"
                        : "bg-[#0c2829] text-white/70 border border-white/10 hover:text-white"
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-white/45">
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> Real-time backend sync enabled</span>
              <Link to={`/trips/${activeTrip.id}`} className="flex items-center gap-2 font-semibold text-[#8af5d7] hover:text-white transition-colors">
                Open full itinerary <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
      <PlaneCursor />
    </main>
  );
}

export default OngoingTrips;