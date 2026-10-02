"use client";

import { BarChart3, BriefcaseBusiness, FileText, LayoutDashboard, Map, Users, ChevronDown } from "lucide-react";
import { useState } from "react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Prospect Database", icon: Users },
  { label: "Pipeline", icon: BriefcaseBusiness },
  { label: "Client Report", icon: FileText },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={`fixed inset-y-0 left-0 z-20 hidden border-r border-slate-200 bg-white lg:flex lg:flex-col transition-all ${collapsed ? "w-20" : "w-64"}`}>
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
          <Map size={21} strokeWidth={2.4} />
        </div>
        {!collapsed && <div><div className="text-sm font-bold tracking-tight text-ink">Ketemu<span className="text-brand">Terus</span></div><div className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">Prospect Intelligence</div></div>}
      </div>
      <div className="flex-1 px-3 py-5">
        {!collapsed && <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Workspace</p>}
        <nav className="space-y-1">
          {items.map(({ label, icon: Icon, active }) => (
            <button key={label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? "bg-blue-50 text-brand" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
              <Icon size={18} />
              {!collapsed && label}
            </button>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-100 p-3">
        <button onClick={() => setCollapsed(!collapsed)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-50">
          <ChevronDown className={`rotate-90 transition-transform ${collapsed ? "rotate-180" : ""}`} size={16} />
          {!collapsed && "Collapse sidebar"}
        </button>
      </div>
    </aside>
  );
}