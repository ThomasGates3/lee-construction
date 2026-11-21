import { anim, fadeIn, fadeOut, grow, window4 } from "@/lib/scroll-engine";
import type { SceneConfig } from "@/lib/story";
import { site } from "@/lib/site";

/*
 * House build scene, drawn as an architectural cut-away elevation.
 * Camera never moves: one 1600 x 900 canvas, ground line at y = 600.
 * Everything that changes carries an anim() spec keyed to scroll progress.
 *
 * Render order matters (later = in front):
 * sky > hills > soil > lot work > foundation > garage wing > main house > landscaping > dusk > glow
 */

const G = 600; // ground line

/* stage windows, 0..1 of the scroll */
const S = {
  land: [0, 0.1],
  clear: [0.1, 0.22],
  dig: [0.22, 0.36],
  layout: [0.36, 0.48],
  found: [0.48, 0.6],
  frame: [0.6, 0.74],
  dry: [0.74, 0.84],
  finish: [0.84, 1],
} as const;

export const houseScene: SceneConfig = {
  viewBoxWide: "0 0 1600 900",
  viewBoxTall: "410 150 790 740",
  totalDays: site.totalBuildDays,
  dayLabel: "Build day",
  backdrop: "#9fc4e0",
  stages: [
    {
      id: "land",
      label: "The land",
      kicker: `${site.lotLabel} · ${site.homeSummary}`,
      title: "Watch your home rise from bare land.",
      body: "Keep scrolling. Every stage you see is one we run for you, from the first survey stake to the keys in your hand.",
      start: S.land[0],
      end: S.land[1],
    },
    {
      id: "clear",
      label: "Site prep",
      kicker: "01 · Site prep",
      title: "Clear the lot. Keep what matters.",
      body: "We strip the sod, take down only what has to go, and stake the corners so the house lands exactly where it was designed.",
      start: S.clear[0],
      end: S.clear[1],
    },
    {
      id: "dig",
      label: "Excavation",
      kicker: "02 · Excavation",
      title: "Dig to the plan, not a guess.",
      body: `Footprint and depth come from the engineer's drawings and the soil report. This one goes ${site.depth} below grade.`,
      start: S.dig[0],
      end: S.dig[1],
    },
    {
      id: "layout",
      label: "Layout",
      kicker: "03 · Layout & plans",
      title: "Measured twice. Then again.",
      body: "Every corner is shot with a laser level and checked against the stamped plans before a single truck of concrete is ordered.",
      start: S.layout[0],
      end: S.layout[1],
    },
    {
      id: "found",
      label: "Foundation",
      kicker: "04 · Foundation",
      title: "A foundation built for a century.",
      body: "Footings, poured walls, waterproofing and backfill, each one inspected before the next begins.",
      start: S.found[0],
      end: S.found[1],
    },
    {
      id: "frame",
      label: "Framing",
      kicker: "05 · Framing",
      title: "The bones go up.",
      body: "2x6 walls at 16 inches on center and engineered trusses. This is the week it starts to feel real.",
      start: S.frame[0],
      end: S.frame[1],
    },
    {
      id: "dry",
      label: "Dry-in",
      kicker: "06 · Dry-in",
      title: "Roof on. Windows in. Weather out.",
      body: "Sheathing, roof and windows close the house up so the inside work can start on schedule, rain or shine.",
      start: S.dry[0],
      end: S.dry[1],
    },
    {
      id: "finish",
      label: "Move-in",
      kicker: `07 · Day ${site.totalBuildDays}`,
      title: "Welcome home.",
      body: "Brick laid course by course, the yard landscaped, and every room walked through with you before you get the keys.",
      start: S.finish[0],
      end: S.finish[1],
    },
  ],
};

/* ---------- small deterministic random so server and client markup match ---------- */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* stagger n items across [a, b], each taking `len` of the window */
const stagger = (i: number, n: number, a: number, b: number, len = 0.02) => {
  const start = a + ((b - a - len) * i) / Math.max(1, n - 1);
  return [start, start + len] as const;
};

/* ---------- reusable bits ---------- */

function Tree({ x, scale = 1, tone = "#5f8148", tone2 = "#6f9455" }: { x: number; scale?: number; tone?: string; tone2?: string }) {
  return (
    <g transform={`translate(${x} ${G}) scale(${scale})`}>
      <rect x={-6} y={-70} width={12} height={72} fill="#6b4a32" />
      <circle cx={0} cy={-92} r={38} fill={tone} />
      <circle cx={-26} cy={-74} r={26} fill={tone} />
      <circle cx={24} cy={-72} r={28} fill={tone} />
      <circle cx={-8} cy={-108} r={24} fill={tone2} opacity={0.9} />
      <circle cx={16} cy={-96} r={18} fill={tone2} opacity={0.8} />
    </g>
  );
}

function Stake({ x, k }: { x: number; k: readonly [number, number] }) {
  return (
    <g {...anim({ o: window4(k[0], k[1], 0.5, 0.53), y: [[k[0], -14], [k[1], 0]] })}>
      <line x1={x} y1={G + 4} x2={x} y2={G - 38} stroke="#d9b98a" strokeWidth={4} />
      <path d={`M${x} ${G - 38} l16 5 l-16 5 z`} fill="#ff7a1a" />
    </g>
  );
}

function LotSign({
  x,
  k,
  line1,
  line2,
  accent = false,
}: {
  x: number;
  k: Parameters<typeof anim>[0];
  line1: string;
  line2: string;
  accent?: boolean;
}) {
  return (
    <g {...anim(k)} className="font-sans">
      <line x1={x} y1={G + 2} x2={x} y2={G - 64} stroke="#6b4a32" strokeWidth={6} />
      <rect x={x - 62} y={G - 110} width={124} height={50} rx={4} fill="#f5efe2" stroke="#2e2822" strokeWidth={2} />
      <text x={x} y={G - 90} textAnchor="middle" fontSize={10} letterSpacing={1.4} fill="#7f705a">
        {line1}
      </text>
      <text x={x} y={G - 70} textAnchor="middle" fontSize={17} fontWeight={700} fill={accent ? "#9b4a34" : "#2e2822"}>
        {line2}
      </text>
    </g>
  );
}

function Callout({
  k,
  from,
  to,
  lines,
  anchor = "start",
}: {
  k: readonly [number, number, number, number];
  from: [number, number];
  to: [number, number];
  lines: string[];
  anchor?: "start" | "end";
}) {
  return (
    <g {...anim({ o: window4(...k) })} className="font-sans">
      <circle cx={from[0]} cy={from[1]} r={5} fill="#fff" stroke="#1c1915" strokeWidth={2} />
      <path
        d={`M${from[0]} ${from[1]} L${to[0]} ${to[1]}`}
        stroke="#fff"
        strokeWidth={1.5}
        fill="none"
        {...anim({ d: grow(k[0], k[1]) })}
      />
      {(() => {
        const w = Math.max(...lines.map((l, i) => l.length * (i === 0 ? 10.2 : 7))) + 24;
        const h = 14 + lines.length * 20;
        const x = anchor === "start" ? to[0] : to[0] - w;
        return (
          <g>
            <rect x={x} y={to[1] - 14} width={w} height={h} rx={8} fill="#1c1915" opacity={0.88} />
            {lines.map((l, i) => (
              <text
                key={l}
                x={x + 12}
                y={to[1] + 6 + i * 20}
                fill={i === 0 ? "#fff" : "#e6dfd1"}
                fontSize={i === 0 ? 14 : 12.5}
                fontWeight={i === 0 ? 600 : 400}
                letterSpacing={i === 0 ? 1.4 : 0.2}
              >
                {l}
              </text>
            ))}
          </g>
        );
      })()}
    </g>
  );
}

/* ---------- the scene ---------- */

export function HouseScene() {
  const r = rng(7);

  /* soil pebbles */
  const pebbles = Array.from({ length: 110 }, () => ({
    x: r() * 1600,
    y: G + 24 + r() * 270,
    rx: 2 + r() * 5,
    ry: 1.5 + r() * 3,
    o: 0.25 + r() * 0.35,
  }));

  /* distant tree line */
  const treeline = Array.from({ length: 46 }, (_, i) => ({
    x: i * 36 + r() * 14,
    y: 548 + r() * 12,
    rr: 16 + r() * 12,
  }));

  /* grass tufts across the work zone (these get scraped off) */
  const tuftSeg = 36;
  const workL = 380;
  const workR = 1240;
  const tufts = Array.from({ length: Math.ceil((workR - workL) / tuftSeg) }, (_, i) => workL + i * tuftSeg);

  /* framing */
  const studs1 = Array.from({ length: 31 }, (_, i) => 484 + i * 21); // floor 1, x 484..1114
  const studs2 = Array.from({ length: 20 }, (_, i) => 484 + i * 21.6); // floor 2, main only
  const studsWing = studs1.filter((x) => x > 900);
  const studsMain1 = studs1.filter((x) => x <= 900);

  /* 4 ft sheathing / siding strips */
  const mainStrips = Array.from({ length: 10 }, (_, i) => 480 + i * 42);
  const wingStrips = Array.from({ length: 5 }, (_, i) => 900 + i * 44);

  /* windows (glass rects) used by dry-in, finish and dusk glow */
  const mainWindows = [
    { x: 516, y: 505, w: 84, h: 62, mull: 2 },
    { x: 780, y: 505, w: 84, h: 62, mull: 2 },
    { x: 536, y: 392, w: 62, h: 58, mull: 1 },
    { x: 659, y: 392, w: 62, h: 58, mull: 1 },
    { x: 782, y: 392, w: 62, h: 58, mull: 1 },
  ];
  const atticWindow = { x: 674, y: 282, w: 32, h: 46 };

  const shrubs = [
    { x: 500, r: 20 },
    { x: 538, r: 26 },
    { x: 590, r: 18 },
    { x: 790, r: 22 },
    { x: 836, r: 27 },
    { x: 880, r: 19 },
    { x: 1112, r: 18 },
  ];

  return (
    <g>
      <defs>
        <linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fc4e0" />
          <stop offset="0.65" stopColor="#dbe8ee" />
          <stop offset="1" stopColor="#f5efe2" />
        </linearGradient>
        <linearGradient id="sky-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#27304f" />
          <stop offset="0.5" stopColor="#7d5f80" />
          <stop offset="0.85" stopColor="#e9996a" />
          <stop offset="1" stopColor="#f6c48a" />
        </linearGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f6e50" />
          <stop offset="1" stopColor="#5a4130" />
        </linearGradient>
        <linearGradient id="pit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2a1d" />
          <stop offset="1" stopColor="#56402d" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5e7488" />
          <stop offset="0.5" stopColor="#3a4a5a" />
          <stop offset="1" stopColor="#2a3644" />
        </linearGradient>
        <radialGradient id="porch-glow">
          <stop offset="0" stopColor="#ffd98f" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd98f" stopOpacity="0" />
        </radialGradient>
        <pattern id="brick" width="48" height="16" patternUnits="userSpaceOnUse">
          <rect width="48" height="16" fill="#d9d0c3" />
          <rect x="0.5" y="0.5" width="23" height="7" fill="#9b4a34" />
          <rect x="24.5" y="0.5" width="23" height="7" fill="#a85540" />
          <rect x="-11.5" y="8.5" width="23" height="7" fill="#8e4330" />
          <rect x="12.5" y="8.5" width="23" height="7" fill="#a24f3a" />
          <rect x="36.5" y="8.5" width="23" height="7" fill="#964734" />
        </pattern>
        <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,.13)" strokeWidth="1" />
        </pattern>
        <clipPath id="main-gable-clip">
          <polygon points="480,360 690,236 900,360" />
        </clipPath>
        <clipPath id="wing-gable-clip">
          <polygon points="900,486 1010,416 1120,486" />
        </clipPath>
      </defs>

      {/* ---------------- sky ---------------- */}
      {/* sky also extends above the frame, for phones where the scene sits lower */}
      <rect x={-400} y={-900} width={2400} height={901} fill="#9fc4e0" />
      <rect x={-400} y={0} width={2400} height={640} fill="url(#sky-day)" />
      <g {...anim({ o: [[0.84, 0], [0.99, 1]], ease: "inOut" })}>
        <rect x={-400} y={-900} width={2400} height={901} fill="#27304f" />
        <rect x={-400} y={0} width={2400} height={640} fill="url(#sky-dusk)" />
      </g>

      {/* sun travels down through the build */}
      <g {...anim({ y: [[0, 0], [1, 250]], ease: "linear" })}>
        <circle cx={1330} cy={170} r={70} fill="#fff6dc" opacity={0.35} />
        <circle cx={1330} cy={170} r={44} fill="#fff4d6" />
        <circle cx={1330} cy={170} r={44} fill="#f7b267" {...anim({ o: [[0.8, 0], [0.98, 1]] })} />
      </g>

      {/* clouds drift slowly */}
      <g fill="#fff" {...anim({ x: [[0, 0], [1, -180]], ease: "linear" })}>
        <g opacity={0.85}>
          <ellipse cx={300} cy={140} rx={90} ry={24} />
          <ellipse cx={350} cy={124} rx={56} ry={28} />
          <ellipse cx={262} cy={128} rx={40} ry={20} />
        </g>
        <g opacity={0.7}>
          <ellipse cx={820} cy={96} rx={70} ry={18} />
          <ellipse cx={860} cy={84} rx={44} ry={20} />
        </g>
        <g opacity={0.6}>
          <ellipse cx={1560} cy={220} rx={80} ry={20} />
          <ellipse cx={1600} cy={206} rx={50} ry={22} />
        </g>
      </g>

      {/* ---------------- distance ---------------- */}
      <path d="M0 520 C 200 470 420 482 640 505 S 1100 468 1300 492 S 1520 478 1600 500 L1600 640 L0 640 Z" fill="#b7c6a5" />
      <g fill="#8aa476">
        {treeline.map((t, i) => (
          <circle key={i} cx={t.x} cy={t.y} r={t.rr} />
        ))}
      </g>
      <path d="M0 562 C 260 532 480 548 700 562 S 1200 536 1600 556 L1600 640 L0 640 Z" fill="#9cb289" />

      {/* neighbouring trees never move, they anchor the camera */}
      <Tree x={110} scale={1.25} />
      <Tree x={1500} scale={1.15} tone="#58793f" />
      <Tree x={1420} scale={0.8} tone="#6a8c50" />

      {/* ---------------- soil cut-away ---------------- */}
      <rect x={0} y={G} width={1600} height={300} fill="url(#soil)" />
      <path d="M0 660 C 300 650 520 672 800 662 S 1300 650 1600 664 L1600 690 C 1300 680 1100 694 800 688 S 300 676 0 686 Z" fill="#7a5a40" opacity={0.6} />
      <path d="M0 770 C 340 758 600 782 900 772 S 1400 760 1600 774 L1600 800 C 1300 792 1000 806 760 798 S 300 784 0 796 Z" fill="#4f3a2a" opacity={0.45} />
      <g fill="#b39272">
        {pebbles.map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} opacity={p.o} />
        ))}
      </g>
      {/* topsoil band */}
      <rect x={0} y={G - 4} width={1600} height={12} fill="#9a7552" />
      <rect x={0} y={G - 4} width={1600} height={2} fill="#b48c63" />

      {/* grass outside the work zone stays all along */}
      <rect x={0} y={G - 10} width={workL} height={14} fill="#6e9a48" />
      <rect x={workR} y={G - 10} width={1600 - workR} height={14} fill="#6e9a48" />
      <path
        d={`M0 ${G - 10} ${Array.from({ length: 40 }, (_, i) => `l${4} -7 l${5} 7`).join(" ")}`}
        fill="#6e9a48"
      />
      <path
        d={`M${workR} ${G - 10} ${Array.from({ length: 40 }, () => `l4 -7 l5 7`).join(" ")}`}
        fill="#6e9a48"
      />

      {/* grass in the work zone gets scraped off, left to right */}
      {tufts.map((x, i) => {
        const k = stagger(i, tufts.length, 0.11, 0.2, 0.025);
        return (
          <g key={x} {...anim({ o: [[k[0], 1], [k[1], 0], [0.9 + i * 0.002, 0], [0.93 + i * 0.002, 1]] })}>
            <rect x={x} y={G - 10} width={tuftSeg + 1} height={14} fill="#6e9a48" />
            <path d={`M${x} ${G - 10} l4 -7 l5 7 l4 -6 l5 6 l4 -8 l5 8 l4 -6 l5 6`} fill="#79a652" />
          </g>
        );
      })}

      {/* trees on the lot are felled during site prep */}
      <g {...anim({ r: [[0.12, 0], [0.16, -84]], o: [[0.155, 1], [0.19, 0]], origin: [640, G], ease: "inOut" })}>
        <Tree x={640} scale={1.05} />
      </g>
      <g {...anim({ r: [[0.14, 0], [0.18, 84]], o: [[0.175, 1], [0.21, 0]], origin: [1010, G], ease: "inOut" })}>
        <Tree x={1010} scale={0.92} tone="#58793f" />
      </g>

      {/* corner stakes */}
      <Stake x={466} k={[0.13, 0.16]} />
      <Stake x={1156} k={[0.15, 0.18]} />

      {/* ---------------- excavation ---------------- */}
      <polygon
        points={`440,${G} 1180,${G} 1150,690 470,690`}
        fill="url(#pit)"
        {...anim({ sy: grow(S.dig[0] + 0.01, S.dig[1] - 0.02), o: [[0.22, 0], [0.235, 1]], origin: "top", ease: "inOut" })}
      />

      {/* spoil pile, shrinks when it goes back in as backfill */}
      <path
        d={`M226 ${G} Q 290 520 345 514 Q 396 512 452 ${G} Z`}
        fill="#7d5c40"
        {...anim({
          sy: [[0.23, 0], [0.35, 1], [0.56, 1], [0.62, 0.45], [0.9, 0.45], [0.95, 0]],
          o: [[0.22, 0], [0.24, 1], [0.92, 1], [0.96, 0]],
          origin: "bottom",
        })}
      />
      <path
        d={`M262 ${G - 30} Q 300 540 340 534`}
        stroke="#9a7552"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        {...anim({ o: [[0.32, 0], [0.35, 0.8], [0.56, 0.8], [0.6, 0]] })}
      />

      {/* builder's lot sign: comes down for site prep, back up as SOLD at the end */}
      <LotSign x={1300} k={{ o: [[0.13, 1], [0.155, 0]] }} line1={site.shortName.toUpperCase()} line2={site.lotLabel.toUpperCase()} />
      <LotSign x={1300} k={{ o: [[0.95, 0], [0.97, 1]], y: [[0.95, -16], [0.97, 0]] }} line1={site.shortName.toUpperCase()} line2="SOLD" accent />

      {/* ---------------- layout: string line, dimensions, blueprint ---------------- */}
      <g {...anim({ o: fadeOut(0.56, 0.6) })}>
        {/* batter boards */}
        <g {...anim({ o: fadeIn(0.36, 0.38) })} fill="#c99a5f">
          <rect x={426} y={G - 26} width={6} height={30} />
          <rect x={414} y={G - 26} width={30} height={5} />
          <rect x={1190} y={G - 26} width={6} height={30} />
          <rect x={1178} y={G - 26} width={30} height={5} />
        </g>
        <line x1={429} y1={G - 22} x2={1193} y2={G - 22} stroke="#ff7a1a" strokeWidth={2} {...anim({ d: grow(0.37, 0.41) })} />

        {/* width dimension */}
        <g className="font-sans">
          <line x1={480} y1={540} x2={1120} y2={540} stroke="#fff" strokeWidth={2} {...anim({ d: grow(0.38, 0.42) })} />
          <g {...anim({ o: fadeIn(0.41, 0.43) })} stroke="#fff" strokeWidth={2}>
            <line x1={480} y1={524} x2={480} y2={572} />
            <line x1={1120} y1={524} x2={1120} y2={572} />
            <line x1={472} y1={548} x2={488} y2={532} />
            <line x1={1112} y1={548} x2={1128} y2={532} />
          </g>
          <g {...anim({ o: fadeIn(0.41, 0.44), y: [[0.41, 8], [0.44, 0]] })}>
            <rect x={752} y={524} width={96} height={32} rx={16} fill="#1c1915" />
            <text x={800} y={545} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={600} letterSpacing={0.5}>
              {site.footprint}
            </text>
          </g>
        </g>

        {/* depth dimension, right of the pit */}
        <g className="font-sans">
          <line x1={1214} y1={G} x2={1214} y2={690} stroke="#fff" strokeWidth={2} {...anim({ d: grow(0.4, 0.43) })} />
          <g {...anim({ o: fadeIn(0.42, 0.44) })} stroke="#fff" strokeWidth={2}>
            <line x1={1150} y1={690} x2={1226} y2={690} strokeDasharray="4 4" />
            <line x1={1180} y1={G} x2={1226} y2={G} strokeDasharray="4 4" />
          </g>
          <g {...anim({ o: fadeIn(0.42, 0.45) })}>
            <rect x={1226} y={629} width={62} height={30} rx={15} fill="#1c1915" />
            <text x={1257} y={649} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={600}>
              {site.depth}
            </text>
          </g>
        </g>
      </g>

      {/* blueprint sheet */}
      <g transform="translate(0 70) rotate(-3 1060 185)">
        <g {...anim({ o: window4(0.37, 0.4, 0.55, 0.59), y: [[0.37, -40], [0.41, 0], [0.55, 0], [0.59, -40]] })} className="font-sans">
          <rect x={890} y={82} width={360} height={232} rx={6} fill="#000" opacity={0.18} />
          <rect x={880} y={70} width={360} height={232} rx={6} fill="#1f4f7a" />
          <rect x={880} y={70} width={360} height={232} rx={6} fill="url(#bp-grid)" />
          <g stroke="#e9f2fb" fill="none" strokeLinecap="square">
            <rect x={914} y={104} width={222} height={150} strokeWidth={3.5} {...anim({ d: grow(0.4, 0.44) })} />
            <rect x={1136} y={140} width={72} height={114} strokeWidth={3.5} {...anim({ d: grow(0.42, 0.45) })} />
            <path d="M1000 104 V254" strokeWidth={2} {...anim({ d: grow(0.43, 0.46) })} />
            <path d="M914 180 H1000" strokeWidth={2} {...anim({ d: grow(0.435, 0.46) })} />
            <path d="M1000 200 H1136" strokeWidth={2} {...anim({ d: grow(0.44, 0.465) })} />
            <path d="M1060 104 V200" strokeWidth={2} {...anim({ d: grow(0.445, 0.47) })} />
            <path d="M1036 254 a24 24 0 0 1 24 -24" strokeWidth={1.5} {...anim({ d: grow(0.45, 0.47) })} />
            <path d="M940 180 a22 22 0 0 0 22 22" strokeWidth={1.5} {...anim({ d: grow(0.45, 0.47) })} />
            <path d="M914 92 H1136" strokeWidth={1} {...anim({ d: grow(0.44, 0.47) })} />
          </g>
          <g {...anim({ o: fadeIn(0.45, 0.48) })} fill="#e9f2fb">
            <text x={1025} y={88} textAnchor="middle" fontSize={10} letterSpacing={1}>
              {site.footprint}
            </text>
            <text x={956} y={146} textAnchor="middle" fontSize={9} opacity={0.8}>
              FAMILY
            </text>
            <text x={1068} y={234} textAnchor="middle" fontSize={9} opacity={0.8}>
              KITCHEN
            </text>
            <text x={1172} y={200} textAnchor="middle" fontSize={9} opacity={0.8}>
              GARAGE
            </text>
            <text x={1098} y={154} textAnchor="middle" fontSize={9} opacity={0.8}>
              BED 1
            </text>
          </g>
          <g {...anim({ o: fadeIn(0.41, 0.44) })}>
            <rect x={1092} y={270} width={140} height={24} fill="none" stroke="#e9f2fb" strokeWidth={1} />
            <text x={1100} y={286} fontSize={9} fill="#e9f2fb" letterSpacing={0.8}>
              {site.planLabel.toUpperCase()}
            </text>
          </g>
        </g>
      </g>

      {/* ---------------- foundation ---------------- */}
      <g fill="#a9a7a1">
        <rect x={466} y={674} width={52} height={16} {...anim({ sy: grow(0.49, 0.51), o: fadeIn(0.49, 0.5), origin: "bottom" })} />
        <rect x={1102} y={674} width={52} height={16} {...anim({ sy: grow(0.495, 0.515), o: fadeIn(0.495, 0.505), origin: "bottom" })} />
      </g>
      <rect x={500} y={674} width={600} height={16} fill="#b8b5ad" {...anim({ sx: grow(0.53, 0.57), o: fadeIn(0.53, 0.54), origin: "left" })} />
      <rect x={500} y={G} width={600} height={74} fill="#47433d" {...anim({ o: fadeIn(0.55, 0.59) })} />
      <g fill="#c6c3bb">
        <rect x={480} y={G} width={20} height={76} {...anim({ sy: grow(0.51, 0.555), o: fadeIn(0.51, 0.52), origin: "bottom" })} />
        <rect x={1100} y={G} width={20} height={76} {...anim({ sy: grow(0.515, 0.56), o: fadeIn(0.515, 0.525), origin: "bottom" })} />
      </g>
      <g fill="#262422" {...anim({ o: fadeIn(0.555, 0.575) })}>
        <rect x={476} y={G} width={4} height={76} />
        <rect x={1120} y={G} width={4} height={76} />
      </g>
      {/* backfill */}
      <g fill="#86664a" {...anim({ o: fadeIn(0.57, 0.6) })}>
        <polygon points={`440,${G} 476,${G} 476,690 470,690`} />
        <polygon points={`1124,${G} 1180,${G} 1150,690 1124,690`} />
      </g>

      <Callout
        k={[0.53, 0.55, 0.59, 0.61]}
        from={[1110, 650]}
        to={[1060, 760]}
        anchor="end"
        lines={["POURED WALLS", "8\" concrete, waterproofed"]}
      />

      {/* concrete mixer backs in from the right */}
      <g {...anim({ x: [[0.47, 760], [0.52, 0], [0.575, 0], [0.62, 760]], ease: "inOut" })}>
        <rect x={1196} y={556} width={250} height={18} rx={3} fill="#3a3a3a" />
        <path d="M1376 556 V506 Q1376 498 1384 498 H1426 Q1446 498 1452 520 L1458 556 Z" fill="#ece9e2" />
        <path d="M1390 506 H1426 Q1438 506 1442 524 H1390 Z" fill="#33434f" />
        <g>
          <path d="M1208 548 Q1206 480 1270 470 L1350 472 Q1372 478 1370 530 L1366 550 Z" fill="#d9d4ca" />
          <path d="M1240 476 L1262 548 M1286 470 L1306 548 M1328 472 L1344 548" stroke="#c97f3d" strokeWidth={9} {...anim({ x: [[0.5, 0], [0.58, 30]], ease: "linear" })} />
        </g>
        <line x1={1206} y1={530} x2={1150} y2={584} stroke="#8a8a8a" strokeWidth={9} strokeLinecap="round" />
        <g fill="#1f1f1f">
          <circle cx={1236} cy={578} r={18} />
          <circle cx={1282} cy={578} r={18} />
          <circle cx={1410} cy={578} r={18} />
        </g>
        <g fill="#888">
          <circle cx={1236} cy={578} r={7} />
          <circle cx={1282} cy={578} r={7} />
          <circle cx={1410} cy={578} r={7} />
        </g>
      </g>

      {/* excavator rolls in from the right, digs, then leaves */}
      <g {...anim({ x: [[0.17, 720], [0.23, 0], [0.37, 0], [0.43, 760]], ease: "inOut" })}>
        <rect x={1190} y={574} width={168} height={26} rx={13} fill="#2b2b2b" />
        <g fill="#5a5a5a">
          <circle cx={1204} cy={587} r={9} />
          <circle cx={1344} cy={587} r={9} />
          <circle cx={1240} cy={590} r={6} />
          <circle cx={1274} cy={590} r={6} />
          <circle cx={1308} cy={590} r={6} />
        </g>
        <rect x={1212} y={564} width={126} height={12} fill="#3a3a3a" />
        <rect x={1226} y={518} width={122} height={48} rx={4} fill="#e5a82a" />
        <rect x={1330} y={524} width={24} height={40} rx={4} fill="#c98f1c" />
        <rect x={1226} y={474} width={62} height={48} rx={4} fill="#e5a82a" />
        <rect x={1233} y={481} width={48} height={34} rx={2} fill="#2f3e4a" opacity={0.9} />
        <line x1={1316} y1={518} x2={1316} y2={492} stroke="#2b2b2b" strokeWidth={5} />
        <g {...anim({ r: [[0.23, 0], [0.255, -11], [0.28, 3], [0.305, -11], [0.33, 3], [0.355, -9], [0.37, 0]], origin: [1232, 528], ease: "inOut" })}>
          <polygon points="1238,514 1176,428 1156,438 1226,538" fill="#e5a82a" />
          <polygon points="1166,430 1116,592 1130,598 1180,442" fill="#d99a1f" />
          <line x1={1218} y1={500} x2={1186} y2={452} stroke="#bdbdbd" strokeWidth={6} strokeLinecap="round" />
          <path d="M1100 586 L1136 590 L1130 618 Q1112 630 1098 612 Z" fill="#3a3a3a" />
        </g>
      </g>

      {/* ================= GARAGE WING (behind main house) ================= */}
      {/* floor deck across the whole foundation */}
      <rect x={476} y={588} width={648} height={12} fill="#c99a5f" {...anim({ sx: grow(0.6, 0.62), o: fadeIn(0.6, 0.605), origin: "left" })} />

      {/* wing framing */}
      <g stroke="#d9ac6f" strokeWidth={5}>
        {studsWing.map((x, i) => {
          const k = stagger(i, studsWing.length, 0.635, 0.66, 0.012);
          return <line key={x} x1={x} y1={588} x2={x} y2={486} {...anim({ sy: grow(k[0], k[1]), o: fadeIn(k[0], k[0] + 0.003), origin: "bottom" })} />;
        })}
      </g>
      <rect x={900} y={480} width={224} height={8} fill="#c99a5f" {...anim({ sx: grow(0.66, 0.67), o: fadeIn(0.66, 0.662), origin: "left" })} />
      <g stroke="#c99a5f" strokeWidth={5} fill="none" strokeLinejoin="round" {...anim({ o: fadeOut(0.785, 0.8) })}>
        <polyline points="888,486 1010,410 1132,486" {...anim({ d: grow(0.705, 0.725) })} />
        <path d="M1010 412 V484 M949 449 L978 484 M1071 449 L1042 484" strokeWidth={3.5} {...anim({ d: grow(0.715, 0.735) })} />
      </g>

      {/* wing sheathing */}
      {wingStrips.map((x, i) => {
        const k = stagger(i, wingStrips.length, 0.755, 0.775, 0.01);
        return <rect key={x} x={x} y={480} width={44} height={108} fill="#d8b47e" stroke="#b8925c" strokeWidth={1} {...anim({ o: fadeIn(k[0], k[1]) })} />;
      })}
      <polygon points="900,486 1010,416 1120,486" fill="#d8b47e" stroke="#b8925c" strokeWidth={1} {...anim({ o: fadeIn(0.78, 0.79) })} />

      {/* wing brick (finish), laid course by course from the bottom */}
      {Array.from({ length: 6 }, (_, i) => {
        const y = 588 - (i + 1) * 18;
        const k = stagger(i, 6, 0.858, 0.885, 0.008);
        return <rect key={y} x={900} y={y} width={220} height={18.5} fill="url(#brick)" {...anim({ o: fadeIn(k[0], k[1]) })} />;
      })}
      <g clipPath="url(#wing-gable-clip)" {...anim({ o: fadeIn(0.88, 0.895) })}>
        <rect x={900} y={410} width={220} height={80} fill="#e9e5dc" />
        <path d={Array.from({ length: 20 }, (_, i) => `M${900 + i * 11} 410 V490`).join(" ")} stroke="#d6d0c3" strokeWidth={2} />
      </g>
      {/* wing roof */}
      <polygon points="880,490 1010,402 1140,490 1120,490 1010,424 900,490" fill="#2f3338" {...anim({ o: fadeIn(0.79, 0.81), y: [[0.79, -10], [0.81, 0]] })} />
      <rect x={998} y={444} width={24} height={20} rx={2} fill="#2f3338" {...anim({ o: fadeIn(0.8, 0.82) })} />
      {/* garage door */}
      <g {...anim({ o: fadeIn(0.87, 0.89), sy: grow(0.87, 0.89), origin: "top" })}>
        <rect x={936} y={506} width={150} height={82} fill="#9a6b40" />
        <path d="M936 526 H1086 M936 547 H1086 M936 568 H1086" stroke="#7d5432" strokeWidth={2} />
        <rect x={944} y={512} width={134} height={10} fill="#33434f" opacity={0.85} />
      </g>
      <rect x={932} y={500} width={158} height={6} fill="#2f3338" {...anim({ o: fadeIn(0.87, 0.88) })} />

      {/* ================= MAIN HOUSE ================= */}
      {/* floor 1 studs */}
      <g stroke="#ddb074" strokeWidth={5}>
        {studsMain1.map((x, i) => {
          const k = stagger(i, studsMain1.length, 0.61, 0.64, 0.012);
          return <line key={x} x1={x} y1={588} x2={x} y2={486} {...anim({ sy: grow(k[0], k[1]), o: fadeIn(k[0], k[0] + 0.003), origin: "bottom" })} />;
        })}
      </g>
      <rect x={476} y={480} width={428} height={8} fill="#c99a5f" {...anim({ sx: grow(0.645, 0.655), o: fadeIn(0.645, 0.647), origin: "left" })} />
      {/* second floor deck + studs */}
      <rect x={476} y={470} width={428} height={10} fill="#c99a5f" {...anim({ sx: grow(0.655, 0.665), o: fadeIn(0.655, 0.657), origin: "left" })} />
      <g stroke="#ddb074" strokeWidth={5}>
        {studs2.map((x, i) => {
          const k = stagger(i, studs2.length, 0.665, 0.69, 0.012);
          return <line key={x} x1={x} y1={470} x2={x} y2={368} {...anim({ sy: grow(k[0], k[1]), o: fadeIn(k[0], k[0] + 0.003), origin: "bottom" })} />;
        })}
      </g>
      <rect x={476} y={360} width={428} height={8} fill="#c99a5f" {...anim({ sx: grow(0.69, 0.7), o: fadeIn(0.69, 0.692), origin: "left" })} />
      {/* gable end truss (hidden once the gable is sheathed) */}
      <g stroke="#c99a5f" strokeWidth={6} fill="none" strokeLinejoin="round" {...anim({ o: fadeOut(0.785, 0.8) })}>
        <polyline points="452,364 690,226 928,364" {...anim({ d: grow(0.7, 0.72) })} />
        <path
          d="M690 228 V360 M571 295 L620 360 M809 295 L760 360 M630 262 L655 360 M750 262 L725 360"
          strokeWidth={4}
          {...anim({ d: grow(0.71, 0.735) })}
        />
      </g>
      <Callout
        k={[0.67, 0.69, 0.735, 0.75]}
        from={[862, 420]}
        to={[990, 330]}
        lines={["2x6 FRAMING", "16\" on center, engineered trusses"]}
      />

      {/* main sheathing */}
      {mainStrips.map((x, i) => {
        const k = stagger(i, mainStrips.length, 0.745, 0.775, 0.01);
        return <rect key={x} x={x} y={360} width={42} height={228} fill="#d8b47e" stroke="#b8925c" strokeWidth={1} {...anim({ o: fadeIn(k[0], k[1]) })} />;
      })}
      <polygon points="480,360 690,236 900,360" fill="#d8b47e" stroke="#b8925c" strokeWidth={1} {...anim({ o: fadeIn(0.775, 0.785) })} />
      <path d="M480 474 H900" stroke="#b8925c" strokeWidth={2} {...anim({ o: fadeIn(0.77, 0.78) })} />

      {/* main brick (finish), laid course by course from the bottom */}
      {Array.from({ length: 12 }, (_, i) => {
        const y = 588 - (i + 1) * 19;
        const k = stagger(i, 12, 0.845, 0.88, 0.008);
        return <rect key={y} x={480} y={y} width={420} height={19.5} fill="url(#brick)" {...anim({ o: fadeIn(k[0], k[1]) })} />;
      })}
      <g clipPath="url(#main-gable-clip)" {...anim({ o: fadeIn(0.875, 0.89) })}>
        <rect x={480} y={230} width={420} height={132} fill="#f3f0e9" />
        <path d={Array.from({ length: 31 }, (_, i) => `M${480 + i * 14} 230 V362`).join(" ")} stroke="#dfd9cd" strokeWidth={2} />
      </g>
      <rect x={480} y={356} width={420} height={6} fill="#fbfaf6" {...anim({ o: fadeIn(0.88, 0.89) })} />

      {/* main roof */}
      <polygon
        points="430,378 690,206 950,378 924,378 690,232 456,378"
        fill="#2f3338"
        {...anim({ o: fadeIn(0.785, 0.805), y: [[0.785, -12], [0.805, 0]] })}
      />
      <polyline points="456,378 690,232 924,378" fill="none" stroke="#fbfaf6" strokeWidth={3} {...anim({ o: fadeIn(0.88, 0.9) })} />
      <Callout
        k={[0.79, 0.81, 0.835, 0.85]}
        from={[800, 300]}
        to={[990, 236]}
        lines={["STANDING-SEAM ROOF", "Dried in before the first storm"]}
      />

      {/* windows, black frames (go in at dry-in) */}
      {[...mainWindows, atticWindow].map((w, i) => {
        const k = stagger(i, 6, 0.795, 0.83, 0.01);
        const mull = "mull" in w ? (w.mull as number) : 0;
        return (
          <g key={i} {...anim({ o: fadeIn(k[0], k[1]), s: [[k[0], 0.85], [k[1], 1]], origin: "center" })}>
            <rect x={w.x - 9} y={w.y - 9} width={w.w + 18} height={w.h + 20} fill="#fbfaf6" />
            <rect x={w.x - 4} y={w.y - 4} width={w.w + 8} height={w.h + 8} fill="#1c1d1f" />
            <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="url(#glass)" />
            <path d={`M${w.x + 4} ${w.y + w.h - 6} L${w.x + w.w * 0.55} ${w.y + 4}`} stroke="#fff" strokeOpacity={0.18} strokeWidth={8} />
            {mull >= 1 && <line x1={w.x + w.w / 2} y1={w.y} x2={w.x + w.w / 2} y2={w.y + w.h} stroke="#1c1d1f" strokeWidth={3} />}
            {mull >= 2 && <line x1={w.x} y1={w.y + w.h / 2} x2={w.x + w.w} y2={w.y + w.h / 2} stroke="#1c1d1f" strokeWidth={3} />}
          </g>
        );
      })}

      {/* front door + porch (finish) */}
      <g {...anim({ o: fadeIn(0.88, 0.9) })}>
        <rect x={662} y={500} width={56} height={88} fill="#8a5a34" />
        <rect x={662} y={500} width={56} height={88} fill="none" stroke="#1c1d1f" strokeWidth={4} />
        <rect x={672} y={512} width={36} height={30} fill="url(#glass)" />
        <circle cx={708} cy={552} r={3} fill="#e0c28a" />
        <rect x={650} y={588} width={80} height={6} fill="#bdb8ae" />
        <rect x={642} y={594} width={96} height={6} fill="#a9a59c" />
      </g>
      <g {...anim({ o: fadeIn(0.885, 0.905), y: [[0.885, -8], [0.905, 0]] })}>
        <polygon points="606,480 774,480 786,494 594,494" fill="#2f3338" />
        <rect x={612} y={494} width={9} height={94} fill="#fbfaf6" />
        <rect x={759} y={494} width={9} height={94} fill="#fbfaf6" />
        <rect x={642} y={512} width={7} height={11} rx={2} fill="#1c1d1f" />
        <rect x={731} y={512} width={7} height={11} rx={2} fill="#1c1d1f" />
      </g>

      {/* ---------------- landscaping ---------------- */}
      <rect x={930} y={G - 4} width={160} height={10} fill="#cfcac0" {...anim({ o: fadeIn(0.9, 0.92) })} />
      {shrubs.map((s, i) => {
        const k = stagger(i, shrubs.length, 0.91, 0.95, 0.015);
        return (
          <g key={s.x} {...anim({ s: grow(k[0], k[1]), o: fadeIn(k[0], k[0] + 0.004), origin: [s.x, G - 2] })}>
            <ellipse cx={s.x} cy={G - s.r * 0.55} rx={s.r * 1.15} ry={s.r * 0.75} fill="#557a3e" />
            <ellipse cx={s.x - s.r * 0.3} cy={G - s.r * 0.8} rx={s.r * 0.6} ry={s.r * 0.45} fill="#6a9150" />
          </g>
        );
      })}
      <g {...anim({ s: grow(0.93, 0.97), o: fadeIn(0.93, 0.935), origin: [404, G] })}>
        <Tree x={404} scale={0.72} tone="#6a9150" tone2="#7da35e" />
      </g>
      <g {...anim({ s: grow(0.94, 0.98), o: fadeIn(0.94, 0.945), origin: [1226, G] })}>
        <Tree x={1226} scale={0.62} tone="#5f8148" tone2="#76a058" />
      </g>
      <g {...anim({ o: fadeIn(0.94, 0.96) })}>
        <rect x={1156} y={G - 44} width={4} height={46} fill="#3a3a3a" />
        <rect x={1144} y={G - 58} width={28} height={16} rx={7} fill="#1c1d1f" />
      </g>

      {/* ---------------- dusk ---------------- */}
      <rect x={-400} y={-900} width={2400} height={1800} fill="#1d2240" {...anim({ o: [[0.88, 0], [1, 0.3]], ease: "inOut" })} />

      {/* lights come on */}
      <g {...anim({ o: [[0.9, 0], [0.99, 1]], ease: "inOut" })}>
        {[...mainWindows, atticWindow].map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} fill="#ffcf7a" opacity={i === 5 ? 0.7 : 0.92} />
        ))}
        <rect x={672} y={512} width={36} height={30} fill="#ffcf7a" />
        <rect x={944} y={512} width={134} height={10} fill="#ffcf7a" opacity={0.7} />
        <circle cx={645} cy={518} r={36} fill="url(#porch-glow)" />
        <circle cx={734} cy={518} r={36} fill="url(#porch-glow)" />
        <rect x={500} y={G} width={600} height={74} fill="#ffcf7a" opacity={0.14} />
      </g>
    </g>
  );
}
