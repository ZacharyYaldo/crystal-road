STATUS: READY_FOR_REVIEW
PASS_ID: PASS_7_VALIDATION
BASED_ON_REVIEW_PASS: PASS_7_VALIDATION
BUILD: 20260911-101854
HEAD_COMMIT_SHA: 6dc9968c77913d3c84b87a6b7229b523431d0db4

# Crystal Road AI Handoff - Pass 7 (Stillwater retune, variant G)

## Developer assessment of the review
AGREE. Confidence: HIGH that variant G was the right candidate to validate; MEDIUM that it is the final tune (see interpretation).
The review's premise (the Alpha body, not the summon, is the wall at natural arrival) matches the boss-harness evidence from the pass 7 sweep, reproduced below so the record is complete.

## Exact changes applied (commit 589b85e)
- BOSS_TUNE[1] (Stillwater Alpha): HP x0.75 -> x0.55, ATK x0.82 -> x0.70
- Alpha summon entry: one werewolf at 60% now spawns with HP x0.75, ATK x0.85 (new per-summon multiplier support, commit d240372)
- No other balance values changed.

## Locked systems preserved
1 werewolf at 60% | Howl at 30% | Auto Training logic, thresholds (10-fight window, evaluate from 8, 4 losses), +1 party-level target, min 3 fights, exploit protections, deeper fallback, boss-loss window reset, Keep pushing | boss retry cadence 9 | TAP_DAMAGE_MULT 0.22 | Greenhollow boss 0.75/0.80 | every other zone/boss value | promotions, XP curve, gear, Renown.

## Simulator configuration
VALIDATION tier: 20 paired seeds x 5 profiles (idle, light, casual, engaged, stress) x 24 simulated hours, --shatters 3, dt 0.1 s, production game logic (source/game.js) loaded headless; the game's own Auto Training does all training (bot-side retreat is off).
Command: node tests/sim/batch.js --seeds 20 --hours 24 --shatters 3 --profiles idle,light,casual,engaged,stress --workers 10 --tag p7v
100/100 runs completed, 0 errors. First-try clear is reported as the MEAN over seeds (it is a 0/100 per-seed value); everything else is P10 / median / P90.

## Pass 7 sweep that selected G (QUICK DIAGNOSTIC, boss harness, 27 real arrival snapshots x 100 fights per variant and mode)
WEREWOLF VARIANTS (Alpha unchanged at 0.75 / 0.82)   win% = first-try clear from real arrival snapshots (Lv 15-18)
                          idle              casual            engaged           bossHP at wipe, auto
                          active  auto      active  auto      active  auto
  A  wolf 1.00 / 1.00     11      5         3       0         5       0         56-59%
  B  wolf 0.85 / 0.90     24      13        6       0         4       0         49-59%
  C  wolf 0.75 / 0.85     29      19        10      0         12      1         39-59%
  D  wolf 0.65 / 0.80     36      18        8       0         13      2         34-58%

ALPHA BODY SWEEP (werewolf held at C, 0.75 / 0.85)
  E  alpha 0.65 / 0.75    52      39        19      4         20      20        35-56%
  F  alpha 0.60 / 0.72    68      45        30      8         35      31        34-54%
  G  alpha 0.55 / 0.70    78      58        36      19        34      38        28-55%

## Validation results (full production road, authoritative)
                                          idle P10/med/P90     light P10/med/P90    casual P10/med/P90   engaged P10/med/P90  stress P10/med/P90   
-- STILLWATER
first-try clear (mean over seeds)         50% (n20)            50% (n20)            30% (n20)            25% (n20)            5% (n20)             
attempts to clear                         1 / 1 / 4            1 / 1 / 3            1 / 2 / 4            1 / 2 / 5            2 / 3 / 5            
max real loss streak                      0 / 0 / 3            0 / 0 / 2            0 / 1 / 3            0 / 1 / 4            1 / 2 / 4            
stall h (total)                           0.02 / 0.03 / 0.97   0.01 / 0.02 / 0.92   0.01 / 0.3 / 0.91    0.02 / 0.49 / 0.93   0.11 / 0.31 / 0.65   
zone clear h                              2.4 / 2.88 / 3.38    2.48 / 2.97 / 3.06   2.01 / 2.81 / 3.12   2.2 / 2.58 / 3.03    1.73 / 1.97 / 2.24   
Lv at first try                           15 / 17 / 18         15 / 17 / 19         15 / 16 / 18         15 / 16 / 17         13 / 15 / 16         
Lv at clear (recruit joins, lowers avg)   14 / 15 / 16         15 / 15 / 16         14 / 15 / 16         14 / 15 / 16         14 / 15 / 15         
arrival party HP %                        62 / 81 / 100        37 / 77 / 100        51 / 73 / 98         51 / 72 / 96         54 / 78 / 91         
arrival weakest hero HP %                 25 / 60 / 100        24 / 43 / 100        30 / 37 / 95         24 / 30 / 89         30 / 53 / 81         
arrival avg ability charge                35 / 58 / 92         45 / 57 / 79         40 / 62 / 80         28 / 56 / 81         28 / 48 / 78         
arrival Surge                             100 / 100 / 100      20 / 100 / 100       10 / 100 / 100       8 / 75 / 100         8 / 25 / 90          
auto-trainings before first try           1 / 3 / 6            1 / 3 / 5            1 / 2 / 7            1 / 3 / 4            1 / 2 / 4            
auto-trainings for Stillwater (total)     2 / 3 / 6            2 / 3 / 5            1 / 2 / 7            1 / 3 / 4            1 / 2 / 5            
-- THORNWOOD (propagation only, untuned)
Lv entering zone                          14 / 15 / 16         15 / 15 / 16         14 / 15 / 16         14 / 15 / 16         14 / 15 / 15         
Lv at first boss try                      26 / 28 / 29         27 / 27 / 29         24 / 27 / 29         23 / 26 / 27         22 / 23 / 25         
first-try clear (mean over seeds)         50% (n20)            60% (n20)            70% (n20)            90% (n20)            100% (n20)           
attempts to clear                         1 / 1 / 3            1 / 1 / 3            1 / 1 / 2            1 / 1 / 2            1 / 1 / 1            
stall h                                   0.02 / 0.03 / 1.61   0.02 / 0.02 / 0.41   0.02 / 0.02 / 0.9    0.02 / 0.02 / 0.81   0.02 / 0.02 / 0.02   
zone clear h                              7.19 / 7.77 / 8.87   6.46 / 7.1 / 8.31    6.07 / 7.05 / 7.35   5.08 / 6.07 / 6.17   3.61 / 4.13 / 4.71   
auto-trainings for zone                   5 / 6 / 9            4 / 6 / 9            4 / 7 / 10           3 / 5 / 8            1 / 3 / 5            
-- IRONVEIN (propagation only, untuned)
Lv entering zone                          27 / 29 / 30         27 / 28 / 30         25 / 27 / 29         24 / 26 / 27         22 / 23 / 25         
Lv at first boss try                      37 / 38 / 40         35 / 36 / 39         34 / 35 / 37         33 / 34 / 37         28 / 29 / 31         
first-try clear (mean over seeds)         0% (n20)             10% (n20)            55% (n20)            100% (n20)           20% (n20)            
attempts to clear                         6 / 9 / 18           1 / 3 / 8            1 / 1 / 3            1 / 1 / 1            1 / 3 / 5            
stall h                                   1.25 / 2.53 / 4.24   0.02 / 1.12 / 3.01   0.02 / 0.02 / 2.05   0.02 / 0.02 / 0.02   0.03 / 0.48 / 0.97   
zone clear h                              15.66 / 16.35 / 17.4712.08 / 14.05 / 16.0510.11 / 11.15 / 13.179.11 / 10.1 / 11.19  5.81 / 6.41 / 7.13   
auto-trainings for zone                   4 / 6 / 7            5 / 6 / 8            4 / 5 / 8            4 / 5 / 7            0 / 1 / 3            
-- EMBERWASTE (propagation only, untuned)
Lv entering zone                          40 / 41 / 42         36 / 39 / 40         34 / 36 / 38         33 / 34 / 37         29 / 30 / 32         
Lv at first boss try                      47 / 49 / 50         44 / 46 / 50         41 / 44 / 45         38 / 40 / 43         35 / 37 / 38         
first-try clear (mean over seeds)         -                    42% (n12)            53% (n19)            25% (n20)            45% (n20)            
attempts to clear                         -                    1 / 2 / 3            1 / 1 / 4            1 / 2 / 3            1 / 2 / 4            
stall h                                   -                    0.02 / 0.97 / 1.99   0.02 / 0.02 / 6.95   0.02 / 1.02 / 1.96   0.03 / 0.16 / 1.15   
zone clear h                              -                    19.08 / 21.08 / 23.0715.17 / 18.11 / 22.1 13.12 / 14.16 / 16.178.6 / 9.46 / 10.17   
auto-trainings for zone                   6 / 8 / 10           6 / 9 / 11           5 / 8 / 13           3 / 4 / 6            1 / 2 / 4            
-- AMBERFALL (propagation only, untuned)
Lv entering zone                          -                    46 / 47 / 50         42 / 45 / 49         40 / 41 / 44         36 / 38 / 39         
Lv at first boss try                      -                    -                    47 / 49 / 51         45 / 48 / 51         41 / 43 / 45         
first-try clear (mean over seeds)         -                    -                    50% (n8)             50% (n20)            5% (n20)             
attempts to clear                         -                    -                    1 / 1 / 3            1 / 1 / 3            2 / 3 / 5            
stall h                                   -                    -                    0.02 / 0.03 / 2.01   0.02 / 0.03 / 4.06   0.16 / 0.72 / 1.57   
zone clear h                              -                    -                    20.13 / 22.14 / 23.1717.23 / 20.18 / 22.2 11.44 / 12.22 / 13.26
auto-trainings for zone                   0 / 0 / 0            0 / 1 / 5            1 / 5 / 9            5 / 8 / 10           1 / 2 / 2            
-- ASHEN APPROACH (propagation only, untuned)
Lv entering zone                          -                    -                    48 / 50 / 53         45 / 49 / 51         44 / 45 / 46         
Lv at first boss try                      -                    -                    -                    54 / 54 / 54         49 / 51 / 54         
first-try clear (mean over seeds)         -                    -                    -                    -                    50% (n20)            
attempts to clear                         -                    -                    -                    -                    1 / 1 / 3            
stall h                                   -                    -                    -                    -                    0.03 / 0.05 / 1.99   
zone clear h                              -                    -                    -                    -                    14.2 / 16.56 / 18.17 
auto-trainings for zone                   0 / 0 / 0            0 / 0 / 0            0 / 0 / 4            2 / 4 / 8            1 / 3 / 4            
-- PROGRESSION
first T1 h                                17.36 / 19.98 / 20.9314.68 / 16.09 / 18.4613.04 / 13.99 / 15.7811.91 / 13 / 13.7    8.66 / 9.47 / 10.65  
first legendary h                         -                    21.4 / 23.09 / 23.32 16.07 / 18.93 / 23.4 15.27 / 16.21 / 23.2 9.1 / 12.43 / 16.99  
first Shatter h (bot policy: none within 24h)-                    -                    -                    -                    -                    
zones cleared @24h                        4 / 4 / 4            4 / 5 / 5            5 / 5 / 6            6 / 6 / 6            7 / 7 / 7            
Ironvein throughput vs idle               1.00x                1.16x                1.47x                1.62x                2.55x                
-- AUTO TRAINING over 24h
triggers                                  20 / 25 / 28         24 / 26 / 29         26 / 30 / 34         27 / 31 / 35         9 / 13 / 16          
completed returns                         15 / 19 / 21         17 / 20 / 23         20 / 22 / 27         17 / 23 / 26         7 / 11 / 14          
cancelled by manual build change          5 / 5 / 8            3 / 6 / 8            5 / 7 / 8            5 / 7 / 9            1 / 2 / 4            
hours spent training                      8.1 / 9.8 / 11.3     10.1 / 10.9 / 12.3   11.8 / 12.6 / 14     11.9 / 13.3 / 14.2   2.2 / 3.2 / 4.3      
share of 24h spent training %             34 / 41 / 47         42 / 45 / 51         49 / 52 / 58         49 / 56 / 59         9 / 13 / 18          
levels earned while training              17.9 / 21.4 / 23.5   20.1 / 22.5 / 25.8   23 / 25.4 / 29.6     22.5 / 25.5 / 29.3   7.9 / 12.2 / 15.8    
  Stillwater: minutes per training (med)  3 / 6 / 8            1 / 6 / 9            2 / 6 / 8            2 / 6 / 8            1 / 5 / 7            
  Stillwater: win% after return (med)     70 / 80 / 90         70 / 80 / 90         60 / 80 / 90         60 / 70 / 90         60 / 80 / 90         
  Thornwood: minutes per training (med)   13 / 15 / 17         14 / 15 / 16         13 / 15 / 16         11 / 13 / 16         8 / 9 / 11           
  Thornwood: win% after return (med)      60 / 80 / 80         60 / 80 / 80         70 / 80 / 90         50 / 80 / 90         60 / 80 / 90         
  Ironvein: minutes per training (med)    27 / 34 / 39         24 / 29 / 35         22 / 27 / 29         20 / 23 / 25         14 / 17 / 18         
  Ironvein: win% after return (med)       70 / 80 / 80         70 / 80 / 90         50 / 80 / 100        70 / 80 / 100        80 / 90 / 100        
  Emberwaste: minutes per training (med)  26 / 41 / 46         28 / 40 / 45         30 / 36 / 44         34 / 41 / 43         19 / 20 / 22         
  Emberwaste: win% after return (med)     70 / 70 / 80         60 / 70 / 100        50 / 80 / 100        60 / 90 / 100        70 / 90 / 90         
  win% at trigger is 60% by construction (4 losses in the last 10)

## Bugs / measurement caveats
1. The first validation batch was INVALID and was discarded: the new arrival-state telemetry called a now() helper that exists only inside the game, so 30 of 100 runs crashed at the first boss attempt whenever a training return preceded it (a biased loss). Fixed in the bot (uses the sim clock), all 100 runs rerun; the table above is from the rerun only. Observation-only bug, no gameplay effect.
2. The boss harness starts fights at 0 ability charge with a fixed RNG stream; the production road is authoritative, and its Stillwater numbers came out close to the harness (casual 30% vs harness 19 auto / 36 active).
3. "first Shatter" is empty for all profiles: the bot's Shatter policy fires on a 3-hour progression stall, and Auto Training removes stalls. Bot-policy artifact, not a game change; Shatter timing needs a different bot trigger before it is comparable with earlier passes.
4. Stillwater "Lv at clear" reads below "Lv at first try" because the recruit who joins on the zone clear lowers the party average. Use the paired first-try level and the training telemetry for level reasoning.
5. The older bot-side rows named "TRAINING h" are dead and were dropped from the table; the AUTO-TRAIN rows are the game's own telemetry.
6. Pass 5b batch A had its first few runs on a build without the deeper-fallback rule; that batch is superseded by this one.

## Independent interpretation
- Stillwater meets every target in the review: casual 30% first-try (target 15-40), engaged 25% (20-45), idle 50% (40-70 acceptable), light 50%. Median attempts 1-2, P90 3-5, real loss streaks 0-1 median, stall 0.02-0.49 h. Stress is 5% and is the ceiling profile, not a target. Zone clear time is 2.6-3.0 h against 3.3-3.5 h before the retune. Players lose it sometimes and rarely twice.
- The fight now reaches its phases (losses at and after the summon are visible in the harness), and auto-trainings around Stillwater dropped from 4-5 to 2-3.
- Propagation: Thornwood arrival is unchanged at Lv 15 and its first-try rose to 50-90% with 1 attempt because parties arrive with fewer Stillwater re-walks; it is a relief boss. Ironvein is unchanged for casual/engaged (55-100% first-try) and is still a wall for idle (0% first-try, median 9 attempts, P90 18, 2.5 h stall) and light (10%, 3 attempts). Emberwaste and Amberfall sit at 25-53% first-try with 1-2 attempts for the profiles that reach them. None of these were tuned.
- Profile throughput is unchanged: light 1.16x, casual 1.47x, engaged 1.62x, stress 2.55x idle at Ironvein.
- The largest thing in this table is not Stillwater: Auto Training accounts for 41-56% of all simulated time for idle through engaged (25-31 triggers, 10-13 h of training in a 24 h day, 21-25 levels earned while training). It works exactly as specified, but at this frequency it is no longer a safety net; it is the Road's main leveling mechanism, and a real player would see the party leave the zone about once an hour. 5-7 trainings per run are also cancelled by the bot buying a talent or promotion mid-training (spec behavior).

## Proposed next step (proposal only, nothing applied)
Lock Stillwater at G. I do not propose the review's fallback of raising Alpha HP to 0.58/0.60: casual and engaged are inside target and idle is inside its acceptable band.
For the next pass, in priority order, for the balance reviewer to choose from:
1. Training frequency. The 41-56% time share says the trigger (4 losses in 10, i.e. a 60% win rate) fires on ordinary variance, not only on genuine walls. Candidate QUICK DIAGNOSTIC (10 seeds x idle/casual/engaged): 5 losses in 10, and/or a 20-fresh-fight cooldown after a return, measuring time share, zone clear times and boss first-try rates. One lever, no boss stats.
2. Ironvein for idle and light: zone entry Lv 29, first boss try at Lv 38 after 6 trainings, still 9 attempts. I would measure it again after (1), since training frequency moves arrival levels everywhere.
Implementation risk of (1): none beyond re-validation; the constants are isolated. Risk of tuning Ironvein now: it would be tuned against a training frequency we may be about to change.
