"use client";

import { ArrowLeft, CalendarDays, ChevronRight, MessageSquareText, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { mockPipeline, mockProspects } from "@/lib/mock-data";
import type { OpportunityType, ProspectStatus } from "@/lib/types";
import { PotentialBadge } from "@/components/potential-badge";

const stages: ProspectStatus[] = ["new", "qualified", "contacted", "responded", "meeting", "partnership"];
const labels: Record<ProspectStatus, string> = { new:"New", qualified:"Qualified", contacted:"Contacted", responded:"Responded", meeting:"Meeting", partnership:"Partnership", not_interested:"Not Interested" };

export default function PipelinePage() {
  const [type, setType] = useState<"both" | OpportunityType>("both");
  const [query, setQuery] = useState("");

  const records = useMemo(() => mockPipeline.filter(record => {
    const prospect = mockProspects.find(p => p.id === record.prospectId);
    if (!prospect) return false;
    const matchesType = type === "both" || record.opportunityType === type;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || prospect.name.toLowerCase().includes(q) || prospect.category.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  }), [type, query]);

  const getProspect = (id: string) => mockProspects.find(p => p.id === id)!;
  const potentialFor = (id: string, opportunityType: OpportunityType) => {
    const p = getProspect(id);
    return opportunityType === "customer_acquisition" ? p.customerPotential : p.partnershipPotential;
  };

  return <div className="min-h-screen bg-slate-50">
    <main className="mx-auto max-w-[1500px] px-5 py-6 pb-24 sm:px-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand"><ArrowLeft size={14}/> Dashboard</Link>

      <div className="mt-5 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div><p className="text-xs font-medium text-brand">Six Hands — PIM 3</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">Prospect Pipeline</h1><p className="mt-1 text-sm text-slate-500">Track outreach from qualification to partnership.</p></div>
        <div className="flex flex-wrap gap-2">
          <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3"><Search size={15} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search pipeline..." className="w-44 bg-transparent text-sm outline-none"/></div>
          <select value={type} onChange={e=>setType(e.target.value as "both" | OpportunityType)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600"><option value="both">Both opportunity types</option><option value="customer_acquisition">Customer acquisition</option><option value="brand_partnership">Brand partnership</option></select>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><span className="font-semibold text-slate-700">{records.length}</span> active pipeline records <span className="text-slate-300">·</span> Each record represents one prospect + opportunity type.</div>

      <div className="mt-5 overflow-x-auto pb-4">
        <div className="grid min-w-[1180px] grid-cols-6 gap-3">
          {stages.map(stage => {
            const stageRecords = records.filter(r => r.status === stage);
            return <div key={stage} className="min-h-[500px] rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
              <div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold text-slate-700">{labels[stage]}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400">{stageRecords.length}</span></div>
              <div className="space-y-2">
                {stageRecords.map(record => {
                  const p = getProspect(record.prospectId);
                  const potential = potentialFor(record.prospectId, record.opportunityType);
                  return <div key={record.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <Link href={`/prospects/${p.id}`} className="block"><p className="text-xs font-semibold text-slate-700 hover:text-brand">{p.name}</p><p className="mt-1 text-[10px] text-slate-400">{p.category}</p></Link>
                    <div className="mt-2 flex items-center justify-between gap-2"><span className="text-[10px] font-medium text-brand">{record.opportunityType === "customer_acquisition" ? "Customer acquisition" : "Brand partnership"}</span><PotentialBadge level={potential}/></div>
                    {record.nextFollowupAt && <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500"><CalendarDays size={12}/>{record.nextFollowupAt}</div>}
                    {record.notes && <p className="mt-2 text-[10px] leading-4 text-slate-500">{record.notes}</p>}
                    <button className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-brand"><MessageSquareText size={11}/> Follow up<ChevronRight size={11}/></button>
                  </div>;
                })}
                {stageRecords.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-[10px] text-slate-400">No records</div>}
              </div>
            </div>;
          })}
        </div>
      </div>

      <div className="mt-2 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700"><div className="flex gap-2"><Plus size={14} className="mt-0.5 shrink-0"/><p><strong>Next workflow:</strong> when connected to Supabase, “Add to Pipeline” will create the selected opportunity record here and outreach actions will update its status and follow-up dates.</p></div></div>
    </main>
  </div>;
}
