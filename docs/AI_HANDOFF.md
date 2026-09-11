STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: RESULTS_WITH_REJECT_RECOMMENDATION
PASS_ID: PASS_18_GRAVE_KNIGHT_ATK_CANDIDATE
BASED_ON_REVIEW_PASS: PASS_18_GRAVE_KNIGHT_ATK_CANDIDATE
BUILD: 20260911-135817
HEAD_COMMIT_SHA: a20b39114d0a310c57915ce8611a813cbf4c009a

# Crystal Road AI Handoff - Pass 18 (Grave Knight ATK x2.0 vs x0.85, paired seeds 31-40, 48h, on the locked Sand Tyrant x1.1 / Hunter King x1.0 build)

DEVELOPER_POSITION: AGREE with the review's criteria, and by those criteria the candidate is a REJECT: x0.85 turns the Grave Knight into an automatic clear for idle (7 of 7 first-try, 0 losses in 7 attempts, Auto-Cast 7/7) and light (9 of 10 first-try, Auto-Cast 3/3), with the charge no longer killing (0.14 kills per hit) and every win ending at 100% party HP. It stays contested only for casual, which arrives four levels lower. The control (x2.0) remains an Auto-Cast wall (idle 3/24, casual 0/10, casual first-try 2/10 with 3.5h stall). So neither endpoint is the value, and the hits-to-defeat parity rule that produced contested fights at the Sand Tyrant and Hunter King overshoots at Lv 70. CONFIDENCE: HIGH on all measurements (60 runs, 0 errors, arms audited, harness replay agrees with the road); HIGH on the reject; MEDIUM on what to do instead, which is the reviewer's call under the "no more Grave Knight passes" rule.

## Locks applied (pass 17 review)
Commit a20b391 sets Sand Tyrant `atk:1.1` and Hunter King `atk:1.0` in `source/game.js` and the bundle (build 20260911-134646); no candidate override for either exists anywhere. Both pass 18 arms ran on this build; the Emberwaste and Amberfall rows below are identical between arms, as they must be.

## Setup and audit
- Grave Knight production `atk:2.0` unchanged; the candidate arm applied `atk:0.85` through the simulator's per-run source replace only (`tests/sim/batch_p18x.log`). Audit: Grave Knight ATK 5586 at every control first attempt, 2374 at every candidate first attempt, boss Lv 53 in both. Every row upstream of Ashen Approach is identical between arms (Stillwater through Amberfall: first-try, attempts, stall, clear times, training triggers, hordes, catacombs).
- Paired seeds 31-40 x idle/light/casual x 48h, --shatters 3, production Road, Auto Training, hordes, catacombs; 30 control + 30 candidate runs; 0 simulation errors.
- Observation-only instrumentation added after the batches finished (this commit): a raised-units counter (`G.fs.raised`, recorded per attempt by bot.js and per fight by bossdiag.js). The road batches predate it, so raised units are reported from the focused harness replay below, as the review allowed. Also this commit: per-arm snapshot folders were used for the first time (`snapshots_p18c`, `snapshots_p18x`), and I found that Ashen Approach and Ashen Keep snapshots share the `ashen_` file prefix (the Keep's later attempt overwrites the Approach's file for the same seed); the harness replays below use a filtered copy containing only Ashen Approach arrivals (22 control, 23 candidate). A prefix fix in bot.js is queued as observation-only for the next pass, not applied mid-pass.

## Grave Knight: road results (Ashen Approach focus rows)
-- ASHEN APPROACH                                                                                                                                                                                                                                   
first-try clear (mean)                                                                                                         0% -> 100%                             88% -> 90% (+2%)                       20% -> 50% (+150%)                     
attempts to clear                                                                                                              3 / 4 -> 1 / 1 (-67%)                  1 / 2 -> 1 / 2 (0%)                    2 / 5 -> 1 / 2 (-50%)                  
stall h                                                                                                                        3.11 / 4.5 -> 0.05 / 0.05 (-98%)       0.02 / 0.99 -> 0.02 / 2.95 (0%)        3.5 / 9.91 -> 0.05 / 5.92 (-99%)       
zone clear h                                                                                                                   46.2 / 46.6 -> 45.05 / 46.87 (-2%)     44.07 / 46.08 -> 44.13 / 47.03 (+0%)   42.09 / 46.01 -> 41.05 / 44.11 (-2%)   
Lv entering zone                                                                                                               60 / 62 -> 60 / 62 (0%)                60 / 61 -> 60 / 61 (0%)                54 / 61 -> 54 / 61 (0%)                
Lv at first try                                                                                                                69 / 71 -> 70 / 72 (+1%)               70 / 72 -> 70 / 71 (0%)                66 / 73 -> 67 / 73 (+2%)               
-- ASHEN APPROACH ATTEMPTS (attempt-level, all attempts)                                                                                                                                                                                            
boss ATK at first attempt (audit)                                                                                              5586 / 5586 -> 2374 / 2374 (-58%)      5586 / 5586 -> 2374 / 2374 (-58%)      5586 / 5586 -> 2374 / 2374 (-58%)      
boss Lv at first attempt                                                                                                       53 / 53 -> 53 / 53 (0%)                53 / 53 -> 53 / 53 (0%)                53 / 53 -> 53 / 53 (0%)                
attempts per run                                                                                                               2 / 7 -> 1 / 1 (-50%)                  1 / 2 -> 1 / 2 (0%)                    2 / 5 -> 1 / 2 (-50%)                  
first attempt in active window (1=yes)                                                                                         0% -> 0%                               78% -> 70% (-10%)                      50% -> 40% (-20%)                      
first attempt party HP %                                                                                                       86 / 100 -> 100 / 100 (+16%)           100 / 100 -> 100 / 100 (0%)            100 / 100 -> 95 / 100 (-5%)            
first attempt charge / surge                                                                                                   50 / 70 -> 47 / 70 (-6%)               63 / 72 -> 57 / 74 (-10%)              46 / 66 -> 42 / 66 (-9%)               
first attempt power                                                                                                            53837 / 55923 -> 54634 / 59977 (+1%)   54264 / 57454 -> 52761 / 57454 (-3%)   44132 / 57511 -> 50693 / 58134 (+15%)  
active-window attempts: win % (pooled)                                                                                         -% -> -%                               88% -> 93% (+6%)                       83% -> 83% (0%)                        
Auto-Cast attempts: win % (pooled)                                                                                             15% -> 100% (+567%)                    50% -> 100% (+100%)                    0% -> 58%                              
Auto-Cast attempts per run                                                                                                     2 / 7 -> 1 / 1 (-50%)                  0 / 1 -> 0 / 1                         1 / 3 -> 1 / 2 (0%)                    
charge telegraphs per attempt (run mean)                                                                                       1.5 / 2 -> 3 / 3 (+100%)               1 / 2 -> 1 / 3 (0%)                    0.8 / 1 -> 0.5 / 3 (-37%)              
charge hits per attempt                                                                                                        1.5 / 2 -> 3 / 3 (+100%)               0 / 2 -> 0 / 3                         0.6 / 1 -> 0.5 / 3 (-17%)              
charge kills per attempt                                                                                                       1.5 / 2 -> 0 / 1 (-100%)               0 / 2 -> 0 / 1                         0.6 / 1 -> 0.5 / 1 (-17%)              
parries + interrupts per attempt                                                                                               0 / 0 -> 0 / 0                         0 / 1 -> 0 / 1                         0 / 0.5 -> 0 / 0.5                     
boss ordinary hits on heroes per attempt                                                                                       5 / 7.7 -> 10 / 11 (+100%)             4 / 8 -> 4 / 12 (0%)                   3 / 4 -> 3 / 11 (0%)                   
LOSS boss HP left (run median)                                                                                                 66 / 69 -> - / -                       64 / 68 -> 59 / 59 (-8%)               64 / 87 -> 66 / 67 (+3%)               
LOSS reached summon % (pooled)                                                                                                 88% -> -%                              100% -> 100% (0%)                      65% -> 100% (+54%)                     
WIN survivors (run median)                                                                                                     4 / 4 -> 4 / 4 (0%)                    4 / 4 -> 4 / 4 (0%)                    4 / 4 -> 4 / 4 (0%)                    
WIN party HP % (run median)                                                                                                    83 / 97 -> 100 / 100 (+20%)            100 / 100 -> 100 / 100 (0%)            100 / 100 -> 100 / 100 (0%)            
Ashen max loss streak                                                                                                          3 / 7 -> 0 / 0 (-100%)                 0 / 1 -> 0 / 1                         1 / 4 -> 0 / 1 (-100%)                 
Ashen combat stall h                                                                                                           0.04 / 0.06 -> 0 / 0 (-100%)           0 / 0.02 -> 0 / 0.02                   0.02 / 0.06 -> 0 / 0.03 (-100%)        
Ashen retry stall h                                                                                                            3 / 4.42 -> 0 / 0 (-100%)              0 / 0.95 -> 0 / 2.91                   3.47 / 9.83 -> 0 / 5.87 (-100%)        
-- PAIRED PER-SEED DELTAS (candidate minus control): median delta | +/0/- counts                                                                                                                                                                    
Ashen attempts                                                                                                                 -2 | +0 00 -3 (n3)                     0 | +0 07 -1 (n8)                      -1 | +0 04 -6 (n10)                    
Ashen stall h                                                                                                                  -3.06 | +0 00 -3 (n3)                  0 | +3 03 -2 (n8)                      -1.01 | +1 01 -8 (n10)                 
Ashen clear h                                                                                                                  -1.77 | +0 00 -3 (n3)                  -0.63 | +1 02 -5 (n8)                  -1.51 | +0 01 -9 (n10)                 
zones cleared @24h                                                                                                             0 | +4 06 -0 (n10)                     0 | +2 08 -0 (n10)                     0 | +0 010 -0 (n10)                    
zones cleared @20h                                                                                                             0 | +0 010 -0 (n10)                    0 | +0 010 -0 (n10)                    0 | +0 010 -0 (n10)                    
ordinary rewalk fights                                                                                                         0 | +5 03 -2 (n10)                     -6 | +3 02 -5 (n10)                    0 | +4 02 -4 (n10)                     
ordinary rewalk hours                                                                                                          0 | +5 03 -2 (n10)                     0 | +4 02 -4 (n10)                     0.02 | +6 01 -3 (n10)                  
total defeats                                                                                                                  6 | +7 03 -0 (n10)                     9 | +6 03 -1 (n10)                     47 | +8 01 -1 (n10)                    
-- COUNTS WITH DENOMINATORS                                                                                                                                                                                                                         
Ashen first-try clears / runs                                                                                                  0/3 -> 7/7                             7/8 -> 9/10                            2/10 -> 5/10                           
Auto-Cast attempts: wins / attempts                                                                                            3/24 -> 7/7                            1/2 -> 3/3                             0/10 -> 4/7                            
active-window attempts: wins / attempts                                                                                        0/0 -> 0/0                             7/8 -> 7/8                             10/14 -> 6/8                           
runs reaching a 6th zone by 24h / runs                                                                                         10/10 -> 10/10                         10/10 -> 10/10                         10/10 -> 10/10                         
6th-zone clear h (med of those reaching)                                                                                       34.77 -> 34.77                         32.07 -> 32.07                         25.15 -> 25.15                         
zones cleared @20h (med)                                                                                                       4 -> 4                                 4 -> 4                                 5 -> 5                                 
-- FIRST ATTEMPT DETAIL (run medians; loss boss HP left where lost)                                                                                                                                                                                 
first attempt: won (mean)                                                                                                      0% -> 100%                             78% -> 90% (+15%)                      20% -> 50% (+150%)                     
first attempt: boss HP left on loss %                                                                                          67 / 79 -> - / -                       64 / 68 -> 59 / 59 (-8%)               64 / 87 -> 66 / 67 (+3%)               
first attempt: party Lv                                                                                                        69 / 71 -> 70 / 72 (+1%)               70 / 72 -> 70 / 71 (0%)                66 / 73 -> 67 / 73 (+2%)               
first attempt: party HP %                                                                                                      86 / 100 -> 100 / 100 (+16%)           100 / 100 -> 100 / 100 (0%)            100 / 100 -> 95 / 100 (-5%)            
first attempt: charge                                                                                                          50 / 70 -> 47 / 70 (-6%)               63 / 72 -> 57 / 74 (-10%)              46 / 66 -> 42 / 66 (-9%)               
first attempt: Surge                                                                                                           100 / 100 -> 100 / 100 (0%)            52 / 100 -> 67 / 100 (+29%)            64 / 100 -> 64 / 100 (0%)              
first attempt: boss ordinary hits                                                                                              4 / 5 -> 10 / 11 (+150%)               4 / 8 -> 4 / 12 (0%)                   4 / 6 -> 4 / 11 (0%)                   
first attempt: charge telegraphs / hits / kills                                                                                1 / 2 -> 3 / 3 (+200%)                 0 / 2 -> 0 / 3                         1 / 2 -> 1 / 3 (0%)                    
first attempt: charge kills                                                                                                    1 / 2 -> 0 / 1 (-100%)                 0 / 2 -> 0 / 1                         1 / 2 -> 1 / 2 (0%)                    
first attempt: reached summon on loss (mean)                                                                                   71% -> -%                              100% -> 100% (0%)                      75% -> 100% (+33%)                     

## Grave Knight: arrival state and hits-to-defeat at first attempt (per-arm snapshots)
Control arm (x2.0):

=== Orc Warlord (Ironvein Caverns, zone 4, enemy Lv 20)  base HP x6 ATK x1.2 DEF x1.2 spd 8 melee  charge melee x2.5  mech {"charge":true,"shieldAllies":true,"summon":[{"at":0.5,"id":"orc","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    10    38    1312/990   177/135 691     589/624           2.2/1.6       124%/168%     | 22      10/22     0/0        2.55/2.32 (tele 2.55)  8.3          39           100     4/79%        40% n10   batch_out_p18c
light   10    37    1277/930   167/130 691     595/626           2.1/1.5       128%/179%     | 27      5/18      5/9        1.85/1.63 (tele 1.93)  6.6          43           88      4/86%        20% n10   batch_out_p18c
casual  10    35    1138/850   149/110 691     605/636           1.9/1.3       144%/197%     | 14      0/1       10/13      0.71/0.71 (tele 1.07)  4.7          46           75      4/83%        70% n10   batch_out_p18c

=== The Sand Tyrant (Emberwaste, zone 5, enemy Lv 27)  base HP x6.5 ATK x1.1 DEF x1 spd 10 melee  charge melee x2.5  mech {"charge":true,"enrage":0.25,"summon":[{"at":0.5,"id":"sandorc","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    10    49    2151/1459  300/218 1077    905/968           2.4/1.5       117%/177%     | 32      10/32     0/0        3.91/2.56 (tele 3.91)  8.9          37           100     4/81%        20% n10   batch_out_p18c
light   10    46    2068/1418  275/203 1077    919/976           2.3/1.5       123%/183%     | 32      4/20      6/12       3.13/2.09 (tele 3.28)  7.8          42           86      4/95%        30% n10   batch_out_p18c
casual  10    42    1709/1073  217/148 1077    952/1003          1.8/1.1       150%/244%     | 14      0/1       10/13      0.86/0.79 (tele 2)     4.9          18           75      4/83%        60% n10   batch_out_p18c

=== The Hunter King (Amberfall Woods, zone 6, enemy Lv 34)  base HP x6 ATK x1 DEF x0.9 spd 11 ranged  charge volley x2.2  mech {"charge":true,"summon":[{"at":0.6,"id":"skelarcher","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    10    58    3102/2417  461/368 1617    1352/1433         2.3/1.7       106%/140%     | 35      10/35     0/0        3.83/2.23 (tele 3.83)  8.2          48           92      4/96%        10% n10   batch_out_p18c
light   10    58    3095/2378  427/356 1617    1371/1439         2.3/1.7       107%/142%     | 17      2/7       8/10       2.12/1.24 (tele 2.41)  5.2          56           100     4/96%        60% n10   batch_out_p18c
casual  10    54    2470/1812  367/280 1617    1406/1477         1.8/1.2       135%/189%     | 11      2/3       8/8        1.55/0.82 (tele 2.64)  5.3          48           100     4/95%        90% n10   batch_out_p18c

=== Grave Knight (Ashen Approach, zone 7, enemy Lv 42)  base HP x7 ATK x2 DEF x1.4 spd 7 melee  charge melee x2.5  mech {"charge":true,"raise":true,"summon":[{"at":0.7,"id":"skeleton","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    7     69    4555/3698  656/529 5586    5209/5322         0.9/0.7       298%/370%     | 24      3/24      0/0        1.38/1.38 (tele 1.38)  5.4          66           86      4/83%        0% n7     batch_out_p18c
light   9     70    4586/3698  658/531 5586    5208/5321         0.9/0.7       296%/370%     | 10      1/2       7/8        0.5/0.5 (tele 0.9)     4            64           100     4/100%       78% n9    batch_out_p18c
casual  6     66    4012/3096  564/480 5586    5262/5346         0.8/0.6       340%/443%     | 24      0/10      10/14      0.71/0.71 (tele 0.79)  3.2          64           64      4/100%       20% n10   batch_out_p18c

=== The Hollow King (Ashen Keep, zone 8, enemy Lv 50)  base HP x7 ATK x1.7 DEF x1 spd 8 aoe  charge none  mech {"drain":true,"summon":[{"at":0.7,"id":"skeleton","n":2},{"at":0.35,"id":"armoredskel","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    no data
light   no data
casual  4     72    4969/3871  788/577 8029    7576/7741         0.7/0.5       -             | 7       0/0       0/7        0/0 (tele 0)           5.4          87           0       -            0% n4     batch_out_p18c

ordHit = boss ATK - hero DEF*0.5 (front x1.15; tree front bonus ignored), before the 0.85-1.15 roll and crits; hits2kill = hero max HP / ordHit; charge%HP = charge damage as % of hero max HP (melee x2.5, volley x2.2). Telemetry columns pool every attempt in the source dir; first-try is per run.

Candidate arm (x0.85):

=== Orc Warlord (Ironvein Caverns, zone 4, enemy Lv 20)  base HP x6 ATK x1.2 DEF x1.2 spd 8 melee  charge melee x2.5  mech {"charge":true,"shieldAllies":true,"summon":[{"at":0.5,"id":"orc","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    10    38    1312/990   177/135 691     589/624           2.2/1.6       124%/168%     | 22      10/22     0/0        2.55/2.32 (tele 2.55)  8.3          39           100     4/79%        40% n10   batch_out_p18x
light   10    37    1277/930   167/130 691     595/626           2.1/1.5       128%/179%     | 27      5/18      5/9        1.85/1.63 (tele 1.93)  6.6          43           88      4/86%        20% n10   batch_out_p18x
casual  10    35    1138/850   149/110 691     605/636           1.9/1.3       144%/197%     | 14      0/1       10/13      0.71/0.71 (tele 1.07)  4.7          46           75      4/83%        70% n10   batch_out_p18x

=== The Sand Tyrant (Emberwaste, zone 5, enemy Lv 27)  base HP x6.5 ATK x1.1 DEF x1 spd 10 melee  charge melee x2.5  mech {"charge":true,"enrage":0.25,"summon":[{"at":0.5,"id":"sandorc","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    10    49    2151/1459  300/218 1077    905/968           2.4/1.5       117%/177%     | 32      10/32     0/0        3.91/2.56 (tele 3.91)  8.9          37           100     4/81%        20% n10   batch_out_p18x
light   10    46    2068/1418  275/203 1077    919/976           2.3/1.5       123%/183%     | 32      4/20      6/12       3.13/2.09 (tele 3.28)  7.8          42           86      4/95%        30% n10   batch_out_p18x
casual  10    42    1709/1073  217/148 1077    952/1003          1.8/1.1       150%/244%     | 14      0/1       10/13      0.86/0.79 (tele 2)     4.9          18           75      4/83%        60% n10   batch_out_p18x

=== The Hunter King (Amberfall Woods, zone 6, enemy Lv 34)  base HP x6 ATK x1 DEF x0.9 spd 11 ranged  charge volley x2.2  mech {"charge":true,"summon":[{"at":0.6,"id":"skelarcher","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    10    58    3102/2417  461/368 1617    1352/1433         2.3/1.7       106%/140%     | 35      10/35     0/0        3.83/2.23 (tele 3.83)  8.2          48           92      4/96%        10% n10   batch_out_p18x
light   10    58    3095/2378  427/356 1617    1371/1439         2.3/1.7       107%/142%     | 17      2/7       8/10       2.12/1.24 (tele 2.41)  5.2          56           100     4/96%        60% n10   batch_out_p18x
casual  10    54    2470/1812  367/280 1617    1406/1477         1.8/1.2       135%/189%     | 11      2/3       8/8        1.55/0.82 (tele 2.64)  5.3          48           100     4/95%        90% n10   batch_out_p18x

=== Grave Knight (Ashen Approach, zone 7, enemy Lv 42)  base HP x7 ATK x2 DEF x1.4 spd 7 melee  charge melee x2.5  mech {"charge":true,"raise":true,"summon":[{"at":0.7,"id":"skeleton","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    7     70    4558/3698  656/530 2374    1997/2109         2.3/1.8       122%/153%     | 7       7/7       0/0        2.43/0.14 (tele 2.43)  9.7          -            -       4/100%       100% n7   batch_out_p18x
light   10    70    4558/3541  654/530 2374    1998/2109         2.3/1.7       122%/160%     | 11      3/3       7/8        1.18/0.27 (tele 1.36)  6.1          59           100     4/100%       90% n10   batch_out_p18x
casual  6     64    3859/3021  503/448 2374    2085/2150         1.9/1.4       146%/189%     | 15      4/7       6/8        1.2/0.53 (tele 1.27)   5.2          66           100     4/100%       50% n10   batch_out_p18x

=== The Hollow King (Ashen Keep, zone 8, enemy Lv 50)  base HP x7 ATK x1.7 DEF x1 spd 8 aoe  charge none  mech {"drain":true,"summon":[{"at":0.7,"id":"skeleton","n":2},{"at":0.35,"id":"armoredskel","n":2}]}
profile snaps arrLv heroHP med heroDEF bossATK ordHit front/back hits2kill f/b charge%HP f/b | attemptsauto w/a  active w/a chg hits/kills per att bossHits/att loss bossHP% summon% win surv/HP% first-try source
idle    no data
light   no data
casual  4     71    4842/3645  730/544 8029    7609/7757         0.6/0.5       -             | 7       0/0       0/7        0/0 (tele 0)           5.6          87           0       -            0% n4     batch_out_p18x

ordHit = boss ATK - hero DEF*0.5 (front x1.15; tree front bonus ignored), before the 0.85-1.15 roll and crits; hits2kill = hero max HP / ordHit; charge%HP = charge damage as % of hero max HP (melee x2.5, volley x2.2). Telemetry columns pool every attempt in the source dir; first-try is per run.

## Grave Knight: focused harness replay from the control arm's Ashen Approach arrivals (5 combat seeds per snapshot, both modes), including raised units
Control x2.0:
BOSS DIAGNOSTIC ashen  snapshots x 5 combat seeds x 2 modes
                                              idle active  idle auto    light active light auto   casual activecasual auto  idle both    light both   casual both  ALL          
fights                                        35           35           45           45           30           30           70           90           60           220          
clear % (mean +- 95% CI)                      31+-15       0+-0         100+-0       0+-0         100+-0       0+-0         16+-9        50+-10       50+-13       39+-6        
duration s med / P90                          93 / 142     52 / 65      72 / 82      60 / 102     63 / 108     49 / 75      60 / 132     68 / 92      58 / 86      64 / 108     
LOSS boss HP left med / P90                   53% / 67%    69% / 83%    -            67% / 77%    -            78% / 92%    67% / 79%    67% / 77%    78% / 92%    68% / 85%    
LOSS share: wiped before 50% (pre-summon)     0%           40%          -            27%          -            63%          24%          27%          63%          34%          
LOSS share: after summon, boss 20-50%         92%          60%          -            73%          -            37%          73%          73%          37%          65%          
LOSS share: near kill, boss <20% or dead      8%           0%           -            0%           -            0%           3%           0%           0%           1%           
LOSS share: boss dead, adds finished party    0%           0%           -            0%           -            0%           0%           0%           0%           0%           
LOSS early wipe <40 s                         4%           26%          -            7%           -            40%          17%          7%           40%          19%          
LOSS adds alive at wipe med                   1            2            -            1            -            0            1            1            0            1            
WIN survivors med / party HP% med             4 / 79%      -            4 / 100%     -            4 / 100%     -            4 / 79%      4 / 100%     4 / 100%     4 / 100%     
summon occurred %                             100%         60%          100%         73%          100%         37%          80%          87%          68%          80%          
summon at s med (when it occurred)            32           47           24           47           21           44           34           27           28           32           
dmg taken from boss vs adds (med %)           80% boss     92% boss     72% boss     85% boss     63% boss     100% boss    84% boss     79% boss     72% boss     82% boss     
charge hits / kills per fight (mean)          0.8 / 0.77   1.4 / 1.43   0.4 / 0.29   1.4 / 1.4    0.1 / 0.03   1.3 / 1.27   1.1 / 1.1    0.9 / 0.84   0.7 / 0.65   0.9 / 0.87   
raised units per fight (mean)                 1.43         0.06         0.18         0.49         0.5          0.17         0.74         0.33         0.33         0.46         
charge parried / interrupted per fight        0.14 / 0.43  0 / 0        0.18 / 0.51  0 / 0        0.07 / 0.53  0 / 0        0.07 / 0.21  0.09 / 0.26  0.03 / 0.27  0.07 / 0.25  
ward (shieldAllies) dmg absorbed med          0            0            0            0            0            0            0            0            0            0            
charge telegraphs per fight (mean)            1.23         1.43         0.91         1.4          0.6          1.27         1.33         1.16         0.93         1.15         
AUTO reactions attempted / ok per fight       0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        
AUTO reactions prevented (double) total       0            0            0            0            0            0            0            0            0            0            
AUTO responder class (K/R/M) totals           0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        
AUTO reaction kind (chargeM/chargeR) totals   0/0          0/0          0/0          0/0          0/0          0/0          0/0          0/0          0/0          0/0          
normal ability casts per fight (mean)         16.46        7.29         23.29        10.16        28.13        6.97         11.87        16.72        17.55        15.4         
arrival Lv med                                69.3         69.3         70.3         70.3         66.3         66.3         69.3         70.3         66.3         70.3         
arrival power med                             53837        53837        54264        54264        44132        44132        53837        54264        44132        53718        
arrival HP% med                               86           86           100          100          90           90           86           100          90           97           
arrival charge med                            50           50           63           63           45           45           50           63           45           61           

OUTCOME BY ARRIVAL POWER TERCILE (within profile, both modes)
idle      low: 0% win, power<53355, n=20              mid: 20% win, power<54032, n=20             high: 23% win, power<max, n=30              
light     low: 50% win, power<52761, n=30             mid: 50% win, power<55163, n=30             high: 50% win, power<max, n=30              
casual    low: 50% win, power<44132, n=20             mid: 50% win, power<54366, n=20             high: 50% win, power<max, n=20              

OUTCOME BY ARRIVAL HP (both modes): idle hp<80%: 17% (n30) hp>=80%: 15% (n40) | light hp<80%: 50% (n10) hp>=80%: 50% (n80) | casual hp<80%: 50% (n10) hp>=80%: 50% (n50)

Candidate x0.85:
BOSS DIAGNOSTIC ashen  snapshots x 5 combat seeds x 2 modes
                                              idle active  idle auto    light active light auto   casual activecasual auto  idle both    light both   casual both  ALL          
fights                                        35           35           45           45           30           30           70           90           60           220          
clear % (mean +- 95% CI)                      91+-9        100+-0       100+-0       93+-7        100+-0       50+-18       96+-5        97+-4        75+-11       90+-4        
duration s med / P90                          132 / 153    171 / 185    72 / 82      173 / 190    63 / 108     151 / 177    155 / 184    86 / 185     90 / 167     133 / 179    
LOSS boss HP left med / P90                   16% / 43%    -            -            64% / 67%    -            67% / 69%    16% / 43%    64% / 67%    67% / 69%    66% / 68%    
LOSS share: wiped before 50% (pre-summon)     0%           -            -            0%           -            0%           0%           0%           0%           0%           
LOSS share: after summon, boss 20-50%         33%          -            -            100%         -            100%         33%          100%         100%         90%          
LOSS share: near kill, boss <20% or dead      67%          -            -            0%           -            0%           67%          0%           0%           10%          
LOSS share: boss dead, adds finished party    0%           -            -            0%           -            0%           0%           0%           0%           0%           
LOSS early wipe <40 s                         0%           -            -            0%           -            0%           0%           0%           0%           0%           
LOSS adds alive at wipe med                   0            -            -            1            -            2            0            1            2            2            
WIN survivors med / party HP% med             4 / 100%     4 / 100%     4 / 100%     4 / 100%     4 / 100%     4 / 100%     4 / 100%     4 / 100%     4 / 100%     4 / 100%     
summon occurred %                             100%         100%         100%         100%         100%         100%         100%         100%         100%         100%         
summon at s med (when it occurred)            33           47           24           47           21           50           39           33           34           39           
dmg taken from boss vs adds (med %)           69% boss     76% boss     49% boss     74% boss     40% boss     74% boss     73% boss     70% boss     58% boss     70% boss     
charge hits / kills per fight (mean)          0.9 / 0.14   2.6 / 0.4    0.4 / 0.07   2.7 / 0.31   0.1 / 0      2.3 / 0.7    1.8 / 0.27   1.5 / 0.19   1.2 / 0.35   1.5 / 0.26   
raised units per fight (mean)                 2            2            0.13         1.93         0.6          1.17         2            1.03         0.88         1.3          
charge parried / interrupted per fight        0 / 0.71     0 / 0        0.18 / 0.53  0 / 0        0.1 / 0.47   0 / 0        0 / 0.36     0.09 / 0.27  0.05 / 0.23  0.05 / 0.29  
ward (shieldAllies) dmg absorbed med          0            0            0            0            0            0            0            0            0            0            
charge telegraphs per fight (mean)            1.63         2.63         0.91         2.69         0.57         2.33         2.13         1.8          1.45         1.81         
AUTO reactions attempted / ok per fight       0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        0 / 0        
AUTO reactions prevented (double) total       0            0            0            0            0            0            0            0            0            0            
AUTO responder class (K/R/M) totals           0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        0/0/0        
AUTO reaction kind (chargeM/chargeR) totals   0/0          0/0          0/0          0/0          0/0          0/0          0/0          0/0          0/0          0/0          
normal ability casts per fight (mean)         27.03        34.89        23.6         34.51        28.9         26.77        30.96        29.06        27.83        29.33        
arrival Lv med                                69.3         69.3         70.3         70.3         66.3         66.3         69.3         70.3         66.3         70.3         
arrival power med                             53837        53837        54264        54264        44132        44132        53837        54264        44132        53718        
arrival HP% med                               86           86           100          100          90           90           86           100          90           97           
arrival charge med                            50           50           63           63           45           45           50           63           45           61           

OUTCOME BY ARRIVAL POWER TERCILE (within profile, both modes)
idle      low: 90% win, power<53355, n=20             mid: 95% win, power<54032, n=20             high: 100% win, power<max, n=30             
light     low: 90% win, power<52761, n=30             mid: 100% win, power<55163, n=30            high: 100% win, power<max, n=30             
casual    low: 50% win, power<44132, n=20             mid: 75% win, power<54366, n=20             high: 100% win, power<max, n=20             

OUTCOME BY ARRIVAL HP (both modes): idle hp<80%: 90% (n30) hp>=80%: 100% (n40) | light hp<80%: 100% (n10) hp>=80%: 96% (n80) | casual hp<80%: 100% (n10) hp>=80%: 70% (n50)

## Per-seed detail, loss phases, horizons (Emberwaste, Amberfall, Ashen Approach, Ashen Keep)

== idle  Emberwaste  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
31  3 | 3.30 | 2 | auto/L/48 | 1/3 | 0/0 | 26.7 | Lv 39            -> 3 | 3.30 | 2 | auto/L/48 | 1/3 | 0/0 | 26.7 | Lv 39
32  4 | 3.27 | 3 | auto/L/48 | 1/4 | 0/0 | 26.4 | Lv 39            -> 4 | 3.27 | 3 | auto/L/48 | 1/4 | 0/0 | 26.4 | Lv 39
33  2 | 2.02 | 1 | auto/L/47 | 1/2 | 0/0 | 24.4 | Lv 39            -> 2 | 2.02 | 1 | auto/L/47 | 1/2 | 0/0 | 24.4 | Lv 39
34  4 | 0.57 | 3 | auto/L/50 | 1/4 | 0/0 | 24.7 | Lv 39            -> 4 | 0.57 | 3 | auto/L/50 | 1/4 | 0/0 | 24.7 | Lv 39
35  4 | 1.50 | 3 | auto/L/50 | 1/4 | 0/0 | 26.5 | Lv 40            -> 4 | 1.50 | 3 | auto/L/50 | 1/4 | 0/0 | 26.5 | Lv 40
36  5 | 1.56 | 4 | auto/L/49 | 1/5 | 0/0 | 24.1 | Lv 38            -> 5 | 1.56 | 4 | auto/L/49 | 1/5 | 0/0 | 24.1 | Lv 38
37  1 | 0.04 | 0 | auto/W/50 | 1/1 | 0/0 | 24.1 | Lv 39            -> 1 | 0.04 | 0 | auto/W/50 | 1/1 | 0/0 | 24.1 | Lv 39
38  6 | 2.97 | 5 | auto/L/49 | 1/6 | 0/0 | 27.0 | Lv 40            -> 6 | 2.97 | 5 | auto/L/49 | 1/6 | 0/0 | 27.0 | Lv 40
39  1 | 0.04 | 0 | auto/W/51 | 1/1 | 0/0 | 25.0 | Lv 40            -> 1 | 0.04 | 0 | auto/W/51 | 1/1 | 0/0 | 25.0 | Lv 40
40  2 | 0.15 | 1 | auto/L/49 | 1/2 | 0/0 | 22.8 | Lv 39            -> 2 | 0.15 | 1 | auto/L/49 | 1/2 | 0/0 | 22.8 | Lv 39
   batch_out_p18c  reached 10 attempted 10 | losses n=22 bossHP left q25/50/75 0.30/0.37/0.44 | <=25% 4 | summoned 22 | dur med 97s | charge kills/loss 2.41 | boss hits/loss 8.5 | wins n=10 survivors med 4 partyHP med 81%
   batch_out_p18x  reached 10 attempted 10 | losses n=22 bossHP left q25/50/75 0.30/0.37/0.44 | <=25% 4 | summoned 22 | dur med 97s | charge kills/loss 2.41 | boss hits/loss 8.5 | wins n=10 survivors med 4 partyHP med 81%

== idle  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
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
   batch_out_p18c  reached 10 attempted 10 | losses n=25 bossHP left q25/50/75 0.32/0.48/0.55 | <=25% 5 | summoned 23 | dur med 69s | charge kills/loss 2.52 | boss hits/loss 7.6 | wins n=10 survivors med 4 partyHP med 96%
   batch_out_p18x  reached 10 attempted 10 | losses n=25 bossHP left q25/50/75 0.32/0.48/0.55 | <=25% 5 | summoned 23 | dur med 69s | charge kills/loss 2.52 | boss hits/loss 7.6 | wins n=10 survivors med 4 partyHP med 96%

== idle  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
31  entered, no boss attempt | Lv 62                               -> entered, no boss attempt | Lv 62
32  entered, no boss attempt | Lv 61                               -> entered, no boss attempt | Lv 61
33  null | - | 3 | auto/L/71 | 0/3 | 0/0 | - | Lv 61               -> 1 | 0.04 | 0 | auto/W/71 | 1/1 | 0/0 | 46.5 | Lv 61
34  null | - | 7 | auto/L/70 | 0/7 | 0/0 | - | Lv 59               -> 1 | 0.05 | 0 | auto/W/70 | 1/1 | 0/0 | 45.2 | Lv 59
35  entered, no boss attempt | Lv 62                               -> entered, no boss attempt | Lv 62
36  4 | 4.50 | 3 | auto/L/69 | 1/4 | 0/0 | 46.2 | Lv 60            -> 1 | 0.03 | 0 | auto/W/72 | 1/1 | 0/0 | 45.0 | Lv 60
37  3 | 3.11 | 2 | auto/L/69 | 1/3 | 0/0 | 46.6 | Lv 60            -> 1 | 0.05 | 0 | auto/W/70 | 1/1 | 0/0 | 44.8 | Lv 60
38  null | - | 1 | auto/L/70 | 0/1 | 0/0 | - | Lv 59               -> 1 | 0.05 | 0 | auto/W/69 | 1/1 | 0/0 | 46.9 | Lv 59
39  null | - | 4 | auto/L/69 | 0/4 | 0/0 | - | Lv 61               -> 1 | 0.05 | 0 | auto/W/69 | 1/1 | 0/0 | 44.3 | Lv 61
40  2 | 2.00 | 1 | auto/L/69 | 1/2 | 0/0 | 44.4 | Lv 60            -> 1 | 0.05 | 0 | auto/W/69 | 1/1 | 0/0 | 42.5 | Lv 60
   batch_out_p18c  reached 10 attempted 7 | losses n=21 bossHP left q25/50/75 0.60/0.66/0.69 | <=25% 1 | summoned 18 | dur med 60s | charge kills/loss 1.33 | boss hits/loss 4.9 | wins n=3 survivors med 4 partyHP med 83%
   batch_out_p18x  reached 10 attempted 7 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=7 survivors med 4 partyHP med 100%

== idle  Ashen Keep  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
31  not reached | Lv -                                             -> not reached | Lv -
32  not reached | Lv -                                             -> not reached | Lv -
33  not reached | Lv -                                             -> entered, no boss attempt | Lv 71
34  not reached | Lv -                                             -> entered, no boss attempt | Lv 70
35  not reached | Lv -                                             -> not reached | Lv -
36  entered, no boss attempt | Lv 73                               -> entered, no boss attempt | Lv 72
37  entered, no boss attempt | Lv 72                               -> entered, no boss attempt | Lv 70
38  not reached | Lv -                                             -> entered, no boss attempt | Lv 69
39  not reached | Lv -                                             -> entered, no boss attempt | Lv 69
40  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 69
   batch_out_p18c  reached 3 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%
   batch_out_p18x  reached 7 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%

== idle  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  4 / 4 -> 4 / 4   paired +0 010 -0
   @36h  6 / 6 -> 6 / 6   paired +0 010 -0
   @48h  6 / 7 -> 7 / 7   paired +4 06 -0
   total defeats med 559 -> 569   training h med 23.3 -> 23.1

== light  Emberwaste  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
31  8 | 4.17 | 7 | auto/L/46 | 0/5 | 1/3 | 24.1 | Lv 39            -> 8 | 4.17 | 7 | auto/L/46 | 0/5 | 1/3 | 24.1 | Lv 39
32  1 | 0.04 | 0 | auto/W/50 | 1/1 | 0/0 | 24.0 | Lv 41            -> 1 | 0.04 | 0 | auto/W/50 | 1/1 | 0/0 | 24.0 | Lv 41
33  2 | 4.09 | 1 | active/L/46 | 1/1 | 0/1 | 24.1 | Lv 40          -> 2 | 4.09 | 1 | active/L/46 | 1/1 | 0/1 | 24.1 | Lv 40
34  2 | 1.47 | 1 | auto/L/50 | 0/1 | 1/1 | 26.1 | Lv 38            -> 2 | 1.47 | 1 | auto/L/50 | 0/1 | 1/1 | 26.1 | Lv 38
35  3 | 4.94 | 2 | auto/L/45 | 0/2 | 1/1 | 23.0 | Lv 37            -> 3 | 4.94 | 2 | auto/L/45 | 0/2 | 1/1 | 23.0 | Lv 37
36  2 | 1.99 | 1 | active/L/47 | 0/0 | 1/2 | 23.1 | Lv 39          -> 2 | 1.99 | 1 | active/L/47 | 0/0 | 1/2 | 23.1 | Lv 39
37  7 | 5.92 | 6 | auto/L/45 | 0/5 | 1/2 | 25.0 | Lv 38            -> 7 | 5.92 | 6 | auto/L/45 | 0/5 | 1/2 | 25.0 | Lv 38
38  1 | 0.03 | 0 | auto/W/51 | 1/1 | 0/0 | 25.6 | Lv 38            -> 1 | 0.03 | 0 | auto/W/51 | 1/1 | 0/0 | 25.6 | Lv 38
39  5 | 4.95 | 4 | auto/L/45 | 0/3 | 1/2 | 23.1 | Lv 38            -> 5 | 4.95 | 4 | auto/L/45 | 0/3 | 1/2 | 23.1 | Lv 38
40  1 | 0.04 | 0 | auto/W/51 | 1/1 | 0/0 | 25.5 | Lv 41            -> 1 | 0.04 | 0 | auto/W/51 | 1/1 | 0/0 | 25.5 | Lv 41
   batch_out_p18c  reached 10 attempted 10 | losses n=22 bossHP left q25/50/75 0.29/0.42/0.44 | <=25% 5 | summoned 19 | dur med 89s | charge kills/loss 2.41 | boss hits/loss 8.1 | wins n=10 survivors med 4 partyHP med 95%
   batch_out_p18x  reached 10 attempted 10 | losses n=22 bossHP left q25/50/75 0.29/0.42/0.44 | <=25% 5 | summoned 19 | dur med 89s | charge kills/loss 2.41 | boss hits/loss 8.1 | wins n=10 survivors med 4 partyHP med 95%

== light  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
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
   batch_out_p18c  reached 10 attempted 10 | losses n=7 bossHP left q25/50/75 0.35/0.56/0.57 | <=25% 1 | summoned 7 | dur med 62s | charge kills/loss 2.29 | boss hits/loss 6.3 | wins n=10 survivors med 4 partyHP med 96%
   batch_out_p18x  reached 10 attempted 10 | losses n=7 bossHP left q25/50/75 0.35/0.56/0.57 | <=25% 1 | summoned 7 | dur med 62s | charge kills/loss 2.29 | boss hits/loss 6.3 | wins n=10 survivors med 4 partyHP med 96%

== light  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
31  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 44.1 | Lv 59          -> 1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 45.1 | Lv 59
32  1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 44.0 | Lv 60          -> 1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 44.0 | Lv 60
33  1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 45.1 | Lv 60          -> 1 | 0.05 | 0 | auto/W/70 | 1/1 | 0/0 | 44.1 | Lv 60
34  entered, no boss attempt | Lv 61                               -> 1 | 0.02 | 0 | active/W/69 | 0/0 | 1/1 | 45.1 | Lv 61
35  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 42.0 | Lv 60          -> 1 | 0.04 | 0 | auto/W/70 | 1/1 | 0/0 | 41.8 | Lv 60
36  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 44.1 | Lv 57          -> 1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 44.1 | Lv 57
37  2 | 0.99 | 1 | auto/L/71 | 0/1 | 1/1 | 46.1 | Lv 61            -> 1 | 0.05 | 0 | auto/W/71 | 1/1 | 0/0 | 45.1 | Lv 61
38  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 46.1 | Lv 58          -> 1 | 0.05 | 0 | active/W/69 | 0/0 | 1/1 | 44.1 | Lv 58
39  1 | 0.04 | 0 | auto/W/72 | 1/1 | 0/0 | 42.7 | Lv 61            -> 1 | 0.02 | 0 | active/W/71 | 0/0 | 1/1 | 42.1 | Lv 61
40  null | - | 1 | active/L/70 | 0/0 | 0/1 | - | Lv 60             -> 2 | 2.95 | 1 | active/L/68 | 0/0 | 1/2 | 47.0 | Lv 60
   batch_out_p18c  reached 10 attempted 9 | losses n=2 bossHP left q25/50/75 0.64/0.64/0.64 | <=25% 0 | summoned 2 | dur med 56s | charge kills/loss 1.00 | boss hits/loss 5.0 | wins n=8 survivors med 4 partyHP med 100%
   batch_out_p18x  reached 10 attempted 10 | losses n=1 bossHP left q25/50/75 0.59/0.59/0.59 | <=25% 0 | summoned 1 | dur med 60s | charge kills/loss 1.00 | boss hits/loss 4.0 | wins n=10 survivors med 4 partyHP med 100%

== light  Ashen Keep  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
31  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 71
32  entered, no boss attempt | Lv 71                               -> entered, no boss attempt | Lv 71
33  entered, no boss attempt | Lv 71                               -> entered, no boss attempt | Lv 70
34  not reached | Lv -                                             -> entered, no boss attempt | Lv 69
35  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 70
36  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 70
37  entered, no boss attempt | Lv 72                               -> entered, no boss attempt | Lv 71
38  entered, no boss attempt | Lv 70                               -> entered, no boss attempt | Lv 69
39  entered, no boss attempt | Lv 72                               -> entered, no boss attempt | Lv 71
40  not reached | Lv -                                             -> entered, no boss attempt | Lv 70
   batch_out_p18c  reached 8 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%
   batch_out_p18x  reached 10 attempted 0 | losses n=0 bossHP left q25/50/75 -/-/- | <=25% 0 | summoned 0 | dur med -s | charge kills/loss 0.00 | boss hits/loss 0.0 | wins n=0 survivors med - partyHP med 0%

== light  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  4 / 5 -> 4 / 5   paired +0 010 -0
   @36h  6 / 6 -> 6 / 6   paired +0 010 -0
   @48h  7 / 7 -> 7 / 7   paired +2 08 -0
   total defeats med 634 -> 668   training h med 26.2 -> 26.1

== casual  Emberwaste  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
31  1 | 0.03 | 0 | active/W/41 | 0/0 | 1/1 | 15.2 | Lv 37          -> 1 | 0.03 | 0 | active/W/41 | 0/0 | 1/1 | 15.2 | Lv 37
32  2 | 1.97 | 1 | active/L/42 | 0/0 | 1/2 | 19.1 | Lv 37          -> 2 | 1.97 | 1 | active/L/42 | 0/0 | 1/2 | 19.1 | Lv 37
33  2 | 1.01 | 1 | active/L/39 | 0/0 | 1/2 | 15.1 | Lv 34          -> 2 | 1.01 | 1 | active/L/39 | 0/0 | 1/2 | 15.1 | Lv 34
34  1 | 0.02 | 0 | active/W/45 | 0/0 | 1/1 | 18.1 | Lv 36          -> 1 | 0.02 | 0 | active/W/45 | 0/0 | 1/1 | 18.1 | Lv 36
35  1 | 0.03 | 0 | active/W/41 | 0/0 | 1/1 | 15.1 | Lv 35          -> 1 | 0.03 | 0 | active/W/41 | 0/0 | 1/1 | 15.1 | Lv 35
36  2 | 2.95 | 1 | active/L/41 | 0/0 | 1/2 | 18.1 | Lv 37          -> 2 | 2.95 | 1 | active/L/41 | 0/0 | 1/2 | 18.1 | Lv 37
37  1 | 0.02 | 0 | active/W/43 | 0/0 | 1/1 | 17.1 | Lv 33          -> 1 | 0.02 | 0 | active/W/43 | 0/0 | 1/1 | 17.1 | Lv 33
38  2 | 0.97 | 1 | auto/L/42 | 0/1 | 1/1 | 16.1 | Lv 35            -> 2 | 0.97 | 1 | auto/L/42 | 0/1 | 1/1 | 16.1 | Lv 35
39  1 | 0.02 | 0 | active/W/42 | 0/0 | 1/1 | 15.1 | Lv 34          -> 1 | 0.02 | 0 | active/W/42 | 0/0 | 1/1 | 15.1 | Lv 34
40  1 | 0.02 | 0 | active/W/45 | 0/0 | 1/1 | 18.1 | Lv 37          -> 1 | 0.02 | 0 | active/W/45 | 0/0 | 1/1 | 18.1 | Lv 37
   batch_out_p18c  reached 10 attempted 10 | losses n=4 bossHP left q25/50/75 0.08/0.18/0.44 | <=25% 2 | summoned 3 | dur med 73s | charge kills/loss 1.75 | boss hits/loss 6.0 | wins n=10 survivors med 4 partyHP med 83%
   batch_out_p18x  reached 10 attempted 10 | losses n=4 bossHP left q25/50/75 0.08/0.18/0.44 | <=25% 2 | summoned 3 | dur med 73s | charge kills/loss 1.75 | boss hits/loss 6.0 | wins n=10 survivors med 4 partyHP med 83%

== casual  Amberfall Woods  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
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
   batch_out_p18c  reached 10 attempted 10 | losses n=1 bossHP left q25/50/75 0.48/0.48/0.48 | <=25% 0 | summoned 1 | dur med 64s | charge kills/loss 3.00 | boss hits/loss 6.0 | wins n=10 survivors med 4 partyHP med 95%
   batch_out_p18x  reached 10 attempted 10 | losses n=1 bossHP left q25/50/75 0.48/0.48/0.48 | <=25% 0 | summoned 1 | dur med 64s | charge kills/loss 3.00 | boss hits/loss 6.0 | wins n=10 survivors med 4 partyHP med 95%

== casual  Ashen Approach  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
31  2 | 6.85 | 1 | auto/L/64 | 0/1 | 1/1 | 42.1 | Lv 54            -> 2 | 5.34 | 1 | auto/L/64 | 1/2 | 0/0 | 40.6 | Lv 54
32  2 | 6.91 | 1 | auto/L/64 | 0/1 | 1/1 | 45.1 | Lv 55            -> 2 | 5.92 | 1 | auto/L/64 | 0/1 | 1/1 | 44.1 | Lv 55
33  2 | 0.24 | 1 | auto/L/73 | 0/1 | 1/1 | 44.1 | Lv 56            -> 1 | 0.05 | 0 | auto/W/73 | 1/1 | 0/0 | 43.9 | Lv 56
34  1 | 0.02 | 0 | active/W/72 | 0/0 | 1/1 | 42.1 | Lv 61          -> 1 | 0.02 | 0 | active/W/72 | 0/0 | 1/1 | 42.1 | Lv 61
35  1 | 0.02 | 0 | active/W/70 | 0/0 | 1/1 | 41.0 | Lv 49          -> 1 | 0.05 | 0 | auto/W/67 | 1/1 | 0/0 | 37.9 | Lv 49
36  2 | 3.50 | 1 | auto/L/72 | 0/1 | 1/1 | 46.0 | Lv 61            -> 1 | 0.05 | 0 | auto/W/72 | 1/1 | 0/0 | 42.6 | Lv 61
37  2 | 0.40 | 1 | auto/L/69 | 0/1 | 1/1 | 39.1 | Lv 49            -> 1 | 0.01 | 0 | active/W/69 | 0/0 | 1/1 | 39.0 | Lv 49
38  4 | 4.97 | 3 | active/L/62 | 0/1 | 1/3 | 35.1 | Lv 57          -> 2 | 3.00 | 1 | active/L/62 | 0/0 | 1/2 | 33.2 | Lv 57
39  5 | 9.91 | 4 | active/L/63 | 0/3 | 1/2 | 43.1 | Lv 54          -> 2 | 0.67 | 1 | auto/L/72 | 0/1 | 1/1 | 41.0 | Lv 54
40  3 | 6.89 | 2 | active/L/66 | 0/1 | 1/2 | 45.0 | Lv 50          -> 2 | 5.88 | 1 | active/L/66 | 0/0 | 1/2 | 44.0 | Lv 50
   batch_out_p18c  reached 10 attempted 10 | losses n=14 bossHP left q25/50/75 0.62/0.64/0.79 | <=25% 1 | summoned 9 | dur med 51s | charge kills/loss 1.21 | boss hits/loss 4.0 | wins n=10 survivors med 4 partyHP med 100%
   batch_out_p18x  reached 10 attempted 10 | losses n=5 bossHP left q25/50/75 0.61/0.66/0.67 | <=25% 0 | summoned 5 | dur med 64s | charge kills/loss 1.20 | boss hits/loss 4.8 | wins n=10 survivors med 4 partyHP med 100%

== casual  Ashen Keep  seed: attempts | stall h | streak | first attempt window/result/Lv | Auto-Cast w/a | active w/a | zone clear h | Lv entering   (batch_out_p18c -> batch_out_p18x)
31  entered, no boss attempt | Lv 71                               -> entered, no boss attempt | Lv 70
32  entered, no boss attempt | Lv 71                               -> entered, no boss attempt | Lv 70
33  entered, no boss attempt | Lv 73                               -> entered, no boss attempt | Lv 73
34  null | - | 1 | active/L/74 | 0/0 | 0/1 | - | Lv 72             -> null | - | 1 | active/L/74 | 0/0 | 0/1 | - | Lv 72
35  null | - | 1 | active/L/72 | 0/0 | 0/1 | - | Lv 70             -> null | - | 1 | active/L/69 | 0/0 | 0/1 | - | Lv 67
36  entered, no boss attempt | Lv 75                               -> entered, no boss attempt | Lv 72
37  entered, no boss attempt | Lv 69                               -> null | - | 2 | active/L/71 | 0/0 | 0/2 | - | Lv 69
38  null | - | 3 | active/L/71 | 0/0 | 0/3 | - | Lv 68             -> entered, no boss attempt | Lv 66
39  null | - | 2 | active/L/75 | 0/0 | 0/2 | - | Lv 74             -> null | - | 3 | active/L/73 | 0/0 | 0/3 | - | Lv 72
40  entered, no boss attempt | Lv 73                               -> entered, no boss attempt | Lv 72
   batch_out_p18c  reached 10 attempted 4 | losses n=7 bossHP left q25/50/75 0.85/0.87/0.87 | <=25% 0 | summoned 0 | dur med 15s | charge kills/loss 0.00 | boss hits/loss 5.4 | wins n=0 survivors med - partyHP med 0%
   batch_out_p18x  reached 10 attempted 4 | losses n=7 bossHP left q25/50/75 0.81/0.87/0.88 | <=25% 0 | summoned 0 | dur med 16s | charge kills/loss 0.00 | boss hits/loss 5.6 | wins n=0 survivors med - partyHP med 0%

== casual  zones cleared at horizons (med / P90) and paired direction; total defeats; training hours
   @24h  5 / 6 -> 5 / 6   paired +0 010 -0
   @36h  6 / 6 -> 6 / 6   paired +0 010 -0
   @48h  7 / 7 -> 7 / 7   paired +0 010 -0
   total defeats med 880 -> 884   training h med 27.4 -> 26.5

## Whole Road (training, dead time, upstream bosses, rewalk by zone, hordes, horizons)
-- AUTO TRAINING (24h)   med / P90   control -> candidate                                                                                                                                                                                        
triggers                                                                                                                       38 / 42 -> 37 / 41 (-3%)              42 / 47 -> 42 / 47 (0%)               47 / 58 -> 46 / 55 (-2%)              
completed returns                                                                                                              31 / 36 -> 30 / 34 (-3%)              35 / 38 -> 35 / 38 (0%)               39 / 47 -> 38 / 44 (-3%)              
cancelled (build change)                                                                                                       6 / 9 -> 6 / 9 (0%)                   8 / 9 -> 8 / 9 (0%)                   8 / 12 -> 8 / 12 (0%)                 
training hours                                                                                                                 23.3 / 26.6 -> 23.1 / 24.7 (-1%)      26.2 / 28.9 -> 26.1 / 28.4 (0%)       27.4 / 32 -> 26.5 / 31.2 (-3%)        
training share of 24h %                                                                                                        97 / 111 -> 96 / 103 (-1%)            109 / 120 -> 109 / 118 (0%)           114 / 133 -> 110 / 130 (-3%)          
-- DEAD TIME outside training                                                                                                                                                                                                                    
ordinary defeats outside training                                                                                              416 / 502 -> 438 / 539 (+5%)          447 / 575 -> 475 / 587 (+6%)          643 / 1046 -> 643 / 1238 (0%)         
rewalk fights (ordinary defeats)                                                                                               1466 / 1750 -> 1533 / 1674 (+5%)      1181 / 1356 -> 1131 / 1358 (-4%)      955 / 1203 -> 949 / 1211 (-1%)        
rewalk fights (boss losses)                                                                                                    81 / 162 -> 72 / 126 (-11%)           54 / 117 -> 54 / 108 (0%)             27 / 108 -> 27 / 63 (0%)              
rewalk hours equiv (ordinary)                                                                                                  14.05 / 16.19 -> 14.66 / 15.35 (+4%)  10.93 / 12.69 -> 10.68 / 12.69 (-2%)  8.47 / 10.93 -> 8.12 / 11.17 (-4%)    
rewalk hours equiv (boss)                                                                                                      0.78 / 1.54 -> 0.66 / 1.19 (-15%)     0.5 / 1.12 -> 0.5 / 1.03 (0%)         0.25 / 0.97 -> 0.26 / 0.58 (+2%)      
total defeats in 24h                                                                                                           559 / 660 -> 569 / 700 (+2%)          634 / 734 -> 668 / 753 (+5%)          880 / 1260 -> 884 / 1423 (+0%)        
-- STILLWATER                                                                                                                                                                                                                                    
first-try clear (mean)                                                                                                         40% -> 40% (0%)                       20% -> 20% (0%)                       30% -> 30% (0%)                       
attempts to clear                                                                                                              2 / 5 -> 2 / 5 (0%)                   2 / 4 -> 2 / 4 (0%)                   2 / 4 -> 2 / 4 (0%)                   
stall h                                                                                                                        0.11 / 1.06 -> 0.11 / 1.06 (0%)       0.52 / 0.86 -> 0.52 / 0.86 (0%)       0.38 / 0.88 -> 0.38 / 0.88 (0%)       
zone clear h                                                                                                                   2.79 / 3.43 -> 2.79 / 3.43 (0%)       2.83 / 3.09 -> 2.83 / 3.09 (0%)       2.86 / 3.43 -> 2.86 / 3.43 (0%)       
Lv at first try                                                                                                                16 / 18 -> 16 / 18 (0%)               15 / 17 -> 15 / 17 (0%)               16 / 18 -> 16 / 18 (0%)               
-- REWALK BY ZONE (ordinary defeats outside training): fights | hours in zone (non-training) | rewalk fights per exposure hour                                                                                                                   
Stillwater Lagoon: ordinary rewalk fights                                                                                      132 / 184 -> 132 / 184 (0%)           138 / 178 -> 138 / 178 (0%)           130 / 206 -> 130 / 206 (0%)           
Stillwater Lagoon: ordinary defeats                                                                                            40 / 46 -> 40 / 46 (0%)               40 / 46 -> 40 / 46 (0%)               43 / 52 -> 43 / 52 (0%)               
Stillwater Lagoon: hours in zone (non-training)                                                                                2.14 / 2.91 -> 2.14 / 2.91 (0%)       2.27 / 2.41 -> 2.27 / 2.41 (0%)       2.05 / 2.87 -> 2.05 / 2.87 (0%)       
Stillwater Lagoon: rewalk fights per exposure hour                                                                             60.7 / 75.7 -> 60.7 / 75.7 (0%)       60.4 / 74 -> 60.4 / 74 (0%)           62.8 / 76.8 -> 62.8 / 76.8 (0%)       
Stillwater Lagoon: rewalk hours per exposure hour                                                                              0.58 / 0.72 -> 0.58 / 0.73 (+0%)      0.56 / 0.7 -> 0.57 / 0.7 (+1%)        0.55 / 0.72 -> 0.56 / 0.73 (+1%)      
Thornwood: ordinary rewalk fights                                                                                              223 / 311 -> 223 / 311 (0%)           169 / 276 -> 169 / 276 (0%)           134 / 228 -> 134 / 228 (0%)           
Thornwood: ordinary defeats                                                                                                    68 / 89 -> 68 / 89 (0%)               64 / 84 -> 64 / 84 (0%)               51 / 64 -> 51 / 64 (0%)               
Thornwood: hours in zone (non-training)                                                                                        3.27 / 4.4 -> 3.27 / 4.4 (0%)         2.81 / 3.86 -> 2.81 / 3.86 (0%)       2.27 / 3.09 -> 2.27 / 3.09 (0%)       
Thornwood: rewalk fights per exposure hour                                                                                     68.1 / 75.9 -> 68.1 / 75.9 (0%)       64.5 / 75.3 -> 64.5 / 75.3 (0%)       59.5 / 79.1 -> 59.5 / 79.1 (0%)       
Thornwood: rewalk hours per exposure hour                                                                                      0.65 / 0.71 -> 0.65 / 0.72 (+0%)      0.6 / 0.69 -> 0.59 / 0.69 (-1%)       0.53 / 0.72 -> 0.53 / 0.73 (0%)       
Ironvein Caverns: ordinary rewalk fights                                                                                       250 / 314 -> 250 / 314 (0%)           140 / 251 -> 140 / 251 (0%)           87 / 164 -> 87 / 164 (0%)             
Ironvein Caverns: ordinary defeats                                                                                             57 / 74 -> 57 / 74 (0%)               50 / 72 -> 50 / 72 (0%)               39 / 49 -> 39 / 49 (0%)               
Ironvein Caverns: hours in zone (non-training)                                                                                 3.83 / 5.2 -> 3.83 / 5.2 (0%)         2.76 / 4.43 -> 2.76 / 4.43 (0%)       1.87 / 2.54 -> 1.87 / 2.54 (0%)       
Ironvein Caverns: rewalk fights per exposure hour                                                                              60.3 / 66.7 -> 60.3 / 66.7 (0%)       52.2 / 61.7 -> 52.2 / 61.7 (0%)       49.7 / 64.5 -> 49.7 / 64.5 (0%)       
Ironvein Caverns: rewalk hours per exposure hour                                                                               0.58 / 0.62 -> 0.58 / 0.63 (+1%)      0.5 / 0.56 -> 0.5 / 0.56 (+0%)        0.43 / 0.59 -> 0.43 / 0.59 (+2%)      
Emberwaste: ordinary rewalk fights                                                                                             289 / 517 -> 289 / 517 (0%)           223 / 285 -> 223 / 285 (0%)           107 / 203 -> 107 / 203 (0%)           
Emberwaste: ordinary defeats                                                                                                   83 / 112 -> 83 / 112 (0%)             81 / 93 -> 81 / 93 (0%)               49 / 72 -> 49 / 72 (0%)               
Emberwaste: hours in zone (non-training)                                                                                       4.73 / 7.05 -> 4.73 / 7.05 (0%)       4.2 / 4.74 -> 4.2 / 4.74 (0%)         2.06 / 2.92 -> 2.06 / 2.92 (0%)       
Emberwaste: rewalk fights per exposure hour                                                                                    63.9 / 73.3 -> 63.9 / 73.3 (0%)       57.5 / 66.2 -> 57.5 / 66.2 (0%)       50.4 / 69.4 -> 50.4 / 69.4 (0%)       
Emberwaste: rewalk hours per exposure hour                                                                                     0.62 / 0.69 -> 0.63 / 0.69 (+0%)      0.54 / 0.63 -> 0.54 / 0.63 (+1%)      0.45 / 0.63 -> 0.46 / 0.64 (+2%)      
Amberfall Woods: ordinary rewalk fights                                                                                        220 / 366 -> 220 / 366 (0%)           137 / 157 -> 137 / 157 (0%)           125 / 206 -> 125 / 206 (0%)           
Amberfall Woods: ordinary defeats                                                                                              65 / 94 -> 65 / 94 (0%)               51 / 64 -> 51 / 64 (0%)               82 / 102 -> 82 / 102 (0%)             
Amberfall Woods: hours in zone (non-training)                                                                                  3.59 / 5.7 -> 3.59 / 5.7 (0%)         2.3 / 2.68 -> 2.3 / 2.68 (0%)         2.35 / 3.58 -> 2.35 / 3.58 (0%)       
Amberfall Woods: rewalk fights per exposure hour                                                                               61.8 / 69.1 -> 61.8 / 69.1 (0%)       53.7 / 64.8 -> 53.7 / 64.8 (0%)       60.1 / 70.4 -> 60.1 / 70.4 (0%)       
Amberfall Woods: rewalk hours per exposure hour                                                                                0.59 / 0.62 -> 0.59 / 0.63 (0%)       0.51 / 0.59 -> 0.52 / 0.59 (+2%)      0.51 / 0.61 -> 0.51 / 0.61 (0%)       
Ashen Approach: ordinary rewalk fights                                                                                         256 / 440 -> 218 / 339 (-15%)         152 / 233 -> 143 / 181 (-6%)          166 / 247 -> 128 / 241 (-23%)         
Ashen Approach: ordinary defeats                                                                                               69 / 106 -> 64 / 98 (-7%)             62 / 76 -> 56 / 73 (-10%)             115 / 121 -> 94 / 126 (-18%)          
Ashen Approach: hours in zone (non-training)                                                                                   4.44 / 7.62 -> 3.89 / 5.87 (-12%)     3.02 / 4.12 -> 2.97 / 3.4 (-1%)       3.82 / 4.73 -> 3.62 / 4.62 (-5%)      
Ashen Approach: rewalk fights per exposure hour                                                                                53.5 / 64 -> 56.1 / 64.4 (+5%)        51.3 / 56.5 -> 47.7 / 53.5 (-7%)      46.1 / 52.2 -> 48.8 / 61 (+6%)        
Ashen Approach: rewalk hours per exposure hour                                                                                 0.51 / 0.61 -> 0.54 / 0.61 (+5%)      0.47 / 0.54 -> 0.45 / 0.5 (-5%)       0.42 / 0.47 -> 0.43 / 0.56 (+2%)      
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
Ashen Approach first-try %                                                                                                     0% -> 100%                            88% -> 90% (+2%)                      20% -> 50% (+150%)                    
Ashen Approach attempts                                                                                                        3 / 4 -> 1 / 1 (-67%)                 1 / 2 -> 1 / 2 (0%)                   2 / 5 -> 1 / 2 (-50%)                 
Ashen Approach stall h                                                                                                         3.11 / 4.5 -> 0.05 / 0.05 (-98%)      0.02 / 0.99 -> 0.02 / 2.95 (0%)       3.5 / 9.91 -> 0.05 / 5.92 (-99%)      
-- HORDES / CATACOMBS / DAMAGE                                                                                                                                                                                                                   
hordes fought (manual)                                                                                                         4 / 5 -> 4 / 5 (0%)                   4 / 5 -> 5 / 5 (+25%)                 5 / 5 -> 5 / 5 (0%)                   
hordes repelled                                                                                                                4 / 5 -> 4 / 5 (0%)                   4 / 5 -> 5 / 5 (+25%)                 5 / 5 -> 5 / 5 (0%)                   
hordes lost                                                                                                                    1 / 3 -> 1 / 3 (0%)                   0 / 2 -> 0 / 1                        0 / 1 -> 0 / 1                        
catacomb best floor                                                                                                            3 / 5 -> 3 / 5 (0%)                   4 / 5 -> 4 / 5 (0%)                   3 / 5 -> 3 / 5 (0%)                   
catacomb runs                                                                                                                  3 / 3 -> 3 / 3 (0%)                   3 / 3 -> 3 / 3 (0%)                   3 / 3 -> 3 / 3 (0%)                   
ability casts / h                                                                                                              539 / 549 -> 537 / 549 (0%)           554 / 568 -> 555 / 566 (+0%)          580 / 601 -> 578 / 602 (0%)           
dmg share basic %                                                                                                              45 / 47 -> 45 / 47 (0%)               42 / 43 -> 42 / 43 (0%)               36 / 38 -> 36 / 37 (0%)               
dmg share ability %                                                                                                            55 / 57 -> 55 / 57 (+0%)              55 / 57 -> 55 / 56 (+0%)              56 / 60 -> 56 / 59 (-1%)              
dmg share tap %                                                                                                                0 / 0 -> 0 / 0                        2 / 2 -> 2 / 2 (0%)                   6 / 6 -> 6 / 6 (0%)                   
dmg share surge %                                                                                                              0 / 0 -> 0 / 0                        1 / 1 -> 1 / 1 (0%)                   3 / 3 -> 3 / 3 (0%)                   
-- EARLY ROAD CLEAR TIMES (h)                                                                                                                                                                                                                    
Stillwater Lagoon                                                                                                              2.79 / 3.43 -> 2.79 / 3.43 (0%)       2.83 / 3.09 -> 2.83 / 3.09 (0%)       2.86 / 3.43 -> 2.86 / 3.43 (0%)       
Thornwood                                                                                                                      7.89 / 8.61 -> 7.89 / 8.61 (0%)       7.89 / 9.07 -> 7.89 / 9.07 (0%)       6.92 / 7.09 -> 6.92 / 7.09 (0%)       
Ironvein Caverns                                                                                                               14.77 / 15.73 -> 14.77 / 15.73 (0%)   14.09 / 16.77 -> 14.09 / 16.77 (0%)   11.11 / 13.16 -> 11.11 / 13.16 (0%)   
Emberwaste                                                                                                                     24.69 / 26.99 -> 24.69 / 26.99 (0%)   24.1 / 26.08 -> 24.1 / 26.08 (0%)     16.14 / 19.1 -> 16.14 / 19.1 (0%)     
zones cleared @24h                                                                                                             6 / 7 -> 7 / 7 (+17%)                 7 / 7 -> 7 / 7 (0%)                   7 / 7 -> 7 / 7 (0%)                   
party Lv @24h                                                                                                                  72 / 74 -> 72 / 74 (0%)               72 / 75 -> 72 / 74 (0%)               74 / 76 -> 72 / 74 (-3%)              

## Whole-Road triage on the production build (the pass 18 control arm; candidate arm in tests/sim/p18_triage_x.txt)

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

## Scorecard against the pass 18 criteria
1. Idle median attempts 1-4, P90 <=8 (adequately reached): MET on the number (3 / 4 -> 1 / 1, 7 of 10 runs reach the boss in both arms), but by making the fight automatic, see 5.
2. Idle Auto-Cast no longer a low-single-digit wall: MET and overshot (3/24 = 13% -> 7/7 = 100%).
3. Light and casual median attempts <=3, P90 <=6: MET (light 1 / 2 -> 1 / 2; casual 2 / 5 -> 1 / 2).
4. Active-window win rates below 95% where >=10 attempts: light 7/8 -> 7/8 (n<10), casual 10/14 = 71% -> 6/8 = 75% (n<10). Reported, not decisive. In the harness (35-45 fights per cell) active-mode clears are idle 91%, light 100%, casual 100% at x0.85 versus 31% / 100% / 100% at x2.0.
5. The boss still produces losses across realistic profiles: NOT MET. Idle 0 losses in 7 attempts (control 21 in 24); light 1 loss in 11 attempts (control 2 in 10); casual 5 losses in 15 (control 14 in 24). Harness: idle Auto-Cast 100% clears, light 93%, casual 50%.
6. Charge remains meaningfully lethal: NOT MET. Charge kills per attempt 1.5 -> 0 (idle), 0.6 -> 0.5 (casual); harness 0.14 kills per hit pooled (2.6 hits per fight land, 0.4 kill) versus 0.87 per hit at x2.0. Wins end at 100% party HP in every profile (control idle 83%).
7. Sand Tyrant, Hunter King and everything upstream identical between arms: MET (every row).
8. No adequately sampled downstream median clear time worse than +10% / P90 +15%: MET (Ashen Approach clear -2% idle, 0% light, -2% casual; Ashen Keep uncleared in both arms; no other zone downstream).
9. No profile regresses in median zones cleared at 24h, 36h, 48h: MET (idle 4/6/6 -> 4/6/7 with 48h paired +4 0x6 -0; light 4/6/7 -> 4/6/7, +2 at 48h; casual 5/6/7 -> 5/6/7, all flat).
10. Total defeats within +10%: MET (idle +2%, light +5%, casual 0%).
11. No material Auto Training, horde, catacomb, telemetry or mechanical regression: MET (training hours -1% / 0% / -3%, triggers -3% / 0% / -2%, hordes and catacombs identical or +1 fought for light).

## What the data say about the rule
The parity target was hit: front-hero ordinary hits to defeat 2.3 for idle and light (from 0.9), 1.9 for casual (from 0.8), charge 122% of front-hero HP (from 298%), the same figures that made the Warlord, Sand Tyrant and Hunter King contested. The fight is nevertheless automatic at Lv 70 because the term the rule ignores has grown: the party's sustain and DPS against a slow boss (speed 7, 7x HP). At x0.85 the Grave Knight lands 2.4-2.6 charges per fight and 10 ordinary hits and still kills nobody, because the damage arrives slowly enough to be healed and shielded through, and the raised units (2.0 per fight for idle at x0.85, from 1.4 at x2.0, since the fight lasts longer) die to the party's AoE without landing. At the Warlord (Lv 38) the same hits-to-defeat left no time to heal. The rule therefore transfers as a diagnostic (it correctly says the boss's damage per action is out of line with hero durability) but not as a value-setter past Amberfall; the missing term is boss damage per second relative to party recovery, not damage per hit relative to HP.
Casual is the exception that proves it: arriving at Lv 64-67 with 3859 HP heroes, casual sees the same boss as contested (Auto-Cast 4/7 on the road, 50% in the harness, first-try 5/10, one 5.9h stall seed), which is roughly what the review's bands ask for.

## Recommendation (proposal only)
1. Reject x0.85; keep Grave Knight production ATK x2.0 for now. Do not lock any Grave Knight value from this pass.
2. The reviewer said this is the final per-boss extension and that the next question is late-Road Auto Training cost. I agree with returning to whole-Road triage, and the production-build triage table above is the starting point (it is the pass 18 control arm, i.e. the current build, 48h). The open Grave Knight fact for that triage: on the production build the Ashen Approach boss costs idle 3 / 4 attempts and 3.1h stall in the 7 of 10 runs that reach it at 45h+, and casual 2 / 5 attempts, 3.5h stall (P90 9.9h) at 41h; light is fine (88% first-try). It is a real but late wall, and the training-cost item ranks alongside it (casual Ashen Approach burden 14.4h in the triage table, of which 9-10h is training triggered by the zone's ordinary fights, unchanged by any boss value).
3. If the reviewer nonetheless wants a Grave Knight value before moving on, the cheapest discriminating step is not another road batch: the harness replay reproduces the road outcomes at both endpoints (x2.0: Auto-Cast 0% harness vs 3/24 and 0/10 road; x0.85: 100% / 93% / 50% harness vs 7/7, 3/3, 4/7 road), so a one-process harness sweep over the control arrivals (x1.2, x1.4, x1.6) would show which value leaves the charge lethal and Auto-Cast at 20-40% before any road test. I have not run it, per the pass 18 rule against sizing arms; I flag it as the smallest next experiment if one is wanted. My prior from the two endpoints is that the contested value sits near x1.3-1.5, i.e. front hits-to-defeat about 1.4, not 2.3.
IMPLEMENTATION_RISK: none for the reject (no production change). The queued snapshot-prefix fix is simulator-only.

## Caveats
Idle reaches the Grave Knight in 7 of 10 runs and only after 44h, so its rows are n=7 at the edge of the horizon. Light and casual active-window counts are 8 attempts each. Hero HP/DEF come from per-arm snapshot folders (no cross-arm mixing this pass), with the Ashen Keep collision handled by zone-name filtering in lateboss.js and by a filtered folder for the harness. The compare tool's "(24h)" section labels report end-of-run (48h) values; the horizon rows in the per-seed section are computed at 24, 36 and 48h. Hits-to-defeat ignores the tree's front-line bonus, shields, wards and healing, which is exactly the term that made the rule overshoot here.
