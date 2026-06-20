import { REPO_URL } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-6 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">
          site + tooling: MIT licensed. portfolios: owned by their authors.
        </p>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-ink-soft underline decoration-line underline-offset-4 hover:text-signal"
        >
          view source
        </a>
      </div>
    </footer>
  );
}
