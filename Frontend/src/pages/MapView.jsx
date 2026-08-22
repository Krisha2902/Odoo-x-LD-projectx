import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import TripMap from "../components/TripMap";
import PlaneCursor from "../components/PlaneCursor";
import { tripsAPI } from "../services/api";

export default function MapViewPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsAPI
      .getById(id)
      .then((data) => {
        setTrip(data.trip || data);
        setStops(data.stops || data.trip?.stops || []);
        setItems(data.items || data.trip?.items || []);
      })
      .catch(() => {
        const seedTrip = { id: id || "trip_1", title: "Ultimate Bali & Island Hopping" };
        const seedStops = [
          { id: "s1", cityName: "Ubud", nights: 3, lat: -8.5069, lng: 115.2625 },
          { id: "s2", cityName: "Seminyak", nights: 2, lat: -8.6913, lng: 115.1682 },
          { id: "s3", cityName: "Nusa Penida", nights: 2, lat: -8.7278, lng: 115.5444 },
        ];
        const seedItems = [
          { id: "i1", title: "Sacred Monkey Forest", category: "Activity", cost: 15, time: "09:00 AM", location: "Ubud Center", lat: -8.5194, lng: 115.2606 },
          { id: "i2", title: "Sunset Beach Club Dinner", category: "Dining", cost: 120, time: "06:30 PM", location: "Seminyak Beach", lat: -8.6888, lng: 115.1558 },
          { id: "i3", title: "Kelingking Beach Snorkeling", category: "Activity", cost: 75, time: "09:00 AM", location: "Nusa Penida", lat: -8.7505, lng: 115.4746 },
        ];
        setTrip(seedTrip);
        setStops(seedStops);
        setItems(seedItems);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden pb-16">
      <PlaneCursor />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="text-left">
            <Link to={`/trips/${id}/build`} className="text-zinc-400 hover:text-white text-xs font-bold mb-1 inline-block">
              &larr; Back to Builder
            </Link>
            <h1 className="text-3xl font-black uppercase text-white tracking-tight">
              {trip?.title || "Trip Route Map"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/trips/${id}/timeline`}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
            >
              📅 Timeline
            </Link>
            <Link
              to={`/trips/${id}/conduct`}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs"
            >
              📢 Conductor View
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
            <span className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase">Loading map...</span>
          </div>
        ) : (
          <TripMap stops={stops} items={items} />
        )}
      </main>
    </div>
  );
}
