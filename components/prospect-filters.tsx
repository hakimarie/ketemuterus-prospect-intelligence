"use client";

import { RotateCcw, Search } from "lucide-react";
import type { ProspectFilterState } from "@/lib/prospect-filters";

export type { ProspectFilterState };

export function ProspectFilters({ value, onChange }: { value: ProspectFilterState; onChange: (value: ProspectFilterState) => void }) {
  const set = (key: keyof ProspectFilterState, next: string) => onChange({ ...value, [key]: next });
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Filter discovery</p>
          <p className="mt-1 text-xs text-slate-500">Refine the same prospect view across the dashboard.</p>
        </div>
        <button onClick={() => onChange(defaultFilters())} className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-500 hover:text-slate-700">
          <RotateCcw size={13} /> Reset
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-400">
          <Search size={15} />
          <input value={value.query} onChange={e => set("query", e.target.value)} placeholder="Search prospect..." className="w-36 bg-transparent outline-none placeholder:text-slate-400" />
        </div>
        <select value={value.radius} onChange={e => set("radius", e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none">
          <option value="all">All radius</option><option value="1">0–1 km</option><option value="3">1–3 km</option><option value="5">3–5 km</option>
        </select>
        <select value={value.ecosystem} onChange={e => set("ecosystem", e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none">
          <option value="all">All ecosystems</option>{["Fitness", "Wellness", "Corporate", "Lifestyle", "Community"].map(option => <option key={option} value={option}>{option}</option>)}
        </select>
        <select value={value.opportunity} onChange={e => set("opportunity", e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none">
          <option value="all">Both opportunities</option><option value="customer">Customer acquisition</option><option value="partnership">Brand partnership</option>
        </select>
        <select value={value.potential} onChange={e => set("potential", e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none">
          <option value="all">All potential</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
        </select>
      </div>
    </div>
  );
}

function defaultFilters(): ProspectFilterState {
  return { query: "", radius: "all", ecosystem: "all", opportunity: "all", potential: "all" };
}
