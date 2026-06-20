import fs from "node:fs";
import path from "node:path";
import type { Portfolio } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "portfolios.json");

export function getAllPortfolios(): Portfolio[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  try {
    return JSON.parse(raw) as Portfolio[];
  } catch {
    return [];
  }
}

export function getPortfolioBySlug(slug: string): Portfolio | undefined {
  return getAllPortfolios().find((p) => p.slug === slug);
}

export function getAllTags(portfolios: Portfolio[]): string[] {
  const set = new Set<string>();
  for (const p of portfolios) for (const t of p.tags) set.add(t);
  return Array.from(set).sort();
}

export function getAllTech(portfolios: Portfolio[]): string[] {
  const set = new Set<string>();
  for (const p of portfolios) for (const t of p.tech) set.add(t);
  return Array.from(set).sort();
}
