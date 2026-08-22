import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StopList from "../components/StopList";
import ItineraryItemCard from "../components/ItineraryItemCard";
import BudgetSummaryPanel from "../components/BudgetSummaryPanel";
import CollaboratorPresence from "../components/CollaboratorPresence";
import AIGenerateModal from "../components/AIGenerateModal";
import RoleGate from "../components/RoleGate";
import PlaneCursor from "../components/PlaneCursor";
import { tripsAPI, stopsAPI, itemsAPI } from "../services/api";
import socketService from "../services/socket";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function TripBuilderPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activeStopId, setActiveStopId] = useState(null);
  const [items, setItems] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // New Itinerary Item Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemTitle, setItemTitle] = useState("");
  const [itemCategory, setItemCategory] = useState("Activity");
  const [itemCost, setItemCost] = useState(50);
  const [itemTime, setItemTime] = useState("10:00 AM");
  const [itemLocation, setItemLocation] = useState("");
  const [itemDay, setItemDay] = useState("Day 1");

  // Fetch Trip Data
  const loadTripData = async () => {
    setLoading(true);
    try {
      const data = await tripsAPI.getById(id);
      setTrip(data.trip || data);
      const loadedStops = data.stops || data.trip?.stops || [];
      setStops(loadedStops);
      if (loadedStops.length > 0) {
        setActiveStopId(loadedStops[0].id);
      }
      setItems(data.items || data.trip?.items || []);
    } catch {
      // Seed fallback trip data for hackathon demo
      const seedTrip = {
        id: id || "trip_1",
        title: "Ultimate Bali & Island Hopping",
        startDate: "Oct 15, 2026",
        endDate: "Oct 22, 2026",
        budgetCap: 2500,
        role: "owner",
        stops: [
          { id: "stop_1", cityName: "Ubud", nights: 3, lat: -8.5069, lng: 115.2625, startDate: "Oct 15" },
          { id: "stop_2", cityName: "Seminyak", nights: 2, lat: -8.6913, lng: 115.1682, startDate: "Oct 18" },
          { id: "stop_3", cityName: "Nusa Penida", nights: 2, lat: -8.7278, lng: 115.5444, startDate: "Oct 20" },
        ],
        items: [
          { id: "it_1", stopId: "stop_1", title: "Sacred Monkey Forest Sanctuary", category: "Activity", cost: 15, time: "09:00 AM", location: "Ubud Center", day: "Day 1", upvotes: 3, downvotes: 0 },
          { id: "it_2", stopId: "stop_1", title: "Traditional Balinese Cooking Class", category: "Dining", cost: 45, time: "01:00 PM", location: "Ubud Market", day: "Day 1", upvotes: 2, downvotes: 0 },
          { id: "it_3", stopId: "stop_1", title: "Tegallalang Rice Terrace Trek", category: "Sightseeing", cost: 20, time: "08:30 AM", location: "Tegallalang", day: "Day 2", upvotes: 4, downvotes: 0 },
          { id: "it_4", stopId: "stop_2", title: "Sunset Beach Club Dinner", category: "Dining", cost: 120, time: "06:30 PM", location: "Potato Head Seminyak", day: "Day 4", upvotes: 5, downvotes: 0 },
          { id: "it_5", stopId: "stop_3", title: "Kelingking Beach & Diamond Beach Snorkeling", category: "Activity", cost: 75, time: "09:00 AM", location: "Nusa Penida", day: "Day 6", upvotes: 6, downvotes: 0 },
        ],
      };
      setTrip(seedTrip);
      setStops(seedTrip.stops);
      setActiveStopId(seedTrip.stops[0].id);
      setItems(seedTrip.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTripData();
    // Connect Socket.IO Room & Realtime Listeners
    socketService.joinTripRoom(id, user);

    socketService.onPresenceUpdate((users) => {
      setCollaborators(users || []);
    });

    socketService.onItineraryUpdated((eventData) => {
      addToast(eventData.message || "Itinerary updated by collaborator", "info");
      if (eventData.items) setItems(eventData.items);
    });

    socketService.onVoteUpdated((eventData) => {
      setItems((prev) =>
        prev.map((item) => (item.id === eventData.itemId ? { ...item, ...eventData } : item))
      );
    });

    return () => {
      socketService.leaveTripRoom(id);
      socketService.removeListeners();
    };
  }, [id]);

  // Handlers for Stop List
  const handleAddStop = async (city) => {
    const newStop = {
      id: `stop_${Date.now()}`,
      cityName: city.name,
      nights: 2,
      lat: city.lat || -8.4095,
      lng: city.lng || 115.1889,
    };
    try {
      await stopsAPI.add(id, newStop);
    } catch {
      // Local addition
    }
    setStops((prev) => [...prev, newStop]);
    setActiveStopId(newStop.id);
    addToast(`Added ${city.name} to stops!`, "success");
  };

  const handleReorderStops = async (orderedStopIds) => {
    try {
      await stopsAPI.reorder(id, orderedStopIds);
    } catch {
      // Local reorder
    }
    const reordered = orderedStopIds.map((stopId) => stops.find((s) => s.id === stopId)).filter(Boolean);
    setStops(reordered);
  };

  const handleDeleteStop = async (stopId) => {
    try {
      await stopsAPI.delete(stopId);
    } catch {
      // Local delete
    }
    setStops((prev) => prev.filter((s) => s.id !== stopId));
    if (activeStopId === stopId) {
      const remaining = stops.filter((s) => s.id !== stopId);
      if (remaining.length > 0) setActiveStopId(remaining[0].id);
    }
    addToast("Stop deleted", "info");
  };

  // Handlers for Itinerary Items
  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    const newItem = {
      id: `it_${Date.now()}`,
      stopId: activeStopId,
      title: itemTitle,
      category: itemCategory,
      cost: Number(itemCost),
      time: itemTime,
      location: itemLocation,
      day: itemDay,
      upvotes: 0,
      downvotes: 0,
    };

    try {
      await itemsAPI.add(activeStopId, newItem);
    } catch {
      // Local addition
    }

    setItems((prev) => [...prev, newItem]);
    setIsItemModalOpen(false);
    setItemTitle("");
    addToast(`Added "${newItem.title}" to itinerary!`, "success");
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await itemsAPI.delete(itemId);
    } catch {
      // Local delete
    }
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    addToast("Item deleted", "info");
  };

  const handleVoteItem = async (itemId, voteType) => {
    try {
      await itemsAPI.vote(itemId, voteType);
    } catch {
      // Local vote update
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const isUp = voteType === "up";
          return {
            ...item,
            upvotes: isUp ? item.upvotes + 1 : item.upvotes,
            downvotes: !isUp ? item.downvotes + 1 : item.downvotes,
            userVote: voteType,
          };
        }
        return item;
      })
    );
  };

  const activeStop = stops.find((s) => s.id === activeStopId);
  const activeStopItems = items.filter((i) => i.stopId === activeStopId);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden pb-12 select-none">
      <PlaneCursor />
      <Navbar />

      {/* Top Action Header */}
      <div className="bg-slate-900/90 border-b border-white/10 px-6 sm:px-12 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link to="/trips" className="text-zinc-400 hover:text-white text-xs font-bold">
            &larr; Back to Trips
          </Link>
          <span className="text-zinc-600">|</span>
          <h1 className="text-lg font-black text-white uppercase tracking-tight">
            {trip?.title || "Trip Builder"}
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Socket Collaborator Presence */}
          <CollaboratorPresence collaborators={collaborators} />

          {/* Navigation Views */}
          <Link
            to={`/trips/${id}/timeline`}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>📅</span> Timeline
          </Link>

          <Link
            to={`/trips/${id}/map`}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>🗺️</span> Map
          </Link>

          <Link
            to={`/trips/${id}/conduct`}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>📢</span> Conductor View
          </Link>

          {/* AI Generator CTA */}
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>✨ Generate with AI</span>
          </button>
        </div>
      </div>

      {/* CORE 3-PANEL LAYOUT */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-400 gap-3">
          <span className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider">Loading Trip Builder...</span>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* LEFT PANEL: ORDERED STOPS LIST (3 COLS) */}
          <div className="lg:col-span-3 h-full">
            <RoleGate userRole={trip?.role} allowedRoles={["owner", "conductor", "editor"]}>
              <StopList
                stops={stops}
                activeStopId={activeStopId}
                onSelectStop={(sId) => setActiveStopId(sId)}
                onAddStop={handleAddStop}
                onReorderStops={handleReorderStops}
                onDeleteStop={handleDeleteStop}
              />
            </RoleGate>
          </div>

          {/* CENTER PANEL: SELECTED STOP'S ITINERARY (6 COLS) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-white/10 rounded-2xl p-5 flex flex-col h-full overflow-hidden text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <span>🏙️</span> {activeStop ? activeStop.cityName : "Select a Stop"} Itinerary
                </h3>
                <span className="text-xs text-zinc-400 font-medium">
                  {activeStopItems.length} activities scheduled
                </span>
              </div>

              <RoleGate userRole={trip?.role} allowedRoles={["owner", "conductor", "editor"]}>
                <button
                  onClick={() => setIsItemModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow cursor-pointer"
                >
                  + Add Activity
                </button>
              </RoleGate>
            </div>

            {/* Itinerary Items List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {activeStopItems.length === 0 ? (
                <div className="text-center py-16 text-xs text-zinc-400">
                  No itinerary items for this stop yet. Click &quot;+ Add Activity&quot; or &quot;Generate with AI&quot;!
                </div>
              ) : (
                activeStopItems.map((item) => (
                  <ItineraryItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => {
                      setItemTitle(item.title);
                      setItemCategory(item.category);
                      setItemCost(item.cost);
                      setItemTime(item.time);
                      setItemLocation(item.location);
                      setIsItemModalOpen(true);
                    }}
                    onDelete={handleDeleteItem}
                    onVote={handleVoteItem}
                  />
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL: LIVE BUDGET SUMMARY (3 COLS) */}
          <div className="lg:col-span-3 h-full">
            <BudgetSummaryPanel items={items} budgetCap={trip?.budgetCap || 2500} />
          </div>
        </main>
      )}

      {/* Add / Edit Itinerary Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left relative">
            <button
              onClick={() => setIsItemModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-sm"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">
              Add Itinerary Activity
            </h3>

            <form onSubmit={handleAddItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scuba Diving at Crystal Bay"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
                  >
                    <option value="Activity">Activity</option>
                    <option value="Dining">Dining</option>
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Transit">Transit</option>
                    <option value="Lodging">Lodging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={itemTime}
                    onChange={(e) => setItemTime(e.target.value)}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Day
                  </label>
                  <input
                    type="text"
                    placeholder="Day 1"
                    value={itemDay}
                    onChange={(e) => setItemDay(e.target.value)}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Beachside Road 4"
                  value={itemLocation}
                  onChange={(e) => setItemLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Generator Modal */}
      <AIGenerateModal
        tripId={id}
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSuccess={() => {
          loadTripData();
          addToast("AI Itinerary Generated Successfully!", "success");
        }}
      />
    </div>
  );
}
