export default function CodeBlock({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink">
      {label && (
        <div className="border-b border-ink-soft/30 px-4 py-2 font-mono text-[11px] text-ink-soft">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-paper">
        {children}
      </pre>
    </div>
  );
}
