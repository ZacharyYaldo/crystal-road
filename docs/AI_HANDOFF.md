STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: NEW_CYCLE_OPENED_BY_HUMAN
PASS_ID: PASS_33_CYCLE_2_OPEN
BASED_ON_REVIEW_PASS: NONE_CURRENT_TUNING_CYCLE_COMPLETE
BUILD: 20260913-160706
HEAD_COMMIT_SHA: b8f29daf7483e83a86806254c7e288c418cfc801
RESULTS_COMMIT: b8f29daf7483e83a86806254c7e288c418cfc801 (this handoff document is committed separately on top of it)

# Crystal Road AI Handoff - Pass 33 (the human opens tuning cycle 2; harness correction; gated baseline on two builds)

HUMAN_STATEMENT (verbatim, 2026-09-13): "lets enter testing again but dont make any changes without verifying with me... QA guy is monitoring the github like before" and, on the goal: "i want the gameplay to actually last for players to play certain amount of time without it feeling draining or boring". On scope: all of the owner's post-merge changes are OPEN to review; changes during the cycle are applied on `ai-tuning-loop` only (simulator overrides), nothing reaches `main` or Pages until the human says Apply.

NEW PROCESS RULE (from the human): the developer will not implement a reviewer candidate, lock, or policy change until the human has approved it. Expect each review to be answered first with a short DEVELOPER_POSITION and a HUMAN_APPROVAL line (APPROVED / DECLINED / MODIFIED with the human's words), then the run. Reviews should therefore state candidates in a form the human can accept or decline in one line, with the expected effect in playtime terms.

DEVELOPER_POSITION: the previous cycle's numbers are void and this handoff re-baselines. Two harness defects were found and fixed on 2026-09-13: (1) the bot's zone rule ignored the game's Shatter gates (reqReforge: zones 4-5 need 1 Shatter, 6-7 need 2, 8-9 need 3; enforced by zoneUnlocked on the map), so every batch in passes 1-32 walked the whole Road on run 0, a route no player can take; the bot now uses zoneUnlocked and Shatters when the next zone is sealed (reason 'sealed'); (2) the special Endless mode started with 2 Shatters and could not enter the Endless under the gate; it now starts with 3. Also fixed: build reproducibility (build/assets.json and atlas.json are tracked; the generator has a hard-coded path and is only needed to regenerate art), and the review items listed under OWNER CHANGES. Kept by the human's decision: every bot profile has Auto-Cast on outside its active minutes (the idle model). CONFIDENCE: HIGH on the harness correction (single-run trace shows Shatters at 7h and 13h at the seals; 80/80 gated runs valid); HIGH on the gated measurements; LOW on what the right pacing is, which is the question this cycle exists to answer.

## What the gated route looks like (both builds, same seeds, same bot)
PLAYTIME (gated route, median / P90 hours of game time at 1x; bot Shatters when the next zone is sealed or after a 3h stall with >=15 dust)
Current build (batch_out_owner2, seeds 61-70):
| Profile | 1st Shatter | 2nd | 3rd | Endless entry | Wave 100 | Wave 300 | Wave 500 |
| idle | 7.2 / 10.0 | 12.1 / 16.3 | 19.4 / 24.2 | 24.0 / 30.0 | 25.0 / 31.0 | 29.0 / 37.0 | 36.0 / 47.0 |
| light | 7.0 / 9.0 | 12.1 / 16.0 | 19.6 / 27.1 | 26.0 / 34.0 | 26.0 / 35.0 | 31.0 / 41.0 | 40.0 / 51.0 |
| casual | 6.1 / 7.1 | 11.1 / 13.2 | 19.1 / 22.1 | 27.0 / 31.0 | 27.0 / 31.0 | 31.0 / 37.0 | 39.0 / 46.0 |
| engaged | 6.1 / 7.1 | 10.1 / 11.2 | 16.2 / 21.1 | 23.0 / 29.0 | 24.0 / 29.0 | 26.0 / 34.0 | 32.0 / 40.0 |
Pass 32 build (merge fe53881) on the same gated route (batch_out_refgated, seeds 61-70):
| idle | 15.2 / 16.0 | 32.0 / 35.8 | 46.6 / 55.1 | 84.0 / 90.0 | 87.0 / 95.0 | - (0/10) | - (0/10) |
| light | 13.1 / 15.0 | 28.1 / 32.1 | 46.1 / 51.1 | 80.0 / 89.0 (9/10) | 85.0 / 94.0 (9/10) | - (0/10) | - (0/10) |
| casual | 10.1 / 12.1 | 23.1 / 26.2 | 34.2 / 46.1 | 71.0 / 79.0 | 77.0 / 85.0 | - (0/10) | - (0/10) |
| engaged | 10.1 / 11.1 | 19.2 / 22.2 | 32.2 / 40.2 | 58.0 / 71.0 | 63.0 / 75.0 | 82.0 / 94.0 (9/10) | - (0/10) |

Reading: the first Shatter is set by the Ironvein gate, not by a stall; each Shatter run re-walks the opened zones in a few hours; on the current build the whole Road is done in about a day for every profile and 66-73 of the 96 hours are spent in the Endless, where waves pass 1000, party level reaches 250-300 and gold per hour reaches billions (power in the zone grows 3000-17000x against 4-25x on the pass 32 build). The driver is the item level curve (1.12 per level against 1.14 cost, with ore income rising with enemy level). No boss walls remain on the current build (Hollow King stall 1-2h median, all bosses cleared by every run); on the pass 32 build the Hollow King stalls 6-8h and the Road takes 2.5-3.5 days.

## Report (current build vs pass 32 build, gated, per profile: validity, horizons, Shatters, time per zone, late bosses, Foundry exit and Endless entry, Endless exposure and economy, totals, walls)

===== IDLE  batch_out_owner2 (n=10)  reference batch_out_refgated (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 4/5) Lv 62/91 -> 40/42 powerK 366/2229 -> 25/28 | 48h zones cur/best 9/9 / 9/9 (ref 7/7) Lv 180/196 -> 45/66 powerK 82077/159027 -> 81/91 | 72h zones cur/best 9/9 / 9/9 (ref 8/8) Lv 232/246 -> 76/82 powerK 534784/870959 -> 175/209 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 264/274 -> 106/114 powerK 1466289/2247249 -> 909/1267
-- Shatters per run 3/3 -> 3/3 | first h 7.2/10.0 -> 15.2/16.0 | third h 19.4/24.2 -> 46.6/55.1 | min gap 5.2/7.2 -> 12.3/17.6
-- hours in zone: Greenhollow 0.3/0.5 -> 0.5/0.8 | Stillwater 1.6/1.9 -> 2.4/2.8 | Thornwood 3.2/4.7 -> 3.8/4.6 | Ironvein 3.2/4.5 -> 6.3/7.8 | Emberwaste 2.8/4.1 -> 4.7/6.2 | Amberfall 2.3/3.4 -> 5.3/7.5 | Ashen Approach 2.6/3.1 -> 6.2/8.6 | Ashen Keep 3.8/6.0 -> 19.9/28.3 | Foundry 3.6/6.7 -> 7.0/8.8 | Endless 71.2/74.7 -> 12.0/17.7
-- Warlord: reached 10/10 (ref 10/10) | attempts 3/5 -> 5/9 | Auto-Cast 10/28 (ref 10/56) | active 0/0 (ref 0/0) | stall h 0.3/0.9 -> 1.1/2.5 | cleared 10/10 at h 7.2/10.0 (ref 10/10 @15.2/16.0) | loss dur/HP 61s 33% | charge kills/att 2.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 3/4 -> 3/7 | Auto-Cast 10/30 (ref 10/39) | active 0/0 (ref 0/0) | stall h 0.6/1.1 -> 0.9/3.0 | cleared 10/10 at h 10.3/13.7 (ref 10/10 @26.5/28.4) | loss dur/HP 53s 22% | charge kills/att 2.25
-- Hunter King: reached 10/10 (ref 10/10) | attempts 3/5 -> 4/11 | Auto-Cast 10/32 (ref 10/42) | active 0/0 (ref 0/0) | stall h 0.3/0.8 -> 0.6/6.8 | cleared 10/10 at h 12.1/16.3 (ref 10/10 @32.8/37.5) | loss dur/HP 56s 23% | charge kills/att 2.50
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 4/7 -> 7/17 | Auto-Cast 10/39 (ref 10/89) | active 0/0 (ref 0/0) | stall h 1.0/1.7 -> 1.3/7.5 | cleared 10/10 at h 14.8/20.2 (ref 10/10 @45.3/52.0) | loss dur/HP 53s 53% | charge kills/att 1.25
-- Hollow King: reached 10/10 (ref 10/10) | attempts 9/12 -> 21/35 | Auto-Cast 10/78 (ref 10/224) | active 0/0 (ref 0/0) | stall h 1.7/2.6 -> 6.1/10.2 | cleared 10/10 at h 19.4/24.2 (ref 10/10 @66.5/73.1) | loss dur/HP 44s 34% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 3/8 -> 9/19 | Auto-Cast 10/38 (ref 10/103) | active 0/0 (ref 0/0) | stall h 0.8/1.5 -> 5.4/8.5 | cleared 10/10 at h 21.3/27.3 (ref 10/10 @83.5/89.9) | loss dur/HP 48s 59% | charge kills/att 2.25 | volley % of target HP 48%
-- Foundry exit 10/10 at h 21.3/27.3 (ref 10/10 @83.5/89.9) | Endless entered 10/10 at h 23.8/30.0 (ref 10/10 @83.5/89.9) | hours in Endless 71.2/74.7 -> 12.0/17.7 | best wave 1049/1141 -> 163/211 | milestones 41/45 | deaths/h 5.5/6.4 -> 6.6/7.8 | gold earned/h M 5467.8/8164.5 -> 8.0/10.5 spent/h M 4993.6/7249.7 | levels gained in Endless 202/209 | power ratio in Endless x4009.9/5870.5 -> x3.6/4.9
-- totals: Lv@96h 264/274 -> 106/114 | power@96h K 1466289/2247249 -> 909/1267 | gold earned M 393698/612353 -> 140/227 | ore earned K 1467171/2029715 -> 2340/3591 | renown K 11692/14958 -> 58/137 | defeats 863/992 -> 1279/1516 | training h 0.0/0.0 -> 25.7/30.4
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 62 Hollow King 1/12 stall 2.6h clear@17.4 | seed 63 Hollow King 1/10 stall 2.4h clear@20.7 | seed 65 Hollow King 1/11 stall 2.6h clear@24.2 | seed 68 Hollow King 1/9 stall 2.5h clear@18.2
-- outliers: none

===== LIGHT  batch_out_owner2 (n=10)  reference batch_out_refgated (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 7/9 / 8/9 (ref 4/5) Lv 57/72 -> 41/45 powerK 156/686 -> 25/30 | 48h zones cur/best 9/9 / 9/9 (ref 7/7) Lv 152/185 -> 57/63 powerK 29748/122200 -> 79/89 | 72h zones cur/best 9/9 / 9/9 (ref 8/8) Lv 215/240 -> 72/82 powerK 301104/834342 -> 156/215 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 253/274 -> 108/119 powerK 1008790/2626770 -> 1037/1665
-- Shatters per run 3/3 -> 3/3 | first h 7.0/9.0 -> 13.1/15.0 | third h 19.6/27.1 -> 46.1/51.1 | min gap 6.0/7.9 -> 14.0/16.4
-- hours in zone: Greenhollow 0.4/0.4 -> 0.6/0.7 | Stillwater 1.5/2.1 -> 2.4/2.7 | Thornwood 3.1/3.8 -> 3.0/4.7 | Ironvein 3.5/4.9 -> 5.3/9.1 | Emberwaste 3.3/4.2 -> 3.2/4.6 | Amberfall 2.5/4.7 -> 3.8/4.7 | Ashen Approach 2.2/5.2 -> 4.3/6.6 | Ashen Keep 5.0/7.3 -> 24.0/41.0 | Foundry 4.8/5.9 -> 5.4/7.6 | Endless 66.1/72.6 -> 14.9/23.9
-- Warlord: reached 10/10 (ref 10/10) | attempts 2/5 -> 3/9 | Auto-Cast 5/16 (ref 3/31) | active 5/9 (ref 7/12) | stall h 0.6/1.9 -> 1.0/3.9 | cleared 10/10 at h 7.0/9.0 (ref 10/10 @13.1/15.0) | loss dur/HP 69s 42% | charge kills/att 1.60
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/5 -> 3/5 | Auto-Cast 2/10 (ref 0/13) | active 8/15 (ref 10/18) | stall h 0.9/2.7 -> 2.0/6.0 | cleared 10/10 at h 10.1/13.7 (ref 10/10 @24.1/26.1) | loss dur/HP 53s 36% | charge kills/att 1.50
-- Hunter King: reached 10/10 (ref 10/10) | attempts 2/5 -> 2/5 | Auto-Cast 1/12 (ref 2/12) | active 9/13 (ref 8/15) | stall h 0.0/1.0 -> 1.0/5.0 | cleared 10/10 at h 12.1/16.0 (ref 10/10 @29.5/34.1) | loss dur/HP 52s 27% | charge kills/att 1.50
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 2/3 -> 4/6 | Auto-Cast 2/8 (ref 0/26) | active 8/16 (ref 10/15) | stall h 1.0/2.0 -> 1.0/5.0 | cleared 10/10 at h 15.1/21.1 (ref 10/10 @39.1/43.1) | loss dur/HP 42s 64% | charge kills/att 1.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 3/12 -> 5/8 | Auto-Cast 1/25 (ref 0/27) | active 9/16 (ref 10/24) | stall h 1.0/2.5 -> 6.0/13.0 | cleared 10/10 at h 19.6/27.1 (ref 10/10 @64.1/84.1) | loss dur/HP 44s 64% | charge kills/att 0.00
-- Core: reached 10/10 (ref 9/10) | attempts 3/5 -> 3/8 | Auto-Cast 5/23 (ref 0/18) | active 5/7 (ref 9/19) | stall h 0.7/1.0 -> 3.0/12.0 | cleared 10/10 at h 23.8/32.0 (ref 9/9 @79.0/88.1) | loss dur/HP 44s 57% | charge kills/att 2.60 | volley % of target HP 51%
-- Foundry exit 10/10 at h 23.8/32.0 (ref 9/10 @79.0/88.1) | Endless entered 10/10 at h 25.2/33.9 (ref 9/10 @79.0/88.1) | hours in Endless 66.1/72.6 -> 17.0/23.9 | best wave 1005/1146 -> 193/234 | milestones 40/45 | deaths/h 5.6/6.7 -> 7.1/9.7 | gold earned/h M 3864.4/9435.6 -> 9.8/12.7 spent/h M 3483.7/8323.6 | levels gained in Endless 188/212 | power ratio in Endless x2912.2/7559.5 -> x4.8/8.5
-- totals: Lv@96h 253/274 -> 108/119 | power@96h K 1008790/2626770 -> 1037/1665 | gold earned M 251201/688813 -> 170/327 | ore earned K 1031111/2121066 -> 2797/4647 | renown K 10084/14427 -> 85/241 | defeats 994/1534 -> 1841/2745 | training h 0.0/0.0 -> 28.7/31.9
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 61 Hollow King 1/3 stall 2.0h clear@23.1 | seed 64 Sand Tyrant 1/4 stall 2.7h clear@13.7 | seed 69 Hollow King 1/12 stall 2.5h clear@19.6
-- outliers: none

===== CASUAL  batch_out_owner2 (n=10)  reference batch_out_refgated (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 5/6) Lv 56/77 -> 34/48 powerK 239/1130 -> 29/33 | 48h zones cur/best 9/9 / 9/9 (ref 7/8) Lv 176/196 -> 46/58 powerK 70490/158539 -> 77/96 | 72h zones cur/best 9/9 / 9/9 (ref 8/9) Lv 236/254 -> 82/96 powerK 542846/1057839 -> 210/572 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 271/292 -> 122/130 powerK 1727898/3725043 -> 1659/2276
-- Shatters per run 3/3 -> 3/3 | first h 6.1/7.1 -> 10.1/12.1 | third h 19.1/22.1 -> 34.2/46.1 | min gap 5.0/6.1 -> 11.0/15.0
-- hours in zone: Greenhollow 0.3/0.4 -> 0.4/0.8 | Stillwater 1.5/2.1 -> 2.4/2.9 | Thornwood 2.7/3.5 -> 2.6/4.0 | Ironvein 3.1/4.2 -> 3.4/4.0 | Emberwaste 2.6/3.5 -> 3.3/3.6 | Amberfall 2.5/3.5 -> 2.9/4.3 | Ashen Approach 2.2/4.2 -> 3.4/4.8 | Ashen Keep 5.2/8.1 -> 18.0/27.0 | Foundry 4.9/6.1 -> 3.8/6.2 | Endless 69.8/73.2 -> 23.9/29.9
-- Warlord: reached 10/10 (ref 10/10) | attempts 1/3 -> 2/4 | Auto-Cast 1/6 (ref 0/7) | active 9/10 (ref 10/11) | stall h 0.0/1.0 -> 0.0/0.9 | cleared 10/10 at h 6.1/7.1 (ref 10/10 @10.1/12.1) | loss dur/HP 74s 19% | charge kills/att 0.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 2/4 -> 1/3 | Auto-Cast 0/5 (ref 0/3) | active 10/13 (ref 10/11) | stall h 0.0/2.0 -> 0.0/5.0 | cleared 10/10 at h 9.1/11.1 (ref 10/10 @19.1/22.1) | loss dur/HP 60s 11% | charge kills/att 1.00
-- Hunter King: reached 10/10 (ref 10/10) | attempts 1/3 -> 1/3 | Auto-Cast 0/2 (ref 0/2) | active 10/15 (ref 10/13) | stall h 0.0/2.0 -> 0.0/1.9 | cleared 10/10 at h 11.1/13.2 (ref 10/10 @23.2/26.2) | loss dur/HP 55s 11% | charge kills/att 1.00
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 2/3 -> 1/3 | Auto-Cast 0/3 (ref 0/1) | active 10/15 (ref 10/14) | stall h 0.9/2.0 -> 0.0/2.9 | cleared 10/10 at h 14.1/18.1 (ref 10/10 @35.1/38.1) | loss dur/HP 40s 41% | charge kills/att 0.67
-- Hollow King: reached 10/10 (ref 10/10) | attempts 2/5 -> 4/7 | Auto-Cast 0/8 (ref 0/3) | active 10/20 (ref 10/40) | stall h 1.0/2.0 -> 8.0/15.0 | cleared 10/10 at h 19.1/25.1 (ref 10/10 @55.1/63.1) | loss dur/HP 44s 57% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/6 -> 2/6 | Auto-Cast 0/7 (ref 0/5) | active 10/21 (ref 10/20) | stall h 1.0/2.0 -> 2.9/10.9 | cleared 10/10 at h 22.1/29.1 (ref 10/10 @70.2/78.2) | loss dur/HP 38s 41% | charge kills/att 1.00 | volley % of target HP 56%
-- Foundry exit 10/10 at h 22.1/29.1 (ref 10/10 @70.2/78.2) | Endless entered 10/10 at h 26.1/30.0 (ref 10/10 @70.2/78.2) | hours in Endless 69.8/73.2 -> 23.9/29.9 | best wave 1137/1198 -> 241/268 | milestones 45/47 | deaths/h 5.3/7.9 -> 7.2/7.8 | gold earned/h M 8144.1/18867.8 -> 14.2/18.4 spent/h M 7241.9/17427.1 | levels gained in Endless 206/231 | power ratio in Endless x5303.2/11518.6 -> x8.7/10.9
-- totals: Lv@96h 271/292 -> 122/130 | power@96h K 1727898/3725043 -> 1659/2276 | gold earned M 570108/1377367 -> 396/590 | ore earned K 1912865/3936907 -> 5236/7189 | renown K 12620/21271 -> 222/333 | defeats 1173/1618 -> 2068/2601 | training h 0.0/0.0 -> 30.5/35.4
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 61 Core 1/6 stall 2.0h clear@29.1
-- outliers: none

===== ENGAGED  batch_out_owner2 (n=10)  reference batch_out_refgated (n=10) shown after ->   values med/P90
-- validity: 96h 10/10, Shatter cap 10/10
-- horizons: 24h zones cur/best 9/9 / 9/9 (ref 6/6) Lv 75/126 -> 36/43 powerK 921/16097 -> 32/38 | 48h zones cur/best 9/9 / 9/9 (ref 8/8) Lv 202/241 -> 58/69 powerK 223476/1059949 -> 91/135 | 72h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 263/297 -> 106/122 powerK 1777678/6646385 -> 917/1885 | 96h zones cur/best 9/9 / 9/9 (ref 9/9) Lv 304/333 -> 147/160 powerK 6640844/20480265 -> 4016/7309
-- Shatters per run 3/3 -> 3/3 | first h 6.1/7.1 -> 10.1/11.1 | third h 16.2/21.1 -> 32.2/40.2 | min gap 4.0/5.1 -> 9.2/11.9
-- hours in zone: Greenhollow 0.3/0.4 -> 0.4/0.5 | Stillwater 1.6/2.0 -> 2.3/3.0 | Thornwood 2.7/3.0 -> 2.7/3.4 | Ironvein 2.9/3.9 -> 2.5/3.8 | Emberwaste 2.5/3.5 -> 2.3/2.6 | Amberfall 1.4/2.3 -> 2.6/3.3 | Ashen Approach 1.3/2.3 -> 2.5/3.4 | Ashen Keep 5.2/7.2 -> 17.0/21.2 | Foundry 4.8/6.0 -> 2.7/3.5 | Endless 72.9/77.9 -> 36.8/44.8
-- Warlord: reached 10/10 (ref 10/10) | attempts 1/3 -> 1/4 | Auto-Cast 0/1 (ref 0/4) | active 10/12 (ref 10/14) | stall h 0.0/0.9 -> 0.0/1.9 | cleared 10/10 at h 6.1/7.1 (ref 10/10 @10.1/11.1) | loss dur/HP 59s 0% | charge kills/att 0.00
-- Sand Tyrant: reached 10/10 (ref 10/10) | attempts 3/3 -> 1/3 | Auto-Cast 0/7 (ref 0/0) | active 10/17 (ref 10/14) | stall h 0.0/1.9 -> 0.0/4.0 | cleared 10/10 at h 8.2/10.1 (ref 10/10 @14.2/18.2) | loss dur/HP 64s 9% | charge kills/att 0.67
-- Hunter King: reached 10/10 (ref 10/10) | attempts 1/2 -> 1/3 | Auto-Cast 0/0 (ref 0/1) | active 10/11 (ref 10/15) | stall h 0.0/0.9 -> 0.0/2.9 | cleared 10/10 at h 10.1/11.2 (ref 10/10 @19.2/22.2) | loss dur/HP 64s 31% | charge kills/att 0.00
-- Grave Knight: reached 10/10 (ref 10/10) | attempts 1/2 -> 1/2 | Auto-Cast 0/1 (ref 0/0) | active 10/13 (ref 10/12) | stall h 0.0/0.9 -> 0.0/2.0 | cleared 10/10 at h 12.2/15.2 (ref 10/10 @27.2/31.3) | loss dur/HP 45s 24% | charge kills/att 0.00
-- Hollow King: reached 10/10 (ref 10/10) | attempts 3/4 -> 6/15 | Auto-Cast 0/0 (ref 0/2) | active 10/30 (ref 10/73) | stall h 2.0/2.9 -> 7.1/10.9 | cleared 10/10 at h 16.2/21.1 (ref 10/10 @45.1/53.2) | loss dur/HP 41s 47% | charge kills/att 0.00
-- Core: reached 10/10 (ref 10/10) | attempts 2/3 -> 2/4 | Auto-Cast 0/0 (ref 0/0) | active 10/18 (ref 10/26) | stall h 0.1/1.0 -> 1.1/7.0 | cleared 10/10 at h 20.1/24.2 (ref 10/10 @57.2/70.1) | loss dur/HP 37s 38% | charge kills/att 0.67 | volley % of target HP 70%
-- Foundry exit 10/10 at h 20.1/24.2 (ref 10/10 @57.2/70.1) | Endless entered 10/10 at h 22.4/28.1 (ref 10/10 @57.2/70.1) | hours in Endless 72.9/77.9 -> 36.8/44.8 | best wave 1268/1432 -> 374/428 | milestones 50/57 | deaths/h 6.2/7.6 -> 7.7/8.3 | gold earned/h M 37168.7/117946.0 -> 41.1/66.4 spent/h M 32994.6/104903.6 | levels gained in Endless 240/267 | power ratio in Endless x17112.3/37822.5 -> x25.1/46.1
-- totals: Lv@96h 304/333 -> 147/160 | power@96h K 6640844/20480265 -> 4016/7309 | gold earned M 2750498/9199803 -> 1593/3016 | ore earned K 5824608/15582794 -> 15330/27761 | renown K 22732/31246 -> 808/1212 | defeats 1190/1435 -> 2056/2339 | training h 0.0/0.0 -> 23.1/29.0
-- boss walls (>2h stall or uncleared with >=3 attempts): seed 62 Hollow King 1/4 stall 2.9h clear@19.1 | seed 67 Hollow King 1/4 stall 2.9h clear@21.1 | seed 70 Hollow King 1/4 stall 2.9h clear@17.1
-- outliers: none

OWNER CHANGES SINCE THE MERGE (all on main, all deployed, none simulator-validated before being shipped; ALL OPEN for this cycle per the human)
- Battle speed 1.265x and march speed 1.15x (BATTLE_SPEED, MARCH_SPEED; the 1x/2x/4x toggle multiplies on top). Note: the simulator runs at 1x, so these compress real time, not sim hours.
- Drops: DROP_MULT 1.1 inside zoneBonus (kill gold, kill ore, chest gold, chest ore, offline estimate); ORE_DROP_CHANCE 0.40 (was 0.35); CHEST_ORE_MULT 1.2.
- Abilities: AB_BOOST 1.05 on revive, Rage and the three damage abilities; Shield Wall 15% and Sanctuary heal 17.5% at rank 1 on a floor-plus-rise curve (abRise, constant 0.32); SHIELD_MIN_CUT 3 (a shield removes at least 3 damage per hit; damage floors at 1).
- Gear: item bases 7 / 3.5 / 14 (were 6 / 3 / 12); rank steps ITEM_RANK_STEPS [2.2, 3, 3, 2.2, 2.2] (were 2.2 flat); ITEM_LVL_GROWTH 1.12 per level (was 1.10; upgrade cost still 1.14 per level); ascension cost table ASCEND_BASE [40, 160, 500, 1000] x 1.14^lvl (was 40 x 4^rank).
- Vael income 2.5 ore and 10 gold per villager per building level per hour (were 2 and 8).
- Automatic training retreat OFF (AUTO_TRAIN=false; settings toggle removed). Manual travel and the loss tips remain.
- No stuns on map 1 before the first checkpoint (fresh save, road fights only).
- Boss loss returns the party to the last checkpoint; consecutive boss losses go one checkpoint further back (capped at two); tapping the latest checkpoint or the boss dot resets the streak; streak is saved.
- Arriving in a zone starts at its highest reached checkpoint; zone travel restores full HP.
- One-off tutorials: first-map death (gear / rank up / Tree), speed button after Sera joins; toasts and tab pulses hidden during tutorials.
- Misc: Slime charge named Slam (per-enemy chargeName); bosses draw behind summons; chest grab box above enemy tap boxes; taps on a moving enemy do not retarget; tapped casts that never fired are cancelled at the next fight with charge refunded; offline efficiency prorated to boosted hours.

## What the developer asks of this review
1. A pacing proposal in playtime terms that fits the human's goal: how long the Road should take to the first Shatter, to the Endless, and to Endless waves 100/300/500 for the four profiles, and what "not draining or boring" should mean as measurable gates (stall hours per boss, Shatter cadence, the fraction of time spent re-walking, Endless resistance).
2. A ranked candidate list to move from the measured numbers toward that proposal, one lever per candidate, each with the values, the expected effect and the batch that would test it. The developer's own first candidate is a two-slope item level curve (1.12 per level to about level 30, then 1.08) to contain the Endless without touching the early feel; it is not approved and has not been run.
3. Confirmation of the process: reviewer proposes, human approves in one line, developer implements as a simulator override on this branch and runs the batch, reviewer reads the results. Nothing goes to main without the human's Apply.

## Caveats
n=10 per profile on both gated batches; the current-build batch ran the source at commit 2272902 (before the checkpoint-snap-on-arrival, offline, tutorial and toast changes, none of which affect the bot's route materially; the bot travels by setting the zone directly and does not use the map's arrival snap). Simulated hours are game time at 1x; real players on 2x/4x compress them. The bot's Shatter timing on the gated route is forced by the seals for the first two Shatters and by the 3h stall rule for the third.
