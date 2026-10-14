# PM Grafic (@pmgraficve) — sitio web v1 (toma de pedidos)

Prototipo v1: home 3D inmersivo, tienda con configurador, solicitud de cotización
con código y enlace único por pedido, y panel interno de pedidos. Sin pago en línea (v2).

## Archivos
- `index.html` — el sitio completo, listo para abrir o publicar (HTML + CSS + JS en un archivo).
- `src/` — el mismo código separado para editar:
  - `01-head.html` — título, fuentes y todos los estilos (tokens de color al inicio).
  - `02-body.html` — estructura de todas las vistas (inicio, tienda, producto, solicitud, datos, pedido, panel).
  - `03-data.js` — CONFIG (WhatsApp, correo), catálogo de categorías y productos con sus opciones, estados y reseñas.
  - `04-app.js` — navegación, configurador, solicitud, envío del pedido, enlace único y panel.
  - `05-three.js` — escena 3D del inicio, imágenes de referencia generadas en 3D y carrusel infinito.
  - `06-motion.js` — animaciones de scroll y cursor (cargador con telones, títulos por líneas, marquesinas, muro de trabajos, materiales, tarjetas apiladas, historias de Instagram, preguntas frecuentes, logo gigante del footer).
- `build.ps1` — vuelve a unir `src/` en `index.html` después de editar.

## Verlo en tu computadora
Usa un servidor local (abrir con doble clic también funciona, pero el servidor evita problemas):
    cd "C:\Users\alb25\OneDrive\Documentos\-00imprenta"
    npx serve .        (o: python -m http.server 8000)
Necesita internet: Three.js r128, GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13 y Google Fonts cargan desde CDN.

## Lo que falta configurar
- `03-data.js` → `CONFIG.whatsapp` (formato 58412XXXXXXX) y `CONFIG.email`.
- Fotos reales: en `04-app.js`, el objeto `IMG` acepta una URL por modelo
  (ej. `IMG.cards = "img/tarjetas.webp"`). Mientras esté vacío se usan renders 3D de referencia.
- Logo, nombre comercial, RIF y logos de clientes (hoy son de ejemplo).

## Dónde se guardan los pedidos
- En la versión publicada en Claude, los pedidos se guardan en la base de datos del artifact
  (colección `pedidos`) y el panel los lee en vivo.
- Fuera de Claude (este archivo en tu hosting), los pedidos solo quedan en el navegador del cliente
  (localStorage). Para producción falta el backend: Payload CMS + MongoDB Atlas + Cloudflare R2,
  según el brief. El punto a reemplazar es el envío en `04-app.js` (`db.doc("pedidos/...").set(order)`)
  y la lectura del panel (`db.collection("pedidos")...onSnapshot`).
- Los archivos de arte: el prototipo registra nombre y tamaño, no sube el archivo (eso va a R2 en producción).

## Logo (assets/) — todos con fondo transparente
- `logo-pmgrafic.svg` — logo completo en el azul de marca (#1d1a86), con lema.
- `logo-pmgrafic-oscuro.svg` — para fondos oscuros, con el amarillo de proceso del sitio.
- `logo-pmgrafic-claro.svg` — para fondos claros e impresos (tinta negra).
- `isotipo-pmgrafic.svg` — solo el monograma PM con la plumilla, en azul (favicon).
- `isotipo-pmgrafic-oscuro.svg` — monograma para fondos oscuros: el del header, menú, cargador y footer.
Todos están convertidos a trazos (no dependen de fuentes). Se regeneran con `tools/make_logo.py`.

## Publicar en Netlify
El sitio es estático. `node build.mjs` une `src/` y genera la carpeta `public/` (index.html, logos, íconos,
imagen para redes, manifest, robots.txt y sitemap). `netlify.toml` ya le dice a Netlify qué ejecutar y qué publicar.

**Opción A — desde Git (recomendada):**
1. Sube este repositorio a GitHub, GitLab o Bitbucket (`public/` está en .gitignore: Netlify lo genera).
2. En Netlify: *Add new site → Import an existing project* y elige el repositorio.
   Build command y Publish directory se toman de `netlify.toml` (`node build.mjs` / `public`).
3. Cada push a `main` vuelve a publicar. En este modo Netlify define `URL`, y la imagen para compartir
   en WhatsApp y redes queda con la dirección completa del sitio.

**Opción B — arrastrar y soltar:**
1. Ejecuta `node build.mjs` (necesitas Node 18 o superior).
2. Arrastra la carpeta `public/` a app.netlify.com/drop.
   Para que la vista previa en redes muestre la imagen, genera con el dominio:
   PowerShell: `$env:URL="https://TU-SITIO.netlify.app"; node build.mjs`

## Pedidos en Netlify (Netlify Forms)
- Fuera de Claude no hay base de datos: cada solicitud se envía a **Netlify Forms** con el nombre `pedido`.
  El formulario oculto en `src/02-body.html` es el que Netlify detecta al publicar; no lo borres.
- Míralos en Netlify → tu sitio → **Forms → pedido**. Activa el correo en
  **Site configuration → Forms → Form notifications → Add notification → Email notification**.
- Cada envío trae: código, cliente, factura, entrega, fecha deseada, los productos con sus opciones,
  el enlace del pedido y el pedido completo en JSON (`pedido_json`).
- Activa la detección de formularios la primera vez: **Forms → Enable form detection**, y vuelve a publicar.
- Límites: el plan gratuito de Netlify Forms incluye un número limitado de envíos al mes; revisa tu plan.
- El enlace único del pedido (`#pedido-CODIGO`) solo muestra el estado en el navegador donde se envió.
  El estado compartido y el panel con usuarios llegan con el backend (Payload CMS + MongoDB + R2).
- Los archivos de arte todavía no se suben: la solicitud lista sus nombres y tamaños.
