import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-content px-6 py-24 text-center">
      <p className="font-mono text-sm text-amber">f1/ — not found</p>
      <h1 className="mt-2 font-display text-2xl font-medium text-ink">
        No folder at that path.
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        It may have been renamed, or never existed.
      </p>
      <Link
        href="/gallery"
        className="mt-6 inline-block rounded-md border border-ink bg-ink px-4 py-2 font-display text-sm text-paper transition-opacity hover:opacity-85"
      >
        Back to the gallery
      </Link>
    </div>
  );
}
