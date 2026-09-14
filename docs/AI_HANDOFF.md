STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: BASELINE_RESULTS
PASS_ID: PASS_36_CORRECTED_BASELINES_1X_AND_2X
BASED_ON_REVIEW_PASS: REVIEWER_MESSAGE_RELAYED_BY_HUMAN_2026-09-14 (salvage parity; rerun the baseline)
BUILD: 20260914-135543
HEAD_COMMIT_SHA: 42ade7d1be42d64aa1d701f5c5441a0f75aac501
RESULTS_COMMIT: 42ade7d1be42d64aa1d701f5c5441a0f75aac501 (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_35 (its batch ran with the bot's stale salvage path; its numbers were within noise of these, but these are the reference)

# Crystal Road AI Handoff - Pass 36 (corrected baselines at 1x and 2x game speed; current build)

HUMAN_APPROVAL: "run sims" and "run sim in 2x, assume click speed slows down accordingly since player cant click as fast on the battle" (2026-09-13/14). Profiles idleboost, light, casual, engaged; seeds 61-70; 96 real hours; Shatter cap 3; stall rule far/3h. 80 runs, 0 errors, 0 assertion failures; every 2x run's config records speed 2.

DEVELOPER_POSITION: AGREE with the reviewer that pass 35 was contaminated in principle: the bot salvaged through sellItem, a leftover that paid base + 2 ore per level and that no UI path used. Fixed at the source (commit a19c026 on main, merged): one game function salvageItem (base + 50% of upgrade ore) is now used by the pack button, the make-room salvage and the simulator; sellItem is deleted. Effect on the numbers: within noise (every 1x playtime cell moved by at most about an hour), because the stale path only underpaid on items the bot had levelled and then replaced. The 2x batch is the new information: at the free 2x toggle the whole Road, three Shatters included, is done in 12 to 15 real hours for every profile, wave 300 comes 2 to 3 hours after Endless entry, and the Endless runaway is steeper still (power 7 to 28M at 96 real hours against 1 to 5M at 1x; gold per real hour 10 to 30x). CONFIDENCE: HIGH on validity; HIGH that these are the hours a player on this build sees at each speed.

Harness additions this pass (tests/sim only): --speed N (N game updates per real tick; hours, taps, active minutes and boost timers in real time); boost-count fix (active windows no longer clear the boost timer). Both on the branch.

## Playtime
PLAYTIME, corrected bot (salvage through the game's own path), gated route, median / P90 REAL hours, seeds 61-70, current build
1x (batch_out_base35):
| Profile | 1st Shatter | 2nd | 3rd | Endless entry | Wave 100 | Wave 300 | Wave 500 |
| idleboost | 6.6 / 9.3 | 12.6 / 17.9 | 20.1 / 26.4 | 26.0 / 33.0 | 26.0 / 34.0 | 31.0 / 39.0 | 40.0 / 51.0 |
| light | 6.9 / 9.3 | 13.0 / 17.1 | 20.1 / 27.1 | 27.0 / 34.0 | 28.0 / 36.0 | 33.0 / 42.0 | 42.0 / 52.0 |
| casual | 6.0 / 8.2 | 10.2 / 13.1 | 18.1 / 21.1 | 25.0 / 29.0 | 25.0 / 29.0 | 29.0 / 34.0 | 36.0 / 42.0 |
| engaged | 6.1 / 7.2 | 10.1 / 12.3 | 17.1 / 21.1 | 24.0 / 29.0 | 24.0 / 30.0 | 28.0 / 34.0 | 33.0 / 41.0 |
2x (batch_out_base35x2; the speed toggle at 2x for the whole run; taps per real second, active minutes and the 4h boost stay in real time, so taps per game second halve):
| idleboost | 3.8 / 4.4 | 7.3 / 8.2 | 11.4 / 13.0 | 15.0 / 17.0 | 15.0 / 17.0 | 17.0 / 20.0 | 22.0 / 26.0 |
| light | 3.7 / 4.2 | 6.2 / 7.8 | 10.1 / 14.0 | 13.0 / 18.0 | 13.0 / 18.0 | 16.0 / 21.0 | 19.0 / 27.0 |
| casual | 3.7 / 4.2 | 6.0 / 8.9 | 10.1 / 14.2 | 14.0 / 18.0 | 14.0 / 19.0 | 16.0 / 21.0 | 21.0 / 25.0 |
| engaged | 3.1 / 3.9 | 6.0 / 8.1 | 9.1 / 13.1 | 13.0 / 17.0 | 13.0 / 18.0 | 15.0 / 20.0 | 18.0 / 24.0 |

Reading: the four profiles are nearly indistinguishable at both speeds, so tapping barely matters on this build; the first Shatter is fixed by the Ironvein seal at 6-7h (1x) or 3-4h (2x); no boss stalls longer than 5h at 1x and none over 2h at 2x; Endless entry by the end of day one at 1x and mid-day-one at 2x.

## Report, 1x (reference = pass 35 batch, uncorrected bot)

===== IDLEBOOST  batch_out_base35 (n=10)  reference batch_out_base34 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 59/86 -> 59/98 powerK 344/1913 -> 348/3724 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 169/192 -> 179/210 powerK 54604/163933 -> 97180/321759 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 224/243 -> 231/259 powerK 387115/917080 -> 627747/1606095 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 256/272 -> 259/292 powerK 1128959/2408001 -> 1816274/4768453
-- Shatters per run 3/3 -> 3/3 | first h 6.6/9.3 -> 7.1/9.2 | third h 20.1/26.4 -> 18.4/25.2 | min gap 6.2/8.5 -> 5.8/7.4
-- hours in zone: Greenhollow 0.3/0.4 -> 0.3/0.4 | Stillwater 1.7/2.0 -> 1.7/2.2 | Thornwood 3.0/3.4 -> 3.2/4.2 | Ironvein 3.1/5.4 -> 3.5/5.0 | Emberwaste 3.3/4.3 -> 2.7/4.1 | Amberfall 2.2/5.4 -> 2.3/2.9 | Ashen Approach 2.6/3.2 -> 2.3/4.3 | Ashen Keep 4.5/6.0 -> 3.7/5.7 | Foundry 4.0/5.2 -> 3.7/4.7 | Endless 70.6/74.4 -> 70.6/75.7
-- Warlord: reached 10/10 (ref 10/10) | attempts 3/5 -> 2/3 | Auto-Cast 10/33 (ref 10/20) | active 0/0 (ref 0/0) | stall h 0.5/1.6 -> 0.0/2.6 | cleared 10/10 at h 6.6/9.3 (ref 10/10 @7.1/9.2) | loss dur/HP 60s 44% | charge kills/att 2.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 3/7 -> 3/6 | Auto-Cast 10/36 (ref 10/33) | active 0/0 (ref 0/0) | stall h 0.6/1.7 -> 0.6/1.4 | cleared 10/10 at h 10.9/13.3 (ref 10/10 @10.7/13.7) | loss dur/HP 60s 36% | charge kills/att 2.33
-- Hunter King: reached 10/10 (ref 10/10) | attempts 3/4 -> 2/5 | Auto-Cast 10/29 (ref 10/28) | active 0/0 (ref 0/0) | stall h 0.5/1.0 -> 0.5/1.5 | cleared 10/10 at h 12.6/17.9 (ref 10/10 @12.3/16.3) | loss dur/HP 51s 26% | charge kills/att 2.67
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 4/6 -> 4/6 | Auto-Cast 10/40 (ref 10/38) | active 0/0 (ref 0/0) | stall h 0.9/1.7 -> 0.7/1.4 | cleared 10/10 at h 16.3/21.8 (ref 10/10 @15.2/21.1) | loss dur/HP 49s 56% | charge kills/att 1.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 6/11 -> 5/11 | Auto-Cast 10/73 (ref 10/64) | active 0/0 (ref 0/0) | stall h 1.5/2.0 -> 1.3/2.2 | cleared 10/10 at h 20.1/26.4 (ref 10/10 @18.4/25.2) | loss dur/HP 44s 65% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 3/8 -> 3/8 | Auto-Cast 10/45 (ref 10/38) | active 0/0 (ref 0/0) | stall h 0.7/1.5 -> 0.6/1.8 | cleared 10/10 at h 23.2/30.7 (ref 10/10 @20.6/29.6) | loss dur/HP 49s 59% | charge kills/att 3.00 | volley % of target HP 44%
-- Foundry exit 10/10 at h 23.2/30.7 (ref 10/10 @20.6/29.6) | Endless entered 10/10 at h 25.3/32.1 (ref 10/10 @23.5/31.0) | hours in Endless 70.6/74.4 -> 70.6/75.7 | best wave 1028/1118 -> 1042/1185 | milestones 41/44 | deaths/h 5.4/6.2 -> 5.5/6.7 | gold earned/h M 4002.1/7617.6 -> 4684.6/16978.0 spent/h M 3606.1/6809.0 | levels gained in Endless 190/208 | power ratio in Endless x2797.0/5773.4 -> x3733.9/10791.1
-- totals: Lv@96h 256/272 -> 259/292 | power@96h K 1128959/2408001 -> 1816274/4768453 | gold earned M 284166/571340 -> 341993/1290341 | ore earned K 1113962/1952675 -> 1330870/4045282 | renown K 10677/13766 -> 11300/16432 | defeats 838/1117 -> 941/1009 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): none
-- outliers: none

===== LIGHT  batch_out_base35 (n=10)  reference batch_out_base34 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 8/9 / 8/9 (ref 8/9) Lv 54/104 -> 55/100 powerK 227/4682 -> 257/3688 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 162/204 -> 166/205 powerK 39803/239384 -> 52971/248512 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 219/256 -> 221/255 powerK 321408/1384539 -> 373612/1349692 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 252/289 -> 254/289 powerK 1010641/4160281 -> 1134542/4069772
-- Shatters per run 3/3 -> 3/3 | first h 6.9/9.3 -> 6.1/9.3 | third h 20.1/27.1 -> 20.1/27.1 | min gap 5.8/7.8 -> 6.0/7.8
-- hours in zone: Greenhollow 0.3/0.5 -> 0.3/0.5 | Stillwater 1.7/1.8 -> 1.6/1.8 | Thornwood 3.4/3.9 -> 2.8/3.5 | Ironvein 3.2/5.9 -> 3.2/5.9 | Emberwaste 3.2/4.3 -> 2.8/3.6 | Amberfall 2.5/4.1 -> 2.5/4.5 | Ashen Approach 3.0/5.1 -> 2.2/4.2 | Ashen Keep 4.2/8.3 -> 5.2/6.8 | Foundry 4.8/6.0 -> 4.5/5.5 | Endless 69.0/76.4 -> 69.6/76.2
-- Warlord: reached 10/10 (ref 10/10) | attempts 2/3 -> 3/5 | Auto-Cast 8/17 (ref 5/20) | active 2/5 (ref 5/10) | stall h 0.1/0.8 -> 0.0/2.2 | cleared 10/10 at h 6.9/9.3 (ref 10/10 @6.1/9.3) | loss dur/HP 58s 26% | charge kills/att 2.33
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/4 -> 3/5 | Auto-Cast 0/10 (ref 2/15) | active 10/14 (ref 8/12) | stall h 0.9/2.0 -> 0.8/2.0 | cleared 10/10 at h 11.0/14.1 (ref 10/10 @10.1/14.1) | loss dur/HP 52s 43% | charge kills/att 1.33
-- Hunter King: reached 10/10 (ref 10/10) | attempts 2/4 -> 3/6 | Auto-Cast 2/12 (ref 0/18) | active 8/14 (ref 10/13) | stall h 0.3/1.0 -> 0.4/1.0 | cleared 10/10 at h 13.0/17.1 (ref 10/10 @11.1/17.1) | loss dur/HP 57s 29% | charge kills/att 1.67
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 2/7 -> 2/5 | Auto-Cast 4/18 (ref 3/18) | active 6/12 (ref 7/11) | stall h 1.0/2.0 -> 1.0/2.0 | cleared 10/10 at h 17.1/22.1 (ref 10/10 @14.1/22.1) | loss dur/HP 57s 60% | charge kills/att 1.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 5/12 -> 4/7 | Auto-Cast 1/33 (ref 2/25) | active 9/18 (ref 8/18) | stall h 1.0/4.0 -> 1.0/3.9 | cleared 10/10 at h 20.1/27.1 (ref 10/10 @20.1/27.1) | loss dur/HP 34s 66% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 3/6 -> 2/5 | Auto-Cast 2/20 (ref 2/13) | active 8/13 (ref 8/12) | stall h 0.8/1.6 -> 0.5/1.9 | cleared 10/10 at h 24.1/32.1 (ref 10/10 @23.0/32.1) | loss dur/HP 39s 59% | charge kills/att 1.50 | volley % of target HP 46%
-- Foundry exit 10/10 at h 24.1/32.1 (ref 10/10 @23.0/32.1) | Endless entered 10/10 at h 26.9/33.9 (ref 10/10 @25.4/33.9) | hours in Endless 69.0/76.4 -> 69.6/76.2 | best wave 1016/1194 -> 1031/1173 | milestones 40/47 | deaths/h 5.9/7.5 -> 5.2/7.5 | gold earned/h M 3757.6/16258.1 -> 4014.2/15695.6 spent/h M 3417.0/14412.3 | levels gained in Endless 189/226 | power ratio in Endless x3096.6/9321.5 -> x3007.2/10724.6
-- totals: Lv@96h 252/289 -> 254/289 | power@96h K 1010641/4160281 -> 1134542/4069772 | gold earned M 253187/1251891 -> 281014/1208579 | ore earned K 971493/3619849 -> 1031254/3433384 | renown K 9397/16192 -> 9397/16937 | defeats 938/1581 -> 910/1455 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 62 Grave Knight 1/4 stall 2.0h clear@17.1 | seed 64 Hollow King 1/7 stall 4.0h clear@25.1 | seed 65 Hollow King 1/4 stall 2.0h clear@27.1 | seed 69 Hollow King 1/12 stall 3.0h clear@16.0 | seed 70 Hollow King 1/5 stall 2.0h clear@23.1
-- outliers: none

===== CASUAL  batch_out_base35 (n=10)  reference batch_out_base34 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 8/9) Lv 57/102 -> 53/105 powerK 242/4251 -> 239/5127 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 178/212 -> 171/221 powerK 75839/319709 -> 73991/457722 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 236/262 -> 233/273 powerK 569601/1704748 -> 644781/2682573 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 272/301 -> 270/307 powerK 1932902/5545658 -> 2068234/8071888
-- Shatters per run 3/3 -> 3/3 | first h 6.0/8.2 -> 6.1/8.1 | third h 18.1/21.1 -> 19.1/26.1 | min gap 4.1/6.0 -> 4.1/5.9
-- hours in zone: Greenhollow 0.3/0.4 -> 0.3/0.4 | Stillwater 1.5/2.1 -> 1.5/2.1 | Thornwood 2.5/3.6 -> 2.5/3.8 | Ironvein 2.8/4.0 -> 2.9/4.9 | Emberwaste 2.4/3.4 -> 2.5/3.7 | Amberfall 1.6/4.5 -> 2.2/3.4 | Ashen Approach 2.2/2.3 -> 1.4/3.3 | Ashen Keep 6.1/6.3 -> 6.1/9.3 | Foundry 5.0/6.3 -> 4.7/7.9 | Endless 70.2/76.0 -> 68.9/76.5
-- Warlord: reached 10/10 (ref 10/10) | attempts 1/4 -> 1/5 | Auto-Cast 1/7 (ref 0/4) | active 9/14 (ref 10/13) | stall h 0.0/2.1 -> 0.0/1.0 | cleared 10/10 at h 6.0/8.2 (ref 10/10 @6.1/8.1) | loss dur/HP 52s 11% | charge kills/att 1.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/4 -> 2/4 | Auto-Cast 0/4 (ref 0/6) | active 10/16 (ref 10/16) | stall h 0.4/1.0 -> 0.0/1.9 | cleared 10/10 at h 9.1/11.1 (ref 10/10 @9.1/11.1) | loss dur/HP 55s 29% | charge kills/att 1.00
-- Hunter King: reached 10/10 (ref 10/10) | attempts 1/3 -> 1/3 | Auto-Cast 0/2 (ref 0/3) | active 10/14 (ref 10/13) | stall h 0.0/1.9 -> 0.0/0.9 | cleared 10/10 at h 10.2/13.1 (ref 10/10 @10.1/12.2) | loss dur/HP 45s 20% | charge kills/att 1.00
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 1/2 -> 1/2 | Auto-Cast 0/3 (ref 0/0) | active 10/10 (ref 10/14) | stall h 0.0/0.9 -> 0.0/1.1 | cleared 10/10 at h 13.1/16.1 (ref 10/10 @14.1/17.1) | loss dur/HP 41s 81% | charge kills/att 0.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 3/7 -> 3/4 | Auto-Cast 0/10 (ref 0/2) | active 10/24 (ref 10/23) | stall h 1.9/4.9 -> 1.0/4.0 | cleared 10/10 at h 18.1/21.1 (ref 10/10 @19.1/27.1) | loss dur/HP 41s 53% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/5 -> 2/3 | Auto-Cast 0/5 (ref 1/1) | active 10/19 (ref 9/16) | stall h 1.0/1.9 -> 0.9/3.0 | cleared 10/10 at h 22.1/25.1 (ref 10/10 @22.0/31.1) | loss dur/HP 30s 39% | charge kills/att 1.00 | volley % of target HP 50%
-- Foundry exit 10/10 at h 22.1/25.1 (ref 10/10 @22.0/31.1) | Endless entered 10/10 at h 24.1/28.1 (ref 10/10 @24.5/33.4) | hours in Endless 70.2/76.0 -> 68.9/76.5 | best wave 1144/1245 -> 1138/1278 | milestones 45/49 | deaths/h 5.7/7.0 -> 6.0/7.7 | gold earned/h M 9446.9/29007.4 -> 8629.2/36246.3 spent/h M 8610.3/25861.8 | levels gained in Endless 209/238 | power ratio in Endless x6319.2/16434.6 -> x5417.4/20079.2
-- totals: Lv@96h 272/301 -> 270/307 | power@96h K 1932902/5545658 -> 2068234/8071888 | gold earned M 665567/2117556 -> 595432/2790982 | ore earned K 2016239/5160472 -> 1827084/6589009 | renown K 14973/23276 -> 12429/25771 | defeats 1057/1386 -> 1161/1878 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 64 Warlord 1/4 stall 2.1h clear@8.2 | seed 69 Hollow King 1/7 stall 4.9h clear@21.1
-- outliers: none

===== ENGAGED  batch_out_base35 (n=10)  reference batch_out_base34 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 64/130 -> 56/85 powerK 330/16555 -> 232/1653 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 193/244 -> 180/217 powerK 159080/1012928 -> 91215/349740 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 255/298 -> 239/276 powerK 1323570/5881934 -> 665070/2575332 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 295/334 -> 279/314 powerK 4892528/17784188 -> 2479624/8850126
-- Shatters per run 3/3 -> 3/3 | first h 6.1/7.2 -> 5.2/6.2 | third h 17.1/21.1 -> 17.1/21.2 | min gap 4.0/5.1 -> 4.1/5.9
-- hours in zone: Greenhollow 0.3/0.4 -> 0.3/0.4 | Stillwater 1.4/1.9 -> 1.5/1.9 | Thornwood 2.3/4.8 -> 2.6/3.5 | Ironvein 3.0/5.0 -> 2.9/3.8 | Emberwaste 2.3/2.7 -> 2.5/3.5 | Amberfall 1.6/2.5 -> 1.6/3.2 | Ashen Approach 1.4/3.3 -> 1.4/3.2 | Ashen Keep 4.3/6.2 -> 5.2/9.0 | Foundry 5.4/6.9 -> 6.2/8.0 | Endless 71.5/79.1 -> 69.9/74.0
-- Warlord: reached 10/10 (ref 10/10) | attempts 1/5 -> 1/2 | Auto-Cast 0/4 (ref 0/0) | active 10/15 (ref 10/11) | stall h 0.0/1.8 -> 0.0/0.1 | cleared 10/10 at h 6.1/7.2 (ref 10/10 @5.2/6.2) | loss dur/HP 57s 23% | charge kills/att 0.50
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 1/2 -> 1/3 | Auto-Cast 0/2 (ref 0/1) | active 10/11 (ref 10/15) | stall h 0.0/0.8 -> 0.0/1.9 | cleared 10/10 at h 8.3/10.2 (ref 10/10 @8.2/10.1) | loss dur/HP 66s 40% | charge kills/att 0.00
-- Hunter King: reached 10/10 (ref 10/10) | attempts 1/3 -> 1/2 | Auto-Cast 0/0 (ref 0/0) | active 10/15 (ref 10/12) | stall h 0.0/1.0 -> 0.0/0.0 | cleared 10/10 at h 10.1/12.3 (ref 10/10 @9.2/12.1) | loss dur/HP 48s 20% | charge kills/att 0.00
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 1/3 -> 1/3 | Auto-Cast 0/0 (ref 0/0) | active 10/17 (ref 10/13) | stall h 0.0/1.1 -> 0.0/1.1 | cleared 10/10 at h 12.2/15.1 (ref 10/10 @12.2/15.1) | loss dur/HP 52s 29% | charge kills/att 0.33
-- Hollow King: reached 10/10 (ref 10/10) | attempts 3/5 -> 2/4 | Auto-Cast 0/1 (ref 0/1) | active 10/27 (ref 10/23) | stall h 1.9/4.1 -> 0.9/4.9 | cleared 10/10 at h 17.1/22.2 (ref 10/10 @17.1/23.1) | loss dur/HP 25s 51% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 3/5 -> 2/4 | Auto-Cast 0/2 (ref 0/0) | active 10/28 (ref 10/25) | stall h 1.0/2.0 -> 1.0/3.0 | cleared 10/10 at h 21.2/25.1 (ref 10/10 @20.2/27.1) | loss dur/HP 37s 43% | charge kills/att 1.00 | volley % of target HP 57%
-- Foundry exit 10/10 at h 21.2/25.1 (ref 10/10 @20.2/27.1) | Endless entered 10/10 at h 23.1/28.6 (ref 10/10 @24.4/31.1) | hours in Endless 71.5/79.1 -> 69.9/74.0 | best wave 1227/1439 -> 1175/1304 | milestones 49/57 | deaths/h 6.2/8.4 -> 5.8/8.0 | gold earned/h M 26304.3/119972.4 -> 13997.0/51599.4 spent/h M 23422.4/108877.9 | levels gained in Endless 231/275 | power ratio in Endless x14813.2/53310.6 -> x7454.7/26060.8
-- totals: Lv@96h 295/334 -> 279/314 | power@96h K 4892528/17784188 -> 2479624/8850126 | gold earned M 1893928/9477827 -> 1007803/3818370 | ore earned K 4296359/16202213 -> 2476656/8327139 | renown K 20905/33214 -> 13862/27490 | defeats 1376/1718 -> 1333/1805 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 62 Hollow King 1/5 stall 4.0h clear@17.2 | seed 67 Hollow King 1/3 stall 4.1h clear@22.2 | seed 69 Hollow King 1/4 stall 3.9h clear@17.1 | seed 70 Hollow King 1/3 stall 2.0h clear@20.1
-- outliers: none

## Report, 2x (reference = the corrected 1x batch above)

===== IDLEBOOST  batch_out_base35x2 (n=10)  reference batch_out_base35 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 146/187 -> 59/86 powerK 21996/116097 -> 344/1913 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 240/267 -> 169/192 powerK 676385/1667863 -> 54604/163933 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 284/310 -> 224/243 powerK 2834770/6827850 -> 387115/917080 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 313/337 -> 256/272 powerK 7433237/15329316 -> 1128959/2408001
-- Shatters per run 3/3 -> 3/3 | first h 3.8/4.4 -> 6.6/9.3 | third h 11.4/13.0 -> 20.1/26.4 | min gap 3.4/3.9 -> 6.2/8.5
-- hours in zone: Greenhollow 0.2/0.2 -> 0.3/0.4 | Stillwater 0.9/1.1 -> 1.7/2.0 | Thornwood 1.6/2.2 -> 3.0/3.4 | Ironvein 1.6/2.6 -> 3.1/5.4 | Emberwaste 2.0/2.5 -> 3.3/4.3 | Amberfall 1.3/1.8 -> 2.2/5.4 | Ashen Approach 1.3/2.2 -> 2.6/3.2 | Ashen Keep 2.3/3.4 -> 4.5/6.0 | Foundry 2.4/3.3 -> 4.0/5.2 | Endless 81.2/84.8 -> 70.6/74.4
-- Warlord: reached 10/10 (ref 10/10) | attempts 3/4 -> 3/5 | Auto-Cast 10/28 (ref 10/33) | active 0/0 (ref 0/0) | stall h 0.2/1.1 -> 0.5/1.6 | cleared 10/10 at h 3.8/4.4 (ref 10/10 @6.6/9.3) | loss dur/HP 34s 40% | charge kills/att 2.50
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/6 -> 3/7 | Auto-Cast 10/30 (ref 10/36) | active 0/0 (ref 0/0) | stall h 0.4/0.9 -> 0.6/1.7 | cleared 10/10 at h 6.2/6.9 (ref 10/10 @10.9/13.3) | loss dur/HP 37s 31% | charge kills/att 2.67
-- Hunter King: reached 10/10 (ref 10/10) | attempts 2/5 -> 3/4 | Auto-Cast 10/28 (ref 10/29) | active 0/0 (ref 0/0) | stall h 0.2/0.8 -> 0.5/1.0 | cleared 10/10 at h 7.3/8.2 (ref 10/10 @12.6/17.9) | loss dur/HP 34s 27% | charge kills/att 2.67
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 3/5 -> 4/6 | Auto-Cast 10/31 (ref 10/40) | active 0/0 (ref 0/0) | stall h 0.2/0.9 -> 0.9/1.7 | cleared 10/10 at h 9.2/10.1 (ref 10/10 @16.3/21.8) | loss dur/HP 27s 55% | charge kills/att 1.33
-- Hollow King: reached 10/10 (ref 10/10) | attempts 5/14 -> 6/11 | Auto-Cast 10/67 (ref 10/73) | active 0/0 (ref 0/0) | stall h 0.8/1.6 -> 1.5/2.0 | cleared 10/10 at h 11.4/13.0 (ref 10/10 @20.1/26.4) | loss dur/HP 26s 57% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 4/7 -> 3/8 | Auto-Cast 10/43 (ref 10/45) | active 0/0 (ref 0/0) | stall h 0.5/0.7 -> 0.7/1.5 | cleared 10/10 at h 12.6/15.0 (ref 10/10 @23.2/30.7) | loss dur/HP 22s 57% | charge kills/att 3.43 | volley % of target HP 45%
-- Foundry exit 10/10 at h 12.6/15.0 (ref 10/10 @23.2/30.7) | Endless entered 10/10 at h 14.2/16.4 (ref 10/10 @25.3/32.1) | hours in Endless 81.2/84.8 -> 70.6/74.4 | best wave 1265/1398 -> 1028/1118 | milestones 50/55 | deaths/h 8.7/10.5 -> 5.4/6.2 | gold earned/h M 37299.7/94474.8 -> 4002.1/7617.6 spent/h M 33765.8/86993.4 | levels gained in Endless 255/281 | power ratio in Endless x21798.7/47766.5 -> x2797.0/5773.4
-- totals: Lv@96h 313/337 -> 256/272 | power@96h K 7433237/15329316 -> 1128959/2408001 | gold earned M 3021291/8030371 -> 284166/571340 | ore earned K 8282268/18280735 -> 1113962/1952675 | renown K 37014/46978 -> 10677/13766 | defeats 1319/1509 -> 838/1117 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): none
-- outliers: none

===== LIGHT  batch_out_base35x2 (n=10)  reference batch_out_base35 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 8/9) Lv 177/193 -> 54/104 powerK 79403/170346 -> 227/4682 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 265/282 -> 162/204 powerK 1656516/3283217 -> 39803/239384 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 311/322 -> 219/256 powerK 7580668/12214342 -> 321408/1384539 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 340/352 -> 252/289 powerK 18738003/29826585 -> 1010641/4160281
-- Shatters per run 3/3 -> 3/3 | first h 3.7/4.2 -> 6.9/9.3 | third h 10.1/14.0 -> 20.1/27.1 | min gap 2.7/3.8 -> 5.8/7.8
-- hours in zone: Greenhollow 0.2/0.2 -> 0.3/0.5 | Stillwater 1.0/1.1 -> 1.7/1.8 | Thornwood 1.3/2.2 -> 3.4/3.9 | Ironvein 1.7/2.5 -> 3.2/5.9 | Emberwaste 1.5/1.8 -> 3.2/4.3 | Amberfall 1.1/2.0 -> 2.5/4.1 | Ashen Approach 0.8/1.8 -> 3.0/5.1 | Ashen Keep 2.9/4.7 -> 4.2/8.3 | Foundry 2.0/2.7 -> 4.8/6.0 | Endless 82.9/85.0 -> 69.0/76.4
-- Warlord: reached 10/10 (ref 10/10) | attempts 2/4 -> 2/3 | Auto-Cast 8/22 (ref 8/17) | active 2/4 (ref 2/5) | stall h 0.1/0.4 -> 0.1/0.8 | cleared 10/10 at h 3.7/4.2 (ref 10/10 @6.9/9.3) | loss dur/HP 27s 23% | charge kills/att 2.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/7 -> 2/4 | Auto-Cast 5/16 (ref 0/10) | active 5/10 (ref 10/14) | stall h 0.3/1.0 -> 0.9/2.0 | cleared 10/10 at h 5.6/6.1 (ref 10/10 @11.0/14.1) | loss dur/HP 28s 41% | charge kills/att 1.50
-- Hunter King: reached 10/10 (ref 10/10) | attempts 4/5 -> 2/4 | Auto-Cast 8/31 (ref 2/12) | active 2/5 (ref 8/14) | stall h 0.2/0.6 -> 0.3/1.0 | cleared 10/10 at h 6.2/7.8 (ref 10/10 @13.0/17.1) | loss dur/HP 30s 39% | charge kills/att 2.33
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 1/4 -> 2/7 | Auto-Cast 2/13 (ref 4/18) | active 8/9 (ref 6/12) | stall h 0.0/0.8 -> 1.0/2.0 | cleared 10/10 at h 7.1/9.9 (ref 10/10 @17.1/22.1) | loss dur/HP 24s 64% | charge kills/att 0.75
-- Hollow King: reached 10/10 (ref 10/10) | attempts 6/11 -> 5/12 | Auto-Cast 4/50 (ref 1/33) | active 6/14 (ref 9/18) | stall h 0.7/1.9 -> 1.0/4.0 | cleared 10/10 at h 10.1/14.0 (ref 10/10 @20.1/27.1) | loss dur/HP 22s 66% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 3/7 -> 3/6 | Auto-Cast 6/28 (ref 2/20) | active 4/9 (ref 8/13) | stall h 0.2/1.0 -> 0.8/1.6 | cleared 10/10 at h 12.0/16.1 (ref 10/10 @24.1/32.1) | loss dur/HP 18s 70% | charge kills/att 2.00 | volley % of target HP 48%
-- Foundry exit 10/10 at h 12.0/16.1 (ref 10/10 @24.1/32.1) | Endless entered 10/10 at h 12.6/17.3 (ref 10/10 @26.9/33.9) | hours in Endless 82.9/85.0 -> 69.0/76.4 | best wave 1413/1442 -> 1016/1194 | milestones 56/57 | deaths/h 9.9/11.8 -> 5.9/7.5 | gold earned/h M 118533.7/188362.6 -> 3757.6/16258.1 spent/h M 109334.7/167975.0 | levels gained in Endless 275/288 | power ratio in Endless x43661.1/71115.9 -> x3096.6/9321.5
-- totals: Lv@96h 340/352 -> 252/289 | power@96h K 18738003/29826585 -> 1010641/4160281 | gold earned M 10075376/16010839 -> 253187/1251891 | ore earned K 20091450/29147483 -> 971493/3619849 | renown K 50209/73114 -> 9397/16192 | defeats 1425/1677 -> 938/1581 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): none
-- outliers: none

===== CASUAL  batch_out_base35x2 (n=10)  reference batch_out_base35 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 168/207 -> 57/102 powerK 58425/246000 -> 242/4251 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 261/293 -> 178/212 powerK 1478716/4659973 -> 75839/319709 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 309/338 -> 236/262 powerK 6684103/19643887 -> 569601/1704748 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 340/368 -> 272/301 powerK 17664357/47524629 -> 1932902/5545658
-- Shatters per run 3/3 -> 3/3 | first h 3.7/4.2 -> 6.0/8.2 | third h 10.1/14.2 -> 18.1/21.1 | min gap 2.6/5.1 -> 4.1/6.0
-- hours in zone: Greenhollow 0.2/0.2 -> 0.3/0.4 | Stillwater 0.9/1.0 -> 1.5/2.1 | Thornwood 1.4/2.2 -> 2.5/3.6 | Ironvein 1.7/2.3 -> 2.8/4.0 | Emberwaste 1.5/3.3 -> 2.4/3.4 | Amberfall 1.2/2.3 -> 1.6/4.5 | Ashen Approach 0.8/1.4 -> 2.2/2.3 | Ashen Keep 2.6/4.6 -> 6.1/6.3 | Foundry 1.9/2.9 -> 5.0/6.3 | Endless 82.6/85.2 -> 70.2/76.0
-- Warlord: reached 10/10 (ref 10/10) | attempts 2/5 -> 1/4 | Auto-Cast 5/14 (ref 1/7) | active 5/9 (ref 9/14) | stall h 0.1/0.6 -> 0.0/2.1 | cleared 10/10 at h 3.7/4.2 (ref 10/10 @6.0/8.2) | loss dur/HP 30s 42% | charge kills/att 0.67
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 3/5 -> 2/4 | Auto-Cast 5/14 (ref 0/4) | active 5/17 (ref 10/16) | stall h 0.3/0.9 -> 0.4/1.0 | cleared 10/10 at h 5.3/7.2 (ref 10/10 @9.1/11.1) | loss dur/HP 29s 6% | charge kills/att 1.25
-- Hunter King: reached 10/10 (ref 10/10) | attempts 2/4 -> 1/3 | Auto-Cast 2/11 (ref 0/2) | active 8/15 (ref 10/14) | stall h 0.0/0.8 -> 0.0/1.9 | cleared 10/10 at h 6.0/8.9 (ref 10/10 @10.2/13.1) | loss dur/HP 25s 19% | charge kills/att 1.67
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 2/6 -> 1/2 | Auto-Cast 1/10 (ref 0/3) | active 9/17 (ref 10/10) | stall h 0.1/1.0 -> 0.0/0.9 | cleared 10/10 at h 7.5/10.1 (ref 10/10 @13.1/16.1) | loss dur/HP 19s 66% | charge kills/att 1.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 7/12 -> 3/7 | Auto-Cast 2/51 (ref 0/10) | active 8/27 (ref 10/24) | stall h 0.9/1.9 -> 1.9/4.9 | cleared 10/10 at h 10.1/14.2 (ref 10/10 @18.1/21.1) | loss dur/HP 23s 48% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/7 -> 2/5 | Auto-Cast 3/17 (ref 0/5) | active 7/17 (ref 10/19) | stall h 0.1/1.0 -> 1.0/1.9 | cleared 10/10 at h 12.0/17.1 (ref 10/10 @22.1/25.1) | loss dur/HP 20s 59% | charge kills/att 2.00 | volley % of target HP 51%
-- Foundry exit 10/10 at h 12.0/17.1 (ref 10/10 @22.1/25.1) | Endless entered 10/10 at h 13.1/17.7 (ref 10/10 @24.1/28.1) | hours in Endless 82.6/85.2 -> 70.2/76.0 | best wave 1420/1524 -> 1144/1245 | milestones 56/60 | deaths/h 10.4/12.1 -> 5.7/7.0 | gold earned/h M 128253.6/388518.3 -> 9446.9/29007.4 spent/h M 116695.9/345158.2 | levels gained in Endless 279/314 | power ratio in Endless x47191.5/158991.0 -> x6319.2/16434.6
-- totals: Lv@96h 340/368 -> 272/301 | power@96h K 17664357/47524629 -> 1932902/5545658 | gold earned M 10645063/33412575 -> 665567/2117556 | ore earned K 20904195/51228390 -> 2016239/5160472 | renown K 46582/73110 -> 14973/23276 | defeats 1437/2059 -> 1057/1386 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): none
-- outliers: none

===== ENGAGED  batch_out_base35x2 (n=10)  reference batch_out_base35 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 182/196 -> 64/130 powerK 80267/164038 -> 330/16555 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 276/287 -> 193/244 powerK 1913445/3776926 -> 159080/1012928 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 323/334 -> 255/298 powerK 9374895/16498606 -> 1323570/5881934 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 358/366 -> 295/334 powerK 27731683/44103436 -> 4892528/17784188
-- Shatters per run 3/3 -> 3/3 | first h 3.1/3.9 -> 6.1/7.2 | third h 9.1/13.1 -> 17.1/21.1 | min gap 2.7/4.0 -> 4.0/5.1
-- hours in zone: Greenhollow 0.2/0.2 -> 0.3/0.4 | Stillwater 0.8/1.0 -> 1.4/1.9 | Thornwood 1.4/1.5 -> 2.3/4.8 | Ironvein 1.8/2.1 -> 3.0/5.0 | Emberwaste 1.2/2.2 -> 2.3/2.7 | Amberfall 1.5/2.4 -> 1.6/2.5 | Ashen Approach 0.6/1.5 -> 1.4/3.3 | Ashen Keep 2.5/5.6 -> 4.3/6.2 | Foundry 1.9/2.6 -> 5.4/6.9 | Endless 83.7/85.6 -> 71.5/79.1
-- Warlord: reached 10/10 (ref 10/10) | attempts 3/6 -> 1/5 | Auto-Cast 3/16 (ref 0/4) | active 7/13 (ref 10/15) | stall h 0.0/0.8 -> 0.0/1.8 | cleared 10/10 at h 3.1/3.9 (ref 10/10 @6.1/7.2) | loss dur/HP 35s 22% | charge kills/att 1.33
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 1/7 -> 1/2 | Auto-Cast 2/10 (ref 0/2) | active 8/15 (ref 10/11) | stall h 0.0/0.9 -> 0.0/0.8 | cleared 10/10 at h 5.0/6.0 (ref 10/10 @8.3/10.2) | loss dur/HP 30s 20% | charge kills/att 1.00
-- Hunter King: reached 10/10 (ref 10/10) | attempts 2/7 -> 1/3 | Auto-Cast 0/9 (ref 0/0) | active 10/18 (ref 10/15) | stall h 0.0/1.0 -> 0.0/1.0 | cleared 10/10 at h 6.0/8.1 (ref 10/10 @10.1/12.3) | loss dur/HP 28s 22% | charge kills/att 1.33
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 2/5 -> 1/3 | Auto-Cast 1/6 (ref 0/0) | active 9/18 (ref 10/17) | stall h 0.1/0.9 -> 0.0/1.1 | cleared 10/10 at h 7.1/10.0 (ref 10/10 @12.2/15.1) | loss dur/HP 25s 45% | charge kills/att 1.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 6/10 -> 3/5 | Auto-Cast 0/35 (ref 0/1) | active 10/31 (ref 10/27) | stall h 1.0/1.8 -> 1.9/4.1 | cleared 10/10 at h 9.1/13.0 (ref 10/10 @17.1/22.2) | loss dur/HP 22s 54% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/7 -> 3/5 | Auto-Cast 1/10 (ref 0/2) | active 9/16 (ref 10/28) | stall h 0.1/0.9 -> 1.0/2.0 | cleared 10/10 at h 11.1/15.1 (ref 10/10 @21.2/25.1) | loss dur/HP 24s 58% | charge kills/att 2.00 | volley % of target HP 59%
-- Foundry exit 10/10 at h 11.1/15.1 (ref 10/10 @21.2/25.1) | Endless entered 10/10 at h 12.3/16.7 (ref 10/10 @23.1/28.6) | hours in Endless 83.7/85.6 -> 71.5/79.1 | best wave 1480/1540 -> 1227/1439 | milestones 59/61 | deaths/h 10.6/13.8 -> 6.2/8.4 | gold earned/h M 276792.8/396035.0 -> 26304.3/119972.4 spent/h M 258594.6/347098.8 | levels gained in Endless 294/307 | power ratio in Endless x89392.0/136166.2 -> x14813.2/53310.6
-- totals: Lv@96h 358/366 -> 295/334 | power@96h K 27731683/44103436 -> 4892528/17784188 | gold earned M 23527400/34059013 -> 1893928/9477827 | ore earned K 38300098/48191535 -> 4296359/16202213 | renown K 59981/78265 -> 20905/33214 | defeats 1510/2252 -> 1376/1718 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): none
-- outliers: none

## What the developer asks of this review
1. The pacing proposal in real hours at a stated speed assumption (the human's players use 2x freely; 4x needs the boost), with measurable gates for "not draining or boring".
2. A ranked candidate list, one lever per candidate, values and expected effect on the tables above, and the batch (speed included) that would test it; stated so the human can approve in one line. The developer implements only after HUMAN_APPROVAL.
3. Your first lever for the Endless. The developer's unapproved candidate remains the two-slope item level curve (1.12 per level to about level 30, then 1.08).

## Caveats
n=10 per profile per speed. Boosted idle re-buys the four-hour Auto-Cast boost whenever it lapses and never taps. The 2x batch assumes a player who holds 2x for the whole session; a real player mixes speeds, so their hours fall between the two tables.
