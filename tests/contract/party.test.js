// Party-composition contract tests: each new hero (and the fire archer ranger) fielded in a live party through real road encounters
// driven by the production update loop, plus the bot's --party flag (a preferred lineup that never unlocks a hero early and records the
// requested and actual party in the result). The default bot benches the newcomers, so this suite is where they actually fight.
// Run: node tests/contract/party.test.js   (exit code 1 on any failure)
'use strict';
const H=require('../sim/headless.js'),cp=require('child_process'),fs=require('fs'),path=require('path'),os=require('os');
let pass=0,fail=0;const out=[];
function ok(c,m){if(c)pass++;else{fail++;out.push('FAIL '+m);}}
async function game(seed=1){const S=H.load({seed,startMs:1700000000000});await S.ready;const G=S.G;G.title=false;G.tut=null;G.mult='max';G.screen='road';G.campfireDone=true;G.wins=Math.max(G.wins,3);return S;}
function field(S,classes,lvl){const G=S.G;const party=[];for(const cls of classes){const def=S.HEROES.find(d=>d.cls===cls);let h=G.roster.find(x=>x.id===def.id);if(!h)h=S.addHero(def,lvl);h.lvl=lvl;h.tier=0;h.uid=S.heroUid(h);S.refreshStats(h);h.hp=h.maxhp;h.dead=false;h.status={};h.charge=0;party.push(h);}G.active=party;G.active.forEach(h=>{h.x=null;});S.layout();G.autoCast=true;G.autoUntil=S.clock.get()+24*3600e3;return party;}
function run(S,minutes,watch){const G=S.G;G.zone=0;G.mode='walk';const acts={};let frames=Math.round(minutes*60*60),last=null,bad=[];const num=v=>typeof v==='number'&&Number.isFinite(v);
  for(let f=0;f<frames;f++){S.setRT(S.getRT()+1/60);S.clock.frame();G.tut=null;G.sheet=null;S.update(1/60,true);
    const a=G.action;if(a&&a!==last&&a.u&&!a.u.enemy){const k=a.u.id+':'+(a.kind==='ability'?'ability:'+a.ab:a.kind);acts[k]=(acts[k]||0)+1;}last=a;
    if(f%60===0){if(!num(G.gold)||!num(G.ore)||!num(G.dust))bad.push('currency not finite at frame '+f);if(G.active.length>S.partyMax())bad.push('party over cap');for(const h of G.active){if(!num(h.hp)||h.hp>h.maxhp+1e-6||h.hp<0)bad.push(h.id+' hp out of range '+h.hp);if(!num(h.xp)||!num(h.x))bad.push(h.id+' xp or x not finite');}for(const p of G.projs)if(!num(p.t)||!num(p.dur)||!p.tgt)bad.push('bad projectile');}}
  return {acts,bad};}
(async()=>{
  // ---- each newcomer in a party of originals, then the newcomers together
  const lineups=[['knight','cleric','engineer','mage'],['knight','cleric','summoner','mage'],['knight','bard','rogue','cleric'],['knight','ranger','cleric','mage'],['engineer','summoner','bard','ranger'],['bard','engineer','summoner','knight']];
  let seed=21;for(const L of lineups){const S=await game(seed++),G=S.G;const party=field(S,L,25);const k0=G.stats.kills;const r=run(S,6);
    const label=L.join('/');ok(r.bad.length===0,label+': invariants held ('+r.bad.slice(0,3).join('; ')+')');ok(G.stats.kills-k0>=8,label+': the party wins fights ('+(G.stats.kills-k0)+' kills in 6 min)');
    for(const h of party){const cls=h.cls,ab=S.CLASSES[cls].ab.id;const basic=Object.entries(r.acts).filter(([k])=>k.startsWith(h.id+':')&&!k.includes('ability')).reduce((a,[,v])=>a+v,0);const casts=r.acts[h.id+':ability:'+ab]||0;
      ok(basic>=5,label+': '+h.name+' the '+cls+' attacked ('+basic+' basic actions)');if(['engineer','summoner','bard','ranger'].includes(cls))ok(casts>=1,label+': '+h.name+' cast '+S.CLASSES[cls].ab.name+' ('+casts+' casts)');}
    ok((G.stats.dmgBy||{}).ability>0&&(G.stats.dmgBy||{}).basic>0,label+': basic and ability damage both counted');ok(G.projs.every(p=>!p.hidden||p.src),label+': hidden projectiles carry their source');}

  // ---- the bot's --party flag: a preferred lineup, never an unlock, recorded in the result; duplicates and unknown ids rejected
  {const bot=path.join(__dirname,'..','sim','bot.js'),tmp=path.join(os.tmpdir(),'cr_party_'+process.pid+'.json');
    const r=cp.spawnSync(process.execPath,[bot,'--hours','3','--seed','81','--profile','casual','--speed','2','--quiet','--json',tmp,'--party','perrin,osric,idris,aldric'],{encoding:'utf8',maxBuffer:1<<26});
    ok(r.status===0,'bot runs with --party (exit '+r.status+')');let res=null;try{res=JSON.parse(fs.readFileSync(tmp,'utf8'));}catch(e){}ok(!!res,'result written');
    if(res){ok(JSON.stringify(res.config.party)==='["perrin","osric","idris","aldric"]'&&JSON.stringify(res.partyRequested)===JSON.stringify(res.config.party),'the requested party is in the config and the result');
      ok(Array.isArray(res.partyActual)&&res.partyActual.length>0&&res.partyActual.length<=4,'the actual ordered party is recorded ('+res.partyActual.join(',')+')');
      const rec=res.recruits||{};const recruitedIds=res.roster.map(h=>h.name.toLowerCase());ok(res.partyActual.every(id=>recruitedIds.includes(id)),'every fielded hero was recruited by production first');
      const early=(res.partyChanges||[]).filter(c=>c.party.some(id=>id==='osric'&&!(rec.Osric!=null&&rec.Osric<=c.h)));ok(early.length===0,'Osric never fielded before his recruitment hour');
      ok(!res.assertFail,'no assertion failures ('+(res.assertFail||'none')+')');
      if(rec.Osric!=null){const c=(res.partyChanges||[]).find(c=>c.party.includes('osric'));ok(!!c&&c.h>=rec.Osric&&c.h-rec.Osric<0.25&&res.partyActual.includes('osric'),'Osric is fielded within a quarter hour of his recruitment (recruited '+rec.Osric+' h, fielded '+(c&&c.h)+' h) and stays in the party');ok(res.partyActual[0]==='osric'||res.partyActual[0]==='perrin'||res.partyActual[0]==='idris','a requested hero holds the front once fielded ('+res.partyActual.join(' > ')+')');}else ok(true,'Osric not recruited within the run; lineup rule not exercised');
      const first=res.partyActual[0];ok(first==='perrin'||first==='osric'||first==='idris'||first==='aldric','the front hero follows the requested order (front '+first+')');}
    const dup=cp.spawnSync(process.execPath,[bot,'--hours','0.1','--seed','81','--profile','casual','--speed','2','--quiet','--party','aldric,aldric'],{encoding:'utf8'});ok(dup.status===2&&/duplicate/.test(dup.stderr),'a duplicate id is rejected before the run');
    const unk=cp.spawnSync(process.execPath,[bot,'--hours','0.1','--seed','81','--profile','casual','--speed','2','--quiet','--party','aldric,nobody'],{encoding:'utf8'});ok(unk.status===2&&/unknown nobody/.test(unk.stderr),'an unknown id is rejected before the run');
    try{fs.unlinkSync(tmp);}catch(e){}}

  console.log(out.join('\n'));console.log((fail?'FAIL':'PASS')+'  '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
