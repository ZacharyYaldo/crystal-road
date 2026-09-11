// Per-seed boss detail for paired arms, loss-phase pools, zones cleared at fixed horizons, and arrival state per zone.
// Usage: node tests/sim/perseed.js --a batch_out_p17c --b batch_out_p17x [--profiles idle,light,casual] [--zones "Emberwaste,Amberfall Woods,Ashen Approach"] [--seedStart 31 --seeds 10] [--horizons 24,36,48]
'use strict';
const fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const A=String(args.a||'batch_out_p17c'),B=String(args.b||'batch_out_p17x'),P=String(args.profiles||'idle,light,casual').split(','),ZS=String(args.zones||'Emberwaste,Amberfall Woods,Ashen Approach').split(','),S0=args.seedStart||31,N=args.seeds||10,H=String(args.horizons||'24,36,48').split(',').map(Number);
const q=(a,p)=>{a=a.filter(v=>v!=null&&!isNaN(v)).sort((x,y)=>x-y);return a.length?a[Math.min(a.length-1,Math.floor(p*(a.length-1)))]:null};const f=(v,d=1)=>v==null?'-':(+v).toFixed(d);
const rd=(d,p,s)=>{const fp=path.join(__dirname,d,p+'_'+s+'.json');return fs.existsSync(fp)?JSON.parse(fs.readFileSync(fp,'utf8')):null;};
for(const p of P){
  for(const Z of ZS){
    console.log('\n== '+p+'  '+Z+'  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   ('+A+' -> '+B+')');
    const rows=[];
    for(let s=S0;s<S0+N;s++){const line=[];for(const d of [A,B]){const r=rd(d,p,s);if(!r){line.push('no run');continue;}const b=r.bossFailRates[Z];const at=b?b.attemptLog:[];const au=at.filter(a=>a.window==='auto'),ac=at.filter(a=>a.window!=='auto');const zr=r.zoneRec&&r.zoneRec[Z];
      line.push((b?b.attemptsToClear+' | '+f(b.stallH,2)+' | '+b.maxStreak+' | '+(at[0]?at[0].window+'/'+(at[0].win?'W':'L')+'/'+at[0].lv:'-')+' | '+au.filter(a=>a.win).length+'/'+au.length+' | '+ac.filter(a=>a.win).length+'/'+ac.length+' | '+f(r.zonesCleared[Z],1):(zr?'entered, no boss attempt':'not reached'))+' | Lv '+(zr?zr.lvAtEntry:'-'));}
      console.log(String(s).padEnd(4)+line[0].padEnd(62)+' -> '+line[1]);}
    for(const d of [A,B]){let L=[],W=[],reach=0,att=0;for(let s=S0;s<S0+N;s++){const r=rd(d,p,s);if(!r)continue;const b=r.bossFailRates[Z];if(b){att++;L=L.concat(b.attemptLog.filter(a=>!a.win));W=W.concat(b.attemptLog.filter(a=>a.win));}if(r.zoneRec&&r.zoneRec[Z])reach++;}
      console.log('   '+d.padEnd(16)+'reached '+reach+' attempted '+att+' | losses n='+L.length+' bossHP left q25/50/75 '+f(q(L.map(a=>a.hpLeft),.25),2)+'/'+f(q(L.map(a=>a.hpLeft),.5),2)+'/'+f(q(L.map(a=>a.hpLeft),.75),2)+' | <=25% '+L.filter(a=>a.hpLeft<=0.25).length+' | summoned '+L.filter(a=>a.summoned).length+' | dur med '+f(q(L.map(a=>a.dur),.5),0)+'s | charge kills/loss '+f(L.reduce((x,a)=>x+(a.chargeKills||0),0)/Math.max(1,L.length),2)+' | boss hits/loss '+f(L.reduce((x,a)=>x+(a.bossHits||0),0)/Math.max(1,L.length),1)+' | wins n='+W.length+' survivors med '+f(q(W.map(a=>a.survivors),.5),0)+' partyHP med '+f(100*(q(W.map(a=>a.partyHp),.5)||0),0)+'%');}
  }
  console.log('\n== '+p+'  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours');
  for(const h of H){const za=[],zb=[];for(let s=S0;s<S0+N;s++){const ra=rd(A,p,s),rb=rd(B,p,s);if(!ra||!rb)continue;za.push(Object.values(ra.zonesCleared).filter(t=>t!=null&&t<=h).length);zb.push(Object.values(rb.zonesCleared).filter(t=>t!=null&&t<=h).length);}
    const d=za.map((v,i)=>zb[i]-v);console.log('   @'+h+'h  '+q(za,.5)+' / '+q(za,.9)+' -> '+q(zb,.5)+' / '+q(zb,.9)+'   paired +'+d.filter(x=>x>0).length+' 0'+d.filter(x=>x===0).length+' -'+d.filter(x=>x<0).length);}
  const tot=[[],[]],tr=[[],[]];for(let s=S0;s<S0+N;s++){[A,B].forEach((d,i)=>{const r=rd(d,p,s);if(!r)return;tot[i].push(r.final&&r.final.defeats!=null?r.final.defeats:null);tr[i].push(r.autoTrain?r.autoTrain.timeSec/3600:null);});}
  console.log('   total defeats med '+f(q(tot[0],.5),0)+' -> '+f(q(tot[1],.5),0)+'   training h med '+f(q(tr[0],.5),1)+' -> '+f(q(tr[1],.5),1));
}
