STATUS: RESULTS_FOR_REVIEW
RESPONSE_TYPE: BALANCE_BATCH_REAL_PLAYER_MODEL
PASS_ID: PASS_49_REAL_PLAYER_BATCH
BASED_ON_REVIEW_PASS: HUMAN_DIRECTION_2026-09-16 (run the sims with a real-player schedule; Sera in the back; drills attempted; warp, chest and ad double used)
BUILD: 20260916-154148
HEAD_COMMIT_SHA: dfe4c9a (results commit; this handoff is committed on top with the batch manifests)
PULL_REQUEST: #2
SUPERSEDES: PASS_48 (the pass 45 numbers were never batch-tested; this is the first batch on the 2026-09-16 build)

# Crystal Road AI Handoff - Pass 49 (first batch of the 2026-09-16 build under the real-player model: 2x and continuous 4x, seeds 81-90, four profiles, 96 wall hours of which 24 are played)

## What the build contains that no batch had seen (all owner-directed, 2026-09-16)
Prospecting 1.85 per rank; Momentum twenty-fold per rank; Vael mine 3.5 ore and market 14 gold per villager-level-hour; item level cap and flat ascension REVERTED (unlimited levels, ascension 40/160/500/1000 ore x 1.14^level); victory pause 1.1 s; the rest heal after a fight no longer revives (Sanctuary does); Mending 3%; enemies per Shatter HP and ATK x1.3, DEF x1.2, flat; Training Drill rebuilt (brackets = zones unlocked this run plus Endless 1/100/300/500 and every 200 waves reached this run; targets from the bracket's own enemy pool: Crystal 18 x pool HP, Gold 4.5x, Silver 2.7x, Bronze 1.35x, rounded to end in 0; bundles 3/7/15+5/45+20 minutes of the bracket's income; every claim resets on a Shatter); Active bonus only from enemy taps.

## The real-player model (tests/sim/bot.js, all opt-in; equiv gate EXACT PASS 24/24 pairs against the previous harness with the options off)
- Schedule 2:2,2:8,2:8 (hours played : hours away), cycling: 24 played hours in 96 wall hours. An offline block is a clock jump; the production offlineReport pays it (its own cap of 8 h plus the offline node and the shrine, at the Auto-Cast efficiency), then the ad double is claimed (--double), as the human said to assume.
- --boosts: the daily time warp and daily chest are used whenever ready during active minutes (production useWarp / openDailyChest, the same functions the sheet calls now).
- --drills: one Training Drill per open bracket per play session, the hardest-hitting hero, taps at the profile rate, road taps suspended while the dummy is being tapped. idleboost never drills (no active minutes).
- --clericBack: the Cleric is moved to the last party slot whenever the party changes (the front hero, index 0, draws 60% of enemy targeting).
- Profiles unchanged: idleboost (0 min/h, boost), light (5 min/h, 1 tap/s), casual (10, 1.5), engaged (15, 2). 2x toggle; 4x = the timed boost rebought whenever it lapses.

## Results (medians over seeds 81-90; batch_out_p49x2 and batch_out_p49x4, manifests tests/sim/manifests/p49x2.json and p49x4.json)
| metric | idleboost 2x | light 2x | casual 2x | engaged 2x | idleboost 4x | light 4x | casual 4x | engaged 4x |
|---|---|---|---|---|---|---|---|---|
| Shatters at 96 h | 7 | 7 | 7 | 7 | 7 | 7 | 7 | 7 |
| Shatter 1 / 3 / 5 (wall h) | 4.6 / 24 / 38.5 | 4.2 / 24 / 30.0 | 4.1 / 24 / 38.0 | 4.1 / 24 / 29.4 | 1.7 / 14 / 24.9 | 1.5 / 14 / 24.3 | 1.5 / 14 / 24.3 | 1.5 / 14 / 24.2 |
| Endless entered (wall h) | 29.0 | 28.0 | 28.1 | 25.9 | 24.0 | 15.6 | 15.5 | 15.6 |
| best Endless wave | 898 | 1007 | 1016 | 1040 | 1127 | 1163 | 1147 | 1184 |
| party level at 96 h | 226 | 251 | 255 | 259 | 283 | 296 | 296 | 303 |
| power 48 / 72 / 96 h | 16M / 286M / 1.96B | 30M / 436M / 4.09B | 41M / 524M / 4.17B | 38M / 647M / 5.32B | 328M / 2.58B / 9.35B | 593M / 4.81B / 14.2B | 483M / 4.60B / 14.3B | 708M / 5.79B / 17.9B |
| 1T gold reached (runs, median wall h) | 0/10 | 0/10 | 3/10, 87 | 7/10, 87 | 10/10, 76 | 10/10, 72 | 10/10, 72 | 10/10, 63 |
| gold per PLAYED hour | 8.9B | 30B | 34B | 46B | 110B | 181B | 184B | 269B |
| offline reports gold (12 breaks, doubled) vs active earnings | 1.7x | 1.5x | 1.5x | 1.4x | 1.2x | 1.0x | 1.0x | 1.0x |
| drills run / paid per run | 0 | 63 / 61 | 64 / 63 | 63 / 61 | 0 | 59 / 55 | 57 / 53 | 59 / 54 |
| drill tiers, all runs | - | Crystal 449, Gold 120, Silver 41, Bronze 21, none 8 | Crystal 466, Gold 127, Silver 31, Bronze 26, none 3 | Crystal 464, Gold 114, Silver 35, Bronze 20, none 3 | - | Crystal 422, Gold 105, Silver 26, Bronze 31, none 9 | Crystal 443, Gold 81, Silver 32, Bronze 26, none 6 | Crystal 429, Gold 89, Silver 32, Bronze 21, none 10 |
| drill gold / ore / dust per run | - | 4.2B / 5.8M / 62 | 6.1B / 5.9M / 62 | 6.6B / 5.9M / 61 | - | 14.6B / 13.5M / 58 | 18.2B / 16.9M / 60 | 19.2B / 18.2M / 59 |
| drill gold share of all earnings | - | 0.6% | 0.6% | 0.6% | - | 0.3% | 0.4% | 0.3% |
| warps / chests / doubles per run | 0 / 0 / 12 | 4 / 4 / 12 | 4 / 4 / 12 | 4 / 4 / 12 | 0 / 0 / 12 | 4 / 4 / 12 | 4 / 4 / 12 | 4 / 4 / 12 |
| defeats | 407 | 424 | 449 | 441 | 699 | 766 | 768 | 822 |
| ascensions per run | 32 | 36 | 37 | 34 | 27 | 31 | 32 | 28 |
| item level / rank at 96 h | 86 / 4.0 | 92 / 4.0 | 92 / 4.0 | 94 / 4.0 | 101 / 3.9 | 103 / 3.9 | 103 / 3.8 | 106 / 3.8 |

Bounded-growth checks (tests/sim/bounded.js): 2x FAIL on check 4 in every profile (power growth 72-96 h is 0.62 to 0.77 of the 48-72 h log growth, want <= 0.6) and check 7 (engaged ahead of boosted idle on Endless entry by 10.5%, want 15-30%); checks 1, 2, 5, 6 PASS everywhere, no assertion failures, no softlocks. 4x PASS on 1 to 6 in every profile, FAIL on check 7 (35%). Check 3 (gear cap) is recorded only, the cap is gone.

## Findings
1. Progression pace looks healthy for a real player: 7 Shatters and Endless wave 900 to 1,200 in four days at either speed, no run reaches Shatter 10, no softlocks, every Road boss cleared (Foundry and Ashen Keep loss streaks of 8 to 9 appear in a third of runs before the clear). 1T gold arrives on day four at 2x for the active profiles and on day three at 4x.
2. Check 4 (late deceleration) fails at 2x because the 72-96 h window holds two full play cycles while 48-72 h holds one and a half; under a schedule the check compares unequal amounts of play. Check 7 fails both ways for a related reason: Endless entry is gated by the 2-hour play blocks, so idle and engaged land in the same session at 2x (29.0 vs 25.9 wall h), and at 4x the boost lets engaged enter a full session earlier (15.6 vs 24.0). Both criteria were written for continuous play; the reviewer should restate them in played hours before they gate anything.
3. Offline is the bigger income: the twelve doubled offline reports pay 1.0 to 1.7 times what the 24 played hours earn. That is the ad double plus the 8-hour cap on a real schedule, not a bug; it is worth deciding whether that ratio is intended.
4. The Training Drill pays almost nothing (0.3 to 0.6% of gold) but 58 to 62 dust per run, about a quarter of all dust, because every claim resets on a Shatter and 70% of drills reach Crystal. The targets scale with the Shatter count through the enemy pool (x1.3 per Shatter) while the party's damage compounds faster (dust ranks, gear +10% per Shatter, levels), so from the second run on the zone brackets are a Crystal each. Crystal is therefore not "something to come back for" once a Shatter has happened. Candidate fix for the owner: normalise the drill targets by the same permanent multipliers the party gains from Shatters (the damage blessing and the per-Shatter gear factor), so a bracket demands the same relative effort in every run; or cap drill dust per Shatter.
5. Formation: the Cleric is moved to the back at every recruit (seen in the event log); no measurable effect is isolated here since no run was made without it.

## Open for the owner
- Whether the bounded criteria 4 and 7 are restated in played hours (the developer can add a played-hours axis to the hourly series).
- The drill target normalisation (finding 4) needs a one-line approval before it is built.
- Whether the offline share (finding 3) is intended.

## Provenance
Commit dfe4c9a, game ac0a6c644e3f04ab, harness hashes in the manifests; 40 files per batch, zero errors in the batch logs; the equivalence gate for the harness change: EXACT PASS, 24 pairs, ref 75b4efc.
