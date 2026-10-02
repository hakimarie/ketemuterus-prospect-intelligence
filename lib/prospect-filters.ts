import type { Prospect } from "./types";

export type ProspectFilterState = {
  query: string;
  radius: string;
  ecosystem: string;
  opportunity: string;
  potential: string;
};

export const defaultProspectFilters: ProspectFilterState = {
  query: "",
  radius: "all",
  ecosystem: "all",
  opportunity: "all",
  potential: "all",
};

export const ecosystemOptions = ["Fitness", "Wellness", "Corporate", "Lifestyle", "Community"];

export function getEcosystem(prospect: Prospect) {
  const category = prospect.category.toLowerCase();
  if (["pilates", "gym", "yoga", "running", "cycling"].some(v => category.includes(v))) return "Fitness";
  if (["wellness", "clinic", "nutrition", "physio"].some(v => category.includes(v))) return "Wellness";
  if (["coworking", "agency", "corporate", "office", "consult"].some(v => category.includes(v))) return "Corporate";
  if (["hotel", "retail", "lifestyle", "coffee", "beauty"].some(v => category.includes(v))) return "Lifestyle";
  if (["community", "event"].some(v => category.includes(v))) return "Community";
  return "Lifestyle";
}

export function filterProspects(prospects: Prospect[], filters: ProspectFilterState) {
  const q = filters.query.trim().toLowerCase();
  return prospects.filter(p => {
    const queryMatch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const radiusMatch =
      filters.radius === "all" ||
      (filters.radius === "1" && p.distance_meters <= 1000) ||
      (filters.radius === "3" && p.distance_meters > 1000 && p.distance_meters <= 3000) ||
      (filters.radius === "5" && p.distance_meters > 3000 && p.distance_meters <= 5000);
    const ecosystemMatch = filters.ecosystem === "all" || getEcosystem(p) === filters.ecosystem;
    const potentialMatch =
      filters.potential === "all" ||
      (filters.opportunity === "customer" && p.customerPotential === filters.potential) ||
      (filters.opportunity === "partnership" && p.partnershipPotential === filters.potential) ||
      (filters.opportunity === "all" && (p.customerPotential === filters.potential || p.partnershipPotential === filters.potential));
    return queryMatch && radiusMatch && ecosystemMatch && potentialMatch;
  });
}

export function getFilteredKpis(prospects: Prospect[], filters: ProspectFilterState) {
  const customer = filters.opportunity === "partnership" ? 0 : prospects.length;
  const partnership = filters.opportunity === "customer" ? 0 : prospects.length;
  const high = prospects.filter(p => {
    if (filters.opportunity === "customer") return p.customerPotential === "high";
    if (filters.opportunity === "partnership") return p.partnershipPotential === "high";
    return p.customerPotential === "high" || p.partnershipPotential === "high";
  }).length;
  return { mapped: prospects.length, customer, partnership, high };
}
