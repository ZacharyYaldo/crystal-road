// Summoner battle effects: the spirit familiar (hover, dash-and-bite attack, Great Summon charge),
// the summoning circle, impacts, and per-rank promotion effects.
// Plain functions, no game globals. Coordinates are logical game pixels.
// ctx = game canvas context; ps = canvas pixels per effect pixel (1 in the game, where ctx is already scaled).

const SUMMONER_RANKS = [
  { name: 'Summoner',     main: '#5ae8c8', light: '#e8fff8', glow: '90,232,200',  promo: null,     size: 1.00 },
  { name: 'Conjurer',     main: '#78d8ff', light: '#f0fbff', glow: '120,216,255', promo: 'motes',  size: 1.00 },
  { name: 'Spiritcaller', main: '#c8a0ff', light: '#f0e0ff', glow: '200,160,255', promo: 'runes',  size: 1.00 },
  { name: 'Archsummoner', main: '#ffd060', light: '#fff4c0', glow: '255,208,96',  promo: 'shards', size: 1.08 },
];

const SUMMONER_FX = {
  home: [-9, -22],        // familiar hover spot, sprite px from the summoner's feet anchor (scaled by unit scale x rank size)
  dashTime: 0.26, biteTime: 0.22, backTime: 0.35,
  growTime: 0.9, growScale: 2.4, chargeTime: 0.75,
  circle: [22, 0],        // summoning circle, sprite px from the feet anchor
  hit:   { shake: 0.16, shakeAmp: 2, flash: 0.18, knockback: 9 },
  bigHit:{ shake: 0.22, shakeAmp: 3, flash: 0.18, knockback: 12 },
};

function summonerFxState() {
  return { parts: [], impacts: [], circle: null, fam: { x: 0, y: 0, state: 'hover', t: 0, scale: 1, glow: 0, anim: 'idle', frame: 0, ft: 0, flip: false, init: false } };
}

function _spx(ctx, ps, x, y, col, a) {
  ctx.globalAlpha = a == null ? 1 : Math.max(0, Math.min(1, a));
  ctx.fillStyle = col; ctx.fillRect(Math.round(x) * ps, Math.round(y) * ps, ps, ps); ctx.globalAlpha = 1;
}
function _sburst(fx, x, y, col, n) {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = 15 + Math.random() * 40;
    fx.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.4, max: 0.4, col }); }
}

// Burst on a target. Returns the feel values for the game to apply.
function summonerImpact(fx, x, y, rank, big) {
  const R = SUMMONER_RANKS[rank];
  fx.impacts.push({ x, y, r: 1, rank });
  _sburst(fx, x, y, R.main, big ? 24 : 16); _sburst(fx, x, y, '#ffffff', 8);
  return big ? SUMMONER_FX.bigHit : SUMMONER_FX.hit;
}

// Call on the attack's hit frame. target = {x} in logical px (its feet x); groundY = the ground line.
// onBite(target) fires when the familiar lands the bite.
function summonerAttack(fx, target, groundY, rank, onBite) {
  const f = fx.fam; _sburst(fx, f.x, f.y, SUMMONER_RANKS[rank].light, 8);
  Object.assign(f, { state: 'dash', t: 0, from: { x: f.x, y: f.y }, tgt: target, groundY, onBite });
}

// Call when the ability starts. (cx, groundY) = circle position; targets = enemies in order along the charge;
// endX = where the charge leaves the screen; onHit(target) fires as the giant familiar passes each one.
function summonerGreatSummon(fx, cx, groundY, targets, endX, onHit) {
  fx.circle = { x: cx, y: groundY, t: 0 };
  const f = fx.fam; Object.assign(f, { state: 'grow', t: 0, from: { x: f.x, y: f.y }, cx, groundY, targets, endX, onHit, hits: new Set() });
}

// Every frame. home = the familiar's hover point in logical px (anchor + SUMMONER_FX.home * scale).
// famAtlas = the familiar's atlas entry (for frame counts).
function summonerFxStep(fx, dt, home, t, rank, famAtlas) {
  const f = fx.fam, R = SUMMONER_RANKS[rank];
  if (!f.init) { f.x = home.x; f.y = home.y; f.init = true; }
  const hy = home.y + Math.sin(t * 3) * 1.5;
  f.t += dt; f.ft += dt; const fps = f.anim === 'run' ? 12 : 4;
  while (f.ft >= 1 / fps) { f.ft -= 1 / fps; f.frame = (f.frame + 1) % famAtlas.anims[f.anim].n; }
  const trail = (n, spread, speed) => { for (let i = 0; i < n; i++) fx.parts.push({ x: f.x - 6 * f.scale, y: f.y - 3 * f.scale + (Math.random() - 0.5) * spread, vx: -speed, vy: -5 + Math.random() * 10, life: 0.35, max: 0.35, col: Math.random() < 0.5 ? R.main : R.light }); };
  if (f.state === 'hover') {
    f.x += (home.x - f.x) * Math.min(1, dt * 8); f.y += (hy - f.y) * Math.min(1, dt * 8);
    f.anim = 'idle'; f.flip = false; f.scale += (1 - f.scale) * Math.min(1, dt * 6); f.glow = Math.max(0, f.glow - dt * 2);
    if (Math.random() < 0.25) fx.parts.push({ x: f.x - 4 + Math.random() * 8, y: f.y - 2, vx: -4, vy: -10, life: 0.5, max: 0.5, col: R.main });
  } else if (f.state === 'dash') {
    f.anim = 'run'; const k = Math.min(1, f.t / SUMMONER_FX.dashTime), tx = f.tgt.x - 12, ty = f.groundY - 4;
    f.x = f.from.x + (tx - f.from.x) * k; f.y = f.from.y + (ty - f.from.y) * k - Math.sin(k * Math.PI) * 8; trail(2, 4, 30);
    if (k >= 1) { f.state = 'bite'; f.t = 0; f.anim = 'bite'; f.frame = 0; if (f.onBite) f.onBite(f.tgt); }
  } else if (f.state === 'bite') {
    f.anim = 'bite'; if (f.t > SUMMONER_FX.biteTime) { f.state = 'back'; f.t = 0; f.from = { x: f.x, y: f.y }; }
  } else if (f.state === 'back') {
    f.anim = 'run'; f.flip = true; const k = Math.min(1, f.t / SUMMONER_FX.backTime);
    f.x = f.from.x + (home.x - f.from.x) * k; f.y = f.from.y + (hy - f.from.y) * k - Math.sin(k * Math.PI) * 6;
    if (k >= 1) { f.state = 'hover'; f.flip = false; }
  } else if (f.state === 'grow') {
    f.anim = 'idle'; const k = Math.min(1, f.t / SUMMONER_FX.growTime);
    f.x = f.from.x + (f.cx - f.from.x) * k; f.y = f.from.y + ((f.groundY - 2) - f.from.y) * k; f.scale = 1 + (SUMMONER_FX.growScale - 1) * k; f.glow = k;
    if (Math.random() < 0.8) fx.parts.push({ x: f.x - 10 + Math.random() * 20, y: f.groundY - 2, vx: 0, vy: -30 - Math.random() * 20, life: 0.5, max: 0.5, col: Math.random() < 0.5 ? R.main : R.light });
    if (k >= 1) { f.state = 'charge'; f.t = 0; f.from = { x: f.x, y: f.y }; }
  } else if (f.state === 'charge') {
    f.anim = 'run'; const k = Math.min(1, f.t / SUMMONER_FX.chargeTime);
    f.x = f.from.x + (f.endX - f.from.x) * k; f.y = f.groundY - 2; trail(4, 14, 60);
    for (const e of f.targets) if (!f.hits.has(e) && f.x >= e.x - 6) { f.hits.add(e); if (f.onHit) f.onHit(e); }
    if (k >= 1) { f.state = 'hover'; f.scale = 1; f.glow = 0; f.x = home.x; f.y = home.y - 30; _sburst(fx, home.x, home.y, R.light, 10); }
  }
  for (const p of fx.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; } fx.parts = fx.parts.filter(p => p.life > 0);
  for (const m of fx.impacts) m.r += 90 * dt; fx.impacts = fx.impacts.filter(m => m.r < 22);
  if (fx.circle) { fx.circle.t += dt; if (fx.circle.t > 2.2) fx.circle = null; }
}

// Summoning circle and light column: before units.
function summonerFxDrawUnder(ctx, ps, fx, rank) {
  const c = fx.circle; if (!c) return; const R = SUMMONER_RANKS[rank];
  const a = Math.min(1, c.t * 3) * (c.t > 1.7 ? 1 - (c.t - 1.7) / 0.5 : 1), r = 16;
  ctx.strokeStyle = 'rgba(' + R.glow + ',' + a * 0.9 + ')'; ctx.lineWidth = ps;
  ctx.beginPath(); ctx.ellipse(c.x * ps, c.y * ps, r * ps, r * 0.3 * ps, 0, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(c.x * ps, c.y * ps, (r - 4) * ps, (r - 4) * 0.3 * ps, 0, 0, 7); ctx.stroke();
  for (let k = 0; k < 8; k++) { const an = k * 0.785 + c.t * 2; _spx(ctx, ps, c.x + Math.cos(an) * (r - 2), c.y + Math.sin(an) * (r - 2) * 0.3, k % 2 ? R.light : R.main, a); }
  const g = ctx.createLinearGradient(0, (c.y - 40) * ps, 0, c.y * ps);
  g.addColorStop(0, 'rgba(' + R.glow + ',0)'); g.addColorStop(1, 'rgba(' + R.glow + ',' + a * 0.35 + ')');
  ctx.fillStyle = g; ctx.fillRect((c.x - r) * ps, (c.y - 40) * ps, 2 * r * ps, 40 * ps);
}

// The familiar. img = its rank's sheet, A = its atlas entry, sc = unit scale (the game's US).
function summonerFamiliarDraw(ctx, ps, fx, img, A, sc, rank) {
  const f = fx.fam, a = A.anims[f.anim], fr = Math.min(f.frame, a.n - 1), s = sc * f.scale, R = SUMMONER_RANKS[rank];
  const g = ctx.createRadialGradient(f.x * ps, (f.y - 5 * s) * ps, 0, f.x * ps, (f.y - 5 * s) * ps, (9 + f.glow * 6) * s * ps);
  g.addColorStop(0, 'rgba(' + R.glow + ',' + (0.35 + f.glow * 0.3) + ')'); g.addColorStop(1, 'rgba(' + R.glow + ',0)');
  ctx.fillStyle = g; ctx.fillRect((f.x - 16 * s) * ps, (f.y - 22 * s) * ps, 32 * s * ps, 32 * s * ps);
  ctx.save(); ctx.globalAlpha = 0.92;
  if (f.flip) { ctx.translate(f.x * ps, 0); ctx.scale(-1, 1); ctx.translate(-f.x * ps, 0); }
  ctx.drawImage(img, fr * A.cw, a.row * A.ch, A.cw, A.ch, (f.x - A.ox * s) * ps, (f.y - A.oy * s) * ps, A.cw * s * ps, A.ch * s * ps);
  ctx.restore();
}

// Impact rings and particles: after units.
function summonerFxDrawOver(ctx, ps, fx) {
  for (const m of fx.impacts) { const al = 1 - m.r / 22, R = SUMMONER_RANKS[m.rank];
    for (let k = 0; k < 16; k++) { const an = k * 0.393; _spx(ctx, ps, m.x + Math.cos(an) * m.r, m.y + Math.sin(an) * m.r * 0.8, k % 2 ? R.main : '#ffffff', al); } }
  for (const p of fx.parts) _spx(ctx, ps, p.x, p.y, p.col, p.life / p.max);
}

// Promotion effects around the summoner at ranks 1-3. (x, y) = feet anchor in canvas px; sc = canvas px per sprite px
// (unit scale x rank size). Call with before=true behind the sprite and before=false in front.
function summonerPromoFx(ctx, x, y, sc, rank, t, before) {
  const R = SUMMONER_RANKS[rank]; if (!R.promo) return;
  const pix = (X, Y, col, a) => { ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = col; ctx.fillRect(Math.round(X / sc) * sc, Math.round(Y / sc) * sc, sc, sc); ctx.globalAlpha = 1; };
  if (before) {
    if (R.promo === 'shards') {
      const gx = x, gy = y - 20 * sc, g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 12 * sc);
      g.addColorStop(0, 'rgba(79,240,208,' + (0.35 + 0.1 * Math.sin(t * 4)) + ')'); g.addColorStop(1, 'rgba(79,240,208,0)'); ctx.fillStyle = g; ctx.fillRect(gx - 12 * sc, gy - 12 * sc, 24 * sc, 24 * sc);
      const a = ctx.createRadialGradient(x, y, 0, x, y, 14 * sc); a.addColorStop(0, 'rgba(' + R.glow + ',0.35)'); a.addColorStop(1, 'rgba(' + R.glow + ',0)');
      ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.3); ctx.translate(-x, -y); ctx.fillStyle = a; ctx.fillRect(x - 14 * sc, y - 14 * sc, 28 * sc, 28 * sc); ctx.restore();
    }
    return;
  }
  if (R.promo === 'motes' || R.promo === 'shards') for (let k = 0; k < 4; k++) { const ph = (t * 0.5 + k * 0.25) % 1;
    pix(x + (-8 + k * 5 + Math.sin(t * 2 + k * 2) * 2) * sc, y - (2 + ph * 20) * sc, k % 2 ? R.light : R.main, (1 - ph) * 0.9); }
  if (R.promo === 'runes') for (let k = 0; k < 2; k++) { const a = t * 1.8 + k * Math.PI, ox = x + Math.cos(a) * 11 * sc, oy = y + (-10 + Math.sin(a) * 2.5) * sc, al = Math.sin(a) > 0 ? 1 : 0.55;
    const gl = ctx.createRadialGradient(ox, oy, 0, ox, oy, 4 * sc); gl.addColorStop(0, 'rgba(200,160,255,0.7)'); gl.addColorStop(1, 'rgba(200,160,255,0)'); ctx.fillStyle = gl; ctx.fillRect(ox - 4 * sc, oy - 4 * sc, 8 * sc, 8 * sc);
    for (const [dx, dy] of [[-1,-1],[0,-1],[1,0],[0,1],[-1,1],[0,0]]) pix(ox + dx * sc, oy + dy * sc, dx === 0 && dy === 0 ? '#ffffff' : R.main, al); }
}
