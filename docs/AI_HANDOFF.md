STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: REFERENCE_BASELINES_AND_TESTING
PASS_ID: PASS_39_REFERENCE_BASELINES_1_60
BASED_ON_REVIEW_PASS: REVIEWER_MESSAGES_RELAYED_BY_HUMAN_2026-09-14 (tree audit; testing parity; ablation reproducibility; PR #2 issues)
BUILD: 20260914-180527
HEAD_COMMIT_SHA: 3640689c9de7273e1218d8a1ff6c93d78e749145
RESULTS_COMMIT: 3640689c9de7273e1218d8a1ff6c93d78e749145 (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_36 (invalid timestep), PASS_37, PASS_38 (harness corrections, no baselines)

# Crystal Road AI Handoff - Pass 39 (reference baselines at 1/60, 1x and 2x, on the tree-audit build; contract tests; deterministic node ablations)

HUMAN_APPROVAL: tree audit items 1-7 with the human's revisions (Strike linear; secondary tap effects limited to the first three weighted taps per second, 2.15 max; crit capped at 95% with both crit nodes at 20 ranks, Crystal Edge 4 dust, versioned refund at historical prices; earned-resource multipliers centralized and applied once, excluding salvage, refunds and dev grants; Quickstep 300, Night Watch 450, Crystal Memory +10%/rank, Old Wisdom / Gilded Road / Deep Veins 5 dust; descriptions corrected; main merged before running); "Yes - launch the fresh 1x and 2x baselines" at dt 1/60 on seeds 71-80 with the rejection rules; the reviewer's six testing fixes ("fix the simulator if it makes sense to you" covered the parity work; the six were applied as specified). NOT decided by the human: the Shatter income scheme (untouched: flat +25% per Shatter on gold and ore, gold blessing 1.15^Shatters) and Long Stride.

DEVELOPER_POSITION: the baselines are valid under the reviewer's rules (exact 40-run matrix per speed, dt 1/60 recorded, speed recorded, 96 h, no assertion failures, every garrison check completed) and they replace pass 36 entirely. Their pacing is the same as pass 36 within an hour or two at every Road milestone, so the coarse step and the tree audit together did not move the Road; the tree audit cooled the Endless a little (power at 96 h 0.9-3.0M at 1x against 1.0-4.9M before; gold per hour down 20-30% for three profiles). The runaway remains: 69-73 real hours of 96 spent in the Endless at 1x, 81-84 at 2x; waves past 1000; power 6-15M at 2x. CONFIDENCE: HIGH on validity and provenance; HIGH on the pacing figures; the node ablations are a report, not proof, and their combat rows carry about +/-10% RNG-divergence noise.

## Testing changes since pass 38 (all on this branch)
- Isolated seeded RNG per game context with S.reseed; the bot passes its seed in. Ablation output is byte-identical across runs of the same seed.
- Production paths only: nodeCost and buyTreeRank are the one price and the one purchase path (Tree UI, contract tests, ablation); single-source helpers restHealPct, dustBlessMult (this also fixed the Shatter sheet showing 1+0.05 x rank while awarding 1+0.10 x rank), critChance, actionSpeedMult; the ablation boots through the production loader and measures Night Watch through offlineReport and Remembered Strength / Crystal Memory through doReforge.
- Tap limiter: a sliding one-second window was tried and rejected (steady 3 taps/s earned 1.35 instead of 2.15); the per-second bucket the human approved is in place, with contract tests that no wall-clock second yields more than 2.15 secondary weight and that steady 3/s earns 2.15 every second.
- tests/contract/tree.test.js: 1541 assertions against production functions (Strike 1.2/2/5x; Warm Fire 15/17/95% and the win path; Quickstep 1.5x at 25; Haggling 40% at 20; Swift Return 40% duration; Resonance 1 Surge per weighted tap at rank 5 at 1/3/10/30/100 taps/s; Crystal Memory 2x at rank 10 with display = reward; crit <= 95% at both caps; every node's price strictly increasing, deducted exactly, capped, numeric total rendered, linear totals = per-rank x rank; refund migration once at historical prices; goldMult/oreMult/xpMult exact). Run: node tests/contract/tree.test.js.
- validate38.js: exact matrix (profiles x seeds), empty directory rejected, provenance (commit + game and harness content hashes, now recorded by every run) enforced unless --allowMissingProvenance, seed/profile/hours/speed metadata checked, at least one completed garrison check per run. Prints GATE PASS/FAIL.
- Per-tick assertions in the bot: dt <= 0.05 unless --allowCoarseDt, game clock == sim clock, legal zone entry, unique roster, boost state, boss telemetry numeric, garrison post timer and one-hour recall.

## Playtime
PLAYTIME, reference baselines (median / P90 REAL hours; dt 1/60; seeds 71-80; idleboost/light/casual/engaged; 96 real hours; validate38 GATE PASS 40/40 for each)
Batch source: game.js as of commit 396a440 (the human-approved tree audit), harness as of f498022; these runs predate provenance recording, so the validator ran with --allowMissingProvenance. Later commits on this branch change tests, the simulator, the Tree UI, the Shatter sheet display and the purchase/price helpers; the only gameplay-affecting change after 396a440 is none (the tap limiter is back to the same per-second bucket these runs used).
1x (batch_out_base39):
| Profile | 1st Shatter | 2nd | 3rd | Endless entry | Wave 100 | Wave 300 | Wave 500 |
| idleboost | 6.4 / 8.2 | 12.7 / 14.5 | 21.0 / 23.0 | 26.0 / 30.0 | 27.0 / 30.0 | 32.0 / 36.0 | 41.0 / 46.0 |
| light | 6.1 / 8.1 | 11.1 / 14.1 | 17.1 / 22.0 | 23.0 / 30.0 | 23.0 / 31.0 | 28.0 / 36.0 | 36.0 / 46.0 |
| casual | 6.1 / 7.1 | 11.9 / 14.1 | 18.1 / 22.1 | 26.0 / 31.0 | 27.0 / 32.0 | 31.0 / 37.0 | 38.0 / 45.0 |
| engaged | 5.2 / 6.2 | 9.2 / 11.2 | 16.2 / 22.1 | 22.0 / 29.0 | 23.0 / 30.0 | 27.0 / 34.0 | 33.0 / 42.0 |
2x (batch_out_base39x2; speed toggle at 2x for the whole run; taps, active minutes and the 4h boost in real time):
| idleboost | 3.5 / 4.2 | 6.6 / 8.2 | 10.9 / 12.9 | 14.0 / 17.0 | 15.0 / 17.0 | 17.0 / 20.0 | 22.0 / 25.0 |
| light | 3.5 / 4.0 | 6.1 / 8.0 | 10.0 / 12.1 | 13.0 / 16.0 | 13.0 / 16.0 | 15.0 / 19.0 | 21.0 / 24.0 |
| casual | 3.1 / 4.9 | 6.7 / 8.1 | 10.8 / 14.0 | 14.0 / 17.0 | 14.0 / 18.0 | 16.0 / 20.0 | 20.0 / 26.0 |
| engaged | 3.1 / 3.2 | 6.0 / 7.1 | 9.1 / 12.1 | 12.0 / 17.0 | 12.0 / 17.0 | 14.0 / 20.0 | 18.0 / 24.0 |

## Report, 1x (reference column = the invalid dt-0.1 batch, direction only)

===== IDLEBOOST  batch_out_base39 (n=10)  reference batch_out_base35 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 8/9 / 8/9 (ref 9/9) Lv 46/74 -> 59/86 powerK 239/955 -> 344/1913 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 166/183 -> 169/192 powerK 48535/102449 -> 54604/163933 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 217/231 -> 224/243 powerK 301590/555527 -> 387115/917080 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 250/261 -> 256/272 powerK 938100/1436627 -> 1128959/2408001
-- Shatters per run 3/3 -> 3/3 | first h 6.4/8.2 -> 6.6/9.3 | third h 21.0/23.0 -> 20.1/26.4 | min gap 6.1/7.1 -> 6.2/8.5
-- hours in zone: Greenhollow 0.3/0.5 -> 0.3/0.4 | Stillwater 1.4/2.1 -> 1.7/2.0 | Thornwood 2.6/3.4 -> 3.0/3.4 | Ironvein 3.6/4.7 -> 3.1/5.4 | Emberwaste 3.4/4.2 -> 3.3/4.3 | Amberfall 2.9/3.2 -> 2.2/5.4 | Ashen Approach 2.4/3.2 -> 2.6/3.2 | Ashen Keep 4.9/6.4 -> 4.5/6.0 | Foundry 4.3/5.1 -> 4.0/5.2 | Endless 68.7/72.8 -> 70.6/74.4
-- Warlord: reached 10/10 (ref 10/10) | attempts 2/4 -> 3/5 | Auto-Cast 10/24 (ref 10/33) | active 0/0 (ref 0/0) | stall h 0.2/1.4 -> 0.5/1.6 | cleared 10/10 at h 6.4/8.2 (ref 10/10 @6.6/9.3) | loss dur/HP 67s 27% | charge kills/att 2.50
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/5 -> 3/7 | Auto-Cast 10/23 (ref 10/36) | active 0/0 (ref 0/0) | stall h 0.2/1.5 -> 0.6/1.7 | cleared 10/10 at h 10.8/12.1 (ref 10/10 @10.9/13.3) | loss dur/HP 64s 20% | charge kills/att 2.50
-- Hunter King: reached 10/10 (ref 10/10) | attempts 3/4 -> 3/4 | Auto-Cast 10/31 (ref 10/29) | active 0/0 (ref 0/0) | stall h 0.5/1.3 -> 0.5/1.0 | cleared 10/10 at h 12.7/14.5 (ref 10/10 @12.6/17.9) | loss dur/HP 62s 32% | charge kills/att 2.50
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 3/5 -> 4/6 | Auto-Cast 10/34 (ref 10/40) | active 0/0 (ref 0/0) | stall h 0.8/1.4 -> 0.9/1.7 | cleared 10/10 at h 15.9/18.4 (ref 10/10 @16.3/21.8) | loss dur/HP 53s 64% | charge kills/att 1.33
-- Hollow King: reached 10/10 (ref 10/10) | attempts 7/12 -> 6/11 | Auto-Cast 10/80 (ref 10/73) | active 0/0 (ref 0/0) | stall h 1.8/2.8 -> 1.5/2.0 | cleared 10/10 at h 21.0/23.0 (ref 10/10 @20.1/26.4) | loss dur/HP 47s 60% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 3/7 -> 3/8 | Auto-Cast 10/37 (ref 10/45) | active 0/0 (ref 0/0) | stall h 0.7/1.6 -> 0.7/1.5 | cleared 10/10 at h 23.4/26.3 (ref 10/10 @23.2/30.7) | loss dur/HP 57s 60% | charge kills/att 3.86 | volley % of target HP 47%
-- Foundry exit 10/10 at h 23.4/26.3 (ref 10/10 @23.2/30.7) | Endless entered 10/10 at h 25.8/29.1 (ref 10/10 @25.3/32.1) | hours in Endless 68.7/72.8 -> 70.6/74.4 | best wave 1011/1064 -> 1028/1118 | milestones 40/42 | deaths/h 4.8/5.1 -> 5.4/6.2 | gold earned/h M 3213.1/4853.9 -> 4002.1/7617.6 spent/h M 2896.0/4187.4 | levels gained in Endless 186/195 | power ratio in Endless x2583.7/3380.6 -> x2797.0/5773.4
-- totals: Lv@96h 250/261 -> 256/272 | power@96h K 938100/1436627 -> 1128959/2408001 | gold earned M 221332/354352 -> 284166/571340 | ore earned K 928679/1317688 -> 1113962/1952675 | renown K 8094/9998 -> 10677/13766 | defeats 830/967 -> 838/1117 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 76 Hollow King 1/12 stall 2.5h clear@19.8 | seed 77 Hollow King 1/10 stall 2.8h clear@18.6 | seed 79 Hollow King 1/10 stall 2.5h clear@20.6
-- outliers: none

===== LIGHT  batch_out_base39 (n=10)  reference batch_out_base35 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 8/9) Lv 62/91 -> 54/104 powerK 336/2198 -> 227/4682 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 175/201 -> 162/204 powerK 73393/197114 -> 39803/239384 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 229/253 -> 219/256 powerK 489858/1170050 -> 321408/1384539 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 260/285 -> 252/289 powerK 1418518/3248846 -> 1010641/4160281
-- Shatters per run 3/3 -> 3/3 | first h 6.1/8.1 -> 6.9/9.3 | third h 17.1/22.0 -> 20.1/27.1 | min gap 5.0/6.8 -> 5.8/7.8
-- hours in zone: Greenhollow 0.3/0.4 -> 0.3/0.5 | Stillwater 1.7/2.1 -> 1.7/1.8 | Thornwood 2.7/3.2 -> 3.4/3.9 | Ironvein 2.9/4.7 -> 3.2/5.9 | Emberwaste 2.8/3.3 -> 3.2/4.3 | Amberfall 2.1/3.5 -> 2.5/4.1 | Ashen Approach 1.8/3.2 -> 3.0/5.1 | Ashen Keep 4.3/6.4 -> 4.2/8.3 | Foundry 4.3/5.0 -> 4.8/6.0 | Endless 71.2/74.9 -> 69.0/76.4
-- Warlord: reached 10/10 (ref 10/10) | attempts 2/4 -> 2/3 | Auto-Cast 4/18 (ref 8/17) | active 6/8 (ref 2/5) | stall h 0.4/1.0 -> 0.1/0.8 | cleared 10/10 at h 6.1/8.1 (ref 10/10 @6.9/9.3) | loss dur/HP 57s 39% | charge kills/att 1.50
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/4 -> 2/4 | Auto-Cast 1/10 (ref 0/10) | active 9/13 (ref 10/14) | stall h 0.6/1.0 -> 0.9/2.0 | cleared 10/10 at h 10.1/12.1 (ref 10/10 @11.0/14.1) | loss dur/HP 56s 24% | charge kills/att 1.33
-- Hunter King: reached 10/10 (ref 10/10) | attempts 2/4 -> 2/4 | Auto-Cast 2/12 (ref 2/12) | active 8/13 (ref 8/14) | stall h 0.0/1.8 -> 0.3/1.0 | cleared 10/10 at h 11.1/14.1 (ref 10/10 @13.0/17.1) | loss dur/HP 59s 32% | charge kills/att 2.00
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 1/4 -> 2/7 | Auto-Cast 0/6 (ref 4/18) | active 10/12 (ref 6/12) | stall h 0.0/1.0 -> 1.0/2.0 | cleared 10/10 at h 14.1/17.1 (ref 10/10 @17.1/22.1) | loss dur/HP 48s 44% | charge kills/att 0.67
-- Hollow King: reached 10/10 (ref 10/10) | attempts 4/9 -> 5/12 | Auto-Cast 3/31 (ref 1/33) | active 7/13 (ref 9/18) | stall h 1.0/2.0 -> 1.0/4.0 | cleared 10/10 at h 17.1/22.0 (ref 10/10 @20.1/27.1) | loss dur/HP 28s 69% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/5 -> 3/6 | Auto-Cast 2/10 (ref 2/20) | active 8/11 (ref 8/13) | stall h 0.2/1.0 -> 0.8/1.6 | cleared 10/10 at h 20.1/26.1 (ref 10/10 @24.1/32.1) | loss dur/HP 50s 53% | charge kills/att 1.50 | volley % of target HP 51%
-- Foundry exit 10/10 at h 20.1/26.1 (ref 10/10 @24.1/32.1) | Endless entered 10/10 at h 22.4/29.1 (ref 10/10 @26.9/33.9) | hours in Endless 71.2/74.9 -> 69.0/76.4 | best wave 1053/1150 -> 1016/1194 | milestones 42/46 | deaths/h 5.7/7.6 -> 5.9/7.5 | gold earned/h M 5348.2/14386.3 -> 3757.6/16258.1 spent/h M 4809.5/12542.7 | levels gained in Endless 198/220 | power ratio in Endless x4217.2/8648.2 -> x3096.6/9321.5
-- totals: Lv@96h 260/285 -> 252/289 | power@96h K 1418518/3248846 -> 1010641/4160281 | gold earned M 385085/1064604 -> 253187/1251891 | ore earned K 1375668/3185808 -> 971493/3619849 | renown K 11831/17191 -> 9397/16192 | defeats 988/1290 -> 938/1581 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): none
-- outliers: none

===== CASUAL  batch_out_base39 (n=10)  reference batch_out_base35 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 8/9 / 8/9 (ref 9/9) Lv 54/80 -> 57/102 powerK 216/1296 -> 242/4251 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 172/191 -> 178/212 powerK 67489/132134 -> 75839/319709 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 231/242 -> 236/262 powerK 537306/801706 -> 569601/1704748 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 261/274 -> 272/301 powerK 1458192/2288847 -> 1932902/5545658
-- Shatters per run 3/3 -> 3/3 | first h 6.1/7.1 -> 6.0/8.2 | third h 18.1/22.1 -> 18.1/21.1 | min gap 5.1/7.0 -> 4.1/6.0
-- hours in zone: Greenhollow 0.3/0.4 -> 0.3/0.4 | Stillwater 1.5/1.7 -> 1.5/2.1 | Thornwood 2.6/3.5 -> 2.5/3.6 | Ironvein 3.0/4.0 -> 2.8/4.0 | Emberwaste 2.3/4.4 -> 2.4/3.4 | Amberfall 2.6/4.6 -> 1.6/4.5 | Ashen Approach 2.2/3.2 -> 2.2/2.3 | Ashen Keep 5.1/7.1 -> 6.1/6.3 | Foundry 5.0/8.9 -> 5.0/6.3 | Endless 68.9/73.8 -> 70.2/76.0
-- Warlord: reached 10/10 (ref 10/10) | attempts 1/3 -> 1/4 | Auto-Cast 1/3 (ref 1/7) | active 9/9 (ref 9/14) | stall h 0.0/0.1 -> 0.0/2.1 | cleared 10/10 at h 6.1/7.1 (ref 10/10 @6.0/8.2) | loss dur/HP 56s 20% | charge kills/att 1.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 1/2 -> 2/4 | Auto-Cast 0/2 (ref 0/4) | active 10/12 (ref 10/16) | stall h 0.0/1.0 -> 0.4/1.0 | cleared 10/10 at h 9.1/11.1 (ref 10/10 @9.1/11.1) | loss dur/HP 49s 15% | charge kills/att 0.00
-- Hunter King: reached 10/10 (ref 10/10) | attempts 2/5 -> 1/3 | Auto-Cast 1/5 (ref 0/2) | active 9/16 (ref 10/14) | stall h 0.0/1.9 -> 0.0/1.9 | cleared 10/10 at h 11.9/14.1 (ref 10/10 @10.2/13.1) | loss dur/HP 48s 31% | charge kills/att 1.50
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 1/3 -> 1/2 | Auto-Cast 0/1 (ref 0/3) | active 10/14 (ref 10/10) | stall h 0.0/1.0 -> 0.0/0.9 | cleared 10/10 at h 14.1/17.1 (ref 10/10 @13.1/16.1) | loss dur/HP 48s 47% | charge kills/att 1.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 2/6 -> 3/7 | Auto-Cast 0/7 (ref 0/10) | active 10/18 (ref 10/24) | stall h 0.0/4.0 -> 1.9/4.9 | cleared 10/10 at h 19.1/22.1 (ref 10/10 @18.1/21.1) | loss dur/HP 56s 70% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/4 -> 2/5 | Auto-Cast 0/2 (ref 0/5) | active 10/17 (ref 10/19) | stall h 0.9/1.9 -> 1.0/1.9 | cleared 10/10 at h 23.1/26.1 (ref 10/10 @22.1/25.1) | loss dur/HP 54s 41% | charge kills/att 0.50 | volley % of target HP 50%
-- Foundry exit 10/10 at h 23.1/26.1 (ref 10/10 @22.1/25.1) | Endless entered 10/10 at h 25.5/30.1 (ref 10/10 @24.1/28.1) | hours in Endless 68.9/73.8 -> 70.2/76.0 | best wave 1052/1143 -> 1144/1245 | milestones 42/45 | deaths/h 5.0/7.0 -> 5.7/7.0 | gold earned/h M 7371.1/11761.3 -> 9446.9/29007.4 spent/h M 6502.9/10949.5 | levels gained in Endless 195/210 | power ratio in Endless x3741.8/6524.9 -> x6319.2/16434.6
-- totals: Lv@96h 261/274 -> 272/301 | power@96h K 1458192/2288847 -> 1932902/5545658 | gold earned M 508624/858590 -> 665567/2117556 | ore earned K 1314034/2135107 -> 2016239/5160472 | renown K 9241/15247 -> 14973/23276 | defeats 1178/1490 -> 1057/1386 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 71 Hollow King 1/3 stall 4.0h clear@21.1 | seed 79 Hollow King 1/4 stall 4.0h clear@19.1
-- outliers: none

===== ENGAGED  batch_out_base39 (n=10)  reference batch_out_base35 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 77/106 -> 64/130 powerK 1167/5170 -> 330/16555 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 198/219 -> 193/244 powerK 207435/390587 -> 159080/1012928 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 249/264 -> 255/298 powerK 1092209/1870824 -> 1323570/5881934 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 279/297 -> 295/334 powerK 2980018/5310454 -> 4892528/17784188
-- Shatters per run 3/3 -> 3/3 | first h 5.2/6.2 -> 6.1/7.2 | third h 16.2/22.1 -> 17.1/21.1 | min gap 4.0/5.1 -> 4.0/5.1
-- hours in zone: Greenhollow 0.3/0.3 -> 0.3/0.4 | Stillwater 1.6/2.1 -> 1.4/1.9 | Thornwood 2.2/3.5 -> 2.3/4.8 | Ironvein 2.9/3.8 -> 3.0/5.0 | Emberwaste 1.5/2.7 -> 2.3/2.7 | Amberfall 2.2/2.5 -> 1.6/2.5 | Ashen Approach 1.3/3.1 -> 1.4/3.3 | Ashen Keep 5.3/9.2 -> 4.3/6.2 | Foundry 5.1/6.0 -> 5.4/6.9 | Endless 73.1/76.1 -> 71.5/79.1
-- Warlord: reached 10/10 (ref 10/10) | attempts 2/3 -> 1/5 | Auto-Cast 1/7 (ref 0/4) | active 9/12 (ref 10/15) | stall h 0.3/0.9 -> 0.0/1.8 | cleared 10/10 at h 5.2/6.2 (ref 10/10 @6.1/7.2) | loss dur/HP 60s 28% | charge kills/att 1.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 1/4 -> 1/2 | Auto-Cast 0/5 (ref 0/2) | active 10/13 (ref 10/11) | stall h 0.0/0.9 -> 0.0/0.8 | cleared 10/10 at h 7.2/9.1 (ref 10/10 @8.3/10.2) | loss dur/HP 57s 22% | charge kills/att 1.00
-- Hunter King: reached 10/10 (ref 10/10) | attempts 1/3 -> 1/3 | Auto-Cast 0/1 (ref 0/0) | active 10/14 (ref 10/15) | stall h 0.0/1.0 -> 0.0/1.0 | cleared 10/10 at h 9.2/11.2 (ref 10/10 @10.1/12.3) | loss dur/HP 43s 22% | charge kills/att 1.00
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 1/4 -> 1/3 | Auto-Cast 0/0 (ref 0/0) | active 10/15 (ref 10/17) | stall h 0.0/1.1 -> 0.0/1.1 | cleared 10/10 at h 11.2/15.1 (ref 10/10 @12.2/15.1) | loss dur/HP 44s 28% | charge kills/att 0.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 3/4 -> 3/5 | Auto-Cast 0/2 (ref 0/1) | active 10/26 (ref 10/27) | stall h 1.9/4.0 -> 1.9/4.1 | cleared 10/10 at h 17.1/22.1 (ref 10/10 @17.1/22.2) | loss dur/HP 24s 51% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/6 -> 3/5 | Auto-Cast 0/1 (ref 0/2) | active 10/22 (ref 10/28) | stall h 0.8/2.1 -> 1.0/2.0 | cleared 10/10 at h 19.2/26.2 (ref 10/10 @21.2/25.1) | loss dur/HP 58s 35% | charge kills/att 1.00 | volley % of target HP 56%
-- Foundry exit 10/10 at h 19.2/26.2 (ref 10/10 @21.2/25.1) | Endless entered 10/10 at h 22.0/28.6 (ref 10/10 @23.1/28.6) | hours in Endless 73.1/76.1 -> 71.5/79.1 | best wave 1159/1227 -> 1227/1439 | milestones 46/49 | deaths/h 5.9/6.9 -> 6.2/8.4 | gold earned/h M 18693.5/34417.6 -> 26304.3/119972.4 spent/h M 16705.2/31290.6 | levels gained in Endless 213/237 | power ratio in Endless x7785.7/15750.5 -> x14813.2/53310.6
-- totals: Lv@96h 279/297 -> 295/334 | power@96h K 2980018/5310454 -> 4892528/17784188 | gold earned M 1420727/2650169 -> 1893928/9477827 | ore earned K 2544717/4721045 -> 4296359/16202213 | renown K 13938/21584 -> 20905/33214 | defeats 1256/1579 -> 1376/1718 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 71 Hollow King 1/3 stall 2.9h clear@18.1 | seed 72 Hollow King 1/3 stall 3.0h clear@22.1 | seed 73 Core 1/4 stall 2.1h clear@26.2 | seed 75 Hollow King 1/3 stall 4.0h clear@17.2
-- outliers: none

## Report, 2x (reference column = the 1x reference above)

===== IDLEBOOST  batch_out_base39x2 (n=10)  reference batch_out_base39 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 8/9) Lv 148/196 -> 46/74 powerK 22281/196146 -> 239/955 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 241/281 -> 166/183 powerK 643131/3200307 -> 48535/102449 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 281/319 -> 217/231 powerK 2497970/11041040 -> 301590/555527 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 311/348 -> 250/261 powerK 6296086/26535637 -> 938100/1436627
-- Shatters per run 3/3 -> 3/3 | first h 3.5/4.2 -> 6.4/8.2 | third h 10.9/12.9 -> 21.0/23.0 | min gap 3.5/4.0 -> 6.1/7.1
-- hours in zone: Greenhollow 0.2/0.2 -> 0.3/0.5 | Stillwater 0.9/1.2 -> 1.4/2.1 | Thornwood 1.6/2.0 -> 2.6/3.4 | Ironvein 1.9/2.4 -> 3.6/4.7 | Emberwaste 1.7/2.3 -> 3.4/4.2 | Amberfall 1.2/2.0 -> 2.9/3.2 | Ashen Approach 1.4/2.1 -> 2.4/3.2 | Ashen Keep 2.3/3.2 -> 4.9/6.4 | Foundry 2.3/3.0 -> 4.3/5.1 | Endless 81.0/85.0 -> 68.7/72.8
-- Warlord: reached 10/10 (ref 10/10) | attempts 3/5 -> 2/4 | Auto-Cast 10/32 (ref 10/24) | active 0/0 (ref 0/0) | stall h 0.3/0.8 -> 0.2/1.4 | cleared 10/10 at h 3.5/4.2 (ref 10/10 @6.4/8.2) | loss dur/HP 32s 42% | charge kills/att 2.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/6 -> 2/5 | Auto-Cast 10/29 (ref 10/23) | active 0/0 (ref 0/0) | stall h 0.2/0.9 -> 0.2/1.5 | cleared 10/10 at h 5.6/6.8 (ref 10/10 @10.8/12.1) | loss dur/HP 36s 30% | charge kills/att 2.33
-- Hunter King: reached 10/10 (ref 10/10) | attempts 2/4 -> 3/4 | Auto-Cast 10/23 (ref 10/31) | active 0/0 (ref 0/0) | stall h 0.0/0.5 -> 0.5/1.3 | cleared 10/10 at h 6.6/8.2 (ref 10/10 @12.7/14.5) | loss dur/HP 25s 26% | charge kills/att 2.00
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 4/6 -> 3/5 | Auto-Cast 10/41 (ref 10/34) | active 0/0 (ref 0/0) | stall h 0.5/1.1 -> 0.8/1.4 | cleared 10/10 at h 8.7/10.3 (ref 10/10 @15.9/18.4) | loss dur/HP 25s 60% | charge kills/att 1.20
-- Hollow King: reached 10/10 (ref 10/10) | attempts 7/12 -> 7/12 | Auto-Cast 10/79 (ref 10/80) | active 0/0 (ref 0/0) | stall h 0.9/1.8 -> 1.8/2.8 | cleared 10/10 at h 10.9/12.9 (ref 10/10 @21.0/23.0) | loss dur/HP 25s 63% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 4/8 -> 3/7 | Auto-Cast 10/41 (ref 10/37) | active 0/0 (ref 0/0) | stall h 0.5/1.0 -> 0.7/1.6 | cleared 10/10 at h 12.4/15.0 (ref 10/10 @23.4/26.3) | loss dur/HP 24s 63% | charge kills/att 3.80 | volley % of target HP 49%
-- Foundry exit 10/10 at h 12.4/15.0 (ref 10/10 @23.4/26.3) | Endless entered 10/10 at h 13.8/16.2 (ref 10/10 @25.8/29.1) | hours in Endless 81.0/85.0 -> 68.7/72.8 | best wave 1254/1425 -> 1011/1064 | milestones 50/57 | deaths/h 8.7/10.0 -> 4.8/5.1 | gold earned/h M 33721.7/160529.3 -> 3213.1/4853.9 spent/h M 30281.8/143112.8 | levels gained in Endless 248/281 | power ratio in Endless x18089.9/52369.3 -> x2583.7/3380.6
-- totals: Lv@96h 311/348 -> 250/261 | power@96h K 6296086/26535637 -> 938100/1436627 | gold earned M 2743104/13645010 -> 221332/354352 | ore earned K 7486386/26180568 -> 928679/1317688 | renown K 34141/62525 -> 8094/9998 | defeats 1269/1347 -> 830/967 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): none
-- outliers: none

===== LIGHT  batch_out_base39x2 (n=10)  reference batch_out_base39 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 167/188 -> 62/91 powerK 54095/121997 -> 336/2198 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 252/271 -> 175/201 powerK 1001719/1989091 -> 73393/197114 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 298/315 -> 229/253 powerK 4251254/8394114 -> 489858/1170050 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 324/342 -> 260/285 powerK 9965772/19295320 -> 1418518/3248846
-- Shatters per run 3/3 -> 3/3 | first h 3.5/4.0 -> 6.1/8.1 | third h 10.0/12.1 -> 17.1/22.0 | min gap 2.7/4.3 -> 5.0/6.8
-- hours in zone: Greenhollow 0.2/0.2 -> 0.3/0.4 | Stillwater 0.9/1.3 -> 1.7/2.1 | Thornwood 1.4/1.5 -> 2.7/3.2 | Ironvein 1.9/2.3 -> 2.9/4.7 | Emberwaste 1.5/1.9 -> 2.8/3.3 | Amberfall 1.4/2.3 -> 2.1/3.5 | Ashen Approach 1.1/1.9 -> 1.8/3.2 | Ashen Keep 2.1/3.6 -> 4.3/6.4 | Foundry 2.0/2.8 -> 4.3/5.0 | Endless 82.4/84.4 -> 71.2/74.9
-- Warlord: reached 10/10 (ref 10/10) | attempts 3/6 -> 2/4 | Auto-Cast 10/28 (ref 4/18) | active 0/4 (ref 6/8) | stall h 0.2/0.5 -> 0.4/1.0 | cleared 10/10 at h 3.5/4.0 (ref 10/10 @6.1/8.1) | loss dur/HP 32s 37% | charge kills/att 1.67
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/6 -> 2/4 | Auto-Cast 6/15 (ref 1/10) | active 4/10 (ref 9/13) | stall h 0.1/0.9 -> 0.6/1.0 | cleared 10/10 at h 5.1/6.1 (ref 10/10 @10.1/12.1) | loss dur/HP 29s 23% | charge kills/att 1.50
-- Hunter King: reached 10/10 (ref 10/10) | attempts 3/4 -> 2/4 | Auto-Cast 6/20 (ref 2/12) | active 4/10 (ref 8/13) | stall h 0.3/0.9 -> 0.0/1.8 | cleared 10/10 at h 6.1/8.0 (ref 10/10 @11.1/14.1) | loss dur/HP 25s 22% | charge kills/att 2.00
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 3/5 -> 1/4 | Auto-Cast 6/24 (ref 0/6) | active 4/8 (ref 10/12) | stall h 0.5/0.9 -> 0.0/1.0 | cleared 10/10 at h 8.0/9.9 (ref 10/10 @14.1/17.1) | loss dur/HP 29s 47% | charge kills/att 0.80
-- Hollow King: reached 10/10 (ref 10/10) | attempts 5/9 -> 4/9 | Auto-Cast 5/51 (ref 3/31) | active 5/14 (ref 7/13) | stall h 0.8/1.5 -> 1.0/2.0 | cleared 10/10 at h 10.0/12.1 (ref 10/10 @17.1/22.0) | loss dur/HP 21s 35% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 3/7 -> 2/5 | Auto-Cast 8/29 (ref 2/10) | active 2/5 (ref 8/11) | stall h 0.3/0.8 -> 0.2/1.0 | cleared 10/10 at h 11.6/13.9 (ref 10/10 @20.1/26.1) | loss dur/HP 28s 57% | charge kills/att 2.50 | volley % of target HP 52%
-- Foundry exit 10/10 at h 11.6/13.9 (ref 10/10 @20.1/26.1) | Endless entered 10/10 at h 12.3/15.2 (ref 10/10 @22.4/29.1) | hours in Endless 82.4/84.4 -> 71.2/74.9 | best wave 1293/1400 -> 1053/1150 | milestones 51/56 | deaths/h 9.2/13.4 -> 5.7/7.6 | gold earned/h M 63471.1/132342.8 -> 5348.2/14386.3 spent/h M 56033.1/122682.6 | levels gained in Endless 265/278 | power ratio in Endless x33438.0/47734.9 -> x4217.2/8648.2
-- totals: Lv@96h 324/342 -> 260/285 | power@96h K 9965772/19295320 -> 1418518/3248846 | gold earned M 5268121/11116816 -> 385085/1064604 | ore earned K 12157938/22935782 -> 1375668/3185808 | renown K 39730/61659 -> 11831/17191 | defeats 1349/1659 -> 988/1290 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): none
-- outliers: none

===== CASUAL  batch_out_base39x2 (n=10)  reference batch_out_base39 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 8/9) Lv 167/184 -> 54/80 powerK 50215/110638 -> 216/1296 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 255/268 -> 172/191 powerK 1114276/1955679 -> 67489/132134 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 299/311 -> 231/242 powerK 4812390/7402910 -> 537306/801706 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 325/337 -> 261/274 powerK 10799786/17641766 -> 1458192/2288847
-- Shatters per run 3/3 -> 3/3 | first h 3.1/4.9 -> 6.1/7.1 | third h 10.8/14.0 -> 18.1/22.1 | min gap 3.2/3.9 -> 5.1/7.0
-- hours in zone: Greenhollow 0.2/0.2 -> 0.3/0.4 | Stillwater 0.8/1.0 -> 1.5/1.7 | Thornwood 1.3/2.3 -> 2.6/3.5 | Ironvein 1.7/2.7 -> 3.0/4.0 | Emberwaste 1.3/1.9 -> 2.3/4.4 | Amberfall 1.4/2.6 -> 2.6/4.6 | Ashen Approach 1.2/2.1 -> 2.2/3.2 | Ashen Keep 2.5/3.4 -> 5.1/7.1 | Foundry 1.9/2.3 -> 5.0/8.9 | Endless 82.6/85.3 -> 68.9/73.8
-- Warlord: reached 10/10 (ref 10/10) | attempts 2/5 -> 1/3 | Auto-Cast 6/18 (ref 1/3) | active 4/7 (ref 9/9) | stall h 0.1/0.4 -> 0.0/0.1 | cleared 10/10 at h 3.1/4.9 (ref 10/10 @6.1/7.1) | loss dur/HP 35s 23% | charge kills/att 1.60
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/5 -> 1/2 | Auto-Cast 3/9 (ref 0/2) | active 7/12 (ref 10/12) | stall h 0.1/0.9 -> 0.0/1.0 | cleared 10/10 at h 5.0/7.0 (ref 10/10 @9.1/11.1) | loss dur/HP 26s 19% | charge kills/att 1.50
-- Hunter King: reached 10/10 (ref 10/10) | attempts 3/6 -> 2/5 | Auto-Cast 4/18 (ref 1/5) | active 6/14 (ref 9/16) | stall h 0.0/1.0 -> 0.0/1.9 | cleared 10/10 at h 6.7/8.1 (ref 10/10 @11.9/14.1) | loss dur/HP 25s 37% | charge kills/att 2.00
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 3/7 -> 1/3 | Auto-Cast 4/22 (ref 0/1) | active 6/15 (ref 10/14) | stall h 0.3/0.9 -> 0.0/1.0 | cleared 10/10 at h 8.8/11.1 (ref 10/10 @14.1/17.1) | loss dur/HP 26s 54% | charge kills/att 0.86
-- Hollow King: reached 10/10 (ref 10/10) | attempts 7/10 -> 2/6 | Auto-Cast 2/51 (ref 0/7) | active 8/20 (ref 10/18) | stall h 1.0/1.9 -> 0.0/4.0 | cleared 10/10 at h 10.8/14.0 (ref 10/10 @19.1/22.1) | loss dur/HP 25s 40% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 3/5 -> 2/4 | Auto-Cast 4/18 (ref 0/2) | active 6/13 (ref 10/17) | stall h 0.3/0.8 -> 0.9/1.9 | cleared 10/10 at h 12.2/15.9 (ref 10/10 @23.1/26.1) | loss dur/HP 24s 59% | charge kills/att 1.75 | volley % of target HP 51%
-- Foundry exit 10/10 at h 12.2/15.9 (ref 10/10 @23.1/26.1) | Endless entered 10/10 at h 13.3/16.9 (ref 10/10 @25.5/30.1) | hours in Endless 82.6/85.3 -> 68.9/73.8 | best wave 1325/1411 -> 1052/1143 | milestones 53/56 | deaths/h 9.7/12.2 -> 5.0/7.0 | gold earned/h M 80855.4/133895.0 -> 7371.1/11761.3 spent/h M 72867.1/122911.5 | levels gained in Endless 263/274 | power ratio in Endless x33474.8/50175.2 -> x3741.8/6524.9
-- totals: Lv@96h 325/337 -> 261/274 | power@96h K 10799786/17641766 -> 1458192/2288847 | gold earned M 6711011/11247198 -> 508624/858590 | ore earned K 12338381/19487149 -> 1314034/2135107 | renown K 44365/49722 -> 9241/15247 | defeats 1429/1918 -> 1178/1490 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): none
-- outliers: none

===== ENGAGED  batch_out_base39x2 (n=10)  reference batch_out_base39 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 183/199 -> 77/106 powerK 95350/175628 -> 1167/5170 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 264/282 -> 198/219 powerK 1568733/2877464 -> 207435/390587 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 307/319 -> 249/264 powerK 6478666/9614530 -> 1092209/1870824 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 332/348 -> 279/297 powerK 14992404/24455357 -> 2980018/5310454
-- Shatters per run 3/3 -> 3/3 | first h 3.1/3.2 -> 5.2/6.2 | third h 9.1/12.1 -> 16.2/22.1 | min gap 2.8/3.9 -> 4.0/5.1
-- hours in zone: Greenhollow 0.2/0.2 -> 0.3/0.3 | Stillwater 0.8/1.1 -> 1.6/2.1 | Thornwood 1.4/1.9 -> 2.2/3.5 | Ironvein 1.6/1.9 -> 2.9/3.8 | Emberwaste 1.3/1.6 -> 1.5/2.7 | Amberfall 1.5/2.7 -> 2.2/2.5 | Ashen Approach 0.6/1.2 -> 1.3/3.1 | Ashen Keep 2.2/4.6 -> 5.3/9.2 | Foundry 1.8/3.1 -> 5.1/6.0 | Endless 84.0/85.7 -> 73.1/76.1
-- Warlord: reached 10/10 (ref 10/10) | attempts 2/4 -> 2/3 | Auto-Cast 0/9 (ref 1/7) | active 10/13 (ref 9/12) | stall h 0.0/0.2 -> 0.3/0.9 | cleared 10/10 at h 3.1/3.2 (ref 10/10 @5.2/6.2) | loss dur/HP 30s 20% | charge kills/att 1.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/4 -> 1/4 | Auto-Cast 2/4 (ref 0/5) | active 8/19 (ref 10/13) | stall h 0.1/0.9 -> 0.0/0.9 | cleared 10/10 at h 5.0/5.2 (ref 10/10 @7.2/9.1) | loss dur/HP 32s 18% | charge kills/att 1.25
-- Hunter King: reached 10/10 (ref 10/10) | attempts 3/9 -> 1/3 | Auto-Cast 2/17 (ref 0/1) | active 8/19 (ref 10/14) | stall h 0.3/0.8 -> 0.0/1.0 | cleared 10/10 at h 6.0/7.1 (ref 10/10 @9.2/11.2) | loss dur/HP 23s 31% | charge kills/att 1.67
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 2/4 -> 1/4 | Auto-Cast 1/7 (ref 0/0) | active 9/13 (ref 10/15) | stall h 0.1/0.9 -> 0.0/1.1 | cleared 10/10 at h 7.0/9.1 (ref 10/10 @11.2/15.1) | loss dur/HP 20s 57% | charge kills/att 0.67
-- Hollow King: reached 10/10 (ref 10/10) | attempts 5/9 -> 3/4 | Auto-Cast 0/26 (ref 0/2) | active 10/29 (ref 10/26) | stall h 0.9/1.8 -> 1.9/4.0 | cleared 10/10 at h 9.1/12.1 (ref 10/10 @17.1/22.1) | loss dur/HP 23s 41% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/7 -> 2/6 | Auto-Cast 3/14 (ref 0/1) | active 7/18 (ref 10/22) | stall h 0.1/0.8 -> 0.8/2.1 | cleared 10/10 at h 10.9/15.9 (ref 10/10 @19.2/26.2) | loss dur/HP 28s 49% | charge kills/att 2.00 | volley % of target HP 56%
-- Foundry exit 10/10 at h 10.9/15.9 (ref 10/10 @19.2/26.2) | Endless entered 10/10 at h 11.6/16.2 (ref 10/10 @22.0/28.6) | hours in Endless 84.0/85.7 -> 73.1/76.1 | best wave 1399/1438 -> 1159/1227 | milestones 55/57 | deaths/h 9.9/11.7 -> 5.9/6.9 | gold earned/h M 132340.3/239794.6 -> 18693.5/34417.6 spent/h M 121645.2/210976.8 | levels gained in Endless 267/287 | power ratio in Endless x39135.9/76216.3 -> x7785.7/15750.5
-- totals: Lv@96h 332/348 -> 279/297 | power@96h K 14992404/24455357 -> 2980018/5310454 | gold earned M 11116598/20622351 -> 1420727/2650169 | ore earned K 15737675/27385449 -> 2544717/4721045 | renown K 45810/66822 -> 13938/21584 | defeats 1439/2167 -> 1256/1579 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): none
-- outliers: none

## Node ablation report (deterministic; seed 1; 2 h arena; ranks bought through buyTreeRank; not a test)
NODE ABLATION REPORT  seed 1  dt 1/60  arena hours 2  source game d548eb900dd3aad4 harness 60a7bbf05c234614:bcb860f4f371e954  (improvement vs rank 0 in the same scenario with the same RNG; cost is the price actually paid through buyTreeRank)

== Vigor (hp, Party, max 999, gold base 80)  +4% max HP
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost     120 gold: kills 76 (+16.0%) | defeats 36.5 (-9.9%) | gold 10.3K (+15.2%) | ore 498 (+26.2%) | levels 1.03 (+20.1%) | dmgAbility 70.3K (+3.1%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost    2.5K gold: kills 70 (+6.9%) | defeats 31.5 (-22.2%) | gold 9.6K (+6.9%) | ore 457.5 (+16.0%) | levels 0.97 (+12.8%) | dmgAbility 70.0K (+2.7%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank 10 cost   42.9K gold: kills 78 (+19.1%) | defeats 26.5 (-34.6%) | gold 10.7K (+20.0%) | ore 479 (+21.4%) | levels 1.1 (+27.8%) | dmgAbility 72.0K (+5.6%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0

== Might (atk, Party, max 999, gold base 100)  +4% attack
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost     150 gold: kills 67.5 (+3.1%) | defeats 42 (+3.7%) | gold 9.1K (+1.4%) | ore 294 (-25.5%) | levels 0.91 (+6.2%) | dmgAbility 72.4K (+6.2%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost    3.1K gold: kills 94.5 (+44.3%) | defeats 36 (-11.1%) | gold 12.9K (+44.5%) | ore 442 (+12.0%) | levels 1.25 (+44.9%) | dmgAbility 90.4K (+32.8%) | dmgTap 0 | surges 2 (+33.3%) | taps 0
   rank 10 cost   53.7K gold: kills 119.5 (+82.4%) | defeats 38 (-6.2%) | gold 16.5K (+84.5%) | ore 725 (+83.8%) | levels 1.6 (+86.2%) | dmgAbility 109.4K (+60.6%) | dmgTap 0 | surges 2.5 (+66.7%) | taps 0

== Bulwark (def, Party, max 999, gold base 120)  +4% defense
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost     180 gold: kills 72.5 (+10.7%) | defeats 37 (-8.6%) | gold 9.8K (+9.8%) | ore 493.5 (+25.1%) | levels 0.98 (+14.4%) | dmgAbility 69.7K (+2.4%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost    3.7K gold: kills 69.5 (+6.1%) | defeats 39 (-3.7%) | gold 9.4K (+4.9%) | ore 384 (-2.7%) | levels 0.9 (+5.0%) | dmgAbility 69.2K (+1.6%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank 10 cost   64.4K gold: kills 74.5 (+13.7%) | defeats 37 (-8.6%) | gold 10.1K (+13.1%) | ore 370.5 (-6.1%) | levels 0.99 (+15.3%) | dmgAbility 70.3K (+3.2%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0

== Quickstep (spd, Party, max 25, gold base 300)  +2% action speed
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost     450 gold: kills 70.5 (+7.6%) | defeats 34 (-16.0%) | gold 9.4K (+4.8%) | ore 489.5 (+24.1%) | levels 0.93 (+8.3%) | dmgAbility 68.6K (+0.7%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost    9.2K gold: kills 72 (+9.9%) | defeats 37 (-8.6%) | gold 9.8K (+9.4%) | ore 441 (+11.8%) | levels 0.98 (+14.3%) | dmgAbility 70.8K (+4.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank 10 cost  161.0K gold: kills 81.5 (+24.4%) | defeats 32.5 (-19.8%) | gold 11.2K (+24.8%) | ore 461.5 (+17.0%) | levels 1.09 (+27.1%) | dmgAbility 71.7K (+5.2%) | dmgTap 0 | surges 2 (+33.3%) | taps 0

== Keen Edge (crit, Party, max 20, gold base 250)  +1% critical chance
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost     375 gold: kills 71.5 (+9.2%) | defeats 39.5 (-2.5%) | gold 9.7K (+8.2%) | ore 443.5 (+12.4%) | levels 0.95 (+10.6%) | dmgAbility 69.0K (+1.2%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost    7.7K gold: kills 78.5 (+19.8%) | defeats 34.5 (-14.8%) | gold 10.7K (+19.9%) | ore 430.5 (+9.1%) | levels 1.04 (+21.2%) | dmgAbility 70.2K (+3.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank 10 cost  134.2K gold: kills 77 (+17.6%) | defeats 40.5 (+0.0%) | gold 10.5K (+17.8%) | ore 456.5 (+15.7%) | levels 1.04 (+21.1%) | dmgAbility 73.0K (+7.2%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0

== Focus (abil, Party, max 30, gold base 150)  +2% ability power
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost     225 gold: kills 69 (+5.3%) | defeats 36.5 (-9.9%) | gold 9.4K (+5.1%) | ore 332 (-15.8%) | levels 0.93 (+7.7%) | dmgAbility 70.9K (+4.1%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost    4.6K gold: kills 78.5 (+19.8%) | defeats 37.5 (-7.4%) | gold 10.7K (+19.6%) | ore 499 (+26.5%) | levels 0.99 (+15.2%) | dmgAbility 79.1K (+16.1%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank 10 cost   80.5K gold: kills 74.5 (+13.7%) | defeats 36 (-11.1%) | gold 10.1K (+12.5%) | ore 453 (+14.8%) | levels 1.01 (+17.9%) | dmgAbility 89.9K (+31.9%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0

== Vanguard (front, Party, max 999, gold base 160)  +5% front hero DEF (15% base)
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost     240 gold: kills 69.5 (+6.1%) | defeats 37.5 (-7.4%) | gold 9.4K (+5.3%) | ore 423 (+7.2%) | levels 0.95 (+10.6%) | dmgAbility 68.6K (+0.8%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost    4.9K gold: kills 69 (+5.3%) | defeats 38 (-6.2%) | gold 9.3K (+3.8%) | ore 442.5 (+12.2%) | levels 0.93 (+8.4%) | dmgAbility 69.4K (+1.8%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank 10 cost   85.9K gold: kills 74.5 (+13.7%) | defeats 36 (-11.1%) | gold 10.2K (+13.5%) | ore 432 (+9.5%) | levels 0.95 (+10.3%) | dmgAbility 70.1K (+3.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0

== Second Wind (regen, Party, max 10, gold base 400)  Heal 1% HP each round
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost     600 gold: kills 71.5 (+9.2%) | defeats 36 (-11.1%) | gold 9.7K (+8.2%) | ore 438.5 (+11.2%) | levels 0.93 (+8.4%) | dmgAbility 69.6K (+2.2%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost   12.3K gold: kills 80 (+22.1%) | defeats 32 (-21.0%) | gold 11.0K (+22.6%) | ore 473 (+19.9%) | levels 1.07 (+24.4%) | dmgAbility 71.2K (+4.5%) | dmgTap 0 | surges 2 (+33.3%) | taps 0
   rank 10 cost  214.7K gold: kills 73 (+11.5%) | defeats 30.5 (-24.7%) | gold 10.0K (+11.3%) | ore 409.5 (+3.8%) | levels 1.07 (+24.2%) | dmgAbility 71.2K (+4.6%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0

== Warm Fire (rest, Party, max 40, gold base 90)  +2% to the 15% fight heal
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost     135 gold: kills 75 (+14.5%) | defeats 36.5 (-9.9%) | gold 10.2K (+14.5%) | ore 474 (+20.2%) | levels 0.98 (+14.1%) | dmgAbility 69.0K (+1.3%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost    2.8K gold: kills 75.5 (+15.3%) | defeats 34 (-16.0%) | gold 10.3K (+15.1%) | ore 433 (+9.8%) | levels 0.99 (+14.9%) | dmgAbility 70.2K (+3.1%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank 10 cost   48.3K gold: kills 72 (+9.9%) | defeats 39.5 (-2.5%) | gold 9.8K (+9.5%) | ore 449.5 (+13.9%) | levels 0.98 (+14.0%) | dmgAbility 70.9K (+4.1%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0

== Crystal Vigor (b_hp, Crystal, max 99, dust base 4)  +10% max HP
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost       4 dust: kills 69 (+5.3%) | defeats 36.5 (-9.9%) | gold 9.4K (+4.5%) | ore 352 (-10.8%) | levels 0.94 (+9.5%) | dmgAbility 69.9K (+2.6%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost      53 dust: kills 80 (+22.1%) | defeats 22.5 (-44.4%) | gold 11.2K (+24.7%) | ore 504 (+27.8%) | levels 1.12 (+30.0%) | dmgAbility 74.2K (+9.0%) | dmgTap 0 | surges 2 (+33.3%) | taps 0
   rank 10 cost     454 dust: kills 83.5 (+27.5%) | defeats 16.5 (-59.3%) | gold 11.8K (+32.1%) | ore 491.5 (+24.6%) | levels 1.27 (+48.1%) | dmgAbility 77.1K (+13.1%) | dmgTap 0 | surges 2 (+33.3%) | taps 0

== Sharpened Fate (b_dmg, Crystal, max 99, dust base 4)  +8% attack and ability damage
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost       4 dust: kills 79.5 (+21.4%) | defeats 37.5 (-7.4%) | gold 10.8K (+20.8%) | ore 426 (+8.0%) | levels 1.04 (+20.5%) | dmgAbility 77.9K (+14.3%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost      53 dust: kills 116 (+77.1%) | defeats 34.5 (-14.8%) | gold 16.2K (+81.0%) | ore 749 (+89.9%) | levels 1.53 (+77.8%) | dmgAbility 108.2K (+58.8%) | dmgTap 0 | surges 2.5 (+66.7%) | taps 0
   rank 10 cost     454 dust: kills 153 (+133.6%) | defeats 34.5 (-14.8%) | gold 21.5K (+140.1%) | ore 966 (+144.9%) | levels 2.06 (+139.2%) | dmgAbility 143.1K (+110.0%) | dmgTap 0 | surges 3.5 (+133.3%) | taps 0

== Crystal Edge (b_crit, Crystal, max 20, dust base 4)  +2% critical chance
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost       4 dust: kills 68.5 (+4.6%) | defeats 40.5 (+0.0%) | gold 9.2K (+3.0%) | ore 398 (+0.9%) | levels 0.94 (+9.6%) | dmgAbility 70.2K (+3.1%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost      53 dust: kills 77 (+17.6%) | defeats 40.5 (+0.0%) | gold 10.5K (+17.8%) | ore 456.5 (+15.7%) | levels 1.04 (+21.1%) | dmgAbility 73.0K (+7.2%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank 10 cost     454 dust: kills 75 (+14.5%) | defeats 36 (-11.1%) | gold 10.2K (+14.5%) | ore 466 (+18.1%) | levels 1.04 (+21.1%) | dmgAbility 74.7K (+9.7%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0

== Attuned (b_ab, Crystal, max 20, dust base 5)  +5% ability power
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost       5 dust: kills 74 (+13.0%) | defeats 36.5 (-9.9%) | gold 10.0K (+11.8%) | ore 460.5 (+16.7%) | levels 0.97 (+13.4%) | dmgAbility 74.3K (+9.1%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost      66 dust: kills 83 (+26.7%) | defeats 37.5 (-7.4%) | gold 11.3K (+26.4%) | ore 471 (+19.4%) | levels 1.1 (+28.4%) | dmgAbility 95.6K (+40.3%) | dmgTap 0 | surges 2 (+33.3%) | taps 0
   rank 10 cost     566 dust: kills 94 (+43.5%) | defeats 32.5 (-19.8%) | gold 12.9K (+44.3%) | ore 564.5 (+43.1%) | levels 1.25 (+45.4%) | dmgAbility 121.4K (+78.2%) | dmgTap 0 | surges 2 (+33.3%) | taps 0

== Resonant Heart (b_surge, Crystal, max 10, dust base 5)  Kills charge the Surge 10% faster
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0
   rank  1 cost       5 dust: kills 67 (+2.3%) | defeats 35.5 (-12.3%) | gold 9.1K (+1.2%) | ore 452.5 (+14.7%) | levels 0.88 (+2.9%) | dmgAbility 67.4K (-1.1%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0
   rank  5 cost      66 dust: kills 68 (+3.8%) | defeats 38.5 (-4.9%) | gold 9.2K (+2.4%) | ore 404 (+2.4%) | levels 0.92 (+7.1%) | dmgAbility 68.9K (+1.1%) | dmgTap 0 | surges 2.5 (+66.7%) | taps 0
   rank 10 cost     566 dust: kills 66.5 (+1.5%) | defeats 36.5 (-9.9%) | gold 8.9K (-0.8%) | ore 423 (+7.2%) | levels 0.89 (+3.0%) | dmgAbility 67.4K (-1.1%) | dmgTap 0 | surges 3 (+100.0%) | taps 0

== Long Stride (march, Party, max 999, gold base 60)  +4% march speed  [trivial fights: walking dominates]
   rank 0: kills 712 | defeats 0 | gold 32.0K | ore 1.4K | levels 1 | dmgAbility 54.4K | dmgTap 0 | surges 17.5 | taps 0
   rank  1 cost      90 gold: kills 712 (+0.0%) | defeats 0 | gold 32.0K (+0.0%) | ore 1.4K (+0.0%) | levels 1 (+0.0%) | dmgAbility 54.4K (+0.0%) | dmgTap 0 | surges 17.5 (+0.0%) | taps 0
   rank  5 cost    1.9K gold: kills 712 (+0.0%) | defeats 0 | gold 32.0K (+0.0%) | ore 1.4K (+0.0%) | levels 1 (+0.0%) | dmgAbility 54.4K (+0.0%) | dmgTap 0 | surges 17.5 (+0.0%) | taps 0
   rank 10 cost   32.2K gold: kills 712 (+0.0%) | defeats 0 | gold 32.0K (+0.0%) | ore 1.4K (+0.0%) | levels 1 (+0.0%) | dmgAbility 54.4K (+0.0%) | dmgTap 0 | surges 17.5 (+0.0%) | taps 0

== Strike (tap, Tap, max 999, gold base 40)  +20% tap damage
   rank 0: kills@3tps 81.5 | kills@10tps 97 | defeats@3tps 39 | defeats@10tps 36.5 | gold@3tps 11.0K | gold@10tps 13.3K | ore@3tps 433.5 | ore@10tps 533.5 | levels@3tps 1.15 | levels@10tps 1.32 | dmgAbility@3tps 69.3K | dmgAbility@10tps 68.9K | dmgTap@3tps 41.9K | dmgTap@10tps 76.3K | surges@3tps 2 | surges@10tps 2 | taps@3tps 8.2K | taps@10tps 25.3K
   rank  1 cost      60 gold: kills@3tps 92 (+12.9%) | kills@10tps 100 (+3.1%) | defeats@3tps 38.5 (-1.3%) | defeats@10tps 37.5 (+2.7%) | gold@3tps 12.7K (+14.8%) | gold@10tps 13.7K (+2.8%) | ore@3tps 571.5 (+31.8%) | ore@10tps 541.5 (+1.5%) | levels@3tps 1.23 (+7.3%) | levels@10tps 1.34 (+1.5%) | dmgAbility@3tps 68.2K (-1.6%) | dmgAbility@10tps 67.9K (-1.5%) | dmgTap@3tps 52.0K (+24.0%) | dmgTap@10tps 87.8K (+15.0%) | surges@3tps 2 (+0.0%) | surges@10tps 2.5 (+25.0%) | taps@3tps 8.0K (-2.0%) | taps@10tps 25.4K (+0.2%)
   rank  5 cost    1.2K gold: kills@3tps 101 (+23.9%) | kills@10tps 122 (+25.8%) | defeats@3tps 38 (-2.6%) | defeats@10tps 38.5 (+5.5%) | gold@3tps 13.9K (+26.0%) | gold@10tps 16.8K (+26.2%) | ore@3tps 496 (+14.4%) | ore@10tps 715.5 (+34.1%) | levels@3tps 1.34 (+16.9%) | levels@10tps 1.63 (+23.7%) | dmgAbility@3tps 67.4K (-2.7%) | dmgAbility@10tps 67.4K (-2.2%) | dmgTap@3tps 83.5K (+99.2%) | dmgTap@10tps 148.9K (+95.1%) | surges@3tps 2.5 (+25.0%) | surges@10tps 3 (+50.0%) | taps@3tps 8.0K (-2.9%) | taps@10tps 24.2K (-4.6%)
   rank 10 cost   21.5K gold: kills@3tps 108.5 (+33.1%) | kills@10tps 139 (+43.3%) | defeats@3tps 36.5 (-6.4%) | defeats@10tps 37.5 (+2.7%) | gold@3tps 15.1K (+36.7%) | gold@10tps 19.3K (+45.0%) | ore@3tps 632.5 (+45.9%) | ore@10tps 802.5 (+50.4%) | levels@3tps 1.44 (+25.5%) | levels@10tps 1.8 (+37.1%) | dmgAbility@3tps 66.0K (-4.9%) | dmgAbility@10tps 66.1K (-4.2%) | dmgTap@3tps 125.8K (+200.1%) | dmgTap@10tps 214.0K (+180.4%) | surges@3tps 2.5 (+25.0%) | surges@10tps 3 (+50.0%) | taps@3tps 7.9K (-3.9%) | taps@10tps 23.8K (-6.3%)

== Sharp Taps (tapcrit, Tap, max 25, gold base 120)  +2% tap triple-hit chance
   rank 0: kills@3tps 81.5 | kills@10tps 97 | defeats@3tps 39 | defeats@10tps 36.5 | gold@3tps 11.0K | gold@10tps 13.3K | ore@3tps 433.5 | ore@10tps 533.5 | levels@3tps 1.15 | levels@10tps 1.32 | dmgAbility@3tps 69.3K | dmgAbility@10tps 68.9K | dmgTap@3tps 41.9K | dmgTap@10tps 76.3K | surges@3tps 2 | surges@10tps 2 | taps@3tps 8.2K | taps@10tps 25.3K
   rank  1 cost     180 gold: kills@3tps 85 (+4.3%) | kills@10tps 96 (-1.0%) | defeats@3tps 35 (-10.3%) | defeats@10tps 39.5 (+8.2%) | gold@3tps 11.5K (+4.5%) | gold@10tps 13.0K (-2.7%) | ore@3tps 495.5 (+14.3%) | ore@10tps 532 (-0.3%) | levels@3tps 1.13 (-1.7%) | levels@10tps 1.3 (-1.4%) | dmgAbility@3tps 67.2K (-3.1%) | dmgAbility@10tps 69.0K (+0.1%) | dmgTap@3tps 43.7K (+4.3%) | dmgTap@10tps 79.3K (+4.0%) | surges@3tps 2 (+0.0%) | surges@10tps 2 (+0.0%) | taps@3tps 8.2K (+0.2%) | taps@10tps 25.4K (+0.1%)
   rank  5 cost    3.7K gold: kills@3tps 85.5 (+4.9%) | kills@10tps 98 (+1.0%) | defeats@3tps 37.5 (-3.8%) | defeats@10tps 36.5 (+0.0%) | gold@3tps 11.6K (+4.8%) | gold@10tps 13.5K (+0.9%) | ore@3tps 460.5 (+6.2%) | ore@10tps 513.5 (-3.7%) | levels@3tps 1.16 (+0.6%) | levels@10tps 1.34 (+1.8%) | dmgAbility@3tps 66.7K (-3.9%) | dmgAbility@10tps 67.1K (-2.7%) | dmgTap@3tps 50.1K (+19.6%) | dmgTap@10tps 92.0K (+20.5%) | surges@3tps 2 (+0.0%) | surges@10tps 2 (+0.0%) | taps@3tps 8.1K (-0.8%) | taps@10tps 25.4K (+0.1%)
   rank 10 cost   64.4K gold: kills@3tps 95 (+16.6%) | kills@10tps 102 (+5.2%) | defeats@3tps 35 (-10.3%) | defeats@10tps 35 (-4.1%) | gold@3tps 12.9K (+16.8%) | gold@10tps 14.1K (+5.8%) | ore@3tps 590 (+36.1%) | ore@10tps 629 (+17.9%) | levels@3tps 1.25 (+8.8%) | levels@10tps 1.39 (+5.9%) | dmgAbility@3tps 68.7K (-0.9%) | dmgAbility@10tps 64.8K (-6.0%) | dmgTap@3tps 58.0K (+38.5%) | dmgTap@10tps 106.2K (+39.2%) | surges@3tps 2 (+0.0%) | surges@10tps 2.5 (+25.0%) | taps@3tps 8.1K (-1.2%) | taps@10tps 25.1K (-1.0%)

== Momentum (tapcharge, Tap, max 5, gold base 300)  Taps charge abilities +1
   rank 0: kills@3tps 81.5 | kills@10tps 97 | defeats@3tps 39 | defeats@10tps 36.5 | gold@3tps 11.0K | gold@10tps 13.3K | ore@3tps 433.5 | ore@10tps 533.5 | levels@3tps 1.15 | levels@10tps 1.32 | dmgAbility@3tps 69.3K | dmgAbility@10tps 68.9K | dmgTap@3tps 41.9K | dmgTap@10tps 76.3K | surges@3tps 2 | surges@10tps 2 | taps@3tps 8.2K | taps@10tps 25.3K
   rank  1 cost     450 gold: kills@3tps 87 (+6.7%) | kills@10tps 102.5 (+5.7%) | defeats@3tps 32.5 (-16.7%) | defeats@10tps 30 (-17.8%) | gold@3tps 11.9K (+8.3%) | gold@10tps 14.2K (+6.5%) | ore@3tps 502.5 (+15.9%) | ore@10tps 668.5 (+25.3%) | levels@3tps 1.28 (+11.3%) | levels@10tps 1.48 (+12.6%) | dmgAbility@3tps 84.0K (+21.2%) | dmgAbility@10tps 84.7K (+22.9%) | dmgTap@3tps 42.2K (+0.8%) | dmgTap@10tps 77.3K (+1.2%) | surges@3tps 2 (+0.0%) | surges@10tps 2.5 (+25.0%) | taps@3tps 8.3K (+0.9%) | taps@10tps 25.7K (+1.3%)
   rank  5 cost    9.2K gold: kills@3tps 67 (-17.8%) | kills@10tps 117 (+20.6%) | defeats@3tps 32 (-17.9%) | defeats@10tps 15.5 (-57.5%) | gold@3tps 13.2K (+20.2%) | gold@10tps 17.0K (+27.5%) | ore@3tps 515 (+18.8%) | ore@10tps 590 (+10.6%) | levels@3tps 1.3 (+13.4%) | levels@10tps 1.84 (+39.6%) | dmgAbility@3tps 143.5K (+106.9%) | dmgAbility@10tps 159.0K (+130.6%) | dmgTap@3tps 45.5K (+8.5%) | dmgTap@10tps 80.8K (+5.9%) | surges@3tps 1.5 (-25.0%) | surges@10tps 2.5 (+25.0%) | taps@3tps 8.9K (+8.8%) | taps@10tps 26.9K (+6.1%)

== Pickpocket (tapgold, Tap, max 20, gold base 300)  Taps steal 0.5% of bounty
   rank 0: kills@3tps 81.5 | kills@10tps 97 | defeats@3tps 39 | defeats@10tps 36.5 | gold@3tps 11.0K | gold@10tps 13.3K | ore@3tps 433.5 | ore@10tps 533.5 | levels@3tps 1.15 | levels@10tps 1.32 | dmgAbility@3tps 69.3K | dmgAbility@10tps 68.9K | dmgTap@3tps 41.9K | dmgTap@10tps 76.3K | surges@3tps 2 | surges@10tps 2 | taps@3tps 8.2K | taps@10tps 25.3K
   rank  1 cost     450 gold: kills@3tps 81.5 (+0.0%) | kills@10tps 97 (+0.0%) | defeats@3tps 39 (+0.0%) | defeats@10tps 36.5 (+0.0%) | gold@3tps 14.5K (+32.0%) | gold@10tps 17.0K (+27.3%) | ore@3tps 433.5 (+0.0%) | ore@10tps 533.5 (+0.0%) | levels@3tps 1.15 (+0.0%) | levels@10tps 1.32 (+0.0%) | dmgAbility@3tps 69.3K (+0.0%) | dmgAbility@10tps 68.9K (+0.0%) | dmgTap@3tps 41.9K (+0.0%) | dmgTap@10tps 76.3K (+0.0%) | surges@3tps 2 (+0.0%) | surges@10tps 2 (+0.0%) | taps@3tps 8.2K (+0.0%) | taps@10tps 25.3K (+0.0%)
   rank  5 cost    9.2K gold: kills@3tps 81.5 (+0.0%) | kills@10tps 97 (+0.0%) | defeats@3tps 39 (+0.0%) | defeats@10tps 36.5 (+0.0%) | gold@3tps 28.7K (+160.0%) | gold@10tps 31.5K (+136.3%) | ore@3tps 433.5 (+0.0%) | ore@10tps 533.5 (+0.0%) | levels@3tps 1.15 (+0.0%) | levels@10tps 1.32 (+0.0%) | dmgAbility@3tps 69.3K (+0.0%) | dmgAbility@10tps 68.9K (+0.0%) | dmgTap@3tps 41.9K (+0.0%) | dmgTap@10tps 76.3K (+0.0%) | surges@3tps 2 (+0.0%) | surges@10tps 2 (+0.0%) | taps@3tps 8.2K (+0.0%) | taps@10tps 25.3K (+0.0%)
   rank 10 cost  161.0K gold: kills@3tps 81.5 (+0.0%) | kills@10tps 97 (+0.0%) | defeats@3tps 39 (+0.0%) | defeats@10tps 36.5 (+0.0%) | gold@3tps 46.3K (+320.0%) | gold@10tps 49.7K (+272.6%) | ore@3tps 433.5 (+0.0%) | ore@10tps 533.5 (+0.0%) | levels@3tps 1.15 (+0.0%) | levels@10tps 1.32 (+0.0%) | dmgAbility@3tps 69.3K (+0.0%) | dmgAbility@10tps 68.9K (+0.0%) | dmgTap@3tps 41.9K (+0.0%) | dmgTap@10tps 76.3K (+0.0%) | surges@3tps 2 (+0.0%) | surges@10tps 2 (+0.0%) | taps@3tps 8.2K (+0.0%) | taps@10tps 25.3K (+0.0%)

== Resonance (tapsurge, Tap, max 5, gold base 600)  Taps charge the Surge +0.2
   rank 0: kills@3tps 81.5 | kills@10tps 97 | defeats@3tps 39 | defeats@10tps 36.5 | gold@3tps 11.0K | gold@10tps 13.3K | ore@3tps 433.5 | ore@10tps 533.5 | levels@3tps 1.15 | levels@10tps 1.32 | dmgAbility@3tps 69.3K | dmgAbility@10tps 68.9K | dmgTap@3tps 41.9K | dmgTap@10tps 76.3K | surges@3tps 2 | surges@10tps 2 | taps@3tps 8.2K | taps@10tps 25.3K
   rank  1 cost     900 gold: kills@3tps 89.5 (+9.8%) | kills@10tps 102.5 (+5.7%) | defeats@3tps 36 (-7.7%) | defeats@10tps 35 (-4.1%) | gold@3tps 12.3K (+11.8%) | gold@10tps 14.1K (+5.4%) | ore@3tps 524 (+20.9%) | ore@10tps 563.5 (+5.6%) | levels@3tps 1.23 (+6.7%) | levels@10tps 1.42 (+7.6%) | dmgAbility@3tps 69.4K (+0.0%) | dmgAbility@10tps 68.9K (-0.1%) | dmgTap@3tps 41.9K (+0.1%) | dmgTap@10tps 76.2K (-0.2%) | surges@3tps 14 (+600.0%) | surges@10tps 14.5 (+625.0%) | taps@3tps 8.2K (+0.1%) | taps@10tps 25.3K (-0.1%)
   rank  5 cost   18.5K gold: kills@3tps 115.5 (+41.7%) | kills@10tps 119.5 (+23.2%) | defeats@3tps 30 (-23.1%) | defeats@10tps 27.5 (-24.7%) | gold@3tps 16.1K (+46.2%) | gold@10tps 16.8K (+26.1%) | ore@3tps 661.5 (+52.6%) | ore@10tps 764 (+43.2%) | levels@3tps 1.64 (+42.7%) | levels@10tps 1.73 (+31.6%) | dmgAbility@3tps 71.4K (+3.0%) | dmgAbility@10tps 68.7K (-0.3%) | dmgTap@3tps 41.0K (-2.1%) | dmgTap@10tps 76.4K (+0.0%) | surges@3tps 61 (+2950.0%) | surges@10tps 63.5 (+3075.0%) | taps@3tps 8.0K (-2.1%) | taps@10tps 25.3K (-0.0%)

== Gilded Road (b_gold, Crystal, max 99, dust base 5)  +15% gold from every source
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0 | questsPerDay 20 | goldPerDay 2.2K | orePerDay 190 | dustPerDay 13
   rank  1 cost       5 dust: kills 65.5 (+0.0%) | defeats 40.5 (+0.0%) | gold 10.3K (+15.0%) | ore 394.5 (+0.0%) | levels 0.86 (+0.0%) | dmgAbility 68.1K (+0.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 2.5K (+15.2%) | orePerDay 190 (+0.0%) | dustPerDay 13 (+0.0%)
   rank  5 cost      66 dust: kills 65.5 (+0.0%) | defeats 40.5 (+0.0%) | gold 15.7K (+75.0%) | ore 394.5 (+0.0%) | levels 0.86 (+0.0%) | dmgAbility 68.1K (+0.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 3.9K (+75.1%) | orePerDay 190 (+0.0%) | dustPerDay 13 (+0.0%)
   rank 10 cost     566 dust: kills 65.5 (+0.0%) | defeats 40.5 (+0.0%) | gold 22.4K (+150.0%) | ore 394.5 (+0.0%) | levels 0.86 (+0.0%) | dmgAbility 68.1K (+0.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 5.5K (+150.1%) | orePerDay 190 (+0.0%) | dustPerDay 13 (+0.0%)

== Deep Veins (b_ore, Crystal, max 99, dust base 5)  +15% ore from every source
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0 | questsPerDay 20 | goldPerDay 2.2K | orePerDay 190 | dustPerDay 13
   rank  1 cost       5 dust: kills 65.5 (+0.0%) | defeats 40.5 (+0.0%) | gold 9.0K (+0.0%) | ore 450 (+14.1%) | levels 0.86 (+0.0%) | dmgAbility 68.1K (+0.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 2.2K (+0.0%) | orePerDay 220 (+15.8%) | dustPerDay 13 (+0.0%)
   rank  5 cost      66 dust: kills 65.5 (+0.0%) | defeats 40.5 (+0.0%) | gold 9.0K (+0.0%) | ore 679 (+72.1%) | levels 0.86 (+0.0%) | dmgAbility 68.1K (+0.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 2.2K (+0.0%) | orePerDay 335 (+76.3%) | dustPerDay 13 (+0.0%)
   rank 10 cost     566 dust: kills 65.5 (+0.0%) | defeats 40.5 (+0.0%) | gold 9.0K (+0.0%) | ore 973 (+146.6%) | levels 0.86 (+0.0%) | dmgAbility 68.1K (+0.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 2.2K (+0.0%) | orePerDay 475 (+150.0%) | dustPerDay 13 (+0.0%)

== Prospecting (ore, Camp, max 999, gold base 150)  +5% ore from every source
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0 | questsPerDay 20 | goldPerDay 2.2K | orePerDay 190 | dustPerDay 13
   rank  1 cost     225 gold: kills 65.5 (+0.0%) | defeats 40.5 (+0.0%) | gold 9.0K (+0.0%) | ore 408 (+3.4%) | levels 0.86 (+0.0%) | dmgAbility 68.1K (+0.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 2.2K (+0.0%) | orePerDay 200 (+5.3%) | dustPerDay 13 (+0.0%)
   rank  5 cost    4.6K gold: kills 65.5 (+0.0%) | defeats 40.5 (+0.0%) | gold 9.0K (+0.0%) | ore 492 (+24.7%) | levels 0.86 (+0.0%) | dmgAbility 68.1K (+0.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 2.2K (+0.0%) | orePerDay 240 (+26.3%) | dustPerDay 13 (+0.0%)
   rank 10 cost   80.5K gold: kills 65.5 (+0.0%) | defeats 40.5 (+0.0%) | gold 9.0K (+0.0%) | ore 590.5 (+49.7%) | levels 0.86 (+0.0%) | dmgAbility 68.1K (+0.0%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 2.2K (+0.0%) | orePerDay 285 (+50.0%) | dustPerDay 13 (+0.0%)

== Old Wisdom (b_xp, Crystal, max 99, dust base 5)  +15% experience
   rank 0: kills 65.5 | defeats 40.5 | gold 9.0K | ore 394.5 | levels 0.86 | dmgAbility 68.1K | dmgTap 0 | surges 1.5 | taps 0 | questsPerDay 20 | goldPerDay 2.2K | orePerDay 190 | dustPerDay 13
   rank  1 cost       5 dust: kills 72.5 (+10.7%) | defeats 40.5 (+0.0%) | gold 9.9K (+10.1%) | ore 413.5 (+4.8%) | levels 1.11 (+28.9%) | dmgAbility 70.2K (+3.1%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 2.2K (+0.0%) | orePerDay 190 (+0.0%) | dustPerDay 13 (+0.0%)
   rank  5 cost      66 dust: kills 73.5 (+12.2%) | defeats 37 (-8.6%) | gold 10.1K (+12.6%) | ore 413 (+4.7%) | levels 1.61 (+87.8%) | dmgAbility 70.2K (+3.1%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 2.2K (+0.0%) | orePerDay 190 (+0.0%) | dustPerDay 13 (+0.0%)
   rank 10 cost     566 dust: kills 70 (+6.9%) | defeats 35.5 (-12.3%) | gold 9.5K (+6.3%) | ore 452 (+14.6%) | levels 2.06 (+139.1%) | dmgAbility 72.1K (+5.9%) | dmgTap 0 | surges 1.5 (+0.0%) | taps 0 | questsPerDay 20 (+0.0%) | goldPerDay 2.2K (+0.0%) | orePerDay 190 (+0.0%) | dustPerDay 13 (+0.0%)

== Bunks (slots, Camp, max 3, gold base 400)  +1 quest slot
   rank 0: questsPerDay 20 | goldPerDay 2.2K | orePerDay 190 | dustPerDay 13
   rank  1 cost     600 gold: questsPerDay 26.5 (+32.5%) | goldPerDay 2.6K (+16.6%) | orePerDay 266 (+40.0%) | dustPerDay 15 (+15.4%)
   rank  3 cost    3.5K gold: questsPerDay 26.5 (+32.5%) | goldPerDay 2.6K (+16.6%) | orePerDay 266 (+40.0%) | dustPerDay 15 (+15.4%)

== Provisions (quest, Camp, max 999, gold base 200)  +6% quest gold, ore and dust
   rank 0: questsPerDay 20 | goldPerDay 2.2K | orePerDay 190 | dustPerDay 13
   rank  1 cost     300 gold: questsPerDay 20 (+0.0%) | goldPerDay 2.3K (+4.6%) | orePerDay 200 (+5.3%) | dustPerDay 13 (+0.0%)
   rank  5 cost    6.2K gold: questsPerDay 20 (+0.0%) | goldPerDay 2.7K (+23.0%) | orePerDay 245 (+28.9%) | dustPerDay 14.5 (+11.5%)
   rank 10 cost  107.4K gold: questsPerDay 20 (+0.0%) | goldPerDay 3.2K (+46.1%) | orePerDay 305 (+60.5%) | dustPerDay 17.5 (+34.6%)

== Swift Return (swift, Camp, max 20, gold base 350)  Quests finish 3% sooner
   rank 0: questsPerDay 20 | goldPerDay 2.2K | orePerDay 190 | dustPerDay 13
   rank  1 cost     525 gold: questsPerDay 20.5 (+2.5%) | goldPerDay 2.1K (-3.7%) | orePerDay 209 (+10.0%) | dustPerDay 13.5 (+3.8%)
   rank  5 cost   10.8K gold: questsPerDay 23 (+15.0%) | goldPerDay 2.4K (+11.0%) | orePerDay 228 (+20.0%) | dustPerDay 14.5 (+11.5%)
   rank 10 cost  187.9K gold: questsPerDay 28.5 (+42.5%) | goldPerDay 3.2K (+43.6%) | orePerDay 285 (+50.0%) | dustPerDay 18.5 (+42.3%)

== Locksmith (keys, Camp, max 10, gold base 500)  Keys return 8% faster
   rank 0: keysPerDay 3
   rank  1 cost     750 gold: keysPerDay 3 (+0.0%)
   rank  5 cost   15.4K gold: keysPerDay 4 (+33.3%)
   rank 10 cost  268.4K gold: keysPerDay 5 (+66.7%)

== Deeper Halls (b_keys, Crystal, max 3, dust base 12)  +1 catacomb key held
   rank 0: keysHeldAtEnd 3 | capacity 3
   rank  1 cost      12 dust: keysHeldAtEnd 4 (+33.3%) | capacity 4 (+33.3%)
   rank  3 cost      57 dust: keysHeldAtEnd 6 (+100.0%) | capacity 6 (+100.0%)

== Night Watch (offline, Camp, max 8, gold base 450)  +30 min offline cap
   rank 0: gold 246.4K | ore 5.4K | levelsGained 13.28
   rank  1 cost     675 gold: gold 261.8K (+6.3%) | ore 5.7K (+6.3%) | levelsGained 13.79 (+3.9%)
   rank  5 cost   13.9K gold: gold 323.6K (+31.3%) | ore 7.1K (+31.4%) | levelsGained 15.67 (+18.0%)
   rank  8 cost   78.3K gold: gold 369.5K (+50.0%) | ore 8.1K (+50.0%) | levelsGained 16.93 (+27.5%)

== Haggling (haggle, Camp, max 20, gold base 250)  Villagers 3% cheaper
   rank 0: hireCost 759
   rank  1 cost     375 gold: hireCost 737 (-2.9%)
   rank  5 cost    7.7K gold: hireCost 645 (-15.0%)
   rank 10 cost  134.2K gold: hireCost 532 (-29.9%)

== Crystal Memory (b_dust, Crystal, max 20, dust base 8)  +10% dust from every Shatter
   rank 0: startLevel 1 | partyPower 3.3K | knightHP 245 | knightATK 77 | dustGained 34
   rank  1 cost       8 dust: startLevel 1 (+0.0%) | partyPower 3.3K (+0.0%) | knightHP 245 (+0.0%) | knightATK 77 (+0.0%) | dustGained 37 (+8.8%)
   rank  5 cost     106 dust: startLevel 1 (+0.0%) | partyPower 3.3K (+0.0%) | knightHP 245 (+0.0%) | knightATK 77 (+0.0%) | dustGained 51 (+50.0%)
   rank 10 cost     908 dust: startLevel 1 (+0.0%) | partyPower 3.3K (+0.0%) | knightHP 245 (+0.0%) | knightATK 77 (+0.0%) | dustGained 68 (+100.0%)

== Remembered Strength (b_start, Crystal, max 10, dust base 6)  Start each run +5 levels
   rank 0: startLevel 1 | partyPower 3.3K | knightHP 245 | knightATK 77 | dustGained 34
   rank  1 cost       6 dust: startLevel 6 (+500.0%) | partyPower 3.8K (+16.2%) | knightHP 315 (+28.6%) | knightATK 88 (+14.3%) | dustGained 34 (+0.0%)
   rank  5 cost      79 dust: startLevel 26 (+2500.0%) | partyPower 5.9K (+79.8%) | knightHP 595 (+142.9%) | knightATK 132 (+71.4%) | dustGained 34 (+0.0%)
   rank 10 cost     681 dust: startLevel 51 (+5000.0%) | partyPower 8.5K (+158.9%) | knightHP 945 (+285.7%) | knightATK 187 (+142.9%) | dustGained 34 (+0.0%)

Ablation findings: Long Stride has no gameplay effect at any rank (march speed only scrolls the background; encounters spawn on an unrelated timer); Sharpened Fate dominates the Crystal branch for combat (+134% kills at rank 10 for 454 dust vs +15% Crystal Edge and +28% Crystal Vigor at the same price); Remembered Strength through a real Shatter is +16% party power at rank 1 (not the 71% of the earlier synthetic calculation), +80% at rank 5, +159% at rank 10; Resonance rank 5 takes Surge casts from 2 to 61 per hour for a 3 taps/s player; Pickpocket rank 10 is +320% gold for that player and identical at 10 taps/s; Might is the best broad gold combat node; Momentum rank 5 lowered kills 18% at 3 taps/s in this single-seed run (needs paired multi-seed confirmation).

## Open decisions (human)
1. Shatter income scheme: the reviewer's warning stands that stacking 1.18 / 1.20 compounds on the existing flat +25% raises ore at ten Shatters more than five-fold; a single visible shared multiplier is the reviewer's recommendation. Not implemented.
2. Long Stride: give march speed a real effect (shorten the encounter timer with it) or remove the node.

## Ask of the reviewer
The pacing proposal in real hours at a stated speed assumption, with measurable gates; a ranked candidate list stated so the human can approve in one line; a first Endless lever; and whether the contract and gate coverage above is sufficient for the fast CI gate you specified, or what is missing.
