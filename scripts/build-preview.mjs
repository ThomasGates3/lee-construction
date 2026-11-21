/**
 * Builds a single self-contained HTML file of the site (no Next.js server needed),
 * for quick private previews. Uses the fictional demo builder by default.
 *
 *   npm run preview:html            -> preview/dist/index.html (demo builder)
 *   PROFILE=lee npm run preview:html -> branded for the lead (keep private)
 */
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const profile = process.env.PROFILE ?? "demo";
mkdirSync("preview/dist", { recursive: true });

execSync("npx tailwindcss -i app/globals.css -o preview/dist/styles.css --minify", { stdio: "inherit" });

const result = await build({
  entryPoints: ["preview/entry.tsx"],
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  target: "es2019",
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.NEXT_PUBLIC_PROFILE": JSON.stringify(profile),
  },
  logLevel: "warning",
});

const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = readFileSync("preview/dist/styles.css", "utf8");
const title = profile === "demo" ? "Kestrel Ridge Build" : "Builder Site Preview";

const html = `<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600;700&display=swap">
<style>${css}</style>
<div id="root"></div>
<script>${js}</script>
`;
writeFileSync("preview/dist/index.html", html);
console.log(`preview/dist/index.html (${profile}) ${(html.length / 1024).toFixed(0)} KB`);
