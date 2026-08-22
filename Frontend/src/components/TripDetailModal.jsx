import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";

export default function TripDetailModal({ tripId, onClose }) {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New Stop Form State
  const [showAddStop, setShowAddStop] = useState(false);
  const [cityId, setCityId] = useState(1);
  const [stopStartDate, setStopStartDate] = useState("");
  const [stopEndDate, setStopEndDate] = useState("");
  const [submittingStop, setSubmittingStop] = useState(false);

  // New Item Form State (keyed by stopId)
  const [activeItemStopId, setActiveItemStopId] = useState(null);
  const [itemCategory, setItemCategory] = useState("activity");
  const [customName, setCustomName] = useState("");
  const [itemCost, setItemCost] = useState(0);
  const [itemDate, setItemDate] = useState("");
  const [itemTime, setItemTime] = useState("");
  const [itemNotes, setItemNotes] = useState("");
  const [submittingItem, setSubmittingItem] = useState(false);

  const fetchFullTrip = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get(`/trips/${tripId}/full`);
      setTripData(res.trip);
    } catch (err) {
      setError(err.message || "Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) fetchFullTrip();
  }, [tripId]);

  const handleAddStop = async (e) => {
    e.preventDefault();
    setSubmittingStop(true);
    try {
      const orderIndex = (tripData?.stops?.length || 0) + 1;
      await apiClient.post(`/trips/${tripId}/stops`, {
        city_id: parseInt(cityId, 10),
        order_index: orderIndex,
        start_date: stopStartDate,
        end_date: stopEndDate,
      });
      setShowAddStop(false);
      setStopStartDate("");
      setStopEndDate("");
      fetchFullTrip();
    } catch (err) {
      alert(err.message || "Failed to add stop");
    } finally {
      setSubmittingStop(false);
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm("Are you sure you want to delete this city stop?")) return;
    try {
      await apiClient.del(`/stops/${stopId}`);
      fetchFullTrip();
    } catch (err) {
      alert(err.message || "Failed to delete stop");
    }
  };

  const handleAddItem = async (e, stopId) => {
    e.preventDefault();
    setSubmittingItem(true);
    try {
      await apiClient.post(`/stops/${stopId}/items`, {
        category: itemCategory,
        custom_name: customName || "New Activity",
        cost: parseFloat(itemCost) || 0,
        scheduled_date: itemDate || undefined,
        scheduled_time: itemTime ? `${itemTime}:00` : undefined,
        notes: itemNotes || undefined,
      });
      setActiveItemStopId(null);
      setCustomName("");
      setItemCost(0);
      setItemNotes("");
      fetchFullTrip();
    } catch (err) {
      alert(err.message || "Failed to add itinerary item");
    } finally {
      setSubmittingItem(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await apiClient.del(`/items/${itemId}`);
      fetchFullTrip();
    } catch (err) {
      alert(err.message || "Failed to delete item");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-white/80 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black">{tripData?.title || "Trip Details"}</h2>
              {tripData?.role && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {tripData.role}
                </span>
              )}
            </div>
            {tripData && (
              <p className="text-xs text-zinc-300 mt-1">
                {tripData.start_date} &rarr; {tripData.end_date}
                {tripData.budget_cap ? ` • Budget Cap: $${tripData.budget_cap}` : ""}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
              <svg className="w-8 h-8 animate-spin text-[#0096B4] mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-xs font-semibold">Hydrating trip itinerary...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs text-center border border-red-200">
              {error}
            </div>
          ) : (
            <>
              {/* Trip Description */}
              {tripData?.description && (
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/80 text-xs text-zinc-700">
                  <strong className="text-zinc-900 block mb-1">Description:</strong>
                  {tripData.description}
                </div>
              )}

              {/* Stops Header */}
              <div className="flex items-center justify-between pt-2 border-b border-zinc-200 pb-3">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                  <span>📍 Destination Stops</span>
                  <span className="text-xs font-normal text-zinc-500">({tripData?.stops?.length || 0})</span>
                </h3>
                <button
                  onClick={() => setShowAddStop(!showAddStop)}
                  className="px-3 py-1.5 bg-[#0096B4] hover:bg-[#00819C] text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{showAddStop ? "Cancel" : "+ Add Stop"}</span>
                </button>
              </div>

              {/* Add Stop Form */}
              {showAddStop && (
                <form onSubmit={handleAddStop} className="bg-cyan-50/60 border border-cyan-200 p-4 rounded-xl space-y-3 animate-fade-in-up">
                  <h4 className="text-xs font-bold text-cyan-900">Add City Stop</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-600 uppercase block mb-1">City</label>
                      <select
                        value={cityId}
                        onChange={(e) => setCityId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                      >
                        <option value="1">Tokyo (Japan)</option>
                        <option value="2">Paris (France)</option>
                        <option value="3">New York (USA)</option>
                        <option value="4">Rome (Italy)</option>
                        <option value="5">London (UK)</option>
                        <option value="6">Barcelona (Spain)</option>
                        <option value="7">Dubai (UAE)</option>
                        <option value="8">Singapore</option>
                        <option value="9">Amsterdam</option>
                        <option value="10">Seoul</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-600 uppercase block mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={stopStartDate}
                        onChange={(e) => setStopStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-600 uppercase block mb-1">End Date</label>
                      <input
                        type="date"
                        required
                        value={stopEndDate}
                        onChange={(e) => setStopEndDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingStop}
                    className="px-4 py-2 bg-[#0096B4] text-white text-xs font-bold rounded-lg shadow hover:bg-[#00819C] cursor-pointer disabled:opacity-50"
                  >
                    {submittingStop ? "Adding..." : "Save Stop"}
                  </button>
                </form>
              )}

              {/* Stops List */}
              {tripData?.stops?.length === 0 ? (
                <div className="text-center py-10 bg-zinc-50 rounded-xl border border-dashed border-zinc-300 text-zinc-500 text-xs">
                  No stops added yet. Click <strong>+ Add Stop</strong> above to add destination cities!
                </div>
              ) : (
                <div className="space-y-6">
                  {tripData?.stops?.map((stop, index) => (
                    <div
                      key={stop.stop_id}
                      className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-cyan-300 transition-colors"
                    >
                      {/* Stop Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-cyan-100 text-[#0096B4] font-black text-xs flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <div>
                            <h4 className="font-extrabold text-sm text-zinc-900">
                              {stop.city_name}, {stop.city_country}
                            </h4>
                            <p className="text-[11px] text-zinc-500">
                              {stop.stop_start_date} to {stop.stop_end_date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveItemStopId(activeItemStopId === stop.stop_id ? null : stop.stop_id)}
                            className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-md cursor-pointer"
                          >
                            {activeItemStopId === stop.stop_id ? "Close Form" : "+ Add Activity"}
                          </button>
                          <button
                            onClick={() => handleDeleteStop(stop.stop_id)}
                            className="p-1 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Stop"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Add Item Form for this Stop */}
                      {activeItemStopId === stop.stop_id && (
                        <form
                          onSubmit={(e) => handleAddItem(e, stop.stop_id)}
                          className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3 animate-fade-in-up"
                        >
                          <h5 className="text-xs font-bold text-zinc-800">New Activity for {stop.city_name}</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Activity Name (e.g. Visit Eiffel Tower)"
                              value={customName}
                              onChange={(e) => setCustomName(e.target.value)}
                              className="px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs"
                            />
                            <select
                              value={itemCategory}
                              onChange={(e) => setItemCategory(e.target.value)}
                              className="px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs"
                            >
                              <option value="activity">🎟️ Activity</option>
                              <option value="food">🍽️ Food / Dining</option>
                              <option value="transport">🚕 Transport</option>
                              <option value="accommodation">🏨 Accommodation</option>
                              <option value="other">📍 Other</option>
                            </select>
                            <input
                              type="number"
                              placeholder="Cost ($)"
                              value={itemCost}
                              onChange={(e) => setItemCost(e.target.value)}
                              className="px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={itemDate}
                              onChange={(e) => setItemDate(e.target.value)}
                              className="px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs"
                            />
                            <input
                              type="time"
                              value={itemTime}
                              onChange={(e) => setItemTime(e.target.value)}
                              className="px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={submittingItem}
                            className="px-3 py-1.5 bg-[#0096B4] text-white text-xs font-bold rounded shadow hover:bg-[#00819C] cursor-pointer disabled:opacity-50"
                          >
                            {submittingItem ? "Adding..." : "Add to Itinerary"}
                          </button>
                        </form>
                      )}

                      {/* Items List */}
                      {stop.items?.length === 0 ? (
                        <p className="text-[11px] text-zinc-400 italic">No activities added for this stop yet.</p>
                      ) : (
                        <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-lg overflow-hidden">
                          {stop.items.map((item) => (
                            <div key={item.id} className="p-3 bg-zinc-50/50 hover:bg-cyan-50/30 flex items-center justify-between transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="text-base">
                                  {item.category === "food" ? "🍽️" : item.category === "transport" ? "🚕" : item.category === "accommodation" ? "🏨" : "🎟️"}
                                </span>
                                <div>
                                  <h5 className="font-bold text-xs text-zinc-800">{item.custom_name || "Activity"}</h5>
                                  <p className="text-[10px] text-zinc-500">
                                    {item.scheduled_date ? item.scheduled_date : ""} {item.scheduled_time ? `@ ${item.scheduled_time}` : ""}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-extrabold text-emerald-600">
                                  ${parseFloat(item.cost || 0).toFixed(2)}
                                </span>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
