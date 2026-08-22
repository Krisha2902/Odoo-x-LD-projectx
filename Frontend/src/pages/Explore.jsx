import React, { useState } from "react";
import Navbar from "../components/Navbar";
import PlaneCursor from "../components/PlaneCursor";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  // Explore Categories Data
  const destinations = [
    { id: "d1", name: "Bali", region: "Indonesia", rating: "4.9 ⭐", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80", desc: "Tropical paradise with lush terraced rice fields and sacred temples." },
    { id: "d2", name: "Paris", region: "France", rating: "4.8 ⭐", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80", desc: "City of lights, iconic Eiffel Tower, world-class art, and patisseries." },
    { id: "d3", name: "Tokyo", region: "Japan", rating: "4.95 ⭐", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80", desc: "Futuristic neon skyscrapers alongside ancient historic shrines." },
    { id: "d4", name: "Santorini", region: "Greece", rating: "4.9 ⭐", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80", desc: "Iconic whitewashed cliffside villages with Aegean sunset views." },
    { id: "d5", name: "Dubai", region: "UAE", rating: "4.85 ⭐", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80", desc: "Modern desert metropolis with Burj Khalifa and luxury shopping." },
    { id: "d6", name: "Swiss Alps", region: "Switzerland", rating: "4.96 ⭐", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80", desc: "Majestic snow-capped peaks, scenic train rides, and alpine lakes." },
  ];

  const beaches = [
    { id: "b1", name: "Kelingking Beach", location: "Nusa Penida, Bali", rating: "4.95 ⭐", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80", desc: "Dramatic T-Rex shaped cliff overlooks turquoise ocean waters." },
    { id: "b2", name: "Navagio Shipwreck Beach", location: "Zakynthos, Greece", rating: "4.9 ⭐", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", desc: "Exotic secluded cove featuring a historic stranded shipwreck." },
    { id: "b3", name: "Baa Atoll Lagoon", location: "Maldives", rating: "4.98 ⭐", img: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=600&q=80", desc: "Pristine white sand bars surrounded by vibrant coral reefs." },
  ];

  const hotels = [
    { id: "h1", name: "Viceroy Ubud Luxury Resort", location: "Bali, Indonesia", price: "$450 / night", rating: "4.9 ⭐", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80", desc: "Private jungle infinity pool villas overlooking Petanu River Valley." },
    { id: "h2", name: "The Ritz Paris", location: "Paris, France", price: "$980 / night", rating: "4.95 ⭐", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80", desc: "Opulent palatial hotel suite in the heart of Place Vendôme." },
    { id: "h3", name: "Aman Tokyo Sanctuary", location: "Tokyo, Japan", price: "$720 / night", rating: "4.92 ⭐", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80", desc: "Minimalist Zen luxury hotel floating high above Tokyo skyline." },
  ];

  const activities = [
    { id: "a1", name: "Manta Ray Snorkeling Safari", location: "Nusa Penida", cost: "$65", rating: "4.9 ⭐", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80", desc: "Swim alongside giant oceanic manta rays in crystal clear bays." },
    { id: "a2", name: "Eiffel Tower Sunset Champagne Tour", location: "Paris", cost: "$85", rating: "4.85 ⭐", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80", desc: "Skip-the-line summit access with panoramic dusk views over Paris." },
    { id: "a3", name: "Kyoto Bamboo Forest & Temple Hike", location: "Kyoto", cost: "$40", rating: "4.92 ⭐", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80", desc: "Guided early morning walk through serene towering bamboo groves." },
  ];

  const restaurants = [
    { id: "r1", name: "Potato Head Beach Club & Restaurant", cuisine: "Balinese Fusion", rating: "4.8 ⭐", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80", desc: "Oceanfront sunset dining with organic farm-to-table cuisine." },
    { id: "r2", name: "Le Jules Verne", cuisine: "French Fine Dining", rating: "4.9 ⭐", img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80", desc: "Michelin-starred culinary experience on the 2nd floor of Eiffel Tower." },
    { id: "r3", name: "Sukiyabashi Jiro Omakase", cuisine: "Traditional Sushi", rating: "4.98 ⭐", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80", desc: "World-renowned master sushi chef omakase experience." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8">
        {/* Header Title */}
        <div className="text-left mb-8 border-b border-white/10 pb-6">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400 block mb-1">
            Global Discovery Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Explore World Destinations &amp; Experiences
          </h1>
          <p className="text-xs text-zinc-400 font-medium">
            Immerse yourself in top rated places, pristine beaches, luxury stays, activities, and dining.
          </p>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 mt-6">
            {["All", "Destinations", "Beaches", "Hotels", "Things To Do", "Restaurants"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                    : "bg-slate-900 border border-white/15 text-zinc-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 1: DESTINATIONS */}
        {(activeTab === "All" || activeTab === "Destinations") && (
          <section className="mb-12 text-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                <span>🏙️</span> Popular Destinations
              </h2>
              <span className="text-xs text-cyan-300 font-bold">{destinations.length} Top Cities</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedItem(d)}
                  className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] hover:border-cyan-400/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-white">
                      {d.rating}
                    </span>
                    <span className="absolute bottom-3 left-3 bg-cyan-500/90 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {d.region}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {d.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium line-clamp-2">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: BEACHES */}
        {(activeTab === "All" || activeTab === "Beaches") && (
          <section className="mb-12 text-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                <span>🏖️</span> Iconic Tropical Beaches
              </h2>
              <span className="text-xs text-cyan-300 font-bold">{beaches.length} Coastal Spots</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {beaches.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedItem(b)}
                  className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] hover:border-cyan-400/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={b.img} alt={b.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-white">
                      {b.rating}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                      📍 {b.location}
                    </span>
                    <h3 className="font-extrabold text-base text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {b.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: HOTELS */}
        {(activeTab === "All" || activeTab === "Hotels") && (
          <section className="mb-12 text-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                <span>🏨</span> Luxury Stays &amp; Resorts
              </h2>
              <span className="text-xs text-cyan-300 font-bold">{hotels.length} Stays</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {hotels.map((h) => (
                <div
                  key={h.id}
                  onClick={() => setSelectedItem(h)}
                  className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] hover:border-cyan-400/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={h.img} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-white">
                      {h.rating}
                    </span>
                    <span className="absolute bottom-3 left-3 bg-emerald-500/90 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                      {h.price}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      📍 {h.location}
                    </span>
                    <h3 className="font-extrabold text-base text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {h.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: THINGS TO DO */}
        {(activeTab === "All" || activeTab === "Things To Do") && (
          <section className="mb-12 text-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                <span>🛶</span> Things To Do &amp; Activities
              </h2>
              <span className="text-xs text-cyan-300 font-bold">{activities.length} Experiences</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {activities.map((a) => (
                <div
                  key={a.id}
                  onClick={() => setSelectedItem(a)}
                  className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] hover:border-cyan-400/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={a.img} alt={a.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-white">
                      {a.rating}
                    </span>
                    <span className="absolute bottom-3 left-3 bg-cyan-500/90 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                      {a.cost}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                      📍 {a.location}
                    </span>
                    <h3 className="font-extrabold text-base text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {a.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5: RESTAURANTS */}
        {(activeTab === "All" || activeTab === "Restaurants") && (
          <section className="mb-12 text-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                <span>🍽️</span> World Culinary &amp; Restaurants
              </h2>
              <span className="text-xs text-cyan-300 font-bold">{restaurants.length} Dining Spots</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {restaurants.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedItem(r)}
                  className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] hover:border-cyan-400/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-white">
                      {r.rating}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      👨‍🍳 {r.cuisine}
                    </span>
                    <h3 className="font-extrabold text-base text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {r.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="bg-slate-900 border border-cyan-400/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-left relative">
            <div className="h-64 relative">
              <img src={selectedItem.img} alt={selectedItem.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border border-white/20"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {selectedItem.region || selectedItem.location || selectedItem.cuisine}
                </span>
                <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-full">
                  {selectedItem.rating}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">{selectedItem.name}</h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-6">{selectedItem.desc}</p>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow hover:bg-cyan-300"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
