// Loads the real game logic (source/game.js) in Node with just enough browser stubs
// to boot without rendering. Exposes the game's internals on SIM for bots and tests.
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.join(__dirname,'..','..');

function makeStubs(){
  const noop=()=>{};
  const ctxProxy=new Proxy({},{get(t,k){if(k==='measureText')return s=>({width:String(s).length*4});if(k==='canvas')return{width:270,height:480};if(k==='createRadialGradient'||k==='createLinearGradient')return()=>({addColorStop:noop});if(k==='getImageData')return(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h});return typeof k==='string'&&/^[a-z]/.test(k)?noop:undefined;},set(){return true;}});
  const el=(id)=>({id,style:{},width:270,height:480,textContent:'',clientWidth:270,clientHeight:480,getContext:()=>ctxProxy,addEventListener:noop,removeEventListener:noop,getBoundingClientRect:()=>({left:0,top:0,width:270,height:480}),remove:noop,appendChild:noop,removeChild:noop,setAttribute:noop,getAttribute:()=>null,querySelector:()=>null,focus:noop});
  const store=new Map();
  const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k),clear:()=>store.clear(),key:i=>[...store.keys()][i]||null,get length(){return store.size;}};
  class Image{constructor(){this.width=1;this.height=1;this.onload=null;this.onerror=null;this._src='';}set src(v){this._src=v;setImmediate(()=>{if(this.onload)this.onload();});}get src(){return this._src;}decode(){return Promise.resolve();}}
  class Audio{constructor(){this.paused=true;this.currentTime=0;this.volume=1;this.loop=false;this.src='';}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}load(){}addEventListener(){}removeEventListener(){}}
  const listeners={};
  const win={
    innerWidth:270,innerHeight:480,devicePixelRatio:1,screen:{width:270,height:480},
    addEventListener:(k,f)=>{(listeners[k]=listeners[k]||[]).push(f);},removeEventListener:noop,dispatchEvent:noop,
    getComputedStyle:()=>({paddingTop:'0px',paddingBottom:'0px',height:'480px'}),
    requestAnimationFrame:()=>0,cancelAnimationFrame:noop,
    setTimeout:(f,ms,...a)=>{const t=setTimeout(f,ms,...a);if(t.unref)t.unref();return t;},clearTimeout,
    setInterval:()=>0,clearInterval:noop,setImmediate,
    localStorage,sessionStorage:localStorage,Image,Audio,
    navigator:{userAgent:'node-sim',standalone:false,vibrate:noop,language:'en'},
    location:{search:'',href:'http://localhost/',hash:'',reload:noop},
    history:{replaceState:noop},
    fetch:()=>Promise.reject(new Error('no network in sim')),
    performance:{now:()=>Number(process.hrtime.bigint()/1000000n)},
    matchMedia:()=>({matches:false,addEventListener:noop,addListener:noop}),
    console,Math,JSON,Date,Object,Array,Number,String,Boolean,Promise,Map,Set,Symbol,Error,TypeError,RangeError,Uint8ClampedArray,Uint8Array,Float32Array,Int32Array,parseInt,parseFloat,isNaN,isFinite,encodeURIComponent,decodeURIComponent,escape,unescape,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),
    Proxy,Reflect,WeakMap,WeakSet,structuredClone:v=>JSON.parse(JSON.stringify(v)),queueMicrotask,
  };
  win.window=win;win.self=win;win.globalThis=win;
  win.document={hidden:false,visibilityState:'visible',body:{appendChild:noop,removeChild:noop,style:{},classList:{add:noop,remove:noop}},documentElement:{style:{},clientWidth:270,clientHeight:480},createElement:tag=>el(tag),getElementById:id=>el(id),querySelector:()=>null,addEventListener:(k,f)=>{(listeners[k]=listeners[k]||[]).push(f);},removeEventListener:noop,fonts:{load:()=>Promise.resolve(),ready:Promise.resolve()}};
  win._listeners=listeners;
  return win;
}

const EXPORTS=['G','update','ZONES','HEROES','CLASSES','TALENTS','ENEMIES','OMENS','SUPER_ORDER','BUILD','STRUCTS','OATHS','equipBest','buyTalent','promoteHero','promoteReq','rankCost','talentReq','treeLv','buildCost','hireCost','vilCap','idleVil','garrisonHeroes','garrisonSlots','startHordeFight','hordeWindow','hordeThreat','hordeTier','defense','prepCost','mercLv','startDelve','chooseDoor','endDelve','canReforge','doReforge','reforgeGain','offlineGains','fmtNum','makeItem','sellItem','salvageValue','refreshStats','layout','castleTick','checkUnlocks','partyMax','xpNeed','tal','built','endlessLv','endlessMilestone','bossZone','renownGain','offerOmens','milestoneItem','serialize','loadGame','saveGame','storeSet','storeGet','itemName','itemStat','upgradeCost','upgradeItem','heroStats','setAnim','banner','toast','closeSheet','openSheet','spawnEncounter','resolveHorde','genHorde','hordeStrength','currentRoadLevel','hordeCombatLevel','TREE','NODES','tabLocked','heroStatus','tapEnemy','tapDamage','castSurge','reactTo','autoOn','addHero','mkHero'];

function load(opts={}){
  const win=makeStubs();
  // virtual clock: Date.now() follows the simulation
  let simMs=opts.startMs||Date.now();
  const RealDate=Date;
  const SimDate=new Proxy(RealDate,{construct(t,args){return args.length?new RealDate(...args):new RealDate(simMs);},get(t,k){if(k==='now')return()=>simMs;return Reflect.get(t,k);}});
  win.Date=SimDate;
  const assets=JSON.parse(fs.readFileSync(path.join(ROOT,'build','assets.json'),'utf8'));
  let src=fs.readFileSync(path.join(ROOT,'source','game.js'),'utf8');for(const [a,b] of (opts.replace||[])){if(!src.includes(a))throw new Error('replace target not found: '+a);src=src.replace(a,b);}
  const tail='\n;(function(){const S={};'+EXPORTS.map(n=>`try{S.${n}=${n};}catch(e){}`).join('')+'S.getRT=()=>RT;S.setRT=v=>{RT=v;};S.getHOLD=()=>HOLD;globalThis.SIM=S;})();';
  const ctx=vm.createContext(win);
  vm.runInContext('var BUILD_ID="sim";const ASSETS='+JSON.stringify(assets)+';',ctx);
  vm.runInContext(src+tail,ctx,{filename:'game.js'});
  const S=ctx.SIM;
  S.win=win;
  S.clock={get:()=>simMs,advance:ms=>{simMs+=ms;},set:ms=>{simMs=ms;}};
  S.ready=new Promise(res=>{const chk=()=>{if(S.G.booted)res();else setTimeout(chk,5);};chk();});
  return S;
}
module.exports={load};
