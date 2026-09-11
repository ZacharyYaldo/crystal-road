// Auto Training by return zone for two paired arms: episodes, returns, retriggers, hours, fights, level progress, post-return win rates, plus per-zone arrival/boss/rewalk rows.
// Usage: node tests/sim/trainstats.js --a batch_out_p19c --b batch_out_p19x [--profiles idle,light,casual] [--seedStart 31 --seeds 10]
'use strict';
const fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const A=String(args.a||'batch_out_p19c'),B=String(args.b||'batch_out_p19x'),P=String(args.profiles||'idle,light,casual').split(','),S0=args.seedStart||31,N=args.seeds||10;
const zones=['Stillwater Lagoon','Thornwood','Ironvein Caverns','Emberwaste','Amberfall Woods','Ashen Approach','Ashen Keep'];
const srt=a=>a.filter(v=>v!=null&&!isNaN(v)).sort((x,y)=>x-y),med=a=>{a=srt(a);return a.length?a[Math.floor((a.length-1)/2)]:null},p90=a=>{a=srt(a);return a.length?a[Math.min(a.length-1,Math.ceil((a.length-1)*0.9))]:null},mean=a=>{a=a.filter(v=>v!=null&&!isNaN(v));return a.length?a.reduce((x,y)=>x+y,0)/a.length:null},f=(v,d=1)=>v==null?'-':(+v).toFixed(d);
const rd=(d,p,s)=>{const fp=path.join(__dirname,d,p+'_'+s+'.json');return fs.existsSync(fp)?JSON.parse(fs.readFileSync(fp,'utf8')):null;};
const pair=(va,vb)=>{const d=va.map((v,i)=>(vb[i]==null||v==null)?null:vb[i]-v).filter(x=>x!=null);return 'paired med '+f(med(d),2)+' (+'+d.filter(x=>x>0).length+' 0'+d.filter(x=>x===0).length+' -'+d.filter(x=>x<0).length+')';};
const cell=(va,vb,d=1)=>f(med(va),d)+' / '+f(p90(va),d)+' -> '+f(med(vb),d)+' / '+f(p90(vb),d);
for(const p of P){
  const RA=[],RB=[];for(let s=S0;s<S0+N;s++){const a=rd(A,p,s),b=rd(B,p,s);if(a&&b){RA.push(a);RB.push(b);}}
  console.log('\n===== '+p.toUpperCase()+'  n='+RA.length+' paired runs   ('+A+' -> '+B+')   values are med / P90 per run unless noted');
  const tot=rs=>rs.map(r=>r.autoTrain?r.autoTrain.timeSec/3600:null);
  console.log('total training hours          '+cell(tot(RA),tot(RB),1)+'   '+pair(tot(RA),tot(RB)));
  console.log('total triggers                '+cell(RA.map(r=>r.autoTrain.triggers),RB.map(r=>r.autoTrain.triggers),0)+'   completed returns '+cell(RA.map(r=>r.autoTrain.returns),RB.map(r=>r.autoTrain.returns),0)+'   cancels '+cell(RA.map(r=>r.autoTrain.cancels),RB.map(r=>r.autoTrain.cancels),0));
  for(const z of zones){
    const L=rs=>rs.map(r=>(r.autoTrain.log||[]).filter(l=>l.ret===z));
    const LA=L(RA),LB=L(RB);if(!LA.some(x=>x.length)&&!LB.some(x=>x.length)&&!RA.some(r=>r.zoneRec&&r.zoneRec[z])&&!RB.some(r=>r.zoneRec&&r.zoneRec[z]))continue;
    const hrs=Ls=>Ls.map(l=>l.reduce((a,x)=>a+(x.secs||0),0)/3600),eps=Ls=>Ls.map(l=>l.length),comp=Ls=>Ls.map(l=>l.filter(x=>x.afterReturn!=null||x.winAfter!=null).length),quick=Ls=>Ls.map(l=>l.filter(x=>x.quick).length),retr=Ls=>Ls.map(l=>l.filter(x=>x.retrigger).length),first=Ls=>Ls.map(l=>l.filter(x=>!x.retrigger).length);
    const fights=Ls=>Ls.map(l=>l.reduce((a,x)=>a+(x.fights||0),0));const firstH=Ls=>Ls.map(l=>l.filter(x=>!x.retrigger).reduce((a,x)=>a+(x.secs||0),0)/3600),retrH=Ls=>Ls.map(l=>l.filter(x=>x.retrigger).reduce((a,x)=>a+(x.secs||0),0)/3600);
    const pooled=Ls=>[].concat(...Ls);const pa=pooled(LA),pb=pooled(LB);
    const epMin=l=>l.map(x=>x.secs!=null?x.secs/60:null),epProg=l=>l.map(x=>x.lvAfter!=null&&x.lvBefore!=null?x.lvAfter-x.lvBefore:null),epTarget=l=>l.map(x=>x.target),epFights=l=>l.map(x=>x.fights);
    const rtF=l=>l.filter(x=>x.retrigger).map(x=>x.retrigger.fights),rtM=l=>l.filter(x=>x.retrigger).map(x=>x.retrigger.minutes);
    const w10=l=>l.map(x=>x.winAfter),w20=l=>l.map(x=>x.winAfter20);
    console.log('\n-- return zone: '+z);
    console.log('  episodes / run                '+cell(eps(LA),eps(LB),0)+'   completed returns '+cell(comp(LA),comp(LB),0)+'   quick retriggers '+cell(quick(LA),quick(LB),0)+'   cancels(approx) '+cell(eps(LA).map((v,i)=>v-comp(LA)[i]),eps(LB).map((v,i)=>v-comp(LB)[i]),0));
    console.log('  training hours / run          '+cell(hrs(LA),hrs(LB),2)+'   '+pair(hrs(LA),hrs(LB))+'   fights / run '+cell(fights(LA),fights(LB),0));
    console.log('  first-return vs retrigger     count '+cell(first(LA),first(LB),0)+' vs '+cell(retr(LA),retr(LB),0)+'   hours '+cell(firstH(LA),firstH(LB),2)+' vs '+cell(retrH(LA),retrH(LB),2));
    console.log('  per episode (pooled med/P90)  minutes '+cell(epMin(pa),epMin(pb),0)+'   fights '+cell(epFights(pa),epFights(pb),0)+'   level progress '+cell(epProg(pa),epProg(pb),2)+'   target med '+f(med(epTarget(pa)),2)+' -> '+f(med(epTarget(pb)),2));
    console.log('  return -> next trigger        fights '+cell(rtF(pa),rtF(pb),0)+'   minutes '+cell(rtM(pa),rtM(pb),0)+'   (n '+rtF(pa).length+' -> '+rtF(pb).length+')');
    const wl=l=>l.map(x=>typeof x.window==='string'?(x.window.match(/0/g)||[]).length:null);console.log('  losses in window at trigger   mean '+f(mean(wl(pa)),2)+' -> '+f(mean(wl(pb)),2)+'   (window length med '+f(med(pa.map(x=>typeof x.window==='string'?x.window.length:null)),0)+' -> '+f(med(pb.map(x=>typeof x.window==='string'?x.window.length:null)),0)+'; audit: min losses '+f(Math.min(...wl(pa).filter(v=>v!=null)),0)+' -> '+f(Math.min(...wl(pb).filter(v=>v!=null)),0)+')');
    console.log('  win rate after return (mean)  first 10: '+f(100*mean(w10(pa)),0)+'% -> '+f(100*mean(w10(pb)),0)+'%   first 20: '+f(100*mean(w20(pa)),0)+'% -> '+f(100*mean(w20(pb)),0)+'%   window at trigger: '+f(100*mean(pa.map(x=>x.winBefore)),0)+'% -> '+f(100*mean(pb.map(x=>x.winBefore)),0)+'%');
    const od=rs=>rs.map(r=>r.byZone&&r.byZone[z]?r.byZone[z].defeats:null),rw=rs=>rs.map(r=>r.byZone&&r.byZone[z]&&r.deadTime?r.byZone[z].rewalk*r.deadTime.secPerEncounter/3600:null),hz=rs=>rs.map(r=>r.zoneTime&&r.zoneTime[z]?r.zoneTime[z].sec/3600:null);
    console.log('  zone: ordinary defeats        '+cell(od(RA),od(RB),0)+'   rewalk hours '+cell(rw(RA),rw(RB),2)+'   non-training hours in zone '+cell(hz(RA),hz(RB),2));
    const le=rs=>rs.map(r=>r.zoneRec&&r.zoneRec[z]?r.zoneRec[z].lvAtEntry:null),lb=rs=>rs.map(r=>r.bossFailRates[z]&&r.bossFailRates[z].attemptLog[0]?r.bossFailRates[z].attemptLog[0].lv:null),pw=rs=>rs.map(r=>r.bossFailRates[z]&&r.bossFailRates[z].attemptLog[0]?r.bossFailRates[z].attemptLog[0].power:null);
    console.log('  Lv entering / Lv at boss      '+cell(le(RA),le(RB),0)+'  /  '+cell(lb(RA),lb(RB),0)+'   power at boss '+cell(pw(RA),pw(RB),0));
    const bf=rs=>rs.map(r=>r.bossFailRates[z]).filter(Boolean);const ba=bf(RA),bb=bf(RB);const reach=rs=>rs.filter(r=>r.zoneRec&&r.zoneRec[z]).length,clear=rs=>rs.filter(r=>r.zonesCleared[z]!=null).length;
    console.log('  boss: reach/attempt/clear     '+reach(RA)+'/'+ba.length+'/'+clear(RA)+' -> '+reach(RB)+'/'+bb.length+'/'+clear(RB)+'   first-try '+ba.filter(b=>b.firstTryClear).length+'/'+ba.filter(b=>b.firstTryClear!=null).length+' -> '+bb.filter(b=>b.firstTryClear).length+'/'+bb.filter(b=>b.firstTryClear!=null).length+'   attempts '+cell(ba.map(b=>b.attemptsToClear),bb.map(b=>b.attemptsToClear),0)+'   streak '+cell(ba.map(b=>b.maxStreak),bb.map(b=>b.maxStreak),0)+'   stall h '+cell(ba.map(b=>b.stallH),bb.map(b=>b.stallH),2));
    const zc=rs=>rs.map(r=>r.zonesCleared[z]);console.log('  zone clear h                  '+cell(zc(RA),zc(RB),2)+'   '+pair(zc(RA),zc(RB)));
  }
  const H=[24,36,48];const zAt=(rs,h)=>rs.map(r=>Object.values(r.zonesCleared).filter(t=>t!=null&&t<=h).length);
  console.log('\n  zones cleared @24/36/48h      '+H.map(h=>h+'h '+cell(zAt(RA,h),zAt(RB,h),0)+' ['+pair(zAt(RA,h),zAt(RB,h))+']').join('   '));
  const td=rs=>rs.map(r=>r.final&&r.final.defeats);console.log('  total defeats                 '+cell(td(RA),td(RB),0)+'   '+pair(td(RA),td(RB))+'   hordes fought/repelled/lost '+cell(RA.map(r=>r.hordes&&r.hordes.fought),RB.map(r=>r.hordes&&r.hordes.fought),0)+' / '+cell(RA.map(r=>r.hordes&&r.hordes.repelled),RB.map(r=>r.hordes&&r.hordes.repelled),0)+' / '+cell(RA.map(r=>r.hordes&&r.hordes.lost),RB.map(r=>r.hordes&&r.hordes.lost),0));
}
