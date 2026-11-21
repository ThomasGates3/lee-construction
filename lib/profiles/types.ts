export interface SiteProfile {
  name: string;
  shortName: string;
  tagline: string;
  region: string;
  serviceArea: string;
  phone: string;
  phoneHref: string;
  email: string;
  lotLabel: string;
  planLabel: string;
  homeSummary: string;
  footprint: string;
  depth: string;
  totalBuildDays: number;
  /** shown in the footer so nobody mistakes a mockup for the live site */
  demoNotice: string;
  highlights: { value: string; label: string }[];
  services: { title: string; body: string }[];
  promises: { title: string; body: string }[];
}
