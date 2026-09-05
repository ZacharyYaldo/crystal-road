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
const BUILD={mine:{name:'Iron Mine',cost:150,grow:1.7,desc:l=>l?'':'Villagers dig ore while you march'},market:{name:'Market',cost:120,grow:1.7,desc:l=>l?'':'Villagers trade for gold; hire more here'},walls:{name:'Walls',cost:200,grow:1.8,desc:l=>l?'':'Defense against the horde; opens garrison posts'}};
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
function drawVael(){drawPanelScreen();castleTick();const C2=G.castle,D=defense(),S=hordeStrength();
  text(8,17,'Vael','title',C.goldL);text(44,22,'Castle Lv '+castleLv(),'xs',C.muted);text(8,31,C2.vil.total+' villagers · '+idleVil()+' idle','xs',C.muted);
  const safe=D.total>=S;button(96,19,80,18,false);px(97,20,78,16,safe?'#14321e':'#3c1e1e');px(96,19,80,1,safe?'#5ab46e':'#c85050');px(96,36,80,1,safe?'#5ab46e':'#c85050');px(96,19,1,18,safe?'#5ab46e':'#c85050');px(175,19,1,18,safe?'#5ab46e':'#c85050');
  text(136,21,'Defense '+D.total,'sb',safe?'#96e6aa':'#ff9696','center');text(136,29,'walls '+D.walls+' · garrison '+D.garrison,'xs',safe?'#78aa82':'#c88080','center');
  button(182,19,82,18,false);px(183,20,80,16,'#3c1e1e');px(182,19,82,1,'#c85050');px(182,36,82,1,'#c85050');px(182,19,1,18,'#c85050');px(263,19,1,18,'#c85050');
  text(223,21,'Horde','sb','#ff9696','center');text(223,29,fmtT(hordeLeft()),'xs','#c88080','center');
  // scene
  const sc=SCENES.door[0].img;ctx.save();ctx.beginPath();ctx.rect(0,44,W,130);ctx.clip();ctx.drawImage(sc,-49,44-60);
  if(C2.b.walls>0){pixGrid(CASTLE_PIX.wall,0,58);pixGrid(CASTLE_PIX.wall,238,58);px(14,50,1,14,'#1a1420');px(15,50,6,8,C2.b.walls>=3?'#c9a227':'#be3c3c');}
  const plot=(x,y,w,h,label)=>{for(let k=0;k<w;k+=4){px(x+k,y,2,1,'#c8be a0'.replace(' ',''));px(x+k,y+h,2,1,'#c8bea0');}for(let k=0;k<h;k+=4){px(x,y+k,1,2,'#c8bea0');px(x+w,y+k,1,2,'#c8bea0');}text(x+w/2,y+h+2,label,'xs','#c8bea0','center');};
  if(C2.b.mine>0){pixGrid(CASTLE_PIX.mine,4,84,2);if(C2.b.mine>=3)pixGrid(CASTLE_PIX.cart,50,112,2);}else plot(8,92,40,24,'mine');
  if(C2.b.market>0){pixGrid(CASTLE_PIX.stall,12,126,2);if(C2.b.market>=3)pixGrid(CASTLE_PIX.stall,60,138,1);}else plot(14,132,40,24,'market');
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
    else{const cost=buildCost(cd.k),can=G.gold>=cost;button(204,y0+15,54,16,can);icon('coin',208,y0+17,4);text(236,y0+18,(lv?'Upgrade ':'Build ')+cost,'xs',can?C.goldL:C.muted,'center');
      hit(204,y0+15,54,16,()=>{if(G.gold<cost){toast('Need '+cost+' gold');return;}G.gold-=cost;C2.b[cd.k]++;toast(BUILD[cd.k].name+(C2.b[cd.k]===1?' built':' raised to Lv '+C2.b[cd.k]));});
      if(cd.vil&&lv){text(48,y0+29,'villagers','xs','#7890c8');button(96,y0+27,14,11,false);text(103,y0+28.5,'−','xs',C.cream,'center');text(118,y0+29,String(C2.vil[cd.k]),'xsb',C.cream,'center');button(126,y0+27,14,11,true);text(133,y0+28.5,'+','xs',C.goldL,'center');
        hit(96,y0+27,14,11,()=>{if(C2.vil[cd.k]>0)C2.vil[cd.k]--;});hit(126,y0+27,14,11,()=>{if(idleVil()<=0){toast('No idle villagers — hire at the Market');return;}if(C2.vil[cd.k]>=lv*3){toast('Max '+(lv*3)+' at this level');return;}C2.vil[cd.k]++;});
        if(cd.hire){const hc=hireCost(),hcan=G.gold>=hc&&C2.vil.total<vilCap();button(150,y0+27,50,11,hcan);text(175,y0+28.5,'Hire '+hc,'xs',hcan?C.goldL:C.muted,'center');hit(150,y0+27,50,11,()=>{if(C2.vil.total>=vilCap()){toast('No room — raise the castle level');return;}if(G.gold<hc){toast('Need '+hc+' gold');return;}G.gold-=hc;C2.hired++;C2.vil.total++;toast('A villager joins Vael');});}}
      else if(cd.k==='walls'&&lv)text(48,y0+29,'next: Defense +'+(5*(lv+1))+' · '+Math.min(4,2+lv)+' posts','xs',C.dimt);
      else if(!lv)text(48,y0+29,'appears in the courtyard once built','xs',C.dimt);}
    y0+=50;}
  const g=Math.floor(C2.stored.gold),o=Math.floor(C2.stored.ore);button(4,382,262,16,g+o>0);text(W/2,385,g+o>0?'Collect '+g+' gold and '+o+' ore':'Production stores up to 8 hours','xs',g+o>0?C.goldL:C.dimt,'center');if(g+o>0)hit(4,382,262,16,collectCastle);
  text(W/2,404,'Villagers arrive with every shard and every repelled horde.','xs',C.dimt,'center');text(W/2,414,'If the horde outmatches your defense, Vael takes damage.','xs',C.dimt,'center');}
