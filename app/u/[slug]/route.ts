import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store, max-age=0", "X-Robots-Tag": "noindex" };

async function resolve(request: NextRequest, context: { params: Promise<{ slug: string }> }, countVisit: boolean) {
  const { slug } = await context.params;
  if (!/^[a-z0-9][a-z0-9_-]{0,39}$/.test(slug)) {
    return new NextResponse("Short link not found.", { status: 404, headers });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return new NextResponse("Short links are temporarily unavailable.", { status: 503, headers });
  }
  let data: string | null;
  try {
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const result = await db.rpc("resolve_short_url", { short_slug: slug, count_visit: countVisit });
    if (result.error) throw result.error;
    data = result.data;
  } catch {
    return new NextResponse("Short links are temporarily unavailable.", { status: 503, headers });
  }
  if (!data) return new NextResponse("Short link not found.", { status: 404, headers });
  try {
    const target = new URL(data);
    if (!["http:", "https:"].includes(target.protocol)) throw new Error("Invalid protocol");
    if (target.origin === request.nextUrl.origin && target.pathname.startsWith("/u/")) throw new Error("Redirect loop");
    return new NextResponse(null, { status: 302, headers: { ...headers, Location: target.href } });
  } catch {
    return new NextResponse("This short link has an invalid destination.", { status: 422, headers });
  }
}

export function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  return resolve(request, context, true);
}

export function HEAD(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  return resolve(request, context, false);
}
