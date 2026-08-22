import React, { useEffect, useState } from "react";
import { apiClient, removeToken } from "../api/client";
import PlaneCursor from "../components/PlaneCursor";
import TripDetailModal from "../components/TripDetailModal";

export default function DashboardPage({ user, onLogout }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create Trip Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetCap, setBudgetCap] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Active Trip Detail Modal State
  const [selectedTripId, setSelectedTripId] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.get('/trips');
      setTrips(data.trips || []);
    } catch (err) {
      setError(err.message || "Failed to load your trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/trips', {
        title,
        description: description || undefined,
        start_date: startDate,
        end_date: endDate,
        budget_cap: budgetCap ? parseFloat(budgetCap) : undefined,
      });

      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setBudgetCap("");
      fetchTrips();
    } catch (err) {
      alert(err.message || "Failed to create trip.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrip = async (tripId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await apiClient.del(`/trips/${tripId}`);
      fetchTrips();
    } catch (err) {
      alert(err.message || "Failed to delete trip.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans relative selection:bg-cyan-500 selection:text-white">
      <PlaneCursor />

      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0096B4] to-cyan-400 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-cyan-500/20">
              G
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white m-0 p-0 leading-none">
                GlobeTrotter
              </h1>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">
                Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-200">{user?.name || "Traveler"}</span>
              <span className="text-[10px] text-slate-400">{user?.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Banner Section */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-cyan-950 via-slate-900 to-teal-950 border border-cyan-500/20 p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-extrabold uppercase tracking-wider rounded-full mb-3">
                Welcome back, {user?.name?.split(" ")[0]}!
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
                Plan Your Next Adventure ✈️
              </h2>
              <p className="text-sm text-slate-300 max-w-xl">
                Manage itineraries, organize city stops, collaborate with fellow travelers, and track budgets seamlessly.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-[#0096B4] to-cyan-400 hover:from-[#00819C] hover:to-[#0096B4] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Create New Trip
            </button>
          </div>
        </div>

        {/* Trips Section Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h3 className="text-xl font-black tracking-tight text-white">Your Itineraries</h3>
            <p className="text-xs text-slate-400">Select a trip to view or edit detailed stops and activities</p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
            {trips.length} {trips.length === 1 ? "Trip" : "Trips"}
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <svg className="w-8 h-8 animate-spin text-cyan-400 mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-xs font-semibold">Loading itineraries from backend...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs text-center">
            {error}
          </div>
        ) : trips.length === 0 ? (
          /* Empty Trips State */
          <div className="py-16 text-center bg-slate-800/40 border border-slate-800 rounded-2xl p-8 space-y-4">
            <div className="w-16 h-16 bg-slate-800 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
              🌍
            </div>
            <div>
              <h4 className="text-base font-bold text-white">No trips planned yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Get started by creating your first trip itinerary. Define dates, add city stops, and organize activities.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-[#0096B4] hover:bg-[#00819C] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              + Create First Trip
            </button>
          </div>
        ) : (
          /* Trips Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => setSelectedTripId(trip.id)}
                className="group relative bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {trip.role || "Member"}
                    </span>
                    {trip.role === "owner" && (
                      <button
                        onClick={(e) => handleDeleteTrip(trip.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="Delete Trip"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {trip.title}
                  </h4>

                  {trip.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                      {trip.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-700/60 mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Dates:</span>
                    <span className="font-semibold">{trip.start_date} to {trip.end_date}</span>
                  </div>

                  {trip.budget_cap && (
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Budget Cap:</span>
                      <span className="font-bold text-emerald-400">${parseFloat(trip.budget_cap).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end text-cyan-400 font-extrabold text-xs group-hover:translate-x-1 transition-transform">
                    <span>View Itinerary &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CREATE TRIP MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in-up">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white">Create New Trip</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Trip Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer in Tokyo & Kyoto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Brief notes about your trip goals, themes, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Budget Cap ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 2500"
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#0096B4] hover:bg-[#00819C] text-white font-bold uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Save Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRIP DETAIL HYDRATED MODAL */}
      {selectedTripId && (
        <TripDetailModal
          tripId={selectedTripId}
          onClose={() => setSelectedTripId(null)}
        />
      )}
    </div>
  );
}
