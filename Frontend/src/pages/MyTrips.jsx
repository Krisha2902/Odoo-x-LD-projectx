import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import PlaneCursor from "../components/PlaneCursor";
import { tripsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function MyTripsPage() {
  const [activeCategory, setActiveCategory] = useState("Upcoming");
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchUserTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tripsAPI.getAll();
      const rawTrips = data.trips || data || [];

      // Map API trips to component format with default image fallbacks
      const mapped = rawTrips.map((t) => {
        // Classify trip status based on start/end dates
        const now = new Date();
        const start = t.start_date ? new Date(t.start_date) : null;
        const end = t.end_date ? new Date(t.end_date) : null;
        let status = "Upcoming";

        if (start && end) {
          if (now >= start && now <= end) status = "Ongoing";
          else if (now > end) status = "Completed";
        }

        return {
          id: t.id || t.share_slug,
          status: t.status || status,
          title: t.title || "My Adventure",
          memoryQuote: t.description || "Exciting journey ahead filled with new places and stories.",
          dates: t.start_date && t.end_date ? `${t.start_date} — ${t.end_date}` : "Flexible Dates",
          currentDay: "Live",
          images: [
            t.cover_image_url ||
              "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
          ],
        };
      });

      setTrips(mapped);
    } catch (err) {
      console.error("Error fetching user trips:", err);
      setError("Failed to load your trips. Please check connection and try again.");
      addToast("Failed to fetch trips", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchUserTrips().then(() => {
      if (!isMounted) return;
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteTrip = async (tripId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    setDeletingId(tripId);
    try {
      await tripsAPI.delete(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      addToast("Trip deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete trip:", err);
      // Optimistic fallback removal
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      addToast("Trip removed from view", "info");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTrips = trips.filter((t) => t.status === activeCategory);

  return (
    <div className="min-h-screen bg-[#071C1C] text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-24">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6 text-left">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              My Travel Memories &amp; Trips
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Welcome back {user?.name || "Explorer"}! View your upcoming adventures, live ongoing travels, and cherished past trip memories.
            </p>
          </div>

          <Link
            to="/plan-trip"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="text-base font-black">+</span>
            <span>Plan New Trip</span>
          </Link>
        </div>

        {/* ERROR STATE BANNER WITH RETRY BUTTON */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 backdrop-blur-md flex items-center justify-between gap-4 text-rose-200 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={fetchUserTrips}
              className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs hover:bg-rose-600 transition-colors cursor-pointer shadow"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Category Tabs: Upcoming | Ongoing | Completed */}
        <div className="flex items-center gap-3 mb-8">
          {["Upcoming", "Ongoing", "Completed"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] text-[#063D3A] shadow-[0_0_20px_rgba(32,201,176,0.4)] scale-105"
                  : "bg-[#123131] text-zinc-300 border border-[#5AD9BC]/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trips List with Loading Skeleton & Empty State Scaffolding */}
        <div className="space-y-8">
          {isLoading ? (
            /* Smooth Skeleton Loader Matching Theme */
            Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-white/10 bg-[#123131]/40 h-80 animate-pulse p-8 flex flex-col justify-end gap-4"
              >
                <div className="w-1/3 h-4 bg-white/20 rounded" />
                <div className="w-2/3 h-8 bg-white/20 rounded" />
                <div className="w-1/2 h-4 bg-white/10 rounded" />
              </div>
            ))
          ) : filteredTrips.length === 0 ? (
            /* Interactive Empty State Container with CTA */
            <div className="bg-[#123131]/40 border border-[#5AD9BC]/20 rounded-2xl p-12 text-center max-w-md mx-auto">
              <span className="text-4xl block mb-3">🧳</span>
              <h3 className="text-lg font-bold text-white mb-1">No {activeCategory} Trips</h3>
              <p className="text-xs text-zinc-400 mb-6">Start planning a new trip to build your itinerary!</p>
              <Link
                to="/plan-trip"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 inline-block"
              >
                + Plan a Trip →
              </Link>
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const currentImg = trip.images[0];

              return (
                <div
                  key={trip.id}
                  className="group relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl min-h-[340px] flex flex-col justify-end p-8 text-left transition-all duration-500 hover:border-[#42D6B5]/60 hover:shadow-[0_0_35px_rgba(32,201,176,0.3)]"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={currentImg}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-all duration-1000 transform scale-105 group-hover:scale-110 brightness-65"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071C1C] via-[#071C1C]/60 to-transparent" />
                  </div>

                  {/* Status & Action Badges */}
                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                          trip.status === "Ongoing"
                            ? "bg-[#20C9B0] text-[#063D3A] border-[#7AF0D2] animate-pulse"
                            : trip.status === "Upcoming"
                            ? "bg-[#42D6B5]/90 text-[#063D3A] border-[#72F0D0]"
                            : "bg-slate-800/90 text-zinc-300 border-white/20"
                        }`}
                      >
                        {trip.status === "Ongoing" ? `● Live: ${trip.currentDay}` : trip.status}
                      </span>
                      <span className="bg-black/60 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-full border border-white/20">
                        📅 {trip.dates}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      disabled={deletingId === trip.id}
                      className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500 hover:text-white transition-all text-xs font-bold backdrop-blur-md flex items-center gap-1 cursor-pointer"
                      title="Delete Trip"
                    >
                      {deletingId === trip.id ? (
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>🗑️ Delete</span>
                      )}
                    </button>
                  </div>

                  {/* Trip Memory Title & Description */}
                  <div className="max-w-2xl z-10">
                    <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#72F0D0] transition-colors">
                      {trip.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-300 font-medium italic mb-6 leading-relaxed drop-shadow">
                      &quot;{trip.memoryQuote}&quot;
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() =>
                          navigate(trip.status === "Ongoing" ? `/trips/${trip.id}/ongoing` : `/trips/${trip.id}/details`)
                        }
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer hover:scale-105"
                      >
                        {trip.status === "Ongoing" ? "⚡ Live Trip Dashboard" : "Trip Details →"}
                      </button>

                      <Link
                        to={`/trips/${trip.id}/build`}
                        className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all"
                      >
                        Edit Itinerary
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

