# Scroll-built home site (Lee Construction pitch)

A Next.js 14 site where a two-story brick 4 bed, 2.5 bath home goes from a grass lot to move-in day as the visitor scrolls,
as a photoreal time-lapse: the lot is cleared, staked and dug, the slab is poured, framing goes up, the house is dried in,
brick is laid, and the yard is finished. (The original drawn version is still in `scenes/house/`.)

> Private pitch mockup for Lee Construction. Phone, email and claims are placeholders. Don't publish or send without sign-off.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (what Vercel runs)
```

Use `NEXT_PUBLIC_PROFILE=demo` to show the fictional "Kestrel Ridge Homes" branding instead of the lead's.

## Re-brand for the next lead (about 5 minutes)

1. Copy `lib/profiles/lee-construction.ts` to `lib/profiles/<lead>.ts` and edit name, phone, service area, services.
2. Register it in `lib/site.ts` and set `NEXT_PUBLIC_PROFILE=<lead>`.
3. Brick colour lives in the `#brick` pattern in `scenes/house/HouseScene.tsx`; accent colours in `tailwind.config.ts`.

## How it works

- `lib/scroll-engine.ts` is scene-agnostic. Any SVG or HTML element can take `{...anim({ o, x, y, s, sx, sy, r, d })}` where each
  value is a list of `[progress, value]` keyframes (progress 0 to 1 across the story). The engine eases the scroll position and
  writes values straight to the DOM, so React never re-renders while scrolling. Smooth on phones, no animation library.
- `components/ScrollStory.tsx` is the sticky stage: captions, the progress rail and the "Build day" counter. It takes any scene.
- `scenes/house/HouseScene.tsx` is the house drawing plus its eight stages. The camera never moves.
- Phones get a tighter crop (`viewBoxTall`) with captions under the scene; wide screens get captions over the soil band.

## Adding a kitchen remodel version

Same engine and `ScrollStory`, new scene file:

1. Create `scenes/kitchen/KitchenScene.tsx` exporting a `SceneConfig` (stages: gutted room, demo, rough plumbing and electric,
   drywall, cabinets, counters, backsplash, lights on) and the SVG drawing, with `anim()` keyframes on each part.
2. Render `<ScrollStory config={kitchenScene}><KitchenScene /></ScrollStory>` on a page.

## Photo frames (what the home page uses now)

The scroll section scrubs a photoreal time-lapse of a two-story brick home: 170 wide WebP frames in
`public/frames/brick-two-story-atlanta/wide/` for desktop and 110 tall ones in `.../tall/` for portrait phones (full-screen, captions over the photo), made by `production/` (see `production/README.md`).
`lib/frame-player.ts` draws the frame for the current scroll position on a canvas, loading frames coarse-to-fine so
scrubbing works before they've all arrived. `scenes/photo/photoBuild.ts` holds the captions, timed to the 7 clips.
To go back to the drawn house, render `<ScrollStory config={houseScene}><HouseScene /></ScrollStory>` in `components/HomePage.tsx`.

## Preview file

`npm run preview:html` writes `preview/dist/index.html`, a single self-contained file of the site (demo branding by default). The photo frames are not inlined, so use `npm run dev` to see them.

## Before launch

- Wire `components/ContactForm.tsx` to the builder's email or CRM (it only shows a thank-you right now).
- Replace placeholder phone, email and highlights with the builder's real details.
