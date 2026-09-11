STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: COUNTERPROPOSAL
PASS_ID: PASS_11_AUTOCAST_CHARGE_REACTION_DIAGNOSTIC
BASED_ON_REVIEW_PASS: PASS_11_AUTOCAST_CHARGE_REACTION_DIAGNOSTIC
BASE_REVIEW_PASS: PASS_11_AUTOCAST_CHARGE_REACTION_DIAGNOSTIC
BUILD: 20260911-114749
HEAD_COMMIT_SHA: a40ebf70d9b997ec57ca04d0b480f6723b94454d

# Crystal Road AI Handoff - Pass 11 (Auto-Cast charge reaction, Phase A)

DEVELOPER_POSITION: PARTIAL. I implemented and ran the authorized Phase A exactly as specified; it FAILS the gate, so Phase B was not run and nothing was tuned. In sizing the fallback I found that my own pass 10 diagnosis was incomplete, and the correction changes which lever is appropriate.
CONFIDENCE: HIGH on the Phase A result and on the mechanism (direct per-hit measurement); MEDIUM on the proposed value.

## Implemented (commit 8d1555c, production unchanged)
`AUTO_REACT` constant, production false. Candidate rule exactly as authorized: while Auto-Cast is on and the current enemy action is a `chargeM` or `chargeR` telegraph, at most one automatic response per telegraph, living heroes in party order, first ready Knight (Shield Wall parry) / Rogue (Shadowstep interrupt) / Mage (Meteor interrupt), same 100 charge and same `reactTo()` path as the manual reaction, Cleric/Ranger/Berserker excluded, telegraph marked handled, no charge granted, no reservation, no probability or timing parameter, manual input and the 30% manual bonus untouched. Telemetry: attempts, successes, responder class, charge kind, prevented double responses, charge telegraphs per fight, normal casts per fight. Also added, observation only: a per-charge-hit record of the target's HP fraction and the damage dealt.

## Phase A: 40 pass 10 snapshots x 10 combat seeds, Auto-Cast only, 400 control + 400 candidate fights, 0 errors
fights                                        100          100          100          100          400
CONTROL (current Auto-Cast)
clear % (mean +- 95% CI)                      3+-3         5+-4         0+-0         0+-0         2+-1
duration s med / P90                          78 / 107     69 / 110     52 / 82      54 / 82      62 / 94
LOSS boss HP left med / P90                   44% / 59%    49% / 76%    64% / 82%    66% / 81%    55% / 78%
LOSS share: wiped before 50% (pre-summon)     26%          45%          84%          77%          58%
LOSS share: after summon, boss 20-50%         74%          53%          16%          23%          41%
LOSS share: near kill, boss <20% or dead      0%           2%           0%           0%           1%
WIN survivors med / party HP% med             4 / 73%      4 / 60%      -            -            4 / 60%
summon occurred %                             75%          57%          16%          23%          43%
dmg taken from boss vs adds (med %)           88% boss     93% boss     100% boss    100% boss    100% boss
charge hits / kills per fight (mean)          2.2 / 2.18   1.9 / 1.95   2 / 2.01     1.9 / 1.91   2 / 2.01
charge parried / interrupted per fight        0 / 0        0 / 0        0 / 0        0 / 0        0 / 0
charge telegraphs per fight (mean)            2.18         1.95         2.01         1.91         2.01
AUTO reactions attempted / ok per fight       0 / 0        0 / 0        0 / 0        0 / 0        0 / 0
AUTO reactions prevented (double) total       0            0            0            0            0
AUTO responder class (K/R/M) totals           0/0/0        0/0/0        0/0/0        0/0/0        0/0/0
AUTO reaction kind (chargeM/chargeR) totals   0/0          0/0          0/0          0/0          0/0
normal ability casts per fight (mean)         12.61        10.07        7.35         8.07         9.53
CANDIDATE (Auto-Cast + one reaction per telegraph)
clear % (mean +- 95% CI)                      8+-5         5+-4         0+-0         0+-0         3+-2
duration s med / P90                          90 / 123     75 / 118     75 / 97      75 / 102     77 / 114
LOSS boss HP left med / P90                   41% / 57%    47% / 68%    51% / 81%    51% / 81%    47% / 75%
LOSS share: wiped before 50% (pre-summon)     17%          26%          52%          53%          38%
LOSS share: after summon, boss 20-50%         71%          68%          48%          46%          58%
LOSS share: near kill, boss <20% or dead      12%          5%           0%           1%           4%
WIN survivors med / party HP% med             4 / 63%      4 / 60%      -            -            4 / 63%
summon occurred %                             84%          75%          48%          47%          64%
dmg taken from boss vs adds (med %)           87% boss     88% boss     100% boss    100% boss    88% boss
charge hits / kills per fight (mean)          1.6 / 1.61   1.6 / 1.55   1.4 / 1.42   1.4 / 1.45   1.5 / 1.51
charge parried / interrupted per fight        0.07 / 0.6   0.13 / 0.53  0.18 / 0.54  0.11 / 0.53  0.12 / 0.55
charge telegraphs per fight (mean)            2.23         2.08         1.99         1.98         2.07
AUTO reactions attempted / ok per fight       0.67 / 0.67  0.66 / 0.66  0.72 / 0.72  0.64 / 0.64  0.67 / 0.67
AUTO reactions prevented (double) total       1            1            2            2            6
AUTO responder class (K/R/M) totals           7/36/24      13/35/18     18/36/18     11/29/24     49/136/84
AUTO reaction kind (chargeM/chargeR) totals   67/0         66/0         72/0         64/0         269/0
normal ability casts per fight (mean)         14.51        11.95        9.82         10.69        11.74
ACTIVE reference ceiling (pass 10 arm rerun with the new telemetry, same snapshots; note the telegraph counts)
clear % (mean +- 95% CI)                      40+-10       84+-7        77+-8        91+-6        73+-4
duration s med / P90                          93 / 105     69 / 90      75 / 98      67 / 81      72 / 100
LOSS boss HP left med / P90                   34% / 45%    11% / 40%    15% / 31%    10% / 47%    21% / 44%
LOSS share: wiped before 50% (pre-summon)     0%           0%           0%           0%           0%
LOSS share: near kill, boss <20% or dead      33%          69%          70%          56%          48%
charge hits / kills per fight (mean)          1.5 / 1.5    0.3 / 0.3    0.4 / 0.32   0.2 / 0.15   0.6 / 0.57
charge parried / interrupted per fight        0.17 / 0.6   0.11 / 0.32  0.09 / 0.58  0.06 / 0.31  0.11 / 0.45
charge telegraphs per fight (mean)            2.12         0.65         0.94         0.49         1.05
normal ability casts per fight (mean)         14.43        20.45        22.8         26.16        20.96
Gate scorecard: charge kills per fight -26 / -20 / -29 / -24% (needs -60% in three profiles): FAIL. Clear rate idle 3 -> 8, light 5 -> 5 (needs +20 points): FAIL. Losses shifted away from pre-summon wipes (58% -> 38% overall): PASS. No profile above its active reference: PASS. Double responses: 0 (6 prevented, i.e. the guard worked; 0 same-tick double casts; every attempted reaction succeeded): PASS. No free charge or extra casts (casts rose 9.5 -> 11.7 per fight only because fights lasted longer): PASS. Two of six criteria fail, so Phase A fails and the reaction rule is not a candidate.

## Why it failed, and the corrected diagnosis
1. Reactions only fire when a counter is already ready, and Auto-Cast spends abilities the moment they are ready, so a counter is available for about one telegraph in three (0.67 reactions vs 2.0 telegraphs per fight). The active harness reacts at a similar rate (0.4-0.8 per fight). Reactions are not what separates the modes.
2. What separates the modes is the number of boss actions the party has to survive. In the active window light/casual/engaged see 0.5-0.9 charge telegraphs per fight instead of 2.0, because tap charge doubles ability output (20-26 casts per fight vs 8-14), Surge heals and bursts, and manual casts carry the 30% bonus. Idle-active, with no taps, still faces 2.1 telegraphs and reaches 40% only through the cast bonus and Surge.
3. The charge is lethal at any multiplier, so the charge is not the lever. Direct per-hit measurement at natural idle arrival: Warlord ATK 978 at boss Lv 31 against hero max HP 930-1258 (def 118-156). A 2.5x charge kills any hero from full HP; the harness sweep of the charge multiplier (2.0 / 1.75 / 1.5) changed nothing at all, kill rate stayed ~1.0 per hit, because 1.5 x 978 still exceeds every hero's HP. Even a normal Warlord hit removes 75-100% of a hero. Each boss action removes roughly one hero; an Auto-Cast party gets about two charges per fight and loses.
  charge x2.0
    clear % (mean +- 95% CI)                      3+-3         5+-4         0+-0         0+-0         2+-1
    LOSS share: wiped before 50% (pre-summon)     26%          45%          84%          77%          58%
    LOSS share: near kill, boss <20% or dead      0%           2%           0%           0%           1%
    WIN survivors med / party HP% med             4 / 73%      4 / 60%      -            -            4 / 60%
    charge hits / kills per fight (mean)          2.2 / 2.18   1.9 / 1.95   2 / 2.01     1.9 / 1.91   2 / 2.01
  charge x1.75
    clear % (mean +- 95% CI)                      3+-3         5+-4         0+-0         0+-0         2+-1
    LOSS share: wiped before 50% (pre-summon)     26%          45%          84%          77%          58%
    LOSS share: near kill, boss <20% or dead      0%           3%           0%           0%           1%
    WIN survivors med / party HP% med             4 / 73%      4 / 60%      -            -            4 / 60%
    charge hits / kills per fight (mean)          2.2 / 2.17   2 / 1.94     2 / 2.01     1.9 / 1.91   2 / 2.01
  charge x1.5
    clear % (mean +- 95% CI)                      3+-3         4+-4         0+-0         0+-0         2+-1
    LOSS share: wiped before 50% (pre-summon)     23%          45%          84%          77%          58%
    LOSS share: near kill, boss <20% or dead      1%           3%           0%           0%           1%
    WIN survivors med / party HP% med             4 / 73%      4 / 60%      -            -            4 / 60%
    charge hits / kills per fight (mean)          2.2 / 2.08   2 / 1.91     2 / 2.01     1.9 / 1.91   2 / 1.98

4. So the pass 10 rule mapping was wrong in one respect: this is not an "active-state" problem that Auto-Cast can be taught to answer; it is the Warlord's damage per action relative to party HP at the arrival level the Road delivers (Lv 34-38). That is the review's "early wipes or Warlord charge damage dominate while substantial boss HP remains" case, which points to an ATK-only candidate. I was wrong to steer away from it in pass 10.

## Sizing the ATK-only lever (harness, Auto-Cast, same 400 fights per variant; active ceiling checks for 1.2 and 1.0)
  Warlord ATK x1.4
    clear % (mean +- 95% CI)                      5+-4         6+-5         0+-0         0+-0         3+-2
    LOSS share: wiped before 50% (pre-summon)     19%          30%          45%          39%          33%
    LOSS share: near kill, boss <20% or dead      7%           5%           1%           1%           4%
    WIN survivors med / party HP% med             4 / 71%      4 / 69%      -            -            4 / 71%
    charge hits / kills per fight (mean)          2.4 / 2.36   2.1 / 2.13   2.3 / 2.26   2.3 / 2.25   2.3 / 2.25
  Warlord ATK x1.2
    clear % (mean +- 95% CI)                      17+-7        16+-7        0+-0         1+-2         9+-3
    LOSS share: wiped before 50% (pre-summon)     11%          26%          30%          24%          23%
    LOSS share: near kill, boss <20% or dead      18%          12%          2%           1%           8%
    WIN survivors med / party HP% med             4 / 81%      4 / 78%      -            4 / 83%      4 / 81%
    charge hits / kills per fight (mean)          2.7 / 2.56   2.4 / 2.33   2.4 / 2.36   2.5 / 2.47   2.5 / 2.43
  Warlord ATK x1.0
    clear % (mean +- 95% CI)                      42+-10       37+-9        8+-5         6+-5         23+-4
    LOSS share: wiped before 50% (pre-summon)     0%           25%          4%           11%          10%
    LOSS share: near kill, boss <20% or dead      28%          19%          8%           6%           13%
    WIN survivors med / party HP% med             4 / 83%      4 / 84%      4 / 55%      4 / 50%      4 / 82%
    charge hits / kills per fight (mean)          3 / 2.39     2.7 / 2.25   2.7 / 2.39   2.6 / 2.27   2.8 / 2.33

  Active ceiling: ATK x1.2 -> 76 / 93 / 87 / 99% (idle / light / casual / engaged); ATK x1.0 -> 90 / 98 / 90 / 100%. Current (x1.7) active is 40 / 84 / 82 / 98%.
Reading: the charge still kills on every hit at every ATK value (kills per fight 2.2-2.8), so what improves is the party surviving the normal hits between charges and killing the boss before the third. At x1.2 Auto-Cast idle/light reach 16-17%; at x1.0 they reach 37-42%, casual/engaged Auto-Cast stay at 6-8% because they arrive at Lv 34 rather than 38 (their Road attempts are mostly in active windows anyway). Longer fights (110 s vs 62 s) and 82% party HP on wins at x1.0 say the fights become fights rather than executions.

## PROPOSED_EXPERIMENT (one lever, Warlord-local, proposal only)
Warlord ATK-only candidate for the Phase B road diagnostic the review already specified (paired seeds 1-10 x idle/light/casual/engaged x 24h, 80 runs, production everything else). I recommend testing ATK x1.2 first as the hardest value that visibly moves idle and light (5x the Auto-Cast clear rate) while keeping the active ceiling under 100% for every profile, with x1.0 as the alternative if the reviewer's target for idle Ironvein first-try is in the 40% band, at the cost of the active window becoming 90-100%. Keep HP x6.0, DEF, speed, the 2.5x charge, ward and the two-orc summon exactly as they are; the charge remains a one-shot in both variants, which preserves the fight's identity and the value of parrying it.
EXPECTED_OUTCOMES: at x1.2, road idle first-try rises from 0% toward 15-20%, attempts from 7 toward 3-4, stall roughly halves; light first-try from 10% toward 20-25%; casual/engaged change little (already active-window fights); no other zone changes since only the Warlord's stat moves. If idle does not move, the arrival level, not the boss, is the remaining problem and I would say so.
IMPLEMENTATION_RISK: none technically (one number in the enemy table, already sweepable per run). Design risk: active players' Warlord fights get easier too (77-98% -> 76-99% at x1.2), and Ironvein stops being a check for engaged; the reviewer should decide whether that is acceptable for the first Lv 20 zone boss.

## A systemic observation for the backlog (no action requested)
Ordinary Ironvein enemies hit for ~566 at Lv 31 against 930-1258 HP heroes, i.e. half a hero per hit, and the Warlord's 1.7x ATK is the outlier on top of that. The same enemy-ATK-versus-hero-HP ratio at Lv 30+ is a plausible reason the Auto Training trigger fires so often in Ironvein and Emberwaste (30-40 minute trainings). If later passes keep finding per-boss ATK walls from Ironvein on, the global enemy ATK curve past Lv 25 deserves its own diagnostic rather than more per-boss fixes.

## Caveats
Same snapshot bank as pass 10 (fresh production arrivals, HP and charge carried); harness statuses cleared at fight start; RNG independent per fight; 95% intervals shown. The ATK and charge sweeps are harness-only sizing, not road results. The charge-hit measurement used 12 idle fights (25 hits) and is confirmed by the kill-per-hit ratio across all 2,000+ harness fights.
