import re
src=open('/home/claude/mod/mock.py').read()
src=src[:src.index("main_screen().save")]
exec(src)

def pix(im,grid,x,y,pal,sc=1):
    px=im.load()
    for r,row in enumerate(grid):
        for c,ch in enumerate(row):
            if ch=='.':continue
            col=pal[ch]
            for dy in range(sc):
                for dx in range(sc):
                    X,Y=x+c*sc+dx,y+r*sc+dy
                    if 0<=X<im.width and 0<=Y<im.height:px[X,Y]=col+(255,)

O=(26,20,32);STONE=(150,140,124);STONE2=(110,100,90);STONE3=(190,178,156);WOOD=(110,72,36);WOOD2=(80,50,24);RED=(190,60,60);WHITE=(236,230,214);STRAW=(214,178,90);DARK=(30,26,34);IRON=(140,150,160)
MINE=[
"........oooooo........",
"......ooSSSSSSoo......",
"....ooSSSSssSSSSoo....",
"...oSSSSsssoooSSSSo...",
"..oSSSSssoDDDDosSSSo..",
"..oSSSsoDDDDDDDDoSSo..",
".oSSSSoWDDDDDDDDWoSSo.",
".oSSSSoWDDDDDDDDWoSSo.",
".oSSSSoWDDDDDDDDWoSSo.",
"ooooooWWDDDDDDDDWWoooo",
"......oWDDDDDDDDWo....",
]
STALL=[
".oooooooooooooooooo.",
"oRRWWRRWWRRWWRRWWRRo",
"oWWRRWWRRWWRRWWRRWWo",
".oooooooooooooooooo.",
"..ow............wo..",
"..ow..oooooooo..wo..",
"..ow..oIIooIIo..wo..",
"..ow..oIIooIIo..wo..",
"..owoooooooooooowo..",
"..oWWWWWWWWWWWWWWo..",
"..oowwwwwwwwwwwwoo..",
"...ow..........wo...",
"...ow..........wo...",
]
DUMMY=[
"....ooo.....",
"...oYYYo....",
"...oYYYo....",
"....oYo.....",
"..oooWooo...",
".oIIoWoIIo..",
".oIIoWoIIo..",
"..oooWooo...",
"....oWo.....",
"....oWo.....",
"....oWo.....",
"..oooooooo..",
"..oYYYYYYo..",
"..oYYYYYYo..",
"..oooooooo..",
]
WALL=[
"oo..oo..oo..oo..oo..oo..oo..oo..",
"oSooSSooSSooSSooSSooSSooSSooSSoo",
"oSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSo",
"oSsSSSsSSSsSSSsSSSsSSSsSSSsSSSso",
"oSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSo",
"oSSsSSSSsSSSSsSSSSsSSSSsSSSSsSSo",
"oooooooooooooooooooooooooooooooo",
]
VIL=[
"..oo..",
".ohho.",
".ohho.",
"..oo..",
".oTTo.",
".oTTo.",
".oTTo.",
"..oo..",
".oLoL.",
]
PAL={'o':O,'S':STONE,'s':STONE3,'D':DARK,'W':WOOD,'w':WOOD2,'R':RED,'I':IRON,'Y':STRAW,'h':(240,200,170),'T':(90,120,180),'L':(60,44,40)}

def vael():
    im=Image.new('RGBA',(W,H),(12,14,24,255));d=ImageDraw.Draw(im)
    rect(d,0,16,W,422,(14,17,30,255))
    # castle scene
    sc=Image.open(f"{BG}/Dungeon Door/Dungeon-door.png").convert('RGBA').crop((49,60,319,190))
    im.alpha_composite(sc,(0,44));d=ImageDraw.Draw(im)
    rect(d,0,42,W,2,GOLD_D);rect(d,0,174,W,2,GOLD_D)
    # buildings on the courtyard
    pix(im,MINE,4,84,PAL,2);pix(im,STALL,12,126,PAL,2)
    # unbuilt plot for the training yard: stakes and a dashed outline
    for k in range(0,28,4):
        for (x,y) in [(228+k,116),(228+k,146)]:rect(d,x,y,2,1,(200,190,160,255))
        for (x,y) in [(228,116+k),(254,116+k)]:rect(d,x,y,1,2,(200,190,160,255))
    rect(d,229,144,2,4,WOOD+(255,));rect(d,252,144,2,4,WOOD+(255,))
    pix(im,WALL,0,58,PAL,1);pix(im,WALL,238,58,PAL,1)
    # banner on the wall
    d=ImageDraw.Draw(im);rect(d,14,50,1,14,O);rect(d,15,50,6,8,(190,60,60,255));rect(d,15,58,6,1,O)
    # villagers
    for (x,y,t) in [(66,118,(90,120,180)),(96,150,(150,90,60)),(196,152,(80,130,90)),(212,124,(160,120,60))]:
        pal=dict(PAL);pal['T']=t;pix(im,VIL,x,y,pal,2)
    # garrison hero at the gate
    A=ATLAS['knight'];f=frame_of('knight','idle',0);im.alpha_composite(f,(150-A['ox'],150-A['oy']));d=ImageDraw.Draw(im)
    A=ATLAS['berserker'];f=frame_of('berserker','idle',0);im.alpha_composite(f,(122-A['ox'],154-A['oy']));d=ImageDraw.Draw(im)
    # defense vs horde
    button(d,96,19,80,18,fill=(20,50,30,255),trim=(90,180,110,255))
    button(d,182,19,82,18,fill=(60,30,30,255),trim=(200,80,80,255))
    # building cards
    cards=[('mine','Iron Mine','Lv 2','3 villagers · +12 ore/h · 48 stored','Upgrade',True),
           ('coin','Market','Lv 3','2 villagers · +40 gold/h · hire villager: 150','Upgrade',True),
           ('dummy','Training Yard','','Not built · heroes at camp gain XP while resting','Build 200',False),
           ('wall','Walls','Lv 2','Defense +8 · raises building caps','Upgrade',False),
           ('shield','Garrison','2 / 3','Aldric, Bram · Defense +6 · they train while posted','Assign',True)]
    for i,(ic,name,lv,desc,btn,gold) in enumerate(cards):
        y=180+i*50;frame(d,4,y,262,46)
        rect(d,10,y+7,32,32,OUT);rect(d,11,y+8,30,30,(34,40,68,255))
        if ic=='mine':pix(im,[r[4:18] for r in MINE[2:]],14,y+12,PAL)
        elif ic=='dummy':
            pal=dict(PAL);pal.update({'Y':(70,66,80),'W':(70,66,80),'I':(70,66,80),'o':(40,36,50)});pix(im,DUMMY,20,y+10,pal)
        elif ic=='wall':pix(im,[r[:28] for r in WALL],12,y+18,PAL)
        else:icon(im,ic,20,y+17,'legendary' if ic=='coin' else 'common')
        d=ImageDraw.Draw(im)
        button(d,204,y+15,54,16,fill=(60,50,20,255) if gold else (34,38,62,255),trim=GOLD_L if gold else GOLD_D)
    tabs=tabbar6(im,d,'Vael');currency_strip(im,d)
    big=im.resize((W*S,H*S),Image.NEAREST);D=ImageDraw.Draw(big)
    currency_text(D)
    text(D,8,17,'Vael','title',GOLD_L);text(D,44,22,'Castle Lv 3','xs',MUTED);text(D,8,31,'12 villagers · 4 idle','xs',MUTED)
    text(D,136,21,'Defense 14','sb',(150,230,170,255),anchor='ma');text(D,136,29,'walls 8 · garrison 6','xs',(120,170,130,255),anchor='ma')
    text(D,223,21,'Horde 11 · 5:12:40','sb',(255,150,150,255),anchor='ma');text(D,223,29,'skeletons, from the Lagoon','xs',(200,120,120,255),anchor='ma')
    text(D,136,164,'Garrison: Aldric, Bram','xs',(230,220,200,255),anchor='ma');text(D,241,152,'plot','xs',(200,190,160,255),anchor='ma')
    for i,(ic,name,lv,desc,btn,gold) in enumerate(cards):
        y=180+i*50
        text(D,48,y+8,name,'sb',CREAM);text(D,48+len(name)*4.5+6,y+9,lv,'xs',GOLD_L)
        text(D,48,y+19,desc,'xs',MUTED)
        if ic in('mine','coin'):text(D,48,y+29,'villagers  −  3  +','xs',(120,140,200,255))
        elif ic=='shield':text(D,48,y+29,'tap to post or recall heroes','xs',(90,100,130,255))
        elif ic=='dummy':text(D,48,y+29,'appears in the courtyard once built','xs',(90,100,130,255))
        else:text(D,48,y+29,'next: Lv 3 · Defense +12','xs',(90,100,130,255))
        text(D,231,y+18,btn,'sb' if btn=='Upgrade' else 'xs',GOLD_L if gold else CREAM,anchor='ma')
    text(D,258,y+31,'120','xs',GOLD_L,anchor='ra') if False else None
    tabbar6_text(D,'Vael')
    return big

def tabbar6(im,d,active):
    rect(d,0,438,W,42,OUT);rect(d,0,438,W,1,GOLD);rect(d,0,439,W,1,GOLD_D)
    tabs=[('road','Road'),('sword','Gear'),('party','Heroes'),('castle','Vael'),('map','Map'),('nodes','Tree')]
    for i,(ic,label) in enumerate(tabs):
        x=i*45
        if label==active:rect(d,x+2,441,41,37,NAVY2);rect(d,x+2,441,41,1,GOLD_L)
        icon(im,ic,x+16,446,'legendary' if label==active else 'common')
def tabbar6_text(d,active):
    for i,label in enumerate(['Road','Gear','Heroes','Vael','Map','Tree']):
        text(d,i*45+22,462,label,'sb',GOLD_L if label==active else MUTED,anchor='ma')

ICON['castle']=["o..o..oo..o..o","oaaoaaooaaoaao","oaaaaaaaaaaaao","oaaaaaoaaaaaao","oaaaaobbaaaaao",".oaaaobbaaao..",".oaaaobbaaao..",".oaaaobbaaao..",".oaaoobbooao..","oaaaobbbbaaao.","oaaaobbbbaaao.","oooooooooooooo"][:12]
ICON['castle']=[r[:12].ljust(12,'.') for r in ICON['castle']]
ICON['road']=ICON['road']; ICON['nodes']=ICON['nodes']
vael().save('/mnt/user-data/outputs/mock_vael_screen.png');print('ok')
