import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PlaneCursor from "../components/PlaneCursor";

export default function MyTripsPage() {
  const [activeCategory, setActiveCategory] = useState("Upcoming");
  const navigate = useNavigate();

  // Trips categorized into Upcoming, Ongoing, Completed with background image carousels and poetic memory descriptions
  const tripsData = [
    {
      id: "trip_ongoing_1",
      status: "Ongoing",
      title: "Exploring Japan",
      memoryQuote: "Ten days of quiet mornings, crowded streets, unfamiliar flavors, and memories worth keeping.",
      dates: "20 Aug — 30 Aug 2026",
      currentDay: "Day 3 of 10",
      images: [
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "trip_upcoming_1",
      status: "Upcoming",
      title: "Ultimate Bali & Island Hopping",
      memoryQuote: "Emerald rice terraces, golden ocean sunsets, and tropical sea breeze awaiting your footsteps.",
      dates: "15 Oct — 22 Oct 2026",
      images: [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "trip_upcoming_2",
      status: "Upcoming",
      title: "Parisian Romance & Aegean Voyage",
      memoryQuote: "Cobblestone alleys of Montmartre meeting crystal dusk waters of Santorini cliffs.",
      dates: "01 Nov — 08 Nov 2026",
      images: [
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "trip_completed_1",
      status: "Completed",
      title: "Dubai Desert & Skyline Expedition",
      memoryQuote: "Golden sand dunes under starlit skies and modern architectural wonders in the clouds.",
      dates: "10 Jan — 18 Jan 2026",
      images: [
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ];

  // Auto-rotating Carousel Image Index per Trip Card
  const [carouselIndices, setCarouselIndices] = useState({
    trip_ongoing_1: 0,
    trip_upcoming_1: 0,
    trip_upcoming_2: 0,
    trip_completed_1: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndices((prev) => ({
        trip_ongoing_1: (prev.trip_ongoing_1 + 1) % 3,
        trip_upcoming_1: (prev.trip_upcoming_1 + 1) % 2,
        trip_upcoming_2: (prev.trip_upcoming_2 + 1) % 2,
        trip_completed_1: 0,
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const filteredTrips = tripsData.filter((t) => t.status === activeCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6 text-left">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              My Travel Memories &amp; Trips
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              View your upcoming adventures, live ongoing travels, and cherished past trip memories.
            </p>
          </div>

          <Link
            to="/plan-trip"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0096B4] to-cyan-400 hover:from-[#00819C] hover:to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center gap-2 border border-white/20"
          >
            <span className="text-base font-black">+</span>
            <span>Plan New Trip</span>
          </Link>
        </div>

        {/* Category Tabs: Upcoming | Ongoing | Completed */}
        <div className="flex justify-start gap-3 mb-8">
          {["Upcoming", "Ongoing", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === tab
                  ? "bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                  : "bg-slate-900 border border-white/15 text-zinc-400 hover:text-white"
              }`}
            >
              {tab} ({tripsData.filter((t) => t.status === tab).length})
            </button>
          ))}
        </div>

        {/* Trips Cards Grid with Image Carousel & Poetic Memory Descriptions */}
        <div className="space-y-8">
          {filteredTrips.length === 0 ? (
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-12 text-center max-w-md mx-auto">
              <span className="text-4xl block mb-3">🧳</span>
              <h3 className="text-lg font-bold text-white mb-1">No {activeCategory} Trips</h3>
              <p className="text-xs text-zinc-400 mb-6">Start planning a new trip to build your itinerary!</p>
              <Link
                to="/plan-trip"
                className="px-6 py-2.5 rounded-full bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider"
              >
                + Plan a Trip
              </Link>
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const currentImgIdx = carouselIndices[trip.id] || 0;
              const currentImg = trip.images[currentImgIdx] || trip.images[0];

              return (
                <div
                  key={trip.id}
                  className="group relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl min-h-[340px] flex flex-col justify-end p-8 text-left transition-all duration-500 hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(0,212,255,0.3)]"
                >
                  {/* Background Image Carousel */}
                  <div className="absolute inset-0 -z-10 overflow-hidden">
                    <img
                      src={currentImg}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-all duration-1000 transform scale-105 group-hover:scale-110 brightness-65"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span
                      className={`px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                        trip.status === "Ongoing"
                          ? "bg-emerald-500/90 text-slate-950 border-emerald-400 animate-pulse"
                          : trip.status === "Upcoming"
                          ? "bg-cyan-500/90 text-slate-950 border-cyan-400"
                          : "bg-slate-800/90 text-zinc-300 border-white/20"
                      }`}
                    >
                      {trip.status === "Ongoing" ? `● Live: ${trip.currentDay}` : trip.status}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-full border border-white/20">
                      📅 {trip.dates}
                    </span>
                  </div>

                  {/* Trip Memory Title & Description */}
                  <div className="max-w-2xl z-10">
                    <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-cyan-300 transition-colors">
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
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
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
