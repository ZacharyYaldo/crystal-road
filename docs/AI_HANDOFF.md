STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: RESULTS_WITH_REJECT_RECOMMENDATION_AND_TRIAGE_SETUP
PASS_ID: PASS_20_LATE_ROAD_TRAINING_TRIGGER_CANDIDATE
BASED_ON_REVIEW_PASS: PASS_20_LATE_ROAD_TRAINING_TRIGGER_CANDIDATE
BUILD: 20260911-135817
HEAD_COMMIT_SHA: 6f3bf2070eae2d81b39dd803afe9750db1c7a55e

# Crystal Road AI Handoff - Pass 20 (late-Road danger threshold 4 vs 5 for returns from Ashen Approach or later, paired seeds 31-40, 48h)

DEVELOPER_POSITION: AGREE with the review's rule, and by that rule the candidate is a REJECT: the result is mixed. Casual gains (training -2.5h per run, 8 of 10 seeds; Ashen Approach cleared 3.0h earlier, 9 of 10; Grave Knight first-try 2/10 -> 7/10). Light is marginal (training -0.9h, 7 of 10; zone clear -1.0h, 5 up 2 down; boss unchanged). Idle loses: training -1.0h (8 of 10) but ordinary defeats in the zone 69 -> 108, rewalk +1.3h, non-training hours in zone +2.0h, Grave Knight clears 3 -> 1 of 10 runs and two seeds drop a zone at 48h. The threshold does what it says (episodes fall 8 -> 6 idle, 9 -> 8 light, 15 -> 13 casual, with the +1 target and 52-60 minute episodes intact), but for idle the extra loss it tolerates before retreating costs more than the retreat it saves. Keep threshold 4. CONFIDENCE: HIGH on the measurements (60 runs, 0 errors, threshold audited 4 -> 5 at every late trigger, everything through Amberfall identical, control arm reproduces the pass 19 control run-for-run); HIGH on the reject.

## Setup, audit, and one tooling incident
- Production danger threshold unchanged (AT_LOSSES = 4). The candidate arm replaced the return-zone trigger expression so the threshold is `G.zone>=6?5:AT_LOSSES` (index 6 = Ashen Approach), simulator-only (`tests/sim/batch_p20x.log`). The training-zone fallback check inside an episode keeps its own threshold of 4 in both arms, as the review specified ("do not change ... any other value"). Target 1.0 in both arms (audited: level progress per episode 1.00 / 1.00, target 1.00 in every late episode). Ashen Keep stays excluded by `atAllowed`.
- Audit: losses in the 10-fight window at trigger, Ashen Approach returns: minimum 4 in control, minimum 5 in candidate, for all three profiles (mean 4.2 -> 5.0 idle, 4.1 -> 5.3 light, 4.9 -> 5.9 casual). Grave Knight ATK 5586 at every first attempt in both arms. Every row from Stillwater through Amberfall identical between arms (bosses, clear times, training triggers by zone, rewalk, hordes, catacombs).
- Determinism check: the pass 20 control arm reproduces the pass 19 control arm exactly (30 of 30 runs identical in zones cleared, total defeats and training triggers), so paired seeds are fully reproducible on the same build.
- Incident: my first candidate launch failed on all 30 runs before any simulation because the replace string contained the game's own `x=>!x` arrow, which the bot's `a=>b` override syntax split on; headless threw a syntax error at load, the batch reported 30 errors, and I discarded it and relaunched with a replace target that contains no arrow (`.length>=AT_LOSSES)startTraining(prev);` -> `.length>=(G.zone>=6?5:AT_LOSSES))startTraining(prev);`). No run from the failed launch was used. The delimiter fragility is now known; a safer override syntax is a queued observation-only change.
- Paired seeds 31-40 x idle/light/casual x 48h, --shatters 3, production Road (Sand Tyrant x1.1, Hunter King x1.0, Grave Knight x2.0), Auto Training, hordes, catacombs; 30 control + 30 candidate runs; 0 simulation errors.

## Auto Training by profile and return zone (with losses-in-window audit)

===== IDLE  n=10 paired runs   (batch_out_p20c -> batch_out_p20x)   values are med / P90 per run unless noted
total training hours          23.3 / 26.6 -> 22.0 / 24.6   paired med -1.04 (+2 00 -8)
total triggers                38 / 42 -> 36 / 41   completed returns 31 / 36 -> 29 / 34   cancels 6 / 9 -> 6 / 9

-- return zone: Stillwater Lagoon
  episodes / run                2 / 5 -> 2 / 5   completed returns 2 / 4 -> 2 / 4   quick retriggers 0 / 2 -> 0 / 2   cancels(approx) 1 / 2 -> 1 / 2
  training hours / run          0.30 / 0.67 -> 0.30 / 0.67   paired med 0.00 (+0 010 -0)   fights / run 59 / 131 -> 59 / 131
  first-return vs retrigger     count 2 / 4 -> 2 / 4 vs 0 / 2 -> 0 / 2   hours 0.30 / 0.41 -> 0.30 / 0.41 vs 0.00 / 0.30 -> 0.00 / 0.30
  per episode (pooled med/P90)  minutes 7 / 12 -> 7 / 12   fights 18 / 41 -> 18 / 41   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 14 / 18 -> 14 / 18   minutes 11 / 11 -> 11 / 11   (n 5 -> 5)
  losses in window at trigger   mean 4.18 -> 4.18   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 82% -> 82%   first 20: 83% -> 83%   window at trigger: 57% -> 57%
  zone: ordinary defeats        40 / 46 -> 40 / 46   rewalk hours 1.26 / 1.76 -> 1.29 / 1.78   non-training hours in zone 2.14 / 2.91 -> 2.14 / 2.91
  Lv entering / Lv at boss      6 / 7 -> 6 / 7  /  16 / 18 -> 16 / 18   power at boss 3049 / 3821 -> 3049 / 3821
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 4/10 -> 4/10   attempts 2 / 5 -> 2 / 5   streak 1 / 4 -> 1 / 4   stall h 0.11 / 1.06 -> 0.11 / 1.06
  zone clear h                  2.79 / 3.43 -> 2.79 / 3.43   paired med 0.00 (+0 010 -0)

-- return zone: Thornwood
  episodes / run                6 / 10 -> 6 / 10   completed returns 6 / 9 -> 6 / 9   quick retriggers 3 / 5 -> 3 / 5   cancels(approx) 0 / 1 -> 0 / 1
  training hours / run          1.64 / 2.85 -> 1.64 / 2.85   paired med 0.00 (+0 010 -0)   fights / run 239 / 377 -> 239 / 377
  first-return vs retrigger     count 3 / 5 -> 3 / 5 vs 3 / 5 -> 3 / 5   hours 0.86 / 1.35 -> 0.86 / 1.35 vs 0.83 / 1.59 -> 0.83 / 1.59
  per episode (pooled med/P90)  minutes 16 / 19 -> 16 / 19   fights 39 / 51 -> 39 / 51   level progress 1.00 / 1.20 -> 1.00 / 1.20   target med 1.00 -> 1.00
  return -> next trigger        fights 10 / 19 -> 10 / 19   minutes 8 / 13 -> 8 / 13   (n 32 -> 32)
  losses in window at trigger   mean 4.15 -> 4.15   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 79% -> 79%   first 20: 81% -> 81%   window at trigger: 57% -> 57%
  zone: ordinary defeats        68 / 89 -> 68 / 89   rewalk hours 2.11 / 2.95 -> 2.18 / 3.00   non-training hours in zone 3.27 / 4.40 -> 3.27 / 4.40
  Lv entering / Lv at boss      15 / 16 -> 15 / 16  /  28 / 30 -> 28 / 30   power at boss 8665 / 9157 -> 8665 / 9157
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 5/10 -> 5/10   attempts 1 / 3 -> 1 / 3   streak 0 / 2 -> 0 / 2   stall h 0.02 / 1.66 -> 0.02 / 1.66
  zone clear h                  7.89 / 8.61 -> 7.89 / 8.61   paired med 0.00 (+0 010 -0)

-- return zone: Ironvein Caverns
  episodes / run                5 / 7 -> 5 / 7   completed returns 5 / 7 -> 5 / 7   quick retriggers 1 / 5 -> 1 / 5   cancels(approx) 0 / 0 -> 0 / 0
  training hours / run          2.64 / 3.75 -> 2.64 / 3.75   paired med 0.00 (+0 010 -0)   fights / run 318 / 528 -> 318 / 528
  first-return vs retrigger     count 3 / 4 -> 3 / 4 vs 1 / 5 -> 1 / 5   hours 1.67 / 2.15 -> 1.67 / 2.15 vs 0.69 / 2.87 -> 0.69 / 2.87
  per episode (pooled med/P90)  minutes 35 / 39 -> 35 / 39   fights 68 / 81 -> 68 / 81   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 11 / 20 -> 11 / 20   minutes 10 / 15 -> 10 / 15   (n 17 -> 17)
  losses in window at trigger   mean 4.08 -> 4.08   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 82% -> 82%   first 20: 82% -> 82%   window at trigger: 59% -> 59%
  zone: ordinary defeats        57 / 74 -> 57 / 74   rewalk hours 2.31 / 3.13 -> 2.33 / 3.18   non-training hours in zone 3.83 / 5.20 -> 3.83 / 5.20
  Lv entering / Lv at boss      29 / 30 -> 29 / 30  /  38 / 40 -> 38 / 40   power at boss 14026 / 15509 -> 14026 / 15509
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 4/10 -> 4/10   attempts 2 / 4 -> 2 / 4   streak 1 / 3 -> 1 / 3   stall h 0.58 / 2.90 -> 0.58 / 2.90
  zone clear h                  14.77 / 15.73 -> 14.77 / 15.73   paired med 0.00 (+0 010 -0)

-- return zone: Emberwaste
  episodes / run                9 / 11 -> 9 / 11   completed returns 5 / 6 -> 5 / 6   quick retriggers 2 / 4 -> 2 / 4   cancels(approx) 5 / 5 -> 5 / 5
  training hours / run          5.09 / 6.87 -> 5.09 / 6.87   paired med 0.00 (+0 010 -0)   fights / run 528 / 712 -> 528 / 712
  first-return vs retrigger     count 7 / 8 -> 7 / 8 vs 2 / 4 -> 2 / 4   hours 4.02 / 5.09 -> 4.02 / 5.09 vs 1.10 / 3.30 -> 1.10 / 3.30
  per episode (pooled med/P90)  minutes 43 / 51 -> 43 / 51   fights 73 / 93 -> 73 / 93   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 11 / 17 -> 11 / 17   minutes 7 / 11 -> 7 / 11   (n 22 -> 22)
  losses in window at trigger   mean 4.10 -> 4.10   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 77% -> 77%   first 20: 82% -> 82%   window at trigger: 58% -> 58%
  zone: ordinary defeats        83 / 112 -> 83 / 112   rewalk hours 2.61 / 4.84 -> 2.67 / 4.85   non-training hours in zone 4.73 / 7.05 -> 4.73 / 7.05
  Lv entering / Lv at boss      39 / 40 -> 39 / 40  /  49 / 51 -> 49 / 51   power at boss 23545 / 24912 -> 23545 / 24912
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 2/10 -> 2/10   attempts 3 / 6 -> 3 / 6   streak 2 / 5 -> 2 / 5   stall h 1.50 / 3.30 -> 1.50 / 3.30
  zone clear h                  24.69 / 26.99 -> 24.69 / 26.99   paired med 0.00 (+0 010 -0)

-- return zone: Amberfall Woods
  episodes / run                7 / 9 -> 7 / 9   completed returns 6 / 9 -> 6 / 9   quick retriggers 3 / 5 -> 3 / 5   cancels(approx) 1 / 2 -> 1 / 2
  training hours / run          6.21 / 8.31 -> 6.21 / 8.31   paired med 0.00 (+0 010 -0)   fights / run 694 / 937 -> 694 / 937
  first-return vs retrigger     count 4 / 6 -> 4 / 6 vs 3 / 5 -> 3 / 5   hours 3.25 / 5.24 -> 3.25 / 5.24 vs 2.24 / 4.82 -> 2.24 / 4.82
  per episode (pooled med/P90)  minutes 55 / 61 -> 55 / 61   fights 101 / 122 -> 101 / 122   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 9 / 15 -> 9 / 15   minutes 7 / 10 -> 7 / 10   (n 32 -> 32)
  losses in window at trigger   mean 4.26 -> 4.26   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 80% -> 80%   first 20: 84% -> 84%   window at trigger: 55% -> 55%
  zone: ordinary defeats        65 / 94 -> 65 / 94   rewalk hours 2.16 / 3.51 -> 2.19 / 3.59   non-training hours in zone 3.59 / 5.70 -> 3.59 / 5.70
  Lv entering / Lv at boss      51 / 52 -> 51 / 52  /  58 / 61 -> 58 / 61   power at boss 36184 / 39820 -> 36184 / 39820
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 1/10 -> 1/10   attempts 3 / 8 -> 3 / 8   streak 2 / 7 -> 2 / 7   stall h 1.80 / 3.30 -> 1.80 / 3.30
  zone clear h                  34.77 / 37.17 -> 34.77 / 37.17   paired med 0.00 (+0 010 -0)

-- return zone: Ashen Approach
  episodes / run                8 / 9 -> 6 / 8   completed returns 7 / 9 -> 6 / 7   quick retriggers 3 / 4 -> 2 / 2   cancels(approx) 0 / 1 -> 0 / 1
  training hours / run          7.28 / 8.79 -> 6.22 / 6.96   paired med -1.04 (+2 00 -8)   fights / run 814 / 1079 -> 666 / 831
  first-return vs retrigger     count 5 / 6 -> 5 / 7 vs 3 / 4 -> 2 / 2   hours 3.99 / 5.83 -> 4.79 / 5.97 vs 3.17 / 3.90 -> 1.85 / 2.16
  per episode (pooled med/P90)  minutes 59 / 63 -> 60 / 65   fights 116 / 128 -> 110 / 123   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 10 / 17 -> 14 / 19   minutes 9 / 14 -> 10 / 16   (n 32 -> 15)
  losses in window at trigger   mean 4.24 -> 5.03   (window length med 10 -> 10; audit: min losses 4 -> 5)
  win rate after return (mean)  first 10: 79% -> 76%   first 20: 82% -> 76%   window at trigger: 56% -> 49%
  zone: ordinary defeats        69 / 106 -> 108 / 163   rewalk hours 2.45 / 4.08 -> 3.73 / 5.26   non-training hours in zone 4.44 / 7.62 -> 6.43 / 9.38
  Lv entering / Lv at boss      60 / 62 -> 60 / 62  /  69 / 71 -> 71 / 72   power at boss 53837 / 55923 -> 56708 / 56853
  boss: reach/attempt/clear     10/7/3 -> 10/5/1   first-try 0/3 -> 0/1   attempts 3 / 4 -> 3 / 3   streak 3 / 7 -> 4 / 9   stall h 3.11 / 4.50 -> 1.81 / 1.81
  zone clear h                  46.20 / 46.60 -> 47.51 / 47.51   paired med 3.10 (+1 00 -0)

-- return zone: Ashen Keep
  episodes / run                0 / 0 -> 0 / 0   completed returns 0 / 0 -> 0 / 0   quick retriggers 0 / 0 -> 0 / 0   cancels(approx) 0 / 0 -> 0 / 0
  training hours / run          0.00 / 0.00 -> 0.00 / 0.00   paired med 0.00 (+0 010 -0)   fights / run 0 / 0 -> 0 / 0
  first-return vs retrigger     count 0 / 0 -> 0 / 0 vs 0 / 0 -> 0 / 0   hours 0.00 / 0.00 -> 0.00 / 0.00 vs 0.00 / 0.00 -> 0.00 / 0.00
  per episode (pooled med/P90)  minutes - / - -> - / -   fights - / - -> - / -   level progress - / - -> - / -   target med - -> -
  return -> next trigger        fights - / - -> - / -   minutes - / - -> - / -   (n 0 -> 0)
  losses in window at trigger   mean - -> -   (window length med - -> -; audit: min losses Infinity -> Infinity)
  win rate after return (mean)  first 10: 0% -> 0%   first 20: 0% -> 0%   window at trigger: 0% -> 0%
  zone: ordinary defeats        44 / 70 -> 6 / 6   rewalk hours 1.00 / 2.69 -> 0.38 / 0.38   non-training hours in zone 1.79 / 3.59 -> 0.49 / 0.49
  Lv entering / Lv at boss      72 / 73 -> 72 / 72  /  - / - -> - / -   power at boss - / - -> - / -
  boss: reach/attempt/clear     3/0/0 -> 1/0/0   first-try 0/0 -> 0/0   attempts - / - -> - / -   streak - / - -> - / -   stall h - / - -> - / -
  zone clear h                  - / - -> - / -   paired med - (+0 00 -0)

  zones cleared @24/36/48h      24h 4 / 5 -> 4 / 5 [paired med 0.00 (+0 010 -0)]   36h 6 / 6 -> 6 / 6 [paired med 0.00 (+0 010 -0)]   48h 6 / 7 -> 6 / 7 [paired med 0.00 (+0 08 -2)]
  total defeats                 559 / 660 -> 598 / 671   paired med 28.00 (+10 00 -0)   hordes fought/repelled/lost 4 / 5 -> 3 / 5 / 4 / 5 -> 3 / 5 / 1 / 3 -> 1 / 2

===== LIGHT  n=10 paired runs   (batch_out_p20c -> batch_out_p20x)   values are med / P90 per run unless noted
total training hours          26.2 / 28.9 -> 25.2 / 29.6   paired med -0.91 (+3 00 -7)
total triggers                42 / 47 -> 43 / 46   completed returns 35 / 38 -> 34 / 37   cancels 8 / 9 -> 8 / 9

-- return zone: Stillwater Lagoon
  episodes / run                3 / 5 -> 3 / 5   completed returns 2 / 3 -> 2 / 3   quick retriggers 0 / 1 -> 0 / 1   cancels(approx) 1 / 2 -> 1 / 2
  training hours / run          0.34 / 0.52 -> 0.34 / 0.52   paired med 0.00 (+0 010 -0)   fights / run 66 / 97 -> 66 / 97
  first-return vs retrigger     count 3 / 5 -> 3 / 5 vs 0 / 1 -> 0 / 1   hours 0.32 / 0.50 -> 0.32 / 0.50 vs 0.00 / 0.15 -> 0.00 / 0.15
  per episode (pooled med/P90)  minutes 7 / 11 -> 7 / 11   fights 19 / 42 -> 19 / 42   level progress 1.00 / 1.30 -> 1.00 / 1.30   target med 1.00 -> 1.00
  return -> next trigger        fights 8 / 11 -> 8 / 11   minutes 7 / 7 -> 7 / 7   (n 2 -> 2)
  losses in window at trigger   mean 4.21 -> 4.21   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 83% -> 83%   first 20: 83% -> 83%   window at trigger: 56% -> 56%
  zone: ordinary defeats        40 / 46 -> 40 / 46   rewalk hours 1.26 / 1.68 -> 1.28 / 1.70   non-training hours in zone 2.27 / 2.41 -> 2.27 / 2.41
  Lv entering / Lv at boss      6 / 7 -> 6 / 7  /  15 / 17 -> 15 / 17   power at boss 3067 / 3370 -> 3067 / 3370
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 2/10 -> 2/10   attempts 2 / 4 -> 2 / 4   streak 1 / 3 -> 1 / 3   stall h 0.52 / 0.86 -> 0.52 / 0.86
  zone clear h                  2.83 / 3.09 -> 2.83 / 3.09   paired med 0.00 (+0 010 -0)

-- return zone: Thornwood
  episodes / run                7 / 9 -> 7 / 9   completed returns 7 / 8 -> 7 / 8   quick retriggers 4 / 5 -> 4 / 5   cancels(approx) 1 / 1 -> 1 / 1
  training hours / run          1.83 / 2.39 -> 1.83 / 2.39   paired med 0.00 (+0 010 -0)   fights / run 260 / 334 -> 260 / 334
  first-return vs retrigger     count 4 / 5 -> 4 / 5 vs 4 / 5 -> 4 / 5   hours 0.84 / 1.39 -> 0.84 / 1.39 vs 1.12 / 1.40 -> 1.12 / 1.40
  per episode (pooled med/P90)  minutes 16 / 19 -> 16 / 19   fights 36 / 51 -> 36 / 51   level progress 1.00 / 1.20 -> 1.00 / 1.20   target med 1.00 -> 1.00
  return -> next trigger        fights 10 / 19 -> 10 / 19   minutes 7 / 13 -> 7 / 13   (n 33 -> 33)
  losses in window at trigger   mean 4.19 -> 4.19   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 78% -> 78%   first 20: 82% -> 82%   window at trigger: 56% -> 56%
  zone: ordinary defeats        64 / 84 -> 64 / 84   rewalk hours 1.57 / 2.53 -> 1.58 / 2.56   non-training hours in zone 2.81 / 3.86 -> 2.81 / 3.86
  Lv entering / Lv at boss      15 / 15 -> 15 / 15  /  27 / 30 -> 27 / 30   power at boss 7942 / 9198 -> 7942 / 9198
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 6/10 -> 6/10   attempts 1 / 5 -> 1 / 5   streak 0 / 4 -> 0 / 4   stall h 0.03 / 1.40 -> 0.03 / 1.40
  zone clear h                  7.89 / 9.07 -> 7.89 / 9.07   paired med 0.00 (+0 010 -0)

-- return zone: Ironvein Caverns
  episodes / run                6 / 7 -> 6 / 7   completed returns 6 / 7 -> 6 / 7   quick retriggers 2 / 4 -> 2 / 4   cancels(approx) 0 / 0 -> 0 / 0
  training hours / run          3.31 / 3.92 -> 3.31 / 3.92   paired med 0.00 (+0 010 -0)   fights / run 439 / 504 -> 439 / 504
  first-return vs retrigger     count 3 / 5 -> 3 / 5 vs 2 / 4 -> 2 / 4   hours 1.68 / 2.54 -> 1.68 / 2.54 vs 1.24 / 2.42 -> 1.24 / 2.42
  per episode (pooled med/P90)  minutes 34 / 39 -> 34 / 39   fights 72 / 80 -> 72 / 80   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 10 / 17 -> 10 / 17   minutes 9 / 14 -> 9 / 14   (n 25 -> 25)
  losses in window at trigger   mean 4.10 -> 4.10   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 81% -> 81%   first 20: 83% -> 83%   window at trigger: 58% -> 58%
  zone: ordinary defeats        50 / 72 -> 50 / 72   rewalk hours 1.33 / 2.29 -> 1.34 / 2.28   non-training hours in zone 2.76 / 4.43 -> 2.76 / 4.43
  Lv entering / Lv at boss      29 / 30 -> 29 / 30  /  37 / 39 -> 37 / 39   power at boss 13736 / 14647 -> 13736 / 14647
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 2/10 -> 2/10   attempts 2 / 5 -> 2 / 5   streak 1 / 4 -> 1 / 4   stall h 0.61 / 3.18 -> 0.61 / 3.18
  zone clear h                  14.09 / 16.77 -> 14.09 / 16.77   paired med 0.00 (+0 010 -0)

-- return zone: Emberwaste
  episodes / run                10 / 13 -> 10 / 13   completed returns 5 / 7 -> 5 / 7   quick retriggers 2 / 5 -> 2 / 5   cancels(approx) 4 / 6 -> 4 / 6
  training hours / run          5.74 / 7.80 -> 5.74 / 7.80   paired med 0.00 (+0 010 -0)   fights / run 603 / 792 -> 603 / 792
  first-return vs retrigger     count 8 / 9 -> 8 / 9 vs 2 / 5 -> 2 / 5   hours 4.33 / 5.78 -> 4.33 / 5.78 vs 1.58 / 3.75 -> 1.58 / 3.75
  per episode (pooled med/P90)  minutes 44 / 50 -> 44 / 50   fights 75 / 93 -> 75 / 93   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 12 / 16 -> 12 / 16   minutes 9 / 11 -> 9 / 11   (n 24 -> 24)
  losses in window at trigger   mean 4.33 -> 4.33   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 85% -> 85%   first 20: 84% -> 84%   window at trigger: 55% -> 55%
  zone: ordinary defeats        81 / 93 -> 81 / 93   rewalk hours 2.08 / 2.69 -> 2.07 / 2.72   non-training hours in zone 4.20 / 4.74 -> 4.20 / 4.74
  Lv entering / Lv at boss      38 / 41 -> 38 / 41  /  46 / 51 -> 46 / 51   power at boss 20094 / 24742 -> 20094 / 24742
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 3/10 -> 3/10   attempts 2 / 8 -> 2 / 8   streak 1 / 7 -> 1 / 7   stall h 1.99 / 5.92 -> 1.99 / 5.92
  zone clear h                  24.10 / 26.08 -> 24.10 / 26.08   paired med 0.00 (+0 010 -0)

-- return zone: Amberfall Woods
  episodes / run                8 / 9 -> 8 / 9   completed returns 7 / 8 -> 7 / 8   quick retriggers 4 / 5 -> 4 / 5   cancels(approx) 1 / 2 -> 1 / 2
  training hours / run          6.65 / 7.42 -> 6.65 / 7.42   paired med 0.00 (+0 010 -0)   fights / run 783 / 843 -> 783 / 843
  first-return vs retrigger     count 3 / 5 -> 3 / 5 vs 4 / 5 -> 4 / 5   hours 2.72 / 4.60 -> 2.72 / 4.60 vs 3.60 / 4.75 -> 3.60 / 4.75
  per episode (pooled med/P90)  minutes 52 / 57 -> 52 / 57   fights 100 / 119 -> 100 / 119   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 10 / 19 -> 10 / 19   minutes 8 / 12 -> 8 / 12   (n 41 -> 41)
  losses in window at trigger   mean 4.30 -> 4.30   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 78% -> 78%   first 20: 85% -> 85%   window at trigger: 55% -> 55%
  zone: ordinary defeats        51 / 64 -> 51 / 64   rewalk hours 1.31 / 1.48 -> 1.31 / 1.50   non-training hours in zone 2.30 / 2.68 -> 2.30 / 2.68
  Lv entering / Lv at boss      50 / 51 -> 50 / 51  /  58 / 60 -> 58 / 60   power at boss 34921 / 40876 -> 34921 / 40876
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 6/10 -> 6/10   attempts 1 / 4 -> 1 / 4   streak 0 / 3 -> 0 / 3   stall h 0.01 / 6.93 -> 0.01 / 6.93
  zone clear h                  32.07 / 36.09 -> 32.07 / 36.09   paired med 0.00 (+0 010 -0)

-- return zone: Ashen Approach
  episodes / run                9 / 11 -> 8 / 12   completed returns 9 / 11 -> 8 / 11   quick retriggers 5 / 8 -> 5 / 7   cancels(approx) 0 / 2 -> 0 / 1
  training hours / run          8.06 / 10.62 -> 7.75 / 11.17   paired med -0.91 (+3 00 -7)   fights / run 986 / 1222 -> 922 / 1310
  first-return vs retrigger     count 5 / 6 -> 3 / 6 vs 5 / 8 -> 5 / 7   hours 3.94 / 5.49 -> 2.92 / 5.01 vs 5.04 / 7.68 -> 4.46 / 7.35
  per episode (pooled med/P90)  minutes 58 / 64 -> 57 / 63   fights 112 / 124 -> 113 / 128   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 11 / 17 -> 11 / 18   minutes 9 / 13 -> 10 / 14   (n 50 -> 50)
  losses in window at trigger   mean 4.14 -> 5.28   (window length med 10 -> 10; audit: min losses 4 -> 5)
  win rate after return (mean)  first 10: 76% -> 73%   first 20: 82% -> 76%   window at trigger: 57% -> 44%
  zone: ordinary defeats        62 / 76 -> 72 / 110   rewalk hours 1.42 / 2.21 -> 1.24 / 2.16   non-training hours in zone 3.02 / 4.12 -> 2.91 / 4.80
  Lv entering / Lv at boss      60 / 61 -> 60 / 61  /  70 / 72 -> 69 / 72   power at boss 54264 / 57454 -> 52609 / 57512
  boss: reach/attempt/clear     10/9/8 -> 10/9/8   first-try 7/8 -> 7/8   attempts 1 / 2 -> 1 / 2   streak 0 / 1 -> 0 / 1   stall h 0.02 / 0.99 -> 0.02 / 4.00
  zone clear h                  44.07 / 46.08 -> 43.09 / 47.07   paired med -0.96 (+2 00 -5)

-- return zone: Ashen Keep
  episodes / run                0 / 0 -> 0 / 0   completed returns 0 / 0 -> 0 / 0   quick retriggers 0 / 0 -> 0 / 0   cancels(approx) 0 / 0 -> 0 / 0
  training hours / run          0.00 / 0.00 -> 0.00 / 0.00   paired med 0.00 (+0 010 -0)   fights / run 0 / 0 -> 0 / 0
  first-return vs retrigger     count 0 / 0 -> 0 / 0 vs 0 / 0 -> 0 / 0   hours 0.00 / 0.00 -> 0.00 / 0.00 vs 0.00 / 0.00 -> 0.00 / 0.00
  per episode (pooled med/P90)  minutes - / - -> - / -   fights - / - -> - / -   level progress - / - -> - / -   target med - -> -
  return -> next trigger        fights - / - -> - / -   minutes - / - -> - / -   (n 0 -> 0)
  losses in window at trigger   mean - -> -   (window length med - -> -; audit: min losses Infinity -> Infinity)
  win rate after return (mean)  first 10: 0% -> 0%   first 20: 0% -> 0%   window at trigger: 0% -> 0%
  zone: ordinary defeats        151 / 241 -> 188 / 317   rewalk hours 1.61 / 2.41 -> 1.85 / 2.67   non-training hours in zone 3.93 / 5.95 -> 4.90 / 6.90
  Lv entering / Lv at boss      70 / 72 -> 69 / 72  /  - / - -> - / -   power at boss - / - -> - / -
  boss: reach/attempt/clear     8/0/0 -> 8/0/0   first-try 0/0 -> 0/0   attempts - / - -> - / -   streak - / - -> - / -   stall h - / - -> - / -
  zone clear h                  - / - -> - / -   paired med - (+0 00 -0)

  zones cleared @24/36/48h      24h 4 / 5 -> 4 / 5 [paired med 0.00 (+0 010 -0)]   36h 6 / 6 -> 6 / 6 [paired med 0.00 (+0 010 -0)]   48h 7 / 7 -> 7 / 7 [paired med 0.00 (+1 08 -1)]
  total defeats                 634 / 734 -> 702 / 807   paired med 31.00 (+6 00 -4)   hordes fought/repelled/lost 4 / 5 -> 5 / 5 / 4 / 5 -> 5 / 5 / 0 / 2 -> 0 / 2

===== CASUAL  n=10 paired runs   (batch_out_p20c -> batch_out_p20x)   values are med / P90 per run unless noted
total training hours          27.4 / 32.0 -> 26.5 / 30.1   paired med -2.55 (+2 00 -8)
total triggers                47 / 58 -> 44 / 55   completed returns 39 / 47 -> 38 / 44   cancels 8 / 12 -> 7 / 12

-- return zone: Stillwater Lagoon
  episodes / run                4 / 7 -> 4 / 7   completed returns 2 / 4 -> 2 / 4   quick retriggers 0 / 3 -> 0 / 3   cancels(approx) 1 / 3 -> 1 / 3
  training hours / run          0.36 / 0.74 -> 0.36 / 0.74   paired med 0.00 (+0 010 -0)   fights / run 77 / 149 -> 77 / 149
  first-return vs retrigger     count 3 / 6 -> 3 / 6 vs 0 / 3 -> 0 / 3   hours 0.34 / 0.57 -> 0.34 / 0.57 vs 0.00 / 0.41 -> 0.00 / 0.41
  per episode (pooled med/P90)  minutes 6 / 12 -> 6 / 12   fights 20 / 42 -> 20 / 42   level progress 1.00 / 1.30 -> 1.00 / 1.30   target med 1.00 -> 1.00
  return -> next trigger        fights 9 / 17 -> 9 / 17   minutes 7 / 10 -> 7 / 10   (n 8 -> 8)
  losses in window at trigger   mean 4.16 -> 4.16   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 81% -> 81%   first 20: 86% -> 86%   window at trigger: 56% -> 56%
  zone: ordinary defeats        43 / 52 -> 43 / 52   rewalk hours 1.12 / 1.93 -> 1.12 / 1.89   non-training hours in zone 2.05 / 2.87 -> 2.05 / 2.87
  Lv entering / Lv at boss      6 / 7 -> 6 / 7  /  16 / 18 -> 16 / 18   power at boss 3182 / 3860 -> 3182 / 3860
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 3/10 -> 3/10   attempts 2 / 4 -> 2 / 4   streak 1 / 3 -> 1 / 3   stall h 0.38 / 0.88 -> 0.38 / 0.88
  zone clear h                  2.86 / 3.43 -> 2.86 / 3.43   paired med 0.00 (+0 010 -0)

-- return zone: Thornwood
  episodes / run                6 / 9 -> 6 / 9   completed returns 6 / 8 -> 6 / 8   quick retriggers 3 / 6 -> 3 / 6   cancels(approx) 1 / 1 -> 1 / 1
  training hours / run          1.42 / 2.17 -> 1.42 / 2.17   paired med 0.00 (+0 010 -0)   fights / run 214 / 298 -> 214 / 298
  first-return vs retrigger     count 3 / 5 -> 3 / 5 vs 3 / 6 -> 3 / 6   hours 0.53 / 1.08 -> 0.53 / 1.08 vs 0.81 / 1.43 -> 0.81 / 1.43
  per episode (pooled med/P90)  minutes 15 / 17 -> 15 / 17   fights 33 / 45 -> 33 / 45   level progress 1.00 / 1.30 -> 1.00 / 1.30   target med 1.00 -> 1.00
  return -> next trigger        fights 9 / 15 -> 9 / 15   minutes 7 / 10 -> 7 / 10   (n 34 -> 34)
  losses in window at trigger   mean 4.52 -> 4.52   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 76% -> 76%   first 20: 78% -> 78%   window at trigger: 51% -> 51%
  zone: ordinary defeats        51 / 64 -> 51 / 64   rewalk hours 1.15 / 2.07 -> 1.15 / 2.17   non-training hours in zone 2.27 / 3.09 -> 2.27 / 3.09
  Lv entering / Lv at boss      15 / 16 -> 15 / 16  /  26 / 28 -> 26 / 28   power at boss 7665 / 8546 -> 7665 / 8546
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 7/10 -> 7/10   attempts 1 / 2 -> 1 / 2   streak 0 / 1 -> 0 / 1   stall h 0.02 / 0.86 -> 0.02 / 0.86
  zone clear h                  6.92 / 7.09 -> 6.92 / 7.09   paired med 0.00 (+0 010 -0)

-- return zone: Ironvein Caverns
  episodes / run                5 / 8 -> 5 / 8   completed returns 5 / 8 -> 5 / 8   quick retriggers 4 / 7 -> 4 / 7   cancels(approx) 0 / 0 -> 0 / 0
  training hours / run          2.42 / 3.96 -> 2.42 / 3.96   paired med 0.00 (+0 010 -0)   fights / run 354 / 558 -> 354 / 558
  first-return vs retrigger     count 2 / 4 -> 2 / 4 vs 4 / 7 -> 4 / 7   hours 0.94 / 2.18 -> 0.94 / 2.18 vs 1.77 / 3.44 -> 1.77 / 3.44
  per episode (pooled med/P90)  minutes 26 / 37 -> 26 / 37   fights 68 / 77 -> 68 / 77   level progress 1.00 / 1.20 -> 1.00 / 1.20   target med 1.00 -> 1.00
  return -> next trigger        fights 9 / 16 -> 9 / 16   minutes 8 / 11 -> 8 / 11   (n 35 -> 35)
  losses in window at trigger   mean 4.53 -> 4.53   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 78% -> 78%   first 20: 84% -> 84%   window at trigger: 51% -> 51%
  zone: ordinary defeats        39 / 49 -> 39 / 49   rewalk hours 0.77 / 1.49 -> 0.77 / 1.56   non-training hours in zone 1.87 / 2.54 -> 1.87 / 2.54
  Lv entering / Lv at boss      27 / 28 -> 27 / 28  /  35 / 37 -> 35 / 37   power at boss 11986 / 13916 -> 11986 / 13916
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 7/10 -> 7/10   attempts 1 / 3 -> 1 / 3   streak 0 / 2 -> 0 / 2   stall h 0.02 / 1.95 -> 0.02 / 1.95
  zone clear h                  11.11 / 13.16 -> 11.11 / 13.16   paired med 0.00 (+0 010 -0)

-- return zone: Emberwaste
  episodes / run                5 / 9 -> 5 / 9   completed returns 4 / 6 -> 4 / 6   quick retriggers 2 / 5 -> 2 / 5   cancels(approx) 1 / 5 -> 1 / 5
  training hours / run          3.63 / 4.74 -> 3.63 / 4.74   paired med 0.00 (+0 010 -0)   fights / run 417 / 561 -> 417 / 561
  first-return vs retrigger     count 3 / 6 -> 3 / 6 vs 2 / 5 -> 2 / 5   hours 1.88 / 3.23 -> 1.88 / 3.23 vs 1.40 / 2.82 -> 1.40 / 2.82
  per episode (pooled med/P90)  minutes 39 / 46 -> 39 / 46   fights 76 / 92 -> 76 / 92   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 8 / 14 -> 8 / 14   minutes 7 / 13 -> 7 / 13   (n 24 -> 24)
  losses in window at trigger   mean 5.17 -> 5.17   (window length med 9 -> 9; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 70% -> 70%   first 20: 82% -> 82%   window at trigger: 42% -> 42%
  zone: ordinary defeats        49 / 72 -> 49 / 72   rewalk hours 0.96 / 1.84 -> 0.96 / 1.93   non-training hours in zone 2.06 / 2.92 -> 2.06 / 2.92
  Lv entering / Lv at boss      35 / 37 -> 35 / 37  /  42 / 45 -> 42 / 45   power at boss 16120 / 19163 -> 16120 / 19163
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 6/10 -> 6/10   attempts 1 / 2 -> 1 / 2   streak 0 / 1 -> 0 / 1   stall h 0.03 / 2.95 -> 0.03 / 2.95
  zone clear h                  16.14 / 19.10 -> 16.14 / 19.10   paired med 0.00 (+0 010 -0)

-- return zone: Amberfall Woods
  episodes / run                11 / 16 -> 11 / 16   completed returns 8 / 13 -> 8 / 13   quick retriggers 5 / 12 -> 5 / 12   cancels(approx) 3 / 7 -> 3 / 7
  training hours / run          7.09 / 11.33 -> 7.09 / 11.33   paired med 0.00 (+0 010 -0)   fights / run 831 / 1422 -> 831 / 1422
  first-return vs retrigger     count 4 / 9 -> 4 / 9 vs 5 / 12 -> 5 / 12   hours 2.52 / 4.81 -> 2.52 / 4.81 vs 2.88 / 8.91 -> 2.88 / 8.91
  per episode (pooled med/P90)  minutes 43 / 50 -> 43 / 50   fights 84 / 114 -> 84 / 114   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 10 / 18 -> 10 / 18   minutes 7 / 10 -> 7 / 10   (n 58 -> 58)
  losses in window at trigger   mean 5.06 -> 5.06   (window length med 10 -> 10; audit: min losses 4 -> 4)
  win rate after return (mean)  first 10: 78% -> 78%   first 20: 83% -> 83%   window at trigger: 43% -> 43%
  zone: ordinary defeats        82 / 102 -> 82 / 102   rewalk hours 1.17 / 1.83 -> 1.15 / 1.89   non-training hours in zone 2.35 / 3.58 -> 2.35 / 3.58
  Lv entering / Lv at boss      44 / 45 -> 44 / 45  /  54 / 61 -> 54 / 61   power at boss 30202 / 40943 -> 30202 / 40943
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 9/10 -> 9/10   attempts 1 / 2 -> 1 / 2   streak 0 / 1 -> 0 / 1   stall h 0.02 / 0.98 -> 0.02 / 0.98
  zone clear h                  25.15 / 32.34 -> 25.15 / 32.34   paired med 0.00 (+0 010 -0)

-- return zone: Ashen Approach
  episodes / run                15 / 21 -> 13 / 20   completed returns 14 / 19 -> 12 / 18   quick retriggers 10 / 15 -> 9 / 16   cancels(approx) 1 / 3 -> 1 / 3
  training hours / run          12.96 / 18.59 -> 10.52 / 16.74   paired med -2.55 (+2 00 -8)   fights / run 1682 / 2329 -> 1367 / 2196
  first-return vs retrigger     count 4 / 6 -> 3 / 5 vs 10 / 15 -> 9 / 16   hours 3.43 / 4.87 -> 1.98 / 4.09 vs 9.33 / 13.72 -> 7.74 / 14.05
  per episode (pooled med/P90)  minutes 52 / 57 -> 52 / 58   fights 110 / 129 -> 111 / 136   level progress 1.00 / 1.00 -> 1.00 / 1.00   target med 1.00 -> 1.00
  return -> next trigger        fights 9 / 19 -> 9 / 13   minutes 8 / 13 -> 7 / 10   (n 107 -> 92)
  losses in window at trigger   mean 4.90 -> 5.89   (window length med 10 -> 9; audit: min losses 4 -> 5)
  win rate after return (mean)  first 10: 80% -> 69%   first 20: 82% -> 78%   window at trigger: 45% -> 33%
  zone: ordinary defeats        115 / 121 -> 95 / 156   rewalk hours 1.56 / 2.24 -> 1.12 / 1.71   non-training hours in zone 3.82 / 4.73 -> 3.33 / 4.38
  Lv entering / Lv at boss      54 / 61 -> 54 / 61  /  66 / 73 -> 65 / 71   power at boss 44132 / 57511 -> 44674 / 53391
  boss: reach/attempt/clear     10/10/10 -> 10/10/10   first-try 2/10 -> 7/10   attempts 2 / 5 -> 1 / 3   streak 1 / 4 -> 0 / 2   stall h 3.50 / 9.91 -> 0.02 / 8.91
  zone clear h                  42.09 / 46.01 -> 41.02 / 45.09   paired med -3.01 (+1 00 -9)

-- return zone: Ashen Keep
  episodes / run                0 / 0 -> 0 / 0   completed returns 0 / 0 -> 0 / 0   quick retriggers 0 / 0 -> 0 / 0   cancels(approx) 0 / 0 -> 0 / 0
  training hours / run          0.00 / 0.00 -> 0.00 / 0.00   paired med 0.00 (+0 010 -0)   fights / run 0 / 0 -> 0 / 0
  first-return vs retrigger     count 0 / 0 -> 0 / 0 vs 0 / 0 -> 0 / 0   hours 0.00 / 0.00 -> 0.00 / 0.00 vs 0.00 / 0.00 -> 0.00 / 0.00
  per episode (pooled med/P90)  minutes - / - -> - / -   fights - / - -> - / -   level progress - / - -> - / -   target med - -> -
  return -> next trigger        fights - / - -> - / -   minutes - / - -> - / -   (n 0 -> 0)
  losses in window at trigger   mean - -> -   (window length med - -> -; audit: min losses Infinity -> Infinity)
  win rate after return (mean)  first 10: 0% -> 0%   first 20: 0% -> 0%   window at trigger: 0% -> 0%
  zone: ordinary defeats        286 / 720 -> 380 / 1052   rewalk hours 1.05 / 2.70 -> 1.19 / 4.29   non-training hours in zone 4.94 / 12.87 -> 6.91 / 17.83
  Lv entering / Lv at boss      71 / 75 -> 70 / 71  /  72 / 75 -> 69 / 72   power at boss 61481 / 67675 -> 54585 / 60549
  boss: reach/attempt/clear     10/4/0 -> 10/2/0   first-try 0/0 -> 0/0   attempts - / - -> - / -   streak 1 / 3 -> 1 / 1   stall h - / - -> - / -
  zone clear h                  - / - -> - / -   paired med - (+0 00 -0)

  zones cleared @24/36/48h      24h 5 / 6 -> 5 / 6 [paired med 0.00 (+0 010 -0)]   36h 6 / 7 -> 6 / 7 [paired med 0.00 (+2 08 -0)]   48h 7 / 7 -> 7 / 7 [paired med 0.00 (+0 010 -0)]
  total defeats                 880 / 1260 -> 1052 / 1520   paired med 183.00 (+10 00 -0)   hordes fought/repelled/lost 5 / 5 -> 5 / 5 / 5 / 5 -> 5 / 5 / 0 / 1 -> 0 / 1

## Road comparison (training, dead time, Grave Knight focus rows with audit, rewalk by zone, other bosses, hordes, paired deltas, counts, early Road)
-- AUTO TRAINING (24h)   med / P90   control -> candidate                                                                                                                                                                                        
triggers                                                                                                                       38 / 42 -> 36 / 41 (-5%)              42 / 47 -> 43 / 46 (+2%)              47 / 58 -> 44 / 55 (-6%)              
completed returns                                                                                                              31 / 36 -> 29 / 34 (-6%)              35 / 38 -> 34 / 37 (-3%)              39 / 47 -> 38 / 44 (-3%)              
cancelled (build change)                                                                                                       6 / 9 -> 6 / 9 (0%)                   8 / 9 -> 8 / 9 (0%)                   8 / 12 -> 7 / 12 (-12%)               
training hours                                                                                                                 23.3 / 26.6 -> 22 / 24.6 (-6%)        26.2 / 28.9 -> 25.2 / 29.6 (-4%)      27.4 / 32 -> 26.5 / 30.1 (-3%)        
training share of 24h %                                                                                                        97 / 111 -> 91 / 103 (-6%)            109 / 120 -> 105 / 123 (-4%)          114 / 133 -> 110 / 126 (-3%)          
levels earned training                                                                                                         33.9 / 40 -> 32.9 / 38 (-3%)          38.9 / 42.5 -> 39.6 / 41.5 (+2%)      42.5 / 50.8 -> 41.2 / 47.8 (-3%)      
triggers for Stillwater Lagoon                                                                                                 2 / 5 -> 2 / 5 (0%)                   3 / 5 -> 3 / 5 (0%)                   4 / 7 -> 4 / 7 (0%)                   
triggers for Thornwood                                                                                                         6 / 10 -> 6 / 10 (0%)                 7 / 9 -> 7 / 9 (0%)                   6 / 9 -> 6 / 9 (0%)                   
triggers for Ironvein Caverns                                                                                                  5 / 7 -> 5 / 7 (0%)                   6 / 7 -> 6 / 7 (0%)                   5 / 8 -> 5 / 8 (0%)                   
triggers for Emberwaste                                                                                                        9 / 11 -> 9 / 11 (0%)                 10 / 13 -> 10 / 13 (0%)               5 / 9 -> 5 / 9 (0%)                   
triggers for Amberfall Woods                                                                                                   7 / 9 -> 7 / 9 (0%)                   8 / 9 -> 8 / 9 (0%)                   11 / 16 -> 11 / 16 (0%)               
trainings with +1 target                                                                                                       38 / 42 -> 36 / 41 (-5%)              42 / 47 -> 43 / 46 (+2%)              47 / 58 -> 44 / 55 (-6%)              
trainings with +2 target                                                                                                       0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        
  +2 trainings for Stillwater Lagoon                                                                                           0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        
  +2 trainings for Thornwood                                                                                                   0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        
  +2 trainings for Ironvein Caverns                                                                                            0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        
  +2 trainings for Emberwaste                                                                                                  0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        
  +2 trainings for Amberfall Woods                                                                                             0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        
training fights total                                                                                                          2767 / 3285 -> 2602 / 3006 (-6%)      3111 / 3337 -> 3061 / 3414 (-2%)      3468 / 4124 -> 3449 / 3960 (-1%)      
back-to-back +2 in same zone (max run)                                                                                         0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        0 / 0 -> 0 / 0                        
-- DEAD TIME outside training                                                                                                                                                                                                                    
ordinary defeats outside training                                                                                              416 / 502 -> 451 / 491 (+8%)          447 / 575 -> 510 / 653 (+14%)         643 / 1046 -> 763 / 1352 (+19%)       
rewalk fights (ordinary defeats)                                                                                               1466 / 1750 -> 1531 / 1793 (+4%)      1181 / 1356 -> 1135 / 1352 (-4%)      955 / 1203 -> 889 / 1372 (-7%)        
rewalk fights (boss losses)                                                                                                    81 / 162 -> 90 / 153 (+11%)           54 / 117 -> 54 / 108 (0%)             27 / 108 -> 36 / 54 (+33%)            
rewalk hours equiv (ordinary)                                                                                                  14.05 / 16.19 -> 14.8 / 17.09 (+5%)   10.93 / 12.69 -> 10.53 / 12.79 (-4%)  8.47 / 10.93 -> 8.26 / 13.07 (-2%)    
rewalk hours equiv (boss)                                                                                                      0.78 / 1.54 -> 0.87 / 1.48 (+12%)     0.5 / 1.12 -> 0.5 / 1.03 (+1%)        0.25 / 0.97 -> 0.31 / 0.5 (+24%)      
total defeats in 24h                                                                                                           559 / 660 -> 598 / 671 (+7%)          634 / 734 -> 702 / 807 (+11%)         880 / 1260 -> 1052 / 1520 (+20%)      
-- ASHEN APPROACH                                                                                                                                                                                                                                
first-try clear (mean)                                                                                                         0% -> 0%                              88% -> 88% (0%)                       20% -> 70% (+250%)                    
attempts to clear                                                                                                              3 / 4 -> 3 / 3 (0%)                   1 / 2 -> 1 / 2 (0%)                   2 / 5 -> 1 / 3 (-50%)                 
stall h                                                                                                                        3.11 / 4.5 -> 1.81 / 1.81 (-42%)      0.02 / 0.99 -> 0.02 / 4 (0%)          3.5 / 9.91 -> 0.02 / 8.91 (-99%)      
zone clear h                                                                                                                   46.2 / 46.6 -> 47.51 / 47.51 (+3%)    44.07 / 46.08 -> 43.09 / 47.07 (-2%)  42.09 / 46.01 -> 41.02 / 45.09 (-3%)  
Lv entering zone                                                                                                               60 / 62 -> 60 / 62 (0%)               60 / 61 -> 60 / 61 (0%)               54 / 61 -> 54 / 61 (0%)               
Lv at first try                                                                                                                69 / 71 -> 71 / 72 (+3%)              70 / 72 -> 69 / 72 (-1%)              66 / 73 -> 65 / 71 (-2%)              
-- ASHEN APPROACH ATTEMPTS (attempt-level, all attempts)                                                                                                                                                                                         
boss ATK at first attempt (audit)                                                                                              5586 / 5586 -> 5586 / 5586 (0%)       5586 / 5586 -> 5586 / 5586 (0%)       5586 / 5586 -> 5586 / 5586 (0%)       
boss Lv at first attempt                                                                                                       53 / 53 -> 53 / 53 (0%)               53 / 53 -> 53 / 53 (0%)               53 / 53 -> 53 / 53 (0%)               
attempts per run                                                                                                               2 / 7 -> 0 / 9 (-100%)                1 / 2 -> 1 / 2 (0%)                   2 / 5 -> 1 / 3 (-50%)                 
first attempt in active window (1=yes)                                                                                         0% -> 0%                              78% -> 100% (+28%)                    50% -> 90% (+80%)                     
first attempt party HP %                                                                                                       86 / 100 -> 96 / 100 (+12%)           100 / 100 -> 100 / 100 (0%)           100 / 100 -> 100 / 100 (0%)           
first attempt charge / surge                                                                                                   50 / 70 -> 56 / 90 (+12%)             63 / 72 -> 62 / 72 (-2%)              46 / 66 -> 46 / 56 (0%)               
first attempt power                                                                                                            53837 / 55923 -> 56708 / 56853 (+5%)  54264 / 57454 -> 52609 / 57512 (-3%)  44132 / 57511 -> 44674 / 53391 (+1%)  
active-window attempts: win % (pooled)                                                                                         -% -> -%                              88% -> 83% (-6%)                      83% -> 88% (+6%)                      
Auto-Cast attempts: win % (pooled)                                                                                             15% -> 7% (-53%)                      50% -> -%                             0% -> 0%                              
Auto-Cast attempts per run                                                                                                     2 / 7 -> 0 / 9 (-100%)                0 / 1 -> 0 / 0                        1 / 3 -> 0 / 1 (-100%)                
charge telegraphs per attempt (run mean)                                                                                       1.5 / 2 -> 1 / 1.33 (-33%)            1 / 2 -> 1 / 1 (0%)                   0.8 / 1 -> 0.5 / 1 (-37%)             
charge hits per attempt                                                                                                        1.5 / 2 -> 1 / 1.33 (-33%)            0 / 2 -> 1 / 1                        0.6 / 1 -> 0 / 0.67 (-100%)           
charge kills per attempt                                                                                                       1.5 / 2 -> 1 / 1.33 (-33%)            0 / 2 -> 1 / 1                        0.6 / 1 -> 0 / 0.67 (-100%)           
parries + interrupts per attempt                                                                                               0 / 0 -> 0 / 0                        0 / 1 -> 0 / 1                        0 / 0.5 -> 0 / 1                      
boss ordinary hits on heroes per attempt                                                                                       5 / 7.7 -> 4.8 / 5.3 (-5%)            4 / 8 -> 4 / 8 (0%)                   3 / 4 -> 2.5 / 4 (-17%)               
LOSS boss HP left (run median)                                                                                                 66 / 69 -> 66 / 67 (0%)               64 / 68 -> 4 / 62 (-94%)              64 / 87 -> 61 / 68 (-5%)              
LOSS reached summon % (pooled)                                                                                                 88% -> 88% (0%)                       100% -> 100% (0%)                     65% -> 100% (+54%)                    
WIN survivors (run median)                                                                                                     4 / 4 -> 4 / 4 (0%)                   4 / 4 -> 4 / 4 (0%)                   4 / 4 -> 4 / 4 (0%)                   
WIN party HP % (run median)                                                                                                    83 / 97 -> 79 / 79 (-5%)              100 / 100 -> 100 / 100 (0%)           100 / 100 -> 100 / 100 (0%)           
Ashen max loss streak                                                                                                          3 / 7 -> 4 / 9 (+33%)                 0 / 1 -> 0 / 1                        1 / 4 -> 0 / 2 (-100%)                
Ashen combat stall h                                                                                                           0.04 / 0.06 -> 0.03 / 0.03 (-25%)     0 / 0.02 -> 0 / 0.02                  0.02 / 0.06 -> 0 / 0.03 (-100%)       
Ashen retry stall h                                                                                                            3 / 4.42 -> 1.75 / 1.75 (-42%)        0 / 0.95 -> 0 / 3.97                  3.47 / 9.83 -> 0 / 8.88 (-100%)       
-- REWALK BY ZONE (ordinary defeats outside training): fights | hours in zone (non-training) | rewalk fights per exposure hour                                                                                                                   
Stillwater Lagoon: ordinary rewalk fights                                                                                      132 / 184 -> 132 / 184 (0%)           138 / 178 -> 138 / 178 (0%)           130 / 206 -> 130 / 206 (0%)           
Stillwater Lagoon: ordinary defeats                                                                                            40 / 46 -> 40 / 46 (0%)               40 / 46 -> 40 / 46 (0%)               43 / 52 -> 43 / 52 (0%)               
Stillwater Lagoon: hours in zone (non-training)                                                                                2.14 / 2.91 -> 2.14 / 2.91 (0%)       2.27 / 2.41 -> 2.27 / 2.41 (0%)       2.05 / 2.87 -> 2.05 / 2.87 (0%)       
Stillwater Lagoon: rewalk fights per exposure hour                                                                             60.7 / 75.7 -> 60.7 / 75.7 (0%)       60.4 / 74 -> 60.4 / 74 (0%)           62.8 / 76.8 -> 62.8 / 76.8 (0%)       
Stillwater Lagoon: rewalk hours per exposure hour                                                                              0.58 / 0.72 -> 0.58 / 0.73 (+1%)      0.56 / 0.7 -> 0.57 / 0.7 (+1%)        0.55 / 0.72 -> 0.56 / 0.7 (+2%)       
Thornwood: ordinary rewalk fights                                                                                              223 / 311 -> 223 / 311 (0%)           169 / 276 -> 169 / 276 (0%)           134 / 228 -> 134 / 228 (0%)           
Thornwood: ordinary defeats                                                                                                    68 / 89 -> 68 / 89 (0%)               64 / 84 -> 64 / 84 (0%)               51 / 64 -> 51 / 64 (0%)               
Thornwood: hours in zone (non-training)                                                                                        3.27 / 4.4 -> 3.27 / 4.4 (0%)         2.81 / 3.86 -> 2.81 / 3.86 (0%)       2.27 / 3.09 -> 2.27 / 3.09 (0%)       
Thornwood: rewalk fights per exposure hour                                                                                     68.1 / 75.9 -> 68.1 / 75.9 (0%)       64.5 / 75.3 -> 64.5 / 75.3 (0%)       59.5 / 79.1 -> 59.5 / 79.1 (0%)       
Thornwood: rewalk hours per exposure hour                                                                                      0.65 / 0.71 -> 0.66 / 0.72 (+2%)      0.6 / 0.69 -> 0.6 / 0.7 (0%)          0.53 / 0.72 -> 0.53 / 0.75 (+1%)      
Ironvein Caverns: ordinary rewalk fights                                                                                       250 / 314 -> 250 / 314 (0%)           140 / 251 -> 140 / 251 (0%)           87 / 164 -> 87 / 164 (0%)             
Ironvein Caverns: ordinary defeats                                                                                             57 / 74 -> 57 / 74 (0%)               50 / 72 -> 50 / 72 (0%)               39 / 49 -> 39 / 49 (0%)               
Ironvein Caverns: hours in zone (non-training)                                                                                 3.83 / 5.2 -> 3.83 / 5.2 (0%)         2.76 / 4.43 -> 2.76 / 4.43 (0%)       1.87 / 2.54 -> 1.87 / 2.54 (0%)       
Ironvein Caverns: rewalk fights per exposure hour                                                                              60.3 / 66.7 -> 60.3 / 66.7 (0%)       52.2 / 61.7 -> 52.2 / 61.7 (0%)       49.7 / 64.5 -> 49.7 / 64.5 (0%)       
Ironvein Caverns: rewalk hours per exposure hour                                                                               0.58 / 0.62 -> 0.58 / 0.64 (+1%)      0.5 / 0.56 -> 0.5 / 0.56 (+1%)        0.43 / 0.59 -> 0.44 / 0.61 (+2%)      
Emberwaste: ordinary rewalk fights                                                                                             289 / 517 -> 289 / 517 (0%)           223 / 285 -> 223 / 285 (0%)           107 / 203 -> 107 / 203 (0%)           
Emberwaste: ordinary defeats                                                                                                   83 / 112 -> 83 / 112 (0%)             81 / 93 -> 81 / 93 (0%)               49 / 72 -> 49 / 72 (0%)               
Emberwaste: hours in zone (non-training)                                                                                       4.73 / 7.05 -> 4.73 / 7.05 (0%)       4.2 / 4.74 -> 4.2 / 4.74 (0%)         2.06 / 2.92 -> 2.06 / 2.92 (0%)       
Emberwaste: rewalk fights per exposure hour                                                                                    63.9 / 73.3 -> 63.9 / 73.3 (0%)       57.5 / 66.2 -> 57.5 / 66.2 (0%)       50.4 / 69.4 -> 50.4 / 69.4 (0%)       
Emberwaste: rewalk hours per exposure hour                                                                                     0.62 / 0.69 -> 0.63 / 0.69 (+1%)      0.54 / 0.63 -> 0.54 / 0.63 (+0%)      0.45 / 0.63 -> 0.46 / 0.66 (+3%)      
Amberfall Woods: ordinary rewalk fights                                                                                        220 / 366 -> 220 / 366 (0%)           137 / 157 -> 137 / 157 (0%)           125 / 206 -> 125 / 206 (0%)           
Amberfall Woods: ordinary defeats                                                                                              65 / 94 -> 65 / 94 (0%)               51 / 64 -> 51 / 64 (0%)               82 / 102 -> 82 / 102 (0%)             
Amberfall Woods: hours in zone (non-training)                                                                                  3.59 / 5.7 -> 3.59 / 5.7 (0%)         2.3 / 2.68 -> 2.3 / 2.68 (0%)         2.35 / 3.58 -> 2.35 / 3.58 (0%)       
Amberfall Woods: rewalk fights per exposure hour                                                                               61.8 / 69.1 -> 61.8 / 69.1 (0%)       53.7 / 64.8 -> 53.7 / 64.8 (0%)       60.1 / 70.4 -> 60.1 / 70.4 (0%)       
Amberfall Woods: rewalk hours per exposure hour                                                                                0.59 / 0.62 -> 0.61 / 0.64 (+3%)      0.51 / 0.59 -> 0.51 / 0.6 (+1%)       0.51 / 0.61 -> 0.53 / 0.6 (+3%)       
Ashen Approach: ordinary rewalk fights                                                                                         256 / 440 -> 381 / 565 (+49%)         152 / 233 -> 132 / 227 (-13%)         166 / 247 -> 127 / 204 (-23%)         
Ashen Approach: ordinary defeats                                                                                               69 / 106 -> 108 / 163 (+57%)          62 / 76 -> 72 / 110 (+16%)            115 / 121 -> 95 / 156 (-17%)          
Ashen Approach: hours in zone (non-training)                                                                                   4.44 / 7.62 -> 6.43 / 9.38 (+45%)     3.02 / 4.12 -> 2.91 / 4.8 (-4%)       3.82 / 4.73 -> 3.33 / 4.38 (-13%)     
Ashen Approach: rewalk fights per exposure hour                                                                                53.5 / 64 -> 57.6 / 63.1 (+8%)        51.3 / 56.5 -> 43.1 / 50.1 (-16%)     46.1 / 52.2 -> 42.4 / 64.6 (-8%)      
Ashen Approach: rewalk hours per exposure hour                                                                                 0.51 / 0.61 -> 0.56 / 0.62 (+8%)      0.47 / 0.54 -> 0.4 / 0.48 (-14%)      0.42 / 0.47 -> 0.36 / 0.59 (-13%)     
-- OTHER BOSSES first-try % (mean) / attempts med                                                                                                                                                                                                
Stillwater Lagoon first-try %                                                                                                  40% -> 40% (0%)                       20% -> 20% (0%)                       30% -> 30% (0%)                       
Stillwater Lagoon attempts                                                                                                     2 / 5 -> 2 / 5 (0%)                   2 / 4 -> 2 / 4 (0%)                   2 / 4 -> 2 / 4 (0%)                   
Stillwater Lagoon stall h                                                                                                      0.11 / 1.06 -> 0.11 / 1.06 (0%)       0.52 / 0.86 -> 0.52 / 0.86 (0%)       0.38 / 0.88 -> 0.38 / 0.88 (0%)       
Thornwood first-try %                                                                                                          50% -> 50% (0%)                       60% -> 60% (0%)                       70% -> 70% (0%)                       
Thornwood attempts                                                                                                             1 / 3 -> 1 / 3 (0%)                   1 / 5 -> 1 / 5 (0%)                   1 / 2 -> 1 / 2 (0%)                   
Thornwood stall h                                                                                                              0.02 / 1.66 -> 0.02 / 1.66 (0%)       0.03 / 1.4 -> 0.03 / 1.4 (0%)         0.02 / 0.86 -> 0.02 / 0.86 (0%)       
Emberwaste first-try %                                                                                                         20% -> 20% (0%)                       30% -> 30% (0%)                       60% -> 60% (0%)                       
Emberwaste attempts                                                                                                            3 / 6 -> 3 / 6 (0%)                   2 / 8 -> 2 / 8 (0%)                   1 / 2 -> 1 / 2 (0%)                   
Emberwaste stall h                                                                                                             1.5 / 3.3 -> 1.5 / 3.3 (0%)           1.99 / 5.92 -> 1.99 / 5.92 (0%)       0.03 / 2.95 -> 0.03 / 2.95 (0%)       
Amberfall Woods first-try %                                                                                                    10% -> 10% (0%)                       60% -> 60% (0%)                       90% -> 90% (0%)                       
Amberfall Woods attempts                                                                                                       3 / 8 -> 3 / 8 (0%)                   1 / 4 -> 1 / 4 (0%)                   1 / 2 -> 1 / 2 (0%)                   
Amberfall Woods stall h                                                                                                        1.8 / 3.3 -> 1.8 / 3.3 (0%)           0.01 / 6.93 -> 0.01 / 6.93 (0%)       0.02 / 0.98 -> 0.02 / 0.98 (0%)       
Ashen Approach first-try %                                                                                                     0% -> 0%                              88% -> 88% (0%)                       20% -> 70% (+250%)                    
Ashen Approach attempts                                                                                                        3 / 4 -> 3 / 3 (0%)                   1 / 2 -> 1 / 2 (0%)                   2 / 5 -> 1 / 3 (-50%)                 
Ashen Approach stall h                                                                                                         3.11 / 4.5 -> 1.81 / 1.81 (-42%)      0.02 / 0.99 -> 0.02 / 4 (0%)          3.5 / 9.91 -> 0.02 / 8.91 (-99%)      
-- HORDES / CATACOMBS / DAMAGE                                                                                                                                                                                                                   
hordes fought (manual)                                                                                                         4 / 5 -> 3 / 5 (-25%)                 4 / 5 -> 5 / 5 (+25%)                 5 / 5 -> 5 / 5 (0%)                   
hordes repelled                                                                                                                4 / 5 -> 3 / 5 (-25%)                 4 / 5 -> 5 / 5 (+25%)                 5 / 5 -> 5 / 5 (0%)                   
hordes lost                                                                                                                    1 / 3 -> 1 / 2 (0%)                   0 / 2 -> 0 / 2                        0 / 1 -> 0 / 1                        
catacomb best floor                                                                                                            3 / 5 -> 3 / 5 (0%)                   4 / 5 -> 4 / 5 (0%)                   3 / 5 -> 3 / 5 (0%)                   
catacomb runs                                                                                                                  3 / 3 -> 3 / 3 (0%)                   3 / 3 -> 3 / 3 (0%)                   3 / 3 -> 3 / 3 (0%)                   
ability casts / h                                                                                                              539 / 549 -> 538 / 549 (0%)           554 / 568 -> 554 / 566 (0%)           580 / 601 -> 576 / 598 (-1%)          
dmg share basic %                                                                                                              45 / 47 -> 45 / 47 (0%)               42 / 43 -> 41 / 43 (-1%)              36 / 38 -> 36 / 38 (0%)               
dmg share ability %                                                                                                            55 / 57 -> 55 / 57 (0%)               55 / 57 -> 55 / 56 (+0%)              56 / 60 -> 56 / 59 (-1%)              
dmg share tap %                                                                                                                0 / 0 -> 0 / 0                        2 / 2 -> 2 / 2 (0%)                   6 / 6 -> 6 / 6 (0%)                   
dmg share surge %                                                                                                              0 / 0 -> 0 / 0                        1 / 1 -> 1 / 1 (0%)                   3 / 3 -> 3 / 3 (+4%)                  
-- PAIRED PER-SEED DELTAS (candidate minus control): median delta | +/0/- counts                                                                                                                                                                 
Ashen attempts                                                                                                                 1 | +1 00 -0 (n1)                     0 | +0 06 -1 (n7)                     -1 | +1 02 -7 (n10)                   
Ashen stall h                                                                                                                  -0.19 | +0 00 -1 (n1)                 0 | +1 05 -1 (n7)                     -4.02 | +3 00 -7 (n10)                
Ashen clear h                                                                                                                  3.1 | +1 00 -0 (n1)                   -0.96 | +2 00 -5 (n7)                 -3.01 | +1 00 -9 (n10)                
zones cleared @24h                                                                                                             0 | +0 08 -2 (n10)                    0 | +1 08 -1 (n10)                    0 | +0 010 -0 (n10)                   
zones cleared @20h                                                                                                             0 | +0 010 -0 (n10)                   0 | +0 010 -0 (n10)                   0 | +0 010 -0 (n10)                   
ordinary rewalk fights                                                                                                         56 | +8 00 -2 (n10)                   -2 | +5 00 -5 (n10)                   30 | +6 00 -4 (n10)                   
ordinary rewalk hours                                                                                                          0.82 | +9 00 -1 (n10)                 0.09 | +7 00 -3 (n10)                 0.46 | +6 00 -4 (n10)                 
total defeats                                                                                                                  28 | +10 00 -0 (n10)                  31 | +6 00 -4 (n10)                   183 | +10 00 -0 (n10)                 
-- COUNTS WITH DENOMINATORS                                                                                                                                                                                                                      
Ashen first-try clears / runs                                                                                                  0/3 -> 0/1                            7/8 -> 7/8                            2/10 -> 7/10                          
Auto-Cast attempts: wins / attempts                                                                                            3/24 -> 1/25                          1/2 -> 0/0                            0/10 -> 0/1                           
active-window attempts: wins / attempts                                                                                        0/0 -> 0/0                            7/8 -> 8/10                           10/14 -> 10/13                        
runs reaching a 6th zone by 24h / runs                                                                                         10/10 -> 10/10                        10/10 -> 10/10                        10/10 -> 10/10                        
6th-zone clear h (med of those reaching)                                                                                       34.77 -> 34.77                        32.07 -> 32.07                        25.15 -> 25.15                        
zones cleared @20h (med)                                                                                                       4 -> 4                                4 -> 4                                5 -> 5                                
-- EARLY ROAD CLEAR TIMES (h)                                                                                                                                                                                                                    
Stillwater Lagoon                                                                                                              2.79 / 3.43 -> 2.79 / 3.43 (0%)       2.83 / 3.09 -> 2.83 / 3.09 (0%)       2.86 / 3.43 -> 2.86 / 3.43 (0%)       
Thornwood                                                                                                                      7.89 / 8.61 -> 7.89 / 8.61 (0%)       7.89 / 9.07 -> 7.89 / 9.07 (0%)       6.92 / 7.09 -> 6.92 / 7.09 (0%)       
Ironvein Caverns                                                                                                               14.77 / 15.73 -> 14.77 / 15.73 (0%)   14.09 / 16.77 -> 14.09 / 16.77 (0%)   11.11 / 13.16 -> 11.11 / 13.16 (0%)   
Emberwaste                                                                                                                     24.69 / 26.99 -> 24.69 / 26.99 (0%)   24.1 / 26.08 -> 24.1 / 26.08 (0%)     16.14 / 19.1 -> 16.14 / 19.1 (0%)     
zones cleared @24h                                                                                                             6 / 7 -> 6 / 7 (0%)                   7 / 7 -> 7 / 7 (0%)                   7 / 7 -> 7 / 7 (0%)                   
party Lv @24h                                                                                                                  72 / 74 -> 72 / 74 (0%)               72 / 75 -> 72 / 75 (0%)               74 / 76 -> 72 / 73 (-3%)              

## Per-seed detail (Amberfall, Ashen Approach, Ashen Keep) and horizons

== idle  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p20c -> batch_out_p20x)
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
   batch_out_p20c  reached 10 attempted 10 | losses n=25 bossHP left q25/50/75 0.32/0.48/0.55 | <=25% 5 | summoned 23 | dur med 69s | charge kills/loss 2.52 | boss hits/loss 7.6 | wins n=10 survivors med 4 partyHP med 96%
   batch_out_p20x  reached 10 attempted 10 | losses n=25 bossHP left q25/50/75 0.32/0.48/0.55 | <=25% 5 | summoned 23 | dur med 69s | charge kills/loss 2.52 | boss hits/loss 7.6 | wins n=10 survivors med 4 partyHP med 96%

== idle  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p20c -> batch_out_p20x)
31  entered, no boss attempt | Lv 62                               -> entered, no boss attempt | Lv 62
32  entered, no boss attempt | Lv 61                               -> entered, no boss attempt | Lv 61
33  null | - | 3 | auto/L/71 | 0/3 | 0/0 | - | Lv 61               -> entered, no boss attempt | Lv 61
34  null | - | 7 | auto/L/70 | 0/7 | 0/0 | - | Lv 59               -> null | - | 6 | auto/L/70 | 0/6 | 0/0 | - | Lv 59
35  entered, no boss attempt | Lv 62                               -> entered, no boss attempt | Lv 62
36  4 | 4.50 | 3 | auto/L/69 | 1/4 | 0/0 | 46.2 | Lv 60            -> null | - | 9 | auto/L/71 | 0/9 | 0/0 | - | Lv 60
37  3 | 3.11 | 2 | auto/L/69 | 1/3 | 0/0 | 46.6 | Lv 60            -> null | - | 4 | auto/L/71 | 0/4 | 0/0 | - | Lv 60
38  null | - | 1 | auto/L/70 | 0/1 | 0/0 | - | Lv 59               -> entered, no boss attempt | Lv 59
39  null | - | 4 | auto/L/69 | 0/4 | 0/0 | - | Lv 61               -> null | - | 3 | auto/L/72 | 0/3 | 0/0 | - | Lv 61
40  2 | 2.00 | 1 | auto/L/69 | 1/2 | 0/0 | 44.4 | Lv 60            -> 3 | 1.81 | 2 | auto/L/71 | 1/3 | 0/0 | 47.5 | Lv 60
   batch_out_p20c  reached 10 attempted 7 | losses n=21 bossHP left q25/50/75 0.60/0.66/0.69 | <=25% 1 | summoned 18 | dur med 60s | charge kills/loss 1.33 | boss hits/loss 4.9 | wins n=3 survivors med 4 partyHP med 83%
   batch_out_p20x  reached 10 attempted 5 | losses n=24 bossHP left q25/50/75 0.59/0.66/0.67 | <=25% 0 | summoned 21 | dur med 56s | charge kills/loss 1.04 | boss hits/loss 4.5 | wins n=1 survivors med 4 partyHP med 79%

== idle  Ashen Keep  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p20c -> batch_out_p20x)
31  not reached | Lv -                                             -> not reached | Lv -
32  not reached | Lv -                                             -> not reached | Lv -
33  not reached | Lv -                                             -> not reached | Lv -
34  not reached | Lv -                                             -> not reached | Lv -
35  not reached | Lv -                                             -> not reached | Lv -
36  entered, no boss attempt | Lv 73                               -> not reached | Lv -
37  entered, no boss attempt | Lv 72                               -> not reached | Lv -
38  not reached | Lv -                                             -> not reached | Lv -
39  not reached | Lv -                                             -> not reached | Lv -
40  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 72
   batch_out_p20c  reached 3 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%
   batch_out_p20x  reached 1 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%

== idle  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  4 / 4 -> 4 / 4   paired +0 010 -0
   @36h  6 / 6 -> 6 / 6   paired +0 010 -0
   @48h  6 / 7 -> 6 / 6   paired +0 08 -2
   total defeats med 559 -> 598   training h med 23.3 -> 22.0

== light  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p20c -> batch_out_p20x)
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
   batch_out_p20c  reached 10 attempted 10 | losses n=7 bossHP left q25/50/75 0.35/0.56/0.57 | <=25% 1 | summoned 7 | dur med 62s | charge kills/loss 2.29 | boss hits/loss 6.3 | wins n=10 survivors med 4 partyHP med 96%
   batch_out_p20x  reached 10 attempted 10 | losses n=7 bossHP left q25/50/75 0.35/0.56/0.57 | <=25% 1 | summoned 7 | dur med 62s | charge kills/loss 2.29 | boss hits/loss 6.3 | wins n=10 survivors med 4 partyHP med 96%

== light  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p20c -> batch_out_p20x)
31  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 44.1 | Lv 59          -> 1 | 0.02 | 0 | active/W/69 | 0/0 | 1/1 | 43.1 | Lv 59
32  1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 44.0 | Lv 60          -> 1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 43.1 | Lv 60
33  1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 45.1 | Lv 60          -> 1 | 0.02 | 0 | active/W/69 | 0/0 | 1/1 | 43.1 | Lv 60
34  entered, no boss attempt | Lv 61                               -> 2 | 4.00 | 1 | active/L/68 | 0/0 | 1/2 | 47.1 | Lv 61
35  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 42.0 | Lv 60          -> 1 | 0.03 | 0 | active/W/69 | 0/0 | 1/1 | 41.1 | Lv 60
36  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 44.1 | Lv 57          -> 1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 45.1 | Lv 57
37  2 | 0.99 | 1 | auto/L/71 | 0/1 | 1/1 | 46.1 | Lv 61            -> 1 | 0.03 | 0 | active/W/69 | 0/0 | 1/1 | 43.1 | Lv 61
38  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 46.1 | Lv 58          -> null | - | 1 | active/L/68 | 0/0 | 0/1 | - | Lv 58
39  1 | 0.04 | 0 | auto/W/72 | 1/1 | 0/0 | 42.7 | Lv 61            -> 1 | 0.04 | 0 | active/W/72 | 0/0 | 1/1 | 43.1 | Lv 61
40  null | - | 1 | active/L/70 | 0/0 | 0/1 | - | Lv 60             -> entered, no boss attempt | Lv 60
   batch_out_p20c  reached 10 attempted 9 | losses n=2 bossHP left q25/50/75 0.64/0.64/0.64 | <=25% 0 | summoned 2 | dur med 56s | charge kills/loss 1.00 | boss hits/loss 5.0 | wins n=8 survivors med 4 partyHP med 100%
   batch_out_p20x  reached 10 attempted 9 | losses n=2 bossHP left q25/50/75 0.04/0.04/0.04 | <=25% 1 | summoned 2 | dur med 54s | charge kills/loss 0.50 | boss hits/loss 4.5 | wins n=8 survivors med 4 partyHP med 100%

== light  Ashen Keep  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p20c -> batch_out_p20x)
31  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 69
32  entered, no boss attempt | Lv 71                               -> entered, no boss attempt | Lv 70
33  entered, no boss attempt | Lv 71                               -> entered, no boss attempt | Lv 69
34  not reached | Lv -                                             -> entered, no boss attempt | Lv 71
35  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 69
36  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 71
37  entered, no boss attempt | Lv 72                               -> entered, no boss attempt | Lv 69
38  entered, no boss attempt | Lv 70                               -> not reached | Lv -
39  entered, no boss attempt | Lv 72                               -> entered, no boss attempt | Lv 72
40  not reached | Lv -                                             -> not reached | Lv -
   batch_out_p20c  reached 8 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%
   batch_out_p20x  reached 8 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%

== light  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  4 / 5 -> 4 / 5   paired +0 010 -0
   @36h  6 / 6 -> 6 / 6   paired +0 010 -0
   @48h  7 / 7 -> 7 / 7   paired +1 08 -1
   total defeats med 634 -> 702   training h med 26.2 -> 25.2

== casual  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p20c -> batch_out_p20x)
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
   batch_out_p20c  reached 10 attempted 10 | losses n=1 bossHP left q25/50/75 0.48/0.48/0.48 | <=25% 0 | summoned 1 | dur med 64s | charge kills/loss 3.00 | boss hits/loss 6.0 | wins n=10 survivors med 4 partyHP med 95%
   batch_out_p20x  reached 10 attempted 10 | losses n=1 bossHP left q25/50/75 0.48/0.48/0.48 | <=25% 0 | summoned 1 | dur med 64s | charge kills/loss 3.00 | boss hits/loss 6.0 | wins n=10 survivors med 4 partyHP med 95%

== casual  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p20c -> batch_out_p20x)
31  2 | 6.85 | 1 | auto/L/64 | 0/1 | 1/1 | 42.1 | Lv 54            -> 1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 41.1 | Lv 54
32  2 | 6.91 | 1 | auto/L/64 | 0/1 | 1/1 | 45.1 | Lv 55            -> 1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 45.1 | Lv 55
33  2 | 0.24 | 1 | auto/L/73 | 0/1 | 1/1 | 44.1 | Lv 56            -> 1 | 0.02 | 0 | active/W/69 | 0/0 | 1/1 | 41.0 | Lv 56
34  1 | 0.02 | 0 | active/W/72 | 0/0 | 1/1 | 42.1 | Lv 61          -> 1 | 0.03 | 0 | active/W/65 | 0/0 | 1/1 | 35.1 | Lv 61
35  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 41.0 | Lv 49          -> 2 | 1.66 | 1 | auto/L/69 | 0/1 | 1/1 | 42.0 | Lv 49
36  2 | 3.50 | 1 | auto/L/72 | 0/1 | 1/1 | 46.0 | Lv 61            -> 2 | 8.91 | 1 | active/L/63 | 0/0 | 1/2 | 43.1 | Lv 61
37  2 | 0.40 | 1 | auto/L/69 | 0/1 | 1/1 | 39.1 | Lv 49            -> 1 | 0.02 | 0 | active/W/63 | 0/0 | 1/1 | 33.2 | Lv 49
38  4 | 4.97 | 3 | active/L/62 | 0/1 | 1/3 | 35.1 | Lv 57          -> 1 | 0.03 | 0 | active/W/62 | 0/0 | 1/1 | 30.2 | Lv 57
39  5 | 9.91 | 4 | active/L/63 | 0/3 | 1/2 | 43.1 | Lv 54          -> 3 | 5.89 | 2 | active/L/65 | 0/0 | 1/3 | 40.0 | Lv 54
40  3 | 6.89 | 2 | active/L/66 | 0/1 | 1/2 | 45.0 | Lv 50          -> 1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 43.1 | Lv 50
   batch_out_p20c  reached 10 attempted 10 | losses n=14 bossHP left q25/50/75 0.62/0.64/0.79 | <=25% 1 | summoned 9 | dur med 51s | charge kills/loss 1.21 | boss hits/loss 4.0 | wins n=10 survivors med 4 partyHP med 100%
   batch_out_p20x  reached 10 attempted 10 | losses n=4 bossHP left q25/50/75 0.43/0.61/0.64 | <=25% 0 | summoned 4 | dur med 51s | charge kills/loss 1.00 | boss hits/loss 3.5 | wins n=10 survivors med 4 partyHP med 100%

== casual  Ashen Keep  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p20c -> batch_out_p20x)
31  entered, no boss attempt | Lv 71                               -> entered, no boss attempt | Lv 70
32  entered, no boss attempt | Lv 71                               -> entered, no boss attempt | Lv 71
33  entered, no boss attempt | Lv 73                               -> entered, no boss attempt | Lv 69
34  null | - | 1 | active/L/74 | 0/0 | 0/1 | - | Lv 72             -> null | - | 1 | active/L/69 | 0/0 | 0/1 | - | Lv 65
35  null | - | 1 | active/L/72 | 0/0 | 0/1 | - | Lv 70             -> null | - | 1 | active/L/72 | 0/0 | 0/1 | - | Lv 70
36  entered, no boss attempt | Lv 75                               -> entered, no boss attempt | Lv 71
37  entered, no boss attempt | Lv 69                               -> entered, no boss attempt | Lv 63
38  null | - | 3 | active/L/71 | 0/0 | 0/3 | - | Lv 68             -> entered, no boss attempt | Lv 62
39  null | - | 2 | active/L/75 | 0/0 | 0/2 | - | Lv 74             -> entered, no boss attempt | Lv 71
40  entered, no boss attempt | Lv 73                               -> entered, no boss attempt | Lv 71
   batch_out_p20c  reached 10 attempted 4 | losses n=7 bossHP left q25/50/75 0.85/0.87/0.87 | <=25% 0 | summoned 0 | dur med 15s | charge kills/loss 0.00 | boss hits/loss 5.4 | wins n=0 survivors med - partyHP med 0%
   batch_out_p20x  reached 10 attempted 2 | losses n=2 bossHP left q25/50/75 0.89/0.89/0.89 | <=25% 0 | summoned 0 | dur med 12s | charge kills/loss 0.00 | boss hits/loss 5.0 | wins n=0 survivors med - partyHP med 0%

== casual  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  5 / 6 -> 5 / 6   paired +0 010 -0
   @36h  6 / 6 -> 6 / 7   paired +2 08 -0
   @48h  7 / 7 -> 7 / 7   paired +0 010 -0
   total defeats med 880 -> 1052   training h med 27.4 -> 26.5

## Whole-Road triage, candidate arm (control arm = production = tests/sim/p19_triage_c.txt, unchanged)

=== IDLE  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.4          0.3       0.3     70% n10   1/2         0      0.03    0.03         0             0.06     4.9
Stillwater Lagoon 10/10       6        2.8/3.4          2.1       2.3     40% n10   2/5         1      0.11    1.29         0.08          1.72     18.1
Thornwood         10/10       15       7.9/8.6          3.3       3.5     50% n10   1/3         0      0.02    2.18         0             3.95     20.2
Ironvein Caverns  10/10       29       14.8/15.7        3.8       6       40% n10   2/4         1      0.58    2.33         0.09          5.02     14.9
Emberwaste        10/10       39       24.7/27          4.7       6.2     20% n10   3/6         2      1.5     2.67         0.17          8.57     17.2
Amberfall Woods   10/10       51       34.8/37.2        3.6       3.3     10% n10   3/8         2      1.8     2.19         0.18          8.64     18.9
Ashen Approach    10/1        60       47.5/47.5        6.4       0       0% n1     3/3         4      1.81    3.73         0             10.14    17.1
Ashen Keep        1/0         72       -                0.5       0       -         -           -      -       0.38         0             0        12.2

=== LIGHT  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.5          0.3       0.3     80% n10   1/2         0      0.03    0.06         0             0.06     9.2
Stillwater Lagoon 10/10       6        2.8/3.1          2.3       2.7     20% n10   2/4         1      0.52    1.28         0.08          1.72     17.1
Thornwood         10/10       15       7.9/9.1          2.8       4       60% n10   1/5         0      0.03    1.58         0             3.74     21.4
Ironvein Caverns  10/10       29       14.1/16.8        2.8       6.5     20% n10   2/5         1      0.61    1.34         0.09          4.87     16.9
Emberwaste        10/10       38       24.1/26.1        4.2       8.4     30% n10   2/8         1      1.99    2.07         0.09          8.43     19.9
Amberfall Woods   10/10       50       32.1/36.1        2.3       2.8     60% n10   1/4         0      0.01    1.31         0             7.92     22.5
Ashen Approach    10/8        60       43.1/47.1        2.9       0       88% n8    1/2         0      0.02    1.24         0             8.97     22.9
Ashen Keep        8/0         69       -                4.9       0       -         -           -      -       1.85         0             1.68     38.9

=== CASUAL  (n=10 runs, 48h)
zone              enter/clear entry Lv clear h med/P90  h in zone train h boss 1st% att med/P90 streak stall h ord rewalk h boss rewalk h burden h ord def/h
Greenhollow Fields10/10       1        0.3/0.4          0.3       0.4     60% n10   1/2         0      0.03    0            0             0.04     4.6
Stillwater Lagoon 10/10       6        2.9/3.4          2.1       2.6     30% n10   2/4         1      0.38    1.12         0.08          1.68     19
Thornwood         10/10       15       6.9/7.1          2.3       3.8     70% n10   1/2         0      0.02    1.15         0             2.92     22.4
Ironvein Caverns  10/10       27       11.1/13.2        1.9       7.5     70% n10   1/3         0      0.02    0.77         0             3.11     20.8
Emberwaste        10/10       35       16.1/19.1        2.1       7.4     60% n10   1/2         0      0.03    0.96         0             4.83     25
Amberfall Woods   10/10       44       25.1/32.3        2.3       2.9     90% n10   1/2         0      0.02    1.15         0             8.74     28.5
Ashen Approach    10/10       54       41/45.1          3.3       0       70% n10   1/3         0      0.02    1.12         0             11.58    27.4
Ashen Keep        10/0        70       -                6.9       0       -         -/-         1      -       1.19         0             1.19     54.9

=== RANK by median burden hours (ordinary rewalk + boss rewalk + training for the zone + boss combat), realistic profiles, zones cleared by >=10 runs
casual Ashen Approach       burden 11.58h  (train-for-zone 10.52 train-in-zone 0 ord-rewalk 1.12 boss-rewalk 0)  hours-in-zone 3.3  boss 1st 70% att 1/3 stall 0.02  cleared 10/10
casual Amberfall Woods      burden 8.74h  (train-for-zone 7.09 train-in-zone 2.88 ord-rewalk 1.15 boss-rewalk 0)  hours-in-zone 2.3  boss 1st 90% att 1/2 stall 0.02  cleared 10/10
idle Amberfall Woods        burden 8.64h  (train-for-zone 6.21 train-in-zone 3.25 ord-rewalk 2.19 boss-rewalk 0.18)  hours-in-zone 3.6  boss 1st 10% att 3/8 stall 1.8  cleared 10/10
idle Emberwaste             burden 8.57h  (train-for-zone 5.09 train-in-zone 6.17 ord-rewalk 2.67 boss-rewalk 0.17)  hours-in-zone 4.7  boss 1st 20% att 3/6 stall 1.5  cleared 10/10
light Emberwaste            burden 8.43h  (train-for-zone 5.74 train-in-zone 8.35 ord-rewalk 2.07 boss-rewalk 0.09)  hours-in-zone 4.2  boss 1st 30% att 2/8 stall 1.99  cleared 10/10
light Amberfall Woods       burden 7.92h  (train-for-zone 6.65 train-in-zone 2.84 ord-rewalk 1.31 boss-rewalk 0)  hours-in-zone 2.3  boss 1st 60% att 1/4 stall 0.01  cleared 10/10
idle Ironvein Caverns       burden 5.02h  (train-for-zone 2.64 train-in-zone 6 ord-rewalk 2.33 boss-rewalk 0.09)  hours-in-zone 3.8  boss 1st 40% att 2/4 stall 0.58  cleared 10/10
light Ironvein Caverns      burden 4.87h  (train-for-zone 3.31 train-in-zone 6.49 ord-rewalk 1.34 boss-rewalk 0.09)  hours-in-zone 2.8  boss 1st 20% att 2/5 stall 0.61  cleared 10/10
casual Emberwaste           burden 4.83h  (train-for-zone 3.63 train-in-zone 7.41 ord-rewalk 0.96 boss-rewalk 0)  hours-in-zone 2.1  boss 1st 60% att 1/2 stall 0.03  cleared 10/10
idle Thornwood              burden 3.95h  (train-for-zone 1.64 train-in-zone 3.47 ord-rewalk 2.18 boss-rewalk 0)  hours-in-zone 3.3  boss 1st 50% att 1/3 stall 0.02  cleared 10/10
light Thornwood             burden 3.74h  (train-for-zone 1.83 train-in-zone 4.03 ord-rewalk 1.58 boss-rewalk 0)  hours-in-zone 2.8  boss 1st 60% att 1/5 stall 0.03  cleared 10/10
casual Ironvein Caverns     burden 3.11h  (train-for-zone 2.42 train-in-zone 7.47 ord-rewalk 0.77 boss-rewalk 0)  hours-in-zone 1.9  boss 1st 70% att 1/3 stall 0.02  cleared 10/10

## Scorecard against the pass 20 rules
1. Material reduction in late-Road training episodes or hours across the profiles that encounter it: PARTIAL. Ashen Approach episodes 8 -> 6 (idle), 9 -> 8 (light), 15 -> 13 (casual); hours 7.28h -> 6.22h (-15%, 8 of 10 down), 8.06h -> 7.75h (-4%, 7 of 10), 12.96h -> 10.52h (-19%, 8 of 10). Quick retriggers 3 -> 2, 5 -> 5, 10 -> 9 per run; fights from return to next trigger 10 -> 14 (idle), 11 -> 11 (light), 9 -> 9 (casual).
2. No profile loses median zones cleared at 24h, 36h, 48h: MET on medians (idle 4/6/6, light 4/6/7, casual 5/6/7 in both arms); idle 48h paired 0 x8, -2; casual 36h paired +2.
3. Saved training time not replaced by a larger ordinary-defeat, rewalk or boss-stall cost: NOT MET for idle (ordinary defeats in Ashen Approach 69 -> 108, +57%; rewalk hours 2.45h -> 3.73h, +1.28h, against 1.04h of training saved; non-training hours in zone 4.44h -> 6.43h; Grave Knight attempted in 5 runs instead of 7 and cleared in 1 instead of 3; zone clear 46.2h -> 47.5h on n=1). MET for light (defeats 62 -> 72, rewalk -0.18h, boss identical at 7/8 first-try, clear 44.07h -> 43.09h) and casual (defeats 115 -> 95, rewalk -0.44h, boss first-try 2/10 -> 7/10, stall 3.50h -> 0.02h, clear 42.09h -> 41.02h, 9 of 10 faster).
4. Grave Knight and Hollow King arrival level and power not materially worse: MET (Grave Knight first attempt Lv 69 -> 71 idle, 70 -> 69 light, 66 -> 65 casual; power +5%, -3%, +1%; Ashen Keep entry level unchanged within a level).
5. No severe regression in boss experience, total defeats, hordes, catacombs, telemetry, stability: total defeats idle +7% (10 of 10 up), light +11% (6 up, 4 down), casual +20% (10 of 10 up, Keep exposure again: casual reaches the Keep about 1h earlier and spends its extra time there at 50+ defeats per hour); win rate in the first 10 fights after a late return falls 79 -> 76% (idle), 76 -> 73% (light), 80 -> 69% (casual) because the party now retreats from a worse window (49%, 44%, 33% wins at trigger versus 56%, 57%, 45%) and returns to the same fights; hordes and catacombs unchanged; 0 errors.

## Reading
The threshold change removes the marginal retreats (the ones triggered by exactly four losses) and nothing else. Where those retreats were noise, as for casual, the party keeps going and clears the zone sooner. Where they were real, as for idle on Auto-Cast, the party stays in the zone longer, dies more, and rewalks more than it would have trained. The three profiles differ in exactly the way the ordinary loss rate predicts (idle loses the most ordinary fights in Ashen Approach and has no active windows to recover in). Since the review's rule is to reject a mixed or wall-shifting result and close Auto Training tuning, I recommend keeping threshold 4 and closing it. Combined with pass 19: shorter episodes fragment the loop, a laxer trigger shifts the loss to ordinary fights; the underlying cost is the late-Road ordinary loss rate (14-27% at Ashen Approach, 55% at the Keep), which is the locked enemy curve.

## Shatter / Hollow King progression triage: what the existing telemetry can and cannot say
1. What is measured. Every realistic profile reaches Ashen Keep within 48h (idle 3 of 10 runs, light 8, casual 10, both arms). Casual is the only profile that reaches the Hollow King (4 runs in control, 7 attempts, 0 wins, every loss inside 12-16 seconds at 85-89% boss HP after about five ordinary hits; 0 summons reached). Hits-to-defeat at casual's arrival (Lv 71-72): 0.7 front / 0.5 back, i.e. one ordinary hit kills a back-line hero and two kill the tank; the boss has no charge, so this is pure damage per action plus AoE. Ordinary fights in the Keep are lost 55% of the time by casual and about 40% by light, and no training is allowed there (production rule), so the Keep is 5-11 hours of ordinary defeats per run with no exit inside the horizon.
2. What is not measured, and why. The simulator has never recorded a Shatter in any pass. The bot's Shatter rule (`tests/sim/bot.js`, "shatter: once eligible ...") fires only when `gain>=15` and either the Endless road is at 100 or the party is "stalled", and "stalled" is defined as three hours without progress AND an active bot retreat (`retreatUntil>0`). Bot retreat has been off since pass 4 (the game's own Auto Training is authoritative), so the stalled branch can never be true and the bot only Shatters in Endless. Shatter itself is available from the game once Ironvein is cleared (`canReforge()`), so the parties in every batch since pass 4 have carried an unused Shatter through the whole late Road. This is a simulator gap, not a game finding, and it means none of the late-Road numbers above include the mechanic the Keep is designed around.
3. Proposed observation-only simulator change (needs review, not applied): make the bot's stalled test independent of bot retreat (three hours without a zone clear or boss win, on the production Road), keep `gain>=15`, and record per Shatter the hour, zone, party level, dust gained and the state on return (so the report can show where Shatters happen and what they buy). This changes what the bot does, not what the game does, so it needs to be applied to both arms of any future test and to a fresh production baseline.
4. Proposed diagnostic after that change: one batch, paired seeds 31-40 x idle/light/casual x 72h on the production build (no candidate arm; the comparison is against the 48h production baseline for the first 48h, which must reproduce exactly up to the first Shatter), reporting Shatter count and timing by profile, Keep entry level and Hollow King attempts before and after the first Shatter, hours in the Keep, ordinary loss rate in the Keep before and after, and whether the Hollow King becomes contested with one Shatter. That answers the first Shatter-wall question (does Shatter as currently tuned get a Lv 70 party through the Keep in a second day) before any Hollow King or Shatter value is discussed. If the reviewer would rather keep the 48h horizon, the same batch at 48h still shows whether Shatters occur at all under the fixed rule.
5. Hollow King facts for the reviewer's framing, from existing rows: HP x7, ATK x1.7, DEF x1.0, speed 8, AoE, drain, summons at 70% and 35%; actual ATK 8029 at Lv ~60 boss level for casual's Lv 71 arrival; the Grave Knight at x2.0 is 5586. The Keep boss therefore hits about 40% harder than the Grave Knight against a party that is only 1-2 levels higher, and a Shatter's effect on that ratio is what the diagnostic would measure.

## Recommendation (proposal only)
Reject threshold 5; keep AT_LOSSES = 4 and close Auto Training tuning as the review directed. Next: authorize the bot Shatter-rule fix (observation-only, simulator) and the single Shatter diagnostic above; no game value changes proposed.
IMPLEMENTATION_RISK: none (no production change). The bot change alters simulator behaviour only, and the diagnostic is one batch.

## Caveats
n=10 per cell; idle reaches the Grave Knight in 5-7 runs and clears it in 1-3, so its boss rows are thin. Light's paired directions are split on most rows (its result is marginal, not noisy). Ordinary loss rates are estimated from defeats over hours-in-zone times mean seconds per encounter. The compare tool's "(24h)" labels report end-of-run (48h) values; horizon rows are computed at 24, 36 and 48h.
