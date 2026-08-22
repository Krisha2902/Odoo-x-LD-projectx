import React, { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import PlaneCursor from "../../components/PlaneCursor";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("liked"); // 'liked' | 'completed' | 'badges'
  const [isEditing, setIsEditing] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || "Alex Rivera",
    username: "@alex_explorer",
    bio: "Passport full of stamps & heart full of wanderlust ✈️. Always hunting for secret turquoise beaches, local culinary treasures, and quiet mountain sunrises.",
    location: "San Francisco, CA",
    joinedDate: "January 2025",
    avatar:
      user?.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverBg:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
  });

  // Liked Places Data
  const likedPlaces = [
    {
      id: "like-1",
      title: "Uluwatu & Seminyak",
      country: "Bali, Indonesia",
      tag: "📍 SOUTHEAST ASIA",
      rating: "4.98 ⭐",
      category: "Beach & Wellness",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      desc: "Lush terraced rice fields, sacred cliffside sea temples, and world-class surf breaks.",
    },
    {
      id: "like-2",
      title: "Oia & Fira",
      country: "Santorini, Greece",
      tag: "📍 AEGEAN SEA",
      rating: "4.95 ⭐",
      category: "Island & Romance",
      img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
      desc: "Whitewashed Aegean cliffside villas, cobalt-blue domes, and breathtaking caldera sunsets.",
    },
    {
      id: "like-3",
      title: "Kyoto & Arashiyama",
      country: "Japan",
      tag: "📍 EAST ASIA",
      rating: "4.96 ⭐",
      category: "Culture & Nature",
      img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
      desc: "Historic bamboo groves, cherry blossom torii gates, and centuries-old zen temples.",
    },
    {
      id: "like-4",
      title: "Zermatt & Matterhorn",
      country: "Switzerland",
      tag: "📍 SWISS ALPS",
      rating: "4.94 ⭐",
      category: "Mountain & Adventure",
      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      desc: "Snow-capped alpine peaks, scenic glacier express railways, and world-class skiing.",
    },
    {
      id: "like-5",
      title: "Amalfi Coast & Positano",
      country: "Italy",
      tag: "📍 MEDITERRANEAN",
      rating: "4.91 ⭐",
      category: "Coastal Luxury",
      img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
      desc: "Pastel cliffside villages tumbling into turquoise Tyrrhenian waters and lemon groves.",
    },
    {
      id: "like-6",
      title: "Reykjavik & Golden Circle",
      country: "Iceland",
      tag: "📍 NORTH EUROPE",
      rating: "4.97 ⭐",
      category: "Aurora & Geysers",
      img: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
      desc: "Dancing Northern Lights, thermal blue lagoons, roaring waterfalls, and volcanic black sand beaches.",
    },
  ];

  // Completed Trips Data
  const completedTrips = [
    {
      id: "trip-comp-1",
      title: "Dubai Desert & Skyline Expedition",
      dates: "10 Jan — 18 Jan 2026",
      duration: "8 Days",
      stops: "Dubai • Abu Dhabi",
      totalSpent: "$2,850",
      rating: 5,
      coverImg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
      memoriesCount: 42,
      review: "Riding camels through sunset dunes and dining on top of Burj Khalifa was unforgettable!",
    },
    {
      id: "trip-comp-2",
      title: "French Riviera & Paris Romance",
      dates: "12 May — 22 May 2025",
      duration: "10 Days",
      stops: "Paris • Nice • Monaco",
      totalSpent: "$4,200",
      rating: 5,
      coverImg: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      memoriesCount: 68,
      review: "Louvre morning tours, croissant tastings, and yachting along the Côte d'Azur.",
    },
    {
      id: "trip-comp-3",
      title: "Thai Islands & Bangkok Night Markets",
      dates: "02 Nov — 14 Nov 2024",
      duration: "12 Days",
      stops: "Bangkok • Phuket • Phi Phi Islands",
      totalSpent: "$1,950",
      rating: 5,
      coverImg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      memoriesCount: 55,
      review: "Emerald water longtail boats, street food feasts, and peaceful elephant sanctuaries.",
    },
  ];

  // Badges Earned
  const badges = [
    { name: "Globe Trotter", level: "Gold", icon: "🌐", desc: "Visited over 10 international countries" },
    { name: "Beach Nomad", level: "Master", icon: "🏖️", desc: "Saved & visited 15 tropical beach spots" },
    { name: "Itinerary Architect", level: "Elite", icon: "🗺️", desc: "Created 20+ detailed travel plans" },
    { name: "Memory Collector", level: "Pro", icon: "📸", desc: "Uploaded 100+ trip memories" },
  ];

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#071C1C] text-white font-sans overflow-x-hidden pb-20 select-none">
      <PlaneCursor />

      {/* HERO COVER HEADER */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden">
        <img
          src={profileData.coverBg}
          alt="Cover"
          className="w-full h-full object-cover brightness-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071C1C] via-[#071C1C]/40 to-transparent" />

        <div className="absolute top-24 right-6 sm:right-12 z-10">
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-105"
          >
            <Edit3 className="w-4 h-4 text-[#72F0D0]" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 -mt-24 relative z-10 text-left">
        {/* PROFILE HEADER CARD */}
        <div className="bg-[#0D2626] border border-[#5AD9BC]/25 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              {/* Profile Picture Avatar */}
              <div className="relative group">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-[#071C1C] shadow-[0_0_30px_rgba(66,214,181,0.4)]"
                />
                <div
                  onClick={() => setIsEditing(true)}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <Edit3 className="w-6 h-6 text-[#72F0D0]" />
                </div>
              </div>

              {/* Identity & Bio */}
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                    {profileData.name}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-[#42D6B5]/20 text-[#72F0D0] text-xs font-black uppercase tracking-wider border border-[#42D6B5]/40">
                    Pro Explorer ✨
                  </span>
                </div>

                <p className="text-xs font-bold text-[#72F0D0] mt-1">
                  {profileData.username} &bull;{" "}
                  <span className="text-zinc-400 font-medium inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#42D6B5]" /> {profileData.location}
                  </span>
                </p>

                <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-2xl mt-3 leading-relaxed">
                  &quot;{profileData.bio}&quot;
                </p>
              </div>
            </div>

            {/* Quick Stat Counter Cards */}
            <div className="flex items-center gap-3 sm:gap-4 bg-[#123131] border border-[#5AD9BC]/20 p-4 rounded-2xl">
              <div className="text-center px-3">
                <strong className="block text-2xl font-black text-[#72F0D0]">
                  {completedTrips.length}
                </strong>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Completed</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center px-3">
                <strong className="block text-2xl font-black text-[#72F0D0]">
                  {likedPlaces.length}
                </strong>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Saved Places</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center px-3">
                <strong className="block text-2xl font-black text-[#72F0D0]">14.2k</strong>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Miles</span>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE TAB SWITCHER: Liked Places | Completed Trips | Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("liked")}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "liked"
                  ? "bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] text-[#063D3A] shadow-[0_0_20px_rgba(32,201,176,0.4)] scale-105"
                  : "bg-[#123131]/80 text-zinc-300 border border-[#5AD9BC]/20 hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Liked Places ({likedPlaces.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "completed"
                  ? "bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] text-[#063D3A] shadow-[0_0_20px_rgba(32,201,176,0.4)] scale-105"
                  : "bg-[#123131]/80 text-zinc-300 border border-[#5AD9BC]/20 hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed Trips ({completedTrips.length})</span>
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
            <span>Explore More Destinations</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* TAB CONTENT 1: LIKED PLACES GRID */}
        {activeTab === "liked" && (
          <section className="animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedPlaces.map((place) => (
                <div
                  key={place.id}
                  className="group bg-[#0D2626] border border-[#5AD9BC]/20 hover:border-[#42D6B5]/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(32,201,176,0.3)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="h-56 relative overflow-hidden">
                    <img
                      src={place.img}
                      alt={place.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D2626] via-transparent to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#72F0D0] text-[10px] font-black uppercase tracking-widest">
                        {place.tag}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full bg-red-500/80 backdrop-blur-md text-white text-xs font-bold shadow flex items-center gap-1">
                        ❤️ Saved
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#42D6B5]">{place.category}</span>
                        <span className="font-bold text-zinc-300">{place.rating}</span>
                      </div>

                      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1 group-hover:text-[#72F0D0] transition-colors">
                        {place.title}
                      </h3>

                      <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-4">
                        {place.desc}
                      </p>
                    </div>

                    <Link
                      to="/plan-trip"
                      className="w-full py-2.5 rounded-2xl bg-[#123131] hover:bg-[#20C9B0] text-white hover:text-[#063D3A] font-extrabold text-xs text-center border border-[#5AD9BC]/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>✨ Plan Trip Here</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB CONTENT 2: COMPLETED TRIPS GRID */}
        {activeTab === "completed" && (
          <section className="animate-fade-in-up space-y-6">
            {completedTrips.map((trip) => (
              <div
                key={trip.id}
                className="group bg-[#0D2626] border border-[#5AD9BC]/25 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 hover:border-[#42D6B5]/60 hover:shadow-[0_0_35px_rgba(32,201,176,0.3)] transition-all duration-300"
              >
                <div className="w-full lg:w-72 h-48 rounded-2xl overflow-hidden relative shrink-0">
                  <img
                    src={trip.coverImg}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#42D6B5] text-[#063D3A] font-black text-[10px] uppercase px-3 py-1 rounded-full shadow">
                    ✓ Completed
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#72F0D0]">
                      📅 {trip.dates} &bull; {trip.duration}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(trip.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    {trip.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-medium">📍 Stops: {trip.stops}</p>

                  <p className="text-xs sm:text-sm text-zinc-300 italic bg-[#123131] p-3.5 rounded-xl border border-white/10">
                    &quot;{trip.review}&quot;
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
                  <div className="text-center lg:text-right">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                      Total Expensed
                    </span>
                    <strong className="text-xl font-black text-[#72F0D0]">{trip.totalSpent}</strong>
                  </div>

                  <Link
                    to={`/trips/${trip.id}/details`}
                    className="w-full lg:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] text-[#063D3A] font-extrabold text-xs uppercase tracking-wider shadow hover:scale-105 transition-all text-center"
                  >
                    View Memories ({trip.memoriesCount}) &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* TAB CONTENT 3: ACHIEVEMENTS & BADGES */}
        {activeTab === "badges" && (
          <section className="animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-[#123131] border border-[#5AD9BC]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full bg-[#123131] border border-[#5AD9BC]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Avatar Photo URL
                </label>
                <input
                  type="text"
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  className="w-full bg-[#123131] border border-[#5AD9BC]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#72F0D0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Travel Bio
                </label>
                <textarea
                  rows="3"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
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
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7AF0D2] to-[#20C9B0] text-[#063D3A] font-black text-xs uppercase tracking-wider shadow"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}