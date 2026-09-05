import json, base64, io
from PIL import Image, ImageDraw, ImageFont

S=3  # upscale factor for crisp text
W,H=270,480
BG="/home/claude/bg/Battle Backgrounds Pack Files/Assets"
ATLAS=json.load(open('/home/claude/mod/atlas.json'))
def sprite(uid):
    return Image.open(io.BytesIO(base64.b64decode(ATLAS[uid]['src'].split(',')[1]))).convert('RGBA')
def frame_of(uid,anim,i):
    A=ATLAS[uid];a=A['anims'][anim];im=sprite(uid)
    return im.crop((i*A['cw'],a['row']*A['ch'],(i+1)*A['cw'],(a['row']+1)*A['ch']))
def place(base,uid,anim,i,x,feet_y,flip=False):
    A=ATLAS[uid];f=frame_of(uid,anim,i)
    if flip:f=f.transpose(Image.FLIP_LEFT_RIGHT);ox=A['cw']-A['ox']
    else:ox=A['ox']
    base.alpha_composite(f,(x-ox,feet_y-A['oy']))

# ---------- palette ----------
NAVY=(22,26,44,255);NAVY2=(30,36,60,255);OUT=(9,11,20,255);GOLD=(201,162,39,255);GOLD_L=(241,215,120,255);GOLD_D=(122,92,20,255)
CREAM=(242,233,216,255);MUTED=(160,168,190,255);RED=(192,57,43,255);GREEN=(76,175,80,255);CYAN=(79,195,247,255);XPC=(138,180,255,255)
RANK={'common':{'a':(154,163,173),'b':(107,116,128),'h':(214,221,229)},
      'uncommon':{'a':(76,175,80),'b':(46,125,50),'h':(165,214,167)},
      'rare':{'a':(66,165,245),'b':(21,101,192),'h':(187,222,251)},
      'epic':{'a':(171,71,188),'b':(106,27,154),'h':(225,190,231)},
      'legendary':{'a':(230,180,34),'b':(168,120,15),'h':(255,240,179)}}
RANKCOL={k:v['a']+(255,) for k,v in RANK.items()}
FIXED={'o':(26,20,32),'g':(201,162,39),'w':(122,74,34),'r':(200,60,60),'c':(79,195,247),'s':(250,250,250)}

# ---------- icons (12x12) ----------
ICON={
'sword':[".....oo.....","....ohao....","....ohao....","....ohao....","....ohao....","....ohao....","....ohao....","....ohao....","..oggggggo..","....ogwo....","....owwo....",".....oo....."],
'staff':[".....ooo....","....ohhho...","....ohaho...",".....ooo....",".....gwo....",".....ow.....",".....wo.....","....ow......","....wo......","...ow.......","...wo.......","...oo......."],
'bow':  ["......oo....","....oowao...","...owo.oa...","..ow...oa...","..wo...oa...","..wo...oa...","..wo...oa...","..ow...oa...","...owo.oa...","....oowao...","......oo....","............"],
'axe':  [".....oo.....","....oaao....","...oahaao...","...oaaaao...","...obaawo...","....obwo....",".....ow.....",".....wo.....",".....ow.....",".....wo.....",".....ow.....",".....oo....."],
'dagger':["............",".....oo.....","....ohao....","....ohao....","....ohao....","....ohao....","...ogggo....","....owo.....","....owo.....",".....o......","............","............"],
'cape': [".oooooooo...","oahhhhhhao..","oaaaaaaaao..",".oaaaaaaao..",".oaaaaaaaao.","..oaaaaaaao.","..oabaaaaao.","...oabaaaao.","...oabaaaao.","....obaaao..","....obbbo...",".....ooo...."],
'ring': ["............",".....oo.....","....ohho....","...oohhoo...","..ohaoohao..","..oa....ao..","..oa....ao..","..oba..abo..","...obaabo...","....oooo....","............","............"],
'amulet':[".....oo.....","....o..o....","...o....o...","...o....o...","...o....o...","....oaao....","...oahhao...","...oahaao...","...oaaabo...","....oabo....",".....oo.....","............"],
'coin': ["....oooo....","..oohhhhoo..",".ohhaaaahho.",".ohaaaaaaho.","oaaaahhaaao.","oaaaahhaaao.","oaaaahhaaao.","oaaaahhaaao.",".obaaaaaabo.",".obbaaaabbo.","..oobbbboo..","....oooo...."],
'ore':  ["............","....oooo....","...ohhaao...","..ohhaaaao..",".ohaaaabbao.",".oaaaabbbao.",".oaaabbbbao.",".obaabbbbbo.","..obbbbbbo..","...oooooo...","............","............"],
'crystal':[".....oo.....","....ohho....","...ohhaao...","..ohhaaaao..",".ohhaaaabbo.",".oaaaabbbbo.","..oaaabbbo..","...oaabbo...","....oabo....",".....oo.....","............","............"],
'shield':[".oooooooooo.","oahhhhhhhhao","oaahhhhhhaao","oaaaahhaaaao","oaaaaaaaaaao",".oaaaaaaaao.",".oaaaaaaaao.","..oaaaaaao..","...oaaaao...","....oaao....",".....oo.....","............"],
'heal': ["............","....oooo....","....ohho....",".oooohhoooo.",".ohhhhhhhho.",".ohhhhhhhho.",".oooohhoooo.","....ohho....","....ohho....","....oooo....","............","............"],
'daggers':["o.........o.",".oa.....ao..","..oa...ao...","...oa.ao....","....oao.....","....oao.....","...oa.ao....","..oa...ao...",".ogo...ogo..",".o.......o..","............","............"],
'meteor':[".........oo.","........oaao",".......oaaao","......oaaao.",".....oaaao..","....oahao...","...ohhaao...","..ohhhaao...","..ohhhao....","..oohho.....","...oo.......","............"],
'tent': ["............",".....oo.....","....oaao....","...oaaaao...","..oaaaaaao..",".oaaobboaao.",".oaaobboaao.","oaaaobboaaao","oaaaobboaaao","oooooooooooo","............","............"],
'map':  ["............",".oooooooooo.",".ohhhhhhhho.",".ohaaaaaaho.",".ohabbaaaho.",".ohaabbaaho.",".ohaaabbaho.",".ohaaaaaaho.",".ohhhhhhhho.",".oooooooooo.","............","............"],
'party':["............","...oo...oo..","..oaao.oaao.","..oaao.oaao.","...oo...oo..","..oaao.oaao.",".oaaaaoaaaao",".oaaaaoaaaao",".oaaaaoaaaao",".oooooooooo.","............","............"],
'tree': [".....oo.....","....ohho....","...ohaaho...","..ohaaaaho..",".ohaaaaaaho.",".oaaaaaaaao.","..oaaaaaao..","...oaaaao...","....ogwo....","....ogwo....","....ogwo....",".....oo....."],
'hourglass':[".oooooooo...",".ohaaaaho...","..oaaaao....","...obbo.....","....oo......","....oo......","...oaao.....","..oaaaao....",".ohbbbbho...",".oooooooo...","............","............"],
'gear': ["....o..o....","..o.oaao.o..","..oaaaaaao..","...oaooao...","oaaao..oaaao","o.oao..oao.o","oaaao..oaaao","...oaooao...","..oaaaaaao..","..o.oaao.o..","....o..o....","............"],
'swap': ["............","....o.......","...oho......","..ohhoooooo.",".ohhhhhhhho.","..ohhoooooo.","...oho......","....o.......",".......o....",".oooooohho..",".ohhhhhhhho.",".oooooohho.."],
'road': ["............",".....oo.....","....oaao....","....oaao....","...oa.hao...","...oa..ao...","..oa.h..ao..","..oa....ao..",".oa..h...ao.",".oa.......ao","oa...h....ao","oooooooooooo"],
'nodes': ["....oooo....","...ohhhho...","...ohhhho...","....oooo....",".....aa.....",".aaaaaaaaaa.",".aa......aa.","oooo....oooo","ohho....ohho","ohho....ohho","oooo....oooo","............"],
'play': ["............","...oo.......","...oao......","...oaao.....","...oaaao....","...oaaaao...","...oaaao....","...oaao.....","...oao......","...oo.......","............","............"],
}
def icon(im,name,x,y,pal='common',scale=1):
    p=dict(FIXED);p.update(RANK[pal] if isinstance(pal,str) else pal)
    px=im.load()
    for r,row in enumerate(ICON[name]):
        for c,ch in enumerate(row):
            if ch=='.':continue
            col=p.get(ch,(255,0,255))
            for dy in range(scale):
                for dx in range(scale):
                    X,Y=x+c*scale+dx,y+r*scale+dy
                    if 0<=X<im.width and 0<=Y<im.height:px[X,Y]=col+(255,)

# ---------- UI primitives (1x) ----------
def rect(d,x,y,w,h,col):d.rectangle((x,y,x+w-1,y+h-1),fill=col)
def frame(d,x,y,w,h,fill=NAVY,trim=GOLD,ornate=True):
    rect(d,x,y,w,h,OUT)
    rect(d,x+1,y+1,w-2,h-2,trim)
    rect(d,x+2,y+2,w-4,h-4,OUT)
    rect(d,x+3,y+3,w-6,h-6,fill)
    rect(d,x+3,y+3,w-6,1,NAVY2)
    if ornate:
        for cx,cy in ((x+1,y+1),(x+w-3,y+1),(x+1,y+h-3),(x+w-3,y+h-3)):rect(d,cx,cy,2,2,GOLD_L)
def button(d,x,y,w,h,fill=(42,48,80,255),trim=GOLD):
    rect(d,x,y,w,h,OUT);rect(d,x+1,y+1,w-2,h-2,trim);rect(d,x+2,y+2,w-4,h-4,fill);rect(d,x+2,y+2,w-4,1,(70,80,120,255))
def bar(d,x,y,w,h,frac,col,back=OUT):
    rect(d,x,y,w,h,back);fw=int(round((w-2)*max(0,min(1,frac))))
    if fw>0:
        rect(d,x+1,y+1,fw,h-2,col)
        rect(d,x+1,y+1,fw,1,tuple(min(255,c+60) for c in col[:3])+(255,))
def dim(im,x,y,w,h,alpha=140):
    ov=Image.new('RGBA',(w,h),(6,8,16,alpha));im.alpha_composite(ov,(x,y))

# ---------- text (at S scale) ----------
FS={'title':ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',10*S),
    'h':ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',8*S),
    'b':ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf',7*S),
    'bb':ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',7*S),
    's':ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf',6*S),
    'sb':ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',6*S),
    'xs':ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',5*S)}
def text(d,x,y,s,font='b',col=CREAM,anchor='la',shadow=True):
    f=FS[font]
    if shadow:d.text((x*S+S,y*S+S),s,font=f,fill=(0,0,0,200),anchor=anchor)
    d.text((x*S,y*S),s,font=f,fill=col,anchor=anchor)

def scene(name,x0=40,dimmed=False):
    paths={'hills':'sunny-hills-files/PNG/all-layers.png','lagoon':'Lagoon/Layers/all-layers-Lagoon.png','cave':'cave-battle/PNG/all-layers.png','door':'Dungeon Door/Dungeon-door.png','forest':'Green Forest/Layers/all-layers.png'}
    im=Image.open(f"{BG}/{paths[name]}").convert('RGBA')
    return im.crop((x0,0,x0+W,208))

def currency_strip(im,d):
    rect(d,0,0,W,15,(9,11,20,230))
    rect(d,0,15,W,1,GOLD_D)
    icon(im,'coin',6,2,'legendary');icon(im,'ore',80,2,'common');icon(im,'crystal',148,2,'rare');icon(im,'gear',252,2,'common')
def currency_text(d):
    text(d,21,3,'1,284','sb',GOLD_L);text(d,95,3,'37','sb',CREAM);text(d,163,3,'2','sb',(187,222,251,255))

def tabbar(im,d,active):
    rect(d,0,438,W,42,OUT);rect(d,0,438,W,1,GOLD);rect(d,0,439,W,1,GOLD_D)
    tabs=[('road','Road'),('sword','Gear'),('party','Heroes'),('map','Map'),('nodes','Tree')]
    for i,(ic,label) in enumerate(tabs):
        x=i*54
        if label==active:rect(d,x+2,441,50,37,NAVY2);rect(d,x+2,441,50,1,GOLD_L)
        icon(im,ic,x+21,446,'legendary' if label==active else 'common')
    return tabs
def tabbar_text(d,active):
    for i,label in enumerate(['Road','Gear','Heroes','Map','Tree']):
        text(d,i*54+27,462,label,'sb' if label==active else 's',GOLD_L if label==active else MUTED,anchor='ma')

# ================= MAIN SCREEN =================
def main_screen():
    im=Image.new('RGBA',(W,H),(12,14,24,255));d=ImageDraw.Draw(im)
    # scene
    sc=scene('hills');im.alpha_composite(sc,(0,96))
    rect(d,0,16,W,80,(14,17,30,255))
    rect(d,0,94,W,2,GOLD_D)
    rect(d,0,304,W,134,(12,14,24,255))
    d=ImageDraw.Draw(im)
    FY=96+182
    place(im,'knight','attack',3,150,FY)
    place(im,'cleric','idle',0,44,FY)
    place(im,'rogue','idle',1,78,FY)
    place(im,'mage','idle',2,112,FY)
    place(im,'orc','hurt',1,214,FY,flip=True)
    place(im,'slime','idle',0,246,FY+4,flip=True)
    d=ImageDraw.Draw(im)
    bar(d,204,FY-34,20,4,0.45,RED);bar(d,236,FY-22,20,4,0.9,RED)
    for hx,hp in ((44,0.61),(78,0.95),(112,0.33),(150,0.82)):bar(d,hx-10,FY-32,20,4,hp,GREEN if hp>0.35 else RED)
    # hero cards
    heroes=[('knight','Aldric','Knight',12,0.82,1.0,'shield'),('cleric','Sera','Cleric',11,0.61,0.35,'heal'),('rogue','Vex','Rogue',12,0.95,0.7,'daggers'),('mage','Morrow','Mage',10,0.33,0.15,'meteor')]
    for i,(uid,name,cls,lv,hp,ch,ab) in enumerate(heroes):
        x=4+i*66;frame(d,x,18,62,74)
        icon(im,'swap',x+46,22,'common');d=ImageDraw.Draw(im)
        # portrait
        A=ATLAS[uid];f=frame_of(uid,'idle',0)
        im.alpha_composite(f,(x+31-A['ox']-14, 18+30-A['oy']-3));d=ImageDraw.Draw(im)
        bar(d,x+5,60,52,7,hp,GREEN if hp>0.35 else RED)
        rect(d,x+5,72,52,3,OUT);rect(d,x+6,73,int(50*(0.4+i*0.15)),1,XPC)
    # zone plate
    frame(d,4,100,124,30,fill=(22,26,44,220))
    bar(d,9,120,114,5,5/8,GOLD)
    # ability bar
    frame(d,4,308,262,44)
    for i,(_,name,cls,lv,hp,ch,ab) in enumerate(heroes):
        x=14+i*66;ready=ch>=1
        button(d,x,314,32,32,fill=(60,50,20,255) if ready else (34,38,62,255),trim=GOLD_L if ready else GOLD_D)
        fh=int(26*ch);rect(d,x+3,317+26-fh,26,fh,(60,80,110,255) if not ready else (120,96,30,255))
        icon(im,ab,x+4,318,'legendary' if ready else 'rare',scale=2);d=ImageDraw.Draw(im)
    # camp panel
    frame(d,4,356,262,80)
    rect(d,8,368,254,22,(27,32,54,255));rect(d,8,412,254,20,(27,32,54,255))
    A=ATLAS['ranger'];f=frame_of('ranger','idle',0);im.alpha_composite(f,(12-A['ox']+10,372-A['oy']+12));d=ImageDraw.Draw(im)
    A=ATLAS['berserker'];f=frame_of('berserker','idle',0);im.alpha_composite(f,(12-A['ox']+10,394-A['oy']+13));d=ImageDraw.Draw(im)
    button(d,204,370,54,16,fill=(34,38,62,255),trim=GOLD_D)
    button(d,204,392,54,16,fill=(60,50,20,255),trim=GOLD_L)
    button(d,204,414,54,16,fill=(34,38,62,255),trim=GOLD_D)
    rect(d,12,414,24,18,(20,24,40,255));rect(d,13,415,22,16,(28,32,54,255))
    # offline strip
    tabs=tabbar(im,d,'Road')
    currency_strip(im,d)
    button(d,184,1,62,13,fill=(60,50,20,255),trim=GOLD_L);icon(im,'play',187,2,'legendary');d=ImageDraw.Draw(im)
    # dmg number placeholder drawn later at S
    big=im.resize((W*S,H*S),Image.NEAREST);D=ImageDraw.Draw(big)
    currency_text(D)
    for i,(uid,name,cls,lv,hp,ch,ab) in enumerate(heroes):
        x=4+i*66
        text(D,x+31,21,name,'sb',CREAM,anchor='ma');text(D,x+6,49,f'Lv {lv}','xs',MUTED)
        text(D,x+56,49,f'{int(hp*288)}/288','xs',MUTED,anchor='ra')
        text(D,x+56,77,'XP','xs',(90,100,130,255),anchor='ra')
    text(D,9,102,'Greenhollow Fields','sb',GOLD_L);text(D,9,111,'Danger Lv 1  ·  Shard 5/8','xs',MUTED)
    text(D,232,FY-58,'27','h',CREAM,anchor='ma');text(D,150,FY-52,'CRIT 41','bb',GOLD_L,anchor='ma')
    text(D,12,358,'Camp','sb',GOLD_L);text(D,258,359,'Quests 2 / 3','xs',MUTED,anchor='ra')
    text(D,38,371,'Wren · Scout','s',CREAM);text(D,38,380,'Returns in 1:42:10','xs',MUTED)
    text(D,38,393,'Bram · Hunt','s',CREAM);text(D,38,402,'Returned','xs',GREEN)
    text(D,38,416,'Empty slot','s',MUTED)
    text(D,231,373,'Waiting','xs',MUTED,anchor='ma');text(D,231,395,'Collect','sb',GOLD_L,anchor='ma');text(D,231,417,'Send hero','xs',CREAM,anchor='ma')
    text(D,218,3,'Auto-cast','xs',GOLD_L,anchor='ma')
    tabbar_text(D,'Road')
    return big

# ================= EQUIPMENT SCREEN =================
def gear_screen():
    im=Image.new('RGBA',(W,H),(12,14,24,255));d=ImageDraw.Draw(im)
    sc=scene('hills');im.alpha_composite(sc,(0,96));rect(d,0,16,W,80,(94,196,238,255));rect(d,0,304,W,134,(52,120,44,255))
    dim(im,0,16,W,422,200);d=ImageDraw.Draw(im)
    # header
    text_y=20
    # hero tabs
    for i,uid in enumerate(['knight','cleric','rogue','mage']):
        x=118+i*36;sel=i==0
        button(d,x,18,32,26,fill=(60,50,20,255) if sel else (34,38,62,255),trim=GOLD_L if sel else GOLD_D)
        A=ATLAS[uid];f=frame_of(uid,'idle',0);im.alpha_composite(f.crop((A['ox']-10,A['oy']-22,A['ox']+10,A['oy']+2)),(x+6,20));d=ImageDraw.Draw(im)
    # hero panel
    frame(d,4,48,262,92)
    rect(d,10,54,70,80,OUT);rect(d,11,55,68,78,(34,40,68,255))
    A=ATLAS['knight'];f=frame_of('knight','idle',0);f3=f.resize((f.width*2,f.height*2),Image.NEAREST)
    im.alpha_composite(f3,(45-A['ox']*2,124-A['oy']*2));d=ImageDraw.Draw(im)
    icon(im,'coin',90,56,'legendary')  # placeholder replaced by text
    d=ImageDraw.Draw(im);rect(d,90,56,12,12,NAVY)
    bar(d,90,104,166,5,0.62,XPC)
    # slots
    slots=[('Weapon','sword','Mithril Blade','rare',3,'+14 ATK','24'),('Cape','cape','Wool Cape','uncommon',2,'+9 DEF','12'),('Charm','ring','Iron Band','common',1,'+3 SPD','6')]
    for i,(sl,ic,nm,rk,stars,stat,cost) in enumerate(slots):
        x=4+i*88;frame(d,x,146,86,96,trim=RANKCOL[rk] if rk!='common' else GOLD)
        rect(d,x+29,158,28,28,OUT);rect(d,x+30,159,26,26,(34,40,68,255))
        icon(im,ic,x+31,160,rk,scale=2);d=ImageDraw.Draw(im)
        button(d,x+8,222,70,14,fill=(34,38,62,255),trim=GOLD_D)
        icon(im,'ore',x+14,223,'common');d=ImageDraw.Draw(im)
    # pack
    frame(d,4,248,262,186)
    button(d,150,254,54,14,fill=(60,50,20,255),trim=GOLD_L);button(d,208,254,52,14,fill=(34,38,62,255),trim=GOLD_D)
    inv=[('sword','legendary'),('axe','epic'),('cape','rare'),('amulet','rare'),('bow','uncommon'),('staff','uncommon'),('ring','common'),('dagger','common'),('cape','common'),('sword','common'),None,None,None,None,None]
    for k,it in enumerate(inv):
        cx,cy=k%5,k//5;x=12+cx*50;y=274+cy*50
        if it is None:
            rect(d,x,y,44,44,(14,16,28,255));rect(d,x+1,y+1,42,42,(22,26,44,255));continue
        ic,rk=it;col=RANKCOL[rk]
        rect(d,x,y,44,44,OUT);rect(d,x+1,y+1,42,42,col);rect(d,x+2,y+2,40,40,OUT);rect(d,x+3,y+3,38,38,(30,34,58,255))
        icon(im,ic,x+10,y+8,rk,scale=2);d=ImageDraw.Draw(im)
        if rk in('legendary','epic'):rect(d,x+35,y+4,5,5,(255,80,80,255))
    tabbar(im,d,'Gear');currency_strip(im,d)
    big=im.resize((W*S,H*S),Image.NEAREST);D=ImageDraw.Draw(big)
    currency_text(D)
    text(D,8,26,'Equipment','title',GOLD_L)
    text(D,90,54,'Aldric','h',CREAM);text(D,90,66,'Knight · Lv 12','s',MUTED)
    text(D,90,80,'HP','xs',MUTED);text(D,110,80,'288','sb',CREAM);text(D,150,80,'ATK','xs',MUTED);text(D,172,80,'38','sb',CREAM)
    text(D,90,91,'DEF','xs',MUTED);text(D,110,91,'20','sb',CREAM);text(D,150,91,'SPD','xs',MUTED);text(D,172,91,'9','sb',CREAM)
    text(D,90,111,'XP 1,120 / 1,806','xs',MUTED);text(D,256,111,'Power 412','xs',GOLD_L,anchor='ra')
    for i,(sl,ic,nm,rk,stars,stat,cost) in enumerate(slots):
        x=4+i*88
        text(D,x+43,149,sl,'xs',MUTED,anchor='ma')
        text(D,x+43,189,nm,'sb',RANKCOL[rk] if rk!='common' else CREAM,anchor='ma')
        text(D,x+43,199,'★'*stars+'☆'*(5-stars),'xs',GOLD_L,anchor='ma')
        text(D,x+43,209,stat,'xs',GREEN,anchor='ma')
        text(D,x+48,224,f'Upgrade  {cost}','xs',CREAM,anchor='ma')
    text(D,10,254,'Pack','sb',GOLD_L);text(D,10,264,'10 / 15','xs',MUTED)
    text(D,177,256,'Equip best','xs',GOLD_L,anchor='ma');text(D,234,256,'Forge','xs',CREAM,anchor='ma')
    tabbar_text(D,'Gear')
    return big

main_screen().save('/mnt/user-data/outputs/mock_main_screen.png')
gear_screen().save('/mnt/user-data/outputs/mock_equipment_screen.png')
print('ok')
