// Bard battle effects: attack sound wave, impact, Battle Hymn, and per-rank promotion effects.
// Plain functions, no game globals. Coordinates are logical game pixels.
// ctx is the game canvas context; ps is canvas pixels per effect pixel (1 in the game, where ctx is already scaled).
// fx is any object you keep between frames (create it with bardFxState()).

const BARD_RANKS = [
  { name: 'Bard',     note: ['#ffd23f', '#fff3c0'], alt: '#7fe0d0', ring: '255,215,90',  glow: null,          orbs: false, size: 1.00 },
  { name: 'Minstrel', note: ['#ff6a7a', '#ffe0a0'], alt: '#ffd23f', ring: '255,120,130', glow: null,          orbs: false, size: 1.00 },
  { name: 'Virtuoso', note: ['#fff0b0', '#ffffff'], alt: '#c8a0ff', ring: '255,244,200', glow: '255,220,120', orbs: false, size: 1.00 },
  { name: 'Maestro',  note: ['#6fe8ff', '#e8fdff'], alt: '#ffffff', ring: '111,232,255', glow: '111,232,255', orbs: true,  size: 1.08 },
];

const BARD_FX = {
  launch: [9, -3],   // where the wave leaves the lute, sprite px from the feet anchor (attack frame 4, facing right)
  lute: [4, -4],     // lute centre for the promotion glow, sprite px from the feet anchor (idle)
  projDur: 0.4,      // seconds from lute to target
  impactShake: 0.18, impactShakeAmp: 2, impactFlash: 0.18, knockback: 9,
  hymnTime: 4.4,     // seconds the party glow and floating notes last
};

function bardFxState() { return { parts: [], arcs: [], rings: [], impacts: [], projs: [] }; }

function _px(ctx, ps, x, y, col, a) {
  ctx.globalAlpha = a == null ? 1 : Math.max(0, Math.min(1, a));
  ctx.fillStyle = col; ctx.fillRect(Math.round(x) * ps, Math.round(y) * ps, ps, ps);
  ctx.globalAlpha = 1;
}

// A music note glyph with a dark rim so it reads on bright maps. (x, y) = bottom-left of the note head.
function bardNote(ctx, ps, x, y, a, rank, alt) {
  const R = BARD_RANKS[rank], c1 = R.note[1], c2 = alt ? R.alt : R.note[0], k = '#2a1420';
  for (const [dx, dy] of [[0,1],[1,1],[-1,0],[-1,-1],[2,0],[2,-1],[0,-2],[2,-2],[0,-3],[1,-4],[2,-4],[3,-3],[4,-2],[3,-1]]) _px(ctx, ps, x + dx, y + dy, k, a * 0.85);
  _px(ctx, ps, x, y, c1, a); _px(ctx, ps, x + 1, y, c2, a); _px(ctx, ps, x, y - 1, c2, a); _px(ctx, ps, x + 1, y - 1, c1, a);
  _px(ctx, ps, x + 1, y - 2, c2, a); _px(ctx, ps, x + 1, y - 3, c2, a); _px(ctx, ps, x + 2, y - 3, c1, a); _px(ctx, ps, x + 3, y - 2, c2, a);
}

function _burst(fx, x, y, col, n) {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = 15 + Math.random() * 35;
    fx.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.35, max: 0.35, col }); }
}

// Call on the attack's hit frame. (x, y) = launch point (anchor + BARD_FX.launch * unit scale); (tx, ty) = target.
// onHit fires when the wave lands; call bardImpact from it.
function bardAttack(fx, x, y, tx, ty, rank, onHit) {
  for (let i = 0; i < 4; i++) fx.arcs.push({ x, y, r: 2, delay: i * 0.05 });
  _burst(fx, x, y, BARD_RANKS[rank].note[1], 10);
  fx.projs.push({ x, y: y - 1, tx, ty, t: 0, dur: BARD_FX.projDur, rank, onHit });
}

// Burst on the target. Returns the feel values to apply to the game: shake, flash on the target, knockback.
function bardImpact(fx, x, y, rank) {
  fx.impacts.push({ x, y, r: 1, rank });
  _burst(fx, x, y, BARD_RANKS[rank].note[0], 18); _burst(fx, x, y, '#ffffff', 8);
  return { shake: BARD_FX.impactShake, shakeAmp: BARD_FX.impactShakeAmp, flash: BARD_FX.impactFlash, knockback: BARD_FX.knockback };
}

// Start the hymn at the bard's feet. Draw bardHymnParty every frame while it lasts.
function bardHymn(fx, x, y) {
  for (let i = 0; i < 3; i++) fx.rings.push({ x: x + 2, y: y - 8, r: 0, delay: 0.2 + i * 0.3 });
  return BARD_FX.hymnTime;
}

function bardFxStep(fx, dt) {
  for (const p of fx.projs) {
    p.t += dt; const k = Math.min(1, p.t / p.dur);
    p.cx = p.x + (p.tx - p.x) * k; p.cy = p.y + (p.ty - p.y) * k - Math.sin(k * Math.PI * 2) * 1.5;
    for (let i = 0; i < 2; i++) fx.parts.push({ x: p.cx - 2, y: p.cy + Math.random() * 4 - 2, vx: -20 - Math.random() * 20, vy: -8 + Math.random() * 16, life: 0.3, max: 0.3, col: Math.random() < 0.5 ? BARD_RANKS[p.rank].note[0] : BARD_RANKS[p.rank].note[1] });
    if (k >= 1) { p.dead = true; if (p.onHit) p.onHit(); }
  }
  fx.projs = fx.projs.filter(p => !p.dead);
  for (const a of fx.arcs) { if (a.delay > 0) { a.delay -= dt; continue; } a.r += 70 * dt; }
  fx.arcs = fx.arcs.filter(a => a.r < 22);
  for (const m of fx.impacts) m.r += 90 * dt; fx.impacts = fx.impacts.filter(m => m.r < 20);
  for (const r of fx.rings) { if (r.delay > 0) { r.delay -= dt; continue; } r.r += 70 * dt; } fx.rings = fx.rings.filter(r => r.r < 95);
  for (const p of fx.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; } fx.parts = fx.parts.filter(p => p.life > 0);
}

// Hymn rings go under the units; call this before drawing units.
function bardFxDrawUnder(ctx, ps, fx, rank) {
  const R = BARD_RANKS[rank];
  for (const r of fx.rings) { if (r.delay > 0) continue;
    ctx.strokeStyle = 'rgba(' + R.ring + ',' + (1 - r.r / 95) * 0.85 + ')'; ctx.lineWidth = ps;
    ctx.beginPath(); ctx.ellipse(r.x * ps, r.y * ps, r.r * ps, r.r * 0.3 * ps, 0, 0, 7); ctx.stroke(); }
}

// Arcs, the travelling wave, impact rings and sparks go over the units.
function bardFxDrawOver(ctx, ps, fx, rank) {
  const R = BARD_RANKS[rank];
  for (const a of fx.arcs) { if (a.delay > 0) continue; const al = 1 - a.r / 22;
    for (let k = -5; k <= 5; k++) { const ang = k * 0.2, X = a.x + Math.cos(ang) * a.r, Y = a.y + Math.sin(ang) * a.r;
      _px(ctx, ps, X + 1, Y, '#3a1a10', al * 0.7); _px(ctx, ps, X, Y, k % 2 ? R.note[0] : R.note[1], al); _px(ctx, ps, X - 1, Y, '#ffffff', al * 0.6); } }
  for (const m of fx.impacts) { const al = 1 - m.r / 20, Rm = BARD_RANKS[m.rank];
    for (let k = 0; k < 16; k++) { const ang = k * 0.393; _px(ctx, ps, m.x + Math.cos(ang) * m.r, m.y + Math.sin(ang) * m.r * 0.8, k % 2 ? Rm.note[0] : '#ffffff', al); } }
  for (const p of fx.projs) { const Rp = BARD_RANKS[p.rank];
    for (let w = 1; w <= 3; w++) { const r = 5 + w * 2, al = 1 - w * 0.22;
      for (let k = -4; k <= 4; k++) { const ang = k * 0.26, X = p.cx - w * 4 + Math.cos(ang) * r - r, Y = p.cy + Math.sin(ang) * r;
        _px(ctx, ps, X + 1, Y, '#3a1a10', al * 0.8); _px(ctx, ps, X, Y, w === 1 ? '#ffffff' : Rp.note[0], al); } }
    const g = ctx.createRadialGradient(p.cx * ps, p.cy * ps, 0, p.cx * ps, p.cy * ps, 10 * ps);
    g.addColorStop(0, 'rgba(' + Rp.ring + ',0.45)'); g.addColorStop(1, 'rgba(' + Rp.ring + ',0)');
    ctx.fillStyle = g; ctx.fillRect((p.cx - 10) * ps, (p.cy - 10) * ps, 20 * ps, 20 * ps);
    bardNote(ctx, ps, p.cx - 1, p.cy + 2, 1, p.rank); }
  for (const p of fx.parts) _px(ctx, ps, p.x, p.y, p.col, p.life / p.max);
}

// While the hymn lasts: a warm glow under each hero (call before drawing that hero) ...
function bardHymnGlow(ctx, ps, x, y, t, strength, rank) {
  const R = BARD_RANKS[rank], g = ctx.createRadialGradient(x * ps, (y - 12) * ps, 0, x * ps, (y - 12) * ps, 18 * ps);
  g.addColorStop(0, 'rgba(' + R.ring + ',' + (0.2 + 0.08 * Math.sin(t * 6)) * strength + ')'); g.addColorStop(1, 'rgba(' + R.ring + ',0)');
  ctx.fillStyle = g; ctx.fillRect((x - 18) * ps, (y - 30) * ps, 36 * ps, 36 * ps);
}
// ... and two notes floating up over each hero (call after drawing the heroes). heroes = [{x, y}] feet positions.
function bardHymnNotes(ctx, ps, heroes, t, strength, rank) {
  heroes.forEach((h, i) => { for (let k = 0; k < 2; k++) { const ph = (t * 0.7 + i * 0.37 + k * 0.5) % 1;
    bardNote(ctx, ps, h.x - 4 + Math.sin(t * 3 + i + k * 2) * 5, h.y - 30 - ph * 18, strength * (1 - ph), rank, k === 1); } });
}

// Promotion effects around the bard at ranks 1-3. (x, y) = feet anchor in canvas px; sc = canvas px per sprite px
// (unit scale x rank size). Call once with before=true (glow behind the sprite) and once with before=false (notes, orbs).
function bardPromoFx(ctx, x, y, sc, rank, t, attacking, before) {
  if (!rank) return; const R = BARD_RANKS[rank];
  const pix = (X, Y, col, a) => { ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = col; ctx.fillRect(Math.round(X / sc) * sc, Math.round(Y / sc) * sc, sc, sc); ctx.globalAlpha = 1; };
  const glyph = (X, Y, c1, c2, a) => { pix(X, Y, c1, a); pix(X + sc, Y, c2, a); pix(X + sc, Y - sc, c2, a); pix(X + sc, Y - 2 * sc, c2, a); pix(X + 2 * sc, Y - 2 * sc, c1, a); };
  if (before) {
    if (R.glow) { const gx = x + BARD_FX.lute[0] * sc, gy = y + BARD_FX.lute[1] * sc, r = (attacking ? 11 : 8) * sc, al = (attacking ? 0.55 : 0.3) + 0.12 * Math.sin(t * 5);
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r); g.addColorStop(0, 'rgba(' + R.glow + ',' + al + ')'); g.addColorStop(1, 'rgba(' + R.glow + ',0)');
      ctx.fillStyle = g; ctx.fillRect(gx - r, gy - r, 2 * r, 2 * r); }
    return;
  }
  for (let k = 0; k < 3; k++) { const ph = (t * 0.45 + k * 0.33) % 1;
    glyph(x + (-7 + k * 6 + Math.sin(t * 2.5 + k * 2) * 3) * sc, y - (4 + ph * 22) * sc, R.note[1], R.note[0], (1 - ph) * 0.9); }
  if (R.orbs) for (let k = 0; k < 3; k++) { const a = t * 2 + k * 2.094, ox = x + (1 + Math.cos(a) * 12) * sc, oy = y + (-17 + Math.sin(a) * 3) * sc;
    const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, 4 * sc); g.addColorStop(0, 'rgba(111,232,255,0.8)'); g.addColorStop(1, 'rgba(111,232,255,0)');
    ctx.fillStyle = g; ctx.fillRect(ox - 4 * sc, oy - 4 * sc, 8 * sc, 8 * sc);
    glyph(ox - sc, oy + sc, '#ffffff', '#6fe8ff', Math.sin(a) > 0 ? 1 : 0.6); }
}
