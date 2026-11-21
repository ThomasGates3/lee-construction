# Scroll-built home site (Lee Construction pitch)

A Next.js 14 site where a brick 3 bed, 2 bath home goes from a grass lot to move-in day as the visitor scrolls:
grass is scraped, the excavator digs, layout lines and a blueprint appear, the foundation is poured, framing goes up,
the house is dried in, brick is laid course by course, and the lights come on at dusk.

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

## Swapping in AI-generated or photo frames

The scene is vector art so every stage lines up perfectly with a locked camera. To use generated images instead, put one image per
stage in `public/frames/` and stack them as `<image>` elements inside the scene, each with `anim({ o: window4(...) })` so they
crossfade in sequence. Keep the same camera angle in every frame.

## Preview file

`npm run preview:html` writes `preview/dist/index.html`, a single self-contained file of the site (demo branding by default).

## Before launch

- Wire `components/ContactForm.tsx` to the builder's email or CRM (it only shows a thank-you right now).
- Replace placeholder phone, email and highlights with the builder's real details.
