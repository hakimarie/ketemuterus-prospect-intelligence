export function PotentialBadge({ level }: { level: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    medium: "bg-amber-50 text-amber-700 ring-amber-600/10",
    low: "bg-slate-100 text-slate-500 ring-slate-500/10",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset ${styles[level]}`}>{level}</span>;
}