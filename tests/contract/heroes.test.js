// Hero roster contract tests against PRODUCTION functions: the Engineer, Summoner and Bard (tables, sheets per rank, recruit zones,
// abilities and talents), the fire archer sheets on the ranger with Rain of Fire unchanged in damage and bleed, the crusader sheet on
// the knight's rank 2, the one-time recruit grant on load, hidden shot projectiles with fixed flight times, and the effect bridge being
// switched off in the simulator (no effect script is loaded, so no effect can touch the RNG or timing).
// Run: node tests/contract/heroes.test.js   (exit code 1 on any failure)
'use strict';
const H=require('../sim/headless.js');
let pass=0,fail=0;const out=[];
function ok(c,m){if(c)pass++;else{fail++;out.push('FAIL '+m);}}
function near(a,b,eps,m){ok(Math.abs(a-b)<=eps,m+' (got '+a+', want '+b+')');}
const NEW=['engineer','summoner','bard'];
async function game(seed=1){const S=H.load({seed,startMs:1700000000000});await S.ready;const G=S.G;G.title=false;G.tut=null;G.screen='road';for(const def of S.HEROES.slice(0,4)){if(!G.roster.find(h=>h.id===def.id))S.addHero(def,30);}G.active=G.roster.slice(0,4);G.campfireDone=true;return S;}
function hero(S,cls,lvl=60){const G=S.G;const def=S.HEROES.find(d=>d.cls===cls);let h=G.roster.find(x=>x.id===def.id);if(!h)h=S.addHero(def,lvl);h.lvl=lvl;S.refreshStats(h);h.hp=h.maxhp;h.dead=false;h.status={};h.charge=100;h.x=60;h.dx=0;h.frame=0;h.done=false;if(!G.active.includes(h)){G.active=[h].concat(G.active.filter(x=>x!==h)).slice(0,4);}S.layout();return h;}
function foes(S,n,x0=200){const G=S.G;G.enemies=[];for(let i=0;i<n;i++)G.enemies.push({id:'orc',uid:'orc',name:'Orc '+i,enemy:true,hp:1e9,maxhp:1e9,atk:10,def:0,spd:9,lvl:5,range:'melee',status:{},gauge:40,dead:false,traits:[],flash:0,hop:0,x:x0+i*24,dx:0,yoff:0});G.mode='battle';G.action=null;G.projs=[];G.stats.dmgBy={basic:0,ability:0,tap:0,surge:0};return G.enemies;}
function land(S,maxT=10){const G=S.G;let t=0;while(G.projs.length&&t<maxT){S.updateProjs(1/60);t+=1/60;}return t;}
(async()=>{
  // ---- tables and sheets
  {const S=await game();const A=S.G.__atlas||null;const ATLAS=S.win.ASSETS?S.win.ASSETS.atlas:null;const atlas=ATLAS||JSON.parse(require('fs').readFileSync(require('path').join(__dirname,'..','..','build','assets.json'),'utf8')).atlas;
    for(const cls of NEW){const c=S.CLASSES[cls];ok(!!c&&c.range==='ranged'&&c.ab&&c.ab.id,'class '+cls+' exists as a ranged class with an ability');
      ok(Array.isArray(S.TITLES[cls])&&S.TITLES[cls].length===4,cls+' has four rank titles');ok(S.TALENTS[cls].length===3,cls+' has three talents');
      ok(S.TIERPAL[cls][0]===null&&S.TIERPAL[cls][1]===null&&S.TIERPAL[cls][2]===null&&JSON.stringify(S.TIERPAL[cls][3])==='{"size":1.08}',cls+' tier palette carries only the rank-3 size (the sheets carry the look)');
      ok(S.ICON[c.ab.icon]&&S.ICON[c.ab.icon].length===12&&S.ICON[c.ab.icon].every(r=>r.length===12),cls+' ability icon '+c.ab.icon+' is a 12x12 grid');
      ok(!!S.WEAPON_NOUN[c.weapon],cls+' weapon kind '+c.weapon+' is an existing item kind');
      for(let t=0;t<4;t++){const e=atlas[cls+t];ok(!!e&&e.cw===40&&e.ch===30&&e.ox===18&&e.oy===27,cls+t+' sheet is 40x30 anchored at 18,27');ok(!!e&&e.anims.cast&&e.anims.cast.n===8&&e.anims.attack.n===9&&e.anims.idle&&e.anims.walk&&e.anims.hurt&&e.anims.death,cls+t+' has idle, walk, attack 9, cast 8, hurt, death rows');}
      const def=S.HEROES.find(d=>d.cls===cls);ok(!!def,'a hero of class '+cls+' is on the roster list');}
    for(let t=0;t<4;t++){ok(!!atlas['turret'+t]&&atlas['turret'+t].anims.fire,'turret'+t+' sheet present');ok(!!atlas['familiar'+t]&&atlas['familiar'+t].anims.bite,'familiar'+t+' sheet present');ok(!!atlas['firearcher'+t]&&atlas['firearcher'+t].anims.cast&&atlas['firearcher'+t].cw===40,'firearcher'+t+' sheet present with a cast row');}
    ok(!!atlas.crusader&&atlas.crusader.cw===51&&atlas.crusader.ch===30&&atlas.crusader.ox===24&&atlas.crusader.oy===28&&atlas.crusader.anims.attack.n===7,'crusader sheet is the templar frame with headroom, 51x30 anchored at 24,28, attack 7');
    ok(S.ZONES[2].recruit==='osric'&&S.ZONES[4].recruit==='idris'&&S.ZONES[6].recruit==='perrin','recruits: Thornwood -> Osric, Emberwaste -> Idris, Ashen Approach -> Perrin');
    ok(S.ZONES[0].recruit==='vex'&&S.ZONES[1].recruit==='morrow'&&S.ZONES[3].recruit==='wren'&&S.ZONES[5].recruit==='bram','the original recruit zones are unchanged');
    // sprite key per rank
    const uid=(cls,tier)=>S.heroUid({cls,tier});
    ok(uid('knight',0)==='knight'&&uid('knight',1)==='templar'&&uid('knight',2)==='crusader'&&uid('knight',3)==='lancer','knight sheets: knight, templar, crusader, lancer');
    ok([0,1,2,3].every(t=>uid('ranger',t)==='firearcher'+t)&&uid('ranger',7)==='firearcher3','ranger uses the fire archer sheet of its tier (capped at 3)');
    for(const cls of NEW)ok([0,1,2,3].every(t=>uid(cls,t)===cls+t),cls+' uses '+cls+'0..3 by rank');
    ok(uid('cleric',3)==='cleric'&&uid('mage',2)==='mage'&&uid('rogue',1)==='rogue'&&uid('berserker',3)==='berserker','cleric, mage, rogue and berserker keep one sheet');
    ok(JSON.stringify(S.TIERPAL.ranger)==='[null,null,null,{"size":1.08}]','the ranger tier palette keeps only the rank-3 size: no recolour, leaves, weapon glow, hawk or trail over the fire archer');
    ok(S.TIERPAL.knight[2]&&S.TIERPAL.knight[2].metal&&S.TIERPAL.knight[2].metal[0]===240&&S.TIERPAL.knight[2].accent===45,'the knight rank-2 silver recolour is kept for the crusader');
    ok(S.CLASSES.ranger.ab.name==='Rain of Fire'&&S.CLASSES.ranger.ab.id==='rain','the ranger ability is named Rain of Fire and keeps its id');
    const e=S.mkHero(S.HEROES.find(d=>d.cls==='engineer'));ok(e.uid==='engineer0','a new engineer starts on the engineer0 sheet');
    ok(S.FX_ON===false,'the effect bridge is off in the simulator (no effect script is loaded)');S.fxStep(1/60);S.fxDrawUnder();S.fxDrawOver();ok(S.G.fxs===undefined,'effect hooks are no-ops without the scripts: no effect state is created');}

  // ---- Rain of Fire: damage and bleed exactly as before (1.1 x AB_BOOST x power per enemy; bleed 3 + floor(rank/2) turns)
  {const S=await game(2),G=S.G;const r=hero(S,'ranger',80);r.abLvl=5;const N=400;foes(S,N);const a=S.abilityAction(r,true);ok(a.anim==='cast'&&a.hit===4&&a.tgts.length===N,'Rain of Fire plays the cast row; hit frame 4; every enemy targeted');
    const hp0=G.enemies.map(e=>e.hp);S.applyAbility(a);const dmg=G.enemies.map((e,i)=>hp0[i]-e.hp);const mean=dmg.reduce((p,q)=>p+q,0)/N;const want=r.atk*1.1*S.AB_BOOST*S.abilityPower(r)*S.MANUAL_CAST_POWER;
    near(mean/want,1,0.03,'Rain of Fire mean damage per enemy = atk x 1.1 x AB_BOOST x power x 1.3 (tapped)');ok(G.enemies.every(e=>e.status.bleed===3+Math.floor(r.abLvl/2)),'every enemy bleeds 3 + floor(rank/2) = '+(3+Math.floor(r.abLvl/2))+' turns');
    ok(G.projs.length===0,'Rain of Fire deals its damage at the hit frame, not through projectiles');ok(G.stats.dmgBy.ability>0&&G.stats.dmgBy.basic===0,'counted as ability damage');}

  // ---- basic shots: hidden projectiles with fixed flight times; the ranger keeps 0.28 s (pierce 0.32 s); enemy arrows unchanged
  {const S=await game(3),G=S.G;const shot=(u,tgt)=>{G.projs=[];G.action={u,kind:'ranged',tgt,anim:'attack',fps:13,hit:4,hitDone:false,pt:0};u.frame=4;u.done=false;S.updateAction(1/60);return G.projs.slice();};
    for(const [cls,dur] of [['engineer',0.55],['summoner',0.26],['bard',0.4],['ranger',0.28]]){const h=hero(S,cls,60);const [t]=foes(S,2);const P=shot(h,t);ok(P.length===1&&P[0].hidden===true&&P[0].dur===dur&&P[0].tgt===t,cls+' basic shot: one hidden projectile, '+dur+' s flight');}
    const rg=hero(S,'ranger',100);rg.talents={pierce:true};let both=0;for(let k=0;k<40;k++){foes(S,2);const P=shot(rg,G.enemies[0]);if(P.length===2){both++;ok(P[1].dur===0.32&&P[1].mult===0.6&&P[1].hidden===true,'the pierce arrow keeps 0.32 s and 60% and is hidden too');}}
    ok(both>5&&both<35,'Piercing Shot still fires about half the time ('+both+'/40)');
    const en=hero(S,'engineer',100);en.talents={shrapnel:true};foes(S,3);const P=shot(en,G.enemies[0]);ok(P.length===2&&P[1].mult===0.4&&P[1].tgt===G.enemies[1]&&P[1].dur===0.55,'Shrapnel adds a 40% hit on the next enemy with the same flight time');
    foes(S,1);const arch={id:'skelarcher',uid:'skelarcher',name:'Archer',enemy:true,hp:100,maxhp:100,atk:5,def:0,spd:9,lvl:3,range:'ranged',status:{},gauge:0,dead:false,traits:[],flash:0,hop:0,x:220,dx:0,yoff:0};G.enemies.push(arch);const Pe=shot(arch,G.active[0]);ok(Pe.length===1&&!Pe[0].hidden&&Pe[0].dur===0.28,'an enemy arrow is drawn as before (not hidden, 0.28 s)');
    const bd=hero(S,'bard',100);bd.talents={dissonance:true};const [t1]=foes(S,1);t1.gauge=50;shot(bd,t1);land(S);ok(t1.gauge===30&&t1.hp<1e9,'Dissonance takes 20 off the target\'s attack gauge when the wave lands');}

  // ---- Deploy Turret: three shots (four with Overclock), repeating targets when fewer remain, landing one after another, retargeting the dead
  {const S=await game(4),G=S.G;const en=hero(S,'engineer',60);foes(S,5);let a=S.abilityAction(en,false);S.applyAbility(a);
    ok(G.projs.length===3&&new Set(G.projs.map(p=>p.tgt)).size===3&&G.projs.every(p=>p.hidden&&p.retarget&&p.srcKind==='ability'),'five enemies: three hidden shots at three different enemies');
    ok(G.projs.map(p=>+p.dur.toFixed(2)).join(',')===[0,1,2].map(k=>+(S.TURRET_FIRST+S.TURRET_GAP*k).toFixed(2)).join(','),'shots land at '+S.TURRET_FIRST+' s then every '+S.TURRET_GAP+' s');
    near(G.projs[0].mult,0.9*S.AB_BOOST*S.abilityPower(en)*S.AUTO_CAST_POWER,1e-9,'each shot is 90% x AB_BOOST x power x 0.75 (Auto-Cast)');
    const hp0=G.enemies.map(e=>e.hp);land(S);ok(G.enemies.filter((e,i)=>e.hp<hp0[i]).length===3&&G.stats.dmgBy.ability>0,'three enemies took ability damage when the shots landed');
    const [one]=foes(S,1);en.charge=100;a=S.abilityAction(en,false);S.applyAbility(a);ok(G.projs.length===3&&G.projs.every(p=>p.tgt===one),'one enemy: the turret still fires three shots, all at it');
    foes(S,2);en.charge=100;a=S.abilityAction(en,false);S.applyAbility(a);ok(G.projs.length===3&&G.projs[0].tgt===G.enemies[0]&&G.projs[1].tgt===G.enemies[1]&&G.projs[2].tgt===G.enemies[0],'two enemies: targets repeat in order');
    G.enemies[0].dead=true;G.enemies[0].hp=0;const h1=G.enemies[1].hp;land(S);ok(G.enemies[1].hp<h1&&G.enemies[0].hp===0,'a shot whose target died retargets a living enemy on landing');
    en.lvl=100;S.refreshStats(en);en.talents={overclock:true};foes(S,5);en.charge=100;a=S.abilityAction(en,false);S.applyAbility(a);ok(G.projs.length===4&&S.turretShots(en)===4,'Overclock: four shots');
    ok(/4 shots at [\d.]+% each/.test(S.abilityDesc(en)),'ability text names the shot count and percentage: '+S.abilityDesc(en));}

  // ---- Great Summon: every enemy in x order, damage as the charge passes; Searing Spirit burns
  {const S=await game(5),G=S.G;const sm=hero(S,'summoner',60);foes(S,4,300);G.enemies.reverse();const a=S.abilityAction(sm,true);ok(a.anim==='cast','Great Summon plays the cast row');S.applyAbility(a);
    ok(G.projs.length===4&&G.projs.every(p=>p.hidden&&p.spell&&p.srcKind==='ability'),'four hidden spell hits, one per enemy');
    const xs=G.projs.map(p=>p.tgt.x);ok(xs.every((x,i)=>i===0||x>=xs[i-1])&&G.projs.every((p,i)=>i===0||p.dur>=G.projs[i-1].dur),'hits are ordered left to right and land in that order');
    near(G.projs[0].mult,1.5*S.AB_BOOST*S.abilityPower(sm)*S.MANUAL_CAST_POWER,1e-9,'each hit is 150% x AB_BOOST x power x 1.3 (tapped)');
    const hp0=G.enemies.map(e=>e.hp);land(S);ok(G.enemies.every((e,i)=>e.hp<hp0[i])&&G.enemies.every(e=>!e.status.burn),'every enemy took damage; no burn without the talent');
    sm.lvl=100;S.refreshStats(sm);sm.talents={searing:true};foes(S,3);sm.charge=100;S.applyAbility(S.abilityAction(sm,false));land(S);ok(G.enemies.every(e=>e.status.burn===3),'Searing Spirit: every enemy burns for 3 turns');
    const q=hero(S,'summoner',100);q.talents={quickdraw:true};ok(S.tal(q,'quickdraw'),'Attuned is the summoner\'s quickdraw talent');}

  // ---- Battle Hymn: +20% attack and speed for 3 turns (5 with Encore), full effect under Auto-Cast, counted down on each hero's own turn
  {const S=await game(6),G=S.G;const bd=hero(S,'bard',60);const kn=G.active.find(h=>h.cls==='knight');foes(S,1);let a=S.abilityAction(bd,false);ok(a.pow<1&&a.anim==='cast','Auto-Cast power is below 1 and the cast row plays');S.applyAbility(a);
    ok(S.living(G.active).every(h=>h.status.hymn===3)&&G.projs.length===0,'every living hero carries hymn for 3 turns under Auto-Cast (no power scaling)');
    bd.charge=100;for(const h of G.active)h.status={};a=S.abilityAction(bd,true);S.applyAbility(a);ok(S.living(G.active).every(h=>h.status.hymn===3),'the tapped cast gives the same 3 turns');
    // attack multiplier
    const [e]=foes(S,1);const sample=(n)=>{let s=0;for(let i=0;i<n;i++){const h0=e.hp;S.dealDamage(kn,e,1);s+=h0-e.hp;}return s/n;};kn.status={};const base=sample(600);kn.status={hymn:3};const buffed=sample(600);near(buffed/base,S.HYMN_MULT,0.04,'hymn multiplies attack by '+S.HYMN_MULT);
    // speed: gauge fill
    G.mode='battle';G.action=null;G.projs=[];for(const h of G.active){h.status={};h.gauge=0;}e.gauge=0;S.battleStep(0.1);const g0=kn.gauge;ok(g0>0,'the gauge fills in a battle tick');for(const h of G.active){h.gauge=0;}kn.status={hymn:3};e.gauge=0;S.battleStep(0.1);const g1=kn.gauge;near(g1/g0,S.HYMN_MULT,1e-6,'hymn fills the attack gauge '+S.HYMN_MULT+'x faster');
    for(const h of G.active){h.status={};h.gauge=0;}e.gauge=0;e.status={hymn:3};S.battleStep(0.1);const eg1=e.gauge;e.status={};e.gauge=0;for(const h of G.active)h.gauge=0;S.battleStep(0.1);near(eg1,e.gauge,1e-9,'an enemy carrying the flag gets no speed');
    kn.status={hymn:3};G.action={u:kn,kind:'melee'};S.endAction();ok(kn.status.hymn===2,'the count drops by one at the end of the hero\'s own action');
    bd.lvl=100;S.refreshStats(bd);bd.talents={encore:true};ok(S.hymnDur(bd)===5,'Encore: 5 turns');bd.talents={crescendo:true};for(const h of G.active){h.hp=Math.floor(h.maxhp/2);}bd.charge=100;S.applyAbility(S.abilityAction(bd,false));ok(G.active.every(h=>h.hp>=Math.floor(h.maxhp/2)+Math.floor(h.maxhp*0.1)-1),'Crescendo heals the party 10%');
    ok(/\+20% for 3 turns/.test(S.abilityDesc(hero(S,'bard',60))),'ability text: '+S.abilityDesc(G.roster.find(h=>h.cls==='bard')));}

  // ---- knight: crusader sheet at rank 2, Shield Wall unchanged in effect
  {const S=await game(7),G=S.G;const kn=G.active.find(h=>h.cls==='knight');kn.tier=2;kn.uid=S.heroUid(kn);ok(kn.uid==='crusader','a rank-2 knight draws from the crusader sheet');
    foes(S,2);const a=S.abilityAction(kn,true);S.applyAbility(a);ok(kn.status.shield===S.shieldDur(kn)+1&&Math.abs(kn.status.shieldPct-S.shieldPct(kn))<1e-12,'Shield Wall duration and reduction are the game\'s own values');
    const kn2=Object.assign({},kn);ok(S.fxShieldCast(kn)===undefined&&S.fxShieldHit(kn)===undefined&&S.fxMeleeHit(kn,G.enemies[0])===undefined&&G.fxs===undefined,'shield and slash hooks are no-ops in the simulator');}

  // ---- saved games: a one-time grant for recruits whose zone is already behind the player
  {const S=await game(8),G=S.G;const has=id=>!!G.roster.find(h=>h.id===id);
    G.cleared=S.ZONES.map(()=>false);G.highestZoneEver=0;S.grantRecruits();ok(!has('osric')&&!has('idris')&&!has('perrin'),'nothing cleared: no grant');
    G.cleared[2]=true;S.grantRecruits();ok(has('osric')&&!has('idris'),'Thornwood cleared: Osric joins');const o=G.roster.find(h=>h.id==='osric');ok(o.lvl===S.ZONES[2].lv&&o.uid==='engineer0'&&/Osric the Engineer joins/.test(G.pending||''),'he joins at the zone level on the engineer0 sheet with the join message');
    G.cleared=S.ZONES.map(()=>false);G.highestZoneEver=5;S.grantRecruits();ok(has('idris')&&!has('perrin'),'a Shattered save that once passed Emberwaste gets Idris, not Perrin');
    G.cleared[6]=true;S.grantRecruits();S.grantRecruits();ok(has('perrin')&&G.roster.filter(h=>h.id==='perrin').length===1,'Perrin joins once, never twice');
    // through a real save and load
    G.roster.find(h=>h.id==='perrin').lvl=77;const raw=S.serialize();S.storeSet(raw);const d=JSON.parse(raw);d.roster=d.roster.filter(r=>r.id!=='idris');S.storeSet(JSON.stringify(d));ok(S.loadGame(),'the save loads');ok(has('idris')&&has('perrin')&&G.roster.find(h=>h.id==='perrin').lvl===77&&G.roster.find(h=>h.id==='perrin').uid==='bard0','the missing recruit is granted on load; saved heroes keep their level and sheet');
    ok(G.active.length<=S.partyMax(),'the party never exceeds its cap');}

  console.log(out.join('\n'));console.log((fail?'FAIL':'PASS')+'  '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
