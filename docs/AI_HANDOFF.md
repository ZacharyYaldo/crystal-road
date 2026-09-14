STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: HARNESS_CORRECTION
PASS_ID: PASS_37_TIMESTEP_CORRECTION
BASED_ON_REVIEW_PASS: REVIEWER_MESSAGE_RELAYED_BY_HUMAN_2026-09-14 (pass 36 invalid: timestep, garrison clock, assertions)
BUILD: 20260914-135543
HEAD_COMMIT_SHA: 9cc7259553b06b41294c76bac1173cb6d03af921
RESULTS_COMMIT: 9cc7259553b06b41294c76bac1173cb6d03af921 (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_36 (both its batches ran at dt 0.1; INVALID for balance decisions, as the reviewer found)

# Crystal Road AI Handoff - Pass 37 (timestep correction; no baselines yet; no gameplay change)

DEVELOPER_POSITION: AGREE on the timestep, PARTIAL on the garrison clock, and the reviewer's conclusion stands: pass 36 is not usable.
- Timestep: confirmed. batch.js had no --dt passthrough, so every batch ran the bot's 0.1s default while production caps a frame at 0.05s and a phone steps 1/60. Fight phases are timed in fractions of a second, so a coarse step stretches every fight. Reproduction on seed 61 casual, 4h: Stillwater cleared at 1.99h (dt 0.1), 1.27h (dt 0.05), 1.46h (dt 1/60); Thornwood at 3.08h (0.05) and 3.16h (1/60), unreached at 0.1. So 0.05 is close to a phone's frame rate but not identical; the residual is run-to-run chaos once RNG paths diverge, not a systematic bias in one direction.
- Garrison clock: not reproduced. Inside the harness the game's Date is a proxy onto the simulated clock, and the game's now() (which postLeft and the income timers use) returns the simulated time; a direct test advanced the sim clock one hour and Date.now() inside the game context moved exactly 3600000 ms. If the reviewer has a specific path that reads host time, name it. Regardless, the bot now asserts every tick that the game's now() equals the simulated clock, so any leak will end the run with an ERROR.
- Assertions: added. dt above the 0.05 cap fails the run at tick one unless --allowCoarseDt is passed explicitly; the clock check runs every tick; config records dt and frameCap in every result file.
CONFIDENCE: HIGH on the diagnosis and the fix; the numbers await fresh batches.

## Changed (tests/sim only, commit 9cc7259)
- bot.js: DT default 0.05; FRAME_CAP 0.05; dt and clock assertions; config.frameCap.
- batch.js: --dt and --allowCoarseDt pass through and are recorded by the bot.
- headless.js: exposes the game's now() as S.gameNow for the clock assertion.
- tests/README.md: timestep section.

## Next step (awaiting the human's approval, because of the cost)
Fresh 1x and 2x batches on fresh seeds. Two options:
- dt 0.05 (the production cap): about 2x the pass 36 cost, roughly 2.5 h per 40-run batch alone or 5 h for both in parallel.
- dt 1/60 (a phone's actual step): about 6x the pass 36 cost, roughly 5+ h per batch.
Developer recommendation: dt 0.05 for this baseline and for candidate testing, with one confirming batch at 1/60 before anything is locked. Seeds: 71-80 (fresh, as the reviewer asked). Profiles as before: idleboost, light, casual, engaged.

## Not changed
No value in source/game.js. The salvage parity fix (one salvageItem path) and source-to-bundle parity from pass 36 remain valid.
