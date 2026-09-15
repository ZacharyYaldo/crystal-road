// Training dummy (Vael yard drill) contract tests against PRODUCTION functions: the drill runs on a swapped battle context while the road
// state is untouched; it spends and earns nothing; manual and Auto-Cast behave as on the road; accounting adds up; the board persists.
// Run: node tests/contract/drill.test.js   (exit code 1 on any failure)
'use strict';
const H=require('../sim/headless.js');
let pass=0,fail=0;const out=[];
function ok(c,m){if(c)pass++;else{fail++;out.push('FAIL '+m);}}
function near(a,b,eps,m){ok(Math.abs(a-b)<=eps,m+' (got '+a+', want '+b+')');}
async function game(seed=1){const S=H.load({seed,startMs:1700000000000});await S.ready;const G=S.G;G.title=false;G.tut=null;G.mult='max';G.screen='vael';for(const def of S.HEROES.slice(0,4)){if(!G.roster.find(h=>h.id===def.id))S.addHero(def,30);}G.active=G.roster.slice(0,4);G.campfireDone=true;for(const h of G.roster){h.lvl=30;S.refreshStats(h);h.hp=h.maxhp;h.charge=0;}G.mode='walk';G.enc=1e9;G.enemies=[];return S;}
const DT=1/60;
function runDrill(S,hero,auto,tapEvery,castWhenReady){const G=S.G;S.startDrill(hero,auto);let frames=0,taps=0,casts=0;while(G.drill.running){S.clock.frame();S.setRT(S.getRT()+DT);S.update(DT,true);S.drillTick(DT);frames++;
  if(tapEvery&&frames%tapEvery===0){S.withDrill(()=>S.tapEnemy(G.enemies[0]));taps++;}
  if(castWhenReady){const h=G.drill.hero;if(h.charge>=100&&!h.tapCast){S.withDrill(()=>{if(S.tapCastHero(h))casts++;});}}}
  return{frames,taps,casts};}
const roadSnap=G=>JSON.stringify({gold:G.gold,ore:G.ore,dust:G.dust,mode:G.mode,enemies:G.enemies.length,action:!!G.action,taps:G.stats.taps,dmgBy:G.stats.dmgBy||null,attn:G.attnUntil||0,xp:G.roster.map(h=>[h.lvl,h.xp,h.hp,h.charge])});
const heroSnap=h=>{const c=Object.assign({},h);for(const k of ['x','dx','tx','frame','ftime','anim','loop','fps','done','hop'])delete c[k];return JSON.stringify(c);}; /* the road hero keeps walking during a drill: position and animation may move, nothing else may */
(async()=>{
  // ---- a manual drill with taps and tapped casts: accounting, duration, isolation, no side effects
  {const S=await game(),G=S.G;const hero=G.roster.find(h=>h.cls==='mage')||G.roster[0];const before=roadSnap(G),heroBefore=heroSnap(hero);
    const r=runDrill(S,hero,false,30,true);const d=G.drill,st=d.stats;
    ok(!d.running&&d.t>=S.DRILL_SEC&&d.t<S.DRILL_SEC+DT+1e-9,'the drill lasts exactly thirty real seconds ('+d.t.toFixed(3)+' s, '+r.frames+' frames)');
    ok(st.basic>0,'basic attacks landed ('+st.basic+')');ok(st.tap>0&&st.taps===r.taps,'taps counted: '+st.taps+' recorded, '+r.taps+' made');ok(st.ability>0&&r.casts>0,'tapped casts dealt ability damage ('+st.ability+' from '+r.casts+' casts)');
    ok(st.total===st.basic+st.ability+st.tap,'total is the sum of the three sources');near(st.dps,st.total/S.DRILL_SEC,1e-9,'DPS is total over thirty seconds');near(st.tapRate,st.taps/S.DRILL_SEC,1e-9,'tap rate is taps over thirty seconds');ok(st.hits>=st.crits&&st.crit<=st.total,'crit accounting within bounds ('+st.crits+' of '+st.hits+' hits, '+st.crit+' crit damage)');
    ok(roadSnap(G)===before,'road state untouched (gold, ore, dust, mode, enemies, stats, attention, heroes)');ok(heroSnap(hero)===heroBefore,'the drilled hero object is untouched (level, XP, HP, charge, gear, talents)');
    ok(G.mode==='walk'&&G.enemies.length===0&&!G.drillOn,'context restored after the drill');
    ok(G.drillBoard.length===1&&G.drillBoard[0].hero===hero.name&&G.drillBoard[0].dmg===st.total,'board holds the run');ok(G.sheet&&G.sheet.kind==='drill','results sheet opened');ok(S.serialize().includes('"drillBoard"'),'the board is saved');
    const dummy=d.g.enemies[0];ok(dummy.maxhp-dummy.hp===st.total,'the dummy took exactly the recorded total');}
  // ---- Auto-Cast on: abilities fire on their own; Auto-Cast off with no taps: never
  {const S=await game(),G=S.G;const hero=G.roster.find(h=>h.cls==='mage')||G.roster[0];G.autoCast=true;G.autoUntil=S.clock.get()+4*3600*1000;
    runDrill(S,hero,true,0,false);const a=G.drill.stats;ok(a.ability>0&&a.tap===0,'Auto-Cast on: ability damage without any tap ('+a.ability+')');
    runDrill(S,hero,false,0,false);const b=G.drill.stats;ok(b.ability===0&&b.basic>0,'Auto-Cast off and no taps: basic attacks only');
    ok(G.drillBoard.length===2&&G.drillBoard[0].dmg>=G.drillBoard[1].dmg,'board sorted best first');}
  // ---- the board keeps the top five; the road keeps fighting during a drill
  {const S=await game(),G=S.G;for(let i=0;i<7;i++)runDrill(S,G.roster[i%G.roster.length],false,0,false);ok(G.drillBoard.length===5,'board capped at five entries');for(let i=1;i<5;i++)ok(G.drillBoard[i-1].dmg>=G.drillBoard[i].dmg,'board order '+i);
    G.enc=0.01;G.screen='vael';S.startDrill(G.roster[0],false);let sawBattle=false;while(G.drill.running){S.clock.frame();S.setRT(S.getRT()+DT);S.update(DT,true);S.drillTick(DT);if(G.mode==='battle')sawBattle=true;}ok(sawBattle,'the road fought its own battle while the drill ran');ok(!G.drillOn&&G.drill.stats.total>0,'and the drill still scored');}
  if(out.length)console.log(out.join('\n'));console.log((fail?'FAIL  ':'PASS  ')+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
