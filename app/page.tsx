"use client";

import { Activity, Building2, Handshake, MapPinned, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { KpiCard } from "@/components/kpi-card";
import { ProspectTable } from "@/components/prospect-table";
import { ProspectFilters } from "@/components/prospect-filters";
import { defaultProspectFilters, ecosystemOptions, filterProspects, getEcosystem, getFilteredKpis, type ProspectFilterState } from "@/lib/prospect-filters";
import { mockProspects, mockSummary } from "@/lib/mock-data";

export default function Dashboard() {
  const [filters, setFilters] = useState<ProspectFilterState>(defaultProspectFilters);
  const filtered = useMemo(() => filterProspects(mockProspects, filters), [filters]);
  const kpis = useMemo(() => getFilteredKpis(filtered, filters), [filtered, filters]);
  const ecosystemSnapshot = ecosystemOptions.map(name => [name, filtered.filter(p => getEcosystem(p) === name).length] as const);
  const highCount = kpis.high;
  const mediumCount = filtered.filter(p => {
    if (filters.opportunity === "customer") return p.customerPotential === "medium";
    if (filters.opportunity === "partnership") return p.partnershipPotential === "medium";
    return p.customerPotential === "medium" || p.partnershipPotential === "medium";
  }).length;
  const lowCount = Math.max(filtered.length - highCount - mediumCount, 0);

  return <div className="min-h-screen bg-slate-50">
    <Sidebar />
    <main className="lg:pl-64"><div className="mx-auto max-w-[1500px] px-5 py-6 pb-24 sm:px-8">
      <header className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div><div className="mb-2 flex items-center gap-2 text-xs font-medium text-brand"><Building2 size={14}/> Client workspace</div><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{mockSummary.clientName} — PIM 3</h1><p className="mt-1 text-sm text-slate-500">Local Ecosystem & Partnership Intelligence · {mockSummary.radiusMeters / 1000} km radius</p></div>
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700"><span className="font-semibold">Prototype data</span> · mock discovery</div>
      </header>

      <section className="mb-5"><ProspectFilters value={filters} onChange={setFilters} /></section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Local ecosystem mapped" value={kpis.mapped} detail="Prospects in current view" icon={<MapPinned size={19}/>} />
        <KpiCard label="Customer acquisition" value={kpis.customer} detail="Matching opportunity records" icon={<Target size={19}/>} />
        <KpiCard label="Brand & partnership" value={kpis.partnership} detail="Matching opportunity records" icon={<Handshake size={19}/>} />
        <KpiCard label="High potential" value={kpis.high} detail="Based on current filtered view" icon={<Activity size={19}/>} />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-2">
          <div className="flex items-center justify-between"><div><h2 className="font-semibold text-ink">Ecosystem snapshot</h2><p className="mt-1 text-xs text-slate-400">Current prospect mix around the outlet</p></div><span className="text-xs font-medium text-brand">Filtered view</span></div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">{ecosystemSnapshot.map(([label,value]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-ink">{value}</p></div>)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h2 className="font-semibold text-ink">Opportunity lens</h2><p className="mt-1 text-xs text-slate-400">Potential, not a numerical lead score</p><div className="mt-5 space-y-4">
          {[["High",highCount,"Strongest evidence fit"],["Medium",mediumCount,"Useful secondary fit"],["Low",lowCount,"Limited evidence"]].map(([level,count,note]) => <div key={level} className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-700">{level}</p><p className="text-[11px] text-slate-400">{note}</p></div><span className="text-sm font-semibold text-ink">{count}</span></div>)}
        </div></div>
      </section>

      <section className="mt-6"><ProspectTable prospects={filtered} /></section>
    </div></main>
  </div>;
}
