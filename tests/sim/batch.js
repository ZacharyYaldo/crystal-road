// Batch runner: many seeds x profiles in parallel, then P10 / median / P90 per profile.
// Usage: node tests/sim/batch.js --seeds 20 --hours 24 [--profiles idle,casual,active] [--shatters 3] [--workers 10] [--out batch.json]
'use strict';
const {spawn}=require('child_process'),path=require('path'),fs=require('fs'),os=require('os');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const SEEDS=args.seeds||10,HOURS=args.hours||24,PROFILES=String(args.profiles||'idle,light,casual,engaged,stress').split(','),WORKERS=args.workers||Math.max(1,os.cpus().length-2),SHATTERS=args.shatters||0;
const dir=path.join(__dirname,'batch_out'+(args.tag?'_'+args.tag:''));fs.mkdirSync(dir,{recursive:true});
const SEED0=args.seedStart||1;const jobs=[];for(const p of PROFILES)for(let s=SEED0;s<SEED0+SEEDS;s++)jobs.push({p,s,file:path.join(dir,p+'_'+s+'.json')});
let idx=0,done=0;const t0=Date.now();
function next(){if(idx>=jobs.length)return;const j=jobs[idx++];const a=[path.join(__dirname,'bot.js'),'--hours',String(HOURS),'--seed',String(j.s),'--profile',j.p,'--quiet','--json',j.file,'--snapshots',path.join(__dirname,args.tag?'snapshots_'+args.tag:'snapshots')];if(SHATTERS)a.push('--shatters',String(SHATTERS));if(args.replace)a.push('--replace',String(args.replace));if(args.untilZone)a.push('--untilZone',String(args.untilZone));if(args.noRetreat)a.push('--noRetreat');if(args.retreatAfter!=null)a.push('--retreatAfter',String(args.retreatAfter));if(args.trainUntil)a.push('--trainUntil',String(args.trainUntil));if(args.retreatOn)a.push('--retreatOn',String(args.retreatOn));if(args.noAutoTrain)a.push('--noAutoTrain');if(args.stallRule)a.push('--stallRule',String(args.stallRule));if(args.stallHours!=null)a.push('--stallHours',String(args.stallHours));const c=spawn(process.execPath,a,{stdio:['ignore','ignore','inherit']});c.on('exit',()=>{done++;process.stdout.write('\r'+done+'/'+jobs.length+' done ('+((Date.now()-t0)/60000).toFixed(1)+' min)   ');if(done===jobs.length)report();else next();});}
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
  for(const z of zones)metric('boss COMBAT stall h '+z,r=>r.bossFailRates[z]?r.bossFailRates[z].combatStallH:null);
  for(const z of zones)metric('boss RETRY stall h '+z,r=>r.bossFailRates[z]?r.bossFailRates[z].retryStallH:null);
  const at=r=>r.autoTrain||{triggers:0,returns:0,keepPushing:0,log:[]};const medOf=(arr)=>{arr=arr.filter(v=>v!=null).sort((a,b)=>a-b);return arr.length?arr[Math.floor((arr.length-1)/2)]:null;};
  metric('AUTO-TRAIN triggers total',r=>at(r).triggers);metric('AUTO-TRAIN returns',r=>at(r).returns);metric('AUTO-TRAIN keep-pushing uses',r=>at(r).keepPushing);
  for(const z of zones)metric('AUTO-TRAIN triggers for '+z,r=>at(r).log.filter(l=>l.ret===z).length);
  for(const z of zones)metric('AUTO-TRAIN med minutes '+z,r=>medOf(at(r).log.filter(l=>l.ret===z&&l.secs!=null).map(l=>+(l.secs/60).toFixed(1))));
  for(const z of zones)metric('AUTO-TRAIN med fights '+z,r=>medOf(at(r).log.filter(l=>l.ret===z&&l.fights!=null).map(l=>l.fights)));
  for(const z of zones)metric('AUTO-TRAIN med levels earned '+z,r=>medOf(at(r).log.filter(l=>l.ret===z&&l.xp!=null).map(l=>l.xp)));
  for(const z of zones)metric('AUTO-TRAIN Lv before '+z,r=>medOf(at(r).log.filter(l=>l.ret===z).map(l=>l.lvBefore)));
  for(const z of zones)metric('AUTO-TRAIN Lv after '+z,r=>medOf(at(r).log.filter(l=>l.ret===z&&l.lvAfter!=null).map(l=>l.lvAfter)));
  for(const z of zones)metric('AUTO-TRAIN win% before '+z,r=>medOf(at(r).log.filter(l=>l.ret===z).map(l=>Math.round(l.winBefore*100))));
  for(const z of zones)metric('AUTO-TRAIN win% after '+z,r=>medOf(at(r).log.filter(l=>l.ret===z&&l.winAfter!=null).map(l=>Math.round(l.winAfter*100))));
  for(const z of zones)metric('boss IN-ZONE retry h '+z,r=>r.bossFailRates[z]?r.bossFailRates[z].inZoneRetryH:null);
  const arr=(z,k)=>r=>r.bossFailRates[z]&&r.bossFailRates[z].arrival?r.bossFailRates[z].arrival[k]:null;
  for(const z of ['Stillwater Lagoon','Ironvein Caverns']){metric('ARRIVAL '+z+' party HP%',r=>{const v=arr(z,'hp')(r);return v==null?null:Math.round(v*100);});metric('ARRIVAL '+z+' min hero HP%',r=>{const v=arr(z,'minHp')(r);return v==null?null:Math.round(v*100);});metric('ARRIVAL '+z+' avg charge',arr(z,'charge'));metric('ARRIVAL '+z+' surge',arr(z,'surge'));metric('ARRIVAL '+z+' Lv',arr(z,'lv'));metric('ARRIVAL '+z+' power',arr(z,'power'));metric('ARRIVAL '+z+' trainings before',arr(z,'trainingsBefore'));metric('ARRIVAL '+z+' fights since return',arr(z,'fightsSinceReturn'));metric('ARRIVAL '+z+' min since return',arr(z,'minSinceReturn'));metric('ARRIVAL '+z+' via training-return %',r=>{const v=arr(z,'via')(r);return v==null?null:(v==='training-return'?100:0);});}
  metric('RETRIGGER same-zone within 10 fresh fights',r=>at(r).log.filter(l=>l.retrigger&&l.retrigger.fights<=10).length);
  metric('RETRIGGER same-zone within 20 fresh fights',r=>at(r).log.filter(l=>l.retrigger&&l.retrigger.fights<=20).length);
  metric('RETRIGGER share of triggers within 20 %',r=>{const L=at(r).log;return L.length?Math.round(100*L.filter(l=>l.retrigger&&l.retrigger.fights<=20).length/L.length):null;});
  metric('RETRIGGER med fresh fights to same-zone retrigger',r=>medOf(at(r).log.filter(l=>l.retrigger).map(l=>l.retrigger.fights)));
  metric('RETRIGGER med minutes to same-zone retrigger',r=>medOf(at(r).log.filter(l=>l.retrigger).map(l=>l.retrigger.minutes)));
  metric('AFTER RETURN win% first 10 fights (med)',r=>{const v=medOf(at(r).log.filter(l=>l.winAfter!=null).map(l=>l.winAfter));return v==null?null:Math.round(v*100);});
  metric('AFTER RETURN win% first 20 fights (med)',r=>{const v=medOf(at(r).log.filter(l=>l.winAfter20!=null).map(l=>l.winAfter20));return v==null?null:Math.round(v*100);});
  metric('AT TRIGGER win% in window (med)',r=>{const v=medOf(at(r).log.filter(l=>l.window).map(l=>{const w=l.window;return w.split('').filter(c=>c==='1').length/w.length;}));return v==null?null:Math.round(v*100);});
  metric('AT TRIGGER enemy Lv minus party Lv (med)',r=>medOf(at(r).log.filter(l=>l.enemyLv!=null).map(l=>+(l.enemyLv-l.lvBefore).toFixed(1))));
  metric('AT TRIGGER zone progress % (med)',r=>medOf(at(r).log.filter(l=>l.prog!=null).map(l=>{const z=zones.indexOf(l.ret);return Math.round(100*l.prog/[24,30,30,36,36,36,36,40,40][z]);})));
  metric('DEAD TIME defeats outside training',r=>r.deadTime?r.deadTime.defeatsOutsideTraining:null);
  metric('DEAD TIME rewalk fights outside training',r=>r.deadTime?r.deadTime.rewalkFights:null);
  metric('DEAD TIME rewalk fights after boss losses',r=>r.deadTime?r.deadTime.rewalkBossFights:null);
  metric('DEAD TIME rewalk hours equiv (non-boss, outside training)',r=>r.deadTime?+(r.deadTime.rewalkFights*r.deadTime.secPerEncounter/3600).toFixed(2):null);
  metric('DEAD TIME rewalk hours equiv (after boss losses)',r=>r.deadTime?+(r.deadTime.rewalkBossFights*r.deadTime.secPerEncounter/3600).toFixed(2):null);
  const trace=(k,f)=>r=>{const L=(r.autoTrain&&r.autoTrain.log)||[];const vals=L.map(f).filter(v=>v!=null).sort((a,b)=>a-b);return vals.length?vals[Math.floor((vals.length-1)/2)]:null;};
  for(const [k,f] of [['HP% before training',l=>l.before?Math.round(l.before.hp*100):null],['HP% at end of training',l=>l.atEnd?Math.round(l.atEnd.hp*100):null],['HP% after return',l=>l.afterReturn?Math.round(l.afterReturn.hp*100):null],['HP% at next boss',l=>l.nextBoss?Math.round(l.nextBoss.hp*100):null],['charge before training',l=>l.before?l.before.charge:null],['charge at end',l=>l.atEnd?l.atEnd.charge:null],['charge after return',l=>l.afterReturn?l.afterReturn.charge:null],['charge at next boss',l=>l.nextBoss?l.nextBoss.charge:null],['surge before',l=>l.before?l.before.surge:null],['surge after return',l=>l.afterReturn?l.afterReturn.surge:null],['surge at next boss',l=>l.nextBoss?l.nextBoss.surge:null]])metric('TRAIN TRACE '+k,trace(k,f));
  for(const z of zones)metric('fights between 1st try and clear '+z,r=>r.bossFailRates[z]?r.bossFailRates[z].fightsBetween:null);
  for(const z of zones)metric('levels gained before clear '+z,r=>r.bossFailRates[z]?r.bossFailRates[z].lvGain:null);
  for(const z of zones)metric('gear changes before clear '+z,r=>r.bossFailRates[z]?r.bossFailRates[z].upsBetween:null);
  for(const z of zones)metric('party Lv entering '+z,r=>r.zoneRec&&r.zoneRec[z]?r.zoneRec[z].lvAtEntry:null);
  for(const z of zones)metric('boss 1st-try clear% '+z,r=>r.bossFailRates[z]&&r.bossFailRates[z].firstTryClear!=null?r.bossFailRates[z].firstTryClear*100:null);
  for(const z of zones)metric('boss attempts to clear '+z,r=>r.bossFailRates[z]?r.bossFailRates[z].attemptsToClear:null);
  for(const z of zones)metric('boss Lv at first try '+z,r=>r.bossFailRates[z]?r.bossFailRates[z].lvFirst:null);
  for(const z of zones)metric('boss Lv at clear '+z,r=>r.bossFailRates[z]?r.bossFailRates[z].lvClear:null);
  for(const k of ['basic','ability','tap','surge'])metric('dmg share '+k+' %',r=>Math.round((r.dmgShare[k]||0)*100));
  for(const k of ['basic','ability','tap','surge','total'])metric('dmg/h '+k,r=>r.dmgPerHour?r.dmgPerHour[k]:null);
  for(const k of ['basic','ability','tap','surge'])metric('ACTIVE WINDOW dmg share '+k+' %',r=>r.dmgActiveWindow?Math.round(r.dmgActiveWindow.share[k]*100):null);
  metric('ACTIVE WINDOW dmg/h',r=>r.dmgActiveWindow?r.dmgActiveWindow.perHour:null);
  metric('active hours',r=>r.dmgActiveWindow?r.dmgActiveWindow.hours:null);
  metric('ability casts/h',r=>r.castsPerHour);
  metric('gold earned/h',r=>r.econPerHour.goldEarned);metric('ore earned/h',r=>r.econPerHour.oreEarned);
  metric('defeats @end',r=>r.final.defeats);
  const w=Math.max(...rows.map(r=>r.metric.length))+1;const fmt=n=>Math.abs(n)>=1e6?(n/1e6).toFixed(2)+'M':Math.abs(n)>=1e4?(n/1e3).toFixed(0)+'K':String(n);const cell=v=>v&&v[1]!=null?(fmt(v[0])+' / '+fmt(v[1])+' / '+fmt(v[2])).padEnd(22):'-'.padEnd(22);
  console.log('metric'.padEnd(w)+PROFILES.map(p=>(p+' (P10/med/P90)').padEnd(22)).join(''));
  for(const r of rows){if(PROFILES.every(p=>!r[p]||r[p][1]==null))continue;console.log(r.metric.padEnd(w)+PROFILES.map(p=>cell(r[p])).join(''));}
  const outFile=args.out||path.join(dir,'summary.json');fs.writeFileSync(outFile,JSON.stringify({config:{SEEDS,HOURS,PROFILES,SHATTERS},rows},null,1));console.log('\nwritten '+outFile);}
