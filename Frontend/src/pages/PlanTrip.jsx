import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import PlaneCursor from "../components/PlaneCursor";
import VoteControl from "../components/VoteControl";
import { apiClient } from "../api/client";
import { tripsAPI, stopsAPI, itemsAPI } from "../services/api";

// Known global landmark places database for instant high-accuracy fallback generation
const CITY_LANDMARKS_DATABASE = {
  bali: [
    { time: "09:00 AM", title: "Tegallalang Rice Terrace & Jungle Swing", location: "Ubud, Bali", costRatio: 0.05, category: "nature", duration: 120, notes: "Walk through emerald rice paddies and enjoy scenic photos." },
    { time: "01:00 PM", title: "Organic Farm-to-Table Lunch at Sacred Valley", location: "Ubud Hills", costRatio: 0.04, category: "food", duration: 90, notes: "Sample fresh Balinese sambal and organic coconut curries." },
    { time: "05:30 PM", title: "Uluwatu Sunset Temple & Kecak Fire Dance", location: "Uluwatu Cliff", costRatio: 0.06, category: "culture", duration: 150, notes: "Watch dramatic cliffside sunsets with traditional choral dance." },
    { time: "09:00 AM", title: "Nusa Penida Manta Ray Snorkeling & Kelingking Cliff", location: "Nusa Penida Island", costRatio: 0.09, category: "adventure", duration: 240, notes: "Speedboat excursion to T-Rex viewpoint and coral reef snorkeling." },
    { time: "06:30 PM", title: "Jimbaran Bay Candlelight Seafood Feast", location: "Jimbaran Beach", costRatio: 0.08, category: "food", duration: 120, notes: "Dine on grilled snapper and prawns directly on the sand." },
  ],
  tokyo: [
    { time: "08:30 AM", title: "Tsukiji Outer Market Food & Sushi Tasting", location: "Tsukiji, Tokyo", costRatio: 0.06, category: "food", duration: 120, notes: "Taste fresh tamagoyaki, wagyu skewers, and tuna sashimi." },
    { time: "01:00 PM", title: "TeamLab Planets Immersive Digital Art Museum", location: "Toyosu, Tokyo", costRatio: 0.08, category: "culture", duration: 150, notes: "Walk barefoot through digital water gardens and crystal lights." },
    { time: "05:30 PM", title: "Shibuya Crossing & Shibuya Sky Observation Deck", location: "Shibuya, Tokyo", costRatio: 0.05, category: "landmark", duration: 120, notes: "Panoramic 360-degree dusk views over the world's busiest intersection." },
    { time: "10:00 AM", title: "Asakusa Senso-ji Temple & Nakamise Shopping Street", location: "Asakusa, Tokyo", costRatio: 0.04, category: "culture", duration: 120, notes: "Tokyo's oldest buddhist temple and traditional souvenir stalls." },
    { time: "07:00 PM", title: "Shinjuku Omoide Yokocho Yakitori & Ramen Crawl", location: "Shinjuku, Tokyo", costRatio: 0.05, category: "food", duration: 150, notes: "Historic narrow alleys with smoky yakitori stalls and local craft beers." },
  ],
  paris: [
    { time: "09:00 AM", title: "Louvre Museum Guided Masterpieces Tour", location: "1st Arrondissement, Paris", costRatio: 0.08, category: "culture", duration: 180, notes: "See Mona Lisa, Venus de Milo, and French Renaissance galleries." },
    { time: "01:30 PM", title: "Montmartre Artist Quarter & Sacré-Cœur Basilica", location: "Montmartre, Paris", costRatio: 0.04, category: "culture", duration: 150, notes: "Cobblestone streets, Bohemian cafes, and panoramic hill city views." },
    { time: "06:00 PM", title: "Seine River Sunset Cruise & Eiffel Tower Illuminations", location: "Eiffel Tower Pier", costRatio: 0.07, category: "landmark", duration: 120, notes: "Glide past Notre Dame and Pont Neuf under sparkling evening lights." },
    { time: "10:00 AM", title: "Le Marais Croissant & Patisserie Tasting Walk", location: "Le Marais, Paris", costRatio: 0.05, category: "food", duration: 120, notes: "Sample fresh butter croissants, macarons, and artisanal cheeses." },
  ],
  amdavad: [
    { time: "08:30 AM", title: "Sabarmati Ashram Heritage Walk", location: "Sabarmati, Ahmedabad", costRatio: 0.03, category: "culture", duration: 120, notes: "Explore Mahatma Gandhi's historic riverside home and museum." },
    { time: "01:00 PM", title: "Authentic Gujarati Thali Lunch at Agashiye", location: "The House of MG", costRatio: 0.07, category: "food", duration: 90, notes: "Savor a royal rooftop silver-plater vegetarian feast." },
    { time: "04:30 PM", title: "Adalaj Stepwell Architectural Wonder", location: "Adalaj, Ahmedabad", costRatio: 0.04, category: "landmark", duration: 90, notes: "Marvel at intricate 15th-century Indo-Islamic subterranean stone carvings." },
    { time: "08:00 PM", title: "Manek Chowk Midnight Street Food & Fafda Crawl", location: "Old City, Ahmedabad", costRatio: 0.04, category: "food", duration: 120, notes: "Taste local street delicacies like pav bhaji and chocolate sandwich ice cream." },
  ],
};

export default function PlanTripPage() {
  const navigate = useNavigate();

  const [startingLocation, setStartingLocation] = useState("Surat, India");
  const [destination, setDestination] = useState("Amdavad");
  const [startDate, setStartDate] = useState("2026-09-15");
  const [endDate, setEndDate] = useState("2026-09-18");
  const [budget, setBudget] = useState(1500);
  const [travelers, setTravelers] = useState(2);
  const [selectedPreferences, setSelectedPreferences] = useState(["Culture & History", "Food & Dining"]);

  const [isGenerated, setIsGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState([]);
  const [createdTripId, setCreatedTripId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [votesState, setVotesState] = useState({});

  const preferencesList = [
    "Beaches",
    "Adventure",
    "Food & Dining",
    "Nature",
    "Culture & History",
    "Relaxation",
    "Shopping",
    "Nightlife",
  ];

  const togglePreference = (pref) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleVote = async (itemId, voteType) => {
    setVotesState((prev) => {
      const current = prev[itemId] || { upvotes: 2, downvotes: 0, userVote: null };
      let newUp = current.upvotes;
      let newDown = current.downvotes;

      if (current.userVote === voteType) {
        if (voteType === "up") newUp -= 1;
        if (voteType === "down") newDown -= 1;
        return { ...prev, [itemId]: { upvotes: Math.max(0, newUp), downvotes: Math.max(0, newDown), userVote: null } };
      }

      if (current.userVote === "up") newUp -= 1;
      if (current.userVote === "down") newDown -= 1;

      if (voteType === "up") newUp += 1;
      if (voteType === "down") newDown += 1;

      return {
        ...prev,
        [itemId]: { upvotes: Math.max(0, newUp), downvotes: Math.max(0, newDown), userVote: voteType },
      };
    });

    try {
      if (typeof itemId === "number" || (typeof itemId === "string" && !itemId.startsWith("dyn"))) {
        const res = await itemsAPI.vote(itemId, voteType);
        if (res?.summary) {
          setVotesState((prev) => ({
            ...prev,
            [itemId]: {
              upvotes: res.summary.upvotes,
              downvotes: res.summary.downvotes,
              userVote: voteType,
            },
          }));
        }
      }
    } catch (err) {
      console.warn("Backend vote connection error:", err.message);
    }
  };

  const buildDynamicPlaces = (origin, dest, prefs, budgetVal) => {
    const destClean = dest.trim();
    const destKey = destClean.toLowerCase().split(",")[0].trim();
    const knownPlaces = CITY_LANDMARKS_DATABASE[destKey] || CITY_LANDMARKS_DATABASE["amdavad"];

    const parsedBudget = Number(budgetVal) || 1500;
    const baseCost = Math.round(parsedBudget / 20);

    const day1Activities = [
      {
        id: `dyn-${Date.now()}-1`,
        time: "08:00 AM",
        title: `Departure Express Transit from ${origin}`,
        location: `${origin} Station / Hub`,
        cost: Math.round(parsedBudget * 0.1),
        category: "transport",
        duration: 180,
        notes: `Board morning transit heading to ${destClean}.`,
      },
      {
        id: `dyn-${Date.now()}-2`,
        time: "12:30 PM",
        title: `Hotel Check-in & Refresh in ${destClean}`,
        location: `${destClean} Central Hotel`,
        cost: Math.round(parsedBudget * 0.15),
        category: "accommodation",
        duration: 90,
        notes: `Check-in and unpack bags.`,
      },
    ];

    if (knownPlaces && knownPlaces.length > 0) {
      day1Activities.push({
        id: `dyn-${Date.now()}-3`,
        time: knownPlaces[0].time,
        title: knownPlaces[0].title,
        location: knownPlaces[0].location,
        cost: Math.round(parsedBudget * (knownPlaces[0].costRatio || 0.05)),
        category: knownPlaces[0].category,
        duration: knownPlaces[0].duration,
        notes: knownPlaces[0].notes,
      });
    }

    const day2Activities = [];
    if (knownPlaces && knownPlaces.length > 2) {
      for (let i = 1; i < Math.min(knownPlaces.length, 4); i++) {
        day2Activities.push({
          id: `dyn-${Date.now()}-act-${i}`,
          time: knownPlaces[i].time,
          title: knownPlaces[i].title,
          location: knownPlaces[i].location,
          cost: Math.round(parsedBudget * (knownPlaces[i].costRatio || 0.05)),
          category: knownPlaces[i].category,
          duration: knownPlaces[i].duration,
          notes: knownPlaces[i].notes,
        });
      }
    }

    const day3Activities = [
      {
        id: `dyn-${Date.now()}-7`,
        time: "10:00 AM",
        title: `Local Souvenir Markets & Specialty Shopping`,
        location: `${destClean} Central Bazaar`,
        cost: Math.round(baseCost * 1.1),
        category: "shopping",
        duration: 120,
        notes: `Pick up traditional crafts and local items before departure.`,
      },
      {
        id: `dyn-${Date.now()}-8`,
        time: "04:00 PM",
        title: `Return Transit Back to ${origin}`,
        location: `${destClean} Station / Airport`,
        cost: Math.round(parsedBudget * 0.1),
        category: "transport",
        duration: 180,
        notes: `Board return journey back home to ${origin}.`,
      },
    ];

    return [
      {
        day: "Day 1",
        title: `Journey & Arrival in ${destClean}`,
        activities: day1Activities,
      },
      {
        day: "Day 2",
        title: `Immersive Exploration & Highlights`,
        activities: day2Activities,
      },
      {
        day: "Day 3",
        title: `Shopping & Return Route`,
        activities: day3Activities,
      },
    ];
  };

  // Full Backend API Sequence Integration
  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setErrorMsg("");

    try {
      // Step 1: Create the trip record
      const tripRes = await tripsAPI.create({
        title: `${startingLocation} to ${destination} Expedition`,
        start_date: startDate,
        end_date: endDate,
        budget_cap: Number(budget),
      });

      const tripId = tripRes?.trip?.id || tripRes?.id;
      if (tripId) setCreatedTripId(tripId);

      // Step 2: Add Origin & Destination stops using dynamic city_name
      if (tripId) {
        try {
          await stopsAPI.add(tripId, {
            city_name: startingLocation,
            order_index: 0,
            start_date: startDate,
            end_date: startDate,
          });

          await stopsAPI.add(tripId, {
            city_name: destination,
            order_index: 1,
            start_date: startDate,
            end_date: endDate,
          });
        } catch (stopErr) {
          console.warn("Stops creation notice:", stopErr.message);
        }

        // Step 3: Trigger Gemini AI Generation endpoint
        try {
          const aiRes = await apiClient.post(`/trips/${tripId}/generate`, {
            interests: selectedPreferences,
            pace: selectedPreferences.includes("Adventure") ? "packed" : "relaxed",
            budgetTier: budget > 2500 ? "luxury" : budget > 1000 ? "moderate" : "budget",
          });

          const items = aiRes?.generated_items || aiRes?.items || aiRes;
          if (Array.isArray(items) && items.length > 0) {
            setGeneratedItinerary(items);
            setIsGenerated(true);
            setGenerating(false);
            return;
          }
        } catch (aiErr) {
          console.warn("Backend AI generation fallback triggered:", aiErr.message);
        }
      }

      throw new Error("Using fallback procedural generator");
    } catch (err) {
      console.warn("Using local procedural generation for UI rendering:", err.message);
      const dynamicItinerary = buildDynamicPlaces(
        startingLocation,
        destination,
        selectedPreferences,
        budget
      );
      setGeneratedItinerary(dynamicItinerary);
      setIsGenerated(true);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTrip = async () => {
    navigate("/my-trips");
  };

  const renderItineraryDays = () => {
    if (!generatedItinerary || generatedItinerary.length === 0) return null;

    if (generatedItinerary[0]?.activities) {
      return generatedItinerary.map((dayPlan, idx) => (
        <div key={dayPlan.day || idx} className="bg-[#123131]/90 border border-[#5AD9BC]/25 rounded-2xl p-6 shadow-xl text-left space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-black text-[#72F0D0] uppercase tracking-wide">
              {dayPlan.day || `Day ${idx + 1}`}: {dayPlan.title}
            </h3>
            <span className="text-xs font-bold text-zinc-400">
              {dayPlan.activities.length} Places Planned
            </span>
          </div>

          <div className="space-y-3">
            {dayPlan.activities.map((act, i) => {
              const actId = act.id || `act-${idx}-${i}`;
              const voteInfo = votesState[actId] || { upvotes: 2 + i, downvotes: 0, userVote: null };

              return (
                <div key={actId} className="bg-[#071C1C] border border-[#5AD9BC]/15 hover:border-[#42D6B5]/40 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-all">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#42D6B5]/20 text-[#72F0D0] font-black text-[10px] uppercase border border-[#42D6B5]/30">
                        {act.category || "Place"}
                      </span>
                      <span className="font-bold text-[#72F0D0]">{act.time || "10:00 AM"}</span>
                      {act.duration && (
                        <span className="text-zinc-500 text-[10px]">⏱️ {act.duration} mins</span>
                      )}
                    </div>
                    <strong className="text-white font-bold text-sm block">{act.title || act.custom_name}</strong>
                    <span className="text-zinc-400 text-xs block">📍 {act.location || destination}</span>
                    {act.notes && (
                      <p className="text-zinc-300 text-[11px] italic bg-[#123131] p-2 rounded-lg mt-2">
                        &quot;{act.notes}&quot;
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-4">
                    <VoteControl
                      upvotes={voteInfo.upvotes}
                      downvotes={voteInfo.downvotes}
                      userVote={voteInfo.userVote}
                      onVote={(voteType) => handleVote(actId, voteType)}
                    />
                    <span className="font-black text-[#42D6B5] text-base block">
                      {typeof act.cost === "number" ? `$${act.cost}` : act.cost || "$25"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ));
    }

    return (
      <div className="bg-[#123131]/90 border border-[#5AD9BC]/25 rounded-2xl p-6 shadow-xl text-left space-y-4">
        <h3 className="text-base font-black text-[#72F0D0] uppercase tracking-wide mb-4">
          Generated AI Recommended Places & Itinerary
        </h3>
        <div className="space-y-3">
          {generatedItinerary.map((item, i) => {
            const itemId = item.id || `item-${i}`;
            const voteInfo = votesState[itemId] || { upvotes: 3 + i, downvotes: 0, userVote: null };

            return (
              <div key={itemId} className="bg-[#071C1C] border border-[#5AD9BC]/15 hover:border-[#42D6B5]/40 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-all">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#42D6B5]/20 text-[#72F0D0] font-black text-[10px] uppercase border border-[#42D6B5]/30">
                      {item.category || "Spot"}
                    </span>
                    <span className="font-bold text-[#72F0D0]">{item.scheduled_time || "09:00 AM"}</span>
                    {item.duration_minutes && (
                      <span className="text-zinc-500 text-[10px]">⏱️ {item.duration_minutes} mins</span>
                    )}
                  </div>
                  <strong className="text-white font-bold text-sm block">{item.custom_name}</strong>
                  {item.notes && (
                    <p className="text-zinc-300 text-[11px] italic bg-[#123131] p-2 rounded-lg mt-1">
                      &quot;{item.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-4">
                  <VoteControl
                    upvotes={voteInfo.upvotes}
                    downvotes={voteInfo.downvotes}
                    userVote={voteInfo.userVote}
                    onVote={(voteType) => handleVote(itemId, voteType)}
                  />
                  <span className="font-black text-[#42D6B5] text-base block">
                    {typeof item.cost === "number" ? `$${item.cost}` : item.cost || "$30"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#071C1C] text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 sm:px-12 pt-24 text-left">
        {!isGenerated ? (
          <div className="bg-[#0D2626] border border-[#5AD9BC]/20 rounded-3xl p-8 shadow-2xl">
            <div className="border-b border-white/10 pb-4 mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-[#72F0D0] block mb-1">
                AI Dynamic Route & Places Generator
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight">
                Plan Your Journey
              </h1>
              <p className="text-xs text-zinc-400 font-medium">
                Enter your starting origin, destination city, budget, and preferences to build a real-time custom itinerary.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Starting Location (Origin) *
                  </label>
                  <input
                    type="text"
                    required
                    value={startingLocation}
                    onChange={(e) => setStartingLocation(e.target.value)}
                    placeholder="e.g. Surat, Mumbai"
                    className="w-full bg-[#123131] border border-[#5AD9BC]/25 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Destination Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Amdavad, Tokyo, Paris"
                    className="w-full bg-[#123131] border border-[#5AD9BC]/25 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#123131] border border-[#5AD9BC]/25 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#123131] border border-[#5AD9BC]/25 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Approx. Budget ($)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-[#123131] border border-[#5AD9BC]/25 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Number of Travelers
                </label>
                <div className="flex items-center gap-4">
                  {[1, 2, 3, 4, "5+"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTravelers(num)}
                      className={`w-12 h-12 rounded-2xl font-black text-sm transition-all cursor-pointer ${
                        travelers === num
                          ? "bg-[#20C9B0] text-[#063D3A] shadow-lg scale-105"
                          : "bg-[#123131] border border-[#5AD9BC]/20 text-zinc-300 hover:bg-[#1a4242]"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Trip Preferences
                </label>
                <div className="flex flex-wrap gap-2">
                  {preferencesList.map((pref) => {
                    const isSelected = selectedPreferences.includes(pref);
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => togglePreference(pref)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#20C9B0] text-[#063D3A] shadow"
                            : "bg-[#123131] border border-[#5AD9BC]/20 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={generating}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] text-[#063D3A] font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2 hover:scale-105"
                >
                  {generating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#063D3A] border-t-transparent rounded-full animate-spin" />
                      <span>Generating Custom Route & Places...</span>
                    </>
                  ) : (
                    <>
                      <span>✨ Generate Route & Places</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-[#0D2626] border border-[#42D6B5]/40 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                <div>
                  <span className="text-xs font-black text-[#72F0D0] uppercase tracking-widest block mb-1">
                    ✓ Route: {startingLocation} &rarr; {destination}
                  </span>
                  <h1 className="text-3xl font-black uppercase text-white tracking-tight">
                    {startingLocation} to {destination} Expedition
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium mt-1">
                    📅 {startDate} &mdash; {endDate} &bull; {travelers} Travelers &bull; ${budget} Budget Cap
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsGenerated(false)}
                    className="px-5 py-2.5 rounded-full bg-[#123131] border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    ✏️ Edit Route
                  </button>

                  <button
                    onClick={handleSaveTrip}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase tracking-wider shadow transition-all cursor-pointer hover:scale-105"
                  >
                    💾 Save to My Trips
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {renderItineraryDays()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}