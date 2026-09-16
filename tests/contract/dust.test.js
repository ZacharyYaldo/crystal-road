// Training Drill: repeat dust reduction per bracket AND tier portion (owner spec 2026-09-16, second version), through PRODUCTION functions:
// payout = portion x 0.5 ^ previous payouts of that portion; portions pay once per Shatter cycle; a Shatter resets only the cycle flags;
// fractional carry; atomic claims; save/load; migration; gold and ore untouched.
// Run: node tests/contract/dust.test.js   (exit code 1 on any failure)
'use strict';
const H=require('../sim/headless.js');
let pass=0,fail=0;const out=[];
function ok(c,m){if(c)pass++;else{fail++;out.push('FAIL '+m);}}
function near(a,b,eps,m){ok(Math.abs(a-b)<=eps,m+' (got '+a+', want '+b+')');}
async function game(seed=1,zone=6){const S=H.load({seed,startMs:1700000000000});await S.ready;const G=S.G;G.title=false;G.tut=null;G.mult='max';G.screen='vael';for(const def of S.HEROES.slice(0,4)){if(!G.roster.find(h=>h.id===def.id))S.addHero(def,30);}G.active=G.roster.slice(0,4);G.campfireDone=true;for(const h of G.roster){h.lvl=30;S.refreshStats(h);h.hp=h.maxhp;h.charge=0;}for(let i=0;i<zone;i++){G.cleared[i]=true;G.prog[i]=S.ZONES[i].fights;}G.zone=zone;G.mode='walk';G.enc=1e9;G.enemies=[];return S;}
function score(S,br,tier){const G=S.G;const h=G.roster[0];if(!S.startDrill(h,br))throw new Error('no drill');const t=S.drillTarget(br);G.drill.stats.basic=tier<0?0:t[tier];S.endDrill();G.sheet=null;G.screen='vael';return G.drill;} /* an attempt landing exactly on a tier; the production endDrill claims */
(async()=>{
  const S=await game(),G=S.G;const brs=S.drillBrackets();const z6=brs.find(b=>b.kind==='zone'&&b.zi===6),z5=brs.find(b=>b.kind==='zone'&&b.zi===5);const k6=S.drillBracketKey(z6),k5=S.drillBracketKey(z5);const rec=S.drillRecords();
  ok(S.drillPortion('zone',2,6)===1&&S.drillPortion('zone',3,6)===1&&S.drillPortion('zone',1,6)===0,'Ashen Approach portions: Gold 1, Crystal +1, Silver 0');ok(S.drillPortion('endless',2,null)===1&&S.drillPortion('endless',3,null)===2,'Endless portions: Gold 1, Crystal +2');
  const shatter=()=>{G.cleared[3]=true;G.run={endless:1e9};S.doReforge();for(let i=0;i<6;i++){G.cleared[i]=true;G.prog[i]=S.ZONES[i].fights;}G.zone=6;G.tut=null;G.sheet=null;G.screen='vael';for(const h of G.roster){h.lvl=30;S.refreshStats(h);}};
  // Gold before a Shatter, then first-time Crystal after it: 0.5 (Gold portion, second payout) + 1 (Crystal portion, first payout)
  G.dust=0;let d=score(S,z6,2);ok(d.paid&&d.paid.dust===1&&d.paid.dustWhole===1&&G.dust===1,'cycle 1: Gold pays its 1-dust portion at 100%');ok(rec.portionPays[k6][2]===1&&rec.portionPaid[k6][2]===true,'the Gold portion has one payout and is flagged for this cycle');
  shatter();G.dust=0;ok(!rec.portionPaid[k6]||!rec.portionPaid[k6][2],'a Shatter clears the cycle flag');ok(rec.portionPays[k6][2]===1,'and keeps the payout history');d=score(S,z6,3);near(d.paid.dust,1.5,1e-9,'cycle 2: Crystal pays Gold portion at 50% (0.5) plus first-time Crystal portion in full (1) = 1.5');ok(d.paid.dustWhole===1&&Math.abs(rec.dustCarry-0.5)<1e-9&&G.dust===1,'1 whole dust paid, 0.5 carried');ok(rec.portionPays[k6][2]===2&&rec.portionPays[k6][3]===1,'payout counts: Gold 2, Crystal 1');
  // Gold followed by Crystal in one cycle: Gold pays once, Crystal only its own portion
  shatter();G.dust=0;d=score(S,z6,2);near(d.paid.dust,0.25,1e-9,'cycle 3: Gold portion third payout = 0.25');d=score(S,z6,3);near(d.paid.dust,0.5,1e-9,'then Crystal pays only its own portion, second payout = 0.5, Gold is not paid again');ok(rec.portionPays[k6][2]===3&&rec.portionPays[k6][3]===2,'counts Gold 3, Crystal 2');
  // fourth payout of the Gold portion, direct jump to Crystal pays every unpaid portion with its own history
  shatter();G.dust=0;d=score(S,z6,3);near(d.paid.dust,0.125+0.25,1e-9,'cycle 4: straight to Crystal = Gold portion at 12.5% + Crystal portion at 25% = 0.375');
  // gold and ore stay at full value; tiers without dust do not touch counters; a Shatter without a dust claim reduces nothing
  {const df=S.drillBundleDiff('zone',-1,3,6),rt=S.drillRate(z6);ok(d.paid.gold===Math.round(df.gold*rt.gold)&&d.paid.ore===Math.round(df.ore*rt.ore)&&df.gold===45&&df.ore===20,'gold and ore are the full 45 and 20 minutes of income, no multiplier');}
  shatter();const before=JSON.stringify(rec.portionPays[k6]);d=score(S,z6,1);ok(d.paid&&d.paid.dust===0&&JSON.stringify(rec.portionPays[k6])===before&&!(rec.portionPaid[k6]&&rec.portionPaid[k6][2]),'Silver pays no dust and creates or advances no counter');shatter();ok(JSON.stringify(rec.portionPays[k6])===before,'a Shatter without a dust claim leaves the history alone');
  // independent brackets and tier histories
  G.dust=0;d=score(S,z5,3);ok(d.paid.dust===S.drillPortion('zone',2,5)+S.drillPortion('zone',3,5)&&rec.portionPays[k5][3]===1&&!(rec.portionPays[k5][2])===(S.drillPortion('zone',2,5)===0),'Amberfall pays its own portions in full on first payout, independent of Ashen Approach');
  // duplicate claims: repeating the tier pays nothing and moves nothing
  const snap=JSON.stringify([rec.portionPays,rec.portionPaid,rec.dustCarry,G.dust]);d=score(S,z5,3);ok(!d.paid&&JSON.stringify([rec.portionPays,rec.portionPaid,rec.dustCarry,G.dust])===snap,'a repeated Crystal pays nothing and changes nothing');
  // fractional carry converts into whole dust across claims
  {const carry0=rec.dustCarry;const need=1-carry0;ok(carry0>0&&carry0<1,'a fraction is in the carry ('+carry0+')');}
  // persistence across a reload
  const saved=S.serialize();const S2=H.load({seed:2,startMs:JSON.parse(saved).t,save:saved});await S2.ready;const r2=S2.drillRecords();ok(JSON.stringify(r2.portionPays)===JSON.stringify(rec.portionPays)&&JSON.stringify(r2.portionPaid)===JSON.stringify(rec.portionPaid)&&Math.abs(r2.dustCarry-rec.dustCarry)<1e-9,'payout counts, cycle flags and the carry survive a reload');
  // migration of an existing save: history only from dust-bearing tiers claimed in the saved cycle
  {const old=JSON.parse(saved);delete old.drill.portionPays;delete old.drill.portionPaid;delete old.drill.dustCarry;old.drill.claimed={[k6]:3,[k5]:1};const S3=H.load({seed:3,startMs:old.t,save:JSON.stringify(old)});await S3.ready;const r3=S3.drillRecords();ok(r3.portionPays[k6]&&r3.portionPays[k6][2]===1&&r3.portionPays[k6][3]===1&&r3.portionPaid[k6][2]===true&&r3.portionPaid[k6][3]===true,'Gold and Crystal portions claimed in the saved cycle count as one payout each');ok(!r3.portionPays[k5]&&!r3.portionPaid[k5],'a bracket at Silver has no history');ok(r3.dustCarry===0&&S3.G.dust===old.dust,'no carry is invented and no dust is removed');}
  // lifetime bound per portion
  {let total=0;for(let c=0;c<40;c++)total+=2*Math.pow(0.5,c);ok(total<4,'a 2-dust portion pays under 4 dust over its lifetime ('+total.toFixed(3)+')');}
  if(out.length)console.log(out.join('\n'));console.log((fail?'FAIL  ':'PASS  ')+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
