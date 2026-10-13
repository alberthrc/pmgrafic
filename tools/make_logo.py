"""Genera los SVG del logo de PM Grafic. Todo va convertido a trazos: no depende de fuentes."""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import os, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "."
F_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf"
F_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed.ttf"
_fonts = {}

def text_path(font, text, x, y, size, track=0.0, sx=1.0, anchor="start"):
    f = _fonts.setdefault(font, TTFont(font))
    gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm
    k = size / upm
    names = [cmap.get(ord(ch), ".notdef") for ch in text]
    widths = [f["hmtx"][n][0] * k * sx + track * size for n in names]
    total = sum(widths) - track * size
    cx = x - (total / 2 if anchor == "middle" else total if anchor == "end" else 0)
    pen = SVGPathPen(gs)
    for n, w in zip(names, widths):
        gs[n].draw(TransformPen(pen, (k * sx, 0, 0, -k, cx, y)))
        cx += w
    return pen.getCommands()

def r(v): return f"{v:.2f}".rstrip("0").rstrip(".")

# ---------- trazos caligráficos (viewBox 0 0 200 200) ----------
P_ENTRY = "M42 64 C46 40 70 28 92 34"
P_STEM = "M80 38 C78 74 74 112 62 150 C58 162 48 166 44 158"
P_BOWL = "M78 46 C102 22 142 30 138 60 C136 84 108 96 80 90"
M_PATH = ("M76 158 C82 132 90 112 98 100 C103 93 110 96 108 108 C106 124 103 140 102 152 "
          "C108 126 117 106 124 100 C131 94 136 101 134 113 C132 128 129 142 131 151 "
          "C135 160 147 154 152 138")
NIB_TIP = (152, 138)   # la M termina en la punta de la plumilla
NIB_ANGLE = -52        # el cuerpo de la plumilla sube hacia la derecha

def calli(d, color, w=1.6, n=11, vec=(4.2, -1.8)):
    """Plumilla ancha: muchas copias del trazo desplazadas → grueso en diagonales, fino en paralelo."""
    out = []
    for i in range(n):
        t = i / (n - 1)
        out.append(f'<path d="{d}" transform="translate({r(vec[0]*t)} {r(vec[1]*t)})"/>')
    return f'<g fill="none" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round">{"".join(out)}</g>'

def nib(fg, bg, acc):
    """Plumilla con la ranura y el agujero recortados (fill-rule evenodd): funciona sobre cualquier fondo."""
    x, y = NIB_TIP
    body = ("M0 0 L15 -7.5 L33 -7.5 L33 7.5 L15 7.5 Z "
            "M4 -0.9 L20.3 -0.9 L20.3 0.9 L4 0.9 Z "
            "M25.6 0 A2.6 2.6 0 1 0 20.4 0 A2.6 2.6 0 1 0 25.6 0 Z")
    return f'''<g transform="translate({x} {y}) rotate({NIB_ANGLE})">
    <path d="{body}" fill="{fg}" fill-rule="evenodd"/>
    <rect x="34.5" y="-9.5" width="5" height="19" rx="1.5" fill="{fg}"/>
    <g stroke="{acc}" stroke-width="1.3" fill="none" stroke-linecap="round">
      <path d="M39.5 -9.5 L52 -24"/><path d="M39.5 9.5 L54 20"/><path d="M15 -7.5 C14 -20 20 -30 28 -34"/>
    </g>
    <g fill="{acc}"><circle cx="52" cy="-24" r="2.6"/><circle cx="54" cy="20" r="2.6"/><circle cx="28" cy="-34" r="2.6"/></g>
  </g>'''

def monogram(fg, bg, acc):
    return (calli(P_ENTRY, fg, w=1.5) + calli(P_STEM, fg) + calli(P_BOWL, fg) +
            calli(M_PATH, fg, w=1.4, vec=(3.6, -1.5)) + nib(fg, bg, acc))

def mark(fg, bg, acc, rx=36):
    """Isotipo: solo el monograma, centrado en un cuadrado redondeado."""
    return f'<g transform="translate(-4 -2) scale(1.0)">{monogram(fg, bg, acc)}</g>'

def full_logo(fg, bg, acc, rx=22):
    grafic = text_path(F_BOLD, "GRAFIC", 24, 168, 30, track=.03, sx=.66)
    t1 = text_path(F_REG, "DISEÑO GRÁFICO PUBLICITARIO · IMPRESIÓN EN GRAN FORMATO · ARTES GRÁFICAS", 100, 184.4, 4.3, sx=.88, anchor="middle")
    t2 = text_path(F_REG, "CARACAS, VENEZUELA", 100, 190.6, 4.3, track=.1, sx=.88, anchor="middle")
    return f'''<g transform="translate(16 -10) scale(.9)">{monogram(fg, bg, acc)}</g>
  <path d="{grafic}" fill="{fg}"/>
  <rect x="22" y="173.5" width="156" height="2.2" rx="1.1" fill="{fg}"/>
  <path d="{t1}" fill="{fg}" opacity=".9"/><path d="{t2}" fill="{fg}" opacity=".9"/>'''

def svg(body, title="PM Grafic"):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="{title}"><title>{title}</title>\n  {body}\n</svg>\n'

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    NAVY, PAPER, INK, Y = "#1d1a86", "#f2f1ec", "#0d0e11", "#ffe100"
    files = {
        "logo-pmgrafic.svg": svg(full_logo(NAVY, None, NAVY)),              # azul de marca, fondo transparente
        "logo-pmgrafic-oscuro.svg": svg(full_logo(PAPER, None, Y)),         # para fondos oscuros (estilo del sitio)
        "logo-pmgrafic-claro.svg": svg(full_logo(INK, None, NAVY)),         # para fondos claros / impresos
        "isotipo-pmgrafic.svg": svg(mark(NAVY, None, NAVY)),               # monograma en azul, transparente
        "isotipo-pmgrafic-oscuro.svg": svg(mark(PAPER, None, Y)),          # monograma para fondos oscuros (el del sitio)
    }
    for n, s in files.items():
        open(os.path.join(OUT, n), "w", encoding="utf-8").write(s)
    print("ok", {n: len(s) for n, s in files.items()})
