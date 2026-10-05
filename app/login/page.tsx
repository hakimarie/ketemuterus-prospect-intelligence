"use client";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const message = params.get("error");

    if (code) {
      const next = params.get("next") || "/";
      const safeNext =
        next.startsWith("/") && !next.startsWith("//") ? next : "/";
      window.location.replace(
        `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(safeNext)}`
      );
      return;
    }

    if (message) setError(message);
  }, []);

  function signIn() {
    if (loading) return;

    setLoading(true);
    setError("");

    const params = new URLSearchParams(window.location.search);
    const requestedNext = params.get("next") || "/";
    const next =
      requestedNext.startsWith("/") && !requestedNext.startsWith("//")
        ? requestedNext
        : "/";

    window.location.assign(
      `/auth/signin?next=${encodeURIComponent(next)}`
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          KetemuTerus Prospect Intelligence
        </p>
        <h1 className="mt-2 text-2xl font-bold text-ink">
          {loading ? "Connecting..." : "Sign in"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in with your authorized Google account to access client prospect data.
        </p>
        <button
          type="button"
          onClick={signIn}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Connecting..." : "Continue with Google"}
        </button>
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      </div>
    </main>
  );
}
