import React from "react";
import { Link } from "react-router-dom";
import PlaneCursor from "../components/PlaneCursor";

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 select-none">
      <PlaneCursor />
      <span className="text-8xl mb-4">✈️</span>
      <h1 className="text-6xl font-black text-white tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-bold text-[#72F0D0] mb-4">Destination Not Found</h2>
      <p className="text-zinc-400 max-w-md mb-8">
        Looks like you've flown off the map! The page or trip route you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] text-[#063d3a] font-black px-8 py-3.5 rounded-full shadow-lg hover:scale-105 transition-all"
      >
        Return to Safety (Home)
      </Link>
    </div>
  );
}
