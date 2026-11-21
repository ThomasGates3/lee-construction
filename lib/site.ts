/**
 * Pick which builder this build is branded for.
 * Set NEXT_PUBLIC_PROFILE=demo for the fictional builder; anything else uses the lead.
 * To pitch a new lead: copy lib/profiles/lee-construction.ts, edit it, add it below.
 */
import { demoBuilder } from "./profiles/demo";
import { leeConstruction } from "./profiles/lee-construction";
import type { SiteProfile } from "./profiles/types";

const profiles: Record<string, SiteProfile> = {
  lee: leeConstruction,
  demo: demoBuilder,
};

export const site: SiteProfile = profiles[process.env.NEXT_PUBLIC_PROFILE ?? "lee"] ?? leeConstruction;
export type { SiteProfile };
