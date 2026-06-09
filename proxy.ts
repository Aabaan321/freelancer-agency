import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // If Supabase isn't configured yet, let public routes through untouched and
  // bounce portal routes to login rather than hard-crashing the whole site.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const p = request.nextUrl.pathname;
    if (p.startsWith("/admin") || p.startsWith("/client")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isClientRoute = path.startsWith("/client");
  const isAuthRoute = path === "/login" || path === "/forgot-password";

  // Redirect unauthed users away from portals
  if ((isAdminRoute || isClientRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Redirect authed users away from login
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    url.pathname = profile?.role === "admin" ? "/admin" : "/client";
    return NextResponse.redirect(url);
  }

  // Role gating for portals
  if ((isAdminRoute || isClientRoute) && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (isAdminRoute && profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/client";
      return NextResponse.redirect(url);
    }
    if (isClientRoute && profile?.role !== "client") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)"],
};
