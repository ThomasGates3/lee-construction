#!/usr/bin/env node
/**
 * Makes the photoreal frames for the scroll build on fal.ai, with your own key.
 *
 *   export FAL_KEY=...            # your key from fal.ai, never commit it
 *   node production/scripts/fal-build.mjs plan            # shows what runs and what it costs, no key needed
 *   node production/scripts/fal-build.mjs stills          # finished home first, then edits back to the grass lot
 *   node production/scripts/fal-build.mjs clips           # Kling video between each pair of stills
 *   node production/scripts/fal-build.mjs frames          # ffmpeg: clips -> WebP frames in public/frames/
 *
 * Options
 *   --aspect wide|tall|both   which framing to make (default wide: the desktop set)
 *   --only N                  redo one stage (stills) or the clip that ends on stage N (clips)
 *   --from N                  restart stills from stage N downwards, keeping the later ones
 *   --prompts path.json       another prompt set (default production/prompts/brick-ranch-atlanta.json)
 *
 * A prompt set with a "base" block builds on another set instead of starting over: stages up to
 * base.reuse_through are copied from that set's stills, and the finished image is an edit of the
 * other set's finished still, so the lot, camera and footprint stay identical.
 *   --yes                     skip the "spend this?" question
 *
 * Look at the stills before you run clips. A still that drifts (house moved, horizon
 * shifted, extra stuff left over) is cheap to redo with --only; a bad clip costs more.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/* fal endpoints and prices as listed on fal.ai on 2026-11-21. Check before big runs. */
const IMAGE_T2I = "fal-ai/nano-banana-2";
const IMAGE_EDIT = "fal-ai/nano-banana-2/edit";
const VIDEO = "fal-ai/kling-video/v2.6/pro/image-to-video";
const PRICE = { still2k: 0.08 * 1.5, videoPerSecond: 0.07 };
const CLIP_SECONDS = 5;

/* frame budgets from the research: desktop ~170 frames at 1920 px, phone ~110 at 1080 px */
const FRAMES = {
  wide: { count: 170, width: 1920, quality: 75 },
  tall: { count: 110, width: 1080, quality: 70 },
};

/* ---------- args ---------- */
const [, , command = "plan", ...rest] = process.argv;
const opt = (name, fallback) => {
  const i = rest.indexOf(`--${name}`);
  return i === -1 ? fallback : rest[i + 1];
};
const flag = (name) => rest.includes(`--${name}`);
const aspects = (() => {
  const a = opt("aspect", "wide");
  if (a === "both") return ["wide", "tall"];
  if (a !== "wide" && a !== "tall") die(`--aspect must be wide, tall or both, not "${a}"`);
  return [a];
})();
const only = opt("only") ? Number(opt("only")) : null;
const from = opt("from") ? Number(opt("from")) : null;
const promptsPath = resolve(ROOT, opt("prompts", "production/prompts/brick-ranch-atlanta.json"));
const P = JSON.parse(readFileSync(promptsPath, "utf8"));
const stages = [...P.stages].sort((a, b) => a.id - b.id);
const last = stages[stages.length - 1].id;

function die(msg) {
  console.error(`\n  ${msg}\n`);
  process.exit(1);
}

/* ---------- paths and manifest ---------- */
const outDir = (aspect) => join(ROOT, "production/out", P.name, aspect);
const manifestPath = (aspect) => join(outDir(aspect), "manifest.json");
const loadManifest = (aspect) =>
  existsSync(manifestPath(aspect)) ? JSON.parse(readFileSync(manifestPath(aspect), "utf8")) : { stills: {}, clips: {} };
const saveManifest = (aspect, m) => {
  mkdirSync(outDir(aspect), { recursive: true });
  writeFileSync(manifestPath(aspect), JSON.stringify(m, null, 2) + "\n");
};
const stillFile = (aspect, s, name = P.name) =>
  join(ROOT, "production/out", name, aspect, "stills", `${String(s.id).padStart(2, "0")}-${s.slug}.png`);
const reused = (s) => Boolean(P.base) && s.id <= P.base.reuse_through;
const clipFile = (aspect, s) => join(outDir(aspect), "clips", `${String(s.id).padStart(2, "0")}-${s.slug}.mp4`);

/* ---------- prompts ---------- */
function finalPrompt(aspect) {
  const a = P.aspects[aspect];
  return [
    `Generate an image, ${a.aspect_ratio}, photorealistic.`,
    a.bible,
    P.final,
    "Locked camera, fixed tripod perspective. No people, no readable text, no logos, no signs.",
  ].join(" ");
}
function editPrompt(aspect, s) {
  const a = P.aspects[aspect];
  return [`Edit this photo. ${P.lock}`, a.bible, `Change only this: ${s.edit}`, "Photorealistic, same image quality as the input."].join(
    " ",
  );
}
function clipPrompt(s) {
  return [P.video.prompt_prefix, s.clip, P.video.prompt_suffix].join(" ");
}

/* ---------- what will run ---------- */
function stillJobs(aspect) {
  if (only) return stages.filter((s) => s.id === only && !reused(s));
  const top = from ?? last;
  return stages.filter((s) => s.id <= top && !reused(s)).sort((a, b) => b.id - a.id); // finished first, then backwards
}
function baseEditPrompt(aspect) {
  const a = P.aspects[aspect];
  return [`Edit this photo. ${P.lock}`, a.bible, `Change only this: ${P.base.edit}`, P.final, "Photorealistic, same image quality as the input."].join(" ");
}
/** copy the stages this set shares with its base set, so clips can start from them */
function copyReused(aspect, m) {
  const bm = JSON.parse(readFileSync(join(ROOT, "production/out", P.base.set, aspect, "manifest.json"), "utf8"));
  for (const s of stages.filter(reused)) {
    const src = stillFile(aspect, s, P.base.set);
    if (!existsSync(src)) die(`Missing ${src}. Make the ${P.base.set} stills first.`);
    mkdirSync(dirname(stillFile(aspect, s)), { recursive: true });
    copyFileSync(src, stillFile(aspect, s));
    m.stills[s.id] = { ...bm.stills[s.id], from: P.base.set };
  }
}
async function baseUrl(fal, aspect) {
  const bm = JSON.parse(readFileSync(join(ROOT, "production/out", P.base.set, aspect, "manifest.json"), "utf8"));
  const known = bm.stills[last]?.url;
  const head = known ? await fetch(known, { method: "HEAD" }).catch(() => null) : null;
  if (head?.ok) return known;
  const file = stillFile(aspect, stages.find((x) => x.id === last), P.base.set);
  return fal.storage.upload(new Blob([readFileSync(file)], { type: "image/png" }));
}
function clipJobs() {
  const withClip = stages.filter((s) => s.clip && s.id > stages[0].id);
  return only ? withClip.filter((s) => s.id === only) : withClip;
}
function estimate(cmd) {
  let stills = 0;
  let clips = 0;
  for (const a of aspects) {
    if (cmd === "stills" || cmd === "plan") stills += stillJobs(a).length;
    if (cmd === "clips" || cmd === "plan") clips += clipJobs().length;
  }
  const cost = stills * PRICE.still2k + clips * CLIP_SECONDS * PRICE.videoPerSecond;
  return { stills, clips, cost };
}

async function confirmSpend(cmd) {
  const e = estimate(cmd);
  console.log(
    `\n  ${cmd}: ${e.stills ? `${e.stills} stills` : ""}${e.stills && e.clips ? " + " : ""}${
      e.clips ? `${e.clips} clips of ${CLIP_SECONDS}s` : ""
    } for ${aspects.join(" + ")}, about $${e.cost.toFixed(2)} on your fal account.`,
  );
  if (flag("yes")) return;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question("  Spend this? (y/N) ")).trim().toLowerCase();
  rl.close();
  if (answer !== "y" && answer !== "yes") die("Stopped. Nothing was charged.");
}

/* ---------- fal ---------- */
async function falClient() {
  if (!process.env.FAL_KEY) die("Set FAL_KEY first:  export FAL_KEY=your-key-from-fal.ai");
  const { fal } = await import("@fal-ai/client");
  fal.config({ credentials: process.env.FAL_KEY });
  return fal;
}
async function run(fal, endpoint, input, label) {
  process.stdout.write(`  ${label} ... `);
  const t = Date.now();
  const res = await fal.subscribe(endpoint, { input, logs: false });
  console.log(`done in ${Math.round((Date.now() - t) / 1000)}s`);
  return res.data;
}
async function download(url, file) {
  mkdirSync(dirname(file), { recursive: true });
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download failed ${r.status} for ${file}`);
  writeFileSync(file, Buffer.from(await r.arrayBuffer()));
}
/** fal result URLs can expire, so re-upload the local copy when we need it as an input */
async function inputUrl(fal, aspect, s, m) {
  const file = stillFile(aspect, s);
  if (!existsSync(file)) die(`Missing still for stage ${s.id} (${s.slug}). Run stills for it first.`);
  const known = m.stills[s.id];
  if (known?.url) {
    const head = await fetch(known.url, { method: "HEAD" }).catch(() => null);
    if (head?.ok) return known.url;
  }
  const blob = new Blob([readFileSync(file)], { type: "image/png" });
  const url = await fal.storage.upload(blob);
  m.stills[s.id] = { ...(known ?? {}), url };
  return url;
}

/* ---------- commands ---------- */
async function stills() {
  await confirmSpend("stills");
  const fal = await falClient();
  for (const aspect of aspects) {
    const a = P.aspects[aspect];
    const m = loadManifest(aspect);
    console.log(`\n${aspect} (${a.aspect_ratio})`);
    if (P.base) {
      copyReused(aspect, m);
      saveManifest(aspect, m);
      console.log(`  stages 1-${P.base.reuse_through} copied from ${P.base.set}`);
    }
    for (const s of stillJobs(aspect)) {
      let data;
      if (s.id === last && P.base) {
        data = await run(
          fal,
          IMAGE_EDIT,
          { prompt: baseEditPrompt(aspect), image_urls: [await baseUrl(fal, aspect)], aspect_ratio: a.aspect_ratio, resolution: "2K", output_format: "png", num_images: 1 },
          `stage ${s.id} ${s.slug} (edit of ${P.base.set} stage ${last})`,
        );
      } else if (s.id === last) {
        data = await run(
          fal,
          IMAGE_T2I,
          { prompt: finalPrompt(aspect), aspect_ratio: a.aspect_ratio, resolution: "2K", output_format: "png", num_images: 1 },
          `stage ${s.id} ${s.slug} (new image)`,
        );
      } else {
        const next = stages.find((x) => x.id === s.id + 1);
        const src = await inputUrl(fal, aspect, next, m);
        data = await run(
          fal,
          IMAGE_EDIT,
          { prompt: editPrompt(aspect, s), image_urls: [src], aspect_ratio: a.aspect_ratio, resolution: "2K", output_format: "png", num_images: 1 },
          `stage ${s.id} ${s.slug} (edit of stage ${next.id})`,
        );
      }
      const url = data.images[0].url;
      await download(url, stillFile(aspect, s));
      m.stills[s.id] = { url, at: new Date().toISOString() };
      saveManifest(aspect, m);
    }
    console.log(`  stills saved in ${join(outDir(aspect), "stills")}`);
  }
  console.log("\n  Look at them side by side before running clips. Redo a bad one with --only N.\n");
}

async function clips() {
  await confirmSpend("clips");
  const fal = await falClient();
  for (const aspect of aspects) {
    const m = loadManifest(aspect);
    console.log(`\n${aspect}`);
    for (const s of clipJobs()) {
      const prev = stages.find((x) => x.id === s.id - 1);
      const start = await inputUrl(fal, aspect, prev, m);
      const end = await inputUrl(fal, aspect, s, m);
      saveManifest(aspect, m);
      const data = await run(
        fal,
        VIDEO,
        {
          prompt: clipPrompt(s),
          start_image_url: start,
          end_image_url: end,
          duration: String(CLIP_SECONDS),
          generate_audio: false,
          negative_prompt: P.video.negative_prompt,
        },
        `clip ${prev.slug} -> ${s.slug}`,
      );
      await download(data.video.url, clipFile(aspect, s));
      m.clips[s.id] = { url: data.video.url, at: new Date().toISOString() };
      saveManifest(aspect, m);
    }
    console.log(`  clips saved in ${join(outDir(aspect), "clips")}`);
  }
  console.log("\n  Next: node production/scripts/fal-build.mjs frames\n");
}

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}
function duration(file) {
  const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString();
  return Number(out.trim());
}

function frames() {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
  } catch {
    die("ffmpeg isn't installed. On a Mac: brew install ffmpeg");
  }
  for (const aspect of aspects) {
    const list = clipJobs()
      .map((s) => clipFile(aspect, s))
      .filter((f) => existsSync(f));
    if (list.length === 0) die(`No clips for ${aspect} yet. Run clips first.`);
    if (list.length < clipJobs().length) console.log(`  ${aspect}: only ${list.length} of ${clipJobs().length} clips found, using those.`);

    const work = join(outDir(aspect), "work");
    mkdirSync(work, { recursive: true });
    const listFile = join(work, "clips.txt");
    writeFileSync(listFile, list.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join("\n") + "\n");

    // re-encode on join so every clip has the same timing, then sample evenly
    const joined = join(work, "joined.mp4");
    ffmpeg(["-f", "concat", "-safe", "0", "-i", listFile, "-an", "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", joined]);
    const { count, width, quality } = FRAMES[aspect];
    const fps = (count / duration(joined)).toFixed(4);

    const dest = join(ROOT, "public/frames", P.name, aspect);
    if (existsSync(dest)) rmSync(dest, { recursive: true });
    mkdirSync(dest, { recursive: true });
    ffmpeg([
      "-i", joined,
      "-vf", `fps=${fps},scale=${width}:-2:flags=lanczos`,
      "-c:v", "libwebp", "-quality", String(quality), "-compression_level", "6",
      join(dest, "%04d.webp"),
    ]);
    const made = readdirSync(dest).filter((f) => f.endsWith(".webp")).sort();
    // poster = first frame as a JPEG for the instant first paint
    ffmpeg(["-i", join(dest, made[0]), "-q:v", "3", join(dest, "poster.jpg")]);
    const dims = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", join(dest, made[0])])
      .toString()
      .trim()
      .split(",")
      .map(Number);
    writeFileSync(
      join(dest, "manifest.json"),
      JSON.stringify({ count: made.length, width: dims[0], height: dims[1], pattern: "%04d.webp", poster: "poster.jpg" }, null, 2) + "\n",
    );
    console.log(`  ${aspect}: ${made.length} frames at ${dims[0]}x${dims[1]} in public/frames/${P.name}/${aspect}`);
  }
}

function plan() {
  for (const aspect of aspects) {
    console.log(`\n${aspect} (${P.aspects[aspect].aspect_ratio})`);
    for (const s of stillJobs(aspect)) {
      console.log(`  still ${s.id} ${s.slug}: ${s.id !== last ? `edit of stage ${s.id + 1}` : P.base ? `edit of ${P.base.set} stage ${last}` : "new image"}`);
    }
    if (P.base) console.log(`  stills 1-${P.base.reuse_through}: copied from ${P.base.set}, no cost`);
    for (const s of clipJobs()) console.log(`  clip  ${s.id - 1} -> ${s.id} ${s.slug}`);
  }
  const e = estimate("plan");
  console.log(`\n  ${e.stills} stills at $${PRICE.still2k.toFixed(2)} + ${e.clips} clips at $${(CLIP_SECONDS * PRICE.videoPerSecond).toFixed(2)} = about $${e.cost.toFixed(2)}`);
  if (flag("show-prompts")) {
    const a = aspects[0];
    console.log(`\n--- final prompt (${a}) ---\n${finalPrompt(a)}`);
    for (const s of stages.filter((x) => x.edit)) console.log(`\n--- edit ${s.id} ${s.slug} ---\n${editPrompt(a, s)}`);
    for (const s of clipJobs()) console.log(`\n--- clip ${s.id - 1} -> ${s.id} ---\n${clipPrompt(s)}`);
  }
  console.log("");
}

const commands = { plan, stills, clips, frames };
if (!commands[command]) die(`Unknown command "${command}". Use plan, stills, clips or frames.`);
Promise.resolve(commands[command]()).catch((err) => {
  console.error(`\n  ${err?.body?.detail ? JSON.stringify(err.body.detail) : err?.message ?? err}\n`);
  process.exit(1);
});
