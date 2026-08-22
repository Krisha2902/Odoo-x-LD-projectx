import React from "react";
import VoteControl from "./VoteControl";

export default function ItineraryItemCard({ item, onEdit, onDelete, onVote }) {
  const { id, title, category, cost, time, location, upvotes, downvotes, userVote } = item;

  const categoryBadgeColors = {
    Activity: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
    Dining: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    Transit: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    Lodging: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
    Sightseeing: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  };

  const badgeStyle = categoryBadgeColors[category] || "bg-zinc-700 text-zinc-200 border-zinc-500";

  return (
    <div className="bg-slate-800/80 border border-white/10 hover:border-cyan-400/40 rounded-xl p-4 transition-all shadow-md text-left flex flex-col justify-between group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
            {category || "Activity"}
          </span>
          <span className="text-xs text-zinc-400 font-medium">🕒 {time || "09:00 AM"}</span>
        </div>

        {/* Cost & Edit/Delete Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-cyan-400">${cost || 0}</span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-1 text-zinc-400 hover:text-white text-xs cursor-pointer"
              title="Edit Item"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1 text-red-400 hover:text-red-300 text-xs cursor-pointer"
              title="Delete Item"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <h4 className="font-extrabold text-sm text-white mb-1 group-hover:text-cyan-300 transition-colors">
        {title}
      </h4>

      {location && (
        <p className="text-xs text-zinc-400 font-medium mb-3 flex items-center gap-1">
          <span>📍</span> {location}
        </p>
      )}

      {/* Footer: Vote Control */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
        <span className="text-[10px] text-zinc-400">Collaborator Feedback:</span>
        <VoteControl
          upvotes={upvotes}
          downvotes={downvotes}
          userVote={userVote}
          onVote={(type) => onVote(id, type)}
        />
      </div>
    </div>
  );
}
