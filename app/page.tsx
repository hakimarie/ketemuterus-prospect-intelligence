"use client";

import { Activity, Building2, Handshake, MapPinned, Target, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { KpiCard } from "@/components/kpi-card";
import { ProspectTable } from "@/components/prospect-table";
import { ProspectFilters } from "@/components/prospect-filters";
import {
  defaultProspectFilters,
  ecosystemOptions,
  filterProspects,
  getEcosystem,
  getFilteredKpis,
  type ProspectFilterState,
} from "@/lib/prospect-filters";
import { mockProspects, mockSummary } from "@/lib/mock-data";

export default function Dashboard() {
  const [filters, setFilters] = useState<ProspectFilterState>(defaultProspectFilters);
  const filtered = useMemo(() => filterProspects(mockProspects, filters), [filters]);
  const kpis = useMemo(() => getFilteredKpis(filtered, filters), [filtered, filters]);

  const ecosystemSnapshot = ecosystemOptions.map(
    (name) => [name, filtered.filter((p) => getEcosystem(p) === name).length] as const,
  );

  const highPotential = filtered
    .filter((p) => p.customerPotential === "high" || p.partnershipPotential === "high")
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-[1500px] px-5 py-6 pb-24 sm:px-8">
          <header className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-brand"><Building2 size={14} />Client workspace</div>
              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{mockSummary.clientName} — PIM 3</h1>
              <p className="mt-1 text-sm text-slate-500">Local Ecosystem & Partnership Intelligence · {mockSummary.radiusMeters / 1000} km radius</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700"><span className="font-semibold">Discovery workspace</span> · Current project</div>
          </header>

          <section className="mb-5"><ProspectFilters value={filters} onChange={setFilters} /></section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Prospects identified" value={kpis.mapped} detail="Businesses & communities in current view" icon={<MapPinned size={19} />} />
            <KpiCard label="Customer acquisition" value={kpis.customer} detail="Prospects with customer-fit opportunity" icon={<Target size={19} />} />
            <KpiCard label="Brand partnership" value={kpis.partnership} detail="Prospects with partnership-fit opportunity" icon={<Handshake size={19} />} />
            <KpiCard label="High potential" value={kpis.high} detail="Strongest evidence fit in current view" icon={<Activity size={19} />} />
          </section>

          <section className="mt-6 grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-2">
              <div className="flex items-center justify-between">
                <div><h2 className="font-semibold text-ink">Local ecosystem</h2><p className="mt-1 text-xs text-slate-400">What surrounds the outlet within the selected view</p></div>
                <span className="text-xs font-medium text-brand">{filtered.length} mapped</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {ecosystemSnapshot.map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-xl font-bold text-ink">{value}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-brand" style={{ width: filtered.length ? Math.max((value / filtered.length) * 100, value ? 8 : 0) : 0 }} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div><h2 className="font-semibold text-ink">Opportunity lens</h2><p className="mt-1 text-xs text-slate-400">Prioritize evidence, not a lead score</p></div>
                <Activity size={17} className="text-slate-300" />
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["High", kpis.high, "Strongest evidence fit"],
                  ["Medium", filtered.filter((p) => p.customerPotential === "medium" || p.partnershipPotential === "medium").length, "Useful secondary fit"],
                  ["Low", filtered.filter((p) => p.customerPotential === "low" && p.partnershipPotential === "low").length, "Limited evidence"],
                ].map(([level, count, note]) => (
                  <div key={level} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <div><p className="text-sm font-medium text-slate-700">{level}</p><p className="text-[11px] text-slate-400">{note}</p></div>
                    <span className="text-sm font-semibold text-ink">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-2">
              <div className="flex items-center justify-between">
                <div><h2 className="font-semibold text-ink">High-potential opportunities</h2><p className="mt-1 text-xs text-slate-400">Prospects with the strongest current evidence fit</p></div>
                <Link href="/prospects" className="text-xs font-medium text-brand hover:underline">View all</Link>
              </div>
              <div className="mt-4 divide-y divide-slate-100">
                {highPotential.map((prospect) => {
                  const customer = prospect.customerPotential === "high";
                  const partnership = prospect.partnershipPotential === "high";
                  const opportunity = customer && partnership ? "Customer acquisition + Brand partnership" : customer ? "Customer acquisition" : "Brand partnership";
                  return (
                    <Link key={prospect.id} href={"/prospects/" + prospect.id} className="group flex items-center justify-between gap-4 py-4 first:pt-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{prospect.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{prospect.distance_meters >= 1000 ? (prospect.distance_meters / 1000).toFixed(1) + " km" : prospect.distance_meters + " m"}{" · "}{getEcosystem(prospect)}{" · "}{prospect.signalCount} evidence signal{prospect.signalCount === 1 ? "" : "s"}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-brand sm:inline">{opportunity}</span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">High</span>
                        <ArrowUpRight size={14} className="text-slate-300 transition group-hover:text-brand" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div><h2 className="font-semibold text-ink">Discovery activity</h2><p className="mt-1 text-xs text-slate-400">Latest intelligence signals</p></div>
                <Activity size={17} className="text-slate-300" />
              </div>
              <div className="mt-5 space-y-4">
                {highPotential.slice(0, 4).map((prospect) => (
                  <Link key={prospect.id} href={"/prospects/" + prospect.id} className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    <div><p className="text-xs font-medium text-slate-700">High-potential prospect identified</p><p className="mt-0.5 text-xs text-slate-400">{prospect.name}</p></div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6"><ProspectTable prospects={filtered} /></section>
        </div>
      </main>
    </div>
  );
}
