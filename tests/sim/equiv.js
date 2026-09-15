// Optimization-equivalence gate for the simulator harness.
// Runs the harness as committed at --ref (bot.js + headless.js taken from git, with the CURRENT source/game.js and build/assets.json alongside)
// and the harness in the working tree on identical seeds, profiles and speeds, then demands identical results:
// assertions, RNG-call count and final RNG state, final currencies and progress, milestones (zone clears, Shatters, recruits, promotions,
// Endless), roster and gear, boss outcomes, hourly series, events, and the canonical hash of the whole result
// (volatile fields removed: commit, harness hash, real times). Fields present on only one side (new telemetry) are listed and do not
// fail the gate; everything shared must match byte for byte. Speeds 1 and 2 are the equivalence surface; balance batches never run at 1x.
// Usage: node tests/sim/equiv.js --ref <commit> [--seeds 3] [--seedStart 900] [--profiles idleboost,engaged] [--speeds 1,2] [--hours 3] [--workers 4] [--keep]
'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),cp=require('child_process'),crypto=require('crypto');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
if(!args.ref){console.log('EQUIV FAIL: --ref <commit> is required (the harness version to compare against)');process.exit(1);}
const ROOT=path.join(__dirname,'..','..'),REF=String(args.ref),SEEDS=Number(args.seeds||3),SEED0=Number(args.seedStart||900),HOURS=Number(args.hours||3),WORKERS=Number(args.workers||4);
const PROFILES=String(args.profiles||'idleboost,engaged').split(','),SPEEDS=String(args.speeds||'1,2').split(',').map(Number);
const refCommit=cp.execSync('git rev-parse '+REF,{cwd:ROOT}).toString().trim();
const tmp=path.join(os.tmpdir(),'crystal-equiv',refCommit.slice(0,10));
const oldDir=path.join(tmp,'old'),outDir=path.join(tmp,'out');
fs.rmSync(tmp,{recursive:true,force:true});
for(const d of ['source','build','tests/sim'])fs.mkdirSync(path.join(oldDir,d),{recursive:true});fs.mkdirSync(outDir,{recursive:true});
for(const f of ['bot.js','headless.js'])fs.writeFileSync(path.join(oldDir,'tests/sim',f),cp.execSync('git show '+refCommit+':tests/sim/'+f,{cwd:ROOT,maxBuffer:1<<26}));
fs.copyFileSync(path.join(ROOT,'source/game.js'),path.join(oldDir,'source/game.js'));fs.copyFileSync(path.join(ROOT,'build/assets.json'),path.join(oldDir,'build/assets.json'));
const jobs=[];for(const p of PROFILES)for(let s=SEED0;s<SEED0+SEEDS;s++)for(const sp of SPEEDS)for(const side of ['old','new'])jobs.push({p,s,sp,side});
const botOf=side=>side==='old'?path.join(oldDir,'tests/sim/bot.js'):path.join(__dirname,'bot.js');
const fileOf=j=>path.join(outDir,j.side+'_'+j.p+'_'+j.s+'_x'+j.sp+'.json');
const t0=Date.now();const wall={old:0,new:0};let idx=0,done=0;
function next(){if(idx>=jobs.length)return;const j=jobs[idx++];const a=[botOf(j.side),'--hours',String(HOURS),'--seed',String(j.s),'--profile',j.p,'--speed',String(j.sp),'--quiet','--json',fileOf(j)];const t=Date.now();const c=cp.spawn(process.execPath,a,{stdio:['ignore','ignore','inherit']});c.on('exit',()=>{wall[j.side]+=Date.now()-t;done++;process.stdout.write('\r'+done+'/'+jobs.length+' runs ('+((Date.now()-t0)/1000).toFixed(0)+'s)   ');if(done===jobs.length)compare();else next();});}
for(let i=0;i<Math.min(WORKERS,jobs.length);i++)next();
const VOLATILE=/^(commit|harnessHash|realSec|realSeconds|wallSec|elapsedSec)$/;
function canon(o){if(Array.isArray(o))return o.map(canon);if(o&&typeof o==='object'){const r={};for(const k of Object.keys(o).sort()){if(VOLATILE.test(k))continue;r[k]=canon(o[k]);}return r;}return o;}
function shared(a,b){const A=canon(a),B=canon(b);const onlyA=Object.keys(A).filter(k=>!(k in B)),onlyB=Object.keys(B).filter(k=>!(k in A));const SA={},SB={};for(const k of Object.keys(A))if(k in B){SA[k]=A[k];SB[k]=B[k];}return{SA,SB,onlyA,onlyB};}
const H=o=>crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0,16);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function compare(){
  console.log('\nequivalence gate: ref '+refCommit.slice(0,10)+' (old harness) vs working tree (new harness), same source/game.js, '+PROFILES.join('/')+' x seeds '+SEED0+'-'+(SEED0+SEEDS-1)+' x speeds '+SPEEDS.join('/')+', '+HOURS+'h each');
  const fails=[];let pairs=0;const newFields=new Set(),lostFields=new Set();
  for(const p of PROFILES)for(let s=SEED0;s<SEED0+SEEDS;s++)for(const sp of SPEEDS){pairs++;const key=p+' seed '+s+' x'+sp;
    let a,b;try{a=JSON.parse(fs.readFileSync(fileOf({side:'old',p,s,sp})));b=JSON.parse(fs.readFileSync(fileOf({side:'new',p,s,sp})));}catch(e){fails.push(key+': missing result ('+e.message+')');continue;}
    const {SA,SB,onlyA,onlyB}=shared(a,b);onlyB.forEach(k=>newFields.add(k));onlyA.forEach(k=>lostFields.add(k));
    const checks=[['assertions',a.assertFail||null,b.assertFail||null],['final (currencies, progress)',a.final,b.final],['milestones: zones cleared',a.zonesCleared,b.zonesCleared],['milestones: Shatters',a.shatters,b.shatters],['milestones: recruits',a.recruits,b.recruits],['milestones: promotions',a.promotions,b.promotions],['milestones: Endless',a.endless,b.endless],['boss outcomes',a.bossFailRates,b.bossFailRates],['hourly series',a.hourly,b.hourly],['events',a.events,b.events]];
    if(a.rngCalls!=null&&b.rngCalls!=null)checks.push(['RNG calls',a.rngCalls,b.rngCalls],['RNG state',a.rngState,b.rngState]);
    if(a.roster&&b.roster)checks.push(['roster and gear',a.roster,b.roster]);
    for(const [name,x,y] of checks)if(!same(x,y))fails.push(key+': '+name+' differ: old '+JSON.stringify(x).slice(0,120)+' | new '+JSON.stringify(y).slice(0,120));
    if(H(SA)!==H(SB)){const diffKeys=Object.keys(SA).filter(k=>!same(SA[k],SB[k]));fails.push(key+': canonical hash old '+H(SA)+' != new '+H(SB)+' (keys: '+diffKeys.join(',')+')');}
    else console.log('  '+key.padEnd(24)+' canonical '+H(SA)+'  rng '+(b.rngCalls!=null?b.rngCalls:'n/a')+(a.rngCalls==null&&b.rngCalls!=null?' (old side does not record RNG calls)':'')+'  identical');}
  if(newFields.size)console.log('fields only in the new harness (not compared): '+[...newFields].join(', '));
  if(lostFields.size)fails.push('fields the new harness no longer records: '+[...lostFields].join(', '));
  console.log('wall time per run: old '+(wall.old/1000/(jobs.length/2)).toFixed(1)+'s  new '+(wall.new/1000/(jobs.length/2)).toFixed(1)+'s  ('+((1-wall.new/wall.old)*100).toFixed(0)+'% faster)');
  for(const f of fails)console.log('DIFF '+f);
  console.log(fails.length?'EQUIV FAIL':'EQUIV PASS ('+pairs+' pairs identical)');
  if(!args.keep)fs.rmSync(tmp,{recursive:true,force:true});
  process.exit(fails.length?1:0);
}
