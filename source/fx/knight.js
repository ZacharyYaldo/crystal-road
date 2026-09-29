// Knight battle effects: the sword slash on the target, and the Shield Wall visuals.
// Visual only: nothing here changes damage, targeting, duration or timing. Everything is driven
// by the game's existing state (the melee action's hit frame, u.status.shield, pickTarget's taunt).
// Plain functions, no game globals. Coordinates are logical game pixels; ps = canvas pixels per
// effect pixel (1 in the game, where ctx is already scaled).

// One entry per knight rank (Knight, Paladin, Crusader, Warden). The Crusader and Warden have promotion effects:
// a fluttering gold glow on the helm and gold motes rising around him; the Warden also has a glow at his feet.
// helm = the helm's centre relative to the sprite anchor, span = the motes' width, in sprite pixels.
const _KR = { slash: ['#ffffff', '#dce8ff', '#8ab0ff'], barrier: '120,170,255', rim: '#dce8ff' };
const KNIGHT_RANKS = [
  Object.assign({ name: 'Knight', promo: null }, _KR),
  Object.assign({ name: 'Paladin', promo: null }, _KR),
  Object.assign({ name: 'Crusader', promo: 'glow', glow: '255,196,64', motes: ['#ffffff', '#ffc62e'], helm: [-3.5, -13], span: [-10, 5], n: 4, aura: 0 }, _KR),
  Object.assign({ name: 'Warden', promo: 'glow', glow: '255,196,64', motes: ['#ffffff', '#ffc62e'], helm: [0.5, -21], span: [-8, 8], n: 6, aura: 22 }, _KR),
];

// Optional feel for the slash, using the game's own fields: G.shake (seconds) and target.flash (seconds).
const KNIGHT_FX = { slash: { shake: 0.15, flash: 0.15 } };

function knightFxState() { return { t: 0, parts: [], arcs: [], rings: [], domes: new WeakMap() }; }

function _kpx(ctx, ps, x, y, col, a) {
  ctx.globalAlpha = a == null ? 1 : Math.max(0, Math.min(1, a));
  ctx.fillStyle = col; ctx.fillRect(Math.round(x) * ps, Math.round(y) * ps, ps, ps); ctx.globalAlpha = 1;
}
function _kburst(fx, x, y, cols, n, sp) {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = (sp || 1) * (20 + Math.random() * 50);
    fx.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.35, max: 0.35, col: cols[i % cols.length] }); }
}

// 1. Basic attack. Call where the melee hit lands (a.hitDone in updateAction), at the TARGET:
//    x = tgt.x + tgt.dx, y = GROUND + (tgt.yoff||0) - 14. The knight has already dashed there,
//    so this lands on whichever enemy he hits, near or far.
function knightSlash(fx, x, y, rank) {
  const R = KNIGHT_RANKS[rank || 0];
  fx.arcs.push({ x, y, t: 0, rank: rank || 0 });
  _kburst(fx, x, y, R.slash, 16, 1.1);
  return KNIGHT_FX.slash;
}

// 2. Shield Wall cast. Call once for each unit that just got u.status.shield set: in applyAbility0
//    'shieldwall' (the knight, and the Iron Guard ally behind him) and in the 'Parried!' reaction.
//    (x, groundY) = that unit's anchor, sc = its draw scale; the rings and burst centre on its body.
function knightShieldCast(fx, u, x, groundY, sc, rank) {
  const D = KNIGHT_DOMES[u.uid] || KNIGHT_DOMES.DEFAULT, cx = x + D.dx * sc;
  for (let i = 0; i < 2; i++) fx.rings.push({ x: cx, y: groundY, r: 2, delay: i * 0.18, rank: rank || 0 });
  _kburst(fx, cx, groundY - D.cy * sc, ['#ffffff', '#dce8ff'], 10, 0.6);
}

// Where the barrier sits on each hero sprite, in sprite pixels before the unit scale: dx = the body's
// centre relative to the sprite anchor (weapons excluded, so it centres on the hero, not the sword),
// cy = the dome's centre height above the feet, rx/ry = its radii. Unlisted sprites use DEFAULT.
const KNIGHT_DOMES = {
  knight:    { dx: -4.5, cy: 9,  rx: 11.5, ry: 11.5 },
  templar:   { dx: -3,   cy: 9,  rx: 11.5, ry: 11.5 },
  crusader:  { dx: -3,   cy: 15, rx: 14,   ry: 10 },
  lancer:    { dx: 0.5,  cy: 19, rx: 19,   ry: 20 },
  cleric:    { dx: -1,   cy: 9,  rx: 11.5, ry: 12 },
  mage:      { dx: -1,   cy: 9,  rx: 11.5, ry: 11.5 },
  ranger:    { dx: 0,    cy: 9,  rx: 11.5, ry: 11.5 },
  rogue:     { dx: 0,    cy: 9,  rx: 11.5, ry: 11.5 },
  berserker: { dx: -2,   cy: 9,  rx: 11.5, ry: 12 },
  DEFAULT:   { dx: 0,    cy: 9,  rx: 11.5, ry: 11.5 },
};

// 3. The barrier. Call in drawUnit in place of the gold shield ellipse, for every unit, every frame:
//    it shows while u.status.shield > 0, fades in when the shield starts and out when it runs out,
//    so it lasts exactly as many turns as the game's shield does.
//    (x, groundY) = the unit's anchor (x = u.x + u.dx); sc = the scale drawUnit draws the sprite at.
function knightShieldDraw(ctx, ps, fx, u, x, groundY, sc, rank) {
  let d = fx.domes.get(u); if (!d) { d = { a: 0, last: fx.t, t: 0 }; fx.domes.set(u, d); }
  const dt = Math.max(0, fx.t - d.last); d.last = fx.t; d.t += dt;
  const on = !u.dead && u.status && u.status.shield > 0;
  d.a = on ? Math.min(1, d.a + dt * 4) : Math.max(0, d.a - dt * 3);
  if (d.a <= 0) return;
  const D = KNIGHT_DOMES[u.uid] || KNIGHT_DOMES.DEFAULT, R = KNIGHT_RANKS[rank || 0], f = d.a;
  const cx = x + D.dx * sc, cy = groundY - D.cy * sc, rx = D.rx * sc, ry = D.ry * sc;
  const g = ctx.createRadialGradient(cx * ps, cy * ps, 0, cx * ps, cy * ps, Math.max(rx, ry) * ps);
  g.addColorStop(0, 'rgba(' + R.barrier + ',0)'); g.addColorStop(0.7, 'rgba(' + R.barrier + ',' + 0.14 * f + ')'); g.addColorStop(1, 'rgba(' + R.barrier + ',' + 0.45 * f + ')');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx * ps, cy * ps, rx * ps, ry * ps, 0, Math.PI, 2 * Math.PI);
  ctx.lineTo((cx + rx) * ps, (groundY + 1) * ps); ctx.lineTo((cx - rx) * ps, (groundY + 1) * ps); ctx.fill();
  const n = Math.round(28 * rx / 17);
  for (let k = 0; k < n; k++) { const a = Math.PI + k / (n - 1) * Math.PI, sh = (Math.sin(d.t * 5 + k) + 1) / 2;
    _kpx(ctx, ps, cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, k % 2 ? R.rim : 'rgb(' + R.barrier + ')', f * (0.5 + 0.5 * sh)); }
  // the straight sides down to the ground
  for (let yy = Math.ceil(cy); yy <= groundY; yy += 2) { _kpx(ctx, ps, cx - rx, yy, R.rim, f * 0.5); _kpx(ctx, ps, cx + rx, yy, R.rim, f * 0.5); }
}

// 4. A hit on a shielded unit: sparks off the barrier. Call where dealDamage applies the shield cut
//    (tgt.status.shield > 0). The game's own damage number already shows the reduced hit.
function knightShieldHit(fx, x, y) {
  _kburst(fx, x, y, ['#ffffff', '#a8c8ff', '#6a90f0'], 12, 0.9);
}

// 5. Taunt marks. While any hero has u.status.shield > 0, pickTarget sends every enemy attack at
//    that hero; this marks it. Call per living enemy after the units: x = its centre, topY = above its head.
function knightTauntMark(ctx, ps, fx, x, topY) {
  const bob = Math.round(Math.sin(fx.t * 6));
  for (const [dx, dy] of [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4], [5, 0], [4, 1], [3, 2], [4, 3], [5, 4]])
    _kpx(ctx, ps, x - 3 + dx, topY + bob + dy, '#ff5050', 0.9);
}

function knightFxStep(fx, dt) {
  fx.t += dt;
  for (const a of fx.arcs) a.t += dt; fx.arcs = fx.arcs.filter(a => a.t < 0.22);
  for (const r of fx.rings) { if (r.delay > 0) { r.delay -= dt; continue; } r.r += 60 * dt; } fx.rings = fx.rings.filter(r => r.r < 30);
  for (const p of fx.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; } fx.parts = fx.parts.filter(p => p.life > 0);
}

// Cast rings on the ground: before the units.
function knightFxDrawUnder(ctx, ps, fx) {
  for (const r of fx.rings) { if (r.delay > 0) continue; const R = KNIGHT_RANKS[r.rank];
    ctx.strokeStyle = 'rgba(' + R.barrier + ',' + (1 - r.r / 30) * 0.9 + ')'; ctx.lineWidth = ps;
    ctx.beginPath(); ctx.ellipse(r.x * ps, r.y * ps, r.r * ps, r.r * 0.3 * ps, 0, 0, 7); ctx.stroke(); }
}

// Slash arcs and sparks: after the units.
function knightFxDrawOver(ctx, ps, fx) {
  for (const a of fx.arcs) { const R = KNIGHT_RANKS[a.rank], k = a.t / 0.22, r = 8 + k * 6, al = 1 - k;
    for (let i = 0; i < 18; i++) { const an = -1.25 + i / 17 * 2.5;
      _kpx(ctx, ps, a.x + Math.cos(an) * r * 0.55, a.y + Math.sin(an) * r, i % 3 ? R.slash[0] : R.slash[1], al);
      _kpx(ctx, ps, a.x + Math.cos(an) * (r - 1) * 0.55, a.y + Math.sin(an) * (r - 1), R.slash[2], al * 0.8); } }
  for (const p of fx.parts) _kpx(ctx, ps, p.x, p.y, p.col, p.life / p.max);
}

// Promotion effects (Crusader, Warden), in the same form as the other heroes' promotion effects.
// Call with before=true behind the sprite (helm glow, foot glow) and before=false in front (motes).
// The preview skips it on the defeat animation. (x, y) = the anchor, sc = the unit scale, t = seconds.
// ctx is the game context, already scaled.
function knightPromoFx(ctx, x, y, sc, rank, t, before) {
  const R = KNIGHT_RANKS[rank]; if (!R || !R.promo) return;
  const pix = (X, Y, col, a) => { ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = col; ctx.fillRect(Math.round(X / sc) * sc, Math.round(Y / sc) * sc, sc, sc); ctx.globalAlpha = 1; };
  if (before) {
    // helm glow, fluttering: out-of-step waves so it flickers rather than pulsing evenly
    const fl = 0.1 * Math.sin(t * 8.3) + 0.06 * Math.sin(t * 13.7 + 1.3);
    const gx = x + R.helm[0] * sc, gy = y + R.helm[1] * sc, r = (12 + 1.5 * Math.sin(t * 5.1)) * sc;
    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
    g.addColorStop(0, 'rgba(' + R.glow + ',' + (0.62 + fl) + ')'); g.addColorStop(0.45, 'rgba(' + R.glow + ',' + (0.3 + fl * 0.5) + ')'); g.addColorStop(1, 'rgba(' + R.glow + ',0)'); ctx.fillStyle = g; ctx.fillRect(gx - r, gy - r, 2 * r, 2 * r);
    if (R.aura) { const a = ctx.createRadialGradient(x, y, 0, x, y, R.aura * sc); a.addColorStop(0, 'rgba(' + R.glow + ',0.5)'); a.addColorStop(1, 'rgba(' + R.glow + ',0)');
      ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.3); ctx.translate(-x, -y); ctx.fillStyle = a; ctx.fillRect(x - R.aura * sc, y - R.aura * sc, 2 * R.aura * sc, 2 * R.aura * sc); ctx.restore(); }
    return;
  }
  // gold motes drifting up either side of him, fluttering side to side; brightest mid-rise
  const top = -R.helm[1] + 8;
  for (let k = 0; k < R.n; k++) { const ph = (t * 0.45 + k / R.n) % 1, left = k % 2 === 0, lane = Math.floor(k / 2) % 3;
    const bx = left ? R.span[0] - 1 - lane * 2 : R.span[1] + 1 + lane * 2;
    pix(x + (bx + Math.sin(t * 5 + k * 2.3) * 1.5) * sc, y - (3 + ph * top) * sc, k % 3 ? R.motes[1] : R.motes[0], Math.min(1, Math.sin(ph * Math.PI) * 1.4)); }
}
