// Prints the provenance a run made from this working tree would record: commit, gameHash (sha256 of source/game.js, 16 hex), harnessHash (bot.js:headless.js).
// Usage: node tests/sim/provenance.js [--json]
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const h=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,f))).digest('hex').slice(0,16);
let commit='unknown';try{commit=cp.execSync('git rev-parse HEAD',{cwd:__dirname,stdio:['ignore','pipe','ignore']}).toString().trim();}catch(e){}
let dirty='';try{dirty=cp.execSync('git status --porcelain -- ../../source/game.js bot.js headless.js batch.js',{cwd:__dirname,stdio:['ignore','pipe','ignore']}).toString().trim();}catch(e){}
const out={commit,gameHash:h('../../source/game.js'),harnessHash:h('bot.js')+':'+h('headless.js'),dirty:dirty?dirty.split('\n'):[]};
if(process.argv.includes('--json'))console.log(JSON.stringify(out));else console.log('commit '+out.commit+'\ngameHash '+out.gameHash+'\nharnessHash '+out.harnessHash+(out.dirty.length?'\nWARNING uncommitted changes in: '+out.dirty.join(', '):''));
module.exports=out;
