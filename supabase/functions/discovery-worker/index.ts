import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ProviderResult = {
  source_ref: string;
  payload: Record<string, unknown>;
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function mockProvider(): Promise<ProviderResult[]> {
  return [
    {
      source_ref: "mock-premium-pilates-001",
      payload: {
        name: "Mock Premium Pilates",
        category: "pilates",
        address: "Mock Address — PIM Area",
      },
    },
    {
      source_ref: "mock-wellness-yoga-001",
      payload: {
        name: "Mock Wellness Yoga",
        category: "yoga",
        address: "Mock Address — Pondok Indah",
      },
    },
    {
      source_ref: "mock-running-community-001",
      payload: {
        name: "Mock Running Community",
        category: "running_community",
        address: "Mock Address — South Jakarta",
      },
    },
  ];
}

async function claimRun(runId: string) {
  const { data, error } = await supabase
    .from("discovery_runs")
    .update({
      status: "running",
      started_at: new Date().toISOString(),
      error_message: null,
    })
    .eq("id", runId)
    .eq("status", "queued")
    .select("id, project_id")
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function failRun(runId: string, message: string) {
  await supabase
    .from("discovery_runs")
    .update({
      status: "failed",
      error_message: message.slice(0, 2000),
      finished_at: new Date().toISOString(),
    })
    .eq("id", runId)
    .eq("status", "running");
}

async function processRun(runId: string) {
  const { data: run, error: runError } = await supabase
    .from("discovery_runs")
    .select("id, project_id")
    .eq("id", runId)
    .eq("status", "running")
    .single();

  if (runError) throw runError;

  // Provider interface is intentionally uniform:
  // source + source_ref + payload.
  const providerResults = await mockProvider();

  // Temporary mock source. The database source registry must contain
  // source_type = "mock" before this worker is executed.
  const { data: source, error: sourceError } = await supabase
    .from("discovery_sources")
    .select("id, source_type")
    .eq("source_type", "mock")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (sourceError) throw sourceError;

  if (!source) {
    throw new Error(
      'No active discovery_sources row found for source_type="mock".',
    );
  }

  const rows = providerResults.map((result) => ({
    discovery_run_id: run.id,
    source_id: source.id,
    source_type: "mock",
    external_id: result.source_ref,
    payload: result.payload,
    match_status: "unmatched",
  }));

  const { error: insertError } = await supabase
    .from("raw_discoveries")
    .upsert(rows, {
      onConflict: "discovery_run_id,source_id,external_id",
      ignoreDuplicates: true,
    });

  if (insertError) throw insertError;

  const { count, error: countError } = await supabase
    .from("raw_discoveries")
    .select("id", { count: "exact", head: true })
    .eq("discovery_run_id", run.id);

  if (countError) throw countError;

  const rawCount = count ?? 0;
  const finishedAt = new Date().toISOString();

  const { error: finishError } = await supabase
    .from("discovery_runs")
    .update({
      status: "completed",
      raw_count: rawCount,
      records_discovered: rawCount,
      finished_at: finishedAt,
      completed_at: finishedAt,
      error_message: null,
    })
    .eq("id", run.id)
    .eq("status", "running");

  if (finishError) throw finishError;

  return {
    run_id: run.id,
    status: "completed",
    raw_count: rawCount,
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  let runId: string | undefined;

  try {
    const body = await req.json();
    runId = body?.run_id;

    if (!runId || typeof runId !== "string") {
      return new Response(
        JSON.stringify({ error: "run_id is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const claimed = await claimRun(runId);

    if (!claimed) {
      return new Response(
        JSON.stringify({
          run_id: runId,
          status: "not_claimed",
          message: "Run is no longer queued or does not exist.",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const result = await processRun(runId);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Discovery worker failed";

    if (runId) {
      try {
        await failRun(runId, message);
      } catch (updateError) {
        console.error("Failed to mark discovery run as failed:", updateError);
      }
    }

    console.error("Discovery worker failed:", error);

    return new Response(
      JSON.stringify({
        run_id: runId ?? null,
        status: "failed",
        error: message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
