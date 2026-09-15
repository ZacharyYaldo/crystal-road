STATUS: RELEASED_MEASURED_BRACKETS
RESPONSE_TYPE: LEGALITY_AUDIT_AND_RELEASE
PASS_ID: PASS_48_DRILL_AUDIT_AND_PER_BRACKET_REWARDS
BASED_ON_REVIEW_PASS: REVIEWER_PARTIAL_CLEARANCE_2026-09-15 (zones and Shatter 3-6 approved; Shatter 7-10 not; audit required; per-bracket switches; main conditional on the audit)
BUILD: 20260915-195151
HEAD_COMMIT_SHA: 1499128 (results commit; this handoff is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_47 (its thresholds for zones and Shatter 3-6 stand; its extrapolated Shatter 7-10 values are removed)

# Crystal Road AI Handoff - Pass 48 (legality audit of every calibration state: 200 of 200 legal; Shatter 7 split explained; rewards enabled per bracket for zones and Shatter 3-6; Shatter 7-10 calibration pending; main fast-forwarded on the reviewer's condition)

REVIEWER_DECISIONS APPLIED: approved thresholds for all nine zone brackets and Shatter 3-6 and the cumulative rewards (14.6M gold, 37.6K ore, 21 dust at median income); Shatter 7-10 targets and rewards not approved; invariant audit of the Shatter states; no extrapolated target displayed ("Calibration pending - records only, no rewards"); rewards enabled per bracket, never by a global switch, Shatter 7-10 explicitly off and covered by tests; main cleared once the audit passes and provisional brackets are isolated.

## Legality audit (tests/sim/drill_audit.js, production functions only, states from snapshots_calib, commit c1da532)
Every pre-Shatter state was booted untouched and checked: Shatter count n-1; for Shatters 4-7 the current zone is The Endless Road, reforgeNeedWave() is exactly 100 / 200 / 400 / 800 and the run's best wave meets it; for Shatter 3 the requirement is 0 with the Warlord beaten; canReforge() true; doReforge() moves the count exactly n-1 -> n. Result: AUDIT PASS, 200 of 200 states legal (40 per Shatter 3-7). Every Shatter 7 state sits at best wave exactly 800 (min, median and max 800), so the seventh Shatter was performed the moment the rule allowed it; no harness bypass, no mislabelled snapshot.
Shatter 7 timing: hours to the seventh Shatter 17.1 to 41.4 (median 23.7; per profile casual 24.2, engaged 18.8, idleboost 23.7, light 21.8). The score split is NOT timing: the correlation of log score with hours is -0.02, and the ten states before 20 h have the same median as the thirty after (1.18B vs 1.09B). The split is gear: the top scorers (8.7B to 11.7B) hold a rank-4 (Legendary) equipped item, the rest (0.9B to 1.2B) top out at rank 3. Rank 4 is 2.2x the stats of rank 3 and raises the level cap from 80 to 100, about a 9x score jump, and the rank-4 ascension (200M ore, allowed from three Shatters) is what some runs had afforded by their seventh Shatter and others not. Shatter 7 therefore stays provisional under the safeguard (P90 8.4x the median); the distribution should settle once rank-4 gear is universal, which a later bracket or a larger sample can confirm.

## Release rules (source/game.js)
- DRILL.rewards: per-bracket switches; zone brackets 0-8 true, Shatter 3-6 true, Shatter 7-10 false. No global switch exists.
- DRILL.targets holds measured Crystal values only: zones 656 / 3.63K / 7.68K / 14.4K / 35.9K / 64.5K / 130K / 251K / 657K; Shatter 3 334K, 4 3.19M, 5 11.3M, 6 85.5M. Shatter 7-10 have no target: the drill screen shows "Records only", the training sheet and the results overlay show "Calibration pending - records only, no rewards", no tier is computed, nothing is paid.
- Tests (tests/contract/drill.test.js, 65 assertions): a calibrated bracket with its switch off shows its tier and pays nothing; Shatter 8 has no target, no tier, no reward; every zone and Shatter 3-6 on, Shatter 7-10 off and untargeted; a bracket pays only when it has both a measured target and its own switch, and never without them.

## State of the branches
- ai-tuning-loop and main both at 1499128 (the reviewer's condition met: audit passed, provisional brackets isolated). Pages serves build 20260915-195151.
- Reward table: node tests/sim/drill_totals.js; audit: node tests/sim/drill_audit.js --dir snapshots_calib --from 3 --to 7.

## Open
- Shatter 7-10: calibration pending; re-measure when a bracket's P90 is within 2x of its median, which needs rank-4 gear to be universal at the state.
- Pass 45 balance candidates are live with the drill (they were pushed at the human's earlier request); their bounded-growth batches remain to be run when the human asks.
