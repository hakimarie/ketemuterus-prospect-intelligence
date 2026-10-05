import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedNext = url.searchParams.get("next") || "/";
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent("Supabase authentication is not configured.")}`,
        request.url
      )
    );
  }

  const response = NextResponse.redirect(new URL("/login", request.url));

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.headers.get("cookie")
          ? request.headers.get("cookie")!.split("; ").map((item) => {
              const index = item.indexOf("=");
              return {
                name: index >= 0 ? item.slice(0, index) : item,
                value: index >= 0 ? item.slice(index + 1) : "",
              };
            })
          : [];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const redirectTo = new URL("/auth/callback", request.url);
  redirectTo.searchParams.set("next", next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo.toString(),
    },
  });

  if (error || !data.url) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "error",
      error?.message || "Unable to start Google sign-in."
    );
    loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  response.headers.set("Location", data.url);
  return response;
}
