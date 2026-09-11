STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: COUNTERPROPOSAL
PASS_ID: PASS_8_AUTOTRAIN_THRESHOLD_DIAGNOSTIC
BASED_ON_REVIEW_PASS: PASS_8_AUTOTRAIN_THRESHOLD_DIAGNOSTIC
BASE_REVIEW_PASS: PASS_8_AUTOTRAIN_THRESHOLD_DIAGNOSTIC
BUILD: 20260911-110233
HEAD_COMMIT_SHA: b4582d619831f249873b547936e866ba740a156d

# Crystal Road AI Handoff - Pass 8 (Auto Training threshold diagnostic)

DEVELOPER_POSITION: PARTIAL
CONFIDENCE: HIGH that the 5-loss candidate fails the review's success criteria (measured, paired seeds). MEDIUM on the alternative hypothesis below (mechanically grounded, one diagnostic needed to confirm).

The authorized experiment was run exactly as specified: AT_LOSSES 4 (control) vs 5 (candidate), seeds 1-10, idle/casual/engaged, 24h, production Road logic, 30+30 runs, 0 errors. Nothing in production changed: AT_LOSSES remains 4. The only committed code is observation-only instrumentation (commit b4582d6): a 20-fight after-return window, retrigger timing, trigger context (zone progress, enemy level vs party level, window contents), and rewalk dead-time counters.

## Results (paired seeds, med / P90, control -> candidate, relative change of the median)
                                                      idle                                  casual                                engaged                               
-- AUTO TRAINING (24h)   med / P90   4-loss -> 5-loss                                                                                                                   
triggers                                              24 / 30 -> 18 / 24 (-25%)             30 / 34 -> 26 / 30 (-13%)             31 / 36 -> 28 / 32 (-10%)             
completed returns                                     18 / 23 -> 14 / 19 (-22%)             22 / 25 -> 18 / 21 (-18%)             22 / 26 -> 20 / 23 (-9%)              
cancelled (build change)                              5 / 8 -> 4 / 7 (-20%)                 6 / 9 -> 6 / 8 (0%)                   8 / 10 -> 7 / 9 (-12%)                
training hours                                        9.6 / 11.3 -> 7.5 / 9.6 (-21%)        12.5 / 13.3 -> 11.4 / 12.3 (-9%)      13.2 / 13.9 -> 12.1 / 14.1 (-8%)      
training share of 24h %                               40 / 47 -> 31 / 40 (-21%)             52 / 55 -> 47 / 51 (-9%)              55 / 58 -> 51 / 59 (-8%)              
levels earned training                                20.9 / 25.7 -> 15.2 / 20.8 (-27%)     25.6 / 29.1 -> 21.1 / 23.9 (-17%)     25.2 / 29.1 -> 23.8 / 27 (-6%)        
triggers for Stillwater Lagoon                        5 / 7 -> 3 / 5 (-40%)                 2 / 8 -> 1 / 3 (-50%)                 3 / 4 -> 1 / 2 (-67%)                 
triggers for Thornwood                                6 / 10 -> 6 / 8 (0%)                  7 / 10 -> 5 / 10 (-29%)               5 / 7 -> 4 / 8 (-20%)                 
triggers for Ironvein Caverns                         6 / 7 -> 4 / 7 (-33%)                 5 / 8 -> 5 / 8 (0%)                   5 / 9 -> 6 / 8 (+20%)                 
triggers for Emberwaste                               8 / 9 -> 6 / 8 (-25%)                 7 / 14 -> 7 / 12 (0%)                 4 / 8 -> 5 / 7 (+25%)                 
triggers for Amberfall Woods                          0 / 0 -> 0 / 0                        5 / 8 -> 6 / 9 (+20%)                 7 / 10 -> 7 / 9 (0%)                  
-- RETRIGGERS (same zone after a completed return)                                                                                                                      
retriggers within 10 fresh fights                     3 / 10 -> 3 / 5 (0%)                  7 / 13 -> 5 / 9 (-29%)                5 / 10 -> 5 / 10 (0%)                 
retriggers within 20 fresh fights                     8 / 13 -> 5 / 10 (-37%)               12 / 16 -> 9 / 14 (-25%)              11 / 15 -> 9 / 15 (-18%)              
share of triggers that are retriggers <=20 %          32 / 43 -> 27 / 42 (-15%)             39 / 55 -> 35 / 52 (-12%)             33 / 42 -> 31 / 47 (-7%)              
fresh fights to retrigger (med of run medians)        9 / 16 -> 10 / 13 (+11%)              9 / 12 -> 10 / 12 (+11%)              9 / 13 -> 10 / 11 (+11%)              
minutes to retrigger (med of run medians)             7 / 10 -> 8 / 9 (+6%)                 7 / 9 -> 8 / 9 (+16%)                 7 / 9 -> 8 / 10 (+13%)                
win% first 10 fights after return                     80 / 80 -> 70 / 80 (-12%)             80 / 90 -> 80 / 80 (0%)               90 / 100 -> 80 / 90 (-11%)            
win% first 20 fights after return                     80 / 85 -> 75 / 80 (-6%)              85 / 85 -> 75 / 85 (-12%)             85 / 90 -> 85 / 90 (0%)               
win% in window at trigger                             60 / 60 -> 50 / 50 (-17%)             60 / 60 -> 50 / 50 (-17%)             60 / 60 -> 50 / 50 (-17%)             
enemy Lv minus party Lv at trigger                    -6.8 / -5.5 -> -6.5 / -4 (+4%)        -6.3 / -4 -> -5.8 / -3.5 (+8%)        -4 / -3 -> -3.8 / -3 (+5%)            
zone progress % at trigger                            67 / 67 -> 67 / 67 (0%)               67 / 67 -> 67 / 67 (0%)               67 / 67 -> 67 / 67 (0%)               
-- DEAD TIME outside training                                                                                                                                           
ordinary defeats outside training                     245 / 284 -> 309 / 330 (+26%)         237 / 263 -> 269 / 317 (+14%)         229 / 257 -> 273 / 291 (+19%)         
rewalk fights (ordinary defeats)                      810 / 948 -> 901 / 1097 (+11%)        619 / 715 -> 649 / 754 (+5%)          500 / 738 -> 559 / 707 (+12%)         
rewalk fights (boss losses)                           90 / 207 -> 99 / 153 (+10%)           36 / 81 -> 27 / 45 (-25%)             27 / 72 -> 27 / 54 (0%)               
rewalk hours equiv (ordinary)                         7.4 / 8.87 -> 8.69 / 11.21 (+17%)     5.61 / 6.14 -> 6.17 / 7.16 (+10%)     4.32 / 6.27 -> 4.92 / 6.44 (+14%)     
rewalk hours equiv (boss)                             0.87 / 1.89 -> 1.01 / 1.54 (+16%)     0.31 / 0.68 -> 0.26 / 0.43 (-18%)     0.24 / 0.62 -> 0.23 / 0.49 (-1%)      
total defeats in 24h                                  314 / 365 -> 375 / 419 (+19%)         353 / 412 -> 401 / 486 (+14%)         413 / 457 -> 479 / 520 (+16%)         
-- STILLWATER                                                                                                                                                           
first-try clear (mean)                                50% -> 40% (-20%)                     20% -> 10% (-50%)                     30% -> 30% (0%)                       
attempts to clear                                     1 / 4 -> 2 / 4 (+100%)                2 / 4 -> 2 / 3 (0%)                   2 / 5 -> 2 / 4 (0%)                   
stall h                                               0.03 / 0.97 -> 0.2 / 0.83 (+567%)     0.5 / 0.93 -> 0.24 / 1.12 (-52%)      0.37 / 0.93 -> 0.11 / 0.65 (-70%)     
zone clear h                                          2.74 / 3.38 -> 3.01 / 3.34 (+10%)     2.77 / 3.13 -> 2.62 / 3.14 (-5%)      2.73 / 2.99 -> 2.23 / 2.84 (-18%)     
Lv at first try                                       17 / 18 -> 17 / 19 (0%)               16 / 18 -> 16 / 18 (0%)               16 / 18 -> 15 / 18 (-6%)              
-- IRONVEIN                                                                                                                                                             
first-try clear (mean)                                0% -> 0%                              40% -> 70% (+75%)                     100% -> 80% (-20%)                    
attempts to clear                                     7 / 18 -> 9 / 18 (+29%)               2 / 5 -> 1 / 2 (-50%)                 1 / 1 -> 1 / 3 (0%)                   
stall h                                               2.35 / 4.24 -> 3.27 / 4.75 (+39%)     0.87 / 2.84 -> 0.02 / 1.03 (-98%)     0.02 / 0.03 -> 0.02 / 1.91 (0%)       
zone clear h                                          16.06 / 18.17 -> 17.01 / 18.51 (+6%)  11.15 / 14 -> 11.14 / 13.11 (0%)      10.1 / 11.19 -> 10.15 / 11.24 (+0%)   
Lv entering zone                                      28 / 30 -> 29 / 29 (+4%)              27 / 30 -> 26 / 30 (-4%)              26 / 27 -> 25 / 27 (-4%)              
Lv at first try                                       38 / 40 -> 37 / 40 (-3%)              34 / 37 -> 34 / 38 (0%)               34 / 37 -> 33 / 36 (-3%)              
-- EARLY ROAD CLEAR TIMES (h)                                                                                                                                           
Stillwater Lagoon                                     2.74 / 3.38 -> 3.01 / 3.34 (+10%)     2.77 / 3.13 -> 2.62 / 3.14 (-5%)      2.73 / 2.99 -> 2.23 / 2.84 (-18%)     
Thornwood                                             7.57 / 8.79 -> 8.23 / 8.88 (+9%)      7.05 / 8.08 -> 6.12 / 8.37 (-13%)     6.07 / 6.09 -> 6.09 / 6.14 (+0%)      
Ironvein Caverns                                      16.06 / 18.17 -> 17.01 / 18.51 (+6%)  11.15 / 14 -> 11.14 / 13.11 (0%)      10.1 / 11.19 -> 10.15 / 11.24 (+0%)   
Emberwaste                                            - / - -> - / -                        17.13 / 23.11 -> 18.11 / 22.09 (+6%)  14.14 / 16.2 -> 14.21 / 16.22 (+0%)   
zones cleared @24h                                    4 / 4 -> 4 / 4 (0%)                   6 / 6 -> 5 / 6 (-17%)                 6 / 6 -> 6 / 6 (0%)                   
party Lv @24h                                         50 / 51 -> 48 / 49 (-4%)              52 / 54 -> 50 / 52 (-4%)              54 / 55 -> 53 / 54 (-2%)              

## Scorecard against the review's success criteria
- Median triggers down >=20% in >=2 of 3 profiles: NOT MET (idle -25%, casual -13%, engaged -10%).
- Same-zone retriggers within 20 fresh fights down >=30%: NOT MET (idle -37%, casual -25%, engaged -18%).
- Median zones cleared at 24h not declining: NOT MET for casual (6 -> 5); idle and engaged unchanged.
- Early-Road clear times not worse than +10% median / +15% P90: BORDERLINE (idle Stillwater +10%, Thornwood +9%, Ironvein +6%; casual and engaged flat or better).
- Stillwater within pass 7 bands, attempts <=3 / P90 <=5: attempts MET; first-try casual 10% (below the 15-40 band) and idle 40%, both from n=10, so noisy but in the wrong direction.
- Training time not replaced by dead time: NOT MET. Saved training vs added ordinary rewalk (hours, median): idle -2.1 / +1.3, casual -1.1 / +0.6, engaged -1.1 / +0.6. Ordinary defeats outside training rose 14-26%. About half of the saved training time became death-and-rewalk time, which is the review's stated design risk.

Two of the review's failure conditions apply (quick retriggers essentially unchanged for casual/engaged; training replaced by unproductive rewalking), so per its decision rules the threshold change is rejected and 4 losses stays.

## DISAGREEMENT
The primary hypothesis was that the 4-loss threshold "repeatedly classifies viable 70-80% win-rate play as dangerous" through ordinary variance. The new telemetry says the retriggers are structural, not variance:
- Retriggers arrive after a median 9-10 fresh fights and 7-8 minutes, in both arms. The threshold moved that by one fight.
- The win rate over the first 10 and 20 fights after a return is 80-90% (control), i.e. the returned party is genuinely fine for the first stretch and then hits the same wall again.
- At every trigger the party is 4-7 levels ABOVE the enemy level of the fight it just lost (median enemy Lv minus party Lv: -6.8 idle, -6.3 casual, -4.0 engaged) and still only winning 60%. The per-zone balance point for a comfortable win rate is roughly party level = enemy level + 7.
- The trigger context shows median zone progress of 67% in every cell; that is the checkpoint the party is rolled back to, measured after rollback, so it is not itself evidence of a step. What matters is what lies past it: enemy level in a zone is Z.lv + 0.3 x progress, so the last third of a 30-fight zone spans +6 to +9 enemy levels over the zone base. A training earns exactly +1 party level (measured 1.01 per training, and the target is locked), then returns the party to the same checkpoint to face the same three-level climb. One level cannot turn a 60% stretch into a 75% stretch when the stretch itself rises three levels, so the party trains again after about 10 fights. That is the retrigger loop, and it repeats until enough +1 trainings accumulate (idle needs about 6 per zone from Ironvein on).
- Raising the threshold does not change that arithmetic; it only lets the party die more before training, which is exactly what the dead-time rows show.

## EVIDENCE
Code: enemy level per fight `roadLv(Z, Z.lv + p*0.3)` (source/game.js, spawnEncounter); ordinary-defeat rollback to the checkpoint floor `Math.floor(prog/cs)*cs`; training target `partyProg() - startProg >= 1` with `AT_MIN_FIGHTS 3`; return goes to the same zone at the same prog. Telemetry: the RETRIGGERS and AT TRIGGER rows above, `autoTrain.log[].retrigger / enemyLv / lvBefore / window` in every run JSON under tests/sim/batch_out_p8c and batch_out_p8x, and tests/sim/p8_compare.txt.
Caveats: n=10 per cell, so single-profile first-try percentages move in 10-point steps; "rewalk hours" are fights lost to rollback times that run's mean seconds per encounter, an estimate, not measured wall time; the "zone progress at trigger" row is post-rollback and should be read as the checkpoint, not the loss location.

## ALTERNATIVE_HYPOTHESIS
Retriggers are driven by the intra-zone level climb (0.3 enemy levels per fight) versus a fixed +1 training target, not by threshold variance. If so, the lever that reduces retriggers without adding dead time is the training target on a retrigger, not the trigger threshold or a cooldown. A cooldown (the review's fallback) would behave like the threshold change: it delays a training the party genuinely needs and converts it into rewalks.

## PROPOSED_EXPERIMENT (smallest discriminating test, one lever)
Escalating training target on retrigger only: when a trigger fires within 20 fresh fights of a completed return to the same zone, train to +2 party levels instead of +1; a first trigger in a zone stays at +1. Everything else locked (AT_LOSSES 4, window 10, min 8, no cooldown, boss values, travel, rewards). Implementation is a two-line change at startTraining (target = 1 or 2 by whether `rec.retrigger` is set) plus persisting the target in G.train, which is already saved. QUICK DIAGNOSTIC: same paired seeds 1-10 x idle/casual/engaged x 24h, control arm = the pass 8 control (already retained, comparable, same build lineage), so 30 candidate runs.

## EXPECTED_OUTCOMES
- If the level-climb hypothesis is right: retriggers within 20 fresh fights fall >=30% in all three profiles, training hours fall or stay flat (fewer, longer trainings), ordinary defeats outside training do not rise, zone clear times do not worsen, and Stillwater stays inside its bands.
- If the variance hypothesis is right: retrigger counts barely move (the second training would just be longer for no benefit), and dead time is unchanged; then the cooldown diagnostic is the right next step.

## IMPLEMENTATION_RISK
Low. The target is one field on the training record; save compatibility is unaffected because existing saves have no active training or default to +1. No simulator/production divergence: the change is production logic and the bot does not implement training. No effect on bosses, XP, rewards or travel. The exploit protections are untouched (a manual build change still cancels training). The only behavioral risk is longer stays in the previous zone on a retrigger, which is the intended effect and is bounded by the same deeper-fallback and Keep pushing controls.

## Also note (no action requested)
Nothing in this pass touched Stillwater or Ironvein. In the control arm Ironvein for idle remains 0% first-try with 7 attempts and a 2.4h stall; I agree it should wait until training behavior is settled, since the escalating target would change idle's Ironvein arrival level.
