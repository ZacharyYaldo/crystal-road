STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: TRIAGE_AND_ONE_PROPOSAL
PASS_ID: PASS_15_WHOLE_ROAD_BOTTLENECK_TRIAGE
BASED_ON_REVIEW_PASS: PASS_15_WHOLE_ROAD_BOTTLENECK_TRIAGE
BUILD: 20260911-122710
HEAD_COMMIT_SHA: a78e43a5a5eb246ea6ed4b2fb2d3a357e20dce44

# Crystal Road AI Handoff - Pass 15 (whole-Road bottleneck triage)

DEVELOPER_POSITION: AGREE with locking Warlord ATK x1.2 and with moving to whole-Road triage. No gameplay code changed in this pass; the Warlord lock stands as committed in e2906ff. CONFIDENCE: HIGH on the ranking (the 24h validation data plus one 48h diagnostic agree, and the top item is far ahead of the rest); HIGH on the mechanism (it is the Ironvein mechanism again, measured the same way); MEDIUM on the proposed value.

## What was used
- Existing telemetry: the pass 14 production arm (Warlord x1.2), 100 runs, 24h, five profiles, `tests/sim/batch_out_p14x`.
- The 24h horizon censors everything past Ironvein for idle and light (idle enters Emberwaste at ~15h and never clears it by 24h; light clears it in 9 of 20 runs at 22h), so the existing data could not rank Emberwaste against Amberfall for the realistic profiles. I used the one allowed quick diagnostic for that: paired seeds 31-40 x idle/light/casual x 48h on the current production build, 30 runs, 0 errors, `tests/sim/batch_out_p15`. Same production values, longer horizon.
- New analysis tool `tests/sim/triage.js` (commit with this handoff): per zone and profile, reach and clear counts, entry level, clear time, non-training hours in zone, boss first-try/attempts/streak/stall, ordinary and boss rewalk hours in zone, and a burden figure = ordinary rewalk + boss rewalk + training triggered by the zone + boss combat time.

## Ranked table, whole measured Road, 48h runs (medians; "enter/clear" are run counts; the 24h validation table is in tests/sim/p14_compare.txt)

=== IDLE  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.4          0.3       0.3     70% n10   1/2         0      0.03    0.03         0             0.06     4.9
Stillwater Lagoon 10/10       6        2.8/3.4          2.1       2.3     40% n10   2/5         1      0.11    1.26         0.08          1.7      18.1
Thornwood         10/10       15       7.9/8.6          3.3       3.7     50% n10   1/3         0      0.02    2.17         0             3.9      20.2
Ironvein Caverns  10/10       29       14.8/15.7        3.8       5.1     40% n10   2/4         1      0.58    2.31         0.09          5        14.9
Emberwaste        10/10       39       27.9/31.2        8         4.1     0% n10    22/29       21     4.49    3.95         1.8           11.79    13
Amberfall Woods   10/10       54       38.5/43.3        6.8       3.6     0% n10    32/64       31     5.24    2.59         2.58          10.12    9.1
Ashen Approach    10/3        65       47.1/48          2.2       0       0% n3     6/9         3      1.79    1.06         0.09          5.63     15.8
Ashen Keep        3/0         72       -                0.9       0       -         -           -      -       0.69         0             0        12.6

=== LIGHT  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.5          0.3       0.3     80% n10   1/2         0      0.03    0.05         0             0.06     9.2
Stillwater Lagoon 10/10       6        2.8/3.1          2.3       2.7     20% n10   2/4         1      0.52    1.26         0.08          1.72     17.1
Thornwood         10/10       15       7.9/9.1          2.8       4       60% n10   1/5         0      0.03    1.58         0             3.75     21.4
Ironvein Caverns  10/10       29       14.1/16.8        2.8       6.7     20% n10   2/5         1      0.61    1.32         0.09          4.86     16.9
Emberwaste        10/10       38       23.1/26.1        3.7       8.4     10% n10   3/7         2      0.59    1.91         0.16          7.83     20.3
Amberfall Woods   10/10       49       32/38            2.5       3.9     50% n10   1/11        0      0.02    1.49         0             7.89     20.3
Ashen Approach    10/9        59       46/47.1          3.2       0       56% n9    1/4         0      0.03    1.13         0             10.54    19.2
Ashen Keep        9/0         71       -                2         0       -         -           -      -       0.95         0             0.87     33.9

=== CASUAL  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.4          0.3       0.4     60% n10   1/2         0      0.03    0            0             0.04     4.6
Stillwater Lagoon 10/10       6        2.9/3.4          2.1       2.6     30% n10   2/4         1      0.38    1.12         0.08          1.7      19
Thornwood         10/10       15       6.9/7.1          2.3       3.9     70% n10   1/2         0      0.02    1.15         0             2.84     22.4
Ironvein Caverns  10/10       27       11.1/13.2        1.9       7.7     70% n10   1/3         0      0.02    0.76         0             3.13     20.8
Emberwaste        10/10       35       18.1/21.2        2.3       7.4     40% n10   3/4         2      1.92    1.05         0.16          5        23.5
Amberfall Woods   10/10       45       25.1/32          1.9       3.1     40% n10   2/5         1      1.01    1.02         0.08          6.18     26.3
Ashen Approach    10/10       54       41/44.1          3.2       0       60% n10   1/3         0      0.02    1.43         0             10.95    23.1
Ashen Keep        10/0        70       -                6.9       0       -         -/-         2      -       1.13         0             1.13     54.5

=== RANK by median burden hours (ordinary rewalk + boss rewalk + training for the zone + boss combat), realistic profiles, zones cleared by >=10 runs
idle Emberwaste             burden 11.79h  (train-for-zone 5.62 train-in-zone 4.11 ord-rewalk 3.95 boss-rewalk 1.8)  hours-in-zone 8  boss 1st 0% att 22/29 stall 4.49  cleared 10/10
casual Ashen Approach       burden 10.95h  (train-for-zone 9.2 train-in-zone 0 ord-rewalk 1.43 boss-rewalk 0)  hours-in-zone 3.2  boss 1st 60% att 1/3 stall 0.02  cleared 10/10
idle Amberfall Woods        burden 10.12h  (train-for-zone 4.03 train-in-zone 3.62 ord-rewalk 2.59 boss-rewalk 2.58)  hours-in-zone 6.8  boss 1st 0% att 32/64 stall 5.24  cleared 10/10
light Amberfall Woods       burden 7.89h  (train-for-zone 6 train-in-zone 3.87 ord-rewalk 1.49 boss-rewalk 0)  hours-in-zone 2.5  boss 1st 50% att 1/11 stall 0.02  cleared 10/10
light Emberwaste            burden 7.83h  (train-for-zone 5.33 train-in-zone 8.37 ord-rewalk 1.91 boss-rewalk 0.16)  hours-in-zone 3.7  boss 1st 10% att 3/7 stall 0.59  cleared 10/10
casual Amberfall Woods      burden 6.18h  (train-for-zone 4.71 train-in-zone 3.07 ord-rewalk 1.02 boss-rewalk 0.08)  hours-in-zone 1.9  boss 1st 40% att 2/5 stall 1.01  cleared 10/10
casual Emberwaste           burden 5h  (train-for-zone 4.61 train-in-zone 7.4 ord-rewalk 1.05 boss-rewalk 0.16)  hours-in-zone 2.3  boss 1st 40% att 3/4 stall 1.92  cleared 10/10
idle Ironvein Caverns       burden 5h  (train-for-zone 2.64 train-in-zone 5.06 ord-rewalk 2.31 boss-rewalk 0.09)  hours-in-zone 3.8  boss 1st 40% att 2/4 stall 0.58  cleared 10/10
light Ironvein Caverns      burden 4.86h  (train-for-zone 3.31 train-in-zone 6.7 ord-rewalk 1.32 boss-rewalk 0.09)  hours-in-zone 2.8  boss 1st 20% att 2/5 stall 0.61  cleared 10/10
idle Thornwood              burden 3.9h  (train-for-zone 1.64 train-in-zone 3.75 ord-rewalk 2.17 boss-rewalk 0)  hours-in-zone 3.3  boss 1st 50% att 1/3 stall 0.02  cleared 10/10
light Thornwood             burden 3.75h  (train-for-zone 1.83 train-in-zone 4.03 ord-rewalk 1.58 boss-rewalk 0)  hours-in-zone 2.8  boss 1st 60% att 1/5 stall 0.03  cleared 10/10
casual Ironvein Caverns     burden 3.13h  (train-for-zone 2.42 train-in-zone 7.7 ord-rewalk 0.76 boss-rewalk 0)  hours-in-zone 1.9  boss 1st 70% att 1/3 stall 0.02  cleared 10/10

LATE-BOSS ATTEMPT TELEMETRY, 48h runs (all attempts pooled; wins/attempts by window; first-attempt state; per-attempt medians)
idle   Emberwaste      auto 10/216 (4.6%)  active -      | first try Lv 49 power 23.0K HP 100% | charge tele/hits/kills 3/3/3, boss ordinary hits 6 | loss at 44% boss HP, summon reached 84%
idle   Amberfall Woods auto 10/371 (2.7%)  active -      | first try Lv 59 power 36.6K HP 96%  | volley tele 2 (hits not counted, see caveat), boss hits 7 | loss at 54%, summon reached 78%
idle   Ashen Approach  auto 3/29 (10%)     active -      | first try Lv 71 power 55.8K HP 99%  | charge 1/1/1, boss hits 4 | loss at 66%, summon reached 73%   (7 of 10 runs reached it)
light  Emberwaste      auto 1/20 (5%)      active 9/12   | first try Lv 47 power 21.5K HP 95%  | charge 2/2/2, boss hits 4 | loss at 55%, summon reached 32%
light  Amberfall Woods auto 1/21 (5%)      active 9/14   | first try Lv 58 power 35.3K HP 95%  | volley tele 1, boss hits 5 | loss at 63%, summon reached 40%
light  Ashen Approach  auto 0/8            active 9/10   | first try Lv 71 power 55.3K HP 100% | charge 1/1/1, boss hits 4 | loss at 65%, summon reached 89%
casual Emberwaste      auto 0/5            active 10/21  | first try Lv 42 power 16.1K HP 100% | charge 2/1/1, boss hits 4 | loss at 32%, summon reached 75%
casual Amberfall Woods auto 0/4            active 10/17  | first try Lv 51 power 24.9K HP 93%  | volley tele 2, boss hits 4 | loss at 56%, summon reached 55%
casual Ashen Approach  auto 1/3            active 9/13   | first try Lv 65 power 45.5K HP 100% | charge 1/1/1, boss hits 3 | loss at 75%, summon reached 33%

TRAINING TRIGGERED BY ZONE, 48h runs (trainings per run; median minutes per training; median party level at trigger; median training fights; ordinary win rate in the window before -> after return)
profile  triggering zone      per run  min/training  Lv     fights  win before -> after
idle     Stillwater Lagoon      2.8      7           13     18      0.6 -> 0.8
idle     Thornwood              6.7     16           24     39      0.6 -> 0.8
idle     Ironvein Caverns       4.8     35           34     68      0.6 -> 0.8
idle     Emberwaste             9.6     42           44     74      0.6 -> 0.8
idle     Amberfall Woods        4.9     56           56    106      0.6 -> 0.8
idle     Ashen Approach         5.1     59           68    107      0.6 -> 0.8   (7 of 10 runs reached)
light    Stillwater Lagoon      2.8      7           14     19      0.6 -> 0.8
light    Thornwood              7.0     16           23     36      0.6 -> 0.8
light    Ironvein Caverns       6.2     34           33     72      0.6 -> 0.8
light    Emberwaste             9.2     44           44     74      0.6 -> 0.8
light    Amberfall Woods        7.8     52           54    100      0.6 -> 0.8
light    Ashen Approach         9.7     59           65    114      0.6 -> 0.8
casual   Stillwater Lagoon      3.8      6           14     20      0.6 -> 0.8
casual   Thornwood              6.3     15           22     33      0.6 -> 0.8
casual   Ironvein Caverns       5.8     26           31     68      0.6 -> 0.8
casual   Emberwaste             7.9     36           41     70      0.5 -> 0.7
casual   Amberfall Woods        8.3     46           49     87      0.6 -> 0.9
casual   Ashen Approach        12.3     52           61    110      0.6 -> 0.8
Where the training happens (per run hours, mean): trainings triggered by Ashen Approach run mostly two zones back in Emberwaste (light 6.6h, casual 6.8h) plus Amberfall (2.6h, 1.7h) and for casual Ironvein (2.0h); trainings triggered by Emberwaste run in Ironvein (idle 3.4h, light 3.1h, casual 0.9h) and Thornwood (2.3h, 2.5h, 3.3h).

## Ranking by player-facing burden (realistic profiles, zones cleared by all 10 runs; burden = ordinary rewalk + boss rewalk + training triggered by the zone + boss combat)
1. idle Emberwaste, 11.8h, at 15-28h on the Road: boss 0% first-try, median 22 attempts (P90 29), max loss streak 21, 4.5h boss stall, 1.8h boss rewalk, 5.6h of training triggered by the zone, 13h from entry to clear; Auto-Cast attempts 10 wins in 216.
2. casual Ashen Approach, 11.0h, at 41h: no boss problem at all (60% first-try, 1 attempt, stall 0.02h); the burden is 9.2h of training triggered by the zone's ordinary fights, 12 trainings per run at 52 minutes each. light Ashen Approach is the same shape (10.5h, 9.7 trainings at 59 minutes, boss 56% first-try) and is listed below the cut only because one light run did not clear.
3. idle Amberfall, 10.1h, at 28-38h: boss 0% first-try, 32 attempts (P90 64), streak 31, 5.2h stall, 2.6h boss rewalk; 10 wins in 371 Auto-Cast attempts. Downstream of 1 and reached only after it.
4. light Amberfall 7.9h and light Emberwaste 7.8h, at 23-32h: Emberwaste boss 10% first-try, 3 attempts (P90 7), 0.6h stall, and light wins it almost only inside active windows (active 9/12, Auto-Cast 1/20); Amberfall 50% first-try but P90 11 attempts. Training-for-zone is 5-6h in both.
5. casual Amberfall 6.2h and casual Emberwaste 5.0h: bosses 40% first-try with 2-3 attempts and 1.0-1.9h stall, fought in active windows (Auto-Cast 0/4 and 0/5). Training-for-zone 4.6-4.7h.
6. Ironvein after the lock: idle 5.0h, 40% first-try, 2 attempts, 0.6h stall; light 4.9h; casual 3.1h. The former wall now sits mid-table with a meaningful failure state.
7. Thornwood 2.8-3.9h (boss 50-70% first-try, 1 attempt), Stillwater 1.7h (20-40%, 2 attempts), Greenhollow 0.05h. Working as designed.
8. Ashen Keep: entered by idle 3, light 9, casual 10 runs, cleared by none within 48h; casual spends 6.9h there at 54 ordinary defeats per hour. This is the intended Shatter wall and shows it (the bot does not Shatter because training removes its stall trigger); not a tuning target here.
Downstream progression: at 24h idle has 4 zones, light 4-5, casual 5, engaged 6, stress 7; at 48h idle reaches 6-7, light 7, casual 7.

Two distinct mechanisms sit at the top of the table and I want the reviewer to see both before the selection:
- A boss execution wall (items 1, 3, 4): the same shape as Ironvein before pass 12, earliest at Emberwaste, idle-dominant, Auto-Cast wins in the low single digits per hundred attempts.
- A training-cost scaling (item 2 and the training table): the fallback trains until +1 party level in a zone one or two back, and a level costs more fights the deeper the Road goes: 7 minutes per training at Stillwater, 16 at Thornwood, 26-35 at Ironvein, 36-44 at Emberwaste, 46-56 at Amberfall, 52-59 at Ashen Approach, with 12 trainings per run for casual at Ashen Approach. The trigger itself behaves the same everywhere (window win rate 0.6 before, 0.8 after return), so the cost is in the target, not in the trigger. This is systemic rather than local, it is a design-owned system (training fallback, locked at +1 target in pass 9), and it lands at 40h+ for light and casual, so I rank it second and do not propose a lever for it in this pass.

## Selected bottleneck: Emberwaste, The Sand Tyrant, for idle and light
Player-facing problem: an idle player who clears Ironvein at 15h then spends the next 13 hours in Emberwaste, losing the boss 22 times in a row on median (P90 29) with no first-try clears in 10 runs; a light player gets through on 3 attempts but only by landing in an active window (1 Auto-Cast win in 20 attempts). It is an execution wall of the same shape Ironvein had before pass 12, it is the earliest one on the Road now, it is the largest single burden for idle, and clearing it also un-censors Amberfall for the realistic profiles. I select it over the Ashen Approach training cost because it comes 25 hours earlier for idle and light, it is a local boss constant with a validated lever, and the training question needs a design decision before any experiment.
Most likely causal mechanism: boss damage per action versus party HP at natural arrival, again. The Sand Tyrant is base ATK x1.9 (higher than the Warlord's former x1.7), with a telegraphed charge, a two-add summon at 50% and an enrage at 25%. On Auto-Cast the charge lands 3 times per attempt and kills 3 heroes per attempt for idle (2/2/2 for light), 6 ordinary boss hits per attempt, losses end at 44-55% boss HP with the summon reached 84% of the time for idle. Active windows win 9 of 12 (light) and 10 of 21 (casual) from the same arrivals, so the boss performs acceptably when the fight is shortened by active play; idle never gets that. Arrival state is not the cause: idle arrives with the most power (23.0K, Lv 49) and wins least.
Smallest local lever: Sand Tyrant base ATK only, as with the Warlord. Not HP (parties reach the summon), not the summon or enrage (the losses are before and around the summon with the boss at half HP), not the charge multiplier (the Warlord sweep showed a one-shot at any multiplier when ATK ~ hero HP).

## Proposed experiment (proposal only, nothing implemented)
Candidate: Sand Tyrant base ATK x1.9 -> x1.35, the same 0.71 ratio that took the Warlord from x1.7 to the validated x1.2. Control: x1.9. Everything else locked, including its charge x2.5, enrage 0.25, summon at 50% with two sandorcs, HP x6.5, DEF x1.0, speed 10.
Two-phase structure as in passes 11-13, to spend runs where they answer questions:
- Phase A, sizing gate in the boss harness: the 48h runs already wrote fresh Emberwaste arrival snapshots for idle, light and casual (seeds 31-40, current production values); replay 10 combat seeds each in Auto-Cast mode, control x1.9 vs candidate x1.35, plus x1.5 and x1.2 as sizing arms, and one active-mode run at the chosen value (one process, minutes). Choose the hardest value that lifts idle Auto-Cast clears materially without pushing active windows above 95%; I expect x1.35 to land there, since the Warlord ratio is what it is calibrated from.
- Phase B, quick road diagnostic on the chosen value: paired seeds 31-40 x idle/light/casual x 36h (36 rather than 24 so Emberwaste is uncensored for idle), 30 control + 30 candidate runs, production Road, identical telemetry, zero errors.
Primary success criteria (fresh seeds, Phase B): idle Emberwaste first-try >=10%, median attempts <=4 with P90 <=8, boss stall down >=50%; light first-try >=20% and attempts P90 <=5; Auto-Cast attempt win rate up >=15 points for idle; active-window win rate below 95% for light and casual; the boss still produces losses in idle, light and casual; charge kills per attempt unchanged (charge stays lethal).
Regression criteria: Stillwater, Thornwood and Ironvein rows identical between arms; no upstream or downstream median clear time worse than +10% (P90 +15%); total defeats within +10%; Auto Training within 10%; hordes and catacombs unchanged; ordinary-fight outcomes in Emberwaste unchanged (only the boss differs).
IMPLEMENTATION_RISK: none technically (one field in the enemy table, the same override path). Design risk: active-window Emberwaste fights get easier too (light already 75%, casual 48% active); the Phase A active check is there to keep them under 95%.

## Systemic observations (not proposals for this pass)
- Boss ATK: this is the second consecutive boss whose wall is base ATK against party HP, and the multipliers keep rising down the Road: Warlord was x1.7, Sand Tyrant x1.9, Hunter King x2.0 (ranged volley), Grave Knight x2.0. Idle's Amberfall figures (32 attempts, 10 wins in 371) say the Hunter King will be the same story next. If Emberwaste confirms the pattern, a single diagnostic on the boss-ATK-versus-hero-HP relationship from Lv 30 on would be cheaper than three more per-boss passes; I raise it only so the reviewer can decide when.
- Training cost: the +1 level target costs 7 minutes at Stillwater and about an hour at Ashen Approach, and light/casual take 10-12 trainings per run there. Possible levers when the reviewer wants it: a target in fights or minutes instead of levels, or training one zone back only, with the pass 9 exploit protections kept. It needs a design decision on what training is meant to cost late, which is outside this pass.

## Caveats and telemetry notes
- The 48h runs are n=10 per profile; attempts and stall medians are robust at these effect sizes, first-try percentages move in 10-point steps.
- Telemetry gap found during triage: the per-hit charge counter records only melee charges (chargeM). The Hunter King's volley (chargeR) therefore shows 0 hits and kills even though its telegraphs are counted. Observation-only fix before any Amberfall work; it does not affect the Emberwaste numbers (the Sand Tyrant is melee).
- "train h" in the zone table is time spent training inside that zone as a destination; the burden figure and rank lines use training triggered by the zone (train-for-zone). Both are shown, and the training table gives the per-trigger cost.
- The Ashen Keep rows describe the intended Shatter wall (no bot Shatters occur within 48h because training removes the bot's stall trigger); they are not a tuning target here.
