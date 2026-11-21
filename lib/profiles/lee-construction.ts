import { builderDefaults } from "./builder-defaults";
import type { SiteProfile } from "./types";

/**
 * Spec pitch mockup for Lee Construction (Atlanta).
 * Contact details, license, reviews and claims are PLACEHOLDERS until the builder confirms them.
 * Private review only. Do not publish or send without Thomas's OK.
 */
export const leeConstruction: SiteProfile = {
  ...builderDefaults,
  name: "Lee Construction",
  shortName: "Lee Construction",
  region: "Atlanta",
  phone: "(404) 555-0100",
  phoneHref: "tel:+14045550100",
  smsHref: "sms:+14045550100",
  demoNotice: "Concept mockup prepared for Lee Construction. Not the live site. Reviews, license, address and contact details are placeholders.",
};
