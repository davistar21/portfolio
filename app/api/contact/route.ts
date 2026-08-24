import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client. Prefer the service-role key so we can lock down
// direct anonymous inserts with an RLS policy and still write from here. Falls
// back to the public anon key if the service-role key isn't set yet.
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
  { auth: { persistSession: false } },
);

// ── IP rate limiter ─────────────────────────────────────────────────────────
// 3 submissions per IP per hour. This is in-memory, so the counter is per
// serverless instance and resets on cold start — an effective stopgap for a
// low-traffic site, but NOT bulletproof across many instances. For hard
// guarantees, swap this for Upstash Redis (@upstash/ratelimit) or a
// Supabase-backed counter keyed on IP.
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 3;
const hits = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim(); // first hop = real client on Vercel
  return req.headers.get("x-real-ip") ?? "unknown";
}

// Prune timestamps outside the window and return what remains (does NOT record).
function recentHits(ip: string): number[] {
  const now = Date.now();
  const fresh = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.set(ip, fresh);
  return fresh;
}

const MAX_LEN = { name: 100, email: 150, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Reject over-limit IPs before doing any work. Only valid submissions below
  // record a hit, so a legit user's typo doesn't burn their quota.
  const existing = recentHits(ip);
  if (existing.length >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((existing[0] + WINDOW_MS - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many messages. Please try again in a little while." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      name.length > MAX_LEN.name ||
      email.length > MAX_LEN.email ||
      message.length > MAX_LEN.message ||
      !EMAIL_RE.test(email)
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Valid submission — record the hit against this IP's quota.
    hits.set(ip, [...existing, Date.now()]);

    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;

    // Run email + DB save independently so one provider's outage doesn't lose
    // the message. Report success if either path delivers; only 500 if both fail.
    const mailPromise =
      resendKey && to
        ? fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Portfolio Contact <onboarding@resend.dev>",
              to,
              reply_to: email,
              subject: `New portfolio message from ${name}`,
              text: `From: ${name} <${email}>\n\n${message}`,
            }),
          })
        : Promise.resolve(null);

    const savePromise = supabaseServer
      .from("contact_messages")
      .insert([{ name, email, message }]);

    const [mailSettled, saveSettled] = await Promise.allSettled([
      mailPromise,
      savePromise,
    ]);

    let mailDelivered = false;
    if (mailSettled.status === "fulfilled") {
      const res = mailSettled.value;
      if (res === null) {
        // mail not configured this env — neutral, not a failure
      } else if (!res.ok) {
        console.error("Resend non-OK:", res.status, await res.text());
      } else {
        mailDelivered = true;
      }
    } else {
      console.error("Resend request failed:", mailSettled.reason);
    }

    let messageSaved = false;
    if (saveSettled.status === "fulfilled") {
      if (saveSettled.value.error) {
        console.error("Supabase insert error:", saveSettled.value.error);
      } else {
        messageSaved = true;
      }
    } else {
      console.error("Supabase request failed:", saveSettled.reason);
    }

    if (!messageSaved && !mailDelivered) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
