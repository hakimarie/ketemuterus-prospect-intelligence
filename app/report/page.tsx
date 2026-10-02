"use client";

import { ArrowLeft, Download, FileText, Handshake, MapPinned, Target, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { mockPipeline, mockProspects, mockSummary } from "@/lib/mock-data";
import { PotentialBadge } from "@/components/potential-badge";

export default function ReportPage() {
  const highProspects = useMemo(() => mockProspects.filter(p => p.customerPotential === "high" || p.partnershipPotential === "high"), []);
  const activePipeline = mockPipeline.filter(r => r.status !== "partnership" && r.status !== "not_interested");
  const meetings = mockPipeline.filter(r => r.status === "meeting");
  const partnerships = mockPipeline.filter(r => r.status === "partnership");

  const customerPipeline = mockPipeline.filter(r => r.opportunityType === "customer_acquisition").length;
  const partnershipPipeline = mockPipeline.filter(r => r.opportunityType === "brand_partnership").length;

  return <div className="min-h-screen bg-slate-50">
    <main className="mx-auto max-w-[1100px] px-5 py-6 pb-24 sm:px-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand"><ArrowLeft size={14}/> Dashboard</Link>

      <div className="mt-6 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-xs font-medium text-brand">KetemuTerus Prospect Intelligence</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Six Hands — PIM 3</h1><p className="mt-2 text-sm text-slate-500">Local Audience & Partnership Intelligence · {mockSummary.radiusMeters/1000} km radius</p></div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-300"><Download size={15}/> Print / Export PDF</button>
      </div>

      <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex gap-3"><FileText className="mt-0.5 text-brand" size={19}/><div><h2 className="font-semibold text-ink">Executive summary</h2><p className="mt-1 text-sm leading-6 text-slate-600">The current research set maps {mockSummary.prospects} ecosystem prospects within a {mockSummary.radiusMeters/1000} km research radius around PIM 3. The analysis separates customer-acquisition opportunities from brand-partnership opportunities and keeps evidence signals distinct from interpretation.</p></div></div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={<MapPinned size={18}/>} label="Ecosystem mapped" value={mockProspects.length} detail="Prospects" />
        <Metric icon={<Target size={18}/>} label="High potential" value={highProspects.length} detail="At least one high opportunity" />
        <Metric icon={<Users size={18}/>} label="Active pipeline" value={activePipeline.length} detail={`${customerPipeline} customer · ${partnershipPipeline} partnership`} />
        <Metric icon={<Handshake size={18}/>} label="Meetings" value={meetings.length} detail={`${partnerships.length} partnership stage`} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="font-semibold text-ink">Ecosystem snapshot</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              ["Fitness", mockProspects.filter(p => ["Pilates","Gym","Yoga","Running Community"].includes(p.category)).length],
              ["Wellness", mockProspects.filter(p => p.category === "Wellness Clinic").length],
              ["Corporate", mockProspects.filter(p => ["Coworking","Creative Agency"].includes(p.category)).length],
              ["Lifestyle", mockProspects.filter(p => ["Premium Retail","Hotel"].includes(p.category)).length],
              ["Community", mockProspects.filter(p => p.category.includes("Community")).length],
            ].map(([label,value]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-ink">{value}</p></div>)}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="font-semibold text-ink">Pipeline snapshot</h2>
          <div className="mt-4 space-y-3">{["new","qualified","contacted","responded","meeting","partnership"].map(stage => {
            const count = mockPipeline.filter(r => r.status === stage).length;
            return <div key={stage} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span className="text-xs font-medium capitalize text-slate-600">{stage}</span><span className="text-sm font-bold text-ink">{count}</span></div>;
          })}</div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-100 p-5"><h2 className="font-semibold text-ink">Priority prospects</h2><p className="mt-1 text-xs text-slate-400">Prospects with at least one high-potential opportunity in the current research set.</p></div>
        <div className="divide-y divide-slate-100">{highProspects.map(p => <div key={p.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><Link href={`/prospects/${p.id}`} className="text-sm font-semibold text-slate-700 hover:text-brand">{p.name}</Link><p className="mt-1 text-xs text-slate-400">{p.category} · {(p.distance_meters/1000).toFixed(1)} km · {p.signalCount} evidence signals</p></div><div className="flex gap-2"><PotentialBadge level={p.customerPotential}/><PotentialBadge level={p.partnershipPotential}/></div></div>)}</div>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-xs leading-5 text-amber-800"><strong>Research note:</strong> Potential levels represent the current research hypothesis based on available evidence. They are not numerical lead scores and should be validated through outreach.</section>
    </main>
  </div>;
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: number; detail: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex items-center gap-2 text-brand">{icon}<span className="text-xs font-medium text-slate-400">{label}</span></div><p className="mt-2 text-2xl font-bold text-ink">{value}</p><p className="mt-1 text-[11px] text-slate-400">{detail}</p></div>;
}
