// The files that decide how a simulator run behaves. Every one of them is hashed into harnessHash (in this order, joined by ':'),
// watched by the dirty-tree check together with the game source and the assets, and copied from the reference commit by the
// equivalence gate. A new helper module that the bot requires belongs in this list.
'use strict';
const path=require('path'),fs=require('fs'),crypto=require('crypto'),cp=require('child_process');
const HARNESS_FILES=['bot.js','headless.js','party.js','harness.js'];
const WATCHED=['source/game.js','build/assets.json'].concat(HARNESS_FILES.map(f=>'tests/sim/'+f)); /* paths from the repository root */
const ROOT=path.join(__dirname,'..','..');
const h16=buf=>crypto.createHash('sha256').update(buf).digest('hex').slice(0,16);
function harnessHash(dir){return HARNESS_FILES.map(f=>h16(fs.readFileSync(path.join(dir||__dirname,f)))).join(':');}
function dirtyFiles(){try{return cp.execSync('git status --porcelain -- '+WATCHED.join(' '),{cwd:ROOT,stdio:['ignore','pipe','ignore']}).toString().split('\n').map(s=>s.replace(/\r$/,'')).filter(s=>s.trim());}catch(e){return['unknown'];}}
function headCommit(){try{return cp.execSync('git rev-parse HEAD',{cwd:ROOT,stdio:['ignore','pipe','ignore']}).toString().trim();}catch(e){return'unknown';}}
module.exports={HARNESS_FILES,WATCHED,ROOT,h16,harnessHash,dirtyFiles,headCommit};
