import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar/Navbar";
import PlaneCursor from "../components/PlaneCursor";
import { exploreAPI, catalogAPI, userAPI } from "../services/api";

export default function ExplorePage() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState({});
  const [selectedDetailModal, setSelectedDetailModal] = useState(null);

  const fetchExploreFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tripsRes, citiesRes] = await Promise.all([
        exploreAPI.getPublicTrips().catch(() => ({ trips: [] })),
        catalogAPI.getDestinations().catch(() => ({ cities: [] })),
      ]);

      const publicTrips = tripsRes.trips || tripsRes || [];
      const cities = citiesRes.cities || citiesRes || [];

      // Combine public trips and cities into destination showcase list
      const combined = [
        ...publicTrips.map((t, idx) => ({
          id: `trip-${t.id || idx}`,
          title: t.title ? t.title.toUpperCase() : "EXPLORE DESTINATION",
          country: "GLOBAL",
          tag: `📍 ${t.title || "FEATURED TRIP"}`,
          rating: "4.95 ⭐",
          desc: t.description || "Discover exotic locations, curated travel stops, and local culture with community itineraries.",
          bgImage:
            t.cover_image_url ||
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80",
        })),
        ...cities.map((c, idx) => ({
          id: `city-${c.id || idx}`,
          title: (c.name || "DESTINATION").toUpperCase(),
          country: (c.country || "WORLD").toUpperCase(),
          tag: `📍 ${c.name || "GLOBAL"} • ${(c.country || "WORLD").toUpperCase()}`,
          rating: "4.90 ⭐",
          desc: c.description || "Lush scenic views, rich historical landmarks, traditional dining, and unforgettable experiences.",
          bgImage:
            c.image ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
        })),
      ];

      // Fallback default list if backend is sparse
      const fallbackList = [
        {
          id: "dest-1",
          title: "BALI",
          country: "INDONESIA",
          tag: "📍 BALI • SOUTHEAST ASIA",
          rating: "4.95 ⭐",
          desc: "Immerse yourself in lush terraced rice fields, ancient sea temples, turquoise ocean waves, and spiritual wellness retreats.",
          bgImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80",
        },
        {
          id: "dest-2",
          title: "THAILAND",
          country: "ASIA",
          tag: "📍 PHUKET • THAILAND",
          rating: "4.92 ⭐",
          desc: "Discover dramatic limestone karsts rising out of emerald Andaman waters, vibrant street night markets, and golden Buddhist pagodas.",
          bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
        },
        {
          id: "dest-3",
          title: "SWITZERLAND",
          country: "EUROPE",
          tag: "📍 SWISS ALPS • EUROPE",
          rating: "4.96 ⭐",
          desc: "Soak in panoramic snow-capped Matterhorn views, glacial lakes, world-class alpine skiing, and luxury mountain railways.",
          bgImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80",
        },
      ];

      setDestinations(combined.length > 0 ? combined : fallbackList);
    } catch (err) {
      console.error("Explore feed fetch error:", err);
      setError("Unable to load community explore feed.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchExploreFeed().then(() => {
      if (!isMounted) return;
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeDest = destinations[activeIndex] || destinations[0];

  const handleNext = () => {
    if (destinations.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % destinations.length);
  };

  const handlePrev = () => {
    if (destinations.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [destinations.length]);

  return (
    <div className="relative min-h-screen w-full bg-[#071C1C] text-white font-sans overflow-hidden select-none">
      <PlaneCursor />

      {/* FULL-SCREEN CINEMATIC HERO BACKDROP CROSSFADE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {activeDest && (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeDest.id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img
                src={activeDest.bgImage}
                alt={activeDest.title}
                className="w-full h-full object-cover brightness-65"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071C1C] via-[#071C1C]/40 to-[#071C1C]/70" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071C1C]/90 via-[#071C1C]/40 to-transparent" />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* MAIN CAROUSEL CONTENT CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 min-h-[calc(100vh-80px)] flex flex-col justify-between pt-24 pb-12">
        {/* TOP SUB-HEADER BAR */}
        <div className="flex items-center justify-between">
          {error && (
            <div className="flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <span>⚠️ {error}</span>
              <button onClick={fetchExploreFeed} className="underline font-bold">Retry</button>
            </div>
          )}

          <div className="text-xs font-bold text-zinc-400 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 ml-auto">
            <span className="text-[#72F0D0] font-extrabold text-sm">
              0{destinations.length > 0 ? activeIndex + 1 : 0}
            </span>{" "}
            / 0{destinations.length}
          </div>
        </div>

        {/* HERO TITLE & TEXT REVEAL SECTION */}
        <div className="my-auto py-6 max-w-3xl text-left">
          {isLoading ? (
            /* Glassmorphic Skeleton Loading Showcase */
            <div className="space-y-4 animate-pulse">
              <div className="w-32 h-6 bg-white/20 rounded-full" />
              <div className="w-96 h-16 bg-white/20 rounded-2xl" />
              <div className="w-full h-12 bg-white/10 rounded-xl" />
            </div>
          ) : destinations.length === 0 ? (
            /* Empty State Container */
            <div className="bg-[#123131]/60 border border-[#5AD9BC]/30 rounded-3xl p-10 backdrop-blur-md text-left">
              <h2 className="text-3xl font-black text-white mb-2">No Destinations Found</h2>
              <p className="text-xs text-zinc-300 mb-4">The community explore feed is currently updating.</p>
              <button
                onClick={fetchExploreFeed}
                className="px-6 py-2.5 rounded-full bg-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase"
              >
                Refresh Explore Feed
              </button>
            </div>
          ) : (
            activeDest && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDest.id}
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  {/* Location Pill Tag */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#42D6B5]/15 border border-[#42D6B5]/40 backdrop-blur-md text-[#72F0D0] text-xs font-black uppercase tracking-widest shadow">
                    <span>{activeDest.tag}</span>
                  </div>

                  {/* Destination Title */}
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    {activeDest.title}
                  </h1>

                  {/* Subtitle / Description */}
                  <p className="text-sm sm:text-base text-zinc-200 font-medium max-w-xl leading-relaxed drop-shadow">
                    {activeDest.desc}
                  </p>

                  {/* Frosted Glass CTA Button */}
                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setSelectedDetailModal(activeDest)}
                      className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(0,168,150,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Explore Destination</span>
                      <span className="text-sm">→</span>
                    </button>

                    <button
                      onClick={(e) => toggleBookmark(activeDest.id, e)}
                      className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                      title="Bookmark Destination"
                    >
                      <span>{bookmarked[activeDest.id] ? "❤️" : "🤍"}</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )
          )}
        </div>

        {/* BOTTOM NAVIGATION CONTROLS & PAGINATION DOTS */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          {/* Pagination Indicators (Dots) */}
          <div className="flex items-center gap-2.5">
            {destinations.map((dest, idx) => (
              <button
                key={dest.id}
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  activeIndex === idx
                    ? "w-9 bg-[#20C9B0] shadow-[0_0_12px_rgba(32,201,176,0.9)]"
                    : "w-2.5 bg-white/30 hover:bg-white/60"
                }`}
                title={dest.title}
              />
            ))}
          </div>

          {/* Next / Prev Arrow Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-[#061A1A]/80 hover:bg-[#20C9B0] hover:text-[#063D3A] border border-white/20 flex items-center justify-center text-white text-base font-black transition-all cursor-pointer shadow-lg active:scale-90 backdrop-blur-md"
              title="Previous Destination (Left Arrow)"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] text-[#063D3A] border border-[#7AF0D2]/50 flex items-center justify-center text-base font-black transition-all cursor-pointer shadow-[0_0_20px_rgba(32,201,176,0.5)] active:scale-90"
              title="Next Destination (Right Arrow)"
            >
              →
            </button>
          </div>
        </div>
      </main>

      {/* DESTINATION DETAIL MODAL */}
      <AnimatePresence>
        {selectedDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#071C1C] border border-[#42D6B5]/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-left relative"
            >
              <div className="h-64 relative">
                <img
                  src={selectedDetailModal.bgImage}
                  alt={selectedDetailModal.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedDetailModal(null)}
                  className="absolute top-4 right-4 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border border-white/20"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#72F0D0] uppercase tracking-widest">
                    {selectedDetailModal.tag}
                  </span>
                  <span className="text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full">
                    {selectedDetailModal.rating}
                  </span>
                </div>

                <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                  {selectedDetailModal.title}
                </h3>

                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  {selectedDetailModal.desc}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedDetailModal(null)}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] text-[#063D3A] font-black text-xs uppercase tracking-wider shadow hover:scale-105 transition-all"
                  >
                    Close Showcase
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

