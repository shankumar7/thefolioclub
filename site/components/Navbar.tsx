import Link from "next/link";
import { REPO_URL, SITE_NAME } from "@/lib/config";

const links = [
  { href: "/gallery", label: "gallery" },
  { href: "/submit", label: "submit" },
];

export default function Navbar() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-[15px] font-medium tracking-tight text-ink"
        >
          {SITE_NAME.toLowerCase().replace(/\s+/g, "-")}
          <span className="text-amber">/</span>
        </Link>

        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-ink bg-ink px-3 py-1.5 font-display text-sm text-paper transition-opacity hover:opacity-85"
          >
            add yours
          </a>
        </nav>
      </div>
    </header>
  );
}
