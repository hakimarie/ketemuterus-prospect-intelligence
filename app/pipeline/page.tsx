"use client";

import { ArrowLeft, CalendarDays, ChevronRight, MessageSquareText, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PotentialBadge } from "@/components/potential-badge";
import { getPipelineRecords, getProspectsFromSupabase } from "@/lib/prospect-data";
import type { OpportunityType, PipelineRecord, Prospect, ProspectStatus } from "@/lib/types";

const PROJECT_ID = process.env.NEXT_PUBLIC_PROSPECT_PROJECT_ID ?? "";
const stages: ProspectStatus[] = ["new", "qualified", "contacted", "responded", "meeting", "partnership"];
const labels: Record<ProspectStatus, string> = {
  new: "New",
  qualified: "Qualified",
  contacted: "Contacted",
  responded: "Responded",
  meeting: "Meeting",
  partnership: "Partnership",
  not_interested: "Not Interested",
};

type PipelineViewRecord = PipelineRecord & { prospect: Prospect };

export default function PipelinePage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [pipeline, setPipeline] = useState<PipelineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState<"both" | OpportunityType>("both");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    if (!PROJECT_ID) {
      setError("Project ID is not configured.");
      setLoading(false);
      return;
    }

    Promise.all([getProspectsFromSupabase(PROJECT_ID), getPipelineRecords(PROJECT_ID)])
      .then(([prospectData, pipelineData]) => {
        if (!active) return;
        setProspects(prospectData);
        setPipeline(pipelineData);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load pipeline.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const records = useMemo<PipelineViewRecord[]>(() => {
    const byId = new Map(prospects.map((prospect) => [prospect.id, prospect]));

    return pipeline
      .map((record) => {
        const prospect = byId.get(record.prospectId);
        return prospect ? { ...record, prospect } : null;
      })
      .filter((record): record is PipelineViewRecord => Boolean(record))
      .filter((record) => {
        const matchesType = type === "both" || record.opportunityType === type;
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          record.prospect.name.toLowerCase().includes(q) ||
          record.prospect.category.toLowerCase().includes(q);
        return matchesType && matchesQuery;
      });
  }, [prospects, pipeline, type, query]);

  const potentialFor = (prospect: Prospect, opportunityType: OpportunityType) =>
    opportunityType === "customer_acquisition"
      ? prospect.customerPotential
      : prospect.partnershipPotential;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-soft">
            Loading pipeline...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <strong>Unable to load pipeline.</strong>
            <p className="mt-1">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-[1500px] px-5 py-6 pb-24 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand">
          <ArrowLeft size={14} /> Dashboard
        </Link>

        <div className="mt-5 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium text-brand">Six Hands — PIM 3</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">Prospect Pipeline</h1>
            <p className="mt-1 text-sm text-slate-500">Track outreach from qualification to partnership.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
              <Search size={15} className="text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pipeline..." className="w-44 bg-transparent text-sm outline-none" />
            </div>
            <select value={type} onChange={(e) => setType(e.target.value as "both" | OpportunityType)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
              <option value="both">Both opportunity types</option>
              <option value="customer_acquisition">Customer acquisition</option>
              <option value="brand_partnership">Brand partnership</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{records.length}</span> active pipeline records
          <span className="text-slate-300">·</span> Only opportunities explicitly added to pipeline are shown.
        </div>

        {records.length === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm font-semibold text-slate-700">Belum ada opportunity di pipeline.</p>
            <p className="mt-1 text-xs text-slate-500">Buka Prospect Database, pilih prospect, lalu tambahkan opportunity ke pipeline.</p>
            <Link href="/prospects" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">
              <Plus size={15} /> Prospect Database
            </Link>
          </div>
        )}

        {records.length > 0 && (
          <div className="mt-5 overflow-x-auto pb-4">
            <div className="grid min-w-[1180px] grid-cols-6 gap-3">
              {stages.map((stage) => {
                const stageRecords = records.filter((record) => record.status === stage);

                return (
                  <div key={stage} className="min-h-[500px] rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">{labels[stage]}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400">{stageRecords.length}</span>
                    </div>

                    <div className="space-y-2">
                      {stageRecords.map((record) => {
                        const potential = potentialFor(record.prospect, record.opportunityType);

                        return (
                          <div key={record.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                            <Link href={`/prospects/${record.prospect.id}`} className="block">
                              <p className="text-xs font-semibold text-slate-700 hover:text-brand">{record.prospect.name}</p>
                              <p className="mt-1 text-[10px] text-slate-400">{record.prospect.category}</p>
                            </Link>

                            <div className="mt-2 flex items-center justify-between gap-2">
                              <span className="text-[10px] font-medium text-brand">
                                {record.opportunityType === "customer_acquisition" ? "Customer acquisition" : "Brand partnership"}
                              </span>
                              <PotentialBadge level={potential} />
                            </div>

                            {record.nextFollowupAt && (
                              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
                                <CalendarDays size={12} /> {record.nextFollowupAt}
                              </div>
                            )}

                            <button type="button" className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-brand">
                              <MessageSquareText size={11} /> Follow up <ChevronRight size={11} />
                            </button>
                          </div>
                        );
                      })}

                      {stageRecords.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-[10px] text-slate-400">
                          No records
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-2 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700">
          <div className="flex gap-2">
            <Plus size={14} className="mt-0.5 shrink-0" />
            <p>
              <strong>Pipeline workflow:</strong> opportunities enter this board only after they are explicitly activated from Prospect Detail.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
