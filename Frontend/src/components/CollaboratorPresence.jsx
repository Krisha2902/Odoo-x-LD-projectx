import React from "react";

export default function CollaboratorPresence({ collaborators = [] }) {
  if (collaborators.length === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow text-xs">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      <span className="text-zinc-400 font-bold text-[11px]">Live:</span>
      <div className="flex items-center -space-x-2 overflow-hidden">
        {collaborators.map((collab, idx) => (
          <img
            key={collab.id || idx}
            src={collab.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${collab.name}`}
            alt={collab.name}
            title={`${collab.name} (Online)`}
            className="inline-block w-6 h-6 rounded-full border border-cyan-400 bg-slate-800"
          />
        ))}
      </div>
      <span className="text-[10px] text-cyan-300 font-bold ml-1">
        {collaborators.length} Collaborator{collaborators.length > 1 ? "s" : ""}
      </span>
    </div>
  );
}
