import { Activity, Building2, Handshake, MapPinned, Target } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { KpiCard } from "@/components/kpi-card";
import { ProspectTable } from "@/components/prospect-table";
import { mockProspects, mockSummary } from "@/lib/mock-data";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8">
          <header className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-brand"><Building2 size={14}/> Client workspace</div>
              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{mockSummary.clientName} — PIM 3</h1>
              <p className="mt-1 text-sm text-slate-500">Local Ecosystem & Partnership Intelligence · {mockSummary.radiusMeters / 1000} km radius</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
              <span className="font-semibold">Prototype data</span> · mock discovery
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Local ecosystem mapped" value={mockSummary.prospects} detail="Prospects in current project" icon={<MapPinned size={19}/>} />
            <KpiCard label="Customer acquisition" value={mockSummary.customerAcquisition} detail="Opportunity records" icon={<Target size={19}/>} />
            <KpiCard label="Brand & partnership" value={mockSummary.brandPartnership} detail="Opportunity records" icon={<Handshake size={19}/>} />
            <KpiCard label="High potential" value={mockSummary.highPotential} detail="Based on current evidence" icon={<Activity size={19}/>} />
          </section>

          <section className="mt-6 grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-2">
              <div className="flex items-center justify-between">
                <div><h2 className="font-semibold text-ink">Ecosystem snapshot</h2><p className="mt-1 text-xs text-slate-400">Current prospect mix around the outlet</p></div>
                <span className="text-xs font-medium text-brand">3 km</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Fitness", 3], ["Wellness", 2], ["Corporate", 2], ["Lifestyle", 3],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-ink">{value}</p></div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <h2 className="font-semibold text-ink">Opportunity lens</h2>
              <p className="mt-1 text-xs text-slate-400">Potential, not a numerical lead score</p>
              <div className="mt-5 space-y-4">
                {[["High","8 prospects","Strongest evidence fit"],["Medium","5 prospects","Useful secondary fit"],["Low","1 prospect","Limited evidence"]].map(([level,count,note]) => (
                  <div key={level} className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-700">{level}</p><p className="text-[11px] text-slate-400">{note}</p></div><span className="text-sm font-semibold text-ink">{count}</span></div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6"><ProspectTable prospects={mockProspects} /></section>
        </div>
      </main>
    </div>
  );
}