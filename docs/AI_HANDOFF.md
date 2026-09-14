STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: HARNESS_CORRECTION
PASS_ID: PASS_38_GARRISON_CLOCK_AND_1_60_STEP
BASED_ON_REVIEW_PASS: REVIEWER_MESSAGE_RELAYED_BY_HUMAN_2026-09-14 (garrison host clock; 1/60 for the reference baseline)
BUILD: 20260914-135543
HEAD_COMMIT_SHA: 43fd408a744c3e6321982621cbb58346ea288a1d
RESULTS_COMMIT: 43fd408a744c3e6321982621cbb58346ea288a1d (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_37 (its garrison position was wrong)

# Crystal Road AI Handoff - Pass 38 (garrison clock fixed at the source; 1/60 default step; no baselines yet by the human's instruction)

DEVELOPER_POSITION: AGREE on both points; the pass 37 position on the garrison was wrong. The bot ran in Node's outer context and pushed a hero into the garrison itself with `idle.postedAt = Date.now()`, the host clock, which the game-clock assertion could never see because it was a separate write. Fixed at the source: the bot now calls the production postHero(h) (exported from the harness), which stamps postedAt with the game's now() on the virtual clock. Assertions added: right after a post, postLeft must read 3600 s; every tick the timer must count down on the simulated clock within 2 steps; one simulated hour after posting, postLeft must be 0 (recall available). Verified on seed 61 casual, 30 h at 1/60: posts at 5 h and 9 h, both timers 3600 s at posting, both recallable an hour later, no assertion failures.
Timestep: AGREE that 0.05 is the emergency cap (20 fps), not a phone frame. The default step is now 1/60; the cap assertion (refuse above 0.05 unless --allowCoarseDt) stays. Cost turned out modest: 30 h at 1/60 including 15 h of Endless took 56 s, so a 40-run 96 h batch at 1/60 should take on the order of an hour on ten workers, not five.
CONFIDENCE: HIGH on the fix and the assertions; the reviewer's seed 61 numbers (1.27 h at 0.05 vs 1.46 h at 1/60) are noted and 1/60 is now the reference step, so the question of whether that gap is systematic is moot for the baseline.

## Changed (tests/sim only, commit 43fd408)
- bot.js: garrison via S.postHero; post-timer and recall assertions; postChecks recorded in the output; DT default 1/60.
- headless.js: exports postHero, postLeft, recallHero.
- tests/README.md: timestep and garrison notes.

## Next step (not started; the human said not to start either batch yet)
Fresh 1x and 2x baselines at dt 1/60, seeds 71-80, profiles idleboost, light, casual, engaged, 96 real hours, as the reviewer asked. Ready to launch on the human's word.
