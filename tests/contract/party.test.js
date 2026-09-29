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

  // ---- the production party functions carry every side effect of the Party sheet
  {const S=await game(40),G=S.G;field(S,['knight','cleric','rogue','mage'],20);const ids=()=>G.active.map(h=>h.id).join();const osr=S.addHero(S.HEROES.find(d=>d.id==='osric'),14);
    ok(!G.active.includes(osr)&&S.heroStatus(osr)==='camp','a recruit joins the camp when the party is full');
    G.mode='walk';G.danger='x';ok(S.partyReorder(0,2)&&ids()==='vex,sera,aldric,morrow','reorder: two marchers trade places ('+ids()+')');ok(G.danger===null,'reorder marks the build changed, as the sheet does');ok(!S.partyReorder(1,1)&&!S.partyReorder(0,9)&&ids()==='vex,sera,aldric,morrow','reorder refuses the same slot and an empty slot');
    const out=G.active[3];out.status={rage:2};out.dx=12;G.action={u:out,kind:'melee'};osr.hp=0;osr.dead=true;osr.status={poison:3};osr.x=200;
    ok(S.partyBringIn(osr,3)&&G.active[3]===osr&&!G.active.includes(out)&&S.heroStatus(out)==='camp','bring in: the camp hero takes the marcher\'s place, who goes to camp');
    ok(osr.dead===false&&osr.hp===Math.round(osr.maxhp*0.5)&&Object.keys(osr.status).length===0&&osr.x===-30&&osr.anim==='walk','the newcomer is revived at half health, statuses cleared, enters from the left, walking');
    ok(G.action===null&&out.dx===0,'the replaced marcher\'s action is cancelled');
    G.mode='battle';ok(S.partyBringIn(out,0)&&G.active[0]===out&&out.anim==='idle','in a battle the newcomer stands idle');G.mode='walk';
    const n0=G.active.length,gone=G.active[1];gone.status={shield:2};G.action={u:gone,kind:'melee'};gone.dx=5;G.danger='x';ok(S.partyToCamp(1)&&G.active.length===n0-1&&!G.active.includes(gone)&&Object.keys(gone.status).length===0&&G.action===null&&gone.dx===0&&G.danger===null,'send to camp: removed, statuses cleared, action cancelled, build changed');
    ok(S.partyBringIn(gone)&&G.active[G.active.length-1]===gone&&gone.x===-30,'with a free place the hero joins at the back');
    const vex=G.roster.find(h=>h.id==='vex'),before=ids();ok(!S.partyBringIn(vex)&&ids()===before,'a full party takes nobody without a marcher to replace');
    G.quests.push({hero:vex,q:S.QUESTS[0],end:S.clock.get()+1e6});ok(S.heroStatus(vex)==='quest'&&!S.partyCanField(vex)&&!S.partyBringIn(vex,0)&&ids()===before,'a hero on a quest cannot be fielded');G.quests.length=0;
    G.castle.garrison.push(vex.id);vex.postedAt=S.clock.get();ok(S.postLeft(vex)>0&&!S.partyCanField(vex),'a hero holding a post cannot be fielded by the order function');S.partySetOrder(['vex']);ok(!G.active.includes(vex),'the order function leaves him on the wall');G.castle.garrison=[];vex.postedAt=0;
    ok(S.partyCanField(vex)&&!S.partyCanField({id:'ghost'})&&!S.partyCanField(null),'a camp hero can be fielded; someone outside the roster cannot');
    while(G.active.length>1)S.partyToCamp(G.active.length-1);ok(!S.partyToCamp(0)&&G.active.length===1,'the last marcher cannot be sent to camp');}

  // ---- partySetOrder: the party cap, the requested order as heroes become legally available, nothing changed when the order holds
  {const S=await game(41),G=S.G;field(S,['knight','cleric','rogue','mage'],20);G.mode='walk';const REQ=['perrin','osric','idris','aldric'];const def=id=>S.HEROES.find(d=>d.id===id);
    const mark=G.active[1];mark.status={ward:2};G.danger='x';let r=S.partySetOrder(REQ);ok(r.join()==='aldric,sera,vex,morrow'&&mark.status.ward===2&&G.danger==='x','nobody new is available: the order already holds and nothing is touched ('+r.join()+')');
    ok(!G.roster.find(h=>h.id==='osric')&&!G.roster.find(h=>h.id==='perrin'),'the order function recruited nobody');
    S.addHero(def('osric'),14);r=S.partySetOrder(REQ);ok(r.join()==='osric,aldric,sera,vex'&&S.heroStatus(G.roster.find(h=>h.id==='morrow'))==='camp','Osric recruited: front place, requested order kept, the last marcher goes to camp ('+r.join()+')');
    S.addHero(def('idris'),27);r=S.partySetOrder(REQ);ok(r.join()==='osric,idris,aldric,sera','Idris recruited: '+r.join());
    S.addHero(def('perrin'),42);r=S.partySetOrder(REQ);ok(r.join()==='perrin,osric,idris,aldric','Perrin recruited: the full request in its order ('+r.join()+')');
    G.danger='x';const st=G.active.map(h=>h.status);r=S.partySetOrder(REQ);ok(r.join()==='perrin,osric,idris,aldric'&&G.danger==='x'&&G.active.every((h,i)=>h.status===st[i]),'a second call changes nothing');
    r=S.partySetOrder(['aldric','aldric','nobody','sera']);ok(r.join()==='aldric,sera,perrin,osric'&&G.active.length===4,'repeated and unknown ids are ignored; the other places keep their marchers in order ('+r.join()+')');
    r=S.partySetOrder(['sera','vex','morrow','aldric','perrin','osric']);ok(r.join()==='sera,vex,morrow,aldric'&&G.active.length===S.partyMax(),'a longer request fills the party up to partyMax and no further ('+r.join()+')');
    G.oath='solitude';ok(S.partyMax()===1,'the Oath of Solitude makes the party one');r=S.partySetOrder(REQ);ok(r.join()==='perrin'&&G.active.length===1,'the current partyMax is enforced: one marcher, the first requested hero ('+r.join()+')');G.oath=null;}

  // ---- one path: the sheet and the simulator write to the party only through the shared functions
  {const src=fs.readFileSync(path.join(__dirname,'..','..','source','game.js'),'utf8');const i=src.indexOf("if(s.kind==='swap'){text(16,y0+8,'Party'"),j=src.indexOf("if(s.kind===",i+30),blk=src.slice(i,j);
    ok(i>0&&j>i&&/partyReorder\(/.test(blk)&&/partyToCamp\(/.test(blk)&&/partyBringIn\(/.test(blk),'the Party sheet calls partyReorder, partyToCamp and partyBringIn');
    ok(!/G\.active\.(splice|push|pop|shift|unshift)\(|G\.active\.length\s*=|G\.active\[[^\]]+\]\s*=[^=]|\]\s*=\s*\[G\.active/.test(blk),'the Party sheet itself writes nothing to the party');
    const bot=fs.readFileSync(path.join(__dirname,'..','sim','bot.js'),'utf8');const k=bot.indexOf("if(PARTY&&G.mode==='walk')"),line=bot.slice(k,bot.indexOf('\n',k));
    ok(k>0&&/S\.partySetOrder\(/.test(line)&&!/G\.active\.(splice|push|pop|shift|unshift)\(|G\.active\.length\s*=|G\.active\[[^\]]+\]\s*=[^=]/.test(line),'the simulator fields a requested party through the production function only');
    ok(/if\(CLERIC_BACK&&!PARTY&&G\.mode==='walk'\)/.test(bot),'the default cleric reorder never runs together with --party');}

  // ---- the bot: canonical request, explicit default, oversize rejected, requested heroes reserved
  {const bot=path.join(__dirname,'..','sim','bot.js');const runBot=(extra,hours)=>{const tmp=path.join(os.tmpdir(),'cr_party_'+process.pid+'_'+Math.random().toString(36).slice(2)+'.json');const r=cp.spawnSync(process.execPath,[bot,'--hours',String(hours),'--seed','81','--profile','casual','--speed','2','--quiet','--json',tmp].concat(extra),{encoding:'utf8',maxBuffer:1<<26});let res=null;try{res=JSON.parse(fs.readFileSync(tmp,'utf8'));fs.unlinkSync(tmp);}catch(e){}return{r,res};};
    const big=runBot(['--party','aldric,sera,vex,morrow,wren'],0.1);ok(big.r.status===2&&/too many/.test(big.r.stderr)&&!big.res,'five requested heroes are rejected before the run ('+big.r.stderr.trim()+')');
    const empty=runBot(['--party',' , '],0.1);ok(empty.r.status===2&&!empty.res,'an empty list is rejected');
    const can=runBot(['--party',' Osric , ALDRIC '],0.1);ok(can.r.status===0&&can.res&&JSON.stringify(can.res.config.party)==='["osric","aldric"]'&&JSON.stringify(can.res.model.party)==='["osric","aldric"]'&&JSON.stringify(can.res.partyRequested)==='["osric","aldric"]','the request is recorded as a canonical ordered id list in the config, the model and the result');
    ok(can.res&&JSON.stringify(can.res.partyAvailable)==='["aldric"]'&&can.res.partyActual[0]==='aldric','only the recruited requested hero is fielded ('+(can.res&&can.res.partyActual.join(','))+')');
    const dft=runBot([],1.5);ok(dft.res&&dft.res.config.party==='default'&&dft.res.model.party==='default'&&dft.res.partyRequested==='default','without the flag the party is the explicit value default');ok(dft.res&&Array.isArray(dft.res.partyActual)&&dft.res.partyActual.length>0&&dft.res.partyAvailable.length===0&&dft.res.partyChanges.length===0&&dft.res.partyDelveSkips===0,'a default run records its final party and no lineup changes');
    ok(dft.res&&dft.res.catacombs.runs>0,'the default bot enters the Catacombs in this window ('+(dft.res&&dft.res.catacombs.runs)+' runs)');
    const rsv=runBot(['--party','aldric,sera,vex,morrow'],1.5);ok(rsv.res&&rsv.res.catacombs.runs===0&&rsv.res.partyDelveSkips>0,'with every recruited hero requested the bot skips the Catacombs: 0 runs, '+(rsv.res&&rsv.res.partyDelveSkips)+' skips');
    ok(rsv.res&&(rsv.res.postChecks||[]).every(p=>!['aldric','sera','vex','morrow'].includes(p.id)),'no requested hero was posted to the garrison');ok(rsv.res&&!rsv.res.assertFail,'no assertion failures under reservation');}

  // ---- adversarial validation: the requested and actual lineup are part of the identity of a batch
  {const sim=path.join(__dirname,'..','sim'),tag='tparty'+process.pid,dir=path.join(sim,'batch_out_'+tag),node=process.execPath;const made=[];
    try{const b=cp.spawnSync(node,[path.join(sim,'batch.js'),'--seedStart','81','--seeds','2','--hours','0.3','--profiles','casual','--speed','2','--workers','2','--tag',tag,'--party','Aldric, sera'],{encoding:'utf8',maxBuffer:1<<26});made.push(dir,path.join(sim,'snapshots_'+tag),path.join(sim,'manifests',tag+'.json'));
      ok(b.status===0&&fs.existsSync(path.join(dir,'casual_81.json'))&&fs.existsSync(path.join(dir,'manifest.json')),'a two-run batch with --party is written');
      const man=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));ok(JSON.stringify(man.config.model.party)==='["aldric","sera"]'&&Object.keys(man.partySets).length===1&&Object.keys(man.partySets)[0]==='["aldric","sera"]'&&Object.keys(man.partyActualSets).length>=1,'the manifest binds the canonical request and lists the final lineups');
      const bounded=d=>cp.spawnSync(node,[path.join(sim,'bounded.js'),'--dir',path.basename(d),'--profiles','casual','--seedStart','81','--seeds','2'],{encoding:'utf8',maxBuffer:1<<26}).stdout||'';
      const c0=JSON.parse(fs.readFileSync(path.join(dir,'casual_81.json'),'utf8')).config;
      const gate=(d,party)=>cp.spawnSync(node,[path.join(sim,'validate38.js'),'--dir',path.basename(d),'--dt','0.016666667','--speed','2','--hours','0.3','--profiles','casual','--seedStart','81','--seeds','2','--commit',c0.commit,'--gameHash',c0.gameHash,'--harnessHash',c0.harnessHash].concat(party?['--party',party]:[]),{encoding:'utf8',maxBuffer:1<<26}).stdout||'';
      const o=bounded(dir);ok(/PASS one requested party across the batch/.test(o)&&/PASS requested, available and actual lineups recorded and consistent/.test(o)&&/PASS the manifest carries the same requested party/.test(o),'untouched batch: the evaluator accepts the lineup binding');
      const g0=gate(dir,'aldric,sera');ok(!/REJECT[^\n]*party/i.test(g0)&&/valid|rejected/.test(g0),'untouched batch: the strict validator raises nothing about the party');
      ok(/REJECT[^\n]*config\.party \["aldric","sera"\] != expected \["sera","aldric"\]/.test(gate(dir,'sera,aldric'))&&/REJECT MANIFEST: manifest party/.test(gate(dir,'sera,aldric')),'the same heroes in another order are rejected: the comparison is exact');
      ok(/REJECT[^\n]*config\.party \["aldric","sera"\] != expected "default"/.test(gate(dir,null)),'a lineup batch is rejected where the default is expected');
      const tamper=(name,fn)=>{const d=dir+'_'+name;fs.cpSync(dir,d,{recursive:true});made.push(d);fn(d);return d;};const edit=(d,f,fn)=>{const q=path.join(d,f),j=JSON.parse(fs.readFileSync(q,'utf8'));fn(j);fs.writeFileSync(q,JSON.stringify(j,null,1));};
      let d=tamper('order',x=>edit(x,'casual_81.json',j=>{j.config.party=['sera','aldric'];j.model.party=['sera','aldric'];j.partyRequested=['sera','aldric'];j.partyAvailable=['sera','aldric'];j.partyActual=['sera','aldric'].concat(j.partyActual.filter(id=>id!=='sera'&&id!=='aldric'));j.partyChanges=[];}));let t=bounded(d);ok(/FAIL one requested party across the batch/.test(t)&&/FAIL one behavioural configuration/.test(t),'two lineups in one batch: the evaluator refuses it');ok(/REJECT casual_81\.json[^\n]*config\.party/.test(gate(d,'aldric,sera')),'and the strict validator rejects the odd run');
      d=tamper('absent',x=>edit(x,'casual_82.json',j=>{delete j.config.party;}));t=bounded(d);ok(/FAIL one requested party across the batch/.test(t),'a run without a recorded party next to explicit ones: refused');ok(/REJECT casual_82\.json[^\n]*config\.party missing/.test(gate(d,'aldric,sera')),'the strict validator names the missing field');
      d=tamper('actual',x=>edit(x,'casual_81.json',j=>{j.partyActual=['sera','aldric'].concat(j.partyActual.filter(id=>id!=='sera'&&id!=='aldric'));}));t=bounded(d);ok(/PASS one requested party/.test(t)&&/FAIL requested, available and actual lineups/.test(t),'a final lineup out of the requested order: refused');ok(/REJECT casual_81\.json[^\n]*party lineup does not follow the request/.test(gate(d,'aldric,sera')),'the strict validator rejects it too');
      d=tamper('history',x=>edit(x,'casual_81.json',j=>{j.partyChanges=[{h:0.1,available:['aldric','sera'],party:['vex','aldric','sera']}];}));ok(/FAIL requested, available and actual lineups/.test(bounded(d)),'a lineup change in the history that breaks the request: refused');
      d=tamper('model',x=>edit(x,'casual_82.json',j=>{j.model.party='default';}));ok(/FAIL requested, available and actual lineups/.test(bounded(d))&&/REJECT casual_82\.json[^\n]*party in the result or the model differs/.test(gate(d,'aldric,sera')),'a model that disagrees with the config: refused by both');
      d=tamper('manifest',x=>edit(x,'manifest.json',j=>{j.config.model.party='default';}));ok(/FAIL the manifest carries the same requested party/.test(bounded(d))&&/REJECT MANIFEST: manifest party "default" != expected \["aldric","sera"\]/.test(gate(d,'aldric,sera')),'a manifest with another party: refused by both');
      d=tamper('five',x=>{for(const f of ['casual_81.json','casual_82.json'])edit(x,f,j=>{const q=['aldric','sera','vex','morrow','wren'];j.config.party=q;j.model.party=q;j.partyRequested=q;});edit(x,'manifest.json',j=>{j.config.model.party=['aldric','sera','vex','morrow','wren'];});});ok(/FAIL requested, available and actual lineups/.test(bounded(d)),'a recorded request above the party size: refused');
    }finally{for(const m of made){try{fs.rmSync(m,{recursive:true,force:true});}catch(e){}}}}

  console.log(out.join('\n'));console.log((fail?'FAIL':'PASS')+'  '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
