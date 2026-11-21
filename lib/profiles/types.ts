export interface SiteProfile {
  name: string;
  shortName: string;
  tagline: string;
  region: string;
  serviceArea: string;
  phone: string;
  phoneHref: string;
  /** SMS link for the "Text us" button, e.g. sms:+14045550142 */
  smsHref: string;
  email: string;
  /** office address shown in the footer (placeholder until the builder confirms) */
  address: { street: string; city: string; state: string; zip: string };
  hours: string;
  /** shown in the trust strip and footer, e.g. "GA Residential Contractor #RBCO-XXXXXX" */
  license: string;
  lotLabel: string;
  planLabel: string;
  homeSummary: string;
  footprint: string;
  depth: string;
  totalBuildDays: number;
  /** shown in the footer so nobody mistakes a mockup for the live site */
  demoNotice: string;
  trust: { title: string; body: string }[];
  services: { title: string; body: string }[];
  plans: { name: string; beds: number; baths: number; sqft: string; garage: string; note: string }[];
  process: { title: string; body: string; time: string }[];
  promises: { title: string; body: string }[];
  /** placeholder reviews, always labelled as samples on the page */
  reviews: { quote: string; name: string; area: string }[];
  serviceAreas: string[];
  faqs: { q: string; a: string }[];
  social: { label: string; href: string }[];
}
