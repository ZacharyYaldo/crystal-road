import time,json,os,sys
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sh=open(os.path.join(root,'source/shell.html'),encoding='utf-8').read()
g=open(os.path.join(root,'source/game.js'),encoding='utf-8').read()
aj=open(os.path.join(root,'build/assets.json'),encoding='utf-8').read()
build=time.strftime('%Y%m%d-%H%M%S')
aj=aj.replace('.mp3"','.mp3?v='+build+'"')
html=sh.replace('__ASSETS__',aj).replace('__GAME__',g).replace('__BUILD__',build)
for i in range(5):
    try:
        open(os.path.join(root,'index.html'),'w',encoding='utf-8',newline='\n').write(html);break
    except OSError:
        time.sleep(1)
open(os.path.join(root,'version.json'),'w').write(json.dumps({'build':build}))
print('built',build,len(html)//1024,'KB')
