"""Logo Binta Kande : l'orbite + le nom, en SVG (texte converti en tracés, aucune police requise).
Usage : python3 design/logos/build.py   (il faut fonttools : pip3 install fonttools brotli)"""
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import math, os

HERE = os.path.dirname(__file__)
FONT = os.path.join(HERE, '../../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')
VIOLET, DEEP, ROUILLE, BEIGE, LILAS = '#694cac', '#3b2a63', '#a3430f', '#f6f0e4', '#c6b8e4'

_f = {}
def font(w):
    if w not in _f:
        _f[w] = instancer.instantiateVariableFont(TTFont(FONT), {'wght': w, 'wdth': 100})
    return _f[w]

def text_path(w, s, size, x, y, tracking=0.0):
    f = font(w)
    gs, cmap = f.getGlyphSet(), f.getBestCmap()
    k = size / f['head'].unitsPerEm
    d, cx = [], x
    for ch in s:
        n = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[n].draw(TransformPen(pen, (k, 0, 0, -k, cx, y)))
        d.append(pen.getCommands())
        cx += gs[n].width * k + tracking * size
    return ' '.join(d), cx - x - tracking * size

# ---------------------------------------------------------------- géométrie de l'orbite
def pt(cx, cy, rx, ry, rot, t):
    a = math.radians(rot)
    x, y = rx * math.cos(t), ry * math.sin(t)
    return cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a)

def crossings(cx, cy, rx, ry, rot1, rot2):
    """points où deux ellipses de même centre se croisent (échantillonnage + affinage)."""
    a2 = math.radians(-rot2)
    def f(t):
        x, y = pt(0, 0, rx, ry, rot1, t)
        u, v = x * math.cos(a2) - y * math.sin(a2), x * math.sin(a2) + y * math.cos(a2)
        return (u / rx) ** 2 + (v / ry) ** 2 - 1
    out, n = [], 720
    for i in range(n):
        t0, t1 = 2 * math.pi * i / n, 2 * math.pi * (i + 1) / n
        if f(t0) * f(t1) < 0:
            for _ in range(40):
                m = (t0 + t1) / 2
                if f(t0) * f(m) <= 0: t1 = m
                else: t0 = m
            out.append(((t0 + t1) / 2))
    return [pt(cx, cy, rx, ry, rot1, t) for t in out]

def ell(cx, cy, rx, ry, rot, stroke, w, extra=''):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" transform="rotate({rot} {cx} {cy})" fill="none" stroke="{stroke}" stroke-width="{w}" {extra}/>'

# ---------------------------------------------------------------- symboles (boîte 240 x 240, centre 120)
C = 120
def sym_tisse(ring, nuc, elec, bg, uid):
    """deux orbites tissées (dessus / dessous en alternance), noyau cuivre, électron sur l'orbite."""
    rx, ry, w = 104, 40, 9.5
    r1, r2 = -32, 32
    body = ell(C, C, rx, ry, r2, ring, w, 'opacity=".55"') + ell(C, C, rx, ry, r1, ring, w)
    # aux croisements où l'orbite 2 passe devant : on la redessine par-dessus, avec un liseré de la couleur du fond
    xs = crossings(C, C, rx, ry, r1, r2)
    xs = [p for p in xs]
    over = sorted(xs, key=lambda p: (p[0] > C, p[1] > C))[::2][:2] if False else None
    keep = [p for p in xs if (p[0] - C) * (p[1] - C) < 0] if False else None
    defs, top = '', ''
    for i, (x, y) in enumerate(xs):
        if i % 2:
            defs += f'<clipPath id="{uid}c{i}"><circle cx="{x:.2f}" cy="{y:.2f}" r="{w * 1.9:.2f}"/></clipPath>'
            top += (f'<g clip-path="url(#{uid}c{i})">' + ell(C, C, rx, ry, r2, bg, w + 9)
                    + ell(C, C, rx, ry, r2, ring, w, 'opacity=".55"') + '</g>')
    ex, ey = pt(C, C, rx, ry, r1, math.radians(-52))
    return (f'<defs>{defs}</defs>' + body + top + f'<circle cx="{C}" cy="{C}" r="22" fill="{nuc}"/>'
            + f'<circle cx="{ex:.1f}" cy="{ey:.1f}" r="11.5" fill="{elec}" stroke="{bg}" stroke-width="5"/>')

def crescent(cx, cy, rx, ry, rot, w):
    """anneau à épaisseur variable : plus épais d'un côté, fin de l'autre (aspect calligraphié)."""
    outer = f'M{cx - rx},{cy} a{rx},{ry} 0 1,0 {2 * rx},0 a{rx},{ry} 0 1,0 {-2 * rx},0Z'
    irx, iry, sh = rx - w, ry - w * 0.55, w * 0.55
    inner = f'M{cx - irx + sh},{cy} a{irx},{iry} 0 1,0 {2 * irx},0 a{irx},{iry} 0 1,0 {-2 * irx},0Z'
    return outer, inner

def sym_plume(ring, ring2, nuc, elec, bg):
    """orbites à épaisseur variable (fines à un bout, pleines à l'autre) : lecture plus « dessinée »."""
    rx, ry = 106, 42
    def ringpath(rot, fill, op=1):
        o, i = crescent(C, C, rx, ry, rot, 20)
        return f'<path d="{o} {i}" fill="{fill}" fill-rule="evenodd" opacity="{op}" transform="rotate({rot} {C} {C})"/>'
    ex, ey = pt(C, C, rx - 5, ry - 3, -30, math.radians(-50))
    return (ringpath(30, ring2, .6) + ringpath(-30, ring) + f'<circle cx="{C}" cy="{C}" r="23" fill="{nuc}"/>'
            + f'<circle cx="{ex:.1f}" cy="{ey:.1f}" r="12" fill="{elec}" stroke="{bg}" stroke-width="5"/>')

def sym_simple(ring, nuc, elec, bg):
    """une seule orbite, très épaisse : lisible en 16 px (favicon)."""
    rx, ry, w = 100, 56, 17
    ex, ey = pt(C, C, rx, ry, -28, math.radians(-40))
    return (ell(C, C, rx, ry, -28, ring, w) + f'<circle cx="{C}" cy="{C}" r="28" fill="{nuc}"/>'
            + f'<circle cx="{ex:.1f}" cy="{ey:.1f}" r="14" fill="{elec}" stroke="{bg}" stroke-width="6"/>')

def sym_sceau(sq, ring, nuc, elec):
    """l'orbite dans un carré arrondi : icône d'application / avatar."""
    inner = sym_tisse(ring, nuc, elec, sq, 'sc')
    return f'<rect width="240" height="240" rx="52" fill="{sq}"/><g transform="translate(120 120) scale(.88) translate(-120 -120)">{inner}</g>'

# ---------------------------------------------------------------- composition
def lockup(name, sym, fg, bg, tagline=True, sym_scale=1.0):
    """symbole + « Binta Kande » (Archivo 800, comme sur le site)."""
    size = 112
    nd, nw = text_path(800, 'Binta Kande', size, 0, 0, -0.035)
    s = 250 * sym_scale
    x0 = s + 14
    base = 125 + size * 0.36 if not tagline else 113 + size * 0.36 - 8
    nd, nw = text_path(800, 'Binta Kande', size, x0, base - 0, -0.035)
    body = f'<g transform="translate(0 {125 - s / 2:.1f}) scale({s / 240:.4f})">{sym}</g><path d="{nd}" fill="{fg}"/>'
    W = x0 + nw
    if tagline:
        td, tw = text_path(600, 'AUTOMATISATION · AGENTS IA · MARKETING', 19.5, x0 + 4, base + 44, 0.14)
        body += f'<path d="{td}" fill="{fg}" opacity=".7"/>'
        W = max(W, x0 + 4 + tw)
    write(name, round(W + 30), 250, body, bg)

def solo(name, sym, bg):
    write(name, 240, 240, sym, bg)

def write(name, w, h, body, bg=None):
    r = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    open(os.path.join(HERE, name), 'w').write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="Binta Kande">{r}{body}</svg>\n')

if __name__ == '__main__':
    # 1 : orbites tissées
    lockup('logo-1-tisse.svg', sym_tisse(VIOLET, ROUILLE, ROUILLE, BEIGE, 'a'), DEEP, BEIGE)
    lockup('logo-1-tisse-fonce.svg', sym_tisse(LILAS, ROUILLE, BEIGE, DEEP, 'b'), BEIGE, DEEP)
    solo('symbole-1-tisse.svg', sym_tisse(VIOLET, ROUILLE, ROUILLE, BEIGE, 'c'), BEIGE)
    # 2 : orbites à épaisseur variable
    lockup('logo-2-plume.svg', sym_plume(DEEP, VIOLET, ROUILLE, ROUILLE, BEIGE), DEEP, BEIGE)
    lockup('logo-2-plume-fonce.svg', sym_plume(BEIGE, LILAS, ROUILLE, BEIGE, DEEP), BEIGE, DEEP)
    solo('symbole-2-plume.svg', sym_plume(DEEP, VIOLET, ROUILLE, ROUILLE, BEIGE), BEIGE)
    # 3 : une seule orbite épaisse
    lockup('logo-3-simple.svg', sym_simple(VIOLET, ROUILLE, ROUILLE, BEIGE), DEEP, BEIGE)
    lockup('logo-3-simple-fonce.svg', sym_simple(LILAS, ROUILLE, BEIGE, DEEP), BEIGE, DEEP)
    solo('symbole-3-simple.svg', sym_simple(VIOLET, ROUILLE, ROUILLE, BEIGE), BEIGE)
    # 4 : sceau (icône d'appli, avatar)
    solo('icone-sceau-fonce.svg', sym_sceau(DEEP, LILAS, ROUILLE, BEIGE), None)
    solo('icone-sceau-cuivre.svg', sym_sceau(ROUILLE, BEIGE, DEEP, BEIGE), None)
    print('ok')
