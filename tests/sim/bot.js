// Headless balance simulator: a bot plays a fresh account through Shatters and reports timings.
// Usage: node tests/sim/bot.js [--hours 48] [--shatters 3] [--seed 1] [--dt 0.1] [--json out.json] [--quiet]
//        node tests/sim/bot.js --endless 300    (start from a strong late save and run the Endless Road)
'use strict';
const {load}=require('./headless.js');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2);const n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const HOURS=args.hours||24,SHATTERS=args.shatters||0,DT=args.dt||0.1,QUIET=!!args.quiet,SEED=args.seed||1;
// player activity: taps per second on enemies while in battle (0 = idle player), abilities and surge always used when active
const PROFILES={idle:{taps:0,castP:0,auto:true,surgeDelay:Infinity,react:false},casual:{taps:0.4,castP:0.5,auto:false,surgeDelay:12,react:false},active:{taps:1,castP:1,auto:false,surgeDelay:2,react:true},optimizer:{taps:2,castP:1,auto:false,surgeDelay:0,react:true}};
const PROFILE=args.idle?'idle':(args.profile||'active');const P=Object.assign({},PROFILES[PROFILE]||PROFILES.active);if(args.taps!=null)P.taps=Number(args.taps);const TAPS=P.taps,ACTIVE=true;

// seeded RNG so runs are reproducible
let seed=SEED>>>0;function srand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
Math.random=srand;

const S=load({startMs:1700000000000});
const M={hours:0,events:[],recruits:{},talents:{},promotions:{},zones:{},zoneRec:{},firsts:{},shatters:[],boss:{},drops:{},gold:[],econ:{goldEarned:0,goldSpent:0,oreEarned:0,oreSpent:0},delve:{best:0,runs:0,deaths:0},endless:{best:0,milestones:0},stuck:[]};
function ev(kind,text){M.events.push({h:+M.hours.toFixed(2),kind,text});if(!QUIET)console.log(M.hours.toFixed(2).padStart(7)+'h  '+kind.padEnd(9)+' '+text);}

S.ready.then(main).catch(e=>{console.error(e);process.exit(1);});

function main(){
  const G=S.G,Z=S.ZONES;
  const origMakeItem=S.makeItem;
  // count every drop by zone and rank
  const bag=G.pack;let lastPack=bag.length;
  G.title=false;G.tut=null;G.autoSalvage=0;G.mult='max';
  if(args.endless){const lv=args.lvl||120;for(let i=0;i<Z.length-1;i++){G.cleared[i]=true;G.prog[i]=Z[i].fights;}for(const def of S.HEROES){if(!G.roster.find(h=>h.id===def.id)){const h=S.G.roster;S.addHero&&S.addHero(def,lv);}}for(const h of G.roster){h.lvl=lv;h.abLvl=args.rank||40;h.tier=3;h.tierMax=3;h.talents=h.talents||{};for(const t of S.TALENTS[h.cls])h.talents[t.id]=true;for(const slot of ['weapon','cape','charm']){const it=S.makeItem(Z.length-2,4);it.slot=slot;if(slot==='weapon')it.kind=S.CLASSES[h.cls].weapon;it.lvl=args.gear||60;h.eq[slot]=it;}S.refreshStats(h);h.hp=h.maxhp;}G.tree.hp=args.tree||60;G.tree.atk=args.tree||60;G.tree.def=Math.min(30,args.tree||60);G.tree.abil=30;G.reforges=args.reforged||2;G.endlessSeen=true;G.gold=1e9;G.ore=1e7;G.dust=500;travelTo(Z.length-1);ev('endless','start: party Lv '+avgLv()+', '+G.roster.length+' heroes, rank '+G.roster[0].abLvl+', gear +'+(args.gear||60));}
  let simSec=0,nextAct=0,nextHour=1,lastZone=-1,zoneEnter=0,zoneDefeats=0,bossWas=false,lastLosses=0,lastRoster=G.roster.length,lastCleared=0,lastReforges=G.reforges||0;
  let retreatUntil=0,farmTarget=0,tapAcc=0,lastProgressH=0,lastGold=G.gold,lastOre=G.ore,surgeReadyAt=0;
  const t0=Date.now();
  const target=HOURS*3600;
  while(simSec<target){
    simSec+=DT;S.clock.advance(DT*1000);S.setRT(S.getRT()+DT);M.hours=simSec/3600;
    G.title=false;if(G.tut!=null)G.tut=null;
    try{S.update(DT,true);}catch(e){ev('ERROR','update: '+e.message+' @ '+(e.stack||'').split('\n')[1]);break;}
    if(ACTIVE)play();
    // observations every tick
    {const dg=G.gold-lastGold,dO=G.ore-lastOre;if(dg>0)M.econ.goldEarned+=dg;else M.econ.goldSpent-=dg;if(dO>0)M.econ.oreEarned+=dO;else M.econ.oreSpent-=dO;lastGold=G.gold;lastOre=G.ore;}
    if(G.bossFight&&!bossWas){bossWas=true;const b=(M.boss[Z[G.zone].name]=M.boss[Z[G.zone].name]||{attempts:0,fails:0,streak:0,maxStreak:0,firstTry:0});b.attempts++;if(!b.firstTry){b.firstTry=simSec;b.lvFirst=avgLv();}}
    if(!G.bossFight&&bossWas){bossWas=false;}
    if(G.mode==='defeat'&&G.timer>2.5){if(bossWas){const b=M.boss[Z[G.zone].name];b.fails++;b.streak++;b.maxStreak=Math.max(b.maxStreak,b.streak);bossWas=false;}zoneDefeats++;}
    if(G.pack.length>lastPack){for(let i=lastPack;i<G.pack.length;i++){const it=G.pack[i];const k=Z[G.zone].name;(M.drops[k]=M.drops[k]||[0,0,0,0,0,0])[Math.min(5,it.rank||0)]++;const rn=['common','uncommon','rare','epic','legendary','mythic'][Math.min(5,it.rank||0)];if(M.firsts['first '+rn]==null)M.firsts['first '+rn]=+M.hours.toFixed(2);}}
    lastPack=G.pack.length;
    if(G.roster.length>lastRoster){for(let i=lastRoster;i<G.roster.length;i++){const h=G.roster[i];M.recruits[h.name]=+M.hours.toFixed(2);ev('recruit',h.name+' the '+S.CLASSES[h.cls].name);}lastRoster=G.roster.length;}
    const cl=G.cleared.filter(Boolean).length;if(cl>lastCleared){lastCleared=cl;const zi=G.cleared.lastIndexOf(true);M.zones[Z[zi].name]=M.zones[Z[zi].name]||+M.hours.toFixed(2);lastProgressH=M.hours;const zr=M.zoneRec[Z[zi].name];if(zr&&!zr.clearH){zr.clearH=+M.hours.toFixed(2);zr.lvAtClear=avgLv();zr.hours=+(zr.clearH-zr.enterH).toFixed(2);const b=M.boss[Z[zi].name];if(b){b.streak=0;b.stallH=+((simSec-b.firstTry)/3600).toFixed(2);b.lvClear=avgLv();}}ev('cleared',Z[zi].name+' (party Lv '+avgLv()+')');}
    if(G.zone!==lastZone){lastZone=G.zone;zoneEnter=simSec;zoneDefeats=0;const zn=Z[G.zone].name;if(!M.zoneRec[zn])M.zoneRec[zn]={enterH:+M.hours.toFixed(2),lvAtEntry:avgLv()};}
    if(G.delve){M.delve.best=Math.max(M.delve.best,G.delve.floor||0);}
    if(Z[G.zone].endless){const b=G.prog[G.zone]||0;if(b>M.endless.best){const m0=Math.floor(M.endless.best/25),m1=Math.floor(b/25);M.endless.best=b;if(m1>m0&&(m1%10===0||m1<=3))ev('milestone','#'+m1+' at fight '+b+' (party Lv '+avgLv()+', omens '+(G.omens||[]).length+', renown '+S.fmtNum(G.renown||0)+')');}}
    if(simSec>=nextAct){nextAct=simSec+5;act();}
    if(M.hours>=nextHour){nextHour++;M.gold.push({h:M.hours|0,gold:Math.round(G.gold),ore:Math.round(G.ore),dust:G.dust,zone:Z[G.zone].name,prog:G.prog[G.zone],lv:avgLv(),wins:G.wins});if(!QUIET&&(M.hours|0)%4===0)console.log(`   -- ${M.hours|0}h zone ${Z[G.zone].name} prog ${G.prog[G.zone]} Lv ${avgLv()} gold ${S.fmtNum(G.gold)} ore ${S.fmtNum(G.ore)} dust ${G.dust} shatters ${G.reforges||0} (${((Date.now()-t0)/1000).toFixed(0)}s real)`);}
    if(SHATTERS&&(G.reforges||0)>=SHATTERS)break;
    if(args.endless&&Math.floor(M.endless.best/25)>=args.endless)break;
  }
  report();

  function play(){if(P.auto){G.autoCast=true;G.autoUntil=9e15;}if(G.mode!=='battle'){surgeReadyAt=0;return;}if(!P.auto)for(const h of G.active){if(!h.dead&&h.charge>=100&&!h.tapCast){if(P.castP<1&&Math.random()>P.castP*DT*2)continue;if(P.react&&S.reactTo(h))continue;h.tapCast=true;h.charge=0;}}if(G.surge>=100&&!G.delve&&!G.hordeFight&&P.surgeDelay<Infinity){if(!surgeReadyAt)surgeReadyAt=simSec+P.surgeDelay;if(simSec>=surgeReadyAt){try{S.castSurge();}catch(e){}surgeReadyAt=0;}}tapAcc+=TAPS*DT;while(tapAcc>=1){tapAcc-=1;const foes=G.enemies.filter(e=>!e.dead);if(!foes.length)break;const t=(G.focus&&G.focus.e&&!G.focus.e.dead)?G.focus.e:foes.sort((a,b)=>a.hp-b.hp)[0];try{S.tapEnemy(t);}catch(e){}}}
  function avgLv(){return Math.round(G.active.reduce((a,h)=>a+h.lvl,0)/Math.max(1,G.active.length));}
  function zoneOk(i){return i===0||G.cleared[i-1];}
  function travelTo(i){if(i===G.zone||!zoneOk(i))return;G.zone=i;G.enemies=[];G.projs=[];G.action=null;G.mode='walk';G.enc=3;G.screen='road';G.bossFight=false;for(const h of G.active){h.dead=false;h.status={};h.hp=h.maxhp;}S.layout();ev('travel',Z[i].name);}

  function act(){
    G.sheet=null;
    // omens: take the first offer
    if(G.omenOffer&&G.omenOffer.length){G.omens=(G.omens||[]).concat([G.omenOffer[0]]);G.omenOffer=null;}
    if(G.hordeFight||G.delve){delveStep();return;}
    // gear: equip the best, salvage the rest
    try{S.equipBest();}catch(e){}
    for(const it of G.pack.slice()){if(it.super)continue;S.sellItem(it);}
    // gear upgrades: cheapest equipped item first while ore allows
    for(let k=0;k<6;k++){let best=null,bc=Infinity,bh=null;for(const h of G.roster){for(const it of Object.values(h.eq||{})){if(!it)continue;const c=S.upgradeCost(it);if(c<bc){bc=c;best=it;bh=h;}}}if(!best||bc>G.ore*0.8)break;const m=G.mult;G.mult=1;S.upgradeItem(best,bh);G.mult=m;}
    spend();
    // promotions and talents (gated by level in the game itself)
    for(const h of G.roster){const q=S.promoteReq(h);if((h.tier||0)<3&&h.lvl>=q.lvl&&G.gold>=q.gold&&G.dust>=q.dust){const t=h.tier||0;S.promoteHero(h);if((h.tier||0)>t){M.promotions[h.name+' T'+h.tier]=+M.hours.toFixed(2);if(M.firsts['first T'+h.tier]==null)M.firsts['first T'+h.tier]=+M.hours.toFixed(2);ev('promote',h.name+' -> tier '+h.tier);}}
      const TL=S.TALENTS[h.cls]||[];TL.forEach((t,i)=>{if(h.talents&&h.talents[t.id])return;const q=S.talentReq(i);if(h.lvl>=q.lvl&&G.gold>=q.gold*1.2){S.buyTalent(h,i);if(h.talents[t.id]){M.talents[h.name+': '+t.name]=+M.hours.toFixed(2);if(M.firsts['first talent']==null)M.firsts['first talent']=+M.hours.toFixed(2);ev('talent',h.name+' learns '+t.name);}}});}
    // road decisions
    const zi=G.zone;
    if(retreatUntil&&simSec<retreatUntil){/* farming the previous zone */}
    else if(G.cleared[zi]&&zi<Z.length-1&&zoneOk(zi+1)){if(!Z[zi+1].endless||avgLv()>=Z[zi+1].lv-2)travelTo(zi+1);}
    else if(zoneDefeats>=4&&zi>0&&!Z[zi].endless&&(simSec-zoneEnter)>600){M.stuck.push({zone:Z[zi].name,h:+M.hours.toFixed(2),lv:avgLv()});ev('retreat',Z[zi].name+' after '+zoneDefeats+' defeats, farming '+Z[zi-1].name);travelTo(zi-1);zoneDefeats=0;retreatUntil=simSec+1800;farmTarget=avgLv()+3;}
    if(retreatUntil&&(simSec>=retreatUntil||avgLv()>=farmTarget)&&G.cleared[G.zone]&&zoneOk(G.zone+1)){retreatUntil=0;travelTo(G.zone+1);}
    // hordes: prepare and fight when due
    if(G.castle.hordeDue&&S.hordeWindow().used<2&&G.mode==='walk'){const p=G.castle.prep||(G.castle.prep={});for(const k of ['walls','merc']){const c=S.prepCost(k);if(!p[k]&&G.gold>=c*3){G.gold-=c;p[k]=true;if(k==='merc')p.mercLv=1;}}const before=G.castle.hordeCount||0;try{S.startHordeFight();}catch(e){}if(G.hordeFight)ev('horde','#'+((G.castle.currentHorde||{}).number||'?')+' '+S.hordeTier()+' threat '+S.fmtNum(S.hordeThreat())+' vs defense '+S.defense().total);}
    // catacombs when a key is ready and the road is quiet
    if(!G.delve&&(G.delveKeys||0)>0&&G.mode==='walk'&&G.roster.length>=3){const h=G.roster.slice().sort((a,b)=>b.lvl-a.lvl)[0];try{S.startDelve(h);M.delve.runs++;}catch(e){}}
    // shatter: once eligible, when the party has been stuck a while or the gain is large
    if(S.canReforge()&&SHATTERS&&(G.reforges||0)<SHATTERS){const gain=S.reforgeGain();const stalled=(M.hours-lastProgressH)>=3&&retreatUntil>0;if(gain>=15&&(stalled||(Z[G.zone].endless&&(G.prog[G.zone]||0)>=100))){G.oathPick=null;S.doReforge();lastProgressH=M.hours;M.shatters.push({h:+M.hours.toFixed(2),gain,dust:G.dust});M.firsts['shatter '+G.reforges]=+M.hours.toFixed(2);ev('shatter','#'+G.reforges+' for +'+gain+' dust (total '+G.dust+')');zoneDefeats=0;retreatUntil=0;}}
  }
  function delveStep(){const d=G.delve;if(!d)return;if(d.choose&&(d.floor||0)>=(args.delveCap||30)){S.endDelve(false,true);return;}if(d.choose){const h=d.hero;const f=h.hp/h.maxhp;const pick=(k)=>d.doors.includes(k)?k:null;let k=null;if(f<0.45)k=pick('rest')||pick('chest')||pick('shrine');if(!k&&f>0.8)k=pick('elite')||pick('chest')||pick('fight');if(!k)k=pick('chest')||pick('fight')||pick('rest')||pick('shrine')||pick('merchant')||d.doors[0];if(f<0.3&&!pick('rest')){M.delve.runs;S.endDelve(false,true);return;}try{S.chooseDoor(k);}catch(e){}}}

  function spend(){
    const C=G.castle;
    for(let guard=0;guard<40;guard++){let did=false;
      // buildings: cheapest of the three while it is under a third of our gold
      let bk=null,bc=Infinity;for(const k of ['market','mine','walls']){const c=S.buildCost(k);if(c<bc){bc=c;bk=k;}}
      const pressure=zoneDefeats>=2||retreatUntil>0;if(bk&&bc<=G.gold*(pressure?0.08:0.3)){G.gold-=bc;C.b[bk]++;did=true;}
      // villagers: hire while cheap, then assign idle ones
      const hc=S.hireCost();if(C.vil.total<S.vilCap()&&hc<=G.gold*0.15){G.gold-=hc;C.hired++;C.vil.total++;did=true;}
      while(S.idleVil()>0){const canM=C.vil.market<C.b.market*3,canI=C.vil.mine<C.b.mine*3;if(canM&&(!canI||C.vil.market<=C.vil.mine))C.vil.market++;else if(canI)C.vil.mine++;else break;did=true;}
      // ability ranks: cheapest hero while under a fifth of gold
      let rh=null,rc=Infinity;for(const h of G.roster){const c=S.rankCost(h);if(c<rc){rc=c;rh=h;}}
      if(rh&&rc<=G.gold*(pressure?0.4:0.2)){G.gold-=rc;rh.abLvl++;did=true;}
      // tree: cheapest gold node under a fifth of gold; dust nodes with spare dust
      let tn=null,tc=Infinity;for(const n of S.TREE){if(S.treeLv(n.id)>=n.max)continue;const isD=n.cur==='dust';const c=Math.round(n.base*(isD?1:1.5)*Math.pow(isD?1.5:1.75,S.treeLv(n.id)));const combat=['hp','atk','def','abil','front','crit'].includes(n.id);const budget=isD?G.dust*0.5:G.gold*((pressure&&combat)?0.45:combat?0.25:0.12);if(c<=budget&&c<tc){tc=c;tn=n;}}
      if(tn){if(tn.cur==='dust')G.dust-=tc;else G.gold-=tc;G.tree[tn.id]=S.treeLv(tn.id)+1;for(const h of G.roster)S.refreshStats(h);did=true;}
      // garrison: post idle heroes on the walls
      const slots=S.garrisonSlots();if(C.garrison.length<slots){const idle=G.roster.find(h=>!G.active.includes(h)&&!C.garrison.includes(h.id)&&S.heroStatus(h)==='camp');if(idle){C.garrison.push(idle.id);idle.postedAt=Date.now();did=true;}}
      if(!did)break;}
  }

  function report(){
    const dm=(G.stats&&G.stats.dmgBy)||{};const dtot=Object.values(dm).reduce((a,b)=>a+b,0)||1;const dmgShare=Object.fromEntries(['basic','ability','tap','surge'].map(k=>[k,+((dm[k]||0)/dtot).toFixed(3)]));const hrs=Math.max(0.01,M.hours);
    const dmgPerHour=Object.fromEntries(['basic','ability','tap','surge'].map(k=>[k,Math.round((dm[k]||0)/hrs)]));dmgPerHour.total=Math.round(dtot/hrs);const castsPerHour=Math.round(((G.stats&&G.stats.casts)||0)/hrs);
    const out={config:{hours:HOURS,shatters:SHATTERS,seed:SEED,dt:DT,profile:PROFILE,taps:TAPS},dmgShare,dmgPerHour,castsPerHour,firsts:M.firsts,zoneRec:M.zoneRec,econPerHour:{goldEarned:Math.round(M.econ.goldEarned/hrs),goldSpent:Math.round(M.econ.goldSpent/hrs),oreEarned:Math.round(M.econ.oreEarned/hrs),oreSpent:Math.round(M.econ.oreSpent/hrs),renown:Math.round((G.renown||0)/hrs)},simHours:+M.hours.toFixed(2),final:{zone:Z[G.zone].name,prog:G.prog[G.zone],partyLv:avgLv(),gold:Math.round(G.gold),ore:Math.round(G.ore),dust:G.dust,shatters:G.reforges||0,wins:G.wins,defeats:G.stats.defeats||0,castle:G.castle.b,renown:G.renown||0},
      recruits:M.recruits,zonesCleared:M.zones,promotions:M.promotions,talents:M.talents,shatters:M.shatters,bossFailRates:Object.fromEntries(Object.entries(M.boss).map(([k,v])=>[k,{attempts:v.attempts,fails:v.fails,rate:v.attempts?+(v.fails/v.attempts).toFixed(2):0,maxStreak:v.maxStreak,stallH:v.stallH==null?null:v.stallH,lvFirst:v.lvFirst,lvClear:v.lvClear==null?null:v.lvClear}])),
      drops:Object.fromEntries(Object.entries(M.drops).map(([k,v])=>[k,{common:v[0],uncommon:v[1],rare:v[2],epic:v[3],legendary:v[4],mythic:v[5]}])),catacombs:{best:Math.max(M.delve.best,G.delveBest||0),runs:M.delve.runs},endless:{best:Math.max(M.endless.best,(G.far||[])[Z.length-1]||0),milestones:Math.floor(Math.max(M.endless.best,(G.far||[])[Z.length-1]||0)/25)},stuck:M.stuck,hourly:M.gold};
    if(args.json)require('fs').writeFileSync(args.json,JSON.stringify(out,null,1));
    console.log('\n=== SUMMARY ('+out.simHours+'h simulated, seed '+SEED+') ===');
    console.log('final: '+JSON.stringify(out.final));
    console.log('recruits (h): '+JSON.stringify(out.recruits));
    console.log('zones cleared (h): '+JSON.stringify(out.zonesCleared));
    console.log('promotions (h): '+JSON.stringify(out.promotions));
    console.log('talents (h): '+JSON.stringify(out.talents));
    console.log('shatters: '+JSON.stringify(out.shatters));
    console.log('boss fail rates: '+JSON.stringify(out.bossFailRates));
    console.log('damage share: '+JSON.stringify(out.dmgShare)+'  dmg/h: '+JSON.stringify(out.dmgPerHour)+'  casts/h: '+out.castsPerHour+'  econ/h: '+JSON.stringify(out.econPerHour));
    console.log('firsts: '+JSON.stringify(out.firsts));
    console.log('drops by zone: '+JSON.stringify(out.drops));
    console.log('catacombs: '+JSON.stringify(out.catacombs)+'  endless: '+JSON.stringify(out.endless));
    if(out.stuck.length)console.log('stuck: '+JSON.stringify(out.stuck));
    process.exit(0);
  }
}
