"use client";
import { BriefcaseBusiness, FileText, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items=[["/","Dashboard",LayoutDashboard],["/prospects","Prospects",Users],["/pipeline","Pipeline",BriefcaseBusiness],["/report","Report",FileText]] as const;

export function MobileNav(){
  const pathname=usePathname();
  return <nav className="sticky bottom-3 z-30 mx-3 flex items-center justify-around rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur lg:hidden">
    {items.map(([href,label,Icon])=>{
      const active=href==="?" ? pathname==="?" : pathname.startsWith(href);
      return <Link key={href} href={href} className={active ? "flex min-w-16 flex-col items-center gap-1 rounded-xl bg-blue-50 px-2 py-2 text-[10px] font-medium text-brand" : "flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium text-slate-400"}><Icon size={17}/>{label}</Link>
    })}
  </nav>
}