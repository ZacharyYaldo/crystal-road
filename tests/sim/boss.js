// Boss-only harness: replays one boss fight many times from saved arrival snapshots.
// Snapshots are written by bot.js (--snapshots dir) at the party's first attempt on each boss; batch.js does this automatically.
// Usage: node tests/sim/boss.js --boss stillwater --profile casual [--seeds 100] [--variants "..."] [--replace "a=>b"]
//   --variants  comma list of hp/atk boss multipliers for that zone (default: current build only)
//   Each snapshot is fought in both modes: "active" (manual abilities, taps at the profile rate, Surge) and "auto" (Auto-Cast, no taps),
//   because a real player's boss attempt lands in one or the other depending on when it happens.
'use strict';
const {load}=require('./headless.js'),fs=require('fs'),path=require('path');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=isNaN(Number(n))?n:Number(n);i++;}else a[k]=true;}}return a;})();
const BOSS=String(args.boss||'stillwater').toLowerCase(),PROFILE=args.profile||'casual',SEEDS=args.seeds||100,DT=args.dt||0.1;
const TAPS={idle:0,light:1,casual:1.5,engaged:2,stress:2}[PROFILE]||1.5;
const snapDir=path.join(__dirname,'snapshots');
const snaps=fs.readdirSync(snapDir).filter(f=>f.startsWith(BOSS+'_'+PROFILE+'_')&&(args.snapSeed==null||f.endsWith('_'+args.snapSeed+'.json'))).map(f=>JSON.parse(fs.readFileSync(path.join(snapDir,f),'utf8')));
if(!snaps.length){console.error('no snapshots for '+BOSS+' / '+PROFILE+' in '+snapDir+' (run batch.js or bot.js --snapshots first)');process.exit(1);}
const zone=snaps[0].zone;
const curTune={0:'0:{hp:0.75,atk:0.80}',1:'1:{hp:0.75,atk:0.82}'}[zone];
const variants=args.variants?String(args.variants).split(',').map(v=>{const [hp,atk]=v.split('/').map(Number);return{key:hp+'/'+atk,replace:[[curTune,zone+':{hp:'+hp+',atk:'+atk+'}']]};}):[{key:'current',replace:[]}];
const extra=args.replace?String(args.replace).split('||').map(r=>r.split('=>')):[];
let seed=1;function srand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}Math.random=srand;

(async()=>{
  console.log('BOSS TEST  '+snaps[0].zoneName+'  profile '+PROFILE+'  snapshots '+snaps.length+' (arrival Lv '+snaps.map(s=>s.lv).sort((a,b)=>a-b).join(',')+')  runs per variant/mode '+SEEDS);
  const rows=[['variant','mode','runs','win%','lost to adds','loss dur','win dur','bossHP at wipe (med)','survivors','partyHP% on win']];
  for(const v of variants){
    if(!curTune&&args.variants)throw new Error('no tune line for zone '+zone);
    const S=load({startMs:1700000000000,replace:v.replace.concat(extra)});await S.ready;const G=S.G,Z=S.ZONES;
    for(const mode of ['active','auto']){const res=[];seed=7;
      for(let r=0;r<SEEDS;r++){const snap=snaps[r%snaps.length];
        S.storeSet(snap.save);S.loadGame();G.noSave=true;G.title=false;G.tut=null;G.sheet=null;G.reveal=null;G.card=null;G.banner=null;G.hordeFight=null;G.delve=null;G.projs=[];G.action=null;G.enemies=[];
        G.zone=zone;G.prog[zone]=Z[zone].fights-1;G.cleared[zone]=false;G.mode='walk';G.enc=0.05;G.bossFight=false;for(const h of G.active){h.dead=false;h.status={};if(snap.hp&&snap.hp[h.id]!=null)h.hp=Math.max(1,Math.round(h.maxhp*snap.hp[h.id]));if(snap.charge&&snap.charge[h.id]!=null)h.charge=snap.charge[h.id];if(args.fullHp)h.hp=h.maxhp;if(args.zeroCharge)h.charge=0;if(args.charge!=null)h.charge=Number(args.charge);h.tapCast=false;}S.layout();
        if(mode==='auto'){G.autoCast=true;G.autoUntil=9e15;}else{G.autoCast=false;G.autoUntil=0;}
        let t=0,tap=0,maxhp=0,out=null,start=null;
        for(let i=0;i<20*600;i++){t+=DT;S.setRT(S.getRT()+DT);S.clock.advance(DT*1000);G.tut=null;G.title=false;G.sheet=null;S.update(DT,true);G.parts.length=0;G.floats.length=0;
          if(G.bossFight&&start==null){start=t;if(args.verbose&&r<2)console.log('  state: heroes='+G.active.map(h=>h.id+':'+h.hp+'/'+h.maxhp+' a'+h.atk+' d'+h.def+' c'+Math.round(h.charge))+' surge='+Math.round(G.surge||0)+' tree='+JSON.stringify(G.tree)+' boss='+G.enemies.map(e=>e.name+':'+e.maxhp+'/a'+e.atk+'/d'+e.def+'/L'+e.lvl));}
          if(G.mode==='battle'){if(!maxhp){const e=G.enemies.find(x=>x.boss)||G.enemies[0];if(e)maxhp=e.maxhp;}
            if(mode==='active'){for(const h of G.active){if(!h.dead&&h.charge>=100&&!h.tapCast){if(S.reactTo(h))continue;h.tapCast=true;h.charge=0;}}if(G.surge>=100){try{S.castSurge();}catch(e){}}tap+=TAPS*DT;while(tap>=1){tap-=1;const foes=G.enemies.filter(e=>!e.dead);if(!foes.length)break;const tg=(G.focus&&G.focus.e&&!G.focus.e.dead)?G.focus.e:foes.sort((a,b)=>a.hp-b.hp)[0];try{S.tapEnemy(tg);}catch(e){}}}}
          if(G.mode==='victory'&&start!=null){const alive=G.active.filter(h=>!h.dead);out={win:true,dur:t-start,survivors:alive.length,partyHp:G.active.reduce((a,h)=>a+Math.max(0,h.hp),0)/Math.max(1,G.active.reduce((a,h)=>a+h.maxhp,0))};break;}
          if(G.mode==='defeat'&&start!=null){const e=G.enemies.find(x=>x.boss)||G.enemies[0];out={win:false,dur:t-start,hpLeft:e&&maxhp?e.hp/maxhp:null,toAdds:!!(e&&e.dead)};break;}}
        if(args.verbose)console.log(mode+' run'+r+' snap'+snap.seed+' Lv'+snap.lv+' start='+(start==null?'never':start.toFixed(1))+' -> '+(out?(out.win?'WIN':'LOSS')+' dur '+out.dur.toFixed(0)+(out.win?' partyHP '+out.partyHp.toFixed(2):' bossHP '+(out.hpLeft==null?'?':out.hpLeft.toFixed(2))):'UNRESOLVED mode='+G.mode+' bossFight='+G.bossFight+' enemies='+G.enemies.length+' prog='+G.prog[zone]+' cleared='+G.cleared[zone]+' active='+G.active.length+' delve='+!!G.delve));
        if(out)res.push(out);}
      const med=a=>{a=a.filter(x=>x!=null).sort((x,y)=>x-y);return a.length?+a[Math.floor((a.length-1)/2)].toFixed(2):'-';};
      const W=res.filter(r=>r.win),L=res.filter(r=>!r.win);
      rows.push([v.key,mode,String(res.length),String(Math.round(100*W.length/Math.max(1,res.length))),String(L.length?Math.round(100*L.filter(r=>r.toAdds).length/L.length)+'%':'-'),String(med(L.map(r=>r.dur))),String(med(W.map(r=>r.dur))),String(med(L.map(r=>r.hpLeft))),String(med(W.map(r=>r.survivors))),String(med(W.map(r=>r.partyHp)))]);}}
  const widths=rows[0].map((_,i)=>Math.max(...rows.map(r=>String(r[i]).length))+2);for(const r of rows)console.log(r.map((c,i)=>String(c).padEnd(widths[i])).join(''));
})().catch(e=>{console.error(e);process.exit(1);});
