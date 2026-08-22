import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  MoreHorizontal,
  Navigation,
  Plus,
  Sparkles,
  Utensils,
  WalletCards,
  X,
} from "lucide-react";
import PlaneCursor from "../../components/PlaneCursor";

const ROUTE = [
  { city: "Kyoto", detail: "Jun 10 - 12", complete: true },
  { city: "Osaka", detail: "Jun 13 - 15", complete: true },
  { city: "Tokyo", detail: "Jun 16 - 20", current: true },
];

const SCHEDULE = [
  { time: "09:00", title: "Tsukiji Outer Market", type: "Food walk", icon: Utensils },
  { time: "13:30", title: "TeamLab Planets", type: "Immersive art", icon: Sparkles },
  { time: "18:00", title: "Dinner at Ginza", type: "Table for two", icon: Utensils },
];

const SUGGESTIONS = [
  { title: "Shimokitazawa stroll", detail: "Vintage shops and tiny live houses", image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=700&q=80" },
  { title: "Tokyo sunset cruise", detail: "A quiet evening on the Sumida River", image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=700&q=80" },
  { title: "Kappabashi kitchenware", detail: "Find a beautiful souvenir to take home", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=700&q=80" },
];

function OngoingTrips() {
  const [selectedSchedule, setSelectedSchedule] = useState(0);
  const [showSuggestion, setShowSuggestion] = useState(true);

  return (
    <main className="min-h-screen bg-[#071517] px-5 pb-24 pt-28 text-white sm:px-8 lg:px-12 select-none text-left">
      <PlaneCursor />

      <div className="mx-auto max-w-[1400px]">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#123d3c] shadow-2xl shadow-black/20">
          <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1800&q=85" alt="Tokyo skyline at dusk" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#082323] via-[#082323]/80 to-transparent" />
          <div className="relative grid min-h-[390px] items-end gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_.9fr] lg:p-14">
            <div className="max-w-xl">
              <div className="mb-7 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8af5d7]">
                <span className="flex items-center gap-2 rounded-full bg-[#8af5d7]/15 px-3 py-2 border border-[#8af5d7]/30">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#8af5d7]" /> Live trip
                </span>
                <span className="text-white/60">Day 7 of 11</span>
              </div>
              <p className="mb-3 flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 text-[#8af5d7]" /> Tokyo, Japan
              </p>
              <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl text-white">
                A softer side<br />of Japan.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-white/70">
                Slow mornings, bright city lights, and a few more beautiful places left to find.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-[#071517]/60 p-5 backdrop-blur-md sm:p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-white/65">Trip progress</span>
                <span className="font-semibold text-[#8af5d7]">64%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[64%] rounded-full bg-[#8af5d7]" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-2xl font-semibold text-white">6</p>
                  <p className="mt-1 text-white/55">Days done</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">4</p>
                  <p className="mt-1 text-white/55">Days left</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#8af5d7]">¥42k</p>
                  <p className="mt-1 text-white/55">Remaining</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-[1.5rem] border border-[#2c5b57] bg-[#0c2829] p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#8af5d7]">Your journey</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">The route so far</h2>
              </div>
              <button aria-label="More route options" className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white cursor-pointer">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="relative mt-10 flex items-start justify-between gap-2">
              <div className="absolute left-[8%] right-[8%] top-4 h-px bg-[#3d7168]" />
              <div className="absolute left-[8%] top-4 h-px w-[43%] bg-[#8af5d7]" />
              {ROUTE.map((stop) => (
                <div className="relative z-10 flex w-1/3 flex-col items-center text-center" key={stop.city}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#0c2829] ${stop.complete ? "bg-[#8af5d7] text-[#063d3a]" : stop.current ? "bg-[#ffcf70] text-[#513900]" : "bg-[#3d7168]"}`}>
                    {stop.complete ? <Check className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  </div>
                  <p className="mt-4 font-semibold text-white">{stop.city}</p>
                  <p className="mt-1 text-xs text-white/50">{stop.detail}</p>
                  {stop.current && (
                    <span className="mt-3 rounded-full bg-[#ffcf70]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ffcf70]">
                      You are here
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-10 flex items-center gap-3 rounded-xl bg-[#123a38] p-4 text-sm text-white/70">
              <Navigation className="h-5 w-5 shrink-0 text-[#8af5d7]" />
              <span>Next up: an easy afternoon around <strong className="text-white">Asakusa</strong></span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#2c5b57] bg-[#0c2829] p-6 text-white sm:p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8af5d7]">Today, June 16</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Tokyo in motion</h2>
              </div>
              <CalendarDays className="h-6 w-6 text-[#8af5d7]" />
            </div>
            <div className="mt-7 space-y-2">
              {SCHEDULE.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={() => setSelectedSchedule(index)}
                    className={`flex w-full items-center gap-4 rounded-xl p-3 text-left transition cursor-pointer ${
                      selectedSchedule === index ? "bg-[#174641] border border-[#8af5d7]/40 text-white" : "hover:bg-white/5 text-white/80"
                    }`}
                  >
                    <span className="w-11 text-xs font-semibold text-[#8af5d7]">{item.time}</span>
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full ${selectedSchedule === index ? "bg-[#8af5d7] text-[#063d3a]" : "bg-[#123a38] text-[#8af5d7]"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm text-white">{item.title}</strong>
                      <span className="text-xs text-zinc-400">{item.type}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#8af5d7]" />
                  </button>
                );
              })}
            </div>
            <button className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#8af5d7] hover:text-white transition-colors cursor-pointer">
              <Plus className="h-4 w-4" /> Add an activity
            </button>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-[1.5rem] border border-[#2c5b57] bg-[#0c2829] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8af5d7]/15 text-[#8af5d7]">
                <WalletCards className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-white/55">Budget status</p>
                <h2 className="text-xl font-semibold text-white">Looking good</h2>
              </div>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold text-white">¥138,000</p>
                <p className="mt-1 text-sm text-white/50">of ¥180,000 spent</p>
              </div>
              <span className="text-sm font-semibold text-[#8af5d7]">77%</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className="h-full w-[77%] rounded-full bg-[#ffcf70]" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-white/55">
              <span>Stay <strong className="ml-1 text-white">¥64k</strong></span>
              <span>Food <strong className="ml-1 text-white">¥28k</strong></span>
              <span>Transport <strong className="ml-1 text-white">¥21k</strong></span>
              <span>Activities <strong className="ml-1 text-white">¥25k</strong></span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-[#2c5b57] bg-[#0c2829] p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-[#ffcf70]">
                  <Sparkles className="h-4 w-4" /> A little extra room
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Make tomorrow yours</h2>
                <p className="mt-2 text-sm text-white/55">You have a free afternoon. Here are three nearby ideas.</p>
              </div>
              {showSuggestion && (
                <button aria-label="Dismiss suggestions" onClick={() => setShowSuggestion(false)} className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {showSuggestion ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {SUGGESTIONS.map((suggestion) => (
                  <button key={suggestion.title} className="group overflow-hidden rounded-xl bg-[#123a38] text-left border border-white/5 hover:border-[#8af5d7]/40 transition-all cursor-pointer">
                    <img src={suggestion.image} alt="" className="h-24 w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="p-3">
                      <p className="text-sm font-semibold text-white group-hover:text-[#8af5d7] transition-colors">{suggestion.title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/50">{suggestion.detail}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-6 flex items-center justify-between rounded-xl bg-[#123a38] p-4 text-sm text-white/60">
                <span>Suggestions tucked away for now.</span>
                <button onClick={() => setShowSuggestion(true)} className="font-semibold text-[#8af5d7] hover:underline cursor-pointer">
                  Show again
                </button>
              </div>
            )}
          </div>
        </section>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-white/45">
          <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> Last synced a moment ago</span>
          <button className="flex items-center gap-2 font-semibold text-[#8af5d7] hover:text-white transition-colors cursor-pointer">
            Open full itinerary <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <PlaneCursor />
    </main>
  );
}

export default OngoingTrips;