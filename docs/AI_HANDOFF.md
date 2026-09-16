STATUS: CANDIDATE_ON_TUNING_BRANCH
RESPONSE_TYPE: DRILL_VALIDATION_AND_CRITERIA_UPDATE
PASS_ID: PASS_50_DRILL_SCALAR
BASED_ON_REVIEW_PASS: REVIEWER_VERDICT_2026-09-16 (pass 49 accepted on pacing, Endless, 1T and offline; criteria 4 and 7 restated; drill targets to scale by a Shatter combat scalar; 4x confinement to be confirmed)
BUILD: not built for main (the scalar is on ai-tuning-loop only; main stays at f8c2a81)
HEAD_COMMIT_SHA: see the commit carrying this document on ai-tuning-loop
PULL_REQUEST: #2
SUPERSEDES: PASS_49 (results stand; this pass adds the drill breakdown, the criteria update and the scalar validation)

# Crystal Road AI Handoff - Pass 50 (drill telemetry by bracket, Shatter count and attempt order; acceptance criteria 4 and 7 restated; the Shatter combat scalar validated on a short batch; 4x confinement confirmed)

## Acceptance criteria as restated (tests/sim/bounded.js)
- 4: the final 24 h gains no more than 80% of the previous 24 h in log power growth (was 60%). Pass 49 2x now PASSES every profile (0.62 to 0.77); 4x already passed.
- 7a (2x only): engaged enters Endless 5-12% earlier than boosted idle in wall hours. Pass 49 2x: 10.5% PASS.
- 7b (2x only): 15-30% earlier in played hours. Hourly rows now carry `played` under a schedule (older batches: --schedule "2:2,2:8,2:8" converts). Pass 49 2x: 11.7% (7.9 vs 9.0 played h) FAIL, just under the floor.
- At 4x both are recorded only (35% wall and played), an upper bound, not a blocker.
- Check 3 (gear cap) stays informational.

## 4x confinement (batch_out_p49x4, engaged seed 81, checked from the purchase log)
12 boost purchases, all at play-session starts (h 0, 4, 14, 24, 28, 38, ...), none inside an offline block, zero boost-hours spilling into offline. offlineGains has no speed term: every 8 h break paid the same 709 fights regardless of speed. The bot never runs frames while offline, so it cannot buy anything there.

## Drill telemetry (tests/sim/bot.js records every drill: bracket, Shatter count, attempt index within the Shatter cycle, tier, score, Crystal target, hero level, payout)
Short batches: 2x, light/casual/engaged, seeds 81-86, 48 wall h (12 played), schedule 2:2,2:8,2:8, drills/double/boosts/clericBack. "First attempt" = the first drill of that bracket in that Shatter cycle.

| slice | baseline (pass 49 targets): drills, Crystal %, Gold+ %, median score/Crystal | with the scalar: drills, Crystal %, Gold+ %, median score/Crystal |
|---|---|---|
| all drills | 543, 59%, 86%, 1.52 | 583, 36%, 65%, 0.50 |
| first attempt in the cycle | 470, 56%, 83%, 1.46 | 470, 33%, 60%, 0.42 |
| later attempts | 73, 74%, 100%, 1.71 | 113, 48%, 84%, 0.97 |
| 0 Shatters, first attempt | 63, 5%, 41%, 0.16 | 63, 5%, 41%, 0.16 (unchanged, scalar = 1) |
| 3 Shatters, first attempt | 169, 50%, 88%, 1.02 | 171, 25%, 46%, 0.21 |
| 5 Shatters, first attempt | 140, 94%, 100%, 11.9 | 121, 62%, 91%, 2.04 |
| zone 0 after a Shatter, first attempt | 36, 100%, 100%, 401x | 36, 100%, 100%, 73x |
| zone 4 after a Shatter, first attempt | 50, 54%, 72%, 1.02 | 51, 29%, 43%, 0.24 |
| zone 8 after a Shatter, first attempt | 31, 35%, 90%, 0.45 | 31, 0%, 35%, 0.11 |
| Endless brackets | 27, 52%, 100%, 1.01 | 28, 0%, 43%, 0.15 |
| drill dust share of all dust (48 h) | 6% (16.7 vs 241 per run) | 3% (8.1 vs 232 per run) |
Correction to pass 49: the drill share of dust over 96 h is 13% (63 drill dust vs 402 Shatter dust per run at 2x, 61 vs 410 at 4x), not the 25% stated there; it was already under the 15-20% goal.

Against the reviewer's targets: all attempts 36% (goal 35-50: met); first attempt 33% (goal 15-25: high); dust share 3% (goal 15-20: low); and the distribution is wrong-shaped: zone 0 and 1 are still automatic Crystals after any Shatter while zones 7-8 and every Endless bracket fell to 0% Crystal.

## Why the scalar cannot do it alone
The scalar (source/game.js shatterCombatScalar: flat +10% gear stat per Shatter, Sharpened Fate, Attuned, Crystal Edge, Remembered Strength; 3.4x at 3 Shatters with typical ranks, 6.1x at 5) covers the permanent Shatter bonuses as asked. The dominant term in re-drilled early brackets is neither of those: the party keeps its gear through a Shatter and drills Greenhollow at level 73-84 with Foundry-grade weapons (baseline: 1.4M damage against a 6.8K target at 3 Shatters, 7-11M against 11.4K at 5). No multiplier of permanent bonuses reaches 70-400x for zone 0 without pushing zones 7-8 and Endless past reach, which is what the validation shows.

## Proposals (one line from the owner picks one; none is built)
A. Personal-best targets for repeats: after a bracket has ever been drilled, Crystal = max(formula, 1.1 x the best score in that bracket so far); Bronze/Silver/Gold as fractions of that. Re-earning after a Shatter then means beating last cycle's record by 10%, which scales with whatever the party actually brings (gear, levels, taps) and needs no gear term in the formula. Expected: first attempt after a Shatter rarely Crystal (the party starts at its Shatter level), later attempts in the cycle 35-50% as the party overtakes its record, dust share rises back toward 13% and can be tuned with the 1.1.
B. Tier-pinned targets: every zone bracket's target uses the pool HP of the deepest zone unlocked this run (the dummy keeps the zone's defence). Fixes the Foundry-gear-in-Greenhollow case once deeper zones open, but not the first hours after a Shatter, when only Greenhollow is open and the kept gear still crushes it.
C. Keep the scalar and lower crystalPerHp for deep brackets only (a per-kind K): meets the overall rate but leaves zone 0-1 automatic.
The developer recommends A, with the scalar removed (A does not need it), and would validate it with the same short batch.

## State
- ai-tuning-loop carries: the restated criteria, the played-hours axis and per-drill telemetry (harness, opt-in; equivalence gate exact PASS), and the scalar in the game (candidate). main is NOT fast-forwarded: the scalar makes Endless and late-zone Crystals unreachable and should not go live as is.
- Batches: batch_out_d50base and batch_out_d50scalar (manifests d50base.json, d50scalar.json).
