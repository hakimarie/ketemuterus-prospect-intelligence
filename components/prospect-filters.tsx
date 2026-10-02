"use client";
import { RotateCcw, Search } from "lucide-react";
export type ProspectFilterState={query:string;radius:string;ecosystem:string;opportunity:string;potential:string};
export function ProspectFilters({value,onChange,categories}:{value:ProspectFilterState;onChange:(v:ProspectFilterState)=>void;categories:string[]}){
 const active=Object.entries(value).filter(([k,v])=>k!=="query"&&v!=="all").length;
 const set=(k:keyof ProspectFilterState,v:string)=>onChange({...value,[k]:v});
 return <div className="flex flex-wrap gap-2">
  <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-400"><Search size={15}/><input value={value.query} onChange={e=>set("query",e.target.value)} placeholder="Search prospect..." className="w-36 bg-transparent outline-none"/></div>
  <select value={value.radius} onChange={e=>set("radius",e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600"><option value="all">All radius</option><option value="1">0–1 km</option><option value="3">1–3 km</option><option value="5">3–5 km</option></select>
  <select value={value.ecosystem} onChange={e=>set("ecosystem",e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600"><option value="all">All ecosystems</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
  <select value={value.opportunity} onChange={e=>set("opportunity",e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600"><option value="all">Both opportunities</option><option value="customer">Customer acquisition</option><option value="partnership">Brand partnership</option></select>
  <select value={value.potential} onChange={e=>set("potential",e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600"><option value="all">All potential</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
  <button onClick={()=>onChange({query:"",radius:"all",ecosystem:"all",opportunity:"all",potential:"all"})} className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-500"><RotateCcw size={13}/> Reset</button>
 </div>;
}