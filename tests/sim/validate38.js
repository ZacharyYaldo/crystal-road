// Validity gate for the pass 38 reference baselines (and any later batch).
// Rejects a run when: assertFail is set; config.dt is not the expected step; config.speed is not the expected speed;
// config.frameCap is not 0.05; simHours is short; or a garrison post that was due for its one-hour recall check never completed it.
// Usage: node tests/sim/validate38.js --dir batch_out_base38 --dt 0.016666667 --speed 1 --hours 96
'use strict';
const fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const dir=path.join(__dirname,String(args.dir||'batch_out_base38')),DT=Number(args.dt||1/60),SPEED=Number(args.speed||1),HOURS=Number(args.hours||96);
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.json')&&f!=='summary.json').sort();
let ok=0;const rejects=[],perProfile={};
for(const f of files){
  const r=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')),c=r.config||{},why=[];
  if(r.assertFail)why.push('assertFail: '+JSON.stringify(r.assertFail));
  if(!(Math.abs((c.dt||0)-DT)<1e-6))why.push('dt '+c.dt+' != '+DT.toFixed(6));
  if((c.speed||1)!==SPEED)why.push('speed '+(c.speed||1)+' != '+SPEED);
  if(c.frameCap!==0.05)why.push('frameCap '+c.frameCap);
  if(!(r.simHours>=HOURS-1e-6))why.push('simHours '+r.simHours);
  const posts=r.postChecks||[];const endSec=(r.simHours||0)*3600;
  const due=posts.filter(p=>endSec-p.at>=3600+1),incomplete=due.filter(p=>!p.done),bad0=posts.filter(p=>!(p.left0>3599&&p.left0<=3600));
  if(incomplete.length)why.push('garrison checks incomplete: '+incomplete.map(p=>p.name+'@'+(p.at/3600).toFixed(1)+'h').join(','));
  if(bad0.length)why.push('post timer wrong at posting: '+bad0.map(p=>p.name+' '+p.left0).join(','));
  const prof=c.profile||f.split('_')[0];perProfile[prof]=perProfile[prof]||{ok:0,rej:0,posts:0,due:0,pending:0};
  perProfile[prof].posts+=posts.length;perProfile[prof].due+=due.length;perProfile[prof].pending+=posts.length-due.length;
  if(why.length){rejects.push(f+': '+why.join(' | '));perProfile[prof].rej++;}else{ok++;perProfile[prof].ok++;}
}
console.log('dir '+path.basename(dir)+'  expected dt '+DT.toFixed(6)+' speed '+SPEED+' hours '+HOURS);
console.log('runs '+files.length+'  valid '+ok+'  rejected '+rejects.length);
for(const p of Object.keys(perProfile)){const s=perProfile[p];console.log('  '+p.padEnd(10)+' valid '+s.ok+' rejected '+s.rej+' | garrison posts '+s.posts+', due checks '+s.due+' (all completed unless listed), pending at end '+s.pending);}
for(const r of rejects)console.log('REJECT '+r);
process.exitCode=rejects.length?1:0;
