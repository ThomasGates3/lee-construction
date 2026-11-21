/**
 * Draws a numbered image sequence (public/frames/<set>/<aspect>/0001.webp ...) on a canvas,
 * one frame per scroll position. Frames load coarse-to-fine (every 16th, then every 8th...)
 * so scrubbing works end to end within the first few requests, and gets smoother as the rest arrive.
 */

export interface FrameManifest {
  count: number;
  width: number;
  height: number;
  /** printf-style name, e.g. "%04d.webp", numbered from 1 */
  pattern: string;
  poster: string;
}

export interface FrameSource {
  /** folder under public/, e.g. "/frames/brick-two-story-atlanta/wide" */
  base: string;
  manifest: FrameManifest;
  /** share of the scroll held on the first and last frame, so the story opens and closes on a still */
  hold?: number;
}

const MAX_PARALLEL = 6;

export function frameName(pattern: string, n: number) {
  return pattern.replace(/%0(\d)d/, (_, w) => String(n).padStart(Number(w), "0"));
}

/** scroll progress (0..1) to a frame index, holding on the ends */
export function frameAt(p: number, count: number, hold = 0) {
  const t = Math.min(1, Math.max(0, (p - hold) / (1 - 2 * hold)));
  return Math.round(t * (count - 1));
}

export function createFramePlayer(canvas: HTMLCanvasElement, src: FrameSource) {
  const { base, manifest } = src;
  const { count } = manifest;
  const imgs: (HTMLImageElement | null)[] = new Array(count).fill(null);
  const ctx = canvas.getContext("2d");
  let want = 0;
  let drawn = -1;
  let destroyed = false;

  // coarse-to-fine load order, first frame first
  const order: number[] = [0, count - 1];
  const seen = new Set<number>(order);
  for (let step = 16; step >= 1; step /= 2) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }

  let next = 0;
  let inFlight = 0;
  const pump = () => {
    while (!destroyed && inFlight < MAX_PARALLEL && next < order.length) {
      const i = order[next++];
      inFlight++;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        inFlight--;
        imgs[i] = img;
        // redraw if this frame is closer to the one we want than what's on screen
        if (Math.abs(i - want) < Math.abs(drawn - want) || drawn < 0) draw(want, true);
        pump();
      };
      img.onerror = () => {
        inFlight--;
        pump();
      };
      img.src = `${base}/${frameName(manifest.pattern, i + 1)}`;
    }
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (w && h && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w;
      canvas.height = h;
      drawn = -1;
      draw(want, true);
    }
  };

  /** nearest loaded frame to i, preferring earlier ones so the build never runs ahead of the scroll */
  const nearest = (i: number) => {
    for (let d = 0; d < count; d++) {
      if (i - d >= 0 && imgs[i - d]) return i - d;
      if (i + d < count && imgs[i + d]) return i + d;
    }
    return -1;
  };

  function draw(i: number, force = false) {
    want = i;
    const k = nearest(i);
    if (k < 0 || !ctx || (k === drawn && !force)) return;
    const img = imgs[k]!;
    // cover-fit, anchored to the bottom so the house and street stay in view on tall screens
    const cw = canvas.width;
    const ch = canvas.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, Math.min(0, (ch - h) * 0.7), w, h);
    drawn = k;
  }

  window.addEventListener("resize", resize);
  resize();
  pump();

  return {
    /** draw the frame for scroll progress p */
    show(p: number) {
      draw(frameAt(p, count, src.hold ?? 0));
    },
    destroy() {
      destroyed = true;
      window.removeEventListener("resize", resize);
    },
  };
}
