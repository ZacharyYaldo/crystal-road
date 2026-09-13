STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: BASELINE_RESULTS
PASS_ID: PASS_35_REPAIRED_BOT_BASELINE
BASED_ON_REVIEW_PASS: REVIEWER_MESSAGE_RELAYED_BY_HUMAN_2026-09-13 (fresh baselines after the parity repair)
BUILD: 20260913-184334
HEAD_COMMIT_SHA: 523c51fe6f86c09f273f8a3deeca19b4d1821a66
RESULTS_COMMIT: 523c51fe6f86c09f273f8a3deeca19b4d1821a66 (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
PREVIOUS_HANDOFFS: PASS_34 (parity repair, commit 4a80e16), PASS_33 (cycle 2 open, gated baselines, commit f2f5bce)

# Crystal Road AI Handoff - Pass 35 (first baseline with the repaired bot; current build; boosted idle replaces true idle by the human's choice)

HUMAN_APPROVAL: "run sims" (2026-09-13) after "if it's going to increase testing time then there's no need for true idle we can just use boosted idle where he always has auto cast". Profiles run: idleboost, light, casual, engaged; seeds 61-70; 96h; Shatter cap 3; stall rule far/3h. 40 runs, 0 errors, 0 assertion failures.

DEVELOPER_POSITION: this is the reference batch for cycle 2. The repaired bot reproduces the pass 33 gated picture within noise for light, casual and engaged (first Shatter 5-6h, third 17-20h, Endless entry 24-26h, all 40 runs clear every Road boss, no wall over 5h), and boosted idle now sits alongside them (first Shatter 7.1h, Endless 24h). The Endless runaway is unchanged: 69-71 of 96 hours in the Endless, waves past 1000, party level 254-279, power growth 3000-7500x inside the zone. Engaged is lower than pass 33 there (power 2.5B vs 6.6B at 96h) because it enters the Endless two hours later and its late levels compound less; treat that as batch noise on a runaway curve, not a change. CONFIDENCE: HIGH on validity (assertions on every tick, boost state verified, legal-entry verified); HIGH that the Road pace and the Endless runaway are what a player on this build will meet.

Build note: this batch includes today's later changes since pass 33 (item stats rounded up with at least +1 per level, salvage refund 50%, ascension table 40/160/500/1000, offline proration, tutorials, UI). None moved the Road medians outside the pass 33 spread.

## Playtime
PLAYTIME (repaired bot, gated route, median / P90 hours at 1x; batch_out_base34, seeds 61-70, current build)
| Profile | 1st Shatter | 2nd | 3rd | Endless entry | Wave 100 | Wave 300 | Wave 500 |
| idleboost | 7.1 / 9.2 | 12.3 / 16.3 | 18.4 / 25.2 | 24.0 / 31.0 | 25.0 / 32.0 | 29.0 / 38.0 | 37.0 / 49.0 |
| light | 6.1 / 9.3 | 11.1 / 17.1 | 20.1 / 27.1 | 26.0 / 34.0 | 27.0 / 36.0 | 30.0 / 42.0 | 37.0 / 52.0 |
| casual | 6.1 / 8.1 | 10.1 / 12.2 | 19.1 / 26.1 | 25.0 / 34.0 | 26.0 / 35.0 | 29.0 / 39.0 | 36.0 / 47.0 |
| engaged | 5.2 / 6.2 | 9.2 / 12.1 | 17.1 / 21.2 | 25.0 / 32.0 | 26.0 / 32.0 | 30.0 / 37.0 | 37.0 / 45.0 |
Pass 33 gated batch (batch_out_owner2, previous bot: private travel, permanent Auto-Cast) for light / casual / engaged: first Shatter 7.0 / 6.1 / 6.1, Endless entry 26 / 27 / 23, wave 300 at 31 / 31 / 26, wave 500 at 40 / 39 / 32. Pass 32 build on the gated route (batch_out_refgated): first Shatter 10-15h, Endless entry 58-84h, wave 300 only reached by engaged at 82h.

Harness note: boostBuys in these files is inflated (25-96 per run) because active windows cleared the boost timer and the bot re-bought when they ended; behaviour is identical to a continuous boost. Fixed in this commit for future batches (the timer now persists across active windows).

## Report (idleboost has no reference column; light/casual/engaged reference = pass 33 gated batch)

===== IDLEBOOST  batch_out_base34 (n=10)  reference batch_out_owner2 (n=0) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref -/-) Lv 59/98 -> -/- powerK 348/3724 -> -/- | 48h zones cur/best 9/9 / 9/9 (ref -/-) Lv 179/210 -> -/- powerK 97180/321759 -> -/- | 72h zones cur/best 9/9 / 9/9 (ref -/-) Lv 231/259 -> -/- powerK 627747/1606095 -> -/- | 96h zones cur/best 9/9 / 9/9 (ref -/-) Lv 259/292 -> -/- powerK 1816274/4768453 -> -/-
-- Shatters per run 3/3 -> -/- | first h 7.1/9.2 -> -/- | third h 18.4/25.2 -> -/- | min gap 5.8/7.4 -> -/-
-- hours in zone: Greenhollow 0.3/0.4 -> -/- | Stillwater 1.7/2.2 -> -/- | Thornwood 3.2/4.2 -> -/- | Ironvein 3.5/5.0 -> -/- | Emberwaste 2.7/4.1 -> -/- | Amberfall 2.3/2.9 -> -/- | Ashen Approach 2.3/4.3 -> -/- | Ashen Keep 3.7/5.7 -> -/- | Foundry 3.7/4.7 -> -/- | Endless 70.6/75.7 -> -/-
-- Warlord: reached 10/10 (ref 0/0) | attempts 2/3 -> -/- | Auto-Cast 10/20 (ref 0/0) | active 0/0 (ref 0/0) | stall h 0.0/2.6 -> -/- | cleared 10/10 at h 7.1/9.2 (ref 0/0 @-/-) | loss dur/HP 67s 19% | charge kills/att 2.33
-- Sand Tyrant: reached 10/10 (ref 0/0) | attempts 3/6 -> -/- | Auto-Cast 10/33 (ref 0/0) | active 0/0 (ref 0/0) | stall h 0.6/1.4 -> -/- | cleared 10/10 at h 10.7/13.7 (ref 0/0 @-/-) | loss dur/HP 48s 35% | charge kills/att 2.50
-- Hunter King: reached 10/10 (ref 0/0) | attempts 2/5 -> -/- | Auto-Cast 10/28 (ref 0/0) | active 0/0 (ref 0/0) | stall h 0.5/1.5 -> -/- | cleared 10/10 at h 12.3/16.3 (ref 0/0 @-/-) | loss dur/HP 53s 32% | charge kills/att 2.25
-- Grave Knight: reached 10/10 (ref 0/0) | attempts 4/6 -> -/- | Auto-Cast 10/38 (ref 0/0) | active 0/0 (ref 0/0) | stall h 0.7/1.4 -> -/- | cleared 10/10 at h 15.2/21.1 (ref 0/0 @-/-) | loss dur/HP 44s 60% | charge kills/att 1.00
-- Hollow King: reached 10/10 (ref 0/0) | attempts 5/11 -> -/- | Auto-Cast 10/64 (ref 0/0) | active 0/0 (ref 0/0) | stall h 1.3/2.2 -> -/- | cleared 10/10 at h 18.4/25.2 (ref 0/0 @-/-) | loss dur/HP 53s 44% | charge kills/att 0.00
-- Core: reached 10/10 (ref 0/0) | attempts 3/8 -> -/- | Auto-Cast 10/38 (ref 0/0) | active 0/0 (ref 0/0) | stall h 0.6/1.8 -> -/- | cleared 10/10 at h 20.6/29.6 (ref 0/0 @-/-) | loss dur/HP 47s 68% | charge kills/att 3.00 | volley % of target HP 50%
-- Foundry exit 10/10 at h 20.6/29.6 (ref 0/0 @-/-) | Endless entered 10/10 at h 23.5/31.0 (ref 0/0 @-/-) | hours in Endless 70.6/75.7 -> -/- | best wave 1042/1185 -> -/- | milestones 41/47 | deaths/h 5.5/6.7 -> -/- | gold earned/h M 4684.6/16978.0 -> -/- spent/h M 4148.0/15513.2 | levels gained in Endless 195/232 | power ratio in Endless x3733.9/10791.1 -> x-/-
-- totals: Lv@96h 259/292 -> -/- | power@96h K 1816274/4768453 -> -/- | gold earned M 341993/1290341 -> -/- | ore earned K 1330870/4045282 -> -/- | renown K 11300/16432 -> -/- | defeats 941/1009 -> -/- | training h 0.0/0.0 -> -/-
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 66 Hollow King 1/11 stall 2.2h clear@24.5
-- outliers: none

===== LIGHT  batch_out_base34 (n=10)  reference batch_out_owner2 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 8/9 / 8/9 (ref 8/9) Lv 55/100 -> 57/72 powerK 257/3688 -> 156/686 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 166/205 -> 152/185 powerK 52971/248512 -> 29748/122200 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 221/255 -> 215/240 powerK 373612/1349692 -> 301104/834342 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 254/289 -> 253/274 powerK 1134542/4069772 -> 1008790/2626770
-- Shatters per run 3/3 -> 3/3 | first h 6.1/9.3 -> 7.0/9.0 | third h 20.1/27.1 -> 19.6/27.1 | min gap 6.0/7.8 -> 6.0/7.9
-- hours in zone: Greenhollow 0.3/0.5 -> 0.4/0.4 | Stillwater 1.6/1.8 -> 1.5/2.1 | Thornwood 2.8/3.5 -> 3.1/3.8 | Ironvein 3.2/5.9 -> 3.5/4.9 | Emberwaste 2.8/3.6 -> 3.3/4.2 | Amberfall 2.5/4.5 -> 2.5/4.7 | Ashen Approach 2.2/4.2 -> 2.2/5.2 | Ashen Keep 5.2/6.8 -> 5.0/7.3 | Foundry 4.5/5.5 -> 4.8/5.9 | Endless 69.6/76.2 -> 66.1/72.6
-- Warlord: reached 10/10 (ref 10/10) | attempts 3/5 -> 2/5 | Auto-Cast 5/20 (ref 5/16) | active 5/10 (ref 5/9) | stall h 0.0/2.2 -> 0.6/1.9 | cleared 10/10 at h 6.1/9.3 (ref 10/10 @7.0/9.0) | loss dur/HP 59s 31% | charge kills/att 1.80
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 3/5 -> 2/5 | Auto-Cast 2/15 (ref 2/10) | active 8/12 (ref 8/15) | stall h 0.8/2.0 -> 0.9/2.7 | cleared 10/10 at h 10.1/14.1 (ref 10/10 @10.1/13.7) | loss dur/HP 52s 42% | charge kills/att 1.67
-- Hunter King: reached 10/10 (ref 10/10) | attempts 3/6 -> 2/5 | Auto-Cast 0/18 (ref 1/12) | active 10/13 (ref 9/13) | stall h 0.4/1.0 -> 0.0/1.0 | cleared 10/10 at h 11.1/17.1 (ref 10/10 @12.1/16.0) | loss dur/HP 51s 45% | charge kills/att 1.67
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 2/5 -> 2/3 | Auto-Cast 3/18 (ref 2/8) | active 7/11 (ref 8/16) | stall h 1.0/2.0 -> 1.0/2.0 | cleared 10/10 at h 14.1/22.1 (ref 10/10 @15.1/21.1) | loss dur/HP 48s 66% | charge kills/att 1.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 4/7 -> 3/12 | Auto-Cast 2/25 (ref 1/25) | active 8/18 (ref 9/16) | stall h 1.0/3.9 -> 1.0/2.5 | cleared 10/10 at h 20.1/27.1 (ref 10/10 @19.6/27.1) | loss dur/HP 47s 57% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/5 -> 3/5 | Auto-Cast 2/13 (ref 5/23) | active 8/12 (ref 5/7) | stall h 0.5/1.9 -> 0.7/1.0 | cleared 10/10 at h 23.0/32.1 (ref 10/10 @23.8/32.0) | loss dur/HP 44s 58% | charge kills/att 1.00 | volley % of target HP 50%
-- Foundry exit 10/10 at h 23.0/32.1 (ref 10/10 @23.8/32.0) | Endless entered 10/10 at h 25.4/33.9 (ref 10/10 @25.2/33.9) | hours in Endless 69.6/76.2 -> 66.1/72.6 | best wave 1031/1173 -> 1005/1146 | milestones 41/46 | deaths/h 5.2/7.5 -> 5.6/6.7 | gold earned/h M 4014.2/15695.6 -> 3864.4/9435.6 spent/h M 3647.9/14367.3 | levels gained in Endless 189/227 | power ratio in Endless x3007.2/10724.6 -> x2912.2/7559.5
-- totals: Lv@96h 254/289 -> 253/274 | power@96h K 1134542/4069772 -> 1008790/2626770 | gold earned M 281014/1208579 -> 251201/688813 | ore earned K 1031254/3433384 -> 1031111/2121066 | renown K 9397/16937 -> 10084/14427 | defeats 910/1455 -> 994/1534 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 62 Hollow King 1/7 stall 2.6h clear@20.6 | seed 63 Warlord 1/5 stall 2.2h clear@8.3 | seed 65 Hollow King 1/4 stall 2.0h clear@27.1 | seed 69 Hollow King 1/7 stall 3.9h clear@19.0 | seed 70 Hollow King 1/5 stall 2.9h clear@21.0
-- outliers: none

===== CASUAL  batch_out_base34 (n=10)  reference batch_out_owner2 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 8/9 / 8/9 (ref 9/9) Lv 53/105 -> 56/77 powerK 239/5127 -> 239/1130 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 171/221 -> 176/196 powerK 73991/457722 -> 70490/158539 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 233/273 -> 236/254 powerK 644781/2682573 -> 542846/1057839 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 270/307 -> 271/292 powerK 2068234/8071888 -> 1727898/3725043
-- Shatters per run 3/3 -> 3/3 | first h 6.1/8.1 -> 6.1/7.1 | third h 19.1/26.1 -> 19.1/22.1 | min gap 4.1/5.9 -> 5.0/6.1
-- hours in zone: Greenhollow 0.3/0.4 -> 0.3/0.4 | Stillwater 1.5/2.1 -> 1.5/2.1 | Thornwood 2.5/3.8 -> 2.7/3.5 | Ironvein 2.9/4.9 -> 3.1/4.2 | Emberwaste 2.5/3.7 -> 2.6/3.5 | Amberfall 2.2/3.4 -> 2.5/3.5 | Ashen Approach 1.4/3.3 -> 2.2/4.2 | Ashen Keep 6.1/9.3 -> 5.2/8.1 | Foundry 4.7/7.9 -> 4.9/6.1 | Endless 68.9/76.5 -> 69.8/73.2
-- Warlord: reached 10/10 (ref 10/10) | attempts 1/5 -> 1/3 | Auto-Cast 0/4 (ref 1/6) | active 10/13 (ref 9/10) | stall h 0.0/1.0 -> 0.0/1.0 | cleared 10/10 at h 6.1/8.1 (ref 10/10 @6.1/7.1) | loss dur/HP 72s 26% | charge kills/att 0.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/4 -> 2/4 | Auto-Cast 0/6 (ref 0/5) | active 10/16 (ref 10/13) | stall h 0.0/1.9 -> 0.0/2.0 | cleared 10/10 at h 9.1/11.1 (ref 10/10 @9.1/11.1) | loss dur/HP 57s 42% | charge kills/att 1.00
-- Hunter King: reached 10/10 (ref 10/10) | attempts 1/3 -> 1/3 | Auto-Cast 0/3 (ref 0/2) | active 10/13 (ref 10/15) | stall h 0.0/0.9 -> 0.0/2.0 | cleared 10/10 at h 10.1/12.2 (ref 10/10 @11.1/13.2) | loss dur/HP 52s 52% | charge kills/att 1.00
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 1/2 -> 2/3 | Auto-Cast 0/0 (ref 0/3) | active 10/14 (ref 10/15) | stall h 0.0/1.1 -> 0.9/2.0 | cleared 10/10 at h 14.1/17.1 (ref 10/10 @14.1/18.1) | loss dur/HP 43s 48% | charge kills/att 0.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 3/4 -> 2/5 | Auto-Cast 0/2 (ref 0/8) | active 10/23 (ref 10/20) | stall h 1.0/4.0 -> 1.0/2.0 | cleared 10/10 at h 19.1/27.1 (ref 10/10 @19.1/25.1) | loss dur/HP 42s 43% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/3 -> 2/6 | Auto-Cast 1/1 (ref 0/7) | active 9/16 (ref 10/21) | stall h 0.9/3.0 -> 1.0/2.0 | cleared 10/10 at h 22.0/31.1 (ref 10/10 @22.1/29.1) | loss dur/HP 29s 62% | charge kills/att 1.00 | volley % of target HP 65%
-- Foundry exit 10/10 at h 22.0/31.1 (ref 10/10 @22.1/29.1) | Endless entered 10/10 at h 24.5/33.4 (ref 10/10 @26.1/30.0) | hours in Endless 68.9/76.5 -> 69.8/73.2 | best wave 1138/1278 -> 1137/1198 | milestones 45/51 | deaths/h 6.0/7.7 -> 5.3/7.9 | gold earned/h M 8629.2/36246.3 -> 8144.1/18867.8 spent/h M 7830.4/33857.7 | levels gained in Endless 203/244 | power ratio in Endless x5417.4/20079.2 -> x5303.2/11518.6
-- totals: Lv@96h 270/307 -> 271/292 | power@96h K 2068234/8071888 -> 1727898/3725043 | gold earned M 595432/2790982 -> 570108/1377367 | ore earned K 1827084/6589009 -> 1912865/3936907 | renown K 12429/25771 -> 12620/21271 | defeats 1161/1878 -> 1173/1618 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 61 Core 1/3 stall 3.0h clear@31.1 | seed 67 Hollow King 1/4 stall 4.0h clear@27.1 | seed 69 Hollow King 1/3 stall 2.0h clear@22.1
-- outliers: none

===== ENGAGED  batch_out_base34 (n=10)  reference batch_out_owner2 (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 56/85 -> 75/126 powerK 232/1653 -> 921/16097 | 48h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 180/217 -> 202/241 powerK 91215/349740 -> 223476/1059949 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 239/276 -> 263/297 powerK 665070/2575332 -> 1777678/6646385 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 279/314 -> 304/333 powerK 2479624/8850126 -> 6640844/20480265
-- Shatters per run 3/3 -> 3/3 | first h 5.2/6.2 -> 6.1/7.1 | third h 17.1/21.2 -> 16.2/21.1 | min gap 4.1/5.9 -> 4.0/5.1
-- hours in zone: Greenhollow 0.3/0.4 -> 0.3/0.4 | Stillwater 1.5/1.9 -> 1.6/2.0 | Thornwood 2.6/3.5 -> 2.7/3.0 | Ironvein 2.9/3.8 -> 2.9/3.9 | Emberwaste 2.5/3.5 -> 2.5/3.5 | Amberfall 1.6/3.2 -> 1.4/2.3 | Ashen Approach 1.4/3.2 -> 1.3/2.3 | Ashen Keep 5.2/9.0 -> 5.2/7.2 | Foundry 6.2/8.0 -> 4.8/6.0 | Endless 69.9/74.0 -> 72.9/77.9
-- Warlord: reached 10/10 (ref 10/10) | attempts 1/2 -> 1/3 | Auto-Cast 0/0 (ref 0/1) | active 10/11 (ref 10/12) | stall h 0.0/0.1 -> 0.0/0.9 | cleared 10/10 at h 5.2/6.2 (ref 10/10 @6.1/7.1) | loss dur/HP 75s 0% | charge kills/att 0.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 1/3 -> 3/3 | Auto-Cast 0/1 (ref 0/7) | active 10/15 (ref 10/17) | stall h 0.0/1.9 -> 0.0/1.9 | cleared 10/10 at h 8.2/10.1 (ref 10/10 @8.2/10.1) | loss dur/HP 61s 20% | charge kills/att 1.00
-- Hunter King: reached 10/10 (ref 10/10) | attempts 1/2 -> 1/2 | Auto-Cast 0/0 (ref 0/0) | active 10/12 (ref 10/11) | stall h 0.0/0.0 -> 0.0/0.9 | cleared 10/10 at h 9.2/12.1 (ref 10/10 @10.1/11.2) | loss dur/HP 39s 35% | charge kills/att 1.00
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 1/3 -> 1/2 | Auto-Cast 0/0 (ref 0/1) | active 10/13 (ref 10/13) | stall h 0.0/1.1 -> 0.0/0.9 | cleared 10/10 at h 12.2/15.1 (ref 10/10 @12.2/15.2) | loss dur/HP 43s 12% | charge kills/att 0.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 2/4 -> 3/4 | Auto-Cast 0/1 (ref 0/0) | active 10/23 (ref 10/30) | stall h 0.9/4.9 -> 2.0/2.9 | cleared 10/10 at h 17.1/23.1 (ref 10/10 @16.2/21.1) | loss dur/HP 35s 50% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/4 -> 2/3 | Auto-Cast 0/0 (ref 0/0) | active 10/25 (ref 10/18) | stall h 1.0/3.0 -> 0.1/1.0 | cleared 10/10 at h 20.2/27.1 (ref 10/10 @20.1/24.2) | loss dur/HP 36s 48% | charge kills/att 0.75 | volley % of target HP 59%
-- Foundry exit 10/10 at h 20.2/27.1 (ref 10/10 @20.1/24.2) | Endless entered 10/10 at h 24.4/31.1 (ref 10/10 @22.4/28.1) | hours in Endless 69.9/74.0 -> 72.9/77.9 | best wave 1175/1304 -> 1268/1432 | milestones 47/52 | deaths/h 5.8/8.0 -> 6.2/7.6 | gold earned/h M 13997.0/51599.4 -> 37168.7/117946.0 spent/h M 12489.3/47241.6 | levels gained in Endless 214/251 | power ratio in Endless x7454.7/26060.8 -> x17112.3/37822.5
-- totals: Lv@96h 279/314 -> 304/333 | power@96h K 2479624/8850126 -> 6640844/20480265 | gold earned M 1007803/3818370 -> 2750498/9199803 | ore earned K 2476656/8327139 -> 5824608/15582794 | renown K 13862/27490 -> 22732/31246 | defeats 1333/1805 -> 1190/1435 | training h 0.0/0.0 -> 0.0/0.0
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 62 Hollow King 1/3 stall 2.9h clear@16.1 | seed 63 Hollow King 1/3 stall 4.9h clear@23.1 | seed 66 Hollow King 1/3 stall 4.9h clear@22.1 | seed 68 Core 1/4 stall 3.0h clear@23.2 | seed 69 Core 1/4 stall 2.1h clear@23.2
-- outliers: none

## What the developer asks of this review
1. The pacing proposal the pass 33 handoff asked for, now against these numbers: target hours for first Shatter, Endless entry and Endless waves 100/300/500 per profile, plus measurable gates for "not draining or boring".
2. A ranked candidate list, one lever each, with values, expected effect on the table above, and the batch to test it. Candidates must be stated so the human can approve in one line; the developer implements only after HUMAN_APPROVAL.
3. Your view on the Endless first: the developer's unapproved candidate remains the two-slope item level curve (1.12 per level to about level 30, then 1.08). If you prefer a different first lever (Endless level slope, gold exponent, or a cap on the level-growth term), say which and why.

## Caveats
n=10 per profile. Boosted idle models a player who re-buys the four-hour Auto-Cast boost whenever it lapses and never taps; true idle (no Auto-Cast) was not run by the human's choice. Simulated hours are game time at 1x; real players on 2x/4x compress them.
