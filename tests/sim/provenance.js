// Prints the provenance a run made from this working tree would record: commit, gameHash (sha256 of source/game.js, 16 hex), harnessHash (one 16-hex hash per file of tests/sim/harness.js HARNESS_FILES, joined by ':').
// Usage: node tests/sim/provenance.js [--json]
'use strict';
const HARNESS=require('./harness.js'),fs=require('fs'),path=require('path');
const out={commit:HARNESS.headCommit(),gameHash:HARNESS.h16(fs.readFileSync(path.join(HARNESS.ROOT,'source/game.js'))),harnessHash:HARNESS.harnessHash(),harnessFiles:HARNESS.HARNESS_FILES,dirty:HARNESS.dirtyFiles()};
if(require.main===module){if(process.argv.includes('--json'))console.log(JSON.stringify(out));else console.log('commit '+out.commit+'\ngameHash '+out.gameHash+'\nharnessHash '+out.harnessHash+' ('+out.harnessFiles.join(':')+')'+(out.dirty.length?'\nWARNING uncommitted changes in: '+out.dirty.join(', '):''));}
module.exports=out;
