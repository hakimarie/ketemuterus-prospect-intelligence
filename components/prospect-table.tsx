import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Prospect } from "@/lib/types";
import { getEcosystem } from "@/lib/prospect-filters";
import { PotentialBadge } from "./potential-badge";

export function ProspectTable({ prospects }: { prospects: Prospect[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-100 p-5"><h2 className="font-semibold text-ink">Prospect Database</h2><p className="mt-1 text-xs text-slate-400">{prospects.length} prospects in current view</p></div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-slate-100 bg-slate-50/70"><tr className="text-[10px] uppercase tracking-wider text-slate-400"><th className="px-5 py-3 font-semibold">Prospect</th><th className="px-4 py-3 font-semibold">Ecosystem</th><th className="px-4 py-3 font-semibold">Distance</th><th className="px-4 py-3 font-semibold">Customer acquisition</th><th className="px-4 py-3 font-semibold">Partnership</th><th className="px-5 py-3 font-semibold">Status</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {prospects.map(p => <tr key={p.id} className="group hover:bg-slate-50/60">
              <td className="px-5 py-4"><Link href={`/prospects/${p.id}`} className="block"><div className="font-medium text-slate-800">{p.name}</div><div className="mt-0.5 text-[11px] text-slate-400">{p.signalCount} evidence signal{p.signalCount === 1 ? "" : "s"}</div></Link></td>
              <td className="px-4 py-4"><div className="text-xs font-medium text-slate-600">{getEcosystem(p)}</div><div className="text-[11px] text-slate-400">{p.category}</div></td>
              <td className="px-4 py-4 text-xs text-slate-500">{p.distance_meters >= 1000 ? (p.distance_meters / 1000).toFixed(1) + " km" : p.distance_meters + " m"}</td>
              <td className="px-4 py-4"><PotentialBadge level={p.customerPotential}/></td>
              <td className="px-4 py-4"><PotentialBadge level={p.partnershipPotential}/></td>
              <td className="px-5 py-4"><Link href={`/prospects/${p.id}`} className="inline-flex items-center gap-1.5 text-xs capitalize text-slate-500">{p.status.replace("_", " ")}<ArrowUpRight size={13} className="opacity-0 transition group-hover:opacity-100"/></Link></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {prospects.length === 0 && <div className="p-10 text-center text-sm text-slate-500">No prospects match the current filters.</div>}
    </div>
  );
}
