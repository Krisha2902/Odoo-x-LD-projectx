import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, MapPin, Plus, Sparkles } from "lucide-react";
import PlaneCursor from "../../components/PlaneCursor";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TRIP_DAYS = { 10: "Kyoto", 11: "Kyoto", 12: "Kyoto", 13: "Osaka", 14: "Osaka", 15: "Osaka", 16: "Tokyo", 17: "Tokyo", 18: "Tokyo", 19: "Tokyo", 20: "Tokyo" };
const EVENTS = {
  10: [{ time: "10:00", title: "Arrive in Kyoto", detail: "Hotel check-in" }],
  13: [{ time: "09:30", title: "Bullet train to Osaka", detail: "Kyoto Station" }],
  16: [{ time: "09:00", title: "Tsukiji Outer Market", detail: "Food walk" }, { time: "13:30", title: "TeamLab Planets", detail: "Immersive art" }],
  17: [{ time: "11:00", title: "Asakusa & Senso-ji", detail: "City wandering" }],
  20: [{ time: "18:00", title: "Flight home", detail: "Haneda Airport" }],
};

function Calendar() {
  const [month, setMonth] = useState(5);
  const [year, setYear] = useState(2025);
  const [selectedDay, setSelectedDay] = useState(16);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const cells = [...Array(startDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  const shiftMonth = (amount) => {
    const next = new Date(year, month + amount, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
    setSelectedDay(null);
  };

  return (
    <main className="min-h-screen bg-[#071517] px-5 pb-24 pt-28 text-white sm:px-8 lg:px-12 select-none">
      <PlaneCursor />

      <div className="mx-auto max-w-[1240px] text-left">
        <header className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#8af5d7]">
              <Sparkles className="h-4 w-4" /> Your travel rhythm
            </p>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl text-white">Calendar</h1>
            <p className="mt-3 max-w-lg text-base text-white/70">See every escape, plan, and little moment in one place.</p>
          </div>
          <button className="flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#7AF0D2] via-[#4DE0C1] to-[#20C9B0] px-5 py-3 text-sm font-bold text-[#063d3a] shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer">
            <Plus className="h-4 w-4" /> Add a plan
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <div className="rounded-[1.5rem] border border-[#2c5b57] bg-[#0c2829] p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Your plans</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">{MONTHS[month]} {year}</h2>
              </div>
              <div className="flex gap-2">
                <button aria-label="Previous month" onClick={() => shiftMonth(-1)} className="rounded-full border border-[#3d7168] p-2.5 text-white/70 hover:bg-[#173d3c] hover:text-white cursor-pointer">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button aria-label="Next month" onClick={() => shiftMonth(1)} className="rounded-full border border-[#3d7168] p-2.5 text-white/70 hover:bg-[#173d3c] hover:text-white cursor-pointer">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-white/40 sm:gap-2">
              {WEEKDAYS.map((day) => <div key={day} className="pb-2">{day}</div>)}
              {cells.map((day, index) => {
                const isTripDay = day && month === 5 && year === 2025 && TRIP_DAYS[day];
                const isSelected = day === selectedDay && isTripDay;
                return (
                  <button
                    key={`${day}-${index}`}
                    disabled={!day}
                    onClick={() => day && setSelectedDay(day)}
                    className={`relative flex min-h-14 flex-col items-center justify-center rounded-xl text-sm transition sm:min-h-20 cursor-pointer ${
                      isSelected
                        ? "bg-[#8af5d7] font-bold text-[#063d3a]"
                        : isTripDay
                        ? "bg-[#174641] text-white hover:bg-[#246158]"
                        : day
                        ? "text-white/70 hover:bg-white/5"
                        : "cursor-default"
                    }`}
                  >
                    {day && <span>{day}</span>}
                    {isTripDay && !isSelected && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#ffcf70]" />}
                    {isTripDay && (
                      <span className={`mt-1 hidden text-[10px] sm:block ${isSelected ? "text-[#286962]" : "text-[#8af5d7]"}`}>
                        {TRIP_DAYS[day]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap gap-5 border-t border-white/10 pt-5 text-xs text-white/55">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#8af5d7]" /> Selected day</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#ffcf70]" /> Trip day</span>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-[#2c5b57] bg-[#0c2829] p-6 text-white sm:p-8 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8af5d7]">
              {selectedDay ? `June ${selectedDay}` : "Choose a day"}
            </p>
            {selectedDay && (
              <>
                <h2 className="mt-2 text-3xl font-semibold text-white">{TRIP_DAYS[selectedDay] || "A quiet day"}</h2>
                <p className="mt-2 text-sm text-zinc-400">{EVENTS[selectedDay] ? "Your itinerary" : "Nothing scheduled yet"}</p>
                <div className="mt-7 space-y-3">
                  {(EVENTS[selectedDay] || []).map((event) => (
                    <div className="flex gap-3 rounded-xl bg-[#174641]/80 border border-[#2c5b57] p-3 text-left" key={event.title}>
                      <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#8af5d7]" />
                      <div>
                        <p className="text-xs font-semibold text-[#8af5d7]">{event.time}</p>
                        <p className="mt-1 text-sm font-semibold text-white">{event.title}</p>
                        <p className="mt-1 text-xs text-zinc-300">{event.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-7 flex items-center gap-2 text-sm font-bold text-[#8af5d7] hover:text-white transition-colors cursor-pointer">
                  Open day details <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </aside>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#2c5b57] bg-[#0c2829] p-5">
            <MapPin className="h-5 w-5 text-[#8af5d7]" />
            <p className="mt-5 text-2xl font-semibold text-white">11 days</p>
            <p className="mt-1 text-sm text-white/50">Japan journey</p>
          </div>
          <div className="rounded-2xl border border-[#2c5b57] bg-[#0c2829] p-5">
            <Clock3 className="h-5 w-5 text-[#ffcf70]" />
            <p className="mt-5 text-2xl font-semibold text-white">5 plans</p>
            <p className="mt-1 text-sm text-white/50">On your calendar</p>
          </div>
          <div className="rounded-2xl border border-[#2c5b57] bg-[#0c2829] p-5">
            <Sparkles className="h-5 w-5 text-[#8af5d7]" />
            <p className="mt-5 text-2xl font-semibold text-white">1 trip</p>
            <p className="mt-1 text-sm text-white/50">Making memories</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Calendar;