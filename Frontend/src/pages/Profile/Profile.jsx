import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  MapPin,
  Calendar,
  Heart,
  CheckCircle2,
  Edit3,
  Globe,
  Sparkles,
  Award,
  Compass,
  Star,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Plane,
  Plus,
  Loader2,
} from "lucide-react";
import PlaneCursor from "../../components/PlaneCursor";
import { useAuth } from "../../context/AuthContext";
import { tripsAPI, userAPI } from "../../services/api"; // Ensure userAPI is exported from your api service

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("completed"); // 'completed' | 'liked' | 'badges'
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic Data States
  const [userTrips, setUserTrips] = useState([]);
  const [likedPlaces, setLikedPlaces] = useState([]);

  // Editable Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    location: "",
    avatar: "",
    coverBg: "",
  });

  // Sync state whenever the authenticated user updates
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "Explorer User",
        email: user.email || "user@globetrotter.io",
        username: user.username || (user.email ? `@${user.email.split("@")[0]}` : "@explorer"),
        bio: user.bio || "Passport full of stamps & wanderlust in my veins ✈️.",
        location: user.location || "Global Explorer",
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || "Explorer"}`,
        coverBg: user.coverBg || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
      });
    }
  }, [user]);

  // Fetch real User Trips & Saved Places from backend
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      tripsAPI.getAll ? tripsAPI.getAll() : Promise.resolve({ trips: [] }),
      userAPI?.getSavedPlaces ? userAPI.getSavedPlaces() : Promise.resolve({ places: [] }),
    ])
      .then(([tripsRes, placesRes]) => {
        if (!isMounted) return;

        if (tripsRes.status === "fulfilled" && tripsRes.value?.trips) {
          setUserTrips(tripsRes.value.trips);
        } else if (user?.trips) {
          setUserTrips(user.trips);
        }

        if (placesRes.status === "fulfilled" && placesRes.value?.places) {
          setLikedPlaces(placesRes.value.places);
        } else if (user?.savedPlaces) {
          setLikedPlaces(user.savedPlaces);
        }
      })
      .catch((err) => console.error("Error loading user profile data:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Derived Dynamic Statistics
  const completedTripsCount = userTrips.length;
  const milesTraveled = user?.miles_traveled || completedTripsCount * 2850;

  // Dynamic Badges based on real user actions
  const badges = [
    {
      name: "Globe Trotter",
      level: completedTripsCount >= 3 ? "Gold" : completedTripsCount > 0 ? "Silver" : "Bronze",
      icon: "🌐",
      desc: completedTripsCount > 0 ? `Completed ${completedTripsCount} customized itineraries` : "Plan your first trip to unlock",
    },
    {
      name: "Destination Collector",
      level: likedPlaces.length >= 5 ? "Elite" : likedPlaces.length > 0 ? "Explorer" : "Novice",
      icon: "🏖️",
      desc: likedPlaces.length > 0 ? `Curated ${likedPlaces.length} saved destinations` : "Save your favorite spots to unlock",
    },
    {
      name: "Verified Account",
      level: "Pro",
      icon: "✨",
      desc: `Member since ${user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "2025"}`,
    },
  ];

  // Save changes to API & Context
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (userAPI?.updateProfile) {
        await userAPI.updateProfile(formData);
      }
      if (updateUser) {
        updateUser(formData);
      } else {
        localStorage.setItem("globetrotter_user", JSON.stringify({ ...user, ...formData }));
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#071C1C] text-white font-sans overflow-x-hidden pb-20 select-none">
      <PlaneCursor />

      {/* HERO COVER HEADER */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden">
        <img
          src={formData.coverBg}
          alt="Cover"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071C1C] via-[#071C1C]/40 to-transparent" />

        <div className="absolute top-24 right-6 sm:right-12 z-10 flex items-center gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-105"
          >
            <Edit3 className="w-4 h-4 text-[#72F0D0]" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 backdrop-blur-md border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer hover:scale-105"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 -mt-24 relative z-10 text-left">
        {/* USER PROFILE CARD */}
        <div className="bg-[#0D2626] border border-[#5AD9BC]/25 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              {/* Dynamic User Avatar */}
              <div className="relative group">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-[#071C1C] shadow-[0_0_35px_rgba(66,214,181,0.5)] bg-[#123131]"
                />
                <div
                  onClick={() => setIsEditing(true)}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <Edit3 className="w-6 h-6 text-[#72F0D0]" />
                </div>
              </div>

              {/* Dynamic Info */}
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                    {formData.name}
                  </h1>
                  <span className="px-3.5 py-1 rounded-full bg-[#42D6B5]/20 text-[#72F0D0] text-xs font-black uppercase tracking-wider border border-[#42D6B5]/40 flex items-center gap-1.5 shadow">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#72F0D0]" />
                    <span>Verified Explorer</span>
                  </span>
                </div>

                <p className="text-xs font-bold text-[#72F0D0] mt-1.5 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span>{formData.email}</span>
                  <span>&bull;</span>
                  <span>{formData.username}</span>
                  <span>&bull;</span>
                  <span className="text-zinc-400 font-medium inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#42D6B5]" /> {formData.location}
                  </span>
                </p>

                <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-2xl mt-3 leading-relaxed">
                  &quot;{formData.bio}&quot;
                </p>
              </div>
            </div>

            {/* Dynamic Counter Metrics */}
            <div className="flex items-center gap-3 sm:gap-4 bg-[#123131] border border-[#5AD9BC]/20 p-4 rounded-2xl">
              <div className="text-center px-3">
                <strong className="block text-2xl font-black text-[#72F0D0]">
                  {completedTripsCount}
                </strong>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">My Trips</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center px-3">
                <strong className="block text-2xl font-black text-[#72F0D0]">
                  {likedPlaces.length}
                </strong>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Saved</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center px-3">
                <strong className="block text-2xl font-black text-[#72F0D0]">
                  {milesTraveled.toLocaleString()}
                </strong>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Est. Miles</span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "completed"
                  ? "bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] text-[#063D3A] shadow-[0_0_20px_rgba(32,201,176,0.4)] scale-105"
                  : "bg-[#123131]/80 text-zinc-300 border border-[#5AD9BC]/20 hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>My Trips ({completedTripsCount})</span>
            </button>

            <button
              onClick={() => setActiveTab("liked")}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "liked"
                  ? "bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] text-[#063D3A] shadow-[0_0_20px_rgba(32,201,176,0.4)] scale-105"
                  : "bg-[#123131]/80 text-zinc-300 border border-[#5AD9BC]/20 hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Saved Places ({likedPlaces.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("badges")}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "badges"
                  ? "bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] text-[#063D3A] shadow-[0_0_20px_rgba(32,201,176,0.4)] scale-105"
                  : "bg-[#123131]/80 text-zinc-300 border border-[#5AD9BC]/20 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Achievements ({badges.length})</span>
            </button>
          </div>

          <Link
            to="/explore"
            className="text-xs font-extrabold text-[#72F0D0] hover:underline flex items-center gap-1"
          >
            <span>Explore More</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* TAB 1: DYNAMIC TRIPS */}
        {activeTab === "completed" && (
          <section className="space-y-6">
            {loading ? (
              <div className="text-center py-12 bg-[#0D2626] rounded-3xl border border-[#5AD9BC]/20">
                <Loader2 className="w-6 h-6 text-[#72F0D0] animate-spin mx-auto mb-2" />
                <p className="text-xs text-zinc-400 font-bold uppercase">Loading your trips...</p>
              </div>
            ) : userTrips.length === 0 ? (
              <div className="text-center py-16 bg-[#0D2626] rounded-3xl border border-[#5AD9BC]/20 space-y-4">
                <Plane className="w-12 h-12 text-[#72F0D0] mx-auto opacity-70" />
                <h3 className="text-xl font-black uppercase text-white">No Trips Created Yet</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Start building your customized multi-city itinerary.
                </p>
                <button
                  onClick={() => navigate("/plan-trip")}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase shadow hover:scale-105 transition-all cursor-pointer"
                >
                  ✨ Plan a New Trip
                </button>
              </div>
            ) : (
              userTrips.map((trip) => (
                <div
                  key={trip.id || trip._id}
                  className="group bg-[#0D2626] border border-[#5AD9BC]/25 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 hover:border-[#42D6B5]/60 hover:shadow-[0_0_35px_rgba(32,201,176,0.3)] transition-all duration-300"
                >
                  <div className="w-full lg:w-72 h-48 rounded-2xl overflow-hidden relative shrink-0">
                    <img
                      src={trip.cover_image_url || trip.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#42D6B5] text-[#063D3A] font-black text-[10px] uppercase px-3 py-1 rounded-full shadow">
                      ✓ Saved Trip
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#72F0D0]">
                        📅 {trip.start_date || "Flexible"} &bull; {trip.end_date || "Flexible"}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                      {trip.title || trip.name}
                    </h3>

                    <p className="text-xs text-zinc-400 font-medium line-clamp-2">
                      {trip.description || "Custom planned journey with itinerary & activities."}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
                    <div className="text-center lg:text-right">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                        Est. Budget
                      </span>
                      <strong className="text-xl font-black text-[#72F0D0]">
                        ${trip.budget_cap || trip.budget || "0"}
                      </strong>
                    </div>

                    <Link
                      to={`/trips/${trip.id || trip._id}`}
                      className="w-full lg:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase tracking-wider shadow hover:scale-105 transition-all text-center"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {/* TAB 2: SAVED PLACES */}
        {activeTab === "liked" && (
          <section>
            {likedPlaces.length === 0 ? (
              <div className="text-center py-12 bg-[#0D2626] rounded-3xl border border-[#5AD9BC]/20">
                <Heart className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 font-bold uppercase">No saved places yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedPlaces.map((place) => (
                  <div
                    key={place.id || place._id}
                    className="group bg-[#0D2626] border border-[#5AD9BC]/20 hover:border-[#42D6B5]/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(32,201,176,0.3)] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={place.img || place.image_url}
                        alt={place.title || place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-red-500/80 backdrop-blur-md text-white text-xs font-bold shadow">
                          ❤️ Saved
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between text-left">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                          {place.title || place.name}
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium line-clamp-2 mb-4">
                          {place.desc || place.description}
                        </p>
                      </div>

                      <Link
                        to="/plan-trip"
                        className="w-full py-2.5 rounded-2xl bg-[#123131] hover:bg-[#20C9B0] text-white hover:text-[#063D3A] font-extrabold text-xs text-center border border-[#5AD9BC]/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>✨ Add to Trip</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: ACHIEVEMENTS */}
        {activeTab === "badges" && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className="bg-[#0D2626] border border-[#5AD9BC]/25 rounded-3xl p-6 text-center space-y-3 shadow-xl hover:border-[#72F0D0] transition-all hover:scale-105"
                >
                  <span className="text-5xl block">{badge.icon}</span>
                  <span className="text-[10px] font-black uppercase text-[#72F0D0] bg-[#42D6B5]/20 px-3 py-1 rounded-full border border-[#42D6B5]/40 inline-block">
                    {badge.level} Badge
                  </span>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">{badge.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-left select-none">
          <div className="bg-[#071C1C] border border-[#42D6B5]/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Edit Explorer Profile
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-zinc-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#123131] border border-[#5AD9BC]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#123131] border border-[#5AD9BC]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Avatar Photo URL
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full bg-[#123131] border border-[#5AD9BC]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Travel Bio
                </label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#123131] border border-[#5AD9BC]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] text-[#063D3A] font-black text-xs uppercase tracking-wider shadow disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? "Saving..." : "Save Profile"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}