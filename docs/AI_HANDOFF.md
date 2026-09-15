STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: HARNESS_OPTIMIZATION_APPLIED_NO_BASELINE
PASS_ID: PASS_42_HARNESS_SPEEDUP_AND_TIMED_4X
BASED_ON_REVIEW_PASS: REVIEWER_OPTIMIZATION_PLAN_RELAYED_BY_HUMAN_2026-09-14
BUILD: 20260914-210630
HEAD_COMMIT_SHA: eff53a5ec91b93b584599b7364010cacedb4301c
RESULTS_COMMIT: eff53a5ec91b93b584599b7364010cacedb4301c (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_41 (its applied items stand)

# Crystal Road AI Handoff - Pass 42 (harness speedup under an equivalence gate; production 4x boost function; timed 4x model in the bot; no baseline run)

HUMAN_APPROVAL (2026-09-14): default batches to 4 workers; headless audio stub (harness only); old-versus-new equivalence gate before any bookkeeping change, requiring identical canonical result hashes, RNG-call counts, milestones, currencies, gear, roster, boss outcomes and assertions across several seeds and profiles at 1x and 2x; bookkeeping optimizations only when that gate stays exact; a shared production function for activating 4x, with the listed 4x tests before any 4x batch.

DEVELOPER_POSITION: AGREE with the reviewer's boundaries. Measured first, then changed. Items 1, 2, 4 and 7 of the reviewer's plan were already true of the harness (one compiled context per process, fresh context per run, no per-tick logging in quiet mode, contract suites as the fast tier); item 6 does not apply (ablation runs short scenarios, not replays). The machine, not the harness, is the ceiling: an i7-1255U (2 performance and 8 efficiency cores, 15 W) saturates at 4 workers.

## Measurements (3 simulated hours per run, 2x, idleboost)
- Throughput by concurrent workers, simulated hours per real minute: 1 worker 22; 4 workers 42; 6 workers 39; 8 workers 40; 10 workers 43.
- CPU profile before the changes: game update 34% self, bot bookkeeping 22%, sound-effect functions 21% (the headless window had no AudioContext, so every sfx call built and threw a TypeError with a stack trace), rest scattered.
- Per-run wall time through the gate's own runs: 14.3 s at the start, 11.6 s after the audio stub (21% faster), 10.8 s after the assertion cleanup (8% more). A 96-hour run is about 4 minutes on an idle core; a 40-run batch at 4 workers is about 90 minutes at 2x.

## Applied
1. tests/sim/equiv.js (commit d885af2): the optimization-equivalence gate. It materializes the harness committed at --ref next to the CURRENT source/game.js and runs both harnesses on identical seeds, profiles and speeds. Compared per pair: assertions, RNG-call count and final RNG state, final currencies and progress, zone clears, Shatters, recruits, promotions, Endless, boss outcomes, hourly series, events, roster and gear (name, class, level, tier, ability rank, talents, three gear slots with id, rank, level), and the canonical hash of every shared field with commit, harness hash and real times removed. New telemetry fields are listed, not compared. Prints EQUIV PASS or EQUIV FAIL. The headless loader now counts Math.random draws (S.rngCalls) and the bot records rngCalls, rngState and the roster snapshot.
2. Audio stub (commit 76c2a6f, headless.js only): window.AudioContext is a constructor that throws a frozen plain object, so the game's ac() catches it and keeps AC null exactly as a browser without Web Audio; no RNG draw, no state change. Gate: 12 pairs identical including RNG-call counts, 21% faster.
3. Assertion bookkeeping (commit eab519c, bot.js): no per-tick allocations; the duplicate-hero check runs when the roster length or Shatter count changes, the boss-telemetry check when an attempt is logged; every other assertion still runs every tick. batch.js default workers 4. Gate: 12 pairs identical, 8% faster.
4. Timed 4x (this commit): source/game.js gains buySpeed4() (G.speed=4; speedUntil = max(now, speedUntil) + 2 h; toast), called by the ad sheet and the boost list, which previously duplicated the same three statements; behaviour unchanged, contract suites 1648 + 42 green. The bot sets the production toggle state (G.speed 1 or 2), reads speedNow() every frame and runs update() that many times, as the production loop does. At --speed 4 it buys the boost through buySpeed4() and rebuys whenever it lapses (--speed4Buys N caps purchases; afterwards 2x, as in the game). Every purchase is recorded (speedBoosts: hour, real seconds, game seconds) and the effective speed is asserted every frame; at --speed 1 and 2 the bot asserts that no boost exists. Boss replay uses the effective speed. Taps stay scheduled per real frame (recorded as taps and tapsPerActiveSec). Gate at 1x and 2x against eab519c: 12 pairs identical.

## 4x tests (the human's list)
- Lasts exactly two real hours: tests/contract/speed.test.js pins speedUntil = purchase + 7,200,000 ms, 4x one millisecond before the end, 2x at the end; the bot's recorded boosts at --speed 4 lasted 7199.966 real seconds each (the 34 ms is the sim clock's floating-point drift, see Open).
- Returns to 2x: pinned in the contract test (G.speed itself falls back to 2) and observed in the bot with --speed4Buys 1 (gameHours 14 over 5 real hours: 8 at 4x, then 3 x 2).
- Eight game hours per two real hours: contract test 28,800 s of update per two-hour window (within 0.5 s); bot boosts recorded 28,799.87 game seconds each.
- Repurchases only when intended: the bot rebuys only when speedUntil has lapsed and only below --speed4Buys; the contract test shows no repurchase happens on its own and that a purchase while active extends from the current end.
- Taps per real second: engaged (2 taps/s while in battle) recorded 1.54 taps per active second at 2x and 1.26 at 4x, not multiplied by the game speed (taps land only in battle frames).
- The bot reads production speedNow() every frame: yes, and asserts it equals the expected 1, 2, or 4-then-2 every frame.
- Boss replay at the same effective speed: replayFight runs update() speedNow() times per frame.
- Suites on this commit: tree 1648, sources 42, speed 16, all passing.

## Provenance for a run from this tree
commit eff53a5ec91b93b584599b7364010cacedb4301c, gameHash 41d8ae2490bafb24, harnessHash 5a825007e61f7aee:7ded2b73bc7bf741. Runs from earlier harness versions are comparable to this one at 1x and 2x (gate exact); 4x runs have no earlier reference.

## Open
- Sim clock drift: the simulated clock adds 1000/60 ms per frame in floating point to a base near 1.7e12 ms and drifts about 34 ms per two hours (about 1.6 s per 96 h) against frames times dt. Harmless for balance, but a frame-counted clock would be exact; changing it alters every past result, so it waits for the human.
- Late-Endless rerun on build 20260914-210630 at 2x and 4x with fresh seeds, when the human asks. The 4x runs now use the timed model (rebought when lapsed, i.e. held continuously) unless --speed4Buys is given.
- Item 7 (price curve) held. Reference baselines not run.
