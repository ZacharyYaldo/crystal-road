// Late-boss damage-per-action comparison (observation only): Warlord (locked reference), Sand Tyrant, Hunter King, Grave Knight (Ashen Approach), Hollow King (Ashen Keep).
// Combines existing arrival snapshots (hero HP/DEF at natural arrival) with existing batch telemetry (attempt logs).
// Usage: node tests/sim/lateboss.js [--snapDir snapshots] [--dirs batch_out_p15,batch_out_p14x] [--profiles idle,light,casual,engaged,stress] [--matchLv] (matchLv: only use a run's snapshot when its arrival level equals that arm's first-attempt level; for snapshot dirs shared by two arms)
'use strict';
const {load}=require('./headless.js'),fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const SNAP=path.join(__dirname,String(args.snapDir||'snapshots')),DIRS=String(args.dirs||'batch_out_p15,batch_out_p14x').split(','),P=String(args.profiles||'idle,light,casual,engaged,stress').split(',');
const BOSSES=[{zone:'Ironvein Caverns',id:'warlord',prefix:'ironvein',charge:'melee x2.5'},{zone:'Emberwaste',id:'sandtyrant',prefix:'emberwaste',charge:'melee x2.5'},{zone:'Amberfall Woods',id:'hunterking',prefix:'amberfall',charge:'volley x2.2'},{zone:'Ashen Approach',id:'graveknight',prefix:'ashen',charge:'melee x2.5'},{zone:'Ashen Keep',id:'necromancer',prefix:'ashen',charge:'none'}];
const srt=a=>a.filter(v=>v!=null&&!isNaN(v)).sort((x,y)=>x-y),med=a=>{a=srt(a);return a.length?a[Math.floor((a.length-1)/2)]:null;},f=(v,d=1)=>v==null?'-':String(+(+v).toFixed(d));
(async()=>{
  const S=load({startMs:1700000000000});await S.ready;const G=S.G,Z=S.ZONES,E=S.ENEMIES;
  // telemetry: first-attempt state and pooled attempt outcomes per zone/profile, from the first dir that has the profile
  const runs={};for(const p of P){for(const d of DIRS){const dir=path.join(__dirname,d);if(!fs.existsSync(dir))continue;const rs=fs.readdirSync(dir).filter(x=>x.startsWith(p+'_')&&x.endsWith('.json')).map(x=>Object.assign(JSON.parse(fs.readFileSync(path.join(dir,x),'utf8')),{seed:Number((x.match(/_(\d+)\.json$/)||[])[1])})).filter(r=>r.bossFailRates);if(rs.length){runs[p]={dir:d,rs};break;}}}
  for(const B of BOSSES){
    const zi=Z.findIndex(z=>z.name===B.zone);const e=E[B.id];
    console.log('\n=== '+e.name+' ('+B.zone+', zone '+(zi+1)+', enemy Lv '+Z[zi].lv+')  base HP x'+e.hp+' ATK x'+e.atk+' DEF x'+e.def+' spd '+e.spd+' '+e.range+'  charge '+B.charge+'  mech '+JSON.stringify(e.mech));
    console.log('profile'.padEnd(8)+'snaps'.padEnd(6)+'arrLv'.padEnd(6)+'heroHP med'.padEnd(11)+'heroDEF'.padEnd(8)+'bossATK'.padEnd(8)+'ordHit front/back'.padEnd(18)+'hits2kill f/b'.padEnd(14)+'charge%HP f/b'.padEnd(14)+'| attempts'.padEnd(10)+'auto w/a'.padEnd(10)+'active w/a'.padEnd(11)+'chg hits/kills per att'.padEnd(23)+'bossHits/att'.padEnd(13)+'loss bossHP%'.padEnd(13)+'summon%'.padEnd(8)+'win surv/HP%'.padEnd(13)+'first-try'.padEnd(10)+'source');
    for(const p of P){
      let snaps=fs.readdirSync(SNAP).filter(x=>x.startsWith(B.prefix+'_'+p+'_')).map(x=>JSON.parse(fs.readFileSync(path.join(SNAP,x),'utf8'))).filter(s=>s.zoneName===B.zone);
      const R0=runs[p];if(args.matchLv&&R0){const firstLv={};for(const r of R0.rs){const b=r.bossFailRates[B.zone];const a=b&&b.attemptLog&&b.attemptLog[0];if(a&&r.seed!=null)firstLv[r.seed]=a.lv;}const before=snaps.length;snaps=snaps.filter(s=>firstLv[s.seed]!=null&&Math.round(firstLv[s.seed])===Math.round(s.lv));if(before!==snaps.length)process.stderr.write(B.zone+' '+p+': '+snaps.length+' of '+before+' snapshots match this arm\'s first-attempt level\n');}
      const hpF=[],hpB=[],defF=[],defB=[],lvs=[];
      for(const snap of snaps){S.storeSet(snap.save);S.loadGame();G.noSave=true;G.title=false;G.tut=null;const front=G.active[0];for(const h of G.active){(h===front?hpF:hpB).push(h.maxhp);(h===front?defF:defB).push(h.def);}lvs.push(snap.lv);}
      const R=runs[p];const b=R?R.rs.map(r=>r.bossFailRates[B.zone]).filter(Boolean):[];const att=[].concat(...b.map(x=>x.attemptLog||[]));const first=b.map(x=>(x.attemptLog||[])[0]).filter(Boolean);
      if(!snaps.length&&!att.length){console.log(p.padEnd(8)+'no data');continue;}
      const bossAtk=med(first.map(a=>a.bossAtk));const mHF=med(hpF),mHB=med(hpB),mDF=med(defF),mDB=med(defB);
      const ordF=bossAtk!=null&&mDF!=null?Math.max(1,bossAtk-mDF*0.5*1.15):null,ordB=bossAtk!=null&&mDB!=null?Math.max(1,bossAtk-mDB*0.5):null;const cm=B.charge==='none'?0:(B.charge.startsWith('volley')?2.2:2.5);
      const chF=bossAtk!=null&&mDF!=null?Math.max(1,bossAtk*cm-mDF*0.5*1.15):null,chB=bossAtk!=null&&mDB!=null?Math.max(1,bossAtk*cm-mDB*0.5):null;
      const auto=att.filter(a=>a.window==='auto'),act=att.filter(a=>a.window!=='auto'),losses=att.filter(a=>!a.win),wins=att.filter(a=>a.win);
      console.log(p.padEnd(8)+String(snaps.length).padEnd(6)+f(med(lvs),0).padEnd(6)+(mHF!=null?f(mHF,0)+'/'+f(mHB,0):'-').padEnd(11)+(mDF!=null?f(mDF,0)+'/'+f(mDB,0):'-').padEnd(8)+f(bossAtk,0).padEnd(8)+(ordF!=null?f(ordF,0)+'/'+f(ordB,0):'-').padEnd(18)+(ordF!=null?f(mHF/ordF,1)+'/'+f(mHB/ordB,1):'-').padEnd(14)+(chF!=null&&cm?f(100*chF/mHF,0)+'%/'+f(100*chB/mHB,0)+'%':'-').padEnd(14)+('| '+att.length).padEnd(10)+(auto.filter(a=>a.win).length+'/'+auto.length).padEnd(10)+(act.filter(a=>a.win).length+'/'+act.length).padEnd(11)+(att.length?f(att.reduce((s,a)=>s+(a.chargeHits||0),0)/att.length,2)+'/'+f(att.reduce((s,a)=>s+(a.chargeKills||0),0)/att.length,2)+' (tele '+f(att.reduce((s,a)=>s+(a.telegraphs||0),0)/att.length,2)+')':'-').padEnd(23)+f(att.length?att.reduce((s,a)=>s+(a.bossHits||0),0)/att.length:null,1).padEnd(13)+f(losses.length?100*med(losses.map(a=>a.hpLeft)):null,0).padEnd(13)+f(losses.length?100*losses.filter(a=>a.summoned).length/losses.length:null,0).padEnd(8)+(wins.length?f(med(wins.map(a=>a.survivors)),0)+'/'+f(100*med(wins.map(a=>a.partyHp)),0)+'%':'-').padEnd(13)+(b.length?Math.round(100*b.filter(x=>x.firstTryClear).length/b.length)+'% n'+b.length:'-').padEnd(10)+(R?R.dir:'-'));
    }
  }
  console.log('\nordHit = boss ATK - hero DEF*0.5 (front x1.15; tree front bonus ignored), before the 0.85-1.15 roll and crits; hits2kill = hero max HP / ordHit; charge%HP = charge damage as % of hero max HP (melee x2.5, volley x2.2). Telemetry columns pool every attempt in the source dir; first-try is per run.');
})().catch(e=>{console.error(e);process.exit(1);});
