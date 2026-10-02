"use client";

import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Prospect } from "@/lib/types";
import { PotentialBadge } from "./potential-badge";

export function ProspectTable({ prospects }: { prospects: Prospect[] }) {
  const [query, setQuery] = useState("");
  const [potential, setPotential] = useState("all");
  const [ecosystem, setEcosystem] = useState("all");

  const categories = Array.from(new Set(prospects.map(p => p.category)));
  const filtered = useMemo(() => prospects.filter(p => {
    const q = query.toLowerCase();
    return (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      && (potential === "all" || p.customerPotential === potential || p.partnershipPotential === potential)
      && (ecosystem === "all" || p.category === ecosystem);
  }), [prospects, query, potential, ecosystem]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
        <div><h2 className="font-semibold text-ink">Prospect Database</h2><p className="mt-1 text-xs text-slate-400">{filtered.length} prospects in current view</p></div>
        <div className="flex flex-wrap gap-2">
          <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs text-slate-400"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search prospect..." className="w-32 bg-transparent outline-none placeholder:text-slate-400"/></div>
          <select value={ecosystem} onChange={e=>setEcosystem(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none"><option value="all">All ecosystems</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
          <select value={potential} onChange={e=>setPotential(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none"><option value="all">All potential</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
          <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600"><SlidersHorizontal size={14}/>Filters</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-slate-100 bg-slate-50/70"><tr className="text-[10px] uppercase tracking-wider text-slate-400"><th className="px-5 py-3 font-semibold">Prospect</th><th className="px-4 py-3 font-semibold">Ecosystem</th><th className="px-4 py-3 font-semibold">Distance</th><th className="px-4 py-3 font-semibold">Customer acquisition</th><th className="px-4 py-3 font-semibold">Partnership</th><th className="px-5 py-3 font-semibold">Status</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(p=><tr key={p.id} className="group hover:bg-slate-50/60">
              <td className="px-5 py-4"><div className="font-medium text-slate-800">{p.name}</div><div className="mt-0.5 text-[11px] text-slate-400">{p.signalCount} evidence signal{p.signalCount === 1 ? "" : "s"}</div></td>
              <td className="px-4 py-4 text-xs text-slate-600">{p.category}</td>
              <td className="px-4 py-4 text-xs text-slate-500">{p.distance_meters >= 1000 ? (p.distance_meters/1000).toFixed(1)+" km" : p.distance_meters+" m"}</td>
              <td className="px-4 py-4"><PotentialBadge level={p.customerPotential}/></td>
              <td className="px-4 py-4"><PotentialBadge level={p.partnershipPotential}/></td>
              <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 text-xs capitalize text-slate-500">{p.status.replace("_"," ")}<ArrowUpRight size={13} className="opacity-0 transition group-hover:opacity-100"/></span></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}