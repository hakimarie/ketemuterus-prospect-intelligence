"use client";

import {
  Activity,
  ArrowUpRight,
  Building2,
  Handshake,
  Layers3,
  MapPinned,
  Radio,
  Target,
} from "lucide-react";
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
  const [filters, setFilters] =
    useState<ProspectFilterState>(defaultProspectFilters);

  const filtered = useMemo(
    () => filterProspects(mockProspects, filters),
    [filters],
  );

  const kpis = useMemo(
    () => getFilteredKpis(filtered, filters),
    [filtered, filters],
  );

  /*
   * ------------------------------------------------------------
   * ECOSYSTEM SNAPSHOT
   * ------------------------------------------------------------
   */

  const ecosystemSnapshot = ecosystemOptions.map(
    (name) =>
      [
        name,
        filtered.filter((prospect) => getEcosystem(prospect) === name)
          .length,
      ] as const,
  );

  /*
   * ------------------------------------------------------------
   * HIGH POTENTIAL
   * ------------------------------------------------------------
   */

  const highPotential = filtered
    .filter(
      (prospect) =>
        prospect.customerPotential === "high" ||
        prospect.partnershipPotential === "high",
    )
    .slice(0, 5);

  /*
   * ------------------------------------------------------------
   * SIGNALS
   * ------------------------------------------------------------
   */

  const signalProspects = filtered
    .filter((prospect) => prospect.signalCount > 0)
    .slice(0, 5);

  /*
   * ------------------------------------------------------------
   * OPPORTUNITY COUNTS
   * ------------------------------------------------------------
   */

  const mediumCount = filtered.filter(
    (prospect) =>
      prospect.customerPotential === "medium" ||
      prospect.partnershipPotential === "medium",
  ).length;

  const lowCount = filtered.filter(
    (prospect) =>
      prospect.customerPotential === "low" &&
      prospect.partnershipPotential === "low",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:pl-64">
        <div className="mx-auto max-w-[1500px] px-5 py-6 pb-24 sm:px-8">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-brand">
                <Building2 size={14} />
                Client workspace
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {mockSummary.clientName} — PIM 3
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Local Ecosystem & Partnership Intelligence ·{" "}
                {mockSummary.radiusMeters / 1000} km radius
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
              <span className="font-semibold">
                Discovery workspace
              </span>{" "}
              · Current project
            </div>
          </header>

          {/* ==================================================
              FILTERS
          ================================================== */}

          <section className="mb-5">
            <ProspectFilters
              value={filters}
              onChange={setFilters}
            />
          </section>

          {/* ==================================================
              KPI
          ================================================== */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <KpiCard
              label="Prospects identified"
              value={kpis.mapped}
              detail="Businesses & communities in current view"
              icon={<MapPinned size={19} />}
            />

            <KpiCard
              label="Customer acquisition"
              value={kpis.customer}
              detail="Prospects with customer-fit opportunity"
              icon={<Target size={19} />}
            />

            <KpiCard
              label="Brand partnership"
              value={kpis.partnership}
              detail="Prospects with partnership-fit opportunity"
              icon={<Handshake size={19} />}
            />

            <KpiCard
              label="High potential"
              value={kpis.high}
              detail="Strongest evidence fit in current view"
              icon={<Activity size={19} />}
            />

          </section>

          {/* ==================================================
              ECOSYSTEM PULSE + OPPORTUNITY LENS
          ================================================== */}

          <section className="mt-6 grid gap-4 xl:grid-cols-3">

            {/* Ecosystem Pulse */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-2">

              <div className="flex items-center justify-between">

                <div>
                  <div className="flex items-center gap-2">
                    <Layers3
                      size={17}
                      className="text-brand"
                    />

                    <h2 className="font-semibold text-ink">
                      Ecosystem pulse
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Composition of the local ecosystem in the current view
                  </p>
                </div>

                <span className="text-xs font-medium text-brand">
                  {filtered.length} mapped
                </span>

              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">

                {ecosystemSnapshot.map(([label, value]) => (

                  <div
                    key={label}
                    className="rounded-xl bg-slate-50 p-4"
                  >
                    <p className="text-xs text-slate-500">
                      {label}
                    </p>

                    <p className="mt-1 text-xl font-bold text-ink">
                      {value}
                    </p>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">

                      <div
                        className="h-full rounded-full bg-brand"
                        style={{
                          width: filtered.length
                            ? `${Math.max(
                                (value / filtered.length) * 100,
                                value ? 8 : 0,
                              )}%`
                            : "0%",
                        }}
                      />

                    </div>
                  </div>

                ))}

              </div>
            </div>

            {/* Opportunity Lens */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">

              <div className="flex items-center gap-2">
                <Activity
                  size={17}
                  className="text-brand"
                />

                <div>
                  <h2 className="font-semibold text-ink">
                    Opportunity lens
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Prioritize evidence, not a lead score
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      High
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Strongest evidence fit
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-ink">
                    {kpis.high}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Medium
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Useful secondary fit
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-ink">
                    {mediumCount}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Low
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Limited evidence
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-ink">
                    {lowCount}
                  </span>
                </div>

              </div>
            </div>

          </section>

          {/* ==================================================
              HIGH POTENTIAL + SIGNALS
          ================================================== */}

          <section className="mt-6 grid gap-4 xl:grid-cols-3">

            {/* High Potential */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-2">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="font-semibold text-ink">
                    High-potential opportunities
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Prospects with the strongest current evidence fit
                  </p>
                </div>

                <Link
                  href="/prospects"
                  className="text-xs font-medium text-brand hover:underline"
                >
                  View all
                </Link>

              </div>

              <div className="mt-4 divide-y divide-slate-100">

                {highPotential.length === 0 && (
                  <div className="py-8 text-center text-sm text-slate-400">
                    No high-potential opportunities in this view.
                  </div>
                )}

                {highPotential.map((prospect) => {

                  const customer =
                    prospect.customerPotential === "high";

                  const partnership =
                    prospect.partnershipPotential === "high";

                  const opportunity =
                    customer && partnership
                      ? "Customer acquisition + Brand partnership"
                      : customer
                        ? "Customer acquisition"
                        : "Brand partnership";

                  const distance =
                    prospect.distance_meters >= 1000
                      ? `${(
                          prospect.distance_meters / 1000
                        ).toFixed(1)} km`
                      : `${prospect.distance_meters} m`;

                  return (
                    <Link
                      key={prospect.id}
                      href={`/prospects/${prospect.id}`}
                      className="group flex items-center justify-between gap-4 py-4 first:pt-2"
                    >

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium text-slate-800">
                          {prospect.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {distance}
                          {" · "}
                          {getEcosystem(prospect)}
                          {" · "}
                          {prospect.signalCount} evidence signal
                          {prospect.signalCount === 1 ? "" : "s"}
                        </p>

                      </div>

                      <div className="flex shrink-0 items-center gap-2">

                        <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-brand sm:inline">
                          {opportunity}
                        </span>

                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                          High
                        </span>

                        <ArrowUpRight
                          size={14}
                          className="text-slate-300 transition group-hover:text-brand"
                        />

                      </div>

                    </Link>
                  );
                })}

              </div>
            </div>

            {/* Latest Signals */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">

              <div className="flex items-center justify-between">

                <div>
                  <div className="flex items-center gap-2">

                    <Radio
                      size={17}
                      className="text-brand"
                    />

                    <h2 className="font-semibold text-ink">
                      Latest ecosystem signals
                    </h2>

                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Observable signals supporting current opportunities
                  </p>
                </div>

                <Link
                  href="/pipeline"
                  className="text-xs font-medium text-brand hover:underline"
                >
                  Radar
                </Link>

              </div>

              <div className="mt-5 space-y-4">

                {signalProspects.length === 0 && (
                  <p className="py-5 text-center text-sm text-slate-400">
                    No signals in this view.
                  </p>
                )}

                {signalProspects.map((prospect) => {

                  const distance =
                    prospect.distance_meters >= 1000
                      ? `${(
                          prospect.distance_meters / 1000
                        ).toFixed(1)} km`
                      : `${prospect.distance_meters} m`;

                  return (
                    <Link
                      key={prospect.id}
                      href={`/prospects/${prospect.id}`}
                      className="group flex gap-3"
                    >

                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand">
                        <Radio size={13} />
                      </div>

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <p className="truncate text-xs font-medium text-slate-700">
                            {prospect.name}
                          </p>

                        </div>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {prospect.signalCount} evidence signal
                          {prospect.signalCount === 1 ? "" : "s"}
                          {" · "}
                          {getEcosystem(prospect)}
                          {" · "}
                          {distance}
                        </p>

                      </div>

                      <ArrowUpRight
                        size={13}
                        className="mt-1 shrink-0 text-slate-300 group-hover:text-brand"
                      />

                    </Link>
                  );
                })}

              </div>

            </div>

          </section>

          {/* ==================================================
              PROSPECT DATABASE
          ================================================== */}

          <section className="mt-6">

            <ProspectTable
              prospects={filtered}
            />

          </section>

        </div>
      </main>
    </div>
  );
}
