// Boss failure-mode diagnostic: replay one boss from real arrival snapshots, N combat seeds each, in both play modes,
// and record phase / summon / add / damage-source / charge telemetry per fight.
// Usage: node tests/sim/bossdiag.js --boss ironvein --snapDir snapshots_p10 --profiles idle,light,casual,engaged --seedsPer 10 [--json out.json]
'use strict';
const {load}=require('./headless.js'),fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const BOSS=String(args.boss||'ironvein').toLowerCase(),PROFILES=String(args.profiles||'idle,light,casual,engaged').split(','),SEEDS=args.seedsPer||10,DT=0.1;
const TAPS={idle:0,light:1,casual:1.5,engaged:2,stress:2};
const snapDir=path.join(__dirname,String(args.snapDir||'snapshots'));
let seed=1;function srand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}Math.random=srand;
const srt=a=>a.filter(v=>v!=null&&!isNaN(v)).sort((x,y)=>x-y);const med=a=>{a=srt(a);return a.length?a[Math.floor((a.length-1)/2)]:null;};const p90=a=>{a=srt(a);return a.length?a[Math.min(a.length-1,Math.ceil((a.length-1)*0.9))]:null;};const mean=a=>{a=srt(a);return a.length?a.reduce((x,y)=>x+y,0)/a.length:null;};
const f=(v,d=2)=>v==null?'-':String(+(+v).toFixed(d));
(async()=>{
  const S=load({startMs:1700000000000});await S.ready;const G=S.G,Z=S.ZONES;
  const all=[];
  for(const prof of PROFILES){
    const snaps=fs.readdirSync(snapDir).filter(f=>f.startsWith(BOSS+'_'+prof+'_')&&f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(snapDir,f),'utf8')));
    if(!snaps.length){console.error('no snapshots for '+prof);continue;}
    for(const snap of snaps){for(const mode of ['active','auto']){for(let k=0;k<SEEDS;k++){seed=1000*snap.seed+k+(mode==='auto'?500:0);
      S.storeSet(snap.save);S.loadGame();G.noSave=true;G.title=false;G.tut=null;G.sheet=null;G.reveal=null;G.card=null;G.banner=null;G.hordeFight=null;G.delve=null;G.projs=[];G.action=null;G.enemies=[];G.train=null;G.danger=null;
      const zone=snap.zone;G.zone=zone;G.prog[zone]=Z[zone].fights-1;G.cleared[zone]=false;G.mode='walk';G.enc=0.05;G.bossFight=false;
      for(const h of G.active){h.dead=false;h.status={};if(snap.hp&&snap.hp[h.id]!=null)h.hp=Math.max(1,Math.round(h.maxhp*snap.hp[h.id]));if(snap.charge&&snap.charge[h.id]!=null)h.charge=snap.charge[h.id];h.tapCast=false;}S.layout();
      if(mode==='auto'){G.autoCast=true;G.autoUntil=9e15;}else{G.autoCast=false;G.autoUntil=0;}
      const arrival={lv:+(G.active.reduce((a,h)=>a+h.lvl,0)/G.active.length).toFixed(1),power:S.partyPower(),hp:+(G.active.reduce((a,h)=>a+h.hp,0)/G.active.reduce((a,h)=>a+h.maxhp,0)).toFixed(2),minHp:+Math.min(...G.active.map(h=>h.hp/h.maxhp)).toFixed(2),charge:Math.round(G.active.reduce((a,h)=>a+(h.charge||0),0)/G.active.length),surge:Math.round(G.surge||0)};
      let t=0,tap=0,maxhp=0,start=null,out=null,minFrac=1,summonAt=null,adds=0,addsSeen=0;
      for(let i=0;i<20*900;i++){t+=DT;S.setRT(S.getRT()+DT);S.clock.advance(DT*1000);G.tut=null;S.update(DT,true);G.parts.length=0;G.floats.length=0;
        if(G.bossFight&&start==null)start=t;
        if(G.mode==='battle'){const e=G.enemies.find(x=>x.boss);if(e){if(!maxhp)maxhp=e.maxhp;const fr=e.hp/e.maxhp;if(fr<minFrac)minFrac=fr;if(summonAt==null&&e.mech&&e.mech.summon&&e.mech.summon[0].done)summonAt=t-start;}
          adds=G.enemies.filter(x=>!x.boss&&!x.dead).length;addsSeen=Math.max(addsSeen,G.enemies.filter(x=>!x.boss).length);
          if(mode==='active'){for(const h of G.active){if(!h.dead&&h.charge>=100&&!h.tapCast){if(S.reactTo(h))continue;h.tapCast=true;h.charge=0;}}if(G.surge>=100){try{S.castSurge();}catch(e){}}tap+=(TAPS[prof]||0)*DT;while(tap>=1){tap-=1;const foes=G.enemies.filter(e=>!e.dead);if(!foes.length)break;const tg=(G.focus&&G.focus.e&&!G.focus.e.dead)?G.focus.e:foes.sort((a,b)=>a.hp-b.hp)[0];try{S.tapEnemy(tg);}catch(e){}}}}
        const fsx=G.fs||{};const taken=fsx.taken||{};const bossName=(Z[zone].boss&&S.ENEMIES[Z[zone].boss].name)||'';
        const common=()=>{let fromBoss=0,fromAdds=0;for(const k in taken){if(k===bossName)fromBoss+=taken[k];else fromAdds+=taken[k];}return{dur:+(t-start).toFixed(1),minBossFrac:+minFrac.toFixed(2),summoned:summonAt!=null,summonAt:summonAt==null?null:+summonAt.toFixed(1),addsSeen,addsAliveEnd:adds,dmgFromBoss:Math.round(fromBoss),dmgFromAdds:Math.round(fromAdds),chargeHits:fsx.chargeHits||0,chargeKills:fsx.chargeKills||0,chargeParried:fsx.chargeParried||0,chargeInterrupted:fsx.chargeInterrupted||0,wardReduced:Math.round(fsx.wardReduced||0)};};
        if(G.mode==='victory'&&start!=null){const alive=G.active.filter(h=>!h.dead);out=Object.assign({win:true,survivors:alive.length,partyHp:+(G.active.reduce((a,h)=>a+Math.max(0,h.hp),0)/G.active.reduce((a,h)=>a+h.maxhp,0)).toFixed(2)},common());break;}
        if(G.mode==='defeat'&&start!=null){const e=G.enemies.find(x=>x.boss);out=Object.assign({win:false,bossHpLeft:e&&maxhp?+(e.hp/maxhp).toFixed(2):null,bossDead:!!(e&&e.dead)},common());break;}}
      if(!out)out={win:false,unresolved:true,dur:+(t-(start||t)).toFixed(1),minBossFrac:+minFrac.toFixed(2),summoned:summonAt!=null};
      all.push(Object.assign({profile:prof,snapSeed:snap.seed,combatSeed:k,mode,arrival},out));}}}}
  if(args.json)fs.writeFileSync(path.join(__dirname,String(args.json)),JSON.stringify(all));
  // ---- report
  const groups=[];for(const p of PROFILES)for(const m of ['active','auto'])groups.push([p+' '+m,all.filter(r=>r.profile===p&&r.mode===m)]);for(const p of PROFILES)groups.push([p+' both',all.filter(r=>r.profile===p)]);groups.push(['ALL',all]);
  const line=(name,fn)=>console.log(name.padEnd(46)+groups.map(([g,rs])=>String(fn(rs)).padEnd(13)).join(''));
  console.log('BOSS DIAGNOSTIC '+BOSS+'  snapshots x '+SEEDS+' combat seeds x 2 modes'); console.log(''.padEnd(46)+groups.map(([g])=>g.padEnd(13)).join(''));
  line('fights',rs=>rs.length);
  line('clear % (mean +- 95% CI)',rs=>{const n=rs.length,p=n?rs.filter(r=>r.win).length/n:0;return n?Math.round(100*p)+'+-'+Math.round(196*Math.sqrt(p*(1-p)/n)):'-';});
  line('duration s med / P90',rs=>f(med(rs.map(r=>r.dur)),0)+' / '+f(p90(rs.map(r=>r.dur)),0));
  line('LOSS boss HP left med / P90',rs=>{const L=rs.filter(r=>!r.win&&r.bossHpLeft!=null);return L.length?Math.round(100*med(L.map(r=>r.bossHpLeft)))+'% / '+Math.round(100*p90(L.map(r=>r.bossHpLeft)))+'%':'-';});
  line('LOSS share: wiped before 50% (pre-summon)',rs=>{const L=rs.filter(r=>!r.win);return L.length?Math.round(100*L.filter(r=>!r.summoned).length/L.length)+'%':'-';});
  line('LOSS share: after summon, boss 20-50%',rs=>{const L=rs.filter(r=>!r.win);return L.length?Math.round(100*L.filter(r=>r.summoned&&r.bossHpLeft>0.2).length/L.length)+'%':'-';});
  line('LOSS share: near kill, boss <20% or dead',rs=>{const L=rs.filter(r=>!r.win);return L.length?Math.round(100*L.filter(r=>r.summoned&&(r.bossDead||r.bossHpLeft<=0.2)).length/L.length)+'%':'-';});
  line('LOSS share: boss dead, adds finished party',rs=>{const L=rs.filter(r=>!r.win);return L.length?Math.round(100*L.filter(r=>r.bossDead).length/L.length)+'%':'-';});
  line('LOSS early wipe <40 s',rs=>{const L=rs.filter(r=>!r.win);return L.length?Math.round(100*L.filter(r=>r.dur<40).length/L.length)+'%':'-';});
  line('LOSS adds alive at wipe med',rs=>f(med(rs.filter(r=>!r.win).map(r=>r.addsAliveEnd)),1));
  line('WIN survivors med / party HP% med',rs=>{const W=rs.filter(r=>r.win);return W.length?f(med(W.map(r=>r.survivors)),0)+' / '+Math.round(100*med(W.map(r=>r.partyHp)))+'%':'-';});
  line('summon occurred %',rs=>rs.length?Math.round(100*rs.filter(r=>r.summoned).length/rs.length)+'%':'-');
  line('summon at s med (when it occurred)',rs=>f(med(rs.filter(r=>r.summonAt!=null).map(r=>r.summonAt)),0));
  line('dmg taken from boss vs adds (med %)',rs=>{const v=rs.filter(r=>(r.dmgFromBoss||0)+(r.dmgFromAdds||0)>0).map(r=>100*r.dmgFromBoss/(r.dmgFromBoss+r.dmgFromAdds));return v.length?Math.round(med(v))+'% boss':'-';});
  line('charge hits / kills per fight (mean)',rs=>f(mean(rs.map(r=>r.chargeHits||0)),1)+' / '+f(mean(rs.map(r=>r.chargeKills||0)),2));
  line('charge parried / interrupted per fight',rs=>f(mean(rs.map(r=>r.chargeParried||0)),2)+' / '+f(mean(rs.map(r=>r.chargeInterrupted||0)),2));
  line('ward (shieldAllies) dmg absorbed med',rs=>f(med(rs.map(r=>r.wardReduced||0)),0));
  line('arrival Lv med',rs=>f(med(rs.map(r=>r.arrival.lv)),1));line('arrival power med',rs=>f(med(rs.map(r=>r.arrival.power)),0));line('arrival HP% med',rs=>Math.round(100*(med(rs.map(r=>r.arrival.hp))||0)));line('arrival charge med',rs=>f(med(rs.map(r=>r.arrival.charge)),0));
  // stratify by arrival power tercile within profile
  console.log('\nOUTCOME BY ARRIVAL POWER TERCILE (within profile, both modes)');
  for(const p of PROFILES){const rs=all.filter(r=>r.profile===p);const pw=srt(rs.map(r=>r.arrival.power));if(!pw.length)continue;const t1=pw[Math.floor(pw.length/3)],t2=pw[Math.floor(2*pw.length/3)];const g=[['low',rs.filter(r=>r.arrival.power<t1)],['mid',rs.filter(r=>r.arrival.power>=t1&&r.arrival.power<t2)],['high',rs.filter(r=>r.arrival.power>=t2)]];console.log(p.padEnd(10)+g.map(([n,x])=>(n+': '+(x.length?Math.round(100*x.filter(r=>r.win).length/x.length):'-')+'% win, power<'+(n==='low'?t1:n==='mid'?t2:'max')+', n='+x.length).padEnd(44)).join(''));}
  console.log('\nOUTCOME BY ARRIVAL HP (both modes): '+PROFILES.map(p=>{const rs=all.filter(r=>r.profile===p);const lo=rs.filter(r=>r.arrival.hp<0.8),hi=rs.filter(r=>r.arrival.hp>=0.8);return p+' hp<80%: '+(lo.length?Math.round(100*lo.filter(r=>r.win).length/lo.length)+'% (n'+lo.length+')':'-')+' hp>=80%: '+(hi.length?Math.round(100*hi.filter(r=>r.win).length/hi.length)+'% (n'+hi.length+')':'-');}).join(' | '));
})().catch(e=>{console.error(e);process.exit(1);});
