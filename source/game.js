// ============================================================ setup
const W=270,SCENE_Y=96,GROUND=SCENE_Y+182;
let H=480,TABY=438,EXTRA=0,BS=32,ABH=44,CAMP_Y=356,BIG=false;
function applyH(h){H=h;TABY=H-42;EXTRA=H-480;BS=EXTRA>40?40:32;ABH=BS+12;CAMP_Y=308+ABH+4;BIG=EXTRA>40;if(cv.height!==H){cv.height=H;ctx.imageSmoothingEnabled=false;}}
const _probe=document.createElement('div');_probe.style.cssText='position:fixed;left:-9999px;top:0;width:0;height:0;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);';document.body.appendChild(_probe);
function insets(){const cs=getComputedStyle(_probe);const et=parseFloat(cs.paddingTop)||0,eb=parseFloat(cs.paddingBottom)||0;const portrait=innerHeight>=innerWidth;const sh=portrait?screen.height:screen.width;const gap=Math.max(0,sh-innerHeight);const sa=navigator.standalone===true&&/iPhone|iPad|iPod/.test(navigator.userAgent);const forced=false;const top=et,bot=0;return{top,bot,et,eb,gap,sh,forced};}
function padsApply(){const p=insets();const w=document.getElementById('wrap');if(!w)return p;const t=p.top+'px',b=p.bot+'px',hh=p.forced?p.sh+'px':'';if(w.style.paddingTop!==t)w.style.paddingTop=t;if(w.style.paddingBottom!==b)w.style.paddingBottom=b;if(w.style.height!==hh)w.style.height=hh;return p;}
const cv=document.getElementById('c'),tc=document.getElementById('t'),stage=document.getElementById('stage');
cv.width=W;cv.height=H;const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
const tx=tc.getContext('2d');let SC=1,TS=1;
const wrapEl=document.getElementById('wrap');function availH(){if(!wrapEl)return innerHeight;const cs=getComputedStyle(wrapEl);const vv=(window.visualViewport&&!wrapEl.style.height)?window.visualViewport.height:wrapEl.clientHeight;return Math.min(vv,wrapEl.clientHeight)-(parseFloat(cs.paddingTop)||0)-(parseFloat(cs.paddingBottom)||0);}
function wantH(){padsApply();const a=availH();return Math.max(480,Math.min(600,Math.round(W*a/(innerWidth||270))));}
function fit(){const want=wantH();if(want!==H||cv.height!==H)applyH(want);const sc=Math.min(innerWidth/W,availH()/H);const dpr=Math.min(3,window.devicePixelRatio||1);const ts=Math.max(3,sc*dpr);
  if(sc===SC&&ts===TS&&tc.width===Math.round(W*TS)&&tc.height===Math.round(H*TS))return;SC=sc;TS=ts;
  stage.style.width=cv.style.width=tc.style.width=W*SC+'px';stage.style.height=cv.style.height=tc.style.height=H*SC+'px';
  tc.width=Math.round(W*TS);tc.height=Math.round(H*TS);}
addEventListener('resize',fit);if(window.visualViewport)window.visualViewport.addEventListener('resize',fit);fit();if(window.ResizeObserver&&wrapEl)new ResizeObserver(fit).observe(wrapEl);addEventListener('orientationchange',()=>{setTimeout(fit,50);setTimeout(fit,400);});document.addEventListener('visibilitychange',()=>{if(!document.hidden){fit();setTimeout(fit,300);resumeAudio();setTimeout(resumeAudio,400);checkUpdate();}});checkUpdate();setTimeout(checkUpdate,3000);setInterval(checkUpdate,10*60*1000);window.addEventListener('pointerdown',resumeAudio,{passive:true});window.addEventListener('touchend',resumeAudio,{passive:true});[100,400,1000,2500].forEach(t=>setTimeout(fit,t));setInterval(fit,700);
const rand=Math.random,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),R=Math.round;
function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
const now=()=>Date.now();
const ROLL={};function roll(key,target){const r=ROLL[key]||(ROLL[key]={v:target});const d=target-r.v;if(Math.abs(d)<1e-9||Math.abs(d)>Math.abs(target)*1e6)r.v=target;else r.v+=d*Math.min(1,(HOLD?0.16:0.32)*Math.max(1,(60*rollDt)));return r.v;}
let rollDt=1/60;
function fmt5(n){n=Math.floor(n);return n<10000?String(n):fmtNum(n);}
function fmtNum(n){n=Math.floor(n);if(n<1000)return String(n);const u=['K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];let i=-1,v=n;while(v>=1000&&i<u.length-1){v/=1000;i++;}if(v>=1000)return n.toExponential(1).replace('e+','e');return (v>=100?v.toFixed(0):v>=10?v.toFixed(1):v.toFixed(2))+u[i];}

// ============================================================ palette & pixel UI
const C={navy:'#161a2c',navy2:'#1e243c',navy3:'#2a3050',out:'#090b14',gold:'#c9a227',goldL:'#f1d778',goldD:'#7a5c14',cream:'#f2e9d8',muted:'#a0a8be',dimt:'#5a6482',red:'#c0392b',green:'#4caf50',cyan:'#4fc3f7',xp:'#8ab4ff',band:'#1b2036',btn:'#222a48',btnGold:'#3c3214'};
const RANKS=['Common','Uncommon','Rare','Epic','Legendary','Mythic'];
const RANKPAL=[{a:[154,163,173],b:[107,116,128],h:[214,221,229]},{a:[76,175,80],b:[46,125,50],h:[165,214,167]},{a:[66,165,245],b:[21,101,192],h:[187,222,251]},{a:[171,71,188],b:[106,27,154],h:[225,190,231]},{a:[230,180,34],b:[168,120,15],h:[255,240,179]},{a:[80,200,255],b:[30,120,220],h:[225,245,255]}];
const RANKHEX=RANKPAL.map(p=>'#'+p.a.map(v=>v.toString(16).padStart(2,'0')).join(''));
const FIXED={o:[26,20,32],g:[201,162,39],w:[122,74,34],r:[200,60,60],c:[79,195,247],s:[250,250,250]};
const ICON={
sword:[".....oo.....","....ohao....","....ohao....","....ohao....","....ohao....","....ohao....","....ohao....","....ohao....","..oggggggo..","....ogwo....","....owwo....",".....oo....."],
staff:[".....ooo....","....ohhho...","....ohaho...",".....ooo....",".....gwo....",".....ow.....",".....wo.....","....ow......","....wo......","...ow.......","...wo.......","...oo......."],
bow:["......oo....","....oowao...","...owo.oa...","..ow...oa...","..wo...oa...","..wo...oa...","..wo...oa...","..ow...oa...","...owo.oa...","....oowao...","......oo....","............"],
axe:[".....oo.....","....oaao....","...oahaao...","...oaaaao...","...obaawo...","....obwo....",".....ow.....",".....wo.....",".....ow.....",".....wo.....",".....ow.....",".....oo....."],
dagger:["............",".....oo.....","....ohao....","....ohao....","....ohao....","....ohao....","...ogggo....","....owo.....","....owo.....",".....o......","............","............"],
cape:[".oooooooo...","oahhhhhhao..","oaaaaaaaao..",".oaaaaaaao..",".oaaaaaaaao.","..oaaaaaaao.","..oabaaaaao.","...oabaaaao.","...oabaaaao.","....obaaao..","....obbbo...",".....ooo...."],
ring:["............",".....oo.....","....ohho....","...oohhoo...","..ohaoohao..","..oa....ao..","..oa....ao..","..oba..abo..","...obaabo...","....oooo....","............","............"],
amulet:[".....oo.....","....o..o....","...o....o...","...o....o...","...o....o...","....oaao....","...oahhao...","...oahaao...","...oaaabo...","....oabo....",".....oo.....","............"],
coin:["....oooo....","..oohhhhoo..",".ohhaaaahho.",".ohaaaaaaho.","oaaaahhaaaao","oaaaahhaaaao","oaaaahhaaaao","oaaaahhaaaao",".obaaaaaabo.",".obbaaaabbo.","..oobbbboo..","....oooo...."],
ore:[".....o......","....oho.....","...ohhao....","..ohhaao.o..","..ohaaaooho.",".oohaabohao.",".ohhaaoaaao.","ohaaaaoaabo.","ohaaabbabbo.","obaabbbbbbo.",".oooooooooo.","............"],
crystal:[".....oo.....","....ohho....","...ohhaao...","..ohhaaaao..",".ohhaaaabbo.",".oaaaabbbbo.","..oaaabbbo..","...oaabbo...","....oabo....",".....oo.....","............","............"],
shield:[".oooooooooo.","oahhhhhhhhao","oaahhhhhhaao","oaaaahhaaaao","oaaaaaaaaaao",".oaaaaaaaao.",".oaaaaaaaao.","..oaaaaaao..","...oaaaao...","....oaao....",".....oo.....","............"],
heal:["............","....oooo....","....ohho....",".oooohhoooo.",".ohhhhhhhho.",".ohhhhhhhho.",".oooohhoooo.","....ohho....","....ohho....","....oooo....","............","............"],
daggers:["o.........o.",".oa.....ao..","..oa...ao...","...oa.ao....","....oao.....","....oao.....","...oa.ao....","..oa...ao...",".ogo...ogo..",".o.......o..","............","............"],
meteor:[".........oo.","........oaao",".......oaaao","......oaaao.",".....oaaao..","....oahao...","...ohhaao...","..ohhhaao...","..ohhhao....","..oohho.....","...oo.......","............"],
arrows:["..o.....o...",".oao...oao..","oaaao.oaaao.","..o.o...o...","..o.....o...","..o..o..o...","....oao.....","...oaaao....","..o..o..o...",".oao....oao.","oaaao..oaaao","............"],
rage:["...o....o...","..oao..oao..","..oaoooao...","..oaaaaaao..",".oahaaaahao.",".oaaaaaaaao.",".oaaoaaoaao.","..oaaaaaao..","..oaaooaao..","...oaaaao...","....oooo....","............"],
tent:["............",".....oo.....","....oaao....","...oaaaao...","..oaaaaaao..",".oaaobboaao.",".oaaobboaao.","oaaaobboaaao","oaaaobboaaao","oooooooooooo","............","............"],
map:["............",".oooooooooo.",".ohhhhhhhho.",".ohaaaaaaho.",".ohabbaaaho.",".ohaabbaaho.",".ohaaabbaho.",".ohaaaaaaho.",".ohhhhhhhho.",".oooooooooo.","............","............"],
party:["............","...oo...oo..","..oaao.oaao.","..oaao.oaao.","...oo...oo..","..oaao.oaao.",".oaaaaoaaaao",".oaaaaoaaaao",".oaaaaoaaaao",".oooooooooo.","............","............"],
road:["............",".....oo.....","....oaao....","....oaao....","...oa.hao...","...oa..ao...","..oa.h..ao..","..oa....ao..",".oa..h...ao.",".oa.......ao","oa...h....ao","oooooooooooo"],
nodes:["....oooo....","...ohhhho...","...ohhhho...","....oooo....",".....aa.....",".aaaaaaaaaa.",".aa......aa.","oooo....oooo","ohho....ohho","ohho....ohho","oooo....oooo","............"],
hourglass:[".oooooooo...",".ohaaaaho...","..oaaaao....","...obbo.....","....oo......","....oo......","...oaao.....","..oaaaao....",".ohbbbbho...",".oooooooo...","............","............"],
gear:["....o..o....","..o.oaao.o..","..oaaaaaao..","...oaooao...","oaaao..oaaao","o.oao..oao.o","oaaao..oaaao","...oaooao...","..oaaaaaao..","..o.oaao.o..","....o..o....","............"],
play:["............","...oo.......","...oao......","...oaao.....","...oaaao....","...oaaaao...","...oaaao....","...oaao.....","...oao......","...oo.......","............","............"],
swap:["............","....o.......","...oho......","..ohhoooooo.",".ohhhhhhhho.","..ohhoooooo.","...oho......","....o.......",".......o....",".oooooohho..",".ohhhhhhhho.",".oooooohho.."],
lock:["....oooo....","...oaaaao...","..oaoooao...","..oao..oao..","..oao..oao..",".oooooooooo.",".ohhhhhhhho.",".ohhhoohhho.",".ohhhoohhho.",".ohhhhhhhho.",".oooooooooo.","............"],
castle:["o..o..oo..o.","oaaoaaooaaoa","oaaaaaaaaaaa","oaaaaaoaaaaa","oaaaaobbaaaa",".oaaaobbaaao",".oaaaobbaaao",".oaaaobbaaao",".oaaoobbooao","oaaaobbbbaaa","oaaaobbbbaaa","oooooooooooo"],
check:["............","..........o.",".........oao","........oao.","o......oao..","oo....oao...","oao..oao....",".oao.oao....","..oaoao.....","...oao......","....o.......","............"],
back:["............",".....o......","....oa......","...oaa......","..oaaaoooooo",".oaaaaaaaaao","..oaaaoooooo","...oaa......","....oa......",".....o......","............","............"],
x:["o........o..","oao......oao",".oao....oao.","..oao..oao..","...oaooao...","....oaao....","....oaao....","...oaooao...","..oao..oao..",".oao....oao.","oao......oao","o........o.."],
};
const iconCache={};
function iconImg(name,pal,scale=1){
  const key=name+'|'+pal+'|'+scale;if(iconCache[key])return iconCache[key];
  const g=ICON[name],c=document.createElement('canvas');c.width=12*scale;c.height=12*scale;const x=c.getContext('2d');
  const P=Object.assign({},FIXED,typeof pal==='number'?RANKPAL[pal]:pal);
  for(let r=0;r<12;r++)for(let q=0;q<12;q++){const ch=g[r][q];if(ch==='.')continue;const col=P[ch]||[255,0,255];x.fillStyle=`rgb(${col[0]},${col[1]},${col[2]})`;x.fillRect(q*scale,r*scale,scale,scale);}
  iconCache[key]=c;return c;
}
function icon(name,x,y,pal=0,scale=1){ctx.drawImage(iconImg(name,pal,scale),x,y);}
function px(x,y,w=1,h=1,col){if(col)ctx.fillStyle=col;ctx.fillRect(x,y,w,h);}
function frame(x,y,w,h,fill=C.navy,trim=C.gold,ornate=true){
  px(x,y,w,h,C.out);px(x+1,y+1,w-2,h-2,trim);px(x+2,y+2,w-4,h-4,C.out);px(x+3,y+3,w-6,h-6,fill);px(x+3,y+3,w-6,1,C.navy2);
  if(ornate)for(const [cx,cy] of [[x+1,y+1],[x+w-3,y+1],[x+1,y+h-3],[x+w-3,y+h-3]])px(cx,cy,2,2,C.goldL);
}
function button(x,y,w,h,gold=false,disabled=false){
  px(x,y,w,h,C.out);px(x+1,y+1,w-2,h-2,disabled?C.dimt:(gold?C.goldL:C.goldD));px(x+2,y+2,w-4,h-4,disabled?C.navy:(gold?C.btnGold:C.btn));px(x+2,y+2,w-4,1,gold?'#5a4a20':'#3a4470');
}
function bar(x,y,w,h,frac,col,back=C.out){
  px(x,y,w,h,back);const fw=R((w-2)*clamp(frac,0,1));
  if(fw>0){px(x+1,y+1,fw,h-2,col);ctx.globalAlpha=0.35;px(x+1,y+1,fw,1,'#fff');ctx.globalAlpha=1;}
}
function dimRect(x,y,w,h,a=0.72){ctx.fillStyle=`rgba(6,8,16,${a})`;ctx.fillRect(x,y,w,h);}
// text on the crisp overlay canvas
const SER="Georgia, 'DejaVu Serif', 'Times New Roman', serif",MONO="Menlo, 'DejaVu Sans Mono', Consolas, monospace";
const FONT={title:['bold',11,SER],h:['bold',9,SER],b:['',7.5,SER],bb:['bold',7.5,SER],s:['',6.5,SER],sb:['bold',7,SER],xs:['',5.5,MONO],xsb:['bold',5.5,MONO],big:['bold',13,SER],num:['bold',7.5,"'Trebuchet MS','Helvetica Neue',Arial,sans-serif"]};
function text(x,y,s,style='b',col=C.cream,align='left',alpha=1){
  const [wt,sz,fam]=FONT[style];tx.font=`${wt} ${sz*TS}px ${fam}`;tx.textAlign=align;tx.textBaseline='alphabetic';tx.globalAlpha=alpha;
  const o=Math.max(1,Math.round(TS*0.7)),by=(y+sz*0.98)*TS;tx.fillStyle='rgba(0,0,0,0.85)';tx.fillText(s,x*TS+o,by+o);tx.fillStyle=col;tx.fillText(s,x*TS,by);tx.globalAlpha=1;
}
function textW(s,style){const [wt,sz,fam]=FONT[style];tx.font=`${wt} ${sz*TS}px ${fam}`;return tx.measureText(s).width/TS;}

// ============================================================ data
const CLASSES={
  knight:{name:'Knight',hp:120,atk:14,def:8,spd:9,ghp:14,gatk:2.2,gdef:1.1,range:'melee',weapon:'sword',wclass:'bright',ab:{id:'shieldwall',name:'Shield Wall',icon:'shield',desc:'Draws every attack for 3 turns and halves the damage.'}},
  cleric:{name:'Cleric',hp:80,atk:9,def:4,spd:10,ghp:9,gatk:1.5,gdef:0.6,range:'heal',weapon:'staff',wclass:'cyan',ab:{id:'sanctuary',name:'Sanctuary',icon:'heal',desc:'Heals the whole party and revives the fallen.'}},
  rogue:{name:'Rogue',hp:90,atk:16,def:4,spd:14,ghp:10,gatk:2.6,gdef:0.6,range:'melee',crit:0.3,weapon:'dagger',wclass:'bright',ab:{id:'shadowstep',name:'Shadowstep',icon:'daggers',desc:'Three quick strikes on the weakest enemy; the last always crits.'}},
  mage:{name:'Mage',hp:70,atk:13,def:3,spd:8,ghp:7,gatk:2.5,gdef:0.5,range:'aoe',weapon:'staff',wclass:'cyan',ab:{id:'meteor',name:'Meteor',icon:'meteor',desc:'A meteor strikes every enemy.'}},
  ranger:{name:'Ranger',hp:85,atk:15,def:5,spd:12,ghp:9,gatk:2.3,gdef:0.7,range:'ranged',weapon:'bow',wclass:'bright',ab:{id:'rain',name:'Rain of Arrows',icon:'arrows',desc:'Arrows fall on every enemy and leave them bleeding.'}},
  berserker:{name:'Berserker',hp:140,atk:20,def:5,spd:7,ghp:16,gatk:3.0,gdef:0.7,range:'melee',weapon:'axe',wclass:'bright',ab:{id:'rage',name:'Rage',icon:'rage',desc:'Double damage for 3 turns, but takes more.'}},
};
const HEROES=[
  {id:'aldric',name:'Aldric',cls:'knight',start:true},
  {id:'sera',name:'Sera',cls:'cleric',campfire:true},
  {id:'vex',name:'Vex',cls:'rogue',zone:0},
  {id:'morrow',name:'Morrow',cls:'mage',zone:1},
  {id:'wren',name:'Wren',cls:'ranger',zone:2},
  {id:'bram',name:'Bram',cls:'berserker',zone:3},
];
const ENEMIES={
  slime:{name:'Slime',hp:0.7,atk:0.6,def:0.3,spd:8,range:'melee'},bat:{name:'Bat',hp:0.5,atk:0.7,def:0.2,spd:13,range:'melee',fly:true,traits:['stun']},orc:{name:'Orc',hp:1.0,atk:1.0,def:0.6,spd:9,range:'melee'},
  skeleton:{name:'Skeleton',hp:0.9,atk:1.0,def:0.7,spd:10,range:'melee'},marshbat:{name:'Marsh Bat',hp:0.6,atk:0.9,def:0.3,spd:14,range:'melee',fly:true,traits:['poison']},werewolf:{name:'Werewolf',hp:1.3,atk:1.3,def:0.6,spd:12,range:'melee'},
  armoredorc:{name:'Armored Orc',hp:1.6,atk:1.1,def:1.5,spd:8,range:'melee'},skelarcher:{name:'Skeleton Archer',hp:0.8,atk:1.2,def:0.5,spd:11,range:'ranged',traits:['charge']},eliteorc:{name:'Elite Orc',hp:1.8,atk:1.5,def:1.0,spd:9,range:'melee'},
  armoredskel:{name:'Ash Skeleton',hp:1.5,atk:1.2,def:1.6,spd:9,range:'melee'},greatskel:{name:'Bone Reaver',hp:1.9,atk:1.7,def:0.9,spd:6,range:'melee',traits:['charge']},necromancer:{name:'The Hollow King',scale:2,hp:7.0,atk:1.7,def:1.0,spd:8,range:'aoe',boss:true,mech:{drain:true,summon:[{at:0.7,id:'skeleton',n:2},{at:0.35,id:'armoredskel',n:2}]}},
  werebear:{name:'Werebear',hp:1.7,atk:1.5,def:0.9,spd:8,range:'melee',traits:['enrage']},orcrider:{name:'Orc Rider',hp:1.6,atk:1.4,def:0.8,spd:12,range:'melee',traits:['charge']},
  oldgrowth:{name:'Old Growth',uid:'werebear',scale:3,hp:6.0,atk:1.8,def:1.1,spd:7,range:'melee',boss:true,mech:{enrage:0.3,charge:true}},
  sandtyrant:{name:'The Sand Tyrant',uid:'orcrider',scale:3,hp:6.5,atk:1.9,def:1.0,spd:10,range:'melee',boss:true,mech:{charge:true,enrage:0.25,summon:[{at:0.5,id:'sandorc',n:2}]}},
  hunterking:{name:'The Hunter King',uid:'skelarcher',scale:3,hp:6.0,atk:2.0,def:0.9,spd:11,range:'ranged',boss:true,mech:{charge:true,summon:[{at:0.6,id:'skelarcher',n:2}]}},
  graveknight:{name:'Grave Knight',uid:'greatskel',scale:3,hp:7.0,atk:2.0,def:1.4,spd:7,range:'melee',boss:true,mech:{charge:true,raise:true,summon:[{at:0.7,id:'skeleton',n:2}]}},
  core:{name:'The Foundry Core',uid:'drone',scale:1,native:true,hp:9.0,atk:2.2,def:1.4,spd:9,range:'aoe',boss:true,mech:{charge:true,shieldAllies:true,summon:[{at:0.6,id:'scoutdroid',n:2}]}},
  scoutdroid:{name:'Scout Droid',uid:'drone',native:true,nscale:0.3,hue:0,hp:0.9,atk:1.2,def:0.8,spd:13,range:'ranged',fly:true},
  warddroid:{name:'Warden Droid',uid:'drone',native:true,nscale:0.42,hue:120,hp:1.6,atk:1.5,def:1.3,spd:9,range:'aoe',fly:true,traits:['shieldAllies']},
  bogslime:{name:'Bog Slime',uid:'slime',hue:60,hp:1.0,atk:0.8,def:0.4,spd:7,range:'melee',traits:['poison']},frostbat:{name:'Frost Bat',uid:'bat',hue:170,hp:0.7,atk:0.9,def:0.3,spd:14,range:'melee',fly:true,traits:['stun']},
  direwolf:{name:'Dire Wolf',uid:'werewolf',hue:300,hp:1.5,atk:1.5,def:0.7,spd:13,range:'melee'},cavetroll:{name:'Cave Troll',uid:'werebear',hue:200,hp:2.1,atk:1.6,def:1.2,spd:6,range:'melee',traits:['enrage']},
  ironhusk:{name:'Iron Husk',uid:'skeleton',hue:200,hp:1.3,atk:1.2,def:1.5,spd:9,range:'melee'},sentinel:{name:'Sentinel',uid:'armoredskel',hue:120,hp:1.8,atk:1.4,def:1.9,spd:8,range:'melee',traits:['shieldAllies']},
  sandorc:{name:'Sand Orc',uid:'orc',hue:40,hp:1.2,atk:1.2,def:0.8,spd:9,range:'melee'},
  slimeking:{name:'The Slime King',uid:'slime',scale:4,mech:{summon:[{at:0.5,id:'slime',n:2}]},hp:5.0,atk:1.3,def:0.5,spd:6,range:'melee',boss:true},
  alphawolf:{name:'The Alpha',uid:'werewolf',scale:3,mech:{summon:[{at:0.6,id:'werewolf',n:2}],howl:0.3},hp:5.5,atk:1.6,def:0.7,spd:10,range:'melee',boss:true},
  warlord:{name:'Orc Warlord',uid:'eliteorc',scale:3,mech:{charge:true,shieldAllies:true,summon:[{at:0.5,id:'orc',n:2}]},hp:6.0,atk:1.7,def:1.2,spd:8,range:'melee',boss:true},
};
const ZONES=[
  {name:'Greenhollow Fields',lv:1,fights:24,pool:['slime','bat','orc'],boss:'slimeking',scene:'hills',recruit:'vex'},
  {name:'Stillwater Lagoon',lv:8,fights:30,pool:['skeleton','marshbat','werewolf','bogslime'],boss:'alphawolf',scene:'lagoon',recruit:'morrow'},
  {name:'Thornwood',lv:14,fights:30,pool:['werewolf','orc','werebear','direwolf'],boss:'oldgrowth',scene:'forest'},
  {name:'Ironvein Caverns',lv:20,fights:36,pool:['armoredorc','skelarcher','eliteorc','cavetroll','frostbat'],boss:'warlord',scene:'cave',recruit:'wren'},
  {name:'Emberwaste',lv:27,fights:36,pool:['orcrider','eliteorc','skeleton','sandorc'],boss:'sandtyrant',scene:'desert'},
  {name:'Amberfall Woods',lv:34,fights:36,pool:['werebear','skelarcher','werewolf'],boss:'hunterking',scene:'lightforest',recruit:'bram'},
  {name:'Ashen Approach',lv:42,fights:36,pool:['armoredskel','greatskel','skelarcher'],boss:'graveknight',scene:'sunset'},
  {name:'Ashen Keep',lv:50,fights:36,pool:['armoredskel','greatskel','eliteorc'],boss:'necromancer',scene:'door'},
  {name:'The Foundry',lv:60,fights:36,pool:['ironhusk','sentinel','scoutdroid','warddroid'],boss:'core',scene:'tech'},
  {name:'The Endless Road',lv:70,fights:1e9,pool:['slime'],boss:null,scene:'hills',endless:true},
];
function endSeg(p){return Math.floor(p/30)%(ZONES.length-1);}
function zoneScene(Z,p){return Z.endless?ZONES[endSeg(p)].scene:Z.scene;}
function endlessLv(Z,p){return Z.lv+Math.floor(p*0.15);}
function bossZone(){const Z=ZONES[G.zone];return Z.endless?ZONES[endSeg(G.prog[G.zone]||0)]:Z;}
function endlessMilestone(p){return p>0&&p%100===0;}
function padZones(){while(G.prog.length<ZONES.length)G.prog.push(0);while(G.cleared.length<ZONES.length)G.cleared.push(false);G.far=G.far||[];while(G.far.length<ZONES.length)G.far.push(0);}
const WEAPON_ADJ=['Iron','Jade','Mithril','Amethyst','Sunforged','Crystal'],WEAPON_NOUN={sword:'Blade',staff:'Staff',dagger:'Daggers',bow:'Bow',axe:'Axe'};
const CAPE_NAMES=['Wool Cape','Verdant Cape','Mariner Cape','Royal Cape','Sunforged Cape','Crystal Mantle'],CHARM_NAMES=['Iron Band','Jade Ring','Moon Amulet','Amethyst Ring','Sun Amulet','Crystal Heart'];
const QUESTS=[{id:'forage',name:'Forage',dur:30*60,desc:'Gold',reward:'gold'},{id:'hunt',name:'Hunt',dur:2*3600,desc:'Ore, maybe gear',reward:'ore'},{id:'scout',name:'Scout',dur:4*3600,desc:'A gear chest',reward:'gear'},{id:'pilgrim',name:'Pilgrimage',dur:8*3600,desc:'Crystal dust',reward:'dust'}];
const TREE=[
  {branch:'Party',id:'hp',name:'Vigor',desc:'+4% max HP per rank',max:999,base:80,cur:'gold'},
  {branch:'Party',id:'atk',name:'Might',desc:'+4% attack per rank',max:999,base:100,cur:'gold'},
  {branch:'Party',id:'abil',name:'Focus',desc:'+2% ability power per rank',max:30,base:150,cur:'gold'},
  {branch:'Tap',id:'tap',name:'Strike',desc:'+20% tap damage per rank',max:999,base:40,cur:'gold'},
  {branch:'Tap',id:'tapcharge',name:'Momentum',desc:'Taps charge abilities +1 per rank',max:5,base:300,cur:'gold'},
  {branch:'Camp',id:'slots',name:'Bunks',desc:'+1 quest slot per rank',max:3,base:400,cur:'gold'},
  {branch:'Party',id:'march',name:'Long Stride',desc:'+4% march speed per rank',max:999,base:60,cur:'gold'},
  {branch:'Party',id:'rest',name:'Warm Fire',desc:'+2% healing after each fight',max:999,base:90,cur:'gold'},
  {branch:'Camp',id:'quest',name:'Provisions',desc:'+6% quest rewards per rank',max:999,base:200,cur:'gold'},
  {branch:'Party',id:'spd',name:'Quickstep',desc:'+2% action speed per rank',max:25,base:900,cur:'gold'},
  {branch:'Party',id:'regen',name:'Second Wind',desc:'Heroes heal 1% HP each round per rank',max:10,base:400,cur:'gold'},
  {branch:'Party',id:'front',name:'Vanguard',desc:'+5% defense for the front hero per rank',max:999,base:160,cur:'gold'},
  {branch:'Party',id:'def',name:'Bulwark',desc:'+4% defense per rank',max:999,base:120,cur:'gold'},
  {branch:'Party',id:'crit',name:'Keen Edge',desc:'+1% critical chance for every hero',max:40,base:250,cur:'gold'},
  {branch:'Tap',id:'tapcrit',name:'Sharp Taps',desc:'+2% chance a tap deals triple damage',max:25,base:120,cur:'gold'},
  {branch:'Tap',id:'tapgold',name:'Pickpocket',desc:'Taps steal 0.5% of an enemy\'s bounty per rank',max:20,base:300,cur:'gold'},
  {branch:'Tap',id:'tapsurge',name:'Resonance',desc:'Taps charge the Crystal Surge',max:5,base:600,cur:'gold'},
  {branch:'Camp',id:'keys',name:'Locksmith',desc:'Catacomb keys return 8% faster per rank',max:10,base:500,cur:'gold'},
  {branch:'Camp',id:'haggle',name:'Haggling',desc:'Villagers cost 3% less to hire per rank',max:20,base:250,cur:'gold'},
  {branch:'Camp',id:'swift',name:'Swift Return',desc:'Quests finish 3% sooner per rank',max:20,base:350,cur:'gold'},
  {branch:'Camp',id:'ore',name:'Prospecting',desc:'+5% ore from every source',max:999,base:150,cur:'gold'},
  {branch:'Camp',id:'offline',name:'Night Watch',desc:'+30 min offline cap (8h base, 12h max)',max:8,base:800,cur:'gold'},
  {branch:'Crystal',id:'b_hp',name:'Crystal Vigor',desc:'+10% max HP for every hero',max:99,base:4,cur:'dust'},
  {branch:'Crystal',id:'b_ab',name:'Attuned',desc:'+5% ability power',max:20,base:5,cur:'dust'},
  {branch:'Crystal',id:'b_crit',name:'Crystal Edge',desc:'+2% critical chance',max:25,base:6,cur:'dust'},
  {branch:'Crystal',id:'b_ore',name:'Deep Veins',desc:'+15% ore from every source',max:99,base:3,cur:'dust'},
  {branch:'Crystal',id:'b_dust',name:'Crystal Memory',desc:'+5% dust from every Reforge',max:20,base:8,cur:'dust'},
  {branch:'Crystal',id:'b_keys',name:'Deeper Halls',desc:'+1 catacomb key held',max:3,base:12,cur:'dust'},
  {branch:'Crystal',id:'b_surge',name:'Resonant Heart',desc:'Crystal Surge charges 10% faster',max:10,base:5,cur:'dust'},
  {branch:'Crystal',id:'b_gold',name:'Gilded Road',desc:'+15% gold from every source',max:99,base:3,cur:'dust'},
  {branch:'Crystal',id:'b_xp',name:'Old Wisdom',desc:'+15% experience',max:99,base:3,cur:'dust'},
  {branch:'Crystal',id:'b_dmg',name:'Sharpened Fate',desc:'+8% damage dealt',max:99,base:4,cur:'dust'},
  {branch:'Crystal',id:'b_start',name:'Remembered Strength',desc:'Heroes start each run 5 levels higher',max:10,base:6,cur:'dust'},
];
const xpNeed=l=>R(30*Math.pow(l,1.6)*Math.pow(1.03,l));
const treeLv=id=>G.tree[id]||0;
const TALENTS={
  knight:[{id:'ironguard',name:'Iron Guard',desc:'Shield Wall also shields the hero behind'},{id:'riposte',name:'Riposte',desc:'While shielded, 20% chance to counter each hit'},{id:'unbroken',name:'Unbroken',desc:'Once per fight, survive a killing blow at 1 HP'}],
  cleric:[{id:'mending',name:'Mending',desc:'Basic attacks heal the weakest ally 5%'},{id:'echo',name:'Divine Echo',desc:'Sanctuary heals again next turn at 15%'},{id:'lastrites',name:'Last Rites',desc:'Revived allies act immediately'}],
  rogue:[{id:'quickdraw',name:'Quickdraw',desc:'Start every fight with 30% ability charge'},{id:'executioner',name:'Executioner',desc:'Shadowstep +50% vs enemies under 30% HP'},{id:'poison',name:'Poisoned Steel',desc:'Critical hits poison the target'}],
  mage:[{id:'burn',name:'Arcane Burn',desc:'Spells make the target take 20% more damage'},{id:'stars',name:'Falling Stars',desc:'Meteor adds three small follow-up impacts'},{id:'overflow',name:'Overflow',desc:'Kills refund 20% ability charge'}],
  ranger:[{id:'pierce',name:'Piercing Shot',desc:'Attacks have a 50% chance to hit a second enemy'},{id:'mark',name:"Hunter's Mark",desc:'Each hit on the same enemy adds 5% damage, up to 50%'},{id:'deadeye',name:'Deadeye',desc:'15% crit chance against bleeding enemies'}],
  berserker:[{id:'frenzy',name:'Blood Frenzy',desc:'Kills extend Rage by two turns'},{id:'defiant',name:'Defiant Rage',desc:'Rage no longer increases damage taken below 30% HP'},{id:'warcry',name:'Warcry',desc:'Rage also gives the party +20% attack for three turns'}]};
function talentReq(i){return{lvl:[15,45,90][i],gold:R([800,6000,40000][i]*Math.pow(2,G.reforges||0))};}
function buyTalent(h,i){h.talents=h.talents||{};const t=TALENTS[h.cls][i],q=talentReq(i);if(h.talents[t.id]){toast(t.name+': '+t.desc);return;}if(h.lvl<q.lvl){toast(t.name+' needs Lv '+q.lvl+': '+t.desc);return;}if(G.gold<q.gold){toast(t.name+' costs '+fmtNum(q.gold)+' gold: '+t.desc);return;}G.gold-=q.gold;h.talents[t.id]=true;sfx('level',true);toast(h.name+' learns '+t.name,C.goldL);}
const TIERPAL={
  knight:[null,{metal:[201,162,39],accent:210},{metal:[240,236,220],accent:45},{metal:[201,162,39],accent:0}],
  cleric:[null,{cloth:280,accent:45,parts:'mote'},{cloth:200,white:true,accent:190,parts:'mote',wglow:'#ffe9a0',acc:'laurel'},{cloth:200,white:true,accent:45,halo:true,parts:'mote',wglow:'#ffe9a0',acc:'laurel',size:1.08}],
  rogue:[null,{cloth:230,dark:0.7,accent:0,parts:'smoke'},{cloth:275,dark:0.5,accent:280,parts:'smoke',wglow:'#c890ff'},{cloth:275,dark:0.5,accent:280,ghost:true,parts:'smoke',wglow:'#c890ff',size:1.08}],
  mage:[null,{cloth:230,accent:45,parts:'spark'},{cloth:350,dark:0.6,accent:0,parts:'spark',wglow:'#ff80c0'},{cloth:350,dark:0.6,accent:0,parts:'spark',wglow:'#ff80c0',acc:'orbs',size:1.08}],
  ranger:[null,{cloth:120,accent:120,parts:'leaf'},{cloth:210,metal:[200,206,214],accent:210,parts:'leaf',wglow:'#a0e0ff'},{cloth:200,white:true,accent:195,trail:true,parts:'leaf',wglow:'#a0e0ff',acc:'hawk',size:1.08}],
  berserker:[null,{metal:[150,40,40],accent:0,parts:'ember'},{metal:[80,20,20],accent:0,size:1.15,parts:'ember',wglow:'#ff6a3c'},{metal:[80,20,20],accent:0,size:1.25,aura:true,parts:'ember',wglow:'#ff6a3c'}]};
function headRow(u){const A=ATLAS[u.uid];if(A.headRow!=null)return A.headRow;const im=IMG[u.uid];if(!im||!im.width)return 0;const c=document.createElement('canvas');c.width=A.cw;c.height=A.ch;const x=c.getContext('2d');x.drawImage(im,0,A.anims.idle.row*A.ch,A.cw,A.ch,0,0,A.cw,A.ch);const d=x.getImageData(0,0,A.cw,A.ch).data;let r=0;const c0=Math.max(0,A.ox-4),c1=Math.min(A.cw-1,A.ox+4);outer:for(;r<A.ch;r++){for(let i=c0;i<=c1;i++)if(d[(r*A.cw+i)*4+3]>0)break outer;}A.headRow=Math.min(r,A.ch-1);return A.headRow;}
function drawTierExtras(u,x,y,sc,fx,before){const A=ATLAS[u.uid],top=y-(A.oy-headRow(u))*sc,hx=x+2,seed=(G.active.indexOf(u)+1)*1.37;
  if(before)return;
  if(fx.parts){const P={ember:['#ff8a3c','#ffd070'],leaf:['#7cc850','#c8a850'],spark:['#d080ff','#ffffff'],mote:['#fff0b0','#ffd88a'],smoke:['#8a80a0','#5a5070']}[fx.parts];const n=fx.parts==='smoke'?3:4;
    for(let k=0;k<n;k++){const ph=((RT*(fx.parts==='smoke'?0.35:0.6)+k*0.29+seed)%1);const sw=Math.sin(RT*3+k*2.1+seed)*5;let px0,py0;
      if(fx.parts==='leaf'){px0=x-10+k*6+sw;py0=top-4+ph*(y-top+6);}else{px0=x-8+k*5+sw;py0=y-2-ph*(y-top+10);}
      ctx.globalAlpha=(fx.parts==='leaf'?1-ph*0.6:1-ph)*0.9;px(R(px0),R(py0),fx.parts==='smoke'?3:2,2,P[k%2]);}
    ctx.globalAlpha=1;}
  if(fx.wglow&&G.mode==='battle'){const wy=y-12*sc/US;const g=ctx.createRadialGradient(x+10,wy,1,x+10,wy,8);g.addColorStop(0,fx.wglow);g.addColorStop(1,'rgba(0,0,0,0)');ctx.globalAlpha=0.35+0.25*Math.sin(RT*5+seed);ctx.fillStyle=g;ctx.fillRect(x+2,wy-8,16,16);ctx.globalAlpha=1;
    if(u.anim==='attack'){ctx.strokeStyle=fx.wglow;ctx.lineWidth=1.5;ctx.globalAlpha=0.8;ctx.beginPath();ctx.moveTo(x+6,wy-2);ctx.lineTo(x+26,wy-6);ctx.stroke();ctx.globalAlpha=1;}}
  if(!u.enemy&&(sup(u,'amulet')||sup(u,'ring'))){const a=RT*2.4+seed;const gx=hx+Math.cos(a)*9,gy=top+3+Math.sin(a)*2;ctx.globalAlpha=0.6+0.4*Math.sin(RT*6+seed);px(R(gx),R(gy),2,2,'#bff0ff');px(R(gx)-1,R(gy),1,2,'#4fc3f7');px(R(gx)+2,R(gy),1,2,'#4fc3f7');ctx.globalAlpha=1;}
  if(fx.acc==='horns'){const c1='#e8d8b0';px(hx-8,top+1,2,3,c1);px(hx-9,top-1,2,2,c1);px(hx+5,top+1,2,3,c1);px(hx+6,top-1,2,2,c1);}
  else if(fx.acc==='laurel'){ctx.fillStyle='#e6c25a';for(let k=0;k<5;k++){const a=Math.PI*(0.15+k*0.175);px(R(hx-1+Math.cos(a)*7),R(top+6-Math.sin(a)*6),2,1);}}
  else if(fx.acc==='orbs'){for(let k=0;k<3;k++){const a=RT*2+k*2.094;const ox=hx+Math.cos(a)*10,oy=top+4+Math.sin(a)*3;const g=ctx.createRadialGradient(ox,oy,0.5,ox,oy,4);g.addColorStop(0,'rgba(255,170,230,0.95)');g.addColorStop(1,'rgba(255,120,200,0)');ctx.fillStyle=g;ctx.fillRect(ox-4,oy-4,8,8);}}
  else if(fx.acc==='hawk'){const a=RT*1.6+seed;const bx=R(hx+Math.cos(a)*14),by=R(top-8+Math.sin(a*2)*2);const fl=Math.sin(RT*12)>0?1:0;px(bx-1,by,3,1,'#3a2c20');px(bx-3,by-fl,2,1,'#3a2c20');px(bx+2,by-fl,2,1,'#3a2c20');}
}
function heroUid(h){if(h.cls==='knight'){const t=h.tier||0;return t>=3?'lancer':t>=1?'templar':'knight';}return h.cls;}
function tierFx(h){return (TIERPAL[h.cls]||[])[Math.min(3,h.tier||0)]||{};}
const TITLES={knight:['Knight','Paladin','Crusader','Warden'],cleric:['Cleric','Bishop','Oracle','Saint'],rogue:['Rogue','Assassin','Shadow','Phantom'],mage:['Mage','Archmage','Sorcerer','Magus'],ranger:['Ranger','Marksman','Sharpshot','Windwalker'],berserker:['Berserker','Warlord','Titan','Juggernaut']};
function heroTitle(h){return (TITLES[h.cls]||[CLASSES[h.cls].name])[Math.min(3,h.tier||0)];}
function promoteReq(h){const t=h.tier||0;return{lvl:30*(t+1),gold:R(5000*Math.pow(12,t)),dust:5*(t+1)};}
function promoteHero(h){const t=h.tier||0;if(t>=3){toast(h.name+' is already a '+heroTitle(h));return;}const q=promoteReq(h);if(h.lvl<q.lvl){toast('Reach Lv '+q.lvl+' first');return;}if(G.gold<q.gold||G.dust<q.dust){toast('Needs '+fmtNum(q.gold)+' gold and '+q.dust+' dust');return;}G.gold-=q.gold;G.dust-=q.dust;h.tier=t+1;h.uid=heroUid(h);refreshStats(h);h.hp=h.maxhp;sfx('level',true);levelBurst(h);banner(h.name+' becomes a '+heroTitle(h),'+30% to every stat, ability power up',3,'any');}
function heroStats(h){const c=CLASSES[h.cls],L=h.lvl-1,tm=Math.pow(1.3,h.tier||0);let hp=(c.hp+c.ghp*L)*tm,atk=(c.atk+c.gatk*L)*tm,def=(c.def+c.gdef*L)*tm;
  const eq=h.eq||{};if(eq.weapon)atk+=itemStat(eq.weapon);if(eq.cape)def+=itemStat(eq.cape);if(eq.charm)hp+=itemStat(eq.charm);
  const rn=renownStat();hp*=(1+0.04*treeLv('hp'))*(1+0.1*treeLv('b_hp'))*rn;atk*=(1+0.04*treeLv('atk'))*rn;def*=(1+0.04*treeLv('def'))*rn;return{maxhp:R(hp),atk:R(atk),def:R(def),spd:c.spd};}
function enemyStats(id,L){const e=ENEMIES[id];const rf=Math.pow(1.25,G.reforges||0)*(G.zone===0&&!G.delve?0.62:1);return{maxhp:R((44+24*L)*Math.pow(1.06,L)*e.hp*rf),atk:R((9+3.8*L)*Math.pow(1.05,L)*e.atk*rf),def:R((2+1.3*L)*Math.pow(1.04,L)*e.def*Math.pow(1.1,G.reforges||0)),spd:e.spd};}
// items
let itemSeq=1;
function itemStat(it){const rf=1+0.1*(G.reforges||0),base=it.slot==='weapon'?6:it.slot==='cape'?3:12;return R(base*Math.pow(2.2,it.rank)*Math.pow(1.10,it.lvl)*rf);}
function itemName(it){if(it.super&&SUPER[it.super])return SUPER[it.super].name;if(it.slot==='weapon')return WEAPON_ADJ[it.rank]+' '+WEAPON_NOUN[it.kind];if(it.slot==='cape')return CAPE_NAMES[it.rank];return CHARM_NAMES[it.rank];}
function itemIcon(it){return it.slot==='weapon'?it.kind:it.slot==='cape'?'cape':(it.rank%2?'amulet':'ring');}
function itemStatLabel(it){return (it.slot==='weapon'?'+'+fmtNum(itemStat(it))+' ATK':it.slot==='cape'?'+'+fmtNum(itemStat(it))+' DEF':'+'+fmtNum(itemStat(it))+' HP');}
function wielders(it){return Object.values(CLASSES).filter(c=>c.weapon===it.kind).map(c=>c.name).join('/');}
function ascendCost(it){return R(40*Math.pow(4,it.rank)*Math.pow(1.14,it.lvl));}
function ascendCap(){return Math.min(4,1+(G.reforges||0));}
function ascendItem(it,h){if(it.rank>=4){toast(it.rank>=5?'Nothing surpasses Crystal':'Already Sunforged');return;}if(it.rank>=ascendCap()){toast(RANKS[it.rank+1]+' needs '+(it.rank+1-(G.reforges||0))+' more Reforge'+(it.rank-(G.reforges||0)?'s':''));return;}const c=ascendCost(it);if(G.ore<c){toast('Need '+fmtNum(c)+' ore');return;}G.ore-=c;it.rank++;if(h)refreshStats(h);sfx('level',true);toast(itemName(it)+' - ascended to '+RANKS[it.rank],RANKHEX[it.rank]);}
function upgradeCost(it){return R(3*Math.pow(2.2,it.rank)*Math.pow(1.14,it.lvl)*(built('forge')?0.85:1));}
const DROP_TABLE=[[80,20,0,0,0],[55,35,10,0,0],[45,40,15,0,0],[35,40,20,5,0],[30,38,24,8,0],[25,36,27,10,2],[20,35,30,12,3],[15,32,32,16,5],[10,28,34,20,8]];
function rollRank(zoneIdx,shift=0){shift+=Math.min(2,Math.floor((G.reforges||0)/2));const t=DROP_TABLE[Math.min(zoneIdx,DROP_TABLE.length-1)];const cap=t.reduce((m,w,i)=>w>0?i:m,0);let r=rand()*100,rank=0;for(let i=0;i<5;i++){r-=t[i];if(r<=0){rank=i;break;}}return Math.min(cap,rank+shift);}
function makeItem(zoneIdx,forceRank){zoneIdx=Math.min(zoneIdx,ZONES.length-2);const slot=['weapon','cape','charm'][Math.floor(rand()*3)];
  let rank=forceRank==='boss'?rollRank(zoneIdx,1):forceRank;if(rank==null)rank=rollRank(zoneIdx);
  const kinds=[...new Set(G.roster.map(h=>CLASSES[h.cls].weapon))];
  return{id:itemSeq++,slot,rank,lvl:0,kind:kinds[Math.floor(rand()*kinds.length)],isNew:true};}

// ============================================================ sprites & variants
const ATLAS=ASSETS.atlas,IMG={},SCENES={};
function loadAll(){const ps=[];const cap=p=>Promise.race([p,new Promise(r=>setTimeout(r,8000))]);for(const k of ['logo','roadIcon','tab_heroes','tab_gear','tab_vael','tab_tree','superGear','superGear24'])if(ASSETS[k]){const im=new Image();ps.push(cap(new Promise(res=>{im.onload=res;im.onerror=res;})));im.src=ASSETS[k];IMG[k]=im;}
  for(const [k,v] of Object.entries(ATLAS))ps.push(cap(new Promise(res=>{const im=new Image();im.onload=res;im.onerror=res;im.src=v.src;IMG[k]=im;})));
  for(const [k,layers] of Object.entries(ASSETS.scenes)){SCENES[k]=layers.map(l=>{const im=new Image();ps.push(cap(new Promise(res=>{im.onload=res;im.onerror=res;})));im.src=l.src;return{img:im,p:l.p};});}
  return Promise.all(ps);}
function rgb2hsv(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360;}return[h,mx?d/mx:0,mx];}
function hsv2rgb(h,s,v){const c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c;let r,g,b;if(h<60)[r,g,b]=[c,x,0];else if(h<120)[r,g,b]=[x,c,0];else if(h<180)[r,g,b]=[0,c,x];else if(h<240)[r,g,b]=[0,x,c];else if(h<300)[r,g,b]=[x,0,c];else[r,g,b]=[c,0,x];return[R((r+m)*255),R((g+m)*255),R((b+m)*255)];}
function classify(r,g,b,a){if(!a)return'none';const[h,s,v]=rgb2hsv(r,g,b);if(v<0.14)return'outline';if(s<0.22)return v>0.8?'bright':'metal';if((h<18||h>335)&&s>0.45)return'accent';if(h>=170&&h<=220&&s>0.4)return'cyan';return'other';}
const WTINT=[null,[130,0.55,1.0],[210,0.6,1.0],[285,0.55,1.0],[45,0.85,1.0],[200,0.85,1.15]];
const CAPES=[null,{col:[150,150,160],dark:[100,100,110],w:4,len:0.75},{col:[60,120,70],dark:[38,80,46],w:5,len:0.9},{col:[50,90,170],dark:[30,58,120],w:6,len:1.05},{col:[120,50,150],dark:[80,30,100],w:7,len:1.2},{col:[220,170,40],dark:[160,115,20],w:8,len:1.35},{col:[90,205,255],dark:[35,115,210],w:8,len:1.35}];
const variantCache={};
function heroSprite(h){const wr=h.eq&&h.eq.weapon?h.eq.weapon.rank+1:0;let cr=h.eq&&h.eq.cape?h.eq.cape.rank+1:0;const tier=Math.min(3,h.tier||0);const key=h.uid+'|'+wr+'|'+cr+'|t'+tier;
  if(variantCache[key])return variantCache[key];
  const A=ATLAS[h.uid],base=IMG[h.uid];const c=document.createElement('canvas');c.width=base.width||A.cw;c.height=base.height||A.ch;const x=c.getContext('2d');x.drawImage(base,0,0);
  const TPL=tier?(TIERPAL[h.cls]||[])[tier]:null;
  if(TPL){const id=x.getImageData(0,0,c.width,c.height),d=id.data;for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const cl=classify(d[i],d[i+1],d[i+2],d[i+3]);let[hh,ss,vv]=rgb2hsv(d[i],d[i+1],d[i+2]);let nr=null;
      if(cl==='cloth'&&TPL.cloth!=null){if(TPL.white){ss*=0.15;vv=Math.min(1,vv*1.25);}if(TPL.dark)vv*=TPL.dark;nr=hsv2rgb(TPL.cloth,ss,vv);}
      else if(cl==='accent'&&TPL.accent!=null){nr=hsv2rgb(TPL.accent,Math.max(ss,0.5),vv);}
      else if(cl==='metal'&&TPL.metal){const[th,ts]=rgb2hsv(TPL.metal[0],TPL.metal[1],TPL.metal[2]);nr=hsv2rgb(th,ts*0.8,vv);}
      if(nr){d[i]=nr[0];d[i+1]=nr[1];d[i+2]=nr[2];}}x.putImageData(id,0,0);}
  if(wr>1||cr>0){
    const wc=CLASSES[h.cls].wclass,tint=WTINT[Math.min(5,wr-1)];
    const rows=Object.keys(A.anims).length,cols=c.width/A.cw;
    for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){
      const id=x.getImageData(q*A.cw,r*A.ch,A.cw,A.ch),d=id.data,cw=A.cw,ch=A.ch;
      if(wr>1&&tint){for(let i=0;i<d.length;i+=4){if(classify(d[i],d[i+1],d[i+2],d[i+3])!==wc)continue;const[hh,ss,vv]=rgb2hsv(d[i],d[i+1],d[i+2]);const[nr,ng,nb]=tint[0]==null?hsv2rgb(hh,ss,Math.min(1,vv*tint[2])):hsv2rgb(tint[0],tint[1],Math.min(1,vv*tint[2]));d[i]=nr;d[i+1]=ng;d[i+2]=nb;}}
      if(cr>0){const cp=CAPES[cr],mounted=h.uid==='lancer';let x0=cw,y0=ch,x1=0,y1=0;for(let yy=0;yy<ch;yy++)for(let xx=0;xx<cw;xx++)if(d[(yy*cw+xx)*4+3]){if(xx<x0)x0=xx;if(yy<y0)y0=yy;if(xx>x1)x1=xx;if(yy>y1)y1=yy;}
        if(x1>=x0){const feet=A.oy,sh=mounted?feet-26:feet-15,hip=mounted?Math.min(feet-15,sh+R(cp.len*12)):Math.min(feet-3,sh+R(cp.len*14));const cape=new Set();const n=hip-sh;const wmax=mounted?cp.w:Math.min(cp.w,Math.max(3,Math.floor((y1-y0)*0.4)));let anchor=-1;if(mounted){const ay=Math.min(ch-1,sh+2);for(let xx=Math.max(0,A.ox-15);xx<cw;xx++)if(d[(ay*cw+xx)*4+3]){anchor=xx;break;}}
          for(let yy=sh;yy<hip;yy++){if(yy<0||yy>=ch)continue;let left=-1;for(let xx=Math.max(0,A.ox-15);xx<cw;xx++)if(d[(yy*cw+xx)*4+3]){left=xx;break;}if(left<0)continue;const w=1+R((wmax-1)*((yy-sh)/Math.max(1,n-1)));
            for(let k=1;k<=w;k++){const X=left-k;if(X>=0&&!d[(yy*cw+X)*4+3])cape.add(yy*cw+X);}}
          for(const i of cape){const yy=Math.floor(i/cw),xx=i%cw;const edge=!cape.has(i+1)&&xx+1<cw&&d[(i+1)*4+3];const col=edge?cp.dark:cp.col;d[i*4]=col[0];d[i*4+1]=col[1];d[i*4+2]=col[2];d[i*4+3]=255;}
          for(const i of cape){const yy=Math.floor(i/cw),xx=i%cw;for(const[dx,dy]of[[-1,0],[0,1],[0,-1],[1,0]]){const nx=xx+dx,ny=yy+dy;if(nx<0||ny<0||nx>=cw||ny>=ch)continue;const j=ny*cw+nx;if(!d[j*4+3]&&!cape.has(j)){d[j*4]=26;d[j*4+1]=20;d[j*4+2]=32;d[j*4+3]=255;}}}}}
      x.putImageData(id,q*A.cw,r*A.ch);}
  }
  variantCache[key]=c;return c;}
function setAnim(u,name,loop=true,fps=10){if(u.anim===name&&loop&&u.loop)return;u.anim=name;u.frame=0;u.ftime=0;u.loop=loop;u.fps=fps;u.done=false;}
function stepAnim(u,dt){const a=ATLAS[u.uid].anims[u.anim];u.ftime+=dt;while(u.ftime>=1/u.fps){u.ftime-=1/u.fps;if(u.frame<a.n-1)u.frame++;else if(u.loop)u.frame=0;else u.done=true;}}
function enemySprite(u){const t=u.tier||0,hue=u.hue||0;if(!t&&!hue)return IMG[u.uid];const key=u.uid+'|tier'+t+'|h'+hue;if(variantCache[key])return variantCache[key];const base=IMG[u.uid],c=document.createElement('canvas');c.width=base.width;c.height=base.height;const x=c.getContext('2d');x.drawImage(base,0,0);
  const id=x.getImageData(0,0,c.width,c.height),d=id.data,shift=hue+(t===1?40:t===2?95:0),vb=t===2?1.1:1.0;for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const cl=classify(d[i],d[i+1],d[i+2],d[i+3]);if(cl==='outline')continue;const[h,s2,v]=rgb2hsv(d[i],d[i+1],d[i+2]);if(s2<0.15)continue;const[nr,ng,nb]=hsv2rgb((h+shift)%360,Math.min(1,s2*1.1),Math.min(1,v*vb));d[i]=nr;d[i+1]=ng;d[i+2]=nb;}x.putImageData(id,0,0);variantCache[key]=c;return c;}
function unitImg(u){return u.enemy?enemySprite(u):heroSprite(u);}
function drawSprite(u,x,y,frame,anim,flip,scale=1){const A=ATLAS[u.uid],a=A.anims[anim];ctx.save();if(flip){ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);}
  ctx.drawImage(unitImg(u),frame*A.cw,a.row*A.ch,A.cw,A.ch,x-A.ox*scale,y-A.oy*scale,A.cw*scale,A.ch*scale);ctx.restore();}
function drawUnit(u){const x=R(u.x+u.dx),y=R(GROUND+(u.yoff||0)+(u.fly?-10:0)-(u.hop?R(Math.sin(Math.PI*u.hop)*6):0));
  const fx=u.enemy?{}:tierFx(u);const sc=u.native?(u.nscale||1):((u.scale&&u.scale>1)?u.scale:US*(fx.size||1));ctx.fillStyle='rgba(0,0,0,0.28)';ctx.beginPath();ctx.ellipse(x,GROUND+(u.yoff||0)+1,9*sc,2.5*sc,0,0,Math.PI*2);ctx.fill();
  if(fx.aura){const g=ctx.createRadialGradient(x,y-12*sc,2,x,y-12*sc,22*sc);g.addColorStop(0,'rgba(255,120,60,0.35)');g.addColorStop(1,'rgba(255,120,60,0)');ctx.fillStyle=g;ctx.fillRect(x-22*sc,y-34*sc,44*sc,44*sc);}
  if(fx.orb){const g=ctx.createRadialGradient(x+8,y-24,1,x+8,y-24,10);g.addColorStop(0,'rgba(255,120,120,0.6)');g.addColorStop(1,'rgba(255,120,120,0)');ctx.fillStyle=g;ctx.fillRect(x-2,y-34,20,20);}
  if(!u.enemy&&!u.dead)drawTierExtras(u,x,y,sc,fx,true);if(u.dead&&u.done)ctx.globalAlpha=0.55;if(u.flash>0){ctx.globalAlpha=0.6;}if(fx.ghost)ctx.globalAlpha*= (0.75+0.2*Math.sin(RT*7));
  drawSprite(u,x,y,u.frame,u.anim,u.flip,sc);ctx.globalAlpha=1;if(!u.enemy&&!u.dead)drawTierExtras(u,x,y,sc,fx,false);
  if(fx.halo){ctx.strokeStyle='rgba(255,240,180,'+(0.6+0.3*Math.sin(RT*3))+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y-30*sc/US,7,2.5,0,0,Math.PI*2);ctx.stroke();}
  if(fx.trail&&G.mode==='battle'){for(let k=0;k<3;k++){px(x-14-k*4+R(Math.sin(RT*6+k)*2),y-16+k*3,3,1,'rgba(180,220,255,0.6)');}}
  if(u.status&&u.status.shield>0){ctx.strokeStyle='rgba(241,215,120,0.8)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y-12,14,16,0,0,Math.PI*2);ctx.stroke();}
  if(u.status&&u.status.rage>0){ctx.fillStyle='rgba(220,60,40,0.25)';ctx.beginPath();ctx.ellipse(x,y-12,12,15,0,0,Math.PI*2);ctx.fill();}}
function attackFps(n){return Math.max(13,Math.min(20,n*1.45));}

// ============================================================ state
const G={screen:'road',zone:0,prog:[0,0,0,0,0,0,0,0,0],cleared:[false,false,false,false,false,false,false,false,false],gold:0,ore:0,dust:0,roster:[],active:[],pack:[],tree:{},quests:[],mode:'walk',enc:3,enemies:[],projs:[],floats:[],banner:null,scroll:0,t:0,action:null,timer:0,shake:0,parts:[],run:{start:now(),fights:0,bosses:0,gold:0,bestFloor:0},card:null,stats:{kills:0,bosses:0,hit:0,gold:0,ore:0,items:0,legendary:0,hordes:0,offline:0,defeats:0,delveRuns:0,taps:0},autoUntil:0,autoCast:false,music:true,title:true,speed:1,speedUntil:0,mult:1,autoSalvage:0,surge:0,musicVol:0.55,sfxVol:1,wins:0,fast:false,sheet:null,gearHero:0,toast:null,selItem:null,campfireDone:false};
function mkHero(def){const h={def,id:def.id,name:def.name,cls:def.cls,uid:def.cls,range:CLASSES[def.cls].range,lvl:1,xp:0,x:0,dx:0,yoff:0,flip:false,hop:0,gauge:rand()*50,dead:false,charge:0,abLvl:1,eq:{},status:{},readyT:0};Object.assign(h,heroStats(h));h.hp=h.maxhp;setAnim(h,'walk');return h;}
function addHero(def,lvl=1){const h=mkHero(def);h.lvl=lvl;Object.assign(h,heroStats(h));h.hp=h.maxhp;G.roster.push(h);if(G.active.length<4){h.x=-30;G.active.push(h);layout();}return h;}
padZones();const US=1.5;const HERO_X=[24,60,96,132],ENEMY_X=[192,224,254],ENEMY_Y=[0,-3,3];
const RECRUIT_HINT=['','Sera · at the first campfire','Vex · shard of Greenhollow','Morrow · shard of Stillwater'];
function layout(){G.active.forEach((h,i)=>{h.tx=HERO_X[3-i];if(h.x==null||isNaN(h.x))h.x=h.tx;});}
function refreshStats(h){const f=h.hp/h.maxhp;Object.assign(h,heroStats(h));h.hp=R(clamp(f,0,1)*h.maxhp);}
addHero(HEROES[0]);

// ============================================================ helpers: floats, banners, toasts
function float(x,y,t,color=C.cream,big=false,life=1.1){G.floats.push({x,y,text:t,color,life,big});}
function levelBurst(h){sfx('level');float(h.x,GROUND-42,'Lv '+h.lvl+'!',C.goldL,true,1.8);for(let k=0;k<18;k++){const a=rand()*Math.PI*2,sp=20+rand()*40;G.parts.push({x:h.x+(rand()*8-4),y:GROUND-14,vx:Math.cos(a)*sp,vy:-Math.abs(Math.sin(a))*sp-20,life:0.7+rand()*0.6,col:[C.goldL,C.gold,'#fff','#8fd4ff'][k%4]});}}
function banner(t,sub='',dur=2.4,scope='road'){G.banner={text:t,sub,t:0,dur,scope};}
function toast(t,col,scope){G.toast={text:t,t:0,col,scope};}
function living(list){return list.filter(u=>!u.dead);}
function frontHero(){return living(G.active)[0];}
function rankCost(h){let c=80*(1+h.lvl*0.05);for(let k=1;k<(h.abLvl||1);k++)c*=1.9*(1+0.05*Math.max(0,k-8));return R(c);}
function abilityPower(h){const r=h.abLvl||1;const base=0.45+0.75*(1-Math.pow(0.9,r-1));const bonus=1+Math.min(0.6,0.02*treeLv('abil'))+Math.min(1.0,0.05*treeLv('b_ab'))+0.15*(h.tier||0)+(built('library')?0.15:0);return base*bonus;}
function shieldDur(h){return Math.min(6,3+Math.floor((h.abLvl||1)/8));}
function rageMult(h){return 1.5+0.5*Math.min(1,abilityPower(h));}
function rageDur(h){return Math.min(8,4+Math.floor((h.abLvl||1)/3));}
function f1(x){return (Math.round(x*10)/10).toString();}
function drawAbilityNums(h,x,y,parts){const nums=(abilityDesc(h).match(/[\d.]+%|\b\d+ turns?/g)||[]);let cy=y;for(const line of parts){let idx=0;for(const n of nums){const at=line.indexOf(n,idx);if(at<0)continue;idx=at+n.length;const px0=x+textW(line.slice(0,at),'xs');text(px0,cy,n,'xsb',C.cream);}cy+=9;}}
function abilityDesc(h){const r=h.abLvl,p=abilityPower(h);switch(CLASSES[h.cls].ab.id){
  case 'shieldwall':return 'Draws all attacks for '+shieldDur(h)+' turns, taking '+f1(shieldPct(h)*100)+'% less damage.';
  case 'sanctuary':return 'Heals the party '+f1(Math.min(80,30*p))+'% and revives the fallen at '+f1(Math.min(60,25*p))+'%.';
  case 'shadowstep':return 'Three strikes at '+f1(90*p)+'% each; the last always crits.';
  case 'meteor':return 'Hits every enemy for '+f1(180*p)+'% damage.';
  case 'rain':return 'Hits every enemy for '+f1(110*p)+'% and bleeds them '+(3+Math.floor(r/2))+' turns.';
  case 'rage':return 'Attack x'+f1(rageMult(h))+' for '+rageDur(h)+' turns, heals 5% of damage dealt; takes 30% more.';}}
function shieldPct(h){return Math.min(0.75,0.15+0.5*(1-Math.pow(0.93,(h.abLvl||1)-1))+Math.min(0.1,0.005*treeLv('abil')));}

// ============================================================ battle
function spawnEncounter(){G.fs={dmg:0,taps:0,gold:0};
  const Z=ZONES[G.zone],p=G.prog[G.zone];const bossFight=!!(Z.boss&&p===Z.fights-1&&!G.cleared[G.zone])||(Z.endless&&endlessMilestone(p));const BZ=bossZone();const cpS=Z.fights/3,elite=!bossFight&&!G.cleared[G.zone]&&(p===2*cpS||(Z.endless&&p>0&&p%25===0&&!endlessMilestone(p)));
  const n=(bossFight||elite)?1:1+Math.floor(rand()*Math.min(3,1+p/3));G.enemies=[];
  const pool=Z.endless?ZONES[endSeg(p)].pool:Z.pool,etier=Math.min(2,Z.endless?Math.floor(p/50):Math.floor(p/(Z.fights/3)));for(let i=0;i<n;i++){const id=bossFight?BZ.boss:pool[Math.floor(rand()*pool.length)];const L=Z.endless?endlessLv(Z,p):R(Z.lv+p*0.3+(G.cleared[G.zone]?3:0));
    const E=ENEMIES[id];const e={uid:E.uid||id,id,name:E.name+(bossFight?'':['',' Veteran',' Elder'][etier]),lvl:L,x:W+40+i*36,slot:bossFight?(E.native?226:200+8*(E.scale||1)):ENEMY_X[i],dx:0,yoff:bossFight?0:ENEMY_Y[i],flip:true,fly:!!E.fly,range:E.range,boss:!!E.boss,scale:E.scale||1,native:!!E.native,nscale:E.nscale||1,hue:E.hue||0,tier:bossFight?0:etier,gauge:rand()*40,dead:false,enemy:true,status:{},flash:0};
    Object.assign(e,enemyStats(id,L));e.traits=(E.traits||[]).slice();e.mech=E.mech?JSON.parse(JSON.stringify(E.mech)):null;e.acts=0;if(elite){e.name='Elite '+E.name;e.maxhp=R(e.maxhp*3);e.atk=R(e.atk*1.4);e.scale=Math.max(e.scale,2);e.slot=224;if(!e.traits.includes('charge'))e.traits.push('charge');e.elite=true;}
    if(bossFight&&e.mech&&e.mech.charge)e.traits.push('charge');e.hp=e.maxhp;setAnim(e,'walk');G.enemies.push(e);}
  for(const h of G.active){h.unbrokenUsed=false;h.marks=0;if(h.talents&&h.talents.quickdraw)h.charge=Math.max(h.charge,30);}for(const e of G.enemies)e.marks=0;
  G.mode='enter';G.bossFight=bossFight;G.active.forEach(h=>setAnim(h,'idle'));if(bossFight)banner(ENEMIES[BZ.boss].name,Z.endless?'guards milestone '+(p/100):'holds '+(3+G.zone)+' prisoners',2.5);else if(elite)banner(G.enemies[0].name,'blocks the road',2.2);
}
function bossCheck(e){const m=e.mech;if(!m)return;const r=e.hp/e.maxhp;
  if(m.summon)for(const sm of m.summon){if(!sm.done&&r<sm.at){sm.done=true;summonAdds(e,sm.id,sm.n);}}
  if(m.howl&&!m.howled&&r<m.howl){m.howled=true;e.spd=R(e.spd*1.4);float(e.x,GROUND-60,'HOWL!','#ff8a80',true);sfx('cast');}
  if(m.enrage&&!e.enraged&&r<m.enrage){enrage(e);}}
function enrage(e){e.enraged=true;e.atk=R(e.atk*1.5);float(e.x,GROUND-60,'ENRAGED','#ff5050',true);sfx('crit');G.shake=0.3;}
function summonAdds(e,id,n){const L=e.lvl;let k=0;for(let i=0;i<3&&k<n;i++){if(G.enemies.filter(x=>!x.dead).length>=4)break;const E=ENEMIES[id];const a={uid:E.uid||id,id,name:E.name,lvl:Math.max(1,L-2),x:W+40+i*30,slot:ENEMY_X[i]-20,dx:0,yoff:ENEMY_Y[i],flip:true,fly:!!E.fly,range:E.range,boss:false,scale:1,native:!!E.native,nscale:E.nscale||1,hue:E.hue||0,tier:0,gauge:rand()*30,dead:false,enemy:true,status:{},flash:0,traits:(E.traits||[]).slice(),acts:0};Object.assign(a,enemyStats(id,a.lvl));a.hp=a.maxhp;setAnim(a,'walk');G.enemies.push(a);k++;}float(e.x,GROUND-60,'summons',C.cream,true);sfx('cast');}
function dmgColor(d,crit){return d>=1e9?'#e1bee7':d>=1e6?'#ff6a6a':d>=1e3?'#ffa040':crit?C.goldL:C.cream;}
function dealDamage(src,tgt,mult=1,opts={}){
  let atk=src.atk;if(src.status&&src.status.rage>0)atk*=(src.enemy?2:rageMult(src));if(src.status&&src.status.cry>0)atk*=1.2;if(!src.enemy&&src.talents&&src.talents.deadeye&&tgt.status&&tgt.status.bleed>0&&rand()<0.15)opts={...opts,crit:true};
  let dmg=atk*(0.85+rand()*0.3)*mult*(src.enemy?1:bless('dmg'))-tgt.def*0.5*(tgt===frontHero()?1.15+0.05*treeLv('front'):1);const c=CLASSES[src.cls];let crit=opts.crit||false;
  if(!crit&&c&&rand()<(c.crit||0)+0.01*treeLv('crit')+0.02*treeLv('b_crit')+(built('range')?0.05:0))crit=true;if(crit)dmg*=1.6;
  const preShield=dmg;if(tgt.status&&tgt.status.shield>0)dmg*=(1-(tgt.status.shieldPct||0.3));if(tgt.status&&tgt.status.shield>0&&!tgt.enemy&&src.enemy&&sup(tgt,'sword')){const refl=R((preShield-dmg)*0.2);if(refl>0){src.hp=Math.max(1,src.hp-refl);float(src.x+src.dx,GROUND+(src.yoff||0)-36,fmtNum(refl),'#7fd4ff');}}if(tgt.status&&tgt.status.ward>0)dmg*=0.7;if(tgt.status&&tgt.status.rage>0&&!(tgt.talents&&tgt.talents.defiant&&tgt.hp<tgt.maxhp*0.3)&&!sup(tgt,'axe'))dmg*=(tgt.enemy?1.5:1.3);if(tgt.status&&tgt.status.burn>0)dmg*=1.2;
  if(G.delve&&!src.enemy){const bs=G.delve.relics.find(r=>r.bleed);if(bs){src.hp=Math.max(1,src.hp-R(src.maxhp*bs.bleed));}if(crit){const ft=G.delve.relics.find(r=>r.feather);if(ft)src.charge=Math.min(100,src.charge+ft.feather);}}
  dmg=Math.max(1,R(dmg));if(!tgt.enemy&&tgt.talents&&tgt.talents.unbroken&&!tgt.unbrokenUsed&&tgt.hp-dmg<=0){dmg=tgt.hp-1;tgt.unbrokenUsed=true;float(tgt.x,GROUND-44,'Unbroken!',C.goldL,true);}tgt.hp-=dmg;if(!src.enemy&&src.status&&src.status.rage>0&&!src.dead)src.hp=Math.min(src.maxhp,src.hp+dmg*0.05);sfx(crit?'crit':'hit');if(!src.enemy&&G.fs){G.fs.dmg+=dmg;G.stats.hit=Math.max(G.stats.hit||0,dmg);}if(src.enemy&&G.fs){G.fs.taken=G.fs.taken||{};G.fs.taken[src.name]=(G.fs.taken[src.name]||0)+dmg;G.fs.takenT=G.fs.takenT||{};G.fs.takenT[src.range]=(G.fs.takenT[src.range]||0)+dmg;}
  if(src.enemy&&!tgt.dead&&tgt.talents&&tgt.talents.riposte&&tgt.status.shield>0&&rand()<0.2){src.hp-=R(tgt.atk*0.8);float(src.x+src.dx,GROUND-40,'riposte '+fmtNum(R(tgt.atk*0.8)),C.goldL);if(src.hp<=0){src.hp=0;src.dead=true;setAnim(src,'death',false,8);killReward(src);}}
  if(src.enemy&&!tgt.dead){const tr=src.traits||[];if(tr.includes('poison')&&rand()<0.35){tgt.status.poison=3;float(tgt.x,GROUND-46,'poisoned','#7ad07a');}if(tr.includes('stun')&&rand()<0.15&&!tgt.status.stun){tgt.status.stun=1;float(tgt.x,GROUND-46,'stunned','#f4d35e');}if(src.mech&&src.mech.drain&&tgt.charge>0){tgt.charge=Math.max(0,tgt.charge-25);float(tgt.x,GROUND-46,'drained','#b06cff');}}
  if(!src.enemy&&tgt.enemy&&!tgt.dead){if(src.talents&&src.talents.burn&&(opts.spell)){tgt.status.burn=3;}if(src.talents&&src.talents.mark){tgt.marks=(tgt.marks||0)+1;}if(src.talents&&src.talents.poison&&crit){tgt.status.poison=3;}}
  if(tgt.enemy&&!tgt.dead)bossCheck(tgt);if(G.delve&&!src.enemy){const lr=G.delve.relics.find(r=>r.leech);if(lr){src.hp=Math.min(src.maxhp,src.hp+R(dmg*lr.leech));}}
  float(tgt.x+tgt.dx+(rand()*10-5),GROUND+(tgt.yoff||0)-30,crit?fmtNum(dmg)+'!':fmtNum(dmg),src.enemy?'#ff8a80':dmgColor(dmg,crit),crit||dmg>=1e6);
  if(tgt.hp<=0){tgt.hp=0;tgt.dead=true;tgt.status={};setAnim(tgt,'death',false,8);if(tgt.enemy){killReward(tgt);if(!src.enemy&&src.talents){if(src.talents.frenzy&&src.status.rage>0)src.status.rage+=2;if(src.talents.overflow)src.charge=Math.min(100,src.charge+20);}}}
  else if(!(G.action&&G.action.u===tgt)&&!opts.noHurt)setAnim(tgt,'hurt',false,10);
  return dmg;}
function killReward(e){G.stats.kills++;if(e.boss)G.stats.bosses++;G.surge=Math.min(100,(G.surge||0)+2.5*(1+0.1*treeLv('b_surge'))*(built('workshop')?1.5:1));sfx('death');setTimeout(()=>sfx('coin'),120);const xp=R((6+e.lvl*3+(e.boss?60:0))*Math.pow(1.04,e.lvl)*bless('xp')),gold=R((3+e.lvl*2+(e.boss?80:0))*Math.pow(1.05,e.lvl)*bless('gold')*refMult());G.gold+=gold;G.run.gold+=gold;G.stats.gold+=gold;if(G.fs)G.fs.gold+=gold;float(e.x+e.dx,GROUND+(e.yoff||0)-40,'+'+fmtNum(gold)+' gold',C.goldL);
  for(const h of G.active){if(h.dead)continue;h.xp+=xp;while(h.xp>=xpNeed(h.lvl)){h.xp-=xpNeed(h.lvl);h.lvl++;refreshStats(h);h.hp=h.maxhp;h.dead=false;levelBurst(h);}}
  if(rand()<0.35){const o=R((1+Math.floor(rand()*2))*(1+Math.floor(e.lvl/6))*(1+0.05*treeLv('ore'))*bless('ore')*refMult());G.ore+=o;float(e.x+e.dx,GROUND+(e.yoff||0)-50,'+'+fmtNum(o)+' ore',C.muted);}}
function heal(src,tgt,amt){amt=R(amt);sfx('heal');tgt.hp=Math.min(tgt.maxhp,tgt.hp+amt);float(tgt.x+tgt.dx,GROUND-30,'+'+fmtNum(amt),'#8ff0a0');}
function pickTarget(u){const foes=living(u.enemy?G.active:G.enemies);if(!foes.length)return null;
  if(u.enemy){const shield=foes.find(h=>h.status.shield>0);if(shield)return shield;const f=frontHero();return rand()<0.6?f:foes[Math.floor(rand()*foes.length)];}
  return foes.slice().sort((a,b)=>a.hp-b.hp)[0];}
function chooseAction(u){
  const foes=living(u.enemy?G.active:G.enemies),allies=living(u.enemy?G.enemies:G.active);if(!foes.length)return null;
  const n=ATLAS[u.uid].anims.attack.n,fps=attackFps(n),hit=Math.floor(n*0.5);
  if(u.status.stun>0){u.status.stun--;float(u.x+u.dx,GROUND-40,'stunned',C.goldL);return{u,kind:'skip',anim:'hurt',fps:10,hit:99};}
  if(u.enemy){u.acts=(u.acts||0)+1;const tr=u.traits||[];
    if(u.mech&&u.mech.raise&&u.acts%3===0){const corpse=G.enemies.find(x=>x.dead&&!x.boss&&!x.raised);if(corpse){corpse.raised=true;corpse.dead=false;corpse.hp=R(corpse.maxhp*0.4);setAnim(corpse,'idle');float(corpse.x,GROUND-40,'raised','#b06cff');return{u,kind:'skip',anim:'attack',fps,hit:99};}}
    if(tr.includes('shieldAllies')&&u.acts%3===0&&allies.length>1){for(const a of allies)if(a!==u){a.status.ward=3;}float(u.x+u.dx,GROUND-40,'wards allies','#7fd4ff');return{u,kind:'skip',anim:'attack',fps,hit:99};}
    if(tr.includes('charge')&&u.acts%3===0){const tgt=pickTarget(u);const kind=u.range==='ranged'||u.range==='aoe'?'chargeR':'chargeM';return{u,kind,tgt,tgts:foes,anim:'attack',fps,hit,phase:'tele',pt:0,tele:2.0,name:u.range==='melee'?'Cleave':'Volley'};}}
  if(!u.enemy&&(u.tapCast||(u.charge>=100&&autoOn()&&u.readyT>=0.4))){return abilityAction(u,!!u.tapCast);}
  if(u.range==='heal')return{u,kind:'bolt',tgt:pickTarget(u),anim:'attack',fps,hit};
  const tgt=pickTarget(u);
  if(u.range==='aoe')return{u,kind:'aoe',tgts:foes,anim:'attack',fps,hit};
  if(u.range==='ranged')return{u,kind:'ranged',tgt,anim:'attack',fps,hit};
  return{u,kind:'melee',tgt,anim:'attack',fps,hit,phase:'dash',pt:0};}
function abilityAction(u,tapped){const c=CLASSES[u.cls],id=c.ab.id;const pow=abilityPower(u)*(tapped?1.3:1);u.charge=0;u.readyT=0;u.tapCast=false;
  const anim=id==='sanctuary'?'heal':'attack';const n=ATLAS[u.uid].anims[anim].n;sfx('cast');
  float(u.x,GROUND-48,c.ab.name+(tapped?'!':''),C.goldL,true,1.5);
  return{u,kind:'ability',ab:id,pow,anim,fps:attackFps(n),hit:Math.floor(n*0.5),tgts:living(G.enemies),tgt:pickTarget(u),hits:0,phase:'dash',pt:0};}
function startAction(a){G.action=a;a.hitDone=false;a.pt=0;if(a.kind!=='melee'&&!(a.kind==='ability'&&(a.ab==='shadowstep')))setAnim(a.u,a.anim,false,a.fps);}
function endAction(){const a=G.action,u=a.u;G.action=null;u.dx=0;if(!u.dead)setAnim(u,'idle');
  if(u.status.poison>0){u.status.poison--;const pd=R(u.maxhp*0.03);u.hp-=pd;float(u.x+u.dx,GROUND-26,'-'+fmtNum(pd),'#7ad07a');if(u.hp<=0){u.hp=0;u.dead=true;u.status={};setAnim(u,'death',false,8);if(u.enemy)killReward(u);}}
  if(u.status.ward>0)u.status.ward--;if(u.status.burn>0)u.status.burn--;if(u.status.cry>0)u.status.cry--;if(u.echo>0){u.echo--;if(u.echo===0){for(const h of living(G.active))heal(u,h,h.maxhp*0.15);float(u.x,GROUND-44,'Divine Echo',C.goldL);}}
  if(!u.enemy&&a.kind!=='ability'){u.charge=Math.min(100,u.charge+4);}
  for(const s of ['shield','rage']){if(u.status[s]>0)u.status[s]--;}if(!u.enemy&&treeLv('regen')&&!u.dead){G.roundTick=(G.roundTick||0)+1;if(G.roundTick>=living(G.active).length){G.roundTick=0;for(const a2 of living(G.active)){const rg=R(a2.maxhp*0.01*treeLv('regen'));if(rg>0&&a2.hp<a2.maxhp)a2.hp=Math.min(a2.maxhp,a2.hp+rg);}}}}
function applyAbility(a){const u=a.u,pow=a.pow;
  switch(a.ab){
    case 'shieldwall':u.status.shield=shieldDur(u)+1;u.status.shieldPct=shieldPct(u);if(u.talents&&u.talents.ironguard){const i=G.active.indexOf(u),b=G.active[i+1];if(b&&!b.dead){b.status.shield=shieldDur(u)+1;b.status.shieldPct=shieldPct(u)*0.6;}}break;
    case 'sanctuary':for(const h of G.active){if(h.dead){h.dead=false;h.hp=R(h.maxhp*Math.min(0.6,0.25*pow));setAnim(h,'idle');float(h.x,GROUND-30,'Revived','#8ff0a0');if(u.talents&&u.talents.lastrites)h.gauge=100;}else heal(u,h,h.maxhp*Math.min(0.8,0.3*pow));}if(u.talents&&u.talents.echo)u.echo=2;break;
    case 'meteor':G.shake=0.4;for(const t of a.tgts)if(!t.dead){dealDamage(u,t,1.8*pow,{spell:true});if(u.talents&&u.talents.stars)for(let k=0;k<3;k++)if(!t.dead)dealDamage(u,t,0.3*pow,{spell:true,noHurt:true});}break;
    case 'rain':for(const t of a.tgts)if(!t.dead){dealDamage(u,t,1.1*pow);t.status.bleed=(3+Math.floor(u.abLvl/2))*(sup(u,'bow')?2:1);}break;
    case 'rage':u.status.rage=rageDur(u);if(u.talents&&u.talents.warcry)for(const h of living(G.active))if(h!==u)h.status.cry=3;break;
  }}
function updateAction(dt){const a=G.action,u=a.u;
  if(a.kind==='skip'){if(u.done)endAction();return;}
  if(a.phase==='tele'){a.pt+=dt;if(a.pt>=a.tele){a.phase=a.kind==='chargeM'?'dash':'fire';a.pt=0;if(a.phase==='fire')setAnim(u,'attack',false,a.fps);}return;}
  if(a.kind==='chargeR'){if(!a.hitDone&&u.frame>=a.hit){a.hitDone=true;for(const t of (u.range==='aoe'?a.tgts:[a.tgt]))if(t&&!t.dead)dealDamage(u,t,2.2);}if(u.done)endAction();return;}
  if(a.kind==='melee'||a.kind==='chargeM'||(a.kind==='ability'&&a.ab==='shadowstep')){
    const tgt=a.tgt;if(!tgt||tgt.dead&&a.phase==='dash'){endAction();return;}
    const dir=u.enemy?-1:1,dest=(tgt.x+tgt.dx)-dir*(30+(tgt.scale>1?10*(tgt.scale-1):0))-u.x;
    if(a.phase==='dash'){a.pt+=dt/0.11;u.dx=dest*Math.min(1,a.pt);if(a.pt>=1){a.phase='hit';setAnim(u,'attack',false,a.kind==='ability'?16:a.fps);}}
    else if(a.phase==='hit'){if(!a.hitDone&&u.frame>=a.hit){a.hitDone=true;if(!tgt.dead){if(a.kind==='ability'){a.hits++;let m2=0.9*a.pow;if(u.talents&&u.talents.executioner&&tgt.hp<tgt.maxhp*0.3)m2*=1.5;dealDamage(u,tgt,m2,{crit:a.hits===3,noHurt:a.hits<3});if(a.hits===3&&!tgt.dead&&sup(u,'dagger'))tgt.status.bleed=Math.max(tgt.status.bleed||0,3);}else if(a.kind==='chargeM'){dealDamage(u,tgt,2.5);G.shake=0.3;}else{let m3=1;if(!u.enemy&&u.talents&&u.talents.mark)m3*=1+0.05*Math.min(10,tgt.marks||0);dealDamage(u,tgt,m3);}}}
      if(u.done){if(a.kind==='ability'&&a.hits<3&&!tgt.dead){a.hitDone=false;setAnim(u,'attack',false,16);}else{a.phase='back';a.pt=0;a.from=u.dx;}}}
    else{a.pt+=dt/0.11;u.dx=a.from*(1-Math.min(1,a.pt));if(a.pt>=1){u.dx=0;endAction();}}
    return;}
  if(!a.hitDone&&u.frame>=a.hit){a.hitDone=true;
    if(a.kind==='ability')applyAbility(a);
    else if(a.kind==='heal')heal(u,a.tgt,u.atk*2.4);
    else if(a.kind==='aoe'){for(const t of a.tgts)if(!t.dead)G.projs.push(magicProj(u,t,0.7));}
    else if(a.kind==='bolt'){if(a.tgt&&!a.tgt.dead)G.projs.push(magicProj(u,a.tgt,0.8));}
    else if(a.kind==='ranged'){if(a.tgt){const A=ATLAS[u.uid];G.projs.push({x:u.x+u.dx+(u.enemy?-10:10),y:GROUND+(u.yoff||0)-A.oy*0.62,tgt:a.tgt,src:u,t:0,dur:0.28,flip:u.enemy});if(!u.enemy&&u.talents&&u.talents.pierce&&rand()<0.5){const other=living(G.enemies).find(e=>e!==a.tgt);if(other)G.projs.push({x:u.x+u.dx+10,y:GROUND-A.oy*0.62,tgt:other,src:u,t:0,dur:0.32,flip:false,mult:0.6});}}}
    if(!u.enemy&&u.talents&&u.talents.mending&&a.kind!=='ability'){const low=living(G.active).sort((p,q)=>p.hp/p.maxhp-q.hp/q.maxhp)[0];if(low&&low.hp<low.maxhp)heal(u,low,low.maxhp*0.05);}}
  if(u.done)endAction();}
function magicColor(u){if(u.enemy)return'#b06cff';const it=u.eq&&u.eq.weapon;const t=it?WTINT[Math.min(4,it.rank)]:null;if(!t)return u.cls==='cleric'?'#ffe9a8':'#7fd4ff';const[r,g,b]=hsv2rgb(t[0],t[1],1);return`rgb(${r},${g},${b})`;}
function magicProj(u,t,mult){return{x:u.x+u.dx+(u.enemy?-12:12),y:GROUND+(u.yoff||0)-22,tgt:t,src:u,t:0,dur:0.32,flip:u.enemy,magic:true,mult,col:magicColor(u)};}
function updateProjs(dt){for(const p of G.projs){p.t+=dt;if(p.magic&&rand()<0.7){const k=p.t/p.dur,txx=p.tgt.x+p.tgt.dx,x=p.x+(txx-p.x)*k,y=p.y+(GROUND+(p.tgt.yoff||0)-16-p.y)*k;G.parts.push({x,y:y+(rand()*4-2),vx:0,vy:-6,life:0.3,col:p.col});}if(p.t>=p.dur){p.hit=true;if(!p.tgt.dead){let m=p.mult||1;if(!p.src.enemy&&p.src.talents&&p.src.talents.mark)m*=1+0.05*Math.min(10,p.tgt.marks||0);dealDamage(p.src,p.tgt,m,{spell:!!p.magic});}}}G.projs=G.projs.filter(p=>!p.hit);}
function drawProjs(){const P=ATLAS._arrow,img=IMG._arrow;for(const p of G.projs){const k=p.t/p.dur,txx=p.tgt.x+p.tgt.dx;
  if(p.magic){const x=p.x+(txx-p.x)*k,y=p.y+(GROUND+(p.tgt.yoff||0)-16-p.y)*k;ctx.globalAlpha=0.5;px(R(x)-3,R(y)-3,6,6,p.col);ctx.globalAlpha=1;px(R(x)-2,R(y)-2,4,4,p.col);px(R(x)-1,R(y)-1,2,2,'#fff');continue;}
  const tyy=GROUND+(p.tgt.yoff||0)-ATLAS[p.tgt.uid].oy*0.6;const x=p.x+(txx-p.x)*k,y=p.y+(tyy-p.y)*k-Math.sin(k*Math.PI)*8;const vx=(txx-p.x),vy=(tyy-p.y)-Math.cos(k*Math.PI)*Math.PI*8;let ang=Math.atan2(vy,vx);if(p.flip)ang=Math.PI-ang;ctx.save();ctx.translate(R(x),R(y));if(p.flip)ctx.scale(-1,1);ctx.rotate(ang);ctx.drawImage(img,-P.w/2,-P.h/2);ctx.restore();}}
function castSurge(){if(G.surge<100)return;if(G.mode!=='battle'){toast('Save it for a fight - it strikes every enemy');return;}G.surge=0;G.shake=0.5;sfx('level');sfx('cast');const atk=G.active.reduce((s2,h)=>s2+h.atk,0);banner('Crystal Surge','Party restored · every enemy struck for '+fmtNum(atk*2.5),3.2);
  for(const h of G.active){h.dead=false;h.hp=h.maxhp;h.status={};if(h.anim==='death')setAnim(h,'idle');}
  for(const e of living(G.enemies)){const d=R(atk*2.5*(0.9+rand()*0.2));e.hp-=d;e.flash=0.2;float(e.x+e.dx,GROUND+(e.yoff||0)-40,fmtNum(d),C.goldL,true);G.fs.dmg+=d;if(e.hp<=0){e.hp=0;e.dead=true;setAnim(e,'death',false,8);killReward(e);}}}
function tapDamage(){const avgAtk=G.active.reduce((s2,h)=>s2+h.atk,0)/Math.max(1,G.active.length);return Math.max(1,R(avgAtk*0.3*Math.pow(1.15,treeLv('tap'))*(built('watchtower')?1.1:1)));}
function tapEnemy(e){if(G.mode!=='battle'||e.dead)return;G.stats.taps++;sfx('tap');let d=tapDamage();if(rand()<0.02*treeLv('tapcrit')){d*=3;sfx('crit');}if(treeLv('tapgold')){const g=R((3+e.lvl*2)*Math.pow(1.05,e.lvl)*0.005*treeLv('tapgold')*bless('gold'));if(g>0){G.gold+=g;}}e.hp-=d;e.flash=0.12;float(e.x+e.dx+(rand()*8-4),GROUND+(e.yoff||0)-34,fmtNum(d),C.cyan);G.fs.taps++;G.fs.dmg+=d;
  if(e.hp<=0){e.hp=0;e.dead=true;setAnim(e,'death',false,8);killReward(e);}
  const mom=treeLv('tapcharge');if(mom)for(const h of living(G.active)){h.charge=Math.min(100,h.charge+mom);}if(treeLv('tapsurge'))G.surge=Math.min(100,(G.surge||0)+0.2*treeLv('tapsurge'));}
function endBattle(win){if(G.hordeFight){if(!win){endHordeFight(false);return;}if(G.hordeFight.wave>=3){endHordeFight(true);return;}G.enemies=[];G.mode='delve';setTimeout(()=>{if(G.hordeFight)hordeWave();},700);return;}if(G.delve){if(win)delveWin();else endDelve(true);return;}const Z=ZONES[G.zone];
  if(win){G.wins++;G.losses=0;G.run.fights++;checkUnlocks();if(canReforge()){G.dustFrac=(G.dustFrac||0)+(1+0.25*G.zone+0.5*(G.reforges||0))/150;if(G.dustFrac>=1){const d=Math.floor(G.dustFrac);G.dustFrac-=d;G.dust+=d;}}if(G.bossFight){G.run.bosses++;if(canReforge()){G.dust+=2;}G.castle.bp=G.castle.bp||{};const BZ=bossZone();const sk=Object.keys(STRUCTS).find(k=>STRUCTS[k].boss===BZ.boss);if(sk&&!G.castle.bp[sk]){G.castle.bp[sk]=true;G.pending='Blueprint found|'+STRUCTS[sk].name+' - build it in Vael';G.vaelNew=true;}const bn=ENEMIES[BZ.boss].name,fs=G.fs||{dmg:0,taps:0,gold:0};G.card={title:bn,sub:'falls',lines:['Damage dealt '+fmtNum(fs.dmg)+'  ·  taps '+fs.taps,'Gold '+fmtNum(fs.gold)],t:0};if(Z.endless){const p0=G.prog[G.zone],m=p0/100;G.run.endless=Math.max(G.run.endless||0,p0);if(endlessMilestone(p0)&&m>(G.endMilestone||0)){G.endMilestone=m;for(const h of G.roster)refreshStats(h);const L=endlessLv(Z,p0),dust=3+2*m,gold=R((3+L*2)*Math.pow(1.05,L)*30*bless('gold')*refMult());G.dust+=dust;G.gold+=gold;let gear='',rvIt=null;const sk2=milestoneItem(m);if(sk2&&(SUPER_CAP[sk2]==null||superCount(sk2)<SUPER_CAP[sk2])){const it=makeSuper(sk2);giveItem(it);G.stats.items++;gear=itemName(it)+' (Mythic)';rvIt=it;}else if(G.pack.length<15){const it=makeItem(G.zone,'boss');G.pack.push(it);G.stats.items++;gear=itemName(it);}G.card={title:'Milestone '+m,sub:'Fight '+p0+' on the Endless Road',lines:['+'+dust+' crystal dust  ·  +'+fmtNum(gold)+' gold','+'+fmtNum(G.lastRenown||0)+' renown  ·  '+fmtNum(G.renown||0)+' total, +'+f1((renownStat()-1)*100)+'% stats',gear?'Found: '+gear:'Pack full - no chest'],t:0};banner('Milestone '+m,'the road goes on',3);if(rvIt){G.reveal={it:rvIt,t:0,card:G.card};G.card=null;sfx('level');}}}}
    const dropChance=G.wins<=3?0.5:0.18;if(G.pack.length<15&&(rand()<dropChance||G.bossFight||G.wins===1)){const it=makeItem(G.zone,G.bossFight?'boss':null);if(G.wins===1){it.slot='weapon';it.kind=CLASSES[G.active[0].cls].weapon;it.rank=0;}if(G.autoSalvage&&it.rank<G.autoSalvage&&G.wins>1){const o=(it.rank+1)*4;G.ore+=o;toast('Salvaged '+itemName(it)+' for '+o+' ore',C.muted,'road');}else{G.pack.push(it);G.stats.items++;if(it.rank>=4)G.stats.legendary++;toast('Found: '+itemName(it),RANKHEX[it.rank],'road');if(G.card&&G.bossFight)G.card.lines.push('Loot: '+itemName(it));}}
    const restHeal=0.15+0.02*treeLv('rest');for(const h of G.active){h.status={};if(h.dead){h.dead=false;h.hp=R(h.maxhp*0.3);}else h.hp=Math.min(h.maxhp,h.hp+R(h.maxhp*restHeal));}
    if(Z.endless){const p0=G.prog[G.zone],kind=endlessMilestone(p0)?'milestone':(p0>0&&p0%25===0)?'champion':'fight';const rg=renownGain(p0,kind);G.renown=(G.renown||0)+rg;G.lastRenown=rg;if(kind!=='fight'){float(W/2,GROUND-64,'+'+fmtNum(rg)+' renown','#8fdcff',true);}if(G.wins%10===0)for(const h of G.roster)refreshStats(h);}
    if(!G.cleared[G.zone]){G.prog[G.zone]++;if(Z.endless)G.run.endless=Math.max(G.run.endless||0,G.prog[G.zone]);if(Z.endless&&G.prog[G.zone]%30===0)banner(ZONES[endSeg(G.prog[G.zone])].name,'The road winds on',2.4);G.far=G.far||[];G.far[G.zone]=Math.max(G.far[G.zone]||0,G.prog[G.zone]);{const cs=Z.fights/3,p2=G.prog[G.zone];if(p2%cs===0&&p2<Z.fights){G.cpHint=false;const cn=p2/cs,L2=Z.endless?endlessLv(Z,p2):R(Z.lv+p2*0.3),g2=R((3+L2*2)*Math.pow(1.05,L2)*(5+5*cn)*bless('gold')*refMult());G.gold+=g2;G.card={title:'Checkpoint '+cn+' of 3',sub:'The road behind you is safe',lines:['+'+fmtNum(g2)+' gold',cn===1?'Fall in battle and you return here':cn===2?'A champion blocks the way ahead':'The boss waits at the end of the road'],t:0};}}
      if(G.prog[G.zone]>=Z.fights){G.cleared[G.zone]=true;grantShardVillagers();if(G.zone<ZONES.length-1)G.newZone=true;if(G.zone===3)G.reforgeNew=true;if(G.zone===0&&!G.vaelSeen)G.vaelNew=true;banner('Crystal shard recovered!',G.zone<ZONES.length-1?ZONES[G.zone+1].name+' lies ahead':'The road is whole again',3.5);
        const rdef=HEROES.find(d=>d.id===Z.recruit);if(rdef&&!G.roster.find(h=>h.id===rdef.id)){const h=addHero(rdef,Math.max(1,Z.lv));G.pending=h.name+' the '+CLASSES[h.cls].name+' joins the road';}}}
    if(!G.campfireDone&&G.wins>=2){G.campfireDone=true;const h=addHero(HEROES[1],1);G.pending='Sera the Cleric joins you at the campfire';}
    G.mode='victory';G.timer=1.4;
  }else{const fs=G.fs||{};const taken=fs.taken||{},tt=fs.takenT||{};const top=Object.entries(taken).sort((a,b)=>b[1]-a[1])[0];const tot=Object.values(tt).reduce((a,b)=>a+b,0)||1;const mix=Object.entries(tt).map(([k,v])=>R(100*v/tot)+'% '+(k==='melee'?'melee':'ranged/magic')).join(', ');
    const tips=[];if(!G.active.find(h=>h.cls==='cleric')&&G.roster.find(h=>h.cls==='cleric'))tips.push('Bring Sera - no healer marched');const el=G.enemies[0]?G.enemies[0].lvl:0,avg=R(G.active.reduce((s2,h)=>s2+h.lvl,0)/Math.max(1,G.active.length));if(el>avg+3)tips.push('They are Lv '+el+', you are Lv '+avg);if(G.pack.some(it=>!G.active.some(h=>h.eq[it.slot]&&itemStat(h.eq[it.slot])>=itemStat(it))))tips.push('Better gear sits in your pack');else if((tt.melee||0)>tot*0.6)tips.push('Melee hurt you - upgrade capes');else if((tt.ranged||0)+(tt.aoe||0)>tot*0.6)tips.push('Ranged hurt you - more HP charms');
    G.losses=(G.losses||0)+1;const cs2=ZONES[G.zone].fights/3,atCp=Math.floor(G.prog[G.zone]/cs2);if(G.losses>=3&&!G.cpHinted&&atCp>0){G.cpHinted=true;G.cpHint=true;tips.unshift('Tap an earlier checkpoint on the road to farm it');}
    G.card={title:'Defeated',sub:top?top[0]+' hit hardest ('+fmtNum(top[1])+')':'The party falls',lines:tips.slice(0,2),plain:true,t:0};G.stats.defeats=(G.stats.defeats||0)+1;banner('The party falls','Regrouping at camp…',2.6);G.mode='defeat';G.timer=2.8;}}
function reqReforge(z){return z>=8?3:z>=6?2:z>=4?1:0;}
function zoneUnlocked(z){return z===0||(G.cleared[z-1]&&(G.reforges||0)>=reqReforge(z));}
function bless(k){const lv=treeLv('b_'+k),rf=Math.pow(1.15,G.reforges||0);return k==='gold'?(1+0.15*lv)*rf:k==='xp'?1+0.15*lv:k==='dmg'?1+0.08*lv:k==='ore'?1+0.15*lv:1;}
function renownLog(){return Math.log2(1+(G.renown||0));}
function renownStat(){return 1+0.05*renownLog();}
function renownGold(){return 1+0.02*renownLog();}
function renownGain(p,kind){return R(5*Math.pow(1.02,p)*(kind==='milestone'?100:kind==='champion'?10:1));}
function refMult(){return (1+0.25*(G.reforges||0))*renownGold();}
function reforgeGain(){const cleared=G.cleared.filter(Boolean).length,best=Math.max(...G.roster.map(h=>h.lvl));const r=G.run||{};return R((4+3*cleared+Math.floor(best/10)+2*(G.reforges||0)+Math.floor((r.bosses||0)/3)+Math.floor((r.endless||0)/50))*(1+0.05*treeLv('b_dust')));}
function canReforge(){return G.cleared[3];}
function doReforge(){const gain=reforgeGain();G.dust+=gain;G.reforges=(G.reforges||0)+1;const startLv=1+5*treeLv('b_start');
  G.heroesSeen=[];for(const h of G.roster){h.lvl=startLv;h.xp=0;h.tier=0;h.status={};refreshStats(h);h.hp=h.maxhp;h.dead=false;h.charge=0;h.tapCast=false;}
  let refund=0;const allItems=G.pack.concat(...G.roster.map(h=>Object.values(h.eq||{})));for(const it of allItems){let spent=0;for(let l=0;l<it.lvl;l++)spent+=R(3*Math.pow(2.2,it.rank)*Math.pow(1.14,l));refund+=spent*0.5;it.lvl=0;}
  G.run={start:now(),fights:0,bosses:0,gold:0,bestFloor:0,endless:0};G.endMilestone=0;G.gold=0;G.ore=R(refund);G.prog=ZONES.map(()=>0);G.far=ZONES.map(()=>0);G.cleared=ZONES.map(()=>false);G.zone=0;G.enemies=[];G.projs=[];G.action=null;G.mode='walk';G.enc=4;G.wins=Math.max(G.wins,3);G.newZone=false;
  for(const h of G.active)setAnim(h,'walk');layout();G.screen='road';closeSheet();banner('The Crystal is reforged','+'+gain+' crystal dust · run '+(G.reforges+1),4,'any');saveGame();}
function marchSpeed(){return 28*(1+0.04*treeLv('march'));}

// ============================================================ quests
const QUEST_CLASS={forage:['cleric','mage'],hunt:['berserker','ranger'],scout:['ranger','rogue'],pilgrim:['knight','cleric']};
function questBonus(h,q){return (QUEST_CLASS[q.id].includes(h.cls)?1.3:1)*(1+0.1*(h.tier||0));}
function questEvent(h){const L=h.lvl,ev=[];const gq=()=>R((30+L*8)*refMult());
  ev.push(()=>{const g=R(gq()*0.5);G.gold+=g;return 'Found a hidden cache: +'+fmtNum(g)+' gold';});
  ev.push(()=>{h.xp+=R(xpNeed(h.lvl)*0.25);return 'Learned from the road: +25% of a level';});
  ev.push(()=>{h.hp=Math.max(1,R(h.maxhp*0.3));h.xp+=R(xpNeed(h.lvl)*0.15);return 'Ambushed on the way back: wounded, +15% of a level';});
  if(G.castle.vil.total>0)ev.push(()=>{G.castle.vil.total++;return 'Rescued a traveller who settles in Vael: +1 villager';});
  if(G.delveKeys<keyMax())ev.push(()=>{G.delveKeys++;return 'Brought back a catacomb key';});
  const cls={knight:()=>{const g=R(gq()*0.8);G.gold+=g;return 'Escorted a caravan: +'+fmtNum(g)+' gold';},
    cleric:()=>{G.dust+=1;return 'Blessed a wayside shrine: +1 crystal dust';},
    rogue:()=>{const g=R(gq()*0.7);G.gold+=g;return 'Picked a few pockets: +'+fmtNum(g)+' gold';},
    mage:()=>{h.xp+=R(xpNeed(h.lvl)*0.4);return 'Deciphered old runes: +40% of a level';},
    ranger:()=>{if(G.pack.length<15){G.pack.push(makeItem(G.zone));return 'Tracked a rare beast: gear found';}const o=R((8+L)*1.5);G.ore+=o;return 'Tracked a rare beast: +'+fmtNum(o)+' ore';},
    berserker:()=>{const o=R((8+L)*2);G.ore+=o;h.hp=Math.max(1,R(h.maxhp*0.5));return 'Won a tavern brawl: +'+fmtNum(o)+' ore, a few bruises';}};
  if(cls[h.cls]){ev.push(cls[h.cls]);ev.push(cls[h.cls]);}
  return ev[Math.floor(rand()*ev.length)]();}
function questSlots(){return 3+treeLv('slots');}
function heroStatus(h){if(G.active.includes(h))return'marching';if(G.quests.find(q=>q.hero===h))return'quest';if(G.castle&&G.castle.garrison.includes(h.id))return'garrison';return'camp';}
function questDur(q){return q.dur*(G.fast?1/120:1)*(1-0.03*treeLv('swift'))*(built('kennels')?0.85:1);}
function startQuest(h,qdef){G.quests.push({hero:h,q:qdef,end:now()+questDur(qdef)*1000});toast(h.name+' sets out to '+qdef.name.toLowerCase());}
function collectQuest(q){const mult=(1+0.06*treeLv('quest'))*questBonus(q.hero,q.q)*refMult();const L=q.hero.lvl;let msg='';
  if(q.q.reward==='gold'){const g=R((30+L*8)*mult);G.gold+=g;msg='+'+g+' gold';}
  else if(q.q.reward==='ore'){const o=R((8+L)*mult);G.ore+=o;msg='+'+o+' ore';if(rand()<0.4&&G.pack.length<15){G.pack.push(makeItem(G.zone));msg+=' and gear';}}
  else if(q.q.reward==='gear'){if(G.pack.length<15){const it=makeItem(G.zone,'boss');G.pack.push(it);msg=itemName(it);}else msg='pack full - gear lost';}
  else{const d=R(2*mult);G.dust+=d;msg='+'+d+' crystal dust';}
  q.hero.xp+=R(20*L);G.quests=G.quests.filter(x=>x!==q);const ev=rand()<0.35?questEvent(q.hero):null;if(ev)G.card={title:q.hero.name+' returns',sub:msg,lines:[ev],t:0};toast(q.hero.name+' returns: '+msg+(ev?' · '+ev:''));}
function fmtT(s){s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`:`${m}:${String(sec).padStart(2,'0')}`;}

// ============================================================ gear
function equipBest(only){for(const h of (only?[only]:G.roster)){for(const slot of ['weapon','cape','charm']){const cands=G.pack.filter(it=>it.slot===slot&&(slot!=='weapon'||it.kind===CLASSES[h.cls].weapon));const cur=h.eq[slot];const score=it=>itemStat(it)+it.rank*0.01;const best=cands.sort((a,b)=>score(b)-score(a))[0];
  if(best&&(!cur||score(best)>score(cur))){G.pack=G.pack.filter(i=>i!==best);if(cur)G.pack.push(cur);h.eq[slot]=best;best.isNew=false;}}refreshStats(h);}toast(only?'Best gear on '+only.name:'Best gear equipped');}
function equipItem(h,it){if(it.slot==='weapon'&&it.kind!==CLASSES[h.cls].weapon){toast(h.name+" can't wield a "+WEAPON_NOUN[it.kind].toLowerCase());return;}
  const cur=h.eq[it.slot];G.pack=G.pack.filter(i=>i!==it);if(cur)G.pack.push(cur);h.eq[it.slot]=it;it.isNew=false;refreshStats(h);toast(itemName(it)+' equipped');}
function unequip(h,slot){const it=h.eq[slot];if(!it)return;if(G.pack.length>=15){toast('Pack is full');return;}delete h.eq[slot];G.pack.push(it);refreshStats(h);}
function sellItem(it){const o=(it.rank+1)*4+it.lvl*2;G.pack=G.pack.filter(i=>i!==it);G.ore+=o;toast('Forged into '+o+' ore');}
function upgradeItem(it,h){let n=0,want=G.mult==='max'?1e9:G.mult;while(n<want){const cost=upgradeCost(it);if(G.ore<cost)break;G.ore-=cost;it.lvl++;n++;}if(!n){toast('Need '+upgradeCost(it)+' ore');return;}if(h)refreshStats(h);toast(itemName(it)+' +'+it.lvl+(n>1?' ('+n+' ranks)':''));}
function multLabel(){return G.mult==='max'?'Max':'×'+G.mult;}
function cycleMult(){G.mult=G.mult===1?5:G.mult===5?25:G.mult===25?'max':1;}

// ============================================================ main loop
let last=0;const hits=[];let HIT_DY=0;let HOLD=null;
function hit(x,y,w,h,fn,hold){hits.push({x,y:y+HIT_DY,w,h,fn,hold:!!hold});}
const SCROLL={tree:0,heroes:0,map:0},CONTENT={tree:0,heroes:0,map:0},SCROLLTOP={tree:44,heroes:44,map:48};
function beginScroll(key,top){const sc=SCROLL[key]||0;ctx.save();ctx.beginPath();ctx.rect(0,top,W,TABY-top-TABTOP);ctx.clip();ctx.translate(0,-sc);tx.save();tx.beginPath();tx.rect(0,top*TS,W*TS,(TABY-top-TABTOP)*TS);tx.clip();tx.translate(0,-sc*TS);HIT_DY=-sc;}
function endScroll(key,bottom){ctx.restore();tx.restore();HIT_DY=0;CONTENT[key]=bottom;}
function scrollMax(key,top){const m=(CONTENT[key]||0)-(TABY-8-TABTOP);return m<=10?0:m;}
function update(dt,ui=true){G.t+=dt;if(G.shake>0)G.shake-=dt;
  for(const h of G.active){if(h.tx!=null&&Math.abs(h.x-h.tx)>0.2)h.x+=(h.tx-h.x)*Math.min(1,dt*6);else if(h.tx!=null)h.x=h.tx;h.hop=Math.max(0,h.hop-dt*2.5);if(G.mode==='battle'&&!h.dead&&h.charge<100){h.charge=Math.min(100,h.charge+7*dt*(G.delve&&G.delve.relics.find(r=>r.charge)?2:1)*(sup(h,'staff')?1.25:1));if(h.charge>=100)h.readyT=0;}if(h.charge>=100&&!h.dead)h.readyT+=dt;}
  const all=G.active.concat(G.enemies);
  for(const u of all){stepAnim(u,dt);if(u.flash>0)u.flash-=dt;if(u.done&&u.anim==='hurt'&&!(G.action&&G.action.u===u))setAnim(u,'idle');}
  for(const f of G.floats){f.life-=dt;f.y-=18*dt;}G.floats=G.floats.filter(f=>f.life>0);for(const p of G.parts){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=40*dt;}G.parts=G.parts.filter(p=>p.life>0);
  if(ui&&G.tut==null){if(G.card){G.card.t+=dt;if(G.card.t>=4.2)G.card=null;}if(G.banner){G.banner.t+=dt;if(G.banner.t>=G.banner.dur){G.banner=null;}}
  if(G.booted&&!G.endlessSeen&&ZONES[G.zone]&&ZONES[G.zone].endless&&G.tut==null&&G.mode==='walk'&&G.screen==='road'&&!G.sheet&&!G.title){G.endlessSeen=true;saveGame();G.tut=TUT.length;TUT.push({t:'The Endless Road',s:'This road never ends. It winds through every land again and again, and the enemies keep growing.',box:[4,SCENE_Y+4,166,42],once:true},{t:'Champions and milestones',s:'A champion every 25 fights. A boss every 100. Fall, and you return to the last champion.',box:[4,SCENE_Y+4,166,42],once:true},{t:'Crystal gear and Renown',s:'Beat a milestone boss once for a piece of Crystal gear, the strongest in the game, and Renown. Every fight here earns Renown, and it makes the whole party stronger forever.',icon:'sword',box:[4,SCENE_Y+4,166,42],once:true});}
  if(G.cpHint&&G.tut==null&&G.mode==='walk'&&G.screen==='road'&&!G.sheet){G.cpHint=false;G.tut=TUT.length;TUT.push({t:'Fall back to a checkpoint',s:'The road ahead is too strong for now. Tap an earlier dot to return to that checkpoint and farm it until the party is stronger.',box:[4,SCENE_Y+4,166,42],once:true});}
  if(G.pending&&!G.banner&&G.tut==null){{const[pt,ps]=G.pending.split('|');banner(pt,ps||(pt==='Greenhollow Fields'?'The first shard lies ahead':''),2.6);}G.pending=null;}
  if(G.toast){G.toast.t+=dt;if(G.toast.t>2.2)G.toast=null;}}
  if(G.title||G.tut!=null){return;}
  if(G.mode==='delve'&&G.hordeFight){}else if(G.mode==='delve'){if(G.delve&&G.delve.choose&&ui){G.delve.timer-=dt;if(G.delve.timer<=0)chooseDoor(G.delve.doors[Math.floor(rand()*3)]);}}
  if(!G.delve){G.simT=(G.simT||0)+dt;G.zoneT=G.zoneT||[];G.zoneT[G.zone]=(G.zoneT[G.zone]||0)+dt;}
  if(G.mode==='walk'){G.scroll+=marchSpeed()*dt;G.enc-=dt;G.active.forEach(h=>setAnim(h,'walk'));if(G.enc<=0)spawnEncounter();}
  else if(G.mode==='battle'){for(const e of G.enemies){if(!e.dead&&e.x>e.slot){e.x=Math.max(e.slot,e.x-90*dt);if(e.x<=e.slot&&e.anim==='walk'&&!e.fly)setAnim(e,'idle');}}}
  if(G.mode==='enter'){let all2=true;for(const e of G.enemies){if(e.x>e.slot){e.x=Math.max(e.slot,e.x-70*dt);all2=false;}else if(e.anim==='walk'&&!e.fly)setAnim(e,'idle');}if(all2){G.mode='battle';G.enemies.forEach(e=>setAnim(e,'idle'));}}
  else if(G.mode==='battle'){
    if(G.action)updateAction(dt);updateProjs(dt);
    if(!living(G.enemies).length&&!G.action&&!G.projs.length)return endBattle(true);
    if(!living(G.active).length&&!G.action&&!G.projs.length)return endBattle(false);
    if(!G.action){for(const u of all)if(!u.dead)u.gauge+=u.spd*dt*7*(u.enemy?1:1+0.02*treeLv('spd'));
      let ready=all.filter(u=>!u.dead&&u.gauge>=100).sort((a,b)=>b.gauge-a.gauge)[0];
      const caster=G.active.find(h=>!h.dead&&(h.tapCast||(h.charge>=100&&autoOn()&&h.readyT>=0.4)));if(caster)ready=caster;
      if(ready){if(ready!==caster)ready.gauge=0;const a=chooseAction(ready);if(a){startAction(a);
        for(const e of living(G.enemies))if(e.status.bleed>0&&ready.enemy){e.status.bleed--;e.hp-=R(e.maxhp*0.04);float(e.x,GROUND-26,'bleed','#ff8a80');if(e.hp<=0){e.hp=0;e.dead=true;setAnim(e,'death',false,8);killReward(e);}}}}}
  }else if(G.mode==='victory'){G.timer-=dt;if(G.timer<=0){G.enemies=[];G.mode='walk';G.enc=2.5+rand()*3;if(G.bossFight)G.bossFight=false;}}
  else if(G.mode==='defeat'){G.timer-=dt;if(G.timer<=0){G.enemies=[];G.projs=[];G.action=null;for(const h of G.active){h.dead=false;h.hp=h.maxhp;h.dx=0;h.status={};setAnim(h,'walk');}layout();if(!G.cleared[G.zone]){const Z9=ZONES[G.zone];if(Z9.endless)G.prog[G.zone]=Math.max(0,Math.floor((G.prog[G.zone]-1)/25)*25);else{const cs=Z9.fights/3;G.prog[G.zone]=Math.floor(G.prog[G.zone]/cs)*cs;}}G.mode='walk';G.enc=3;}}
  if(G.castle&&(G.t%1)<dt)castleTick();
  if(ui&&!G.delve&&G.screen==='road'&&G.tut==null){if(G.treasure){G.treasure.t+=dt;if(G.treasure.t>=G.treasure.life)G.treasure=null;}else{G.treasureAt-=dt;if(G.treasureAt<=0&&G.mode==='walk'){spawnTreasure();G.treasureAt=25+rand()*30;}}}
  for(const q of G.quests.slice())if(now()>=q.end&&!q.done){q.done=true;toast(q.hero.name+' is back from the '+q.q.name.toLowerCase());}
}

// ============================================================ drawing: shared chrome
function drawTop(){px(0,0,W,15,'#090b14');px(0,15,W,1,C.goldD);
  icon('coin',6,2,4);icon('ore',68,2,0);icon('crystal',124,2,2);icon('gear',252,2,0);hit(246,0,24,16,()=>openSheet('settings'));
  const left=(G.autoUntil-now())/1000;
  {const glow=boostReady()&&!G.boostSeen,a2=glow?0.55+0.45*Math.sin(RT*2.2):1;px(184,1,62,13,C.out);ctx.globalAlpha=a2;px(185,2,60,11,glow?C.goldL:C.goldD);ctx.globalAlpha=1;px(186,3,58,9,glow?'#4a3c14':C.btnGold);icon('play',187,2,4);text(219,3.5,'Boosts','xs',C.goldL,'center');}hit(184,0,62,15,()=>{G.boostSeen=true;openSheet('ad');});
  text(21,2.5,fmtNum(roll('gold',G.gold)),'num',C.goldL);text(83,2.5,fmtNum(roll('ore',G.ore)),'num',C.cream);text(139,2.5,fmtNum(roll('dust',G.dust)),'num','#bbdefb');}
function drawTabs(){px(0,TABY,W,42,C.out);px(0,TABY,W,1,C.gold);px(0,TABY+1,W,1,C.goldD);
  const tabs=[['party','Heroes','heroes'],['sword','Gear','gear'],['road','Road','road'],['castle','Vael','vael'],['nodes','Tree','tree']];
  tabs.forEach(([ic,label,id],i)=>{const x=i*54,on=G.screen===id||(id==='road'&&G.screen==='map'),lk=tabLocked(id);
    if(id==='road'){const cx=x+27,cy=TABY+8;ctx.fillStyle=on?C.goldL:C.gold;ctx.beginPath();ctx.arc(cx,cy,15,0,Math.PI*2);ctx.fill();ctx.fillStyle=on?'#3c3214':C.navy;ctx.beginPath();ctx.arc(cx,cy,13,0,Math.PI*2);ctx.fill();if(IMG.roadIcon&&IMG.roadIcon.width)tx.drawImage(IMG.roadIcon,(cx-13)*TS,(cy-13)*TS,26*TS,26*TS);else icon('road',cx-6,cy-6,4);if(!on){ctx.globalAlpha=0.5+0.5*Math.sin(RT*5);ctx.strokeStyle='#ff5050';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,17,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}text(cx,TABY+25,label,'sb',on?C.goldL:C.cream,'center');hit(x,TABY-6,54,48,()=>{G.screen='road';G.selItem=null;G.salvage=false;});return;}
    if(on){px(x+2,TABY+3,50,37,C.navy2);px(x+2,TABY+3,50,1,C.goldL);}{const ti=IMG['tab_'+id];if(ti&&ti.width){tx.globalAlpha=lk?0.3:(on?1:0.62);tx.drawImage(ti,(x+27-11)*TS,(TABY+3)*TS,22*TS,22*TS);tx.globalAlpha=1;if(lk)icon('lock',x+30,TABY+4,0);}else if(lk){ctx.globalAlpha=0.35;icon(ic,x+21,TABY+8,0);ctx.globalAlpha=1;icon('lock',x+30,TABY+4,0);}else icon(ic,x+21,TABY+8,on?4:0);}
    if(id==='vael'&&!lk&&!on&&G.tut==null&&(G.cleared[0]||G.reforges>0)&&keysNow()>=keyMax()&&!G.keysSeen){ctx.globalAlpha=0.4+0.4*Math.sin(RT*2);px(x+2,TABY+3,50,1,C.goldL);px(x+2,TABY+39,50,1,C.goldL);ctx.globalAlpha=1;}
    if(id==='tree'&&G.treeNew&&!on){ctx.globalAlpha=0.5+0.5*Math.sin(RT*5);px(x+2,TABY+3,50,1,C.goldL);px(x+2,TABY+39,50,1,C.goldL);px(x+38,TABY+6,4,4,C.goldL);ctx.globalAlpha=1;}
    if(id==='heroes'&&!on&&heroesReady()){ctx.globalAlpha=0.5+0.5*Math.sin(RT*3);px(x+2,TABY+3,50,1,C.goldL);px(x+2,TABY+39,50,1,C.goldL);ctx.globalAlpha=1;}
    if(id==='vael'&&G.vaelNew&&!on){ctx.globalAlpha=0.5+0.5*Math.sin(RT*5);px(x+2,TABY+3,50,1,C.goldL);px(x+2,TABY+39,50,1,C.goldL);px(x+38,TABY+6,4,4,C.goldL);ctx.globalAlpha=1;}text(x+27,TABY+24,label,'sb',lk?C.dimt:(on?C.goldL:C.muted),'center');hit(x,TABY,54,42,()=>{if(lk){toast(lockHint(id));return;}G.screen=id;G.selItem=null;G.salvage=false;if(id==='tree'){G.treeNew=false;G.treeSeen=true;}
      if(id==='heroes')G.heroesSeen=heroUnlocks();
      if(id==='vael'){G.keysSeen=true;}
      if(id==='vael'&&!G.vaelSeen&&(G.vaelNew||G.cleared[0]||G.reforges>0)){G.vaelNew=false;G.vaelSeen=true;saveGame();G.tut=TUT.length;TUT.push({t:'Vael is yours',s:'Build the Mine and Market, then assign villagers to them. They dig ore and trade for gold while you are away.',screen:'vael',box:()=>{const cb=BIG?24:16,avail=TABY-12-TABTOP-VAEL_Y,VCH=Math.max(44,Math.min(64,Math.floor((avail-cb-4-16)/5)));return[4,VAEL_Y+cb+4,262,5*(VCH+4)-4];},once:true},{t:'Walls, hordes and the Catacombs',s:'Raise the Walls and post heroes there to hold off the horde. The Catacombs below are a short dungeon run for one hero.',screen:'vael',box:[0,55,W,115],once:true});}if(id==='vael')G.vaelNew=false;});});}
function heroUnlocks(){const out=[];for(const h of G.roster){const q=promoteReq(h);if((h.tier||0)<3&&h.lvl>=q.lvl)out.push(h.id+':p'+(h.tier||0));TALENTS[h.cls].forEach((t,i)=>{const r=talentReq(i);if(!(h.talents||{})[t.id]&&h.lvl>=r.lvl)out.push(h.id+':t'+t.id);});}return out;}
function heroesReady(){const seen=G.heroesSeen||[];return heroUnlocks().some(k=>!seen.includes(k));}
function autoOn(){return !!G.autoCast&&G.autoUntil>now();}
function boostReady(){return !(G.autoUntil>now())||!(G.speedUntil>now());}
function tabLocked(id){if(G.tut!=null)return false;if(id==='vael')return !G.cleared[0]&&!(G.reforges>0);if(id==='tree')return G.wins<3&&!(G.reforges>0);return false;}
function checkUnlocks(){if(!tabLocked('tree')&&!G.treeSeen&&!G.treeNew){G.treeNew=true;}}
function lockHint(id){return id==='vael'?'Recover the first shard to claim Vael':'Win three fights to open the Tree';}
function drawScene(){const Z=ZONES[G.zone];const key=G.hordeFight?'door':G.delve?(G.delve.floor>=12?'door':'cave'):((G.bossFight&&Z.bossScene)?Z.bossScene:zoneScene(Z,G.prog[G.zone]));const layers=SCENES[key];
  const sx=G.shake>0?R((rand()-0.5)*4):0;ctx.save();ctx.beginPath();ctx.rect(0,SCENE_Y,W,208);ctx.clip();ctx.translate(sx,0);
  for(const l of layers){const w=l.img.width||368;let off=-(Math.floor(G.scroll*l.p)%w);for(let x=off;x<W+w;x+=w)ctx.drawImage(l.img,x,SCENE_Y);}
  if(!G.delve&&G.screen==='road'&&G.tut==null)drawTreasure();
  const units=G.active.concat(G.enemies).slice().sort((a,b)=>(a.yoff||0)-(b.yoff||0));for(const u of units)drawUnit(u);drawProjs();for(const p of G.parts){ctx.globalAlpha=clamp(p.life*1.5,0,1);px(R(p.x),R(p.y),p.life>0.5?2:1,p.life>0.5?2:1,p.col);}ctx.globalAlpha=1;
  if(G.mode==='battle'||G.mode==='enter'){for(const e of G.enemies){if(e.dead)continue;const x=R(e.x+e.dx),bs=e.native?(e.boss?4:1.2):(e.scale>1?e.scale:US),y=GROUND+(e.yoff||0)-(e.fly?44:R(26*bs+6));bar(x-10*bs,y,20*bs,4,e.hp/e.maxhp,C.red,'#1b1b1b');const hs=14*bs;hit(x-hs,GROUND-hs*2.4,hs*2,hs*2.6,()=>tapEnemy(e));}
  }
  for(const h of G.active){if(h.dead)continue;const fighting=G.mode==='battle'||G.mode==='enter';if(!fighting&&h.hp>=h.maxhp)continue;const x=R(h.x+h.dx),y=GROUND-48;bar(x-15,y,30,4,h.hp/h.maxhp,h.hp/h.maxhp>0.35?C.green:C.red,'#1b1b1b');}
  if(G.mode==='battle'||G.mode==='enter'){
    for(const u of G.active.concat(G.enemies)){if(u.dead)continue;const bs=u.native?(u.boss?4:1.2):(u.scale>1?u.scale:US),x=R(u.x+u.dx),y=(u.enemy?GROUND+(u.yoff||0)-(u.fly?44:R(26*bs+6)):GROUND-48)+5;px(x-10*bs,y,20*bs,1,'#141826');px(x-10*bs,y,R(20*bs*clamp(u.gauge/100,0,1)),1,'#8a93a8');
      let ix=x-10*bs;const st=u.status||{};if(st.poison>0){px(ix,y-8,4,4,'#3a8a3a');ix+=6;}if(st.stun>0){px(ix,y-8,4,4,'#f4d35e');ix+=6;}if(st.ward>0){px(ix,y-8,4,4,'#4fa0e0');ix+=6;}if(st.bleed>0){px(ix,y-8,4,4,'#c03030');ix+=6;}if(st.burn>0){px(ix,y-8,4,4,'#ff8a30');ix+=6;}if(u.enraged){px(ix,y-8,4,4,'#ff3030');ix+=6;}
      if(G.action&&G.action.u===u&&G.action.phase==='tele'&&G.action.tele){const a=G.action,f=clamp(a.pt/a.tele,0,1),bw=Math.max(26,20*bs);px(x-bw/2-1,y-16,bw+2,7,'#1a0a0a');px(x-bw/2,y-15,R(bw*f),5,'#ff5050');text(x,y-27,(a.name||'Charging')+' '+Math.max(0,a.tele-a.pt).toFixed(1)+'s','xsb','#ff8a80','center');}}
    for(const u of G.enemies){if(u.enraged&&!u.dead){const x=R(u.x+u.dx);ctx.fillStyle='rgba(255,40,40,0.18)';ctx.beginPath();ctx.ellipse(x,GROUND-14*(u.scale||1),14*(u.scale||1),18*(u.scale||1),0,0,Math.PI*2);ctx.fill();}}}
  ctx.restore();
  if(!G.sheet)for(const f of G.floats){ctx.globalAlpha=1;text(R(f.x),R(f.y),f.text,f.big?'h':'sb',f.color,'center',Math.min(1,f.life*2));}
  if(G.mode==='walk'||G.mode==='victory'){const a=0.35+0.25*Math.sin(RT*3);ctx.globalAlpha=a;px(0,SCENE_Y,W,2,C.goldL);px(0,SCENE_Y+206,W,2,C.goldL);px(0,SCENE_Y,2,208,C.goldL);px(W-2,SCENE_Y,2,208,C.goldL);ctx.globalAlpha=1;text(W-40,SCENE_Y+9,'Marching','xs',C.goldL,'right',0.5+0.5*a);}
  if(G.surge>=100&&!G.delve){const pu=0.6+0.4*Math.sin(RT*5),cx=W/2,cy=SCENE_Y+84;const g=ctx.createRadialGradient(cx,cy,2,cx,cy,34);g.addColorStop(0,'rgba(255,240,180,'+(0.55*pu)+')');g.addColorStop(0.5,'rgba(255,200,80,'+(0.25*pu)+')');g.addColorStop(1,'rgba(255,200,80,0)');ctx.fillStyle=g;ctx.fillRect(cx-34,cy-34,68,68);
    for(let k=0;k<6;k++){const a=RT*1.2+k*Math.PI/3,r1=22+4*Math.sin(RT*3+k);px(R(cx+Math.cos(a)*r1),R(cy+Math.sin(a)*r1),2,2,k%2?C.goldL:'#fff');}
    ctx.strokeStyle='rgba(241,215,120,'+(0.5+0.5*pu)+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,22+2*pu,0,Math.PI*2);ctx.stroke();ctx.fillStyle='rgba(20,16,30,0.55)';ctx.beginPath();ctx.arc(cx,cy,20,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.translate(cx,cy-3);const sc2=2.6+0.3*Math.sin(RT*5);ctx.scale(sc2,sc2);ctx.drawImage(iconImg('crystal',4,1),-6,-6);ctx.restore();text(cx,cy+8,'TAP','xsb',C.goldL,'center');
    text(cx,cy+27,Math.floor(RT/2)%2?'Surge ready - use in a fight':'Crystal Surge','xsb',C.goldL,'center');hit(cx-30,cy-30,60,64,castSurge);}
  const sp=speedNow();{ctx.globalAlpha=0.75;button(W-36,SCENE_Y+4,32,18,sp>1);ctx.globalAlpha=1;text(W-20,SCENE_Y+8.5,sp+'×','sb',sp>1?C.goldL:C.cream,'center');hit(W-36,SCENE_Y+4,32,18,()=>{if(G.speed===1)G.speed=2;else if(G.speed===2){if(G.speedUntil>now())G.speed=4;else openSheet('speedad');}else G.speed=1;});}
  if(G.hordeFight){ctx.globalAlpha=0.8;frame(4,SCENE_Y+4,150,36,'rgba(44,22,26,0.8)');ctx.globalAlpha=1;text(9,SCENE_Y+7,'Horde at the gate','sb','#ff9696');text(9,SCENE_Y+17,'Wave '+G.hordeFight.wave+' of 3 · '+hordeTier(),'xs','#c88080');}else if(G.delve){drawDelveOverlay();}else{
  // zone plate
  ctx.globalAlpha=0.7;frame(4,SCENE_Y+4,166,42,'rgba(22,26,44,0.75)');ctx.globalAlpha=1;const p=Math.min(G.prog[G.zone],Z.fights),cpN=3,cpS=Z.fights/cpN,far=Math.max(p,(G.far||[])[G.zone]||0);
  if(G.newZone||G.reforgeNew){ctx.globalAlpha=0.5+0.5*Math.sin(RT*5);px(4,SCENE_Y+4,166,1,C.goldL);px(4,SCENE_Y+45,166,1,C.goldL);px(4,SCENE_Y+4,1,42,C.goldL);px(169,SCENE_Y+4,1,42,C.goldL);ctx.globalAlpha=1;}
  {const ax=159,ay=SCENE_Y+14,glow=G.newZone||G.reforgeNew;if(glow){ctx.strokeStyle=C.goldL;ctx.lineWidth=1.5;ctx.globalAlpha=0.5+0.5*Math.sin(RT*5);ctx.beginPath();ctx.arc(ax,ay,7,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}text(ax,ay-5.5,'›','sb',glow?C.goldL:C.muted,'center');if(canReforge()){icon('crystal',ax-22,ay-6,2);}}
  text(9,SCENE_Y+7,Z.endless?'Endless · '+ZONES[endSeg(G.prog[G.zone])].name:Z.name,'sb',C.goldL);{const hl=hordeLeft(),due=G.castle.hordeDue;text(9,SCENE_Y+17,due?'Horde at the gate - tap Vael to defend':(hl<900&&(G.castle.b.walls||G.castle.vil.total)?'Horde in '+fmtT(hl)+'  ·  Lv '+Z.lv:(Z.endless?'Fight '+(G.prog[G.zone]+1)+' · Lv '+endlessLv(Z,G.prog[G.zone])+' · best '+Math.max(G.prog[G.zone],(G.far||[])[G.zone]||0)+(G.renown?' · renown '+fmtNum(G.renown):''):'Danger Lv '+Z.lv+(G.cleared[G.zone]?'  ·  Shard recovered':''))),'xs',due?'#ff8a80':(hl<900&&(G.castle.b.walls||G.castle.vil.total)?'#ffb080':C.muted));}hit(4,SCENE_Y+4,166,24,()=>{G.screen='map';G.newZone=false;G.reforgeNew=false;});
  {const lx=14,rx=156,ly=SCENE_Y+35;if(Z.endless){const p9=G.prog[G.zone],nx=25-(p9%25);const nm=100-(p9%100);text(14,ly-4,'Champion in '+nx+'  ·  milestone in '+nm,'xs',C.muted);}else{px(lx,ly,rx-lx,1,'#3a4260');px(lx,ly,R((rx-lx)*far/Z.fights),1,'#5a6488');px(lx,ly,R((rx-lx)*p/Z.fights),1,G.cleared[G.zone]?'#7fd4ff':C.goldL);
    for(let k=0;k<=cpN;k++){const dx=R(lx+(rx-lx)*k/cpN),reached=far>=k*cpS,isBoss=k===cpN;
      if(isBoss){const pu=0.6+0.4*Math.sin(RT*4);ctx.globalAlpha=reached?1:0.6;px(dx-4,ly-4,9,9,'#1a1420');px(dx-3,ly-3,7,7,reached?'#ff5a5a':'#5a3040');px(dx-1,ly-1,3,3,reached?'#ffd0d0':'#7a4050');if(!G.cleared[G.zone]&&p>=Z.fights-1){ctx.globalAlpha=pu;px(dx-6,ly-6,13,1,'#ff5a5a');px(dx-6,ly+6,13,1,'#ff5a5a');px(dx-6,ly-6,1,13,'#ff5a5a');px(dx+6,ly-6,1,13,'#ff5a5a');}ctx.globalAlpha=1;}
      else px(dx-2,ly-2,5,5,reached?C.goldL:'#3a4260');
      const target=k<cpN?k*cpS:Z.fights-1;if(reached&&target!==p)hit(dx-15,ly-14,30,28,()=>{G.cpHint=false;G.prog[G.zone]=target;G.enemies=[];G.projs=[];G.action=null;G.bossFight=false;G.mode='walk';G.enc=2;for(const h of G.active){h.dx=0;h.status={};setAnim(h,'walk');}toast(k<cpN?'Back to checkpoint '+k:'Onward to the boss');});}
    const mx=p>=Z.fights-1?rx:R(lx+(rx-lx)*p/Z.fights);px(mx-1,ly-7,3,3,C.cream);if(far>p){const fx=R(lx+(rx-lx)*far/Z.fights);px(fx-1,ly-6,3,1,'#8a93a8');px(fx-1,ly-4,3,1,'#8a93a8');px(fx-1,ly-6,1,3,'#8a93a8');px(fx+1,ly-6,1,3,'#8a93a8');}}}}
}
function drawCard(){const c=G.card;if(!c||G.screen!=='road'||G.tut!=null)return;const al=clamp(Math.min(c.t*3,(4.2-c.t)*2),0,1);const y0=SCENE_Y+40,h=70+c.lines.length*11;ctx.globalAlpha=al;frame(20,y0,230,h,C.navy,C.goldL);ctx.globalAlpha=1;tx.clearRect(20*TS,y0*TS,230*TS,h*TS);
  text(W/2,y0+8,c.title,'big',c.plain?'#ff9696':C.goldL,'center',al);if(!c.plain){const tw2=textW(c.title,'big');tx.globalAlpha=al;tx.fillStyle=C.goldL;tx.fillRect((W/2-tw2/2)*TS,(y0+23)*TS,tw2*TS,1.5*TS);tx.globalAlpha=1;}text(W/2,y0+28,c.sub,'s',C.cream,'center',al);c.lines.forEach((l,i)=>text(W/2,y0+42+i*11,l,'xs',C.muted,'center',al));text(W/2,y0+h-14,'tap to continue','xs',C.dimt,'center',al);hit(20,y0,230,h,()=>{G.card=null;});}
function drawBanner(){if(G.tut!=null||G.reveal)return;if(G.banner&&(G.banner.scope==='any'||G.screen==='road')){const b=G.banner,al=clamp(Math.min(b.t*3,(b.dur-b.t)*2),0,1),by=G.screen==='vael'?92:SCENE_Y+120;ctx.globalAlpha=al*0.6;px(0,by,W,34,'#000');ctx.globalAlpha=1;text(W/2,by+6,b.text,'big',C.goldL,'center',al);if(b.sub)text(W/2,by+21,b.sub,'s',C.cream,'center',al);}}
function drawPartyCard(h,x,cy){frame(x,cy,62,74);const A=ATLAS[h.uid];{const sc2=A.oy>40?40/A.oy:1;ctx.save();ctx.beginPath();const mt=h.uid==='lancer';ctx.rect(x+1,cy+(mt?9:1),60,mt?20:34);ctx.clip();drawSprite(h,x+31-14,cy+(mt?38:27),0,'idle',false,sc2);ctx.restore();}
  icon('swap',x+46,cy+4,0);
  text(x+31,cy+2,h.name,'sb',h.dead?C.muted:C.cream,'center');{const t1='Lv '+h.lvl+' · '+heroTitle(h),t2=textW(t1,'xs')<=56?t1:'Lv '+h.lvl+'·'+heroTitle(h);text(x+4,cy+32,t2,'xs',C.muted);}bar(x+5,cy+40,52,9,h.hp/h.maxhp,h.hp/h.maxhp>0.35?C.green:C.red);text(x+31,cy+41,fmtNum(Math.max(0,h.hp))+' / '+fmtNum(h.maxhp),'xs',C.cream,'center');px(x+5,cy+54,52,3,C.out);px(x+6,cy+55,R(50*h.xp/xpNeed(h.lvl)),1,C.xp);text(x+56,cy+58,'XP','xs',C.dimt,'right');}
function drawCards(){px(0,16,W,80,'#0e111e');px(0,94,W,2,C.goldD);
  for(let i=0;i<4;i++){const x=4+i*66;const h=G.active[i];
    if(!h){frame(x,18,62,74,'#10131f',C.goldD,false);ctx.globalAlpha=0.25;icon('party',x+25,32,0);ctx.globalAlpha=1;
      const nxt=HEROES.filter(d=>!G.roster.find(r=>r.id===d.id))[i-G.active.length];
      text(x+31,58,'Open slot','sb',C.muted,'center');
      if(G.roster.length>G.active.length)hit(x,18,62,74,()=>openSheet('swap',{slot:i}));continue;}
    if(G.drag&&G.drag.moved&&G.drag.i===i){frame(x,18,62,74,'#10131f',C.goldD,false);continue;}
    drawPartyCard(h,x,18);
    hit(x,18,62,74,()=>{G.drag={i,x0:0,y0:0,moved:false};});}
}
function drawDragGhost(){if(G.screen!=='road'||!G.drag||!G.drag.moved)return;const h=G.active[G.drag.i];if(!h)return;const gx=R(G.drag.x-31),gy=R(G.drag.y-37);tx.clearRect(gx*TS,gy*TS,62*TS,74*TS);ctx.globalAlpha=0.95;drawPartyCard(h,gx,gy);ctx.globalAlpha=1;}
function drawAbilityBar(){frame(4,308,262,ABH);const by=308+Math.round((ABH-BS)/2),isc=BS>=40?3:2,ic=Math.round((BS-12*isc)/2);
  {const bw=36,bx=262-bw-6,byy=308+Math.round((ABH-24)/2);const boosted=G.autoUntil>now(),on=autoOn();button(bx,byy,bw,24,on,!boosted);text(bx+bw/2,byy+4,'AUTO','xsb',on?C.goldL:(boosted?C.muted:C.dimt),'center');text(bx+bw/2,byy+13,boosted?(on?fmtT((G.autoUntil-now())/1000):'off'):'0:00:00','xs',on?C.goldL:C.dimt,'center');hit(bx,byy,bw,24,()=>{if(!boosted){openSheet('autoad');return;}G.autoCast=!G.autoCast;toast(G.autoCast?'Abilities cast on their own':'Tap to cast - 30% stronger');});}
  const AW=262-30-12,gap=(AW-4*BS)/5;for(let i=0;i<4;i++){const h=G.active[i],x=R(8+gap*(i+1)+BS*i);if(!h){button(x,by,BS,BS,false,true);ctx.globalAlpha=0.35;icon('lock',x+ic,by+ic,0,isc);ctx.globalAlpha=1;continue;}const ready=h.charge>=100&&!h.dead&&!h.tapCast;
    button(x,by,BS,BS,ready);icon(CLASSES[h.cls].ab.icon,x+ic,by+ic,ready?4:2,isc);if(h.tapCast){ctx.globalAlpha=0.6+0.4*Math.sin(RT*10);px(x+1,by+1,BS-2,2,C.goldL);ctx.globalAlpha=1;}const fh=(BS-6)*h.charge/100;tx.fillStyle=ready?'rgba(241,215,120,0.22)':'rgba(79,195,247,0.22)';tx.fillRect((x+3)*TS,(by+3+(BS-6)-fh)*TS,(BS-6)*TS,fh*TS);
    if(ready&&G.mode==='battle'&&!h.tapCast){ctx.globalAlpha=0.5+0.5*Math.sin(RT*6);px(x+1,by+1,BS-2,1,C.goldL);px(x+1,by+BS-2,BS-2,1,C.goldL);ctx.globalAlpha=1;text(x+BS/2,by+BS-8,'TAP','xsb',C.goldL,'center');}
    hit(x,by,BS,BS,()=>{if(h.tapCast){toast(CLASSES[h.cls].ab.name+' is about to fire');return;}if(!ready){toast(CLASSES[h.cls].ab.name+' - '+R(h.charge)+'% charged');return;}if(G.mode!=='battle'){toast('Abilities fire in battle');return;}h.tapCast=true;h.charge=0;sfx('tap',true);});}}
function drawCamp(){const CY=CAMP_Y,CH=TABY-4-TABTOP-CY,RH=Math.floor((CH-24)/3);frame(4,CY,262,CH);text(12,CY+3,'Camp','bb',C.goldL);if(G.roster.length<3){text(W/2,CY+CH/2-14,'Heroes resting at camp can be sent on quests.','xs',C.muted,'center');text(W/2,CY+CH/2-4,G.roster.length<2?'Your second hero joins at the first campfire.':'Recover the first shard to find a third hero.','xs',C.dimt,'center');text(258,CY+4,'Quests','xs',C.muted,'right');return;}const C2=G.castle,g=Math.floor(C2.stored.gold),o=Math.floor(C2.stored.ore);const hl=hordeLeft();
  const vs=(g+o>0?'Vael +'+g+' gold, '+o+' ore':'Quests '+G.quests.length+' / '+questSlots())+(hl<3600&&(C2.b.walls||C2.vil.total)?' · Horde '+fmtT(hl):'');text(258,CY+4,vs,'xs',g+o>0?C.goldL:C.muted,'right');if(g+o>0)hit(150,CY,116,12,()=>{G.screen='vael';});
  const slots=questSlots();
  for(let i=0;i<Math.min(3,slots);i++){const y=CY+15+i*RH,bh=Math.min(BIG?30:22,RH-4),by=y+Math.floor((RH-bh)/2),cy=y+Math.floor(RH/2);if(i%2===0)px(8,y,254,RH,C.band);const q=G.quests[i];
    if(q){const A=ATLAS[q.hero.uid];drawSprite(q.hero,22,cy+9,0,'idle',false);text(38,cy-8,q.hero.name+' · '+q.q.name,'s',C.cream);const left=(q.end-now())/1000;
      if(left>0){text(38,cy+1,'Returns in '+fmtT(left),'xs',C.muted);button(196,by,62,bh,false,true);text(227,by+bh/2-4,'Waiting','xs',C.muted,'center');}
      else{text(38,cy+1,'Returned','xs',C.green);button(196,by,62,bh,true);text(227,by+bh/2-4.5,'Collect','sb',C.goldL,'center');hit(196,by,62,bh,()=>collectQuest(q));}}
    else{px(12,cy-9,24,18,'#141828');px(13,cy-8,22,16,'#1c2038');text(38,cy-4,'Empty slot','s',C.muted);const free=G.roster.filter(h=>heroStatus(h)==='camp');
      button(196,by,62,bh,false,!free.length);text(227,by+bh/2-4,'Send hero','xs',free.length?C.cream:C.dimt,'center');hit(196,by,62,bh,()=>{if(!free.length){toast('Everyone is marching or away');return;}openSheet('send');});}}
}

// ============================================================ screens
function drawRoad(){drawCards();drawScene();px(0,304,W,4,C.out);drawAbilityBar();drawCamp();}
function drawPanelScreen(){px(0,16,W,TABY-16,'#0e111e');for(let y=16;y<TABY;y+=8)px(0,y,W,1,'#10141f');px(0,16,W,1,C.goldD);}
const TABTOP=6;
function drawGear(){drawPanelScreen();const h=G.roster[G.gearHero]||G.roster[0];
  text(8,26,'Equipment','title',C.goldL);
  const n=G.roster.length,tgap=n>6?2:4,tw=Math.min(32,Math.floor((186-tgap*(n-1))/n));G.roster.forEach((hh,i)=>{const x=W-8-(n-i)*(tw+tgap)+tgap,sel=hh===h;button(x,18,tw,26,sel);{const A3=ATLAS[hh.uid],s4=A3.oy>34?34/A3.oy:1;ctx.save();ctx.beginPath();ctx.rect(x+3,21,tw-6,20);ctx.clip();{const mt=hh.uid==='lancer';drawSprite(hh,mt?x+tw/2-4:x+tw/2,mt?48:42,0,'idle',false,s4);}ctx.restore();}hit(x,18,tw,26,()=>{G.gearHero=i;G.selItem=null;});});
  frame(4,48,262,86);px(10,54,70,74,C.out);px(11,55,68,72,'#222844');{const A2=ATLAS[h.uid],sc3=Math.min(2,60/Math.max(1,A2.oy-headRow(h)+2));ctx.save();ctx.beginPath();ctx.rect(11,55,68,72);ctx.clip();drawSprite(h,h.uid==='lancer'?39:45,121,0,'idle',false,sc3);ctx.restore();}
  text(90,54,h.name,'h',C.cream);text(90,66,heroTitle(h)+' · Lv '+h.lvl+' · '+heroStatus(h),'s',C.muted);
  text(90,80,'HP','xs',C.muted);text(110,80,fmtNum(h.maxhp),'sb',C.cream);text(150,80,'ATK','xs',C.muted);text(172,80,fmtNum(h.atk),'sb',C.cream);
  text(90,91,'DEF','xs',C.muted);text(110,91,fmtNum(h.def),'sb',C.cream);text(150,91,'SPD','xs',C.muted);text(172,91,String(h.spd),'sb',C.cream);
  bar(90,104,166,5,h.xp/xpNeed(h.lvl),C.xp);text(90,111,'XP '+fmtNum(h.xp)+' / '+fmtNum(xpNeed(h.lvl)),'xs',C.muted);text(256,111,'Power '+fmtNum(h.maxhp+h.atk*6+h.def*4),'xs',C.goldL,'right');
  const MH=BIG?18:14,MY=138,SY=MY+MH+4,SLOTH=BIG?126:108,PACK_Y=SY+SLOTH+6;
  text(8,MY+MH/2-4,'Upgrades per tap','xs',C.muted);[1,5,25,'max'].forEach((m,i)=>{const x=64+i*48,on=G.mult===m;button(x,MY,46,MH,on);text(x+23,MY+MH/2-4,m==='max'?'Max':'×'+m,'xsb',on?C.goldL:C.cream,'center');hit(x,MY,46,MH,()=>{G.mult=m;});});
  ['weapon','cape','charm'].forEach((slot,i)=>{const x=4+i*88,it=h.eq[slot];frame(x,SY,86,SLOTH,C.navy,it&&it.rank>0?RANKHEX[it.rank]:C.gold);
    px(x+29,SY+12,28,28,C.out);px(x+30,SY+13,26,26,'#222844');text(x+43,SY+3,slot[0].toUpperCase()+slot.slice(1),'xs',C.muted,'center');
    if(it){drawItemIcon(it,x+31,SY+14,2);const nm=itemName(it);text(x+43,SY+43,nm,textW(nm,'sb')>78?'xsb':'sb',it.rank>0?RANKHEX[it.rank]:C.cream,'center');text(x+43,SY+53,(it.rank>=5?'MYTHIC':'★'.repeat(it.rank+1)+'☆'.repeat(4-it.rank))+(it.lvl?'  ↑'+Math.round(roll('it_'+it.id,it.lvl)):''),'xs',C.goldL,'center');text(x+43,SY+61,itemStatLabel(it).replace(fmtNum(itemStat(it)),fmtNum(roll('is_'+it.id,itemStat(it)))),'xs',C.green,'center');
      const cost=upgradeCost(it),can=G.ore>=cost;const ub=BIG?22:16,uy=SY+SLOTH-ub-4;button(x+6,uy,74,ub,can);icon('ore',x+10,uy+ub/2-6,0);text(x+47,uy+ub/2-4,'Upgrade '+fmtNum(cost),'xs',can?C.goldL:C.muted,'center');hit(x+6,uy,74,ub,()=>upgradeItem(it,h),true);
      if(it.rank<4){const locked=it.rank>=ascendCap(),ac2=ascendCost(it),acan=!locked&&G.ore>=ac2,ay=uy-ub-3;button(x+6,ay,74,ub,acan,locked);if(locked)icon('lock',x+10,ay+ub/2-6,0);text(x+43+(locked?6:0),ay+ub/2-4,locked?'Reforge to ascend':'Ascend '+fmtNum(ac2),'xs',locked?C.dimt:(acan?RANKHEX[it.rank+1]:C.muted),'center');hit(x+6,ay,74,ub,()=>ascendItem(it,h));}
      hit(x+29,SY+12,28,28,()=>{unequip(h,slot);});}
    else{text(x+43,SY+46,'Empty','s',C.dimt,'center');text(x+43,SY+58,slot==='weapon'?WEAPON_NOUN[CLASSES[h.cls].weapon]+' only':'','xs',C.dimt,'center');}});
  const PY=PACK_Y,PH=TABY-8-TABTOP-PY,CELL=Math.min(49,Math.floor((PH-44)/3)-2),PB=BIG?24:14;frame(4,PY,262,PH);text(10,PY+6,'Pack','sb',C.goldL);if(G.salvage){const all=(G.sel||[]).length>=G.pack.length&&G.pack.length>0;button(204,PY+6,58,PB,true);text(233,PY+6+PB/2-4,all?'Clear':'Select all','xs',C.goldL,'center');hit(204,PY+6,58,PB,()=>{G.sel=all?[]:G.pack.slice();});}else{const lbl=['Auto: off','Auto: <Uncommon','Auto: <Rare','Auto: <Epic','Auto: <Legendary'][G.autoSalvage]||'Auto: off';button(204,PY+6,58,PB,G.autoSalvage>0);text(233,PY+6+PB/2-4,lbl,'xs',G.autoSalvage?C.goldL:C.cream,'center');hit(204,PY+6,58,PB,()=>{G.autoSalvage=(G.autoSalvage+1)%5;toast(G.autoSalvage?'Drops below '+RANKS[G.autoSalvage]+' are salvaged on pickup':'Auto-salvage off');});}if(!G.salvage){const si=G.selItem&&G.pack.includes(G.selItem)?G.selItem:null;text(10,PY+16,G.pack.length+' / 15','xs',C.muted);if(si){const cur=h.eq[si.slot],d=itemStat(si)-(cur?itemStat(cur):0);px(8,PY+PH-18,254,14,'#141826');px(8,PY+PH-18,254,1,C.goldD);text(W/2,PY+PH-15,fitText(itemName(si)+' · '+itemStatLabel(si)+(si.lvl?' · ↑'+si.lvl:'')+(cur?'  ('+(d>=0?'+':'-')+fmtNum(Math.abs(d))+' vs '+itemName(cur)+')':'  (slot empty)')+'  ·  tap again to equip','xs',248),'xs',d>=0?C.green:'#ff8a80','center');}}
  if(G.salvage){button(84,PY+6,58,PB,false);text(113,PY+6+PB/2-4,'Cancel','xs',C.cream,'center');hit(84,PY+6,58,PB,()=>{G.salvage=false;G.sel=[];});}else{button(84,PY+6,58,PB,true);text(113,PY+6+PB/2-4,'Equip best','xs',C.goldL,'center');hit(84,PY+6,58,PB,()=>equipBest(h));}
  G.sel=(G.sel||[]).filter(it=>G.pack.includes(it));const sel=G.sel;const ore=sel.reduce((a,it)=>a+(it.rank+1)*4+it.lvl*2,0);
  if(G.salvage){button(146,PY+6,54,PB,sel.length>0,!sel.length);text(173,PY+6+PB/2-4,sel.length?'Salvage '+sel.length:'Select…','xs',sel.length?C.goldL:C.dimt,'center');
    if(sel.length)hit(146,PY+6,54,PB,()=>{if(sel.some(it=>it.super)){toast('Crystal gear cannot be salvaged');G.sel=G.sel.filter(it=>!it.super);return;}for(const it of sel)G.pack=G.pack.filter(i=>i!==it);G.ore+=ore;toast('Salvaged '+sel.length+' for '+ore+' ore');G.sel=[];G.salvage=false;});
    text(10,PY+16,sel.length?sel.length+' selected · +'+ore+' ore':'Tap items to salvage','xs',C.goldL);}
  else{button(146,PY+6,54,PB,false,!G.pack.length);text(173,PY+6+PB/2-4,'Salvage','xs',G.pack.length?C.cream:C.dimt,'center');if(G.pack.length)hit(146,PY+6,54,PB,()=>{G.salvage=true;G.sel=[];});}
  const gy=PY+6+PB+4,step=CELL+2,gx=Math.floor((262-5*step+2)/2)+4;
  for(let k=0;k<15;k++){const cx=k%5,cy=Math.floor(k/5),x=gx+cx*step,y=gy+cy*step,it=G.pack[k];
    if(!it){px(x,y,CELL,CELL,'#0e1020');px(x+1,y+1,CELL-2,CELL-2,C.navy);continue;}
    const col=RANKHEX[it.rank];const on=G.salvage?sel.includes(it):G.selItem===it,usable=it.slot!=='weapon'||it.kind===CLASSES[h.cls].weapon;px(x,y,CELL,CELL,C.out);px(x+1,y+1,CELL-2,CELL-2,on?C.goldL:col);px(x+2,y+2,CELL-4,CELL-4,C.out);px(x+3,y+3,CELL-6,CELL-6,on?'#3a3420':'#1e223a');ctx.globalAlpha=usable?1:0.35;drawItemIcon(it,x+CELL/2-12,y+CELL/2-14,2);ctx.globalAlpha=1;if(!usable)text(x+CELL/2,y+CELL-13,wielders(it),'xs',C.dimt,'center');
    if(G.salvage&&on)icon('check',x+CELL-14,y+2,4);else if(it.isNew)px(x+CELL-9,y+4,5,5,'#ff5050');if(it.lvl)text(x+CELL-3,y+3,'↑'+it.lvl,'xs',C.goldL,'right');if(usable)text(x+3,y+CELL-10,itemStatLabel(it),'xs',C.green);
    hit(x,y,CELL,CELL,()=>{it.isNew=false;if(G.salvage){if(on)G.sel=G.sel.filter(i=>i!==it);else G.sel.push(it);return;}
      if(!usable){toast(itemName(it)+' · only '+wielders(it)+' can wield it');return;}if(G.selItem===it){equipItem(h,it);G.selItem=null;}else{G.selItem=it;}});}}
function drawHeroes(){drawPanelScreen();text(8,26,'Heroes','title',C.goldL);text(262,30,G.roster.length+' recruited','xs',C.muted,'right');beginScroll('heroes',44);
  let y=46;const HR=BIG?110:98;for(const h of G.roster){frame(4,y,262,HR);{const fx0=tierFx(h);if(fx0.aura){const g=ctx.createRadialGradient(28,y+26,2,28,y+26,20);g.addColorStop(0,'rgba(255,120,60,0.35)');g.addColorStop(1,'rgba(255,120,60,0)');ctx.fillStyle=g;ctx.fillRect(8,y+6,40,40);}if(fx0.ghost)ctx.globalAlpha=0.75+0.2*Math.sin(RT*7);drawSprite(h,26,y+38,0,'idle',false);ctx.globalAlpha=1;}{const fx=tierFx(h);ctx.save();ctx.beginPath();ctx.rect(5,y+1,60,HR-2);ctx.clip();drawTierExtras(h,26,y+38,1,Object.assign({},fx,{wglow:null}),false);if(fx.halo){const top=y+38-(ATLAS[h.uid].oy-headRow(h));ctx.strokeStyle='rgba(255,240,180,'+(0.6+0.3*Math.sin(RT*3))+')';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(28,top-3,6,2,0,0,Math.PI*2);ctx.stroke();}ctx.restore();}const st=heroStatus(h);
    text(46,y+6,h.name,'sb',C.cream);text(46,y+16,heroTitle(h)+' · Lv '+h.lvl+' · '+(st==='quest'?'on a quest':st),'xs',C.muted);
    {const q=promoteReq(h),can=(h.tier||0)<3&&h.lvl>=q.lvl&&G.gold>=q.gold&&G.dust>=q.dust,PB2=Math.floor((HR-34)/2),py2=y+HR-26-PB2;if((h.tier||0)<3){button(194,py2,66,PB2,can,h.lvl<q.lvl);text(227,py2+PB2/2-4,h.lvl<q.lvl?'Promote at '+q.lvl:'Promote','xs',can?C.goldL:(h.lvl<q.lvl?C.dimt:C.muted),'center');hit(194,py2,66,PB2,()=>promoteHero(h));}}
    const ab=CLASSES[h.cls].ab;icon(ab.icon,46,y+27,2);text(62,y+28,ab.name,'xsb',C.goldL);text(62+textW(ab.name,'xsb')+6,y+28,'rank '+h.abLvl,'xs',C.muted);{const d1=abilityDesc(h),parts=wrap2(d1,'xs',128);text(62,y+37,parts[0],'xs',C.muted);if(parts[1])text(62,y+46,parts[1],'xs',C.muted);drawAbilityNums(h,62,y+37,parts);}if((h.tier||0)<3){const q=promoteReq(h);text(62,y+56,fitText('Promote at Lv '+q.lvl+': '+fmtNum(q.gold)+' gold, '+q.dust+' dust','xs',128),'xs',C.dimt);}
    const cost=rankCost(h),can=G.gold>=cost;const HB=Math.floor((HR-34)/2);button(194,y+4,66,HB,can);icon('coin',198,y+4+HB/2-6,4);text(233,y+4+HB/2-4,'Rank up '+fmtNum(cost),'xs',can?C.goldL:C.muted,'center');hit(194,y+4,66,HB,()=>{if(!can){toast('Need '+cost+' gold');return;}G.gold-=cost;h.abLvl++;toast(ab.name+' rank '+h.abLvl);});
    {h.talents=h.talents||{};TALENTS[h.cls].forEach((t,i)=>{const own=!!h.talents[t.id],q=talentReq(i),x=12+i*62,ty=y+HR-24,lk=h.lvl<q.lvl,can=!own&&!lk&&G.gold>=q.gold;button(x,ty,58,20,own||can,lk);const lbl=own?t.name:(lk?'Lv '+q.lvl:t.name);text(x+29,ty+(own||lk?6:3),fitText(lbl,'xs',54),'xs',own?C.goldL:(lk?C.dimt:C.cream),'center');if(!own&&!lk)text(x+29,ty+11,(can?'buy ':'')+fmtNum(q.gold),'xs',can?C.goldL:C.dimt,'center');hit(x,ty,58,20,()=>buyTalent(h,i));});}
    y+=HR+4;}
  if(G.roster.length<HEROES.length)text(W/2,y+6,'More will join along the road','xs',C.dimt,'center');endScroll('heroes',y+20);}
function drawMap(){drawPanelScreen();ctx.strokeStyle=C.goldL;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(16,33,9,0,Math.PI*2);ctx.stroke();icon('back',10,27,4);text(32,26,'The Crystal Road','title',C.goldL);hit(0,16,110,34,()=>{G.screen='road';});const rb=BIG?26:18;const ok0=canReforge();button(170,22,92,rb,ok0);icon('crystal',174,22+rb/2-6,2);text(220,22+rb/2-4,ok0?'Reforge +'+fmtNum(reforgeGain()):'Beat the Warlord','xsb',ok0?C.goldL:C.dimt,'center');if(ok0)hit(170,22,92,rb,()=>openSheet('reforge'));
  beginScroll('map',48);
  ZONES.forEach((z,i)=>{const y=52+i*72,ok=zoneUnlocked(i),cur=i===G.zone;frame(4,y,262,66,C.navy,cur?C.goldL:(ok?C.gold:C.goldD));
    ctx.save();ctx.beginPath();ctx.rect(10,y+6,90,54);ctx.clip();const L=SCENES[z.scene][0];ctx.globalAlpha=ok?1:0.35;ctx.drawImage(L.img,-80,y-40);for(const l of SCENES[z.scene].slice(1))ctx.drawImage(l.img,-80,y-40);ctx.globalAlpha=1;ctx.restore();
    text(108,y+8,z.name,'sb',ok?C.cream:C.dimt);text(108,y+19,'Danger Lv '+z.lv+(z.endless?'+':''),'xs',C.muted);
    text(108,y+30,ok?(z.endless?'Fight '+(G.prog[i]+1)+' · Lv '+endlessLv(z,G.prog[i])+' · best '+Math.max(G.prog[i],(G.far||[])[i]||0):G.cleared[i]?'Shard recovered':'Checkpoint '+Math.floor(Math.max(G.prog[i],(G.far||[])[i]||0)/(z.fights/3))+'/3 · boss: '+ENEMIES[z.boss].name):((G.reforges||0)<reqReforge(i)?'Needs '+reqReforge(i)+' Reforge'+(reqReforge(i)>1?'s':'')+(G.cleared[i-1]?'':' · beat the previous boss'):'Defeat the previous boss'),'xs',ok?C.goldL:C.dimt);
    if(ok&&!cur){button(180,y+42,76,16,true);text(218,y+45,'Travel','sb',C.goldL,'center');hit(180,y+42,76,16,()=>{G.zone=i;G.enemies=[];G.projs=[];G.action=null;G.bossFight=false;for(const h of G.active){h.dx=0;h.status={};if(h.dead){h.dead=false;h.hp=R(h.maxhp*0.3);}setAnim(h,'walk');}G.mode='walk';G.enc=3;G.screen='road';banner(z.name,'Danger Lv '+z.lv);});}
    else if(cur)text(218,y+46,'You are here','xs',C.goldL,'center');});
  const ey=52+ZONES.length*72;text(W/2,ey,'Reforge keeps your heroes, talents, gear, Vael,','xs',C.dimt,'center');text(W/2,ey+10,'the tree and blessings, and pays out crystal dust.','xs',C.dimt,'center');endScroll('map',ey+30);}
function drawTree(){drawPanelScreen();text(8,26,'Upgrade Tree','title',C.goldL);
  const BR=['Party','Tap','Camp','Crystal'];G.treeTab=G.treeTab||'Party';BR.forEach((b2,i)=>{const x=6+i*65,on=G.treeTab===b2;button(x,42,63,BIG?22:16,on);text(x+31,42+(BIG?22:16)/2-4,b2,'sb',on?C.goldL:(b2==='Crystal'?'#bbdefb':C.cream),'center');hit(x,42,63,BIG?22:16,()=>{G.treeTab=b2;SCROLL.tree=0;});});
  {const ty=42+(BIG?22:16)+4;text(8,ty+4,'Upgrades per tap','xs',C.muted);[1,5,25,'max'].forEach((m,i)=>{const x=96+i*42,on=G.mult===m;button(x,ty,40,16,on);text(x+20,ty+4,m==='max'?'Max':'×'+m,'xsb',on?C.goldL:C.cream,'center');hit(x,ty,40,16,()=>{G.mult=m;});});}
  const top=42+(BIG?22:16)+4+22;SCROLLTOP.tree=top;const nRows=TREE.filter(n=>n.branch===G.treeTab).length+(G.treeTab==='Crystal'?1:0);const TRH=Math.max(22,Math.min(BIG?44:32,Math.floor((TABY-8-TABTOP-top)/nRows)-3));beginScroll('tree',top);let y=top+2;if(G.treeTab==='Crystal'){text(8,y,'Blessings are paid in crystal dust and kept through every Reforge.','xs','#bbdefb');y+=14;}for(const n of TREE){if(n.branch!==G.treeTab)continue;
    const lv=treeLv(n.id),isD=n.cur==='dust',cost=R(n.base*(isD?1:1.5)*Math.pow(isD?1.5:1.75,lv)),max=lv>=n.max,can=!max&&(isD?G.dust:G.gold)>=cost,RH=TRH,TB=Math.min(BIG?32:20,RH-6);px(6,y,258,RH,C.band);
    icon('nodes',10,y+RH/2-6,lv?4:0);const dl=Math.round(roll('tr_'+n.id,lv));const tight=RH<32;text(28,y+RH/2-(tight?9:12),n.name+(dl?'  rank '+dl:''),tight?'sb':'sb',C.cream);text(28,y+RH/2+(tight?0:-1),fitText(n.desc,'xs',150),'xs',C.muted);
    button(192,y+(RH-TB)/2,66,TB,can,max);if(!max)icon(isD?'crystal':'coin',197,y+RH/2-6,isD?2:4);text(max?225:231,y+RH/2-4,max?'Maxed':fmtNum(cost),'xsb',max?C.dimt:(can?C.goldL:C.muted),'center');
    if(!max)hit(192,y+(RH-TB)/2,66,TB,()=>{let k=0,want=G.mult==='max'?1e9:G.mult;while(k<want&&treeLv(n.id)<n.max){const c=R(n.base*(isD?1:1.5)*Math.pow(isD?1.5:1.75,treeLv(n.id)));if((isD?G.dust:G.gold)<c)break;if(isD)G.dust-=c;else G.gold-=c;G.tree[n.id]=treeLv(n.id)+1;k++;}if(!k){toast('Need '+cost+(isD?' crystal dust':' gold'));return;}for(const h of G.roster)refreshStats(h);sfx('coin',true);toast(n.name+' rank '+treeLv(n.id));},true);y+=RH+3;}endScroll('tree',y);}

// ============================================================ Vael: the castle
const CASTLE_PIX={
mine:["........oooooo........","......ooSSSSSSoo......","....ooSSSSssSSSSoo....","...oSSSSsssoooSSSSo...","..oSSSSssoDDDDosSSSo..","..oSSSsoDDDDDDDDoSSo..",".oSSSSoWDDDDDDDDWoSSo.",".oSSSSoWDDDDDDDDWoSSo.",".oSSSSoWDDDDDDDDWoSSo.","ooooooWWDDDDDDDDWWoooo","......oWDDDDDDDDWo...."],
stall:[".oooooooooooooooooo.","oRRWWRRWWRRWWRRWWRRo","oWWRRWWRRWWRRWWRRWWo",".oooooooooooooooooo.","..ow............wo..","..ow..oooooooo..wo..","..ow..oIIooIIo..wo..","..ow..oIIooIIo..wo..","..owoooooooooooowo..","..oWWWWWWWWWWWWWWo..","..oowwwwwwwwwwwwoo..","...ow..........wo...","...ow..........wo..."],
wall:["oo..oo..oo..oo..oo..oo..oo..oo..","oSooSSooSSooSSooSSooSSooSSooSSoo","oSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSo","oSsSSSsSSSsSSSsSSSsSSSsSSSsSSSso","oSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSo","oSSsSSSSsSSSSsSSSSsSSSSsSSSSsSSo","oooooooooooooooooooooooooooooooo"],
vil:["..oo..",".ohho.",".ohho.","..oo..",".oTTo.",".oTTo.",".oTTo.","..oo..",".oLoL."],
cart:[".oooooo.","oWWWWWWo","oIIIIIIo",".oooooo.","..o..o..",".ooo.ooo",".ooo.ooo"],
};
const CPAL={o:'#1a1420',S:'#968c7c',s:'#beb29c',D:'#1e1a22',W:'#6e4824',w:'#503218',R:'#be3c3c',I:'#8c969e',h:'#f0c8aa',T:'#5a78b4',L:'#3c2c28'};
function pixGrid(grid,x,y,sc=1,pal=CPAL){for(let r=0;r<grid.length;r++){const row=grid[r];for(let c=0;c<row.length;c++){const ch=row[c];if(ch==='.')continue;px(x+c*sc,y+r*sc,sc,sc,pal[ch]);}}}
const STRUCTS={well:{name:'Old Well',boss:'slimeking',cost:600,desc:'+2 villager housing per castle level'},kennels:{name:'Kennels',boss:'alphawolf',cost:1500,desc:'Quests finish 15% sooner'},sawmill:{name:'Sawmill',boss:'oldgrowth',cost:4000,desc:'Buildings cost 15% less'},watchtower:{name:'Watchtower',boss:'warlord',cost:2500,desc:'+15 defense and +10% tap damage'},forge:{name:'Forge',boss:'sandtyrant',cost:8000,desc:'Gear upgrades cost 15% less ore'},range:{name:'Archery Range',boss:'hunterking',cost:12000,desc:'+5% crit for every hero'},shrine:{name:'Shrine',boss:'graveknight',cost:20000,desc:'+2 hours offline cap'},library:{name:'Library',boss:'necromancer',cost:40000,desc:'+15% ability power'},workshop:{name:'Workshop',boss:'core',cost:80000,desc:'Crystal Surge charges 50% faster'}};
function built(k){return !!(G.castle.built&&G.castle.built[k]);}
const BUILD={mine:{name:'Iron Mine',cost:150,grow:1.7,desc:l=>l?'':'Villagers dig ore over time'},market:{name:'Market',cost:120,grow:1.7,desc:l=>l?'':'Villagers trade for gold'},walls:{name:'Walls',cost:200,grow:1.8,desc:l=>l?'':'Defense, and posts for heroes'}};
const HOUR=3600*1000;
G.castle={b:{mine:0,market:0,walls:0},vil:{total:0,mine:0,market:0},hired:0,garrison:[],stored:{gold:0,ore:0},last:now(),hordeAt:now()+8*HOUR,repelled:0,lost:0,walk:[]};
function tscale(){return G.fast?120:1;}
function castleLv(){const C2=G.castle;return 1+Math.floor((C2.b.mine+C2.b.market+C2.b.walls)/3);}
function idleVil(){const v=G.castle.vil;return v.total-v.mine-v.market;}
function buildCost(k){const l=G.castle.b[k];return R(BUILD[k].cost*Math.pow(BUILD[k].grow,l)*(built('sawmill')?0.85:1));}
function hireCost(){return R(100*Math.pow(1.5,G.castle.hired)*(1-0.03*treeLv('haggle')));}
function vilCap(){return 4+(built('well')?4:2)*castleLv();}
function garrisonSlots(){return Math.min(4,1+G.castle.b.walls);}
function orePerHour(){return R(G.castle.b.mine*G.castle.vil.mine*2*refMult());}
function goldPerHour(){return R(G.castle.b.market*G.castle.vil.market*8*refMult());}
function garrisonRate(){const w=G.castle.b.walls;return 0.04+0.01*Math.min(w,5)+(w>5?0.11*(1-Math.pow(0.98,w-5)):0);}
function garrisonXp(h){return R(xpNeed(h.lvl)*garrisonRate());}
function garrisonHeroes(){return G.castle.garrison.map(id=>G.roster.find(h=>h.id===id)).filter(Boolean);}
function defense(){const p=G.castle.prep||{};const w=(G.castle.b.walls*5+(built('watchtower')?15:0))*(p.walls?1.25:1);const g=garrisonHeroes().reduce((s,h)=>s+3+h.lvl*0.5,0)+(p.merc?8+castleLv()*2:0);return{walls:R(w),garrison:R(g),total:R(w+g)};}
function hordeTier(){const s=hordeStrength();return s<=12?'Rabble':s<=22?'Raiders':s<=38?'Warband':s<=60?'Horde':'Legion';}
function wrapN(str,style,maxW){const w=str.split(' '),out=[];let a='';for(const t of w){const c=a?a+' '+t:t;if(textW(c,style)>maxW&&a){out.push(a);a=t;}else a=c;}if(a)out.push(a);return out;}
function wrap2(str,style,maxW){if(textW(str,style)<=maxW)return[str];const w=str.split(' ');let a='';for(let i=0;i<w.length;i++){const t=a?a+' '+w[i]:w[i];if(textW(t,style)>maxW){return[a,fitText(w.slice(i).join(' '),style,maxW)];}a=t;}return[a];}
function fitText(str,style,maxW){if(textW(str,style)<=maxW)return str;let t=str;while(t.length>3&&textW(t+'…',style)>maxW)t=t.slice(0,-1);return t+'…';}
function hordeStrength(){const C2=G.castle,streak=C2.streak||0,first=(C2.repelled||0)+(C2.lost||0)===0;return R((first?1:3)+castleLv()*(first?1:2)+G.zone*1.5+streak*3);}
function castleTick(){const C2=G.castle,t=now();let dt=(t-C2.last)/HOUR*tscale();C2.last=t;if(dt<=0)return;dt=Math.min(dt,8);
  C2.stored.ore=Math.min(C2.stored.ore+orePerHour()*dt,orePerHour()*8);C2.stored.gold=Math.min(C2.stored.gold+goldPerHour()*dt,goldPerHour()*8);
  for(const h of garrisonHeroes()){h.xp+=garrisonXp(h)*dt;while(h.xp>=xpNeed(h.lvl)){h.xp-=xpNeed(h.lvl);h.lvl++;refreshStats(h);h.hp=h.maxhp;}}
  if(t>=C2.hordeAt){if(document.hidden||(t-C2.hordeAt)>180000||G.hordeFight)resolveHorde();else C2.hordeDue=true;}}
function hordeLeft(){return Math.max(0,(G.castle.hordeAt-now())/1000/tscale());}
function prepCost(k){return R((k==='walls'?40:90)*castleLv()*(1+G.zone*0.5));}
function resolveHorde(fought){const C2=G.castle,d=defense().total,s=hordeStrength();C2.hordeDue=false;if(fought!=null){if(fought){C2.repelled++;C2.streak=(C2.streak||0)+1;G.stats.hordes++;const g=R(s*22*bless('gold')*refMult()),v=2+Math.floor(rand()*2);G.gold+=g;G.dust+=2;C2.vil.total+=v;if(G.pack.length<15){const it=makeItem(G.zone,'boss');G.pack.push(it);G.stats.items++;}banner('The gate holds','+'+fmtNum(g)+' gold, +2 dust, '+v+' villagers, a chest',3.5,'any');}else{C2.lost++;C2.streak=0;const lost=Math.min(2,C2.vil.total);C2.vil.total-=lost;banner('The gate falls',lost+' villagers lost',3.5,'any');}C2.prep={};C2.hordeAt=now()+8*HOUR/tscale();return;}
  if(d>=s){C2.repelled++;C2.streak=(C2.streak||0)+1;G.stats.hordes++;const g=s*15,v=1+Math.floor(rand()*2);G.gold+=g;G.dust+=1;C2.vil.total+=v;banner('The horde breaks on the walls','+'+g+' gold, +1 dust, '+v+' villagers rally',3.5,'any');}
  else{C2.lost++;C2.streak=0;const built=Object.keys(C2.b).filter(k=>C2.b[k]>0);let msg='';if(built.length){const k=built[Math.floor(rand()*built.length)];C2.b[k]--;msg=BUILD[k].name+' damaged';if(k!=='walls'&&C2.vil[k]>C2.b[k]*3)C2.vil[k]=Math.min(C2.vil[k],C2.b[k]*3);}
    const lost=Math.min(2,C2.vil.total);C2.vil.total-=lost;C2.vil.mine=Math.min(C2.vil.mine,C2.vil.total);C2.vil.market=Math.min(C2.vil.market,Math.max(0,C2.vil.total-C2.vil.mine));banner('The horde overruns Vael',(msg?msg+' · ':'')+lost+' villagers lost',3.5,'any');}
  C2.prep={};C2.hordeAt=now()+8*HOUR/tscale();}
function collectCastle(){const C2=G.castle,g=Math.floor(C2.stored.gold),o=Math.floor(C2.stored.ore);if(!g&&!o){toast('Nothing to collect yet');return;}G.gold+=g;G.ore+=o;C2.stored.gold-=g;C2.stored.ore-=o;toast('Collected '+g+' gold and '+o+' ore from Vael');}
function grantShardVillagers(){const n=3+G.zone;G.castle.vil.total+=n;if(G.card)G.card.lines.push(n+' prisoners freed - they head for Vael');}
function postHero(h){const C2=G.castle;if(heroStatus(h)!=='camp'){toast(h.name+' is '+(heroStatus(h)==='marching'?'on the road':heroStatus(h)==='quest'?'away on a quest':'already posted'));return;}if(C2.garrison.length>=garrisonSlots()){toast('No free posts - raise the walls');return;}C2.garrison.push(h.id);toast(h.name+' takes a post on the walls');}
function recallHero(h){G.castle.garrison=G.castle.garrison.filter(id=>id!==h.id);toast(h.name+' stands down');}
const LANTERN=["..o..",".oho.","ohaho",".oao.","..o.."],CRATE=["oooooo","oWwWwo","owWwWo","oWwWwo","oooooo"],FLAG=["o....","oRR..","oRRR.","oRR..","o....","o...."],TOWER=["oo..oo","oSSSSo","oSsSSo","oSSSSo","oSsSSo","oSSSSo","oSSSSo","oooooo"];
const LP=Object.assign({},CPAL,{h:'#fff2a0',a:'#f0b030'});
function drawMineVisual(l){if(!l)return;pixGrid(CASTLE_PIX.mine,4,84,2);if(l>=2){pixGrid(LANTERN,14,90,2,LP);pixGrid(LANTERN,36,90,2,LP);}if(l>=3)pixGrid(CASTLE_PIX.cart,50,112,2);if(l>=4){px(4,108,60,1,'#3c2c28');px(4,110,60,1,'#3c2c28');for(let k=6;k<62;k+=6)px(k,107,2,5,'#6e4824');}if(l>=5)pixGrid(CASTLE_PIX.mine,64,84,1);}
function drawMarketVisual(l){if(!l)return;pixGrid(CASTLE_PIX.stall,12,126,2);if(l>=2){pixGrid(CRATE,54,144,2);pixGrid(CRATE,54,134,2);}if(l>=3)pixGrid(CASTLE_PIX.stall,70,134,1);if(l>=4){pixGrid(FLAG,10,116,2);pixGrid(FLAG,50,116,2);}if(l>=5){px(12,126,40,6,'#c9a227');px(12,126,40,1,'#1a1420');}}
function drawWallsVisual(l){if(!l)return;if(l===1){for(let x=0;x<W;x+=6){if(x>40&&x<230)continue;px(x,60,3,10,'#6e4824');px(x,58,3,2,'#503218');}return;}
  pixGrid(CASTLE_PIX.wall,0,58);pixGrid(CASTLE_PIX.wall,238,58);if(l>=3){px(14,50,1,14,'#1a1420');px(15,50,6,8,l>=5?'#c9a227':'#be3c3c');px(250,50,1,14,'#1a1420');px(251,50,6,8,l>=5?'#c9a227':'#be3c3c');}
  if(l>=4){pixGrid(TOWER,28,48,2);pixGrid(TOWER,230,48,2);}}
// ---- the castle grows more established as it levels
const WEEDS=[[30,150],[70,166],[120,158],[170,168],[210,152],[250,162],[95,120],[190,118],[140,140],[40,108]];
const RUBBLE=[[60,140],[150,160],[230,140],[110,170],[200,110]];
const TORCH=["..o..",".oho.","ohaho",".oao.","..o..","..w..","..w..","..w.."];
const TP=Object.assign({},CPAL,{h:'#fff2a0',a:'#f0b030'});
function drawEstablished(lv,C2){
  const weeds=Math.max(0,WEEDS.length-(lv-1)*2),rubble=Math.max(0,RUBBLE.length-(lv-1));
  for(let i=0;i<weeds;i++){const[x,y]=WEEDS[i];for(let k=0;k<4;k++){px(x+k*2,y-(k%2?5:3),1,k%2?5:3,'#3f6b32');}px(x+1,y-6,1,2,'#5a8a3a');}
  for(let i=0;i<rubble;i++){const[x,y]=RUBBLE[i];px(x,y,6,3,'#6a6258');px(x+1,y-1,3,1,'#8a8072');px(x+6,y+1,3,2,'#565049');}
  if(lv>=2){for(let y=100;y<174;y+=6){px(128,y,14,4,'#5a5a4a');px(129,y+1,12,2,'#6c6a58');}}  // cobbled path to the gate
  if(lv>=3){const fl=0.6+0.4*Math.sin(RT*9),fl2=0.6+0.4*Math.sin(RT*9+2);ctx.globalAlpha=1;pixGrid(TORCH,96,74,2,TP);pixGrid(TORCH,164,74,2,TP);for(const [gx,f] of [[101,fl],[169,fl2]]){const g=ctx.createRadialGradient(gx,78,1,gx,78,16);g.addColorStop(0,'rgba(255,208,96,'+(0.45*f)+')');g.addColorStop(1,'rgba(255,208,96,0)');ctx.fillStyle=g;ctx.fillRect(gx-16,62,32,32);}}
  if(lv>=4){px(108,52,54,3,'#c9a227');px(108,55,54,1,'#7a5c14');for(let x=112;x<160;x+=12){px(x,58,6,10,'#be3c3c');px(x,68,6,1,'#1a1420');}}  // gilded lintel and pennants over the gate
  if(lv>=5){for(const x of [30,240]){px(x,150,24,4,'#6e4824');px(x,146,24,4,'#4e8a3a');px(x+3,144,3,2,'#e05a5a');px(x+10,144,3,2,'#f0c040');px(x+17,144,3,2,'#e05a5a');}}  // flower boxes
  if(lv>=6){for(let x=8;x<W;x+=20){px(x,46,12,1,'#4e8a3a');px(x+4,47,4,2,'#e05a5a');}}  // garland along the wall top
  // guards at the gate once the walls are real
  const wl=C2.b.walls;if(wl>=3&&IMG.soldier){const g={uid:'soldier',enemy:true,tier:wl>=5?2:0};ctx.save();ctx.beginPath();ctx.rect(0,57,W,46);ctx.clip();for(const [gx,f] of [[100,false],[172,true]]){drawSprite(g,gx,104,Math.floor(RT*4+(f?2:0))%ATLAS.soldier.anims.idle.n,'idle',f);}ctx.restore();}
  // merchant carts once the market is busy
  const ml=C2.b.market;if(ml>=3){const n=ml>=5?2:1;for(let i=0;i<n;i++){const cx=((RT*9+i*110)%300)-30,cy=160+i*8;pixGrid(CASTLE_PIX.cart,R(cx),cy,2);const pal=Object.assign({},CPAL,{T:i?'#96603c':'#5a78b4'});pixGrid(CASTLE_PIX.vil,R(cx)-8,cy-6,2,pal);}}
}
const VAEL_Y=176;
function drawVael(){drawPanelScreen();castleTick();const C2=G.castle,D=defense(),S=hordeStrength();
  text(8,19,'Vael','title',C.goldL);text(44,24,'Castle Lv '+castleLv(),'xs',C.muted);{let vx=8;const seg=(t,b)=>{text(vx,35,t,b?'xsb':'xs',b?C.cream:C.muted);vx+=textW(t,b?'xsb':'xs');};seg(String(C2.vil.total),1);seg(' villagers · ',0);seg(String(idleVil()),1);seg(' idle',0);}text(8,45,'+'+fmtNum(orePerHour())+' ore/h · +'+fmtNum(goldPerHour())+' gold/h','xs',C.dimt);
  const safe=D.total>=S;const pw=80,px1=98,px2=184,py=18,ph=35,sy=py+20,sh=12;const plate=(x,fill,line)=>{px(x,py,pw,ph,C.out);px(x+1,py+1,pw-2,ph-2,line);px(x+2,py+2,pw-4,ph-4,fill);};plate(px1,safe?'#14321e':'#3c1e1e',safe?'#5ab46e':'#c85050');text(px1+pw/2,py+3,'Defense '+D.total,'sb',safe?'#96e6aa':'#ff9696','center');text(px1+pw/2,py+12,'walls '+fmtNum(D.walls)+'·garrison '+fmtNum(D.garrison),'xs',safe?'#78aa82':'#c88080','center');button(px1+4,sy,pw-8,sh,false);text(px1+pw/2,sy+sh/2-4,'Garrison','xs',C.cream,'center');hit(px1,py,pw,ph,()=>openSheet('garrison'));
  const due=C2.hordeDue;plate(px2,'#3c1e1e','#c85050');text(px2+pw/2,py+3,due?'At the gate!':'Horde · '+hordeTier(),'sb','#ff9696','center');text(px2+pw/2,py+12,due?'':'in '+fmtT(hordeLeft()),'xs','#c88080','center');button(px2+4,sy,pw-8,sh,due);text(px2+pw/2,sy+sh/2-4,due?'Defend':'Prepare','xs',due?C.goldL:C.cream,'center');hit(px2,py,pw,ph,()=>openSheet('horde'));
  if(due){ctx.globalAlpha=0.15+0.85*(0.5+0.5*Math.sin(RT*6));px(px2+1,py+1,pw-2,1,'#ffe0e0');px(px2+1,py+ph-2,pw-2,1,'#ffe0e0');px(px2+1,py+1,1,ph-2,'#ffe0e0');px(px2+pw-2,py+1,1,ph-2,'#ffe0e0');ctx.globalAlpha=1;}
  // scene
  const sc=SCENES.door[0].img;ctx.save();ctx.beginPath();ctx.rect(0,57,W,113);ctx.clip();ctx.drawImage(sc,-49,52-60);
  drawWallsVisual(C2.b.walls);drawEstablished(castleLv(),C2);
  drawMineVisual(C2.b.mine);drawMarketVisual(C2.b.market);
  // villagers wander
  const n=Math.min(6,C2.vil.mine+C2.vil.market);for(let i=0;i<n;i++){const x=70+((i*47)%150)+Math.sin(RT*0.4+i)*14,y=118+((i*23)%40);const pal=Object.assign({},CPAL,{T:['#5a78b4','#96603c','#508a5a','#a0783c','#7a5aa0','#b45a5a'][i%6]});pixGrid(CASTLE_PIX.vil,R(x),R(y),2,pal);}
  // garrison at the gate
  garrisonHeroes().forEach((h,i)=>{stepAnim(h,0);const A=ATLAS[h.uid];drawSprite(h,i%2?176+Math.floor(i/2)*22:118-Math.floor(i/2)*22,150,Math.floor(RT*6)%A.anims.idle.n,'idle',!!(i%2));});
  ctx.restore();px(0,55,W,2,C.goldD);px(0,170,W,2,C.goldD);
  if(garrisonHeroes().length)text(136,160,'Garrison: '+garrisonHeroes().map(h=>h.name).join(', '),'xs','#e6dcc8','center');
  // cards
  const cards=[
    {k:'mine',ic:()=>pixGrid(CASTLE_PIX.mine.slice(2).map(r=>r.slice(4,18)),14,y0+12),sub:C2.b.mine?C2.vil.mine+' villagers · +'+fmtNum(orePerHour())+' ore/h · '+fmtNum(C2.stored.ore)+' stored':'Not built · '+BUILD.mine.desc(0),vil:true},
    {k:'market',ic:()=>icon('coin',20,y0+17,4),sub:C2.b.market?C2.vil.market+' villagers · +'+fmtNum(goldPerHour())+' gold/h · '+fmtNum(C2.stored.gold)+' stored':'Not built · '+BUILD.market.desc(0),vil:true,hire:true},
    {k:'walls',ic:()=>pixGrid(CASTLE_PIX.wall.map(r=>r.slice(0,28)),12,y0+18),sub:C2.b.walls?'Defense +'+fmt5(D.walls)+' · garrison +'+fmt5(D.garrison)+' ('+garrisonHeroes().length+'/'+garrisonSlots()+')':'Not built · '+BUILD.walls.desc(0),gar:true},
    {k:'blueprints',ic:()=>icon('map',20,y0+17,4),sub:(()=>{const bp=Object.keys(STRUCTS).filter(k=>(C2.bp||{})[k]).length,bt=Object.keys(STRUCTS).filter(k=>built(k)).length;return bp?bp+' found · '+bt+' built':'Bosses drop plans for new structures';})()},
    {k:'catacombs',ic:()=>icon('x',20,y0+17,0),sub:'Keys '+keysNow()+'/'+keyMax()+' · best floor '+(G.delveBest||0),keys:true},
  ];const cb=BIG?24:16,avail=TABY-12-TABTOP-VAEL_Y;const VCH=Math.max(44,Math.min(64,Math.floor((avail-cb-4-16)/5))),VB=VCH-12,R1=y0=>y0+5,R2=y0=>y0+15,R3=y0=>y0+VCH-13;
  {const g=Math.floor(C2.stored.gold),o=Math.floor(C2.stored.ore);button(4,VAEL_Y,262,cb,g+o>0);text(W/2,VAEL_Y+cb/2-4,g+o>0?'Collect '+fmtNum(g)+' gold and '+fmtNum(o)+' ore':'Production stores up to 8 hours','xs',g+o>0?C.goldL:C.dimt,'center');if(g+o>0)hit(4,VAEL_Y,262,cb,collectCastle);}
  let y0=VAEL_Y+cb+4;
  for(const cd of cards){frame(4,y0,262,VCH);px(10,y0+7,32,32,C.out);px(11,y0+8,30,30,'#222844');cd.ic();
    const lv=(cd.k==='garrison'||cd.k==='catacombs'||cd.k==='blueprints')?null:C2.b[cd.k];text(48,R1(y0),cd.k==='garrison'?'Garrison':cd.k==='catacombs'?'Catacombs':cd.k==='blueprints'?'Blueprints':BUILD[cd.k].name,'sb',C.cream);if(lv!=null)text(48+textW(cd.k==='garrison'?'Garrison':BUILD[cd.k].name,'sb')+6,R1(y0)+1,lv?'Lv '+lv:'',"xs",C.goldL);if(cd.k==='garrison')text(100,R1(y0)+1,garrisonHeroes().length+' / '+garrisonSlots(),'xs',C.goldL);
    text(48,R2(y0),fitText(cd.sub,'xs',138),'xs',C.muted);
    if(cd.k==='catacombs'&&keysNow()>0){ctx.globalAlpha=0.35+0.35*Math.sin(RT*2);px(4,y0,262,1,C.goldL);px(4,y0+VCH-1,262,1,C.goldL);px(4,y0,1,VCH,C.goldL);px(265,y0,1,VCH,C.goldL);ctx.globalAlpha=1;}
    if(cd.k==='blueprints'){button(190,y0+6,70,VB,true);text(225,y0+6+VB/2-4,'View','xs',C.goldL,'center');hit(190,y0+6,70,VB,()=>openSheet('blueprints'));text(48,R3(y0),fitText('Each structure aids the road or the castle','xs',138),'xs',C.dimt);}
    else if(cd.k==='catacombs'){const kk=keysNow();button(190,y0+6,70,VB,kk>0,!kk);text(225,y0+6+VB/2-4,kk?'Enter':'No keys','xs',kk?C.goldL:C.dimt,'center');if(kk)hit(190,y0+6,70,VB,()=>openSheet('delve'));text(48,R3(y0),fitText(kk<keyMax()?'Next key in '+fmtT((keyPeriod()-(now()-G.keyAt))/1000):'Doors, relics, loot - leave any time','xs',138),'xs',C.dimt);}
    else if(cd.k==='garrison'){button(190,y0+6,70,VB,true);text(225,y0+6+VB/2-4,'Assign','xs',C.goldL,'center');hit(190,y0+6,70,VB,()=>openSheet('garrison'));text(48,R3(y0),'posted heroes train '+R(100*garrisonRate())+'% of a level per hour','xs',C.dimt);}
    else{const cost=buildCost(cd.k),can=G.gold>=cost;button(190,y0+6,70,VB,can);icon('coin',193,y0+6+VB/2-6,4);text(233,y0+6+VB/2-4,(lv?'Upgrade ':'Build ')+fmtNum(cost),'xs',can?C.goldL:C.muted,'center');
      hit(190,y0+6,70,VB,()=>{if(G.gold<cost){toast('Need '+cost+' gold');return;}G.gold-=cost;C2.b[cd.k]++;toast(BUILD[cd.k].name+(C2.b[cd.k]===1?' built':' raised to Lv '+C2.b[cd.k]));},true);
      if(cd.vil&&lv){const vb=Math.max(12,Math.min(18,VCH-30)),vy=y0+VCH-4-vb,vw=18;text(48,vy+vb/2-4,'villagers','xs','#7890c8');button(86,vy,vw,vb,false);text(86+vw/2,vy+vb/2-4,'−','xs',C.cream,'center');text(86+vw+8,vy+vb/2-4,String(C2.vil[cd.k]),'xsb',C.cream,'center');button(86+vw+16,vy,vw,vb,true);text(86+vw+16+vw/2,vy+vb/2-4,'+','xs',C.goldL,'center');
        hit(86,vy,vw,vb,()=>{if(C2.vil[cd.k]>0)C2.vil[cd.k]--;},true);hit(86+vw+16,vy,vw,vb,()=>{if(idleVil()<=0){toast('No idle villagers - hire at the Market');return;}if(C2.vil[cd.k]>=lv*3){toast('Max '+(lv*3)+' at this level');return;}C2.vil[cd.k]++;},true);
        if(cd.hire){const hc=hireCost(),hcan=G.gold>=hc&&C2.vil.total<vilCap();const hx=86+vw*2+20,hw=Math.min(50,186-hx);button(hx,vy,hw,vb,hcan);text(hx+hw/2,vy+vb/2-4,'Hire '+fmtNum(hc),'xs',hcan?C.goldL:C.muted,'center');hit(hx,vy,hw,vb,()=>{if(C2.vil.total>=vilCap()){toast('No room - raise the castle level');return;}if(G.gold<hc){toast('Need '+fmtNum(hc)+' gold');return;}G.gold-=hc;C2.hired++;C2.vil.total++;toast('A villager joins Vael');},true);}}
      else if(cd.k==='walls'&&lv){const gb=Math.max(12,Math.min(18,VCH-30)),gy=y0+VCH-4-gb;text(48,R3(y0),'garrisoned heroes train '+R(100*garrisonRate())+'%/h','xs',C.dimt);}
      else if(!lv)text(48,R3(y0),'appears in the courtyard once built','xs',C.dimt);}
    y0+=VCH+4;}
}

// ============================================================ horde fight at the gate
function startHordeFight(){if(G.delve){toast('Finish the catacombs first');return;}const C2=G.castle,S=hordeStrength(),Z=ZONES[ZONES[G.zone].endless?endSeg(G.prog[G.zone]):G.zone];const gar=garrisonHeroes().filter(h=>!G.active.includes(h));
  G.hordeFight={wave:0,saved:{active:G.active.slice(),zone:G.zone,mode:G.mode,prog:G.prog.slice()},lvl:R(Z.lv+S*0.6),pool:Z.pool,boss:Z.boss};
  G.active=G.active.concat(gar).slice(0,4);for(const h of G.active){h.dead=false;h.status={};if(h.hp<h.maxhp*0.5)h.hp=R(h.maxhp*0.5);}layout();G.active.forEach(h=>{h.x=h.tx;});C2.hordeDue=false;G.enemies=[];G.projs=[];G.action=null;G.screen='road';closeSheet();sfx('cast');banner('The horde is at the gate','Wave 1 of 3',2.5);hordeWave();}
function hordeWave(){const hf=G.hordeFight;hf.wave++;const n=hf.wave===3?2:Math.min(3,1+hf.wave);G.enemies=[];
  for(let i=0;i<n;i++){const boss=hf.wave===3&&i===0;const id=boss?hf.boss:hf.pool[Math.floor(rand()*hf.pool.length)];const E=ENEMIES[id];const e={uid:E.uid||id,id,name:(boss?'Champion ':'')+E.name,lvl:hf.lvl,x:W+40+i*36,slot:boss?210:ENEMY_X[i],dx:0,yoff:boss?0:ENEMY_Y[i],flip:true,fly:!!E.fly,range:E.range,boss:false,scale:boss?Math.min(E.scale||2,2.5):1,native:!!E.native,nscale:E.nscale||1,hue:E.hue||0,tier:hf.wave-1,gauge:rand()*40,dead:false,enemy:true,status:{},flash:0,traits:(E.traits||[]).slice(),acts:0};Object.assign(e,enemyStats(id,hf.lvl));if(boss){e.maxhp=R(e.maxhp*2);e.traits.push('charge');}e.hp=e.maxhp;setAnim(e,'walk');G.enemies.push(e);}
  G.fs={dmg:0,taps:0,gold:0};G.mode='enter';G.bossFight=false;G.active.forEach(h=>setAnim(h,'idle'));if(hf.wave>1)banner('Wave '+hf.wave+' of 3',hf.wave===3?'the champion':'',1.6);}
function endHordeFight(win){const hf=G.hordeFight;if(!hf)return;G.hordeFight=null;resolveHorde(win);G.active=hf.saved.active;G.zone=hf.saved.zone;G.prog=hf.saved.prog;G.enemies=[];G.projs=[];G.action=null;G.mode='walk';G.enc=3;for(const h of G.roster){h.status={};h.dx=0;if(h.dead){h.dead=false;h.hp=R(h.maxhp*0.3);}}for(const h of G.active)setAnim(h,'walk');layout();G.screen='vael';saveGame();}
// ============================================================ the Catacombs (delve) and road treasure
const RELICS=[{id:'blood',name:'Bloodstone',desc:'+30% attack, lose 2% HP per attack',atk:1.3,bleed:0.02},{id:'mirror',name:'Mirror Charm',desc:'Ability fully charged at the start of every floor',mirror:true},{id:'feather',name:"Hunter's Feather",desc:'Critical hits restore 15 ability charge',feather:15},{id:'idol',name:'Golden Idol',desc:'+60% delve gold, enemies +25% HP',gold:1.6,ehp:1.25},{id:'fang',name:'Wolf Fang',desc:'+25% attack',atk:1.25},{id:'heart',name:'Troll Heart',desc:'+35% max HP',hp:1.35},{id:'leech',name:'Leech Charm',desc:'heal 12% of damage dealt',leech:0.12},{id:'focus',name:'Focus Stone',desc:'abilities charge twice as fast',charge:2},{id:'plate',name:'Ancient Plate',desc:'+40% defense',def:1.4},{id:'lucky',name:'Lucky Coin',desc:'+50% gold in the delve',gold:1.5}];
const DOORS=['fight','fight','fight','elite','chest','shrine','trap','merchant','cursed','swap','rest'];
G.delve=null;G.delveKeys=3;G.keyAt=now();G.delveBest=0;
function keyMax(){return 3+treeLv('b_keys');}function keyPeriod(){return 8*HOUR/tscale()/(1+0.08*treeLv('keys'));}
function keysNow(){const t=now();while(G.delveKeys<keyMax()&&t-G.keyAt>=keyPeriod()){G.delveKeys++;G.keyAt+=keyPeriod();if(G.delveKeys>=keyMax())G.keysSeen=false;}if(G.delveKeys>=keyMax())G.keyAt=t;return G.delveKeys;}
function delveScale(){const d=G.delve;return{lvl:R(4+d.floor*2.2+(G.reforges||0)*6),mult:Math.pow(1.05,d.floor)};}
function startDelve(h){if(keysNow()<1){toast('No keys - one returns every 8 hours');return;}G.delveKeys--;if(G.delveKeys<3&&G.keyAt>now()-1)G.keyAt=now();
  G.stats.delveRuns++;G.delve={hero:h,floor:0,startedAt:now(),bag:{gold:0,ore:0,items:[]},relics:[],saved:{active:G.active.slice(),zone:G.zone,mode:G.mode,prog:G.prog.slice()},hpFrac:h.hp/h.maxhp,busy:false};
  h.dead=false;h.status={};refreshDelveStats();h.hp=h.maxhp;G.active=[h];layout();h.x=h.tx;G.enemies=[];G.projs=[];G.action=null;G.mode='delve';G.screen='road';closeSheet();sfx('cast');banner('The Catacombs','Floor 1 - choose a door',2.5);nextFloor();}
function refreshDelveStats(){const d=G.delve,h=d.hero;refreshStats(h);let hp=h.maxhp*(d.curse||1),atk=h.atk,def=h.def;for(const r of d.relics){if(r.hp)hp*=r.hp;if(r.atk)atk*=r.atk;if(r.def)def*=r.def;}const f=h.hp/h.maxhp;h.maxhp=R(hp);h.atk=R(atk);h.def=R(def);h.hp=R(Math.min(h.maxhp,f*hp));}
function nextFloor(){const d=G.delve;d.floor++;d.doors=[];const pool=DOORS.slice();for(let i=0;i<3;i++){const k=Math.floor(rand()*pool.length);d.doors.push(pool.splice(k,1)[0]);}if(d.floor%10===0)d.doors[0]='boss';else if(d.floor%5===0)d.doors[0]='elite';if(d.relics.find(r=>r.mirror))d.hero.charge=100;d.choose=true;d.timer=10;G.mode='delve';setAnim(d.hero,'idle');}
function delveEnemy(kind){const d=G.delve,sc=delveScale();const Z=ZONES[Math.min(ZONES.length-1,Math.floor(d.floor/4))];const pool=Z.pool;const id=kind==='elite'?ZONES[Math.min(ZONES.length-1,Math.floor(d.floor/4))].boss:pool[Math.floor(rand()*pool.length)];
  const E=ENEMIES[id];const e={uid:E.uid||id,id,name:(kind==='elite'?'':['Catacomb ','Deep ','Abyssal '][Math.min(2,Math.floor(d.floor/8))])+E.name,lvl:sc.lvl,x:W+40,slot:kind==='elite'?(E.native?226:200+8*(E.scale||1)):222,dx:0,yoff:0,flip:true,fly:!!E.fly,range:E.range,boss:!!E.boss,scale:kind==='elite'?Math.min(E.scale||1,2.5):1,native:!!E.native,nscale:E.nscale||1,hue:E.hue||0,tier:Math.min(2,Math.floor(d.floor/8)),gauge:rand()*40,dead:false,enemy:true,status:{},flash:0};
  Object.assign(e,enemyStats(id,sc.lvl));if(kind==='elite'){e.maxhp=R(e.maxhp*1.6);e.atk=R(e.atk*1.2);}if(kind==='boss'){e.maxhp=R(e.maxhp*3);e.atk=R(e.atk*1.4);e.name='Catacomb Lord';e.traits=['charge'];e.acts=0;}const idol=d.relics.find(r=>r.ehp);if(idol)e.maxhp=R(e.maxhp*idol.ehp);e.hp=e.maxhp;e.scale=kind==='elite'?2:kind==='boss'?2.5:1;setAnim(e,'walk');return e;}
function chooseDoor(kind){const d=G.delve;if(!d||!d.choose)return;d.choose=false;const h=d.hero,sc=delveScale();
  if(kind==='fight'||kind==='elite'||kind==='boss'){G.enemies=[delveEnemy(kind)];if(kind==='fight'&&rand()<0.5)G.enemies.push(Object.assign(delveEnemy('fight'),{x:W+80,slot:250,yoff:3}));G.mode='enter';G.delveFight=kind;setAnim(h,'idle');return;}
  if(kind==='chest'){if(rand()<0.6){const it=makeItem(Math.min(ZONES.length-1,Math.floor(d.floor/4)),'boss');d.bag.items.push(it);toast('Chest: '+itemName(it),RANKHEX[it.rank]);}else{const o=R((6+d.floor*3)*sc.mult);d.bag.ore+=o;toast('Chest: +'+o+' ore');}}
  else if(kind==='shrine'){if(rand()<0.5||d.relics.length>=3){const a=R(h.maxhp*0.4);h.hp=Math.min(h.maxhp,h.hp+a);toast('Shrine: healed '+a);sfx('heal');}else{const r=RELICS.filter(x=>!d.relics.includes(x))[Math.floor(rand()*RELICS.filter(x=>!d.relics.includes(x)).length)];d.relics.push(r);refreshDelveStats();toast('Relic: '+r.name+' - '+r.desc,C.goldL);sfx('level');}}
  else if(kind==='trap'){if(rand()<0.35){toast('You slip past the trap');}else{const dmg=R(h.maxhp*0.22);h.hp-=dmg;float(h.x,GROUND-40,fmtNum(dmg),'#ff8a80',true);sfx('hit');G.shake=0.3;toast('A trap bites for '+dmg);if(h.hp<=0){h.hp=0;endDelve(true);return;}}}
  else if(kind==='cursed'){const it=makeItem(Math.min(ZONES.length-1,2+Math.floor(d.floor/4)),'boss');it.rank=Math.min(4,it.rank+1);d.bag.items.push(it);d.curse=(d.curse||1)*0.75;refreshDelveStats();toast('Cursed chest: '+itemName(it)+' - max HP -25% this run',RANKHEX[it.rank]);sfx('death');}
  else if(kind==='swap'){const others=RELICS.filter(x=>!d.relics.includes(x));if(d.relics.length){const out=d.relics[Math.floor(rand()*d.relics.length)];const nr=others[Math.floor(rand()*others.length)];d.relics[d.relics.indexOf(out)]=nr;refreshDelveStats();toast(out.name+' becomes '+nr.name+' - '+nr.desc,C.goldL);}else{const nr=others[Math.floor(rand()*others.length)];d.relics.push(nr);refreshDelveStats();toast('Relic: '+nr.name+' - '+nr.desc,C.goldL);}sfx('level');}
  else if(kind==='rest'){d.curse=1;refreshDelveStats();const a=R(h.maxhp*0.6);h.hp=Math.min(h.maxhp,h.hp+a);toast('You rest. Healed '+fmtNum(a)+', curses lifted');sfx('heal');}
  else if(kind==='merchant'){const price=R(30*d.floor*sc.mult);if(G.gold>=price){G.gold-=price;h.hp=h.maxhp;toast('The merchant patches you up for '+fmtNum(price)+' gold');}else toast('The merchant wants '+fmtNum(price)+' gold - you have '+fmtNum(G.gold));}
  nextFloor();}
function delveWin(){const d=G.delve,sc=delveScale();const gold=R((20+d.floor*10)*sc.mult*(d.relics.find(r=>r.gold)?1.5:1)*bless('gold'));d.bag.gold+=gold;float(W/2,SCENE_Y+40,'+'+fmtNum(gold)+' gold',C.goldL,true);
  if(G.delveFight==='elite'){const it=makeItem(Math.min(ZONES.length-1,1+Math.floor(d.floor/4)),'boss');d.bag.items.push(it);toast('The elite drops '+itemName(it),RANKHEX[it.rank]);}
  if(G.delveFight==='boss'){for(let k=0;k<2;k++){const it=makeItem(Math.min(ZONES.length-1,2+Math.floor(d.floor/4)),'boss');d.bag.items.push(it);}const others=RELICS.filter(x=>!d.relics.includes(x));if(others.length&&d.relics.length<3){const nr=others[Math.floor(rand()*others.length)];d.relics.push(nr);refreshDelveStats();}toast('The Catacomb Lord falls - two items and a relic',C.goldL);}
  G.enemies=[];G.mode='delve';setTimeout(()=>{if(G.delve)nextFloor();},600);}
function endDelve(died,fled){const d=G.delve;if(!d)return;const h=d.hero;const keep=died?0.6:fled?0.8:1;const gold=R(d.bag.gold*keep),ore=R(d.bag.ore*keep);G.gold+=gold;G.ore+=ore;let kept=0;for(const it of d.bag.items){if(!died||rand()<0.6){if(G.pack.length<15){G.pack.push(it);kept++;}else{G.ore+=(it.rank+1)*4;}}}
  G.delveBest=Math.max(G.delveBest||0,d.floor-(died?1:0));G.run.bestFloor=Math.max(G.run.bestFloor||0,d.floor-(died?1:0));const hrs=(now()-d.startedAt)/HOUR;let roadNote='';if(hrs>0.02){const zsave=G.zone;G.zone=d.saved.zone;const rg=offlineGains(Math.min(8,hrs),0.5);G.zone=zsave;if(rg.fights>0){G.gold+=rg.gold;G.ore+=rg.ore;for(const a of d.saved.active){a.xp+=rg.xp;while(a.xp>=xpNeed(a.lvl)){a.xp-=xpNeed(a.lvl);a.lvl++;refreshStats(a);a.hp=a.maxhp;}}roadNote=' · the party won '+rg.fights+' fights above';}}
  G.active=d.saved.active;G.zone=d.saved.zone;G.prog=d.saved.prog;G.enemies=[];G.projs=[];G.action=null;G.mode='walk';G.enc=3;G.delve=null;h.status={};refreshStats(h);h.hp=Math.max(1,R(h.maxhp*(died?0.3:d.hpFrac)));h.dead=false;for(const a of G.active){a.dx=0;setAnim(a,'walk');}layout();
  banner(died?'Lost in the catacombs':fled?'Fled the catacombs':'Back to the surface',(died?'Kept 60%: ':fled?'Kept 80%: ':'')+'+'+fmtNum(gold)+' gold, +'+ore+' ore, '+kept+' item'+(kept===1?'':'s')+' · floor '+d.floor+roadNote,4.5,'any');G.screen='vael';saveGame();}
function drawDelveOverlay(){const d=G.delve;if(!d)return;const h=d.hero;
  ctx.globalAlpha=0.8;frame(4,SCENE_Y+4,166,36,'rgba(22,26,44,0.75)');ctx.globalAlpha=1;text(9,SCENE_Y+7,'Catacombs · Floor '+d.floor+(d.curse&&d.curse<1?' · cursed':''),'sb',d.curse&&d.curse<1?'#ff8a80':C.goldL);text(9,SCENE_Y+17,fitText('Best '+(G.delveBest||0)+' · bag '+fmtNum(d.bag.gold)+'g, '+d.bag.ore+' ore, '+d.bag.items.length+' items','xs',156),'xs',C.muted);
  d.relics.forEach((r,i)=>{icon('crystal',12+i*14,SCENE_Y+28,4);});
  button(W-92,SCENE_Y+4,52,18,false);text(W-66,SCENE_Y+8.5,'Leave','xs',C.cream,'center');hit(W-92,SCENE_Y+4,52,18,()=>{endDelve(false,G.mode!=='delve');});
  if(d.choose){dimRect(0,SCENE_Y+44,W,160,0.55);text(W/2,SCENE_Y+52,'Choose a door · '+Math.ceil(d.timer)+'s','sb',C.goldL,'center');
    const labels={fight:['Fight','a monster guards it'],elite:['Elite','a champion - better loot'],boss:['Lord','a catacomb lord - relic and gear'],chest:['Chest','gear or ore'],shrine:['Shrine','healing or a relic'],trap:['Trap','risky - might bite'],merchant:['Merchant','full heal for '+fmtNum(R(30*d.floor*delveScale().mult))+' gold'],cursed:['Cursed chest','rare gear, but -25% HP'],swap:['Altar','swap a relic for another'],rest:['Rest','heal 60%, lift curses']};
    d.doors.forEach((k,i)=>{const x=10+i*86,y=SCENE_Y+66,gold=k==='elite'||k==='chest';button(x,y,80,54,gold);const ic={fight:'sword',elite:'shield',boss:'crystal',chest:'coin',shrine:'heal',trap:'x',merchant:'ore',cursed:'ring',swap:'nodes',rest:'tent'}[k];icon(ic,x+34,y+6,gold?4:2);text(x+40,y+22,labels[k][0],'sb',gold?C.goldL:C.cream,'center');text(x+40,y+34,fitText(labels[k][1],'xs',76),'xs',C.muted,'center');hit(x,y,80,54,()=>chooseDoor(k));});
    text(W/2,SCENE_Y+130,'Relics: '+(d.relics.length?d.relics.map(r=>r.name).join(', '):'none yet'),'xs',C.dimt,'center');}}
// treasure on the road
G.treasure=null;G.treasureAt=0;
const CHEST=["..oooooooooo..",".oWWWWWWWWWWo.","oWwwwwwwwwwwWo","oWWWWWWWWWWWWo","oooooooooooooo","oWWWWWoggoWWWo","oWWWWWogggWWWo","oWWWWWoggoWWWo","oWWWWWWWWWWWWo",".oooooooooooo."];
function spawnTreasure(){G.treasure={wx:G.scroll+W+20+rand()*40,y:GROUND-26-rand()*10,t:0,life:1e9,kind:(rand()<0.015&&G.wins>=10)?'gear':rand()<0.3?'ore':'gold'};if(G.treasure.kind==='gear')G.treasure.rank=rollRank(G.zone);}
function treasureX(){return G.treasure.wx-G.scroll;}
function drawTreasure(){const t=G.treasure;if(!t)return;const x=R(treasureX());if(x<-20){G.treasure=null;return;}const pu=0.5+0.5*Math.sin(RT*6);
  const g=ctx.createRadialGradient(x+14,t.y-8,1,x+14,t.y-8,22);g.addColorStop(0,'rgba(255,240,170,'+(0.45*pu)+')');g.addColorStop(1,'rgba(255,240,170,0)');ctx.fillStyle=g;ctx.fillRect(x-8,t.y-30,44,44);
  const rc=t.kind==='gear'?RANKHEX[t.rank||0]:t.kind==='ore'?'#6e7480':'#8a5a2c';const pal=Object.assign({},CPAL,{W:rc,w:rc,g:'#f1d778'});pixGrid(CHEST,x,t.y-14,2,pal);
  for(let k=0;k<3;k++){const a=RT*3+k*2.1;px(x+14+R(Math.cos(a)*16),t.y-8+R(Math.sin(a)*10),1,1,'#fff');}hit(x-6,t.y-30,42,44,grabTreasure);}
function grabTreasure(){const t=G.treasure;if(!t)return;const tx0=treasureX()+14;G.treasure=null;const Z=ZONES[G.zone],L=R(Z.lv+Math.min(G.prog[G.zone],Z.fights)*0.3);sfx('coin');
  if(t.kind==='gear'&&G.pack.length<15){const it=makeItem(G.zone,t.rank);G.pack.push(it);float(tx0,t.y-16,itemName(it),RANKHEX[it.rank],true);toast('Found: '+itemName(it),RANKHEX[it.rank]);}
  else if(t.kind==='ore'){const o=R((2+L*0.4)*(1+Math.floor(L/6))*refMult());G.ore+=o;float(tx0,t.y-16,'+'+fmtNum(o)+' ore',C.muted,true);}
  else{const g=R((5+L*3)*Math.pow(1.05,L)*bless('gold')*refMult());G.gold+=g;float(tx0,t.y-16,'+'+fmtNum(g)+' gold',C.goldL,true);}}

// ============================================================ saving & offline progress
const SAVE_KEY='crystal_road_save_v1';
function storeGet(){try{return localStorage.getItem(SAVE_KEY);}catch(e){return null;}}
function storeSet(v){try{localStorage.setItem(SAVE_KEY,v);return true;}catch(e){return false;}}
function storeClear(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}
function serialize(){return JSON.stringify({v:1,t:now(),zone:G.zone,prog:G.prog,cleared:G.cleared,gold:G.gold,ore:G.ore,dust:G.dust,wins:G.wins,campfireDone:G.campfireDone,tree:G.tree,autoCast:G.autoCast,music:G.music,sfx:G.sfx!==false,autoUntil:G.autoUntil,reforges:G.reforges||0,surge:G.surge||0,chestAt:G.chestAt||0,warpAt:G.warpAt||0,far:G.far||[],run:G.run,stats:G.stats,simT:G.simT||0,zoneT:G.zoneT||[],treeTab:G.treeTab,delveKeys:G.delveKeys,keyAt:G.keyAt,delveBest:G.delveBest||0,speedUntil:G.speedUntil||0,autoSalvage:G.autoSalvage||0,musicVol:G.musicVol,sfxVol:G.sfxVol,tutDone:!!G.tutDone,vaelSeen:!!G.vaelSeen,treeSeen:!!G.treeSeen,keysSeen:!!G.keysSeen,dustFrac:G.dustFrac||0,heroesSeen:G.heroesSeen||[],cpHinted:!!G.cpHinted,endlessSeen:!!G.endlessSeen,endMilestone:G.endMilestone||0,renown:G.renown||0,boostSeen:!!G.boostSeen,vaelNew:!!G.vaelNew,itemSeq,
  roster:G.roster.map(h=>({id:h.id,lvl:h.lvl,xp:h.xp,hp:h.hp,abLvl:h.abLvl,eq:h.eq,tier:h.tier||0,talents:h.talents||{}})),active:G.active.map(h=>h.id),pack:G.pack,
  quests:G.quests.map(q=>({hero:q.hero.id,q:q.q.id,end:q.end})),castle:G.castle,fast:G.fast});}
function saveGame(){if(G.title||G.noSave||G.delve||G.hordeFight)return;if(storeSet(serialize()))G.lastSaveT=now();}
function loadGame(){const raw=storeGet();if(!raw)return false;let d;try{d=JSON.parse(raw);}catch(e){return false;}if(!d||d.v!==1)return false;
  while(d.prog.length<ZONES.length)d.prog.push(0);while(d.cleared.length<ZONES.length)d.cleared.push(false);
  Object.assign(G,{zone:d.zone,prog:d.prog,cleared:d.cleared,gold:d.gold,ore:d.ore,dust:d.dust,wins:d.wins,campfireDone:d.campfireDone,tree:d.tree||{},autoCast:!!d.autoCast,music:d.music!==false,sfx:d.sfx!==false,reforges:d.reforges||0,surge:d.surge||0,chestAt:d.chestAt||0,warpAt:d.warpAt||0,far:d.far||[],run:d.run||{start:d.t,fights:0,bosses:0,gold:0,bestFloor:0},stats:Object.assign({kills:0,bosses:0,hit:0,gold:0,ore:0,items:0,legendary:0,hordes:0,offline:0,defeats:0,delveRuns:0,taps:0},d.stats||{}),simT:d.simT||0,zoneT:d.zoneT||[],treeTab:d.treeTab||'Party',delveKeys:d.delveKeys==null?3:d.delveKeys,keyAt:d.keyAt||now(),delveBest:d.delveBest||0,speedUntil:d.speedUntil||0,autoSalvage:d.autoSalvage||0,musicVol:d.musicVol==null?0.55:d.musicVol,sfxVol:d.sfxVol==null?1:d.sfxVol,tutDone:!!d.tutDone,vaelSeen:!!d.vaelSeen,treeSeen:!!d.treeSeen,keysSeen:!!d.keysSeen,dustFrac:d.dustFrac||0,heroesSeen:d.heroesSeen||[],cpHinted:!!d.cpHinted,endlessSeen:!!d.endlessSeen,endMilestone:d.endMilestone||0,renown:d.renown||0,boostSeen:!!d.boostSeen,vaelNew:!!d.vaelNew,autoUntil:d.autoUntil||0,fast:!!d.fast});padZones();
  itemSeq=d.itemSeq||itemSeq;G.pack=d.pack||[];
  G.roster=[];for(const r of d.roster){const def=HEROES.find(x=>x.id===r.id);if(!def)continue;const h=mkHero(def);h.lvl=r.lvl;h.xp=r.xp;h.abLvl=r.abLvl||1;h.eq=r.eq||{};h.tier=r.tier||0;h.uid=heroUid(h);h.talents=r.talents||{};refreshStats(h);h.hp=Math.min(h.maxhp,r.hp>0?r.hp:h.maxhp);G.roster.push(h);}
  G.active=(d.active||[]).map(id=>G.roster.find(h=>h.id===id)).filter(Boolean);if(!G.active.length&&G.roster.length)G.active=[G.roster[0]];
  G.active.forEach(h=>{h.x=null;});layout();
  G.quests=(d.quests||[]).map(q=>({hero:G.roster.find(h=>h.id===q.hero),q:QUESTS.find(x=>x.id===q.q),end:q.end})).filter(q=>q.hero&&q.q);
  if(d.castle){G.castle=d.castle;G.castle.walk=[];}
  G.enemies=[];G.projs=[];G.action=null;G.mode='walk';G.enc=3;G.delve=null;G.hordeFight=null;if(G.castle)G.castle.hordeDue=false;
  offlineReport(d.t);return true;}
function offlineGains(hours,eff){const fights=Math.floor(hours*3600/22*eff);const Z=ZONES[G.zone],L=Z.endless?endlessLv(Z,G.prog[G.zone]):R(Z.lv+Math.min(G.prog[G.zone],Z.fights-1)*0.45+(G.cleared[G.zone]?3:0));const per=1.8;
  return{fights,gold:R(fights*per*(3+2*L)*Math.pow(1.05,L)*bless('gold')*refMult()),xp:R(fights*per*(6+3*L)*Math.pow(1.04,L)*bless('xp')),ore:R(fights*0.35*1.5*(1+Math.floor(L/6))*refMult())};}
function offlineReport(lastT){const elapsed=Math.max(0,(now()-lastT)/1000);if(elapsed<120)return;
  const hours=Math.min(8+0.5*treeLv('offline')+(built('shrine')?2:0),elapsed/3600),eff=G.autoUntil>lastT?0.65:0.5;const g=offlineGains(hours,eff),fights=g.fights;if(fights<1)return;
  const gold=g.gold,xp=g.xp,ore=g.ore;
  G.gold+=gold;G.ore+=ore;G.stats.offline+=fights;const ups=[],levels=[];for(const h of G.active){const before=h.lvl;h.xp+=xp;let n=0;while(h.xp>=xpNeed(h.lvl)){h.xp-=xpNeed(h.lvl);h.lvl++;n++;}if(n){refreshStats(h);h.hp=h.maxhp;ups.push(h.name+' +'+n);}levels.push({name:h.name,from:before,to:h.lvl});}
  const items=[];const nItems=Math.min(3,Math.floor(fights*0.04));for(let i=0;i<nItems;i++){const it=makeItem(G.zone);if(G.autoSalvage&&it.rank<G.autoSalvage){G.ore+=(it.rank+1)*4;}else if(G.pack.length<15){G.pack.push(it);items.push(it);}else G.ore+=(it.rank+1)*4;}
  let best='The party held the road';const bi=items.slice().sort((a,b)=>b.rank-a.rank)[0];const bl=levels.slice().sort((a,b)=>(b.to-b.from)-(a.to-a.from))[0];if(bi&&bi.rank>=2)best='Found a '+itemName(bi);else if(bl&&bl.to-bl.from>=3)best=bl.name+' climbed '+(bl.to-bl.from)+' levels';else if(fights>=100)best=fights+' battles without a loss';
  G.offline={hours,fights,gold,ore,ups,levels,items,best,doubled:false};openSheet('welcome');}
function drawWelcome(s,y0){const o=G.offline;text(16,y0+8,'While you were away','h',C.goldL);text(16,y0+22,fmtT(o.hours*3600)+' on the road · '+fmtNum(o.fights)+' battles in '+ZONES[G.zone].name,'xs',C.muted);
  let y=y0+36;icon('coin',20,y,4);text(36,y+1,'+'+fmtNum(o.gold)+' gold'+(o.doubled?'  (doubled)':''),'sb',C.goldL);icon('ore',150,y,0);text(166,y+1,'+'+fmtNum(o.ore)+' ore'+(o.doubled?'  (x2)':''),'sb',C.cream);y+=16;
  (o.levels||[]).forEach((l,i)=>{const x=i%2?140:20,yy=y+Math.floor(i/2)*11;text(x,yy,l.name,'xs',C.cream);text(x+50,yy,'Lv '+l.from+(l.to>l.from?' → '+l.to:''),'xs',l.to>l.from?C.goldL:C.muted);});y+=Math.ceil((o.levels||[]).length/2)*11+4;
  if(o.items&&o.items.length){text(20,y,'Found: '+o.items.map(itemName).join(', '),'xs',C.cream);y+=11;}
  text(20,y,'Best moment: '+o.best,'xs','#bbdefb');y+=14;
  if(!o.doubled){button(16,y,110,18,true);icon('play',22,y+4,4);text(75,y+5,'Double it (ad)','sb',C.goldL,'center');hit(16,y,110,18,()=>{G.gold+=o.gold;G.ore+=o.ore;o.gold*=2;o.ore*=2;o.doubled=true;sfx('coin');toast('Rewards doubled');});}
  button(140,y,110,18,false);text(195,y+5,o.doubled?'Onward':'Collect','sb',C.cream,'center');hit(140,y,110,18,()=>{closeSheet();G.offline=null;});
  text(16,y+24,'Offline earns at half pace, up to '+(8+0.5*treeLv('offline')+(built('shrine')?2:0))+' hours.','xs',C.dimt);}
setInterval(()=>{if(!G.title)saveGame();},15000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveGame();});
addEventListener('pagehide',saveGame);

// ============================================================ sheets (overlays)
function openSheet(kind,data={}){G.sheet={kind,...data};}
function closeSheet(){G.sheet=null;}
function drawSheet(){const s=G.sheet;if(!s)return;tx.clearRect(0,0,tc.width,tc.height);dimRect(0,0,W,H,0.75);hit(0,0,W,H,()=>{if(s.kind!=='welcome')closeSheet();});
  const camp=G.roster.filter(h=>!G.active.includes(h)),free=G.roster.filter(h=>heroStatus(h)==='camp');
  const hh=s.kind==='horde'?150:s.kind==='welcome'?(122+Math.ceil(((G.offline&&G.offline.levels)||[]).length/2)*11+((G.offline&&G.offline.items&&G.offline.items.length)?11:0)):s.kind==='blueprints'?36+30*Object.keys(STRUCTS).length:s.kind==='stats'?190:s.kind==='reforge'?164:s.kind==='delve'?54+30*G.roster.filter(h=>heroStatus(h)!=='quest').length:s.kind==='ad'?196:s.kind==='reforge'?96:s.kind==='speedad'?92:s.kind==='autoad'?92:s.kind==='welcome'?122:s.kind==='garrison'?46+30*Math.max(1,G.roster.filter(h=>['camp','garrison'].includes(heroStatus(h))).length):s.kind==='swap'?118+30*Math.max(1,camp.length):s.kind==='send'?(s.hero?40+38*QUESTS.length:40+30*Math.max(1,free.length)):s.kind==='settings'?404:s.kind==='backup'?132:96;
  const y0=Math.max(40,R((H-48-hh)/2));frame(8,y0,254,hh,C.navy,C.goldL);hit(8,y0,254,hh,()=>{});
  if(s.kind!=='welcome'){icon('x',242,y0+8,0);hit(232,y0,30,28,closeSheet);}
  if(s.kind==='swap'){text(16,y0+8,'Party',"h",C.goldL);text(16,y0+20,'Tap a marcher, then a hero at camp to trade places.','xs',C.muted);text(16,y0+29,'Two marchers to reorder. Left slot is the front.','xs',C.muted);
    for(let i=0;i<4;i++){const x=16+i*60,h=G.active[i],sel=s.pick===i;button(x,y0+44,54,44,sel);if(h){drawSprite(h,x+27,y0+78,0,'idle',false);text(x+27,y0+46,h.name,'xs',sel?C.goldL:C.cream,'center');}else text(x+27,y0+62,'empty','xs',C.dimt,'center');
      hit(x,y0+44,54,44,()=>{if(s.pick==null){if(h)s.pick=i;}else if(s.pick===i)s.pick=null;else{if(h){[G.active[s.pick],G.active[i]]=[G.active[i],G.active[s.pick]];layout();}s.pick=null;}});}
    if(s.pick==null&&s.slot!=null&&G.active[s.slot])s.pick=s.slot,s.slot=null;
    if(s.pick!=null&&G.active.length>1){button(180,y0+92,74,14,true);text(217,y0+94.5,'Send to camp','xs',C.goldL,'center');hit(180,y0+92,74,14,()=>{const h=G.active[s.pick];if(!h)return;if(G.action&&G.action.u===h){G.action=null;h.dx=0;}G.active.splice(s.pick,1);h.status={};layout();s.pick=null;toast(h.name+' heads to camp');});}
    text(16,y0+96,'At camp','sb',C.muted);let y=y0+108;
    if(!camp.length)text(16,y+4,'No one at camp yet - recruits join as you recover shards.','xs',C.dimt);
    for(const h of camp){if(y>H-80)break;const st=heroStatus(h),busy=st==='quest';if(st==='garrison')text(46,y+14,'On the walls - tap to recall and bring in','xs',C.goldL);px(14,y,242,26,C.band);ctx.globalAlpha=busy?0.45:1;drawSprite(h,28,y+22,0,'idle',false);ctx.globalAlpha=1;
      text(46,y+4,h.name+' · '+CLASSES[h.cls].name+' Lv '+h.lvl,'s',busy?C.dimt:C.cream);if(st!=='garrison')text(46,y+14,busy?'On a quest':(s.pick!=null?'Tap to bring in':'Resting'),'xs',busy?C.dimt:(s.pick!=null?C.goldL:C.muted));
      if(!busy){button(196,y+5,54,16,s.pick!=null);text(223,y+8,s.pick!=null?'Swap in':'Add','xs',C.cream,'center');
        hit(14,y,242,26,()=>{const inBattle=G.mode==='battle'||G.mode==='enter';if(heroStatus(h)==='garrison')recallHero(h);
          if(s.pick!=null){const ia=s.pick;const out=G.active[ia];if(G.action&&G.action.u===out){G.action=null;out.dx=0;}G.active[ia]=h;h.dead=false;h.status={};if(h.hp<=0)h.hp=R(h.maxhp*0.5);h.x=-30;setAnim(h,inBattle?'idle':'walk');s.pick=null;toast(h.name+' takes '+out.name+"'s place");}
          else if(G.active.length<4){G.active.push(h);h.dead=false;h.status={};h.x=-30;setAnim(h,inBattle?'idle':'walk');toast(h.name+(inBattle?' runs in to join the fight':' falls in'));}else toast('Pick a marcher to replace first');layout();});}
      y+=30;}}
  else if(s.kind==='send'){text(16,y0+8,'Send a hero','h',C.goldL);
    if(!s.hero){text(16,y0+20,'Who goes?','xs',C.muted);let y=y0+34;for(const h of free){px(14,y,242,26,C.band);drawSprite(h,28,y+22,0,'idle',false);text(46,y+4,h.name+' · '+CLASSES[h.cls].name+' Lv '+h.lvl,'s',C.cream);button(196,y+5,54,16,true);text(223,y+8,'Choose','xs',C.goldL,'center');hit(14,y,242,26,()=>{s.hero=h;});y+=30;}}
    else{text(16,y0+20,s.hero.name+' will go on a…','xs',C.muted);let y=y0+34;for(const q of QUESTS){px(14,y,242,34,C.band);icon('hourglass',20,y+10,0);text(38,y+4,q.name+' · '+fmtT(questDur(q)),'sb',C.cream);text(38,y+16,q.desc+(QUEST_CLASS[q.id].includes(s.hero.cls)?'  ·  class bonus':'  ·  favors '+QUEST_CLASS[q.id].map(c=>CLASSES[c].name).join('/')),'xs',C.muted);
      button(196,y+9,54,16,true);text(223,y+12,'Send','xs',C.goldL,'center');hit(14,y,242,34,()=>{if(G.quests.length>=questSlots()){toast('No free quest slots');return;}startQuest(s.hero,q);closeSheet();});y+=38;}}}
  else if(s.kind==='delve'){text(16,y0+8,'Into the Catacombs','h',C.goldL);text(16,y0+22,'One hero goes down alone. Each floor, pick a door within 10s.','xs',C.muted);text(16,y0+31,'Leave whenever you choose; die and you keep 60% of the bag.','xs',C.muted);let y=y0+44;
    for(const h of G.roster){if(y>H-90)break;if(heroStatus(h)==='quest')continue;px(14,y,242,26,C.band);drawSprite(h,28,y+22,0,'idle',false);text(46,y+4,h.name+' · '+CLASSES[h.cls].name+' Lv '+h.lvl,'s',C.cream);text(46,y+14,heroStatus(h)==='marching'?'Marching - the party waits for them':'At camp','xs',C.muted);button(196,y+5,54,16,true);text(223,y+8,'Descend','xs',C.goldL,'center');hit(14,y,242,26,()=>startDelve(h));y+=30;}}
  else if(s.kind==='horde'){const C2=G.castle,p=C2.prep||(C2.prep={}),D=defense(),S=hordeStrength(),due=C2.hordeDue;text(16,y0+8,due?'The horde is at the gate':'The next horde','h',due?'#ff8a80':C.goldL);text(16,y0+22,'Horde · '+hordeTier()+'   Your defense '+D.total+(D.total>=S?' - holds':' - falls'),'xs',D.total>=S?'#96e6aa':'#ff9696');
    let y=y0+36;const rows=[['Shore up the walls','+25% wall defense this horde',p.walls?null:prepCost('walls'),()=>{p.walls=true;}],['Hire mercenaries','+'+(8+castleLv()*2)+' defense this horde',p.merc?null:prepCost('merc'),()=>{p.merc=true;}]];
    for(const[t,sub,cost,fn]of rows){px(14,y,242,26,C.band);text(20,y+4,t,'sb',cost==null?C.goldL:C.cream);text(20,y+14,cost==null?'Prepared':sub,'xs',C.muted);if(cost!=null){const can=G.gold>=cost;button(196,y+5,54,16,can);text(223,y+8,fmtNum(cost),'xs',can?C.goldL:C.muted,'center');hit(196,y+5,54,16,()=>{if(G.gold<cost){toast('Need '+fmtNum(cost)+' gold');return;}G.gold-=cost;fn();sfx('coin',true);});}y+=30;}
    px(14,y,242,26,C.band);text(20,y+4,due?'Defend the gate':'Sound the horns','sb',C.goldL);text(20,y+14,due?'Fight it now with your party and garrison for full rewards':'Call the horde early and fight it at the gate','xs',C.muted);button(196,y+5,54,16,true);text(223,y+8,'Fight','xs',C.goldL,'center');hit(196,y+5,54,16,()=>{closeSheet();startHordeFight();});y+=30;
    text(16,y+2,due?'Leave it and it resolves on its own in a few minutes.':'Or let it arrive and resolve against your defense.','xs',C.dimt);}
  else if(s.kind==='blueprints'){text(16,y0+8,'Blueprints','h',C.goldL);text(16,y0+22,'Every boss drops the plans for one structure. Build them here.','xs',C.muted);let y=y0+34;const bp=G.castle.bp||{};
    for(const k of Object.keys(STRUCTS)){if(y>H-90)break;const st=STRUCTS[k],have=!!bp[k],isB=built(k);px(14,y,242,26,C.band);if(have){text(20,y+4,st.name+(isB?' - built':''),'sb',isB?C.goldL:C.cream);text(20,y+14,st.desc,'xs',C.muted);if(!isB){const can=G.gold>=st.cost;button(196,y+5,54,16,can);text(223,y+8,'Build '+fmtNum(st.cost),'xs',can?C.goldL:C.muted,'center');hit(196,y+5,54,16,()=>{if(G.gold<st.cost){toast('Need '+fmtNum(st.cost)+' gold');return;}G.gold-=st.cost;G.castle.built=G.castle.built||{};G.castle.built[k]=true;sfx('level',true);toast(st.name+' built: '+st.desc,C.goldL);});}}
      else{text(20,y+4,'? ? ?','sb',C.dimt);text(20,y+14,'Plans held by '+ENEMIES[st.boss].name,'xs',C.dimt);}y+=30;}}
  else if(s.kind==='garrison'){text(16,y0+8,'Garrison','h',C.goldL);text(16,y0+20,garrisonHeroes().length+' of '+garrisonSlots()+' posts · raise the walls for more','xs',C.muted);let y=y0+34;
    for(const h of G.roster){if(y>H-90)break;const st=heroStatus(h);if(st==='marching'||st==='quest')continue;const posted=st==='garrison';px(14,y,242,26,C.band);drawSprite(h,28,y+22,0,'idle',false);text(46,y+4,h.name+' · '+CLASSES[h.cls].name+' Lv '+h.lvl,'s',C.cream);text(46,y+14,posted?'On the walls · +'+fmtNum(garrisonXp(h))+' XP per hour':'At camp','xs',posted?C.goldL:C.muted);
      button(196,y+5,54,16,!posted);text(223,y+8,posted?'Recall':'Post','xs',posted?C.cream:C.goldL,'center');hit(14,y,242,26,()=>{if(posted)recallHero(h);else postHero(h);});y+=30;}
    if(y===y0+34)text(16,y+4,'No one at camp - send someone back from the road first.','xs',C.dimt);}
  else if(s.kind==='backup'){text(16,y0+8,'Save backup','h',C.goldL);text(16,y0+22,'Your progress lives only on this device. Copy a code and keep it','xs',C.muted);text(16,y0+31,'in Notes or a message; paste it on any phone to restore.','xs',C.muted);
    button(16,y0+48,110,20,true);text(71,y0+53,'Copy save code','sb',C.goldL,'center');hit(16,y0+48,110,20,()=>{copySaveCode();});
    button(140,y0+48,110,20,false);text(195,y0+53,'Paste save code','sb',C.cream,'center');hit(140,y0+48,110,20,()=>{pasteSaveCode();});
    if(G.backupMsg&&RT-(G.backupMsgT||0)<6)text(16,y0+78,fitText(G.backupMsg,'xs',236),'xs',C.goldL);
    text(16,y0+96,'Codes carry everything: heroes, gear, Vael, tree, blessings.','xs',C.dimt);text(16,y0+105,'Last saved '+(G.lastSaveT?fmtT((now()-G.lastSaveT)/1000)+' ago':'this session')+'.','xs',C.dimt);}
  else if(s.kind==='autoad'){text(16,y0+8,'Auto-cast','h',C.goldL);text(16,y0+22,'Watch a short ad and your heroes cast their abilities','xs',C.muted);text(16,y0+31,'on their own for four hours, on the road and while away.','xs',C.muted);
    button(16,y0+56,110,20,true);icon('play',22,y0+60,4);text(71,y0+61,'Watch ad (placeholder)','xs',C.goldL,'center');hit(16,y0+56,110,20,()=>{G.autoUntil=Math.max(now(),G.autoUntil)+4*3600*1000;G.autoCast=true;toast('Auto-cast active for four hours');closeSheet();});
    button(140,y0+56,110,20,false);text(195,y0+61,'Not now','xs',C.cream,'center');hit(140,y0+56,110,20,closeSheet);}
  else if(s.kind==='speedad'){text(16,y0+8,'4× speed','h',C.goldL);text(16,y0+22,'Watch a short ad and the road runs at four times','xs',C.muted);text(16,y0+31,'speed for the next two hours. Otherwise, back to 1×.','xs',C.muted);
    button(16,y0+56,110,20,true);icon('play',22,y0+60,4);text(71,y0+61,'Watch ad (placeholder)','xs',C.goldL,'center');hit(16,y0+56,110,20,()=>{G.speed=4;G.speedUntil=Math.max(now(),G.speedUntil)+2*3600*1000;toast('4× speed for two hours');closeSheet();});
    button(140,y0+56,110,20,false);text(195,y0+61,'Back to 1×','xs',C.cream,'center');hit(140,y0+56,110,20,()=>{G.speed=1;closeSheet();});}
  else if(s.kind==='reforge'){const r=G.run,best=Math.max(...G.roster.map(h=>h.lvl)),hrs=(now()-r.start)/HOUR;text(16,y0+8,'Run '+((G.reforges||0)+1)+' - the summary','h',C.goldL);
    const rows=[['Time on the road',hrs>=1?hrs.toFixed(1)+' h':Math.round(hrs*60)+' min'],['Fights won',fmtNum(r.fights)],['Bosses beaten',String(r.bosses)],['Gold earned',fmtNum(r.gold)],['Deepest catacomb floor',String(r.bestFloor||0)],['Endless Road this run','Fight '+(r.endless||0)],['Highest hero level',String(best)]];
    rows.forEach(([k,v],i)=>{const y=y0+24+i*11;text(20,y,k,'xs',C.muted);text(250,y,v,'xsb',C.cream,'right');});const ty=y0+24+rows.length*11+6;
    text(16,ty,'Reforge for +'+reforgeGain()+' dust. You keep your heroes, talents, gear,','xs','#bbdefb');text(16,ty+9,'Vael, the tree and blessings. Gear upgrades pay back half their ore.','xs','#bbdefb');
    button(16,ty+24,110,22,true);text(71,ty+31,'Begin run '+((G.reforges||0)+2),'sb',C.goldL,'center');hit(16,ty+24,110,22,doReforge);button(140,ty+24,110,22,false);text(195,ty+31,'Not yet','xs',C.cream,'center');hit(140,ty+24,110,22,closeSheet);}
  else if(s.kind==='stats'){const st=G.stats;const rows=[['Enemies defeated',fmtNum(st.kills)],['Bosses defeated',String(st.bosses)],['Endless Road best','Fight '+Math.max(G.prog[ZONES.length-1]||0,(G.far||[])[ZONES.length-1]||0)],['Renown',fmtNum(G.renown||0)+' (+'+f1((renownStat()-1)*100)+'% stats, +'+f1((renownGold()-1)*100)+'% gold)'],['Highest hit',fmtNum(st.hit)],['Gold earned',fmtNum(st.gold)],['Items found',String(st.items)],['Sunforged found',String(st.legendary)],['Taps',fmtNum(st.taps)],['Hordes repelled',String(st.hordes)],['Offline fights',fmtNum(st.offline)],['Catacomb runs',String(st.delveRuns)],['Deepest floor',String(G.delveBest||0)],['Reforges',String(G.reforges||0)],['Defeats',String(st.defeats||0)],['Road time',fmtT(G.simT||0)]];
    text(16,y0+8,'Statistics','h',C.goldL);rows.forEach(([k,v],i)=>{const y=y0+24+i*11;text(20,y,k,'xs',C.muted);text(250,y,v,'xsb',C.cream,'right');});}
  else if(s.kind==='welcome'){drawWelcome(s,y0);}
  else if(s.kind==='settings'){text(16,y0+8,'Settings','h',C.goldL);
    const rows=[['Music  '+R((G.musicVol==null?0.55:G.musicVol)*100)+'%',G.music,()=>{setMusic(!G.music);}],['Sound effects  '+R((G.sfxVol==null?1:G.sfxVol)*100)+'%',G.sfx!==false,()=>{G.sfx=G.sfx===false?true:false;}],['Dev: +1T gold, ore and dust',false,()=>{G.gold+=1e12;G.ore+=1e12;G.dust+=1e12;toast('Treasury topped up');}],['Dev: horde arrives now',false,()=>{G.castle.hordeAt=now();castleTick();}],['Statistics',false,()=>{openSheet('stats');}],['Layout: H '+H+' · scale '+SC.toFixed(2)+' · win '+innerWidth+'x'+innerHeight,false,()=>{const cs=getComputedStyle(wrapEl);toast('wrap '+wrapEl.clientHeight+' pad '+cs.paddingTop+'/'+cs.paddingBottom+' vv '+(window.visualViewport?Math.round(window.visualViewport.height):'-')+' scr '+screen.width+'x'+screen.height+' ins '+JSON.stringify(insets()));}],['Dev timer: road '+fmtT(G.simT||0)+' · this zone '+fmtT((G.zoneT||[])[G.zone]||0)+' (game time)',false,()=>{toast(ZONES.map((z,i)=>z.name.split(' ')[0]+' '+fmtT((G.zoneT||[])[i]||0)).join(' · '));}],['Dev: play the music loop seam',false,previewLoop],['Dev: reset all promotions to rank 0',false,()=>{for(const h of G.roster){h.tier=0;h.uid=heroUid(h);}Object.keys(variantCache).forEach(k=>delete variantCache[k]);G.heroesSeen=[];saveGame();toast('All heroes back to their first title');}],['Dev: Endless Road back to fight 1',false,()=>{const zi=ZONES.length-1;G.prog[zi]=0;G.endlessSeen=false;G.endMilestone=0;G.enemies=[];G.projs=[];G.action=null;G.bossFight=false;G.mode='walk';G.enc=2;G.active.forEach(h=>{h.dx=0;h.status={};setAnim(h,'walk');});closeSheet();toast('Endless Road reset to fight 1 (best kept)');}],['Dev: skip to the next milestone boss',false,()=>{const zi=ZONES.length-1;if(G.zone!==zi){toast('Travel to the Endless Road first');return;}const p=G.prog[zi]||0;G.prog[zi]=Math.floor(p/100)*100+100;G.far[zi]=Math.max(G.far[zi]||0,G.prog[zi]);G.enemies=[];G.projs=[];G.action=null;G.bossFight=false;G.mode='walk';G.enc=0.5;G.active.forEach(h=>{h.dx=0;h.status={};setAnim(h,'walk');});closeSheet();G.screen='road';toast('Fight '+G.prog[zi]+' - milestone boss ahead');}],['Dev: +4h auto-cast boost',G.autoUntil>now(),()=>{G.autoUntil=Math.max(now(),G.autoUntil)+4*3600*1000;G.autoCast=true;toast('Auto-cast active for four hours');}],['Dev road speed: '+(G.fastRoad?G.fastRoad+'×':'off'),!!G.fastRoad,()=>{G.fastRoad=G.fastRoad===64?0:G.fastRoad===32?64:G.fastRoad===16?32:G.fastRoad===8?16:G.fastRoad===4?8:4;toast(G.fastRoad?'Road runs at '+G.fastRoad+'× speed':'Road back to normal speed');}],['Fast quests & castle (testing: 120× speed)',G.fast,()=>{const t=now();for(const q of G.quests){const left=Math.max(0,q.end-t);q.end=t+(G.fast?left*120:left/120);}{const left=Math.max(0,G.castle.hordeAt-t);G.castle.hordeAt=t+(G.fast?left*120:left/120);}G.castle.last=t;G.fast=!G.fast;toast(G.fast?'Quests now run 120× faster':'Quests back to real time');}],['Backup or restore your save',false,()=>openSheet('backup')],['Reset the road (wipes the save)',false,()=>{storeClear();G.noSave=true;location.reload();}]];
    rows.forEach(([label,on,fn],i)=>{const y=y0+30+i*26;px(14,y,242,22,C.band);text(20,y+6,label,'xs',C.cream);
      if(i<2){const set=v=>{if(i===0)setMusicVol(v);else G.sfxVol=clamp(v,0,1);};const get=()=>i===0?(G.musicVol==null?0.55:G.musicVol):(G.sfxVol==null?1:G.sfxVol);button(150,y+3,22,16,false);text(161,y+6,'-','xsb',C.cream,'center');hit(150,y+3,22,16,()=>set(get()-0.1));button(176,y+3,22,16,false);text(187,y+6,'+','xsb',C.cream,'center');hit(176,y+3,22,16,()=>set(get()+0.1));}
      button(210,y+3,40,16,on);text(230,y+6,on?'On':'-','xs',on?C.goldL:C.muted,'center');hit(i<2?200:14,y,i<2?56:242,22,fn);});
    text(16,y0+390,storeSet('__probe')?'Progress saves automatically on this device.':'This preview cannot save - download the file to keep progress.','xs',C.dimt);}
  else if(s.kind==='ad'){text(16,y0+8,'Boosts','h',C.goldL);text(16,y0+22,'Each boost is one short ad. Placeholders for now.','xs',C.muted);
    const offers=[['Auto-cast · 4h',G.autoUntil>now()?fmtT((G.autoUntil-now())/1000)+' left':'Abilities cast on their own (offline too)',()=>{G.autoUntil=Math.max(now(),G.autoUntil)+4*3600*1000;G.autoCast=true;toast('Auto-cast active for four hours');}],
      ['4× road speed · 2h',G.speed===4&&G.speedUntil>now()?fmtT((G.speedUntil-now())/1000)+' left':'The road runs four times faster',()=>{G.speed=4;G.speedUntil=Math.max(now(),G.speedUntil)+2*3600*1000;toast('4× speed for two hours');}],
      ['Time warp · 4h',G.warpAt>now()?'Next in '+fmtT((G.warpAt-now())/1000):(()=>{const g=offlineGains(4,1);return 'About +'+fmtNum(g.gold)+' gold, +'+fmtNum(g.ore)+' ore, +'+fmtNum(g.xp)+' xp each';})(),()=>{if(G.warpAt>now()){toast('One warp a day');return;}const g=offlineGains(4,1);G.gold+=g.gold;G.ore+=g.ore;for(const h of G.active){h.xp+=g.xp;while(h.xp>=xpNeed(h.lvl)){h.xp-=xpNeed(h.lvl);h.lvl++;refreshStats(h);h.hp=h.maxhp;levelBurst(h);}}G.warpAt=now()+24*3600*1000;G.boostSeen=false;toast('Four hours pass on the road');}],
      ['Hurry a quest',G.quests.length?'Bring '+G.quests[0].hero.name+' home now':'No quest out',()=>{if(!G.quests.length){toast('No quest to hurry');return;}G.quests[0].end=now();toast(G.quests[0].hero.name+' hurries home');}],
      ['Daily chest',G.chestAt>now()?'Next in '+fmtT((G.chestAt-now())/1000):'A gear chest at this zone\'s best rank',()=>{if(G.chestAt>now()){toast('Come back tomorrow');return;}if(G.pack.length>=15){toast('Pack is full');return;}const it=makeItem(G.zone,'boss');G.pack.push(it);G.chestAt=now()+24*3600*1000;G.boostSeen=false;toast('Found: '+itemName(it),RANKHEX[it.rank]);}]];
    offers.forEach(([t,sub,fn],i)=>{const y=y0+36+i*30;if(y+26>y0+hh-4)return;px(14,y,242,26,C.band);text(20,y+4,t,'sb',C.cream);text(20,y+14,sub,'xs',C.muted);button(196,y+4,54,18,true);icon('play',200,y+7,4);text(228,y+8,'Watch','xs',C.goldL,'center');hit(196,y+4,54,18,()=>{fn();});});}}

// ============================================================ sound effects
let AC=null;function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}return AC;}
function tone(f0,f1,dur,type='square',vol=0.08,t0=0){const a=ac();if(!a||G.sfx===false)return;vol*=G.sfxVol==null?1:G.sfxVol;const o=a.createOscillator(),g=a.createGain();o.type=type;const t=a.currentTime+t0;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+0.02);}
function noise(dur,vol=0.12,t0=0){const a=ac();if(!a||G.sfx===false)return;vol*=G.sfxVol==null?1:G.sfxVol;const n=Math.floor(a.sampleRate*dur),b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const src=a.createBufferSource();src.buffer=b;const g=a.createGain(),f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=1800;g.gain.value=vol;src.connect(f);f.connect(g);g.connect(a.destination);src.start(a.currentTime+t0);}
function sfx(k,ui){if(!ui&&G.screen!=='road'&&!G.title)return;switch(k){case 'hit':noise(0.06,0.10);tone(180,60,0.08,'square',0.05);break;case 'crit':noise(0.09,0.14);tone(320,80,0.14,'square',0.07);break;case 'tap':tone(700,300,0.05,'square',0.04);break;case 'heal':tone(520,780,0.12,'sine',0.06);tone(780,1040,0.14,'sine',0.05,0.08);break;case 'cast':tone(200,900,0.22,'sawtooth',0.05);break;case 'coin':tone(1200,1600,0.07,'square',0.04);break;case 'level':[523,659,784,1046].forEach((f,i)=>tone(f,f,0.12,'square',0.06,i*0.07));break;case 'death':noise(0.18,0.10);tone(160,40,0.25,'sawtooth',0.05);break;}}
// ============================================================ music
const music={cur:null,el:null,bufs:{}};
function trackFor(){const Z=ZONES[G.zone]||ZONES[0];const zi=Z.endless?endSeg(G.prog[G.zone]||0):G.zone;const M=ASSETS.music||{};const k=['greenhollow','lagoon','thornwood','ironvein','emberwaste','amberfall','ashen','keep','foundry'][zi]||'greenhollow';return M[k]?k:'greenhollow';}
function swapTo(buf){const a=ac();if(music.node&&a){const old=music.node,og=music.gain;try{og.gain.cancelScheduledValues(a.currentTime);og.gain.setValueAtTime(Math.max(0.001,og.gain.value),a.currentTime);og.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.04);old.stop(a.currentTime+0.05);}catch(e){try{old.stop();}catch(e2){}}music.node=null;music.gain=null;}music.buf=buf;if(music.started&&G.music)startNode();}
music.pending={};
function ensureTrack(key,done){if(!ASSETS.music||!ASSETS.music[key])return;if(music.bufs[key]){if(done)done(music.bufs[key]);return;}if(music.pending[key]){if(done)music.pending[key].push(done);return;}music.pending[key]=done?[done]:[];const a=ac();if(!(a&&window.fetch)){elementFallback(key);return;}fetch(ASSETS.music[key]).then(r=>r.arrayBuffer()).then(ab=>a.decodeAudioData(ab)).then(buf=>{buf=loopify(a,buf,key);music.bufs[key]=buf;const cbs=music.pending[key]||[];delete music.pending[key];for(const k of Object.keys(music.bufs))if(k!==key&&k!==music.cur&&Object.keys(music.bufs).length>3)delete music.bufs[k];cbs.forEach(f=>f(buf));}).catch(()=>{delete music.pending[key];elementFallback(key);});}
function nextTrackKey(){const Z=ZONES[G.zone];if(!Z)return null;const p=G.prog[G.zone]||0;const M=['greenhollow','lagoon','thornwood','ironvein','emberwaste','amberfall','ashen','keep','foundry'];let zi=null;if(Z.endless){if(p%30>=26)zi=endSeg(p+4);}else if(!G.cleared[G.zone]&&p>=Z.fights-4&&G.zone<ZONES.length-1)zi=G.zone+1;if(zi==null)return null;const k=M[zi]||'greenhollow';return (ASSETS.music&&ASSETS.music[k])?k:null;}
function playMusic(key){if(!ASSETS.music||!ASSETS.music[key])return;if(music.cur===key)return;music.cur=key;ensureTrack(key,buf=>{if(music.cur===key)swapTo(buf);});}
function elementFallback(key){const el=new Audio();el.src=ASSETS.music[key];el.loop=true;el.volume=0.55;el.preload='auto';music.el=el;if(G.music&&music.started)tryPlay();}
function loopify(a,buf,key){try{const [ls,le]=trimPoints(buf);const sr=buf.sampleRate,st=Math.round(ls*sr);let en=Math.round(le*sr);const meta=(ASSETS.musicMeta||{})[key];if(meta&&meta.loopEnd&&meta.loopEnd*sr<en){en=Math.round(meta.loopEnd*sr);}else{const d0=buf.getChannelData(0),w=Math.round(sr*0.05);const rms=(e)=>{let q=0;for(let i=e-w;i<e;i++)q+=d0[i]*d0[i];return Math.sqrt(q/w);};const ref=rms(en-Math.round(sr*0.5));let moved=0;while(en-st>sr*2&&moved<sr*1.5&&rms(en)<ref*0.4){en-=w;moved+=w;}}const n=en-st;const d0b=buf.getChannelData(0),wq=Math.round(sr*0.05);const q=(e)=>{let v=0;for(let i=e-wq;i<e;i++)v+=d0b[i]*d0b[i];return Math.sqrt(v/wq);};const lvEnd=q(en),lvStart=q(st+wq);const ratio=Math.max(lvEnd,0.001)/Math.max(lvStart,0.001);const X=Math.min(Math.round(sr*((meta&&meta.xfade)?meta.xfade:(meta&&meta.loopEnd)?0.12:(ratio>1.6||ratio<0.625)?0.12:0.04)),Math.floor(n/4));if(n<sr||X<64)return buf;const ls0=meta&&meta.loopStart?Math.max(st,Math.round(meta.loopStart*sr)):st;const out=a.createBuffer(buf.numberOfChannels,n,sr);for(let c=0;c<buf.numberOfChannels;c++){const src=buf.getChannelData(c),d=out.getChannelData(c);for(let i=0;i<n;i++)d[i]=src[st+i];for(let i=0;i<X;i++){const t=i/X,fo=Math.cos(t*Math.PI/2),fi=Math.sin(t*Math.PI/2);d[n-X+i]=src[st+n-X+i]*fo+src[ls0+i]*fi;}}out.loopFrom=(ls0-st+X)/sr;return out;}catch(e){return buf;}}
const SUPER={sword:{name:'Crystal Edge',slot:'weapon',kind:'sword',fx:'Shield Wall reflects 20% of blocked damage'},staff:{name:'Crystal Scepter',slot:'weapon',kind:'staff',fx:'Abilities charge 25% faster'},dagger:{name:'Crystal Fang',slot:'weapon',kind:'dagger',fx:'Shadowstep crits leave a bleed'},bow:{name:'Crystal Recurve',slot:'weapon',kind:'bow',fx:'Rain of Arrows bleeds last twice as long'},axe:{name:'Crystal Aegis',slot:'weapon',kind:'axe',fx:'Rage no longer increases damage taken'},cape:{name:'Crystal Mantle',slot:'cape'},amulet:{name:'Crystal Heart',slot:'charm'},ring:{name:'Crystal Band',slot:'charm'}};
const SUPER_ORDER=['sword','cape','staff','amulet','dagger','cape','bow','ring','axe','staff'];const SUPER_CAP={sword:1,dagger:1,bow:1,axe:1,ring:1,staff:2};
function milestoneItem(m){if(m<=SUPER_ORDER.length)return SUPER_ORDER[m-1];return (m%2)?'cape':'amulet';}
function superCount(key){return G.pack.filter(i=>i.super===key).length+G.roster.reduce((n,h)=>n+Object.values(h.eq||{}).filter(i=>i&&i.super===key).length,0);}
function makeSuper(key){const d=SUPER[key];return{id:'S'+key+'_'+Date.now().toString(36),slot:d.slot,kind:d.kind,rank:5,lvl:0,super:key};}
function ownsSuper(key){return G.pack.some(i=>i.super===key)||G.roster.some(h=>h.eq&&Object.values(h.eq).some(i=>i&&i.super===key));}
function sup(h,key){if(!h||!h.eq)return false;const d=SUPER[key];const it=h.eq[d.slot];return !!(it&&it.super===key);}
function giveItem(it){if(G.pack.length<15){G.pack.push(it);return true;}const junk=G.pack.filter(x=>!x.super).sort((a,b)=>(a.rank-b.rank)||(a.lvl-b.lvl))[0];if(junk){G.pack=G.pack.filter(x=>x!==junk);const o=(junk.rank+1)*4;G.ore+=o;toast('Salvaged '+itemName(junk)+' to make room');G.pack.push(it);return true;}return false;}
function drawItemIcon(it,x,y,scale){if(it.super&&IMG.superGear24&&IMG.superGear24.width){const i=(ASSETS.superOrder||[]).indexOf(it.super);if(i>=0){const sz=12*scale;ctx.drawImage(IMG.superGear24,i*24,0,24,24,x,y,sz,sz);return;}}icon(itemIcon(it),x,y,it.rank,scale);}
function drawReveal(){const rv=G.reveal;if(!rv||G.screen!=='road')return;if(!rv.at)rv.at=performance.now();const el=(performance.now()-rv.at)/1000,k=Math.min(1,el*3);hits.length=0;dimRect(0,0,W,H,0.78*k);tx.fillStyle='rgba(6,8,16,'+(0.78*k)+')';tx.fillRect(0,0,tc.width,tc.height);
  const px0=18,py0=SCENE_Y+4,pw=234,ph=192;frame(px0,py0,pw,ph,C.navy,'#8fdcff');tx.clearRect(px0*TS,py0*TS,pw*TS,ph*TS);const cx=W/2,cy=py0+62;const sc=1+0.05*Math.sin(RT*3);
  const g=ctx.createRadialGradient(cx,cy,4,cx,cy,62);g.addColorStop(0,'rgba(120,220,255,0.5)');g.addColorStop(1,'rgba(120,220,255,0)');ctx.fillStyle=g;ctx.fillRect(cx-64,cy-58,128,116);
  for(let i=0;i<14;i++){const a=RT*1.3+i*0.449,r=36+8*Math.sin(RT*2.2+i);const sx=cx+Math.cos(a)*r,sy=cy+Math.sin(a)*r*0.65;ctx.globalAlpha=0.5+0.5*Math.sin(RT*5+i);px(R(sx),R(sy),2,2,i%2?'#ffffff':'#bff0ff');}ctx.globalAlpha=1;
  const i=(ASSETS.superOrder||[]).indexOf(rv.it.super);if(i>=0&&IMG.superGear){const sz=R(88*sc);ctx.drawImage(IMG.superGear,i*32,0,32,32,R(cx-sz/2),R(cy-sz/2),sz,sz);}
  text(cx,cy+52,itemName(rv.it),'big','#8fdcff','center');const d=SUPER[rv.it.super];text(cx,cy+72,d&&d.fx?d.fx:itemStatLabel(rv.it),'s',C.cream,'center');text(cx,cy+88,'Mythic  ·  '+itemStatLabel(rv.it),'xs','#8fdcff','center');text(cx,py0+ph-14,'tap to continue','xs',C.dimt,'center',0.5+0.5*Math.sin(RT*3));
  hit(0,0,W,H,()=>{if(el<0.5)return;G.card=rv.card||null;G.reveal=null;});}
function trimPoints(buf){const d=buf.getChannelData(0),sr=buf.sampleRate,th=0.004;let s=0,e=d.length-1;while(s<d.length&&Math.abs(d[s])<th)s++;while(e>s&&Math.abs(d[e])<th)e--;const w=Math.round(sr*0.02);let i=s;while(i+w<e&&i-s<sr*3){let q=0;for(let j=i;j<i+w;j++)q+=d[j]*d[j];if(Math.sqrt(q/w)>0.01)break;i+=w;}if(i>s&&i-s<sr*3)s=Math.max(s,i-Math.round(sr*0.01));return[s/sr,e/sr];}
function startNode(offset){const a=ac();if(!a||!music.buf||music.node)return;if(a.state==='suspended')a.resume();const src=a.createBufferSource();src.buffer=music.buf;src.loop=true;src.loopStart=music.buf.loopFrom||0;src.loopEnd=music.buf.duration;const ls=Math.max(0,Math.min(music.buf.duration-0.1,offset||0));const g=a.createGain();const vol=G.music?(G.musicVol==null?0.55:G.musicVol):0;g.gain.setValueAtTime(vol,a.currentTime);src.connect(g);g.connect(a.destination);src.start(0,ls);music.node=src;music.gain=g;if(!music.ok){music.ok=true;}}
function tryPlay(){if(!music.el)return;const el=music.el;const p=el.play();if(p&&p.then)p.then(()=>{if(!music.ok){music.ok=true;}}).catch(e=>{if(el.readyState<3){el.addEventListener('canplaythrough',()=>{if(G.music&&music.started)tryPlay();},{once:true});}else toast('Audio blocked here ('+e.name+') - try the downloaded file');});}
function b64u(bytes){let s='';for(let i=0;i<bytes.length;i++)s+=String.fromCharCode(bytes[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function unb64u(str){str=str.replace(/-/g,'+').replace(/_/g,'/');while(str.length%4)str+='=';const bin=atob(str);const out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out;}
function hash32(bytes){let h=2166136261;for(let i=0;i<bytes.length;i++){h^=bytes[i];h=Math.imul(h,16777619)>>>0;}return h.toString(36);}
async function pipeBytes(bytes,stream){const r=new Blob([bytes]).stream().pipeThrough(stream);return new Uint8Array(await new Response(r).arrayBuffer());}
async function makeSaveCode(){const json=serialize();const raw=new TextEncoder().encode(json);let bytes=raw,tag='CR1';if(window.CompressionStream){try{bytes=await pipeBytes(raw,new CompressionStream('deflate'));tag='CR2';}catch(e){bytes=raw;tag='CR1';}}return tag+'.'+b64u(bytes)+'.'+hash32(bytes);}
async function readSaveCode(code){code=(code||'').trim().replace(/\s+/g,'');const m=code.match(/^(CR[12])\.([A-Za-z0-9_-]+)\.([a-z0-9]+)$/);if(!m)throw new Error('That is not a Crystal Road save code');let bytes=unb64u(m[2]);if(hash32(bytes)!==m[3])throw new Error('The code is damaged or incomplete');if(m[1]==='CR2'){if(!window.DecompressionStream)throw new Error('This device cannot read compressed codes');bytes=await pipeBytes(bytes,new DecompressionStream('deflate'));}const json=new TextDecoder().decode(bytes);const d=JSON.parse(json);if(!d||d.v!==1||!d.roster)throw new Error('The code does not hold a valid save');return json;}
async function copySaveCode(){try{const code=await makeSaveCode();let ok=false;try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(code);ok=true;}}catch(e){}if(!ok){window.prompt('Copy this save code:',code);}G.backupMsg=ok?'Code copied. Paste it somewhere safe.':'Copy the code from the box.';G.backupMsgT=RT;}catch(e){G.backupMsg='Could not build a code: '+e.message;G.backupMsgT=RT;}}
async function pasteSaveCode(){const code=window.prompt('Paste your save code:');if(code==null)return;try{const json=await readSaveCode(code);if(!window.confirm('Replace the save on this device with the code? The current progress here will be lost.'))return;G.noSave=true;storeSet(json);location.reload();}catch(e){G.backupMsg=e.message;G.backupMsgT=RT;}}
function checkUpdate(){try{fetch('version.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(j=>{if(j&&j.build&&typeof BUILD_ID==='string'&&j.build!==BUILD_ID){G.updateReady=j.build;let tried=null;try{tried=sessionStorage.getItem('cr_try');}catch(e){}if((!G.booted||G.title)&&tried!==j.build){try{sessionStorage.setItem('cr_try',j.build);}catch(e){}applyUpdate();}}}).catch(()=>{});}catch(e){}}
function applyUpdate(){const b=G.updateReady||Date.now();try{localStorage.setItem('cr_pending','1');}catch(e){}location.replace(location.pathname+'?b='+b);}
function previewLoop(){const b=music.buf;if(!b){toast('Music not loaded yet');return;}if(!G.music)setMusic(true);const a=ac();if(music.node){try{music.node.stop();}catch(e){}music.node=null;music.gain=null;}startNode(Math.max(0,b.duration-5));toast('Loop in 5 s: '+fmtT(b.duration)+' back to '+fmtT(b.loopFrom||0));}
function resumeAudio(){const a=ac();if(a&&a.state!=='running'){try{a.resume();}catch(e){}}if(music.started&&G.music&&music.buf&&!music.node)startNode();}
function startMusic(){const a=ac();if(a&&a.state==='suspended')a.resume();if(music.started)return;music.started=true;if(!music.cur)playMusic(trackFor());if(music.buf)startNode();else if(music.el)tryPlay();}
function setGain(v){const a=ac();if(!music.gain||!a)return;const gp=music.gain.gain;gp.cancelScheduledValues(a.currentTime);gp.setValueAtTime(v,a.currentTime);}
function setMusicVol(v){G.musicVol=clamp(v,0,1);if(music.gain)setGain(G.music?G.musicVol:0);if(music.el)music.el.volume=G.musicVol;}
function setMusic(on){G.music=on;if(music.gain){setGain(on?(G.musicVol==null?0.55:G.musicVol):0);return;}if(music.buf&&on){startNode();return;}if(!music.el)return;if(on)tryPlay();else music.el.pause();}
// ============================================================ draw + input
const TUT=[
  {t:'Your party marches on its own',s:'Enemies come to you. Watch the road, or leave it running.',box:[0,SCENE_Y,W,208]},
  {t:'Tap an enemy to strike it',s:'Taps deal damage of their own and grow with the Tree.',box:[196,GROUND-46,56,56]},
  {t:'Abilities charge during fights',s:'When a button glows, tap it. Tapped casts hit 30% harder.',box:()=>[4,308,262,ABH]},
  {t:'The road ahead',s:'Dots are checkpoints. Fall in battle and you return to the last one. The red crystal is the boss.',box:[4,SCENE_Y+4,166,42]},
  {t:'Beyond this zone lie eight more',s:'Tap the zone name any time to see them all and travel between the ones you have opened.',screen:'map',box:[4,52,262,66]},
  {t:'Gear drops from fights',s:'Equip it in the three slots; salvage the rest for ore to upgrade with.',screen:'gear',box:()=>[4,138+(BIG?18:14)+4,262,TABY-14-(138+(BIG?18:14)+4)]},
  {t:'The Tree turns gold into permanent ranks',s:'HP, attack, tap damage, camp perks - and blessings after a Reforge.',screen:'tree',box:()=>{const top=42+(BIG?22:16)+26,n=TREE.filter(x=>x.branch===G.treeTab).length+(G.treeTab==='Crystal'?1:0),rh=Math.max(22,Math.min(BIG?44:32,Math.floor((TABY-8-TABTOP-top)/n)-3));return[4,top,262,Math.min(TABY-14-top,n*(rh+3)+1)];}},
];
function drawTutorial(){if(G.tut==null)return;const st=TUT[G.tut];hits.length=0;let[bx,by,bw,bh]=typeof st.box==='function'?st.box():st.box;bx=Math.max(2,bx);by=Math.max(18,by);bw=Math.min(bw,W-4-bx);bh=Math.min(bh,TABY-2-by);
  const dimAround=(x,y,w,h)=>{dimRect(0,0,W,y,0.6);dimRect(0,y+h,W,H-y-h,0.6);dimRect(0,y,x,h,0.6);dimRect(x+w,y,W-x-w,h,0.6);tx.fillStyle='rgba(6,8,16,0.6)';tx.fillRect(0,0,tc.width,y*TS);tx.fillRect(0,(y+h)*TS,tc.width,(H-y-h)*TS);tx.fillRect(0,y*TS,x*TS,h*TS);tx.fillRect((x+w)*TS,y*TS,(W-x-w)*TS,h*TS);};dimAround(bx,by,bw,bh);drawTabs();hits.length=0;if(st.screen){const ti=['heroes','gear','road','vael','tree'].indexOf(st.screen);if(ti>=0)px(ti*54+2,TABY+3,50,1,C.goldL);}ctx.globalAlpha=0.7+0.3*Math.sin(RT*4);px(bx-2,by-2,bw+4,2,C.goldL);px(bx-2,by+bh,bw+4,2,C.goldL);px(bx-2,by-2,2,bh+4,C.goldL);px(bx+bw,by-2,2,bh+4,C.goldL);ctx.globalAlpha=1;
  const ww=st.icon?178:228,tx0=st.icon?70:20;const lines=[].concat(wrapN(st.s,'s',ww),st.s2?wrapN(st.s2,'s',ww):[],st.s3?wrapN(st.s3,'s',ww):[]);const extra=Math.max((lines.length-1)*11,st.icon?22:0),ch=72+extra;const cands=[by+bh+10,by-ch-10,40,TABY-ch-10];let py=cands.find(y=>y>=20&&y+ch<=TABY-4&&!(y<by+bh&&y+ch>by));if(py==null)py=by>H/2?40:TABY-ch-10;frame(12,py,246,ch,C.navy,C.goldL);tx.clearRect(12*TS,py*TS,246*TS,ch*TS);text(20,py+8,st.t,'h',C.goldL);if(st.icon&&IMG.superGear){const ii=(ASSETS.superOrder||[]).indexOf(st.icon);if(ii>=0){const g=ctx.createRadialGradient(42,py+44,2,42,py+44,26);g.addColorStop(0,'rgba(120,220,255,0.5)');g.addColorStop(1,'rgba(120,220,255,0)');ctx.fillStyle=g;ctx.fillRect(14,py+16,56,56);ctx.drawImage(IMG.superGear,ii*32,0,32,32,20,py+22,44,44);}}lines.forEach((l,i)=>text(tx0,py+23+i*11,l,'s',C.cream));if(!st.once)text(20,py+46+extra,(G.tut+1)+' / '+TUT.length,'xs',C.dimt);hit(0,0,W,H,()=>{});button(170,py+42+extra,80,22,true);text(210,py+49+extra,st.once?'Got it':(G.tut<TUT.length-1?'Next':'Begin'),'sb',C.goldL,'center');hit(170,py+42+extra,80,22,()=>{const once=TUT[G.tut]&&TUT[G.tut].once;G.tut++;if(G.tut===1&&G.mode==='walk'&&!G.enemies.length){const E=ENEMIES.slime,e={uid:'slime',id:'slime',name:'Slime',lvl:1,x:224,slot:224,dx:0,yoff:0,flip:true,fly:false,range:'melee',boss:false,scale:1,native:false,nscale:1,hue:0,tier:0,gauge:0,dead:false,enemy:true,status:{},flash:0,traits:[],acts:0};Object.assign(e,enemyStats('slime',1));e.hp=e.maxhp;setAnim(e,'idle');G.enemies=[e];G.fs={dmg:0,taps:0,gold:0};G.mode='battle';G.active.forEach(h=>setAnim(h,'idle'));}if(once){if(TUT[G.tut]&&TUT[G.tut].once){return;}while(TUT.length&&TUT[TUT.length-1].once)TUT.pop();G.tut=null;saveGame();return;}if(G.tut>=TUT.length){G.tut=null;G.tutDone=true;G.screen='road';saveGame();}else G.screen=TUT[G.tut].screen||'road';});}
function draw(){hits.length=0;tx.clearRect(0,0,tc.width,tc.height);px(0,0,W,H,'#0b0d16');
  ({road:drawRoad,gear:drawGear,heroes:drawHeroes,vael:drawVael,map:drawMap,tree:drawTree})[G.screen]();drawDragGhost();drawReveal();if(G.updateReady&&!G.sheet&&G.tut==null&&!G.reveal){const uw=112,ux=W/2-uw/2,uy=TABY-30;ctx.globalAlpha=0.6+0.4*Math.sin(RT*3);button(ux,uy,uw,20,true);ctx.globalAlpha=1;text(W/2,uy+6,'Update ready - tap to reload','xs',C.goldL,'center');hit(ux,uy,uw,20,applyUpdate);}
  drawBanner();drawCard();drawTabs();drawTop();drawSheet();drawTutorial();
  if(G.title){hits.length=0;tx.clearRect(0,0,tc.width,tc.height);px(0,0,W,H,'#0b0d16');const L=SCENES.hills;ctx.save();ctx.beginPath();ctx.rect(0,140,W,208);ctx.clip();for(const l of L){const w=l.img.width||368;let off=-(Math.floor(RT*10*l.p)%w);for(let x=off;x<W+w;x+=w)ctx.drawImage(l.img,x,140);}ctx.restore();
    px(0,136,W,4,C.goldD);px(0,348,W,4,C.goldD);G.active.forEach((h,i)=>{const n=G.active.length,x=W/2+(i-(n-1)/2)*-52;drawSprite(h,x,322,Math.floor(RT*8+i)%ATLAS[h.uid].anims.walk.n,'walk',false,2);});
    if(IMG.logo&&IMG.logo.width){const lw=200,lh=Math.round(lw*IMG.logo.height/IMG.logo.width),lx=(W-lw)/2,ly=SCENE_Y-70+Math.sin(RT*1.2)*2;tx.drawImage(IMG.logo,lx*TS,ly*TS,lw*TS,lh*TS);}else text(W/2,64,'Crystal Road','big',C.goldL,'center');text(W/2,368,G.wins>0?'Welcome back. The road remembers you.':'The shards are scattered. The road is long.','s',C.cream,'center');
    const a=0.55+0.45*Math.sin(RT*3);text(W/2,388,'Tap to begin','h',C.goldL,'center',a);text(W/2,404,'Music by you · art by Zerie & ansimuz','xs',C.dimt,'center');if(typeof BUILD_ID==='string')text(W/2,H-12,'build '+BUILD_ID,'xs',C.dimt,'center');if(G.updateReady){const uw=112,ux=W/2-uw/2,uy=H-40;ctx.globalAlpha=0.6+0.4*Math.sin(RT*3);button(ux,uy,uw,20,true);ctx.globalAlpha=1;text(W/2,uy+6,'Update ready - tap to reload','xs',C.goldL,'center');hit(ux,uy,uw,20,applyUpdate);}hit(0,0,W,H,()=>{G.title=false;startMusic();banner(ZONES[G.zone].name,G.wins>0?'Onward':'The first shard lies ahead',3);if(!G.tutDone&&G.wins===0){G.tut=0;G.banner=null;G.pending='Greenhollow Fields';}});}
  if(G.toast&&!G.reveal&&!(G.toast.scope==='road'&&G.screen!=='road')){const a=clamp(Math.min(G.toast.t*4,(2.2-G.toast.t)*3),0,1);if(G.toast.scope==='road'){const w=textW(G.toast.text,'xs')+12;ctx.globalAlpha=a*0.45;px(4,SCENE_Y+192,R(w),12,'#000');ctx.globalAlpha=1;text(10,SCENE_Y+194,G.toast.text,'xs',G.toast.col||C.cream,'left',a);}else{const w=textW(G.toast.text,'s')+16,ty=G.screen==='road'&&!G.sheet?SCENE_Y+186:H-64;ctx.globalAlpha=a*0.55;px(R(W/2-w/2),ty,R(w),16,'#000');ctx.globalAlpha=1;text(W/2,ty+4,G.toast.text,'s',G.toast.col||C.cream,'center',a);}}}
function speedNow(){if(G.fastRoad)return G.fastRoad;if(G.speed===4&&G.speedUntil>now())return 4;if(G.speed===4)G.speed=2;return G.speed||1;}
let RT=0;
function loop(ts){const dt=Math.min(0.05,(ts-last)/1000||0);last=ts;RT+=dt;rollDt=dt;if(G.booted&&!G.delve&&!G.hordeFight){const mk=trackFor();if(mk!==music.cur)playMusic(mk);const nk=nextTrackKey();if(nk&&nk!==music.cur&&!music.bufs[nk]&&!music.pending[nk])ensureTrack(nk);}if(HOLD&&RT>=HOLD.next){const r=HOLD.r;if(HOLD.px>=r.x&&HOLD.px<r.x+r.w&&HOLD.py>=r.y&&HOLD.py<r.y+r.h){HOLD.fn();HOLD.next=RT+0.12;}else HOLD=null;}const n=speedNow();for(let k=0;k<n;k++)update(dt,k===0);draw();requestAnimationFrame(loop);}
function evPos(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H];}
cv.addEventListener('pointermove',e=>{if(!G.drag)return;const[x,y]=evPos(e);if(!G.drag.moved&&Math.hypot(x-G.drag.x0,y-G.drag.y0)>5)G.drag.moved=true;G.drag.x=x;G.drag.y=y;});
function endDrag(e){const d=G.drag;if(!d)return;G.drag=null;const[x,y]=evPos(e);
  if(!d.moved){openSheet('swap',{slot:d.i});return;}
  if(y<16||y>96)return;const j=Math.floor((x-4)/66);if(j<0||j>3||j===d.i)return;
  if(G.active[j]){[G.active[d.i],G.active[j]]=[G.active[j],G.active[d.i]];}else{G.active.splice(j>G.active.length?G.active.length:j,0,G.active.splice(d.i,1)[0]);}layout();toast(G.active[0].name+' takes the front');}
cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',()=>{G.drag=null;HOLD=null;});window.addEventListener('pointerup',()=>{HOLD=null;});window.addEventListener('pointercancel',()=>{HOLD=null;});window.addEventListener('blur',()=>{HOLD=null;});cv.addEventListener('pointerleave',()=>{HOLD=null;});
function dispatch(x,y){for(let i=hits.length-1;i>=0;i--){const h=hits[i];if(x>=h.x&&x<h.x+h.w&&y>=h.y&&y<h.y+h.h){h.fn();if(h.hold)HOLD={fn:h.fn,next:RT+0.45,r:h,px:x,py:y};if(G.drag&&!G.drag.x0){G.drag.x0=x;G.drag.y0=y;G.drag.x=x;G.drag.y=y;}return true;}}return false;}
let scrollTouch=null;
cv.addEventListener('pointermove',e=>{if(HOLD){const[hx,hy]=evPos(e);HOLD.px=hx;HOLD.py=hy;}if(!scrollTouch)return;const[x,y]=evPos(e);if(!scrollTouch.moved&&Math.abs(y-scrollTouch.y0)>5)scrollTouch.moved=true;if(scrollTouch.moved){SCROLL[scrollTouch.key]=clamp(scrollTouch.s0-(y-scrollTouch.y0),0,scrollMax(scrollTouch.key));}});
cv.addEventListener('pointerup',e=>{if(!scrollTouch)return;const st=scrollTouch;scrollTouch=null;if(!st.moved)dispatch(st.x0,st.y0);});
cv.addEventListener('pointerdown',e=>{if(!G.title)startMusic();if(!G.title&&G.music&&!music.ok){if(music.buf&&!music.node)startNode();else if(music.el&&music.el.paused)tryPlay();}const[x,y]=evPos(e);
  if(!G.sheet&&(G.screen==='tree'||G.screen==='heroes'||G.screen==='map')&&y>(SCROLLTOP[G.screen]||44)&&y<TABY){scrollTouch={key:G.screen,x0:x,y0:y,s0:SCROLL[G.screen]||0,moved:false};return;}
  if(dispatch(x,y))return;
  if(G.screen==='road'&&!G.sheet&&y>SCENE_Y&&y<SCENE_Y+208){for(const h of G.active){if(Math.abs(x-h.x)<20&&y>GROUND-44&&y<GROUND+6){h.hop=1;toast(h.name+' the '+CLASSES[h.cls].name+', Lv '+h.lvl);return;}}}});
function bootFail(e){const el=document.getElementById('loading');if(el)el.textContent='Could not start: '+(e&&e.message?e.message:e);}
window.addEventListener('error',ev=>bootFail(ev.error||ev.message));
const bootTimer=setTimeout(()=>{const el=document.getElementById('loading');if(el&&!G.booted)el.textContent='Still loading… tap to continue anyway';},7000);
loadAll().then(()=>{G.booted=true;clearTimeout(bootTimer);const el=document.getElementById('loading');if(el)el.remove();const resumed=loadGame();if(resumed)G.title=true;playMusic(trackFor());requestAnimationFrame(loop);}).catch(e=>bootFail(e));
