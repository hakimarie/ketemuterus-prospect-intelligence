import type { ReactNode } from "react";

export function KpiCard({ label, value, detail, icon }: { label: string; value: string | number; detail: string; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ink">{value}</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-2.5 text-brand">{icon}</div>
      </div>
      <p className="mt-4 text-xs text-slate-400">{detail}</p>
    </div>
  );
}