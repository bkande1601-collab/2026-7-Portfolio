#!/usr/bin/env python3
"""
Vidéos motion verticales 1080x1920 aux couleurs de la charte (Archivo, violet, ivoire, logo du kit).
Usage : python3 scripts/motion/render.py [offre-diagnostic|cinq-zones|diagnostic-demo|prix-agent|all] [--test]
Principes : animations à ressort avec léger rebond, une seule courbe d'animation partout, typographie animée
mot par mot, anneaux « orbite » repris du logo, transition en iris, flou de mouvement, rendu en double résolution
(bords lissés), texte dans la zone de sécurité des Reels. Vidéos muettes : ajoute la voix et les sous-titres au montage.
"""
import math, os, subprocess, sys, tempfile
from multiprocessing import get_context
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'content')
FPS, W, H, S = 30, 1080, 1920, 2
VD, V, LILAS, IV, CANN, SURF = (59, 42, 99), (105, 76, 172), (198, 184, 228), (246, 240, 228), (138, 75, 54), (251, 247, 238)
ROUILLE, MUTED, LINE = (190, 86, 38), (103, 85, 73), (226, 214, 195)

TMP = tempfile.mkdtemp(prefix='motion-')
_ttf = os.path.join(TMP, 'archivo.ttf')
_f = TTFont(os.path.join(ROOT, 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2'))
_f.flavor = None
_f.save(_ttf)
_fonts = {}
def font(px, weight=800):
    k = (px, weight)
    if k not in _fonts:
        f = ImageFont.truetype(_ttf, px)
        try: f.set_variation_by_axes([weight])
        except Exception: pass
        _fonts[k] = f
    return _fonts[k]

def _logo(name, width):
    im = Image.open(os.path.join(ROOT, 'design/logos/kit/png', name)).convert('RGBA')
    w = width * S
    return im.resize((w, round(w * im.height / im.width)), Image.LANCZOS)
LOGO_DARK = _logo('logo-complet-inverse-3000px.png', 720)

# ---------- courbes d'animation (les mêmes partout) ----------
def clamp(x): return max(0.0, min(1.0, x))
def out_expo(x): x = clamp(x); return 1 - 2 ** (-10 * x) if x < 1 else 1.0
def in_out(x): x = clamp(x); return 3 * x * x - 2 * x ** 3
def spring(x, z=0.62, w=15.0):
    """Ressort : monte vite, dépasse un peu, se pose. x en secondes."""
    if x <= 0: return 0.0
    wd = w * math.sqrt(1 - z * z)
    return 1 - math.exp(-z * w * x) * (math.cos(wd * x) + (z * w / wd) * math.sin(wd * x))
def fade(x, d=0.25): return clamp(x / d)

# ---------- toile en double résolution ----------
def sc(v): return int(round(v * S))

class Cv:
    def __init__(self, bg): self.im = Image.new('RGBA', (W * S, H * S), tuple(bg) + (255,))
    def paste(self, tile, x, y):
        x, y = int(x), int(y)
        W2, H2 = self.im.size
        x0, y0 = max(0, -x), max(0, -y)
        x1, y1 = min(tile.width, W2 - x), min(tile.height, H2 - y)
        if x1 <= x0 or y1 <= y0: return
        self.im.alpha_composite(tile.crop((x0, y0, x1, y1)), (x + x0, y + y0))
    def done(self): return self.im.resize((W, H), Image.LANCZOS).convert('RGB')

def _alpha(tile, a):
    if a < 1: tile.putalpha(tile.getchannel('A').point(lambda p: int(p * a)))
    return tile

def shape(cv, x0, y0, x1, y1, fn, a=1.0, pad=8):
    """Dessine fn(draw, ox, oy) dans une tuile couvrant le cadre (coordonnées en px de la vidéo)."""
    if a <= 0: return
    X0, Y0 = sc(x0 - pad), sc(y0 - pad)
    tile = Image.new('RGBA', (sc(x1 - x0 + 2 * pad), sc(y1 - y0 + 2 * pad)), (0, 0, 0, 0))
    fn(ImageDraw.Draw(tile), X0, Y0)
    cv.paste(_alpha(tile, a), X0, Y0)

def rrect(cv, x0, y0, x1, y1, r, fill=None, a=1.0, outline=None, ow=0):
    shape(cv, x0, y0, x1, y1, lambda d, ox, oy: d.rounded_rectangle((sc(x0) - ox, sc(y0) - oy, sc(x1) - ox, sc(y1) - oy), radius=sc(r), fill=fill, outline=outline, width=sc(ow)), a)

def circle(cv, cx, cy, r, fill=None, a=1.0, outline=None, ow=0):
    shape(cv, cx - r, cy - r, cx + r, cy + r, lambda d, ox, oy: d.ellipse((sc(cx - r) - ox, sc(cy - r) - oy, sc(cx + r) - ox, sc(cy + r) - oy), fill=fill, outline=outline, width=sc(ow)), a, pad=ow + 8)

def stroke(cv, pts, w, col, a=1.0, prog=1.0):
    """Trait à bouts ronds, tracé progressivement (prog de 0 à 1)."""
    if a <= 0 or prog <= 0: return
    seg = [math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1)]
    total, run, out = sum(seg), prog * sum(seg), [pts[0]]
    for i, L in enumerate(seg):
        if run >= L: out.append(pts[i + 1]); run -= L
        else:
            k = run / L if L else 0
            out.append((pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k)); break
    xs, ys = [p[0] for p in out], [p[1] for p in out]
    def fn(d, ox, oy):
        P = [(sc(x) - ox, sc(y) - oy) for x, y in out]
        d.line(P, fill=col, width=sc(w), joint='curve')
        for x, y in (P[0], P[-1]): d.ellipse((x - sc(w) / 2, y - sc(w) / 2, x + sc(w) / 2, y + sc(w) / 2), fill=col)
    shape(cv, min(xs) - w, min(ys) - w, max(xs) + w, max(ys) + w, fn, a)

def _line_tile(s, px, weight, fill, a):
    f = font(sc(px), weight); pad = sc(12)
    w, h = int(f.getlength(s)) + 2 * pad, int(sc(px) * 1.5) + 2 * pad
    t = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(t).text((pad, h / 2), s, font=f, fill=tuple(fill) + (255,), anchor='lm')
    return _alpha(t, a), pad

def text(cv, s, px, x, y, fill, a=1.0, weight=800, anchor='mm', scale=1.0, dx=0, dy=0, width=None, lh=1.12):
    """Texte (centré par défaut ; anchor='lm' = aligné à gauche). width = largeur max avant retour à la ligne."""
    if a <= 0: return
    size = px * scale
    f = font(sc(size), weight)
    lines = [s]
    if width:
        lines, cur = [], ''
        for w_ in s.split(' '):
            t_ = (cur + ' ' + w_).strip()
            if f.getlength(t_) / S <= width or not cur: cur = t_
            else: lines.append(cur); cur = w_
        lines.append(cur)
    top = y - size * lh * (len(lines) - 1) / 2
    for i, ln in enumerate(lines):
        tile, pad = _line_tile(ln, size, weight, fill, a)
        cy = (top + i * size * lh + dy) * S
        cx = (x + dx) * S - (tile.width / 2 if anchor == 'mm' else pad)
        cv.paste(tile, cx, cy - tile.height / 2)

def words(cv, s, px, cx, cy, width, u, start, fill, stagger=0.09, weight=800, colors=None, lh=1.12):
    """Typographie animée : chaque mot jaillit en ressort. Retourne les rectangles des mots (px vidéo)."""
    f = font(sc(px), weight)
    sp = f.getlength(' ') / S
    ws = [(w_, f.getlength(w_) / S) for w_ in s.split(' ')]
    lines, cur, cw = [], [], 0
    for w_, l_ in ws:
        if cur and cw + sp + l_ > width: lines.append(cur); cur, cw = [], 0
        cur.append((w_, l_)); cw += l_ + (sp if len(cur) > 1 else 0)
    lines.append(cur)
    rects, i, y0 = [], 0, cy - px * lh * (len(lines) - 1) / 2
    for li, ln in enumerate(lines):
        tw = sum(l_ for _, l_ in ln) + sp * (len(ln) - 1)
        x = cx - tw / 2
        for w_, l_ in ln:
            p = spring(u - start - i * stagger)
            col = (colors or {}).get(w_.strip('?.,’'), fill)
            text(cv, w_, px, x + l_ / 2, y0 + li * px * lh, col, a=clamp(p * 1.6), weight=weight, scale=0.82 + 0.18 * p, dy=46 * (1 - p))
            rects.append((w_, x, y0 + li * px * lh - px * 0.5, x + l_, y0 + li * px * lh + px * 0.55))
            x += l_ + sp; i += 1
    return rects

def pill(cv, label, px, cx, cy, bg, fg, a=1.0, scale=1.0, padx=44, pady=20, weight=800, dy=0):
    if a <= 0: return
    f = font(sc(px * scale), weight)
    w, h = f.getlength(label) / S + padx * 2 * scale, px * scale + pady * 2 * scale
    rrect(cv, cx - w / 2, cy - h / 2 + dy, cx + w / 2, cy + h / 2 + dy, h / 2, fill=bg, a=a)
    text(cv, label, px, cx, cy + dy, fg, a=a, weight=weight, scale=scale)

def orbit(cv, t, cx, cy, ra, rb, tilt, col, a, width=4, dot=True, spin=0.35):
    """Anneau en ellipse incliné (clin d'œil au logo) avec un point en orbite."""
    th = math.radians(tilt)
    pts = []
    for k in range(121):
        u = 2 * math.pi * k / 120
        x, y = ra * math.cos(u), rb * math.sin(u)
        pts.append((cx + x * math.cos(th) - y * math.sin(th), cy + x * math.sin(th) + y * math.cos(th)))
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    def fn(d, ox, oy): d.line([(sc(x) - ox, sc(y) - oy) for x, y in pts], fill=col, width=sc(width), joint='curve')
    shape(cv, min(xs), min(ys), max(xs), max(ys), fn, a, pad=width + 4)
    if dot:
        u = t * spin * 2 * math.pi
        x, y = ra * math.cos(u), rb * math.sin(u)
        circle(cv, cx + x * math.cos(th) - y * math.sin(th), cy + x * math.sin(th) + y * math.cos(th), 15, fill=ROUILLE, a=min(1, a * 4))

def bg_dark(t):
    cv = Cv(VD)
    orbit(cv, t, 540, 1320, 640, 250, -24, LILAS, 0.16, width=5, spin=0.12)
    orbit(cv, t, 540, 1320, 520, 190, -24, LILAS, 0.10, width=3, dot=False)
    orbit(cv, t, 540, 560, 700, 220, 18, LILAS, 0.08, width=3, dot=False)
    return cv

# ---------- icônes (dessinées en vectoriel) ----------
def icon_analyse(cv, x, y, col, a):
    circle(cv, x - 5, y - 5, 17, outline=col, ow=6, a=a); stroke(cv, [(x + 8, y + 8), (x + 23, x * 0 + y + 23)], 7, col, a)
def icon_pistes(cv, x, y, col, a):
    for i, w_ in enumerate((46, 34, 22)): rrect(cv, x - 23, y - 22 + i * 17, x - 23 + w_, y - 22 + i * 17 + 10, 5, fill=col, a=a)
def icon_outils(cv, x, y, col, a):
    for i, k in enumerate((-6, 8, -2)):
        yy = y - 17 + i * 17; stroke(cv, [(x - 24, yy), (x + 24, yy)], 5, col, a); circle(cv, x + k, yy, 8, fill=col, a=a)
def icon_plan(cv, x, y, col, a):
    for i in range(3):
        yy = y - 18 + i * 18; stroke(cv, [(x - 24, yy), (x - 19, yy + 5), (x - 10, yy - 5)], 4, col, a); stroke(cv, [(x - 2, yy), (x + 24, yy)], 4, col, a)

def card(cv, x0, y0, x1, y1, p, icon, title, sub, side):
    if p <= 0: return
    a = clamp(p * 1.8); dx = side * 140 * (1 - p)
    rrect(cv, x0 + dx, y0, x1 + dx, y1, 44, fill=SURF, a=a, outline=LINE, ow=3)
    cy = (y0 + y1) / 2
    circle(cv, x0 + dx + 100, cy, 56, fill=V, a=a)
    icon(cv, x0 + dx + 100, cy, IV, a)
    text(cv, title, 54, x0 + dx + 190, cy - 26, VD, a=a, weight=800, anchor='lm')
    text(cv, sub, 38, x0 + dx + 190, cy + 38, MUTED, a=a, weight=500, anchor='lm')

def cta(cv, u, line1, label):
    words(cv, line1, 92, W / 2, 560, 880, u, 0.1, IV)
    p = spring(u - 0.9)
    pulse = 1 + 0.035 * math.sin(max(0, u - 1.6) * 5.5)
    pill(cv, label, 72, W / 2, 840, V, IV, a=clamp(p * 2), scale=(0.7 + 0.3 * p) * pulse, padx=84, pady=38)
    bob = 12 * math.sin(max(0, u - 1.2) * 6)
    stroke(cv, [(W / 2 - 22, 960 + bob), (W / 2, 984 + bob), (W / 2 + 22, 960 + bob)], 9, LILAS, a=fade(u - 1.2), prog=1)
    lp = spring(u - 1.8, z=0.7, w=12)
    lg = LOGO_DARK.copy(); lg = lg.resize((int(lg.width * (0.85 + 0.15 * lp)), int(lg.height * (0.85 + 0.15 * lp))), Image.LANCZOS)
    cv.paste(_alpha(lg, clamp(lp * 1.5)), W * S / 2 - lg.width / 2, 1250 * S - lg.height / 2)

# ---------- VIDÉO 2 : l'offre Diagnostic (30 s) ----------
def o1(u):
    cv = bg_dark(u)
    pill(cv, 'Diagnostic IA', 44, W / 2, 400, LILAS, VD, a=fade(u - 0.1), scale=0.8 + 0.2 * spring(u - 0.1), dy=-30 * (1 - out_expo(u / 0.6)))
    n = int(19 * in_out((u - 0.15) / 0.8))
    p = spring(u - 0.15, z=0.5, w=14)
    text(cv, f'{n} €', 380, W / 2, 800, IV, a=fade(u - 0.1, 0.2), scale=0.6 + 0.4 * p, weight=900)
    words(cv, 'Un plan d’action pour ton business,', 62, W / 2, 1140, 860, u, 1.2, LILAS, weight=700, stagger=0.07)
    text(cv, 'écrit par des agents IA.', 62, W / 2, 1290, IV, a=fade(u - 2.3, 0.4), weight=700, dy=24 * (1 - out_expo((u - 2.3) / 0.6)))
    return cv

def o2(u):
    cv = Cv(IV)
    pill(cv, 'Pour qui ?', 44, W / 2, 360, V, IV, a=fade(u - 0.1), scale=0.8 + 0.2 * spring(u - 0.1))
    rects = words(cv, 'Où gagner du temps ou de l’argent ?', 104, W / 2, 690, 880, u, 0.4, VD, colors={'temps': V, 'argent': V}, stagger=0.1)
    for w_, x0, y0, x1, y1 in rects:
        if w_.strip('?.,’') in ('temps', 'argent'):
            stroke(cv, [(x0, y1 + 10), (x1, y1 + 10)], 9, ROUILLE, a=1, prog=out_expo((u - 1.9) / 0.5))
    # le jargon barré
    for i, j in enumerate(('KPI', 'ROI', 'workflow', 'stack')):
        xs = [190, 360, 590, 860][i]
        p = spring(u - 3.0 - i * 0.12)
        pill(cv, j, 46, xs, 1010, LINE, MUTED, a=clamp(p * 1.6), scale=0.85 + 0.15 * p, padx=34, pady=16, weight=700)
        w_ = font(sc(46), 700).getlength(j) / S
        stroke(cv, [(xs - w_ / 2 - 12, 1010), (xs + w_ / 2 + 12, 1010)], 7, ROUILLE, a=fade(u - 4.3), prog=out_expo((u - 4.3 - i * 0.12) / 0.35))
    words(cv, 'Sans jargon.', 100, W / 2, 1230, 880, u, 5.3, CANN)
    text(cv, 'Entrepreneurs · indépendants · petites équipes', 44, W / 2, 1400, MUTED, a=fade(u - 7.2, 0.4), weight=500, width=880)
    return cv

def o3(u):
    cv = Cv(IV)
    words(cv, 'Tu obtiens', 88, W / 2, 330, 880, u, 0.1, VD)
    items = [(icon_analyse, 'Une analyse', 'de ta situation'), (icon_pistes, '3 pistes classées', 'par effet attendu'),
             (icon_outils, 'Des outils simples', 'adaptés à ton niveau'), (icon_plan, 'Un plan d’action', 'à appliquer dès réception')]
    for i, (ic, a_, b_) in enumerate(items):
        card(cv, 100, 470 + i * 230, 980, 670 + i * 230, spring(u - 0.7 - 2.6 * i, z=0.7, w=13), ic, a_, b_, side=-1 if i % 2 == 0 else 1)
    return cv

def o4(u):
    cv = bg_dark(u + 25)
    cta(cv, u, 'Pas de rendez-vous.', 'Lien en bio')
    return cv

# ---------- VIDÉO 4 : les 5 zones (33 s) ----------
ZONES = ['Boîte mail', 'Trouver des clients', 'Contenu', 'Administratif', 'Branding']
def z1(u):
    cv = bg_dark(u)
    p = spring(u - 0.1, z=0.5, w=13)
    text(cv, '5', 560, W / 2, 640, LILAS, a=fade(u - 0.1, 0.2), scale=0.5 + 0.5 * p, weight=900)
    words(cv, 'zones où tu perds du temps', 92, W / 2, 1060, 860, u, 0.8, IV, stagger=0.1)
    text(cv, 'Combien tu en coches ?', 62, W / 2, 1320, LILAS, a=fade(u - 2.3, 0.4), weight=700, dy=24 * (1 - out_expo((u - 2.3) / 0.6)))
    return cv

def burst(cv, cx, cy, p, col):
    if p <= 0 or p >= 1: return
    for k in range(8):
        ang = k * math.pi / 4 + 0.3; r = 20 + 70 * out_expo(p)
        circle(cv, cx + r * math.cos(ang), cy + r * math.sin(ang), 7 * (1 - p), fill=col, a=1 - p)

def z2(u):
    cv = Cv(IV)
    words(cv, 'Combien en coches-tu ?', 66, W / 2, 330, 960, u, 0.1, VD)
    done = sum(1 for i in range(5) if u > 0.5 + 3.1 * i + 1.0)
    pill(cv, f'{done} / 5', 40, W / 2, 440, LILAS, VD, a=fade(u - 0.5), padx=36, pady=14)
    for i, z in enumerate(ZONES):
        s0 = 0.9 + 3.1 * i; p = spring(u - s0, z=0.7, w=13); y = 520 + i * 190
        if p <= 0: continue
        a = clamp(p * 1.8); dx = 140 * (1 - p)
        rrect(cv, 100 + dx, y, 980 + dx, y + 150, 44, fill=SURF, a=a, outline=LINE, ow=3)
        rrect(cv, 140 + dx, y + 35, 220 + dx, y + 115, 20, a=a, outline=V, ow=7)
        cp = out_expo((u - s0 - 1.0) / 0.4)
        stroke(cv, [(160 + dx, y + 77), (178 + dx, y + 97), (206 + dx, y + 55)], 12, V, a=a, prog=cp)
        burst(cv, 180 + dx, y + 75, (u - s0 - 1.1) / 0.6, ROUILLE)
        text(cv, f'{i + 1}.  {z}', 58, 270 + dx, y + 75, VD, a=a, weight=800, anchor='lm')
    return cv

def z3(u):
    cv = Cv(IV)
    words(cv, 'Note chaque zone', 96, W / 2, 520, 880, u, 0.1, VD)
    words(cv, 'de 1 à 5.', 96, W / 2, 660, 880, u, 0.6, V)
    pos = 4 * in_out((u - 1.6) / 1.8)
    for n in range(5):
        cx = 200 + n * 170
        landed = u > 3.4 and n == 4
        p = spring(u - 1.0 - 0.12 * n)
        big = 1 + (0.22 * spring(u - 3.4, z=0.5, w=15) if landed else 0)
        hot = (V if landed else (LILAS if n > pos else LILAS))
        circle(cv, cx, 960, 62 * clamp(p) * big, fill=hot, a=clamp(p * 1.6))
        text(cv, str(n + 1), 58, cx, 960, IV if landed else VD, a=clamp(p * 1.6), scale=big)
    if u > 1.6:
        cx = 200 + pos * 170
        circle(cv, cx, 960, 80, outline=ROUILLE, ow=6, a=fade(u - 1.6, 0.2) * (1 - 0.0))
    text(cv, 'la plus lourde', 38, 200 + 4 * 170, 1080, ROUILLE, a=fade(u - 3.8, 0.4), weight=700)
    words(cv, 'Commence par celle-là.', 72, W / 2, 1290, 880, u, 4.4, CANN, weight=800)
    return cv

def z4(u):
    cv = bg_dark(u + 28)
    cta(cv, u, 'Checklist gratuite', 'Lien en bio')
    return cv


def icon_valide(cv, x, y, col, a):
    stroke(cv, [(x - 20, y + 2), (x - 5, y + 18), (x + 22, y - 16)], 8, col, a)

def dot_links(cv, t, pts, a):
    """Petit réseau de nœuds reliés, une impulsion circule : l'idée des agents qui travaillent."""
    for i in range(len(pts)):
        stroke(cv, [pts[i], pts[(i + 1) % len(pts)]], 4, LILAS, a=a * (0.5 + 0.3 * math.sin(t * 3 + i)))
    for i, (x, y) in enumerate(pts): circle(cv, x, y, 24, fill=V, a=a)
    k = (t * 0.9) % len(pts); i = int(k); f = k - i
    (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % len(pts)]
    circle(cv, x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, 11, fill=ROUILLE, a=a)

def step(cv, x, y, n, title, sub, u, s0):
    p = spring(u - s0, z=0.65, w=14)
    if p <= 0: return
    circle(cv, x, y, 54 * (0.6 + 0.4 * p), fill=V, a=clamp(p * 1.6))
    text(cv, str(n), 54, x, y, IV, a=clamp(p * 1.6), scale=0.6 + 0.4 * p)
    text(cv, title, 56, x + 110, y - 22, VD, a=clamp(p * 1.8), weight=800, anchor='lm', dx=60 * (1 - p))
    text(cv, sub, 38, x + 110, y + 40, MUTED, a=clamp(p * 1.8), weight=500, anchor='lm', dx=60 * (1 - p))

# ---------- VIDÉO 1 : le Diagnostic expliqué (36 s) ----------
def d1(u):
    cv = bg_dark(u)
    pill(cv, 'Diagnostic IA', 44, W / 2, 400, LILAS, VD, a=fade(u - 0.1), scale=0.8 + 0.2 * spring(u - 0.1))
    words(cv, 'Une IA analyse ton business', 92, W / 2, 760, 860, u, 0.3, IV)
    p = spring(u - 1.8, z=0.5, w=14)
    text(cv, 'pour 19 €', 150, W / 2, 1160, LILAS, a=fade(u - 1.8, 0.2), scale=0.6 + 0.4 * p, weight=900)
    return cv

def d2(u):
    cv = Cv(IV)
    stroke(cv, [(170, 430), (170, 1290)], 8, LILAS, prog=clamp((u - 0.3) / 16.0))
    step(cv, 170, 430, 1, 'Tu paies', 'sans rendez-vous', u, 0.5)
    step(cv, 170, 700, 2, 'Tu remplis un formulaire', 'quelques questions', u, 3.5)
    for i, (lab, cx, cy) in enumerate((('Qui tu es', 400, 830), ('Ton site', 690, 830), ('Ton problème', 450, 915), ('Tes objectifs', 770, 915))):
        pp = spring(u - 4.8 - 0.5 * i)
        pill(cv, lab, 38, cx, cy, LILAS, VD, a=clamp(pp * 1.6), scale=0.8 + 0.2 * pp, padx=28, pady=14, weight=700)
    step(cv, 170, 1150, 3, 'Des agents IA analysent', 'ils lisent tes réponses', u, 8.5)
    dot_links(cv, u, [(330, 1300), (540, 1255), (750, 1305)], fade(u - 9.5, 0.5))
    return cv

def d3(u):
    cv = Cv(IV)
    pe = spring(u - 0.1, z=0.55, w=14)
    rrect(cv, 440, 310, 640, 450, 26, fill=V, a=clamp(pe * 1.6))
    stroke(cv, [(456, 340), (540, 410), (624, 340)], 9, IV, a=clamp(pe * 1.6), prog=out_expo((u - 0.5) / 0.5))
    words(cv, 'Tu reçois par e-mail', 72, W / 2, 560, 880, u, 0.5, VD)
    items = [(icon_analyse, 'Une analyse', 'de ton business'), (icon_pistes, '3 pistes classées', 'par effet attendu'),
             (icon_outils, 'Des outils recommandés', 'simples, à ton niveau'), (icon_plan, 'Un plan d’action', 'à faire dès réception')]
    for i, (ic, a_, b_) in enumerate(items):
        y0 = 660 + i * 205
        card(cv, 100, y0, 980, y0 + 170, spring(u - 1.5 - 2.0 * i, z=0.7, w=13), ic, a_, b_, side=-1 if i % 2 == 0 else 1)
    return cv

def d4(u):
    cv = bg_dark(u + 32)
    cta(cv, u, 'Diagnostic à 19 €', 'Lien en bio')
    return cv

# ---------- VIDÉO 3 : combien coûte un agent IA ? (32 s) ----------
def slider(cv, y, f, a=1.0, labels=True):
    x0, x1 = 140, 940
    rrect(cv, x0, y - 9, x1, y + 9, 9, fill=LINE, a=a)
    rrect(cv, x0, y - 9, x0 + (x1 - x0) * f, y + 9, 9, fill=V, a=a)
    circle(cv, x0 + (x1 - x0) * f, y, 32, fill=V, a=a, outline=IV, ow=7)
    if labels:
        text(cv, '200 €', 44, x0 + 20, y + 78, VD, a=a, weight=800)
        text(cv, '800 €', 44, x1 - 20, y + 78, VD, a=a, weight=800)

def p1(u):
    cv = bg_dark(u)
    words(cv, 'Combien coûte un agent IA ?', 92, W / 2, 680, 860, u, 0.2, IV)
    p = spring(u - 2.0, z=0.5, w=14)
    text(cv, '200 à 800 €', 150, W / 2, 1120, LILAS, a=fade(u - 2.0, 0.2), scale=0.6 + 0.4 * p, weight=900)
    return cv

def p2(u):
    cv = Cv(IV)
    pill(cv, 'Pourquoi cet écart ?', 44, W / 2, 380, V, IV, a=fade(u - 0.1), scale=0.8 + 0.2 * spring(u - 0.1))
    words(cv, 'Trois choses font varier le prix.', 96, W / 2, 780, 880, u, 0.6, VD, colors={'Trois': V})
    slider(cv, 1230, 0.08 + 0.84 * in_out((u - 2.4) / 3.0) * 0 + 0.0, a=fade(u - 2.0, 0.4))
    return cv

def p3(u):
    cv = Cv(IV)
    f = 0.08 + 0.22 * spring(u - 1.0, z=0.7, w=12) + 0.28 * spring(u - 5.2, z=0.7, w=12) + 0.30 * spring(u - 9.4, z=0.7, w=12)
    slider(cv, 380, f, a=1.0)
    words(cv, 'Ce qui fait monter le prix', 66, W / 2, 560, 900, u, 0.2, MUTED, weight=700)
    items = [(icon_outils, 'Les outils à brancher', 'boîte mail, agenda, tableur'), (icon_pistes, 'La complexité', 'une tâche simple ou plusieurs étapes'),
             (icon_valide, 'Tes validations', 'ce que tu valides avant l’action')]
    for i, (ic, a_, b_) in enumerate(items):
        y0 = 680 + i * 250
        card(cv, 100, y0, 980, y0 + 200, spring(u - 1.0 - 4.2 * i, z=0.7, w=13), ic, a_, b_, side=-1 if i % 2 == 0 else 1)
    return cv

def p4(u):
    cv = bg_dark(u + 24)
    cta(cv, u, '30 minutes gratuites', 'Lien en bio')
    return cv

# scènes : (fonction de u local, début) ; transition en iris de 0,5 s avant chaque coupe
VIDEOS = {
    'offre-diagnostic': ([(o1, 0), (o2, 4.0), (o3, 13.5), (o4, 25.0)], 30.0),
    'cinq-zones': ([(z1, 0), (z2, 4.0), (z3, 20.0), (z4, 28.0)], 33.0),
    'diagnostic-demo': ([(d1, 0), (d2, 4.0), (d3, 22.0), (d4, 32.0)], 36.0),
    'prix-agent': ([(p1, 0), (p2, 3.5), (p3, 10.0), (p4, 24.0)], 32.0),
}
TR = 0.5

def iris(a, b, p):
    r = in_out(p) * math.hypot(W, H) * 1.05
    m = Image.new('L', (W * 2, H * 2), 0)
    cx, cy = W, int(H * 2 * 0.74)
    ImageDraw.Draw(m).ellipse((cx - r * 2, cy - r * 2, cx + r * 2, cy + r * 2), fill=255)
    return Image.composite(b, a, m.resize((W, H), Image.LANCZOS))

def frame_at(scenes, t):
    idx = max(i for i, (_, s) in enumerate(scenes) if t >= s - 1e-9)
    fn, s = scenes[idx]
    if idx + 1 < len(scenes) and t > scenes[idx + 1][1] - TR:
        nfn, ns = scenes[idx + 1]
        p = (t - (ns - TR)) / TR
        return iris(fn(t - s).done(), nfn(0.0).done(), p)
    return fn(t - s).done()

def frame_blur(scenes, t):
    """Flou de mouvement : 3 sous-images réparties sur la moitié d'une image."""
    d = 0.5 / FPS
    a, b, c = frame_at(scenes, max(0, t - d)), frame_at(scenes, t), frame_at(scenes, t + d)
    return Image.blend(Image.blend(a, b, 0.5), c, 1 / 3)

def work(args):
    name, i, folder = args
    scenes, dur = VIDEOS[name]
    frame_blur(scenes, i / FPS).save(os.path.join(folder, f'{i:05d}.png'), compress_level=1)

def build(name, test=False):
    scenes, dur = VIDEOS[name]
    folder = os.path.join(TMP, name); os.makedirs(folder, exist_ok=True)
    n = int(dur * FPS)
    ids = [int(x * FPS) for x in (0.5, 2.5, 5, 7, 9, 12, 15, 19, 23, 26, 28, 31, 34) if x < dur] if test else range(n)
    ctx = get_context('fork')
    with ctx.Pool() as pool:
        for _ in pool.imap_unordered(work, [(name, i, folder) for i in ids], chunksize=4): pass
    if test:
        print(folder); return
    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, f'{name}.mp4')
    subprocess.run(['swift', os.path.join(ROOT, 'scripts/motion/encode.swift'), folder, out, str(FPS)], check=True)
    print('OK', out)

if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    which = a[0] if a else 'all'
    for name in (VIDEOS if which == 'all' else [which]): build(name, '--test' in sys.argv)
