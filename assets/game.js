// ============================================================ setup
const W=270,SCENE_Y=96,GROUND=SCENE_Y+182;
const H=Math.max(480,Math.min(600,Math.round(W*(innerHeight||480)/(innerWidth||270))));const TABY=H-42;
const ABH=44+Math.min(16,Math.round((H-480)*0.3)),BS=32+(ABH-44),CAMP_Y=308+ABH+4;
const cv=document.getElementById('c'),tc=document.getElementById('t'),stage=document.getElementById('stage');
cv.width=W;cv.height=H;const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
const tx=tc.getContext('2d');let SC=1,TS=1;
function fit(){SC=Math.min(innerWidth/W,innerHeight/H);const dpr=Math.min(3,window.devicePixelRatio||1);TS=Math.max(3,SC*dpr);
  stage.style.width=cv.style.width=tc.style.width=W*SC+'px';stage.style.height=cv.style.height=tc.style.height=H*SC+'px';
  tc.width=Math.round(W*TS);tc.height=Math.round(H*TS);}
addEventListener('resize',fit);fit();
const rand=Math.random,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),R=Math.round;
function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
const now=()=>Date.now();

// ============================================================ palette & pixel UI
const C={navy:'#161a2c',navy2:'#1e243c',navy3:'#2a3050',out:'#090b14',gold:'#c9a227',goldL:'#f1d778',goldD:'#7a5c14',cream:'#f2e9d8',muted:'#a0a8be',dimt:'#5a6482',red:'#c0392b',green:'#4caf50',cyan:'#4fc3f7',xp:'#8ab4ff',band:'#1b2036',btn:'#222a48',btnGold:'#3c3214'};
const RANKS=['Common','Uncommon','Rare','Epic','Legendary'];
const RANKPAL=[{a:[154,163,173],b:[107,116,128],h:[214,221,229]},{a:[76,175,80],b:[46,125,50],h:[165,214,167]},{a:[66,165,245],b:[21,101,192],h:[187,222,251]},{a:[171,71,188],b:[106,27,154],h:[225,190,231]},{a:[230,180,34],b:[168,120,15],h:[255,240,179]}];
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
const FONT={title:['bold',11,SER],h:['bold',9,SER],b:['',7.5,SER],bb:['bold',7.5,SER],s:['',6.5,SER],sb:['bold',7,SER],xs:['',5.5,MONO],xsb:['bold',5.5,MONO],big:['bold',13,SER]};
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
  slime:{name:'Slime',hp:0.7,atk:0.6,def:0.3,spd:8,range:'melee'},bat:{name:'Bat',hp:0.5,atk:0.7,def:0.2,spd:13,range:'melee',fly:true},orc:{name:'Orc',hp:1.0,atk:1.0,def:0.6,spd:9,range:'melee'},
  skeleton:{name:'Skeleton',hp:0.9,atk:1.0,def:0.7,spd:10,range:'melee'},marshbat:{name:'Marsh Bat',hp:0.6,atk:0.9,def:0.3,spd:14,range:'melee',fly:true},werewolf:{name:'Werewolf',hp:1.3,atk:1.3,def:0.6,spd:12,range:'melee'},
  armoredorc:{name:'Armored Orc',hp:1.6,atk:1.1,def:1.5,spd:8,range:'melee'},skelarcher:{name:'Skeleton Archer',hp:0.8,atk:1.2,def:0.5,spd:11,range:'ranged'},eliteorc:{name:'Elite Orc',hp:1.8,atk:1.5,def:1.0,spd:9,range:'melee'},
  armoredskel:{name:'Ash Skeleton',hp:1.5,atk:1.2,def:1.6,spd:9,range:'melee'},greatskel:{name:'Bone Reaver',hp:1.9,atk:1.7,def:0.9,spd:6,range:'melee'},necromancer:{name:'The Hollow King',scale:2,hp:7.0,atk:1.7,def:1.0,spd:8,range:'aoe',boss:true},
  slimeking:{name:'The Slime King',uid:'slime',scale:4,hp:5.0,atk:1.3,def:0.5,spd:6,range:'melee',boss:true},
  alphawolf:{name:'The Alpha',uid:'werewolf',scale:3,hp:5.5,atk:1.6,def:0.7,spd:10,range:'melee',boss:true},
  warlord:{name:'Orc Warlord',uid:'eliteorc',scale:3,hp:6.0,atk:1.7,def:1.2,spd:8,range:'melee',boss:true},
};
const ZONES=[
  {name:'Greenhollow Fields',lv:1,gate:1,fights:8,pool:['slime','bat','orc'],boss:'slimeking',scene:'hills',recruit:'vex',ground:'#2b6a2a'},
  {name:'Stillwater Lagoon',lv:8,gate:6,fights:10,pool:['skeleton','marshbat','werewolf'],boss:'alphawolf',scene:'lagoon',recruit:'morrow',ground:'#243a52'},
  {name:'Ironvein Caverns',lv:16,gate:13,fights:12,pool:['armoredorc','skelarcher','eliteorc'],boss:'warlord',scene:'cave',recruit:'wren',ground:'#1d2230'},
  {name:'Ashen Keep',lv:25,gate:21,fights:12,pool:['armoredskel','greatskel'],boss:'necromancer',scene:'sunset',bossScene:'door',recruit:'bram',ground:'#2a1a1c'},
];
const WEAPON_ADJ=['Iron','Steel','Mithril','Golden','Sunforged'],WEAPON_NOUN={sword:'Blade',staff:'Staff',dagger:'Daggers',bow:'Bow',axe:'Axe'};
const CAPE_NAMES=['Wool Cape','Hunter Cape','Mariner Cape','Royal Cape','Sunforged Cape'],CHARM_NAMES=['Iron Band','Silver Ring','Moon Amulet','Dragon Ring','Crystal Amulet'];
const QUESTS=[{id:'forage',name:'Forage',dur:30*60,desc:'Gold',reward:'gold'},{id:'hunt',name:'Hunt',dur:2*3600,desc:'Ore, maybe gear',reward:'ore'},{id:'scout',name:'Scout',dur:4*3600,desc:'A gear chest',reward:'gear'},{id:'pilgrim',name:'Pilgrimage',dur:8*3600,desc:'Crystal dust',reward:'dust'}];
const TREE=[
  {branch:'Party',id:'hp',name:'Vigor',desc:'+10% max HP per rank',max:5,base:80,cur:'gold'},
  {branch:'Party',id:'atk',name:'Might',desc:'+10% attack per rank',max:5,base:100,cur:'gold'},
  {branch:'Party',id:'abil',name:'Focus',desc:'+10% ability power per rank',max:5,base:150,cur:'gold'},
  {branch:'Tap',id:'tap',name:'Strike',desc:'+40% tap damage per rank',max:10,base:40,cur:'gold'},
  {branch:'Tap',id:'tapcharge',name:'Momentum',desc:'Taps charge abilities +1 per rank',max:3,base:300,cur:'gold'},
  {branch:'Camp',id:'slots',name:'Bunks',desc:'+1 quest slot per rank',max:2,base:400,cur:'gold'},
  {branch:'Camp',id:'march',name:'Long Stride',desc:'+10% march speed per rank',max:5,base:60,cur:'gold'},
  {branch:'Camp',id:'rest',name:'Warm Fire',desc:'+5% healing after each fight',max:5,base:90,cur:'gold'},
  {branch:'Camp',id:'quest',name:'Provisions',desc:'+15% quest rewards per rank',max:5,base:200,cur:'gold'},
];
const xpNeed=l=>R(25*Math.pow(l,1.4));
const treeLv=id=>G.tree[id]||0;
function heroStats(h){const c=CLASSES[h.cls],L=h.lvl-1;let hp=c.hp+c.ghp*L,atk=c.atk+c.gatk*L,def=c.def+c.gdef*L;
  const eq=h.eq||{};if(eq.weapon)atk+=itemStat(eq.weapon);if(eq.cape)def+=itemStat(eq.cape);if(eq.charm)hp+=itemStat(eq.charm);
  hp*=1+0.1*treeLv('hp');atk*=1+0.1*treeLv('atk');return{maxhp:R(hp),atk:R(atk),def:R(def),spd:c.spd};}
function enemyStats(id,L){const e=ENEMIES[id];return{maxhp:R((46+15*L)*e.hp),atk:R((9+2.7*L)*e.atk),def:R((2+1.0*L)*e.def),spd:e.spd};}
// items
let itemSeq=1;
function itemStat(it){const r=it.rank+1;if(it.slot==='weapon')return R(r*6+it.lvl*r*1.5);if(it.slot==='cape')return R(r*3+it.lvl*r);return R(r*12+it.lvl*r*4);}
function itemName(it){if(it.slot==='weapon')return WEAPON_ADJ[it.rank]+' '+WEAPON_NOUN[it.kind];if(it.slot==='cape')return CAPE_NAMES[it.rank];return CHARM_NAMES[it.rank];}
function itemIcon(it){return it.slot==='weapon'?it.kind:it.slot==='cape'?'cape':(it.rank%2?'amulet':'ring');}
function itemStatLabel(it){return (it.slot==='weapon'?'+'+itemStat(it)+' ATK':it.slot==='cape'?'+'+itemStat(it)+' DEF':'+'+itemStat(it)+' HP');}
function wielders(it){return Object.values(CLASSES).filter(c=>c.weapon===it.kind).map(c=>c.name).join('/');}
function upgradeCost(it){return R(3*(it.rank+1)*(it.lvl+1)*Math.pow(1.12,it.lvl));}
const DROP_TABLE=[[80,20,0,0,0],[55,35,10,0,0],[35,40,20,5,0],[20,35,30,12,3]];
function rollRank(zoneIdx,shift=0){const t=DROP_TABLE[Math.min(zoneIdx,DROP_TABLE.length-1)];const cap=t.reduce((m,w,i)=>w>0?i:m,0);let r=rand()*100,rank=0;for(let i=0;i<5;i++){r-=t[i];if(r<=0){rank=i;break;}}return Math.min(cap,rank+shift);}
function makeItem(zoneIdx,forceRank){const slot=['weapon','cape','charm'][Math.floor(rand()*3)];
  let rank=forceRank==='boss'?rollRank(zoneIdx,1):forceRank;if(rank==null)rank=rollRank(zoneIdx);
  const kinds=[...new Set(G.roster.map(h=>CLASSES[h.cls].weapon))];
  return{id:itemSeq++,slot,rank,lvl:0,kind:kinds[Math.floor(rand()*kinds.length)],isNew:true};}

// ============================================================ sprites & variants
const ATLAS=ASSETS.atlas,IMG={},SCENES={};
function loadAll(){const ps=[];
  for(const [k,v] of Object.entries(ATLAS))ps.push(new Promise(res=>{const im=new Image();im.onload=res;im.onerror=res;im.src=v.src;IMG[k]=im;}));
  for(const [k,layers] of Object.entries(ASSETS.scenes)){SCENES[k]=layers.map(l=>{const im=new Image();ps.push(new Promise(res=>{im.onload=res;im.onerror=res;}));im.src=l.src;return{img:im,p:l.p};});}
  return Promise.all(ps);}
function rgb2hsv(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360;}return[h,mx?d/mx:0,mx];}
function hsv2rgb(h,s,v){const c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c;let r,g,b;if(h<60)[r,g,b]=[c,x,0];else if(h<120)[r,g,b]=[x,c,0];else if(h<180)[r,g,b]=[0,c,x];else if(h<240)[r,g,b]=[0,x,c];else if(h<300)[r,g,b]=[x,0,c];else[r,g,b]=[c,0,x];return[R((r+m)*255),R((g+m)*255),R((b+m)*255)];}
function classify(r,g,b,a){if(!a)return'none';const[h,s,v]=rgb2hsv(r,g,b);if(v<0.14)return'outline';if(s<0.22)return v>0.8?'bright':'metal';if((h<18||h>335)&&s>0.45)return'accent';if(h>=170&&h<=220&&s>0.4)return'cyan';return'other';}
const WTINT=[null,[210,0.3,1.0],[172,0.6,1.0],[45,0.8,1.0],[14,0.9,1.0]];
const CAPES=[null,{col:[150,150,160],dark:[100,100,110],w:4,len:0.75},{col:[60,120,70],dark:[38,80,46],w:5,len:0.9},{col:[50,90,170],dark:[30,58,120],w:6,len:1.05},{col:[120,50,150],dark:[80,30,100],w:7,len:1.2},{col:[220,170,40],dark:[160,115,20],w:8,len:1.35}];
const variantCache={};
function heroSprite(h){const wr=h.eq&&h.eq.weapon?h.eq.weapon.rank+1:0,cr=h.eq&&h.eq.cape?h.eq.cape.rank+1:0;const key=h.uid+'|'+wr+'|'+cr;
  if(variantCache[key])return variantCache[key];
  const A=ATLAS[h.uid],base=IMG[h.uid];const c=document.createElement('canvas');c.width=base.width||A.cw;c.height=base.height||A.ch;const x=c.getContext('2d');x.drawImage(base,0,0);
  if(wr>1||cr>0){
    const wc=CLASSES[h.cls].wclass,tint=WTINT[Math.min(4,wr-1)];
    const rows=Object.keys(A.anims).length,cols=c.width/A.cw;
    for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){
      const id=x.getImageData(q*A.cw,r*A.ch,A.cw,A.ch),d=id.data,cw=A.cw,ch=A.ch;
      if(wr>1&&tint){for(let i=0;i<d.length;i+=4){if(classify(d[i],d[i+1],d[i+2],d[i+3])!==wc)continue;const[hh,ss,vv]=rgb2hsv(d[i],d[i+1],d[i+2]);const[nr,ng,nb]=tint[0]==null?hsv2rgb(hh,ss,Math.min(1,vv*tint[2])):hsv2rgb(tint[0],tint[1],Math.min(1,vv*tint[2]));d[i]=nr;d[i+1]=ng;d[i+2]=nb;}}
      if(cr>0){const cp=CAPES[cr];let x0=cw,y0=ch,x1=0,y1=0;for(let yy=0;yy<ch;yy++)for(let xx=0;xx<cw;xx++)if(d[(yy*cw+xx)*4+3]){if(xx<x0)x0=xx;if(yy<y0)y0=yy;if(xx>x1)x1=xx;if(yy>y1)y1=yy;}
        if(x1>=x0){const feet=A.oy,sh=feet-15,hip=Math.min(feet-1,sh+R(cp.len*14));const cape=new Set();const n=hip-sh;
          for(let yy=sh;yy<hip;yy++){if(yy<0||yy>=ch)continue;let left=-1;for(let xx=Math.max(0,A.ox-15);xx<cw;xx++)if(d[(yy*cw+xx)*4+3]){left=xx;break;}if(left<0)continue;const w=1+R((cp.w-1)*((yy-sh)/Math.max(1,n-1)));
            for(let k=1;k<=w;k++){const X=left-k;if(X>=0&&!d[(yy*cw+X)*4+3])cape.add(yy*cw+X);}}
          for(const i of cape){const yy=Math.floor(i/cw),xx=i%cw;const edge=!cape.has(i+1)&&xx+1<cw&&d[(i+1)*4+3];const col=edge?cp.dark:cp.col;d[i*4]=col[0];d[i*4+1]=col[1];d[i*4+2]=col[2];d[i*4+3]=255;}
          for(const i of cape){const yy=Math.floor(i/cw),xx=i%cw;for(const[dx,dy]of[[-1,0],[0,1],[0,-1],[1,0]]){const nx=xx+dx,ny=yy+dy;if(nx<0||ny<0||nx>=cw||ny>=ch)continue;const j=ny*cw+nx;if(!d[j*4+3]&&!cape.has(j)){d[j*4]=26;d[j*4+1]=20;d[j*4+2]=32;d[j*4+3]=255;}}}}}
      x.putImageData(id,q*A.cw,r*A.ch);}
  }
  variantCache[key]=c;return c;}
function setAnim(u,name,loop=true,fps=10){if(u.anim===name&&loop&&u.loop)return;u.anim=name;u.frame=0;u.ftime=0;u.loop=loop;u.fps=fps;u.done=false;}
function stepAnim(u,dt){const a=ATLAS[u.uid].anims[u.anim];u.ftime+=dt;while(u.ftime>=1/u.fps){u.ftime-=1/u.fps;if(u.frame<a.n-1)u.frame++;else if(u.loop)u.frame=0;else u.done=true;}}
function unitImg(u){return u.enemy?IMG[u.uid]:heroSprite(u);}
function drawSprite(u,x,y,frame,anim,flip,scale=1){const A=ATLAS[u.uid],a=A.anims[anim];ctx.save();if(flip){ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);}
  ctx.drawImage(unitImg(u),frame*A.cw,a.row*A.ch,A.cw,A.ch,x-A.ox*scale,y-A.oy*scale,A.cw*scale,A.ch*scale);ctx.restore();}
function drawUnit(u){const x=R(u.x+u.dx),y=R(GROUND+(u.yoff||0)+(u.fly?-10:0)-(u.hop?R(Math.sin(Math.PI*u.hop)*6):0));
  const sc=u.scale||1;ctx.fillStyle='rgba(0,0,0,0.28)';ctx.beginPath();ctx.ellipse(x,GROUND+(u.yoff||0)+1,9*sc,2.5*sc,0,0,Math.PI*2);ctx.fill();
  if(u.dead&&u.done)ctx.globalAlpha=0.55;if(u.flash>0){ctx.globalAlpha=0.6;}
  drawSprite(u,x,y,u.frame,u.anim,u.flip,sc);ctx.globalAlpha=1;
  if(u.status&&u.status.shield>0){ctx.strokeStyle='rgba(241,215,120,0.8)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y-12,14,16,0,0,Math.PI*2);ctx.stroke();}
  if(u.status&&u.status.rage>0){ctx.fillStyle='rgba(220,60,40,0.25)';ctx.beginPath();ctx.ellipse(x,y-12,12,15,0,0,Math.PI*2);ctx.fill();}}
function attackFps(n){return Math.max(10,Math.min(16,n*1.1));}

// ============================================================ state
const G={screen:'road',zone:0,prog:[0,0,0,0],cleared:[false,false,false,false],gold:0,ore:0,dust:0,roster:[],active:[],pack:[],tree:{},quests:[],mode:'walk',enc:3,enemies:[],projs:[],floats:[],banner:null,scroll:0,t:0,action:null,timer:0,shake:0,parts:[],autoUntil:0,autoCast:false,music:true,title:true,speed:1,speedUntil:0,mult:1,wins:0,fast:false,sheet:null,gearHero:0,toast:null,selItem:null,campfireDone:false};
function mkHero(def){const h={def,id:def.id,name:def.name,cls:def.cls,uid:def.cls,range:CLASSES[def.cls].range,lvl:1,xp:0,x:0,dx:0,yoff:0,flip:false,hop:0,gauge:rand()*50,dead:false,charge:0,abLvl:1,eq:{},status:{},readyT:0};Object.assign(h,heroStats(h));h.hp=h.maxhp;setAnim(h,'walk');return h;}
function addHero(def,lvl=1){const h=mkHero(def);h.lvl=lvl;Object.assign(h,heroStats(h));h.hp=h.maxhp;G.roster.push(h);if(G.active.length<4){h.x=-30;G.active.push(h);layout();}return h;}
const HERO_X=[52,86,120,154],ENEMY_X=[196,222,244],ENEMY_Y=[0,-3,3];
const RECRUIT_HINT=['','Sera · at the first campfire','Vex · shard of Greenhollow','Morrow · shard of Stillwater'];
function layout(){G.active.forEach((h,i)=>{h.tx=HERO_X[3-i];if(h.x==null||isNaN(h.x))h.x=h.tx;});}
function refreshStats(h){const f=h.hp/h.maxhp;Object.assign(h,heroStats(h));h.hp=R(clamp(f,0,1)*h.maxhp);}
addHero(HEROES[0]);

// ============================================================ helpers: floats, banners, toasts
function float(x,y,t,color=C.cream,big=false,life=1.1){G.floats.push({x,y,text:t,color,life,big});}
function levelBurst(h){float(h.x,GROUND-42,'Lv '+h.lvl+'!',C.goldL,true,1.8);for(let k=0;k<18;k++){const a=rand()*Math.PI*2,sp=20+rand()*40;G.parts.push({x:h.x+(rand()*8-4),y:GROUND-14,vx:Math.cos(a)*sp,vy:-Math.abs(Math.sin(a))*sp-20,life:0.7+rand()*0.6,col:[C.goldL,C.gold,'#fff','#8fd4ff'][k%4]});}}
function banner(t,sub='',dur=2.4){G.banner={text:t,sub,t:0,dur};}
function toast(t){G.toast={text:t,t:0};}
function living(list){return list.filter(u=>!u.dead);}
function frontHero(){return living(G.active)[0];}
function abilityPower(h){return (1+0.12*(h.abLvl-1))*(1+0.1*treeLv('abil'));}
function abilityDesc(h){const r=h.abLvl,p=abilityPower(h);switch(CLASSES[h.cls].ab.id){
  case 'shieldwall':return 'Draws all attacks for 3 turns, taking '+R(shieldPct(h)*100)+'% less damage.';
  case 'sanctuary':return 'Heals the party '+R(35*p)+'% and revives the fallen at '+R(30*p)+'%.';
  case 'shadowstep':return 'Three strikes at '+R(90*p)+'% each; the last always crits.';
  case 'meteor':return 'Hits every enemy for '+R(180*p)+'% damage.';
  case 'rain':return 'Hits every enemy for '+R(110*p)+'% and bleeds them '+(3+Math.floor(r/2))+' turns.';
  case 'rage':return 'Double damage for '+(3+Math.floor(r/3))+' turns; takes 50% more.';}}
function shieldPct(h){return Math.min(0.7,0.3+0.05*(h.abLvl-1)+0.05*treeLv('abil'));}

// ============================================================ battle
function spawnEncounter(){
  const Z=ZONES[G.zone],p=G.prog[G.zone];const bossFight=!!(Z.boss&&p===Z.fights-1&&!G.cleared[G.zone]);
  const n=bossFight?1:1+Math.floor(rand()*Math.min(3,1+p/3));G.enemies=[];
  for(let i=0;i<n;i++){const id=bossFight?Z.boss:Z.pool[Math.floor(rand()*Z.pool.length)];const L=R(Z.lv+p*0.6+(G.cleared[G.zone]?3:0));
    const E=ENEMIES[id];const e={uid:E.uid||id,id,name:E.name,lvl:L,x:W+40+i*36,slot:bossFight?200+8*(E.scale||1):ENEMY_X[i],dx:0,yoff:bossFight?0:ENEMY_Y[i],flip:true,fly:!!E.fly,range:E.range,boss:!!E.boss,scale:E.scale||1,gauge:rand()*40,dead:false,enemy:true,status:{},flash:0};
    Object.assign(e,enemyStats(id,L));e.hp=e.maxhp;setAnim(e,'walk');G.enemies.push(e);}
  G.mode='enter';G.bossFight=bossFight;G.active.forEach(h=>setAnim(h,'idle'));if(bossFight)banner(ENEMIES[Z.boss].name,'guards the shard',2.5);
}
function dealDamage(src,tgt,mult=1,opts={}){
  let atk=src.atk;if(src.status&&src.status.rage>0)atk*=2;
  let dmg=atk*(0.85+rand()*0.3)*mult-tgt.def*0.5*(tgt===frontHero()?1.15:1);const c=CLASSES[src.cls];let crit=opts.crit||false;
  if(!crit&&c&&c.crit&&rand()<c.crit)crit=true;if(crit)dmg*=1.6;
  if(tgt.status&&tgt.status.shield>0)dmg*=(1-(tgt.status.shieldPct||0.3));if(tgt.status&&tgt.status.rage>0)dmg*=1.5;
  dmg=Math.max(1,R(dmg));tgt.hp-=dmg;
  float(tgt.x+tgt.dx+(rand()*10-5),GROUND+(tgt.yoff||0)-30,crit?dmg+'!':String(dmg),src.enemy?'#ff8a80':(crit?C.goldL:C.cream),crit);
  if(tgt.hp<=0){tgt.hp=0;tgt.dead=true;tgt.status={};setAnim(tgt,'death',false,8);if(tgt.enemy)killReward(tgt);}
  else if(!(G.action&&G.action.u===tgt)&&!opts.noHurt)setAnim(tgt,'hurt',false,10);
  return dmg;}
function killReward(e){const xp=8+e.lvl*4+(e.boss?60:0),gold=3+e.lvl*2+(e.boss?80:0);G.gold+=gold;float(e.x+e.dx,GROUND+(e.yoff||0)-40,'+'+gold+' gold',C.goldL);
  for(const h of G.active){h.xp+=h.dead?R(xp/2):xp;while(h.xp>=xpNeed(h.lvl)){h.xp-=xpNeed(h.lvl);h.lvl++;refreshStats(h);h.hp=h.maxhp;h.dead=false;levelBurst(h);}}
  if(rand()<0.35){const o=1+Math.floor(rand()*2);G.ore+=o;float(e.x+e.dx,GROUND+(e.yoff||0)-50,'+'+o+' ore',C.muted);}}
function heal(src,tgt,amt){amt=R(amt);tgt.hp=Math.min(tgt.maxhp,tgt.hp+amt);float(tgt.x+tgt.dx,GROUND-30,'+'+amt,'#8ff0a0');}
function pickTarget(u){const foes=living(u.enemy?G.active:G.enemies);if(!foes.length)return null;
  if(u.enemy){const shield=foes.find(h=>h.status.shield>0);if(shield)return shield;const f=frontHero();return rand()<0.6?f:foes[Math.floor(rand()*foes.length)];}
  return foes.slice().sort((a,b)=>a.hp-b.hp)[0];}
function chooseAction(u){
  const foes=living(u.enemy?G.active:G.enemies),allies=living(u.enemy?G.enemies:G.active);if(!foes.length)return null;
  const n=ATLAS[u.uid].anims.attack.n,fps=attackFps(n),hit=Math.floor(n*0.5);
  if(!u.enemy&&u.charge>=100&&(u.tapCast||(G.autoCast&&u.readyT>=0.4))){return abilityAction(u,!!u.tapCast);}
  if(u.range==='heal')return{u,kind:'bolt',tgt:pickTarget(u),anim:'attack',fps,hit};
  const tgt=pickTarget(u);
  if(u.range==='aoe')return{u,kind:'aoe',tgts:foes,anim:'attack',fps,hit};
  if(u.range==='ranged')return{u,kind:'ranged',tgt,anim:'attack',fps,hit};
  return{u,kind:'melee',tgt,anim:'attack',fps,hit,phase:'dash',pt:0};}
function abilityAction(u,tapped){const c=CLASSES[u.cls],id=c.ab.id;const pow=abilityPower(u)*(tapped?1.3:1);u.charge=0;u.readyT=0;u.tapCast=false;
  const anim=id==='sanctuary'?'heal':'attack';const n=ATLAS[u.uid].anims[anim].n;
  float(u.x,GROUND-48,c.ab.name+(tapped?'!':''),C.goldL,true,1.5);
  return{u,kind:'ability',ab:id,pow,anim,fps:attackFps(n),hit:Math.floor(n*0.5),tgts:living(G.enemies),tgt:pickTarget(u),hits:0,phase:'dash',pt:0};}
function startAction(a){G.action=a;a.hitDone=false;a.pt=0;if(a.kind!=='melee'&&!(a.kind==='ability'&&(a.ab==='shadowstep')))setAnim(a.u,a.anim,false,a.fps);}
function endAction(){const a=G.action,u=a.u;G.action=null;u.dx=0;if(!u.dead)setAnim(u,'idle');
  if(!u.enemy&&a.kind!=='ability'){u.charge=Math.min(100,u.charge+4);}
  for(const s of ['shield','rage']){if(u.status[s]>0)u.status[s]--;}}
function applyAbility(a){const u=a.u,pow=a.pow;
  switch(a.ab){
    case 'shieldwall':u.status.shield=4;u.status.shieldPct=shieldPct(u);break;
    case 'sanctuary':for(const h of G.active){if(h.dead){h.dead=false;h.hp=R(h.maxhp*0.3*pow);setAnim(h,'idle');float(h.x,GROUND-30,'Revived','#8ff0a0');}else heal(u,h,h.maxhp*0.35*pow);}break;
    case 'meteor':G.shake=0.4;for(const t of a.tgts)if(!t.dead)dealDamage(u,t,1.8*pow);break;
    case 'rain':for(const t of a.tgts)if(!t.dead){dealDamage(u,t,1.1*pow);t.status.bleed=3+Math.floor(u.abLvl/2);}break;
    case 'rage':u.status.rage=4+Math.floor(u.abLvl/3);break;
  }}
function updateAction(dt){const a=G.action,u=a.u;
  if(a.kind==='melee'||(a.kind==='ability'&&a.ab==='shadowstep')){
    const tgt=a.tgt;if(!tgt||tgt.dead&&a.phase==='dash'){endAction();return;}
    const dir=u.enemy?-1:1,dest=(tgt.x+tgt.dx)-dir*(22+(tgt.scale?10*(tgt.scale-1):0))-u.x;
    if(a.phase==='dash'){a.pt+=dt/0.13;u.dx=dest*Math.min(1,a.pt);if(a.pt>=1){a.phase='hit';setAnim(u,'attack',false,a.kind==='ability'?16:a.fps);}}
    else if(a.phase==='hit'){if(!a.hitDone&&u.frame>=a.hit){a.hitDone=true;if(!tgt.dead){if(a.kind==='ability'){a.hits++;dealDamage(u,tgt,0.9*a.pow,{crit:a.hits===3,noHurt:a.hits<3});}else dealDamage(u,tgt);}}
      if(u.done){if(a.kind==='ability'&&a.hits<3&&!tgt.dead){a.hitDone=false;setAnim(u,'attack',false,16);}else{a.phase='back';a.pt=0;a.from=u.dx;}}}
    else{a.pt+=dt/0.13;u.dx=a.from*(1-Math.min(1,a.pt));if(a.pt>=1){u.dx=0;endAction();}}
    return;}
  if(!a.hitDone&&u.frame>=a.hit){a.hitDone=true;
    if(a.kind==='ability')applyAbility(a);
    else if(a.kind==='heal')heal(u,a.tgt,u.atk*2.4);
    else if(a.kind==='aoe'){for(const t of a.tgts)if(!t.dead)G.projs.push(magicProj(u,t,0.7));}
    else if(a.kind==='bolt'){if(a.tgt&&!a.tgt.dead)G.projs.push(magicProj(u,a.tgt,0.8));}
    else if(a.kind==='ranged'){if(a.tgt){const A=ATLAS[u.uid];G.projs.push({x:u.x+u.dx+(u.enemy?-8:8),y:GROUND+(u.yoff||0)-A.oy*0.6,tgt:a.tgt,src:u,t:0,dur:0.28,flip:u.enemy});}}}
  if(u.done)endAction();}
function magicColor(u){if(u.enemy)return'#b06cff';const it=u.eq&&u.eq.weapon;const t=it?WTINT[Math.min(4,it.rank)]:null;if(!t)return u.cls==='cleric'?'#ffe9a8':'#7fd4ff';const[r,g,b]=hsv2rgb(t[0],t[1],1);return`rgb(${r},${g},${b})`;}
function magicProj(u,t,mult){return{x:u.x+u.dx+(u.enemy?-10:10),y:GROUND+(u.yoff||0)-16,tgt:t,src:u,t:0,dur:0.32,flip:u.enemy,magic:true,mult,col:magicColor(u)};}
function updateProjs(dt){for(const p of G.projs){p.t+=dt;if(p.magic&&rand()<0.7){const k=p.t/p.dur,txx=p.tgt.x+p.tgt.dx,x=p.x+(txx-p.x)*k,y=p.y+(GROUND+(p.tgt.yoff||0)-16-p.y)*k;G.parts.push({x,y:y+(rand()*4-2),vx:0,vy:-6,life:0.3,col:p.col});}if(p.t>=p.dur){p.hit=true;if(!p.tgt.dead)dealDamage(p.src,p.tgt,p.mult||1);}}G.projs=G.projs.filter(p=>!p.hit);}
function drawProjs(){const P=ATLAS._arrow,img=IMG._arrow;for(const p of G.projs){const k=p.t/p.dur,txx=p.tgt.x+p.tgt.dx;
  if(p.magic){const x=p.x+(txx-p.x)*k,y=p.y+(GROUND+(p.tgt.yoff||0)-16-p.y)*k;ctx.globalAlpha=0.5;px(R(x)-3,R(y)-3,6,6,p.col);ctx.globalAlpha=1;px(R(x)-2,R(y)-2,4,4,p.col);px(R(x)-1,R(y)-1,2,2,'#fff');continue;}
  const tyy=GROUND+(p.tgt.yoff||0)-ATLAS[p.tgt.uid].oy*0.6;const x=p.x+(txx-p.x)*k,y=p.y+(tyy-p.y)*k-Math.sin(k*Math.PI)*8;ctx.save();ctx.translate(R(x),R(y));if(p.flip)ctx.scale(-1,1);ctx.drawImage(img,-P.w/2,-P.h/2);ctx.restore();}}
function tapDamage(){const avg=G.active.reduce((s,h)=>s+h.lvl,0)/Math.max(1,G.active.length);return R((1+avg*0.4)*Math.pow(1.4,treeLv('tap')));}
function tapEnemy(e){if(G.mode!=='battle'||e.dead)return;const d=tapDamage();e.hp-=d;e.flash=0.12;float(e.x+e.dx+(rand()*8-4),GROUND+(e.yoff||0)-34,String(d),C.cyan);
  if(e.hp<=0){e.hp=0;e.dead=true;setAnim(e,'death',false,8);killReward(e);}
  const mom=treeLv('tapcharge');if(mom)for(const h of living(G.active)){h.charge=Math.min(100,h.charge+mom);}}
function endBattle(win){const Z=ZONES[G.zone];
  if(win){G.wins++;
    const dropChance=G.wins<=3?0.5:0.18;if(G.pack.length<15&&(rand()<dropChance||G.bossFight||G.wins===1)){const it=makeItem(G.zone,G.bossFight?'boss':null);if(G.wins===1){it.slot='weapon';it.kind=CLASSES[G.active[0].cls].weapon;it.rank=0;}G.pack.push(it);float(W/2-40,SCENE_Y+56,itemName(it),RANKHEX[it.rank],true);toast('Found: '+itemName(it)+' — see Gear');}
    const restHeal=0.15+0.05*treeLv('rest');for(const h of G.active){h.status={};if(h.dead){h.dead=false;h.hp=R(h.maxhp*0.3);}else h.hp=Math.min(h.maxhp,h.hp+R(h.maxhp*restHeal));}
    if(!G.cleared[G.zone]){G.prog[G.zone]++;
      if(G.prog[G.zone]>=Z.fights){G.cleared[G.zone]=true;grantShardVillagers();banner('Crystal shard recovered!',G.zone<ZONES.length-1?ZONES[G.zone+1].name+' lies ahead':'The road is whole again',3.5);G.dust+=1;
        const rdef=HEROES.find(d=>d.id===Z.recruit);if(rdef&&!G.roster.find(h=>h.id===rdef.id)){const h=addHero(rdef,Math.max(1,Z.lv));G.pending=h.name+' the '+CLASSES[h.cls].name+' joins the road';}}}
    if(!G.campfireDone&&G.wins>=2){G.campfireDone=true;const h=addHero(HEROES[1],1);G.pending='Sera the Cleric joins you at the campfire';}
    G.mode='victory';G.timer=1.4;
  }else{banner('The party falls','Regrouping at camp…',2.6);G.mode='defeat';G.timer=2.8;}}
function zoneUnlocked(z){return z===0||G.cleared[z-1];}
function marchSpeed(){return 28*(1+0.1*treeLv('march'));}

// ============================================================ quests
function questSlots(){return 3+treeLv('slots');}
function heroStatus(h){if(G.active.includes(h))return'marching';if(G.quests.find(q=>q.hero===h))return'quest';if(G.castle&&G.castle.garrison.includes(h.id))return'garrison';return'camp';}
function questDur(q){return q.dur*(G.fast?1/120:1);}
function startQuest(h,qdef){G.quests.push({hero:h,q:qdef,end:now()+questDur(qdef)*1000});toast(h.name+' sets out to '+qdef.name.toLowerCase());}
function collectQuest(q){const mult=(1+0.15*treeLv('quest'))*(CLASSES[q.hero.cls].weapon===({forage:'staff',hunt:'axe',scout:'bow',pilgrim:'sword'})[q.q.id]?1.3:1);const L=q.hero.lvl;let msg='';
  if(q.q.reward==='gold'){const g=R((30+L*8)*mult);G.gold+=g;msg='+'+g+' gold';}
  else if(q.q.reward==='ore'){const o=R((8+L)*mult);G.ore+=o;msg='+'+o+' ore';if(rand()<0.4&&G.pack.length<15){G.pack.push(makeItem(G.zone));msg+=' and gear';}}
  else if(q.q.reward==='gear'){if(G.pack.length<15){const it=makeItem(G.zone,'boss');G.pack.push(it);msg=itemName(it);}else msg='pack full — gear lost';}
  else{const d=R(2*mult);G.dust+=d;msg='+'+d+' crystal dust';}
  q.hero.xp+=R(20*L);G.quests=G.quests.filter(x=>x!==q);toast(q.hero.name+' returns: '+msg);}
function fmtT(s){s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`:`${m}:${String(sec).padStart(2,'0')}`;}

// ============================================================ gear
function equipBest(only){for(const h of (only?[only]:G.roster)){for(const slot of ['weapon','cape','charm']){const cands=G.pack.filter(it=>it.slot===slot&&(slot!=='weapon'||it.kind===CLASSES[h.cls].weapon));const cur=h.eq[slot];const best=cands.sort((a,b)=>itemStat(b)-itemStat(a))[0];
  if(best&&(!cur||itemStat(best)>itemStat(cur))){G.pack=G.pack.filter(i=>i!==best);if(cur)G.pack.push(cur);h.eq[slot]=best;best.isNew=false;}}refreshStats(h);}toast(only?'Best gear on '+only.name:'Best gear equipped');}
function equipItem(h,it){if(it.slot==='weapon'&&it.kind!==CLASSES[h.cls].weapon){toast(h.name+" can't wield a "+WEAPON_NOUN[it.kind].toLowerCase());return;}
  const cur=h.eq[it.slot];G.pack=G.pack.filter(i=>i!==it);if(cur)G.pack.push(cur);h.eq[it.slot]=it;it.isNew=false;refreshStats(h);toast(itemName(it)+' equipped');}
function unequip(h,slot){const it=h.eq[slot];if(!it)return;if(G.pack.length>=15){toast('Pack is full');return;}delete h.eq[slot];G.pack.push(it);refreshStats(h);}
function sellItem(it){const o=(it.rank+1)*4+it.lvl*2;G.pack=G.pack.filter(i=>i!==it);G.ore+=o;toast('Forged into '+o+' ore');}
function upgradeItem(it,h){let n=0,want=G.mult==='max'?1e9:G.mult;while(n<want){const cost=upgradeCost(it);if(G.ore<cost)break;G.ore-=cost;it.lvl++;n++;}if(!n){toast('Need '+upgradeCost(it)+' ore');return;}if(h)refreshStats(h);toast(itemName(it)+' +'+it.lvl+(n>1?' ('+n+' ranks)':''));}
function multLabel(){return G.mult==='max'?'Max':'×'+G.mult;}
function cycleMult(){G.mult=G.mult===1?5:G.mult===5?25:G.mult===25?'max':1;}

// ============================================================ main loop
let last=0;const hits=[];
function hit(x,y,w,h,fn){hits.push({x,y,w,h,fn});}
function update(dt){G.t+=dt;if(G.shake>0)G.shake-=dt;
  for(const h of G.active){if(h.tx!=null&&Math.abs(h.x-h.tx)>0.2)h.x+=(h.tx-h.x)*Math.min(1,dt*6);else if(h.tx!=null)h.x=h.tx;h.hop=Math.max(0,h.hop-dt*2.5);if(G.mode==='battle'&&!h.dead&&h.charge<100){h.charge=Math.min(100,h.charge+7*dt);if(h.charge>=100)h.readyT=0;}if(h.charge>=100&&!h.dead)h.readyT+=dt;}
  const all=G.active.concat(G.enemies);
  for(const u of all){stepAnim(u,dt);if(u.flash>0)u.flash-=dt;if(u.done&&u.anim==='hurt'&&!(G.action&&G.action.u===u))setAnim(u,'idle');}
  for(const f of G.floats){f.life-=dt;f.y-=18*dt;}G.floats=G.floats.filter(f=>f.life>0);for(const p of G.parts){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=40*dt;}G.parts=G.parts.filter(p=>p.life>0);
  if(G.banner){G.banner.t+=dt;if(G.banner.t>=G.banner.dur){G.banner=null;}}
  if(G.pending&&!G.banner){banner(G.pending,'',2.6);G.pending=null;}
  if(G.toast){G.toast.t+=dt;if(G.toast.t>2.2)G.toast=null;}
  if(G.title){return;}
  if(G.mode==='walk'){G.scroll+=marchSpeed()*dt;G.enc-=dt;G.active.forEach(h=>setAnim(h,'walk'));if(G.enc<=0&&!G.sheet)spawnEncounter();}
  else if(G.mode==='enter'){let all2=true;for(const e of G.enemies){if(e.x>e.slot){e.x=Math.max(e.slot,e.x-70*dt);all2=false;}else if(e.anim==='walk'&&!e.fly)setAnim(e,'idle');}if(all2){G.mode='battle';G.enemies.forEach(e=>setAnim(e,'idle'));}}
  else if(G.mode==='battle'){
    if(G.action)updateAction(dt);updateProjs(dt);
    if(!living(G.enemies).length&&!G.action&&!G.projs.length)return endBattle(true);
    if(!living(G.active).length&&!G.action&&!G.projs.length)return endBattle(false);
    if(!G.action){for(const u of all)if(!u.dead)u.gauge+=u.spd*dt*5;
      let ready=all.filter(u=>!u.dead&&u.gauge>=100).sort((a,b)=>b.gauge-a.gauge)[0];
      const caster=G.active.find(h=>!h.dead&&h.charge>=100&&(h.tapCast||(G.autoCast&&h.readyT>=0.4)));if(caster)ready=caster;
      if(ready){if(ready!==caster)ready.gauge=0;const a=chooseAction(ready);if(a){startAction(a);
        for(const e of living(G.enemies))if(e.status.bleed>0&&ready.enemy){e.status.bleed--;e.hp-=R(e.maxhp*0.04);float(e.x,GROUND-26,'bleed','#ff8a80');if(e.hp<=0){e.hp=0;e.dead=true;setAnim(e,'death',false,8);killReward(e);}}}}}
  }else if(G.mode==='victory'){G.timer-=dt;if(G.timer<=0){G.enemies=[];G.mode='walk';G.enc=2.5+rand()*3;if(G.bossFight)G.bossFight=false;}}
  else if(G.mode==='defeat'){G.timer-=dt;if(G.timer<=0){G.enemies=[];G.projs=[];G.action=null;for(const h of G.active){h.dead=false;h.hp=h.maxhp;h.dx=0;h.status={};setAnim(h,'walk');}layout();if(!G.cleared[G.zone])G.prog[G.zone]=Math.max(0,G.prog[G.zone]-3);G.mode='walk';G.enc=3;}}
  if(G.castle&&(G.t%1)<dt)castleTick();
  for(const q of G.quests.slice())if(now()>=q.end&&!q.done){q.done=true;toast(q.hero.name+' is back from the '+q.q.name.toLowerCase());}
}

// ============================================================ drawing: shared chrome
function drawTop(){px(0,0,W,15,'#090b14');px(0,15,W,1,C.goldD);
  icon('coin',6,2,4);icon('ore',80,2,0);icon('crystal',148,2,2);icon('gear',252,2,0);hit(246,0,24,16,()=>openSheet('settings'));
  const left=(G.autoUntil-now())/1000;
  if(left>0){icon('play',196,2,4);text(210,3.5,fmtT(left),'xs',C.goldL);}
  else{button(184,1,62,13,true);icon('play',187,2,4);text(218,3.5,'Auto-cast','xs',C.goldL,'center');hit(184,0,62,15,()=>openSheet('ad'));}
  text(21,2,G.gold.toLocaleString(),'bb',C.goldL);text(95,2,String(G.ore),'bb',C.cream);text(163,2,String(G.dust),'bb','#bbdefb');}
function drawTabs(){px(0,TABY,W,42,C.out);px(0,TABY,W,1,C.gold);px(0,TABY+1,W,1,C.goldD);
  const tabs=[['road','Road','road'],['sword','Gear','gear'],['party','Heroes','heroes'],['castle','Vael','vael'],['map','Map','map'],['nodes','Tree','tree']];
  tabs.forEach(([ic,label,id],i)=>{const x=i*45,on=G.screen===id;if(on){px(x+2,TABY+3,41,37,C.navy2);px(x+2,TABY+3,41,1,C.goldL);}icon(ic,x+16,TABY+8,on?4:0);if(id==='road'&&!on&&(G.mode==='battle'||G.mode==='enter')){ctx.globalAlpha=0.6+0.4*Math.sin(G.t*6);px(x+30,TABY+6,4,4,'#ff5050');ctx.globalAlpha=1;}text(x+22,TABY+24,label,'sb',on?C.goldL:C.muted,'center');hit(x,TABY,45,42,()=>{G.screen=id;G.selItem=null;G.salvage=false;});});}
function drawScene(){const Z=ZONES[G.zone];const key=(G.bossFight&&Z.bossScene)?Z.bossScene:Z.scene;const layers=SCENES[key];
  const sx=G.shake>0?R((rand()-0.5)*4):0;ctx.save();ctx.beginPath();ctx.rect(0,SCENE_Y,W,208);ctx.clip();ctx.translate(sx,0);
  for(const l of layers){const w=l.img.width||368;let off=-(Math.floor(G.scroll*l.p)%w);for(let x=off;x<W+w;x+=w)ctx.drawImage(l.img,x,SCENE_Y);}
  const units=G.active.concat(G.enemies).slice().sort((a,b)=>(a.yoff||0)-(b.yoff||0));for(const u of units)drawUnit(u);drawProjs();for(const p of G.parts){ctx.globalAlpha=clamp(p.life*1.5,0,1);px(R(p.x),R(p.y),p.life>0.5?2:1,p.life>0.5?2:1,p.col);}ctx.globalAlpha=1;
  if(G.mode==='battle'||G.mode==='enter'){for(const e of G.enemies){if(e.dead)continue;const x=R(e.x+e.dx),bs=e.scale||1,y=GROUND+(e.yoff||0)-(e.fly?40:R(26*bs+6));bar(x-10*bs,y,20*bs,4,e.hp/e.maxhp,C.red,'#1b1b1b');const hs=14*bs;hit(x-hs,GROUND-hs*2.4,hs*2,hs*2.6,()=>tapEnemy(e));}
  }
  for(const h of G.active){if(h.dead)continue;const fighting=G.mode==='battle'||G.mode==='enter';if(!fighting&&h.hp>=h.maxhp)continue;const x=R(h.x+h.dx),y=GROUND-30;bar(x-10,y,20,4,h.hp/h.maxhp,h.hp/h.maxhp>0.35?C.green:C.red,'#1b1b1b');}
  if(G.mode==='battle'||G.mode==='enter'){
    for(const u of G.active.concat(G.enemies)){if(u.dead)continue;const bs=u.scale||1,x=R(u.x+u.dx),y=u.enemy?GROUND+(u.yoff||0)-(u.fly?40:R(26*bs+6))+5:GROUND-25;px(x-10*bs,y,20*bs,1,'#141826');px(x-10*bs,y,R(20*bs*clamp(u.gauge/100,0,1)),1,'#8a93a8');}}
  ctx.restore();
  for(const f of G.floats){ctx.globalAlpha=1;text(R(f.x),R(f.y),f.text,f.big?'h':'sb',f.color,'center',Math.min(1,f.life*2));}
  if(G.mode==='walk'||G.mode==='victory'){const a=0.35+0.25*Math.sin(G.t*3);ctx.globalAlpha=a;px(0,SCENE_Y,W,2,C.goldL);px(0,SCENE_Y+206,W,2,C.goldL);px(0,SCENE_Y,2,208,C.goldL);px(W-2,SCENE_Y,2,208,C.goldL);ctx.globalAlpha=1;text(W-40,SCENE_Y+9,'Marching','xs',C.goldL,'right',0.5+0.5*a);}
  const sp=speedNow();button(W-36,SCENE_Y+4,32,18,sp>1);text(W-20,SCENE_Y+8.5,sp+'×','sb',sp>1?C.goldL:C.cream,'center');hit(W-36,SCENE_Y+4,32,18,()=>{if(G.speed===1)G.speed=2;else if(G.speed===2){openSheet('speedad');}else G.speed=1;});
  // zone plate
  frame(4,SCENE_Y+4,124,34,'rgba(22,26,44,0.88)');const p=Math.min(G.prog[G.zone],Z.fights);bar(9,SCENE_Y+28,114,5,p/Z.fights,G.cleared[G.zone]?'#7fd4ff':C.gold,'#0b0d16');
  text(9,SCENE_Y+8,Z.name,'sb',C.goldL);text(9,SCENE_Y+18,'Danger Lv '+Z.lv+'  ·  '+(G.cleared[G.zone]?'Shard recovered':'Shard '+p+'/'+Z.fights),'xs',C.muted);
}
function drawBanner(){if(G.banner){const b=G.banner,al=clamp(Math.min(b.t*3,(b.dur-b.t)*2),0,1);ctx.globalAlpha=al*0.6;px(0,SCENE_Y+120,W,34,'#000');ctx.globalAlpha=1;text(W/2,SCENE_Y+126,b.text,'big',C.goldL,'center',al);if(b.sub)text(W/2,SCENE_Y+141,b.sub,'s',C.cream,'center',al);}}
function drawCards(){px(0,16,W,80,'#0e111e');px(0,94,W,2,C.goldD);
  for(let i=0;i<4;i++){const x=4+i*66;const h=G.active[i];
    if(!h){frame(x,18,62,74,'#10131f',C.goldD,false);ctx.globalAlpha=0.25;icon('party',x+25,32,0);ctx.globalAlpha=1;
      const nxt=HEROES.filter(d=>!G.roster.find(r=>r.id===d.id))[i-G.active.length];
      text(x+31,58,'Open slot','sb',C.muted,'center');
      if(G.roster.length>G.active.length)hit(x,18,62,74,()=>openSheet('swap',{slot:i}));continue;}
    frame(x,18,62,74);const A=ATLAS[h.uid];drawSprite(h,x+31-14,18+30-3,0,'idle',false);
    icon('swap',x+46,22,0);
    text(x+31,20,h.name,'sb',h.dead?C.muted:C.cream,'center');text(x+6,50,'Lv '+h.lvl,'xs',C.muted);text(x+56,50,Math.max(0,h.hp)+'/'+h.maxhp,'xs',C.muted,'right');
    bar(x+5,60,52,7,h.hp/h.maxhp,h.hp/h.maxhp>0.35?C.green:C.red);px(x+5,72,52,3,C.out);px(x+6,73,R(50*h.xp/xpNeed(h.lvl)),1,C.xp);text(x+56,76,'XP','xs',C.dimt,'right');
    hit(x,18,62,74,()=>{G.drag={i,x0:0,y0:0,moved:false};});}
  if(G.drag&&G.drag.moved){const h=G.active[G.drag.i];if(h){ctx.globalAlpha=0.85;frame(R(G.drag.x-31),R(G.drag.y-37),62,74,C.navy2,C.goldL);drawSprite(h,R(G.drag.x-14),R(G.drag.y-10),0,'idle',false);ctx.globalAlpha=1;text(R(G.drag.x),R(G.drag.y-35),h.name,'sb',C.goldL,'center');}}}
function drawAbilityBar(){frame(4,308,262,ABH);const by=314,ic=Math.round((BS-24)/2);
  for(let i=0;i<4;i++){const h=G.active[i],x=14+i*66-Math.round((BS-32)/2);if(!h){button(x,by,BS,BS,false,true);ctx.globalAlpha=0.35;icon('lock',x+ic,by+ic,0,2);ctx.globalAlpha=1;continue;}const ready=h.charge>=100&&!h.dead;
    button(x,by,BS,BS,ready);icon(CLASSES[h.cls].ab.icon,x+ic,by+ic,ready?4:2,2);const fh=(BS-6)*h.charge/100;tx.fillStyle=ready?'rgba(241,215,120,0.28)':'rgba(79,195,247,0.30)';tx.fillRect((x+3)*TS,(by+3+(BS-6)-fh)*TS,(BS-6)*TS,fh*TS);
    if(ready&&G.mode==='battle'&&!h.tapCast){ctx.globalAlpha=0.5+0.5*Math.sin(G.t*6);px(x+1,by+1,BS-2,1,C.goldL);px(x+1,by+BS-2,BS-2,1,C.goldL);ctx.globalAlpha=1;text(x+BS/2,by+BS-8,'TAP','xsb',C.goldL,'center');}
    hit(x,by,BS,BS,()=>{if(!ready){toast(CLASSES[h.cls].ab.name+' — '+R(h.charge)+'% charged');return;}if(G.mode!=='battle'){toast('Abilities fire in battle');return;}h.tapCast=true;});}}
function drawCamp(){const CY=CAMP_Y,CH=TABY-4-CY,RH=Math.floor((CH-16)/3);frame(4,CY,262,CH);text(12,CY+3,'Camp','bb',C.goldL);const C2=G.castle,g=Math.floor(C2.stored.gold),o=Math.floor(C2.stored.ore);const hl=hordeLeft();
  const vs=(g+o>0?'Vael +'+g+' gold, '+o+' ore':'Quests '+G.quests.length+' / '+questSlots())+(hl<3600&&(C2.b.walls||C2.vil.total)?' · Horde '+fmtT(hl):'');text(258,CY+4,vs,'xs',g+o>0?C.goldL:C.muted,'right');if(g+o>0)hit(150,CY,116,12,()=>{G.screen='vael';});
  const slots=questSlots();
  for(let i=0;i<Math.min(3,slots);i++){const y=CY+15+i*RH,bh=Math.min(22,RH-4),by=y+Math.floor((RH-bh)/2),cy=y+Math.floor(RH/2);if(i%2===0)px(8,y,254,RH,C.band);const q=G.quests[i];
    if(q){const A=ATLAS[q.hero.uid];drawSprite(q.hero,22,cy+9,0,'idle',false);text(38,cy-8,q.hero.name+' · '+q.q.name,'s',C.cream);const left=(q.end-now())/1000;
      if(left>0){text(38,cy+1,'Returns in '+fmtT(left),'xs',C.muted);button(196,by,62,bh,false,true);text(227,by+bh/2-4,'Waiting','xs',C.muted,'center');}
      else{text(38,cy+1,'Returned','xs',C.green);button(196,by,62,bh,true);text(227,by+bh/2-4.5,'Collect','sb',C.goldL,'center');hit(196,by,62,bh,()=>collectQuest(q));}}
    else{px(12,cy-9,24,18,'#141828');px(13,cy-8,22,16,'#1c2038');text(38,cy-4,'Empty slot','s',C.muted);const free=G.roster.filter(h=>heroStatus(h)==='camp');
      button(196,by,62,bh,false,!free.length);text(227,by+bh/2-4,'Send hero','xs',free.length?C.cream:C.dimt,'center');hit(196,by,62,bh,()=>{if(!free.length){toast('Everyone is marching or away');return;}openSheet('send');});}}
}

// ============================================================ screens
function drawRoad(){drawCards();drawScene();px(0,304,W,4,C.out);drawAbilityBar();drawCamp();}
function drawPanelScreen(){px(0,16,W,TABY-16,'#0e111e');for(let y=16;y<TABY;y+=8)px(0,y,W,1,'#10141f');px(0,16,W,1,C.goldD);}
function drawGear(){drawPanelScreen();const h=G.roster[G.gearHero]||G.roster[0];
  text(8,26,'Equipment','title',C.goldL);
  G.roster.forEach((hh,i)=>{const x=W-8-(G.roster.length-i)*36+4,sel=hh===h;button(x,18,32,26,sel);ctx.save();ctx.beginPath();ctx.rect(x+2,20,28,22);ctx.clip();drawSprite(hh,x+16,41,0,'idle',false);ctx.restore();hit(x,18,32,26,()=>{G.gearHero=i;G.selItem=null;});});
  frame(4,48,262,92);px(10,54,70,80,C.out);px(11,55,68,78,'#222844');drawSprite(h,45,124,0,'idle',false,2);
  text(90,54,h.name,'h',C.cream);text(90,66,CLASSES[h.cls].name+' · Lv '+h.lvl+' · '+heroStatus(h),'s',C.muted);
  text(90,80,'HP','xs',C.muted);text(110,80,String(h.maxhp),'sb',C.cream);text(150,80,'ATK','xs',C.muted);text(172,80,String(h.atk),'sb',C.cream);
  text(90,91,'DEF','xs',C.muted);text(110,91,String(h.def),'sb',C.cream);text(150,91,'SPD','xs',C.muted);text(172,91,String(h.spd),'sb',C.cream);
  bar(90,104,166,5,h.xp/xpNeed(h.lvl),C.xp);text(90,111,'XP '+h.xp+' / '+xpNeed(h.lvl),'xs',C.muted);text(256,111,'Power '+(h.maxhp+h.atk*6+h.def*4),'xs',C.goldL,'right');
  ['weapon','cape','charm'].forEach((slot,i)=>{const x=4+i*88,it=h.eq[slot];frame(x,146,86,96,C.navy,it&&it.rank>0?RANKHEX[it.rank]:C.gold);
    px(x+29,158,28,28,C.out);px(x+30,159,26,26,'#222844');text(x+43,149,slot[0].toUpperCase()+slot.slice(1),'xs',C.muted,'center');
    if(it){icon(itemIcon(it),x+31,160,it.rank,2);text(x+43,189,itemName(it),'sb',it.rank>0?RANKHEX[it.rank]:C.cream,'center');text(x+43,199,'★'.repeat(it.rank+1)+'☆'.repeat(4-it.rank)+'  +'+it.lvl,'xs',C.goldL,'center');text(x+43,209,itemStatLabel(it),'xs',C.green,'center');
      const cost=upgradeCost(it),can=G.ore>=cost&&it.lvl<10;button(x+6,220,74,18,can);icon('ore',x+10,223,0);text(x+47,225,'Upgrade '+cost,'xs',can?C.goldL:C.muted,'center');hit(x+6,220,74,18,()=>upgradeItem(it,h));
      hit(x+29,158,28,28,()=>{unequip(h,slot);});}
    else{text(x+43,192,'Empty','s',C.dimt,'center');text(x+43,204,slot==='weapon'?WEAPON_NOUN[CLASSES[h.cls].weapon]+' only':'','xs',C.dimt,'center');}});
  frame(4,248,262,186);text(10,254,'Pack','sb',C.goldL);button(96,254,50,14,G.mult!==1);text(121,256,'Buy '+multLabel(),'xs',G.mult!==1?C.goldL:C.cream,'center');hit(96,254,50,14,cycleMult);if(!G.salvage)text(10,264,G.pack.length+' / 15','xs',C.muted);
  if(G.salvage){button(150,254,54,14,false);text(177,256,'Cancel','xs',C.cream,'center');hit(150,254,54,14,()=>{G.salvage=false;G.sel=[];});}else{button(150,254,54,14,true);text(177,256,'Equip best','xs',C.goldL,'center');hit(150,254,54,14,()=>equipBest(h));}
  G.sel=(G.sel||[]).filter(it=>G.pack.includes(it));const sel=G.sel;const ore=sel.reduce((a,it)=>a+(it.rank+1)*4+it.lvl*2,0);
  if(G.salvage){button(208,254,52,14,sel.length>0,!sel.length);text(234,256,sel.length?'Salvage '+sel.length:'Select…','xs',sel.length?C.goldL:C.dimt,'center');
    if(sel.length)hit(208,254,52,14,()=>{for(const it of sel)G.pack=G.pack.filter(i=>i!==it);G.ore+=ore;toast('Salvaged '+sel.length+' for '+ore+' ore');G.sel=[];G.salvage=false;});
    text(10,264,sel.length?sel.length+' selected · +'+ore+' ore':'Tap items to salvage','xs',C.goldL);}
  else{button(208,254,52,14,false,!G.pack.length);text(234,256,'Salvage','xs',G.pack.length?C.cream:C.dimt,'center');if(G.pack.length)hit(208,254,52,14,()=>{G.salvage=true;G.sel=[];});}
  for(let k=0;k<15;k++){const cx=k%5,cy=Math.floor(k/5),x=12+cx*50,y=274+cy*50,it=G.pack[k];
    if(!it){px(x,y,44,44,'#0e1020');px(x+1,y+1,42,42,C.navy);continue;}
    const col=RANKHEX[it.rank];const on=G.salvage?sel.includes(it):G.selItem===it,usable=it.slot!=='weapon'||it.kind===CLASSES[h.cls].weapon;px(x,y,44,44,C.out);px(x+1,y+1,42,42,on?C.goldL:col);px(x+2,y+2,40,40,C.out);px(x+3,y+3,38,38,on?'#3a3420':'#1e223a');ctx.globalAlpha=usable?1:0.35;icon(itemIcon(it),x+10,y+8,it.rank,2);ctx.globalAlpha=1;if(!usable)text(x+22,y+31,wielders(it),'xs',C.dimt,'center');
    if(G.salvage&&on)icon('check',x+30,y+2,4);else if(it.isNew)px(x+35,y+4,5,5,'#ff5050');if(it.lvl)text(x+40,y+34,'+'+it.lvl,'xs',C.goldL,'right');
    hit(x,y,44,44,()=>{it.isNew=false;if(G.salvage){if(on)G.sel=G.sel.filter(i=>i!==it);else G.sel.push(it);return;}
      if(!usable){toast(itemName(it)+' · only '+wielders(it)+' can wield it');return;}if(G.selItem===it){equipItem(h,it);G.selItem=null;}else{G.selItem=it;toast(itemName(it)+' · '+itemStatLabel(it)+' · tap again to equip');}});}}
function drawHeroes(){drawPanelScreen();text(8,26,'Heroes','title',C.goldL);text(262,30,G.roster.length+' recruited','xs',C.muted,'right');
  let y=46;for(const h of G.roster){frame(4,y,262,50);drawSprite(h,26,y+38,0,'idle',false);const st=heroStatus(h);
    text(46,y+6,h.name,'sb',C.cream);text(46,y+16,CLASSES[h.cls].name+' · Lv '+h.lvl+' · '+(st==='quest'?'on a quest':st),'xs',C.muted);
    const ab=CLASSES[h.cls].ab;icon(ab.icon,46,y+27,2);text(62,y+28,ab.name+'  rank '+h.abLvl,'xs',C.goldL);text(62,y+37,abilityDesc(h),'xs',C.muted);
    const cost=R(60*Math.pow(1.7,h.abLvl-1)),can=G.gold>=cost;button(196,y+6,64,20,can);icon('coin',200,y+10,4);text(234,y+12,'Rank up '+cost,'xs',can?C.goldL:C.muted,'center');hit(196,y+6,64,20,()=>{if(!can){toast('Need '+cost+' gold');return;}G.gold-=cost;h.abLvl++;toast(ab.name+' rank '+h.abLvl);});
    y+=54;}
  if(G.roster.length<HEROES.length)text(W/2,y+6,'More will join along the road','xs',C.dimt,'center');}
function drawMap(){drawPanelScreen();text(8,26,'The Crystal Road','title',C.goldL);
  ZONES.forEach((z,i)=>{const y=48+i*72,ok=zoneUnlocked(i),cur=i===G.zone;frame(4,y,262,66,C.navy,cur?C.goldL:(ok?C.gold:C.goldD));
    ctx.save();ctx.beginPath();ctx.rect(10,y+6,90,54);ctx.clip();const L=SCENES[z.scene][0];ctx.globalAlpha=ok?1:0.35;ctx.drawImage(L.img,-80,y-40);for(const l of SCENES[z.scene].slice(1))ctx.drawImage(l.img,-80,y-40);ctx.globalAlpha=1;ctx.restore();
    text(108,y+8,z.name,'sb',ok?C.cream:C.dimt);text(108,y+19,'Danger Lv '+z.lv,'xs',C.muted);
    text(108,y+30,ok?(G.cleared[i]?'Shard recovered':'Shard '+G.prog[i]+'/'+z.fights+' · boss: '+ENEMIES[z.boss].name):'Defeat the previous boss','xs',ok?C.goldL:C.dimt);
    if(ok&&!cur){button(180,y+42,76,16,true);text(218,y+45,'Travel','sb',C.goldL,'center');hit(180,y+42,76,16,()=>{G.zone=i;G.enemies=[];G.projs=[];G.action=null;G.bossFight=false;for(const h of G.active){h.dx=0;h.status={};if(h.dead){h.dead=false;h.hp=R(h.maxhp*0.3);}setAnim(h,'walk');}G.mode='walk';G.enc=3;G.screen='road';banner(z.name,'Danger Lv '+z.lv);});}
    else if(cur)text(218,y+46,'You are here','xs',C.goldL,'center');});
  text(W/2,344,'Beyond the Keep the road continues — endless, and harder.','xs',C.dimt,'center');text(W/2,356,'(Reforge the Crystal arrives with the phone build)','xs',C.dimt,'center');}
function drawTree(){drawPanelScreen();text(8,26,'Upgrade Tree','title',C.goldL);button(206,22,54,16,G.mult!==1);text(233,25,'Buy '+multLabel(),'xs',G.mult!==1?C.goldL:C.cream,'center');hit(206,22,54,16,cycleMult);
  let y=44,lastBranch='';for(const n of TREE){if(n.branch!==lastBranch){lastBranch=n.branch;text(8,y,n.branch,'sb',C.muted);y+=12;}
    const lv=treeLv(n.id),cost=R(n.base*Math.pow(1.6,lv)),max=false,can=G.gold>=cost;px(6,y,258,32,C.band);
    icon('nodes',10,y+10,lv?4:0);text(28,y+4,n.name+(lv?'  rank '+lv:''),'sb',C.cream);text(28,y+15,n.desc,'xs',C.muted);
    button(192,y+6,66,20,can,max);if(!max)icon('coin',197,y+10,4);text(max?225:231,y+12,max?'Maxed':cost.toLocaleString(),'xsb',max?C.dimt:(can?C.goldL:C.muted),'center');
    if(!max)hit(192,y+6,66,20,()=>{let k=0,want=G.mult==='max'?1e9:G.mult;while(k<want){const c=R(n.base*Math.pow(1.6,treeLv(n.id)));if(G.gold<c)break;G.gold-=c;G.tree[n.id]=treeLv(n.id)+1;k++;}if(!k){toast('Need '+cost+' gold');return;}for(const h of G.roster)refreshStats(h);toast(n.name+' rank '+treeLv(n.id));});y+=36;}}

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
const BUILD={mine:{name:'Iron Mine',cost:150,grow:1.7,desc:l=>l?'':'Villagers dig ore over time'},market:{name:'Market',cost:120,grow:1.7,desc:l=>l?'':'Villagers trade for gold'},walls:{name:'Walls',cost:200,grow:1.8,desc:l=>l?'':'Defense, and posts for heroes'}};
const HOUR=3600*1000;
G.castle={b:{mine:0,market:0,walls:0},vil:{total:0,mine:0,market:0},hired:0,garrison:[],stored:{gold:0,ore:0},last:now(),hordeAt:now()+8*HOUR,repelled:0,lost:0,walk:[]};
function tscale(){return G.fast?120:1;}
function castleLv(){const C2=G.castle;return 1+Math.floor((C2.b.mine+C2.b.market+C2.b.walls)/3);}
function idleVil(){const v=G.castle.vil;return v.total-v.mine-v.market;}
function buildCost(k){const l=G.castle.b[k];return R(BUILD[k].cost*Math.pow(BUILD[k].grow,l));}
function hireCost(){return R(100*Math.pow(1.5,G.castle.hired));}
function vilCap(){return 4+2*castleLv();}
function garrisonSlots(){return Math.min(4,1+G.castle.b.walls);}
function orePerHour(){return G.castle.b.mine*G.castle.vil.mine*2;}
function goldPerHour(){return G.castle.b.market*G.castle.vil.market*8;}
function garrisonHeroes(){return G.castle.garrison.map(id=>G.roster.find(h=>h.id===id)).filter(Boolean);}
function defense(){const w=G.castle.b.walls*5;const g=garrisonHeroes().reduce((s,h)=>s+3+h.lvl*0.5,0);return{walls:w,garrison:R(g),total:R(w+g)};}
function hordeStrength(){return 6+castleLv()*4+G.zone*3+G.castle.repelled*2;}
function castleTick(){const C2=G.castle,t=now();let dt=(t-C2.last)/HOUR*tscale();C2.last=t;if(dt<=0)return;dt=Math.min(dt,8);
  C2.stored.ore=Math.min(C2.stored.ore+orePerHour()*dt,orePerHour()*8);C2.stored.gold=Math.min(C2.stored.gold+goldPerHour()*dt,goldPerHour()*8);
  for(const h of garrisonHeroes()){h.xp+=(20+h.lvl*4)*dt;while(h.xp>=xpNeed(h.lvl)){h.xp-=xpNeed(h.lvl);h.lvl++;refreshStats(h);h.hp=h.maxhp;}}
  if(t>=C2.hordeAt)resolveHorde();}
function hordeLeft(){return Math.max(0,(G.castle.hordeAt-now())/1000/tscale());}
function resolveHorde(){const C2=G.castle,d=defense().total,s=hordeStrength();
  if(d>=s){C2.repelled++;const g=s*15,v=1+Math.floor(rand()*2);G.gold+=g;G.dust+=1;C2.vil.total+=v;banner('The horde breaks on the walls','+'+g+' gold, +1 dust, '+v+' villagers rally',3.5);}
  else{C2.lost++;const built=Object.keys(C2.b).filter(k=>C2.b[k]>0);let msg='';if(built.length){const k=built[Math.floor(rand()*built.length)];C2.b[k]--;msg=BUILD[k].name+' damaged';if(k!=='walls'&&C2.vil[k]>C2.b[k]*3)C2.vil[k]=Math.min(C2.vil[k],C2.b[k]*3);}
    const lost=Math.min(2,C2.vil.total);C2.vil.total-=lost;C2.vil.mine=Math.min(C2.vil.mine,C2.vil.total);C2.vil.market=Math.min(C2.vil.market,Math.max(0,C2.vil.total-C2.vil.mine));banner('The horde overruns Vael',(msg?msg+' · ':'')+lost+' villagers lost',3.5);}
  C2.hordeAt=now()+8*HOUR/tscale();}
function collectCastle(){const C2=G.castle,g=Math.floor(C2.stored.gold),o=Math.floor(C2.stored.ore);if(!g&&!o){toast('Nothing to collect yet');return;}G.gold+=g;G.ore+=o;C2.stored.gold-=g;C2.stored.ore-=o;toast('Collected '+g+' gold and '+o+' ore from Vael');}
function grantShardVillagers(){G.castle.vil.total+=3;toast('3 villagers reach Vael');}
function postHero(h){const C2=G.castle;if(C2.garrison.length>=garrisonSlots()){toast('No free posts — raise the walls');return;}C2.garrison.push(h.id);toast(h.name+' takes a post on the walls');}
function recallHero(h){G.castle.garrison=G.castle.garrison.filter(id=>id!==h.id);toast(h.name+' stands down');}
const LANTERN=["..o..",".oho.","ohaho",".oao.","..o.."],CRATE=["oooooo","oWwWwo","owWwWo","oWwWwo","oooooo"],FLAG=["o....","oRR..","oRRR.","oRR..","o....","o...."],TOWER=["oo..oo","oSSSSo","oSsSSo","oSSSSo","oSsSSo","oSSSSo","oSSSSo","oooooo"];
const LP=Object.assign({},CPAL,{h:'#fff2a0',a:'#f0b030'});
function drawMineVisual(l){if(!l)return;pixGrid(CASTLE_PIX.mine,4,84,2);if(l>=2){pixGrid(LANTERN,14,90,2,LP);pixGrid(LANTERN,36,90,2,LP);}if(l>=3)pixGrid(CASTLE_PIX.cart,50,112,2);if(l>=4){px(4,108,60,1,'#3c2c28');px(4,110,60,1,'#3c2c28');for(let k=6;k<62;k+=6)px(k,107,2,5,'#6e4824');}if(l>=5)pixGrid(CASTLE_PIX.mine,64,84,1);}
function drawMarketVisual(l){if(!l)return;pixGrid(CASTLE_PIX.stall,12,126,2);if(l>=2){pixGrid(CRATE,54,144,2);pixGrid(CRATE,54,134,2);}if(l>=3)pixGrid(CASTLE_PIX.stall,70,134,1);if(l>=4){pixGrid(FLAG,10,116,2);pixGrid(FLAG,50,116,2);}if(l>=5){px(12,126,40,6,'#c9a227');px(12,126,40,1,'#1a1420');}}
function drawWallsVisual(l){if(!l)return;if(l===1){for(let x=0;x<W;x+=6){if(x>40&&x<230)continue;px(x,60,3,10,'#6e4824');px(x,58,3,2,'#503218');}return;}
  pixGrid(CASTLE_PIX.wall,0,58);pixGrid(CASTLE_PIX.wall,238,58);if(l>=3){px(14,50,1,14,'#1a1420');px(15,50,6,8,l>=5?'#c9a227':'#be3c3c');px(250,50,1,14,'#1a1420');px(251,50,6,8,l>=5?'#c9a227':'#be3c3c');}
  if(l>=4){pixGrid(TOWER,28,48,2);pixGrid(TOWER,230,48,2);}}
function drawVael(){drawPanelScreen();castleTick();const C2=G.castle,D=defense(),S=hordeStrength();
  text(8,17,'Vael','title',C.goldL);text(44,22,'Castle Lv '+castleLv(),'xs',C.muted);text(8,31,C2.vil.total+' villagers · '+idleVil()+' idle','xs',C.muted);
  const safe=D.total>=S;button(96,19,80,18,false);px(97,20,78,16,safe?'#14321e':'#3c1e1e');px(96,19,80,1,safe?'#5ab46e':'#c85050');px(96,36,80,1,safe?'#5ab46e':'#c85050');px(96,19,1,18,safe?'#5ab46e':'#c85050');px(175,19,1,18,safe?'#5ab46e':'#c85050');
  text(136,21,'Defense '+D.total,'sb',safe?'#96e6aa':'#ff9696','center');text(136,29,'walls '+D.walls+' · garrison '+D.garrison,'xs',safe?'#78aa82':'#c88080','center');
  button(182,19,82,18,false);px(183,20,80,16,'#3c1e1e');px(182,19,82,1,'#c85050');px(182,36,82,1,'#c85050');px(182,19,1,18,'#c85050');px(263,19,1,18,'#c85050');
  text(223,21,'Horde','sb','#ff9696','center');text(223,29,fmtT(hordeLeft()),'xs','#c88080','center');
  // scene
  const sc=SCENES.door[0].img;ctx.save();ctx.beginPath();ctx.rect(0,44,W,130);ctx.clip();ctx.drawImage(sc,-49,44-60);
  drawWallsVisual(C2.b.walls);
  drawMineVisual(C2.b.mine);drawMarketVisual(C2.b.market);
  // villagers wander
  const n=Math.min(6,C2.vil.mine+C2.vil.market);for(let i=0;i<n;i++){const x=70+((i*47)%150)+Math.sin(G.t*0.4+i)*14,y=118+((i*23)%40);const pal=Object.assign({},CPAL,{T:['#5a78b4','#96603c','#508a5a','#a0783c','#7a5aa0','#b45a5a'][i%6]});pixGrid(CASTLE_PIX.vil,R(x),R(y),2,pal);}
  // garrison at the gate
  garrisonHeroes().forEach((h,i)=>{stepAnim(h,0);const A=ATLAS[h.uid];drawSprite(h,150-i*26,152,Math.floor(G.t*6)%A.anims.idle.n,'idle',false);});
  ctx.restore();px(0,42,W,2,C.goldD);px(0,174,W,2,C.goldD);
  if(garrisonHeroes().length)text(136,164,'Garrison: '+garrisonHeroes().map(h=>h.name).join(', '),'xs','#e6dcc8','center');else text(136,164,'No one guards the gate','xs','#c8bea0','center');
  // cards
  const cards=[
    {k:'mine',ic:()=>pixGrid(CASTLE_PIX.mine.slice(2).map(r=>r.slice(4,18)),14,y0+12),sub:C2.b.mine?C2.vil.mine+' villagers · +'+orePerHour()+' ore/h · '+Math.floor(C2.stored.ore)+' stored':'Not built · '+BUILD.mine.desc(0),vil:true},
    {k:'market',ic:()=>icon('coin',20,y0+17,4),sub:C2.b.market?C2.vil.market+' villagers · +'+goldPerHour()+' gold/h · '+Math.floor(C2.stored.gold)+' stored':'Not built · '+BUILD.market.desc(0),vil:true,hire:true},
    {k:'walls',ic:()=>pixGrid(CASTLE_PIX.wall.map(r=>r.slice(0,28)),12,y0+18),sub:C2.b.walls?'Defense +'+D.walls+' · '+garrisonSlots()+' garrison posts':'Not built · '+BUILD.walls.desc(0)},
    {k:'garrison',ic:()=>icon('shield',20,y0+17,0),sub:garrisonHeroes().length?garrisonHeroes().map(h=>h.name).join(', ')+' · Defense +'+D.garrison+' · training':'No heroes posted · posted heroes defend and train'},
  ];let y0=180;
  for(const cd of cards){frame(4,y0,262,46);px(10,y0+7,32,32,C.out);px(11,y0+8,30,30,'#222844');cd.ic();
    const lv=cd.k==='garrison'?null:C2.b[cd.k];text(48,y0+8,cd.k==='garrison'?'Garrison':BUILD[cd.k].name,'sb',C.cream);if(lv!=null)text(48+textW(cd.k==='garrison'?'Garrison':BUILD[cd.k].name,'sb')+6,y0+9,lv?'Lv '+lv:'',"xs",C.goldL);if(cd.k==='garrison')text(100,y0+9,garrisonHeroes().length+' / '+garrisonSlots(),'xs',C.goldL);
    text(48,y0+19,cd.sub,'xs',C.muted);
    if(cd.k==='garrison'){button(204,y0+15,54,16,true);text(231,y0+18,'Assign','xs',C.goldL,'center');hit(204,y0+15,54,16,()=>openSheet('garrison'));text(48,y0+29,'post heroes from camp · they train while posted','xs',C.dimt);}
    else{const cost=buildCost(cd.k),can=G.gold>=cost;button(194,y0+15,66,16,can);icon('coin',197,y0+17,4);text(235,y0+18,(lv?'Upgrade ':'Build ')+cost,'xs',can?C.goldL:C.muted,'center');
      hit(194,y0+15,66,16,()=>{if(G.gold<cost){toast('Need '+cost+' gold');return;}G.gold-=cost;C2.b[cd.k]++;toast(BUILD[cd.k].name+(C2.b[cd.k]===1?' built':' raised to Lv '+C2.b[cd.k]));});
      if(cd.vil&&lv){text(48,y0+29,'villagers','xs','#7890c8');button(96,y0+27,14,11,false);text(103,y0+28.5,'−','xs',C.cream,'center');text(118,y0+29,String(C2.vil[cd.k]),'xsb',C.cream,'center');button(126,y0+27,14,11,true);text(133,y0+28.5,'+','xs',C.goldL,'center');
        hit(96,y0+27,14,11,()=>{if(C2.vil[cd.k]>0)C2.vil[cd.k]--;});hit(126,y0+27,14,11,()=>{if(idleVil()<=0){toast('No idle villagers — hire at the Market');return;}if(C2.vil[cd.k]>=lv*3){toast('Max '+(lv*3)+' at this level');return;}C2.vil[cd.k]++;});
        if(cd.hire){const hc=hireCost(),hcan=G.gold>=hc&&C2.vil.total<vilCap();button(146,y0+27,44,11,hcan);text(168,y0+28.5,'Hire '+hc,'xs',hcan?C.goldL:C.muted,'center');hit(146,y0+27,44,11,()=>{if(C2.vil.total>=vilCap()){toast('No room — raise the castle level');return;}if(G.gold<hc){toast('Need '+hc+' gold');return;}G.gold-=hc;C2.hired++;C2.vil.total++;toast('A villager joins Vael');});}}
      else if(cd.k==='walls'&&lv)text(48,y0+29,'next: Defense +'+(5*(lv+1))+' · '+Math.min(4,2+lv)+' posts','xs',C.dimt);
      else if(!lv)text(48,y0+29,'appears in the courtyard once built','xs',C.dimt);
      else if(cd.k!=='walls')text(48+100,y0+29,'','xs',C.dimt);}
    y0+=50;}
  const g=Math.floor(C2.stored.gold),o=Math.floor(C2.stored.ore);button(4,382,262,16,g+o>0);text(W/2,385,g+o>0?'Collect '+g+' gold and '+o+' ore':'Production stores up to 8 hours','xs',g+o>0?C.goldL:C.dimt,'center');if(g+o>0)hit(4,382,262,16,collectCastle);
  text(W/2,404,'Villagers arrive with every shard and every repelled horde.','xs',C.dimt,'center');text(W/2,414,'If the horde outmatches your defense, Vael takes damage.','xs',C.dimt,'center');}

// ============================================================ saving & offline progress
const SAVE_KEY='crystal_road_save_v1';
function storeGet(){try{return localStorage.getItem(SAVE_KEY);}catch(e){return null;}}
function storeSet(v){try{localStorage.setItem(SAVE_KEY,v);return true;}catch(e){return false;}}
function storeClear(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}
function serialize(){return JSON.stringify({v:1,t:now(),zone:G.zone,prog:G.prog,cleared:G.cleared,gold:G.gold,ore:G.ore,dust:G.dust,wins:G.wins,campfireDone:G.campfireDone,tree:G.tree,autoCast:G.autoCast,music:G.music,autoUntil:G.autoUntil,itemSeq,
  roster:G.roster.map(h=>({id:h.id,lvl:h.lvl,xp:h.xp,hp:h.hp,abLvl:h.abLvl,eq:h.eq})),active:G.active.map(h=>h.id),pack:G.pack,
  quests:G.quests.map(q=>({hero:q.hero.id,q:q.q.id,end:q.end})),castle:G.castle,fast:G.fast});}
function saveGame(){if(G.title||G.noSave)return;storeSet(serialize());}
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

// ============================================================ sheets (overlays)
function openSheet(kind,data={}){G.sheet={kind,...data};}
function closeSheet(){G.sheet=null;}
function drawSheet(){const s=G.sheet;if(!s)return;tx.clearRect(0,0,tc.width,tc.height);dimRect(0,0,W,H,0.75);hit(0,0,W,H,()=>{if(s.kind!=='welcome')closeSheet();});
  const camp=G.roster.filter(h=>!G.active.includes(h)),free=G.roster.filter(h=>heroStatus(h)==='camp');
  const hh=s.kind==='speedad'?92:s.kind==='welcome'?122:s.kind==='garrison'?46+30*Math.max(1,G.roster.filter(h=>['camp','garrison'].includes(heroStatus(h))).length):s.kind==='swap'?118+30*Math.max(1,camp.length):s.kind==='send'?(s.hero?40+38*QUESTS.length:40+30*Math.max(1,free.length)):s.kind==='settings'?254:96;
  const y0=Math.max(40,R((H-48-hh)/2));frame(8,y0,254,hh,C.navy,C.goldL);hit(8,y0,254,hh,()=>{});
  if(s.kind!=='welcome'){icon('x',242,y0+8,0);hit(232,y0,30,28,closeSheet);}
  if(s.kind==='swap'){text(16,y0+8,'Party',"h",C.goldL);text(16,y0+20,'Tap a marcher, then a hero at camp to trade places.','xs',C.muted);text(16,y0+29,'Two marchers to reorder. Left slot is the front.','xs',C.muted);
    for(let i=0;i<4;i++){const x=16+i*60,h=G.active[i],sel=s.pick===i;button(x,y0+44,54,44,sel);if(h){drawSprite(h,x+27,y0+78,0,'idle',false);text(x+27,y0+46,h.name,'xs',sel?C.goldL:C.cream,'center');}else text(x+27,y0+62,'empty','xs',C.dimt,'center');
      hit(x,y0+44,54,44,()=>{if(s.pick==null){if(h)s.pick=i;}else if(s.pick===i)s.pick=null;else{if(h){[G.active[s.pick],G.active[i]]=[G.active[i],G.active[s.pick]];layout();}s.pick=null;}});}
    if(s.pick==null&&s.slot!=null&&G.active[s.slot])s.pick=s.slot,s.slot=null;
    if(s.pick!=null&&G.active.length>1){button(180,y0+92,74,14,true);text(217,y0+94.5,'Send to camp','xs',C.goldL,'center');hit(180,y0+92,74,14,()=>{const h=G.active[s.pick];if(!h)return;if(G.action&&G.action.u===h){G.action=null;h.dx=0;}G.active.splice(s.pick,1);h.status={};layout();s.pick=null;toast(h.name+' heads to camp');});}
    text(16,y0+96,'At camp','sb',C.muted);let y=y0+108;
    if(!camp.length)text(16,y+4,'No one at camp yet — recruits join as you recover shards.','xs',C.dimt);
    for(const h of camp){if(y>H-80)break;const st=heroStatus(h),busy=st==='quest';if(st==='garrison')text(46,y+14,'On the walls — tap to recall and bring in','xs',C.goldL);px(14,y,242,26,C.band);ctx.globalAlpha=busy?0.45:1;drawSprite(h,28,y+22,0,'idle',false);ctx.globalAlpha=1;
      text(46,y+4,h.name+' · '+CLASSES[h.cls].name+' Lv '+h.lvl,'s',busy?C.dimt:C.cream);if(st!=='garrison')text(46,y+14,busy?'On a quest':(s.pick!=null?'Tap to bring in':'Resting'),'xs',busy?C.dimt:(s.pick!=null?C.goldL:C.muted));
      if(!busy){button(196,y+5,54,16,s.pick!=null);text(223,y+8,s.pick!=null?'Swap in':'Add','xs',C.cream,'center');
        hit(14,y,242,26,()=>{const inBattle=G.mode==='battle'||G.mode==='enter';if(heroStatus(h)==='garrison')recallHero(h);
          if(s.pick!=null){const ia=s.pick;const out=G.active[ia];if(G.action&&G.action.u===out){G.action=null;out.dx=0;}G.active[ia]=h;h.dead=false;h.status={};if(h.hp<=0)h.hp=R(h.maxhp*0.5);h.x=-30;setAnim(h,inBattle?'idle':'walk');s.pick=null;toast(h.name+' takes '+out.name+"'s place");}
          else if(G.active.length<4){G.active.push(h);h.dead=false;h.status={};h.x=-30;setAnim(h,inBattle?'idle':'walk');toast(h.name+(inBattle?' runs in to join the fight':' joins the march'));}else toast('Pick a marcher to replace first');layout();});}
      y+=30;}}
  else if(s.kind==='send'){text(16,y0+8,'Send a hero','h',C.goldL);
    if(!s.hero){text(16,y0+20,'Who goes?','xs',C.muted);let y=y0+34;for(const h of free){px(14,y,242,26,C.band);drawSprite(h,28,y+22,0,'idle',false);text(46,y+4,h.name+' · '+CLASSES[h.cls].name+' Lv '+h.lvl,'s',C.cream);button(196,y+5,54,16,true);text(223,y+8,'Choose','xs',C.goldL,'center');hit(14,y,242,26,()=>{s.hero=h;});y+=30;}}
    else{text(16,y0+20,s.hero.name+' will go on a…','xs',C.muted);let y=y0+34;for(const q of QUESTS){px(14,y,242,34,C.band);icon('hourglass',20,y+10,0);text(38,y+4,q.name+' · '+fmtT(questDur(q)),'sb',C.cream);text(38,y+16,q.desc+(CLASSES[s.hero.cls].weapon===({forage:'staff',hunt:'axe',scout:'bow',pilgrim:'sword'})[q.id]?'  ·  class bonus':''),'xs',C.muted);
      button(196,y+9,54,16,true);text(223,y+12,'Send','xs',C.goldL,'center');hit(14,y,242,34,()=>{if(G.quests.length>=questSlots()){toast('No free quest slots');return;}startQuest(s.hero,q);closeSheet();});y+=38;}}}
  else if(s.kind==='garrison'){text(16,y0+8,'Garrison','h',C.goldL);text(16,y0+20,garrisonHeroes().length+' of '+garrisonSlots()+' posts · raise the walls for more','xs',C.muted);let y=y0+34;
    for(const h of G.roster){if(y>H-90)break;const st=heroStatus(h);if(st==='marching'||st==='quest')continue;const posted=st==='garrison';px(14,y,242,26,C.band);drawSprite(h,28,y+22,0,'idle',false);text(46,y+4,h.name+' · '+CLASSES[h.cls].name+' Lv '+h.lvl,'s',C.cream);text(46,y+14,posted?'On the walls':'At camp','xs',posted?C.goldL:C.muted);
      button(196,y+5,54,16,!posted);text(223,y+8,posted?'Recall':'Post','xs',posted?C.cream:C.goldL,'center');hit(14,y,242,26,()=>{if(posted)recallHero(h);else postHero(h);});y+=30;}
    if(y===y0+34)text(16,y+4,'No one at camp — send someone back from the road first.','xs',C.dimt);}
  else if(s.kind==='speedad'){text(16,y0+8,'4× speed','h',C.goldL);text(16,y0+22,'Watch a short ad and the road runs at four times','xs',C.muted);text(16,y0+31,'speed for the next hour. Otherwise, back to 1×.','xs',C.muted);
    button(16,y0+56,110,20,true);icon('play',22,y0+60,4);text(71,y0+61,'Watch ad (placeholder)','xs',C.goldL,'center');hit(16,y0+56,110,20,()=>{G.speed=4;G.speedUntil=now()+3600*1000;toast('4× speed for an hour');closeSheet();});
    button(140,y0+56,110,20,false);text(195,y0+61,'Back to 1×','xs',C.cream,'center');hit(140,y0+56,110,20,()=>{G.speed=1;closeSheet();});}
  else if(s.kind==='welcome'){drawWelcome(s,y0);}
  else if(s.kind==='settings'){text(16,y0+8,'Settings','h',C.goldL);
    const rows=[['Music',G.music,()=>{setMusic(!G.music);}],['Dev: +1000 gold, +100 ore, +10 dust',false,()=>{G.gold+=1000;G.ore+=100;G.dust+=10;toast('Treasury topped up');}],['Dev: horde arrives now',false,()=>{G.castle.hordeAt=now();castleTick();}],['Auto-cast abilities (tapping still hits 30% harder)',G.autoCast,()=>{G.autoCast=!G.autoCast;toast(G.autoCast?'Abilities cast on their own':'Tap to cast');}],['Fast road (testing: 4× speed)',!!G.fastRoad,()=>{G.fastRoad=!G.fastRoad;toast(G.fastRoad?'Road runs at 4× speed':'Road back to normal speed');}],['Fast quests & castle (testing: 120× speed)',G.fast,()=>{const t=now();for(const q of G.quests){const left=Math.max(0,q.end-t);q.end=t+(G.fast?left*120:left/120);}{const left=Math.max(0,G.castle.hordeAt-t);G.castle.hordeAt=t+(G.fast?left*120:left/120);}G.castle.last=t;G.fast=!G.fast;toast(G.fast?'Quests now run 120× faster':'Quests back to real time');}],['Reset the road (wipes the save)',false,()=>{storeClear();G.noSave=true;location.reload();}]];
    rows.forEach(([label,on,fn],i)=>{const y=y0+30+i*26;px(14,y,242,22,C.band);text(20,y+6,label,'xs',C.cream);button(210,y+3,40,16,on);text(230,y+6,on?'On':'—','xs',on?C.goldL:C.muted,'center');hit(14,y,242,22,fn);});
    text(16,y0+214,storeSet('__probe')?'Progress saves automatically on this device.':'This preview cannot save — download the file to keep progress.','xs',C.dimt);}
  else if(s.kind==='ad'){text(16,y0+8,'Offline auto-cast','h',C.goldL);text(16,y0+22,'Watch a short ad and the party casts abilities','xs',C.muted);text(16,y0+31,'on its own while you are away, for 4 hours.','xs',C.muted);
    button(60,y0+56,150,20,true);icon('play',66,y0+60,4);text(135,y0+61,'Watch ad (placeholder)','sb',C.goldL,'center');hit(60,y0+56,150,20,()=>{G.autoUntil=now()+4*3600*1000;toast('Auto-cast active for 4 hours');closeSheet();});}}

// ============================================================ music
const music={cur:null,el:null};
function playMusic(key){if(!ASSETS.music||!ASSETS.music[key])return;if(music.cur===key&&music.el)return;if(music.el){music.el.pause();}const el=new Audio();el.src=ASSETS.music[key];el.loop=true;el.volume=0.55;el.preload='auto';music.el=el;music.cur=key;if(G.music&&music.started)tryPlay();}
function tryPlay(){if(!music.el)return;const el=music.el;const p=el.play();if(p&&p.then)p.then(()=>{if(!music.ok){music.ok=true;toast('♪ Greenhollow Fields');}}).catch(e=>{if(el.readyState<3){el.addEventListener('canplaythrough',()=>{if(G.music&&music.started)tryPlay();},{once:true});}else toast('Audio blocked here ('+e.name+') — try the downloaded file');});}
function startMusic(){if(music.started)return;music.started=true;playMusic('greenhollow');tryPlay();}
function setMusic(on){G.music=on;if(!music.el)return;if(on)tryPlay();else music.el.pause();}
// ============================================================ draw + input
function draw(){hits.length=0;tx.clearRect(0,0,tc.width,tc.height);px(0,0,W,H,'#0b0d16');
  ({road:drawRoad,gear:drawGear,heroes:drawHeroes,vael:drawVael,map:drawMap,tree:drawTree})[G.screen]();
  drawBanner();drawTabs();drawTop();drawSheet();
  if(G.title){hits.length=0;tx.clearRect(0,0,tc.width,tc.height);px(0,0,W,H,'#0b0d16');const L=SCENES.hills;ctx.save();ctx.beginPath();ctx.rect(0,140,W,208);ctx.clip();for(const l of L){const w=l.img.width||368;let off=-(Math.floor(G.t*10*l.p)%w);for(let x=off;x<W+w;x+=w)ctx.drawImage(l.img,x,140);}ctx.restore();
    px(0,136,W,4,C.goldD);px(0,348,W,4,C.goldD);drawSprite(G.active[0],150,322,Math.floor(G.t*8)%ATLAS[G.active[0].uid].anims.walk.n,'walk',false,2);
    text(W/2,64,'Crystal Road','big',C.goldL,'center');text(W/2,86,G.wins>0?'Welcome back. The road remembers you.':'The shards are scattered. The road is long.','s',C.cream,'center');
    const a=0.55+0.45*Math.sin(G.t*3);text(W/2,388,'Tap to begin','h',C.goldL,'center',a);text(W/2,404,'Music by you · art by Zerie & ansimuz','xs',C.dimt,'center');hit(0,0,W,H,()=>{G.title=false;startMusic();banner(ZONES[G.zone].name,G.wins>0?'Onward':'The first shard lies ahead',3);});}
  if(G.toast){const a=clamp(Math.min(G.toast.t*4,(2.2-G.toast.t)*3),0,1);const w=textW(G.toast.text,'s')+16;ctx.globalAlpha=a*0.85;px(R(W/2-w/2),H-64,R(w),16,'#000');ctx.globalAlpha=1;text(W/2,H-60,G.toast.text,'s',C.cream,'center',a);}}
function speedNow(){if(G.fastRoad)return 4;if(G.speed===4&&G.speedUntil>now())return 4;if(G.speed===4)G.speed=2;return G.speed||1;}
function loop(ts){const dt=Math.min(0.05,(ts-last)/1000||0);last=ts;const n=speedNow();for(let k=0;k<n;k++)update(dt);draw();requestAnimationFrame(loop);}
function evPos(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H];}
cv.addEventListener('pointermove',e=>{if(!G.drag)return;const[x,y]=evPos(e);if(!G.drag.moved&&Math.hypot(x-G.drag.x0,y-G.drag.y0)>5)G.drag.moved=true;G.drag.x=x;G.drag.y=y;});
function endDrag(e){const d=G.drag;if(!d)return;G.drag=null;const[x,y]=evPos(e);
  if(!d.moved){openSheet('swap',{slot:d.i});return;}
  if(y<16||y>96)return;const j=Math.floor((x-4)/66);if(j<0||j>3||j===d.i)return;
  if(G.active[j]){[G.active[d.i],G.active[j]]=[G.active[j],G.active[d.i]];}else{G.active.splice(j>G.active.length?G.active.length:j,0,G.active.splice(d.i,1)[0]);}layout();toast(G.active[0].name+' takes the front');}
cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',()=>{G.drag=null;});
cv.addEventListener('pointerdown',e=>{if(!G.title)startMusic();if(!G.title&&G.music&&music.el&&music.el.paused&&!music.ok)tryPlay();const[x,y]=evPos(e);
  for(let i=hits.length-1;i>=0;i--){const h=hits[i];if(x>=h.x&&x<h.x+h.w&&y>=h.y&&y<h.y+h.h){h.fn();if(G.drag&&!G.drag.x0){G.drag.x0=x;G.drag.y0=y;G.drag.x=x;G.drag.y=y;}return;}}
  if(G.screen==='road'&&!G.sheet&&y>SCENE_Y&&y<SCENE_Y+208){for(const h of G.active){if(Math.abs(x-h.x)<16&&y>GROUND-32&&y<GROUND+6){h.hop=1;toast(h.name+' the '+CLASSES[h.cls].name+', Lv '+h.lvl);return;}}}});
loadAll().then(()=>{document.getElementById('loading').remove();const resumed=loadGame();if(resumed)G.title=true;playMusic('greenhollow');if(music.el)music.el.load();requestAnimationFrame(loop);});
