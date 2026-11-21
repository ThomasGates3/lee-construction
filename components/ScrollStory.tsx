"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { anim, createScrollEngine } from "@/lib/scroll-engine";
import type { SceneConfig } from "@/lib/story";
import { createFramePlayer, type FrameSource } from "@/lib/frame-player";

/**
 * Generic scroll story: a tall section with a sticky stage inside.
 * Pass any scene (house build, kitchen remodel...) as SVG children plus its config,
 * or pass `frames` to scrub a photo/video image sequence instead. With `frames.tall`, portrait
 * phones get their own full-screen sequence with the captions laid over it.
 */
export interface StoryFrames {
  wide: FrameSource;
  tall?: FrameSource;
}

export function ScrollStory({
  config,
  children,
  finalActions,
  introActions,
  frames,
  heightVh = 900,
}: {
  config: SceneConfig;
  children?: ReactNode;
  frames?: StoryFrames;
  finalActions?: ReactNode;
  /** shown under the first caption, for visitors who want to act before scrolling the build */
  introActions?: ReactNode;
  heightVh?: number;
}) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dayRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLOListElement>(null);

  const { stages } = config;
  /** phone captions sit over a full-screen photo instead of on a panel below it */
  const overlay = Boolean(frames?.tall);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    if (!track || !stage || (!svg && !canvas)) return;

    // portrait phones get a tighter crop so the house stays big
    const mq = window.matchMedia("(orientation: portrait)");
    // photo mode: one player per orientation, swapped when the phone turns
    let player: ReturnType<typeof createFramePlayer> | null = null;
    let lastP = 0;
    const setPlayer = () => {
      if (!canvas || !frames) return;
      player?.destroy();
      const src = mq.matches && frames.tall ? frames.tall : frames.wide;
      canvas.style.backgroundImage = `url(${src.base}/${src.manifest.poster})`;
      player = createFramePlayer(canvas, src);
      player.show(lastP);
    };
    const setViewBox = () => {
      setPlayer();
      if (!svg) return;
      const tall = mq.matches;
      svg.setAttribute("viewBox", tall ? config.viewBoxTall : config.viewBoxWide);
      svg.setAttribute("preserveAspectRatio", tall ? "xMidYMax meet" : "xMidYMax slice");
    };
    setViewBox();
    mq.addEventListener("change", setViewBox);

    let lastActive = -1;
    let lastDay = -1;
    const railItems = Array.from(railRef.current?.children ?? []) as HTMLElement[];

    const engine = createScrollEngine({
      track,
      scope: stage,
      onFrame: (p) => {
        lastP = p;
        player?.show(p);
        const day = Math.max(1, Math.round(p * config.totalDays));
        if (day !== lastDay && dayRef.current) {
          dayRef.current.textContent = String(day).padStart(3, "0");
          lastDay = day;
        }
        if (barRef.current) barRef.current.style.transform = `scaleY(${p})`;
        let active = 0;
        stages.forEach((s, i) => {
          if (p >= s.start - 0.001) active = i;
        });
        if (active !== lastActive) {
          railItems.forEach((el, i) => {
            el.dataset.state = i < active ? "done" : i === active ? "active" : "todo";
          });
          lastActive = active;
        }
      },
    });
    stage.dataset.ready = "true";

    return () => {
      engine.destroy();
      player?.destroy();
      mq.removeEventListener("change", setViewBox);
    };
  }, [config, stages, frames]);

  return (
    <section ref={trackRef} id="build" className="relative" style={{ height: `${heightVh}vh` }} aria-label="Scroll through the build">
      <div
        ref={stageRef}
        className="story-stage sticky top-0 flex h-[100svh] w-full flex-col overflow-hidden bg-stone-900"
      >
        {/* scene */}
        <div
          className={`relative w-full flex-1 overflow-hidden ${overlay ? "" : "portrait:h-[56%] portrait:flex-none"}`}
          style={{ background: config.backdrop }}
        >
          {frames ? (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full bg-cover bg-bottom"
              role="img"
              aria-label="Photo time-lapse of a brick home being built, from a grass lot to the finished house, driven by scrolling"
            />
          ) : (
            <svg
              ref={svgRef}
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox={config.viewBoxWide}
              preserveAspectRatio="xMidYMax slice"
              role="img"
              aria-label="Illustration of a home being built, from bare land to a finished house, driven by scrolling"
            >
              {children}
            </svg>
          )}

          {/* photos are brighter than the drawing: shade the sky under the nav and the ground under the captions */}
          {frames && (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-stone-900/60 to-transparent" />
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/90 via-stone-900/45 to-transparent landscape:h-[60%] ${
                  overlay ? "h-[55%]" : "hidden landscape:block"
                }`}
              />
            </>
          )}

          {/* readability wash behind captions on wide screens */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[46%] bg-gradient-to-r from-stone-900/55 via-stone-900/20 to-transparent landscape:block" />

          {/* day counter */}
          <div className={`absolute rounded-full ${overlay ? "right-4 top-20 portrait:top-[4.5rem]" : "bottom-3 right-3"} portrait:px-3 portrait:py-1.5 landscape:bottom-auto landscape:right-8 landscape:top-24 bg-stone-900/70 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-stone-100 backdrop-blur sm:text-xs`}>
            {config.dayLabel} <span ref={dayRef} className="tabular-nums text-copper-300">001</span>
          </div>
        </div>

        {/* captions: overlay on wide screens, panel under the scene on phones */}
        <div className={`${overlay ? "absolute inset-x-0 bottom-0 px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))]" : "relative flex-1 px-6 pb-6 pt-5"} portrait:block landscape:absolute landscape:inset-y-0 landscape:left-0 landscape:flex landscape:w-full landscape:max-w-xl landscape:items-end landscape:px-10 landscape:pb-16 lg:landscape:px-16`}>
          <div className="relative w-full">
            {stages.map((s, i) => {
              const first = i === 0;
              const last = i === stages.length - 1;
              const fadeInAt = first ? -1 : s.start;
              const fadeOutAt = last ? 2 : s.end;
              return (
                <div
                  key={s.id}
                  className={`story-caption ${first ? "relative" : `absolute inset-x-0 bottom-0 ${overlay ? "" : "portrait:bottom-auto portrait:top-0"}`} text-stone-50`}
                  {...anim({
                    o: [
                      [fadeInAt, first ? 1 : 0],
                      [fadeInAt + 0.025, 1],
                      [fadeOutAt - 0.025, 1],
                      [fadeOutAt, last ? 1 : 0],
                    ],
                    y: [
                      [fadeInAt, first ? 0 : 24],
                      [fadeInAt + 0.025, 0],
                      [fadeOutAt - 0.025, 0],
                      [fadeOutAt, last ? 0 : -24],
                    ],
                  })}
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-copper-300">{s.kicker}</p>
                  <h2
                    className={`font-display leading-[1.05] tracking-tight ${
                      first ? "text-[2rem] sm:text-5xl lg:text-6xl" : "text-[1.75rem] sm:text-4xl lg:text-5xl"
                    }`}
                  >
                    {s.title}
                  </h2>
                  <p
                    className={`mt-3 max-w-md text-[15px] leading-relaxed text-stone-200 sm:mt-4 sm:text-lg ${
                      last && overlay ? "portrait:hidden" : ""
                    }`}
                  >
                    {s.body}
                  </p>
                  {first && introActions && <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">{introActions}</div>}
                  {first && (
                    <p className="mt-6 flex items-center gap-2 text-sm text-stone-300">
                      <span className="scroll-cue inline-block h-8 w-5 rounded-full border border-stone-300/70" aria-hidden />
                      Scroll to build
                    </p>
                  )}
                  {last && finalActions && <div className={`flex flex-wrap gap-3 ${overlay ? "mt-4 sm:mt-6" : "mt-6"}`}>{finalActions}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* progress rail */}
        <div className="pointer-events-none absolute bottom-16 right-8 hidden items-stretch gap-4 lg:flex">
          <ol ref={railRef} className="flex flex-col justify-between gap-3 text-right text-xs uppercase tracking-[0.18em]">
            {stages.map((s, i) => (
              <li key={s.id} data-state={i === 0 ? "active" : "todo"} className="rail-item">
                {s.label}
              </li>
            ))}
          </ol>
          <div className="relative w-[3px] overflow-hidden rounded-full bg-white/25">
            <div ref={barRef} className="absolute inset-0 origin-top bg-copper-300" style={{ transform: "scaleY(0)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
