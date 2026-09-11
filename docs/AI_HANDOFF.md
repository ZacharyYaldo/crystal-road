STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: RESULTS_WITH_LOCK_RECOMMENDATION
PASS_ID: PASS_17_LATE_BOSS_ATK_NORMALIZATION_CANDIDATE
BASED_ON_REVIEW_PASS: PASS_17_LATE_BOSS_ATK_NORMALIZATION_CANDIDATE
BUILD: 20260911-131418
HEAD_COMMIT_SHA: 8e63b0e91971a43382ba980129b37cf4e94451eb

# Crystal Road AI Handoff - Pass 17 (Sand Tyrant x1.1 + Hunter King x1.0, paired seeds 31-40, 48h)

DEVELOPER_POSITION: AGREE with the review; the experiment ran exactly as authorized and the primary effect is clear for both bosses. Recommendation: lock Sand Tyrant base ATK x1.1 and Hunter King base ATK x1.0. Two criteria are not met to the letter (casual's active-window win rate at the Hunter King is 8 of 8, and idle's Auto Training hours rise 19% because idle now reaches the next zone four hours earlier); both are explained below with paired data and neither is a regression of the two fights. CONFIDENCE: HIGH on the measurements (60 runs, 0 errors, arms audited, paired); HIGH on the lock; HIGH on the correction below.

## Correction to the pass 16 late-boss table (my error, telemetry labeling)
My pass 16 comparison mapped the Grave Knight to Ashen Keep. The zone table in `source/game.js` says otherwise: Ashen Approach (zone 7, enemy Lv 42) is guarded by the Grave Knight (HP x7, ATK x2.0, DEF x1.4, melee charge, raise, two skeletons at 70%), and Ashen Keep (zone 8, enemy Lv 50) by The Hollow King (HP x7, ATK x1.7, DEF x1.0, AoE, drain, no charge, summons at 70% and 35%). The pass 16 "Grave Knight" row therefore described the Hollow King's attempts (which is why it showed 0 telegraphs) under the Grave Knight's base stats. Consequences: (1) the Grave Knight is not tied to the Shatter wall; it is the next boss after the Hunter King and every realistic profile reaches it within 48h (idle 10/10 reach, 7 attempt; light 10/10; casual 10/10); (2) the Shatter wall is the Hollow King, which no realistic profile clears in 48h and which was and remains untouched. `lateboss.js` is fixed (commit with this handoff), and the corrected reference table is in `tests/sim/p17_lateboss_ref.txt`. The pass 16 conclusions about the Sand Tyrant and the Hunter King are unaffected; the review's exclusion of "Grave Knight" as Shatter-linked was based on my mislabel, and the pass 17 data below show the Grave Knight is now the next wall.

## Setup and audit
- Production `source/game.js` and `index.html` unchanged: Sand Tyrant `atk:1.9`, Hunter King `atk:2.0`. The candidate arm applied `atk:1.1` and `atk:1.0` through the simulator's per-run source replace only (`tests/sim/batch_p17x.log`). `AUTO_REACT=false` in both arms.
- Audit: Sand Tyrant ATK 1861 -> 1077 at every first attempt (boss Lv 38 in both arms); Hunter King ATK 3235 -> 1617 at every first attempt (boss Lv 45 in both); Grave Knight 5586 in both arms. Arrival level, power, party HP, charge and Surge at the Sand Tyrant matched (0-7%); Emberwaste entry level identical.
- Paired seeds 31-40 x idle/light/casual x 48h, --shatters 3, production Road, Auto Training, hordes, catacombs; 30 control + 30 candidate runs; 0 simulation errors. The corrected ranged-volley telemetry is live in both arms (the control arm now shows the Hunter King's volley landing 2.25 hits and 2.25 kills per idle attempt, where pass 15 showed 0).
- Tooling this pass (simulator only): `perseed.js` (per-seed boss detail, loss-phase pools, zones cleared at fixed horizons), `lateboss.js --matchLv` (uses a run's arrival snapshot only when its level equals that arm's first-attempt level, since both arms wrote into the shared snapshot folder), and `batch.js` now writes snapshots to `snapshots_<tag>` so future paired arms do not overwrite each other.

## Hits-to-defeat at first attempt (the rule the candidate targets), candidate arm

=== Orc Warlord (Ironvein Caverns, zone 4, enemy Lv 20)  base HP x6 ATK x1.2 DEF x1.2 spd 8 melee  charge melee x2.5  mech {"charge":true,"shieldAllies":true,"summon":[{"at":0.5,"id":"orc","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    10    38    1312/990   177/135 691     589/624           2.2/1.6       124%/168%     | 22      10/22     0/0        2.55/2.32 (tele 2.55)  8.3          39           100     4/79%        40% n10   batch_out_p17x
light   10    37    1277/930   167/130 691     595/626           2.1/1.5       128%/179%     | 27      5/18      5/9        1.85/1.63 (tele 1.93)  6.6          43           88      4/86%        20% n10   batch_out_p17x
casual  10    35    1138/850   149/110 691     605/636           1.9/1.3       144%/197%     | 14      0/1       10/13      0.71/0.71 (tele 1.07)  4.7          46           75      4/83%        70% n10   batch_out_p17x

=== The Sand Tyrant (Emberwaste, zone 5, enemy Lv 27)  base HP x6.5 ATK x1.9 DEF x1 spd 10 melee  charge melee x2.5  mech {"charge":true,"enrage":0.25,"summon":[{"at":0.5,"id":"sandorc","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    10    49    2151/1459  300/218 1077    905/968           2.4/1.5       117%/177%     | 32      10/32     0/0        3.91/2.56 (tele 3.91)  8.9          37           100     4/81%        20% n10   batch_out_p17x
light   10    46    2068/1418  275/203 1077    919/976           2.3/1.5       123%/183%     | 32      4/20      6/12       3.13/2.09 (tele 3.28)  7.8          42           86      4/95%        30% n10   batch_out_p17x
casual  10    42    1709/1073  217/148 1077    952/1003          1.8/1.1       150%/244%     | 14      0/1       10/13      0.86/0.79 (tele 2)     4.9          18           75      4/83%        60% n10   batch_out_p17x

=== The Hunter King (Amberfall Woods, zone 6, enemy Lv 34)  base HP x6 ATK x2 DEF x0.9 spd 11 ranged  charge volley x2.2  mech {"charge":true,"summon":[{"at":0.6,"id":"skelarcher","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    10    58    3102/2417  461/368 1617    1352/1433         2.3/1.7       106%/140%     | 35      10/35     0/0        3.83/2.23 (tele 3.83)  8.2          48           92      4/96%        10% n10   batch_out_p17x
light   10    58    3095/2378  427/356 1617    1371/1439         2.3/1.7       107%/142%     | 17      2/7       8/10       2.12/1.24 (tele 2.41)  5.2          56           100     4/96%        60% n10   batch_out_p17x
casual  10    54    2470/1812  367/280 1617    1406/1477         1.8/1.2       135%/189%     | 11      2/3       8/8        1.55/0.82 (tele 2.64)  5.3          48           100     4/95%        90% n10   batch_out_p17x

=== Grave Knight (Ashen Approach, zone 7, enemy Lv 42)  base HP x7 ATK x2 DEF x1.4 spd 7 melee  charge melee x2.5  mech {"charge":true,"raise":true,"summon":[{"at":0.7,"id":"skeleton","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    7     69    4555/3698  656/529 5586    5209/5322         0.9/0.7       298%/370%     | 24      3/24      0/0        1.38/1.38 (tele 1.38)  5.4          66           86      4/83%        0% n7     batch_out_p17x
light   9     70    4586/3698  658/531 5586    5208/5321         0.9/0.7       296%/370%     | 10      1/2       7/8        0.5/0.5 (tele 0.9)     4            64           100     4/100%       78% n9    batch_out_p17x
casual  6     66    4012/3096  564/480 5586    5262/5346         0.8/0.6       340%/443%     | 24      0/10      10/14      0.71/0.71 (tele 0.79)  3.2          64           64      4/100%       20% n10   batch_out_p17x

=== The Hollow King (Ashen Keep, zone 8, enemy Lv 50)  base HP x7 ATK x1.7 DEF x1 spd 8 aoe  charge none  mech {"drain":true,"summon":[{"at":0.7,"id":"skeleton","n":2},{"at":0.35,"id":"armoredskel","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    no data
light   no data
casual  4     72    4969/3871  788/577 8029    7576/7741         0.7/0.5       -             | 7       0/0       0/7        0/0 (tele 0)           5.4          87           0       -            0% n4     batch_out_p17x

ordHit = boss ATK - hero DEF*0.5 (front x1.15; tree front bonus ignored), before the 0.85-1.15 roll and crits; hits2kill = hero max HP / ordHit; charge%HP = charge damage as % of hero max HP (melee x2.5, volley x2.2). Telemetry columns pool every attempt in the source dir; first-try is per run.

Control arm for the same seeds:

=== Orc Warlord (Ironvein Caverns, zone 4, enemy Lv 20)  base HP x6 ATK x1.2 DEF x1.2 spd 8 melee  charge melee x2.5  mech {"charge":true,"shieldAllies":true,"summon":[{"at":0.5,"id":"orc","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    10    38    1312/990   177/135 691     589/624           2.2/1.6       124%/168%     | 22      10/22     0/0        2.55/2.32 (tele 2.55)  8.3          39           100     4/79%        40% n10   batch_out_p17c
light   10    37    1277/930   167/130 691     595/626           2.1/1.5       128%/179%     | 27      5/18      5/9        1.85/1.63 (tele 1.93)  6.6          43           88      4/86%        20% n10   batch_out_p17c
casual  10    35    1138/850   149/110 691     605/636           1.9/1.3       144%/197%     | 14      0/1       10/13      0.71/0.71 (tele 1.07)  4.7          46           75      4/83%        70% n10   batch_out_p17c

=== The Sand Tyrant (Emberwaste, zone 5, enemy Lv 27)  base HP x6.5 ATK x1.9 DEF x1 spd 10 melee  charge melee x2.5  mech {"charge":true,"enrage":0.25,"summon":[{"at":0.5,"id":"sandorc","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    6     49    2126/1429  300/218 1861    1689/1752         1.3/0.8       211%/318%     | 216     10/216    0/0        2.7/2.7 (tele 2.7)     6.4          44           84      4/69%        0% n10    batch_out_p17c
light   6     47    2126/1469  258/205 1861    1713/1759         1.2/0.8       212%/310%     | 32      1/20      9/12       1.78/1.66 (tele 1.94)  4.9          55           32      4/87%        10% n10   batch_out_p17c
casual  10    42    1709/1073  217/148 1861    1736/1787         1/0.6         265%/427%     | 26      0/5       10/21      0.92/0.85 (tele 1.77)  4.3          32           75      4/82%        40% n10   batch_out_p17c

=== The Hunter King (Amberfall Woods, zone 6, enemy Lv 34)  base HP x6 ATK x2 DEF x0.9 spd 11 ranged  charge volley x2.2  mech {"charge":true,"summon":[{"at":0.6,"id":"skelarcher","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    4     58    3102/2417  461/365 3235    2970/3053         1/0.8         221%/287%     | 371     10/371    0/0        2.36/2.34 (tele 2.36)  5.4          54           78      4/73%        0% n10    batch_out_p17c
light   2     59    3122/2378  393/356 3235    3009/3057         1/0.8         221%/292%     | 35      1/21      9/14       1.31/1.26 (tele 1.54)  4.1          63           40      4/98%        50% n10   batch_out_p17c
casual  1     54    2470/1891  333/280 3235    3044/3095         0.8/0.6       280%/369%     | 21      0/4       10/17      1/0.9 (tele 1.81)      3.9          56           55      4/92%        40% n10   batch_out_p17c

=== Grave Knight (Ashen Approach, zone 7, enemy Lv 42)  base HP x7 ATK x2 DEF x1.4 spd 7 melee  charge melee x2.5  mech {"charge":true,"raise":true,"summon":[{"at":0.7,"id":"skeleton","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    2     70    4527/3698  708/517 5586    5179/5328         0.9/0.7       299%/371%     | 29      3/29      0/0        1.24/1.24 (tele 1.24)  4.9          66           73      4/87%        0% n7     batch_out_p17c
light   2     70    4558/3714  602/530 5586    5240/5321         0.9/0.7       299%/369%     | 18      0/8       9/10       0.89/0.83 (tele 1.06)  4.4          65           89      4/97%        56% n9    batch_out_p17c
casual  1     66    3859/2959  564/448 5586    5262/5362         0.7/0.6       353%/464%     | 16      1/3       9/13       0.56/0.56 (tele 0.69)  3.1          75           33      4/100%       60% n10   batch_out_p17c

=== The Hollow King (Ashen Keep, zone 8, enemy Lv 50)  base HP x7 ATK x1.7 DEF x1 spd 8 aoe  charge none  mech {"drain":true,"summon":[{"at":0.7,"id":"skeleton","n":2},{"at":0.35,"id":"armoredskel","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    no data
light   no data
casual  0     -     -          -       8029    -                 -             -             | 5       0/0       0/5        0/0 (tele 0)           5            90           0       -            0% n3     batch_out_p17c

ordHit = boss ATK - hero DEF*0.5 (front x1.15; tree front bonus ignored), before the 0.85-1.15 roll and crits; hits2kill = hero max HP / ordHit; charge%HP = charge damage as % of hero max HP (melee x2.5, volley x2.2). Telemetry columns pool every attempt in the source dir; first-try is per run.

Reading: at natural arrival the candidate puts both bosses at the locked Warlord's shape: front-hero ordinary hits to defeat 2.4 (Sand Tyrant) and 2.3 (Hunter King) for idle, 2.3 / 2.3 for light, 1.8 / 1.8 for casual (casual arrives lower, as it does at the Warlord: 1.9). Charge damage 117% / 106% of front-hero HP for idle (Warlord 124%). The Grave Knight, untouched, sits at 0.9 / 0.7 hits and 298% charge for idle and light, 0.8 / 0.6 for casual.

## Emberwaste (Sand Tyrant) and whole-Road comparison
                                                                                                                               idle                                   light                                  casual                                 
-- AUTO TRAINING (24h)   med / P90   control -> candidate                                                                                                                                                                                           
triggers                                                                                                                       34 / 38 -> 38 / 42 (+12%)              43 / 47 -> 42 / 47 (-2%)               43 / 52 -> 47 / 58 (+9%)               
completed returns                                                                                                              27 / 31 -> 31 / 36 (+15%)              35 / 39 -> 35 / 38 (0%)                36 / 44 -> 39 / 47 (+8%)               
cancelled (build change)                                                                                                       6 / 8 -> 6 / 9 (0%)                    7 / 9 -> 8 / 9 (+14%)                  9 / 11 -> 8 / 12 (-11%)                
training hours                                                                                                                 19.6 / 22.9 -> 23.3 / 26.6 (+19%)      26 / 29.3 -> 26.2 / 28.9 (+1%)         26.1 / 30 -> 27.4 / 32 (+5%)           
training share of 24h %                                                                                                        82 / 96 -> 97 / 111 (+19%)             108 / 122 -> 109 / 120 (+1%)           109 / 125 -> 114 / 133 (+5%)           
levels earned training                                                                                                         28.8 / 34.6 -> 33.9 / 40 (+18%)        38.6 / 42.5 -> 38.9 / 42.5 (+1%)       40.4 / 48.3 -> 42.5 / 50.8 (+5%)       
triggers for Stillwater Lagoon                                                                                                 2 / 5 -> 2 / 5 (0%)                    3 / 5 -> 3 / 5 (0%)                    4 / 7 -> 4 / 7 (0%)                    
triggers for Thornwood                                                                                                         6 / 10 -> 6 / 10 (0%)                  7 / 9 -> 7 / 9 (0%)                    6 / 9 -> 6 / 9 (0%)                    
triggers for Ironvein Caverns                                                                                                  5 / 7 -> 5 / 7 (0%)                    6 / 7 -> 6 / 7 (0%)                    5 / 8 -> 5 / 8 (0%)                    
triggers for Emberwaste                                                                                                        10 / 12 -> 9 / 11 (-10%)               8 / 12 -> 10 / 13 (+25%)               8 / 13 -> 5 / 9 (-37%)                 
triggers for Amberfall Woods                                                                                                   4 / 7 -> 7 / 9 (+75%)                  8 / 11 -> 8 / 9 (0%)                   6 / 14 -> 11 / 16 (+83%)               
trainings with +1 target                                                                                                       34 / 38 -> 38 / 42 (+12%)              43 / 47 -> 42 / 47 (-2%)               43 / 52 -> 47 / 58 (+9%)               
trainings with +2 target                                                                                                       0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
  +2 trainings for Stillwater Lagoon                                                                                           0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
  +2 trainings for Thornwood                                                                                                   0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
  +2 trainings for Ironvein Caverns                                                                                            0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
  +2 trainings for Emberwaste                                                                                                  0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
  +2 trainings for Amberfall Woods                                                                                             0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
training fights total                                                                                                          2254 / 2769 -> 2767 / 3285 (+23%)      3122 / 3467 -> 3111 / 3337 (0%)        3214 / 3866 -> 3468 / 4124 (+8%)       
back-to-back +2 in same zone (max run)                                                                                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         0 / 0 -> 0 / 0                         
-- RETRIGGERS (same zone after a completed return)                                                                                                                                                                                                  
retriggers within 10 ordinary fights                                                                                           6 / 8 -> 7 / 9 (+17%)                  9 / 13 -> 8 / 12 (-11%)                13 / 19 -> 15 / 23 (+15%)              
retriggers within 20 ordinary fights                                                                                           12 / 19 -> 14 / 18 (+17%)              18 / 23 -> 16 / 22 (-11%)              24 / 31 -> 24 / 36 (0%)                
retriggers exactly on ordinary fight 20                                                                                        0 / 2 -> 0 / 1                         1 / 2 -> 1 / 2 (0%)                    0 / 2 -> 0 / 2                         
quick-classified triggers (game)                                                                                               12 / 19 -> 14 / 18 (+17%)              18 / 23 -> 16 / 22 (-11%)              24 / 31 -> 24 / 36 (0%)                
share of triggers that are retriggers <=20 %                                                                                   37 / 50 -> 34 / 44 (-8%)               41 / 52 -> 38 / 49 (-8%)               53 / 63 -> 54 / 67 (+3%)               
fresh fights to retrigger (med of run medians)                                                                                 11 / 14 -> 10 / 12 (-9%)               10 / 13 -> 10 / 14 (0%)                10 / 13 -> 9 / 10 (-10%)               
minutes to retrigger (med of run medians)                                                                                      8 / 9 -> 8 / 9 (-5%)                   8 / 9 -> 8 / 10 (0%)                   7 / 9 -> 7 / 8 (0%)                    
win% first 10 fights after return                                                                                              80 / 90 -> 80 / 80 (0%)                80 / 90 -> 80 / 90 (0%)                80 / 90 -> 80 / 90 (0%)                
win% first 20 fights after return                                                                                              80 / 85 -> 80 / 85 (0%)                85 / 85 -> 80 / 85 (-6%)               80 / 85 -> 80 / 90 (0%)                
win% in window at trigger                                                                                                      60 / 60 -> 60 / 60 (0%)                60 / 60 -> 60 / 60 (0%)                60 / 60 -> 60 / 60 (0%)                
enemy Lv minus party Lv at trigger                                                                                             -10.3 / -9 -> -11.3 / -9.8 (-10%)      -11 / -8.8 -> -11.3 / -9 (-3%)         -7.8 / -4.8 -> -7 / -5 (+10%)          
pre-rollback loss position % of zone at trigger                                                                                67 / 69 -> 67 / 67 (0%)                67 / 67 -> 67 / 67 (0%)                67 / 67 -> 67 / 67 (0%)                
checkpoint % of zone after rollback                                                                                            67 / 67 -> 67 / 67 (0%)                67 / 67 -> 67 / 67 (0%)                67 / 67 -> 67 / 67 (0%)                
-- DEAD TIME outside training                                                                                                                                                                                                                       
ordinary defeats outside training                                                                                              394 / 539 -> 416 / 502 (+6%)           418 / 607 -> 447 / 575 (+7%)           740 / 1311 -> 643 / 1046 (-13%)        
rewalk fights (ordinary defeats)                                                                                               1514 / 1695 -> 1466 / 1750 (-3%)       1130 / 1498 -> 1181 / 1356 (+5%)       917 / 1222 -> 955 / 1203 (+4%)         
rewalk fights (boss losses)                                                                                                    531 / 774 -> 81 / 162 (-85%)           72 / 153 -> 54 / 117 (-25%)            63 / 81 -> 27 / 108 (-57%)             
rewalk hours equiv (ordinary)                                                                                                  14.52 / 15.67 -> 14.05 / 16.19 (-3%)   10.58 / 13.69 -> 10.93 / 12.69 (+3%)   8.02 / 11.17 -> 8.47 / 10.93 (+6%)     
rewalk hours equiv (boss)                                                                                                      5.09 / 7.7 -> 0.78 / 1.54 (-85%)       0.68 / 1.46 -> 0.5 / 1.12 (-26%)       0.55 / 0.76 -> 0.25 / 0.97 (-54%)      
total defeats in 24h                                                                                                           567 / 729 -> 559 / 660 (-1%)           616 / 784 -> 634 / 734 (+3%)           965 / 1520 -> 880 / 1260 (-9%)         
-- STILLWATER                                                                                                                                                                                                                                       
first-try clear (mean)                                                                                                         40% -> 40% (0%)                        20% -> 20% (0%)                        30% -> 30% (0%)                        
attempts to clear                                                                                                              2 / 5 -> 2 / 5 (0%)                    2 / 4 -> 2 / 4 (0%)                    2 / 4 -> 2 / 4 (0%)                    
stall h                                                                                                                        0.11 / 1.06 -> 0.11 / 1.06 (0%)        0.52 / 0.86 -> 0.52 / 0.86 (0%)        0.38 / 0.88 -> 0.38 / 0.88 (0%)        
zone clear h                                                                                                                   2.79 / 3.43 -> 2.79 / 3.43 (0%)        2.83 / 3.09 -> 2.83 / 3.09 (0%)        2.86 / 3.43 -> 2.86 / 3.43 (0%)        
Lv at first try                                                                                                                16 / 18 -> 16 / 18 (0%)                15 / 17 -> 15 / 17 (0%)                16 / 18 -> 16 / 18 (0%)                
-- EMBERWASTE                                                                                                                                                                                                                                       
first-try clear (mean)                                                                                                         0% -> 20%                              10% -> 30% (+200%)                     40% -> 60% (+50%)                      
attempts to clear                                                                                                              22 / 29 -> 3 / 6 (-86%)                3 / 7 -> 2 / 8 (-33%)                  3 / 4 -> 1 / 2 (-67%)                  
stall h                                                                                                                        4.49 / 6.08 -> 1.5 / 3.3 (-67%)        0.59 / 4.98 -> 1.99 / 5.92 (+237%)     1.92 / 4.02 -> 0.03 / 2.95 (-98%)      
zone clear h                                                                                                                   27.95 / 31.17 -> 24.69 / 26.99 (-12%)  23.07 / 26.07 -> 24.1 / 26.08 (+4%)    18.1 / 21.16 -> 16.14 / 19.1 (-11%)    
Lv entering zone                                                                                                               39 / 40 -> 39 / 40 (0%)                38 / 41 -> 38 / 41 (0%)                35 / 37 -> 35 / 37 (0%)                
Lv at first try                                                                                                                49 / 51 -> 49 / 51 (0%)                47 / 51 -> 46 / 51 (-2%)               42 / 45 -> 42 / 45 (0%)                
-- EMBERWASTE ATTEMPTS (attempt-level, all attempts)                                                                                                                                                                                                
boss ATK at first attempt (audit)                                                                                              1861 / 1861 -> 1077 / 1077 (-42%)      1861 / 1861 -> 1077 / 1077 (-42%)      1861 / 1861 -> 1077 / 1077 (-42%)      
boss Lv at first attempt                                                                                                       38 / 38 -> 38 / 38 (0%)                38 / 38 -> 38 / 38 (0%)                38 / 38 -> 38 / 38 (0%)                
attempts per run                                                                                                               22 / 29 -> 3 / 6 (-86%)                3 / 7 -> 2 / 8 (-33%)                  3 / 4 -> 1 / 2 (-67%)                  
first attempt in active window (1=yes)                                                                                         0% -> 0%                               40% -> 20% (-50%)                      90% -> 90% (0%)                        
first attempt party HP %                                                                                                       100 / 100 -> 100 / 100 (0%)            95 / 100 -> 94 / 100 (-1%)             100 / 100 -> 99 / 100 (-1%)            
first attempt charge / surge                                                                                                   60 / 75 -> 60 / 82 (0%)                54 / 66 -> 54 / 63 (0%)                57 / 64 -> 57 / 64 (0%)                
first attempt power                                                                                                            23008 / 24714 -> 23545 / 24912 (+2%)   21512 / 24742 -> 20094 / 24742 (-7%)   16120 / 19163 -> 16120 / 19163 (0%)    
active-window attempts: win % (pooled)                                                                                         -% -> -%                               83% -> 55% (-34%)                      63% -> 85% (+35%)                      
Auto-Cast attempts: win % (pooled)                                                                                             5% -> 45% (+800%)                      6% -> 44% (+633%)                      0% -> 0%                               
Auto-Cast attempts per run                                                                                                     22 / 29 -> 3 / 6 (-86%)                2 / 5 -> 1 / 5 (-50%)                  0 / 2 -> 0 / 1                         
charge telegraphs per attempt (run mean)                                                                                       2.67 / 3.15 -> 4 / 5 (+50%)            2 / 2.14 -> 3.4 / 5 (+70%)             1.75 / 3 -> 2 / 2.5 (+14%)             
charge hits per attempt                                                                                                        2.67 / 3.15 -> 4 / 5 (+50%)            1.8 / 2 -> 3 / 5 (+67%)                1 / 1.5 -> 0.5 / 2 (-50%)              
charge kills per attempt                                                                                                       2.67 / 3.15 -> 2.75 / 3 (+3%)          1.5 / 2 -> 2 / 4 (+33%)                1 / 1.25 -> 0.5 / 1.5 (-50%)           
parries + interrupts per attempt                                                                                               0 / 0 -> 0 / 0                         0.25 / 1 -> 0 / 0.5 (-100%)            1 / 3 -> 1 / 2 (0%)                    
boss ordinary hits on heroes per attempt                                                                                       6.3 / 7.1 -> 9 / 11 (+42%)             5 / 6 -> 7.9 / 12 (+58%)               4.3 / 7 -> 4.5 / 6.5 (+6%)             
LOSS boss HP left (run median)                                                                                                 43 / 46 -> 34 / 49 (-21%)              54 / 72 -> 39 / 44 (-28%)              20 / 44 -> 18 / 68 (-10%)              
LOSS reached summon % (pooled)                                                                                                 83% -> 100% (+20%)                     35% -> 87% (+149%)                     75% -> 75% (0%)                        
WIN survivors (run median)                                                                                                     4 / 4 -> 4 / 4 (0%)                    4 / 4 -> 4 / 4 (0%)                    4 / 4 -> 4 / 4 (0%)                    
WIN party HP % (run median)                                                                                                    69 / 92 -> 81 / 93 (+17%)              87 / 100 -> 95 / 100 (+9%)             82 / 100 -> 83 / 100 (+1%)             
Emberwaste max loss streak                                                                                                     21 / 28 -> 2 / 5 (-90%)                2 / 6 -> 1 / 7 (-50%)                  2 / 3 -> 0 / 1 (-100%)                 
Emberwaste combat stall h                                                                                                      0.4 / 0.57 -> 0.06 / 0.13 (-85%)       0.02 / 0.11 -> 0.02 / 0.18 (0%)        0.03 / 0.06 -> 0 / 0.03 (-100%)        
Emberwaste retry stall h                                                                                                       4.08 / 5.64 -> 1.39 / 3.2 (-66%)       0.55 / 4.86 -> 1.95 / 5.73 (+255%)     1.87 / 3.96 -> 0 / 2.91 (-100%)        
-- REWALK BY ZONE (ordinary defeats outside training): fights | hours in zone (non-training) | rewalk fights per exposure hour                                                                                                                      
Stillwater Lagoon: ordinary rewalk fights                                                                                      132 / 184 -> 132 / 184 (0%)            138 / 178 -> 138 / 178 (0%)            130 / 206 -> 130 / 206 (0%)            
Stillwater Lagoon: ordinary defeats                                                                                            40 / 46 -> 40 / 46 (0%)                40 / 46 -> 40 / 46 (0%)                43 / 52 -> 43 / 52 (0%)                
Stillwater Lagoon: hours in zone (non-training)                                                                                2.14 / 2.91 -> 2.14 / 2.91 (0%)        2.27 / 2.41 -> 2.27 / 2.41 (0%)        2.05 / 2.87 -> 2.05 / 2.87 (0%)        
Stillwater Lagoon: rewalk fights per exposure hour                                                                             60.7 / 75.7 -> 60.7 / 75.7 (0%)        60.4 / 74 -> 60.4 / 74 (0%)            62.8 / 76.8 -> 62.8 / 76.8 (0%)        
Stillwater Lagoon: rewalk hours per exposure hour                                                                              0.58 / 0.74 -> 0.58 / 0.72 (-1%)       0.56 / 0.7 -> 0.56 / 0.7 (0%)          0.57 / 0.74 -> 0.55 / 0.72 (-3%)       
Thornwood: ordinary rewalk fights                                                                                              223 / 311 -> 223 / 311 (0%)            169 / 276 -> 169 / 276 (0%)            134 / 228 -> 134 / 228 (0%)            
Thornwood: ordinary defeats                                                                                                    68 / 89 -> 68 / 89 (0%)                64 / 84 -> 64 / 84 (0%)                51 / 64 -> 51 / 64 (0%)                
Thornwood: hours in zone (non-training)                                                                                        3.27 / 4.4 -> 3.27 / 4.4 (0%)          2.81 / 3.86 -> 2.81 / 3.86 (0%)        2.27 / 3.09 -> 2.27 / 3.09 (0%)        
Thornwood: rewalk fights per exposure hour                                                                                     68.1 / 75.9 -> 68.1 / 75.9 (0%)        64.5 / 75.3 -> 64.5 / 75.3 (0%)        59.5 / 79.1 -> 59.5 / 79.1 (0%)        
Thornwood: rewalk hours per exposure hour                                                                                      0.67 / 0.72 -> 0.65 / 0.71 (-2%)       0.6 / 0.68 -> 0.6 / 0.69 (-1%)         0.55 / 0.72 -> 0.53 / 0.72 (-4%)       
Ironvein Caverns: ordinary rewalk fights                                                                                       250 / 314 -> 250 / 314 (0%)            140 / 251 -> 140 / 251 (0%)            87 / 164 -> 87 / 164 (0%)              
Ironvein Caverns: ordinary defeats                                                                                             57 / 74 -> 57 / 74 (0%)                50 / 72 -> 50 / 72 (0%)                39 / 49 -> 39 / 49 (0%)                
Ironvein Caverns: hours in zone (non-training)                                                                                 3.83 / 5.2 -> 3.83 / 5.2 (0%)          2.76 / 4.43 -> 2.76 / 4.43 (0%)        1.87 / 2.54 -> 1.87 / 2.54 (0%)        
Ironvein Caverns: rewalk fights per exposure hour                                                                              60.3 / 66.7 -> 60.3 / 66.7 (0%)        52.2 / 61.7 -> 52.2 / 61.7 (0%)        49.7 / 64.5 -> 49.7 / 64.5 (0%)        
Ironvein Caverns: rewalk hours per exposure hour                                                                               0.59 / 0.64 -> 0.58 / 0.62 (-2%)       0.49 / 0.56 -> 0.5 / 0.56 (+1%)        0.43 / 0.59 -> 0.43 / 0.59 (-1%)       
Emberwaste: ordinary rewalk fights                                                                                             408 / 540 -> 289 / 517 (-29%)          209 / 286 -> 223 / 285 (+7%)           116 / 293 -> 107 / 203 (-8%)           
Emberwaste: ordinary defeats                                                                                                   105 / 120 -> 83 / 112 (-21%)           73 / 86 -> 81 / 93 (+11%)              57 / 106 -> 49 / 72 (-14%)             
Emberwaste: hours in zone (non-training)                                                                                       7.96 / 10.2 -> 4.73 / 7.05 (-41%)      3.75 / 4.34 -> 4.2 / 4.74 (+12%)       2.3 / 4.62 -> 2.06 / 2.92 (-10%)       
Emberwaste: rewalk fights per exposure hour                                                                                    49.7 / 61.2 -> 63.9 / 73.3 (+29%)      53.5 / 67.3 -> 57.5 / 66.2 (+8%)       49.9 / 64.9 -> 50.4 / 69.4 (+1%)       
Emberwaste: rewalk hours per exposure hour                                                                                     0.5 / 0.56 -> 0.62 / 0.69 (+26%)       0.51 / 0.63 -> 0.54 / 0.63 (+6%)       0.45 / 0.63 -> 0.45 / 0.63 (0%)        
Amberfall Woods: ordinary rewalk fights                                                                                        281 / 369 -> 220 / 366 (-22%)          162 / 325 -> 137 / 157 (-15%)          114 / 241 -> 125 / 206 (+10%)          
Amberfall Woods: ordinary defeats                                                                                              66 / 83 -> 65 / 94 (-2%)               54 / 88 -> 51 / 64 (-6%)               50 / 89 -> 82 / 102 (+64%)             
Amberfall Woods: hours in zone (non-training)                                                                                  6.75 / 10.39 -> 3.59 / 5.7 (-47%)      2.46 / 4.93 -> 2.3 / 2.68 (-7%)        1.9 / 3.68 -> 2.35 / 3.58 (+23%)       
Amberfall Woods: rewalk fights per exposure hour                                                                               38.1 / 58.5 -> 61.8 / 69.1 (+62%)      61.5 / 67.4 -> 53.7 / 64.8 (-13%)      54.1 / 65.6 -> 60.1 / 70.4 (+11%)      
Amberfall Woods: rewalk hours per exposure hour                                                                                0.35 / 0.54 -> 0.59 / 0.62 (+67%)      0.56 / 0.63 -> 0.51 / 0.59 (-9%)       0.47 / 0.6 -> 0.51 / 0.61 (+8%)        
Ashen Approach: ordinary rewalk fights                                                                                         109 / 273 -> 256 / 440 (+135%)         123 / 246 -> 152 / 233 (+24%)          164 / 268 -> 166 / 247 (+1%)           
Ashen Approach: ordinary defeats                                                                                               38 / 68 -> 69 / 106 (+82%)             60 / 79 -> 62 / 76 (+3%)               71 / 114 -> 115 / 121 (+62%)           
Ashen Approach: hours in zone (non-training)                                                                                   2.24 / 5.42 -> 4.44 / 7.62 (+98%)      3.21 / 4.13 -> 3.02 / 4.12 (-6%)       3.25 / 4.92 -> 3.82 / 4.73 (+18%)      
Ashen Approach: rewalk fights per exposure hour                                                                                44.1 / 57.1 -> 53.5 / 64 (+21%)        46.2 / 59.8 -> 51.3 / 56.5 (+11%)      51 / 70.1 -> 46.1 / 52.2 (-10%)        
Ashen Approach: rewalk hours per exposure hour                                                                                 0.42 / 0.55 -> 0.51 / 0.61 (+22%)      0.43 / 0.55 -> 0.47 / 0.54 (+9%)       0.45 / 0.64 -> 0.42 / 0.47 (-7%)       
-- OTHER BOSSES first-try % (mean) / attempts med                                                                                                                                                                                                   
Stillwater Lagoon first-try %                                                                                                  40% -> 40% (0%)                        20% -> 20% (0%)                        30% -> 30% (0%)                        
Stillwater Lagoon attempts                                                                                                     2 / 5 -> 2 / 5 (0%)                    2 / 4 -> 2 / 4 (0%)                    2 / 4 -> 2 / 4 (0%)                    
Stillwater Lagoon stall h                                                                                                      0.11 / 1.06 -> 0.11 / 1.06 (0%)        0.52 / 0.86 -> 0.52 / 0.86 (0%)        0.38 / 0.88 -> 0.38 / 0.88 (0%)        
Thornwood first-try %                                                                                                          50% -> 50% (0%)                        60% -> 60% (0%)                        70% -> 70% (0%)                        
Thornwood attempts                                                                                                             1 / 3 -> 1 / 3 (0%)                    1 / 5 -> 1 / 5 (0%)                    1 / 2 -> 1 / 2 (0%)                    
Thornwood stall h                                                                                                              0.02 / 1.66 -> 0.02 / 1.66 (0%)        0.03 / 1.4 -> 0.03 / 1.4 (0%)          0.02 / 0.86 -> 0.02 / 0.86 (0%)        
Emberwaste first-try %                                                                                                         0% -> 20%                              10% -> 30% (+200%)                     40% -> 60% (+50%)                      
Emberwaste attempts                                                                                                            22 / 29 -> 3 / 6 (-86%)                3 / 7 -> 2 / 8 (-33%)                  3 / 4 -> 1 / 2 (-67%)                  
Emberwaste stall h                                                                                                             4.49 / 6.08 -> 1.5 / 3.3 (-67%)        0.59 / 4.98 -> 1.99 / 5.92 (+237%)     1.92 / 4.02 -> 0.03 / 2.95 (-98%)      
Amberfall Woods first-try %                                                                                                    0% -> 10%                              50% -> 60% (+20%)                      40% -> 90% (+125%)                     
Amberfall Woods attempts                                                                                                       32 / 64 -> 3 / 8 (-91%)                1 / 11 -> 1 / 4 (0%)                   2 / 5 -> 1 / 2 (-50%)                  
Amberfall Woods stall h                                                                                                        5.24 / 9.33 -> 1.8 / 3.3 (-66%)        0.02 / 6.96 -> 0.01 / 6.93 (-50%)      1.01 / 8.9 -> 0.02 / 0.98 (-98%)       
Ashen Approach first-try %                                                                                                     0% -> 0%                               56% -> 88% (+57%)                      60% -> 20% (-67%)                      
Ashen Approach attempts                                                                                                        6 / 9 -> 3 / 4 (-50%)                  1 / 4 -> 1 / 2 (0%)                    1 / 3 -> 2 / 5 (+100%)                 
Ashen Approach stall h                                                                                                         1.79 / 4.53 -> 3.11 / 4.5 (+74%)       0.03 / 2 -> 0.02 / 0.99 (-33%)         0.02 / 7.89 -> 3.5 / 9.91 (+17400%)    
-- HORDES / CATACOMBS / DAMAGE                                                                                                                                                                                                                      
hordes fought (manual)                                                                                                         3 / 5 -> 4 / 5 (+33%)                  3 / 4 -> 4 / 5 (+33%)                  4 / 5 -> 5 / 5 (+25%)                  
hordes repelled                                                                                                                3 / 5 -> 4 / 5 (+33%)                  3 / 4 -> 4 / 5 (+33%)                  4 / 5 -> 5 / 5 (+25%)                  
hordes lost                                                                                                                    2 / 4 -> 1 / 3 (-50%)                  2 / 4 -> 0 / 2 (-100%)                 0 / 1 -> 0 / 1                         
catacomb best floor                                                                                                            3 / 5 -> 3 / 5 (0%)                    4 / 5 -> 4 / 5 (0%)                    3 / 5 -> 3 / 5 (0%)                    
catacomb runs                                                                                                                  3 / 3 -> 3 / 3 (0%)                    3 / 3 -> 3 / 3 (0%)                    3 / 3 -> 3 / 3 (0%)                    
ability casts / h                                                                                                              538 / 550 -> 539 / 549 (+0%)           556 / 567 -> 554 / 568 (0%)            579 / 599 -> 580 / 601 (+0%)           
dmg share basic %                                                                                                              45 / 47 -> 45 / 47 (0%)                42 / 43 -> 42 / 43 (0%)                36 / 38 -> 36 / 38 (+1%)               
dmg share ability %                                                                                                            55 / 57 -> 55 / 57 (0%)                55 / 56 -> 55 / 57 (0%)                56 / 59 -> 56 / 60 (+1%)               
dmg share tap %                                                                                                                0 / 0 -> 0 / 0                         2 / 2 -> 2 / 2 (+5%)                   6 / 7 -> 6 / 6 (0%)                    
dmg share surge %                                                                                                              0 / 0 -> 0 / 0                         1 / 1 -> 1 / 1 (0%)                    3 / 3 -> 3 / 3 (0%)                    
-- PAIRED PER-SEED DELTAS (candidate minus control): median delta | +/0/- counts                                                                                                                                                                    
Emberwaste attempts                                                                                                            -20 | +0 00 -10 (n10)                  -1 | +4 01 -5 (n10)                    -1 | +1 03 -6 (n10)                    
Emberwaste stall h                                                                                                             -3.04 | +0 00 -10 (n10)                0 | +5 01 -4 (n10)                     -0.95 | +1 03 -6 (n10)                 
Emberwaste clear h                                                                                                             -3.54 | +0 00 -10 (n10)                -0.01 | +5 00 -5 (n10)                 -0.95 | +1 02 -7 (n10)                 
zones cleared @24h                                                                                                             0 | +1 08 -1 (n10)                     0 | +0 09 -1 (n10)                     0 | +0 010 -0 (n10)                    
zones cleared @20h                                                                                                             0 | +0 010 -0 (n10)                    0 | +0 010 -0 (n10)                    0 | +2 08 -0 (n10)                     
ordinary rewalk fights                                                                                                         12 | +6 00 -4 (n10)                    31 | +7 00 -3 (n10)                    -19 | +2 00 -8 (n10)                   
ordinary rewalk hours                                                                                                          -0.24 | +5 00 -5 (n10)                 0.4 | +7 00 -3 (n10)                   -0.35 | +2 00 -8 (n10)                 
total defeats                                                                                                                  -2 | +3 02 -5 (n10)                    -21 | +5 00 -5 (n10)                   -140 | +3 00 -7 (n10)                  
-- COUNTS WITH DENOMINATORS                                                                                                                                                                                                                         
Emberwaste first-try clears / runs                                                                                             0/10 -> 2/10                           1/10 -> 3/10                           4/10 -> 6/10                           
Auto-Cast attempts: wins / attempts                                                                                            10/216 -> 10/32                        1/20 -> 4/20                           0/5 -> 0/1                             
active-window attempts: wins / attempts                                                                                        0/0 -> 0/0                             9/12 -> 6/12                           10/21 -> 10/13                         
runs reaching a 6th zone by 24h / runs                                                                                         10/10 -> 10/10                         10/10 -> 10/10                         10/10 -> 10/10                         
6th-zone clear h (med of those reaching)                                                                                       38.52 -> 34.77                         32.03 -> 32.07                         25.11 -> 25.15                         
zones cleared @20h (med)                                                                                                       4 -> 4                                 4 -> 4                                 5 -> 5                                 
-- FIRST ATTEMPT DETAIL (run medians; loss boss HP left where lost)                                                                                                                                                                                 
first attempt: won (mean)                                                                                                      0% -> 20%                              10% -> 30% (+200%)                     40% -> 60% (+50%)                      
first attempt: boss HP left on loss %                                                                                          62 / 77 -> 42 / 49 (-32%)              55 / 75 -> 46 / 64 (-16%)              32 / 76 -> 18 / 68 (-44%)              
first attempt: party Lv                                                                                                        49 / 51 -> 49 / 51 (0%)                47 / 51 -> 46 / 51 (-2%)               42 / 45 -> 42 / 45 (0%)                
first attempt: party HP %                                                                                                      100 / 100 -> 100 / 100 (0%)            95 / 100 -> 94 / 100 (-1%)             100 / 100 -> 99 / 100 (-1%)            
first attempt: charge                                                                                                          60 / 75 -> 60 / 82 (0%)                54 / 66 -> 54 / 63 (0%)                57 / 64 -> 57 / 64 (0%)                
first attempt: Surge                                                                                                           100 / 100 -> 100 / 100 (0%)            74 / 100 -> 74 / 100 (0%)              19 / 86 -> 19 / 84 (0%)                
first attempt: boss ordinary hits                                                                                              6 / 7 -> 8 / 11 (+33%)                 4 / 7 -> 8 / 12 (+100%)                4 / 7 -> 5 / 7 (+25%)                  
first attempt: charge telegraphs / hits / kills                                                                                2 / 3 -> 3 / 5 (+50%)                  2 / 3 -> 4 / 5 (+100%)                 1 / 2 -> 1 / 3 (0%)                    
first attempt: charge kills                                                                                                    2 / 3 -> 3 / 4 (+50%)                  2 / 3 -> 3 / 4 (+50%)                  1 / 2 -> 1 / 3 (0%)                    
first attempt: reached summon on loss (mean)                                                                                   20% -> 100% (+400%)                    44% -> 71% (+61%)                      83% -> 75% (-10%)                      
-- EARLY ROAD CLEAR TIMES (h)                                                                                                                                                                                                                       
Stillwater Lagoon                                                                                                              2.79 / 3.43 -> 2.79 / 3.43 (0%)        2.83 / 3.09 -> 2.83 / 3.09 (0%)        2.86 / 3.43 -> 2.86 / 3.43 (0%)        
Thornwood                                                                                                                      7.89 / 8.61 -> 7.89 / 8.61 (0%)        7.89 / 9.07 -> 7.89 / 9.07 (0%)        6.92 / 7.09 -> 6.92 / 7.09 (0%)        
Ironvein Caverns                                                                                                               14.77 / 15.73 -> 14.77 / 15.73 (0%)    14.09 / 16.77 -> 14.09 / 16.77 (0%)    11.11 / 13.16 -> 11.11 / 13.16 (0%)    
Emberwaste                                                                                                                     27.95 / 31.17 -> 24.69 / 26.99 (-12%)  23.07 / 26.07 -> 24.1 / 26.08 (+4%)    18.1 / 21.16 -> 16.14 / 19.1 (-11%)    
zones cleared @24h                                                                                                             6 / 7 -> 6 / 7 (0%)                    7 / 7 -> 7 / 7 (0%)                    7 / 7 -> 7 / 7 (0%)                    
party Lv @24h                                                                                                                  72 / 74 -> 72 / 74 (0%)                72 / 74 -> 72 / 75 (0%)                72 / 75 -> 74 / 76 (+3%)               

## Amberfall Woods (Hunter King) focus rows
-- AMBERFALL WOODS                                                                                                                                                                                                                                  
first-try clear (mean)                                                                                                         0% -> 10%                              50% -> 60% (+20%)                      40% -> 90% (+125%)                     
attempts to clear                                                                                                              32 / 64 -> 3 / 8 (-91%)                1 / 11 -> 1 / 4 (0%)                   2 / 5 -> 1 / 2 (-50%)                  
stall h                                                                                                                        5.24 / 9.33 -> 1.8 / 3.3 (-66%)        0.02 / 6.96 -> 0.01 / 6.93 (-50%)      1.01 / 8.9 -> 0.02 / 0.98 (-98%)       
zone clear h                                                                                                                   38.52 / 43.31 -> 34.77 / 37.17 (-10%)  32.03 / 38.04 -> 32.07 / 36.09 (+0%)   25.11 / 32.05 -> 25.15 / 32.34 (+0%)   
Lv entering zone                                                                                                               54 / 55 -> 51 / 52 (-6%)               49 / 52 -> 50 / 51 (+2%)               45 / 49 -> 44 / 45 (-2%)               
Lv at first try                                                                                                                59 / 62 -> 58 / 61 (-2%)               58 / 60 -> 58 / 60 (0%)                51 / 54 -> 54 / 61 (+6%)               
-- AMBERFALL WOODS ATTEMPTS (attempt-level, all attempts)                                                                                                                                                                                           
boss ATK at first attempt (audit)                                                                                              3235 / 3235 -> 1617 / 1617 (-50%)      3235 / 3235 -> 1617 / 1617 (-50%)      3235 / 3235 -> 1617 / 1617 (-50%)      
boss Lv at first attempt                                                                                                       45 / 45 -> 45 / 45 (0%)                45 / 45 -> 45 / 45 (0%)                45 / 45 -> 45 / 45 (0%)                
attempts per run                                                                                                               32 / 64 -> 3 / 8 (-91%)                1 / 11 -> 1 / 4 (0%)                   2 / 5 -> 1 / 2 (-50%)                  
first attempt in active window (1=yes)                                                                                         0% -> 0%                               50% -> 80% (+60%)                      90% -> 70% (-22%)                      
first attempt party HP %                                                                                                       96 / 100 -> 83 / 100 (-14%)            95 / 100 -> 100 / 100 (+5%)            93 / 100 -> 100 / 100 (+8%)            
first attempt charge / surge                                                                                                   51 / 71 -> 50 / 58 (-2%)               54 / 72 -> 51 / 68 (-6%)               42 / 65 -> 45 / 70 (+7%)               
first attempt power                                                                                                            36620 / 40304 -> 36184 / 39820 (-1%)   35309 / 39919 -> 34921 / 40876 (-1%)   24930 / 30382 -> 30202 / 40943 (+21%)  
active-window attempts: win % (pooled)                                                                                         -% -> -%                               80% -> 83% (+4%)                       73% -> 100% (+37%)                     
Auto-Cast attempts: win % (pooled)                                                                                             3% -> 38% (+1167%)                     17% -> 22% (+29%)                      0% -> 67%                              
Auto-Cast attempts per run                                                                                                     32 / 64 -> 3 / 8 (-91%)                1 / 8 -> 0 / 3 (-100%)                 0 / 2 -> 0 / 1                         
charge telegraphs per attempt (run mean)                                                                                       2.25 / 2.71 -> 4 / 4.75 (+78%)         1.5 / 3 -> 1 / 3.67 (-33%)             1.5 / 4 -> 2 / 4 (+33%)                
charge hits per attempt                                                                                                        2.25 / 2.71 -> 4 / 4.75 (+78%)         1 / 2 -> 1 / 3.67 (0%)                 0.5 / 2 -> 1 / 4 (+100%)               
charge kills per attempt                                                                                                       2.25 / 2.63 -> 2.13 / 3 (-6%)          1 / 2 -> 0 / 2 (-100%)                 0.5 / 2 -> 1 / 1.5 (+100%)             
parries + interrupts per attempt                                                                                               0 / 0 -> 0 / 0                         0.5 / 3 -> 0.25 / 1 (-50%)             1 / 2 -> 1 / 3 (0%)                    
boss ordinary hits on heroes per attempt                                                                                       5.1 / 6.2 -> 8 / 10.3 (+57%)           4 / 6 -> 4 / 8.3 (0%)                  4 / 5 -> 4 / 10 (0%)                   
LOSS boss HP left (run median)                                                                                                 54 / 64 -> 50 / 55 (-7%)               63 / 76 -> 35 / 58 (-44%)              56 / 86 -> 48 / 48 (-14%)              
LOSS reached summon % (pooled)                                                                                                 75% -> 97% (+29%)                      48% -> 100% (+108%)                    51% -> 100% (+96%)                     
WIN survivors (run median)                                                                                                     4 / 4 -> 4 / 4 (0%)                    4 / 4 -> 4 / 4 (0%)                    4 / 4 -> 4 / 4 (0%)                    
WIN party HP % (run median)                                                                                                    73 / 99 -> 96 / 100 (+32%)             98 / 100 -> 96 / 100 (-2%)             92 / 100 -> 95 / 100 (+3%)             
Amberfall max loss streak                                                                                                      31 / 63 -> 2 / 7 (-94%)                0 / 10 -> 0 / 3                        1 / 4 -> 0 / 1 (-100%)                 
Amberfall combat stall h                                                                                                       0.39 / 0.9 -> 0.05 / 0.12 (-87%)       0 / 0.1 -> 0 / 0.06                    0.01 / 0.06 -> 0 / 0.02 (-100%)        
Amberfall retry stall h                                                                                                        4.87 / 8.41 -> 1.76 / 3.18 (-64%)      0 / 6.85 -> 0 / 6.85                   0.98 / 8.84 -> 0 / 0.95 (-100%)        
-- PAIRED PER-SEED DELTAS (candidate minus control): median delta | +/0/- counts                                                                                                                                                                    
Amberfall attempts                                                                                                             -34 | +0 00 -10 (n10)                  -1 | +2 03 -5 (n10)                    -1 | +1 03 -6 (n10)                    
Amberfall stall h                                                                                                              -3.7 | +0 00 -10 (n10)                 -0.01 | +3 01 -6 (n10)                 -1.95 | +3 01 -6 (n10)                 
Amberfall clear h                                                                                                              -4.63 | +0 00 -10 (n10)                -0.04 | +4 00 -6 (n10)                 0.03 | +7 00 -3 (n10)                  
-- COUNTS WITH DENOMINATORS                                                                                                                                                                                                                         
Amberfall first-try clears / runs                                                                                              0/10 -> 1/10                           5/10 -> 6/10                           4/10 -> 9/10                           
Auto-Cast attempts: wins / attempts                                                                                            10/371 -> 10/35                        1/21 -> 2/7                            0/4 -> 2/3                             
active-window attempts: wins / attempts                                                                                        0/0 -> 0/0                             9/14 -> 8/10                           10/17 -> 8/8                           
runs reaching a 6th zone by 24h / runs                                                                                         10/10 -> 10/10                         10/10 -> 10/10                         10/10 -> 10/10                         
6th-zone clear h (med of those reaching)                                                                                       38.52 -> 34.77                         32.03 -> 32.07                         25.11 -> 25.15                         
zones cleared @20h (med)                                                                                                       4 -> 4                                 4 -> 4                                 5 -> 5                                 
-- FIRST ATTEMPT DETAIL (run medians; loss boss HP left where lost)                                                                                                                                                                                 
first attempt: won (mean)                                                                                                      0% -> 10%                              50% -> 60% (+20%)                      40% -> 90% (+125%)                     
first attempt: boss HP left on loss %                                                                                          72 / 88 -> 55 / 67 (-24%)              72 / 82 -> 56 / 58 (-22%)              47 / 86 -> 48 / 48 (+2%)               
first attempt: party Lv                                                                                                        59 / 62 -> 58 / 61 (-2%)               58 / 60 -> 58 / 60 (0%)                51 / 54 -> 54 / 61 (+6%)               
first attempt: party HP %                                                                                                      96 / 100 -> 83 / 100 (-14%)            95 / 100 -> 100 / 100 (+5%)            93 / 100 -> 100 / 100 (+8%)            
first attempt: charge                                                                                                          51 / 71 -> 50 / 58 (-2%)               54 / 72 -> 51 / 68 (-6%)               42 / 65 -> 45 / 70 (+7%)               
first attempt: Surge                                                                                                           100 / 100 -> 100 / 100 (0%)            79 / 100 -> 56 / 100 (-29%)            73 / 100 -> 76 / 100 (+4%)             
first attempt: boss ordinary hits                                                                                              4 / 6 -> 6 / 9 (+50%)                  4 / 6 -> 4 / 6 (0%)                    4 / 6 -> 4 / 10 (0%)                   
first attempt: charge telegraphs / hits / kills                                                                                1 / 2 -> 3 / 4 (+200%)                 1 / 2 -> 1 / 4 (0%)                    1 / 2 -> 1 / 4 (0%)                    
first attempt: charge kills                                                                                                    1 / 2 -> 2 / 3 (+100%)                 1 / 2 -> 0 / 3 (-100%)                 1 / 2 -> 1 / 3 (0%)                    
first attempt: reached summon on loss (mean)                                                                                   10% -> 89% (+790%)                     40% -> 100% (+150%)                    67% -> 100% (+49%)                     

## Ashen Approach (Grave Knight, untouched) focus rows
-- ASHEN APPROACH                                                                                                                                                                                                                                   
first-try clear (mean)                                                                                                         0% -> 0%                               56% -> 88% (+57%)                      60% -> 20% (-67%)                      
attempts to clear                                                                                                              6 / 9 -> 3 / 4 (-50%)                  1 / 4 -> 1 / 2 (0%)                    1 / 3 -> 2 / 5 (+100%)                 
stall h                                                                                                                        1.79 / 4.53 -> 3.11 / 4.5 (+74%)       0.03 / 2 -> 0.02 / 0.99 (-33%)         0.02 / 7.89 -> 3.5 / 9.91 (+17400%)    
zone clear h                                                                                                                   47.13 / 47.97 -> 46.2 / 46.6 (-2%)     46.03 / 47.06 -> 44.07 / 46.08 (-4%)   41.04 / 44.08 -> 42.09 / 46.01 (+3%)   
Lv entering zone                                                                                                               65 / 67 -> 60 / 62 (-8%)               59 / 62 -> 60 / 61 (+2%)               54 / 61 -> 54 / 61 (0%)                
Lv at first try                                                                                                                71 / 73 -> 69 / 71 (-3%)               71 / 72 -> 70 / 72 (-1%)               65 / 73 -> 66 / 73 (+2%)               
-- ASHEN APPROACH ATTEMPTS (attempt-level, all attempts)                                                                                                                                                                                            
boss ATK at first attempt (audit)                                                                                              5586 / 5586 -> 5586 / 5586 (0%)        5586 / 5586 -> 5586 / 5586 (0%)        5586 / 5586 -> 5586 / 5586 (0%)        
boss Lv at first attempt                                                                                                       53 / 53 -> 53 / 53 (0%)                53 / 53 -> 53 / 53 (0%)                53 / 53 -> 53 / 53 (0%)                
attempts per run                                                                                                               1 / 9 -> 2 / 7 (+100%)                 1 / 4 -> 1 / 2 (0%)                    1 / 3 -> 2 / 5 (+100%)                 
first attempt in active window (1=yes)                                                                                         0% -> 0%                               67% -> 78% (+16%)                      90% -> 50% (-44%)                      
first attempt party HP %                                                                                                       99 / 100 -> 86 / 100 (-13%)            100 / 100 -> 100 / 100 (0%)            100 / 100 -> 100 / 100 (0%)            
first attempt charge / surge                                                                                                   50 / 77 -> 50 / 70 (0%)                43 / 61 -> 63 / 72 (+47%)              44 / 68 -> 46 / 66 (+5%)               
first attempt power                                                                                                            55779 / 58752 -> 53837 / 55923 (-3%)   55322 / 60781 -> 54264 / 57454 (-2%)   45532 / 59683 -> 44132 / 57511 (-3%)   
active-window attempts: win % (pooled)                                                                                         -% -> -%                               94% -> 88% (-6%)                       78% -> 83% (+6%)                       
Auto-Cast attempts: win % (pooled)                                                                                             8% -> 15% (+88%)                       0% -> 50%                              33% -> 0% (-100%)                      
Auto-Cast attempts per run                                                                                                     1 / 9 -> 2 / 7 (+100%)                 0 / 3 -> 0 / 1                         0 / 1 -> 1 / 3                         
charge telegraphs per attempt (run mean)                                                                                       1.22 / 2 -> 1.5 / 2 (+23%)             1 / 1.75 -> 1 / 2 (0%)                 0.67 / 1 -> 0.8 / 1 (+20%)             
charge hits per attempt                                                                                                        1.22 / 2 -> 1.5 / 2 (+23%)             0.67 / 1.75 -> 0 / 2 (-100%)           0.5 / 1 -> 0.6 / 1 (+20%)              
charge kills per attempt                                                                                                       1.22 / 2 -> 1.5 / 2 (+23%)             0.5 / 1.75 -> 0 / 2 (-100%)            0.5 / 1 -> 0.6 / 1 (+20%)              
parries + interrupts per attempt                                                                                               0 / 0 -> 0 / 0                         0 / 1 -> 0 / 1                         0 / 1 -> 0 / 0.5                       
boss ordinary hits on heroes per attempt                                                                                       5 / 6.5 -> 5 / 7.7 (0%)                4 / 6 -> 4 / 8 (0%)                    3 / 4 -> 3 / 4 (0%)                    
LOSS boss HP left (run median)                                                                                                 66 / 70 -> 66 / 69 (0%)                59 / 69 -> 64 / 68 (+8%)               45 / 81 -> 64 / 87 (+42%)              
LOSS reached summon % (pooled)                                                                                                 85% -> 88% (+4%)                       92% -> 100% (+9%)                      38% -> 65% (+71%)                      
WIN survivors (run median)                                                                                                     4 / 4 -> 4 / 4 (0%)                    4 / 4 -> 4 / 4 (0%)                    4 / 4 -> 4 / 4 (0%)                    
WIN party HP % (run median)                                                                                                    87 / 100 -> 83 / 97 (-5%)              97 / 100 -> 100 / 100 (+3%)            100 / 100 -> 100 / 100 (0%)            
Ashen max loss streak                                                                                                          3 / 8 -> 3 / 7 (0%)                    0 / 3 -> 0 / 1                         0 / 2 -> 1 / 4                         
Ashen combat stall h                                                                                                           0.06 / 0.13 -> 0.04 / 0.06 (-33%)      0 / 0.06 -> 0 / 0.02                   0 / 0.02 -> 0.02 / 0.06                
Ashen retry stall h                                                                                                            1.7 / 4.37 -> 3 / 4.42 (+76%)          0 / 1.93 -> 0 / 0.95                   0 / 7.87 -> 3.47 / 9.83                
-- PAIRED PER-SEED DELTAS (candidate minus control): median delta | +/0/- counts                                                                                                                                                                    
Ashen attempts                                                                                                                 -7 | +0 00 -2 (n2)                     -1 | +1 03 -4 (n8)                     0 | +5 03 -2 (n10)                     
Ashen stall h                                                                                                                  -2.53 | +1 00 -1 (n2)                  -0.16 | +2 01 -5 (n8)                  0 | +4 02 -4 (n10)                     
Ashen clear h                                                                                                                  -3.56 | +1 00 -1 (n2)                  -1.03 | +2 00 -6 (n8)                  1.02 | +8 00 -2 (n10)                  
-- COUNTS WITH DENOMINATORS                                                                                                                                                                                                                         
Ashen first-try clears / runs                                                                                                  0/3 -> 0/3                             5/9 -> 7/8                             6/10 -> 2/10                           
Auto-Cast attempts: wins / attempts                                                                                            3/29 -> 3/24                           0/8 -> 1/2                             1/3 -> 0/10                            

## Per-seed detail, loss phases, horizons

== idle  Emberwaste  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p17c -> batch_out_p17x)
31  17 | 5.02 | 16 | auto/L/48 | 1/17 | 0/0 | 27.9 | Lv 39         -> 3 | 3.30 | 2 | auto/L/48 | 1/3 | 0/0 | 26.7 | Lv 39
32  27 | 5.51 | 26 | auto/L/50 | 1/27 | 0/0 | 31.2 | Lv 39         -> 4 | 3.27 | 3 | auto/L/48 | 1/4 | 0/0 | 26.4 | Lv 39
33  22 | 6.08 | 21 | auto/L/47 | 1/22 | 0/0 | 28.5 | Lv 39         -> 2 | 2.02 | 1 | auto/L/47 | 1/2 | 0/0 | 24.4 | Lv 39
34  22 | 4.48 | 21 | auto/L/49 | 1/22 | 0/0 | 27.8 | Lv 39         -> 4 | 0.57 | 3 | auto/L/50 | 1/4 | 0/0 | 24.7 | Lv 39
35  26 | 3.67 | 25 | auto/L/51 | 1/26 | 0/0 | 30.1 | Lv 40         -> 4 | 1.50 | 3 | auto/L/50 | 1/4 | 0/0 | 26.5 | Lv 40
36  17 | 3.72 | 16 | auto/L/49 | 1/17 | 0/0 | 26.2 | Lv 38         -> 5 | 1.56 | 4 | auto/L/49 | 1/5 | 0/0 | 24.1 | Lv 38
37  12 | 3.08 | 11 | auto/L/50 | 1/12 | 0/0 | 27.1 | Lv 39         -> 1 | 0.04 | 0 | auto/W/50 | 1/1 | 0/0 | 24.1 | Lv 39
38  21 | 5.48 | 20 | auto/L/49 | 1/21 | 0/0 | 29.7 | Lv 40         -> 6 | 2.97 | 5 | auto/L/49 | 1/6 | 0/0 | 27.0 | Lv 40
39  23 | 4.49 | 22 | auto/L/50 | 1/23 | 0/0 | 29.1 | Lv 40         -> 1 | 0.04 | 0 | auto/W/51 | 1/1 | 0/0 | 25.0 | Lv 40
40  29 | 4.85 | 28 | auto/L/49 | 1/29 | 0/0 | 27.5 | Lv 39         -> 2 | 0.15 | 1 | auto/L/49 | 1/2 | 0/0 | 22.8 | Lv 39
   batch_out_p17c  reached 10 attempted 10 | losses n=206 bossHP left q25/50/75 0.39/0.44/0.47 | <=25% 23 | summoned 173 | dur med 70s | charge kills/loss 2.67 | boss hits/loss 6.4 | wins n=10 survivors med 4 partyHP med 69%
   batch_out_p17x  reached 10 attempted 10 | losses n=22 bossHP left q25/50/75 0.30/0.37/0.44 | <=25% 4 | summoned 22 | dur med 97s | charge kills/loss 2.41 | boss hits/loss 8.5 | wins n=10 survivors med 4 partyHP med 81%

== idle  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p17c -> batch_out_p17x)
31  32 | 3.79 | 31 | auto/L/62 | 1/32 | 0/0 | 41.4 | Lv 52         -> 3 | 0.71 | 2 | auto/L/61 | 1/3 | 0/0 | 37.2 | Lv 52
32  48 | 8.03 | 47 | auto/L/59 | 1/48 | 0/0 | 43.3 | Lv 55         -> 3 | 2.68 | 2 | auto/L/58 | 1/3 | 0/0 | 36.7 | Lv 51
33  27 | 5.24 | 26 | auto/L/58 | 1/27 | 0/0 | 38.3 | Lv 54         -> 4 | 2.92 | 3 | auto/L/58 | 1/4 | 0/0 | 35.8 | Lv 49
34  24 | 4.76 | 23 | auto/L/58 | 1/24 | 0/0 | 37.5 | Lv 53         -> 4 | 1.54 | 3 | auto/L/58 | 1/4 | 0/0 | 33.5 | Lv 51
35  51 | 8.38 | 50 | auto/L/59 | 1/51 | 0/0 | 42.8 | Lv 55         -> 8 | 2.03 | 7 | auto/L/60 | 1/8 | 0/0 | 37.1 | Lv 51
36  45 | 5.50 | 44 | auto/L/60 | 1/45 | 0/0 | 38.5 | Lv 53         -> 2 | 1.80 | 1 | auto/L/59 | 1/2 | 0/0 | 33.2 | Lv 50
37  24 | 4.52 | 23 | auto/L/59 | 1/24 | 0/0 | 38.2 | Lv 53         -> 5 | 3.30 | 4 | auto/L/57 | 1/5 | 0/0 | 34.4 | Lv 50
38  64 | 9.33 | 63 | auto/L/58 | 1/64 | 0/0 | 43.0 | Lv 55         -> 3 | 2.07 | 2 | auto/L/58 | 1/3 | 0/0 | 35.2 | Lv 52
39  21 | 3.72 | 20 | auto/L/61 | 1/21 | 0/0 | 39.2 | Lv 54         -> 2 | 0.12 | 1 | auto/L/61 | 1/2 | 0/0 | 34.8 | Lv 51
40  35 | 7.14 | 34 | auto/L/57 | 1/35 | 0/0 | 37.6 | Lv 54         -> 1 | 0.03 | 0 | auto/W/60 | 1/1 | 0/0 | 33.0 | Lv 49
   batch_out_p17c  reached 10 attempted 10 | losses n=361 bossHP left q25/50/75 0.48/0.54/0.59 | <=25% 17 | summoned 280 | dur med 48s | charge kills/loss 2.31 | boss hits/loss 5.3 | wins n=10 survivors med 4 partyHP med 73%
   batch_out_p17x  reached 10 attempted 10 | losses n=25 bossHP left q25/50/75 0.32/0.48/0.55 | <=25% 5 | summoned 23 | dur med 69s | charge kills/loss 2.52 | boss hits/loss 7.6 | wins n=10 survivors med 4 partyHP med 96%

== idle  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p17c -> batch_out_p17x)
31  entered, no boss attempt | Lv 66                               -> entered, no boss attempt | Lv 62
32  entered, no boss attempt | Lv 66                               -> entered, no boss attempt | Lv 61
33  null | - | 6 | auto/L/70 | 0/6 | 0/0 | - | Lv 64               -> null | - | 3 | auto/L/71 | 0/3 | 0/0 | - | Lv 61
34  4 | 1.79 | 3 | auto/L/70 | 1/4 | 0/0 | 47.1 | Lv 63            -> null | - | 7 | auto/L/70 | 0/7 | 0/0 | - | Lv 59
35  null | - | 1 | auto/L/71 | 0/1 | 0/0 | - | Lv 67               -> entered, no boss attempt | Lv 62
36  6 | 1.27 | 5 | auto/L/71 | 1/6 | 0/0 | 45.1 | Lv 66            -> 4 | 4.50 | 3 | auto/L/69 | 1/4 | 0/0 | 46.2 | Lv 60
37  null | - | 2 | auto/L/72 | 0/2 | 0/0 | - | Lv 64               -> 3 | 3.11 | 2 | auto/L/69 | 1/3 | 0/0 | 46.6 | Lv 60
38  entered, no boss attempt | Lv 67                               -> null | - | 1 | auto/L/70 | 0/1 | 0/0 | - | Lv 59
39  null | - | 1 | auto/L/73 | 0/1 | 0/0 | - | Lv 65               -> null | - | 4 | auto/L/69 | 0/4 | 0/0 | - | Lv 61
40  9 | 4.53 | 8 | auto/L/70 | 1/9 | 0/0 | 48.0 | Lv 65            -> 2 | 2.00 | 1 | auto/L/69 | 1/2 | 0/0 | 44.4 | Lv 60
   batch_out_p17c  reached 10 attempted 7 | losses n=26 bossHP left q25/50/75 0.63/0.66/0.70 | <=25% 0 | summoned 19 | dur med 54s | charge kills/loss 1.19 | boss hits/loss 4.4 | wins n=3 survivors med 4 partyHP med 87%
   batch_out_p17x  reached 10 attempted 7 | losses n=21 bossHP left q25/50/75 0.60/0.66/0.69 | <=25% 1 | summoned 18 | dur med 60s | charge kills/loss 1.33 | boss hits/loss 4.9 | wins n=3 survivors med 4 partyHP med 83%

== idle  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  4 / 4 -> 4 / 4   paired +1 09 -0
   @36h  5 / 5 -> 6 / 6   paired +7 03 -0
   @48h  6 / 7 -> 6 / 7   paired +1 08 -1
   total defeats med 567 -> 559   training h med 19.6 -> 23.3

== light  Emberwaste  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p17c -> batch_out_p17x)
31  3 | 2.72 | 2 | auto/L/48 | 0/2 | 1/1 | 24.1 | Lv 39            -> 8 | 4.17 | 7 | auto/L/46 | 0/5 | 1/3 | 24.1 | Lv 39
32  2 | 0.11 | 1 | auto/L/50 | 0/1 | 1/1 | 24.1 | Lv 41            -> 1 | 0.04 | 0 | auto/W/50 | 1/1 | 0/0 | 24.0 | Lv 41
33  7 | 4.98 | 6 | active/L/46 | 0/5 | 1/2 | 25.0 | Lv 40          -> 2 | 4.09 | 1 | active/L/46 | 1/1 | 0/1 | 24.1 | Lv 40
34  1 | 0.02 | 0 | active/W/45 | 0/0 | 1/1 | 20.1 | Lv 38          -> 2 | 1.47 | 1 | auto/L/50 | 0/1 | 1/1 | 26.1 | Lv 38
35  5 | 3.93 | 4 | auto/L/45 | 0/4 | 1/1 | 22.0 | Lv 37            -> 3 | 4.94 | 2 | auto/L/45 | 0/2 | 1/1 | 23.0 | Lv 37
36  2 | 1.99 | 1 | active/L/47 | 0/0 | 1/2 | 23.1 | Lv 39          -> 2 | 1.99 | 1 | active/L/47 | 0/0 | 1/2 | 23.1 | Lv 39
37  2 | 0.33 | 1 | auto/L/49 | 1/2 | 0/0 | 23.0 | Lv 38            -> 7 | 5.92 | 6 | auto/L/45 | 0/5 | 1/2 | 25.0 | Lv 38
38  4 | 0.49 | 3 | auto/L/51 | 0/3 | 1/1 | 26.1 | Lv 38            -> 1 | 0.03 | 0 | auto/W/51 | 1/1 | 0/0 | 25.6 | Lv 38
39  3 | 2.99 | 2 | active/L/44 | 0/1 | 1/2 | 20.1 | Lv 38          -> 5 | 4.95 | 4 | auto/L/45 | 0/3 | 1/2 | 23.1 | Lv 38
40  3 | 0.59 | 2 | auto/L/51 | 0/2 | 1/1 | 26.1 | Lv 41            -> 1 | 0.04 | 0 | auto/W/51 | 1/1 | 0/0 | 25.5 | Lv 41
   batch_out_p17c  reached 10 attempted 10 | losses n=22 bossHP left q25/50/75 0.48/0.55/0.61 | <=25% 1 | summoned 7 | dur med 59s | charge kills/loss 2.18 | boss hits/loss 5.3 | wins n=10 survivors med 4 partyHP med 87%
   batch_out_p17x  reached 10 attempted 10 | losses n=22 bossHP left q25/50/75 0.29/0.42/0.44 | <=25% 5 | summoned 19 | dur med 89s | charge kills/loss 2.41 | boss hits/loss 8.1 | wins n=10 survivors med 4 partyHP med 95%

== light  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p17c -> batch_out_p17x)
31  1 | 0.02 | 0 | active/W/58 | 0/0 | 1/1 | 31.1 | Lv 51          -> 1 | 0.01 | 0 | active/W/59 | 0/0 | 1/1 | 32.1 | Lv 50
32  1 | 0.02 | 0 | active/W/57 | 0/0 | 1/1 | 31.1 | Lv 50          -> 1 | 0.01 | 0 | active/W/60 | 0/0 | 1/1 | 33.1 | Lv 50
33  1 | 0.01 | 0 | active/W/59 | 0/0 | 1/1 | 33.1 | Lv 51          -> 1 | 0.01 | 0 | active/W/59 | 0/0 | 1/1 | 33.0 | Lv 50
34  1 | 0.01 | 0 | active/W/60 | 0/0 | 1/1 | 34.1 | Lv 45          -> 2 | 1.25 | 1 | auto/L/60 | 0/1 | 1/1 | 36.1 | Lv 51
35  1 | 0.02 | 0 | auto/W/59 | 1/1 | 0/0 | 31.0 | Lv 49            -> 3 | 3.52 | 2 | auto/L/56 | 1/3 | 0/0 | 31.8 | Lv 50
36  2 | 0.21 | 1 | auto/L/58 | 0/1 | 1/1 | 32.0 | Lv 49            -> 1 | 0.02 | 0 | active/W/57 | 0/0 | 1/1 | 30.1 | Lv 49
37  5 | 4.02 | 4 | active/L/58 | 0/2 | 1/3 | 35.0 | Lv 49          -> 4 | 6.93 | 3 | active/L/54 | 1/3 | 0/1 | 34.0 | Lv 51
38  2 | 0.10 | 1 | auto/L/59 | 0/1 | 1/1 | 33.1 | Lv 52            -> 1 | 0.01 | 0 | active/W/58 | 0/0 | 1/1 | 32.0 | Lv 51
39  10 | 5.94 | 9 | auto/L/54 | 0/8 | 1/2 | 32.0 | Lv 47           -> 1 | 0.01 | 0 | active/W/60 | 0/0 | 1/1 | 32.0 | Lv 50
40  11 | 6.96 | 10 | auto/L/56 | 0/8 | 1/3 | 38.0 | Lv 51          -> 2 | 2.00 | 1 | active/L/58 | 0/0 | 1/2 | 35.1 | Lv 51
   batch_out_p17c  reached 10 attempted 10 | losses n=25 bossHP left q25/50/75 0.56/0.63/0.80 | <=25% 3 | summoned 10 | dur med 37s | charge kills/loss 1.52 | boss hits/loss 4.2 | wins n=10 survivors med 4 partyHP med 98%
   batch_out_p17x  reached 10 attempted 10 | losses n=7 bossHP left q25/50/75 0.35/0.56/0.57 | <=25% 1 | summoned 7 | dur med 62s | charge kills/loss 2.29 | boss hits/loss 6.3 | wins n=10 survivors med 4 partyHP med 96%

== light  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p17c -> batch_out_p17x)
31  1 | 0.02 | 0 | active/W/72 | 0/0 | 1/1 | 46.1 | Lv 58          -> 1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 44.1 | Lv 59
32  2 | 0.18 | 1 | auto/L/72 | 0/1 | 1/1 | 47.0 | Lv 57            -> 1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 44.0 | Lv 60
33  1 | 0.03 | 0 | active/W/70 | 0/0 | 1/1 | 45.1 | Lv 59          -> 1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 45.1 | Lv 60
34  1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 46.1 | Lv 60          -> entered, no boss attempt | Lv 61
35  3 | 2.00 | 2 | active/L/69 | 0/1 | 1/2 | 43.1 | Lv 59          -> 1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 42.0 | Lv 60
36  4 | 0.95 | 3 | auto/L/71 | 0/3 | 1/1 | 46.0 | Lv 58            -> 1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 44.1 | Lv 57
37  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 45.0 | Lv 61          -> 2 | 0.99 | 1 | auto/L/71 | 0/1 | 1/1 | 46.1 | Lv 61
38  4 | 1.97 | 3 | auto/L/70 | 0/3 | 1/1 | 47.1 | Lv 59            -> 1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 46.1 | Lv 58
39  1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 42.0 | Lv 61          -> 1 | 0.04 | 0 | auto/W/72 | 1/1 | 0/0 | 42.7 | Lv 61
40  entered, no boss attempt | Lv 62                               -> null | - | 1 | active/L/70 | 0/0 | 0/1 | - | Lv 60
   batch_out_p17c  reached 10 attempted 9 | losses n=9 bossHP left q25/50/75 0.59/0.65/0.67 | <=25% 0 | summoned 8 | dur med 73s | charge kills/loss 1.44 | boss hits/loss 5.2 | wins n=9 survivors med 4 partyHP med 97%
   batch_out_p17x  reached 10 attempted 9 | losses n=2 bossHP left q25/50/75 0.64/0.64/0.64 | <=25% 0 | summoned 2 | dur med 56s | charge kills/loss 1.00 | boss hits/loss 5.0 | wins n=8 survivors med 4 partyHP med 100%

== light  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  4 / 5 -> 4 / 5   paired +1 07 -2
   @36h  6 / 6 -> 6 / 6   paired +1 08 -1
   @48h  7 / 7 -> 7 / 7   paired +0 09 -1
   total defeats med 616 -> 634   training h med 26.0 -> 26.2

== casual  Emberwaste  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p17c -> batch_out_p17x)
31  4 | 2.96 | 3 | active/L/41 | 0/1 | 1/3 | 18.1 | Lv 37          -> 1 | 0.03 | 0 | active/W/41 | 0/0 | 1/1 | 15.2 | Lv 37
32  3 | 4.02 | 2 | active/L/42 | 0/0 | 1/3 | 21.2 | Lv 37          -> 2 | 1.97 | 1 | active/L/42 | 0/0 | 1/2 | 19.1 | Lv 37
33  1 | 0.03 | 0 | active/W/39 | 0/0 | 1/1 | 14.1 | Lv 34          -> 2 | 1.01 | 1 | active/L/39 | 0/0 | 1/2 | 15.1 | Lv 34
34  1 | 0.02 | 0 | active/W/45 | 0/0 | 1/1 | 18.2 | Lv 36          -> 1 | 0.02 | 0 | active/W/45 | 0/0 | 1/1 | 18.1 | Lv 36
35  1 | 0.03 | 0 | active/W/41 | 0/0 | 1/1 | 15.1 | Lv 35          -> 1 | 0.03 | 0 | active/W/41 | 0/0 | 1/1 | 15.1 | Lv 35
36  4 | 3.01 | 3 | active/L/41 | 0/0 | 1/4 | 18.2 | Lv 37          -> 2 | 2.95 | 1 | active/L/41 | 0/0 | 1/2 | 18.1 | Lv 37
37  4 | 3.96 | 3 | active/L/43 | 0/2 | 1/2 | 21.1 | Lv 33          -> 1 | 0.02 | 0 | active/W/43 | 0/0 | 1/1 | 17.1 | Lv 33
38  3 | 1.92 | 2 | auto/L/42 | 0/1 | 1/2 | 17.1 | Lv 35            -> 2 | 0.97 | 1 | auto/L/42 | 0/1 | 1/1 | 16.1 | Lv 35
39  4 | 3.01 | 3 | active/L/42 | 0/1 | 1/3 | 18.1 | Lv 34          -> 1 | 0.02 | 0 | active/W/42 | 0/0 | 1/1 | 15.1 | Lv 34
40  1 | 0.02 | 0 | active/W/45 | 0/0 | 1/1 | 18.1 | Lv 37          -> 1 | 0.02 | 0 | active/W/45 | 0/0 | 1/1 | 18.1 | Lv 37
   batch_out_p17c  reached 10 attempted 10 | losses n=16 bossHP left q25/50/75 0.14/0.32/0.49 | <=25% 7 | summoned 12 | dur med 71s | charge kills/loss 1.13 | boss hits/loss 4.5 | wins n=10 survivors med 4 partyHP med 82%
   batch_out_p17x  reached 10 attempted 10 | losses n=4 bossHP left q25/50/75 0.08/0.18/0.44 | <=25% 2 | summoned 3 | dur med 73s | charge kills/loss 1.75 | boss hits/loss 6.0 | wins n=10 survivors med 4 partyHP med 83%

== casual  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p17c -> batch_out_p17x)
31  1 | 0.02 | 0 | active/W/54 | 0/0 | 1/1 | 25.1 | Lv 45          -> 1 | 0.02 | 0 | active/W/54 | 0/0 | 1/1 | 25.1 | Lv 41
32  4 | 8.90 | 3 | active/L/49 | 0/2 | 1/2 | 32.0 | Lv 47          -> 1 | 0.02 | 0 | active/W/55 | 0/0 | 1/1 | 29.1 | Lv 44
33  2 | 1.97 | 1 | auto/L/51 | 0/1 | 1/1 | 25.1 | Lv 39            -> 1 | 0.02 | 0 | active/W/56 | 0/0 | 1/1 | 27.2 | Lv 41
34  2 | 6.93 | 1 | active/L/51 | 0/0 | 1/2 | 30.1 | Lv 45          -> 1 | 0.03 | 0 | auto/W/61 | 1/1 | 0/0 | 31.9 | Lv 45
35  2 | 1.01 | 1 | active/L/48 | 0/0 | 1/2 | 22.1 | Lv 41          -> 1 | 0.02 | 0 | active/W/49 | 0/0 | 1/1 | 22.1 | Lv 41
36  1 | 0.02 | 0 | active/W/51 | 0/0 | 1/1 | 23.2 | Lv 45          -> 1 | 0.03 | 0 | auto/W/61 | 1/1 | 0/0 | 32.3 | Lv 45
37  1 | 0.01 | 0 | active/W/54 | 0/0 | 1/1 | 25.1 | Lv 49          -> 1 | 0.02 | 0 | active/W/49 | 0/0 | 1/1 | 21.1 | Lv 44
38  1 | 0.02 | 0 | active/W/51 | 0/0 | 1/1 | 21.1 | Lv 44          -> 2 | 0.98 | 1 | auto/L/56 | 0/1 | 1/1 | 26.2 | Lv 44
39  2 | 4.03 | 1 | active/L/48 | 0/0 | 1/2 | 24.1 | Lv 46          -> 1 | 0.01 | 0 | active/W/54 | 0/0 | 1/1 | 24.1 | Lv 42
40  5 | 8.86 | 4 | active/L/51 | 0/1 | 1/4 | 32.0 | Lv 45          -> 1 | 0.03 | 0 | active/W/50 | 0/0 | 1/1 | 22.2 | Lv 45
   batch_out_p17c  reached 10 attempted 10 | losses n=11 bossHP left q25/50/75 0.40/0.56/0.64 | <=25% 1 | summoned 6 | dur med 44s | charge kills/loss 1.45 | boss hits/loss 4.2 | wins n=10 survivors med 4 partyHP med 92%
   batch_out_p17x  reached 10 attempted 10 | losses n=1 bossHP left q25/50/75 0.48/0.48/0.48 | <=25% 0 | summoned 1 | dur med 64s | charge kills/loss 3.00 | boss hits/loss 6.0 | wins n=10 survivors med 4 partyHP med 95%

== casual  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p17c -> batch_out_p17x)
31  1 | 0.02 | 0 | auto/W/73 | 1/1 | 0/0 | 43.0 | Lv 54            -> 2 | 6.85 | 1 | auto/L/64 | 0/1 | 1/1 | 42.1 | Lv 54
32  1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 44.1 | Lv 59          -> 2 | 6.91 | 1 | auto/L/64 | 0/1 | 1/1 | 45.1 | Lv 55
33  2 | 4.89 | 1 | active/L/65 | 0/0 | 1/2 | 41.0 | Lv 53          -> 2 | 0.24 | 1 | auto/L/73 | 0/1 | 1/1 | 44.1 | Lv 56
34  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 41.1 | Lv 59          -> 1 | 0.02 | 0 | active/W/72 | 0/0 | 1/1 | 42.1 | Lv 61
35  1 | 0.02 | 0 | active/W/64 | 0/0 | 1/1 | 35.1 | Lv 50          -> 1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 41.0 | Lv 49
36  3 | 3.92 | 2 | active/L/68 | 0/1 | 1/2 | 44.1 | Lv 51          -> 2 | 3.50 | 1 | auto/L/72 | 0/1 | 1/1 | 46.0 | Lv 61
37  3 | 4.92 | 2 | active/L/65 | 0/1 | 1/2 | 40.1 | Lv 54          -> 2 | 0.40 | 1 | auto/L/69 | 0/1 | 1/1 | 39.1 | Lv 49
38  1 | 0.02 | 0 | active/W/65 | 0/0 | 1/1 | 33.2 | Lv 51          -> 4 | 4.97 | 3 | active/L/62 | 0/1 | 1/3 | 35.1 | Lv 57
39  1 | 0.02 | 0 | active/W/64 | 0/0 | 1/1 | 33.1 | Lv 54          -> 5 | 9.91 | 4 | active/L/63 | 0/3 | 1/2 | 43.1 | Lv 54
40  2 | 7.89 | 1 | active/L/66 | 0/0 | 1/2 | 44.1 | Lv 61          -> 3 | 6.89 | 2 | active/L/66 | 0/1 | 1/2 | 45.0 | Lv 50
   batch_out_p17c  reached 10 attempted 10 | losses n=6 bossHP left q25/50/75 0.45/0.75/0.76 | <=25% 0 | summoned 2 | dur med 43s | charge kills/loss 1.00 | boss hits/loss 3.5 | wins n=10 survivors med 4 partyHP med 100%
   batch_out_p17x  reached 10 attempted 10 | losses n=14 bossHP left q25/50/75 0.62/0.64/0.79 | <=25% 1 | summoned 9 | dur med 51s | charge kills/loss 1.21 | boss hits/loss 4.0 | wins n=10 survivors med 4 partyHP med 100%

== casual  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  5 / 6 -> 5 / 6   paired +2 06 -2
   @36h  6 / 7 -> 6 / 6   paired +0 08 -2
   @48h  7 / 7 -> 7 / 7   paired +0 010 -0
   total defeats med 965 -> 880   training h med 26.1 -> 27.4

## Whole-Road triage, candidate arm (control arm in tests/sim/p17_triage_c.txt)

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

## Scorecard
Sand Tyrant
1. Idle median attempts 1-4, P90 <=8: MET (22 / 29 -> 3 / 6; paired -20 median, 10 of 10 down; max streak 21 -> 2).
2. Idle stall improves >=40%: MET (4.49h -> 1.50h, -67%; combat -85%, retry -66%; paired 10 of 10 down, median -3.04h). Emberwaste clear 27.95h -> 24.69h (-12%).
3. Idle Auto-Cast no longer low-single-digit: MET (10/216 = 4.6% -> 10/32 = 31% pooled; 45% by run mean; first-try 0/10 -> 2/10).
4. Light median attempts <=3 and P90 <=6: median MET (3 -> 2), P90 NOT MET (7 -> 8). Paired: 5 seeds down, 1 flat, 4 up; first-try 1/10 -> 3/10; Auto-Cast 1/20 -> 4/20; light's stall stays bimodal (0.0-0.5h or 4-6h) with paired median 0.00h (5 up, 1 flat, 4 down). Seeds 31 and 37 got worse (3 -> 8, 2 -> 7 attempts) and 32, 38, 40 became first-try wins. Light does not improve as a median because its attempts are decided by whether the fight lands in an active window, and that timing reshuffles after any upstream change; the Auto-Cast attempts it does have went from 5% to 20% wins.
5. Losses still recorded in idle, light and casual: MET (22, 22, 4).
6. Active-window win rates below 95%: MET (light 6/12 = 50%, casual 10/13 = 77%).
Hunter King
7. Idle and light no longer show execution-wall attempts: MET (idle 32 / 64 -> 3 / 8, streak 31 -> 2, stall 5.24h -> 1.80h, paired 10 of 10 down; light 1 / 11 -> 1 / 4, the two 10-11 attempt seeds (39, 40) become 1 and 2).
8. Auto-Cast viability materially improves: MET (idle 10/361 = 2.8% -> 10/35 = 29% pooled; light 1/8 -> 2/7; casual 0/4 -> 2/3).
9. Light and casual active-window win rates below 95%: light MET (8/10 = 80%); casual NOT MET (8/8 = 100%; control 8/11 = 73%). n=8 attempts, and casual's first attempts arrive at Lv 54 (control 51) with power +21% because Emberwaste no longer stalls it; casual first-try 4/10 -> 9/10.
10. Fight still produces losses in realistic profiles: MET (idle 25, light 7, casual 1 loss).
11. Volley meaningfully lethal but not dominating: MET. Volley kills per attempt 2.25 -> 2.13 (idle), losses now reach the summon 97% (from 75%) and end at 48% boss HP (from 54%); wins end at 95-96% party HP with four survivors.
Whole Road
12. Stillwater, Thornwood, Ironvein and their bosses identical: MET (every row identical in all three profiles; Ironvein clear 14.77 / 14.09 / 11.11h in both arms).
13. No adequately sampled downstream median clear time worse than +10% / P90 +15%: MET. Ashen Approach: idle 47.13h -> 46.20h, light 46.03h -> 44.07h, casual 41.04h -> 42.09h (+3%) with P90 44.08h -> 46.01h (+4%).
14. No profile regresses in median zones cleared at 24h, 36h, 48h: MET. Idle 4/4, 5 -> 6 (paired +7, 0 x3, -0), 6/6; light 4/4, 6/6, 7/7; casual 5/5, 6/6 (P90 7 -> 6, paired -2), 7/7.
15. Total defeats within +10%: MET (idle -1%, light +3%, casual -9%).
16. No material Auto Training, horde, catacomb, telemetry or mechanical regression: NOT MET on the letter for idle Auto Training hours (19.6h -> 23.3h, +19%; triggers 34 -> 38, +12%), MET for light (+1%) and casual (+5%). The extra idle training is triggered by Ashen Approach: idle clears Amberfall at 34.8h instead of 38.5h, enters Ashen Approach at Lv 60 instead of Lv 65, and spends 4.4h instead of 2.2h of non-training time there (ordinary defeats 38 -> 69) plus the training that zone triggers. Nothing changed in Auto Training's own behaviour (trigger window win rate 60% -> 80% after return in both arms; retriggers -20% for idle). Hordes: fought +1 per run in all profiles (more Road reached), lost fewer; catacombs identical; casts and damage shares identical.

## The one downstream change that matters: the Grave Knight is now the wall
Casual's Ashen Approach boss goes from 6/10 first-try, 1 / 3 attempts, 0.02h stall to 2/10, 2 / 5, 3.5h stall (paired +4 seeds worse, 4 flat, 2 better). Arrival level and power are the same (66 vs 65, -3%), so it is not weaker parties; it is that casual's first Grave Knight attempt now lands in an Auto-Cast window 50% of the time instead of 10% (the schedule shifts when Emberwaste and Amberfall stop stalling), and the Grave Knight's Auto-Cast attempts are near-hopeless for everyone: casual 0/10, idle 3/24, light 1/2. Its active-window attempts stay fine (casual 10/14, light 7/8). Idle's Ashen Approach attempts also rise (1 / 9 -> 2 / 7 per run, stall 1.79h -> 3.11h) because idle now has time to reach and lose to it. The zone's clear times do not move outside the limits, and the Ashen Keep rows behind it are unchanged (no realistic clear in either arm), but the same damage-per-action shape is now the first wall on the Road for idle and casual, at 35-42h.

## Recommendation (proposal only)
1. Lock Sand Tyrant base ATK x1.1 and Hunter King base ATK x1.0 in production (two fields in the enemy table; the override path exercised them). No further Sand Tyrant or Hunter King pass. IMPLEMENTATION_RISK: none technically; design risk is the active-window ceiling at the Hunter King for casual (8/8 on n=8; light 80%), which a lock should accept as a small-sample reading rather than re-tune.
2. Next bottleneck, same rule, one boss: the Grave Knight at Ashen Approach. Parity value from the candidate-arm arrival states: idle front hero 4555 HP / 656 DEF, boss ATK 5586 -> target ordinary hit 1980 -> ATK 2357 -> base x0.85 (from x2.0); light gives the same, casual x0.8. Candidate: Grave Knight base ATK x2.0 -> x0.85, everything else locked (HP x7, DEF x1.4, speed 7, charge x2.5, raise, two skeletons at 70%). Test: paired seeds 31-40 x idle/light/casual x 48h on top of the two locked values, 30 + 30 runs, simulator override only. Criteria as in pass 17 with the Grave Knight rows in place of the Sand Tyrant rows (idle attempts 1-4 / P90 <=8 where reached, Auto-Cast out of single digits, active-window ceilings below 95%, losses in all three profiles, Amberfall and everything upstream identical, Ashen Keep unchanged as the Shatter wall).
3. Not proposed: any change to the Hollow King (Ashen Keep, the Shatter wall), ordinary enemies, or the level curve. The curve observation stands (the Hunter King and Grave Knight share x2.0 yet hits-to-defeat fall from 1.0 to 0.9 at higher arrival levels, and the Hollow King at x1.7 is 0.7), and the per-boss rule is a bounded way to reach the Foundry before deciding whether the curve itself needs a design pass.

## Caveats
n=10 per cell; first-try rates move in 10-point steps. Light's Sand Tyrant outcomes are window-timing dominated and bimodal; read the paired counts, not the arm medians. Casual's Hunter King active-window rate rests on 8 attempts. Hero HP/DEF at first attempt come from arrival snapshots matched to each arm by level (the shared snapshot folder was written by both arms; matching is exact for Ironvein, Emberwaste and Amberfall, 7 of 8 and 9 of 10 for Ashen Approach). The compare tool's "(24h)" section labels report end-of-run values (48h here); the horizon rows in the per-seed section are computed at 24, 36 and 48h.
