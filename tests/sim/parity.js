// Source-to-bundle parity: the built index.html must embed source/game.js verbatim (build.py inlines it), carry the build id in
// version.json, and the game hash of a batch (its manifest) must equal the hash of that same source. Prints PARITY PASS/FAIL.
// Usage: node tests/sim/parity.js [--manifest tests/sim/manifests/<tag>.json]
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const args=(()=>{const a={};const v=process.argv.slice(2);for(let i=0;i<v.length;i++){if(v[i].startsWith('--')){const k=v[i].slice(2),n=v[i+1];if(n&&!n.startsWith('--')){a[k]=n;i++;}else a[k]=true;}}return a;})();
const ROOT=path.join(__dirname,'..','..');const rd=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const src=rd('source/game.js'),html=rd('index.html'),ver=JSON.parse(rd('version.json'));
const h16=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let fails=0;const say=(ok,m)=>{console.log('  '+(ok?'PASS ':'FAIL ')+m);if(!ok)fails++;};
say(html.includes(src),'index.html embeds source/game.js verbatim (source hash '+h16(src)+')');
say(html.includes(ver.build),'index.html carries build '+ver.build+' from version.json');
if(args.manifest){const m=JSON.parse(rd(String(args.manifest)));say(m.gameHash===h16(src),'manifest '+path.basename(String(args.manifest))+' game hash '+m.gameHash+' equals the source hash '+h16(src));const dirtyRuns=Object.keys(m.provenanceSets||{}).length;say(dirtyRuns===1,'one provenance set in the manifest ('+dirtyRuns+')');}
console.log(fails?'PARITY FAIL ('+fails+')':'PARITY PASS');process.exit(fails?1:0);
