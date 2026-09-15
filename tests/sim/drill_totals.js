// Training Drill reward table: for every bracket, the four tier thresholds in the game (P25 / P50 / P75 / P90 of the measured
// distribution), the sample behind them with profile counts and per-profile medians, both provenances, the cumulative bundles in gold,
// ore and dust at the bracket's permanent income rate, and the grand total for clearing every measured bracket at Crystal
// (provisional brackets pay nothing and are listed apart).
// Usage: node tests/sim/drill_totals.js
'use strict';
const fs=require('fs'),path=require('path');const H=require('./headless.js');
const fmt=n=>n==null?'-':n>=1e12?(n/1e12).toFixed(2)+'T':n>=1e9?(n/1e9).toFixed(2)+'B':n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(Math.round(n));
const benchDir=path.join(__dirname,'bench');const files=fs.existsSync(benchDir)?fs.readdirSync(benchDir).filter(f=>/^drill_.*\.json$/.test(f)):[];
const summaries={};for(const f of files){const j=JSON.parse(fs.readFileSync(path.join(benchDir,f),'utf8'));const meta=j.meta||{};console.log('bench '+f+': '+(meta.model||'')+'; states from '+(meta.snapshots&&meta.snapshots.tag)+' (commit '+String(meta.snapshots&&meta.snapshots.commit).slice(0,10)+', game '+(meta.snapshots&&meta.snapshots.gameHash)+'), scored with commit '+String(meta.scoring&&meta.scoring.commit).slice(0,10)+' game '+(meta.scoring&&meta.scoring.gameHash));for(const [b,s] of Object.entries(j.summary||{}))if(!summaries[b]||s.n>summaries[b].n)summaries[b]=Object.assign({file:f},s);}
(async()=>{const S=H.load({seed:1,startMs:1700000000000});await S.ready;const D=S.DRILL,Z=S.ZONES;const tot={gold:0,ore:0,dust:0};
  const line=(name,kind,key,zi)=>{const br=kind==='zone'?{kind,zi,key}:{kind,key,n:Number(key)};const t=S.drillTarget(br);const sm=summaries[kind+':'+key];const prov=S.drillProvisional(br)||!S.drillRewardsOn(br);const rt=sm?{gold:sm.goldMin,ore:sm.oreMin}:{gold:0,ore:0};
    if(t==null){console.log(name.padEnd(20)+' calibration pending: records only, no rewards'+(sm?' (bench has '+sm.n+' states, P90/median '+(sm.thresholds[3]/Math.max(1,sm.thresholds[1])).toFixed(2)+')':''));return;}
    const parts=[];for(let i=0;i<4;i++){const b=S.drillBundle(kind,i,zi);parts.push(D.tiers[i]+' '+fmt(t[i])+': '+fmt(b.gold*rt.gold)+' gold'+(b.ore?' + '+fmt(b.ore*rt.ore)+' ore':'')+(b.dust?' + '+b.dust+' dust':''));}
    const c=S.drillBundle(kind,3,zi);if(!prov&&sm){tot.gold+=c.gold*rt.gold;tot.ore+=c.ore*rt.ore;tot.dust+=c.dust;}
    const spread=sm&&sm.thresholds?sm.thresholds[3]/Math.max(1,sm.thresholds[1]):null;console.log((name+(prov?' (rewards off)':'')).padEnd(34)+' sample '+(sm?sm.n+' runs ('+Object.entries(sm.profiles||{}).map(([p,v])=>p+' '+v.n+': median '+fmt(v.median)).join(', ')+')':'none')+'; median '+(sm?fmt(sm.thresholds[1]):'-')+', P90 '+(sm?fmt(sm.thresholds[3]):'-')+(spread!=null?' (P90/median '+spread.toFixed(2)+(spread>2?', ABOVE 2: outlier-driven, kept provisional':'')+')':'')+'; defense '+(sm?sm.def:'-')+'; rate '+fmt(rt.gold)+' gold/min, '+fmt(rt.ore)+' ore/min\n    '+parts.join('\n    ')+'\n    Overdrive '+fmt(t[3]*D.overdrive)+': badge');};
  console.log('\n== zone brackets (Crystal = P90 of the production drill at the first boss attempt of the zone, best roster hero, two taps a second; Bronze / Silver / Gold at 25 / 50 / 75%; bundles cumulative)');
  for(let zi=0;zi<Z.length-1;zi++)line(Z[zi].name,'zone',String(zi),zi);
  console.log('\n== Shatter brackets (one legal post-Shatter state per run, scored against the bracket Endless defense; measured only with at least 30 runs)');
  for(let n=3;n<=10;n++)line('Shatters '+n,'shatter',String(n),null);
  console.log('\n== grand total for clearing every measured bracket at Crystal (median income rates): '+fmt(tot.gold)+' gold, '+fmt(tot.ore)+' ore, '+tot.dust+' dust');
})().catch(e=>{console.error(e);process.exit(1);});
