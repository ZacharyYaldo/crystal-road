import json, base64, io, glob, os
from PIL import Image
from remix import remap, add_cape, SRC, GOLD, CRIMSON, FOREST

ROOT="/home/claude/pack/Tiny RPG Character Asset Pack 01 v2.0 -Full 22 Characters"
def sheet(name, anim): return f"{SRC}/{name}/{name}/{name}_{anim}.png"

# id: (source character, remix fn or None, anim map)
def knight_gold(f):
    return remap(f,{"metal":("tint",GOLD),"accent":("hue",215)})
def swordsman(f):
    return remap(f,{"accent":("hue",265),"cloth":("hue",150)})
def wizard(f): return remap(f,{'cloth':('hue',20),'leather':('hue',45)})
def priest(f): return remap(f,{'accent':('hue',200),'metal':('tint',(200,190,230))})
def archer(f): return remap(f,{'leather':('hue',15),'other':('hue',350)})
def axeman(f): return remap(f,{'metal':('tint',(150,60,60)),'accent':('hue',48)})
def marshbat(f): return remap(f,{'cloth':('hue',150),'other':('shift',60)})
def ashskel(f): return remap(f,{'metal':('tint',(120,110,140))})

UNITS={
 'knight':   ('Knight',knight_gold,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'cleric':   ('Priest',priest,{'idle':'Idle','walk':'Walk','attack':'Attack','heal':'Heal(With magic effects)','hurt':'Hurt','death':'Death'}),
 'rogue':    ('Swordsman',swordsman,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'mage':     ('Wizard',wizard,{'idle':'Idle','walk':'Walk','attack':'Attack02','hurt':'Hurt','death':'Death'}),
 'ranger':   ('Archer',archer,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'berserker':('Armored Axeman',axeman,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'slime':    ('Slime',None,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'bat':      ('Bat',None,{'idle':'Flying','walk':'Flying','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'orc':      ('Orc',None,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'skeleton': ('Skeleton',None,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'marshbat': ('Bat',marshbat,{'idle':'Flying','walk':'Flying','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'werewolf': ('Werewolf',None,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'armoredorc':('Armored Orc',None,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'skelarcher':('Skeleton Archer',None,{'idle':'Idle','walk':'Walk','attack':'Attack','hurt':'Hurt','death':'Death'}),
 'eliteorc': ('Elite Orc',None,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'armoredskel':('Armored Skeleton',ashskel,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'greatskel':('Greatsword Skeleton',None,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'necromancer':('Necromancer',None,{'idle':'Idle','walk':'Walk','attack':'Attack02','hurt':'Hurt','death':'DEATH'}),
 'templar':   ('Knight Templar',None,{'idle':'Idle','walk':'Walk01','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'lancer':    ('Lancer',None,{'idle':'Idle','walk':'Walk01','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'soldier':   ('Soldier',None,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'werebear':  ('Werebear',None,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
 'orcrider':  ('Orc rider',None,{'idle':'Idle','walk':'Walk','attack':'Attack01','hurt':'Hurt','death':'Death'}),
}

manifest={}
for uid,(src,fn,amap) in UNITS.items():
    frames={}
    for a,sname in amap.items():
        im=Image.open(sheet(src,sname)).convert('RGBA')
        n=im.width//100
        fr=[im.crop((i*100,0,(i+1)*100,100)) for i in range(n)]
        if fn: fr=[fn(f) for f in fr]
        frames[a]=fr
    # union bbox
    x0,y0,x1,y1=100,100,0,0
    for fr in frames.values():
        for f in fr:
            b=f.getbbox()
            if b: x0=min(x0,b[0]);y0=min(y0,b[1]);x1=max(x1,b[2]);y1=max(y1,b[3])
    x0-=1;y0-=1;x1+=1;y1+=1
    if fn is not None or uid in ('knight','cleric','rogue','mage','ranger','berserker','templar','lancer'): x0=max(0,x0-10)  # room for capes on the left
    cw,ch=x1-x0,y1-y0
    ib=frames['idle'][0].getbbox()
    f0=frames['idle'][0]
    if uid in ('bat','marshbat'):
        ox=(ib[0]+ib[2])//2-x0; oy=ib[3]-y0
    else:
        # body centre from the feet rows only (ignores weapons sticking out sideways)
        # body centre = median x of opaque pixels in the leg/feet rows (robust to swords and shields)
        xs=[x for y in range(50,58) for x in range(100) if f0.getpixel((x,y))[3]>0]
        xs.sort(); cx=xs[len(xs)//2] if xs else (ib[0]+ib[2])//2
        ox=cx-x0; oy=57-y0
    rows=list(frames.keys()); maxn=max(len(v) for v in frames.values())
    atlas=Image.new('RGBA',(cw*maxn,ch*len(rows)),(0,0,0,0))
    anims={}
    for r,a in enumerate(rows):
        for i,f in enumerate(frames[a]):
            atlas.paste(f.crop((x0,y0,x1,y1)),(i*cw,r*ch))
        anims[a]={'row':r,'n':len(frames[a])}
    buf=io.BytesIO(); atlas.save(buf,'PNG',optimize=True)
    manifest[uid]={'cw':cw,'ch':ch,'ox':ox,'oy':oy,'anims':anims,'src':'data:image/png;base64,'+base64.b64encode(buf.getvalue()).decode()}
    print(uid,cw,ch,ox,oy,len(buf.getvalue()))

# drone (ansimuz pack, 160x160 frames) as the Foundry boss
DR="/home/claude/bg/Battle Backgrounds Pack Files/Assets/Characters/Drone"
dframes={}
for a,p in [('idle','Idle/spritesheet.png'),('walk','Idle/spritesheet.png'),('attack','Attack/spritesheet.png'),('hurt','Idle/spritesheet.png'),('death','Defeat/spritesheet.png')]:
    im=Image.open(f"{DR}/{p}").convert('RGBA');n=im.width//160
    dframes[a]=[im.crop((i*160,0,(i+1)*160,160)) for i in range(n)]
x0,y0,x1,y1=160,160,0,0
for fr in dframes.values():
    for f in fr:
        bb=f.getbbox()
        if bb:x0=min(x0,bb[0]);y0=min(y0,bb[1]);x1=max(x1,bb[2]);y1=max(y1,bb[3])
x0-=1;y0-=1;x1+=1;y1+=1;cw,ch=x1-x0,y1-y0
ib=dframes['idle'][0].getbbox();ox=(ib[0]+ib[2])//2-x0;oy=ib[3]-y0
rows=list(dframes.keys());maxn=max(len(v) for v in dframes.values())
atlas=Image.new('RGBA',(cw*maxn,ch*len(rows)),(0,0,0,0));anims={}
for r,a in enumerate(rows):
    for i,f in enumerate(dframes[a]):atlas.paste(f.crop((x0,y0,x1,y1)),(i*cw,r*ch))
    anims[a]={'row':r,'n':len(dframes[a])}
buf=io.BytesIO();atlas.save(buf,'PNG',optimize=True)
manifest['drone']={'cw':cw,'ch':ch,'ox':ox,'oy':oy,'anims':anims,'src':'data:image/png;base64,'+base64.b64encode(buf.getvalue()).decode()}
print('drone',cw,ch,ox,oy,len(buf.getvalue()))
# projectile
arrow=Image.open(f"{ROOT}/Arrow(Projectile)/Arrow02(32x32).png").convert('RGBA')
b=arrow.getbbox(); arrow=arrow.crop(b); buf=io.BytesIO(); arrow.save(buf,'PNG')
manifest['_arrow']={'w':arrow.width,'h':arrow.height,'src':'data:image/png;base64,'+base64.b64encode(buf.getvalue()).decode()}
json.dump(manifest,open('atlas.json','w'))
print('total', os.path.getsize('atlas.json'))
