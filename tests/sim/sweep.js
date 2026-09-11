// Boss tuning sweep: several HP/ATK variants for one zone's boss, few seeds, chosen profiles.
// Usage: node tests/sim/sweep.js --zone 1 --variants 0.70/0.80,0.67/0.78,0.64/0.76,0.62/0.75 --seeds 5 --profiles casual,engaged --hours 12
'use strict';
const {spawn}=require('child_process'),path=require('path'),fs=require('fs'),os=require('os');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const ZONE=args.zone==null?1:Number(args.zone),SEEDS=args.seeds||5,HOURS=args.hours||12,PROFILES=String(args.profiles||'casual,engaged').split(','),WORKERS=args.workers||Math.max(1,os.cpus().length-2);
const VARIANTS=String(args.variants||'0.70/0.80,0.67/0.78,0.64/0.76,0.62/0.75').split(',').map(v=>{const [hp,atk]=v.split('/').map(Number);return{hp,atk,key:hp+'/'+atk};});
const ZONES=['Greenhollow Fields','Stillwater Lagoon','Thornwood','Ironvein Caverns','Emberwaste','Amberfall Woods','Ashen Approach','Ashen Keep','The Foundry'];
const zoneName=ZONES[ZONE];
const dir=path.join(__dirname,'sweep_out');fs.mkdirSync(dir,{recursive:true});
const jobs=[];for(const v of VARIANTS)for(const p of PROFILES)for(let s=1;s<=SEEDS;s++)jobs.push({v,p,s,file:path.join(dir,`${v.hp}_${v.atk}_${p}_${s}.json`)});
let idx=0,done=0;const t0=Date.now();
function next(){if(idx>=jobs.length)return;const j=jobs[idx++];const a=[path.join(__dirname,'bot.js'),'--hours',String(HOURS),'--seed',String(j.s),'--profile',j.p,'--quiet','--json',j.file,'--bossZone',String(ZONE),'--bossHp',String(j.v.hp),'--bossAtk',String(j.v.atk)];const c=spawn(process.execPath,a,{stdio:['ignore','ignore','inherit']});c.on('exit',()=>{done++;process.stdout.write('\r'+done+'/'+jobs.length+' ('+((Date.now()-t0)/60000).toFixed(1)+' min)   ');if(done===jobs.length)report();else next();});}
for(let i=0;i<Math.min(WORKERS,jobs.length);i++)next();
function pct(arr,q){const a=arr.filter(v=>v!=null&&!isNaN(v)).sort((x,y)=>x-y);if(!a.length)return null;const i=(a.length-1)*q;const lo=Math.floor(i),hi=Math.ceil(i);return +(a[lo]+(a[hi]-a[lo])*(i-lo)).toFixed(2);}
function report(){console.log('\n\nSTILLWATER SWEEP  zone='+zoneName+'  seeds='+SEEDS+'  hours='+HOURS);
  const rows=[['variant','profile','n','1st-try%','attempts med','attempts P90','streak med','stall med','stall P90','Lv first','Lv clear','loss dur','win dur','bossHP left','wipe%','survivors','partyHP%','zone clear h']];
  for(const v of VARIANTS)for(const p of PROFILES){const rs=[];for(let s=1;s<=SEEDS;s++){try{rs.push(JSON.parse(fs.readFileSync(path.join(dir,`${v.hp}_${v.atk}_${p}_${s}.json`),'utf8')));}catch(e){}}
    const b=rs.map(r=>r.bossFailRates[zoneName]).filter(Boolean);const g=(f)=>b.map(f);
    rows.push([v.key,p,String(b.length),String(Math.round(100*g(x=>x.firstTryClear).filter(x=>x!=null).reduce((a,c)=>a+c,0)/Math.max(1,g(x=>x.firstTryClear).filter(x=>x!=null).length))),
      String(pct(g(x=>x.attemptsToClear),0.5)),String(pct(g(x=>x.attemptsToClear),0.9)),String(pct(g(x=>x.maxStreak),0.5)),String(pct(g(x=>x.stallH),0.5)),String(pct(g(x=>x.stallH),0.9)),String(pct(g(x=>x.lvFirst),0.5)),String(pct(g(x=>x.lvClear),0.5)),String(pct(g(x=>x.lossDur),0.5)),String(pct(g(x=>x.winDur),0.5)),String(pct(g(x=>x.hpLeft),0.5)),String(pct(g(x=>x.wipePct),0.5)),String(pct(g(x=>x.survivors),0.5)),String(pct(g(x=>x.partyHp),0.5)),String(pct(rs.map(r=>r.zonesCleared[zoneName]),0.5))]);}
  const widths=rows[0].map((_,i)=>Math.max(...rows.map(r=>String(r[i]==null?'-':r[i]).length))+2);
  for(const r of rows)console.log(r.map((c,i)=>String(c==null?'-':c).padEnd(widths[i])).join(''));
  fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify(rows,null,1));}
