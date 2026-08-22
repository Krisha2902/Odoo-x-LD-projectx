import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="relative z-30 flex items-center justify-between px-6 sm:px-12 py-4 border-b border-white/10 backdrop-blur-xl bg-slate-950/85 sticky top-0 shadow-lg select-none">
      {/* Brand Logo: GlobeTrotter / Ghummy Ghummi */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative flex items-center justify-center">
          <div className="flex items-center justify-center font-black text-2xl tracking-tighter group-hover:scale-105 transition-transform">
            <span className="text-white">G</span>
            <span className="text-white inline-block rotate-180 -ml-0.5">G</span>
          </div>
          <svg
            className="w-4 h-4 text-cyan-400 absolute -top-1.5 -right-2.5 rotate-45"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>
        <div>
          <div className="flex items-baseline tracking-tight leading-none text-white font-black text-xl">
            <span>Globe</span>
            <span className="font-extrabold text-sm text-cyan-400 ml-0.5">Trotter</span>
          </div>
        </div>
      </Link>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-white/80">
        <Link to="/" className="hover:text-cyan-400 transition-colors">
          Home
        </Link>
        <Link to="/explore" className="hover:text-cyan-400 transition-colors">
          Explore Feed
        </Link>
        {user && (
          <Link to="/trips" className="hover:text-cyan-400 transition-colors">
            My Trips
          </Link>
        )}
      </nav>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-cyan-400/50 bg-slate-800"
            />
            <span className="hidden sm:inline text-xs font-bold text-white">{user.name}</span>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-300 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-cyan-400/30 hover:scale-105 active:scale-95 transition-all"
          >
            Log In / Sign Up
          </Link>
        )}
      </div>
    </header>
  );
}
