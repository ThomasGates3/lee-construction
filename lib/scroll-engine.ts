/**
 * Tiny scroll-scrub engine.
 *
 * Any element (SVG or HTML) inside the story can carry a `data-anim` spec made
 * with `anim()`. Each property is a list of [progress, value] keyframes, where
 * progress runs from 0 (top of the story) to 1 (end of the story). The engine
 * reads scroll position, eases it, and writes the interpolated values straight
 * to the DOM, so React never re-renders while you scroll.
 *
 * This file knows nothing about houses or kitchens. A new scene only needs
 * markup with `anim()` props.
 */

export type Keys = ReadonlyArray<readonly [number, number]>;

export type Origin =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | readonly [number, number];

export interface AnimSpec {
  /** opacity 0..1 */
  o?: Keys;
  /** translate x / y (SVG user units or CSS px) */
  x?: Keys;
  y?: Keys;
  /** uniform scale, or per-axis scale */
  s?: Keys;
  sx?: Keys;
  sy?: Keys;
  /** rotation in degrees */
  r?: Keys;
  /** stroke draw-on, 0..1 (SVG shapes only) */
  d?: Keys;
  /** transform origin for scale / rotate (SVG: keyword from bbox, or absolute user units) */
  origin?: Origin;
  ease?: "linear" | "out" | "inOut";
}

export function anim(spec: AnimSpec): { "data-anim": string } {
  return { "data-anim": JSON.stringify(spec) };
}

/* ---------- keyframe helpers for scene authors ---------- */

/** fade in between a and b */
export const fadeIn = (a: number, b: number): Keys => [
  [a, 0],
  [b, 1],
];
/** fade out between a and b */
export const fadeOut = (a: number, b: number): Keys => [
  [a, 1],
  [b, 0],
];
/** visible only between in-window and out-window */
export const window4 = (a: number, b: number, c: number, d: number): Keys => [
  [a, 0],
  [b, 1],
  [c, 1],
  [d, 0],
];
/** grow 0 -> 1 between a and b */
export const grow = (a: number, b: number): Keys => [
  [a, 0],
  [b, 1],
];

/* ---------- internals ---------- */

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

const EASE = {
  linear: (t: number) => t,
  out: (t: number) => 1 - Math.pow(1 - t, 3),
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

function sample(keys: Keys | undefined, p: number, ease: (t: number) => number, fallback: number) {
  if (!keys || keys.length === 0) return fallback;
  if (p <= keys[0][0]) return keys[0][1];
  const last = keys[keys.length - 1];
  if (p >= last[0]) return last[1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0, v0] = keys[i];
    const [p1, v1] = keys[i + 1];
    if (p >= p0 && p <= p1) {
      const t = p1 === p0 ? 1 : ease((p - p0) / (p1 - p0));
      return v0 + (v1 - v0) * t;
    }
  }
  return last[1];
}

interface Track {
  el: Element;
  isSvg: boolean;
  spec: AnimSpec;
  ease: (t: number) => number;
  ox: number;
  oy: number;
  len: number;
  last: { o?: string; t?: string; d?: string; vis?: string };
}

function resolveOrigin(el: SVGGraphicsElement, origin: Origin | undefined): [number, number] {
  if (Array.isArray(origin)) return [origin[0], origin[1]];
  let b: DOMRect | SVGRect;
  try {
    b = el.getBBox();
  } catch {
    return [0, 0];
  }
  const cx = b.x + b.width / 2;
  const cy = b.y + b.height / 2;
  switch (origin) {
    case "top":
      return [cx, b.y];
    case "bottom":
      return [cx, b.y + b.height];
    case "left":
      return [b.x, cy];
    case "right":
      return [b.x + b.width, cy];
    case "bottom-left":
      return [b.x, b.y + b.height];
    case "bottom-right":
      return [b.x + b.width, b.y + b.height];
    case "top-left":
      return [b.x, b.y];
    default:
      return [cx, cy];
  }
}

const f = (n: number) => Math.round(n * 1000) / 1000;

function apply(track: Track, p: number) {
  const { spec, ease, el, last } = track;

  if (spec.o) {
    const o = clamp(sample(spec.o, p, ease, 1));
    const os = String(f(o));
    if (os !== last.o) {
      (el as HTMLElement).style.opacity = os;
      last.o = os;
    }
    if (!track.isSvg) {
      const vis = o < 0.02 ? "hidden" : "visible";
      if (vis !== last.vis) {
        (el as HTMLElement).style.visibility = vis;
        last.vis = vis;
      }
    }
  }

  if (spec.x || spec.y || spec.s || spec.sx || spec.sy || spec.r) {
    const x = sample(spec.x, p, ease, 0);
    const y = sample(spec.y, p, ease, 0);
    const s = sample(spec.s, p, ease, 1);
    const sx = sample(spec.sx, p, ease, 1) * s;
    const sy = sample(spec.sy, p, ease, 1) * s;
    const r = sample(spec.r, p, ease, 0);
    let t: string;
    if (track.isSvg) {
      const { ox, oy } = track;
      // keep a hair above zero so the element never fully collapses (avoids NaN bboxes)
      const ssx = Math.max(sx, 0.0001);
      const ssy = Math.max(sy, 0.0001);
      t = `translate(${f(x + ox)} ${f(y + oy)}) rotate(${f(r)}) scale(${f(ssx)} ${f(ssy)}) translate(${f(-ox)} ${f(-oy)})`;
      if (t !== last.t) {
        el.setAttribute("transform", t);
        last.t = t;
      }
    } else {
      t = `translate3d(${f(x)}px, ${f(y)}px, 0) rotate(${f(r)}deg) scale(${f(sx)}, ${f(sy)})`;
      if (t !== last.t) {
        (el as HTMLElement).style.transform = t;
        last.t = t;
      }
    }
  }

  if (spec.d && track.len > 0) {
    const d = clamp(sample(spec.d, p, ease, 1));
    const ds = String(f(track.len * (1 - d)));
    if (ds !== last.d) {
      (el as SVGElement).style.strokeDashoffset = ds;
      last.d = ds;
    }
  }
}

export interface EngineOptions {
  /** the tall element whose scroll distance maps to progress 0..1 */
  track: HTMLElement;
  /** element to search for [data-anim] children */
  scope: Element;
  /** called every frame with eased progress */
  onFrame?: (p: number) => void;
  /** 0..1, how quickly the eased value catches the real scroll (1 = no smoothing) */
  smoothing?: number;
}

export function createScrollEngine(opts: EngineOptions) {
  const reduce =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const lerp = reduce ? 1 : opts.smoothing ?? 0.14;

  let tracks: Track[] = [];
  let target = 0;
  let current = -1;
  let raf = 0;

  const collect = () => {
    tracks = Array.from(opts.scope.querySelectorAll("[data-anim]")).map((el) => {
      const spec = JSON.parse(el.getAttribute("data-anim") || "{}") as AnimSpec;
      const isSvg = el instanceof SVGElement;
      let ox = 0,
        oy = 0,
        len = 0;
      if (isSvg) {
        // measure before any animated transform is applied. Elements that need a
        // static transform should be wrapped in a <g transform="..."> instead.
        if (spec.x || spec.y || spec.s || spec.sx || spec.sy || spec.r) el.removeAttribute("transform");
        [ox, oy] = resolveOrigin(el as SVGGraphicsElement, spec.origin);
        if (spec.d && "getTotalLength" in el) {
          try {
            len = (el as SVGGeometryElement).getTotalLength();
          } catch {
            len = 0;
          }
          if (len > 0) {
            (el as SVGElement).style.strokeDasharray = String(f(len));
            (el as SVGElement).style.strokeDashoffset = String(f(len));
          }
        }
      }
      return { el, isSvg, spec, ease: EASE[spec.ease ?? "out"], ox, oy, len, last: {} } as Track;
    });
  };

  const measure = () => {
    const rect = opts.track.getBoundingClientRect();
    const distance = rect.height - window.innerHeight;
    target = distance > 0 ? clamp(-rect.top / distance) : 0;
  };

  const frame = () => {
    raf = 0;
    const next = current < 0 ? target : current + (target - current) * lerp;
    current = Math.abs(target - next) < 0.0004 ? target : next;
    for (const t of tracks) apply(t, current);
    opts.onFrame?.(current);
    if (current !== target) raf = requestAnimationFrame(frame);
  };

  const kick = () => {
    measure();
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const onResize = () => {
    collect();
    current = -1;
    kick();
  };

  collect();
  window.addEventListener("scroll", kick, { passive: true });
  window.addEventListener("resize", onResize);
  kick();

  return {
    refresh: onResize,
    destroy() {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    },
  };
}
