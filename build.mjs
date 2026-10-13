// Build de PM Grafic para Netlify (y local): une src/ en public/index.html y copia los estáticos.
// Uso: node build.mjs   → genera public/
// En Netlify se ejecuta solo (ver netlify.toml). La variable URL la define Netlify con el dominio del sitio.
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "public");
const read = f => readFileSync(join(root, f), "utf8");

const SITE_URL = (process.env.URL || "").replace(/\/$/, "");
const TITLE = "PM Grafic · Imprenta digital, offset y gran formato en Caracas";
const DESC = "PM Grafic (@pmgraficve) — Imprenta digital, offset y gran formato en Caracas. Arma tu pedido en línea y recibe tu cotización por WhatsApp y correo.";
const abs = p => (SITE_URL ? SITE_URL + p : p);

const head = read("src/01-head.html");
const body = read("src/02-body.html");
const js = ["03-data.js", "04-app.js", "05-three.js"].map(f => read("src/" + f)).join("");
const libs = `<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>`;

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${DESC}">
<meta name="theme-color" content="#0d0e11">
${SITE_URL ? `<link rel="canonical" href="${SITE_URL}/">` : ""}
<meta property="og:type" content="website">
<meta property="og:locale" content="es_VE">
<meta property="og:site_name" content="PM Grafic">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${DESC}">
<meta property="og:image" content="${abs("/og-image.png")}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
${SITE_URL ? `<meta property="og:url" content="${SITE_URL}/">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${TITLE}">
<meta name="twitter:description" content="${DESC}">
<meta name="twitter:image" content="${abs("/og-image.png")}">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${head}
</head>
<body>
${body}
${libs}
<script>
${js}
</script>
</body>
</html>
`;

if (existsSync(out)) rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "index.html"), html);
cpSync(join(root, "static"), out, { recursive: true });            // íconos, og-image, robots, manifest
cpSync(join(root, "assets"), join(out, "assets"), { recursive: true }); // logos SVG
// sitemap con el dominio real cuando Netlify lo provee
if (SITE_URL) writeFileSync(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}/</loc><changefreq>weekly</changefreq></url></urlset>
`);
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\n${SITE_URL ? `Sitemap: ${SITE_URL}/sitemap.xml\n` : ""}`);
console.log(`public/ listo (${(html.length / 1024).toFixed(0)} KB)${SITE_URL ? " · " + SITE_URL : ""}`);
