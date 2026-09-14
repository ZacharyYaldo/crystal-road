// Node ablation REPORT (not a test: no expected values; see tests/contract for pass/fail contract tests).
// Each Tree node at ranks 0 / 1 / 5 / 10 (capped at the node's max) in a focused scenario, against the cumulative price actually paid.
// Every run is a fresh game context booted through the production loader with an isolated RNG seeded identically, so rank 0 and rank N
// see the same randomness; ranks are bought through the production purchase path (buyTreeRank) with granted currency, and the price is the
// production nodeCost. Output is deterministic for a given seed and source: run it twice and diff.
// Scenarios: arena (fixed party, fixed zone, Auto-Cast, N game-hours of fights), taps (arena + taps at 3/s and 10/s real time),
// quests (camp heroes on quests for 48h), keys (regeneration over 48h, consumed or held), offline (production offlineReport for a 12h absence),
// shatter (production doReforge for Remembered Strength and Crystal Memory), direct (hire cost).
// Usage: node tests/sim/ablate.js [--nodes hp,atk,...] [--hours 2] [--seed 1] [--out ablation.txt]
'use strict';
const H=require('./headless.js');const fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const SEED=args.seed||1,DT=1/60,HOURS=args.hours||2,RANKS=[1,5,10];
const fmt=v=>v==null?'-':(Math.abs(v)>=1e9?(v/1e9).toFixed(2)+'B':Math.abs(v)>=1e6?(v/1e6).toFixed(2)+'M':Math.abs(v)>=1e3?(v/1e3).toFixed(1)+'K':(Math.round(v*100)/100).toString());
const pct=(a,b)=>b?((a/b-1)*100):null;

async function fresh(){const S=H.load({seed:SEED,startMs:1700000000000});await S.ready;const G=S.G;G.title=false;G.tut=null;G.autoSalvage=0;G.mult='max';S.reseed(SEED);return S;}
function party(S,G,lv,zone,gearRank=1,gearLvl=10){for(const def of S.HEROES.slice(0,4)){if(!G.roster.find(h=>h.id===def.id))S.addHero(def,lv);}G.active=G.roster.slice(0,4);G.campfireDone=true;
  for(const h of G.roster){h.lvl=lv;h.xp=0;h.tier=0;h.abLvl=3;for(const slot of ['weapon','cape','charm']){const it=S.makeItem(zone,gearRank);it.slot=slot;if(slot==='weapon')it.kind=S.CLASSES[h.cls].weapon;it.lvl=gearLvl;h.eq[slot]=it;}S.refreshStats(h);h.hp=h.maxhp;h.dead=false;h.charge=0;h.status={};}}
function buyRanks(S,G,id,r){const n=S.TREE.find(x=>x.id===id);const g0=G.gold,d0=G.dust;G.gold=1e15;G.dust=1e15;let k=0,paid=0;while(k<r){const c=S.nodeCost(n,S.treeLv(id));if(!S.buyTreeRank(n))break;paid+=c;k++;}
  if(k!==r)throw new Error('could not buy '+r+' ranks of '+id+' through buyTreeRank (got '+k+', max '+n.max+')');G.gold=g0;G.dust=d0;for(const h of G.roster){S.refreshStats(h);h.hp=h.maxhp;}return paid;}
function levelProg(S,G){return G.active.reduce((a,h)=>a+h.lvl+h.xp/Math.max(1,S.xpNeed(h.lvl)),0)/Math.max(1,G.active.length);}

function arena(S,G,{zone=3,hours=HOURS,taps=0}){G.zone=zone;for(let i=0;i<zone;i++){G.cleared[i]=true;G.prog[i]=S.ZONES[i].fights;}G.prog[zone]=0;G.cleared[zone]=false;G.far=G.far||[];G.mode='walk';G.enemies=[];G.projs=[];G.action=null;G.autoCast=true;G.autoUntil=S.clock.get()+1e12;S.layout();
  const k0=G.stats.kills||0,d0=G.stats.defeats||0,g0=G.gold,o0=G.ore,l0=levelProg(S,G),db0=Object.assign({basic:0,ability:0,tap:0,surge:0},G.stats.dmgBy||{});
  let t=0,nextTap=0,tapsDone=0,surges=0;while(t<hours*3600){t+=DT;S.setRT(S.getRT()+DT);S.clock.advance(DT*1000);G.tut=null;S.update(DT,true);G.parts.length=0;G.floats.length=0;
    if(taps>0&&G.mode==='battle'&&S.getRT()>=nextTap){nextTap=S.getRT()+1/taps;const e=G.enemies.find(x=>!x.dead);if(e){S.tapEnemy(e);tapsDone++;}}
    if(G.mode==='battle'&&(G.surge||0)>=100){const b=G.surge;S.castSurge();if(G.surge<b)surges++;}}
  const db=Object.assign({basic:0,ability:0,tap:0,surge:0},G.stats.dmgBy||{});const h=hours;
  return{kills:((G.stats.kills||0)-k0)/h,defeats:((G.stats.defeats||0)-d0)/h,gold:(G.gold-g0)/h,ore:(G.ore-o0)/h,levels:(levelProg(S,G)-l0)/h,dmgAbility:(db.ability-db0.ability)/h,dmgTap:(db.tap-db0.tap)/h,surges:surges/h,taps:tapsDone/h};}

function quests(S,G,{hours=48}){G.active=[];G.zone=3;G.quests=[];let done=0;const g0=G.gold,o0=G.ore,d0=G.dust;let qi=0;const order=S.QUESTS;
  const step=60;for(let t=0;t<hours*3600;t+=step){S.clock.advance(step*1000);const nowMs=S.clock.get();
    for(const q of G.quests.slice())if(nowMs>=q.end){S.collectQuest(q);done++;}
    for(const h of G.roster){if(G.quests.length>=S.questSlots())break;if(S.heroStatus(h)!=='camp')continue;S.startQuest(h,order[qi%order.length]);qi++;}}
  const days=hours/24;return{questsPerDay:done/days,goldPerDay:(G.gold-g0)/days,orePerDay:(G.ore-o0)/days,dustPerDay:(G.dust-d0)/days};}

function keys(S,G,{hours=48,consume=true}){G.delveKeys=0;G.keyAt=S.clock.get();let got=0;const step=60;for(let t=0;t<hours*3600;t+=step){S.clock.advance(step*1000);S.keysNow();if(consume&&G.delveKeys>0){got+=G.delveKeys;G.delveKeys=0;}}
  return consume?{keysPerDay:got/(hours/24)}:{keysHeldAtEnd:G.delveKeys,capacity:S.keyMax()};}

function offline(S,G){party(S,G,25,3);G.zone=3;G.prog[3]=10;G.autoUntil=0;const g0=G.gold,o0=G.ore,l0=levelProg(S,G);S.offlineReport(S.clock.get()-12*3600*1000);return{gold:G.gold-g0,ore:G.ore-o0,levelsGained:levelProg(S,G)-l0};}

function shatterRS(S,G){party(S,G,60,3);for(let i=0;i<6;i++){G.cleared[i]=true;G.prog[i]=S.ZONES[i].fights;}G.reforges=2;G.run={bosses:6,endless:0};const d0=G.dust;S.doReforge();const h=G.roster[0];return{startLevel:h.lvl,partyPower:S.partyPower(),knightHP:h.maxhp,knightATK:h.atk,dustGained:G.dust-d0};}

const NODES={
  hp:{sc:'arena'},atk:{sc:'arena'},def:{sc:'arena'},spd:{sc:'arena'},crit:{sc:'arena'},abil:{sc:'arena'},front:{sc:'arena'},regen:{sc:'arena'},rest:{sc:'arena'},
  b_hp:{sc:'arena'},b_dmg:{sc:'arena'},b_crit:{sc:'arena'},b_ab:{sc:'arena'},b_surge:{sc:'arena'},
  march:{sc:'arena',zone:0,lv:40,note:'trivial fights: walking dominates'},
  tap:{sc:'taps'},tapcrit:{sc:'taps'},tapcharge:{sc:'taps'},tapgold:{sc:'taps'},tapsurge:{sc:'taps'},
  b_gold:{sc:'arena+quests'},b_ore:{sc:'arena+quests'},ore:{sc:'arena+quests'},b_xp:{sc:'arena+quests'},
  slots:{sc:'quests'},quest:{sc:'quests'},swift:{sc:'quests'},
  keys:{sc:'keys'},b_keys:{sc:'keys-cap'},offline:{sc:'offline'},haggle:{sc:'direct'},b_dust:{sc:'shatter'},b_start:{sc:'shatter'},
};

async function runNode(id,r){const S=await fresh();const G=S.G;const n=S.TREE.find(x=>x.id===id);const spec=NODES[id];const out={};let paid=0;
  const setup=()=>{if(spec.sc==='arena'||spec.sc==='arena+quests'||spec.sc==='taps')party(S,G,spec.lv||22,spec.zone==null?3:spec.zone);else if(spec.sc==='quests')party(S,G,30,3);};
  setup();paid=buyRanks(S,G,id,r);S.reseed(SEED);
  if(spec.sc==='arena'||spec.sc==='arena+quests'){Object.assign(out,arena(S,G,{zone:spec.zone==null?3:spec.zone}));
    if(spec.sc==='arena+quests'){const S2=await fresh();const G2=S2.G;party(S2,G2,30,3);buyRanks(S2,G2,id,r);S2.reseed(SEED);Object.assign(out,quests(S2,G2,{hours:48}));}}
  else if(spec.sc==='taps'){const a=arena(S,G,{zone:3,taps:3});const S2=await fresh();const G2=S2.G;party(S2,G2,22,3);buyRanks(S2,G2,id,r);S2.reseed(SEED);const b=arena(S2,G2,{zone:3,taps:10});for(const k of Object.keys(a)){out[k+'@3tps']=a[k];out[k+'@10tps']=b[k];}}
  else if(spec.sc==='quests'){Object.assign(out,quests(S,G,{hours:48}));}
  else if(spec.sc==='keys'){Object.assign(out,keys(S,G,{hours:48,consume:true}));}
  else if(spec.sc==='keys-cap'){Object.assign(out,keys(S,G,{hours:96,consume:false}));}
  else if(spec.sc==='offline'){Object.assign(out,offline(S,G));}
  else if(spec.sc==='shatter'){Object.assign(out,shatterRS(S,G));}
  else if(spec.sc==='direct'){if(id==='haggle'){G.castle.hired=5;out.hireCost=S.hireCost();}}
  return{node:n,rank:r,cost:paid,m:out};}

(async()=>{
const want=args.nodes?String(args.nodes).split(','):Object.keys(NODES);
const lines=[];const say=s=>{lines.push(s);console.log(s);};
const prov=(()=>{const crypto=require('crypto');const h=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,f))).digest('hex').slice(0,16);return 'game '+h('../../source/game.js')+' harness '+h('headless.js')+':'+h('ablate.js');})();
say('NODE ABLATION REPORT  seed '+SEED+'  dt 1/60  arena hours '+HOURS+'  source '+prov+'  (improvement vs rank 0 in the same scenario with the same RNG; cost is the price actually paid through buyTreeRank)');
for(const id of want){if(!NODES[id]){say('unknown node '+id);continue;}
  const base=await runNode(id,0);const n=base.node;const ranks=[...new Set(RANKS.map(r=>Math.min(r,n.max)))].filter(r=>r>0);
  say('');say('== '+n.name+' ('+id+', '+n.branch+', max '+n.max+', '+n.cur+' base '+n.base+')  '+n.desc+(NODES[id].note?'  ['+NODES[id].note+']':''));
  const keysM=Object.keys(base.m);say('   rank 0: '+keysM.map(k=>k+' '+fmt(base.m[k])).join(' | '));
  for(const r of ranks){const res=await runNode(id,r);const parts=keysM.map(k=>{const p=pct(res.m[k],base.m[k]);return k+' '+fmt(res.m[k])+(p==null?'':' ('+(p>=0?'+':'')+p.toFixed(1)+'%)');});
    say('   rank '+String(r).padStart(2)+' cost '+fmt(res.cost).padStart(7)+' '+n.cur+': '+parts.join(' | '));}}
if(args.out)fs.writeFileSync(path.join(__dirname,String(args.out)),lines.join('\n')+'\n');
})().catch(e=>{console.error(e);process.exit(1);});
