"use client";

import { BriefcaseBusiness, FileText, LayoutDashboard, LogIn, Map, Users, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prospects", label: "Prospect Database", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: BriefcaseBusiness },
  { href: "/report", label: "Client Report", icon: FileText },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`fixed inset-y-0 left-0 z-20 hidden border-r border-slate-200 bg-white lg:flex lg:flex-col transition-all ${collapsed ? "w-20" : "w-64"}`}>
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
            <Map size={21} />
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-bold">Ketemu<span className="text-brand">Terus</span></div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Prospect Intelligence</div>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 px-3 py-5">
        <p className={`px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 ${collapsed ? "hidden" : ""}`}>Workspace</p>
        <nav className="space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? "bg-blue-50 text-brand" : "text-slate-500 hover:bg-slate-50"}`}>
                <Icon size={18} />
                {!collapsed && label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-100 p-3">
        <Link href="/login" className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand hover:bg-blue-50">
          <LogIn size={17} />
          {!collapsed && "Sign in"}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400">
          <ChevronLeft className={`transition-transform ${collapsed ? "rotate-180" : ""}`} size={16} />
          {!collapsed && "Collapse sidebar"}
        </button>
      </div>
    </aside>
  );
}
