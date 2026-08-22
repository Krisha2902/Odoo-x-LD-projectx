import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative z-40 flex items-center justify-between px-6 sm:px-12 py-4 border-b border-white/10 backdrop-blur-xl bg-slate-950/85 sticky top-0 shadow-lg select-none">
      {/* Brand Logo: Ghummy Ghummi / GlobeTrotter */}
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
            <span>G</span>
            <span className="font-extrabold text-sm text-cyan-400 mr-1">hummy</span>
            <span className="inline-block rotate-180">G</span>
            <span className="font-extrabold text-sm text-cyan-400">hummi</span>
          </div>
        </div>
      </Link>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-white/80">
        <Link to="/" className="hover:text-cyan-400 transition-colors">
          Home
        </Link>
        <Link to="/explore" className="hover:text-cyan-400 transition-colors">
          Explore
        </Link>
        <Link to="/my-trips" className="hover:text-cyan-400 transition-colors">
          My Trips
        </Link>
      </nav>

      {/* Right User & Plan a Trip CTA */}
      <div className="flex items-center gap-4">
        {/* Prominent Plan a Trip CTA Button */}
        <Link
          to="/plan-trip"
          className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#0096B4] to-cyan-400 hover:from-[#00819C] hover:to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-cyan-400/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 border border-white/20"
        >
          <span>✈️</span>
          <span>Plan a Trip</span>
        </Link>

        {user ? (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 border border-white/20 rounded-full p-1 pl-2 bg-slate-900/80 hover:border-cyan-400 transition-all cursor-pointer"
            >
              <span className="hidden sm:inline text-xs font-bold text-white max-w-[100px] truncate">
                {user.name}
              </span>
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-7 h-7 rounded-full border border-cyan-400 bg-slate-800"
              />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 border border-white/20 backdrop-blur-2xl rounded-2xl shadow-2xl p-2 z-50 animate-fade-in-up text-left text-xs font-bold text-white">
                <div className="p-3 border-b border-white/10 mb-1">
                  <strong className="block text-white font-extrabold text-sm">{user.name}</strong>
                  <span className="text-[10px] text-zinc-400 font-medium">{user.email}</span>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/my-trips");
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-cyan-500/20 hover:text-cyan-300 transition-all cursor-pointer"
                >
                  <span>🧳</span> My Trips
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/plan-trip");
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-cyan-500/20 hover:text-cyan-300 transition-all cursor-pointer"
                >
                  <span>✨</span> Plan a New Trip
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/explore");
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-cyan-500/20 hover:text-cyan-300 transition-all cursor-pointer"
                >
                  <span>🌍</span> Explore Destinations
                </button>

                <div className="border-t border-white/10 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-red-500/20 text-red-300 transition-all cursor-pointer"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
}
