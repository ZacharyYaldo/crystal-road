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
    const r=cp.spawnSync(process.execPath,[bot,'--hours','3','--seed','81','--profile','casual','--speed','2','--quiet','--json',tmp,'--party','lark,fitz,kit,hale'],{encoding:'utf8',maxBuffer:1<<26});
    ok(r.status===0,'bot runs with --party (exit '+r.status+')');let res=null;try{res=JSON.parse(fs.readFileSync(tmp,'utf8'));}catch(e){}ok(!!res,'result written');
    if(res){ok(JSON.stringify(res.config.party)==='["lark","fitz","kit","hale"]'&&JSON.stringify(res.partyRequested)===JSON.stringify(res.config.party),'the requested party is in the config and the result');
      ok(Array.isArray(res.partyActual)&&res.partyActual.length>0&&res.partyActual.length<=4,'the actual ordered party is recorded ('+res.partyActual.join(',')+')');
      const rec=res.recruits||{};const recruitedIds=res.roster.map(h=>h.name.toLowerCase());ok(res.partyActual.every(id=>recruitedIds.includes(id)),'every fielded hero was recruited by production first');
      const early=(res.partyChanges||[]).filter(c=>c.party.some(id=>id==='fitz'&&!(rec.Fitz!=null&&rec.Fitz<=c.h)));ok(early.length===0,'Fitz never fielded before his recruitment hour');
      ok(!res.assertFail,'no assertion failures ('+(res.assertFail||'none')+')');
      if(rec.Fitz!=null){const c=(res.partyChanges||[]).find(c=>c.party.includes('fitz'));ok(!!c&&c.h>=rec.Fitz&&c.h-rec.Fitz<0.25&&res.partyActual.includes('fitz'),'Fitz is fielded within a quarter hour of his recruitment (recruited '+rec.Fitz+' h, fielded '+(c&&c.h)+' h) and stays in the party');ok(res.partyActual[0]==='fitz'||res.partyActual[0]==='lark'||res.partyActual[0]==='kit','a requested hero holds the front once fielded ('+res.partyActual.join(' > ')+')');}else ok(true,'Fitz not recruited within the run; lineup rule not exercised');
      const first=res.partyActual[0];ok(first==='lark'||first==='fitz'||first==='kit'||first==='hale','the front hero follows the requested order (front '+first+')');}
    const dup=cp.spawnSync(process.execPath,[bot,'--hours','0.1','--seed','81','--profile','casual','--speed','2','--quiet','--party','hale,hale'],{encoding:'utf8'});ok(dup.status===2&&/duplicate/.test(dup.stderr),'a duplicate id is rejected before the run');
    const unk=cp.spawnSync(process.execPath,[bot,'--hours','0.1','--seed','81','--profile','casual','--speed','2','--quiet','--party','hale,nobody'],{encoding:'utf8'});ok(unk.status===2&&/unknown nobody/.test(unk.stderr),'an unknown id is rejected before the run');
    try{fs.unlinkSync(tmp);}catch(e){}}

  // ---- the production party functions carry every side effect of the Party sheet
  {const S=await game(40),G=S.G;field(S,['knight','cleric','rogue','mage'],20);const ids=()=>G.active.map(h=>h.id).join();const osr=S.addHero(S.HEROES.find(d=>d.id==='fitz'),14);
    ok(!G.active.includes(osr)&&S.heroStatus(osr)==='camp','a recruit joins the camp when the party is full');
    G.mode='walk';G.danger='x';ok(S.partyReorder(0,2)&&ids()==='vex,sera,hale,morrow','reorder: two marchers trade places ('+ids()+')');ok(G.danger===null,'reorder marks the build changed, as the sheet does');ok(!S.partyReorder(1,1)&&!S.partyReorder(0,9)&&ids()==='vex,sera,hale,morrow','reorder refuses the same slot and an empty slot');
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
  {const S=await game(41),G=S.G;field(S,['knight','cleric','rogue','mage'],20);G.mode='walk';const REQ=['lark','fitz','kit','hale'];const def=id=>S.HEROES.find(d=>d.id===id);
    const mark=G.active[1];mark.status={ward:2};G.danger='x';let r=S.partySetOrder(REQ);ok(r.join()==='hale,sera,vex,morrow'&&mark.status.ward===2&&G.danger==='x','nobody new is available: the order already holds and nothing is touched ('+r.join()+')');
    ok(!G.roster.find(h=>h.id==='fitz')&&!G.roster.find(h=>h.id==='lark'),'the order function recruited nobody');
    S.addHero(def('fitz'),14);r=S.partySetOrder(REQ);ok(r.join()==='fitz,hale,sera,vex'&&S.heroStatus(G.roster.find(h=>h.id==='morrow'))==='camp','Fitz recruited: front place, requested order kept, the last marcher goes to camp ('+r.join()+')');
    S.addHero(def('kit'),27);r=S.partySetOrder(REQ);ok(r.join()==='fitz,kit,hale,sera','Kit recruited: '+r.join());
    S.addHero(def('lark'),42);r=S.partySetOrder(REQ);ok(r.join()==='lark,fitz,kit,hale','Lark recruited: the full request in its order ('+r.join()+')');
    G.danger='x';const st=G.active.map(h=>h.status);r=S.partySetOrder(REQ);ok(r.join()==='lark,fitz,kit,hale'&&G.danger==='x'&&G.active.every((h,i)=>h.status===st[i]),'a second call changes nothing');
    r=S.partySetOrder(['hale','hale','nobody','sera']);ok(r.join()==='hale,sera,lark,fitz'&&G.active.length===4,'repeated and unknown ids are ignored; the other places keep their marchers in order ('+r.join()+')');
    r=S.partySetOrder(['sera','vex','morrow','hale','lark','fitz']);ok(r.join()==='sera,vex,morrow,hale'&&G.active.length===S.partyMax(),'a longer request fills the party up to partyMax and no further ('+r.join()+')');
    G.oath='solitude';ok(S.partyMax()===1,'the Oath of Solitude makes the party one');r=S.partySetOrder(REQ);ok(r.join()==='lark'&&G.active.length===1,'the current partyMax is enforced: one marcher, the first requested hero ('+r.join()+')');G.oath=null;}

  // ---- one path: the sheet and the simulator write to the party only through the shared functions
  {const src=fs.readFileSync(path.join(__dirname,'..','..','source','game.js'),'utf8');const i=src.indexOf("if(s.kind==='swap'){text(16,y0+8,'Party'"),j=src.indexOf("if(s.kind===",i+30),blk=src.slice(i,j);
    ok(i>0&&j>i&&/partyReorder\(/.test(blk)&&/partyToCamp\(/.test(blk)&&/partyBringIn\(/.test(blk),'the Party sheet calls partyReorder, partyToCamp and partyBringIn');
    ok(!/G\.active\.(splice|push|pop|shift|unshift)\(|G\.active\.length\s*=|G\.active\[[^\]]+\]\s*=[^=]|\]\s*=\s*\[G\.active/.test(blk),'the Party sheet itself writes nothing to the party');
    const bot=fs.readFileSync(path.join(__dirname,'..','sim','bot.js'),'utf8');const WRITES=/G\.active\.(splice|push|pop|shift|unshift|sort|reverse|fill|copyWithin)\(|G\.active\.length\s*=|G\.active\[[^\]]+\]\s*=[^=]|G\.active\s*=[^=]/;
    ok(!WRITES.test(bot),'the simulator never writes to the party itself, anywhere in bot.js');
    const ap=bot.slice(bot.indexOf('function applyParty('),bot.indexOf('function act('));ok(/S\.partySetOrder\(/.test(ap)&&/S\.partyCanField\(/.test(ap)&&/M\.partyFail=/.test(ap),'a requested party is fielded through the production function and checked against the game\'s own fieldable heroes');
    ok(/if\(M\.partyFail\)push\(M\.partyFail\)/.test(bot)&&/if\(PARTY\)applyParty\(true\);/.test(bot),'a broken lineup fails the run, and the lineup is applied once more at the end');
    const cb=bot.slice(bot.indexOf("if(CLERIC_BACK&&!PARTY&&G.mode==='walk')"));ok(/^if\(CLERIC_BACK&&!PARTY&&G\.mode==='walk'\)\{[^\n]*S\.partySetOrder\(/.test(cb),'the cleric-to-the-back rule reorders through the production function');}

  // ---- the bot: canonical request, explicit default, oversize rejected, requested heroes reserved
  {const bot=path.join(__dirname,'..','sim','bot.js');const runBot=(extra,hours)=>{const tmp=path.join(os.tmpdir(),'cr_party_'+process.pid+'_'+Math.random().toString(36).slice(2)+'.json');const r=cp.spawnSync(process.execPath,[bot,'--hours',String(hours),'--seed','81','--profile','casual','--speed','2','--quiet','--json',tmp].concat(extra),{encoding:'utf8',maxBuffer:1<<26});let res=null;try{res=JSON.parse(fs.readFileSync(tmp,'utf8'));fs.unlinkSync(tmp);}catch(e){}return{r,res};};
    const big=runBot(['--party','hale,sera,vex,morrow,ash'],0.1);ok(big.r.status===2&&/too many/.test(big.r.stderr)&&!big.res,'five requested heroes are rejected before the run ('+big.r.stderr.trim()+')');
    const empty=runBot(['--party',' , '],0.1);ok(empty.r.status===2&&!empty.res,'an empty list is rejected');
    const can=runBot(['--party',' Fitz , HALE '],0.1);ok(can.r.status===0&&can.res&&JSON.stringify(can.res.config.party)==='["fitz","hale"]'&&JSON.stringify(can.res.model.party)==='["fitz","hale"]'&&JSON.stringify(can.res.partyRequested)==='["fitz","hale"]','the request is recorded as a canonical ordered id list in the config, the model and the result');
    ok(can.res&&JSON.stringify(can.res.partyAvailable)==='["hale"]'&&can.res.partyActual[0]==='hale','only the recruited requested hero is fielded ('+(can.res&&can.res.partyActual.join(','))+')');
    const dft=runBot([],1.5);ok(dft.res&&dft.res.config.party==='default'&&dft.res.model.party==='default'&&dft.res.partyRequested==='default','without the flag the party is the explicit value default');ok(dft.res&&Array.isArray(dft.res.partyActual)&&dft.res.partyActual.length>0&&dft.res.partyAvailable.length===0&&dft.res.partyChanges.length===0&&dft.res.partyDelveSkips===0,'a default run records its final party and no lineup changes');
    ok(dft.res&&dft.res.catacombs.runs>0,'the default bot enters the Catacombs in this window ('+(dft.res&&dft.res.catacombs.runs)+' runs)');
    const rsv=runBot(['--party','hale,sera,vex,morrow'],1.5);ok(rsv.res&&rsv.res.catacombs.runs===0&&rsv.res.partyDelveSkips>0,'with every recruited hero requested the bot skips the Catacombs: 0 runs, '+(rsv.res&&rsv.res.partyDelveSkips)+' skips');
    ok(rsv.res&&(rsv.res.postChecks||[]).every(p=>!['hale','sera','vex','morrow'].includes(p.id)),'no requested hero was posted to the garrison');ok(rsv.res&&!rsv.res.assertFail,'no assertion failures under reservation');}

  // ---- adversarial validation: the requested and actual lineup are part of the identity of a batch
  {const sim=path.join(__dirname,'..','sim'),tag='tparty'+process.pid,dir=path.join(sim,'batch_out_'+tag),node=process.execPath;const made=[];
    try{const b=cp.spawnSync(node,[path.join(sim,'batch.js'),'--seedStart','81','--seeds','2','--hours','0.3','--profiles','casual','--speed','2','--workers','2','--tag',tag,'--party','Hale, sera'],{encoding:'utf8',maxBuffer:1<<26});made.push(dir,path.join(sim,'snapshots_'+tag),path.join(sim,'manifests',tag+'.json'));
      ok(b.status===0&&fs.existsSync(path.join(dir,'casual_81.json'))&&fs.existsSync(path.join(dir,'manifest.json')),'a two-run batch with --party is written');
      const man=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));ok(JSON.stringify(man.config.model.party)==='["hale","sera"]'&&Object.keys(man.partySets).length===1&&Object.keys(man.partySets)[0]==='["hale","sera"]'&&Object.keys(man.partyActualSets).length>=1,'the manifest binds the canonical request and lists the final lineups');
      const bounded=d=>cp.spawnSync(node,[path.join(sim,'bounded.js'),'--dir',path.basename(d),'--profiles','casual','--seedStart','81','--seeds','2'],{encoding:'utf8',maxBuffer:1<<26}).stdout||'';
      const c0=JSON.parse(fs.readFileSync(path.join(dir,'casual_81.json'),'utf8')).config;
      const gate=(d,party)=>cp.spawnSync(node,[path.join(sim,'validate38.js'),'--dir',path.basename(d),'--dt','0.016666667','--speed','2','--hours','0.3','--profiles','casual','--seedStart','81','--seeds','2','--commit',c0.commit,'--gameHash',c0.gameHash,'--harnessHash',c0.harnessHash].concat(party?['--party',party]:[]),{encoding:'utf8',maxBuffer:1<<26}).stdout||'';
      const o=bounded(dir);ok(/PASS one requested party across the batch/.test(o)&&/PASS lineups recorded and consistent with the request/.test(o)&&/PASS the manifest carries the same requested party/.test(o),'untouched batch: the evaluator accepts the lineup binding');
      const g0=gate(dir,'hale,sera');ok(!/REJECT[^\n]*party/i.test(g0)&&/valid|rejected/.test(g0),'untouched batch: the strict validator raises nothing about the party');
      ok(/REJECT[^\n]*config\.party \["hale","sera"\] != expected \["sera","hale"\]/.test(gate(dir,'sera,hale'))&&/REJECT MANIFEST: manifest party/.test(gate(dir,'sera,hale')),'the same heroes in another order are rejected: the comparison is exact');
      ok(/REJECT[^\n]*config\.party \["hale","sera"\] != expected "default"/.test(gate(dir,null)),'a lineup batch is rejected where the default is expected');
      const tamper=(name,fn)=>{const d=dir+'_'+name;fs.cpSync(dir,d,{recursive:true});made.push(d);fn(d);return d;};const edit=(d,f,fn)=>{const q=path.join(d,f),j=JSON.parse(fs.readFileSync(q,'utf8'));fn(j);fs.writeFileSync(q,JSON.stringify(j,null,1));};
      let d=tamper('order',x=>edit(x,'casual_81.json',j=>{j.config.party=['sera','hale'];j.model.party=['sera','hale'];j.partyRequested=['sera','hale'];j.partyAvailable=['sera','hale'];j.partyActual=['sera','hale'].concat(j.partyActual.filter(id=>id!=='sera'&&id!=='hale'));j.partyChanges=[];}));let t=bounded(d);ok(/FAIL one requested party across the batch/.test(t)&&/FAIL one behavioural configuration/.test(t),'two lineups in one batch: the evaluator refuses it');ok(/REJECT casual_81\.json[^\n]*config\.party/.test(gate(d,'hale,sera')),'and the strict validator rejects the odd run');
      d=tamper('absent',x=>edit(x,'casual_82.json',j=>{delete j.config.party;}));t=bounded(d);ok(/FAIL one requested party across the batch/.test(t),'a run without a recorded party next to explicit ones: refused');ok(/REJECT casual_82\.json[^\n]*config\.party missing/.test(gate(d,'hale,sera')),'the strict validator names the missing field');
      d=tamper('actual',x=>edit(x,'casual_81.json',j=>{j.partyActual=['sera','hale'].concat(j.partyActual.filter(id=>id!=='sera'&&id!=='hale'));}));t=bounded(d);ok(/PASS one requested party/.test(t)&&/FAIL lineups recorded and consistent with the request/.test(t),'a final lineup out of the requested order: refused');ok(/REJECT casual_81\.json[^\n]*party lineup does not follow the request/.test(gate(d,'hale,sera')),'the strict validator rejects it too');
      d=tamper('history',x=>edit(x,'casual_81.json',j=>{j.partyChanges=[{h:0.1,available:['hale','sera'],party:['vex','hale','sera']}];}));ok(/FAIL lineups recorded and consistent with the request/.test(bounded(d)),'a lineup change in the history that breaks the request: refused');
      d=tamper('model',x=>edit(x,'casual_82.json',j=>{j.model.party='default';}));ok(/FAIL lineups recorded and consistent with the request/.test(bounded(d))&&/REJECT casual_82\.json[^\n]*party in the result or the model differs/.test(gate(d,'hale,sera')),'a model that disagrees with the config: refused by both');
      d=tamper('manifest',x=>edit(x,'manifest.json',j=>{j.config.model.party='default';}));ok(/FAIL the manifest carries the same requested party/.test(bounded(d))&&/REJECT MANIFEST: manifest party "default" != expected \["hale","sera"\]/.test(gate(d,'hale,sera')),'a manifest with another party: refused by both');
      d=tamper('five',x=>{for(const f of ['casual_81.json','casual_82.json'])edit(x,f,j=>{const q=['hale','sera','vex','morrow','ash'];j.config.party=q;j.model.party=q;j.partyRequested=q;});edit(x,'manifest.json',j=>{j.config.model.party=['hale','sera','vex','morrow','ash'];});});ok(/FAIL lineups recorded and consistent with the request/.test(bounded(d)),'a recorded request above the party size: refused');
    }finally{for(const m of made){try{fs.rmSync(m,{recursive:true,force:true});}catch(e){}}}}

  // ---- a hero who still holds a post stays on the wall
  {const S=await game(42),G=S.G;field(S,['knight','cleric','rogue'],20);G.mode='walk';const m=S.addHero(S.HEROES.find(d=>d.id==='morrow'),20);S.partyToCamp(G.active.indexOf(m));
    G.castle.garrison.push(m.id);m.postedAt=S.clock.get();const left=S.postLeft(m),before=G.active.map(h=>h.id).join();ok(left>3500&&S.heroStatus(m)==='garrison','Morrow holds a post with '+Math.round(left)+' s left');
    ok(S.partyBringIn(m)===false&&!G.active.includes(m)&&G.castle.garrison.includes(m.id),'joining a free place is refused while the post lasts: he stays on the wall and out of the party');
    ok(S.partyBringIn(m,0)===false&&G.active.map(h=>h.id).join()===before&&G.castle.garrison.includes(m.id),'replacing a marcher is refused too; the party is unchanged');
    ok(!G.active.some(h=>G.castle.garrison.includes(h.id)),'nobody is marching and posted at once');
    m.postedAt=S.clock.get()-2*3600*1000;ok(S.postLeft(m)<=0&&S.partyCanField(m)&&S.partyBringIn(m)===true&&G.active.includes(m)&&!G.castle.garrison.includes(m.id),'once the post is over he is recalled and brought in');}

  // ---- provenance: every harness file is hashed and watched; the dirty flag is real
  {const HN=require('../sim/harness.js'),sim=path.join(__dirname,'..','sim'),root=path.join(__dirname,'..','..');
    ok(HN.HARNESS_FILES.join()==='bot.js,headless.js,party.js,harness.js'&&['tests/sim/party.js','tests/sim/harness.js','tests/sim/bot.js','tests/sim/headless.js','source/game.js','build/assets.json'].every(f=>HN.WATCHED.includes(f)),'the harness is bot.js, headless.js, party.js and harness.js; all of them and the game are watched');
    const crypto=require('crypto'),want=HN.HARNESS_FILES.map(f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(sim,f))).digest('hex').slice(0,16)).join(':');
    const tmp=path.join(os.tmpdir(),'cr_prov_'+process.pid+'.json');cp.spawnSync(process.execPath,[path.join(sim,'bot.js'),'--hours','0.05','--seed','81','--profile','casual','--speed','2','--quiet','--json',tmp],{encoding:'utf8'});const r=JSON.parse(fs.readFileSync(tmp,'utf8'));fs.unlinkSync(tmp);
    ok(r.config.harnessHash===want&&want.split(':').length===4,'harnessHash is one hash per harness file ('+r.config.harnessHash+')');
    const git=a=>cp.execSync('git '+a,{cwd:root,stdio:['ignore','pipe','ignore']}).toString();const st=()=>git('status --porcelain -- '+HN.WATCHED.join(' ')).split('\n').map(x=>x.replace(/\r$/,'')).filter(x=>x.trim());
    ok(JSON.stringify(r.config.dirty)===JSON.stringify(st()),'the dirty flag of the run equals git status of the watched files ('+r.config.dirty.length+' entries)');
    const f=path.join(sim,'party.js'),orig=fs.readFileSync(f);let seen=null,hash2=null;try{fs.writeFileSync(f,Buffer.concat([orig,Buffer.from('\n// probe\n')]));const o=cp.execSync(JSON.stringify(process.execPath)+' -e "const h=require(\'./tests/sim/harness.js\');console.log(JSON.stringify({d:h.dirtyFiles(),h:h.harnessHash()}))"',{cwd:root}).toString();const j=JSON.parse(o);seen=j.d;hash2=j.h;}finally{fs.writeFileSync(f,orig);}
    ok(Array.isArray(seen)&&seen.some(x=>/tests\/sim\/party\.js/.test(x)),'a changed party.js is reported as dirty');ok(hash2&&hash2!==want&&hash2.split(':')[2]!==want.split(':')[2],'and changes the harness hash');ok(Buffer.compare(fs.readFileSync(f),orig)===0,'party.js restored byte for byte');}

  // ---- forward equivalence: the gate copies every harness file of the reference, and takes the behavioural flags
  {const sim=path.join(__dirname,'..','sim');const r=cp.spawnSync(process.execPath,[path.join(sim,'equiv.js'),'--ref','HEAD','--mode','exact','--seeds','1','--profiles','casual','--speeds','2','--hours','0.2','--workers','2','--model','clericBack'],{encoding:'utf8',maxBuffer:1<<26});const o=(r.stdout||'')+(r.stderr||'');
    ok(!/Cannot find module/.test(o)&&/EQUIV (PASS|FAIL)/.test(o),'the gate runs against the current head without a missing module');ok(/flags --clericBack/.test(o),'the behavioural flags reach both sides');
    const has=f=>{try{cp.execSync('git cat-file -e HEAD:tests/sim/'+f,{cwd:path.join(__dirname,'..','..'),stdio:['ignore','ignore','ignore']});return true;}catch(e){return false;}};const m=/reference harness files ([^\n]*)/.exec(o);ok(!!m&&['bot.js','headless.js'].concat(['party.js','harness.js'].filter(has)).every(f=>m[1].includes(f)),'every harness file that exists at the reference is copied ('+(m&&m[1].trim())+')');
    const bad=cp.spawnSync(process.execPath,[path.join(sim,'equiv.js'),'--ref','HEAD','--model','nonsense'],{encoding:'utf8'});ok(bad.status===1&&/EQUIV FAIL: --model/.test(bad.stdout),'an unknown model flag is refused');}

  // ---- the cleric rule through the production path
  {const bot=path.join(__dirname,'..','sim','bot.js'),tmp=path.join(os.tmpdir(),'cr_cb_'+process.pid+'.json');const r=cp.spawnSync(process.execPath,[bot,'--hours','1','--seed','81','--profile','casual','--speed','2','--quiet','--json',tmp,'--clericBack'],{encoding:'utf8',maxBuffer:1<<26});const res=JSON.parse(fs.readFileSync(tmp,'utf8'));fs.unlinkSync(tmp);
    ok(r.status===0&&!res.assertFail&&res.config.clericBack===true&&res.config.party==='default','a default-party run with --clericBack completes without assertion failures');ok(res.partyActual.length>=3&&res.partyActual[res.partyActual.length-1]==='sera','the cleric marches last ('+res.partyActual.join(' > ')+')');ok(res.partyChanges.length===0&&res.partyAvailable.length===0,'and the run stays a default-party run');}

  // ---- the validators judge a lineup by the roster and the recruit hours, not by what the run says was available
  {const sim=path.join(__dirname,'..','sim'),tag='tpartyb'+process.pid,dir=path.join(sim,'batch_out_'+tag),node=process.execPath;const made=[];
    try{const b=cp.spawnSync(node,[path.join(sim,'batch.js'),'--seedStart','81','--seeds','2','--hours','0.3','--profiles','casual','--speed','2','--workers','2','--tag',tag,'--party','vex,hale'],{encoding:'utf8',maxBuffer:1<<26});made.push(dir,path.join(sim,'snapshots_'+tag),path.join(sim,'manifests',tag+'.json'));
      const r81=JSON.parse(fs.readFileSync(path.join(dir,'casual_81.json'),'utf8'));ok(b.status===0&&r81.recruits.Vex>0&&r81.partyActual[0]==='vex'&&r81.partyActual[1]==='hale','Vex is recruited during the run and takes the front ahead of Hale ('+r81.partyActual.join(' > ')+', recruited at '+r81.recruits.Vex+' h)');
      ok(r81.partyChanges.length>=1&&r81.partyChanges[0].h>=r81.recruits.Vex&&JSON.stringify(r81.partyAvailable)==='["vex","hale"]','the change is recorded at or after his recruit hour');
      const PL=require('../sim/party.js');ok(PL.lineupProblems(r81).length===0,'the untouched run has no lineup problem');
      const bounded=d=>cp.spawnSync(node,[path.join(sim,'bounded.js'),'--dir',path.basename(d),'--profiles','casual','--seedStart','81','--seeds','2'],{encoding:'utf8',maxBuffer:1<<26}).stdout||'';const c0=r81.config;
      const gate=d=>cp.spawnSync(node,[path.join(sim,'validate38.js'),'--dir',path.basename(d),'--dt','0.016666667','--speed','2','--hours','0.3','--profiles','casual','--seedStart','81','--seeds','2','--commit',c0.commit,'--gameHash',c0.gameHash,'--harnessHash',c0.harnessHash,'--party','vex,hale'],{encoding:'utf8',maxBuffer:1<<26}).stdout||'';
      ok(/PASS lineups recorded and consistent with the request/.test(bounded(dir))&&!/REJECT[^\n]*(party|lineup)/i.test(gate(dir)),'untouched batch: accepted by both');
      const tamper=(name,fn)=>{const d=dir+'_'+name;fs.cpSync(dir,d,{recursive:true});made.push(d);const q=path.join(d,'casual_81.json'),j=JSON.parse(fs.readFileSync(q,'utf8'));fn(j);fs.writeFileSync(q,JSON.stringify(j,null,1));return d;};
      let d=tamper('trust',j=>{j.partyAvailable=[];j.partyChanges=[];j.partyActual=j.partyActual.filter(id=>id!=='vex'&&id!=='hale').concat(['hale','vex']);});ok(/FAIL lineups recorded and consistent with the request/.test(bounded(d))&&/REJECT casual_81\.json[^\n]*party lineup does not follow the request/.test(gate(d)),'an empty partyAvailable no longer excuses a lineup that ignores the request');
      d=tamper('avail',j=>{j.partyAvailable=['hale'];});ok(/FAIL lineups recorded/.test(bounded(d))&&/REJECT casual_81\.json[^\n]*partyAvailable \["hale"\] is not the recruited part of the request/.test(gate(d)),'a self-reported availability that hides a recruited hero is refused');
      d=tamper('early',j=>{j.partyChanges=[{h:0.01,available:['vex','hale'],party:['vex','hale']}].concat(j.partyChanges);});ok(/FAIL lineups recorded/.test(bounded(d))&&/REJECT casual_81\.json[^\n]*lineup change at 0\.01 h/.test(gate(d)),'a change that fields a hero before his recruit hour is refused');
      d=tamper('ghost',j=>{j.partyActual=['vex','hale','bram'];});ok(/FAIL lineups recorded/.test(bounded(d))&&/REJECT casual_81\.json[^\n]*never recruited: bram/.test(gate(d)),'a final party with a hero who was never recruited is refused');
      d=tamper('late',j=>{j.partyChanges=j.partyChanges.concat([{h:0.25,available:['hale'],party:['hale','vex']}]);});ok(/FAIL lineups recorded/.test(bounded(d)),'a change that leaves out a hero recruited long before is refused');
      d=tamper('noroster',j=>{j.roster=[];});ok(/FAIL lineups recorded/.test(bounded(d))&&/REJECT casual_81\.json[^\n]*no roster recorded/.test(gate(d)),'without a roster the lineup cannot be judged and the run is refused');
    }finally{for(const m of made){try{fs.rmSync(m,{recursive:true,force:true});}catch(e){}}}}

  // ---- --focus (pass 54): ore and rank gold go to the fielded party only; without the flag the whole roster is levelled and the record is unchanged
  {const bot=path.join(__dirname,'..','sim','bot.js');const run=extra=>{const tmp=path.join(os.tmpdir(),'cr_focus_'+process.pid+'_'+Math.random().toString(36).slice(2)+'.json');const r=cp.spawnSync(process.execPath,[bot,'--hours','8','--seed','81','--profile','casual','--speed','2','--quiet','--json',tmp].concat(extra),{encoding:'utf8',maxBuffer:1<<26});let res=null;try{res=JSON.parse(fs.readFileSync(tmp,'utf8'));fs.unlinkSync(tmp);}catch(e){}return{status:r.status,res};};
    const invested=h=>h.abLvl>1||Object.values(h.gear||{}).some(it=>it&&it.lvl>0);
    const f=run(['--focus']),d=run([]);ok(f.status===0&&f.res&&d.status===0&&d.res,'both runs finish');
    if(f.res&&d.res){const fielded=new Set(f.res.partyActual),name2id=n=>String(n).toLowerCase();const benchF=f.res.roster.filter(h=>!fielded.has(name2id(h.name))),partyF=f.res.roster.filter(h=>fielded.has(name2id(h.name)));
      ok(benchF.length>=1&&partyF.length===4,'the focused run recruited a bench hero ('+benchF.map(h=>h.name).join(', ')+') beside its party of four');
      ok(benchF.every(h=>!invested(h)),'under --focus no bench hero has a bought ability rank or an upgraded item');ok(partyF.every(h=>h.abLvl>1),'and every party hero has bought ranks');
      const fieldedD=new Set(d.res.partyActual),benchD=d.res.roster.filter(h=>!fieldedD.has(name2id(h.name)));ok(benchD.some(invested),'without the flag the bench is levelled too (the historical policy): '+benchD.map(h=>h.name+' rank '+h.abLvl).join(', '));
      ok(f.res.config.focus===true&&f.res.model.focus===true,'the focused run records focus in its config and model');ok(!('focus' in d.res.config)&&!('focus' in d.res.model),'a run without the flag records nothing new, so default results keep their shape');
      const lv=r=>Math.max(...r.roster.map(h=>h.lvl));ok(f.res.assertFail==null&&d.res.assertFail==null,'no assertion failures in either run');out.push('  info: party level after 8 h: focused '+lv(f.res)+', whole roster '+lv(d.res));}}
  console.log(out.join('\n'));console.log((fail?'FAIL':'PASS')+'  '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
