import { builderDefaults } from "./builder-defaults";
import type { SiteProfile } from "./types";

/** Fictional builder for public demos and previews. */
export const demoBuilder: SiteProfile = {
  ...builderDefaults,
  name: "Kestrel Ridge Homes",
  shortName: "Kestrel Ridge",
  phone: "(404) 555-0142",
  phoneHref: "tel:+14045550142",
  smsHref: "sms:+14045550142",
  demoNotice: "Concept demo. Kestrel Ridge Homes is a fictional builder; reviews, license and address are samples.",
};
