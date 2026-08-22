import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import PlaneCursor from "../components/PlaneCursor";

export default function ExplorePage() {
  const destinations = [
    {
      id: "dest-1",
      title: "BALI",
      country: "INDONESIA",
      tag: "📍 BALI • SOUTHEAST ASIA",
      rating: "4.95 ⭐",
      desc: "Immerse yourself in lush terraced rice fields, ancient sea temples, turquoise ocean waves, and spiritual wellness retreats.",
      bgImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80",
      thumbnail: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "dest-2",
      title: "THAILAND",
      country: "ASIA",
      tag: "📍 PHUKET • THAILAND",
      rating: "4.92 ⭐",
      desc: "Discover dramatic limestone karsts rising out of emerald Andaman waters, vibrant street night markets, and golden Buddhist pagodas.",
      bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "dest-3",
      title: "KERALA",
      country: "INDIA",
      tag: "📍 GOD'S OWN COUNTRY • INDIA",
      rating: "4.98 ⭐",
      desc: "Cruise serene palm-fringed backwaters on traditional houseboats, witness Ayurvedic wellness, and explore misty tea gardens in Munnar.",
      bgImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=80",
      thumbnail: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "dest-4",
      title: "SWITZERLAND",
      country: "EUROPE",
      tag: "📍 SWISS ALPS • EUROPE",
      rating: "4.96 ⭐",
      desc: "Soak in panoramic snow-capped Matterhorn views, glacial lakes, world-class alpine skiing, and luxury mountain railways.",
      bgImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80",
      thumbnail: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "dest-5",
      title: "PARIS",
      country: "FRANCE",
      tag: "📍 PARIS • FRANCE",
      rating: "4.89 ⭐",
      desc: "Wander historic Haussmann boulevards, admire Louvre artistic treasures, and experience Michelin-starred dining under the Eiffel Tower.",
      bgImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80",
      thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "dest-6",
      title: "JAPAN",
      country: "EAST ASIA",
      tag: "📍 KYOTO & TOKYO • JAPAN",
      rating: "4.97 ⭐",
      desc: "Experience the harmonious blend of ancient cherry blossom shrines, traditional tea ceremonies, and neon-lit futuristic metropolis.",
      bgImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80",
      thumbnail: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState({});
  const [selectedDetailModal, setSelectedDetailModal] = useState(null);

  const activeDest = destinations[activeIndex];

  // Cycle Next & Prev
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % destinations.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white font-sans overflow-hidden select-none">
      <PlaneCursor />
      <Navbar />

      {/* 1. SYNCHRONIZED HERO BACKDROP WITH SMOOTH ANIMATE PRESENCE CROSSFADE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
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
            {/* Ambient Dark Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* MAIN CAROUSEL CONTENT CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 min-h-[calc(100vh-80px)] flex flex-col justify-between pt-8 pb-12">
        {/* TOP SUB-HEADER BAR */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest text-cyan-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              CINEMATIC DESTINATION SHOWCASE
            </span>
          </div>

          <div className="text-xs font-bold text-zinc-400">
            <span className="text-cyan-400 font-extrabold text-sm">0{activeIndex + 1}</span> / 0
            {destinations.length}
          </div>
        </div>

        {/* MIDDLE GRID LAYOUT: LEFT HERO TEXT REVEAL & RIGHT FLOATING QUEUE CAROUSEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
          {/* LEFT SIDE: HERO TITLE & STAGGER TEXT REVEAL (7 COLS) */}
          <div className="lg:col-span-7 text-left pr-0 lg:pr-6">
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
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 backdrop-blur-md text-cyan-300 text-xs font-black uppercase tracking-widest shadow">
                  <span>{activeDest.tag}</span>
                </div>

                {/* Staggered Destination Title */}
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  {activeDest.title}
                </h1>

                {/* Subtitle / Descriptive Snippet */}
                <p className="text-sm sm:text-base text-zinc-200 font-medium max-w-xl leading-relaxed drop-shadow">
                  {activeDest.desc}
                </p>

                {/* Frosted Glass CTA Button */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setSelectedDetailModal(activeDest)}
                    className="px-8 py-3.5 rounded-full bg-white/15 hover:bg-cyan-400 hover:text-slate-950 text-white font-extrabold text-xs uppercase tracking-wider backdrop-blur-xl border border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(0,212,255,0.6)] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
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
          </div>

          {/* RIGHT SIDE: FLOATING QUEUE CAROUSEL OF UPCOMING DESTINATION THUMBNAILS (5 COLS) */}
          <div className="lg:col-span-5 flex items-center justify-end overflow-visible">
            <div className="flex gap-4 overflow-x-auto custom-scrollbar py-4 px-2 max-w-full">
              {destinations.map((dest, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <motion.div
                    key={dest.id}
                    layoutId={`thumb-${dest.id}`}
                    onClick={() => setActiveIndex(idx)}
                    whileHover={{ scale: 1.05, y: -6 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative min-w-[150px] sm:min-w-[170px] h-[230px] rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 flex flex-col justify-between p-3 text-left shadow-2xl flex-shrink-0 ${
                      isActive
                        ? "border-cyan-400 ring-4 ring-cyan-400/30 scale-105 shadow-[0_0_30px_rgba(0,212,255,0.4)]"
                        : "border-white/20 opacity-75 hover:opacity-100 hover:border-white/50"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={dest.thumbnail}
                      alt={dest.title}
                      className="absolute inset-0 w-full h-full object-cover -z-10 brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent -z-10" />

                    {/* Top Pill & Bookmark */}
                    <div className="flex items-center justify-between z-10">
                      <span className="bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 text-[9px] font-black text-cyan-300 border border-white/20">
                        {dest.rating}
                      </span>
                      <button
                        onClick={(e) => toggleBookmark(dest.id, e)}
                        className="text-xs hover:scale-125 transition-transform"
                      >
                        {bookmarked[dest.id] ? "❤️" : "🤍"}
                      </button>
                    </div>

                    {/* Bottom Title Tag */}
                    <div className="z-10">
                      <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider block">
                        {dest.country}
                      </span>
                      <strong className="text-sm font-black text-white uppercase tracking-tight block">
                        {dest.title}
                      </strong>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION CONTROLS & PAGINATION DOTS */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          {/* Pagination Indicators (Dots) */}
          <div className="flex items-center gap-2">
            {destinations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeIndex === idx
                    ? "w-8 bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* Next / Prev Arrow Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 border border-white/20 flex items-center justify-center text-white text-sm font-black transition-all cursor-pointer shadow-lg active:scale-90"
              title="Previous Destination"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 border border-cyan-300 flex items-center justify-center text-sm font-black transition-all cursor-pointer shadow-[0_0_20px_rgba(0,212,255,0.5)] active:scale-90"
              title="Next Destination"
            >
              →
            </button>
          </div>
        </div>
      </main>

      {/* DESTINATION DETAIL MODAL POPUP */}
      <AnimatePresence>
        {selectedDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-cyan-400/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-left relative"
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
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">
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
                    className="px-6 py-2.5 rounded-full bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow hover:bg-cyan-300"
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
