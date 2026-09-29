// Engineer battle effects: the lobbed bomb and its explosion, the mast turret (rises behind him, fires over the party),
// per-rank turret shots, and per-rank promotion effects.
// Plain functions, no game globals. Coordinates are logical game pixels.
// ctx = game canvas context; ps = canvas pixels per effect pixel (1 in the game, where ctx is already scaled).

const ENGINEER_RANKS = [
  { name: 'Engineer',        shot: 'tracer',    colors: ['#ffffff', '#ffd060', '#ffb040'], promo: null,    size: 1.00 },
  { name: 'Machinist',       shot: 'twin',      colors: ['#ffffff', '#ff8a60', '#ff5040'], promo: 'steam', size: 1.00 },
  { name: 'Artificer',       shot: 'lightning', colors: ['#ffffff', '#a8e8ff', '#60c8ff'], promo: 'arcs',  size: 1.00 },
  { name: 'Grand Artificer', shot: 'tracer',    colors: ['#ffffff', '#fff0a0', '#ffd060'], promo: 'gear',  size: 1.08, glint: '#4ff0d0' },
];

const ENGINEER_FX = {
  throwFrom: [12, -9],   // bomb release point, sprite px from the feet anchor (attack frame 4, facing right)
  bombTime: 0.55, bombArc: 34,
  explosion: { shake: 0.3, shakeAmp: 3, flash: 0.2, knockback: 11 },
  mastDx: -3,            // mast base, sprite px from the feet anchor: right behind him
  mastHeight: 40,        // logical px the gun rises above the ground line
  riseTime: 0.45, lowerTime: 0.35,
  shots: 3, shotGap: 0.32, shotTime: 0.16, holdAfter: 1.2,
  shotHit: { shake: 0.1, shakeAmp: 1, flash: 0.12, knockback: 5 },
  gunScale: 1.35,        // the gun head is drawn this much larger than the unit scale so it reads at height
  slamFrame: 2,          // cast frame where the wrench hits the ground: start the turret here
};

function engineerFxState() { return { bombs: [], booms: [], parts: [], smoke: [], shots: [], turret: null }; }

function _epx(ctx, ps, x, y, col, a, s) {
  ctx.globalAlpha = a == null ? 1 : Math.max(0, Math.min(1, a));
  ctx.fillStyle = col; ctx.fillRect(Math.round(x) * ps, Math.round(y) * ps, (s || 1) * ps, (s || 1) * ps); ctx.globalAlpha = 1;
}
function _eburst(fx, x, y, cols, n, sp, life) {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = (sp || 1) * (15 + Math.random() * 45);
    fx.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 10, g: 60, life: life || 0.45, max: life || 0.45, col: cols[i % cols.length] }); }
}

// Attack hit frame: lob a bomb from (x, y) to (tx, ty). onBoom(target) fires on landing; call engineerExplosion there.
function engineerThrow(fx, x, y, tx, ty, target, onBoom) { fx.bombs.push({ sx: x, sy: y, tx, ty, t: 0, target, onBoom }); }

// Fireball, debris and smoke. Returns the feel values for the game to apply to the target and screen.
function engineerExplosion(fx, x, y, rank) {
  const R = ENGINEER_RANKS[rank];
  fx.booms.push({ x, y, t: 0 });
  _eburst(fx, x, y, ['#ffffff', '#fff0a0', '#ffb040', '#ff7020', R.colors[2]], 26, 1.3);
  _eburst(fx, x, y, ['#3a3a44', '#6a6a78'], 8, 0.8, 0.7);
  for (let i = 0; i < 6; i++) fx.smoke.push({ x: x - 6 + Math.random() * 12, y: y - 2 + Math.random() * 6, r: 3 + Math.random() * 3, vy: -12 - Math.random() * 10, life: 1.1, max: 1.1 });
  return ENGINEER_FX.explosion;
}

// Ability: call on cast frame ENGINEER_FX.slamFrame. x = mast base (anchor + mastDx * scale). targets = enemies to shoot, in order.
// onShot(target) fires as each shot lands; apply ENGINEER_FX.shotHit there. sc = unit scale (for the muzzle position).
function engineerDeploy(fx, x, groundY, targets, rank, onShot, sc) {
  fx.turret = { x, groundY, t: 0, state: 'build', h: 0, shots: 0, next: 0.3, anim: 'crate', frame: 0, fireT: 0, targets, rank, onShot, sc: sc || 1.5 };
  _eburst(fx, x, groundY, ['#ffd060', '#ffffff'], 14, 0.8, 0.35);
}

function engineerFxStep(fx, dt, t) {
  const E = ENGINEER_FX, ease = k => 1 - Math.pow(1 - k, 3);
  for (const b of fx.bombs) { b.t += dt; const k = Math.min(1, b.t / E.bombTime);
    b.cx = b.sx + (b.tx - b.sx) * k; b.cy = b.sy + (b.ty - b.sy) * k - Math.sin(k * Math.PI) * E.bombArc;
    if (Math.random() < 0.7) fx.parts.push({ x: b.cx, y: b.cy - 3, vx: -8 + Math.random() * 16, vy: -10, g: 0, life: 0.25, max: 0.25, col: Math.random() < 0.5 ? '#ffb040' : '#fff0a0' });
    if (k >= 1) { b.dead = true; if (b.onBoom) b.onBoom(b.target); } }
  fx.bombs = fx.bombs.filter(b => !b.dead);
  const tu = fx.turret;
  if (tu) { tu.t += dt; const topY = () => tu.groundY - 4 * tu.sc - tu.h;
    if (tu.state === 'build') { tu.anim = 'crate'; if (tu.t > 0.12) { tu.state = 'rise'; tu.t = 0; } }
    else if (tu.state === 'rise') { tu.anim = 'folded'; tu.h = E.mastHeight * ease(Math.min(1, tu.t / E.riseTime));
      if (Math.random() < 0.5) fx.parts.push({ x: tu.x + (Math.random() < 0.5 ? -1 : 1), y: tu.groundY - 4 - tu.h * Math.random(), vx: (Math.random() - 0.5) * 20, vy: -10, g: 40, life: 0.25, max: 0.25, col: '#ffd060' });
      if (tu.t > E.riseTime) { tu.state = 'unfold'; tu.t = 0; } }
    else if (tu.state === 'unfold') { tu.anim = 'idle'; tu.frame = 0; if (tu.t > 0.15) { tu.state = 'armed'; tu.t = 0; } }
    else if (tu.state === 'armed') {
      if (tu.fireT > 0) { tu.fireT -= dt; tu.anim = 'fire'; tu.frame = tu.fireT > 0.05 ? 0 : 1; } else { tu.anim = 'idle'; tu.frame = Math.floor(t * 3) % 2; }
      if (tu.shots < E.shots && tu.shots < tu.targets.length && tu.t >= tu.next) {
        const tg = tu.targets[tu.shots]; tu.shots++; tu.next = tu.t + E.shotGap; tu.fireT = 0.1;
        fx.shots.push({ x: tu.x + 12 * tu.sc * E.gunScale, y: topY() - 3 * tu.sc * E.gunScale, tx: tg.x - 5, ty: tu.groundY - 16, t: 0, target: tg, rank: tu.rank, onShot: tu.onShot });
      }
      if (tu.shots >= Math.min(E.shots, tu.targets.length) && tu.t > tu.next + E.holdAfter) { tu.state = 'lower'; tu.t = 0; } }
    else if (tu.state === 'lower') { tu.anim = 'folded'; tu.h = E.mastHeight * (1 - ease(Math.min(1, tu.t / E.lowerTime))); if (tu.t > E.lowerTime + 0.05) { tu.state = 'pack'; tu.t = 0; } }
    else if (tu.state === 'pack') { tu.anim = 'crate'; if (tu.t > 0.15) { _eburst(fx, tu.x, tu.groundY - 3, ['#e0a640', '#ffffff'], 6, 0.5, 0.3); fx.turret = null; } }
  }
  for (const s of fx.shots) { s.t += dt; if (s.t >= E.shotTime) { s.dead = true; const R = ENGINEER_RANKS[s.rank];
    _eburst(fx, s.tx, s.ty + 2, R.colors, 10, 0.8, 0.3); if (R.glint) _eburst(fx, s.tx, s.ty + 2, [R.glint], 4, 0.6, 0.3); if (s.onShot) s.onShot(s.target); } }
  fx.shots = fx.shots.filter(s => !s.dead);
  for (const p of fx.parts) { p.vy += (p.g || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; } fx.parts = fx.parts.filter(p => p.life > 0);
  for (const s of fx.smoke) { s.y += s.vy * dt; s.r += 4 * dt; s.life -= dt; } fx.smoke = fx.smoke.filter(s => s.life > 0);
  for (const b of fx.booms) b.t += dt; fx.booms = fx.booms.filter(b => b.t < 0.35);
}

// The mast turret, drawn BEFORE the units so it stands behind him. img/A = the rank's turret sheet and atlas entry; sc = unit scale.
function engineerTurretDraw(ctx, ps, fx, img, A, sc) {
  const tu = fx.turret; if (!tu) return; const x = tu.x, gy = tu.groundY, h = tu.h, hs = sc * ENGINEER_FX.gunScale;
  const cr = A.anims.crate; ctx.drawImage(img, 0, cr.row * A.ch, A.cw, A.ch, (x - 9 * sc) * ps, (gy - 5 * sc) * ps, A.cw * sc * ps, A.ch * sc * ps);
  if (tu.anim === 'crate') return;
  const top = gy - 4 * sc - h, seg = h * 0.5;
  ctx.fillStyle = '#1a1020'; ctx.fillRect((x - 2 * sc) * ps, top * ps, 4 * sc * ps, (gy - 3 * sc - top) * ps);
  ctx.fillStyle = '#6a7488'; ctx.fillRect((x - 1.5 * sc) * ps, (top + seg) * ps, 3 * sc * ps, (gy - 3.5 * sc - top - seg) * ps);
  ctx.fillStyle = '#c8d0de'; ctx.fillRect((x - 1 * sc) * ps, top * ps, 2 * sc * ps, (seg + 1 * sc) * ps);
  ctx.fillStyle = '#e0a640'; for (let k = 1; k < 4; k++) ctx.fillRect((x - 1.5 * sc) * ps, (top + h * k / 4) * ps, 3 * sc * ps, 1 * sc * ps);
  const a = A.anims[tu.anim]; ctx.drawImage(img, Math.min(tu.frame, a.n - 1) * A.cw, a.row * A.ch, A.cw, A.ch, (x - 9 * hs) * ps, (top - 5 * hs) * ps, A.cw * hs * ps, A.ch * hs * ps);
}

// Bombs, fireballs, smoke, turret shots and sparks, drawn AFTER the units.
function engineerFxDrawOver(ctx, ps, fx) {
  for (const b of fx.bombs) { const x = b.cx, y = b.cy, rot = Math.floor(b.t * 16) % 2;
    _epx(ctx, ps, x - 2, y - 2, '#1a1020', 1, 5); _epx(ctx, ps, x - 1, y - 1, '#3a3a44', 1, 3); _epx(ctx, ps, x - 1, y - 1, '#6a6a78');
    _epx(ctx, ps, x, y - 3, '#8a5a14'); _epx(ctx, ps, x + (rot ? 1 : -1), y - 4, '#fff0a0'); _epx(ctx, ps, x + (rot ? 2 : 0), y - 5, '#ffb040'); }
  for (const s of fx.shots) { const R = ENGINEER_RANKS[s.rank], k = Math.min(1, s.t / ENGINEER_FX.shotTime), x = s.x + (s.tx - s.x) * k, y = s.y + (s.ty - s.y) * k;
    if (R.shot === 'lightning') { let px = s.x, py = s.y; const n = 7;
      for (let i = 1; i <= n; i++) { const q = i / n * k, nx = s.x + (s.tx - s.x) * q, ny = s.y + (s.ty - s.y) * q + (i < n ? (Math.random() - 0.5) * 6 : 0);
        const steps = Math.max(Math.abs(nx - px), Math.abs(ny - py)); for (let j = 0; j <= steps; j++) _epx(ctx, ps, px + (nx - px) * j / steps, py + (ny - py) * j / steps, j % 2 ? R.colors[2] : R.colors[1]);
        px = nx; py = ny; } }
    else { const lanes = R.shot === 'twin' ? [-1, 1] : [0];
      for (const ln of lanes) for (let i = 0; i < 6; i++) _epx(ctx, ps, x - i * 2, y + ln * 1.5, i < 2 ? R.colors[0] : R.colors[1], 1 - i / 6);
      if (R.glint) _epx(ctx, ps, x + 1, y, R.glint); } }
  for (const b of fx.booms) { const r = 4 + b.t * 40, al = 1 - b.t / 0.35, g = ctx.createRadialGradient(b.x * ps, b.y * ps, 0, b.x * ps, b.y * ps, r * ps);
    g.addColorStop(0, 'rgba(255,250,210,' + al + ')'); g.addColorStop(0.5, 'rgba(255,170,60,' + al * 0.9 + ')'); g.addColorStop(1, 'rgba(255,90,30,0)');
    ctx.fillStyle = g; ctx.fillRect((b.x - r) * ps, (b.y - r) * ps, 2 * r * ps, 2 * r * ps); }
  for (const s of fx.smoke) { const al = s.life / s.max * 0.7;
    for (let yy = -s.r; yy <= s.r; yy++) for (let xx = -s.r; xx <= s.r; xx++) if (xx * xx + yy * yy <= s.r * s.r && ((Math.round(xx) + Math.round(yy)) & 1) === 0) _epx(ctx, ps, s.x + xx, s.y + yy, yy < 0 ? '#8a8a96' : '#5a5a66', al); }
  for (const p of fx.parts) _epx(ctx, ps, p.x, p.y, p.col, p.life / p.max);
}

// Promotion effects at ranks 1-3. (x, y) = feet anchor in canvas px; sc = canvas px per sprite px (unit scale x rank size).
// Call with before=true behind the sprite and before=false in front.
function engineerPromoFx(ctx, x, y, sc, rank, t, before) {
  const R = ENGINEER_RANKS[rank]; if (!R.promo) return;
  const pix = (X, Y, col, a) => { ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = col; ctx.fillRect(Math.round(X / sc) * sc, Math.round(Y / sc) * sc, sc, sc); ctx.globalAlpha = 1; };
  if (R.promo === 'gear' && before) {           // a brass gear turning behind his head
    const cx = x - 2 * sc, cy = y - 17 * sc, rot = t * 1.2;
    for (let py = -8; py <= 8; py++) for (let px = -8; px <= 8; px++) {
      const d = Math.hypot(px, py), a = Math.atan2(py, px) + rot, tooth = ((a / 6.2832 * 8) % 1 + 1) % 1 < 0.5;
      let col = null;
      if (d >= 4.3 && d <= 5.8) col = d > 5.1 ? '#b07a1a' : '#f5d060';
      else if (d > 5.8 && d <= 7.4 && tooth) col = '#b07a1a';
      else if (d <= 1.6) col = '#f5d060';
      else if (d < 4.3) { const sp = ((a / 6.2832 * 4) % 1 + 1) % 1; if (sp < 0.09 || sp > 0.91) col = '#b07a1a'; }
      if (col) pix(cx + px * sc, cy + py * sc, col, 0.95);
    }
    return;
  }
  if (before) return;
  if (R.promo === 'steam') for (let k = 0; k < 3; k++) { const ph = (t * 0.6 + k * 0.33) % 1, px0 = x + (-7 - ph * 4 + k) * sc, py0 = y - (12 + ph * 16) * sc, s = 1 + Math.floor(ph * 2);
    for (let i = 0; i < s; i++) for (let j = 0; j < s; j++) pix(px0 + i * sc, py0 + j * sc, ph < 0.5 ? '#e8e8f0' : '#a8a8b8', (1 - ph) * 0.8); }
  if (R.promo === 'arcs' && Math.floor(t * 8) % 3 !== 0) { const seed = Math.floor(t * 8);
    for (let k = 0; k < 2; k++) { let ax = x + ((seed * 7 + k * 13) % 16 - 8) * sc, ay = y - ((seed * 5 + k * 11) % 16 + 2) * sc;
      for (let i = 0; i < 5; i++) { pix(ax, ay, i % 2 ? '#60c8ff' : '#e0f6ff'); ax += sc; ay += ((seed + i + k) % 3 - 1) * sc; } } }
  if (R.promo === 'gear') for (let k = 0; k < 3; k++) { const ph = (t * 0.5 + k * 0.33) % 1;
    pix(x + (-6 + k * 6 + Math.sin(t * 2 + k) * 2) * sc, y - (2 + ph * 18) * sc, k % 2 ? '#fff0a0' : '#ffd060', (1 - ph) * 0.9); }
}
