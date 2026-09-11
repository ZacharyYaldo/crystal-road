STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: RESULTS_WITH_PARTIAL_AND_RECOMMENDATION
PASS_ID: PASS_19_LATE_ROAD_TRAINING_TARGET_CANDIDATE
BASED_ON_REVIEW_PASS: PASS_19_LATE_ROAD_TRAINING_TARGET_CANDIDATE
BUILD: 20260911-135817
HEAD_COMMIT_SHA: acd4723f53bf178080ca09a6353c453c07013d10

# Crystal Road AI Handoff - Pass 19 (late-Road Auto Training target 1.0 vs 0.5 for returns from Ashen Approach or later, paired seeds 31-40, 48h)

DEVELOPER_POSITION: PARTIAL. The candidate does what it says for casual and does not do it for idle and light. Casual saves 5.2h of training per run (10 of 10 paired seeds), clears Ashen Approach 5.0h earlier (10 of 10) and meets the Grave Knight in better shape (first-try 2/10 -> 8/10). Idle and light save 0.9h and 1.2h (9 of 10 each) but only by fragmenting the same cost: episodes go from 8-9 per run to 13-15, each half as long, and the party comes back to the Grave Knight one level weaker; light's first-try there falls from 7/8 to 2/8 with 1.9h of new stall, and both profiles' ordinary defeats in the zone rise 50-70%. Forward progression is unchanged for all three at 24h, 36h and 48h. Casual's total defeats rise 47%, all of it at the Hollow King's zone, which casual now enters 5h earlier and six levels lower. The reviewer's rules point both ways ("lock if training hours materially decrease" fits casual; "reject if it only fragments the same cost" fits idle and light), so I set out the two readings and recommend below. CONFIDENCE: HIGH on the measurements (60 runs, 0 errors, override audited, everything through Amberfall identical); HIGH that the mechanism differs by profile; MEDIUM on the recommendation.

## Setup and audit
- Production Auto Training unchanged (target 1.0 everywhere). The candidate arm applied `target=(quick?AT_RETRIGGER_TARGET:1)*(ret>=6?0.5:1)` through the simulator's per-run source replace only (`tests/sim/batch_p19x.log`), where `ret` is the zone the party retreats from (index 6 = Ashen Approach). Ashen Keep (index 7) is excluded from training by the production `atAllowed` rule in both arms, so the override can only act on returns from Ashen Approach in this horizon. Trigger window, loss threshold, minimum fights, quick-retrigger rule, Keep Pushing, XP, enemies and bosses untouched.
- Audit: episode target at Ashen Approach 1.00 in every control episode and 0.50 in every candidate episode (median and P90 in the table); level progress per episode 1.00 -> 0.50; Grave Knight ATK 5586 at every first attempt in both arms; every row from Stillwater through Amberfall identical between arms (bosses, clear times, training triggers, rewalk, hordes).
- Paired seeds 31-40 x idle/light/casual x 48h, --shatters 3, production Road (Sand Tyrant x1.1, Hunter King x1.0, Grave Knight x2.0), Auto Training, hordes, catacombs; 30 control + 30 candidate runs; 0 simulation errors.
- Snapshot-prefix fix applied before the run (commit acd4723): Ashen Approach and Ashen Keep now write `ashen_approach_*` and `ashen_keep_*`.
- New report tool `tests/sim/trainstats.js` (this commit): Auto Training by return zone for paired arms.

## Auto Training by profile and return zone

===== IDLE  n=10 paired runs   (batch_out_p19c -> batch_out_p19x)   values are med / P90 per run unless noted
total training hours          23.3 / 26.6 -> 22.2 / 25.4   paired med -0.87 (+1 00 -9)
total triggers                38 / 42 -> 42 / 48   completed returns 31 / 36 -> 36 / 42   cancels 6 / 9 -> 6 / 9

-- return zone: Stillwater Lagoon
  episodes / run                2 / 5 -> 2 / 5   completed returns 2 / 4 -> 2 / 4   quick retriggers 0 / 2 -> 0 / 2   cancels(approx) 1 / 2 -> 1 / 2
  training hours / run          0.30 / 0.67 -> 0.30 / 0.67   paired med 0.00 (+0 010 -0)   fights / run 59 / 131 -> 59 / 131
  first-return vs retrigger     count 2 / 4 -> 2 / 4 vs 0 / 2 -> 0 / 2   hours 0.30 / 0.41 -> 0.30 / 0.41 vs 0.00 / 0.30 -> 0.00 / 0.30
  per episode (pooled med/P90)  minutes 7 / 12 -> 7 / 12   fights 18 / 41 -> 18 / 41   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 14 / 18 -> 14 / 18   minutes 11 / 11 -> 11 / 11   (n 5 -> 5)
  win rate after return (mean)  first 10: 82% -> 82%   first 20: 83% -> 83%   window at trigger: 57% -> 57%
  zone: ordinary defeats        40 / 46 -> 40 / 46   rewalk hours 1.26 / 1.76 -> 1.28 / 1.79   non-training hours in zone 2.14 / 2.91 -> 2.14 / 2.91
  Lv entering / Lv at boss      6 / 7 -> 6 / 7  /  16 / 18 -> 16 / 18   power at boss 3049 / 3821 -> 3049 / 3821
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 4/10 -> 4/10   attempts 2 / 5 -> 2 / 5   streak 1 / 4 -> 1 / 4   stall h 0.11 / 1.06 -> 0.11 / 1.06
  zone clear h                  2.79 / 3.43 -> 2.79 / 3.43   paired med 0.00 (+0 010 -0)

-- return zone: Thornwood
  episodes / run                6 / 10 -> 6 / 10   completed returns 6 / 9 -> 6 / 9   quick retriggers 3 / 5 -> 3 / 5   cancels(approx) 0 / 1 -> 0 / 1
  training hours / run          1.64 / 2.85 -> 1.64 / 2.85   paired med 0.00 (+0 010 -0)   fights / run 239 / 377 -> 239 / 377
  first-return vs retrigger     count 3 / 5 -> 3 / 5 vs 3 / 5 -> 3 / 5   hours 0.86 / 1.35 -> 0.86 / 1.35 vs 0.83 / 1.59 -> 0.83 / 1.59
  per episode (pooled med/P90)  minutes 16 / 19 -> 16 / 19   fights 39 / 51 -> 39 / 51   level progress 1.00 / 1.20 -> 1.00 / 1.20   target med 1.00 -> 1.00
  return -> next trigger        fights 10 / 19 -> 10 / 19   minutes 8 / 13 -> 8 / 13   (n 32 -> 32)
  win rate after return (mean)  first 10: 79% -> 79%   first 20: 81% -> 81%   window at trigger: 57% -> 57%
  zone: ordinary defeats        68 / 89 -> 68 / 89   rewalk hours 2.11 / 2.95 -> 2.16 / 3.01   non-training hours in zone 3.27 / 4.40 -> 3.27 / 4.40
  Lv entering / Lv at boss      15 / 16 -> 15 / 16  /  28 / 30 -> 28 / 30   power at boss 8665 / 9157 -> 8665 / 9157
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 5/10 -> 5/10   attempts 1 / 3 -> 1 / 3   streak 0 / 2 -> 0 / 2   stall h 0.02 / 1.66 -> 0.02 / 1.66
  zone clear h                  7.89 / 8.61 -> 7.89 / 8.61   paired med 0.00 (+0 010 -0)

-- return zone: Ironvein Caverns
  episodes / run                5 / 7 -> 5 / 7   completed returns 5 / 7 -> 5 / 7   quick retriggers 1 / 5 -> 1 / 5   cancels(approx) 0 / 0 -> 0 / 0
  training hours / run          2.64 / 3.75 -> 2.64 / 3.75   paired med 0.00 (+0 010 -0)   fights / run 318 / 528 -> 318 / 528
  first-return vs retrigger     count 3 / 4 -> 3 / 4 vs 1 / 5 -> 1 / 5   hours 1.67 / 2.15 -> 1.67 / 2.15 vs 0.69 / 2.87 -> 0.69 / 2.87
  per episode (pooled med/P90)  minutes 35 / 39 -> 35 / 39   fights 68 / 81 -> 68 / 81   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 11 / 20 -> 11 / 20   minutes 10 / 15 -> 10 / 15   (n 17 -> 17)
  win rate after return (mean)  first 10: 82% -> 82%   first 20: 82% -> 82%   window at trigger: 59% -> 59%
  zone: ordinary defeats        57 / 74 -> 57 / 74   rewalk hours 2.31 / 3.13 -> 2.31 / 3.17   non-training hours in zone 3.83 / 5.20 -> 3.83 / 5.20
  Lv entering / Lv at boss      29 / 30 -> 29 / 30  /  38 / 40 -> 38 / 40   power at boss 14026 / 15509 -> 14026 / 15509
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 4/10 -> 4/10   attempts 2 / 4 -> 2 / 4   streak 1 / 3 -> 1 / 3   stall h 0.58 / 2.90 -> 0.58 / 2.90
  zone clear h                  14.77 / 15.73 -> 14.77 / 15.73   paired med 0.00 (+0 010 -0)

-- return zone: Emberwaste
  episodes / run                9 / 11 -> 9 / 11   completed returns 5 / 6 -> 5 / 6   quick retriggers 2 / 4 -> 2 / 4   cancels(approx) 5 / 5 -> 5 / 5
  training hours / run          5.09 / 6.87 -> 5.09 / 6.87   paired med 0.00 (+0 010 -0)   fights / run 528 / 712 -> 528 / 712
  first-return vs retrigger     count 7 / 8 -> 7 / 8 vs 2 / 4 -> 2 / 4   hours 4.02 / 5.09 -> 4.02 / 5.09 vs 1.10 / 3.30 -> 1.10 / 3.30
  per episode (pooled med/P90)  minutes 43 / 51 -> 43 / 51   fights 73 / 93 -> 73 / 93   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 11 / 17 -> 11 / 17   minutes 7 / 11 -> 7 / 11   (n 22 -> 22)
  win rate after return (mean)  first 10: 77% -> 77%   first 20: 82% -> 82%   window at trigger: 58% -> 58%
  zone: ordinary defeats        83 / 112 -> 83 / 112   rewalk hours 2.61 / 4.84 -> 2.67 / 4.87   non-training hours in zone 4.73 / 7.05 -> 4.73 / 7.05
  Lv entering / Lv at boss      39 / 40 -> 39 / 40  /  49 / 51 -> 49 / 51   power at boss 23545 / 24912 -> 23545 / 24912
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 2/10 -> 2/10   attempts 3 / 6 -> 3 / 6   streak 2 / 5 -> 2 / 5   stall h 1.50 / 3.30 -> 1.50 / 3.30
  zone clear h                  24.69 / 26.99 -> 24.69 / 26.99   paired med 0.00 (+0 010 -0)

-- return zone: Amberfall Woods
  episodes / run                7 / 9 -> 7 / 9   completed returns 6 / 9 -> 6 / 9   quick retriggers 3 / 5 -> 3 / 5   cancels(approx) 1 / 2 -> 1 / 2
  training hours / run          6.21 / 8.31 -> 6.21 / 8.31   paired med 0.00 (+0 010 -0)   fights / run 694 / 937 -> 694 / 937
  first-return vs retrigger     count 4 / 6 -> 4 / 6 vs 3 / 5 -> 3 / 5   hours 3.25 / 5.24 -> 3.25 / 5.24 vs 2.24 / 4.82 -> 2.24 / 4.82
  per episode (pooled med/P90)  minutes 55 / 61 -> 55 / 61   fights 101 / 122 -> 101 / 122   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 9 / 15 -> 9 / 15   minutes 7 / 10 -> 7 / 10   (n 32 -> 32)
  win rate after return (mean)  first 10: 80% -> 80%   first 20: 84% -> 84%   window at trigger: 55% -> 55%
  zone: ordinary defeats        65 / 94 -> 65 / 94   rewalk hours 2.16 / 3.51 -> 2.20 / 3.59   non-training hours in zone 3.59 / 5.70 -> 3.59 / 5.70
  Lv entering / Lv at boss      51 / 52 -> 51 / 52  /  58 / 61 -> 58 / 61   power at boss 36184 / 39820 -> 36184 / 39820
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 1/10 -> 1/10   attempts 3 / 8 -> 3 / 8   streak 2 / 7 -> 2 / 7   stall h 1.80 / 3.30 -> 1.80 / 3.30
  zone clear h                  34.77 / 37.17 -> 34.77 / 37.17   paired med 0.00 (+0 010 -0)

-- return zone: Ashen Approach
  episodes / run                8 / 9 -> 13 / 16   completed returns 7 / 9 -> 12 / 16   quick retriggers 3 / 4 -> 6 / 10   cancels(approx) 0 / 1 -> 0 / 1
  training hours / run          7.28 / 8.79 -> 6.37 / 7.54   paired med -0.87 (+1 00 -9)   fights / run 814 / 1079 -> 700 / 883
  first-return vs retrigger     count 5 / 6 -> 5 / 12 vs 3 / 4 -> 6 / 10   hours 3.99 / 5.83 -> 2.50 / 5.50 vs 3.17 / 3.90 -> 3.22 / 4.99
  per episode (pooled med/P90)  minutes 59 / 63 -> 30 / 34   fights 116 / 128 -> 56 / 64   level progress 1.00 / 1.00 -> 0.50 / 1.00   target med 1.00 -> 0.50
  return -> next trigger        fights 10 / 17 -> 11 / 18   minutes 9 / 14 -> 10 / 14   (n 32 -> 66)
  win rate after return (mean)  first 10: 79% -> 77%   first 20: 82% -> 81%   window at trigger: 56% -> 56%
  zone: ordinary defeats        69 / 106 -> 104 / 123   rewalk hours 2.45 / 4.08 -> 3.14 / 4.11   non-training hours in zone 4.44 / 7.62 -> 5.80 / 7.47
  Lv entering / Lv at boss      60 / 62 -> 60 / 62  /  69 / 71 -> 70 / 72   power at boss 53837 / 55923 -> 56658 / 59083
  boss: reach/attempt/clear     10/7/3 -> 10/7/3   first-try 0/3 -> 0/3   attempts 3 / 4 -> 5 / 8   streak 3 / 7 -> 2 / 10   stall h 3.11 / 4.50 -> 1.77 / 2.03
  zone clear h                  46.20 / 46.60 -> 46.43 / 46.94   paired med -0.27 (+1 00 -1)

  zones cleared @24/36/48h      24h 4 / 5 -> 4 / 5 [paired med 0.00 (+0 010 -0)]   36h 6 / 6 -> 6 / 6 [paired med 0.00 (+0 010 -0)]   48h 6 / 7 -> 6 / 7 [paired med 0.00 (+1 08 -1)]
  total defeats                 559 / 660 -> 615 / 664   paired med 40.00 (+10 00 -0)   hordes fought/repelled/lost 4 / 5 -> 4 / 5 / 4 / 5 -> 4 / 5 / 1 / 3 -> 1 / 3

===== LIGHT  n=10 paired runs   (batch_out_p19c -> batch_out_p19x)   values are med / P90 per run unless noted
total training hours          26.2 / 28.9 -> 25.1 / 28.1   paired med -1.21 (+1 00 -9)
total triggers                42 / 47 -> 50 / 55   completed returns 35 / 38 -> 41 / 46   cancels 8 / 9 -> 8 / 9

-- return zone: Stillwater Lagoon
  episodes / run                3 / 5 -> 3 / 5   completed returns 2 / 3 -> 2 / 3   quick retriggers 0 / 1 -> 0 / 1   cancels(approx) 1 / 2 -> 1 / 2
  training hours / run          0.34 / 0.52 -> 0.34 / 0.52   paired med 0.00 (+0 010 -0)   fights / run 66 / 97 -> 66 / 97
  first-return vs retrigger     count 3 / 5 -> 3 / 5 vs 0 / 1 -> 0 / 1   hours 0.32 / 0.50 -> 0.32 / 0.50 vs 0.00 / 0.15 -> 0.00 / 0.15
  per episode (pooled med/P90)  minutes 7 / 11 -> 7 / 11   fights 19 / 42 -> 19 / 42   level progress 1.00 / 1.30 -> 1.00 / 1.30   target med 1.00 -> 1.00
  return -> next trigger        fights 8 / 11 -> 8 / 11   minutes 7 / 7 -> 7 / 7   (n 2 -> 2)
  win rate after return (mean)  first 10: 83% -> 83%   first 20: 83% -> 83%   window at trigger: 56% -> 56%
  zone: ordinary defeats        40 / 46 -> 40 / 46   rewalk hours 1.26 / 1.68 -> 1.30 / 1.73   non-training hours in zone 2.27 / 2.41 -> 2.27 / 2.41
  Lv entering / Lv at boss      6 / 7 -> 6 / 7  /  15 / 17 -> 15 / 17   power at boss 3067 / 3370 -> 3067 / 3370
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 2/10 -> 2/10   attempts 2 / 4 -> 2 / 4   streak 1 / 3 -> 1 / 3   stall h 0.52 / 0.86 -> 0.52 / 0.86
  zone clear h                  2.83 / 3.09 -> 2.83 / 3.09   paired med 0.00 (+0 010 -0)

-- return zone: Thornwood
  episodes / run                7 / 9 -> 7 / 9   completed returns 7 / 8 -> 7 / 8   quick retriggers 4 / 5 -> 4 / 5   cancels(approx) 1 / 1 -> 1 / 1
  training hours / run          1.83 / 2.39 -> 1.83 / 2.39   paired med 0.00 (+0 010 -0)   fights / run 260 / 334 -> 260 / 334
  first-return vs retrigger     count 4 / 5 -> 4 / 5 vs 4 / 5 -> 4 / 5   hours 0.84 / 1.39 -> 0.84 / 1.39 vs 1.12 / 1.40 -> 1.12 / 1.40
  per episode (pooled med/P90)  minutes 16 / 19 -> 16 / 19   fights 36 / 51 -> 36 / 51   level progress 1.00 / 1.20 -> 1.00 / 1.20   target med 1.00 -> 1.00
  return -> next trigger        fights 10 / 19 -> 10 / 19   minutes 7 / 13 -> 7 / 13   (n 33 -> 33)
  win rate after return (mean)  first 10: 78% -> 78%   first 20: 82% -> 82%   window at trigger: 56% -> 56%
  zone: ordinary defeats        64 / 84 -> 64 / 84   rewalk hours 1.57 / 2.53 -> 1.59 / 2.60   non-training hours in zone 2.81 / 3.86 -> 2.81 / 3.86
  Lv entering / Lv at boss      15 / 15 -> 15 / 15  /  27 / 30 -> 27 / 30   power at boss 7942 / 9198 -> 7942 / 9198
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 6/10 -> 6/10   attempts 1 / 5 -> 1 / 5   streak 0 / 4 -> 0 / 4   stall h 0.03 / 1.40 -> 0.03 / 1.40
  zone clear h                  7.89 / 9.07 -> 7.89 / 9.07   paired med 0.00 (+0 010 -0)

-- return zone: Ironvein Caverns
  episodes / run                6 / 7 -> 6 / 7   completed returns 6 / 7 -> 6 / 7   quick retriggers 2 / 4 -> 2 / 4   cancels(approx) 0 / 0 -> 0 / 0
  training hours / run          3.31 / 3.92 -> 3.31 / 3.92   paired med 0.00 (+0 010 -0)   fights / run 439 / 504 -> 439 / 504
  first-return vs retrigger     count 3 / 5 -> 3 / 5 vs 2 / 4 -> 2 / 4   hours 1.68 / 2.54 -> 1.68 / 2.54 vs 1.24 / 2.42 -> 1.24 / 2.42
  per episode (pooled med/P90)  minutes 34 / 39 -> 34 / 39   fights 72 / 80 -> 72 / 80   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 10 / 17 -> 10 / 17   minutes 9 / 14 -> 9 / 14   (n 25 -> 25)
  win rate after return (mean)  first 10: 81% -> 81%   first 20: 83% -> 83%   window at trigger: 58% -> 58%
  zone: ordinary defeats        50 / 72 -> 50 / 72   rewalk hours 1.33 / 2.29 -> 1.37 / 2.35   non-training hours in zone 2.76 / 4.43 -> 2.76 / 4.43
  Lv entering / Lv at boss      29 / 30 -> 29 / 30  /  37 / 39 -> 37 / 39   power at boss 13736 / 14647 -> 13736 / 14647
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 2/10 -> 2/10   attempts 2 / 5 -> 2 / 5   streak 1 / 4 -> 1 / 4   stall h 0.61 / 3.18 -> 0.61 / 3.18
  zone clear h                  14.09 / 16.77 -> 14.09 / 16.77   paired med 0.00 (+0 010 -0)

-- return zone: Emberwaste
  episodes / run                10 / 13 -> 10 / 13   completed returns 5 / 7 -> 5 / 7   quick retriggers 2 / 5 -> 2 / 5   cancels(approx) 4 / 6 -> 4 / 6
  training hours / run          5.74 / 7.80 -> 5.74 / 7.80   paired med 0.00 (+0 010 -0)   fights / run 603 / 792 -> 603 / 792
  first-return vs retrigger     count 8 / 9 -> 8 / 9 vs 2 / 5 -> 2 / 5   hours 4.33 / 5.78 -> 4.33 / 5.78 vs 1.58 / 3.75 -> 1.58 / 3.75
  per episode (pooled med/P90)  minutes 44 / 50 -> 44 / 50   fights 75 / 93 -> 75 / 93   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 12 / 16 -> 12 / 16   minutes 9 / 11 -> 9 / 11   (n 24 -> 24)
  win rate after return (mean)  first 10: 85% -> 85%   first 20: 84% -> 84%   window at trigger: 55% -> 55%
  zone: ordinary defeats        81 / 93 -> 81 / 93   rewalk hours 2.08 / 2.69 -> 2.10 / 2.77   non-training hours in zone 4.20 / 4.74 -> 4.20 / 4.74
  Lv entering / Lv at boss      38 / 41 -> 38 / 41  /  46 / 51 -> 46 / 51   power at boss 20094 / 24742 -> 20094 / 24742
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 3/10 -> 3/10   attempts 2 / 8 -> 2 / 8   streak 1 / 7 -> 1 / 7   stall h 1.99 / 5.92 -> 1.99 / 5.92
  zone clear h                  24.10 / 26.08 -> 24.10 / 26.08   paired med 0.00 (+0 010 -0)

-- return zone: Amberfall Woods
  episodes / run                8 / 9 -> 8 / 9   completed returns 7 / 8 -> 7 / 8   quick retriggers 4 / 5 -> 4 / 5   cancels(approx) 1 / 2 -> 1 / 2
  training hours / run          6.65 / 7.42 -> 6.65 / 7.42   paired med 0.00 (+0 010 -0)   fights / run 783 / 843 -> 783 / 843
  first-return vs retrigger     count 3 / 5 -> 3 / 5 vs 4 / 5 -> 4 / 5   hours 2.72 / 4.60 -> 2.72 / 4.60 vs 3.60 / 4.75 -> 3.60 / 4.75
  per episode (pooled med/P90)  minutes 52 / 57 -> 52 / 57   fights 100 / 119 -> 100 / 119   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 10 / 19 -> 10 / 19   minutes 8 / 12 -> 8 / 12   (n 41 -> 41)
  win rate after return (mean)  first 10: 78% -> 78%   first 20: 85% -> 85%   window at trigger: 55% -> 55%
  zone: ordinary defeats        51 / 64 -> 51 / 64   rewalk hours 1.31 / 1.48 -> 1.31 / 1.53   non-training hours in zone 2.30 / 2.68 -> 2.30 / 2.68
  Lv entering / Lv at boss      50 / 51 -> 50 / 51  /  58 / 60 -> 58 / 60   power at boss 34921 / 40876 -> 34921 / 40876
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 6/10 -> 6/10   attempts 1 / 4 -> 1 / 4   streak 0 / 3 -> 0 / 3   stall h 0.01 / 6.93 -> 0.01 / 6.93
  zone clear h                  32.07 / 36.09 -> 32.07 / 36.09   paired med 0.00 (+0 010 -0)

-- return zone: Ashen Approach
  episodes / run                9 / 11 -> 15 / 19   completed returns 9 / 11 -> 15 / 19   quick retriggers 5 / 8 -> 11 / 15   cancels(approx) 0 / 2 -> 0 / 2
  training hours / run          8.06 / 10.62 -> 7.46 / 9.56   paired med -1.21 (+1 00 -9)   fights / run 986 / 1222 -> 845 / 1043
  first-return vs retrigger     count 5 / 6 -> 5 / 9 vs 5 / 8 -> 11 / 15   hours 3.94 / 5.49 -> 2.51 / 4.10 vs 5.04 / 7.68 -> 4.99 / 7.67
  per episode (pooled med/P90)  minutes 58 / 64 -> 30 / 33   fights 112 / 124 -> 56 / 63   level progress 1.00 / 1.00 -> 0.50 / 1.00   target med 1.00 -> 0.50
  return -> next trigger        fights 11 / 17 -> 9 / 17   minutes 9 / 13 -> 8 / 12   (n 50 -> 102)
  win rate after return (mean)  first 10: 76% -> 77%   first 20: 82% -> 82%   window at trigger: 57% -> 50%
  zone: ordinary defeats        62 / 76 -> 104 / 135   rewalk hours 1.42 / 2.21 -> 1.46 / 3.28   non-training hours in zone 3.02 / 4.12 -> 3.75 / 6.62
  Lv entering / Lv at boss      60 / 61 -> 60 / 61  /  70 / 72 -> 69 / 71   power at boss 54264 / 57454 -> 50354 / 54091
  boss: reach/attempt/clear     10/9/8 -> 10/9/8   first-try 7/8 -> 2/8   attempts 1 / 2 -> 2 / 5   streak 0 / 1 -> 2 / 4   stall h 0.02 / 0.99 -> 1.96 / 4.95
  zone clear h                  44.07 / 46.08 -> 44.07 / 47.06   paired med -0.01 (+4 00 -4)

  zones cleared @24/36/48h      24h 4 / 5 -> 4 / 5 [paired med 0.00 (+0 010 -0)]   36h 6 / 6 -> 6 / 6 [paired med 0.00 (+0 010 -0)]   48h 7 / 7 -> 7 / 7 [paired med 0.00 (+0 010 -0)]
  total defeats                 634 / 734 -> 698 / 822   paired med 62.00 (+10 00 -0)   hordes fought/repelled/lost 4 / 5 -> 5 / 5 / 4 / 5 -> 5 / 5 / 0 / 2 -> 0 / 1

===== CASUAL  n=10 paired runs   (batch_out_p19c -> batch_out_p19x)   values are med / P90 per run unless noted
total training hours          27.4 / 32.0 -> 22.2 / 24.9   paired med -5.23 (+0 00 -10)
total triggers                47 / 58 -> 51 / 55   completed returns 39 / 47 -> 42 / 48   cancels 8 / 12 -> 7 / 12

-- return zone: Stillwater Lagoon
  episodes / run                4 / 7 -> 4 / 7   completed returns 2 / 4 -> 2 / 4   quick retriggers 0 / 3 -> 0 / 3   cancels(approx) 1 / 3 -> 1 / 3
  training hours / run          0.36 / 0.74 -> 0.36 / 0.74   paired med 0.00 (+0 010 -0)   fights / run 77 / 149 -> 77 / 149
  first-return vs retrigger     count 3 / 6 -> 3 / 6 vs 0 / 3 -> 0 / 3   hours 0.34 / 0.57 -> 0.34 / 0.57 vs 0.00 / 0.41 -> 0.00 / 0.41
  per episode (pooled med/P90)  minutes 6 / 12 -> 6 / 12   fights 20 / 42 -> 20 / 42   level progress 1.00 / 1.30 -> 1.00 / 1.30   target med 1.00 -> 1.00
  return -> next trigger        fights 9 / 17 -> 9 / 17   minutes 7 / 10 -> 7 / 10   (n 8 -> 8)
  win rate after return (mean)  first 10: 81% -> 81%   first 20: 86% -> 86%   window at trigger: 56% -> 56%
  zone: ordinary defeats        43 / 52 -> 43 / 52   rewalk hours 1.12 / 1.93 -> 1.18 / 2.01   non-training hours in zone 2.05 / 2.87 -> 2.05 / 2.87
  Lv entering / Lv at boss      6 / 7 -> 6 / 7  /  16 / 18 -> 16 / 18   power at boss 3182 / 3860 -> 3182 / 3860
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 3/10 -> 3/10   attempts 2 / 4 -> 2 / 4   streak 1 / 3 -> 1 / 3   stall h 0.38 / 0.88 -> 0.38 / 0.88
  zone clear h                  2.86 / 3.43 -> 2.86 / 3.43   paired med 0.00 (+0 010 -0)

-- return zone: Thornwood
  episodes / run                6 / 9 -> 6 / 9   completed returns 6 / 8 -> 6 / 8   quick retriggers 3 / 6 -> 3 / 6   cancels(approx) 1 / 1 -> 1 / 1
  training hours / run          1.42 / 2.17 -> 1.42 / 2.17   paired med 0.00 (+0 010 -0)   fights / run 214 / 298 -> 214 / 298
  first-return vs retrigger     count 3 / 5 -> 3 / 5 vs 3 / 6 -> 3 / 6   hours 0.53 / 1.08 -> 0.53 / 1.08 vs 0.81 / 1.43 -> 0.81 / 1.43
  per episode (pooled med/P90)  minutes 15 / 17 -> 15 / 17   fights 33 / 45 -> 33 / 45   level progress 1.00 / 1.30 -> 1.00 / 1.30   target med 1.00 -> 1.00
  return -> next trigger        fights 9 / 15 -> 9 / 15   minutes 7 / 10 -> 7 / 10   (n 34 -> 34)
  win rate after return (mean)  first 10: 76% -> 76%   first 20: 78% -> 78%   window at trigger: 51% -> 51%
  zone: ordinary defeats        51 / 64 -> 51 / 64   rewalk hours 1.15 / 2.07 -> 1.22 / 2.15   non-training hours in zone 2.27 / 3.09 -> 2.27 / 3.09
  Lv entering / Lv at boss      15 / 16 -> 15 / 16  /  26 / 28 -> 26 / 28   power at boss 7665 / 8546 -> 7665 / 8546
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 7/10 -> 7/10   attempts 1 / 2 -> 1 / 2   streak 0 / 1 -> 0 / 1   stall h 0.02 / 0.86 -> 0.02 / 0.86
  zone clear h                  6.92 / 7.09 -> 6.92 / 7.09   paired med 0.00 (+0 010 -0)

-- return zone: Ironvein Caverns
  episodes / run                5 / 8 -> 5 / 8   completed returns 5 / 8 -> 5 / 8   quick retriggers 4 / 7 -> 4 / 7   cancels(approx) 0 / 0 -> 0 / 0
  training hours / run          2.42 / 3.96 -> 2.42 / 3.96   paired med 0.00 (+0 010 -0)   fights / run 354 / 558 -> 354 / 558
  first-return vs retrigger     count 2 / 4 -> 2 / 4 vs 4 / 7 -> 4 / 7   hours 0.94 / 2.18 -> 0.94 / 2.18 vs 1.77 / 3.44 -> 1.77 / 3.44
  per episode (pooled med/P90)  minutes 26 / 37 -> 26 / 37   fights 68 / 77 -> 68 / 77   level progress 1.00 / 1.20 -> 1.00 / 1.20   target med 1.00 -> 1.00
  return -> next trigger        fights 9 / 16 -> 9 / 16   minutes 8 / 11 -> 8 / 11   (n 35 -> 35)
  win rate after return (mean)  first 10: 78% -> 78%   first 20: 84% -> 84%   window at trigger: 51% -> 51%
  zone: ordinary defeats        39 / 49 -> 39 / 49   rewalk hours 0.77 / 1.49 -> 0.80 / 1.55   non-training hours in zone 1.87 / 2.54 -> 1.87 / 2.54
  Lv entering / Lv at boss      27 / 28 -> 27 / 28  /  35 / 37 -> 35 / 37   power at boss 11986 / 13916 -> 11986 / 13916
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 7/10 -> 7/10   attempts 1 / 3 -> 1 / 3   streak 0 / 2 -> 0 / 2   stall h 0.02 / 1.95 -> 0.02 / 1.95
  zone clear h                  11.11 / 13.16 -> 11.11 / 13.16   paired med 0.00 (+0 010 -0)

-- return zone: Emberwaste
  episodes / run                5 / 9 -> 5 / 9   completed returns 4 / 6 -> 4 / 6   quick retriggers 2 / 5 -> 2 / 5   cancels(approx) 1 / 5 -> 1 / 5
  training hours / run          3.63 / 4.74 -> 3.63 / 4.74   paired med 0.00 (+0 010 -0)   fights / run 417 / 561 -> 417 / 561
  first-return vs retrigger     count 3 / 6 -> 3 / 6 vs 2 / 5 -> 2 / 5   hours 1.88 / 3.23 -> 1.88 / 3.23 vs 1.40 / 2.82 -> 1.40 / 2.82
  per episode (pooled med/P90)  minutes 39 / 46 -> 39 / 46   fights 76 / 92 -> 76 / 92   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 8 / 14 -> 8 / 14   minutes 7 / 13 -> 7 / 13   (n 24 -> 24)
  win rate after return (mean)  first 10: 70% -> 70%   first 20: 82% -> 82%   window at trigger: 42% -> 42%
  zone: ordinary defeats        49 / 72 -> 49 / 72   rewalk hours 0.96 / 1.84 -> 1.05 / 1.92   non-training hours in zone 2.06 / 2.92 -> 2.06 / 2.92
  Lv entering / Lv at boss      35 / 37 -> 35 / 37  /  42 / 45 -> 42 / 45   power at boss 16120 / 19163 -> 16120 / 19163
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 6/10 -> 6/10   attempts 1 / 2 -> 1 / 2   streak 0 / 1 -> 0 / 1   stall h 0.03 / 2.95 -> 0.03 / 2.95
  zone clear h                  16.14 / 19.10 -> 16.14 / 19.10   paired med 0.00 (+0 010 -0)

-- return zone: Amberfall Woods
  episodes / run                11 / 16 -> 11 / 16   completed returns 8 / 13 -> 8 / 13   quick retriggers 5 / 12 -> 5 / 12   cancels(approx) 3 / 7 -> 3 / 7
  training hours / run          7.09 / 11.33 -> 7.09 / 11.33   paired med 0.00 (+0 010 -0)   fights / run 831 / 1422 -> 831 / 1422
  first-return vs retrigger     count 4 / 9 -> 4 / 9 vs 5 / 12 -> 5 / 12   hours 2.52 / 4.81 -> 2.52 / 4.81 vs 2.88 / 8.91 -> 2.88 / 8.91
  per episode (pooled med/P90)  minutes 43 / 50 -> 43 / 50   fights 84 / 114 -> 84 / 114   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 10 / 18 -> 10 / 18   minutes 7 / 10 -> 7 / 10   (n 58 -> 58)
  win rate after return (mean)  first 10: 78% -> 78%   first 20: 83% -> 83%   window at trigger: 43% -> 43%
  zone: ordinary defeats        82 / 102 -> 82 / 102   rewalk hours 1.17 / 1.83 -> 1.22 / 1.91   non-training hours in zone 2.35 / 3.58 -> 2.35 / 3.58
  Lv entering / Lv at boss      44 / 45 -> 44 / 45  /  54 / 61 -> 54 / 61   power at boss 30202 / 40943 -> 30202 / 40943
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 9/10 -> 9/10   attempts 1 / 2 -> 1 / 2   streak 0 / 1 -> 0 / 1   stall h 0.02 / 0.98 -> 0.02 / 0.98
  zone clear h                  25.15 / 32.34 -> 25.15 / 32.34   paired med 0.00 (+0 010 -0)

-- return zone: Ashen Approach
  episodes / run                15 / 21 -> 14 / 27   completed returns 14 / 19 -> 14 / 25   quick retriggers 10 / 15 -> 11 / 21   cancels(approx) 1 / 3 -> 1 / 2
  training hours / run          12.96 / 18.59 -> 6.35 / 11.45   paired med -5.24 (+0 00 -10)   fights / run 1682 / 2329 -> 750 / 1338
  first-return vs retrigger     count 4 / 6 -> 2 / 6 vs 10 / 15 -> 11 / 21   hours 3.43 / 4.87 -> 1.21 / 3.11 vs 9.33 / 13.72 -> 5.14 / 8.78
  per episode (pooled med/P90)  minutes 52 / 57 -> 28 / 34   fights 110 / 129 -> 56 / 65   level progress 1.00 / 1.00 -> 0.50 / 0.80   target med 1.00 -> 0.50
  return -> next trigger        fights 9 / 19 -> 8 / 12   minutes 8 / 13 -> 7 / 9   (n 107 -> 123)
  win rate after return (mean)  first 10: 80% -> 72%   first 20: 82% -> 85%   window at trigger: 45% -> 27%
  zone: ordinary defeats        115 / 121 -> 98 / 205   rewalk hours 1.56 / 2.24 -> 1.00 / 1.72   non-training hours in zone 3.82 / 4.73 -> 3.30 / 4.97
  Lv entering / Lv at boss      54 / 61 -> 54 / 61  /  66 / 73 -> 63 / 66   power at boss 44132 / 57511 -> 40420 / 47853
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 2/10 -> 8/10   attempts 2 / 5 -> 1 / 3   streak 1 / 4 -> 0 / 2   stall h 3.50 / 9.91 -> 0.03 / 4.95
  zone clear h                  42.09 / 46.01 -> 37.07 / 38.13   paired med -6.00 (+0 00 -10)

  zones cleared @24/36/48h      24h 5 / 6 -> 5 / 6 [paired med 0.00 (+0 010 -0)]   36h 6 / 7 -> 6 / 7 [paired med 0.00 (+2 08 -0)]   48h 7 / 7 -> 7 / 7 [paired med 0.00 (+0 010 -0)]
  total defeats                 880 / 1260 -> 1292 / 1591   paired med 356.00 (+10 00 -0)   hordes fought/repelled/lost 5 / 5 -> 4 / 4 / 5 / 5 -> 4 / 4 / 0 / 1 -> 1 / 2

## Road comparison (training, dead time, Grave Knight focus rows with audit, rewalk by zone, other bosses, hordes, paired deltas, counts, early Road)
-- AUTO TRAINING (24h)   med / P90   control -> candidate                                                                                                                                                                                           
triggers                                                                                                                       38 / 42 -> 42 / 48 (+11%)              42 / 47 -> 50 / 55 (+19%)              47 / 58 -> 51 / 55 (+9%)               
completed returns                                                                                                              31 / 36 -> 36 / 42 (+16%)              35 / 38 -> 41 / 46 (+17%)              39 / 47 -> 42 / 48 (+8%)               
cancelled (build change)                                                                                                       6 / 9 -> 6 / 9 (0%)                    8 / 9 -> 8 / 9 (0%)                    8 / 12 -> 7 / 12 (-12%)                
training hours                                                                                                                 23.3 / 26.6 -> 22.2 / 25.4 (-5%)       26.2 / 28.9 -> 25.1 / 28.1 (-4%)       27.4 / 32 -> 22.2 / 24.9 (-19%)        
training share of 24h %                                                                                                        97 / 111 -> 92 / 106 (-5%)             109 / 120 -> 105 / 117 (-4%)           114 / 133 -> 92 / 104 (-19%)           
levels earned training                                                                                                         33.9 / 40 -> 33.3 / 38.5 (-2%)         38.9 / 42.5 -> 38.5 / 42.1 (-1%)       42.5 / 50.8 -> 37.1 / 42.3 (-13%)      
triggers for Stillwater Lagoon                                                                                                 2 / 5 -> 2 / 5 (0%)                    3 / 5 -> 3 / 5 (0%)                    4 / 7 -> 4 / 7 (0%)                    
triggers for Thornwood                                                                                                         6 / 10 -> 6 / 10 (0%)                  7 / 9 -> 7 / 9 (0%)                    6 / 9 -> 6 / 9 (0%)                    
triggers for Ironvein Caverns                                                                                                  5 / 7 -> 5 / 7 (0%)                    6 / 7 -> 6 / 7 (0%)                    5 / 8 -> 5 / 8 (0%)                    
triggers for Emberwaste                                                                                                        9 / 11 -> 9 / 11 (0%)                  10 / 13 -> 10 / 13 (0%)                5 / 9 -> 5 / 9 (0%)                    
triggers for Amberfall Woods                                                                                                   7 / 9 -> 7 / 9 (0%)                    8 / 9 -> 8 / 9 (0%)                    11 / 16 -> 11 / 16 (0%)                
trainings with +1 target                                                                                                       38 / 42 -> 30 / 34 (-21%)              42 / 47 -> 33 / 38 (-21%)              47 / 58 -> 32 / 46 (-32%)              
trainings with +2 target                                                                                                       0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
  +2 trainings for Stillwater Lagoon                                                                                           0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
  +2 trainings for Thornwood                                                                                                   0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
  +2 trainings for Ironvein Caverns                                                                                            0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
  +2 trainings for Emberwaste                                                                                                  0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
  +2 trainings for Amberfall Woods                                                                                             0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
training fights total                                                                                                          2767 / 3285 -> 2646 / 3069 (-4%)       3111 / 3337 -> 3000 / 3253 (-4%)       3468 / 4124 -> 2869 / 3125 (-17%)      
back-to-back +2 in same zone (max run)                                                                                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
-- DEAD TIME outside training                                                                                                                                                                                                                       
ordinary defeats outside training                                                                                              416 / 502 -> 442 / 473 (+6%)           447 / 575 -> 490 / 606 (+10%)          643 / 1046 -> 1008 / 1302 (+57%)       
rewalk fights (ordinary defeats)                                                                                               1466 / 1750 -> 1524 / 1652 (+4%)       1181 / 1356 -> 1152 / 1475 (-2%)       955 / 1203 -> 1020 / 1411 (+7%)        
rewalk fights (boss losses)                                                                                                    81 / 162 -> 99 / 162 (+22%)            54 / 117 -> 63 / 108 (+17%)            27 / 108 -> 18 / 63 (-33%)             
rewalk hours equiv (ordinary)                                                                                                  14.05 / 16.19 -> 14.93 / 16.2 (+6%)    10.93 / 12.69 -> 11.26 / 13.84 (+3%)   8.47 / 10.93 -> 9.47 / 13.33 (+12%)    
rewalk hours equiv (boss)                                                                                                      0.78 / 1.54 -> 0.96 / 1.5 (+24%)       0.5 / 1.12 -> 0.59 / 1.06 (+19%)       0.25 / 0.97 -> 0.18 / 0.58 (-30%)      
total defeats in 24h                                                                                                           559 / 660 -> 615 / 664 (+10%)          634 / 734 -> 698 / 822 (+10%)          880 / 1260 -> 1292 / 1591 (+47%)       
-- ASHEN APPROACH                                                                                                                                                                                                                                   
first-try clear (mean)                                                                                                         0% -> 0%                               88% -> 25% (-72%)                      20% -> 80% (+300%)                     
attempts to clear                                                                                                              3 / 4 -> 5 / 8 (+67%)                  1 / 2 -> 2 / 5 (+100%)                 2 / 5 -> 1 / 3 (-50%)                  
stall h                                                                                                                        3.11 / 4.5 -> 1.77 / 2.03 (-43%)       0.02 / 0.99 -> 1.96 / 4.95 (+9700%)    3.5 / 9.91 -> 0.03 / 4.95 (-99%)       
zone clear h                                                                                                                   46.2 / 46.6 -> 46.43 / 46.94 (+0%)     44.07 / 46.08 -> 44.07 / 47.06 (0%)    42.09 / 46.01 -> 37.07 / 38.13 (-12%)  
Lv entering zone                                                                                                               60 / 62 -> 60 / 62 (0%)                60 / 61 -> 60 / 61 (0%)                54 / 61 -> 54 / 61 (0%)                
Lv at first try                                                                                                                69 / 71 -> 70 / 72 (+1%)               70 / 72 -> 69 / 71 (-1%)               66 / 73 -> 63 / 66 (-5%)               
-- ASHEN APPROACH ATTEMPTS (attempt-level, all attempts)                                                                                                                                                                                            
boss ATK at first attempt (audit)                                                                                              5586 / 5586 -> 5586 / 5586 (0%)        5586 / 5586 -> 5586 / 5586 (0%)        5586 / 5586 -> 5586 / 5586 (0%)        
boss Lv at first attempt                                                                                                       53 / 53 -> 53 / 53 (0%)                53 / 53 -> 53 / 53 (0%)                53 / 53 -> 53 / 53 (0%)                
attempts per run                                                                                                               2 / 7 -> 2 / 10 (0%)                   1 / 2 -> 2 / 5 (+100%)                 2 / 5 -> 1 / 3 (-50%)                  
first attempt in active window (1=yes)                                                                                         0% -> 0%                               78% -> 56% (-28%)                      50% -> 100% (+100%)                    
first attempt party HP %                                                                                                       86 / 100 -> 93 / 100 (+8%)             100 / 100 -> 99 / 100 (-1%)            100 / 100 -> 100 / 100 (0%)            
first attempt charge / surge                                                                                                   50 / 70 -> 60 / 72 (+20%)              63 / 72 -> 50 / 64 (-21%)              46 / 66 -> 43 / 75 (-7%)               
first attempt power                                                                                                            53837 / 55923 -> 56658 / 59083 (+5%)   54264 / 57454 -> 50354 / 54091 (-7%)   44132 / 57511 -> 40420 / 47853 (-8%)   
active-window attempts: win % (pooled)                                                                                         -% -> -%                               88% -> 61% (-31%)                      83% -> 88% (+6%)                       
Auto-Cast attempts: win % (pooled)                                                                                             15% -> 12% (-20%)                      50% -> 6% (-88%)                       0% -> -%                               
Auto-Cast attempts per run                                                                                                     2 / 7 -> 2 / 10 (0%)                   0 / 1 -> 1 / 3                         1 / 3 -> 0 / 0 (-100%)                 
charge telegraphs per attempt (run mean)                                                                                       1.5 / 2 -> 1.13 / 2 (-25%)             1 / 2 -> 1 / 1.6 (0%)                  0.8 / 1 -> 1 / 1 (+25%)                
charge hits per attempt                                                                                                        1.5 / 2 -> 1.13 / 2 (-25%)             0 / 2 -> 1 / 1.6                       0.6 / 1 -> 0 / 1 (-100%)               
charge kills per attempt                                                                                                       1.5 / 2 -> 1.13 / 2 (-25%)             0 / 2 -> 1 / 1.6                       0.6 / 1 -> 0 / 1 (-100%)               
parries + interrupts per attempt                                                                                               0 / 0 -> 0 / 0                         0 / 1 -> 0 / 1                         0 / 0.5 -> 0.33 / 1                    
boss ordinary hits on heroes per attempt                                                                                       5 / 7.7 -> 4.8 / 7 (-5%)               4 / 8 -> 4 / 6 (0%)                    3 / 4 -> 3.7 / 6 (+22%)                
LOSS boss HP left (run median)                                                                                                 66 / 69 -> 67 / 78 (+2%)               64 / 68 -> 65 / 85 (+2%)               64 / 87 -> 1 / 70 (-98%)               
LOSS reached summon % (pooled)                                                                                                 88% -> 57% (-35%)                      100% -> 62% (-38%)                     65% -> 100% (+54%)                     
WIN survivors (run median)                                                                                                     4 / 4 -> 4 / 4 (0%)                    4 / 4 -> 4 / 4 (0%)                    4 / 4 -> 4 / 4 (0%)                    
WIN party HP % (run median)                                                                                                    83 / 97 -> 63 / 91 (-24%)              100 / 100 -> 99 / 100 (-1%)            100 / 100 -> 100 / 100 (0%)            
Ashen max loss streak                                                                                                          3 / 7 -> 2 / 10 (-33%)                 0 / 1 -> 2 / 4                         1 / 4 -> 0 / 2 (-100%)                 
Ashen combat stall h                                                                                                           0.04 / 0.06 -> 0.06 / 0.11 (+50%)      0 / 0.02 -> 0.02 / 0.08                0.02 / 0.06 -> 0 / 0.04 (-100%)        
Ashen retry stall h                                                                                                            3 / 4.42 -> 1.67 / 1.88 (-44%)         0 / 0.95 -> 1.91 / 4.87                3.47 / 9.83 -> 0 / 4.89 (-100%)        
-- REWALK BY ZONE (ordinary defeats outside training): fights | hours in zone (non-training) | rewalk fights per exposure hour                                                                                                                      
Stillwater Lagoon: ordinary rewalk fights                                                                                      132 / 184 -> 132 / 184 (0%)            138 / 178 -> 138 / 178 (0%)            130 / 206 -> 130 / 206 (0%)            
Stillwater Lagoon: ordinary defeats                                                                                            40 / 46 -> 40 / 46 (0%)                40 / 46 -> 40 / 46 (0%)                43 / 52 -> 43 / 52 (0%)                
Stillwater Lagoon: hours in zone (non-training)                                                                                2.14 / 2.91 -> 2.14 / 2.91 (0%)        2.27 / 2.41 -> 2.27 / 2.41 (0%)        2.05 / 2.87 -> 2.05 / 2.87 (0%)        
Stillwater Lagoon: rewalk fights per exposure hour                                                                             60.7 / 75.7 -> 60.7 / 75.7 (0%)        60.4 / 74 -> 60.4 / 74 (0%)            62.8 / 76.8 -> 62.8 / 76.8 (0%)        
Stillwater Lagoon: rewalk hours per exposure hour                                                                              0.58 / 0.72 -> 0.59 / 0.74 (+2%)       0.56 / 0.7 -> 0.57 / 0.72 (+2%)        0.55 / 0.72 -> 0.57 / 0.75 (+3%)       
Thornwood: ordinary rewalk fights                                                                                              223 / 311 -> 223 / 311 (0%)            169 / 276 -> 169 / 276 (0%)            134 / 228 -> 134 / 228 (0%)            
Thornwood: ordinary defeats                                                                                                    68 / 89 -> 68 / 89 (0%)                64 / 84 -> 64 / 84 (0%)                51 / 64 -> 51 / 64 (0%)                
Thornwood: hours in zone (non-training)                                                                                        3.27 / 4.4 -> 3.27 / 4.4 (0%)          2.81 / 3.86 -> 2.81 / 3.86 (0%)        2.27 / 3.09 -> 2.27 / 3.09 (0%)        
Thornwood: rewalk fights per exposure hour                                                                                     68.1 / 75.9 -> 68.1 / 75.9 (0%)        64.5 / 75.3 -> 64.5 / 75.3 (0%)        59.5 / 79.1 -> 59.5 / 79.1 (0%)        
Thornwood: rewalk hours per exposure hour                                                                                      0.65 / 0.71 -> 0.66 / 0.73 (+2%)       0.6 / 0.69 -> 0.6 / 0.71 (+1%)         0.53 / 0.72 -> 0.58 / 0.75 (+10%)      
Ironvein Caverns: ordinary rewalk fights                                                                                       250 / 314 -> 250 / 314 (0%)            140 / 251 -> 140 / 251 (0%)            87 / 164 -> 87 / 164 (0%)              
Ironvein Caverns: ordinary defeats                                                                                             57 / 74 -> 57 / 74 (0%)                50 / 72 -> 50 / 72 (0%)                39 / 49 -> 39 / 49 (0%)                
Ironvein Caverns: hours in zone (non-training)                                                                                 3.83 / 5.2 -> 3.83 / 5.2 (0%)          2.76 / 4.43 -> 2.76 / 4.43 (0%)        1.87 / 2.54 -> 1.87 / 2.54 (0%)        
Ironvein Caverns: rewalk fights per exposure hour                                                                              60.3 / 66.7 -> 60.3 / 66.7 (0%)        52.2 / 61.7 -> 52.2 / 61.7 (0%)        49.7 / 64.5 -> 49.7 / 64.5 (0%)        
Ironvein Caverns: rewalk hours per exposure hour                                                                               0.58 / 0.62 -> 0.59 / 0.64 (+2%)       0.5 / 0.56 -> 0.5 / 0.58 (+1%)         0.43 / 0.59 -> 0.45 / 0.61 (+4%)       
Emberwaste: ordinary rewalk fights                                                                                             289 / 517 -> 289 / 517 (0%)            223 / 285 -> 223 / 285 (0%)            107 / 203 -> 107 / 203 (0%)            
Emberwaste: ordinary defeats                                                                                                   83 / 112 -> 83 / 112 (0%)              81 / 93 -> 81 / 93 (0%)                49 / 72 -> 49 / 72 (0%)                
Emberwaste: hours in zone (non-training)                                                                                       4.73 / 7.05 -> 4.73 / 7.05 (0%)        4.2 / 4.74 -> 4.2 / 4.74 (0%)          2.06 / 2.92 -> 2.06 / 2.92 (0%)        
Emberwaste: rewalk fights per exposure hour                                                                                    63.9 / 73.3 -> 63.9 / 73.3 (0%)        57.5 / 66.2 -> 57.5 / 66.2 (0%)        50.4 / 69.4 -> 50.4 / 69.4 (0%)        
Emberwaste: rewalk hours per exposure hour                                                                                     0.62 / 0.69 -> 0.64 / 0.69 (+2%)       0.54 / 0.63 -> 0.55 / 0.64 (+1%)       0.45 / 0.63 -> 0.47 / 0.66 (+5%)       
Amberfall Woods: ordinary rewalk fights                                                                                        220 / 366 -> 220 / 366 (0%)            137 / 157 -> 137 / 157 (0%)            125 / 206 -> 125 / 206 (0%)            
Amberfall Woods: ordinary defeats                                                                                              65 / 94 -> 65 / 94 (0%)                51 / 64 -> 51 / 64 (0%)                82 / 102 -> 82 / 102 (0%)              
Amberfall Woods: hours in zone (non-training)                                                                                  3.59 / 5.7 -> 3.59 / 5.7 (0%)          2.3 / 2.68 -> 2.3 / 2.68 (0%)          2.35 / 3.58 -> 2.35 / 3.58 (0%)        
Amberfall Woods: rewalk fights per exposure hour                                                                               61.8 / 69.1 -> 61.8 / 69.1 (0%)        53.7 / 64.8 -> 53.7 / 64.8 (0%)        60.1 / 70.4 -> 60.1 / 70.4 (0%)        
Amberfall Woods: rewalk hours per exposure hour                                                                                0.59 / 0.62 -> 0.6 / 0.64 (+2%)        0.51 / 0.59 -> 0.53 / 0.61 (+3%)       0.51 / 0.61 -> 0.53 / 0.64 (+5%)       
Ashen Approach: ordinary rewalk fights                                                                                         256 / 440 -> 314 / 423 (+23%)          152 / 233 -> 155 / 337 (+2%)           166 / 247 -> 109 / 189 (-34%)          
Ashen Approach: ordinary defeats                                                                                               69 / 106 -> 104 / 123 (+51%)           62 / 76 -> 104 / 135 (+68%)            115 / 121 -> 98 / 205 (-15%)           
Ashen Approach: hours in zone (non-training)                                                                                   4.44 / 7.62 -> 5.8 / 7.47 (+31%)       3.02 / 4.12 -> 3.75 / 6.62 (+24%)      3.82 / 4.73 -> 3.3 / 4.97 (-14%)       
Ashen Approach: rewalk fights per exposure hour                                                                                53.5 / 64 -> 56.6 / 59.6 (+6%)         51.3 / 56.5 -> 43.3 / 53.5 (-15%)      46.1 / 52.2 -> 38.4 / 50.4 (-17%)      
Ashen Approach: rewalk hours per exposure hour                                                                                 0.51 / 0.61 -> 0.53 / 0.6 (+3%)        0.47 / 0.54 -> 0.41 / 0.52 (-13%)      0.42 / 0.47 -> 0.36 / 0.46 (-14%)      
-- OTHER BOSSES first-try % (mean) / attempts med                                                                                                                                                                                                   
Stillwater Lagoon first-try %                                                                                                  40% -> 40% (0%)                        20% -> 20% (0%)                        30% -> 30% (0%)                        
Stillwater Lagoon attempts                                                                                                     2 / 5 -> 2 / 5 (0%)                    2 / 4 -> 2 / 4 (0%)                    2 / 4 -> 2 / 4 (0%)                    
Stillwater Lagoon stall h                                                                                                      0.11 / 1.06 -> 0.11 / 1.06 (0%)        0.52 / 0.86 -> 0.52 / 0.86 (0%)        0.38 / 0.88 -> 0.38 / 0.88 (0%)        
Thornwood first-try %                                                                                                          50% -> 50% (0%)                        60% -> 60% (0%)                        70% -> 70% (0%)                        
Thornwood attempts                                                                                                             1 / 3 -> 1 / 3 (0%)                    1 / 5 -> 1 / 5 (0%)                    1 / 2 -> 1 / 2 (0%)                    
Thornwood stall h                                                                                                              0.02 / 1.66 -> 0.02 / 1.66 (0%)        0.03 / 1.4 -> 0.03 / 1.4 (0%)          0.02 / 0.86 -> 0.02 / 0.86 (0%)        
Emberwaste first-try %                                                                                                         20% -> 20% (0%)                        30% -> 30% (0%)                        60% -> 60% (0%)                        
Emberwaste attempts                                                                                                            3 / 6 -> 3 / 6 (0%)                    2 / 8 -> 2 / 8 (0%)                    1 / 2 -> 1 / 2 (0%)                    
Emberwaste stall h                                                                                                             1.5 / 3.3 -> 1.5 / 3.3 (0%)            1.99 / 5.92 -> 1.99 / 5.92 (0%)        0.03 / 2.95 -> 0.03 / 2.95 (0%)        
Amberfall Woods first-try %                                                                                                    10% -> 10% (0%)                        60% -> 60% (0%)                        90% -> 90% (0%)                        
Amberfall Woods attempts                                                                                                       3 / 8 -> 3 / 8 (0%)                    1 / 4 -> 1 / 4 (0%)                    1 / 2 -> 1 / 2 (0%)                    
Amberfall Woods stall h                                                                                                        1.8 / 3.3 -> 1.8 / 3.3 (0%)            0.01 / 6.93 -> 0.01 / 6.93 (0%)        0.02 / 0.98 -> 0.02 / 0.98 (0%)        
Ashen Approach first-try %                                                                                                     0% -> 0%                               88% -> 25% (-72%)                      20% -> 80% (+300%)                     
Ashen Approach attempts                                                                                                        3 / 4 -> 5 / 8 (+67%)                  1 / 2 -> 2 / 5 (+100%)                 2 / 5 -> 1 / 3 (-50%)                  
Ashen Approach stall h                                                                                                         3.11 / 4.5 -> 1.77 / 2.03 (-43%)       0.02 / 0.99 -> 1.96 / 4.95 (+9700%)    3.5 / 9.91 -> 0.03 / 4.95 (-99%)       
-- HORDES / CATACOMBS / DAMAGE                                                                                                                                                                                                                      
hordes fought (manual)                                                                                                         4 / 5 -> 4 / 5 (0%)                    4 / 5 -> 5 / 5 (+25%)                  5 / 5 -> 4 / 4 (-20%)                  
hordes repelled                                                                                                                4 / 5 -> 4 / 5 (0%)                    4 / 5 -> 5 / 5 (+25%)                  5 / 5 -> 4 / 4 (-20%)                  
hordes lost                                                                                                                    1 / 3 -> 1 / 3 (0%)                    0 / 2 -> 0 / 1                         0 / 1 -> 1 / 2                         
catacomb best floor                                                                                                            3 / 5 -> 3 / 5 (0%)                    4 / 5 -> 4 / 5 (0%)                    3 / 5 -> 3 / 5 (0%)                    
catacomb runs                                                                                                                  3 / 3 -> 3 / 3 (0%)                    3 / 3 -> 3 / 3 (0%)                    3 / 3 -> 3 / 3 (0%)                    
ability casts / h                                                                                                              539 / 549 -> 538 / 548 (0%)            554 / 568 -> 555 / 566 (+0%)           580 / 601 -> 575 / 599 (-1%)           
dmg share basic %                                                                                                              45 / 47 -> 45 / 47 (0%)                42 / 43 -> 41 / 43 (-1%)               36 / 38 -> 34 / 36 (-4%)               
dmg share ability %                                                                                                            55 / 57 -> 55 / 57 (+1%)               55 / 57 -> 55 / 57 (0%)                56 / 60 -> 56 / 59 (+0%)               
dmg share tap %                                                                                                                0 / 0 -> 0 / 0                         2 / 2 -> 2 / 2 (0%)                    6 / 6 -> 6 / 6 (+11%)                  
dmg share surge %                                                                                                              0 / 0 -> 0 / 0                         1 / 1 -> 1 / 1 (0%)                    3 / 3 -> 3 / 3 (+12%)                  
-- PAIRED PER-SEED DELTAS (candidate minus control): median delta | +/0/- counts                                                                                                                                                                    
Ashen attempts                                                                                                                 -1 | +1 00 -1 (n2)                     1 | +6 01 -1 (n8)                      -1 | +1 02 -7 (n10)                    
Ashen stall h                                                                                                                  -2.95 | +1 00 -1 (n2)                  1.94 | +6 01 -1 (n8)                   -1.9 | +0 02 -8 (n10)                  
Ashen clear h                                                                                                                  -0.27 | +1 00 -1 (n2)                  -0.01 | +4 00 -4 (n8)                  -6 | +0 00 -10 (n10)                   
zones cleared @24h                                                                                                             0 | +1 08 -1 (n10)                     0 | +0 010 -0 (n10)                    0 | +0 010 -0 (n10)                    
zones cleared @20h                                                                                                             0 | +0 010 -0 (n10)                    0 | +0 010 -0 (n10)                    0 | +0 010 -0 (n10)                    
ordinary rewalk fights                                                                                                         61 | +8 00 -2 (n10)                    38 | +6 00 -4 (n10)                    80 | +8 00 -2 (n10)                    
ordinary rewalk hours                                                                                                          0.89 | +8 00 -2 (n10)                  0.42 | +6 00 -4 (n10)                  1.01 | +9 00 -1 (n10)                  
total defeats                                                                                                                  40 | +10 00 -0 (n10)                   62 | +10 00 -0 (n10)                   356 | +10 00 -0 (n10)                  
-- COUNTS WITH DENOMINATORS                                                                                                                                                                                                                         
Ashen first-try clears / runs                                                                                                  0/3 -> 0/3                             7/8 -> 2/8                             2/10 -> 8/10                           
Auto-Cast attempts: wins / attempts                                                                                            3/24 -> 3/29                           1/2 -> 1/12                            0/10 -> 0/0                            
active-window attempts: wins / attempts                                                                                        0/0 -> 0/0                             7/8 -> 7/13                            10/14 -> 10/13                         
runs reaching a 6th zone by 24h / runs                                                                                         10/10 -> 10/10                         10/10 -> 10/10                         10/10 -> 10/10                         
6th-zone clear h (med of those reaching)                                                                                       34.77 -> 34.77                         32.07 -> 32.07                         25.15 -> 25.15                         
zones cleared @20h (med)                                                                                                       4 -> 4                                 4 -> 4                                 5 -> 5                                 
-- EARLY ROAD CLEAR TIMES (h)                                                                                                                                                                                                                       
Stillwater Lagoon                                                                                                              2.79 / 3.43 -> 2.79 / 3.43 (0%)        2.83 / 3.09 -> 2.83 / 3.09 (0%)        2.86 / 3.43 -> 2.86 / 3.43 (0%)        
Thornwood                                                                                                                      7.89 / 8.61 -> 7.89 / 8.61 (0%)        7.89 / 9.07 -> 7.89 / 9.07 (0%)        6.92 / 7.09 -> 6.92 / 7.09 (0%)        
Ironvein Caverns                                                                                                               14.77 / 15.73 -> 14.77 / 15.73 (0%)    14.09 / 16.77 -> 14.09 / 16.77 (0%)    11.11 / 13.16 -> 11.11 / 13.16 (0%)    
Emberwaste                                                                                                                     24.69 / 26.99 -> 24.69 / 26.99 (0%)    24.1 / 26.08 -> 24.1 / 26.08 (0%)      16.14 / 19.1 -> 16.14 / 19.1 (0%)      
zones cleared @24h                                                                                                             6 / 7 -> 6 / 7 (0%)                    7 / 7 -> 7 / 7 (0%)                    7 / 7 -> 7 / 7 (0%)                    
party Lv @24h                                                                                                                  72 / 74 -> 72 / 74 (0%)                72 / 75 -> 72 / 74 (0%)                74 / 76 -> 68 / 71 (-8%)               

## Per-seed detail (Amberfall, Ashen Approach, Ashen Keep) and horizons

== idle  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p19c -> batch_out_p19x)
31  3 | 0.71 | 2 | auto/L/61 | 1/3 | 0/0 | 37.2 | Lv 52            -> 3 | 0.71 | 2 | auto/L/61 | 1/3 | 0/0 | 37.2 | Lv 52
32  3 | 2.68 | 2 | auto/L/58 | 1/3 | 0/0 | 36.7 | Lv 51            -> 3 | 2.68 | 2 | auto/L/58 | 1/3 | 0/0 | 36.7 | Lv 51
33  4 | 2.92 | 3 | auto/L/58 | 1/4 | 0/0 | 35.8 | Lv 49            -> 4 | 2.92 | 3 | auto/L/58 | 1/4 | 0/0 | 35.8 | Lv 49
34  4 | 1.54 | 3 | auto/L/58 | 1/4 | 0/0 | 33.5 | Lv 51            -> 4 | 1.54 | 3 | auto/L/58 | 1/4 | 0/0 | 33.5 | Lv 51
35  8 | 2.03 | 7 | auto/L/60 | 1/8 | 0/0 | 37.1 | Lv 51            -> 8 | 2.03 | 7 | auto/L/60 | 1/8 | 0/0 | 37.1 | Lv 51
36  2 | 1.80 | 1 | auto/L/59 | 1/2 | 0/0 | 33.2 | Lv 50            -> 2 | 1.80 | 1 | auto/L/59 | 1/2 | 0/0 | 33.2 | Lv 50
37  5 | 3.30 | 4 | auto/L/57 | 1/5 | 0/0 | 34.4 | Lv 50            -> 5 | 3.30 | 4 | auto/L/57 | 1/5 | 0/0 | 34.4 | Lv 50
38  3 | 2.07 | 2 | auto/L/58 | 1/3 | 0/0 | 35.2 | Lv 52            -> 3 | 2.07 | 2 | auto/L/58 | 1/3 | 0/0 | 35.2 | Lv 52
39  2 | 0.12 | 1 | auto/L/61 | 1/2 | 0/0 | 34.8 | Lv 51            -> 2 | 0.12 | 1 | auto/L/61 | 1/2 | 0/0 | 34.8 | Lv 51
40  1 | 0.03 | 0 | auto/W/60 | 1/1 | 0/0 | 33.0 | Lv 49            -> 1 | 0.03 | 0 | auto/W/60 | 1/1 | 0/0 | 33.0 | Lv 49
   batch_out_p19c  reached 10 attempted 10 | losses n=25 bossHP left q25/50/75 0.32/0.48/0.55 | <=25% 5 | summoned 23 | dur med 69s | charge kills/loss 2.52 | boss hits/loss 7.6 | wins n=10 survivors med 4 partyHP med 96%
   batch_out_p19x  reached 10 attempted 10 | losses n=25 bossHP left q25/50/75 0.32/0.48/0.55 | <=25% 5 | summoned 23 | dur med 69s | charge kills/loss 2.52 | boss hits/loss 7.6 | wins n=10 survivors med 4 partyHP med 96%

== idle  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p19c -> batch_out_p19x)
31  entered, no boss attempt | Lv 62                               -> entered, no boss attempt | Lv 62
32  entered, no boss attempt | Lv 61                               -> entered, no boss attempt | Lv 61
33  null | - | 3 | auto/L/71 | 0/3 | 0/0 | - | Lv 61               -> null | - | 1 | auto/L/71 | 0/2 | 0/0 | - | Lv 61
34  null | - | 7 | auto/L/70 | 0/7 | 0/0 | - | Lv 59               -> 5 | 1.77 | 4 | auto/L/69 | 1/5 | 0/0 | 46.4 | Lv 59
35  entered, no boss attempt | Lv 62                               -> entered, no boss attempt | Lv 62
36  4 | 4.50 | 3 | auto/L/69 | 1/4 | 0/0 | 46.2 | Lv 60            -> null | - | 10 | auto/L/72 | 0/10 | 0/0 | - | Lv 60
37  3 | 3.11 | 2 | auto/L/69 | 1/3 | 0/0 | 46.6 | Lv 60            -> 2 | 0.16 | 1 | auto/L/71 | 1/2 | 0/0 | 46.3 | Lv 60
38  null | - | 1 | auto/L/70 | 0/1 | 0/0 | - | Lv 59               -> null | - | 1 | auto/L/70 | 0/1 | 0/0 | - | Lv 59
39  null | - | 4 | auto/L/69 | 0/4 | 0/0 | - | Lv 61               -> null | - | 2 | auto/L/70 | 0/2 | 0/0 | - | Lv 61
40  2 | 2.00 | 1 | auto/L/69 | 1/2 | 0/0 | 44.4 | Lv 60            -> 8 | 2.03 | 7 | auto/L/70 | 1/8 | 0/0 | 46.9 | Lv 60
   batch_out_p19c  reached 10 attempted 7 | losses n=21 bossHP left q25/50/75 0.60/0.66/0.69 | <=25% 1 | summoned 18 | dur med 60s | charge kills/loss 1.33 | boss hits/loss 4.9 | wins n=3 survivors med 4 partyHP med 83%
   batch_out_p19x  reached 10 attempted 7 | losses n=27 bossHP left q25/50/75 0.61/0.66/0.68 | <=25% 1 | summoned 20 | dur med 55s | charge kills/loss 1.04 | boss hits/loss 4.5 | wins n=3 survivors med 4 partyHP med 63%

== idle  Ashen Keep  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p19c -> batch_out_p19x)
31  not reached | Lv -                                             -> not reached | Lv -
32  not reached | Lv -                                             -> not reached | Lv -
33  not reached | Lv -                                             -> not reached | Lv -
34  not reached | Lv -                                             -> entered, no boss attempt | Lv 71
35  not reached | Lv -                                             -> not reached | Lv -
36  entered, no boss attempt | Lv 73                               -> not reached | Lv -
37  entered, no boss attempt | Lv 72                               -> entered, no boss attempt | Lv 71
38  not reached | Lv -                                             -> not reached | Lv -
39  not reached | Lv -                                             -> not reached | Lv -
40  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 72
   batch_out_p19c  reached 3 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%
   batch_out_p19x  reached 3 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%

== idle  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  4 / 4 -> 4 / 4   paired +0 010 -0
   @36h  6 / 6 -> 6 / 6   paired +0 010 -0
   @48h  6 / 7 -> 6 / 7   paired +1 08 -1
   total defeats med 559 -> 615   training h med 23.3 -> 22.2

== light  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p19c -> batch_out_p19x)
31  1 | 0.01 | 0 | active/W/59 | 0/0 | 1/1 | 32.1 | Lv 50          -> 1 | 0.01 | 0 | active/W/59 | 0/0 | 1/1 | 32.1 | Lv 50
32  1 | 0.01 | 0 | active/W/60 | 0/0 | 1/1 | 33.1 | Lv 50          -> 1 | 0.01 | 0 | active/W/60 | 0/0 | 1/1 | 33.1 | Lv 50
33  1 | 0.01 | 0 | active/W/59 | 0/0 | 1/1 | 33.0 | Lv 50          -> 1 | 0.01 | 0 | active/W/59 | 0/0 | 1/1 | 33.0 | Lv 50
34  2 | 1.25 | 1 | auto/L/60 | 0/1 | 1/1 | 36.1 | Lv 51            -> 2 | 1.25 | 1 | auto/L/60 | 0/1 | 1/1 | 36.1 | Lv 51
35  3 | 3.52 | 2 | auto/L/56 | 1/3 | 0/0 | 31.8 | Lv 50            -> 3 | 3.52 | 2 | auto/L/56 | 1/3 | 0/0 | 31.8 | Lv 50
36  1 | 0.02 | 0 | active/W/57 | 0/0 | 1/1 | 30.1 | Lv 49          -> 1 | 0.02 | 0 | active/W/57 | 0/0 | 1/1 | 30.1 | Lv 49
37  4 | 6.93 | 3 | active/L/54 | 1/3 | 0/1 | 34.0 | Lv 51          -> 4 | 6.93 | 3 | active/L/54 | 1/3 | 0/1 | 34.0 | Lv 51
38  1 | 0.01 | 0 | active/W/58 | 0/0 | 1/1 | 32.0 | Lv 51          -> 1 | 0.01 | 0 | active/W/58 | 0/0 | 1/1 | 32.0 | Lv 51
39  1 | 0.01 | 0 | active/W/60 | 0/0 | 1/1 | 32.0 | Lv 50          -> 1 | 0.01 | 0 | active/W/60 | 0/0 | 1/1 | 32.0 | Lv 50
40  2 | 2.00 | 1 | active/L/58 | 0/0 | 1/2 | 35.1 | Lv 51          -> 2 | 2.00 | 1 | active/L/58 | 0/0 | 1/2 | 35.1 | Lv 51
   batch_out_p19c  reached 10 attempted 10 | losses n=7 bossHP left q25/50/75 0.35/0.56/0.57 | <=25% 1 | summoned 7 | dur med 62s | charge kills/loss 2.29 | boss hits/loss 6.3 | wins n=10 survivors med 4 partyHP med 96%
   batch_out_p19x  reached 10 attempted 10 | losses n=7 bossHP left q25/50/75 0.35/0.56/0.57 | <=25% 1 | summoned 7 | dur med 62s | charge kills/loss 2.29 | boss hits/loss 6.3 | wins n=10 survivors med 4 partyHP med 96%

== light  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p19c -> batch_out_p19x)
31  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 44.1 | Lv 59          -> 1 | 0.02 | 0 | active/W/69 | 0/0 | 1/1 | 44.1 | Lv 59
32  1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 44.0 | Lv 60          -> 5 | 4.53 | 4 | auto/L/68 | 1/3 | 0/2 | 45.6 | Lv 60
33  1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 45.1 | Lv 60          -> 2 | 1.00 | 1 | active/L/69 | 0/0 | 1/2 | 44.1 | Lv 60
34  entered, no boss attempt | Lv 61                               -> null | - | 3 | active/L/68 | 0/2 | 0/1 | - | Lv 61
35  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 42.0 | Lv 60          -> 2 | 2.92 | 1 | auto/L/67 | 0/1 | 1/1 | 42.0 | Lv 60
36  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 44.1 | Lv 57          -> 3 | 3.00 | 2 | active/L/69 | 0/1 | 1/2 | 46.1 | Lv 57
37  2 | 0.99 | 1 | auto/L/71 | 0/1 | 1/1 | 46.1 | Lv 61            -> 1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 46.1 | Lv 61
38  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 46.1 | Lv 58          -> 3 | 1.96 | 2 | auto/L/69 | 0/2 | 1/1 | 47.1 | Lv 58
39  1 | 0.04 | 0 | auto/W/72 | 1/1 | 0/0 | 42.7 | Lv 61            -> 5 | 4.95 | 4 | auto/L/67 | 0/3 | 1/2 | 43.1 | Lv 61
40  null | - | 1 | active/L/70 | 0/0 | 0/1 | - | Lv 60             -> entered, no boss attempt | Lv 60
   batch_out_p19c  reached 10 attempted 9 | losses n=2 bossHP left q25/50/75 0.64/0.64/0.64 | <=25% 0 | summoned 2 | dur med 56s | charge kills/loss 1.00 | boss hits/loss 5.0 | wins n=8 survivors med 4 partyHP med 100%
   batch_out_p19x  reached 10 attempted 9 | losses n=17 bossHP left q25/50/75 0.63/0.67/0.74 | <=25% 1 | summoned 12 | dur med 58s | charge kills/loss 1.35 | boss hits/loss 4.4 | wins n=8 survivors med 4 partyHP med 99%

== light  Ashen Keep  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p19c -> batch_out_p19x)
31  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 69
32  entered, no boss attempt | Lv 71                               -> entered, no boss attempt | Lv 72
33  entered, no boss attempt | Lv 71                               -> entered, no boss attempt | Lv 69
34  not reached | Lv -                                             -> not reached | Lv -
35  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 69
36  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 71
37  entered, no boss attempt | Lv 72                               -> entered, no boss attempt | Lv 71
38  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 70
39  entered, no boss attempt | Lv 72                               -> entered, no boss attempt | Lv 71
40  not reached | Lv -                                             -> not reached | Lv -
   batch_out_p19c  reached 8 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%
   batch_out_p19x  reached 8 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%

== light  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  4 / 5 -> 4 / 5   paired +0 010 -0
   @36h  6 / 6 -> 6 / 6   paired +0 010 -0
   @48h  7 / 7 -> 7 / 7   paired +0 010 -0
   total defeats med 634 -> 698   training h med 26.2 -> 25.1

== casual  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p19c -> batch_out_p19x)
31  1 | 0.02 | 0 | active/W/54 | 0/0 | 1/1 | 25.1 | Lv 41          -> 1 | 0.02 | 0 | active/W/54 | 0/0 | 1/1 | 25.1 | Lv 41
32  1 | 0.02 | 0 | active/W/55 | 0/0 | 1/1 | 29.1 | Lv 44          -> 1 | 0.02 | 0 | active/W/55 | 0/0 | 1/1 | 29.1 | Lv 44
33  1 | 0.02 | 0 | active/W/56 | 0/0 | 1/1 | 27.2 | Lv 41          -> 1 | 0.02 | 0 | active/W/56 | 0/0 | 1/1 | 27.2 | Lv 41
34  1 | 0.03 | 0 | auto/W/61 | 1/1 | 0/0 | 31.9 | Lv 45            -> 1 | 0.03 | 0 | auto/W/61 | 1/1 | 0/0 | 31.9 | Lv 45
35  1 | 0.02 | 0 | active/W/49 | 0/0 | 1/1 | 22.1 | Lv 41          -> 1 | 0.02 | 0 | active/W/49 | 0/0 | 1/1 | 22.1 | Lv 41
36  1 | 0.03 | 0 | auto/W/61 | 1/1 | 0/0 | 32.3 | Lv 45            -> 1 | 0.03 | 0 | auto/W/61 | 1/1 | 0/0 | 32.3 | Lv 45
37  1 | 0.02 | 0 | active/W/49 | 0/0 | 1/1 | 21.1 | Lv 44          -> 1 | 0.02 | 0 | active/W/49 | 0/0 | 1/1 | 21.1 | Lv 44
38  2 | 0.98 | 1 | auto/L/56 | 0/1 | 1/1 | 26.2 | Lv 44            -> 2 | 0.98 | 1 | auto/L/56 | 0/1 | 1/1 | 26.2 | Lv 44
39  1 | 0.01 | 0 | active/W/54 | 0/0 | 1/1 | 24.1 | Lv 42          -> 1 | 0.01 | 0 | active/W/54 | 0/0 | 1/1 | 24.1 | Lv 42
40  1 | 0.03 | 0 | active/W/50 | 0/0 | 1/1 | 22.2 | Lv 45          -> 1 | 0.03 | 0 | active/W/50 | 0/0 | 1/1 | 22.2 | Lv 45
   batch_out_p19c  reached 10 attempted 10 | losses n=1 bossHP left q25/50/75 0.48/0.48/0.48 | <=25% 0 | summoned 1 | dur med 64s | charge kills/loss 3.00 | boss hits/loss 6.0 | wins n=10 survivors med 4 partyHP med 95%
   batch_out_p19x  reached 10 attempted 10 | losses n=1 bossHP left q25/50/75 0.48/0.48/0.48 | <=25% 0 | summoned 1 | dur med 64s | charge kills/loss 3.00 | boss hits/loss 6.0 | wins n=10 survivors med 4 partyHP med 95%

== casual  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p19c -> batch_out_p19x)
31  2 | 6.85 | 1 | auto/L/64 | 0/1 | 1/1 | 42.1 | Lv 54            -> 3 | 4.95 | 2 | active/L/61 | 0/0 | 1/3 | 38.1 | Lv 54
32  2 | 6.91 | 1 | auto/L/64 | 0/1 | 1/1 | 45.1 | Lv 55            -> 1 | 0.03 | 0 | active/W/63 | 0/0 | 1/1 | 38.1 | Lv 55
33  2 | 0.24 | 1 | auto/L/73 | 0/1 | 1/1 | 44.1 | Lv 56            -> 1 | 0.03 | 0 | active/W/59 | 0/0 | 1/1 | 31.1 | Lv 56
34  1 | 0.02 | 0 | active/W/72 | 0/0 | 1/1 | 42.1 | Lv 61          -> 1 | 0.02 | 0 | active/W/65 | 0/0 | 1/1 | 36.1 | Lv 61
35  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 41.0 | Lv 49          -> 1 | 0.02 | 0 | active/W/65 | 0/0 | 1/1 | 38.1 | Lv 49
36  2 | 3.50 | 1 | auto/L/72 | 0/1 | 1/1 | 46.0 | Lv 61            -> 1 | 0.02 | 0 | active/W/66 | 0/0 | 1/1 | 37.1 | Lv 61
37  2 | 0.40 | 1 | auto/L/69 | 0/1 | 1/1 | 39.1 | Lv 49            -> 1 | 0.03 | 0 | active/W/61 | 0/0 | 1/1 | 33.1 | Lv 49
38  4 | 4.97 | 3 | active/L/62 | 0/1 | 1/3 | 35.1 | Lv 57          -> 2 | 4.91 | 1 | active/L/62 | 0/0 | 1/2 | 35.1 | Lv 57
39  5 | 9.91 | 4 | active/L/63 | 0/3 | 1/2 | 43.1 | Lv 54          -> 1 | 0.02 | 0 | active/W/66 | 0/0 | 1/1 | 37.1 | Lv 54
40  3 | 6.89 | 2 | active/L/66 | 0/1 | 1/2 | 45.0 | Lv 50          -> 1 | 0.03 | 0 | active/W/64 | 0/0 | 1/1 | 38.1 | Lv 50
   batch_out_p19c  reached 10 attempted 10 | losses n=14 bossHP left q25/50/75 0.62/0.64/0.79 | <=25% 1 | summoned 9 | dur med 51s | charge kills/loss 1.21 | boss hits/loss 4.0 | wins n=10 survivors med 4 partyHP med 100%
   batch_out_p19x  reached 10 attempted 10 | losses n=3 bossHP left q25/50/75 0.01/0.69/0.69 | <=25% 1 | summoned 3 | dur med 60s | charge kills/loss 1.00 | boss hits/loss 3.7 | wins n=10 survivors med 4 partyHP med 100%

== casual  Ashen Keep  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p19c -> batch_out_p19x)
31  entered, no boss attempt | Lv 71                               -> null | - | 1 | auto/L/70 | 0/1 | 0/0 | - | Lv 66
32  entered, no boss attempt | Lv 71                               -> entered, no boss attempt | Lv 63
33  entered, no boss attempt | Lv 73                               -> entered, no boss attempt | Lv 59
34  null | - | 1 | active/L/74 | 0/0 | 0/1 | - | Lv 72             -> null | - | 1 | active/L/68 | 0/0 | 0/1 | - | Lv 65
35  null | - | 1 | active/L/72 | 0/0 | 0/1 | - | Lv 70             -> entered, no boss attempt | Lv 65
36  entered, no boss attempt | Lv 75                               -> entered, no boss attempt | Lv 66
37  entered, no boss attempt | Lv 69                               -> entered, no boss attempt | Lv 61
38  null | - | 3 | active/L/71 | 0/0 | 0/3 | - | Lv 68             -> entered, no boss attempt | Lv 67
39  null | - | 2 | active/L/75 | 0/0 | 0/2 | - | Lv 74             -> entered, no boss attempt | Lv 66
40  entered, no boss attempt | Lv 73                               -> entered, no boss attempt | Lv 65
   batch_out_p19c  reached 10 attempted 4 | losses n=7 bossHP left q25/50/75 0.85/0.87/0.87 | <=25% 0 | summoned 0 | dur med 15s | charge kills/loss 0.00 | boss hits/loss 5.4 | wins n=0 survivors med - partyHP med 0%
   batch_out_p19x  reached 10 attempted 2 | losses n=2 bossHP left q25/50/75 0.91/0.91/0.91 | <=25% 0 | summoned 0 | dur med 12s | charge kills/loss 0.00 | boss hits/loss 5.5 | wins n=0 survivors med - partyHP med 0%

== casual  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  5 / 6 -> 5 / 6   paired +0 010 -0
   @36h  6 / 6 -> 6 / 7   paired +2 08 -0
   @48h  7 / 7 -> 7 / 7   paired +0 010 -0
   total defeats med 880 -> 1292   training h med 27.4 -> 22.2

## Whole-Road triage, control arm (production)

=== IDLE  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.4          0.3       0.3     70% n10   1/2         0      0.03    0.03         0             0.06     4.9
Stillwater Lagoon 10/10       6        2.8/3.4          2.1       2.3     40% n10   2/5         1      0.11    1.26         0.08          1.71     18.1
Thornwood         10/10       15       7.9/8.6          3.3       3.5     50% n10   1/3         0      0.02    2.11         0             3.9      20.2
Ironvein Caverns  10/10       29       14.8/15.7        3.8       6       40% n10   2/4         1      0.58    2.31         0.09          5.01     14.9
Emberwaste        10/10       39       24.7/27          4.7       8.1     20% n10   3/6         2      1.5     2.61         0.17          8.53     17.2
Amberfall Woods   10/10       51       34.8/37.2        3.6       3       10% n10   3/8         2      1.8     2.16         0.18          8.56     18.9
Ashen Approach    10/3        60       46.2/46.6        4.4       0       0% n3     3/4         3      3.11    2.45         0.09          9.71     16
Ashen Keep        3/0         72       -                1.8       0       -         -           -      -       1            0             0        12.3

=== LIGHT  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.5          0.3       0.3     80% n10   1/2         0      0.03    0.06         0             0.06     9.2
Stillwater Lagoon 10/10       6        2.8/3.1          2.3       2.7     20% n10   2/4         1      0.52    1.26         0.08          1.73     17.1
Thornwood         10/10       15       7.9/9.1          2.8       4       60% n10   1/5         0      0.03    1.57         0             3.76     21.4
Ironvein Caverns  10/10       29       14.1/16.8        2.8       6.5     20% n10   2/5         1      0.61    1.33         0.09          4.86     16.9
Emberwaste        10/10       38       24.1/26.1        4.2       8.4     30% n10   2/8         1      1.99    2.08         0.09          8.44     19.9
Amberfall Woods   10/10       50       32.1/36.1        2.3       3.3     60% n10   1/4         0      0.01    1.31         0             7.91     22.5
Ashen Approach    10/8        60       44.1/46.1        3         0       88% n8    1/2         0      0.02    1.42         0             10.25    19.2
Ashen Keep        8/0         70       -                3.9       0       -         -           -      -       1.61         0             1.35     39.3

=== CASUAL  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.4          0.3       0.4     60% n10   1/2         0      0.03    0            0             0.04     4.6
Stillwater Lagoon 10/10       6        2.9/3.4          2.1       2.6     30% n10   2/4         1      0.38    1.12         0.08          1.65     19
Thornwood         10/10       15       6.9/7.1          2.3       3.8     70% n10   1/2         0      0.02    1.15         0             2.82     22.4
Ironvein Caverns  10/10       27       11.1/13.2        1.9       7.1     70% n10   1/3         0      0.02    0.77         0             3.09     20.8
Emberwaste        10/10       35       16.1/19.1        2.1       9       60% n10   1/2         0      0.03    0.96         0             4.79     25
Amberfall Woods   10/10       44       25.1/32.3        2.3       4.5     90% n10   1/2         0      0.02    1.17         0             8.75     28.5
Ashen Approach    10/10       54       42.1/46          3.8       0       20% n10   2/5         1      3.5     1.56         0.08          14.41    25.2
Ashen Keep        10/0        71       -                4.9       0       -         -/-         1      -       1.05         0             1.05     51.4

=== RANK by median burden hours (ordinary rewalk + boss rewalk + training for the zone + boss combat), realistic profiles, zones cleared by >=10 runs
casual Ashen Approach       burden 14.41h  (train-for-zone 12.96 train-in-zone 0 ord-rewalk 1.56 boss-rewalk 0.08)  hours-in-zone 3.8  boss 1st 20% att 2/5 stall 3.5  cleared 10/10
casual Amberfall Woods      burden 8.75h  (train-for-zone 7.09 train-in-zone 4.53 ord-rewalk 1.17 boss-rewalk 0)  hours-in-zone 2.3  boss 1st 90% att 1/2 stall 0.02  cleared 10/10
idle Amberfall Woods        burden 8.56h  (train-for-zone 6.21 train-in-zone 3.02 ord-rewalk 2.16 boss-rewalk 0.18)  hours-in-zone 3.6  boss 1st 10% att 3/8 stall 1.8  cleared 10/10
idle Emberwaste             burden 8.53h  (train-for-zone 5.09 train-in-zone 8.11 ord-rewalk 2.61 boss-rewalk 0.17)  hours-in-zone 4.7  boss 1st 20% att 3/6 stall 1.5  cleared 10/10
light Emberwaste            burden 8.44h  (train-for-zone 5.74 train-in-zone 8.44 ord-rewalk 2.08 boss-rewalk 0.09)  hours-in-zone 4.2  boss 1st 30% att 2/8 stall 1.99  cleared 10/10
light Amberfall Woods       burden 7.91h  (train-for-zone 6.65 train-in-zone 3.29 ord-rewalk 1.31 boss-rewalk 0)  hours-in-zone 2.3  boss 1st 60% att 1/4 stall 0.01  cleared 10/10
idle Ironvein Caverns       burden 5.01h  (train-for-zone 2.64 train-in-zone 6 ord-rewalk 2.31 boss-rewalk 0.09)  hours-in-zone 3.8  boss 1st 40% att 2/4 stall 0.58  cleared 10/10
light Ironvein Caverns      burden 4.86h  (train-for-zone 3.31 train-in-zone 6.49 ord-rewalk 1.33 boss-rewalk 0.09)  hours-in-zone 2.8  boss 1st 20% att 2/5 stall 0.61  cleared 10/10
casual Emberwaste           burden 4.79h  (train-for-zone 3.63 train-in-zone 8.96 ord-rewalk 0.96 boss-rewalk 0)  hours-in-zone 2.1  boss 1st 60% att 1/2 stall 0.03  cleared 10/10
idle Thornwood              burden 3.9h  (train-for-zone 1.64 train-in-zone 3.47 ord-rewalk 2.11 boss-rewalk 0)  hours-in-zone 3.3  boss 1st 50% att 1/3 stall 0.02  cleared 10/10
light Thornwood             burden 3.76h  (train-for-zone 1.83 train-in-zone 4.03 ord-rewalk 1.57 boss-rewalk 0)  hours-in-zone 2.8  boss 1st 60% att 1/5 stall 0.03  cleared 10/10
casual Ironvein Caverns     burden 3.09h  (train-for-zone 2.42 train-in-zone 7.1 ord-rewalk 0.77 boss-rewalk 0)  hours-in-zone 1.9  boss 1st 70% att 1/3 stall 0.02  cleared 10/10

## Whole-Road triage, candidate arm

=== IDLE  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.4          0.3       0.3     70% n10   1/2         0      0.03    0.03         0             0.06     4.9
Stillwater Lagoon 10/10       6        2.8/3.4          2.1       2.3     40% n10   2/5         1      0.11    1.28         0.08          1.72     18.1
Thornwood         10/10       15       7.9/8.6          3.3       3.5     50% n10   1/3         0      0.02    2.16         0             3.95     20.2
Ironvein Caverns  10/10       29       14.8/15.7        3.8       6       40% n10   2/4         1      0.58    2.31         0.09          5.01     14.9
Emberwaste        10/10       39       24.7/27          4.7       6.3     20% n10   3/6         2      1.5     2.67         0.17          8.55     17.2
Amberfall Woods   10/10       51       34.8/37.2        3.6       3.6     10% n10   3/8         2      1.8     2.2          0.18          8.64     18.9
Ashen Approach    10/3        60       46.4/46.9        5.8       0       0% n3     5/8         2      1.77    3.14         0.09          9.72     17.3
Ashen Keep        3/0         71       -                1.6       0       -         -           -      -       1.18         0             0        12.1

=== LIGHT  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.5          0.3       0.3     80% n10   1/2         0      0.03    0.06         0             0.07     9.2
Stillwater Lagoon 10/10       6        2.8/3.1          2.3       2.7     20% n10   2/4         1      0.52    1.3          0.08          1.74     17.1
Thornwood         10/10       15       7.9/9.1          2.8       4       60% n10   1/5         0      0.03    1.59         0             3.79     21.4
Ironvein Caverns  10/10       29       14.1/16.8        2.8       6.5     20% n10   2/5         1      0.61    1.37         0.09          4.9      16.9
Emberwaste        10/10       38       24.1/26.1        4.2       7.3     30% n10   2/8         1      1.99    2.1          0.09          8.51     19.9
Amberfall Woods   10/10       50       32.1/36.1        2.3       3.7     60% n10   1/4         0      0.01    1.31         0             7.94     22.5
Ashen Approach    10/8        60       44.1/47.1        3.7       0       25% n8    2/5         2      1.96    1.46         0.08          9.74     22.4
Ashen Keep        8/0         70       -                2.4       0       -         -           -      -       0.92         0             0.91     32.6

=== CASUAL  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.4          0.3       0.4     60% n10   1/2         0      0.03    0            0             0.04     4.6
Stillwater Lagoon 10/10       6        2.9/3.4          2.1       2.6     30% n10   2/4         1      0.38    1.18         0.08          1.76     19
Thornwood         10/10       15       6.9/7.1          2.3       3.8     70% n10   1/2         0      0.02    1.22         0             2.91     22.4
Ironvein Caverns  10/10       27       11.1/13.2        1.9       6.2     70% n10   1/3         0      0.02    0.8          0             3.1      20.8
Emberwaste        10/10       35       16.1/19.1        2.1       6.8     60% n10   1/2         0      0.03    1.05         0             4.86     25
Amberfall Woods   10/10       44       25.1/32.3        2.3       2       90% n10   1/2         0      0.02    1.22         0             8.82     28.5
Ashen Approach    10/10       54       37.1/38.1        3.3       0       80% n10   1/3         0      0.03    1            0             7.38     32.1
Ashen Keep        10/0        65       -                10.9      0       -         -/-         1      -       3            0             3        57

=== RANK by median burden hours (ordinary rewalk + boss rewalk + training for the zone + boss combat), realistic profiles, zones cleared by >=10 runs
casual Amberfall Woods      burden 8.82h  (train-for-zone 7.09 train-in-zone 1.98 ord-rewalk 1.22 boss-rewalk 0)  hours-in-zone 2.3  boss 1st 90% att 1/2 stall 0.02  cleared 10/10
idle Amberfall Woods        burden 8.64h  (train-for-zone 6.21 train-in-zone 3.63 ord-rewalk 2.2 boss-rewalk 0.18)  hours-in-zone 3.6  boss 1st 10% att 3/8 stall 1.8  cleared 10/10
idle Emberwaste             burden 8.55h  (train-for-zone 5.09 train-in-zone 6.28 ord-rewalk 2.67 boss-rewalk 0.17)  hours-in-zone 4.7  boss 1st 20% att 3/6 stall 1.5  cleared 10/10
light Emberwaste            burden 8.51h  (train-for-zone 5.74 train-in-zone 7.33 ord-rewalk 2.1 boss-rewalk 0.09)  hours-in-zone 4.2  boss 1st 30% att 2/8 stall 1.99  cleared 10/10
light Amberfall Woods       burden 7.94h  (train-for-zone 6.65 train-in-zone 3.73 ord-rewalk 1.31 boss-rewalk 0)  hours-in-zone 2.3  boss 1st 60% att 1/4 stall 0.01  cleared 10/10
casual Ashen Approach       burden 7.38h  (train-for-zone 6.35 train-in-zone 0 ord-rewalk 1 boss-rewalk 0)  hours-in-zone 3.3  boss 1st 80% att 1/3 stall 0.03  cleared 10/10
idle Ironvein Caverns       burden 5.01h  (train-for-zone 2.64 train-in-zone 6 ord-rewalk 2.31 boss-rewalk 0.09)  hours-in-zone 3.8  boss 1st 40% att 2/4 stall 0.58  cleared 10/10
light Ironvein Caverns      burden 4.9h  (train-for-zone 3.31 train-in-zone 6.49 ord-rewalk 1.37 boss-rewalk 0.09)  hours-in-zone 2.8  boss 1st 20% att 2/5 stall 0.61  cleared 10/10
casual Emberwaste           burden 4.86h  (train-for-zone 3.63 train-in-zone 6.79 ord-rewalk 1.05 boss-rewalk 0)  hours-in-zone 2.1  boss 1st 60% att 1/2 stall 0.03  cleared 10/10
idle Thornwood              burden 3.95h  (train-for-zone 1.64 train-in-zone 3.47 ord-rewalk 2.16 boss-rewalk 0)  hours-in-zone 3.3  boss 1st 50% att 1/3 stall 0.02  cleared 10/10
light Thornwood             burden 3.79h  (train-for-zone 1.83 train-in-zone 4.03 ord-rewalk 1.59 boss-rewalk 0)  hours-in-zone 2.8  boss 1st 60% att 1/5 stall 0.03  cleared 10/10
casual Ironvein Caverns     burden 3.1h  (train-for-zone 2.42 train-in-zone 6.23 ord-rewalk 0.8 boss-rewalk 0)  hours-in-zone 1.9  boss 1st 70% att 1/3 stall 0.02  cleared 10/10

## Scorecard against the pass 19 rules
1. Late-Road training hours materially decrease for the profiles that encounter it: MET for casual (Ashen Approach training 12.96h -> 6.35h per run, -51%, paired -5.24h, 10 of 10 down; total training 27.4h -> 22.2h); MARGINAL for idle (7.28h -> 6.37h, -12%, 9 of 10 down) and light (8.06h -> 7.46h, -7%, 9 of 10 down).
2. No profile loses median zones cleared at 24h, 36h, 48h: MET (idle 4/6/6 in both arms, light 4/6/7, casual 5/6/7; casual 36h paired +2, idle 48h +1 / -1).
3. No adequately sampled zone median clear time worse than +10% / P90 +15%: MET (Ashen Approach: idle 46.20h -> 46.43h on n=3, light 44.07h -> 44.07h with P90 46.08h -> 47.06h (+2%), casual 42.09h -> 37.07h (-12%, 10 of 10 faster); everything upstream identical).
4. Saved time not merely converted into a retrigger loop, ordinary-defeat wall or rewalk increase: NOT MET for idle and light, MET for casual. Idle: episodes at Ashen Approach 8 -> 13 per run (quick retriggers 3 -> 6), ordinary defeats in the zone 69 -> 104 (+51%), rewalk hours 2.45h -> 3.14h (+28%), non-training hours in zone 4.44h -> 5.80h; the 0.9h of training saved is spent losing ordinary fights. Light: episodes 9 -> 15 (quick retriggers 5 -> 11), ordinary defeats 62 -> 104 (+68%), and the Grave Knight becomes a wall it was not (first-try 7/8 -> 2/8, attempts 1 / 2 -> 2 / 5, stall 0.02h -> 1.96h, power at first attempt -7%, losses even inside active windows in seeds 33, 34, 36); light's zone clear time is unchanged only because the boss losses replace the training. Casual: episodes 15 -> 14, ordinary defeats 115 -> 98, rewalk 1.56h -> 1.00h, boss stall 3.50h -> 0.03h.
5. Total defeats within +10%: idle +10% (559 -> 615, 10 of 10 up), light +10% (634 -> 698, 10 of 10 up), casual NOT MET at +47% (880 -> 1292, 10 of 10 up). Casual's extra defeats are at Ashen Keep: it enters the Keep at Lv 65 instead of Lv 71, spends 10.9h there instead of 4.9h, at 57 ordinary defeats per hour; Ashen Approach itself has fewer defeats. That zone is the Shatter wall, training is not allowed there by production rule, and the bot does not Shatter, so the time is parked at the intended wall rather than lost; but the player-facing fact is that casual reaches the wall six levels weaker.
6. Grave Knight and Hollow King mechanically unchanged: MET (ATK 5586 audited; Hollow King reached by idle 3/3, light 8/8, casual 10/10 in both arms, attempted by casual only, cleared by none).
7. No material horde, catacomb, telemetry or simulation regression: MET (catacombs identical; hordes fought 4-5 per run in both arms, casual 5 -> 4 because it spends the late day at the Keep; 0 errors).

## What the data say about the mechanism
- The retrigger cadence does not depend on how much was trained. In both arms a completed return is followed by the next trigger after a median 9-11 ordinary fights (P90 12-19) and 7-10 minutes, and the win rate in the first 10 and 20 fights after return is the same (76-80% and 81-85%) whether the party trained half a level or a whole one. So the late-Road training cost is (number of loops) x (episode length), and the loop count is set by the trigger firing again 10 fights after each return, not by the target.
- Halving the episode therefore halves the cost per loop but, for a party that stays in the zone, raises the loop count: idle 8 -> 13 episodes, light 9 -> 15, hours down only 7-12%. Casual is different because it leaves: its Grave Knight attempts now fall in active windows (10 of 10 first attempts active, 8 wins, versus 6 of 10 active with 4 wins in control) after arriving 5h earlier, so it clears the zone in 14 loops instead of 15 and takes the saved 5h with it to the Keep. That gain is real for casual but it comes through window timing on one boss, and light shows the same mechanism running the other way (first attempts shift toward Auto-Cast and lower level, 7/8 -> 2/8).
- The weaker return is measurable: level at the Grave Knight 70 -> 69 for light, 66 -> 63 for casual (power -7% and -8%), and light's ordinary loss rate in the zone rises from about 18% to 25% of fights (defeats over estimated encounters), which is the "returns too weak" branch of the review's hypothesis.
- The ordinary loss rate itself is the thing underneath: at Lv 60-70 against Lv 42-53 enemies the party loses 14-27% of Ashen Approach fights outside training in both arms and 55% at the Keep, and one level of training lifts the next ten fights to about 80% wins before the window trips again. That is the enemy curve observation from passes 16-18 showing up in ordinary fights, and it is locked.

## Recommendation (proposal only)
I recommend not locking the flat 0.5 target. It is the right size for casual and the wrong shape for idle and light: for two of three profiles it converts an hour-long training into two half-hour trainings with the same ten fights in between and hands the Grave Knight a weaker party. If the reviewer weighs casual's 5h and 10-of-10 zone-clear gain as decisive, a lock is defensible on the progression rules (nothing regresses at any horizon), and I would then ask that light's Grave Knight rows (7/8 -> 2/8, +1.9h stall) be recorded as the accepted cost.
The lever I would test next, if the reviewer wants to stay on late-Road training cost, is the loop count rather than the episode length, because that is what the two arms show is invariant to the target: late-Road only (returns from zone index >= 6), raise the danger threshold from 4 to 5 losses in the 10-fight window (AT_LOSSES 4 -> 5 for ret >= 6, simulator override), everything else including the +1 target unchanged. Expected: episodes per run at Ashen Approach down 30-50% for all three profiles with the same episode length, hours down proportionally, Grave Knight arrival level unchanged (the target is unchanged), ordinary defeats up modestly (the party fights one more loss before retreating). Reject if ordinary defeats or rewalk rise by more than the training saved, or if Grave Knight arrival level falls. This touches a locked constant, so it needs the reviewer to unlock it for a late-Road-only override; I have not run anything toward it.
IMPLEMENTATION_RISK: none for either decision (no production change so far; the target override is one expression in `startTraining`).

## Caveats
n=10 per cell; idle reaches the Grave Knight in 7 of 10 runs and clears it in 3, so idle's boss rows are thin at both arms. Light's Grave Knight rows (n=8-9) move by window timing as much as by arrival level; the paired direction (5 seeds worse, 1 better on attempts) and the -7% power at first attempt are the parts I trust. Ordinary loss rates are estimated from defeats over hours-in-zone times the run's mean seconds per encounter (no per-zone win counter exists; it would be an observation-only addition). The compare tool's "(24h)" labels report end-of-run (48h) values; horizon rows are computed at 24, 36 and 48h.
