import React from "react";
import { Link } from "react-router-dom";

export default function TripCard({ trip, onDelete }) {
  const { id, title, startDate, endDate, coverImage, budgetCap, isPublic, role, slug } = trip;

  return (
    <div className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] hover:border-cyan-400/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left">
      {/* Cover Image */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Role Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-black text-cyan-300 uppercase tracking-wider border border-white/20">
          Role: {role || "Owner"}
        </div>
        {/* Public Badge */}
        {isPublic && (
          <div className="absolute top-3 right-3 bg-emerald-500/90 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Public
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white font-bold text-[11px] px-3 py-1 rounded-full border border-white/20">
          📅 {startDate} — {endDate}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-cyan-300 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-zinc-400 font-medium mb-4 flex items-center justify-between">
            <span>Budget Cap: <strong className="text-cyan-400 font-bold">${budgetCap || 2000}</strong></span>
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
          <Link
            to={`/trips/${id}/build`}
            className="flex-1 text-center py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow-md active:scale-95"
          >
            Build Trip
          </Link>
          <Link
            to={`/trips/${id}/timeline`}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
            title="Timeline View"
          >
            📅
          </Link>
          <Link
            to={`/trips/${id}/map`}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
            title="Map View"
          >
            🗺️
          </Link>
          <Link
            to={`/trips/${id}/conduct`}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-bold transition-all"
            title="Conductor View"
          >
            📢
          </Link>
        </div>
      </div>
    </div>
  );
}
