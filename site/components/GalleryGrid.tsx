"use client";

import { useMemo, useState } from "react";
import PortfolioCard from "@/components/PortfolioCard";
import type { Portfolio } from "@/lib/types";

export default function GalleryGrid({
  portfolios,
  allTags,
}: {
  portfolios: Portfolio[];
  allTags: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return portfolios.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [portfolios, query, activeTag]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search by name, title, or tech..."
          className="w-full rounded-md border border-line bg-card px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-soft sm:max-w-xs"
        />
        <p className="font-mono text-xs text-ink-soft">
          {filtered.length} of {portfolios.length} folders
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded border px-2 py-1 font-mono text-[11px] transition-colors ${
              activeTag === null
                ? "border-ink bg-ink text-paper"
                : "border-line bg-card text-ink-soft hover:border-amber"
            }`}
          >
            all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`rounded border px-2 py-1 font-mono text-[11px] transition-colors ${
                activeTag === tag
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-card text-ink-soft hover:border-amber"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="font-mono text-sm text-ink-soft">
            no folders match — try a different search or tag.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PortfolioCard key={p.slug} portfolio={p} />
          ))}
        </div>
      )}
    </div>
  );
}
