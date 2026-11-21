import type { SiteProfile } from "./types";

/** Fictional builder for public demos and previews. */
export const demoBuilder: SiteProfile = {
  name: "Kestrel Ridge Homes",
  shortName: "Kestrel Ridge",
  tagline: "Brick homes built right, from the ground up.",
  region: "Metro Atlanta",
  serviceArea: "Atlanta and the surrounding metro",
  phone: "(404) 555-0142",
  phoneHref: "tel:+14045550142",
  email: "hello@example.com",
  lotLabel: "Lot 14",
  planLabel: "3 Bed · 2 Bath · Brick",
  homeSummary: "3 bed · 2 bath · full brick",
  footprint: "52'-0\"",
  depth: "8'-0\"",
  totalBuildDays: 180,
  demoNotice: "Concept demo. Kestrel Ridge Homes is a fictional builder.",
  highlights: [
    { value: "3 / 2", label: "Bed and bath, shown above" },
    { value: "Full brick", label: "Veneer laid course by course" },
    { value: "Atlanta", label: "Local crews, local inspectors" },
    { value: "1", label: "Point of contact, start to finish" },
  ],
  services: [
    { title: "New brick homes", body: "Classic brick on a solid foundation, with a plan and price you sign off on before ground breaks." },
    { title: "Build on your lot", body: "Already own land? Survey, soils, permits and utilities are handled before the first truck arrives." },
    { title: "Plans & permitting", body: "Stamped drawings, permit filings and inspections coordinated for you." },
    { title: "Additions & remodels", body: "New rooms, garages and full renovations built to the same standard." },
  ],
  promises: [
    { title: "Weekly progress photos", body: "See exactly where your build stands, the way you just scrolled through it." },
    { title: "Clear, upfront pricing", body: "Allowances and change orders in writing before work starts." },
    { title: "Walkthrough before keys", body: "Every item checked with you, line by line, before move-in." },
  ],
};
