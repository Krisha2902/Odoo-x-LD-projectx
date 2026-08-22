import React from "react";

export default function TimelineChart({ trip, stops = [], items = [] }) {
  // Generate days sequence (e.g. Day 1, Day 2, Day 3, Day 4, Day 5, Day 6, Day 7)
  const totalDays = 7;
  const daysList = Array.from({ length: totalDays }, (_, i) => `Day ${i + 1}`);

  return (
    <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl select-none text-left">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            Interactive Timeline Visualization
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            Trip Segment Timeline &amp; Plotted Itinerary Points ({trip?.startDate || "Oct 15"} — {trip?.endDate || "Oct 22"})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
          <span className="text-xs text-cyan-300 font-bold">Live Plotted Points</span>
        </div>
      </div>

      {/* Stops City Segments Bar */}
      <div className="mb-8">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          City Segments
        </h4>
        <div className="flex gap-2 w-full overflow-x-auto custom-scrollbar pb-2">
          {stops.map((stop, idx) => (
            <div
              key={stop.id || idx}
              className="flex-1 min-w-[140px] bg-gradient-to-r from-slate-800 to-slate-800/80 border border-cyan-400/40 p-3 rounded-xl shadow"
            >
              <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold uppercase mb-1">
                <span>Segment #{idx + 1}</span>
                <span>{stop.nights || 2} Nights</span>
              </div>
              <strong className="block text-sm text-white font-extrabold">{stop.cityName}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Days & Plotted Items Grid */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[700px]">
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-3 mb-3 border-b border-white/10 pb-2">
            {daysList.map((day) => (
              <div key={day} className="text-center font-extrabold text-xs text-cyan-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Plotted Items Points Column */}
          <div className="grid grid-cols-7 gap-3 min-h-[280px]">
            {daysList.map((dayName) => {
              const dayItems = items.filter((it) => it.day === dayName || !it.day);
              return (
                <div
                  key={dayName}
                  className="bg-slate-800/40 border border-white/5 rounded-xl p-2 flex flex-col gap-2"
                >
                  {dayItems.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[10px] text-zinc-600">
                      Free Day
                    </div>
                  ) : (
                    dayItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-800 border border-cyan-400/30 rounded-lg p-2 hover:border-cyan-400 hover:shadow-lg transition-all text-left group"
                      >
                        <span className="block text-[9px] font-black uppercase text-cyan-300">
                          {item.time || "10:00 AM"}
                        </span>
                        <strong className="block text-xs font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
                          {item.title}
                        </strong>
                        <div className="flex items-center justify-between mt-1 text-[9px] text-zinc-400">
                          <span>{item.category || "Activity"}</span>
                          <span className="font-bold text-cyan-400">${item.cost || 0}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
