// Invariant audit of the Shatter calibration states: for every pre-Shatter snapshot shatter<n>_<profile>_<seed>.json, boot the saved
// game untouched and assert, through PRODUCTION functions only: the save holds n-1 Shatters; for n >= 4 the current zone is Endless
// and the required wave is 100 x 2^(n-4) (Shatter 4: 100, 5: 200, 6: 400, 7: 800) with the run's best wave at or above it; for n <= 3
// the requirement is 0 (only the Warlord); canReforge() succeeds; doReforge() moves the count exactly n-1 -> n. Nothing else touches
// the state. Reports every failure, the hours and waves per state, and the timing split for Shatter 7.
// Usage: node tests/sim/drill_audit.js --dir snapshots_calib [--profiles idleboost,light,casual,engaged] [--seeds 81-90] [--from 3 --to 7]
'use strict';
const fs=require('fs'),path=require('path');const H=require('./headless.js');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const DIR=path.resolve(__dirname,String(args.dir||'snapshots_calib')),PROFILES=String(args.profiles||'idleboost,light,casual,engaged').split(','),FROM=Number(args.from||3),TO=Number(args.to||7);
const [s0,s1]=String(args.seeds||'81-90').split('-').map(Number);const seeds=[];for(let s=s0;s<=(s1||s0);s++)seeds.push(s);
const med=a=>{a=a.slice().sort((x,y)=>x-y);return a.length?a[Math.floor((a.length-1)/2)]:null;};
(async()=>{let files=fs.readdirSync(DIR).filter(f=>/^shatter\d+_[a-z]+_\d+\.json$/.test(f)).filter(f=>{const m=f.match(/^shatter(\d+)_([a-z]+)_(\d+)\.json$/);const n=Number(m[1]);return n>=FROM&&n<=TO&&PROFILES.includes(m[2])&&seeds.includes(Number(m[3]));}).sort();
  const rows=[];let fails=0;
  for(const f of files){const m=f.match(/^shatter(\d+)_([a-z]+)_(\d+)\.json$/);const n=Number(m[1]);const rec=JSON.parse(fs.readFileSync(path.join(DIR,f),'utf8'));const saved=JSON.parse(rec.save);
    const S=H.load({seed:1,startMs:saved.t||1700000000000,save:rec.save});await S.ready;const G=S.G;const bad=[];
    const before=G.reforges||0,zone=S.ZONES[G.zone].name,endless=!!S.ZONES[G.zone].endless,need=S.reforgeNeedWave(),wave=(G.run&&G.run.endless)||0,can=S.canReforge();
    if(before!==n-1)bad.push('shattersBefore '+before+' != '+(n-1));
    if(n>=4){if(!endless)bad.push('zone is '+zone+', not Endless');if(need!==100*Math.pow(2,n-4))bad.push('required wave '+need+' != '+(100*Math.pow(2,n-4)));if(wave<need)bad.push('best wave '+wave+' below the required '+need);}
    else{if(need!==0)bad.push('required wave '+need+' != 0 for Shatter '+n);if(!G.cleared[3])bad.push('Warlord not beaten');}
    if(!can)bad.push('canReforge() false');
    let after=before;if(can){S.doReforge();after=G.reforges||0;if(after!==n)bad.push('doReforge moved the count '+before+' -> '+after+', expected '+n);}
    if(rec.shatter!=null&&rec.shatter!==n)bad.push('snapshot label '+rec.shatter+' != file '+n);
    rows.push({n,file:f,profile:m[2],seed:Number(m[3]),hours:rec.hours,zone,endless,need,wave,before,after,ok:!bad.length,bad});if(bad.length)fails++;}
  for(let n=FROM;n<=TO;n++){const R=rows.filter(r=>r.n===n);if(!R.length)continue;const ok=R.filter(r=>r.ok).length;console.log('Shatter '+n+': '+ok+'/'+R.length+' states legal; hours median '+med(R.map(r=>r.hours)).toFixed(1)+' (min '+Math.min(...R.map(r=>r.hours)).toFixed(1)+', max '+Math.max(...R.map(r=>r.hours)).toFixed(1)+'); required wave '+[...new Set(R.map(r=>r.need))].join('/')+'; best wave at the state: min '+Math.min(...R.map(r=>r.wave))+', median '+med(R.map(r=>r.wave))+', max '+Math.max(...R.map(r=>r.wave))+'; zones: '+[...new Set(R.map(r=>r.zone))].join(', '));
    for(const r of R.filter(r=>!r.ok))console.log('  FAIL '+r.file+': '+r.bad.join('; '));}
  const s7=rows.filter(r=>r.n===7&&r.ok);if(s7.length){const early=s7.filter(r=>r.hours<20),late=s7.filter(r=>r.hours>=20);console.log('\nShatter 7 timing split: '+early.length+' states before 20 h (hours '+early.map(r=>r.hours.toFixed(1)).join(', ')+'; waves '+early.map(r=>r.wave).join(', ')+') and '+late.length+' at or after 20 h (median '+(late.length?med(late.map(r=>r.hours)).toFixed(1):'-')+' h; waves '+late.map(r=>r.wave).join(', ')+')');
    const byProf={};for(const r of s7)(byProf[r.profile]=byProf[r.profile]||[]).push(r.hours);console.log('Shatter 7 hours per profile: '+Object.entries(byProf).map(([p,h])=>p+' median '+med(h).toFixed(1)+' (min '+Math.min(...h).toFixed(1)+', max '+Math.max(...h).toFixed(1)+')').join('; '));}
  if(args.json)fs.writeFileSync(String(args.json),JSON.stringify(rows,null,1));
  console.log(fails?'\nAUDIT FAIL: '+fails+' of '+rows.length+' states illegal':'\nAUDIT PASS: all '+rows.length+' states legal, every Shatter performed by the production function');process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
