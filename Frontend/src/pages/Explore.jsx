import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PlaneCursor from "../components/PlaneCursor";
import { exploreAPI } from "../services/api";

export default function ExplorePage() {
  const [publicTrips, setPublicTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    exploreAPI
      .getPublicTrips()
      .then((data) => {
        setPublicTrips(data.trips || data || []);
      })
      .catch(() => {
        // Seed community feed trips
        const seedExplore = [
          {
            id: "exp_1",
            title: "Ultimate Bali & Island Hopping",
            author: "Sarah Jenkins",
            slug: "bali-island-hopping",
            coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
            startDate: "Oct 15, 2026",
            endDate: "Oct 22, 2026",
            likes: 142,
            stopsCount: 3,
          },
          {
            id: "exp_2",
            title: "Parisian Romance & Aegean Sunset",
            author: "Marco Rossi",
            slug: "paris-santorini-voyage",
            coverImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
            startDate: "Nov 01, 2026",
            endDate: "Nov 08, 2026",
            likes: 98,
            stopsCount: 2,
          },
          {
            id: "exp_3",
            title: "Dubai Luxury & Tokyo Anime Tour",
            author: "Kenji Sato",
            slug: "dubai-tokyo-expedition",
            coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
            startDate: "Dec 10, 2026",
            endDate: "Dec 20, 2026",
            likes: 215,
            stopsCount: 4,
          },
          {
            id: "exp_4",
            title: "Swiss Alps Ski & Italian Pasta Tour",
            author: "Elena Rostova",
            slug: "swiss-italy-tour",
            coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
            startDate: "Jan 05, 2027",
            endDate: "Jan 14, 2027",
            likes: 87,
            stopsCount: 3,
          },
        ];
        setPublicTrips(seedExplore);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6 text-left">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Community Explore Feed
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Discover public itineraries crafted by travelers worldwide — click to view or fork!
            </p>
          </div>
          <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3.5 py-1 rounded-full font-bold uppercase tracking-wider border border-cyan-400/30">
            {publicTrips.length} Public Itineraries
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
            <span className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading community feed...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicTrips.map((trip) => (
              <Link
                key={trip.id}
                to={`/share/${trip.slug}`}
                className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] hover:border-cyan-400/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-white flex items-center gap-1 border border-white/20">
                    <span>❤️</span> {trip.likes}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-cyan-500/90 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {trip.stopsCount} Cities
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {trip.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <span>By <strong>{trip.author}</strong></span>
                    <span className="text-cyan-400 font-bold">View Trip &rarr;</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
