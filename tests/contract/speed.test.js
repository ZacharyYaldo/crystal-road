// Speed contract tests: the production 4x boost (buySpeed4, speedNow) against the game's own clock, and the frame loop as the bot
// and the production loop run it (speedNow() read every frame, update() run that many times, real time advanced once per frame).
// Run: node tests/contract/speed.test.js   (exit code 1 on any failure)
'use strict';
const H=require('../sim/headless.js');
let pass=0,fail=0;const out=[];
function ok(c,m){if(c)pass++;else{fail++;out.push('FAIL '+m);}}
function near(a,b,eps,m){ok(Math.abs(a-b)<=eps,m+' (got '+a+', want '+b+')');}
async function game(){const S=H.load({seed:1,startMs:1700000000000});await S.ready;S.G.title=false;S.G.tut=null;return S;}
(async()=>{
  const DT=1/60,HOUR=3600*1000;
  {const S=await game(),G=S.G;
    ok(S.speedNow()===1,'fresh game runs at 1x');G.speed=2;ok(S.speedNow()===2,'toggle 2x');G.speed=1;
    const c0=S.clock.get();S.buySpeed4();ok(G.speed===4,'buySpeed4 sets the 4x state');ok(G.speedUntil===c0+2*HOUR,'boost ends exactly two real hours after purchase');ok(S.speedNow()===4,'4x right after purchase');
    S.clock.advance(2*HOUR-1);ok(S.speedNow()===4,'still 4x one millisecond before the end');
    S.clock.advance(1);ok(S.speedNow()===2,'back to 2x at the end');ok(G.speed===2,'the toggle state itself falls back to 2');
    S.clock.advance(5*HOUR);ok(S.speedNow()===2,'stays 2x afterwards without a repurchase');
    const c1=S.clock.get();S.buySpeed4();ok(G.speedUntil===c1+2*HOUR,'a purchase after expiry runs two hours from now, not from the old end');
    S.clock.advance(HOUR);S.buySpeed4();ok(G.speedUntil===c1+4*HOUR,'a purchase while active extends from the current end');}
  {const S=await game(),G=S.G;let gameS=0,frames=0;
    S.clock.setFps(60);const frame=(pre)=>{S.clock.frame();S.setRT(S.clock.frames()*DT);G.tut=null;if(pre)pre();const n=S.speedNow();for(let k=0;k<n;k++){S.update(DT,k===0);gameS+=DT;}frames++;return n;};
    let t0=0,n4=0,first=true;while(first||S.clock.get()<t0+2*HOUR){const n=frame(first?()=>{S.buySpeed4();t0=S.clock.get();}:null);first=false;if(n===4)n4++;} /* the purchase happens inside a frame, before that frame's updates, as in the game's tap handler and the bot */
    near(gameS,8*3600,4*DT,'game time advances eight hours during the two real hours of 4x (frame-counted clock: within one frame)');ok(n4===2*3600*60,'exactly 432,000 frames ran at 4x ('+n4+')');ok(frames-n4<=1,'every frame inside the window ran at 4x except the crossing frame ('+n4+' of '+frames+')');
    const g1=gameS,f1=frames;while(S.clock.get()<t0+4*HOUR)frame();
    near(gameS-g1,4*3600,4*DT,'the next two real hours run at 2x: four game hours');ok(frames-f1===2*3600*60,'exactly 432,000 real frames in the second window ('+(frames-f1)+')');
    ok(!(G.speedUntil>S.clock.get())&&G.speed===2,'no repurchase happened on its own');}
  if(out.length)console.log(out.join('\n'));console.log((fail?'FAIL  ':'PASS  ')+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
