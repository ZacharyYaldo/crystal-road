// ============================================================ saving & offline progress
const SAVE_KEY='crystal_road_save_v1';
function storeGet(){try{return localStorage.getItem(SAVE_KEY);}catch(e){return null;}}
function storeSet(v){try{localStorage.setItem(SAVE_KEY,v);return true;}catch(e){return false;}}
function storeClear(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}
function serialize(){return JSON.stringify({v:1,t:now(),zone:G.zone,prog:G.prog,cleared:G.cleared,gold:G.gold,ore:G.ore,dust:G.dust,wins:G.wins,campfireDone:G.campfireDone,tree:G.tree,autoCast:G.autoCast,music:G.music,autoUntil:G.autoUntil,itemSeq,
  roster:G.roster.map(h=>({id:h.id,lvl:h.lvl,xp:h.xp,hp:h.hp,abLvl:h.abLvl,eq:h.eq})),active:G.active.map(h=>h.id),pack:G.pack,
  quests:G.quests.map(q=>({hero:q.hero.id,q:q.q.id,end:q.end})),castle:G.castle,fast:G.fast});}
function saveGame(){if(G.title)return;storeSet(serialize());}
function loadGame(){const raw=storeGet();if(!raw)return false;let d;try{d=JSON.parse(raw);}catch(e){return false;}if(!d||d.v!==1)return false;
  Object.assign(G,{zone:d.zone,prog:d.prog,cleared:d.cleared,gold:d.gold,ore:d.ore,dust:d.dust,wins:d.wins,campfireDone:d.campfireDone,tree:d.tree||{},autoCast:!!d.autoCast,music:d.music!==false,autoUntil:d.autoUntil||0,fast:!!d.fast});
  itemSeq=d.itemSeq||itemSeq;G.pack=d.pack||[];
  G.roster=[];for(const r of d.roster){const def=HEROES.find(x=>x.id===r.id);if(!def)continue;const h=mkHero(def);h.lvl=r.lvl;h.xp=r.xp;h.abLvl=r.abLvl||1;h.eq=r.eq||{};refreshStats(h);h.hp=Math.min(h.maxhp,r.hp>0?r.hp:h.maxhp);G.roster.push(h);}
  G.active=(d.active||[]).map(id=>G.roster.find(h=>h.id===id)).filter(Boolean);if(!G.active.length&&G.roster.length)G.active=[G.roster[0]];
  G.active.forEach(h=>{h.x=null;});layout();
  G.quests=(d.quests||[]).map(q=>({hero:G.roster.find(h=>h.id===q.hero),q:QUESTS.find(x=>x.id===q.q),end:q.end})).filter(q=>q.hero&&q.q);
  if(d.castle){G.castle=d.castle;G.castle.walk=[];}
  G.enemies=[];G.projs=[];G.action=null;G.mode='walk';G.enc=3;
  offlineReport(d.t);return true;}
function offlineReport(lastT){const elapsed=Math.max(0,(now()-lastT)/1000);if(elapsed<120)return;
  const hours=Math.min(8,elapsed/3600),eff=G.autoUntil>lastT?0.65:0.5;const fights=Math.floor(hours*3600/22*eff);if(fights<1)return;
  const Z=ZONES[G.zone],L=R(Z.lv+Math.min(G.prog[G.zone],Z.fights)*0.6+(G.cleared[G.zone]?3:0));const per=1.8;
  const gold=R(fights*per*(3+2*L)),xp=R(fights*per*(8+4*L)),ore=R(fights*0.35*1.5);
  G.gold+=gold;G.ore+=ore;const ups=[];for(const h of G.active){h.xp+=xp;let n=0;while(h.xp>=xpNeed(h.lvl)){h.xp-=xpNeed(h.lvl);h.lvl++;n++;}if(n){refreshStats(h);h.hp=h.maxhp;ups.push(h.name+' +'+n);}}
  G.offline={hours,fights,gold,ore,ups,doubled:false};openSheet('welcome');}
function drawWelcome(s,y0){const o=G.offline;text(16,y0+8,'While you were away','h',C.goldL);text(16,y0+22,fmtT(o.hours*3600)+' on the road · '+o.fights+' battles in '+ZONES[G.zone].name,'xs',C.muted);
  icon('coin',20,y0+36,4);text(36,y0+37,'+'+o.gold.toLocaleString()+' gold','sb',C.goldL);icon('ore',20,y0+50,0);text(36,y0+51,'+'+o.ore+' ore','sb',C.cream);
  text(16,y0+66,o.ups.length?'Levels: '+o.ups.join(', '):'No level-ups this time','xs',C.muted);
  if(!o.doubled){button(16,y0+82,110,18,true);icon('play',22,y0+86,4);text(75,y0+87,'Double it (ad)','sb',C.goldL,'center');hit(16,y0+82,110,18,()=>{G.gold+=o.gold;G.ore+=o.ore;o.doubled=true;toast('Rewards doubled');});}
  button(140,y0+82,110,18,false);text(195,y0+87,o.doubled?'Onward':'Collect','sb',C.cream,'center');hit(140,y0+82,110,18,()=>{closeSheet();G.offline=null;});
  text(16,y0+106,'Offline earns at half pace, up to 8 hours. Raise the cap in Vael later.','xs',C.dimt);}
setInterval(()=>{if(!G.title)saveGame();},15000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveGame();});
addEventListener('pagehide',saveGame);
