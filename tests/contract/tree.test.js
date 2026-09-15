// Tree contract tests: exact assertions against PRODUCTION functions (no formula is re-derived here).
// Run: node tests/contract/tree.test.js   (exit code 1 on any failure)
'use strict';
const H=require('../sim/headless.js');
let pass=0,fail=0;const out=[];
function ok(cond,msg){if(cond){pass++;}else{fail++;out.push('FAIL '+msg);}}
function near(a,b,eps,msg){ok(Math.abs(a-b)<=eps,msg+' (got '+a+', want '+b+')');}
async function game(seed=1){const S=H.load({seed,startMs:1700000000000});await S.ready;const G=S.G;G.title=false;G.tut=null;G.mult='max';return S;}
function node(S,id){const n=S.TREE.find(x=>x.id===id);if(!n)throw new Error('no node '+id);return n;}
function buy(S,id,r){const G=S.G,n=node(S,id);G.gold=1e15;G.dust=1e15;let k=0;while(k<r&&S.buyTreeRank(n))k++;if(k!==r)throw new Error('could not buy '+r+' of '+id+' (got '+k+')');return n;}
function fourHeroes(S,lv=20){const G=S.G;for(const def of S.HEROES.slice(0,4)){if(!G.roster.find(h=>h.id===def.id))S.addHero(def,lv);}G.active=G.roster.slice(0,4);G.campfireDone=true;for(const h of G.roster){h.lvl=lv;S.refreshStats(h);h.hp=h.maxhp;h.charge=0;}}
function toBattle(S){const G=S.G;fourHeroes(S,30);G.zone=0;G.mode='walk';let n=0;while(G.mode!=='battle'&&n<30000){S.setRT(S.getRT()+1/60);S.clock.advance(1000/60);G.tut=null;S.update(1/60,true);n++;}if(G.mode!=='battle')throw new Error('no battle');const e=G.enemies.find(x=>!x.dead);e.hp=1e12;e.maxhp=1e12;return e;}

(async()=>{
// ---- prices and caps, every node: strictly increasing next-rank price, exact deduction, cap enforced, no effect on the other currency
{const S=await game();const G=S.G;for(const n of S.TREE){const cur=n.cur==='dust'?'dust':'gold',other=cur==='gold'?'dust':'gold';G.gold=1e15;G.dust=1e15;let prev=-1;const capTest=Math.min(n.max,12);
  for(let l=0;l<capTest;l++){const c=S.nodeCost(n,l);ok(c>0&&c>prev,n.id+' price at rank '+l+' positive and increasing ('+c+' after '+prev+')');prev=c;const b0=G[cur],o0=G[other];ok(S.buyTreeRank(n),n.id+' buy rank '+(l+1));ok(b0-G[cur]===c,n.id+' rank '+(l+1)+' deducted exactly the quoted price');ok(G[other]===o0,n.id+' did not touch '+other);}
  if(n.max<999){G.gold=1e300;G.dust=1e300;while(S.treeLv(n.id)<n.max&&S.buyTreeRank(n));ok(S.treeLv(n.id)===n.max,n.id+' reached max '+n.max);const b1=G[cur];ok(!S.buyTreeRank(n),n.id+' refuses rank beyond max');ok(S.treeLv(n.id)===n.max,n.id+' rank unchanged after refused buy');ok(G[cur]===b1,n.id+' refused buy charged nothing');ok(S.nodeTotal(n,n.max)!=='',n.id+' renders a total at max');}
  // description and total: every ranked node renders a numeric total; linear nodes' total = per-rank number x rank
  const tot1=S.nodeTotal(n,1),tot5=S.nodeTotal(n,Math.min(5,n.max));ok(/\d/.test(tot1),n.id+' rank-1 total renders a number ('+JSON.stringify(tot1)+')');
  if(!n.total){const m=n.desc.match(/([+\-]?\d+(?:\.\d+)?)(%?)/);if(m){const per=parseFloat(m[1]);const want=Math.round(per*Math.min(5,n.max)*100)/100;ok(tot5.includes(String(want)),n.id+' rank-5 total '+JSON.stringify(tot5)+' equals per-rank '+per+' x rank');}}}}
// ---- Strike: tap damage multiplier 1 + 0.20 x rank (rank 1 = 1.2x, 5 = 2x, 20 = 5x), read through production tapDamage
{for(const [r,want] of [[1,1.2],[5,2.0],[20,5.0]]){const S=await game();fourHeroes(S,30);for(const h of S.G.roster){h.atk=1e6;}const base=S.tapDamage();buy(S,'tap',r);near(S.tapDamage()/base,want,1e-6,'Strike rank '+r+' tap damage x'+want);}}
// ---- Warm Fire: after-fight heal 15% base, +2% per rank, 95% at the cap of 40, never above 100%
{const S=await game();near(S.restHealPct(),0.15,1e-12,'Warm Fire rank 0 heals 15%');buy(S,'rest',1);near(S.restHealPct(),0.17,1e-12,'Warm Fire rank 1 heals 17%');buy(S,'rest',39);near(S.restHealPct(),0.95,1e-12,'Warm Fire rank 40 heals 95%');ok(!S.buyTreeRank(node(S,'rest')),'Warm Fire cannot exceed 40');ok(S.nodeTotal(node(S,'rest'),40).includes('95%'),'Warm Fire total shows heals 95%');
  // the actual win path uses the same value: win a fight and measure the heal
  const G=S.G;const e=toBattle(S);for(const h of G.active){h.hp=Math.round(h.maxhp*0.5);}e.hp=1;e.maxhp=1;let n=0;while(G.mode==='battle'&&n<6000){S.setRT(S.getRT()+1/60);S.clock.advance(1000/60);S.update(1/60,true);n++;}
  const h0=G.active.find(h=>!h.dead);ok(h0&&h0.hp===Math.min(h0.maxhp,Math.round(h0.maxhp*0.5)+Math.round(h0.maxhp*0.95)),'win path healed with restHealPct (hp '+(h0&&h0.hp)+' of '+(h0&&h0.maxhp)+')');}
// ---- Quickstep: gauge speed x1.5 at rank 25, and the node caps at 25
{const S=await game();near(S.actionSpeedMult(),1,1e-12,'Quickstep rank 0 x1');buy(S,'spd',25);near(S.actionSpeedMult(),1.5,1e-12,'Quickstep rank 25 x1.5');ok(!S.buyTreeRank(node(S,'spd')),'Quickstep caps at 25');}
// ---- Haggling: rank 20 hires cost 40% of normal
{const S=await game();S.G.castle.hired=5;const c0=S.hireCost();buy(S,'haggle',20);near(S.hireCost()/c0,0.4,0.01,'Haggling rank 20 = 40% hire cost');}
// ---- Swift Return: rank 20 quest duration 40% (throughput 2.5x)
{const S=await game();const q=S.QUESTS[1];const d0=S.questDur(q);buy(S,'swift',20);near(S.questDur(q)/d0,0.4,1e-9,'Swift Return rank 20 duration 40%');}
// ---- Resonance: rank 5 grants exactly 1 Surge per fully-weighted tap; the 2.15 effective-tap cap holds at 10, 30 and 100 taps/s; window slides across second boundaries
{for(const rate of [1,3,10,30,100]){const S=await game();const G=S.G;buy(S,'tapsurge',5);buy(S,'tapcharge',5);const e=toBattle(S);const h=G.active[0];h.charge=0;G.surge=0;const t0=Math.floor(S.getRT())+0.05;for(let k=0;k<rate;k++){S.setRT(t0+k/rate*0.9);S.tapEnemy(e);}
  const wantW=rate>=3?2.15:rate===1?1:1.7;near(G.surge,wantW*1.0,1e-9,'Resonance rank 5: '+rate+' taps/s gives '+wantW+' Surge');near(h.charge,wantW*2.5,1e-9,'Momentum rank 5: '+rate+' taps/s gives '+(wantW*2.5)+' charge');}
  // boundary property: no wall-clock second can yield more than 2.15 secondary weight, and steady 3/s tapping gets the full 2.15 every second
  {const S=await game();const G=S.G;buy(S,'tapsurge',5);const e=toBattle(S);const base=Math.floor(S.getRT())+1;let worst=0;for(let sec=0;sec<3;sec++){G.surge=0;for(let k=0;k<12;k++){S.setRT(base+sec+0.85+k*0.012);S.tapEnemy(e);}worst=Math.max(worst,G.surge);}ok(worst<=2.15+1e-9,'a burst of 12 taps hugging a second boundary never exceeds 2.15 Surge in one wall-clock second (got '+worst+')');}
  {const S=await game();const G=S.G;buy(S,'tapsurge',5);const e=toBattle(S);const base=Math.floor(S.getRT())+1;G.surge=0;for(let k=0;k<9;k++){S.setRT(base+k/3+0.05);S.tapEnemy(e);}near(G.surge,3*2.15,1e-9,'steady 3 taps/s for 3 seconds earns 2.15 per second');}}
// ---- Crystal Memory: rank 10 doubles Shatter dust, and the sheet's multiplier is the same value
{const S=await game();const G=S.G;fourHeroes(S,60);for(let i=0;i<6;i++)G.cleared[i]=true;G.reforges=2;G.run={bosses:6,endless:0};const g0=S.reforgeGain();buy(S,'b_dust',10);near(S.dustBlessMult(),2,1e-12,'Crystal Memory rank 10 multiplier 2.0');near(S.reforgeGain(),2*g0,1,'Crystal Memory rank 10 doubles reforgeGain');near(S.dustBlessAt(1),1.10,1e-12,'Crystal Memory rank 1 = 1.10x (display and reward agree)');}
// ---- crit: never above 95% for any class at both caps, with and without the Range building
{const S=await game();fourHeroes(S,30);buy(S,'crit',20);buy(S,'b_crit',20);for(const h of S.G.roster){ok(S.critChance(h)<=S.CRIT_CAP+1e-12,h.cls+' crit '+S.critChance(h)+' <= cap');}ok(!S.buyTreeRank(node(S,'crit'))&&!S.buyTreeRank(node(S,'b_crit')),'both crit nodes cap at 20');
  const rogue=S.G.roster.find(h=>h.cls==='rogue');if(rogue){S.G.castle.b=S.G.castle.b||{};near(S.critChance(rogue),Math.min(0.95,0.3+0.4+0.6),1e-12,'rogue crit at both caps is capped at 95%');}}
// ---- refund migration: an old save with crit 30 / b_crit 25 refunds once at historical prices (250 gold, 6 dust bases) and lands on 20
{const S=await game();const G=S.G;G.tree.crit=30;G.tree.b_crit=25;G.tree.b_start=8;G.gold=0;G.dust=0;G.migV=0;S.migrateSave();let gb=0;for(let l=20;l<30;l++)gb+=Math.round(250*1.5*Math.pow(1.75,l));let db=0;for(let l=20;l<25;l++)db+=Math.round(6*Math.pow(1.5,l));for(let l=5;l<8;l++)db+=Math.round(6*Math.pow(1.5,l));
  ok(G.tree.crit===20&&G.tree.b_crit===20&&G.tree.b_start===5,'migration caps crit nodes at 20 and Remembered Strength at 5');ok(G.gold===gb,'migration refunds gold at historical prices ('+G.gold+' vs '+gb+')');ok(G.dust===db,'migration refunds dust at historical prices ('+G.dust+' vs '+db+')');
  G.gold=0;G.dust=0;S.migrateSave();ok(G.gold===0&&G.dust===0&&G.migV===2,'migration does not run twice');
  const S2=await game();const G2=S2.G;G2.tree.b_start=8;G2.tree.crit=30;G2.migV=1;G2.dust=0;G2.gold=0;S2.migrateSave();let db2=0;for(let l=5;l<8;l++)db2+=Math.round(6*Math.pow(1.5,l));ok(G2.tree.b_start===5&&G2.dust===db2&&G2.tree.crit===30&&G2.gold===0,'a save already at migration 1 only receives migration 2');}
// ---- Shatter income: flat +25% per Shatter on both; gold compounds 1.15 (1-3) then 1.17; ore compounds 1.05 from the fourth. Exact at 0-10, boundary at 3 and 4
{const S=await game();const G=S.G;const want={};for(let n=0;n<=10;n++){G.reforges=n;const flat=1+0.25*n,gc=Math.pow(1.15,Math.min(n,3))*Math.pow(1.17,Math.max(0,n-3)),oc=Math.pow(1.05,Math.max(0,n-3));near(S.goldMult(),flat*gc,1e-9,'gold income at '+n+' Shatters = '+(flat*gc).toFixed(4)+'x');near(S.oreMult(),flat*oc,1e-9,'ore income at '+n+' Shatters = '+(flat*oc).toFixed(4)+'x');want[n]=[flat*gc,flat*oc];}
  near(want[3][0],2.6613,5e-4,'gold at 3 Shatters 2.66x (unchanged)');near(want[3][1],1.75,1e-9,'ore at 3 Shatters 1.75x (unchanged)');near(want[4][0]/want[3][0],(2/1.75)*1.17,1e-9,'gold step from 3 to 4 Shatters is the flat step times 1.17');near(want[4][1]/want[3][1],(2/1.75)*1.05,1e-9,'ore step from 3 to 4 Shatters is the flat step times 1.05');near(want[7][0],7.838,5e-3,'gold at 7 Shatters 7.84x');near(want[10][0],15.98,2e-2,'gold at 10 Shatters 15.98x');near(want[10][1],4.925,5e-3,'ore at 10 Shatters 4.93x');console.log('shatter income: '+Object.keys(want).map(n=>n+':'+want[n][0].toFixed(2)+'/'+want[n][1].toFixed(2)).join(' '));}
// ---- earned-resource multipliers: one application, exact factors
{const S=await game();const G=S.G;buy(S,'b_gold',2);G.reforges=1;near(S.goldMult(),1.3*1.15*1.25,1e-9,'goldMult = Gilded Road x Shatter blessing x Shatter income, once');buy(S,'ore',4);buy(S,'b_ore',1);near(S.oreMult(),1.2*1.15*1.25,1e-9,'oreMult = Prospecting x Deep Veins x Shatter income, once');buy(S,'b_xp',3);near(S.xpMult(),1.45,1e-12,'xpMult = Old Wisdom');}
console.log(out.join('\n'));console.log((fail?'FAIL':'PASS')+'  '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
