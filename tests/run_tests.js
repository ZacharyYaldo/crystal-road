// Test runner: runs every contract suite in its own process and exits non-zero if ANY suite fails or crashes.
// Use this instead of piping a suite into tail/grep: a pipe reports the exit code of the LAST command, so a failing
// suite behind "| tail" looks green. This runner never pipes; it prints each suite's last lines and a final verdict.
// Run: node tests/run_tests.js            (exit code 1 on any failure; add --quiet to print only the verdict lines)
'use strict';
const cp=require('child_process'),path=require('path'),fs=require('fs');
const QUIET=process.argv.includes('--quiet');
const dir=path.join(__dirname,'contract');
const suites=fs.readdirSync(dir).filter(f=>f.endsWith('.test.js')).sort();
let failed=0;const lines=[];
for(const f of suites){
  const t=Date.now();
  const r=cp.spawnSync(process.execPath,[path.join(dir,f)],{encoding:'utf8',maxBuffer:1<<26});
  const out=((r.stdout||'')+(r.stderr||'')).trim().split('\n');
  const verdict=out.filter(l=>/^(PASS|FAIL)\b/.test(l)).pop()||'(no verdict line)';
  const ok=r.status===0&&/^PASS\b/.test(verdict);
  if(!ok)failed++;
  lines.push((ok?'ok   ':'FAIL ')+f.padEnd(20)+' exit '+r.status+'  '+verdict+'  ('+((Date.now()-t)/1000).toFixed(1)+'s)');
  if(!QUIET&&!ok)console.log(out.slice(-25).join('\n'));
}
console.log(lines.join('\n'));
console.log(failed?'TESTS FAIL: '+failed+' of '+suites.length+' suites':'TESTS PASS: '+suites.length+' suites');
process.exit(failed?1:0);
