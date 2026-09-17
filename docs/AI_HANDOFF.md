STATUS: FULL_BATCHES_COMPLETE_TUNING_BRANCH_ONLY
RESPONSE_TYPE: REFERENCE_AND_UPPER_BOUND_BATCHES
PASS_ID: PASS_52_FULL_BATCHES
BASED_ON_REVIEW_PASS: REVIEWER_COMBINED_VERDICT_2026-09-16, the owner's "Go", and the owner's word after the pass 51 parity batch passed
BUILD: 20260916-181649 (tuning branch; main untouched at f8c2a81)
HEAD_COMMIT_SHA: d97be00 (the code both batches ran; this handoff and the raw results are committed on top, no game or harness change)
PULL_REQUEST: #2
SUPERSEDES: PASS_51

# Crystal Road AI Handoff - Pass 52 (2x reference and continuous-4x upper bound on the real-player model, raw results committed)

## What ran
Both batches on commit d97be00 from a clean tree, 96 wall hours, seeds 81-90, profiles idleboost / light / casual / engaged, Shatter cap 10, schedule 2:2,2:8,2:8 (play 2 h, offline 2 h, play 2 h, offline 8 h, play 2 h, offline 8 h, repeating), drills, doubled offline rewards, Time Warp and daily chest, cleric last. Speed 2 is the reference; speed 4 is the labelled upper bound (purchases at session starts only, no offline speed factor).
- tests/sim/results/p52x2/ and tests/sim/results/p52x4/: 40 run files, summary and manifest each; all 80 run-file sha256 hashes match tests/sim/manifests/p52x2.json and p52x4.json.
- Provenance: one configuration set per batch, commit d97be00, game 9327f718e0d073d6, harness 97ce6f70faca68a2:3428d540609633d2, dirty tree [] in all 80 runs. tests/sim/parity.js --manifest PASS for both (bundle embeds the source; manifest hash equals the source hash).
- Zero assertion failures, zero boss softlocks, zero batch errors in all 80 runs.

## 2x reference (tests/sim/bounded.js --dir batch_out_p52x2): BOUNDED FAIL, 2 checks
- PASS 1 and 2: no run reaches Shatter 8 before 48 h; no run reaches Shatter 10 in 96 h; median 7 Shatters (seed 81: 4.1, 14.0, 24.0, 25.9, 29.4, 48.0, 72.5 h).
- Check 4 (final-day power growth no more than 0.8 of the previous day, log ratio): light 0.77, casual 0.71, engaged 0.65 PASS; idleboost 0.81 FAIL by 0.01 (x8.46 vs x13.92). The boosted idle profile is the one with no taps and the least spending; its late curve flattens slightly slower than the others.
- PASS 5: Endless waves gained 72-96 h below 48-72 h in every profile (241 vs 400 idleboost, 234 vs 410 light, 249 vs 393 casual, 258 vs 542 engaged); best wave at 96 h 989-1015.
- PASS 6: no softlocks; 31-37 ascensions per run; 1.2-1.4B ore spent in the last 24 h. Walls (loss streak of 8 or more, then cleared): 3 idleboost runs and 2 light runs, e.g. Ashen Keep x9, The Foundry x8.
- PASS 8: drill dust 6.8 / 8.3 / 8.2 / 8.2% of all dust (30-36 drill dust vs 401-407 Shatter dust per run); first-cycle claims 11-13 dust, repeat claims 18-24 dust across the run.
- PASS 7a: engaged enters Endless 9.5% earlier than boosted idle in wall hours (25.6 vs 28.3 h; want 5-12).
- FAIL 7b: 8.5% earlier in played hours (7.6 vs 8.3 h; want 15-30). Same shape as passes 49 and 51 (9.3-11.7%). The played-hours gap is small because Endless entry lands in the second session for every profile; taps and boosts shorten the wall clock more than the played clock. This is a criterion question for the reviewer and the owner, not a defect.
- Records: 1T gold reached in 1/10 idleboost, 0/10 light, 1/10 casual, 3/10 engaged runs (h 79-88); Endless entered 25.6-28.3 h; power at 96 h 3.5-4.2B; level 233-239; item level 91-92 at rank 4.

## Continuous 4x upper bound (batch_out_p52x4): BOUNDED PASS (informational by design)
- Checks 1, 2, 4, 5, 6, 8 all pass: median 7 Shatters, no Shatter 10; check 4 ratios 0.50-0.58; drill dust 7.5-8.8%; 1T gold in 10/10 runs at h 65-73; Endless entered 15.7-24.0 h; best wave 1142-1169; power at 96 h 11.5-14.8B.
- Check 7 recorded only: engaged ahead of boosted idle by 34.4% wall, 4.3% played.

## Open for the owner and reviewer
1. Check 4 idleboost at 0.81 vs the 0.8 bound (one profile, one hundredth). Options: accept as within noise of a 10-seed median, or ask for a targeted late-game change; no change made.
2. Criterion 7b (15-30% played-hours lead) has not been met in any real-player batch (8.5-11.7%). Either the criterion or the active-play advantage needs a decision.
3. Whether to fast-forward main to the tuning branch. main is frozen at f8c2a81; nothing has been pushed there.

## Next
No game or harness changes were made in this pass. Awaiting decisions on the three items above; no further batches unless asked.
