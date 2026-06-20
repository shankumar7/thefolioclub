export type PortfolioType = "static" | "prebuilt" | "external";

export interface Portfolio {
  name: string;
  title: string;
  slug: string;
  type: PortfolioType;
  description: string;
  tech: string[];
  tags: string[];
  github: string;
  demoUrl: string;
  screenshotUrl: string | null;
  embeddable: boolean;
  embedUrl: string | null;
  addedAt: string;
  /** Zero-padded submission order, e.g. "001". Real data, not decoration. */
  accession: string;
}
