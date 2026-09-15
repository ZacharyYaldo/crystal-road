STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: FEATURE_REWRITTEN_CALIBRATED_CLAIMS_DISABLED
PASS_ID: PASS_47_TRAINING_DRILL_UNIFIED
BASED_ON_REVIEW_PASS: REVIEWER_CALIBRATION_CORRECTIONS_2026-09-15 (one post-Shatter state per run, ratio tiers on the measured Crystal, outlier safeguard, frozen build, explicit eligibility)
BUILD: 20260915-194152
HEAD_COMMIT_SHA: b1233faf3aa7ccf26c21da68396bf2b68df862e2
RESULTS_COMMIT: b1233faf3aa7ccf26c21da68396bf2b68df862e2 (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_46 (the practice drill and the Challenge are gone; one Training Drill replaces both; every earlier threshold is discarded)

# Crystal Road AI Handoff - Pass 47 (Training Drill: one live selected-hero activity on its own screen; Crystal = P90 of one legal state per run per bracket, lower tiers at 25 / 50 / 75%; the five review items; claims disabled; main not touched)

HUMAN_DECISIONS (2026-09-15, final): one activity, the Training Drill; the player selects one unlocked hero; the hero attacks and Auto-Casts automatically; no manual ability buttons; the player taps the dummy live; at most three scoring taps a second, extra taps animate only; fixed drill RNG; thirty seconds at 1x; bracket defense applies; score = hero damage + qualifying tap damage; temporary road effects excluded; calibration at exactly two taps a second; per-bracket five-best board with hero, total, hero damage, tap damage; rewards count the complete live score; the road keeps farming underneath and is not restored afterwards; drill inputs never touch the road RNG or combat; dummy taps never trigger attention.
REVIEWER CORRECTIONS (all applied): offline earnings keep their existing behaviour (separate path; any change needs separate approval); Shatter dust 1 at Gold and 3 at Crystal; sample sizes stated as runs = profiles x seeds with the profile distribution and per-profile medians; one state per run per Shatter bracket, the state immediately after the production Shatter function, scored against the bracket's Endless defense, at most 40 per bracket, Shatter n measured only when at least 30 runs legally performed it; tiers: Crystal = measured P90, Bronze / Silver / Gold at 25 / 50 / 75% of it (the literal percentiles were too narrow on the corrected distributions), Overdrive 125% of Crystal badge only; any bracket with P90 above 2x its median stays provisional; offline tests over all nine Road zones plus Endless with boundary cases; separate provenance for the snapshot-generating and scoring commits; isolation on completion, abandonment, reload and exceptions with the road RNG unchanged; the selected hero's permanent build is copied when the drill starts.

## 1. Thresholds and cumulative reward values
Zone brackets (state at the zone's first boss attempt, one per run; 4 profiles x 10 seeds):
- Greenhollow: n=40 (idleboost 10: 610, light 10: 603, casual 10: 584, engaged 10: 571); median 590, P90 656 (P90/median 1.11); Crystal in the game 656; Bronze / Silver / Gold 164 / 328 / 492; Overdrive 820; defense 6; measured
- Stillwater: n=40 (idleboost 10: 3.0K, light 10: 2.9K, casual 10: 3.1K, engaged 10: 3.0K); median 3.0K, P90 3.6K (P90/median 1.22); Crystal in the game 3.6K; Bronze / Silver / Gold 908 / 1.8K / 2.7K; Overdrive 4.5K; defense 24; measured
- Thornwood: n=40 (idleboost 10: 6.3K, light 10: 5.9K, casual 10: 6.4K, engaged 10: 6.6K); median 6.4K, P90 7.7K (P90/median 1.21); Crystal in the game 7.7K; Bronze / Silver / Gold 1.9K / 3.8K / 5.8K; Overdrive 9.6K; defense 55; measured
- Ironvein: n=40 (idleboost 10: 11.8K, light 10: 12.0K, casual 10: 11.7K, engaged 10: 11.7K); median 12.0K, P90 14.4K (P90/median 1.20); Crystal in the game 14.4K; Bronze / Silver / Gold 3.6K / 7.2K / 10.8K; Overdrive 18.0K; defense 128; measured
- Emberwaste: n=40 (idleboost 10: 30.3K, light 10: 30.5K, casual 10: 26.7K, engaged 10: 26.5K); median 27.9K, P90 35.9K (P90/median 1.29); Crystal in the game 35.9K; Bronze / Silver / Gold 9.0K / 17.9K / 26.9K; Overdrive 44.9K; defense 207; measured
- Amberfall: n=40 (idleboost 10: 54.2K, light 10: 54.4K, casual 10: 48.7K, engaged 10: 46.0K); median 49.6K, P90 64.5K (P90/median 1.30); Crystal in the game 64.5K; Bronze / Silver / Gold 16.1K / 32.2K / 48.4K; Overdrive 80.6K; defense 259; measured
- Ashen Approach: n=40 (idleboost 10: 99.7K, light 10: 99.3K, casual 10: 92.5K, engaged 10: 87.9K); median 93.0K, P90 129.8K (P90/median 1.40); Crystal in the game 130.0K; Bronze / Silver / Gold 32.5K / 65.0K / 97.5K; Overdrive 162.5K; defense 686; measured
- Ashen Keep: n=40 (idleboost 10: 216.0K, light 10: 207.9K, casual 10: 176.6K, engaged 10: 165.1K); median 187.1K, P90 251.2K (P90/median 1.34); Crystal in the game 251.0K; Bronze / Silver / Gold 62.8K / 125.5K / 188.2K; Overdrive 313.8K; defense 1256; measured
- Foundry: n=40 (idleboost 10: 427.7K, light 10: 565.2K, casual 10: 474.8K, engaged 10: 428.2K); median 441.2K, P90 657.3K (P90/median 1.49); Crystal in the game 657.0K; Bronze / Silver / Gold 164.2K / 328.5K / 492.8K; Overdrive 821.2K; defense 2795; measured
Bundles, cumulative, paid as the difference from the highest tier already claimed in the bracket, in minutes of the bracket's permanent income rate (incomeRate): zone Bronze 3 min gold; Silver 7 min gold; Gold 12 min gold + 2 min ore; Crystal 20 min gold + 5 min ore; zone dust none for Greenhollow-Thornwood, 1 at Crystal for Ironvein-Amberfall, 1 at Gold and 2 at Crystal for Ashen Approach-Foundry (9 in total). Shatter Bronze 3 min gold; Silver 7 min gold + 1 min ore; Gold 12 min gold + 2 min ore + 1 dust; Crystal 20 min gold + 5 min ore + 3 dust. Exact amounts per bracket at median income: node tests/sim/drill_totals.js.

## 2. Shatter calibration (one legal post-Shatter state per run, through doReforge, scored against the bracket's Endless defense)
- Shatters 3: n=40 (idleboost 10: 239.1K, light 10: 240.6K, casual 10: 240.9K, engaged 10: 222.2K); median 225.7K, P90 334.4K (P90/median 1.48); Crystal in the game 334.0K; Bronze / Silver / Gold 83.5K / 167.0K / 250.5K; Overdrive 417.5K; defense 2650; measured
- Shatters 4: n=40 (idleboost 10: 2.38M, light 10: 2.56M, casual 10: 2.43M, engaged 10: 2.43M); median 2.44M, P90 3.19M (P90/median 1.30); Crystal in the game 3.19M; Bronze / Silver / Gold 797.5K / 1.59M / 2.39M; Overdrive 3.99M; defense 2915; measured
- Shatters 5: n=40 (idleboost 10: 9.11M, light 10: 9.73M, casual 10: 8.84M, engaged 10: 10.07M); median 9.35M, P90 11.34M (P90/median 1.21); Crystal in the game 11.30M; Bronze / Silver / Gold 2.83M / 5.65M / 8.47M; Overdrive 14.12M; defense 3207; measured
- Shatters 6: n=40 (idleboost 10: 62.03M, light 10: 73.40M, casual 10: 64.62M, engaged 10: 66.54M); median 64.62M, P90 85.48M (P90/median 1.32); Crystal in the game 85.50M; Bronze / Silver / Gold 21.38M / 42.75M / 64.12M; Overdrive 106.88M; defense 3527; measured
- Shatters 7: n=40 (idleboost 10: 1.12B, light 10: 1.07B, casual 10: 1.11B, engaged 10: 1.21B); median 1.14B, P90 9.57B (P90/median 8.39); Crystal in the game 543.00M; Bronze / Silver / Gold 135.75M / 271.50M / 407.25M; Overdrive 678.75M; defense 3881; PROVISIONAL: P90 is 8.4x the median, above the 2x safeguard (outlier-driven), investigate
- Shatters 8: no runs performed Shatter 8 within 48 h; provisional Crystal 3.45B (previous x6.35), pays nothing
- Shatters 9: no runs performed Shatter 9 within 48 h; provisional Crystal 21.90B (previous x6.35), pays nothing
- Shatters 10: no runs performed Shatter 10 within 48 h; provisional Crystal 139.00B (previous x6.35), pays nothing
Measured brackets: 3, 4, 5, 6; every other Shatter bracket is provisional (extrapolated at the measured growth) and pays nothing. Bracket 7 stays provisional under the safeguard: its 40 legal post-Shatter states split into two populations (runs that Shattered at about 15 h and runs that first had to reach wave 800 at about 24 h), which puts the P90 far above the median; the in-game provisional value is the growth extrapolation and pays nothing. Brackets 8-10 are intentionally provisional and reward-disabled; the 96 h batch was stopped at the human's instruction (20 of 40 runs, no manifest, nothing scored from it).

## 3. Offline income parity
offlineGains() is the previous code verbatim. The contract test compares it with the previous formula over all ten zones x four progress points x two Shatter counts x two tree levels x omen on/off x oath on/off x eight offline durations chosen on, just below and just above an integer fight count (5,120 cases): zero mismatches on fights, gold, XP and ore. incomeRate() is the separate permanent-only rate for rewards; incomeRate x farmed minutes equals offline earnings whenever no temporary modifier is active, and incomeRate ignores attention, omens and oaths.

## 4. Isolation and claim safety (tests/contract/drill.test.js, 52 assertions, all passing)
Determinism; score = hero + tap damage; fresh copy with full HP, zero charge, zero attack timer, no status; road combat state, omens, oath, attention, road speed and the Auto-Cast boost do not change the score; lower brackets selectable; three taps a second all score, ten a second score three with the rest animating and adding no damage; dummy taps never start attention or count as road taps; the drill draws nothing from the road generator; the road fights its own battles during a drill; Stop returns to the castle with nothing recorded, paid or drawn; reload drops a running drill, draws the same numbers with or without one and leaves records identical; an exception inside a drill tick leaves the road context restored; per-bracket five-best with hero, total, hero and tap damage; Gold then Crystal claims paying only the difference; repeating pays nothing; a weaker attempt cannot reset the claim; provisional brackets pay nothing; records, claims and badges survive a reload; the frozen build: tree ranks, levels, ability ranks and structures gained mid-drill leave the score unchanged while the road keeps them. Road equivalence: bot results before and after the rewrite identical (RNG-call counts and canonical hashes, idleboost and engaged, 3 h, seed 900, 2x).

## 5. Totals for clearing every measured bracket at Crystal (median income rates)
bench drill_calib.json: selected best hero, live drill rules, 2 scripted taps/s, one post-Shatter state per run per Shatter bracket, first boss attempt per zone bracket; states from calib (commit c1da5321f7, game 98f504fa062d03bd), scored with commit 43a3e29736 game f0ecc76bb987a70f
bench drill_shatters_calib.json: selected best hero, live drill rules, 2 scripted taps/s; states from calib (commit c1da5321f7, game 98f504fa062d03bd), scored with commit fb577f9185 game 38b14491967ab25f

== zone brackets (Crystal = P90 of the production drill at the first boss attempt of the zone, best roster hero, two taps a second; Bronze / Silver / Gold at 25 / 50 / 75%; bundles cumulative)
Greenhollow Fields                 sample 40 runs (idleboost 10: median 610, light 10: median 603, casual 10: median 584, engaged 10: median 571); median 590, P90 656 (P90/median 1.11); defense 6; rate 254 gold/min, 6 ore/min
    Bronze 164: 762 gold
    Silver 328: 1.8K gold
    Gold 492: 3.0K gold + 12 ore
    Crystal 656: 5.1K gold + 29 ore
    Overdrive 820: badge
Stillwater Lagoon                  sample 40 runs (idleboost 10: median 3.0K, light 10: median 2.9K, casual 10: median 3.1K, engaged 10: median 3.0K); median 3.0K, P90 3.6K (P90/median 1.22); defense 24; rate 725 gold/min, 17 ore/min
    Bronze 908: 2.2K gold
    Silver 1.8K: 5.1K gold
    Gold 2.7K: 8.7K gold + 33 ore
    Crystal 3.6K: 14.5K gold + 83 ore
    Overdrive 4.5K: badge
Thornwood                          sample 40 runs (idleboost 10: median 6.3K, light 10: median 5.9K, casual 10: median 6.4K, engaged 10: median 6.6K); median 6.4K, P90 7.7K (P90/median 1.21); defense 55; rate 1.2K gold/min, 27 ore/min
    Bronze 1.9K: 3.6K gold
    Silver 3.8K: 8.4K gold
    Gold 5.8K: 14.3K gold + 54 ore
    Crystal 7.7K: 23.9K gold + 136 ore
    Overdrive 9.6K: badge
Ironvein Caverns                   sample 40 runs (idleboost 10: median 11.8K, light 10: median 12.0K, casual 10: median 11.7K, engaged 10: median 11.7K); median 12.0K, P90 14.4K (P90/median 1.20); defense 128; rate 2.5K gold/min, 55 ore/min
    Bronze 3.6K: 7.5K gold
    Silver 7.2K: 17.4K gold
    Gold 10.8K: 29.8K gold + 111 ore
    Crystal 14.4K: 49.7K gold + 276 ore + 1 dust
    Overdrive 18.0K: badge
Emberwaste                         sample 40 runs (idleboost 10: median 30.3K, light 10: median 30.5K, casual 10: median 26.7K, engaged 10: median 26.5K); median 27.9K, P90 35.9K (P90/median 1.29); defense 207; rate 6.1K gold/min, 111 ore/min
    Bronze 9.0K: 18.2K gold
    Silver 17.9K: 42.6K gold
    Gold 26.9K: 73.0K gold + 222 ore
    Crystal 35.9K: 121.6K gold + 555 ore + 1 dust
    Overdrive 44.9K: badge
Amberfall Woods                    sample 40 runs (idleboost 10: median 54.2K, light 10: median 54.4K, casual 10: median 48.7K, engaged 10: median 46.0K); median 49.6K, P90 64.5K (P90/median 1.30); defense 259; rate 10.1K gold/min, 168 ore/min
    Bronze 16.1K: 30.3K gold
    Silver 32.3K: 70.6K gold
    Gold 48.4K: 121.0K gold + 336 ore
    Crystal 64.5K: 201.7K gold + 840 ore + 1 dust
    Overdrive 80.6K: badge
Ashen Approach                     sample 40 runs (idleboost 10: median 99.7K, light 10: median 99.3K, casual 10: median 92.5K, engaged 10: median 87.9K); median 93.0K, P90 129.8K (P90/median 1.40); defense 686; rate 24.2K gold/min, 311 ore/min
    Bronze 32.5K: 72.6K gold
    Silver 65.0K: 169.3K gold
    Gold 97.5K: 290.3K gold + 623 ore + 1 dust
    Crystal 130.0K: 483.8K gold + 1.6K ore + 2 dust
    Overdrive 162.5K: badge
Ashen Keep                         sample 40 runs (idleboost 10: median 216.0K, light 10: median 207.9K, casual 10: median 176.6K, engaged 10: median 165.1K); median 187.1K, P90 251.2K (P90/median 1.34); defense 1256; rate 41.3K gold/min, 537 ore/min
    Bronze 62.8K: 123.8K gold
    Silver 125.5K: 288.9K gold
    Gold 188.3K: 495.2K gold + 1.1K ore + 1 dust
    Crystal 251.0K: 825.4K gold + 2.7K ore + 2 dust
    Overdrive 313.8K: badge
The Foundry                        sample 40 runs (idleboost 10: median 427.7K, light 10: median 565.2K, casual 10: median 474.8K, engaged 10: median 428.2K); median 441.2K, P90 657.3K (P90/median 1.49); defense 2795; rate 105.4K gold/min, 1.0K ore/min
    Bronze 164.3K: 316.1K gold
    Silver 328.5K: 737.6K gold
    Gold 492.8K: 1.26M gold + 2.0K ore + 1 dust
    Crystal 657.0K: 2.11M gold + 5.0K ore + 2 dust
    Overdrive 821.3K: badge

== Shatter brackets (one legal post-Shatter state per run, scored against the bracket Endless defense; measured only with at least 30 runs)
Shatters 3                         sample 40 runs (idleboost 10: median 239.1K, light 10: median 240.6K, casual 10: median 240.9K, engaged 10: median 222.2K); median 225.7K, P90 334.4K (P90/median 1.48); defense 2650; rate 68.8K gold/min, 693 ore/min
    Bronze 83.5K: 206.4K gold
    Silver 167.0K: 481.5K gold + 693 ore
    Gold 250.5K: 825.4K gold + 1.4K ore + 1 dust
    Crystal 334.0K: 1.38M gold + 3.5K ore + 3 dust
    Overdrive 417.5K: badge
Shatters 4                         sample 40 runs (idleboost 10: median 2.38M, light 10: median 2.56M, casual 10: median 2.43M, engaged 10: median 2.43M); median 2.44M, P90 3.19M (P90/median 1.30); defense 2915; rate 109.9K gold/min, 1.1K ore/min
    Bronze 797.5K: 329.7K gold
    Silver 1.59M: 769.3K gold + 1.1K ore
    Gold 2.39M: 1.32M gold + 2.2K ore + 1 dust
    Crystal 3.19M: 2.20M gold + 5.6K ore + 3 dust
    Overdrive 3.99M: badge
Shatters 5                         sample 40 runs (idleboost 10: median 9.11M, light 10: median 9.73M, casual 10: median 8.84M, engaged 10: median 10.07M); median 9.35M, P90 11.34M (P90/median 1.21); defense 3207; rate 152.8K gold/min, 1.5K ore/min
    Bronze 2.83M: 458.3K gold
    Silver 5.65M: 1.07M gold + 1.5K ore
    Gold 8.47M: 1.83M gold + 3.0K ore + 1 dust
    Crystal 11.30M: 3.06M gold + 7.4K ore + 3 dust
    Overdrive 14.13M: badge
Shatters 6                         sample 40 runs (idleboost 10: median 62.03M, light 10: median 73.40M, casual 10: median 64.62M, engaged 10: median 66.54M); median 64.62M, P90 85.48M (P90/median 1.32); defense 3527; rate 208.7K gold/min, 2.0K ore/min
    Bronze 21.38M: 626.0K gold
    Silver 42.75M: 1.46M gold + 2.0K ore
    Gold 64.13M: 2.50M gold + 4.0K ore + 1 dust
    Crystal 85.50M: 4.17M gold + 9.9K ore + 3 dust
    Overdrive 106.88M: badge
Shatters 7 (provisional, no reward) sample 40 runs (idleboost 10: median 1.12B, light 10: median 1.07B, casual 10: median 1.11B, engaged 10: median 1.21B); median 1.14B, P90 9.57B (P90/median 8.39, ABOVE 2: outlier-driven, kept provisional); defense 3881; rate 286.9K gold/min, 2.9K ore/min
    Bronze 135.75M: 860.8K gold
    Silver 271.50M: 2.01M gold + 2.9K ore
    Gold 407.25M: 3.44M gold + 5.9K ore + 1 dust
    Crystal 543.00M: 5.74M gold + 14.7K ore + 3 dust
    Overdrive 678.75M: badge
Shatters 8 (provisional, no reward) sample none; median -, P90 -; defense -; rate 0 gold/min, 0 ore/min
    Bronze 862.50M: 0 gold
    Silver 1.73B: 0 gold + 0 ore
    Gold 2.59B: 0 gold + 0 ore + 1 dust
    Crystal 3.45B: 0 gold + 0 ore + 3 dust
    Overdrive 4.31B: badge
Shatters 9 (provisional, no reward) sample none; median -, P90 -; defense -; rate 0 gold/min, 0 ore/min
    Bronze 5.47B: 0 gold
    Silver 10.95B: 0 gold + 0 ore
    Gold 16.43B: 0 gold + 0 ore + 1 dust
    Crystal 21.90B: 0 gold + 0 ore + 3 dust
    Overdrive 27.38B: badge
Shatters 10 (provisional, no reward) sample none; median -, P90 -; defense -; rate 0 gold/min, 0 ore/min
    Bronze 34.75B: 0 gold
    Silver 69.50B: 0 gold + 0 ore
    Gold 104.25B: 0 gold + 0 ore + 1 dust
    Crystal 139.00B: 0 gold + 0 ore + 3 dust
    Overdrive 173.75B: badge

== grand total for clearing every measured bracket at Crystal (median income rates): 14.64M gold, 37.6K ore, 21 dust


## Provenance
- drill_calib.json: states from calib (commit c1da5321f7, game 98f504fa062d03bd), scored with commit 43a3e29736, game f0ecc76bb987a70f
- The 96 h batch calib96 was stopped before completion and is not used.

## Open
- Claims: DRILL.claims=false until the reviewer clears this table.
- Only the tuning branch is fast-forwarded; main stays at 91cbcb7 (which still carries the old Challenge UI) until the table is reviewed.
- Pass 45 balance candidates still untested (pre-run checklist in pass 45).
