// Challenge reward totals: for every bracket, the Crystal target in the game, the four tier thresholds, the cumulative bundles in
// gold, ore and dust at that bracket's income rate (measured on the calibration states, tests/sim/bench/*.json), and the grand
// total for clearing every tier (zone brackets plus measured Shatter brackets; provisional brackets pay nothing and are listed apart).
// Usage: node tests/sim/challenge_totals.js
'use strict';
const fs=require('fs'),path=require('path');const H=require('./headless.js');
const med=a=>{a=a.filter(v=>v!=null).sort((x,y)=>x-y);return a.length?a[Math.floor((a.length-1)/2)]:null;};
const fmt=n=>n==null?'-':n>=1e12?(n/1e12).toFixed(2)+'T':n>=1e9?(n/1e9).toFixed(2)+'B':n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(Math.round(n));
const rdRaw=f=>JSON.parse(fs.readFileSync(path.join(__dirname,'bench',f),'utf8'));const metas=[];const rd=f=>{const j=rdRaw(f);if(Array.isArray(j))return j;metas.push([f,j.meta]);return j.rows;};
(async()=>{const S=H.load({seed:1,startMs:1700000000000});await S.ready;const C=S.CHALLENGE,Z=S.ZONES;
  const zones=rd('challenge_zones_p45x2.json'),shat=rd('challenge_shatters_calib.json');const extra=fs.existsSync(path.join(__dirname,'bench','challenge_shatters_calib96.json'))?rd('challenge_shatters_calib96.json'):[];
  const keys=['greenhollow','stillwater','thornwood','ironvein','emberwaste','amberfall','ashen_approach','ashen_keep','the_foundry'];
  const rate=rows=>({gold:med(rows.map(r=>r.goldMin)),ore:med(rows.map(r=>r.oreMin))});
  const tot={gold:0,ore:0,dust:0};const line=(name,kind,key,target,rt,zi,prov,rows)=>{const parts=[];for(let t=0;t<4;t++){const b=S.challengeBundle(kind,t,zi);parts.push(C.tiers[t]+' '+fmt(target*C.tierPct[t])+': '+fmt(b.gold*rt.gold)+' gold'+(b.ore?' + '+fmt(b.ore*rt.ore)+' ore':'')+(b.dust?' + '+b.dust+' dust':''));}
    const c=S.challengeBundle(kind,3,zi);if(!prov){tot.gold+=c.gold*rt.gold;tot.ore+=c.ore*rt.ore;tot.dust+=c.dust;}
    console.log((name+(prov?' (provisional, no reward)':'')).padEnd(34)+' Crystal '+fmt(target).padStart(8)+'  rate '+fmt(rt.gold)+' gold/min, '+fmt(rt.ore)+' ore/min'+(rows?'  sample '+dist(rows):'')+'\n    '+parts.join('\n    ')+'\n    Overdrive '+fmt(target*C.overdrive)+': badge');};
  for(const [f,m] of metas)console.log('bench '+f+': snapshots from '+(m.snapshots&&m.snapshots.tag)+' (commit '+String(m.snapshots&&m.snapshots.commit).slice(0,10)+', game '+(m.snapshots&&m.snapshots.gameHash)+'), scored with commit '+String(m.scoring&&m.scoring.commit).slice(0,10)+' game '+(m.scoring&&m.scoring.gameHash));
  const dist=R=>{const p={};for(const r of R)p[r.profile]=(p[r.profile]||0)+1;return R.length+' states ('+Object.entries(p).map(([k,v])=>k+' '+v).join(', ')+')';};
  console.log('== zone brackets (target = P90 of the production Challenge on the listed states; bundles cumulative)');
  keys.forEach((k,zi)=>{const R=zones.filter(r=>r.key===k);line(Z[zi].name,'zone',String(zi),C.targets.zone[zi],rate(R),zi,false,R);});
  console.log('\n== Shatter brackets (target = P90 on 40 peak-of-run states; bracket n uses the states saved before Shatter n+1)');
  for(let n=3;n<=10;n++){const t=C.targets.shatter[String(n)];if(t==null)continue;let R=shat.filter(r=>r.key==='shatter'+(n+1));if(!R.length)R=extra.filter(r=>r.bracket==='shatter:'+n);const rt=R.length?rate(R):rate(shat.filter(r=>r.key==='shatter7'));line('Shatters '+n,'shatter',String(n),t,rt,null,!!C.provisional[String(n)],R.length?R:null);}
  console.log('\n== grand total for clearing every zone bracket and every measured Shatter bracket at Crystal (median income rates): '+fmt(tot.gold)+' gold, '+fmt(tot.ore)+' ore, '+tot.dust+' dust');
})().catch(e=>{console.error(e);process.exit(1);});
