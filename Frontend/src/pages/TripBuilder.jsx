import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
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
  const [editingItemId, setEditingItemId] = useState(null);
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
      const data = await tripsAPI.getFull(id).catch(() => tripsAPI.getById(id));
      const loadedTrip = data.trip || data;
      setTrip(loadedTrip);

      // Normalize stops
      const rawStops = data.stops || loadedTrip.stops || [];
      const normalizedStops = rawStops.map((s, idx) => ({
        ...s,
        id: s.id ?? s.stop_id ?? `stop_${idx}`,
        stop_id: s.stop_id ?? s.id ?? `stop_${idx}`,
        cityName: s.cityName || s.city_name || s.name || `Stop ${idx + 1}`,
        city_name: s.city_name || s.cityName || s.name || `Stop ${idx + 1}`,
        nights: s.nights || 2,
        lat: Number(s.lat) || 0,
        lng: Number(s.lng) || 0,
        startDate: s.startDate || s.start_date || s.stop_start_date,
      }));
      setStops(normalizedStops);

      if (normalizedStops.length > 0) {
        setActiveStopId((prev) =>
          prev && normalizedStops.some((s) => String(s.id) === String(prev))
            ? prev
            : normalizedStops[0].id
        );
      }

      // Normalize and extract items from all stops or root items
      let extractedItems = [];
      rawStops.forEach((s) => {
        if (Array.isArray(s.items)) {
          s.items.forEach((it) => {
            extractedItems.push({
              ...it,
              id: it.id,
              stopId: it.stopId ?? it.stop_id ?? s.id ?? s.stop_id,
              title: it.title || it.custom_name || "Activity",
              category: it.category || "Activity",
              cost: Number(it.cost) || 0,
              time: it.time || it.scheduled_time || "09:00 AM",
              location: it.location || s.city_name || s.cityName || "Destination",
              day: it.day || (it.scheduled_date ? `Day ${it.scheduled_date}` : "Day 1"),
              upvotes: it.upvotes || 0,
              downvotes: it.downvotes || 0,
            });
          });
        }
      });

      if (extractedItems.length === 0 && Array.isArray(data.items || loadedTrip.items)) {
        extractedItems = (data.items || loadedTrip.items).map((it) => ({
          ...it,
          id: it.id,
          stopId: it.stopId ?? it.stop_id,
          title: it.title || it.custom_name || "Activity",
          category: it.category || "Activity",
          cost: Number(it.cost) || 0,
          time: it.time || it.scheduled_time || "09:00 AM",
          location: it.location || "Destination",
          day: it.day || "Day 1",
          upvotes: it.upvotes || 0,
          downvotes: it.downvotes || 0,
        }));
      }

      setItems(extractedItems);
    } catch (err) {
      console.error("Failed to load trip builder data:", err);
      addToast("Failed to load trip data from server", "error");
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
    const nextOrder = stops.length + 1;
    const today = new Date().toISOString().split("T")[0];
    const newStopPayload = {
      city_name: city.name,
      country: city.country || "Global",
      lat: Number(city.lat) || 0,
      lng: Number(city.lng) || 0,
      order_index: nextOrder,
      start_date: trip?.start_date || today,
      end_date: trip?.end_date || today,
    };

    try {
      const res = await stopsAPI.add(id, newStopPayload);
      const addedStop = res.stop || res;
      const normalized = {
        ...addedStop,
        id: addedStop.id || addedStop.stop_id || `stop_${Date.now()}`,
        stop_id: addedStop.stop_id || addedStop.id || `stop_${Date.now()}`,
        cityName: city.name,
        city_name: city.name,
        nights: 2,
        lat: Number(city.lat) || 0,
        lng: Number(city.lng) || 0,
      };
      setStops((prev) => [...prev, normalized]);
      setActiveStopId(normalized.id);
      addToast(`Added ${city.name} to stops!`, "success");
    } catch (err) {
      console.warn("Backend add stop failed, adding locally:", err);
      const localStop = {
        id: `stop_${Date.now()}`,
        stop_id: `stop_${Date.now()}`,
        cityName: city.name,
        city_name: city.name,
        nights: 2,
        lat: Number(city.lat) || 0,
        lng: Number(city.lng) || 0,
      };
      setStops((prev) => [...prev, localStop]);
      setActiveStopId(localStop.id);
      addToast(`Added ${city.name} to stops!`, "success");
    }
  };

  const handleReorderStops = async (orderedStopIds) => {
    const reordered = orderedStopIds
      .map((stopId) => stops.find((s) => String(s.id) === String(stopId)))
      .filter(Boolean);
    setStops(reordered);

    try {
      // Reorder on backend
      for (let i = 0; i < reordered.length; i++) {
        await stopsAPI.reorder(reordered[i].id, i + 1);
      }
    } catch {
      // Local reorder succeeds
    }
  };

  const handleDeleteStop = async (stopId) => {
    try {
      await stopsAPI.delete(stopId);
    } catch {
      // Local delete
    }
    const remaining = stops.filter((s) => String(s.id) !== String(stopId));
    setStops(remaining);
    setItems((prev) => prev.filter((i) => String(i.stopId) !== String(stopId)));

    if (String(activeStopId) === String(stopId)) {
      if (remaining.length > 0) setActiveStopId(remaining[0].id);
      else setActiveStopId(null);
    }
    addToast("Stop removed", "info");
  };

  // Handlers for Itinerary Items
  const handleOpenAddModal = () => {
    setEditingItemId(null);
    setItemTitle("");
    setItemCategory("Activity");
    setItemCost(50);
    setItemTime("10:00 AM");
    setItemLocation("");
    setItemDay("Day 1");
    setIsItemModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItemId(item.id);
    setItemTitle(item.title || item.custom_name || "");
    setItemCategory(item.category || "Activity");
    setItemCost(item.cost || 0);
    setItemTime(item.time || "10:00 AM");
    setItemLocation(item.location || "");
    setItemDay(item.day || "Day 1");
    setIsItemModalOpen(true);
  };

  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    if (!itemTitle.trim() || !activeStopId) {
      addToast("Please enter an activity title and select a stop", "error");
      return;
    }

    if (editingItemId) {
      // Edit existing item
      const updated = {
        title: itemTitle.trim(),
        custom_name: itemTitle.trim(),
        category: itemCategory,
        cost: Number(itemCost) || 0,
        time: itemTime,
        location: itemLocation,
        day: itemDay,
      };

      try {
        await itemsAPI.update(editingItemId, updated);
      } catch {
        // Local update
      }

      setItems((prev) =>
        prev.map((i) => (i.id === editingItemId ? { ...i, ...updated } : i))
      );
      addToast("Activity updated!", "success");
    } else {
      // Add new item
      const payload = {
        custom_name: itemTitle.trim(),
        category: itemCategory.toLowerCase(),
        cost: Number(itemCost) || 0,
        scheduled_time: itemTime.includes(":")
          ? itemTime.length === 5
            ? `${itemTime}:00`
            : itemTime.slice(0, 8)
          : "10:00:00",
        scheduled_date: trip?.start_date || new Date().toISOString().split("T")[0],
        duration_minutes: 60,
        notes: itemLocation || "",
      };

      try {
        const res = await itemsAPI.add(activeStopId, payload);
        const savedItem = res.item || res;
        const newItem = {
          ...savedItem,
          id: savedItem.id || `it_${Date.now()}`,
          stopId: activeStopId,
          title: itemTitle.trim(),
          category: itemCategory,
          cost: Number(itemCost) || 0,
          time: itemTime,
          location: itemLocation,
          day: itemDay,
          upvotes: 0,
          downvotes: 0,
        };
        setItems((prev) => [...prev, newItem]);
        addToast("Activity added successfully!", "success");
      } catch (err) {
        console.warn("Backend item add failed, adding locally:", err);
        const newItem = {
          id: `it_${Date.now()}`,
          stopId: activeStopId,
          title: itemTitle.trim(),
          category: itemCategory,
          cost: Number(itemCost) || 0,
          time: itemTime,
          location: itemLocation,
          day: itemDay,
          upvotes: 0,
          downvotes: 0,
        };
        setItems((prev) => [...prev, newItem]);
        addToast("Activity added!", "success");
      }
    }

    setItemTitle("");
    setItemLocation("");
    setIsItemModalOpen(false);
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
    const isUp = voteType === "up";
    try {
      await itemsAPI.vote(itemId, voteType);
    } catch {
      // Local fallback
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            upvotes: isUp ? (item.upvotes || 0) + 1 : item.upvotes || 0,
            downvotes: !isUp ? (item.downvotes || 0) + 1 : item.downvotes || 0,
            userVote: voteType,
          };
        }
        return item;
      })
    );
  };

  const activeStop = stops.find((s) => String(s.id) === String(activeStopId));
  const activeStopItems = items.filter((i) => String(i.stopId) === String(activeStopId));

  return (
    <div className="min-h-screen bg-[#071C1C] text-white font-sans overflow-x-hidden pb-16 select-none pt-[72px]">
      <PlaneCursor />

      {/* Top Action Header */}
      <div className="bg-slate-900/95 border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-[72px] z-30 backdrop-blur-xl">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/my-trips"
            className="text-zinc-400 hover:text-white text-xs font-bold whitespace-nowrap"
          >
            &larr; Back to Trips
          </Link>
          <span className="text-zinc-600">|</span>
          <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-tight truncate max-w-xs sm:max-w-md">
            {trip?.title || "Trip Builder"}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Socket Collaborator Presence */}
          <CollaboratorPresence collaborators={collaborators} />

          {/* Navigation Views */}
          <Link
            to={`/trips/${id}/timeline`}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>📅</span> Timeline
          </Link>

          <Link
            to={`/trips/${id}/map`}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>🗺️</span> Map
          </Link>

          <Link
            to={`/trips/${id}/conduct`}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>📢</span> Conductor View
          </Link>

          {/* AI Generator CTA */}
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
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
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL: ORDERED STOPS LIST (3 COLS) */}
          <div className="lg:col-span-3">
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
          <div className="lg:col-span-6 bg-slate-900/90 border border-white/10 rounded-2xl p-5 flex flex-col min-h-[580px] max-h-[720px] overflow-hidden text-left shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="min-w-0 flex-1 mr-2">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2 truncate">
                  <span>🏙️</span>
                  <span className="truncate">
                    {activeStop
                      ? `${activeStop.cityName || activeStop.city_name} Itinerary`
                      : "Select a Stop"}
                  </span>
                </h3>
                <span className="text-xs text-zinc-400 font-medium">
                  {activeStopItems.length} activities scheduled
                </span>
              </div>

              <RoleGate userRole={trip?.role} allowedRoles={["owner", "conductor", "editor"]}>
                <button
                  disabled={!activeStopId}
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-extrabold text-xs transition-all shadow cursor-pointer shrink-0"
                >
                  + Add Activity
                </button>
              </RoleGate>
            </div>

            {/* Itinerary Items List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {!activeStopId ? (
                <div className="text-center py-20 text-xs text-zinc-400">
                  Select a stop from the left panel to view and build its itinerary.
                </div>
              ) : activeStopItems.length === 0 ? (
                <div className="text-center py-20 text-xs text-zinc-400">
                  No itinerary items for this stop yet. Click &quot;+ Add Activity&quot; or &quot;Generate with AI&quot;!
                </div>
              ) : (
                activeStopItems.map((item) => (
                  <ItineraryItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => handleOpenEditModal(item)}
                    onDelete={handleDeleteItem}
                    onVote={handleVoteItem}
                  />
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL: LIVE BUDGET SUMMARY (3 COLS) */}
          <div className="lg:col-span-3">
            <BudgetSummaryPanel
              items={items}
              budgetCap={trip?.budget_cap || trip?.budgetCap || 2500}
            />
          </div>
        </main>
      )}

      {/* Add / Edit Itinerary Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left relative">
            <button
              onClick={() => setIsItemModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">
              {editingItemId ? "Edit Activity" : "Add Itinerary Activity"}
            </h3>

            <form onSubmit={handleAddItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scuba Diving or Museum Tour"
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
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
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
                    min="0"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={itemTime}
                    onChange={(e) => setItemTime(e.target.value)}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Day Slot
                  </label>
                  <select
                    value={itemDay}
                    onChange={(e) => setItemDay(e.target.value)}
                    className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
                  >
                    <option value="Day 1">Day 1</option>
                    <option value="Day 2">Day 2</option>
                    <option value="Day 3">Day 3</option>
                    <option value="Day 4">Day 4</option>
                    <option value="Day 5">Day 5</option>
                    <option value="Day 6">Day 6</option>
                    <option value="Day 7">Day 7</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Location / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Downtown Harbor Pier 3"
                  value={itemLocation}
                  onChange={(e) => setItemLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow cursor-pointer hover:scale-105 transition-all"
                >
                  {editingItemId ? "Save Changes" : "Add to Itinerary"}
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
          addToast("AI itinerary generated successfully!", "success");
          loadTripData();
        }}
      />
    </div>
  );
}
