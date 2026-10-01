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
      const wantOx={engineer:21,bard:21,summoner:20}[cls];for(let t=0;t<4;t++){const e=atlas[cls+t];ok(!!e&&e.cw===40&&e.ch===30&&e.ox===wantOx&&e.oy===27&&e.fxox===18,cls+t+' sheet is 40x30, feet at 27, drawn about its body (anchor '+wantOx+', effects on the bundle anchor 18)');ok(!!e&&e.anims.cast&&e.anims.cast.n===8&&e.anims.attack.n===9&&e.anims.idle&&e.anims.walk&&e.anims.hurt&&e.anims.death,cls+t+' has idle, walk, attack 9, cast 8, hurt, death rows');}
      const def=S.HEROES.find(d=>d.cls===cls);ok(!!def,'a hero of class '+cls+' is on the roster list');}
    for(let t=0;t<4;t++){ok(!!atlas['turret'+t]&&atlas['turret'+t].anims.fire,'turret'+t+' sheet present');ok(!!atlas['familiar'+t]&&atlas['familiar'+t].anims.bite,'familiar'+t+' sheet present');ok(!!atlas['firearcher'+t]&&atlas['firearcher'+t].anims.cast&&atlas['firearcher'+t].cw===40,'firearcher'+t+' sheet present with a cast row');}
    ok(!!atlas.crusader&&atlas.crusader.cw===51&&atlas.crusader.ch===30&&atlas.crusader.ox===22&&atlas.crusader.fxox===24&&atlas.crusader.oy===28&&atlas.crusader.anims.attack.n===7,'crusader sheet is the templar frame with headroom, 51x30, feet at 28, drawn about its body (anchor 22, effects on the bundle anchor 24), attack 7');
    ok(S.ZONES[2].recruit==='fitz'&&S.ZONES[4].recruit==='kit'&&S.ZONES[6].recruit==='lark','recruits: Thornwood -> Fitz, Emberwaste -> Kit, Ashen Approach -> Lark');
    ok(S.ZONES[0].recruit==='vex'&&S.ZONES[1].recruit==='morrow'&&S.ZONES[3].recruit==='ash'&&S.ZONES[5].recruit==='bram','the original recruit zones are unchanged');
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

  // ---- Rain of Fire: three volleys at least, every enemy at least once, the rest spread in turn; each volley lands with its arrow; the bleed once per enemy per cast
  {const S=await game(2),G=S.G;const r=hero(S,'ranger',80);r.abLvl=5;const per=r.atk*1.1*S.AB_BOOST*S.abilityPower(r)*S.MANUAL_CAST_POWER,bleed=3+Math.floor(r.abLvl/2);
    ok(S.RAIN_VOLLEYS===3&&S.rainOrder(['a']).join()==='a,a,a'&&S.rainOrder(['a','b']).join()==='a,b,a'&&S.rainOrder(['a','b','c']).join()==='a,b,c'&&S.rainOrder(['a','b','c','d','e']).join()==='a,b,c,d,e','the volley order: one enemy thrice, two enemies two and one, three or more once each');
    const N=400;foes(S,N);const a=S.abilityAction(r,true);ok(a.anim==='cast'&&a.hit===4&&a.tgts.length===N,'Rain of Fire plays the cast row; hit frame 4; every enemy targeted');
    let hp0=G.enemies.map(e=>e.hp);S.applyAbility(a);ok(G.projs.length===N&&G.enemies.every((e,i)=>e.hp===hp0[i])&&G.projs.every(p=>p.hidden&&p.retarget&&p.srcKind==='ability'),'the cast itself deals nothing: one hidden volley per enemy, waiting for its arrow');
    ok(G.projs[0].dur===S.RAIN_FIRST&&Math.abs(G.projs[1].dur-(S.RAIN_FIRST+S.RAIN_GAP))<1e-9,'volleys land '+S.RAIN_FIRST+' s after the hit frame and then every '+S.RAIN_GAP+' s');
    land(S,90);const dmg=G.enemies.map((e,i)=>hp0[i]-e.hp);const mean=dmg.reduce((p,q)=>p+q,0)/N;
    near(mean/per,1,0.03,'with many enemies each takes one hit of atk x 1.1 x AB_BOOST x power x 1.3 (tapped)');ok(dmg.every(d=>d>=per*0.84&&d<=per*1.16),'no enemy of a large pack is hit twice');ok(G.enemies.every(e=>e.status.bleed===bleed),'every enemy bleeds '+bleed+' turns once its arrow lands');
    ok(G.stats.dmgBy.ability>0&&G.stats.dmgBy.basic===0,'counted as ability damage');
    const [one]=foes(S,1);r.charge=100;hp0=one.hp;G.floats.length=0;S.applyAbility(S.abilityAction(r,true));ok(G.projs.length===3&&G.projs.every(p=>p.tgt===one)&&G.projs[0].bleed===bleed&&G.projs[1].bleed===0&&G.projs[2].bleed===0,'a lone enemy: three volleys, only the first carries the bleed');
    S.updateProjs(S.RAIN_FIRST+0.01);ok(hp0-one.hp>=per*0.84&&hp0-one.hp<=per*1.16&&one.status.bleed===bleed&&G.projs.length===2,'the first arrow lands: one hit, the bleed set, two volleys still in the air');
    land(S);const d1=hp0-one.hp;ok(d1>=per*2.5&&d1<=per*3.5,'after all three: three volleys\' worth ('+(d1/per).toFixed(2)+' hits)');ok(one.status.bleed===bleed,'and the bleed is still '+bleed+', not extended');
    {const fl=G.floats.filter(f=>/^\d/.test(String(f.text)));ok(fl.length===3&&fl[0].y-fl[1].y===11&&fl[1].y-fl[2].y===11,'three damage numbers, each repeat 11 px above the last');}
    const [p,q]=foes(S,2);r.charge=100;const hp=[p.hp,q.hp];S.applyAbility(S.abilityAction(r,true));ok(G.projs.map(x=>x.tgt===p?'p':'q').join()==='p,q,p','two enemies: volleys go first, second, first');land(S);const dp=hp[0]-p.hp,dq=hp[1]-q.hp;ok(dp>=per*1.65&&dp<=per*2.35&&dq>=per*0.84&&dq<=per*1.16,'the first takes two volleys, the second one ('+(dp/per).toFixed(2)+' and '+(dq/per).toFixed(2)+')');ok(p.status.bleed===bleed&&q.status.bleed===bleed,'both bleed once');
    const [x,y]=foes(S,2);x.hp=x.maxhp=1;r.charge=100;const hy=y.hp;S.applyAbility(S.abilityAction(r,true));land(S);ok(x.dead&&hy-y.hp>=per*1.65&&hy-y.hp<=per*2.35,'a volley whose enemy already fell goes to the next living enemy ('+((hy-y.hp)/per).toFixed(2)+' hits on the survivor)');
    ok(/3 volleys of [\d.]+% spread across the enemies, each hit at least once; bleeds them 5 turns/.test(S.abilityDesc(r)),'ability text: '+S.abilityDesc(r));
    {const [e]=foes(S,1);const kn=G.active.find(h=>h.cls==='knight');G.floats.length=0;S.dealDamage(kn,e,1);S.dealDamage(kn,e,1);const f=G.floats.filter(x=>/^\d/.test(String(x.text)));ok(f.length===2&&f[0].y===f[1].y,'ordinary hits are unchanged: no stacking without the option');}}

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
    ok(bd.status.hymn===4&&S.living(G.active).filter(h=>h!==bd).every(h=>h.status.hymn===3)&&G.projs.length===0,'allies carry 3 turns and the caster 4 (his own action end takes one) under Auto-Cast (no power scaling)');
    bd.charge=100;for(const h of G.active)h.status={};a=S.abilityAction(bd,true);S.applyAbility(a);ok(bd.status.hymn===4&&S.living(G.active).filter(h=>h!==bd).every(h=>h.status.hymn===3),'the tapped cast gives the same turns');
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

  // ---- saved games: no grant on load (owner 2026-09-29); recruits join where production recruits them, at their zone's boss
  {const S=await game(8),G=S.G;const has=id=>!!G.roster.find(h=>h.id===id);ok(S.grantRecruits===undefined,'there is no grant function');
    G.cleared=S.ZONES.map((z,i)=>i<8);G.highestZoneEver=8;const raw=S.serialize();S.storeSet(raw);ok(S.loadGame(),'a save far past the recruit zones loads');
    ok(G.roster.length===4&&!has('fitz')&&!has('kit')&&!has('lark')&&!has('ash')&&!has('bram'),'loading grants nobody: the roster is the saved one ('+G.roster.map(h=>h.id).join(',')+')');ok(!G.pending,'and no join message is queued');
    const src=require('fs').readFileSync(require('path').join(__dirname,'..','..','source','game.js'),'utf8');ok((src.match(/addHero\(/g)||[]).length===4&&/const rdef=HEROES\.find\(d=>d\.id===Z\.recruit\);if\(rdef&&!G\.roster\.find\(h=>h\.id===rdef\.id\)\)\{const h=addHero\(rdef,Math\.max\(1,Z\.lv\)\)/.test(src),'heroes are added in three places only (plus the definition): the start, the campfire and a zone boss with a recruit');}

  // ---- Battle Hymn through a complete cast: the caster ends on the same count as everyone else
  {const S=await game(9),G=S.G;const bd=hero(S,'bard',60);foes(S,2);for(const e of G.enemies)e.gauge=0;for(const h of G.active){h.gauge=0;h.charge=0;h.status={};}bd.gauge=100;bd.charge=100;G.autoCast=true;G.autoUntil=S.clock.get()+3600e3;let seen=false,n=0;while(n<3000&&!(seen&&!G.action)){S.setRT(S.getRT()+1/60);S.clock.frame();S.update(1/60,true);if(G.action&&G.action.u===bd&&G.action.kind==='ability')seen=true;n++;}
    ok(seen&&!G.action,'the bard cast Battle Hymn and the action completed');ok(bd.status.hymn===3&&S.living(G.active).filter(h=>h!==bd).every(h=>h.status.hymn===3),'after the cast the bard and every ally all carry 3 turns (bard '+bd.status.hymn+', allies '+G.active.filter(h=>h!==bd).map(h=>h.status.hymn).join('/')+')');
    bd.lvl=100;S.refreshStats(bd);bd.talents={encore:true};for(const h of G.active){h.gauge=0;h.charge=0;h.status={};}bd.gauge=100;bd.charge=100;seen=false;n=0;while(n<3000&&!(seen&&!G.action)){S.setRT(S.getRT()+1/60);S.clock.frame();S.update(1/60,true);if(G.action&&G.action.u===bd&&G.action.kind==='ability')seen=true;n++;}ok(bd.status.hymn===5&&G.active.filter(h=>h!==bd).every(h=>h.status.hymn===5),'Encore: 5 turns for the bard and every ally after the cast');}
  // ---- quests: affinities and class events (existing multipliers, same weighting, no dust)
  {const S=await game(10),G=S.G;const Q=S.QUEST_CLASS;ok(Q.hunt.includes('engineer')&&Q.scout.includes('engineer')&&!Q.forage.includes('engineer')&&!Q.pilgrim.includes('engineer'),'Engineer favours Hunt and Scout');ok(Q.forage.includes('summoner')&&Q.pilgrim.includes('summoner')&&!Q.hunt.includes('summoner'),'Summoner favours Forage and Pilgrimage');ok(Q.scout.includes('bard')&&Q.pilgrim.includes('bard')&&!Q.hunt.includes('bard')&&!Q.forage.includes('bard'),'Bard favours Scout and Pilgrimage');
    ok(Q.forage.join()==='cleric,mage,summoner'&&Q.hunt.join()==='berserker,ranger,engineer'&&Q.scout.join()==='ranger,rogue,engineer,bard'&&Q.pilgrim.join()==='knight,cleric,summoner,bard','the original affinities are kept');
    const qs=S.QUESTS;for(const [cls,fav] of [['engineer',['hunt','scout']],['summoner',['forage','pilgrim']],['bard',['scout','pilgrim']]]){const h=hero(S,cls,40);h.tier=0;ok(qs.every(q=>Math.abs(S.questBonus(h,q)-(fav.includes(q.id)?1.3:1))<1e-12),cls+' quest bonus 1.3 on favoured quests, 1 elsewhere');}
    for(const [cls,word,res] of [['engineer','Salvaged','ore'],['summoner','Communed','xp'],['bard','performance','gold']]){const h=hero(S,cls,40);G.castle.vil.total=0;G.delveKeys=S.keyMax();let hits=0,other=0;const d0=G.dust;for(let k=0;k<300;k++){const g0=G.gold,o0=G.ore,x0=h.xp;const m=S.questEvent(h);if(m.includes(word)){hits++;if(res==='ore')ok(G.ore>o0&&G.gold===g0&&h.xp===x0,cls+' event pays ore only');if(res==='gold')ok(G.gold>g0&&G.ore===o0&&h.xp===x0,cls+' event pays gold only');if(res==='xp')ok(h.xp>x0&&G.gold===g0&&G.ore===o0,cls+' event pays XP only');}else other++;h.hp=h.maxhp;}
      ok(G.dust===d0,cls+' quest events never add dust');ok(hits>60&&hits<200,cls+' class event weighted like the originals: two of five draws ('+hits+'/300)');}
    const eng=hero(S,'engineer',40),L=eng.lvl;let o=null;for(let k=0;k<200&&o==null;k++){const o0=G.ore;const m=S.questEvent(eng);if(m.includes('Salvaged'))o=G.ore-o0;eng.hp=eng.maxhp;}ok(o===Math.round((8+L)*1.5*S.oreMult()),'engineer ore = round((8 + level) x 1.5 x oreMult) (got '+o+')');
    ok(S.HEROES.every(d=>d.zone===undefined),'hero definitions carry no recruit zone (the zone table is the one source)');}
  // ---- regular attacks never shake the screen; abilities may
  {const src=require('fs').readFileSync(require('path').join(__dirname,'..','..','source','game.js'),'utf8');const cut=(a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i+1);return i>=0&&j>i?src.slice(i,j):null;};
    const basic=cut('function fxBasicShot(u,tgt){','function fxSettle(F)'),melee=cut('function fxMeleeHit(u,tgt){','function fxBasicShot('),touch=cut('function fxTouch(t,v){','function fxStep('),abil=cut('function fxAbilityFrame(a){','const AUTO_CAST_POWER');
    ok(!!basic&&!/shake/.test(basic)&&!/fxHit\(/.test(basic)&&(basic.match(/fxTouch\(/g)||[]).length===4,'the four ranged basic attacks go through fxTouch and never mention shake');
    ok(!!basic&&/fireShoot\([^;]*;F\.fire\.flash=0;/.test(basic),'the fire archer\'s regular shot clears the screen flash the effect raises');ok(!!abil&&/fireRain\([^;]*;[^}]*F\.fire\.flash=0;/.test(abil),'Rain of Fire clears the screen flash too; only its shake remains');
    ok(!!melee&&!/G\.shake|shake:/.test(melee)&&/fxTouch\(tgt,v\)/.test(melee),'the knight\'s slash does not shake the screen');
    ok(!!touch&&/fxHit\(t,\{flash:v\.flash,knockback:v\.knockback\}\)/.test(touch),'fxTouch passes the flash and the nudge only');
    ok(!!abil&&/G\.shake=/.test(abil)&&/fxHit\(/.test(abil),'abilities keep their shake');}
  // ---- the roster as named by the owner on 2026-09-29, and saves written under the old names
  {const S=await game(11),G=S.G;const want=[['knight','Hale','hale'],['cleric','Sera','sera'],['rogue','Vex','vex'],['mage','Morrow','morrow'],['ranger','Ash','ash'],['berserker','Bram','bram'],['bard','Lark','lark'],['summoner','Kit','kit'],['engineer','Fitz','fitz']];
    ok(S.HEROES.length===9&&want.every(([cls,name,id])=>{const d=S.HEROES.find(x=>x.cls===cls);return d&&d.name===name&&d.id===id;}),'nine heroes with the names and ids of the owner\'s table');
    ok(S.HEROES.every(d=>d.id===d.name.toLowerCase()),'every id is the lower-case name (the validators rely on it)');
    ok(S.ZONES.map(z=>z.recruit||'').join()==='vex,morrow,fitz,ash,kit,bram,lark,,,','recruit order by zone: Vex, Morrow, Fitz, Ash, Kit, Bram, Lark');
    const old={aldric:'hale',wren:'ash',osric:'fitz',idris:'kit',perrin:'lark'};ok(JSON.stringify(S.HERO_RENAME)===JSON.stringify(old),'the rename table covers the five renamed heroes');
    for(const id of ['ash','fitz','kit','lark'])if(!G.roster.find(h=>h.id===id))S.addHero(S.HEROES.find(d=>d.id===id),33);G.roster.find(h=>h.id==='ash').lvl=61;G.roster.find(h=>h.id==='hale').tier=2;S.partySetOrder(['lark','hale','ash','sera']);
    const kit=G.roster.find(h=>h.id==='kit'),fitz=G.roster.find(h=>h.id==='fitz');G.quests.push({hero:kit,q:S.QUESTS[1],end:S.clock.get()+1e6});G.castle.garrison=[fitz.id];
    const d=JSON.parse(S.serialize());const back={hale:'aldric',ash:'wren',fitz:'osric',kit:'idris',lark:'perrin'},b=id=>back[id]||id;for(const r of d.roster)r.id=b(r.id);d.active=d.active.map(b);for(const q of d.quests)q.hero=b(q.hero);d.castle.garrison=d.castle.garrison.map(b);
    ok(d.roster.some(r=>r.id==='aldric')&&d.active.join()==='perrin,aldric,wren,sera'&&d.quests[0].hero==='idris'&&d.castle.garrison[0]==='osric','a save as it was written before the rename');
    S.storeSet(JSON.stringify(d));ok(S.loadGame(),'the old save loads');
    ok(G.roster.length===8&&G.roster.every(h=>S.HEROES.find(x=>x.id===h.id&&x.name===h.name))&&!G.roster.some(h=>back[h.id]&&false),'all eight saved heroes are back under their new names');
    ok(G.active.map(h=>h.id).join()==='lark,hale,ash,sera','the party and its order are kept');ok(G.roster.find(h=>h.id==='ash').lvl===61&&G.roster.find(h=>h.id==='hale').tier===2&&G.roster.find(h=>h.id==='hale').uid==='crusader','levels, ranks and sheets are kept');
    ok(G.quests.length===1&&G.quests[0].hero.id==='kit'&&JSON.stringify(G.castle.garrison)==='["fitz"]','the quest and the garrison post follow the renamed heroes');
    const d2=JSON.parse(S.serialize());ok(!JSON.stringify([d2.roster.map(r=>r.id),d2.active,d2.quests.map(q=>q.hero),d2.castle.garrison]).match(/aldric|wren|osric|idris|perrin/),'the next save carries only the new ids');}
  // ---- no old name is left anywhere a player can read it
  {const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..','..');const OLD=/\b(aldric|wren|osric|idris|perrin)\b/i;
    const gsrc=fs.readFileSync(path.join(root,'source','game.js'),'utf8');const lines=gsrc.split('\n').filter(l=>OLD.test(l));ok(lines.length===1&&/^const HERO_RENAME=/.test(lines[0]),'source/game.js mentions an old name on one line only, the save rename table ('+lines.length+' lines)');
    for(const f of ['source/shell.html','source/fx/bard.js','source/fx/engineer.js','source/fx/firearcher.js','source/fx/knight.js','source/fx/summoner.js'])ok(!OLD.test(fs.readFileSync(path.join(root,f),'utf8')),f+' carries no old name');
    const aj=JSON.parse(fs.readFileSync(path.join(root,'build','assets.json'),'utf8'));const strip=o=>JSON.stringify(o,(k,v)=>typeof v==='string'&&v.length>400?'':v);ok(!OLD.test(strip(aj)),'build/assets.json carries no old name outside image and sound data');
    const html=fs.readFileSync(path.join(root,'index.html'),'utf8').split('\n').filter(l=>l.length<4000&&OLD.test(l)&&!/^const HERO_RENAME=/.test(l));ok(html.length===0,'the built page has no old name in any text line besides the save rename table ('+html.length+')');
    const S=await game(12);const texts=[];for(const h of S.HEROES){texts.push(h.name);}for(const c of Object.values(S.CLASSES)){texts.push(c.name,c.ab.name,c.ab.desc);}for(const list of Object.values(S.TALENTS))for(const x of list)texts.push(x.name,x.desc);for(const list of Object.values(S.TITLES))texts.push(...list);for(const q of S.QUESTS)texts.push(q.name,q.desc);for(const z of S.ZONES)texts.push(z.name);
    ok(texts.length>100&&!texts.some(x=>OLD.test(String(x))),'hero, class, ability, talent, title, quest and zone texts carry no old name ('+texts.length+' strings)');}
  // ---- anchors on the body: every sheet's drawing anchor sits on its torso, and the effects keep the anchor they were written against
  {const S=await game(13);const atlas=JSON.parse(require('fs').readFileSync(require('path').join(__dirname,'..','..','build','assets.json'),'utf8')).atlas;
    const want={engineer0:[21,18],engineer1:[21,18],engineer2:[21,18],engineer3:[21,18],bard0:[21,18],bard1:[21,18],bard2:[21,18],bard3:[21,18],summoner0:[20,18],summoner1:[20,18],summoner2:[20,18],summoner3:[20,18],firearcher0:[20,18],firearcher1:[20,18],firearcher2:[20,18],firearcher3:[20,18],knight:[23,24],templar:[22,24],crusader:[22,24],lancer:[28,27]};
    ok(Object.entries(want).every(([k,[ox,fxox]])=>atlas[k]&&atlas[k].ox===ox&&atlas[k].fxox===fxox),'the moved anchors and their effect anchors are recorded in the atlas (measured torso centres: the body now sits 0.5 to 1.5 px left of the anchor, like the cleric, mage, rogue and berserker)');
    ok(['cleric','rogue','mage','berserker','slime','orc'].every(k=>atlas[k]&&atlas[k].fxox===undefined),'sheets that were not moved carry no effect anchor');
    const G=S.G;const eng=S.addHero(S.HEROES.find(d=>d.cls==='engineer'),20),kn=G.roster.find(h=>h.cls==='knight');ok(S.fxShift(eng)===-3&&S.fxShift(kn)===1&&S.fxShift(G.roster.find(h=>h.cls==='cleric'))===0,'the effect shift is the difference between the two anchors: engineer -3, knight +1, cleric 0');
    const src=require('fs').readFileSync(require('path').join(__dirname,'..','..','source','game.js'),'utf8');ok(!/headDx|LIST_DX/.test(src),'no per-screen nudge remains');
    for(const f of ['fxBasicShot','fxAbilityFrame','fxShieldCast','fxPromo'])ok(new RegExp('function '+f+'\\([^\\n]*fxShift\\(').test(src),f+' shifts the hero anchor for the effect scripts');}
  // ---- one hero per id: the campfire never adds Sera twice, and a save that already has two copies keeps the stronger one
  {const S=await game(14),G=S.G;const sera=G.roster.find(h=>h.id==='sera');ok(!!sera,'Sera is on the roster');G.campfireDone=false;G.wins=5;G.mode='walk';
    const src=require('fs').readFileSync(require('path').join(__dirname,'..','..','source','game.js'),'utf8');ok(/if\(!G\.campfireDone&&G\.wins>=2\)\{G\.campfireDone=true;if\(!G\.roster\.find\(x=>x\.id===HEROES\[1\]\.id\)\)\{const h=addHero/.test(src),'the campfire recruit checks the roster first');
    const dup=S.mkHero(S.HEROES[1]);dup.lvl=3;G.roster.push(dup);const strong=G.roster.find(h=>h.id==='sera');strong.lvl=40;ok(G.roster.filter(h=>h.id==='sera').length===2,'two Seras on the roster');
    const raw=S.serialize();ok(JSON.parse(raw).roster.filter(r=>r.id==='sera').length===2,'the save carries both');S.storeSet(raw);ok(S.loadGame(),'it loads');
    const seras=G.roster.filter(h=>h.id==='sera');ok(seras.length===1&&seras[0].lvl===40&&G.campfireDone===true,'after the load one Sera remains, the Lv 40 one, and the campfire is marked done');ok(new Set(G.active.map(h=>h.id)).size===G.active.length,'the party holds no duplicate');
    ok(new Set(G.roster.map(h=>h.id)).size===G.roster.length,'every id is unique');}
  // ---- Shatter: ranks go back to 0 with the sprite to match, and a rank reached before costs no dust the second time
  {const S=await game(15),G=S.G;const kn=G.roster.find(h=>h.cls==='knight');kn.lvl=60;kn.tier=2;kn.tierMax=2;kn.uid=S.heroUid(kn);ok(kn.uid==='crusader','a rank 2 knight wears the crusader sheet');
    G.cleared[3]=true;S.doReforge();ok(kn.tier===0&&kn.uid==='knight'&&kn.tierMax===2,'after the Shatter the rank is 0, the sheet is the knight again, and the best rank is remembered');
    const q=S.promoteReq(kn);ok(q.dust===0&&q.gold===5000&&q.lvl===30,'the first promotion costs gold only on the way back up: '+q.gold+' gold, '+q.dust+' dust');
    kn.tier=2;ok(S.promoteReq(kn).dust===15,'a rank never reached before still costs dust');}
  console.log(out.join('\n'));console.log((fail?'FAIL':'PASS')+'  '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
