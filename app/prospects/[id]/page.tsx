import { ArrowLeft, Lightbulb, MapPin, MessageSquareText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mockProspects } from "@/lib/mock-data";
import { PotentialBadge } from "@/components/potential-badge";

export default async function ProspectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prospect = mockProspects.find(p => p.id === id);
  if (!prospect) notFound();

  return <div className="min-h-screen bg-slate-50"><main className="mx-auto max-w-[1100px] px-5 py-6 sm:px-8">
    <Link href="/prospects" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand"><ArrowLeft size={14}/> Prospect Database</Link>
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div><p className="text-xs font-medium text-brand">{prospect.category}</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">{prospect.name}</h1><div className="mt-3 flex items-center gap-2 text-sm text-slate-500"><MapPin size={15}/>{(prospect.distance_meters/1000).toFixed(1)} km from Six Hands — PIM 3</div></div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"><MessageSquareText size={16}/> Add to Pipeline</button>
      </div>
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><p className="text-xs font-medium text-slate-400">Customer Acquisition</p><div className="mt-2"><PotentialBadge level={prospect.customerPotential}/></div><p className="mt-4 text-sm leading-6 text-slate-600">Potential audience overlap based on the current ecosystem hypothesis and available evidence.</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><p className="text-xs font-medium text-slate-400">Brand & Partnership</p><div className="mt-2"><PotentialBadge level={prospect.partnershipPotential}/></div><p className="mt-4 text-sm leading-6 text-slate-600">Potential for co-marketing, community activation, referral, or local partnership.</p></div>
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft md:col-span-2"><h2 className="font-semibold text-ink">Why this prospect?</h2><div className="mt-4 space-y-3"><div className="flex gap-3"><ShieldCheck size={17} className="mt-0.5 text-brand"/><div><p className="text-sm font-medium text-slate-700">Evidence signals</p><p className="text-xs leading-5 text-slate-500">{prospect.signalCount} observable signal{prospect.signalCount===1?"":"s"} in the current research set.</p></div></div><div className="flex gap-3"><MapPin size={17} className="mt-0.5 text-brand"/><div><p className="text-sm font-medium text-slate-700">Proximity</p><p className="text-xs leading-5 text-slate-500">Located within the configured 3 km research radius.</p></div></div></div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h2 className="font-semibold text-ink">Potential activations</h2><ul className="mt-4 space-y-3 text-xs text-slate-600"><li className="flex gap-2"><Lightbulb size={14}/>Post-workout meal offer</li><li className="flex gap-2"><Lightbulb size={14}/>Community referral</li><li className="flex gap-2"><Lightbulb size={14}/>Co-branded local activation</li></ul></div>
    </div>
  </main></div>;
}