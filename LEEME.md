# Imprenta Caracas — sitio web v1 (toma de pedidos)

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
