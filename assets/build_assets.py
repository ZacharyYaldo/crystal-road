import json,io,base64
from PIL import Image
BG="/home/claude/bg/Battle Backgrounds Pack Files/Assets"
def b64(path):
    im=Image.open(path).convert('RGBA');q=im.quantize(colors=256,method=Image.Quantize.FASTOCTREE)
    b=io.BytesIO();q.save(b,'PNG',optimize=True);return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
scenes={
 'hills':[('sunny-hills-files/PNG/back.png',0.15),('sunny-hills-files/PNG/middle.png',0.45),('sunny-hills-files/PNG/front.png',1.0)],
 'lagoon':[('Lagoon/Layers/back.png',0.15),('Lagoon/Layers/middle.png',0.45),('Lagoon/Layers/front.png',1.0)],
 'cave':[('cave-battle/PNG/back.png',0.15),('cave-battle/PNG/middle.png',0.45),('cave-battle/PNG/front.png',1.0)],
 'sunset':[('pink-sunset/PNG/back.png',0.2),('pink-sunset/PNG/front.png',1.0)],
 'door':[('Dungeon Door/Dungeon-door.png',1.0)],
}
out={'atlas':json.load(open('atlas.json')),'scenes':{k:[{'src':b64(f"{BG}/{p}"),'p':sp} for p,sp in v] for k,v in scenes.items()}}
json.dump(out,open('assets.json','w'))
import os;print(os.path.getsize('assets.json'))
