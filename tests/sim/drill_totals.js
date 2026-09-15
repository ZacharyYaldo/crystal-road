// Training Drill reward totals: for every bracket, the Crystal target in the game, the four tier thresholds, the cumulative bundles in
// gold, ore and dust at that bracket's permanent income rate (measured on the calibration states, tests/sim/bench/*.json), the sample
// behind the target with its profile distribution and both provenances, and the grand total for clearing every measured bracket at
// Crystal (provisional brackets pay nothing and are listed apart).
// Usage: node tests/sim/drill_totals.js
'use strict';
const fs=require('fs'),path=require('path');const H=require('./headless.js');
const med=a=>{a=a.filter(v=>v!=null).sort((x,y)=>x-y);return a.length?a[Math.floor((a.length-1)/2)]:null;};
const fmt=n=>n==null?'-':n>=1e12?(n/1e12).toFixed(2)+'T':n>=1e9?(n/1e9).toFixed(2)+'B':n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(Math.round(n));
const benchDir=path.join(__dirname,'bench');const files=fs.existsSync(benchDir)?fs.readdirSync(benchDir).filter(f=>/^drill_.*\.json$/.test(f)):[];
const all=[];for(const f of files){const j=JSON.parse(fs.readFileSync(path.join(benchDir,f),'utf8'));const meta=j.meta||{};for(const r of (j.rows||[]))all.push(Object.assign({file:f},r));console.log('bench '+f+': '+(meta.model||'')+'; states from '+(meta.snapshots&&meta.snapshots.tag)+' (commit '+String(meta.snapshots&&meta.snapshots.commit).slice(0,10)+', game '+(meta.snapshots&&meta.snapshots.gameHash)+'), scored with commit '+String(meta.scoring&&meta.scoring.commit).slice(0,10)+' game '+(meta.scoring&&meta.scoring.gameHash));}
(async()=>{const S=H.load({seed:1,startMs:1700000000000});await S.ready;const D=S.DRILL,Z=S.ZONES;
  const dist=R=>{const p={};for(const r of R)p[r.profile]=(p[r.profile]||0)+1;return R.length+' states ('+Object.entries(p).map(([k,v])=>k+' '+v).join(', ')+')';};
  const tot={gold:0,ore:0,dust:0};
  const line=(name,kind,key,target,R,zi,prov)=>{const rt=R.length?{gold:med(R.map(r=>r.goldMin)),ore:med(R.map(r=>r.oreMin))}:{gold:0,ore:0};const parts=[];for(let t=0;t<4;t++){const b=S.drillBundle(kind,t,zi);parts.push(D.tiers[t]+' '+fmt(target*D.tierPct[t])+': '+fmt(b.gold*rt.gold)+' gold'+(b.ore?' + '+fmt(b.ore*rt.ore)+' ore':'')+(b.dust?' + '+b.dust+' dust':''));}
    const c=S.drillBundle(kind,3,zi);if(!prov&&R.length){tot.gold+=c.gold*rt.gold;tot.ore+=c.ore*rt.ore;tot.dust+=c.dust;}
    console.log((name+(prov?' (provisional, no reward)':'')).padEnd(34)+' Crystal '+fmt(target).padStart(8)+'  rate '+fmt(rt.gold)+' gold/min, '+fmt(rt.ore)+' ore/min  sample '+(R.length?dist(R):'none')+'\n    '+parts.join('\n    ')+'\n    Overdrive '+fmt(target*D.overdrive)+': badge');};
  console.log('\n== zone brackets (target = P90 of the production drill, best roster hero, two taps a second; bundles cumulative)');
  for(let zi=0;zi<Z.length-1;zi++){const R=all.filter(r=>r.bracket==='zone:'+zi&&!r.key.startsWith('final'));line(Z[zi].name,'zone',String(zi),D.targets.zone[zi],R,zi,false);}
  console.log('\n== Shatter brackets (bracket n = states with n Shatters: the state saved before Shatter n+1, or the end of a 96 h run with n Shatters)');
  for(let n=3;n<=10;n++){const t=D.targets.shatter[String(n)];if(t==null)continue;const R=all.filter(r=>r.bracket==='shatter:'+n);line('Shatters '+n,'shatter',String(n),t,R,null,!!D.provisional[String(n)]);}
  console.log('\n== grand total for clearing every zone bracket and every measured Shatter bracket at Crystal (median income rates): '+fmt(tot.gold)+' gold, '+fmt(tot.ore)+' ore, '+tot.dust+' dust');
})().catch(e=>{console.error(e);process.exit(1);});
