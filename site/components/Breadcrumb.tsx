import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-sm text-ink-soft">
      {trail.map((crumb, i) => (
        <span key={i}>
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-signal">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-ink">{crumb.label}</span>
          )}
          {i < trail.length - 1 && <span className="mx-1.5 text-line">/</span>}
        </span>
      ))}
    </nav>
  );
}
