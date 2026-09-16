// Balance contract tests for the pass 45 candidates (human-approved 2026-09-15), against PRODUCTION functions:
// Shatter depth rule (geometric), attention bonus, Auto-Cast versus manual cast power, item level cap by rank, flat ascension cost, tree caps of 50.
// Run: node tests/contract/balance.test.js   (exit code 1 on any failure)
'use strict';
const H=require('../sim/headless.js');
let pass=0,fail=0;const out=[];
function ok(c,m){if(c)pass++;else{fail++;out.push('FAIL '+m);}}
function near(a,b,eps,m){ok(Math.abs(a-b)<=eps,m+' (got '+a+', want '+b+')');}
async function game(seed=1){const S=H.load({seed,startMs:1700000000000});await S.ready;const G=S.G;G.title=false;G.tut=null;G.mult='max';return S;}
function fourHeroes(S,lv=30){const G=S.G;for(const def of S.HEROES.slice(0,4)){if(!G.roster.find(h=>h.id===def.id))S.addHero(def,lv);}G.active=G.roster.slice(0,4);G.campfireDone=true;for(const h of G.roster){h.lvl=lv;S.refreshStats(h);h.hp=h.maxhp;h.charge=0;}}
function toBattle(S){const G=S.G;fourHeroes(S,30);G.zone=0;G.mode='walk';let n=0;while(G.mode!=='battle'&&n<30000){S.setRT(S.getRT()+1/60);S.clock.frame();G.tut=null;S.update(1/60,true);n++;}if(G.mode!=='battle')throw new Error('no battle');}
(async()=>{
  // ---- Shatter depth rule: Shatters 1-3 need only the Warlord; the n-th Shatter from the fourth needs Endless wave 100 x 2^(n - 4) this run (100, 200, 400 ... 6400)
  {const S=await game(),G=S.G;G.cleared[3]=false;G.run={endless:1e9};ok(!S.canReforge(),'no Shatter before the Warlord even at any depth');G.cleared[3]=true;
    for(let done=0;done<=9;done++){G.reforges=done;const n=done+1,need=n<=3?0:100*Math.pow(2,n-4);ok(S.reforgeNeedWave()===need,'Shatter '+n+' needs wave '+need);G.run={endless:Math.max(0,need-1)};ok(S.canReforge()===(need===0),'Shatter '+n+' refused one wave short ('+(need-1)+')');G.run={endless:need};ok(S.canReforge(),'Shatter '+n+' allowed at wave '+need);}
    G.reforges=3;G.run={};ok(!S.canReforge(),'fourth Shatter refused with no Endless depth recorded');G.reforges=9;ok(S.reforgeNeedWave()===6400,'the tenth Shatter needs wave 6400');}
  // ---- attention: a deliberate tap earns +25% gold and XP for ten real seconds, applied exactly once through goldMult and xpMult
  {const S=await game(),G=S.G;S.setRT(100);ok(S.attnMult()===1,'attention off on a fresh game');const g0=S.goldMult(),x0=S.xpMult();S.noteAttention();near(S.attnMult(),1.25,1e-12,'attention on = 1.25');near(S.goldMult()/g0,1.25,1e-12,'goldMult x1.25 while attentive');near(S.xpMult()/x0,1.25,1e-12,'xpMult x1.25 while attentive');
    S.setRT(109.999);ok(S.attnOn(),'still attentive just before ten seconds');S.setRT(110);ok(!S.attnOn()&&S.goldMult()===g0&&S.xpMult()===x0,'attention ends at ten seconds and the multipliers return exactly');
    toBattle(S);S.setRT(200);const e=G.enemies.find(x=>!x.dead);S.tapEnemy(e);ok(S.attnOn()&&G.attnUntil===210,'an enemy tap starts attention for ten seconds');
    S.setRT(300);const h=G.active.find(x=>!x.dead);h.charge=100;h.tapCast=false;ok(S.tapCastHero(h)===true&&h.tapCast===true&&h.charge===0&&S.attnOn(),'a manual cast through tapCastHero arms the cast and starts attention');ok(S.tapCastHero(h)===false,'a second tap while the cast is armed does nothing');}
  // ---- cast power: Auto-Cast at 75%, a tapped cast at 130% (unchanged), for damage abilities through abilityAction
  {const S=await game(),G=S.G;ok(S.AUTO_CAST_POWER===0.75&&S.MANUAL_CAST_POWER===1.3,'constants 0.75 and 1.3');toBattle(S);const h=G.active.find(x=>x.cls==='mage'||x.cls==='rogue')||G.active[0];
    h.charge=100;h.tapCast=true;const a=S.abilityAction(h,true);h.charge=100;h.tapCast=false;const b=S.abilityAction(h,false);near(a.pow/b.pow,1.3/0.75,1e-9,'tapped cast power is 1.3/0.75 of an Auto-Cast');near(b.pow,S.abilityPower(h)*0.75,1e-9,'Auto-Cast power is abilityPower x 0.75');}
  // ---- gear (reverted 2026-09-15 at the human's request): item levels are unlimited; ascension costs 40 / 160 / 500 / 1000 ore at level 0 and climbs 1.14x per item level
  {const S=await game(),G=S.G;for(let r=0;r<=5;r++)ok(S.itemLvlCap({rank:r})===Infinity,'no level cap at rank '+r);
    const it=S.makeItem(0);it.rank=0;it.lvl=48;G.ore=1e15;G.mult=25;S.upgradeItem(it);ok(it.lvl===73,'twenty-five upgrades from 48 reach 73 (got '+it.lvl+')');G.mult=1;S.upgradeItem(it);ok(it.lvl===74,'nothing stops the climb');
    ok(JSON.stringify(S.ASCEND_BASE)===JSON.stringify([40,160,500,1000]),'ascension base 40 / 160 / 500 / 1000');for(let r=0;r<4;r++){ok(S.ascendCost({rank:r,lvl:0})===S.ASCEND_BASE[r],'ascension from rank '+r+' at level 0 costs '+S.ASCEND_BASE[r]);ok(S.ascendCost({rank:r,lvl:20})===Math.round(S.ASCEND_BASE[r]*Math.pow(1.14,20)),'and 1.14^20 times that at level 20');}
    const it2=S.makeItem(0);it2.rank=0;it2.lvl=0;G.reforges=0;G.ore=40;S.ascendItem(it2);ok(it2.rank===1&&G.ore===0,'ascending rank 0 to 1 at level 0 costs exactly 40 ore and needs no Shatter');G.ore=160;S.ascendItem(it2);ok(it2.rank===1&&G.ore===160,'rank 2 refused without a Shatter');G.reforges=1;S.ascendItem(it2);ok(it2.rank===2&&G.ore===0,'rank 2 after one Shatter costs exactly 160 at level 0');}
  // ---- tree caps: the eight formerly unlimited nodes cap at 50
  {const S=await game();for(const id of ['hp','atk','def','front','march','tap','ore','quest']){const n=S.TREE.find(x=>x.id===id);ok(n&&n.max===50,id+' caps at 50 (got '+(n&&n.max)+')');}ok(S.TREE.every(n=>n.max<=99),'no node is unlimited any more');}
  // ---- Prospecting climbs harder than the rest of the tree: 1.85 per level (human request 2026-09-15); every other gold node keeps 1.75
  {const S=await game();const p=S.TREE.find(x=>x.id==='ore');near(S.nodeCost(p,1)/S.nodeCost(p,0),1.85,2e-3,'Prospecting cost grows 1.85x per level');ok(S.nodeCost(p,0)===Math.round(150*1.5),'Prospecting level 1 still costs 225 gold');const m=S.TREE.find(x=>x.id==='march');near(S.nodeCost(m,10)/S.nodeCost(m,9),1.75,2e-3,'other gold nodes keep the 1.75 growth');near(S.nodeCost(p,20)/Math.round(150*1.5*Math.pow(1.75,20)),Math.pow(1.85/1.75,20),0.01,'by level 20 Prospecting costs about 3x the old curve');}
  if(out.length)console.log(out.join('\n'));console.log((fail?'FAIL  ':'PASS  ')+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
