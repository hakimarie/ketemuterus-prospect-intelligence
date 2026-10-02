"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProspectFilters } from "@/components/prospect-filters";
import { PotentialBadge } from "@/components/potential-badge";
import { defaultProspectFilters, filterProspects, type ProspectFilterState } from "@/lib/prospect-filters";
import { mockProspects } from "@/lib/mock-data";

export default function ProspectsPage() {
  const [filters, setFilters] = useState<ProspectFilterState>(defaultProspectFilters);
  const filtered = useMemo(() => filterProspects(mockProspects, filters), [filters]);

  return <div className="min-h-screen bg-slate-50"><main className="mx-auto max-w-[1400px] px-5 py-6 pb-24 sm:px-8">
    <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand"><ArrowLeft size={14}/> Dashboard</Link>
    <div className="mt-5 border-b border-slate-200 pb-6"><p className="text-xs font-medium text-brand">Six Hands — PIM 3</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">Prospect Database</h1><p className="mt-1 text-sm text-slate-500">Local businesses and communities identified around the outlet.</p></div>
    <div className="mt-5"><ProspectFilters value={filters} onChange={setFilters} /></div>
    <div className="mt-4 text-xs text-slate-400">{filtered.length} prospects match the current filters.</div>
    {filtered.length === 0 ? <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">No prospects match the current filters.</div> :
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map(p => <Link href={`/prospects/${p.id}`} key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-blue-200">
        <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-slate-800">{p.name}</h2><p className="mt-1 text-xs text-slate-400">{p.category}</p></div><span className="text-xs font-medium text-brand">{p.distance_meters >= 1000 ? (p.distance_meters / 1000).toFixed(1) + " km" : p.distance_meters + " m"}</span></div>
        <div className="mt-5 flex items-center justify-between"><span className="text-xs text-slate-500">{p.signalCount} evidence signal{p.signalCount === 1 ? "" : "s"}</span><span className="text-[11px] font-medium capitalize text-slate-400">{p.status.replace("_", " ")}</span></div>
        <div className="mt-4 flex gap-2"><PotentialBadge level={p.customerPotential}/><PotentialBadge level={p.partnershipPotential}/></div>
      </Link>)}</div>}
  </main></div>;
}
