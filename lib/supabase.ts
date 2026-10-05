import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(url, key, {\n    auth: {\n      flowType: "pkce",\n      persistSession: true,\n      autoRefreshToken: true,\n    },\n  });
}
