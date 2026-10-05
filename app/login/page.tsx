"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return;

    const oauthCode = code;
    const next = params.get("next") || "/";
    const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
    let cancelled = false;

    async function finishOAuth() {
      setLoading(true);
      setError("");
      const supabase = createSupabaseBrowserClient();
      try {
        const result = await Promise.race([
          supabase.auth.exchangeCodeForSession(oauthCode),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("OAuth session exchange timed out.")), 15000)
          ),
        ]);
        if (cancelled) return;
        if (result.error) {
          setError(result.error.message);
          setLoading(false);
          return;
        }
      } catch (exchangeError) {
        if (cancelled) return;
        setError(exchangeError instanceof Error ? exchangeError.message : "OAuth session exchange failed.");
        setLoading(false);
        return;
      }
      window.history.replaceState({}, "", "/login");
      window.location.replace(safeNext);
    }

    finishOAuth();
    return () => { cancelled = true; };
  }, []);

  async function signIn() {
    setLoading(true);
    setError("");
    const next = new URLSearchParams(window.location.search).get("next") || "/";
    const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}` },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">KetemuTerus Prospect Intelligence</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">{loading ? "Connecting..." : "Sign in"}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Sign in with your authorized Google account to access client prospect data.</p>
        <button onClick={signIn} disabled={loading} className="mt-6 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Connecting..." : "Continue with Google"}
        </button>
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      </div>
    </main>
  );
}
