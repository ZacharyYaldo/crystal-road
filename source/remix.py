import colorsys, glob, os
from PIL import Image

SRC="/home/claude/pack/Tiny RPG Character Asset Pack 01 v2.0 -Full 22 Characters/Characters(100x100 split)"

def hsv(p): return colorsys.rgb_to_hsv(p[0]/255,p[1]/255,p[2]/255)
def rgb(h,s,v): r,g,b=colorsys.hsv_to_rgb(h,s,v); return (int(r*255+.5),int(g*255+.5),int(b*255+.5))

def classify(p):
    r,g,b,a=p
    if a==0: return 'none'
    h,s,v=hsv(p); h*=360
    if v<0.14: return 'outline'
    if s<0.22: return 'bright' if v>0.80 else 'metal'   # blade highlights vs armor
    if (h<18 or h>335) and s>0.45: return 'accent'  # reds
    if 18<=h<=42 and 0.2<s<0.62 and v>0.55: return 'skin'
    if 18<=h<=45: return 'leather'                   # browns / wood / gold
    if 180<=h<=280: return 'cloth'                   # blues / purples
    return 'other'

def remap(im, rules):
    """rules: {class: ('hue',deg) | ('tint',(r,g,b)) | ('shift',deg)}"""
    im=im.copy(); px=im.load()
    for y in range(im.height):
        for x in range(im.width):
            p=px[x,y]; c=classify(p)
            if c not in rules: continue
            kind,arg=rules[c]; h,s,v=hsv(p)
            if kind=='hue':      # set hue, keep value, ensure some saturation
                nr=rgb(arg/360, max(s,0.45), v)
            elif kind=='shift':
                nr=rgb((h+arg/360)%1, s, v)
            elif kind=='tint':   # colorize greys toward a target while keeping brightness
                th,ts,tv=colorsys.rgb_to_hsv(*(c_/255 for c_ in arg))
                nr=rgb(th, ts*0.75, v)
            px[x,y]=nr+(p[3],)
    return im

def add_cape(frame, color, dark, length=0.8, width=5, flare=1.0):
    """Draw a cape behind the body, only into transparent pixels."""
    im=frame.copy(); px=im.load(); W,H=im.size
    bbox=im.getbbox()
    if not bbox: return im
    x0,y0,x1,y1=bbox; h=y1-y0
    # find body columns: use rows in the middle to locate the torso's left edge
    sh=int(y0+h*0.33); hip=int(y0+h*0.33+h*length*0.55)
    rows=range(sh, min(hip, y1-2))
    cape=set()
    n=len(rows)
    for i,y in enumerate(rows):
        # leftmost opaque pixel in this row within the sprite's central band
        xs=[x for x in range(x0, x1) if px[x,y][3]>0]
        if not xs: continue
        left=min(xs)
        w=1+int((width-1)*(i/max(1,n-1))**flare)
        for k in range(1,w+1):
            X=left-k
            if 0<=X<W and px[X,y][3]==0: cape.add((X,y))
    # fill
    for (X,y) in cape:
        shade=dark if (X+1,y) not in cape and px[X+1,y][3]>0 else color
        px[X,y]=shade+(255,)
    # outline where cape touches transparency
    for (X,y) in list(cape):
        for dx,dy in ((-1,0),(0,1),(0,-1),(1,0)):
            nx,ny=X+dx,y+dy
            if 0<=nx<W and 0<=ny<H and px[nx,ny][3]==0:
                px[nx,ny]=(0,0,0,255)
    return im

def process_sheet(path, fn):
    sheet=Image.open(path).convert('RGBA')
    n=sheet.width//100
    out=Image.new('RGBA',sheet.size,(0,0,0,0))
    for i in range(n):
        f=sheet.crop((i*100,0,(i+1)*100,100))
        out.paste(fn(f),(i*100,0))
    return out

def variant(name, fn, outname):
    d=f"{SRC}/{name}/{name}"
    os.makedirs(f"/home/claude/mod/out/{outname}",exist_ok=True)
    for f in glob.glob(f"{d}/{name}_*.png"):
        anim=os.path.basename(f).split('_',1)[1]
        process_sheet(f,fn).save(f"/home/claude/mod/out/{outname}/{outname}_{anim}")

# ---------- variants ----------
GOLD=(214,168,74); CRIMSON=(150,40,50); TEAL=(40,120,120); PLUM=(110,50,120); FOREST=(50,110,60); NAVY=(40,60,130); SAND=(210,180,120); WINE=(120,30,50); IVORY=(235,225,200)

def knight_gold(f):
    f=remap(f,{'metal':('tint',GOLD),'accent':('hue',215)})
    return add_cape(f,(40,60,130),(28,40,90),width=5)
def knight_black(f):
    f=remap(f,{'metal':('tint',(70,80,110)),'accent':('hue',48)})
    return add_cape(f,CRIMSON,(100,25,35),width=6,flare=0.8)
def swordsman_v(f):
    f=remap(f,{'accent':('hue',265),'cloth':('hue',150)})
    return add_cape(f,FOREST,(30,75,40),width=4)
def wizard_v(f):
    return remap(f,{'cloth':('hue',20),'leather':('hue',45)})
def priest_v(f):
    return remap(f,{'accent':('hue',200),'metal':('tint',(200,190,230))})
def templar_v(f):
    f=remap(f,{'accent':('hue',150),'metal':('tint',(120,130,160))})
    return add_cape(f,(230,225,210),(180,175,160),width=5)

if __name__=='__main__':
    variant('Knight',knight_gold,'Knight_Gold')
    variant('Knight',knight_black,'Knight_Black')
    variant('Swordsman',swordsman_v,'Swordsman_Emerald')
    variant('Wizard',wizard_v,'Wizard_Ember')
    variant('Priest',priest_v,'Priest_Azure')
    variant('Knight Templar',templar_v,'Templar_Verdant')
    print('done')
