// Challenge and income-rate contract tests against PRODUCTION functions: the standardized party test is deterministic, ignores attention,
// omens, oaths and road speed, applies the bracket's zone defense, counts practice taps only up to three per second, and pays each bracket
// tier once, cumulatively, atomically; incomeRate is the one permanent rate shared by offline earnings and rewards.
// Run: node tests/contract/challenge.test.js   (exit code 1 on any failure)
'use strict';
const H=require('../sim/headless.js');
let pass=0,fail=0;const out=[];
function ok(c,m){if(c)pass++;else{fail++;out.push('FAIL '+m);}}
function near(a,b,eps,m){ok(Math.abs(a-b)<=eps,m+' (got '+a+', want '+b+')');}
async function game(seed=1,zone=3){const S=H.load({seed,startMs:1700000000000});await S.ready;const G=S.G;G.title=false;G.tut=null;G.mult='max';G.screen='vael';for(const def of S.HEROES.slice(0,4)){if(!G.roster.find(h=>h.id===def.id))S.addHero(def,30);}G.active=G.roster.slice(0,4);G.campfireDone=true;for(const h of G.roster){h.lvl=30;S.refreshStats(h);h.hp=h.maxhp;h.charge=0;}for(let i=0;i<zone;i++){G.cleared[i]=true;G.prog[i]=S.ZONES[i].fights;}G.zone=zone;G.mode='walk';G.enc=1e9;G.enemies=[];return S;}
const DT=1/60;
function runChallenge(S){const G=S.G;if(!S.startChallenge())throw new Error('no party');while(G.drill.running){S.clock.frame();S.setRT(S.getRT()+DT);S.update(DT,true);S.drillTick(DT);}G.sheet=null;return G.drill;}
(async()=>{
  // ---- deterministic, standardized, isolated
  {const S=await game(),G=S.G;const a=runChallenge(S),b=runChallenge(S);ok(a.stats.total>0&&a.stats.total===b.stats.total&&a.stats.tap===b.stats.tap&&a.stats.crits===b.stats.crits,'two runs on the same state are identical ('+a.stats.total+')');
    ok(a.stats.taps===2*S.DRILL_SEC,'exactly two scripted taps per second ('+a.stats.taps+')');ok(a.stats.tap>0&&a.stats.hero>0&&a.stats.total===a.stats.hero+a.stats.tap,'party and tap damage stored separately and summed');
    ok(a.bracket.kind==='zone'&&a.bracket.zi===3,'bracket is the highest unlocked zone (Ironvein)');ok(a.g.enemies[0].def===S.challengeDef(a.bracket)&&a.g.enemies[0].def>0,'dummy carries the zone defense ('+a.g.enemies[0].def+')');
    G.omens=['swarm'];G.oath='silence';S.setRT(S.getRT()+1);S.noteAttention();G.speed=4;G.speedUntil=S.clock.get()+7200000;const c=runChallenge(S);ok(c.stats.total===a.stats.total,'omens, an oath, attention and road speed do not change the score');G.omens=[];G.oath=null;G.speed=1;G.speedUntil=0;
    ok(G.omens.length===0&&G.oath===null&&G.mode==='walk'&&!G.drillOn,'context restored');
    const s0={gold:G.gold,ore:G.ore,dust:G.dust};runChallenge(S);ok(G.gold===s0.gold&&G.ore===s0.ore&&G.dust===s0.dust,'no payout while claims are disabled');ok(S.challengeState().best['zone:3']===a.stats.total,'best score recorded');}
  // ---- Endless open: Shatter brackets, Foundry-pool defense with the Shatter scaling
  {const S=await game(1,9),G=S.G;G.reforges=4;const d=runChallenge(S);ok(d.bracket.kind==='shatter'&&d.bracket.key==='4','Shatter bracket once Endless is open');const def4=d.g.enemies[0].def;G.reforges=5;const d5=runChallenge(S);ok(d5.g.enemies[0].def>def4,'defense scales with the Shatter count ('+def4+' -> '+d5.g.enemies[0].def+')');}
  // ---- tiers and one-time cumulative claims
  {const S=await game(),G=S.G;const d=runChallenge(S);const T=d.stats.total;S.CHALLENGE.targets.zone[3]=T/0.8;S.CHALLENGE.claims=true; /* Crystal target set so this party lands Gold (80% of Crystal) */
    G.gold=0;G.ore=0;G.dust=0;const g=runChallenge(S);ok(g.tier===2,'tier Gold at 80% of the target (got '+S.CHALLENGE.tiers[g.tier]+')');const rate=S.incomeRate(3,S.ZONES[3].fights-1);const B=S.CHALLENGE.bundles.zone;
    near(G.gold,Math.round(B[2].gold*rate.gold),1,'Gold first clear pays the cumulative Gold bundle in gold minutes');near(G.ore,Math.round(B[2].ore*rate.ore),1,'and ore minutes');ok(G.dust===B[2].dust,'and dust');ok(g.paid&&g.paid.to===2&&g.paid.from===-1,'claim recorded from none to Gold');
    const g2=G.gold;runChallenge(S);ok(G.gold===g2&&!G.drill.paid,'repeating the same tier pays nothing');
    S.CHALLENGE.targets.zone[3]=T/1.3;const c=runChallenge(S);ok(c.tier===3&&c.overdrive,'Crystal and Overdrive once the target is lower');near(G.gold-g2,Math.round((B[3].gold-B[2].gold)*rate.gold),1,'Crystal pays only the difference from Gold');ok(G.dust===B[3].dust&&S.challengeState().badges['zone:3']===true,'dust tops up to the Crystal bundle; Overdrive leaves a badge');
    S.CHALLENGE.targets.zone[3]=T*10;const w=runChallenge(S);ok(w.tier<0&&!w.paid&&S.challengeState().claimed['zone:3']===3,'a weaker run later pays nothing and cannot reset the claim');
    ok(S.serialize().includes('"challenge"'),'claims, bests and badges are saved');S.CHALLENGE.claims=false;S.CHALLENGE.targets.zone[3]=null;}
  // ---- practice drill: only the first three taps per second score
  {const S=await game(),G=S.G;const h=G.roster[0];S.startDrill(h,false);S.setRT(1000);let f=0;while(G.drill.running){S.clock.frame();S.setRT(S.getRT()+DT);S.update(DT,true);S.drillTick(DT);f++;if(f%6===0)S.withDrill(()=>S.tapEnemy(G.enemies[0]));} /* ten taps a second */
    const st=G.drill.stats;ok(st.taps===S.DRILL_SEC*10&&st.tapsExtra>0&&st.taps-st.tapsExtra<=3*S.DRILL_SEC+3,'ten taps a second: '+st.taps+' taps, '+st.tapsExtra+' ignored, at most three a second scored');}
  // ---- incomeRate: the canonical permanent rate; offline earnings use it; temporary modifiers excluded
  {const S=await game(),G=S.G;const r=S.incomeRate(3,10);ok(r.gold>0&&r.ore>0&&r.xp>0&&r.fightsPerMin>0,'rate has gold, ore, XP per minute');
    const g0=S.offlineGains(2,0.5);ok(g0.fights===Math.floor(2*3600/22*0.5),'offline fights unchanged: a fight every 22 s at the efficiency');near(g0.gold,Math.round(g0.fights/r.fightsPerMin*S.incomeRate(G.zone,G.prog[G.zone]).gold),1,'offline gold is the canonical rate times the farmed minutes');
    S.setRT(50);S.noteAttention();const r1=S.incomeRate(3,10);ok(r1.gold===r.gold,'attention does not change the rate');G.omens=['swarm'];G.oath='poverty';const r2=S.incomeRate(3,10);ok(r2.gold===r.gold&&r2.ore===r.ore,'omens and oaths do not change the rate');G.omens=[];G.oath=null;
    G.reforges=2;const r3=S.incomeRate(3,10);near(r3.gold/r.gold,S.permGoldMult()/(1),1e-9,'Shatter multipliers apply exactly once through permGoldMult');}
  if(out.length)console.log(out.join('\n'));console.log((fail?'FAIL  ':'PASS  ')+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
