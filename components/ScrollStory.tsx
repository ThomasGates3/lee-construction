"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { anim, createScrollEngine } from "@/lib/scroll-engine";
import type { SceneConfig } from "@/lib/story";

/**
 * Generic scroll story: a tall section with a sticky stage inside.
 * Pass any scene (house build, kitchen remodel...) as children plus its config.
 */
export function ScrollStory({
  config,
  children,
  finalActions,
  heightVh = 900,
}: {
  config: SceneConfig;
  children: ReactNode;
  finalActions?: ReactNode;
  heightVh?: number;
}) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dayRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLOListElement>(null);

  const { stages } = config;

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const svg = svgRef.current;
    if (!track || !stage || !svg) return;

    // portrait phones get a tighter crop so the house stays big
    const mq = window.matchMedia("(orientation: portrait)");
    const setViewBox = () => {
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
      mq.removeEventListener("change", setViewBox);
    };
  }, [config, stages]);

  return (
    <section ref={trackRef} id="build" className="relative" style={{ height: `${heightVh}vh` }} aria-label="Scroll through the build">
      <div
        ref={stageRef}
        className="story-stage sticky top-0 flex h-[100svh] w-full flex-col overflow-hidden bg-stone-900"
      >
        {/* scene */}
        <div className="relative w-full flex-1 overflow-hidden portrait:h-[56%] portrait:flex-none" style={{ background: config.backdrop }}>
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

          {/* readability wash behind captions on wide screens */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[46%] bg-gradient-to-r from-stone-900/55 via-stone-900/20 to-transparent landscape:block" />

          {/* day counter */}
          <div className="absolute bottom-3 right-3 rounded-full portrait:px-3 portrait:py-1.5 landscape:bottom-auto landscape:right-8 landscape:top-24 bg-stone-900/70 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-stone-100 backdrop-blur sm:text-xs">
            {config.dayLabel} <span ref={dayRef} className="tabular-nums text-copper-300">001</span>
          </div>
        </div>

        {/* captions: overlay on wide screens, panel under the scene on phones */}
        <div className="relative flex-1 px-6 pb-6 pt-5 portrait:block landscape:absolute landscape:inset-y-0 landscape:left-0 landscape:flex landscape:w-full landscape:max-w-xl landscape:items-end landscape:px-10 landscape:pb-16 lg:landscape:px-16">
          <div className="relative w-full">
            {stages.map((s, i) => {
              const first = i === 0;
              const last = i === stages.length - 1;
              const fadeInAt = first ? -1 : s.start;
              const fadeOutAt = last ? 2 : s.end;
              return (
                <div
                  key={s.id}
                  className={`story-caption ${first ? "relative" : "absolute inset-x-0 bottom-0 portrait:bottom-auto portrait:top-0"} text-stone-50`}
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
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-stone-200 sm:mt-4 sm:text-lg">{s.body}</p>
                  {first && (
                    <p className="mt-6 flex items-center gap-2 text-sm text-stone-300">
                      <span className="scroll-cue inline-block h-8 w-5 rounded-full border border-stone-300/70" aria-hidden />
                      Scroll to build
                    </p>
                  )}
                  {last && finalActions && <div className="mt-6 flex flex-wrap gap-3">{finalActions}</div>}
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
