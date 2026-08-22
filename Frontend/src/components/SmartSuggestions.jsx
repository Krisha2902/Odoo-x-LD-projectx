import React from "react";

export default function SmartSuggestions({ onAddSuggestion }) {
  const suggestions = [
    {
      id: 1,
      title: "Crystal Bay Sunset & Snorkeling",
      category: "Beach / Activity",
      distance: "1.2 km away",
      rating: "4.9 ⭐",
      img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "La Lucciola Oceanfront Italian Dining",
      category: "Restaurant",
      distance: "800 m away",
      rating: "4.8 ⭐",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      title: "Tirta Empul Holy Water Temple",
      category: "Culture & Nature",
      distance: "3.5 km away",
      rating: "4.95 ⭐",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-cyan-400/30 rounded-2xl p-6 shadow-2xl text-left select-none">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
        <span className="text-2xl">🤖</span>
        <div>
          <h3 className="font-extrabold text-base text-white">Smart Companion Suggestions</h3>
          <p className="text-xs text-cyan-300 font-medium">
            &quot;You&apos;ve completed today&apos;s planned activities. You have tomorrow free — here are nearby recommendations!&quot;
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {suggestions.map((sug) => (
          <div
            key={sug.id}
            className="group bg-slate-800/80 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all flex flex-col justify-between"
          >
            <div className="h-28 overflow-hidden relative">
              <img
                src={sug.img}
                alt={sug.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 text-[10px] font-bold text-white">
                {sug.rating}
              </span>
            </div>

            <div className="p-3 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[9px] font-black uppercase text-cyan-400 block mb-0.5">
                  {sug.category} &bull; {sug.distance}
                </span>
                <strong className="block text-xs font-bold text-white leading-tight group-hover:text-cyan-200 transition-colors">
                  {sug.title}
                </strong>
              </div>

              <button
                onClick={() => onAddSuggestion && onAddSuggestion(sug)}
                className="mt-3 w-full py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-extrabold text-[11px] transition-all cursor-pointer border border-cyan-400/30"
              >
                + Add to Free Day
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
