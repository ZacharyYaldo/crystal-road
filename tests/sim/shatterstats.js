// Shatter diagnostic report: per profile and seed, Shatter events, replay cost, per-run zone progress, Keep/Hollow King before vs after the first Shatter,
// plus an audit that each run matches a baseline batch (no Shatters) hour by hour up to its first Shatter.
// Usage: node tests/sim/shatterstats.js --dir batch_out_p21 [--base batch_out_p20c] [--profiles idle,light,casual] [--seedStart 31 --seeds 10] [--horizons 24,36,48,72]
'use strict';
const fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const D=String(args.dir||'batch_out_p21'),BASE=args.base?String(args.base):null,P=String(args.profiles||'idle,light,casual').split(','),S0=args.seedStart||31,N=args.seeds||10,H=String(args.horizons||'24,36,48,72').split(',').map(Number);
const ZONES=['Greenhollow Fields','Stillwater Lagoon','Thornwood','Ironvein Caverns','Emberwaste','Amberfall Woods','Ashen Approach','Ashen Keep','The Foundry'];
const srt=a=>a.filter(v=>v!=null&&!isNaN(v)).sort((x,y)=>x-y),med=a=>{a=srt(a);return a.length?a[Math.floor((a.length-1)/2)]:null},p90=a=>{a=srt(a);return a.length?a[Math.min(a.length-1,Math.ceil((a.length-1)*0.9))]:null},f=(v,d=1)=>v==null?'-':(+v).toFixed(d);
const rd=(d,p,s)=>{const fp=path.join(__dirname,d,p+'_'+s+'.json');return fs.existsSync(fp)?JSON.parse(fs.readFileSync(fp,'utf8')):null;};
const KEEP='Ashen Keep',APP='Ashen Approach';
for(const p of P){
  console.log('\n===== '+p.toUpperCase()+'  ('+D+(BASE?', audited against '+BASE:'')+')');
  const agg={shatters:[],first:[],replayIV:[],replayBack:[],keepEntryLv:{},hkByRun:{},zonesAt:{},audit:[],loops:[],keepBefore:[],keepAfter:[]};
  for(let s=S0;s<S0+N;s++){const r=rd(D,p,s);if(!r){console.log('seed '+s+': no run');continue;}
    const sh=r.shatters||[];agg.shatters.push(sh.length);if(sh.length)agg.first.push(sh[0].h);
    // audit vs baseline: hourly records identical before the first Shatter
    let auditTxt='';if(BASE){const b=rd(BASE,p,s);if(b){const h0=sh.length?sh[0].h:1e9;const ra=(r.hourly||[]).filter(g=>g.h<h0),rb=(b.hourly||[]).filter(g=>g.h<h0);let bad=null;for(let i=0;i<Math.min(ra.length,rb.length);i++){const x=ra[i],y=rb[i];if(x.zone!==y.zone||x.prog!==y.prog||x.wins!==y.wins||Math.abs(x.lv-y.lv)>1e-6||x.gold!==y.gold){bad=x.h;break;}}auditTxt=bad==null?'audit OK ('+Math.min(ra.length,rb.length)+' hourly records identical before first Shatter)':'AUDIT MISMATCH at hour '+bad;agg.audit.push(bad==null);}}
    console.log('\nseed '+s+'  Shatters '+sh.length+'  final: run '+(r.final.shatters||0)+' '+r.final.zone+' Lv '+r.final.partyLv+' dust '+r.final.dust+'  '+auditTxt);
    for(let i=0;i<sh.length;i++){const e=sh[i];const rk=String((e.run||0)+1);const rc=(r.runClears||{})[rk]||{},rz=(r.runZones||{})[rk]||{};const iv=rc['Ironvein Caverns'];const prevZ=(r.runZones||{})[String(e.run||0)]||{};const stuckZone=ZONES.slice().reverse().find(z=>prevZ[z])||e.zone;const back=rz[stuckZone]&&rz[stuckZone].enterH;
      const prevGap=i?+(e.h-sh[i-1].h).toFixed(2):null;const reclearsBetween=i?Object.keys((r.runClears||{})[String((sh[i-1].run||0)+1)]||{}).length:null;
      console.log('  Shatter '+(i+1)+': h'+e.h+' run'+e.run+' in '+e.zone+' fight '+e.prog+' (far mark '+(e.farMark!=null?e.farMark:'-')+', cleared '+e.cleared+') Lv '+e.lv+' power '+e.power+' gain +'+e.gain+' dust '+e.dustBefore+'->'+e.dustAfter+' reason '+e.reason+' stalled '+e.stallH+'h (last progress h'+(e.lastProgressH!=null?e.lastProgressH:'-')+')'+(prevGap!=null?'  gap since previous '+prevGap+'h, zones re-cleared between: '+reclearsBetween:''));
      console.log('     replay: Ironvein re-cleared '+(iv!=null?'+'+f(iv-e.h,2)+'h':'not within horizon')+', back in '+stuckZone+' '+(back!=null?'+'+f(back-e.h,2)+'h at Lv '+rz[stuckZone].lvAtEntry+' power '+rz[stuckZone].power:'not within horizon')+'; run '+rk+' clears: '+Object.entries(rc).map(([z,h])=>z.split(' ')[0]+'@'+h).join(' '));
      if(iv!=null)agg.replayIV.push(iv-e.h);if(back!=null)agg.replayBack.push(back-e.h);if(prevGap!=null)agg.loops.push({gap:prevGap,reclears:reclearsBetween});}
    // per-run Ashen Approach / Keep entries
    const rz=r.runZones||{};const ents=[];for(const rk of Object.keys(rz))for(const z of [APP,KEEP])if(rz[rk][z])ents.push('run'+rk+' '+z.split(' ')[1]+' @'+rz[rk][z].enterH+'h Lv '+rz[rk][z].lvAtEntry+' pw '+rz[rk][z].power);
    if(ents.length)console.log('  late entries: '+ents.join(' | '));
    for(const rk of Object.keys(rz)){if(rz[rk][KEEP]){(agg.keepEntryLv[rk]=agg.keepEntryLv[rk]||[]).push(rz[rk][KEEP].lvAtEntry);}if(rz[rk][APP]){agg.appEntryLv=agg.appEntryLv||{};(agg.appEntryLv[rk]=agg.appEntryLv[rk]||[]).push(rz[rk][APP].lvAtEntry);(agg.appEntryH=agg.appEntryH||{});(agg.appEntryH[rk]=agg.appEntryH[rk]||[]).push(rz[rk][APP].enterH);}}
    // Hollow King attempts by run
    const hk=r.bossFailRates&&r.bossFailRates[KEEP];if(hk){const by={};for(const a of hk.attemptLog||[]){const k=String(a.run||0);by[k]=by[k]||{n:0,w:0,dur:[],hp:[],sum:0,lv:[]};by[k].n++;if(a.win)by[k].w++;by[k].dur.push(a.dur);by[k].hp.push(a.hpLeft);if(a.summoned)by[k].sum++;by[k].lv.push(a.lv);}
      console.log('  Hollow King: '+Object.entries(by).map(([k,v])=>'run'+k+' '+v.w+'/'+v.n+' wins, Lv '+f(med(v.lv),0)+', loss dur med '+f(med(v.dur),0)+'s, HP left med '+f(100*(med(v.hp)||0),0)+'%, summon '+v.sum+'/'+v.n).join(' | ')+(hk.attemptsToClear?'  CLEARED after '+hk.attemptsToClear+' attempts, stall '+f(hk.stallH,2)+'h':''));
      for(const [k,v] of Object.entries(by)){agg.hkByRun[k]=agg.hkByRun[k]||{n:0,w:0,runs:0};agg.hkByRun[k].n+=v.n;agg.hkByRun[k].w+=v.w;agg.hkByRun[k].runs++;}}
    // Keep ordinary fights before/after first Shatter
    if(sh.length){const e=sh[0];const bz0=(e.byZoneAt||{})[KEEP]||{defeats:0,rewalk:0},zt0=(e.zoneTimeAt||{})[KEEP]||{sec:0,trainSec:0};const bz1=(r.byZone||{})[KEEP]||{defeats:0,rewalk:0},zt1=(r.zoneTime||{})[KEEP]||{sec:0,trainSec:0};const spe=(r.deadTime&&r.deadTime.secPerEncounter)||60;
      const before={def:bz0.defeats||0,h:zt0.sec/3600,rw:(bz0.rewalk||0)*spe/3600},after={def:(bz1.defeats||0)-(bz0.defeats||0),h:(zt1.sec-zt0.sec)/3600,rw:((bz1.rewalk||0)-(bz0.rewalk||0))*spe/3600};const lr=x=>x.h>0?f(100*x.def/Math.max(1,x.h*3600/spe),0)+'%':'-';
      console.log('  Keep ordinary before first Shatter: '+before.def+' defeats in '+f(before.h,2)+'h (loss ~'+lr(before)+', rewalk '+f(before.rw,2)+'h)  |  after: '+after.def+' defeats in '+f(after.h,2)+'h (loss ~'+lr(after)+', rewalk '+f(after.rw,2)+'h)');agg.keepBefore.push(before);agg.keepAfter.push(after);}
    else{const bz1=(r.byZone||{})[KEEP],zt1=(r.zoneTime||{})[KEEP];if(bz1)console.log('  Keep ordinary (no Shatter): '+bz1.defeats+' defeats in '+f((zt1?zt1.sec:0)/3600,2)+'h');}
    // zones cleared at horizons: current-run count and best-run count
    const rcAll=r.runClears||{};const at=h=>{let cur=0,best=0;for(const rk of Object.keys(rcAll)){const c=Object.values(rcAll[rk]).filter(t=>t<=h).length;best=Math.max(best,c);const started=rk==='0'?0:(sh[Number(rk)-1]?sh[Number(rk)-1].h:1e9);if(started<=h)cur=c;}return cur+'/'+best;};
    console.log('  zones cleared @'+H.map(h=>h+'h '+at(h)).join(', ')+'  (current run / best run)   total defeats '+(r.final.defeats||0)+'  training '+f((r.autoTrain&&r.autoTrain.timeSec||0)/3600,1)+'h  hordes '+(r.hordes?r.hordes.fought+'/'+r.hordes.repelled+'/'+r.hordes.lost:'-')+'  catacomb best '+(r.catacombs?r.catacombs.best||'-':'-'));
    for(const h of H){(agg.zonesAt[h]=agg.zonesAt[h]||[]).push(at(h));}
  }
  console.log('\n-- '+p+' summary: Shatters per run med '+med(agg.shatters)+' (min '+Math.min(...agg.shatters)+' max '+Math.max(...agg.shatters)+'), first Shatter h med '+f(med(agg.first),1)+' P90 '+f(p90(agg.first),1)+'; Ironvein re-clear +'+f(med(agg.replayIV),2)+'h med; back in the zone left +'+f(med(agg.replayBack),2)+'h med (n '+agg.replayBack.length+'); gaps between Shatters med '+f(med(agg.loops.map(l=>l.gap)),1)+'h min '+f(Math.min(...agg.loops.map(l=>l.gap)),1)+'h, min zones re-cleared between consecutive Shatters '+(agg.loops.length?Math.min(...agg.loops.map(l=>l.reclears)):'-')+'; audit '+agg.audit.filter(Boolean).length+'/'+agg.audit.length+' OK');
  console.log('   Ashen Approach entry by run: '+Object.entries(agg.appEntryLv||{}).map(([k,v])=>'run'+k+' Lv med '+f(med(v),0)+' @'+f(med(agg.appEntryH[k]),1)+'h (n'+v.length+')').join(', '));
  console.log('   Keep entry Lv by run: '+Object.entries(agg.keepEntryLv).map(([k,v])=>'run'+k+' med '+f(med(v),0)+' (n'+v.length+')').join(', ')+' | Hollow King by run: '+Object.entries(agg.hkByRun).map(([k,v])=>'run'+k+' '+v.w+'/'+v.n+' wins over '+v.runs+' runs').join(', '));
  console.log('   zones cleared (current/best) med: '+H.map(h=>h+'h '+med(agg.zonesAt[h].map(x=>+x.split('/')[0]))+'/'+med(agg.zonesAt[h].map(x=>+x.split('/')[1]))).join(', '));
}
