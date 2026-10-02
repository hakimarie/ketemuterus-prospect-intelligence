import { ArrowLeft, ExternalLink, Lightbulb, MapPin, MessageSquareText, ShieldCheck, Target } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEcosystem } from "@/lib/prospect-filters";
import { mockProspects } from "@/lib/mock-data";
import { PotentialBadge } from "@/components/potential-badge";

const activationMap: Record<string, string[]> = {
  "PIM Premium Pilates": ["Post-workout meal offer", "Member referral benefit", "Co-branded wellness activation"],
  "South Jakarta Wellness Club": ["Member dining offer", "Fitness community referral", "Wellness event collaboration"],
  "Urban Yoga House": ["Post-class healthy meal offer", "Community referral", "Joint wellness content"],
  "Jakarta Wellness Clinic": ["Healthy meal recommendation", "Patient wellness collaboration", "Co-branded health activation"],
  "South Jakarta Coworking": ["Office lunch offer", "Member perk partnership", "Corporate wellness activation"],
  "Jakarta Creative Studio": ["Team lunch offer", "Creative community collaboration", "Local brand activation"],
  "Premium Lifestyle Store": ["Cross-promotion", "Customer referral", "Lifestyle event collaboration"],
  "Pondok Indah Business Hotel": ["Guest dining recommendation", "Hotel guest offer", "Concierge partnership"],
  "South Jakarta Running Community": ["Post-run meal offer", "Community referral", "Running event collaboration"],
  "Healthy Lifestyle Community": ["Community dining offer", "Referral campaign", "Healthy lifestyle event"],
};

function potentialDescription(level: string) {
  if (level === "high") return "Strongest current evidence fit within this opportunity lens.";
  if (level === "medium") return "Useful secondary fit that may warrant targeted outreach.";
  return "Limited evidence fit; keep as a lower-priority research opportunity.";
}

export default async function ProspectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prospect = mockProspects.find(p => p.id === id);
  if (!prospect) notFound();

  const ecosystem = getEcosystem(prospect);
  const activations = activationMap[prospect.name] ?? ["Local referral offer", "Community activation", "Co-marketing collaboration"];

  return <div className="min-h-screen bg-slate-50">
    <main className="mx-auto max-w-[1100px] px-5 py-6 pb-24 sm:px-8">
      <Link href="/prospects" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand"><ArrowLeft size={14}/> Prospect Database</Link>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand">{ecosystem}</span><span className="text-xs text-slate-400">{prospect.category}</span></div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">{prospect.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500"><span className="inline-flex items-center gap-2"><MapPin size={15}/>{prospect.distance_meters >= 1000 ? (prospect.distance_meters / 1000).toFixed(1) + " km" : prospect.distance_meters + " m"} from Six Hands — PIM 3</span><span className="capitalize">{prospect.status.replace("_", " ")}</span></div>
          </div>
          <Link href="/pipeline" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"><MessageSquareText size={16}/> Add to Pipeline</Link>
        </div>
      </div>

      <section className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Customer Acquisition</p><div className="mt-2"><PotentialBadge level={prospect.customerPotential}/></div></div><Target size={19} className="text-brand"/></div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{potentialDescription(prospect.customerPotential)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Brand & Partnership</p><div className="mt-2"><PotentialBadge level={prospect.partnershipPotential}/></div></div><MessageSquareText size={19} className="text-brand"/></div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{potentialDescription(prospect.partnershipPotential)}</p>
        </div>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft md:col-span-2">
          <h2 className="font-semibold text-ink">Why this prospect?</h2>
          <div className="mt-5 space-y-4">
            <div className="flex gap-3"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-brand"/><div><p className="text-sm font-medium text-slate-700">Evidence signals</p><p className="mt-1 text-xs leading-5 text-slate-500">{prospect.signalCount} observable signal{prospect.signalCount === 1 ? "" : "s"} are attached to this prospect in the current research set.</p></div></div>
            <div className="flex gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-brand"/><div><p className="text-sm font-medium text-slate-700">Proximity</p><p className="mt-1 text-xs leading-5 text-slate-500">The prospect is inside the configured 3 km research radius around the outlet.</p></div></div>
            <div className="flex gap-3"><Target size={17} className="mt-0.5 shrink-0 text-brand"/><div><p className="text-sm font-medium text-slate-700">Audience affinity</p><p className="mt-1 text-xs leading-5 text-slate-500">The {ecosystem.toLowerCase()} ecosystem is treated as an audience or partnership hypothesis, not a confirmed customer segment.</p></div></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="font-semibold text-ink">Potential activations</h2>
          <ul className="mt-4 space-y-3 text-xs text-slate-600">{activations.map(item => <li key={item} className="flex gap-2"><Lightbulb size={14} className="mt-0.5 shrink-0 text-brand"/><span>{item}</span></li>)}</ul>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-ink">Research evidence</h2><p className="mt-1 text-xs text-slate-400">Evidence is separated from the opportunity interpretation.</p></div><span className="text-xs font-medium text-slate-500">{prospect.signalCount} signal{prospect.signalCount === 1 ? "" : "s"}</span></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Observed</p><p className="mt-1 text-xs leading-5 text-slate-600">Prospect is categorized under {prospect.category} and located {prospect.distance_meters} meters from the outlet.</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Interpretation</p><p className="mt-1 text-xs leading-5 text-slate-600">Current potential levels are research hypotheses based on the available mock evidence set.</p></div></div>
      </section>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-xs text-amber-800"><span><strong>Prototype data:</strong> evidence, activations, and potential levels are currently mock research data.</span><Link href="/report" className="inline-flex items-center gap-1 font-semibold hover:underline">Client report <ExternalLink size={13}/></Link></div>
    </main>
  </div>;
}
