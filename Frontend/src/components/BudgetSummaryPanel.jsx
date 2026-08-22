import React from "react";

export default function BudgetSummaryPanel({ items = [], budgetCap = 2000 }) {
  // Calculate Total Cost
  const totalCost = items.reduce((acc, item) => acc + (Number(item.cost) || 0), 0);
  const remainingBudget = Math.max(0, budgetCap - totalCost);
  const isOverBudget = totalCost > budgetCap;
  const percentageSpent = Math.min(100, Math.round((totalCost / (budgetCap || 1)) * 100));

  // Category Breakdown
  const categoryCosts = items.reduce((acc, item) => {
    const cat = item.category || "Activity";
    acc[cat] = (acc[cat] || 0) + (Number(item.cost) || 0);
    return acc;
  }, {});

  // Day Breakdown
  const dayCosts = items.reduce((acc, item) => {
    const day = item.day || "Day 1";
    acc[day] = (acc[day] || 0) + (Number(item.cost) || 0);
    return acc;
  }, {});

  return (
    <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 flex flex-col h-full select-none text-left">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
          <span>💳</span> Live Budget Summary
        </h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isOverBudget ? "bg-red-500/20 text-red-300 border border-red-500/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"}`}>
          {isOverBudget ? "Over Budget!" : "On Track"}
        </span>
      </div>

      {/* Main Budget Progress Bar */}
      <div className="bg-slate-800 p-4 rounded-xl border border-white/10 mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs text-zinc-400 font-bold">Total Spent</span>
          <div>
            <strong className={`text-lg font-black ${isOverBudget ? "text-red-400" : "text-cyan-400"}`}>
              ${totalCost.toLocaleString()}
            </strong>
            <span className="text-xs text-zinc-500 font-semibold"> / ${budgetCap.toLocaleString()}</span>
          </div>
        </div>

        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/10">
          <div
            className={`h-full transition-all duration-500 ${
              isOverBudget
                ? "bg-gradient-to-r from-amber-500 to-red-500"
                : "bg-gradient-to-r from-cyan-400 to-teal-300"
            }`}
            style={{ width: `${percentageSpent}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-[10px] text-zinc-400 font-semibold">
          <span>{percentageSpent}% of budget used</span>
          <span>Remaining: ${remainingBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
          Spend by Category
        </h4>
        <div className="space-y-1.5">
          {Object.keys(categoryCosts).length === 0 ? (
            <p className="text-[11px] text-zinc-500">No items added yet</p>
          ) : (
            Object.entries(categoryCosts).map(([cat, cost]) => (
              <div key={cat} className="flex items-center justify-between text-xs bg-slate-800/60 p-2 rounded-lg border border-white/5">
                <span className="font-semibold text-zinc-300">{cat}</span>
                <span className="font-bold text-cyan-300">${cost}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Day Breakdown */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
          Spend by Day
        </h4>
        <div className="space-y-1.5">
          {Object.keys(dayCosts).length === 0 ? (
            <p className="text-[11px] text-zinc-500">No itinerary items</p>
          ) : (
            Object.entries(dayCosts).map(([day, cost]) => (
              <div key={day} className="flex items-center justify-between text-xs bg-slate-800/40 p-2 rounded-lg border border-white/5">
                <span className="font-semibold text-zinc-400">{day}</span>
                <span className="font-bold text-teal-300">${cost}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
