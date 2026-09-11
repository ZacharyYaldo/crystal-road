// Whole-Road triage from an existing batch output folder: per zone and profile, reach/clear counts, time in zone, boss stats, rewalk and training burden.
// Usage: node tests/sim/triage.js --dir batch_out_p14x [--profiles idle,light,casual,engaged,stress] [--hours 24]
'use strict';
const fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const P=String(args.profiles||'idle,light,casual,engaged,stress').split(',');const dir=path.join(__dirname,String(args.dir||'batch_out_p14x'));
const zones=['Greenhollow Fields','Stillwater Lagoon','Thornwood','Ironvein Caverns','Emberwaste','Amberfall Woods','Ashen Approach','Ashen Keep'];
const srt=a=>a.filter(v=>v!=null&&!isNaN(v)).sort((x,y)=>x-y);const med=a=>{a=srt(a);return a.length?a[Math.floor((a.length-1)/2)]:null;};const p90=a=>{a=srt(a);return a.length?a[Math.min(a.length-1,Math.ceil((a.length-1)*0.9))]:null;};const f=(v,d=1)=>v==null?'-':String(+(+v).toFixed(d));
const R={};for(const p of P)R[p]=fs.readdirSync(dir).filter(x=>x.startsWith(p+'_')&&x.endsWith('.json')).map(x=>JSON.parse(fs.readFileSync(path.join(dir,x),'utf8')));
const rowsOut=[];
for(const p of P){console.log('\n=== '+p.toUpperCase()+'  (n='+R[p].length+' runs, '+String(args.hours||24)+'h)');
  console.log('zone'.padEnd(18)+'enter/clear'.padEnd(12)+'entry Lv'.padEnd(9)+'clear h med/P90'.padEnd(17)+'h in zone'.padEnd(10)+'train h'.padEnd(8)+'boss 1st%'.padEnd(10)+'att med/P90'.padEnd(12)+'streak'.padEnd(7)+'stall h'.padEnd(8)+'ord rewalk h'.padEnd(13)+'boss rewalk h'.padEnd(14)+'burden h'.padEnd(9)+'ord def/h');
  for(const z of zones){const rs=R[p];const entered=rs.filter(r=>r.zoneRec&&r.zoneRec[z]),cleared=rs.filter(r=>r.zonesCleared[z]!=null);if(!entered.length)continue;
    const inZone=rs.map(r=>r.zoneRec[z]&&r.zoneRec[z].hours!=null?r.zoneRec[z].hours:null);const zt=rs.map(r=>r.zoneTime&&r.zoneTime[z]?r.zoneTime[z].sec/3600:null);const tt=rs.map(r=>r.zoneTime&&r.zoneTime[z]?r.zoneTime[z].trainSec/3600:null);
    const b=rs.map(r=>r.bossFailRates[z]).filter(Boolean);const ft=b.filter(x=>x.firstTryClear!=null);
    const ordH=rs.map(r=>r.byZone&&r.byZone[z]&&r.deadTime?r.byZone[z].rewalk*r.deadTime.secPerEncounter/3600:null),bossH=rs.map(r=>r.byZone&&r.byZone[z]&&r.deadTime?r.byZone[z].bossRewalk*r.deadTime.secPerEncounter/3600:null);
    const trainH=rs.map(r=>{const L=(r.autoTrain&&r.autoTrain.log||[]).filter(l=>l.ret===z&&l.secs!=null);return L.reduce((a,l)=>a+l.secs,0)/3600;});
    const burden=rs.map((r,i)=>{const o=ordH[i]||0,bh=bossH[i]||0,t=trainH[i]||0,st=b.find(x=>x===r.bossFailRates[z]);return o+bh+t+((r.bossFailRates[z]&&r.bossFailRates[z].combatStallH)||0);});
    const defRate=rs.map(r=>{const bz=r.byZone&&r.byZone[z],t=r.zoneTime&&r.zoneTime[z];return bz&&t&&t.sec>600?bz.defeats/(t.sec/3600):null;});
    const line=z.padEnd(18)+(entered.length+'/'+cleared.length).padEnd(12)+f(med(entered.map(r=>r.zoneRec[z].lvAtEntry)),0).padEnd(9)+(cleared.length?f(med(cleared.map(r=>r.zonesCleared[z])),1)+'/'+f(p90(cleared.map(r=>r.zonesCleared[z])),1):'-').padEnd(17)+f(med(zt),1).padEnd(10)+f(med(tt),1).padEnd(8)+(ft.length?Math.round(100*ft.filter(x=>x.firstTryClear).length/ft.length)+'% n'+ft.length:'-').padEnd(10)+(b.length?f(med(b.map(x=>x.attemptsToClear)),0)+'/'+f(p90(b.map(x=>x.attemptsToClear)),0):'-').padEnd(12)+f(med(b.map(x=>x.maxStreak)),0).padEnd(7)+f(med(b.map(x=>x.stallH)),2).padEnd(8)+f(med(ordH),2).padEnd(13)+f(med(bossH),2).padEnd(14)+f(med(burden),2).padEnd(9)+f(med(defRate),1);
    console.log(line);rowsOut.push({p,z,entered:entered.length,cleared:cleared.length,burden:med(burden),stall:med(b.map(x=>x.stallH)),firstTry:ft.length?ft.filter(x=>x.firstTryClear).length/ft.length:null,attempts:med(b.map(x=>x.attemptsToClear)),att90:p90(b.map(x=>x.attemptsToClear)),hours:med(zt),train:med(tt),trainFor:med(trainH),ordH:med(ordH),bossH:med(bossH)});}}
console.log('\n=== RANK by median burden hours (ordinary rewalk + boss rewalk + training for the zone + boss combat), realistic profiles, zones cleared by >=10 runs');
const ranked=rowsOut.filter(r=>['idle','light','casual'].includes(r.p)&&r.cleared>=10).sort((a,b)=>b.burden-a.burden);
for(const r of ranked.slice(0,12))console.log((r.p+' '+r.z).padEnd(28)+'burden '+f(r.burden,2)+'h  (train-for-zone '+f(r.trainFor,2)+' train-in-zone '+f(r.train,2)+' ord-rewalk '+f(r.ordH,2)+' boss-rewalk '+f(r.bossH,2)+')  hours-in-zone '+f(r.hours,1)+'  boss 1st '+(r.firstTry==null?'-':Math.round(100*r.firstTry)+'%')+' att '+f(r.attempts,0)+'/'+f(r.att90,0)+' stall '+f(r.stall,2)+'  cleared '+r.cleared+'/'+r.entered);
