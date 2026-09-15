// Optimization-equivalence gate for the simulator harness.
// Runs the harness as committed at --ref (bot.js + headless.js taken from git, with the CURRENT source/game.js and build/assets.json alongside)
// and the harness in the working tree on identical seeds, profiles and speeds.
//
// --mode exact (default): every pair must be identical: assertions, RNG-call count and final RNG state, final currencies and progress,
//   milestones (zone clears, Shatters, recruits, promotions, Endless), roster and gear, boss outcomes, hourly series, events, and the canonical
//   hash of the whole result (volatile fields removed: commit, harness hash, real times). Fields present on only one side (new telemetry) are
//   listed and do not fail the gate. Use it for every harness change that must not alter a single frame.
// --mode stat: for a change that legitimately moves frame timing (the clock migration), per-seed equality cannot hold because the runs are
//   chaotic; this mode compares the DISTRIBUTIONS over seeds per profile and speed (medians and a Mann-Whitney rank test on the key metrics),
//   requires the new harness to be deterministic (the first seed of every group runs twice and must match exactly), and prints the new
//   canonical hashes so they can be recorded as the reference.
// Speeds 1 and 2 are the equivalence surface; balance batches never run at 1x.
// Usage: node tests/sim/equiv.js --ref <commit> [--mode exact|stat] [--seeds 3] [--seedStart 900] [--profiles idleboost,light,casual,engaged] [--speeds 1,2] [--hours 3] [--workers 4] [--keep]
'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),cp=require('child_process'),crypto=require('crypto');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
if(!args.ref){console.log('EQUIV FAIL: --ref <commit> is required (the harness version to compare against)');process.exit(1);}
const MODE=String(args.mode||'exact');if(!['exact','stat'].includes(MODE)){console.log('EQUIV FAIL: --mode must be exact or stat');process.exit(1);}
const ROOT=path.join(__dirname,'..','..'),REF=String(args.ref),SEEDS=Number(args.seeds||(MODE==='stat'?5:3)),SEED0=Number(args.seedStart||900),HOURS=Number(args.hours||(MODE==='stat'?6:3)),WORKERS=Number(args.workers||4);
const PROFILES=String(args.profiles||'idleboost,light,casual,engaged').split(','),SPEEDS=String(args.speeds||'1,2').split(',').map(Number);
const refCommit=cp.execSync('git rev-parse '+REF,{cwd:ROOT}).toString().trim();
const tmp=path.join(os.tmpdir(),'crystal-equiv',refCommit.slice(0,10));
const oldDir=path.join(tmp,'old'),outDir=path.join(tmp,'out');
fs.rmSync(tmp,{recursive:true,force:true});
for(const d of ['source','build','tests/sim'])fs.mkdirSync(path.join(oldDir,d),{recursive:true});fs.mkdirSync(outDir,{recursive:true});
for(const f of ['bot.js','headless.js'])fs.writeFileSync(path.join(oldDir,'tests/sim',f),cp.execSync('git show '+refCommit+':tests/sim/'+f,{cwd:ROOT,maxBuffer:1<<26}));
fs.copyFileSync(path.join(ROOT,'source/game.js'),path.join(oldDir,'source/game.js'));fs.copyFileSync(path.join(ROOT,'build/assets.json'),path.join(oldDir,'build/assets.json'));
const jobs=[];for(const p of PROFILES)for(let s=SEED0;s<SEED0+SEEDS;s++)for(const sp of SPEEDS){for(const side of ['old','new'])jobs.push({p,s,sp,side});if(MODE==='stat'&&s===SEED0)jobs.push({p,s,sp,side:'new2'});}
const botOf=side=>side==='old'?path.join(oldDir,'tests/sim/bot.js'):path.join(__dirname,'bot.js');
const fileOf=j=>path.join(outDir,j.side+'_'+j.p+'_'+j.s+'_x'+j.sp+'.json');
const t0=Date.now();const wall={old:0,new:0,new2:0};let idx=0,done=0;
function next(){if(idx>=jobs.length)return;const j=jobs[idx++];const a=[botOf(j.side),'--hours',String(HOURS),'--seed',String(j.s),'--profile',j.p,'--speed',String(j.sp),'--quiet','--json',fileOf(j)];const t=Date.now();const c=cp.spawn(process.execPath,a,{stdio:['ignore','ignore','inherit']});c.on('exit',()=>{wall[j.side]+=Date.now()-t;done++;process.stdout.write('\r'+done+'/'+jobs.length+' runs ('+((Date.now()-t0)/1000).toFixed(0)+'s)   ');if(done===jobs.length)(MODE==='stat'?compareStat:compareExact)();else next();});}
for(let i=0;i<Math.min(WORKERS,jobs.length);i++)next();
const VOLATILE=/^(commit|harnessHash|realSec|realSeconds|wallSec|elapsedSec)$/;
function canon(o){if(Array.isArray(o))return o.map(canon);if(o&&typeof o==='object'){const r={};for(const k of Object.keys(o).sort()){if(VOLATILE.test(k))continue;r[k]=canon(o[k]);}return r;}return o;}
function shared(a,b){const A=canon(a),B=canon(b);const onlyA=Object.keys(A).filter(k=>!(k in B)),onlyB=Object.keys(B).filter(k=>!(k in A));const SA={},SB={};for(const k of Object.keys(A))if(k in B){SA[k]=A[k];SB[k]=B[k];}return{SA,SB,onlyA,onlyB};}
const H=o=>crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0,16);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const readJ=j=>JSON.parse(fs.readFileSync(fileOf(j)));
function header(){console.log('\nequivalence gate ('+MODE+'): ref '+refCommit.slice(0,10)+' (old harness) vs working tree (new harness), same source/game.js, '+PROFILES.join('/')+' x seeds '+SEED0+'-'+(SEED0+SEEDS-1)+' x speeds '+SPEEDS.join('/')+', '+HOURS+'h each');}
function finish(fails,label){console.log('wall time per run: old '+(wall.old/1000/(jobs.filter(j=>j.side==='old').length)).toFixed(1)+'s  new '+(wall.new/1000/(jobs.filter(j=>j.side==='new').length)).toFixed(1)+'s');for(const f of fails)console.log('DIFF '+f);console.log(fails.length?'EQUIV FAIL':'EQUIV PASS ('+label+')');if(!args.keep)fs.rmSync(tmp,{recursive:true,force:true});process.exit(fails.length?1:0);}
function compareExact(){
  header();const fails=[];let pairs=0;const newFields=new Set(),lostFields=new Set();
  for(const p of PROFILES)for(let s=SEED0;s<SEED0+SEEDS;s++)for(const sp of SPEEDS){pairs++;const key=p+' seed '+s+' x'+sp;
    let a,b;try{a=readJ({side:'old',p,s,sp});b=readJ({side:'new',p,s,sp});}catch(e){fails.push(key+': missing result ('+e.message+')');continue;}
    const {SA,SB,onlyA,onlyB}=shared(a,b);onlyB.forEach(k=>newFields.add(k));onlyA.forEach(k=>lostFields.add(k));
    const checks=[['assertions',a.assertFail||null,b.assertFail||null],['final (currencies, progress)',a.final,b.final],['milestones: zones cleared',a.zonesCleared,b.zonesCleared],['milestones: Shatters',a.shatters,b.shatters],['milestones: recruits',a.recruits,b.recruits],['milestones: promotions',a.promotions,b.promotions],['milestones: Endless',a.endless,b.endless],['boss outcomes',a.bossFailRates,b.bossFailRates],['hourly series',a.hourly,b.hourly],['events',a.events,b.events]];
    if(a.rngCalls!=null&&b.rngCalls!=null)checks.push(['RNG calls',a.rngCalls,b.rngCalls],['RNG state',a.rngState,b.rngState]);
    if(a.roster&&b.roster)checks.push(['roster and gear',a.roster,b.roster]);
    for(const [name,x,y] of checks)if(!same(x,y))fails.push(key+': '+name+' differ: old '+JSON.stringify(x).slice(0,120)+' | new '+JSON.stringify(y).slice(0,120));
    if(H(SA)!==H(SB)){const diffKeys=Object.keys(SA).filter(k=>!same(SA[k],SB[k]));fails.push(key+': canonical hash old '+H(SA)+' != new '+H(SB)+' (keys: '+diffKeys.join(',')+')');}
    else console.log('  '+key.padEnd(24)+' canonical '+H(SA)+'  rng '+(b.rngCalls!=null?b.rngCalls:'n/a')+(a.rngCalls==null&&b.rngCalls!=null?' (old side does not record RNG calls)':'')+'  identical');}
  if(newFields.size)console.log('fields only in the new harness (not compared): '+[...newFields].join(', '));
  if(lostFields.size)fails.push('fields the new harness no longer records: '+[...lostFields].join(', '));
  finish(fails,pairs+' pairs identical');
}
// Mann-Whitney U (two-sided) for small samples: returns U and whether it is significant at about 5% for n1=n2 in 3..10 (critical U table)
const UCRIT={3:0,4:0,5:2,6:5,7:8,8:13,9:17,10:23};
function mannWhitney(x,y){x=x.filter(v=>v!=null);y=y.filter(v=>v!=null);let u=0;for(const a of x)for(const b of y)u+=a>b?1:a===b?0.5:0;const U=Math.min(u,x.length*y.length-u);const n=Math.min(x.length,y.length);const crit=x.length===y.length&&UCRIT[n]!=null?UCRIT[n]:null;return{U,sig:crit!=null&&U<=crit,n};}
const med=a=>{a=a.filter(v=>v!=null).slice().sort((p,q)=>p-q);return a.length?a[Math.floor((a.length-1)/2)]:null;};
const METRICS=[['party level',r=>r.final.partyLv],['gold earned per hour',r=>r.econPerHour&&r.econPerHour.goldEarned],['ore earned per hour',r=>r.econPerHour&&r.econPerHour.oreEarned],['fights won',r=>r.final.wins],['defeats',r=>r.final.defeats],['zones cleared',r=>Object.keys(r.zonesCleared||{}).length],['hours to clear Thornwood',r=>(r.zonesCleared||{})['Thornwood']],['boss attempts',r=>Object.values(r.bossFailRates||{}).reduce((a,b)=>a+(b.attempts||0),0)],['RNG calls',r=>r.rngCalls],['taps per active second',r=>r.tapsPerActiveSec]];
function compareStat(){
  header();const fails=[];let flagged=0,tests=0;const hashes=[];
  for(const p of PROFILES)for(const sp of SPEEDS){const O=[],N=[];for(let s=SEED0;s<SEED0+SEEDS;s++){try{O.push(readJ({side:'old',p,s,sp}));N.push(readJ({side:'new',p,s,sp}));}catch(e){fails.push(p+' seed '+s+' x'+sp+': missing result ('+e.message+')');}}
    if(!O.length)continue;
    for(const r of N)if(r.assertFail)fails.push(p+' x'+sp+' seed '+r.config.seed+': new harness assertion failed: '+JSON.stringify(r.assertFail));
    // determinism: the first seed ran twice on the new harness
    try{const a=readJ({side:'new',p,s:SEED0,sp}),b=readJ({side:'new2',p,s:SEED0,sp});const {SA,SB}=shared(a,b);if(H(SA)!==H(SB)||a.rngCalls!==b.rngCalls)fails.push(p+' x'+sp+' seed '+SEED0+': the new harness is not deterministic (hash '+H(SA)+' vs '+H(SB)+', rng '+a.rngCalls+' vs '+b.rngCalls+')');}catch(e){fails.push(p+' x'+sp+': determinism run missing ('+e.message+')');}
    console.log('\n  '+p+' x'+sp+'  (n='+O.length+' seeds per side)');console.log('    '+'metric'.padEnd(28)+'old median'.padStart(12)+'new median'.padStart(12)+'   rel diff   U   verdict');
    for(const [name,fn] of METRICS){const x=O.map(r=>{try{return fn(r);}catch(e){return null;}}),y=N.map(r=>{try{return fn(r);}catch(e){return null;}});const mo=med(x),mn=med(y);if(mo==null&&mn==null)continue;tests++;const mw=mannWhitney(x,y);const rel=mo?Math.abs(mn-mo)/Math.abs(mo):(mn?1:0);const flag=mw.sig&&rel>0.15;if(flag)flagged++;
      console.log('    '+name.padEnd(28)+String(mo==null?'-':+mo.toFixed(2)).padStart(12)+String(mn==null?'-':+mn.toFixed(2)).padStart(12)+('   '+(rel*100).toFixed(0)+'%').padStart(10)+String(mw.U).padStart(5)+'   '+(flag?'SHIFT (rank test significant and median moved >15%)':mw.sig?'rank test significant, median within 15%':'no evidence of a shift'));}
    for(const r of N){const {SA}=shared(r,r);hashes.push(p+'_'+r.config.seed+'_x'+sp+' '+H(canon(r)));}}
  console.log('\n  distribution tests: '+tests+', flagged shifts: '+flagged+' (a flag needs both a significant rank test and a median moved by more than 15%; at 5% significance about one test in twenty flags by chance)');
  if(flagged>Math.max(1,Math.round(tests*0.1)))fails.push('more distribution shifts than chance explains: '+flagged+' of '+tests);
  console.log('  new canonical hashes (the reference for future exact gates):');for(const h of hashes)console.log('    '+h);
  finish(fails,'distributions equivalent, new harness deterministic');
}
