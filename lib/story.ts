/** Shared types for any scroll story (house build, kitchen remodel, etc). */

export interface Stage {
  id: string;
  /** short name for the progress rail */
  label: string;
  /** small line above the title, e.g. "03 · Excavation" */
  kicker: string;
  title: string;
  body: string;
  /** progress window this caption owns, 0..1 */
  start: number;
  end: number;
}

export interface SceneConfig {
  /** viewBox for landscape screens (scene fills the screen) */
  viewBoxWide: string;
  /** tighter viewBox for portrait phones (scene sits above the captions) */
  viewBoxTall: string;
  stages: Stage[];
  /** what the counter reads at the end, e.g. 186 build days */
  totalDays: number;
  /** counter wording, e.g. "Build day" or "Remodel day" */
  dayLabel: string;
  /** colour behind the SVG on phones so letterboxing blends in */
  backdrop: string;
}
