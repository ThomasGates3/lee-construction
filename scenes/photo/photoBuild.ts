import type { SceneConfig, Stage } from "@/lib/story";
import type { StoryFrames } from "@/components/ScrollStory";
import { site } from "@/lib/site";
import wide from "@/public/frames/brick-two-story-atlanta/wide/manifest.json";
import tall from "@/public/frames/brick-two-story-atlanta/tall/manifest.json";

/*
 * Photoreal version of the build: frames made from the fal clips (production/), one per scroll step.
 * The video is 7 clips of equal length, grass lot -> cleared -> layout and dig -> foundation ->
 * framing -> dry-in -> brick -> finished, so each caption owns the scroll window of its clip.
 */

const HOLD = 0.06; // first and last frame stay put for this share of the scroll
const CLIPS = 7;
const clip = (k: number) => HOLD + ((1 - 2 * HOLD) * k) / CLIPS; // scroll position where clip k starts (0-based)

/* desktop gets the 16:9 set, portrait phones the 9:16 set; both follow the same 7-clip timeline */
export const photoFrames: StoryFrames = {
  wide: { base: "/frames/brick-two-story-atlanta/wide", manifest: wide, hold: HOLD },
  tall: { base: "/frames/brick-two-story-atlanta/tall", manifest: tall, hold: HOLD },
};

const captions: Omit<Stage, "start" | "end">[] = [
  {
    id: "land",
    label: "The land",
    kicker: `${site.lotLabel} · ${site.homeSummary}`,
    title: "Watch your home rise from bare land.",
    body: "Keep scrolling. Every stage you see is one we run for you, from the first survey stake to the keys in your hand.",
  },
  {
    id: "clear",
    label: "Site prep",
    kicker: "01 · Site prep",
    title: "Clear the lot. Keep what matters.",
    body: "We strip the sod, take down only what has to go, and grade the lot so the house lands exactly where it was designed.",
  },
  {
    id: "layout",
    label: "Layout & dig",
    kicker: "02 · Layout & excavation",
    title: "Measured twice. Dug to the plan.",
    body: "Every corner is staked and checked against the stamped plans, then the footprint is cut to the engineer's grade.",
  },
  {
    id: "found",
    label: "Foundation",
    kicker: "03 · Foundation",
    title: "A foundation built for a century.",
    body: "Plumbing roughed in, forms set, and the slab poured and inspected before a single wall goes up.",
  },
  {
    id: "frame",
    label: "Framing",
    kicker: "04 · Framing",
    title: "The bones go up.",
    body: "Two full floors of 2x6 walls and engineered trusses. This is the week it starts to feel real.",
  },
  {
    id: "dry",
    label: "Dry-in",
    kicker: "05 · Dry-in",
    title: "Roof on. Windows in. Weather out.",
    body: "Sheathing, house wrap, roof and windows close the house up so the inside work starts on schedule, rain or shine.",
  },
  {
    id: "brick",
    label: "Brick",
    kicker: "06 · Brick",
    title: "Laid course by course.",
    body: "Full brick veneer on every wall, both floors, set level and true by masons who do nothing else.",
  },
  {
    id: "finish",
    label: "Move-in",
    kicker: `07 · Day ${site.totalBuildDays}`,
    title: "Welcome home.",
    body: "Driveway poured, sod down, the yard planted, and every room walked through with you before you get the keys.",
  },
];

/* caption i (after the first) runs with clip i-1, so it's on screen while that stage is being built */
const windows: [number, number][] = [
  [0, clip(0) + 0.02],
  ...Array.from({ length: CLIPS }, (_, k): [number, number] => [
    k === 0 ? clip(0) + 0.02 : clip(k),
    k === CLIPS - 1 ? 1 : clip(k + 1),
  ]),
];

export const photoScene: SceneConfig = {
  viewBoxWide: "",
  viewBoxTall: "",
  totalDays: site.totalBuildDays,
  dayLabel: "Build day",
  backdrop: "#1c1915",
  stages: captions.map((c, i) => ({ ...c, start: windows[i][0], end: windows[i][1] })),
};
