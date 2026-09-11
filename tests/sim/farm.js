// Farming efficiency: from a boss arrival snapshot, farm one zone for N simulated minutes and report XP, gold, kills, deaths per hour.
// Usage: node tests/sim/farm.js --boss ironvein --profile idle --zone thornwood|ironvein-pre [--minutes 60] [--seeds 10]
'use strict';
const {load}=require('./headless.js'),fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const BOSS=String(args.boss||'ironvein').toLowerCase(),PROFILE=args.profile||'idle',MIN=args.minutes||60,DT=0.1,SEEDS=args.seeds||10;
const snapDir=path.join(__dirname,'snapshots');
const snaps=fs.readdirSync(snapDir).filter(f=>f.startsWith(BOSS+'_'+PROFILE+'_')).map(f=>JSON.parse(fs.readFileSync(path.join(snapDir,f),'utf8'))).slice(0,SEEDS);
if(!snaps.length){console.error('no snapshots');process.exit(1);}
let seed=11;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
(async()=>{
  const S=load({startMs:1700000000000});await S.ready;const G=S.G,Z=S.ZONES;
  const modes=String(args.zone||'thornwood,ironvein-pre').split(',');
  const rows=[['zone','arrival Lv','xp/h (levels)','gold/h','kills/h','deaths/h','fights/h','win%']];
  for(const mode of modes){const acc={lv:0,gold:0,kills:0,deaths:0,fights:0,wins:0,arr:0};
    for(const snap of snaps){S.storeSet(snap.save);S.loadGame();G.noSave=true;G.title=false;G.tut=null;G.sheet=null;G.reveal=null;G.card=null;G.banner=null;G.hordeFight=null;G.delve=null;G.projs=[];G.action=null;G.enemies=[];G.autoCast=true;G.autoUntil=9e15;
      const bz=snap.zone;const zone=mode==='thornwood'?bz-1:bz;G.zone=zone;const Zz=Z[zone];const preLo=Zz.fights-1-9;if(mode==='thornwood'){G.cleared[zone]=true;G.prog[zone]=0;}else{G.cleared[zone]=false;G.prog[zone]=preLo;}
      for(const h of G.active){h.dead=false;h.status={};h.hp=h.maxhp;}S.layout();G.mode='walk';G.enc=0.5;
      const lv0=G.active.reduce((a,h)=>a+h.lvl+h.xp/S.xpNeed(h.lvl),0)/G.active.length,g0=G.gold,k0=G.stats.kills,w0=G.wins,d0=G.stats.defeats||0;acc.arr+=snap.lv;
      for(let i=0;i<MIN*60/DT;i++){S.setRT(S.getRT()+DT);S.clock.advance(DT*1000);G.tut=null;S.update(DT,true);G.parts.length=0;G.floats.length=0;
        if(mode!=='thornwood'&&G.prog[zone]>=Zz.fights-1&&G.mode==='walk')G.prog[zone]=preLo; // never reach the boss: loop the pre-boss stretch
        if(mode==='thornwood'&&G.zone!==zone){G.zone=zone;}
        if(G.mode==='defeat'&&G.timer>2.7){/* counted by stats.defeats */}}
      const lv1=G.active.reduce((a,h)=>a+h.lvl+h.xp/S.xpNeed(h.lvl),0)/G.active.length;const hrs=MIN/60;
      acc.lv+=(lv1-lv0)/hrs;acc.gold+=(G.gold-g0)/hrs;acc.kills+=(G.stats.kills-k0)/hrs;acc.deaths+=((G.stats.defeats||0)-d0)/hrs;acc.fights+=(G.wins-w0+((G.stats.defeats||0)-d0))/hrs;acc.wins+=(G.wins-w0)/Math.max(1,(G.wins-w0+((G.stats.defeats||0)-d0)));}
    const n=snaps.length;rows.push([mode,(acc.arr/n).toFixed(1),(acc.lv/n).toFixed(2),Math.round(acc.gold/n),Math.round(acc.kills/n),(acc.deaths/n).toFixed(1),Math.round(acc.fights/n),Math.round(100*acc.wins/n)+'%']);}
  console.log('FARM TEST from '+BOSS+' arrival snapshots, profile '+PROFILE+', '+snaps.length+' snapshots x '+MIN+' min each, Auto-Cast, no taps');
  const widths=rows[0].map((_,i)=>Math.max(...rows.map(r=>String(r[i]).length))+2);for(const r of rows)console.log(r.map((c,i)=>String(c).padEnd(widths[i])).join(''));
})().catch(e=>{console.error(e);process.exit(1);});
