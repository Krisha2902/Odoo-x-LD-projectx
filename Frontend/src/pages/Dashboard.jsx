import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TripCard from "../components/TripCard";
import { tripsAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import PlaneCursor from "../components/PlaneCursor";

export default function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  // New Trip Form State
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("Oct 15, 2026");
  const [endDate, setEndDate] = useState("Oct 22, 2026");
  const [budgetCap, setBudgetCap] = useState(2500);
  const [coverImage, setCoverImage] = useState("");

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await tripsAPI.getAll();
      setTrips(data.trips || data || []);
    } catch (err) {
      console.warn("API trips endpoint sparse, loading seed hackathon trips:", err);
      const seedTrips = [
        {
          id: "trip_1",
          title: "Ultimate Bali & Island Hopping",
          startDate: "Oct 15, 2026",
          endDate: "Oct 22, 2026",
          coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
          budgetCap: 2500,
          isPublic: true,
          role: "owner",
          slug: "bali-island-hopping",
        },
        {
          id: "trip_2",
          title: "Paris & Santorini Sunset Voyage",
          startDate: "Nov 01, 2026",
          endDate: "Nov 08, 2026",
          coverImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
          budgetCap: 3200,
          isPublic: true,
          role: "conductor",
          slug: "paris-santorini-voyage",
        },
        {
          id: "trip_3",
          title: "Dubai Desert & Tokyo Tech Expedition",
          startDate: "Dec 10, 2026",
          endDate: "Dec 20, 2026",
          coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
          budgetCap: 4500,
          isPublic: false,
          role: "editor",
          slug: "dubai-tokyo-expedition",
        },
      ];
      setTrips(seedTrips);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      const newTripData = {
        title,
        startDate,
        endDate,
        budgetCap: Number(budgetCap),
        coverImage: coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
        isPublic: true,
      };
      const created = await tripsAPI.create(newTripData);
      setTrips((prev) => [created.trip || created, ...prev]);
      addToast("New trip created successfully!", "success");
    } catch {
      // Local addition fallback
      const createdMock = {
        id: `trip_${Date.now()}`,
        title,
        startDate,
        endDate,
        budgetCap: Number(budgetCap),
        coverImage: coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
        isPublic: true,
        role: "owner",
        slug: title.toLowerCase().replace(/\s+/g, "-"),
      };
      setTrips((prev) => [createdMock, ...prev]);
      addToast("Created trip in workspace!", "success");
    } finally {
      setIsModalOpen(false);
      setTitle("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden pb-16">
      <PlaneCursor />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              My Travel Itineraries
            </h1>
            <p className="text-xs text-zinc-400 font-medium">Manage, build, and collaborate on multi-city trips</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0096B4] to-cyan-400 hover:from-[#00819C] hover:to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="text-base font-black">+</span>
            <span>New Trip</span>
          </button>
        </div>

        {/* Loading & Empty States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
            <span className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading trips...</span>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-12 text-center max-w-md mx-auto">
            <span className="text-4xl block mb-3">✈️</span>
            <h3 className="text-lg font-bold text-white mb-1">No Trips Created Yet</h3>
            <p className="text-xs text-zinc-400 mb-6">Click the &quot;New Trip&quot; button above to start planning your first multi-city adventure!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 rounded-full bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow"
            >
              + Create First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>

      {/* New Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in-up select-none">
          <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-sm"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">
              Create New Travel Itinerary
            </h3>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Trip Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EuroTrip 2026 Adventure"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Budget Cap ($)
                </label>
                <input
                  type="number"
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(e.target.value)}
                  className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs"
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
