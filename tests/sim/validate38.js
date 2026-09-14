// Validity gate for the pass 38 reference baselines (and any later batch).
// Rejects a run when: assertFail is set; config.dt is not the expected step; config.speed is not the expected speed;
// config.frameCap is not 0.05; simHours is short; or a garrison post that was due for its one-hour recall check never completed it.
// Usage: node tests/sim/validate38.js --dir batch_out_base38 --dt 0.016666667 --speed 1 --hours 96
'use strict';
const fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const dir=path.join(__dirname,String(args.dir||'batch_out_base38')),DT=Number(args.dt||1/60),SPEED=Number(args.speed||1),HOURS=Number(args.hours||96);
const PROFILES=String(args.profiles||'idleboost,light,casual,engaged').split(','),SEED0=Number(args.seedStart||71),NSEEDS=Number(args.seeds||10);
const expected=[];for(const p of PROFILES)for(let s=SEED0;s<SEED0+NSEEDS;s++)expected.push(p+'_'+s+'.json');
const present=fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>f.endsWith('.json')&&f!=='summary.json'):[];const missing=expected.filter(f=>!present.includes(f));const files=expected.filter(f=>present.includes(f));
let ok=0;const rejects=[],perProfile={},prov={};
for(const f of files){
  const r=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')),c=r.config||{},why=[];
  if(r.assertFail)why.push('assertFail: '+JSON.stringify(r.assertFail));
  if(!(Math.abs((c.dt||0)-DT)<1e-6))why.push('dt '+c.dt+' != '+DT.toFixed(6));
  if((c.speed||1)!==SPEED)why.push('speed '+(c.speed||1)+' != '+SPEED);
  if(c.frameCap!==0.05)why.push('frameCap '+c.frameCap);
  if(!(r.simHours>=HOURS-1e-6))why.push('simHours '+r.simHours);
  const fseed=Number(f.replace(/^.*_(\d+)\.json$/,'$1')),fprof=f.replace(/_\d+\.json$/,'');if(c.seed!==fseed)why.push('seed '+c.seed+' != file '+fseed);if(c.profile!==fprof)why.push('profile '+c.profile+' != file '+fprof);if(c.hours!==HOURS)why.push('config.hours '+c.hours);
  if(!c.commit||!c.gameHash||!c.harnessHash){if(!args.allowMissingProvenance)why.push('no provenance (commit/gameHash/harnessHash)');}else{prov[c.commit+'|'+c.gameHash+'|'+c.harnessHash]=(prov[c.commit+'|'+c.gameHash+'|'+c.harnessHash]||0)+1;if(args.commit&&!String(c.commit).startsWith(String(args.commit)))why.push('commit '+c.commit+' != '+args.commit);}
  const posts=r.postChecks||[];const endSec=(r.simHours||0)*3600;
  const due=posts.filter(p=>endSec-p.at>=3600+1),incomplete=due.filter(p=>!p.done),bad0=posts.filter(p=>!(p.left0>3599&&p.left0<=3600));
  if(incomplete.length)why.push('garrison checks incomplete: '+incomplete.map(p=>p.name+'@'+(p.at/3600).toFixed(1)+'h').join(','));
  if(bad0.length)why.push('post timer wrong at posting: '+bad0.map(p=>p.name+' '+p.left0).join(','));
  if(!due.some(p=>p.done))why.push('no completed garrison check in this run');
  const prof=c.profile||f.split('_')[0];perProfile[prof]=perProfile[prof]||{ok:0,rej:0,posts:0,due:0,pending:0};
  perProfile[prof].posts+=posts.length;perProfile[prof].due+=due.length;perProfile[prof].pending+=posts.length-due.length;
  if(why.length){rejects.push(f+': '+why.join(' | '));perProfile[prof].rej++;}else{ok++;perProfile[prof].ok++;}
}
console.log('dir '+path.basename(dir)+'  expected dt '+DT.toFixed(6)+' speed '+SPEED+' hours '+HOURS);
console.log('expected matrix '+expected.length+' runs ('+PROFILES.join(',')+' x seeds '+SEED0+'-'+(SEED0+NSEEDS-1)+')  present '+files.length+'  missing '+missing.length+'  valid '+ok+'  rejected '+rejects.length);
for(const m of missing)rejects.push(m+': MISSING');
const provKeys=Object.keys(prov);console.log('provenance sets: '+(provKeys.length?provKeys.map(k=>k+' x'+prov[k]).join(' ; '):'none recorded'+(args.allowMissingProvenance?' (allowed by flag)':'')));if(provKeys.length>1)rejects.push('mixed provenance across runs');
if(!expected.length)rejects.push('empty matrix');
for(const p of Object.keys(perProfile)){const s=perProfile[p];console.log('  '+p.padEnd(10)+' valid '+s.ok+' rejected '+s.rej+' | garrison posts '+s.posts+', due checks '+s.due+' (all completed unless listed), pending at end '+s.pending);}
for(const r of rejects)console.log('REJECT '+r);
const gateOK=!rejects.length&&ok===expected.length&&expected.length>0;console.log(gateOK?'GATE PASS':'GATE FAIL');process.exitCode=gateOK?0:1;
