import { getAllPortfolios, getAllTags } from "@/lib/portfolios";
import GalleryGrid from "@/components/GalleryGrid";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata = {
  title: "Gallery — Portfolio Hub",
};

export default function GalleryPage() {
  const portfolios = getAllPortfolios();
  const allTags = getAllTags(portfolios);

  return (
    <div className="mx-auto max-w-content px-6 py-12">
      <Breadcrumb trail={[{ label: "portfolio-hub", href: "/" }, { label: "f1" }]} />
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink">
        Every contributed folder
      </h1>
      <p className="mt-2 max-w-lg text-sm text-ink-soft">
        Browsable, filterable, and exactly what&apos;s sitting in{" "}
        <code className="rounded bg-card px-1 py-0.5 font-mono">f1/</code> in the repo right
        now.
      </p>

      <div className="mt-10">
        <GalleryGrid portfolios={portfolios} allTags={allTags} />
      </div>
    </div>
  );
}
