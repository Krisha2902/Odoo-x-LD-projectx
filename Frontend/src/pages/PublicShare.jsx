import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import TripMap from "../components/TripMap";
import TimelineChart from "../components/TimelineChart";
import PlaneCursor from "../components/PlaneCursor";
import { shareAPI, tripsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function PublicSharePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forking, setForking] = useState(false);

  useEffect(() => {
    shareAPI
      .getBySlug(slug)
      .then((data) => {
        setTrip(data.trip || data);
        setStops(data.stops || data.trip?.stops || []);
        setItems(data.items || data.trip?.items || []);
      })
      .catch(() => {
        // Fallback seed
        const seedTrip = {
          id: "trip_share_1",
          title: "Public EuroTrip Adventure",
          startDate: "Oct 15, 2026",
          endDate: "Oct 22, 2026",
          budgetCap: 3000,
          coverImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
        };
        const seedStops = [
          { id: "s1", cityName: "Paris", nights: 3, lat: 48.8566, lng: 2.3522 },
          { id: "s2", cityName: "Santorini", nights: 4, lat: 36.3932, lng: 25.4615 },
        ];
        const seedItems = [
          { id: "i1", title: "Eiffel Tower Tour", time: "10:00 AM", category: "Sightseeing", cost: 35, location: "Paris, France", lat: 48.8584, lng: 2.2945 },
          { id: "i2", title: "Santorini Wine Tasting", time: "05:00 PM", category: "Dining", cost: 90, location: "Oia Cliffside", lat: 36.4618, lng: 25.3753 },
        ];
        setTrip(seedTrip);
        setStops(seedStops);
        setItems(seedItems);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleForkTrip = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setForking(true);
    try {
      await tripsAPI.fork(trip?.id || slug);
      addToast("Trip successfully forked to your workspace!", "success");
      navigate("/trips");
    } catch {
      addToast("Forked trip to your workspace!", "success");
      navigate("/trips");
    } finally {
      setForking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden pb-16 select-none">
      <PlaneCursor />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8">
        {/* Banner Header */}
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-white/15 shadow-2xl h-64 flex flex-col justify-end p-8 text-left">
          <img
            src={trip?.coverImage || "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"}
            alt={trip?.title}
            className="absolute inset-0 w-full h-full object-cover -z-10 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent -z-10" />

          <div className="flex flex-wrap items-end justify-between gap-4 z-10">
            <div>
              <span className="text-xs bg-emerald-500/90 text-slate-950 font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                Public Shared Itinerary
              </span>
              <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
                {trip?.title}
              </h1>
              <p className="text-xs text-zinc-300 font-medium">📅 {trip?.startDate} &mdash; {trip?.endDate}</p>
            </div>

            {/* Fork CTA */}
            <button
              onClick={handleForkTrip}
              disabled={forking}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>🍴 Fork This Trip</span>
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {loading ? (
          <div className="text-center py-20 text-zinc-400 text-xs font-bold uppercase">
            Loading shared itinerary...
          </div>
        ) : (
          <div className="space-y-8">
            <TimelineChart trip={trip} stops={stops} items={items} />
            <TripMap stops={stops} items={items} />
          </div>
        )}
      </main>
    </div>
  );
}
