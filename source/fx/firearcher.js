// Fire archer battle effects: the flame arrow (release shake, trail, impact), Rain of Fire,
// per-rank flame colours, and per-rank promotion effects.
// Plain functions, no game globals. Coordinates are logical game pixels.
// ctx = game canvas context; ps = canvas pixels per effect pixel (1 in the game, where ctx is already scaled).
// Ranks 0-3 match the ranger's promotion tiers (Ranger, Marksman, Sharpshot, Windwalker).

// Each rank burns hotter AND bigger: a whiter core, but the same deep orange-red edge so it never washes out,
// and power scales the arrow glow, the streaks, the bursts and the Rain of Fire volley.
const FIRE_RANKS = {
  0: { name: 'Ranger',     flame: ['#fff3c0', '#ffd23f', '#ff8a1e', '#e0501a'], glow: '255,140,50', promo: null,      size: 1.00, power: 1.00, extra: 1 },
  1: { name: 'Marksman',   flame: ['#fff3c0', '#ffd23f', '#ff7a18', '#d8401a'], glow: '255,125,40', promo: 'embers',  size: 1.00, power: 1.12, extra: 2 },
  2: { name: 'Sharpshot',  flame: ['#ffffff', '#ffe060', '#ff7010', '#cc2c0c'], glow: '255,110,30', promo: 'bowglow', size: 1.00, power: 1.28, extra: 3 },
  3: { name: 'Windwalker', flame: ['#ffffff', '#fff080', '#ff6a08', '#b81a08'], glow: '255,95,20',  promo: 'phoenix', size: 1.08, power: 1.45, extra: 4 },
};

const FIRE_FX = {
  launch: [7, -8],        // arrow leaves the bow here: sprite px from the feet anchor (attack frame 4, facing right)
  launchUp: [10, -24],  // Rain of Fire arrow leaves here (cast frame 5): the arrowhead of the bow pointing up
  launchUpDir: [0.34, -0.94], // ...and flies this way (70 degrees up, and a little forward)
  arrowTime: 0.28,
  release: { shake: 0.35, shakeAmp: 3, screenFlash: 0.25 },   // on the release: the shot's power
  impact:  { flash: 0.18, knockback: 9 },
  rainDelay: 0.3, rainGap: 0.14, rainFall: 0.38,  // seconds: wait after the shot, gap between targets, fall time
  rainHit: { shake: 0.15, shakeAmp: 2, flash: 0.15, knockback: 6 },
  releaseFrame: 5,       // cast frame where the Rain of Fire arrow is loosed
};

function fireFxState() { return { arrows: [], rain: [], marks: [], parts: [], flash: 0 }; }

function _fpx(ctx, ps, x, y, col, a, s) {
  ctx.globalAlpha = a == null ? 1 : Math.max(0, Math.min(1, a));
  ctx.fillStyle = col; ctx.fillRect(Math.round(x) * ps, Math.round(y) * ps, (s || 1) * ps, (s || 1) * ps); ctx.globalAlpha = 1;
}
function _fcol(f, R) { return f < 0.2 ? R.flame[0] : f < 0.4 ? R.flame[1] : f < 0.6 ? R.flame[2] : f < 0.8 ? R.flame[3] : '#4a2a36'; }
function _fburst(fx, x, y, n, sp, rank, ember) {
  const P = (FIRE_RANKS[rank] || {}).power || 1; n = Math.round(n * P); sp = (sp || 1) * (0.85 + 0.15 * P); if (ember) ember = Math.round(ember * P);
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = (sp || 1) * (25 + Math.random() * 80);
    fx.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.2 + Math.random() * 0.35, max: 0.55, g: 0, em: false, rank }); }
  if (ember) for (let i = 0; i < ember; i++) fx.parts.push({ x, y, vx: 20 + Math.random() * 60, vy: -30 + Math.random() * 40, life: 0.9 + Math.random() * 0.6, max: 1.5, g: 60, em: true, rank });
}

// Attack hit frame: loose a flame arrow from (x, y) at target (tx, ty). onHit(target) fires on impact.
// Returns FIRE_FX.release: shake the screen and flash it warm as the arrow leaves.
function fireShoot(fx, x, y, tx, ty, target, rank, onHit) {
  fx.arrows.push({ x, y, tx, ty, t: 0, target, rank, onHit }); _fburst(fx, x, y, 14, 0.6, rank, 4);
  fx.flash = 1; return FIRE_FX.release;
}
// Burst on the target; returns FIRE_FX.impact.
function fireImpact(fx, x, y, rank) { _fburst(fx, x, y, 34, 1, rank, 10); return FIRE_FX.impact; }

// Cast frame FIRE_FX.releaseFrame: the arrow flies up out of view, then a volley of burning arrows drops on each target:
// one arrow that lands the hit, plus FIRE_RANKS[rank].extra more that land around it. A glow marks the ground under each target
// while its arrows fall. onHit(target) fires once per target, when its arrow lands; apply FIRE_FX.rainHit.
function fireRain(fx, x, y, targets, groundY, rank, onHit) {
  const d = FIRE_FX.launchUpDir, L = (y + 40) / -d[1];
  fx.arrows.push({ x, y, tx: x + d[0] * L, ty: -40, t: 0, up: true, rank });
  targets.forEach((tg, i) => {
    const t0 = -(FIRE_FX.rainDelay + i * FIRE_FX.rainGap);
    fx.marks.push({ tg, groundY, t: t0, rank });
    fx.rain.push({ tg, groundY, t: t0, rank, onHit, off: 0 });
    const nx = FIRE_RANKS[rank].extra;   // extra burning arrows per target, landing around it (visual only, no hit)
    for (let k = 0; k < nx; k++) fx.rain.push({ tg, groundY, t: t0 + 0.05 - k * 0.07, rank, off: [-7, 8, -12, 13][k], extra: true });
  });
  _fburst(fx, x, y, 14, 0.6, rank, 4); fx.flash = 0.6; return FIRE_FX.release;
}

function fireFxStep(fx, dt) {
  for (const a of fx.arrows) { a.t += dt; const k = Math.min(1, a.t / (a.up ? 0.4 : FIRE_FX.arrowTime));
    a.cx = a.x + (a.tx - a.x) * k; a.cy = a.y + (a.ty - a.y) * k - (a.up ? 0 : Math.sin(k * Math.PI) * 3);
    for (let i = 0; i < Math.round(3 * FIRE_RANKS[a.rank].power); i++) fx.parts.push({ x: a.cx - 2, y: a.cy + Math.random() * 2 - 1, vx: -30 - Math.random() * 30, vy: -8 - Math.random() * 16, life: 0.3 + Math.random() * 0.4, max: 0.7, g: 0, rank: a.rank });
    if (k >= 1) { a.dead = true; if (a.onHit) a.onHit(a.target); } }
  fx.arrows = fx.arrows.filter(a => !a.dead);
  for (const r of fx.rain) { r.t += dt; if (r.t < 0) continue; const k = Math.min(1, r.t / FIRE_FX.rainFall);
    r.ex = r.tg.x - 5 + r.off; r.ey = r.groundY - (r.extra ? 3 : 14); r.sx = r.ex + 16; r.sy = -14;
    r.cx = r.sx + (r.ex - r.sx) * k; r.cy = r.sy + (r.ey - r.sy) * k * k * 0.35 + (r.ey - r.sy) * k * 0.65;
    for (let i = 0; i < 2; i++) fx.parts.push({ x: r.cx + Math.random() * 2, y: r.cy - 3, vx: 10 + Math.random() * 10, vy: -20 - Math.random() * 20, life: 0.3, max: 0.5, g: 0, rank: r.rank });
    if (k >= 1) { r.dead = true; if (r.extra) _fburst(fx, r.cx, r.ey, 10, 0.5, r.rank, 2); else { _fburst(fx, r.cx, r.groundY - 12, 26, 0.9, r.rank, 6); if (r.onHit) r.onHit(r.tg); } } }
  fx.rain = fx.rain.filter(r => !r.dead);
  for (const m of fx.marks) m.t += dt; fx.marks = fx.marks.filter(m => m.t < FIRE_FX.rainFall + 0.25);
  for (const p of fx.parts) { p.vy += (p.g || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; } fx.parts = fx.parts.filter(p => p.life > 0);
  if (fx.flash > 0) fx.flash -= dt * 6;
}

function _arrowGlyph(ctx, ps, x, y, R, dirx, diry) {   // shaft trailing behind (dirx, diry) = unit direction of travel
  for (let i = 1; i <= 9; i++) _fpx(ctx, ps, x - dirx * i, y - diry * i, '#c9a46a');
  _fpx(ctx, ps, x - dirx * 9, y - diry * 9 - 1, '#c0392b'); _fpx(ctx, ps, x + dirx, y + diry, '#e2e8f2');
  _fpx(ctx, ps, x, y, R.flame[0]); _fpx(ctx, ps, x - dirx, y - diry, R.flame[1]); _fpx(ctx, ps, x, y - 1, R.flame[1]);
  _fpx(ctx, ps, x - 2 * dirx, y - 2 * diry, R.flame[2]); _fpx(ctx, ps, x - dirx, y - 1, R.flame[2]); _fpx(ctx, ps, x - 3 * dirx, y - 3 * diry, R.flame[3]);
  if (Math.random() < 0.6) _fpx(ctx, ps, x - dirx, y - 2, R.flame[3]);
}

// A falling Rain of Fire arrow: a thicker shaft and a bigger flaming head than the flying arrow, so it reads at speed.
function _bigArrow(ctx, ps, x, y, R, dx, dy, big) {
  const n = big ? 12 : 9;
  for (let i = 2; i <= n; i++) { _fpx(ctx, ps, x - dx * i, y - dy * i, '#c9a46a'); if (big) _fpx(ctx, ps, x - dx * i + 1, y - dy * i, '#8a6a3a'); }
  _fpx(ctx, ps, x - dx * n - 1, y - dy * n, '#c0392b'); _fpx(ctx, ps, x - dx * n + 1, y - dy * n, '#c0392b'); _fpx(ctx, ps, x - dx * (n - 1), y - dy * (n - 1), '#e8e8f0');
  _fpx(ctx, ps, x + dx, y + dy, '#e2e8f2');
  for (const [ox, oy, c] of [[0, 0, 0], [-1, 0, 1], [1, 0, 1], [0, -1, 1], [-1, -1, 2], [1, -1, 2], [0, -2, 2], [-1, -2, 3], [1, -2, 3], [0, -3, Math.random() < 0.5 ? 3 : 2]])
    if (big || Math.abs(ox) + Math.abs(oy) < 3) _fpx(ctx, ps, x + ox - dx, y + oy - dy, R.flame[c]);
  if (R.power > 1.2) for (const [ox, oy] of [[-2, -1], [2, -1], [-2, -2], [2, -2], [-1, -3], [1, -3], [0, -4]]) if (Math.random() < 0.75) _fpx(ctx, ps, x + ox - dx, y + oy - dy, R.flame[3]);
}
// Arrows, falling fire, flames and embers, after the units. Then fireScreenFlash over everything.
function fireFxDrawOver(ctx, ps, fx) {
  for (const a of fx.arrows) { const R = FIRE_RANKS[a.rank], dx = a.tx - a.x, dy = a.ty - a.y, L = Math.hypot(dx, dy) || 1;
    const gr = 16 * R.power, g = ctx.createRadialGradient(a.cx * ps, a.cy * ps, 0, a.cx * ps, a.cy * ps, gr * ps);
    g.addColorStop(0, 'rgba(' + R.glow + ',' + 0.35 * R.power + ')'); g.addColorStop(1, 'rgba(' + R.glow + ',0)'); ctx.fillStyle = g; ctx.fillRect((a.cx - gr) * ps, (a.cy - gr) * ps, 2 * gr * ps, 2 * gr * ps);
    _arrowGlyph(ctx, ps, a.cx, a.cy, R, dx / L, dy / L); }
  for (const r of fx.rain) { if (r.t < 0 || r.cx == null) continue; const R = FIRE_RANKS[r.rank], sc = (r.extra ? 0.8 : 1) * R.power;
    const dx = r.ex - r.sx, dy = r.ey - r.sy, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    // streak: the path behind it, so a fast arrow still reads
    const tl = Math.min(34 * R.power, Math.hypot(r.cx - r.sx, r.cy - r.sy)), bx = r.cx - ux * tl, by = r.cy - uy * tl;
    const sg = ctx.createLinearGradient(bx * ps, by * ps, r.cx * ps, r.cy * ps);
    sg.addColorStop(0, 'rgba(' + R.glow + ',0)'); sg.addColorStop(1, 'rgba(' + R.glow + ',' + Math.min(0.95, 0.75 * sc) + ')');
    ctx.strokeStyle = sg; ctx.lineWidth = 3 * ps * sc; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx * ps, by * ps); ctx.lineTo(r.cx * ps, r.cy * ps); ctx.stroke(); ctx.lineCap = 'butt';
    const g = ctx.createRadialGradient(r.cx * ps, r.cy * ps, 0, r.cx * ps, r.cy * ps, 16 * ps * sc);
    g.addColorStop(0, 'rgba(' + R.glow + ',0.45)'); g.addColorStop(1, 'rgba(' + R.glow + ',0)'); ctx.fillStyle = g; ctx.fillRect((r.cx - 16 * sc) * ps, (r.cy - 16 * sc) * ps, 32 * sc * ps, 32 * sc * ps);
    _bigArrow(ctx, ps, r.cx, r.cy, R, ux, uy, !r.extra); }
  for (const p of fx.parts) { const R = FIRE_RANKS[p.rank], f = 1 - p.life / p.max; if (p.em && Math.random() < 0.2) continue;
    _fpx(ctx, ps, p.x, p.y, p.em ? (Math.random() < 0.3 ? R.flame[0] : R.flame[2]) : _fcol(f, R), 1, (!p.em && f < 0.25) ? 2 : 1); }
}
// Ground glow under each Rain of Fire target while its arrows fall: before the units.
function fireFxDrawUnder(ctx, ps, fx) {
  for (const m of fx.marks) { if (m.t < 0) continue; const R = FIRE_RANKS[m.rank], k = Math.min(1, m.t / FIRE_FX.rainFall), out = m.t > FIRE_FX.rainFall ? 1 - (m.t - FIRE_FX.rainFall) / 0.25 : 1;
    const cx = m.tg.x - 4, cy = m.groundY + 1, rx = (6 + 8 * k);
    ctx.save(); ctx.translate(cx * ps, cy * ps); ctx.scale(1, 0.3);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * ps); g.addColorStop(0, 'rgba(' + R.glow + ',' + 0.55 * out + ')'); g.addColorStop(1, 'rgba(' + R.glow + ',0)');
    ctx.fillStyle = g; ctx.fillRect(-rx * ps, -rx * ps, 2 * rx * ps, 2 * rx * ps); ctx.restore(); }
}
function fireScreenFlash(ctx, w, h, fx, rank) {
  if (fx.flash <= 0) return; ctx.fillStyle = 'rgba(' + FIRE_RANKS[rank].glow + ',' + fx.flash * FIRE_FX.release.screenFlash + ')'; ctx.fillRect(0, 0, w, h);
}

// Promotion effects. (x, y) = feet anchor in canvas px; sc = canvas px per sprite px (unit scale x rank size).
// Call with before=true behind the sprite and before=false in front.
function firePromoFx(ctx, x, y, sc, rank, t, attacking, before) {
  const R = FIRE_RANKS[rank]; if (!R || !R.promo) return;
  const pix = (X, Y, col, a) => { ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = col; ctx.fillRect(Math.round(X / sc) * sc, Math.round(Y / sc) * sc, sc, sc); ctx.globalAlpha = 1; };
  if (before) {
    if (R.promo === 'bowglow' || R.promo === 'phoenix') { const gx = x + 8 * sc, gy = y - 8 * sc, r = (attacking ? 12 : 8) * sc, al = (attacking ? 0.55 : 0.3) + 0.1 * Math.sin(t * 6);
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r); g.addColorStop(0, 'rgba(' + R.glow + ',' + al + ')'); g.addColorStop(1, 'rgba(' + R.glow + ',0)'); ctx.fillStyle = g; ctx.fillRect(gx - r, gy - r, 2 * r, 2 * r); }
    if (R.promo === 'phoenix') { const a = ctx.createRadialGradient(x, y, 0, x, y, 16 * sc); a.addColorStop(0, 'rgba(255,170,60,0.4)'); a.addColorStop(1, 'rgba(255,120,40,0)');
      ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.3); ctx.translate(-x, -y); ctx.fillStyle = a; ctx.fillRect(x - 16 * sc, y - 16 * sc, 32 * sc, 32 * sc); ctx.restore(); }
    return;
  }
  const n = R.promo === 'phoenix' ? 6 : 4;
  for (let k = 0; k < n; k++) { const ph = (t * 0.55 + k / n) % 1;
    pix(x + (-9 + k * (18 / n) + Math.sin(t * 2.5 + k * 1.7) * 2) * sc, y - (2 + ph * 22) * sc, ph < 0.3 ? R.flame[0] : ph < 0.6 ? R.flame[2] : R.flame[3], (1 - ph) * 0.9); }
}
