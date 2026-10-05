import type { OpportunityType, PipelineRecord, Prospect } from "./types";
import { createSupabaseBrowserClient } from "./supabase";

const prospectSelect = "id,name,subcategory,distance_meters,status,category_id,ecosystem_categories(name),prospect_opportunities(opportunity_type,potential_level),prospect_signals(id)";

function mapProspect(row: any): Prospect {
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
}

export async function getProspectsFromSupabase(projectId: string): Promise<Prospect[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("prospects")
    .select(prospectSelect)
    .eq("project_id", projectId)
    .order("distance_meters", { ascending: true });

  if (error) {
    console.error("Supabase prospects query failed:", error);
    throw new Error([error.message, error.details, error.hint, error.code].filter(Boolean).join(" | ") || "Failed to load prospects.");
  }

  return (data ?? []).map(mapProspect);
}

export async function getProspectById(id: string): Promise<Prospect | null> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("prospects")
    .select(prospectSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase prospect detail query failed:", error);
    throw new Error([error.message, error.details, error.hint, error.code].filter(Boolean).join(" | ") || "Failed to load prospect.");
  }

  return data ? mapProspect(data) : null;
}

export async function getPipelineRecords(projectId: string): Promise<PipelineRecord[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("prospect_opportunities")
    .select("id,prospect_id,opportunity_type,pipeline_status,last_contacted_at,next_followup_at,notes,prospects!inner(project_id)")
    .eq("prospects.project_id", projectId)
    .eq("in_pipeline", true)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Supabase pipeline query failed:", error);
    throw new Error([error.message, error.details, error.hint, error.code].filter(Boolean).join(" | ") || "Failed to load pipeline.");
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    prospectId: row.prospect_id,
    opportunityType: row.opportunity_type as OpportunityType,
    status: row.pipeline_status,
    lastContactedAt: row.last_contacted_at,
    nextFollowupAt: row.next_followup_at,
    notes: row.notes ?? "",
  }));
}

export async function addOpportunityToPipeline(
  prospectId: string,
  opportunityType: OpportunityType,
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("prospect_opportunities")
    .update({ in_pipeline: true, pipeline_status: "new" })
    .eq("prospect_id", prospectId)
    .eq("opportunity_type", opportunityType);

  if (error) {
    console.error("Supabase add-to-pipeline failed:", error);
    throw new Error([error.message, error.details, error.hint, error.code].filter(Boolean).join(" | ") || "Failed to add opportunity to pipeline.");
  }
}
