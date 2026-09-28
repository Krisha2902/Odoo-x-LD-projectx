import React from "react";

export default function TimelineChart({ trip, stops = [], items = [] }) {
  // Generate days sequence (e.g. Day 1, Day 2, Day 3, Day 4, Day 5, Day 6, Day 7)
  const totalDays = 7;
  const daysList = Array.from({ length: totalDays }, (_, i) => `Day ${i + 1}`);

  return (
    <div className="bg-[#0D2626] border border-[#5AD9BC]/25 rounded-2xl p-6 shadow-2xl select-none text-left">
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-6 gap-2">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <span>📊</span>
            <span>Interactive Timeline Schedule</span>
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            Trip Segment Progression &amp; Plotted Schedule ({trip?.start_date || trip?.startDate || "Day 1"} — {trip?.end_date || trip?.endDate || "Day 7"})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#72F0D0] shadow-[0_0_10px_rgba(114,240,208,0.8)] animate-pulse" />
          <span className="text-xs text-[#72F0D0] font-bold">Live Plotted Timeline</span>
        </div>
      </div>

      {/* Stops City Segments Bar */}
      <div className="mb-8">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Destination Segments ({stops.length} Stops)
        </h4>
        <div className="flex gap-2 w-full overflow-x-auto custom-scrollbar pb-2">
          {stops.length === 0 ? (
            <div className="text-xs text-zinc-400 py-2">No city stops recorded for this trip.</div>
          ) : (
            stops.map((stop, idx) => (
              <div
                key={stop.id || idx}
                className="flex-1 min-w-[150px] bg-gradient-to-r from-[#123131] to-[#0D2626] border border-[#5AD9BC]/40 p-3 rounded-xl shadow"
              >
                <div className="flex items-center justify-between text-[10px] text-[#72F0D0] font-bold uppercase mb-1">
                  <span>Stop #{idx + 1}</span>
                  <span>{stop.nights || 2} Nights</span>
                </div>
                <strong className="block text-sm text-white font-extrabold truncate">
                  {stop.cityName || stop.city_name || stop.name || `Destination ${idx + 1}`}
                </strong>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Horizontal Days & Plotted Items Grid */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[700px]">
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-3 mb-3 border-b border-white/10 pb-2">
            {daysList.map((day) => (
              <div key={day} className="text-center font-extrabold text-xs text-[#72F0D0] uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Plotted Items Points Column */}
          <div className="grid grid-cols-7 gap-3 min-h-[280px]">
            {daysList.map((dayName, dIdx) => {
              const dayItems = items.filter((it, idx) => {
                if (it.day) return it.day.toLowerCase().includes(`day ${dIdx + 1}`) || it.day === dayName;
                // Otherwise distribute evenly across the 7 days
                return idx % totalDays === dIdx;
              });

              return (
                <div
                  key={dayName}
                  className="bg-slate-900/60 border border-white/5 rounded-xl p-2 flex flex-col gap-2"
                >
                  {dayItems.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[10px] text-zinc-500 italic py-8">
                      Free Exploration
                    </div>
                  ) : (
                    dayItems.map((item, itemIdx) => (
                      <div
                        key={item.id || itemIdx}
                        className="bg-[#123131] border border-[#5AD9BC]/25 rounded-lg p-2.5 hover:border-[#42D6B5] hover:shadow-lg transition-all text-left group"
                      >
                        <span className="block text-[9px] font-black uppercase text-[#72F0D0]">
                          {item.time || item.scheduled_time || "10:00 AM"}
                        </span>
                        <strong className="block text-xs font-bold text-white group-hover:text-[#72F0D0] transition-colors line-clamp-2 mt-0.5">
                          {item.title || item.custom_name || item.name || "Activity"}
                        </strong>
                        <div className="flex items-center justify-between mt-1 text-[9px] text-zinc-400">
                          <span>{item.category || "Activity"}</span>
                          <span className="font-bold text-[#42D6B5]">${item.cost || 0}</span>
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
