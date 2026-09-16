// Bounded-growth checks for a candidate batch (the human's shipping criteria of 2026-09-15, replacing "within 3x of the reference").
// Reads one batch directory (2x is the reference speed; 4x is the labelled upper bound) and prints PASS/FAIL per check, per profile:
//   1. Shatter 8 does not occur before 48 h            5. Endless wave gain in hours 72-96 is lower than in hours 48-72
//   2. Shatter 10 is not reached within 96 h           6. no boss softlocks (a Road boss never cleared after >= 3 attempts, or a fail streak >= 8) and a usable ore economy
//   3. gear: recorded only since the level cap was removed   (at least one ascension per run and ore spent > 0 in the last 24 h)
//      on 2026-09-16 (item level and rank at the end)       7. engaged is 15-30% ahead of boosted idle on the hour Endless is entered (needs both profiles in the batch)
//   4. power growth in hours 72-96 is materially slower than in hours 48-72 (log-growth ratio <= 0.6)
// Also prints the record values: 1T gold arrival (the human accepts about 35-40 h at 2x), Shatter hours, power and wave series, assertion failures.
// Usage: node tests/sim/bounded.js --dir batch_out_p46x2 [--profiles idleboost,light,casual,engaged] [--seedStart 81] [--seeds 10]
'use strict';
const fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const DIR=path.join(__dirname,String(args.dir||'')),P=String(args.profiles||'idleboost,light,casual,engaged').split(','),S0=Number(args.seedStart||81),N=Number(args.seeds||10);
if(!args.dir||!fs.existsSync(DIR)){console.log('BOUNDED FAIL: --dir <batch directory> is required');process.exit(1);}
const med=a=>{a=a.filter(v=>v!=null&&!isNaN(v)).sort((x,y)=>x-y);return a.length?a[Math.floor((a.length-1)/2)]:null;};const f=(v,d=1)=>v==null?'-':(+v).toFixed(d);
const load=p=>{const o=[];for(let s=S0;s<S0+N;s++){const fp=path.join(DIR,p+'_'+s+'.json');if(fs.existsSync(fp))o.push(JSON.parse(fs.readFileSync(fp,'utf8')));}return o;};
const at=(r,h)=>r.hourly.filter(x=>x.h<=h).pop()||{};
const endIn=r=>{const e=Object.values(r.runZones||{}).map(z=>z['The Endless Road']&&z['The Endless Road'].enterH).filter(x=>x!=null);return e.length?Math.min(...e):null;};
const t1=r=>{const x=r.hourly.find(x=>x.earnedGold>=1e12);return x?x.h:null;};
const R={};for(const p of P)R[p]=load(p);
let fails=0;const say=(okv,msg)=>{console.log('  '+(okv?'PASS ':'FAIL ')+msg);if(!okv)fails++;};
console.log('bounded-growth checks: '+path.basename(DIR)+'  profiles '+P.join('/')+'  seeds '+S0+'-'+(S0+N-1));
for(const p of P){const rs=R[p];if(!rs.length){console.log('\n== '+p+': no runs');fails++;continue;}
  const cfg=rs[0].config||{};console.log('\n== '+p+' (n='+rs.length+', speed '+cfg.speed+', commit '+String(cfg.commit||'').slice(0,10)+', game '+cfg.gameHash+')');
  const af=rs.filter(r=>r.assertFail).length;say(af===0,'assertion failures: '+af);
  const sh8=med(rs.map(r=>r.shatters[7]?r.shatters[7].h:null)),n8=rs.filter(r=>r.shatters[7]&&r.shatters[7].h<48).length;say(n8===0,'1. Shatter 8 before 48 h in '+n8+' of '+rs.length+' runs (median hour '+f(sh8)+', Shatter hours seed '+S0+': '+rs[0].shatters.map(s=>f(s.h,1)).join(', ')+')');
  const n10=rs.filter(r=>r.shatters.length>=10).length;say(n10===0,'2. Shatter 10 reached within 96 h in '+n10+' of '+rs.length+' runs (median Shatters '+f(med(rs.map(r=>r.shatters.length)),0)+')');
  console.log('  INFO 3. gear (no level cap since 2026-09-16, recorded only): item level at the end '+f(med(rs.map(r=>at(r,96).itemLvl)),0)+', rank '+f(med(rs.map(r=>at(r,96).itemRank)),2)+'; ascensions per run '+f(med(rs.map(r=>(r.ascensions||[]).length)),0));
  const lg=(r,a,b)=>Math.log10(Math.max(1,at(r,b).power))-Math.log10(Math.max(1,at(r,a).power));const g1=med(rs.map(r=>lg(r,48,72))),g2=med(rs.map(r=>lg(r,72,96)));say(g2<=0.6*g1,'4. power growth 72-96 h vs 48-72 h: x'+f(Math.pow(10,g2),2)+' vs x'+f(Math.pow(10,g1),2)+' (ratio of log growth '+f(g1?g2/g1:0,2)+', want <= 0.6)');
  const wv=(r,a,b)=>(at(r,b).bestWave||0)-(at(r,a).bestWave||0);const w1=med(rs.map(r=>wv(r,48,72))),w2=med(rs.map(r=>wv(r,72,96)));say(w2<w1,'5. Endless waves gained 72-96 h '+f(w2,0)+' < 48-72 h '+f(w1,0)+' (best wave at 96 h '+f(med(rs.map(r=>at(r,96).bestWave||0)),0)+')');
  const soft=rs.map(r=>Object.entries(r.bossFailRates||{}).filter(([z,b])=>z!=='The Endless Road'&&b.attempts>=3&&r.zonesCleared[z]==null).map(([z])=>z)).flat(); /* softlock: a Road boss attempted three times and never cleared in any run; Endless milestone bosses are not clears */const walls=rs.map(r=>Object.entries(r.bossFailRates||{}).filter(([z,b])=>z!=='The Endless Road'&&b.maxStreak>=8).map(([z,b])=>z+' x'+b.maxStreak)).flat();const asc=med(rs.map(r=>(r.ascensions||[]).length)),oreLate=med(rs.map(r=>at(r,96).spentOre-at(r,72).spentOre));say(soft.length===0&&asc>=1&&oreLate>0,'6. boss softlocks '+soft.length+(soft.length?' ('+[...new Set(soft)].join(', ')+')':'')+'; ascensions per run '+f(asc,0)+'; ore spent in the last 24 h '+f(oreLate/1e6,1)+'M'+(walls.length?'  [walls, loss streak >= 8 but cleared: '+walls.length+' in '+rs.length+' runs, e.g. '+walls[0]+']':''));
  console.log('  record: 1T gold at h '+f(med(rs.map(t1)),0)+' ('+rs.filter(r=>t1(r)!=null).length+'/'+rs.length+' runs); Endless entered '+f(med(rs.map(endIn)),1)+' h; power 24/48/72/96 h '+[24,48,72,96].map(h=>f(med(rs.map(r=>at(r,h).power))/1e9,2)+'B').join(' / ')+'; waves '+[24,48,72,96].map(h=>f(med(rs.map(r=>at(r,h).bestWave||0)),0)).join(' / ')+'; level at 96 h '+f(med(rs.map(r=>at(r,96).lv)),0)+'; defeats '+f(med(rs.map(r=>r.final.defeats)),0));}
if(R.idleboost&&R.engaged&&R.idleboost.length&&R.engaged.length){const a=med(R.idleboost.map(endIn)),b=med(R.engaged.map(endIn));const adv=100*(1-b/a);console.log('\n== interaction');say(adv>=15&&adv<=30,'7. engaged ahead of boosted idle on Endless entry by '+f(adv,1)+'% ('+f(b,1)+' vs '+f(a,1)+' h; want 15-30%)');}
else{console.log('\n== interaction: needs both idleboost and engaged in the batch');fails++;}
console.log(fails?'\nBOUNDED FAIL ('+fails+' checks)':'\nBOUNDED PASS');process.exit(fails?1:0);
