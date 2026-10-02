import type { Prospect } from "./types";
import { createSupabaseBrowserClient } from "./supabase";

export async function getProspectsFromSupabase(projectId: string): Promise<Prospect[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Supabase environment variables are not configured.");

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("prospects")
    .select("id,name,subcategory,distance_meters,status,category_id,ecosystem_categories(name),prospect_opportunities(opportunity_type,potential_level),prospect_signals(id)")
    .eq("project_id", projectId)
    .order("distance_meters", { ascending: true });

  if (error) {
    console.error("Supabase prospects query failed:", error);
    throw new Error(
      [error.message, error.details, error.hint, error.code].filter(Boolean).join(" | ") ||
        "Failed to load prospects."
    );
  }

  return (data ?? []).map((row: any) => {
    const opportunities = row.prospect_opportunities ?? [];
    const customer = opportunities.find((o: any) => o.opportunity_type === "customer_acquisition");
    const partnership = opportunities.find((o: any) => o.opportunity_type === "brand_partnership");
    return {
      id: row.id,
      name: row.name,
      category: row.ecosystem_categories?.name ?? row.subcategory ?? "Uncategorized",
      subcategory: row.subcategory,
      distance_meters: row.distance_meters ?? 0,
      status: row.status,
      customerPotential: customer?.potential_level ?? "medium",
      partnershipPotential: partnership?.potential_level ?? "medium",
      signalCount: (row.prospect_signals ?? []).length,
    };
  });
}
