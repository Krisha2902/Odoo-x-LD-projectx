import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import PlaneCursor from "../components/PlaneCursor";

export default function PlanTripPage() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("Bali, Indonesia");
  const [startDate, setStartDate] = useState("Oct 15, 2026");
  const [endDate, setEndDate] = useState("Oct 22, 2026");
  const [budget, setBudget] = useState(2500);
  const [travelers, setTravelers] = useState(2);
  const [selectedPreferences, setSelectedPreferences] = useState(["Beaches", "Food", "Culture"]);

  const [isGenerated, setIsGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

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

  const handleGenerate = (e) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setIsGenerated(true);
    }, 1200);
  };

  const generatedItinerary = [
    {
      day: "Day 1",
      title: "Arrival & Tropical Relaxation",
      activities: [
        { time: "10:00 AM", title: "Check-in at Oceanfront Villa", location: "Seminyak", cost: "$150" },
        { time: "01:00 PM", title: "Fresh Seafood Lunch", location: "Jimbaran Bay", cost: "$40" },
        { time: "05:30 PM", title: "Sunset Beach Walk & Cocktails", location: "Potato Head Beach Club", cost: "$60" },
      ],
    },
    {
      day: "Day 2",
      title: "Cultural Heart of Ubud",
      activities: [
        { time: "09:00 AM", title: "Monkey Forest Sanctuary Walk", location: "Ubud Center", cost: "$15" },
        { time: "01:00 PM", title: "Organic Farm-to-Table Lunch", location: "Ubud Hills", cost: "$35" },
        { time: "04:00 PM", title: "Tegallalang Rice Terrace Swing", location: "Tegallalang", cost: "$25" },
      ],
    },
    {
      day: "Day 3",
      title: "Island Hopping & Snorkeling",
      activities: [
        { time: "08:00 AM", title: "Speedboat to Nusa Penida", location: "Sanur Harbor", cost: "$30" },
        { time: "11:00 AM", title: "Kelingking Beach T-Rex Cliff View", location: "Nusa Penida", cost: "$10" },
        { time: "02:00 PM", title: "Crystal Bay Manta Ray Snorkeling", location: "Nusa Penida", cost: "$50" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#071C1C] text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 sm:px-12 pt-24">
        {!isGenerated ? (
          <div className="bg-[#0D2626] border border-[#5AD9BC]/20 rounded-3xl p-8 shadow-2xl text-left">
            <div className="border-b border-white/10 pb-4 mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-[#72F0D0] block mb-1">
                AI Travel Planner
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight">
                Plan Your Dream Trip
              </h1>
              <p className="text-xs text-zinc-400 font-medium">
                Enter your destination, dates, budget, and travel preferences to generate a custom itinerary.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where do you want to go?"
                  className="w-full bg-[#123131] border border-[#5AD9BC]/25 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Start Date
                  </label>
                  <input
                    type="text"
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
                    type="text"
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
                      <span>Generating Custom Itinerary...</span>
                    </>
                  ) : (
                    <>
                      <span>✨ Generate Trip Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-8 text-left">
            <div className="bg-[#0D2626] border border-[#42D6B5]/40 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                <div>
                  <span className="text-xs font-black text-[#72F0D0] uppercase tracking-widest block mb-1">
                    ✓ Custom AI Generated Itinerary
                  </span>
                  <h1 className="text-3xl font-black uppercase text-white tracking-tight">
                    {destination} Expedition
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium mt-1">
                    📅 {startDate} &mdash; {endDate} &bull; {travelers} Travelers &bull; ${budget} Budget
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsGenerated(false)}
                    className="px-5 py-2.5 rounded-full bg-[#123131] border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    ✏️ Edit Parameters
                  </button>

                  <button
                    onClick={() => navigate("/my-trips")}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase tracking-wider shadow transition-all cursor-pointer hover:scale-105"
                  >
                    💾 Save to My Trips
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {generatedItinerary.map((dayPlan) => (
                  <div key={dayPlan.day} className="bg-[#123131]/80 border border-white/10 rounded-2xl p-6 shadow">
                    <h3 className="text-base font-black text-[#72F0D0] uppercase tracking-wide mb-4">
                      {dayPlan.day}: {dayPlan.title}
                    </h3>
                    <div className="space-y-3">
                      {dayPlan.activities.map((act, i) => (
                        <div key={i} className="bg-[#071C1C] p-3.5 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-[#72F0D0] block mb-0.5">{act.time}</span>
                            <strong className="text-white font-bold">{act.title}</strong>
                            <span className="text-zinc-400 text-[11px] block">📍 {act.location}</span>
                          </div>
                          <span className="font-extrabold text-[#42D6B5]">{act.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
