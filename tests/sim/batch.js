// Batch runner: many seeds x profiles in parallel, then P10 / median / P90 per profile.
// Usage: node tests/sim/batch.js --seeds 20 --hours 24 [--profiles idle,casual,active] [--shatters 3] [--workers 10] [--out batch.json]
'use strict';
const {spawn}=require('child_process'),path=require('path'),fs=require('fs'),os=require('os');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const SEEDS=args.seeds||10,HOURS=args.hours||24,PROFILES=String(args.profiles||'idle,casual,active').split(','),WORKERS=args.workers||Math.max(1,os.cpus().length-2),SHATTERS=args.shatters||0;
const dir=path.join(__dirname,'batch_out');fs.mkdirSync(dir,{recursive:true});
const jobs=[];for(const p of PROFILES)for(let s=1;s<=SEEDS;s++)jobs.push({p,s,file:path.join(dir,p+'_'+s+'.json')});
let idx=0,done=0;const t0=Date.now();
function next(){if(idx>=jobs.length)return;const j=jobs[idx++];const a=[path.join(__dirname,'bot.js'),'--hours',String(HOURS),'--seed',String(j.s),'--profile',j.p,'--quiet','--json',j.file];if(SHATTERS)a.push('--shatters',String(SHATTERS));const c=spawn(process.execPath,a,{stdio:['ignore','ignore','inherit']});c.on('exit',()=>{done++;process.stdout.write('\r'+done+'/'+jobs.length+' done ('+((Date.now()-t0)/60000).toFixed(1)+' min)   ');if(done===jobs.length)report();else next();});}
for(let i=0;i<Math.min(WORKERS,jobs.length);i++)next();
function pct(arr,q){const a=arr.filter(v=>v!=null&&!isNaN(v)).sort((x,y)=>x-y);if(!a.length)return null;const i=(a.length-1)*q;const lo=Math.floor(i),hi=Math.ceil(i);return +(a[lo]+(a[hi]-a[lo])*(i-lo)).toFixed(2);}
function report(){console.log('\n');const rows=[];const all={};for(const j of jobs){try{(all[j.p]=all[j.p]||[]).push(JSON.parse(fs.readFileSync(j.file,'utf8')));}catch(e){}}
  const metric=(name,fn)=>{const row={metric:name};for(const p of PROFILES){const vals=(all[p]||[]).map(r=>{try{return fn(r);}catch(e){return null;}});row[p]=[pct(vals,0.1),pct(vals,0.5),pct(vals,0.9)];}rows.push(row);};
  const zones=['Greenhollow Fields','Stillwater Lagoon','Thornwood','Ironvein Caverns','Emberwaste','Amberfall Woods','Ashen Approach','Ashen Keep','The Foundry'];
  for(const z of zones)metric('clear '+z+' (h)',r=>r.zonesCleared[z]);
  metric('zones cleared @end',r=>Object.keys(r.zonesCleared).length);
  metric('party Lv @end',r=>r.final.partyLv);
  for(const k of ['first rare','first epic','first legendary','first talent','first T1','first T2','shatter 1','shatter 2','shatter 3'])metric(k+' (h)',r=>r.firsts[k]);
  for(const z of zones)metric('boss fail% '+z,r=>r.bossFailRates[z]?Math.round(r.bossFailRates[z].rate*100):null);
  for(const z of zones)metric('boss max streak '+z,r=>r.bossFailRates[z]?r.bossFailRates[z].maxStreak:null);
  for(const z of zones)metric('boss stall h '+z,r=>r.bossFailRates[z]?r.bossFailRates[z].stallH:null);
  for(const k of ['basic','ability','tap','surge'])metric('dmg share '+k+' %',r=>Math.round((r.dmgShare[k]||0)*100));
  metric('gold earned/h',r=>r.econPerHour.goldEarned);metric('ore earned/h',r=>r.econPerHour.oreEarned);
  metric('defeats @end',r=>r.final.defeats);
  const w=Math.max(...rows.map(r=>r.metric.length))+1;const cell=v=>v&&v[1]!=null?(v[0]+' / '+v[1]+' / '+v[2]).padEnd(22):'-'.padEnd(22);
  console.log('metric'.padEnd(w)+PROFILES.map(p=>(p+' (P10/med/P90)').padEnd(22)).join(''));
  for(const r of rows){if(PROFILES.every(p=>!r[p]||r[p][1]==null))continue;console.log(r.metric.padEnd(w)+PROFILES.map(p=>cell(r[p])).join(''));}
  const outFile=args.out||path.join(dir,'summary.json');fs.writeFileSync(outFile,JSON.stringify({config:{SEEDS,HOURS,PROFILES,SHATTERS},rows},null,1));console.log('\nwritten '+outFile);}
