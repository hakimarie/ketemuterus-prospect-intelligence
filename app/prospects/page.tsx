"use client";

import { ArrowLeft, ExternalLink, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { mockProspects } from "@/lib/mock-data";
import { PotentialBadge } from "@/components/potential-badge";

export default function ProspectsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => mockProspects.filter(p =>
    !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  return <div className="min-h-screen bg-slate-50"><main className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8">
    <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand"><ArrowLeft size={14}/> Dashboard</Link>
    <div className="mt-5 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
      <div><p className="text-xs font-medium text-brand">Six Hands — PIM 3</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">Prospect Database</h1><p className="mt-1 text-sm text-slate-500">Local businesses and communities identified around the outlet.</p></div>
      <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3"><Search size={15} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search prospect..." className="w-56 bg-transparent text-sm outline-none"/></div>
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map(p=><Link href={`/prospects/${p.id}`} key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-blue-200">
        <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-slate-800">{p.name}</h2><p className="mt-1 text-xs text-slate-400">{p.category}</p></div><ExternalLink size={16} className="text-slate-300"/></div>
        <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><MapPin size={14}/>{p.distance_meters >= 1000 ? (p.distance_meters/1000).toFixed(1)+" km" : p.distance_meters+" m"} from outlet</div>
        <div className="mt-4 flex gap-2"><PotentialBadge level={p.customerPotential}/><PotentialBadge level={p.partnershipPotential}/></div>
      </Link>)}
    </div>
  </main></div>;
}