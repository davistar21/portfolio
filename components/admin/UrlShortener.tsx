"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UrlShortener() {
  const [shortLinks, setShortLinks] = useState<{ slug: string; destination: string; clicks: number; created_at: string }[]>([]);
  const [destination, setDestination] = useState("");
  const [shortSlug, setShortSlug] = useState("");
  const [linksBusy, setLinksBusy] = useState(false);
  const [linksNotice, setLinksNotice] = useState("");
  const [linkOrigin, setLinkOrigin] = useState("");

  async function loadShortLinks() {
    setLinksBusy(true);
    setLinksNotice("");
    try {
      const { data, error } = await supabase.from("short_urls").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setShortLinks(data || []);
    } catch {
      setLinksNotice("Couldn't load links. Check your connection and that supabase/url_shortener.sql has been run.");
    } finally {
      setLinksBusy(false);
    }
  }

  useEffect(() => {
    setLinkOrigin(window.location.origin);
    void loadShortLinks();
  }, []);

  async function createShortLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLinksNotice("");
    let target: URL;
    try {
      target = new URL(destination.trim());
      if (!["https:", "http:"].includes(target.protocol) || target.href.length > 10000) throw new Error();
      if (target.origin === window.location.origin && target.pathname.startsWith("/u/")) throw new Error();
    } catch {
      setLinksNotice("Enter a full http:// or https:// destination, not another short link on this site.");
      return;
    }
    const customSlug = shortSlug.trim().toLowerCase();
    if (customSlug && !/^[a-z0-9][a-z0-9_-]{0,39}$/.test(customSlug)) {
      setLinksNotice("Use 1–40 lowercase letters, numbers, hyphens or underscores; start with a letter or number.");
      return;
    }
    setLinksBusy(true);
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        const slug = customSlug || crypto.randomUUID().replaceAll("-", "").slice(0, 8);
        const { data, error } = await supabase.from("short_urls").insert({ slug, destination: target.href }).select().single();
        if (error?.code === "23505" && !customSlug) continue;
        if (error) {
          setLinksNotice(error.code === "23505" ? "That short name is already taken. Choose another." : "Couldn't save the link. Check your connection and database setup.");
          return;
        }
        setShortLinks((links) => [data, ...links]);
        setDestination("");
        setShortSlug("");
        setLinksNotice(`Created /u/${slug}`);
        return;
      }
      setLinksNotice("Couldn't generate an unused name. Try again.");
    } catch {
      setLinksNotice("Couldn't save the link. Please try again.");
    } finally {
      setLinksBusy(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Short Links</h1>
        <p className="text-muted-foreground mt-2">Paste a long URL here, then type its short name on your other device.</p>
      </div>
      <form onSubmit={createShortLink} className="space-y-4 rounded-xl border p-4">
        <label className="block space-y-2">
          <span>Destination URL</span>
          <input type="url" required maxLength={10000} value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="https://example.com/long-url" className="w-full rounded-md border bg-background p-3" />
        </label>
        <label className="block space-y-2">
          <span>Short name <span className="text-muted-foreground">(optional)</span></span>
          <input value={shortSlug} onChange={(e) => setShortSlug(e.target.value)} maxLength={40} autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="phone" className="w-full rounded-md border bg-background p-3" />
        </label>
        <p className="text-sm text-muted-foreground break-all">{linkOrigin}/u/{shortSlug.trim().toLowerCase() || "auto-generated"}</p>
        <p className="text-xs text-muted-foreground">Anyone with the short link can open it. Visits include automated link previews.</p>
        <button disabled={linksBusy} className="rounded-md bg-primary text-primary-foreground px-4 py-3 disabled:opacity-50">{linksBusy ? "Working…" : "Create short link"}</button>
      </form>
      <p role="status" aria-live="polite" className="text-sm">{linksNotice}</p>
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Saved links</h2>
        <button onClick={() => void loadShortLinks()} disabled={linksBusy} className="rounded-md border px-3 py-2 disabled:opacity-50">Refresh visits</button>
      </div>
      {!linksBusy && !shortLinks.length && <p className="text-muted-foreground">No links to show yet.</p>}
      {shortLinks.map((link) => (
        <article key={link.slug} className="rounded-xl border p-4 space-y-3">
          <a href={`/u/${link.slug}`} target="_blank" rel="noopener noreferrer" className="font-semibold underline break-all">{linkOrigin}/u/{link.slug}</a>
          <p className="text-sm text-muted-foreground break-all">{link.destination}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span>{link.clicks} visits</span>
            <button className="rounded-md border px-3 py-2" onClick={async () => {
              try {
                await navigator.clipboard.writeText(`${window.location.origin}/u/${link.slug}`);
                setLinksNotice("Short link copied.");
              } catch { setLinksNotice("Couldn't copy automatically. Select and copy the short link above."); }
            }}>Copy link</button>
            <button disabled={linksBusy} className="rounded-md border px-3 py-2 disabled:opacity-50" onClick={async () => {
              if (!window.confirm(`Delete /u/${link.slug}? It will stop redirecting.`)) return;
              setLinksBusy(true);
              try {
                const { data, error } = await supabase.from("short_urls").delete().eq("slug", link.slug).select("slug");
                if (error || !data?.length) throw new Error();
                setShortLinks((links) => links.filter((item) => item.slug !== link.slug));
                setLinksNotice("Link deleted.");
              } catch { setLinksNotice("Couldn't delete the link. Please try again."); }
              finally { setLinksBusy(false); }
            }}>Delete</button>
          </div>
        </article>
      ))}
    </section>
  );
}
