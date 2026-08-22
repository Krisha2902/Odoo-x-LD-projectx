import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import homepageBg from "../assets/homepage-gb.jpg";
import PlaneCursor from "../components/PlaneCursor";

export default function HomePage({ onNavigateToAuth }) {
  const navigate = useNavigate();
  // Search Bar State
  const [whereTo, setWhereTo] = useState("");
  const [whenDate, setWhenDate] = useState("");

  // Dropdown & Global Search State
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [globalCities, setGlobalCities] = useState([]);
  const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);

  // Calendar Selection State
  const [selectedStartDay, setSelectedStartDay] = useState(15);
  const [selectedEndDay, setSelectedEndDay] = useState(22);
  const currentMonthName = "October 2026";

  const searchFormRef = useRef(null);

  // Popular Fallback Cities
  const popularCities = [
    { name: "Bali", country: "Indonesia", code: "id", icon: "🌴", desc: "Tropical beaches & culture" },
    { name: "Paris", country: "France", code: "fr", icon: "🗼", desc: "Romance & Eiffel Tower" },
    { name: "Tokyo", country: "Japan", code: "jp", icon: "⛩️", desc: "Mount Fuji & Shibuya Crossing" },
    { name: "Dubai", country: "United Arab Emirates", code: "ae", icon: "🏙️", desc: "Burj Khalifa & Desert Safaris" },
    { name: "Santorini", country: "Greece", code: "gr", icon: "🌊", desc: "Cliffside villas & Aegean Sea" },
    { name: "Rome", country: "Italy", code: "it", icon: "🏛️", desc: "Colosseum & ancient history" },
    { name: "New York", country: "United States", code: "us", icon: "🗽", desc: "Times Square & Broadway" },
    { name: "Maldives", country: "Indian Ocean", code: "mv", icon: "🏝️", desc: "Overwater bungalows & clear waters" },
    { name: "London", country: "United Kingdom", code: "gb", icon: "🎡", desc: "Big Ben & Thames river" },
    { name: "Swiss Alps", country: "Switzerland", code: "ch", icon: "⛰️", desc: "Ski resorts & alpine views" },
  ];

  // Convert 2-letter Country Code to Flag Emoji
  const getCountryFlag = (countryCode) => {
    if (!countryCode || countryCode.length !== 2) return "🌍";
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Global Nominatim OpenStreetMap API Autocomplete Effect
  useEffect(() => {
    if (!whereTo || whereTo.trim().length < 2) {
      setGlobalCities([]);
      setIsSearchingGlobal(false);
      return;
    }

    setIsSearchingGlobal(true);

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            whereTo
          )}&addressdetails=1&limit=8`
        );
        const data = await response.json();

        // Map global geocoding API results
        const mapped = data.map((item) => {
          const addr = item.address || {};
          const cityName =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.municipality ||
            addr.state ||
            item.name;
          const countryName = addr.country || "Global";
          const countryCode = addr.country_code || "";
          const flag = getCountryFlag(countryCode);

          return {
            name: cityName,
            country: countryName,
            flag: flag,
            displayName: item.display_name,
            type: item.type || "city",
          };
        });

        setGlobalCities(mapped);
      } catch (error) {
        console.error("Global city search error:", error);
      } finally {
        setIsSearchingGlobal(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [whereTo]);

  // Close dropdowns when clicking outside search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target)) {
        setShowCityDropdown(false);
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (cityName, countryName) => {
    setWhereTo(`${cityName}, ${countryName}`);
    setShowCityDropdown(false);
  };

  const handleSelectDay = (day) => {
    if (!selectedStartDay || (selectedStartDay && selectedEndDay)) {
      setSelectedStartDay(day);
      setSelectedEndDay(null);
      setWhenDate(`Oct ${day}, 2026`);
    } else if (day > selectedStartDay) {
      setSelectedEndDay(day);
      setWhenDate(`Oct ${selectedStartDay} - Oct ${day}, 2026`);
      setShowCalendar(false);
    } else {
      setSelectedStartDay(day);
      setSelectedEndDay(null);
      setWhenDate(`Oct ${day}, 2026`);
    }
  };

  const applyPresetDate = (label, dateRangeStr, startDay, endDay) => {
    setSelectedStartDay(startDay);
    setSelectedEndDay(endDay);
    setWhenDate(dateRangeStr);
    setShowCalendar(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/trips");
  };

  // Top Regional Selections
  const regionalSelections = [
    {
      id: 1,
      name: "Tropical Asia",
      tag: "15 Destinations",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Classic Europe",
      tag: "22 Destinations",
      img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Middle East & Gulf",
      tag: "8 Destinations",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      name: "Caribbean & Americas",
      tag: "18 Destinations",
      img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      name: "East Asia & Japan",
      tag: "12 Destinations",
      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    },
  ];

  // Previous Trips
  const previousTrips = [
    {
      id: 1,
      title: "7-Day Bali Island Escape",
      location: "Ubud & Seminyak, Indonesia",
      duration: "7 Days / 6 Nights",
      price: "$899",
      rating: "4.9",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Santorini Sunset & Wine Voyage",
      location: "Oia & Fira, Greece",
      duration: "5 Days / 4 Nights",
      price: "$1,299",
      rating: "4.95",
      img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Dubai Desert & Skyscraper Safari",
      location: "Downtown Dubai & Dunes, UAE",
      duration: "6 Days / 5 Nights",
      price: "$1,099",
      rating: "4.88",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="relative min-h-screen w-full text-white font-sans overflow-x-hidden pb-16">
      {/* Dynamic Directional Airplane Cursor */}
      <PlaneCursor />

      {/* FULL PAGE BACKGROUND IMAGE (homepage-gb.jpg) */}
      <div className="fixed inset-0 z-0">
        <img
          src={homepageBg}
          alt="Homepage Background"
          className="w-full h-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
      </div>

      {/* AMBIENT FLOATING GLASSORB ANIMATIONS */}
      <div className="fixed top-1/4 right-10 w-96 h-96 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none z-0 animate-float-orb-1" />
      <div className="fixed bottom-1/4 left-10 w-[30rem] h-[30rem] rounded-full bg-teal-300/10 blur-3xl pointer-events-none z-0 animate-float-orb-2" />

      {/* TOP HEADER NAVBAR */}
      <header className="relative z-30 flex items-center justify-between px-6 sm:px-12 py-4 border-b border-white/10 backdrop-blur-xl bg-slate-950/70 sticky top-0 shadow-lg">
        {/* Brand Logo: Ghummy Ghummi */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative flex items-center justify-center">
            <div className="flex items-center justify-center font-black text-2xl tracking-tighter group-hover:scale-110 transition-transform">
              <span className="text-white">G</span>
              <span className="text-white inline-block rotate-180 -ml-0.5">G</span>
            </div>
            <svg
              className="w-4 h-4 text-cyan-400 absolute -top-1.5 -right-2.5 rotate-45 animate-float-logo"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline tracking-tight leading-none text-white font-black text-xl">
              <span>G</span>
              <span className="font-extrabold text-sm mr-1.5">hummy</span>
              <span className="inline-block rotate-180">G</span>
              <span className="font-extrabold text-sm">hummi</span>
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/90 select-none">
          <a href="#hero" className="text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5">
            Home
          </a>
          <Link to="/explore" className="hover:text-cyan-400 transition-colors">
            Explore Feed
          </Link>
          <Link to="/trips" className="hover:text-cyan-400 transition-colors">
            My Trips
          </Link>
          <a href="#regional" className="hover:text-cyan-400 transition-colors">
            Regions
          </a>
        </nav>

        {/* Right User CTA */}
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-cyan-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-cyan-300/40"
        >
          Log In / Sign Up
        </button>
      </header>

      {/* HERO BANNER SECTION */}
      <section id="hero" className="relative z-20 w-full min-h-[540px] lg:min-h-[600px] flex flex-col justify-center items-center text-center px-6 py-16">
        {/* Floating Travel Ticker Badges */}
        <div className="hidden lg:flex absolute top-16 left-12 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold text-cyan-200 items-center gap-2 shadow-xl animate-float-logo">
          <span>✈️</span> 150,000+ Trips Planned
        </div>

        <div className="hidden lg:flex absolute top-28 right-12 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold text-teal-200 items-center gap-2 shadow-xl animate-float-logo style={{ animationDelay: '1s' }}">
          <span>⭐</span> 4.9/5 Rating (50k+ Reviews)
        </div>

        {/* Marked Content Overlay */}
        <div className="max-w-4xl mx-auto z-10 animate-fade-in-up">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-cyan-400/30 backdrop-blur-md mb-5 text-cyan-300 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <span>✨</span> AI-POWERED TRAVEL PLANNER
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase text-white leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] mb-5">
            Explore the World <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400 animate-text-shimmer">
              With Confidence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-white/90 font-medium max-w-xl mx-auto mb-8 leading-relaxed drop-shadow">
            Seamless global travel planning, personalized experiences, and trusted booking — all in one place.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <button
              onClick={() => navigate("/trips")}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0096B4] to-cyan-400 hover:from-[#00819C] hover:to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,150,180,0.5)] hover:shadow-cyan-400/60 active:scale-98 transition-all flex items-center gap-2 cursor-pointer border border-white/20"
            >
              <span>Start Your Journey</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <a
              href="#regional"
              className="px-8 py-3.5 rounded-full bg-white/15 border border-white/30 hover:bg-white/25 backdrop-blur-md text-white font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all flex items-center gap-2"
            >
              <span>📍 View Destinations</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* GLOBAL PILL SEARCH BAR WITH REAL-TIME WORLDWIDE SEARCH & CALENDAR */}
        <div ref={searchFormRef} className="relative w-full max-w-3xl mx-auto z-50 mt-4 animate-fade-in-up-delayed">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-full p-2.5 sm:p-3 sm:px-8 shadow-[0_25px_70px_rgba(0,0,0,0.7)] border border-white/90 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 text-left text-zinc-800 select-none relative hover:shadow-[0_25px_80px_rgba(0,212,255,0.2)] transition-shadow"
          >
            {/* 1. GLOBAL WHERE TO? SEARCH */}
            <div className="flex-1 min-w-[150px] px-3 py-1 border-r border-zinc-200 relative">
              <label className="block text-xs font-black text-zinc-900 uppercase tracking-wider mb-0.5">
                Where to?
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Search any global city..."
                  value={whereTo}
                  onFocus={() => {
                    setShowCityDropdown(true);
                    setShowCalendar(false);
                  }}
                  onChange={(e) => {
                    setWhereTo(e.target.value);
                    setShowCityDropdown(true);
                  }}
                  className="w-full bg-transparent text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none"
                />
                {isSearchingGlobal && (
                  <span className="w-3.5 h-3.5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                )}
              </div>

              {/* REAL-TIME GLOBAL CITIES DROPDOWN */}
              {showCityDropdown && (
                <div className="absolute top-full left-0 mt-3 w-80 sm:w-96 bg-slate-900/98 border border-white/20 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-4 z-[100] animate-fade-in-up text-white">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                    <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🌍</span> {whereTo.length >= 2 ? "Global Search Results" : "Top Global Recommendations"}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {whereTo.length >= 2 ? `${globalCities.length} Found` : "10 Popular"}
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                    {whereTo.length >= 2 ? (
                      isSearchingGlobal ? (
                        <div className="flex items-center justify-center gap-2 py-6 text-xs text-zinc-400">
                          <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                          <span>Searching global cities database...</span>
                        </div>
                      ) : globalCities.length > 0 ? (
                        globalCities.map((city, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectCity(city.name, city.country)}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-400/30 border border-transparent transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl bg-white/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                {city.flag}
                              </span>
                              <div>
                                <strong className="block text-xs text-white font-extrabold group-hover:text-cyan-300 transition-colors">
                                  {city.name}, {city.country}
                                </strong>
                                <span className="text-[10px] text-zinc-400 line-clamp-1">
                                  {city.displayName}
                                </span>
                              </div>
                            </div>
                            <span className="text-cyan-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              Select &rarr;
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-xs text-zinc-400">
                          No global cities found matching &quot;{whereTo}&quot;
                        </div>
                      )
                    ) : (
                      popularCities.map((city, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectCity(city.name, city.country)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-400/30 border border-transparent transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl bg-white/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                              {city.icon} {getCountryFlag(city.code)}
                            </span>
                            <div>
                              <strong className="block text-xs text-white font-extrabold group-hover:text-cyan-300 transition-colors">
                                {city.name}, {city.country}
                              </strong>
                              <span className="text-[10px] text-zinc-400 font-medium">
                                {city.desc}
                              </span>
                            </div>
                          </div>
                          <span className="text-cyan-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Select &rarr;
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. WHEN? SECTION */}
            <div className="flex-1 min-w-[150px] px-3 py-1 relative">
              <label className="block text-xs font-black text-zinc-900 uppercase tracking-wider mb-0.5">
                When?
              </label>
              <input
                type="text"
                readOnly
                placeholder="Select Dates"
                value={whenDate}
                onClick={() => {
                  setShowCalendar(true);
                  setShowCityDropdown(false);
                }}
                className="w-full bg-transparent text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none cursor-pointer"
              />

              {/* CALENDAR POPUP */}
              {showCalendar && (
                <div className="absolute top-full right-0 sm:right-auto sm:left-0 mt-3 w-80 sm:w-96 bg-slate-900/95 border border-white/20 backdrop-blur-2xl rounded-2xl shadow-2xl p-4 z-50 animate-fade-in-up text-white">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">🗓️</span>
                      <strong className="text-xs font-extrabold text-white">
                        {currentMonthName}
                      </strong>
                    </div>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                      {whenDate || "Choose Date Range"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <button
                      type="button"
                      onClick={() => applyPresetDate("Weekend", "Oct 24 - Oct 26, 2026", 24, 26)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-cyan-500/30 text-[11px] font-bold text-white transition-all cursor-pointer"
                    >
                      ⚡ This Weekend
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetDate("Next Week", "Oct 26 - Nov 01, 2026", 26, 31)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-cyan-500/30 text-[11px] font-bold text-white transition-all cursor-pointer"
                    >
                      🗓️ Next Week
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetDate("7 Days", "Nov 10 - Nov 17, 2026", 10, 17)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-cyan-500/30 text-[11px] font-bold text-white transition-all cursor-pointer"
                    >
                      ✈️ 7-Day Trip
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-zinc-400 uppercase mb-2">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                    <span />
                    <span />
                    <span />

                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const isStart = day === selectedStartDay;
                      const isEnd = day === selectedEndDay;
                      const inRange =
                        selectedStartDay &&
                        selectedEndDay &&
                        day > selectedStartDay &&
                        day < selectedEndDay;

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleSelectDay(day)}
                          className={`h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer font-bold ${
                            isStart || isEnd
                              ? "bg-gradient-to-r from-[#0096B4] to-cyan-400 text-white shadow-md scale-105"
                              : inRange
                              ? "bg-cyan-500/30 text-cyan-200"
                              : "hover:bg-white/15 text-zinc-200"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400">
                      Click start & end dates
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(false)}
                      className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs transition-all cursor-pointer shadow"
                    >
                      Apply Dates
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* GREEN CIRCULAR SEARCH BUTTON WITH GLOW */}
            <button
              type="submit"
              className="w-12 h-12 rounded-full bg-[#00A843] hover:bg-[#00923a] hover:shadow-[0_0_20px_rgba(0,168,67,0.6)] active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer flex-shrink-0"
              title="Search Trips"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* MAIN BODY CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-16 z-0 relative">
        {/* SECTION 1: TOP REGIONAL SELECTIONS (INFINITE RIGHT-TO-LEFT MARQUEE LOOP) */}
        <section id="regional" className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-6 select-none">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-wider whitespace-nowrap">
                Top Regional Selections
              </h2>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest border border-cyan-400/30">
                Live Stream 🔄
              </span>
            </div>
            <div className="h-px bg-gradient-to-r from-cyan-400/40 to-transparent flex-1" />
          </div>

          {/* INFINITE MARQUEE SLIDER CONTAINER */}
          <div className="overflow-hidden w-full relative py-2 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            <div className="animate-marquee-slow flex gap-5">
              {[...regionalSelections, ...regionalSelections].map((region, idx) => (
                <div
                  key={`${region.id}-${idx}`}
                  className="group relative w-52 sm:w-60 h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/15 shadow-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.45)] hover:border-cyan-400/60 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left flex-shrink-0"
                >
                  <img
                    src={region.img}
                    alt={region.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                    <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">{region.tag}</span>
                    <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight group-hover:text-cyan-200 transition-colors">
                      {region.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: PREVIOUS TRIPS (INFINITE RIGHT-TO-LEFT MARQUEE LOOP) */}
        <section id="trips" className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-6 select-none">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-wider whitespace-nowrap">
                Previous Trips
              </h2>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest border border-teal-400/30">
                Infinite Reel ✈️
              </span>
            </div>
            <div className="h-px bg-gradient-to-r from-cyan-400/40 to-transparent flex-1" />
          </div>

          {/* INFINITE MARQUEE SLIDER CONTAINER */}
          <div className="overflow-hidden w-full relative py-2 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            <div className="animate-marquee-medium flex gap-6">
              {[...previousTrips, ...previousTrips, ...previousTrips].map((trip, idx) => (
                <div
                  key={`${trip.id}-${idx}`}
                  className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-[0_0_35px_rgba(0,212,255,0.4)] hover:border-cyan-400/60 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between text-left w-80 sm:w-96 flex-shrink-0"
                >
                  <div className="h-56 sm:h-64 overflow-hidden relative">
                    <img
                      src={trip.img}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-white flex items-center gap-1 border border-white/20 shadow">
                      <span>⭐</span> {trip.rating}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      {trip.duration}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-extrabold text-base text-white mb-1 group-hover:text-cyan-300 transition-colors">
                        {trip.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium mb-4 flex items-center gap-1">
                        <span>📍</span> {trip.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <span className="block text-[10px] text-zinc-400 uppercase font-bold">Total Package</span>
                        <span className="text-lg font-black text-cyan-400">{trip.price}</span>
                      </div>

                      <button
                        onClick={onNavigateToAuth}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        Book Again
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING ACTION BUTTON WITH GLOW RIPPLE */}
      <div className="fixed bottom-8 right-8 z-40">
        <div className="absolute inset-0 rounded-full bg-cyan-400 blur-md animate-ping opacity-30 pointer-events-none" />
        <button
          onClick={() => navigate("/trips")}
          className="relative bg-gradient-to-r from-[#0096B4] to-cyan-400 hover:from-[#00819C] hover:to-cyan-500 text-white px-6 py-3.5 rounded-full shadow-[0_10px_30px_rgba(0,150,180,0.6)] font-extrabold text-sm border border-white/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
        >
          <span className="text-lg font-black">+</span>
          <span>Plan a trip</span>
        </button>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-8 px-8 text-center text-xs text-white/60 select-none">
        &copy; {new Date().getFullYear()} Ghummy Ghummi&trade;. All Rights Reserved.
      </footer>
    </div>
  );
}
