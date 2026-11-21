# Photoreal frames on fal.ai

Makes the scroll-build frames with your own fal account. Your key stays on your machine.

1. `npm install`
2. `export FAL_KEY=your-key` (from your fal.ai dashboard; never commit it)
3. `npm run fal -- plan` shows every step and the cost (about $3.41 for the desktop set, $6.82 with the phone set via `--aspect both`).
4. `npm run fal -- stills` makes the finished home, then edits back to the grass lot. Files land in `production/out/brick-ranch-atlanta/wide/stills/`.
5. Look at the eight stills side by side. If one drifted (house moved or resized, horizon shifted, leftovers), redo just that one: `npm run fal -- stills --only 5`. Redoing a stage changes what the stages before it were edited from, so redo those too with `--from 5`.
6. `npm run fal -- clips` makes the 7 Kling clips (start = earlier stage, end = later stage).
7. `npm run fal -- frames` needs ffmpeg (`brew install ffmpeg`). It joins the clips and writes ~170 WebP frames plus `poster.jpg` and `manifest.json` to `public/frames/brick-ranch-atlanta/wide/`.

The prompts live in `prompts/brick-ranch-atlanta.json`. A readable copy is in `prompts/brick-ranch-atlanta.md` if you'd rather paste them into Gemini yourself.

Endpoints: `fal-ai/nano-banana-2` and `fal-ai/nano-banana-2/edit` at 2K, `fal-ai/kling-video/v2.6/pro/image-to-video` with audio off. Prices in the script were read from fal.ai on Nov 21, 2026.

## A second house on the same lot

`prompts/brick-two-story-atlanta.json` has a `base` block, so it builds on the ranch set instead of starting over. Stages 1-4 (lot, clearing, dig, foundation) are copied from the ranch stills at no cost. The finished two-story home is an edit of the ranch's finished still on the same footprint, and stages 7, 6 and 5 are edits back from it. Run it with `npm run fal -- stills --prompts production/prompts/brick-two-story-atlanta.json` after the ranch stills exist. Only 4 stills are paid for.
