"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { mockProspects } from "@/lib/mock-data";

const stages = ["new","qualified","contacted","responded","meeting","partnership"] as const;
const labels: Record<string,string> = {new:"New",qualified:"Qualified",contacted:"Contacted",responded:"Responded",meeting:"Meeting",partnership:"Partnership"};

export default function PipelinePage() {
  const [type, setType] = useState("both");
  return <div className="min-h-screen bg-slate-50"><main className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8">
    <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand"><ArrowLeft size={14}/> Dashboard</Link>
    <div className="mt-5 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-medium text-brand">Six Hands — PIM 3</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">Prospect Pipeline</h1><p className="mt-1 text-sm text-slate-500">Track outreach from qualification to partnership.</p></div><select value={type} onChange={e=>setType(e.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600"><option value="both">Both opportunity types</option><option value="customer_acquisition">Customer acquisition</option><option value="brand_partnership">Brand partnership</option></select></div>
    <div className="mt-6 grid min-w-[1100px] grid-cols-6 gap-3 overflow-x-auto pb-4">
      {stages.map((stage,i)=><div key={stage} className="min-h-[420px] rounded-2xl border border-slate-200 bg-white p-3 shadow-soft"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold text-slate-700">{labels[stage]}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400">{i < 2 ? 2 : i === 2 ? 1 : 0}</span></div>
        {mockProspects.filter((_,idx)=>idx===i || (stage==="qualified" && i===1)).map(p=><div key={p.id+stage} className="mb-2 rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="text-xs font-semibold text-slate-700">{p.name}</p><p className="mt-1 text-[10px] text-slate-400">{type==="brand_partnership"?"Brand partnership":"Opportunity"} · {p.category}</p><button className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-brand"><Plus size={11}/> Follow up</button></div>)}
      </div>)}
    </div>
  </main></div>;
}