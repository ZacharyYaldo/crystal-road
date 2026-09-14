// Validity gate for reference baselines. No bypass flags.
// A batch passes only when: the directory holds exactly the expected matrix (profiles x seeds) and nothing else besides manifest.json and summary.json;
// every run has assertFail null, explicit config.dt / config.speed / config.hours / config.frameCap / config.seed / config.profile matching expectations,
// simHours >= hours, provenance (commit, gameHash, harnessHash) equal to the values given on the command line, at least one completed garrison check,
// every due garrison check completed and every post timer correct; and manifest.json lists every run with a matching sha256.
// Usage: node tests/sim/validate38.js --dir batch_out_base40 --dt 0.016666667 --speed 1 --hours 96 --profiles idleboost,light,casual,engaged --seedStart 71 --seeds 10 --commit <sha> --gameHash <16hex> --harnessHash <16hex:16hex>
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const need=['dir','dt','speed','hours','profiles','seedStart','seeds','commit','gameHash','harnessHash'];const missingArgs=need.filter(k=>args[k]==null);
if(missingArgs.length){console.log('GATE FAIL: missing required arguments: '+missingArgs.join(', '));process.exitCode=1;}
else{
const dir=path.join(__dirname,String(args.dir)),DT=Number(args.dt),SPEED=Number(args.speed),HOURS=Number(args.hours);
const PROFILES=String(args.profiles).split(','),SEED0=Number(args.seedStart),NSEEDS=Number(args.seeds);
const EXP={commit:String(args.commit),gameHash:String(args.gameHash),harnessHash:String(args.harnessHash)};
const expected=[];for(const p of PROFILES)for(let s=SEED0;s<SEED0+NSEEDS;s++)expected.push(p+'_'+s+'.json');
const present=fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>f.endsWith('.json')):[];
const unexpected=present.filter(f=>!expected.includes(f)&&f!=='summary.json'&&f!=='manifest.json');
const missing=expected.filter(f=>!present.includes(f)),files=expected.filter(f=>present.includes(f));
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,f))).digest('hex');
let manifest=null,manifestWhy=[];
if(present.includes('manifest.json')){try{manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));}catch(e){manifestWhy.push('manifest unreadable: '+e.message);}}
else manifestWhy.push('manifest.json missing');
if(manifest){for(const k of ['commit','gameHash','harnessHash'])if(manifest[k]!==EXP[k])manifestWhy.push('manifest '+k+' '+manifest[k]+' != expected '+EXP[k]);
  for(const f of expected){if(!manifest.files||!manifest.files[f])manifestWhy.push('manifest lacks '+f);else if(present.includes(f)&&manifest.files[f]!==sha(f))manifestWhy.push('sha256 mismatch for '+f);}}
let ok=0;const rejects=[],perProfile={};
for(const f of files){
  const r=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')),c=r.config||{},why=[];
  if(r.assertFail)why.push('assertFail: '+JSON.stringify(r.assertFail));
  if(c.dt==null||!(Math.abs(c.dt-DT)<1e-6))why.push('dt '+c.dt+' != '+DT.toFixed(6));
  if(c.speed==null)why.push('config.speed missing');else if(c.speed!==SPEED)why.push('speed '+c.speed+' != '+SPEED);
  if(c.frameCap!==0.05)why.push('frameCap '+c.frameCap);
  if(c.hours!==HOURS)why.push('config.hours '+c.hours+' != '+HOURS);
  if(!(r.simHours>=HOURS-1e-6))why.push('simHours '+r.simHours);
  const fseed=Number(f.replace(/^.*_(\d+)\.json$/,'$1')),fprof=f.replace(/_\d+\.json$/,'');
  if(c.seed!==fseed)why.push('seed '+c.seed+' != file '+fseed);if(c.profile!==fprof)why.push('profile '+c.profile+' != file '+fprof);
  for(const k of ['commit','gameHash','harnessHash']){if(!c[k])why.push('no '+k+' recorded');else if(c[k]!==EXP[k])why.push(k+' '+c[k]+' != expected '+EXP[k]);}
  const posts=r.postChecks||[];const endSec=(r.simHours||0)*3600;
  const due=posts.filter(p=>endSec-p.at>=3600+1),incomplete=due.filter(p=>!p.done),bad0=posts.filter(p=>!(p.left0>3599&&p.left0<=3600));
  if(incomplete.length)why.push('garrison checks incomplete: '+incomplete.map(p=>p.name+'@'+(p.at/3600).toFixed(1)+'h').join(','));
  if(bad0.length)why.push('post timer wrong at posting: '+bad0.map(p=>p.name+' '+p.left0).join(','));
  if(!due.some(p=>p.done))why.push('no completed garrison check in this run');
  const prof=c.profile||fprof;perProfile[prof]=perProfile[prof]||{ok:0,rej:0,posts:0,due:0};perProfile[prof].posts+=posts.length;perProfile[prof].due+=due.length;
  if(why.length){rejects.push(f+': '+why.join(' | '));perProfile[prof].rej++;}else{ok++;perProfile[prof].ok++;}
}
for(const m of missing)rejects.push(m+': MISSING');
for(const u of unexpected)rejects.push(u+': UNEXPECTED FILE');
for(const w of manifestWhy)rejects.push('MANIFEST: '+w);
console.log('dir '+path.basename(dir)+'  expected dt '+DT.toFixed(6)+' speed '+SPEED+' hours '+HOURS+'  commit '+EXP.commit.slice(0,10)+' game '+EXP.gameHash+' harness '+EXP.harnessHash);
console.log('matrix '+expected.length+' runs ('+PROFILES.join(',')+' x seeds '+SEED0+'-'+(SEED0+NSEEDS-1)+')  present '+files.length+'  missing '+missing.length+'  unexpected '+unexpected.length+'  valid '+ok+'  rejected '+(rejects.length));
for(const p of Object.keys(perProfile)){const s=perProfile[p];console.log('  '+p.padEnd(10)+' valid '+s.ok+' rejected '+s.rej+' | garrison posts '+s.posts+', due checks '+s.due);}
for(const r of rejects)console.log('REJECT '+r);
const gateOK=!rejects.length&&ok===expected.length&&expected.length>0&&manifest;
console.log(gateOK?'GATE PASS':'GATE FAIL');process.exitCode=gateOK?0:1;}
