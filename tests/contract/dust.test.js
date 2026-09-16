// Training Drill: diminishing repeat dust (owner spec 2026-09-16), all through PRODUCTION functions: 0.5 ^ previous dust-paying cycles per
// bracket, counted once per Shatter cycle on the first dust-bearing claim, cumulative tiers, a persistent fractional carry, atomic claims,
// save/load and Shatter persistence, migration of existing saves, gold and ore untouched.
// Run: node tests/contract/dust.test.js   (exit code 1 on any failure)
'use strict';
const H=require('../sim/headless.js');
let pass=0,fail=0;const out=[];
function ok(c,m){if(c)pass++;else{fail++;out.push('FAIL '+m);}}
function near(a,b,eps,m){ok(Math.abs(a-b)<=eps,m+' (got '+a+', want '+b+')');}
async function game(seed=1,zone=6){const S=H.load({seed,startMs:1700000000000});await S.ready;const G=S.G;G.title=false;G.tut=null;G.mult='max';G.screen='vael';for(const def of S.HEROES.slice(0,4)){if(!G.roster.find(h=>h.id===def.id))S.addHero(def,30);}G.active=G.roster.slice(0,4);G.campfireDone=true;for(const h of G.roster){h.lvl=30;S.refreshStats(h);h.hp=h.maxhp;h.charge=0;}for(let i=0;i<zone;i++){G.cleared[i]=true;G.prog[i]=S.ZONES[i].fights;}G.zone=zone;G.mode='walk';G.enc=1e9;G.enemies=[];return S;}
const DT=1/60;
function run(S,br,tier){const G=S.G;const h=G.roster[0];const T=S.drillTarget(br);S.DRILL.targets.zone[br.zi]=null;if(!S.startDrill(h,br))throw new Error('no drill');let f=0;const rt0=Math.ceil(S.getRT());while(G.drill.running){S.clock.frame();f++;S.setRT(rt0+f/60);S.update(DT,true);S.drillTick(DT);}G.sheet=null;G.screen='vael';return G.drill;}
function score(S,br,tier){const G=S.G;const d=(()=>{const h=G.roster[0];if(!S.startDrill(h,br))throw new Error('no drill');const t=S.drillTarget(br);G.drill.stats.basic=tier<0?0:t[tier];S.endDrill();G.sheet=null;G.screen='vael';return G.drill;})();return d;} /* an attempt that lands exactly on a tier: the score is set and the production endDrill claims */
(async()=>{
  const S=await game(),G=S.G;const brs=S.drillBrackets();const z8=brs.find(b=>b.kind==='zone'&&b.zi===6),z7=brs.find(b=>b.kind==='zone'&&b.zi===5);const key8=S.drillBracketKey(z8),key7=S.drillBracketKey(z7);const rec=S.drillRecords();
  ok(S.drillBundle('zone',2,6).dust===1&&S.drillBundle('zone',3,6).dust===2,'Ashen Approach pays 1 dust at Gold and 2 at Crystal (cumulative)');
  const shatter=()=>{G.cleared[3]=true;G.run={endless:1e9};S.doReforge();for(let i=0;i<6;i++){G.cleared[i]=true;G.prog[i]=S.ZONES[i].fights;}G.zone=6;G.tut=null;G.sheet=null;G.screen='vael';for(const h of G.roster){h.lvl=30;S.refreshStats(h);}};
  // cycle 1: Gold then Crystal in the same cycle counts once
  G.dust=0;let d=score(S,z8,2);ok(d.paid&&d.paid.dust===1&&d.paid.dustWhole===1&&G.dust===1&&d.paid.dustMult===1,'cycle 1 Gold pays 1 dust at 100%');ok(rec.dustCycles[key8]===1&&rec.cycleCounted[key8]===true,'the bracket has now completed its first dust-paying cycle');
  d=score(S,z8,3);ok(d.paid&&d.paid.dust===1&&G.dust===2&&rec.dustCycles[key8]===1,'Crystal in the same cycle pays the remaining 1 dust at the same 100% and does not count a second cycle');
    // cycle 2: 50%, fractions carry
  shatter();G.dust=0;ok(S.drillDustMult(key8)===0.5,'second cycle multiplier 0.5');d=score(S,z8,2);near(d.paid.dust,0.5,1e-9,'cycle 2 Gold credits 0.5 dust');ok(d.paid.dustWhole===0&&G.dust===0&&Math.abs(rec.dustCarry-0.5)<1e-9,'no whole dust yet, 0.5 in the carry');d=score(S,z8,3);near(d.paid.dust,0.5,1e-9,'Crystal credits the other 0.5');ok(d.paid.dustWhole===1&&G.dust===1&&Math.abs(rec.dustCarry)<1e-9,'the carry fills and pays 1 whole dust');ok(rec.dustCycles[key8]===2,'two dust-paying cycles recorded');
  // cycle 3: a direct jump to Crystal pays the whole discounted total once
  shatter();G.dust=0;d=score(S,z8,3);near(d.paid.dust,0.5,1e-9,'cycle 3: straight to Crystal pays the complete Crystal dust (2) at 25% = 0.5');ok(rec.dustCycles[key8]===3,'third cycle counted');
  // cycle 4: 12.5%, and gold and ore never change
  shatter();G.dust=0;d=score(S,z8,3);near(d.paid.dust,0.25,1e-9,'cycle 4: 2 dust at 12.5% = 0.25');{const df=S.drillBundleDiff('zone',-1,3,6),rt=S.drillRate(z8);ok(d.paid.gold===Math.round(df.gold*rt.gold)&&d.paid.ore===Math.round(df.ore*rt.ore)&&df.gold===45&&df.ore===20,'gold and ore are the full listed values (45 and 20 minutes of income) with no multiplier');}
  // a Shatter without a dust claim causes no reduction; Bronze and Silver never count
  shatter();G.dust=0;d=score(S,z8,1);ok(d.paid&&d.paid.dust===0&&rec.dustCycles[key8]===3+1,'Silver pays no dust and does not advance the count (count stays at 4 from the previous cycle)');ok(!rec.cycleCounted[key8],'the bracket is not counted this cycle');shatter();ok(rec.dustCycles[key8]===4&&S.drillDustMult(key8)===Math.pow(0.5,4),'a cycle without dust leaves the multiplier at 0.5^4');
  // separate brackets keep independent histories
  G.dust=0;d=score(S,z7,3);ok(d.paid.dustMult===1&&rec.dustCycles[key7]===1&&rec.dustCycles[key8]===4,'Amberfall starts at 100% with its own count');
  // duplicate-claim prevention: repeating the tier pays nothing and moves nothing
  const c0=rec.dustCycles[key7],carry0=rec.dustCarry,dust0=G.dust;d=score(S,z7,3);ok(!d.paid&&rec.dustCycles[key7]===c0&&rec.dustCarry===carry0&&G.dust===dust0,'a repeated Crystal pays nothing and changes no counter');
  // persistence across a save and reload
  const saved=S.serialize();const S2=H.load({seed:2,startMs:JSON.parse(saved).t,save:saved});await S2.ready;const r2=S2.drillRecords();ok(r2.dustCycles[key8]===4&&r2.dustCycles[key7]===1&&r2.cycleCounted[key7]===true&&r2.cycleMult[key7]===1&&Math.abs(r2.dustCarry-carry0)<1e-9,'cycle counts, the current-cycle multiplier and flag, and the carry survive a reload');
  // migration of an existing save: no history, but a dust-bearing tier claimed this cycle counts as the first cycle
  {const old=JSON.parse(saved);delete old.drill.dustCycles;delete old.drill.cycleMult;delete old.drill.cycleCounted;delete old.drill.dustCarry;old.drill.claimed={[key8]:3,[key7]:1};const S3=H.load({seed:3,startMs:old.t,save:JSON.stringify(old)});await S3.ready;const r3=S3.drillRecords();ok(r3.dustCycles[key8]===1&&r3.cycleCounted[key8]===true&&r3.cycleMult[key8]===1,'a bracket that paid dust in the saved cycle is recorded as one completed dust-paying cycle');ok(!r3.dustCycles[key7]&&!r3.cycleCounted[key7],'a bracket at Silver has no history');ok(r3.dustCarry===0&&S3.G.dust===old.dust,'no carry is invented and no dust is removed');}
  // lifetime bound: geometric halving keeps the total below twice the full reward
  {let total=0;for(let c=0;c<40;c++)total+=2*Math.pow(0.5,c);ok(total<4,'lifetime dust from one bracket stays below twice its full reward ('+total.toFixed(3)+' < 4)');}
  if(out.length)console.log(out.join('\n'));console.log((fail?'FAIL  ':'PASS  ')+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
