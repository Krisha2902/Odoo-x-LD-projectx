import React from "react";

export default function VoteControl({ upvotes = 0, downvotes = 0, userVote = null, onVote }) {
  return (
    <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/10 text-xs">
      <button
        onClick={() => onVote("up")}
        className={`flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer ${
          userVote === "up" ? "text-emerald-400 font-black" : "text-zinc-400"
        }`}
        title="Upvote Activity"
      >
        <span>👍</span>
        <span>{upvotes}</span>
      </button>

      <span className="text-zinc-600">|</span>

      <button
        onClick={() => onVote("down")}
        className={`flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer ${
          userVote === "down" ? "text-red-400 font-black" : "text-zinc-400"
        }`}
        title="Downvote Activity"
      >
        <span>👎</span>
        <span>{downvotes}</span>
      </button>
    </div>
  );
}
