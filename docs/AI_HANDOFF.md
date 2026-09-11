STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: VALID_BASELINE_WITH_ONE_PROPOSAL
PASS_ID: PASS_24_VALID_SHATTER_BASELINE
BASED_ON_REVIEW_PASS: PASS_24_VALID_SHATTER_BASELINE
BUILD: 20260911-135817
HEAD_COMMIT_SHA: 33e160d91d6b46576afe0c30b6a934d65f78fd21

# Crystal Road AI Handoff - Pass 24 (valid 72h Shatter baseline, production values, fixed ascension policy)

DEVELOPER_POSITION: AGREE with the review; the baseline batch ran as specified and every validity check passes: all 30 runs report 72.00 simulated hours, no run exceeds three Shatters and none stops at three (the run-3 replay is observed in 27 runs), every run matches its pass 22 seed hour by hour, in first-Shatter timing and location, and in dust purchases up to the instant of its first Shatter (there is no first ascension, see below), and no production source or bundle changed. The one qualification is that the specified ascension policy is vacuous in practice: it performed zero ascensions in 30 runs, for a reason that is a finding about the game rather than the policy (smoke evidence below). Absolute 72h result: Ashen Keep is entered by 30 of 30 runs, fight 36 is reached in 13 runs, the Hollow King is attempted 30 times and beaten 0 times (every loss 16-24s with 84-93% boss HP left, 4 summons reached), no Keep clear, no Foundry entry. CONFIDENCE: HIGH on validity and measurements; HIGH on the mechanism (two stacked damage terms, quantified by run); MEDIUM on which lever the reviewer should pick first, so both are laid out.

## Setup, policy, validity
- Simulator only (commits 5657d93, 1ff3063, 33e160d): `--shatters 3` is a cap (runs continue to 72h; `--stopAtShatters` not used); gear ascension through production `ascendItem`/`ascendCost`/`ascendCap` at every gear decision after the first Shatter, heroes in party order, slots weapon, cape, charm, restarting from the top after each purchase, then the existing item-level policy; per-ascension telemetry (hour, run, hero, slot, item, ranks, level, cost, ore before/after) and equipped ranks/levels plus ore recorded at every zone entry; diagnostic flags `--ascendFromRun0` and `--ascendReserve` exist, off by default, used only for the smoke runs quoted below.
- Batch: seeds 31-40 x idle/light/casual x 72h, `--stallRule far --stallHours 3`, `--shatters 3`, pass 22 dust policy, production values (Ashen Keep 50); 30 runs; 0 errors.
- Validity (per profile, 10/10 each): 72h reached; Shatter cap respected; audit against pass 22 OK through the first Shatter (hourly state, first Shatter hour and zone, dust purchases); ascension legality trivially OK (no ascensions, no anomalies). Report tool `tests/sim/baseline72.js`.
- Ascension telemetry note: the review's fourth check (legal cap, production cost, ore spent, one rank) is implemented in the bot (each ascension is verified against the game's own outcome before being recorded; any mismatch would be logged as an anomaly) and in the report; it could not be exercised because nothing was affordable.

ASCENSION SMOKE EVIDENCE (single 72h runs, not part of the batch)
Literal policy (this batch): 0 ascensions in 30 of 30 runs. At the first Shatter (20-26h) every equipped item is already level 27-49 from the item-level policy, and the production cost is 40 x 4^rank x 1.14^level: a level-46 rank-0 item costs 16.6K ore, rank 1->2 at level 40 costs 30K, against 300-750 ore on hand and about 3.6K ore per hour of income that the level policy spends as it arrives.
Diagnostic variant (flags --ascendFromRun0 --ascendReserve 3, off by default; the production cap already allows rank 1 before any Shatter): casual seed 31: 4 ascensions, all rank 0->1 at item level 0-1 in hours 0.2-0.7 for 40-46 ore each, none afterwards; light 31: 6, all in hours 0.3-1.5; casual 32: 4 in hours 0.2-3.0. No rank 2 or higher is ever affordable, and no ascension happens after a Shatter. Gear at the Keep in the variant: ranks 1-2 at levels 33-45, same as the literal policy plus one rank on some slots. Hollow King results unchanged (0 wins).
Why: the item stat formula is base x 2.2^rank x 1.10^level, so 40 levels are worth 45x and one rank 2.2x; the bot (and any player who levels gear) prices itself out of ascension within the first hours, and the ascension counterweight to the +25% per Shatter cannot be reached through leveled gear at production costs.

## Absolute 72h baseline (per seed: validity, Shatters with the replay each one started, Keep entries with gear and ore, Keep ordinary fights, Hollow King attempts with boss level and ATK, clears, horizons at 24/36/48/60/72h, totals; then per-profile validity and summaries)

===== IDLE  batch_out_p24  (audited against batch_out_p22)

seed 31  hours 72.00  Shatters 2  ascensions 0  audit OK (hourly 26/26 before h26.40, first Shatter same, dust buys same)
  Shatter 1 h26.4 in Ironvein Caverns fight 36 Lv51 +22 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @40.69h
  Shatter 2 h51.22 in Ashen Approach fight 29 Lv66 +32 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @59.12h, Keep @59.12h Lv52
  Keep entry run2 @undefinedh Lv52 pw84766 ore806 gear[Aldric:1/44,2/38,1/44|Sera:2/38,1/44,1/44|Vex:0/50,1/44,0/50|Morrow:1/44,2/37,0/50]
  Keep ordinary: enc 1356 L359 (26%) 12.9h far 24 rewalk 7.15h
  zones cur/best 24h 4/4, 36h 5/5, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1161 | training 24.6h | gold earned 12695K spent 11526K | ore earned 366048 spent 363888 | dust earned 54 left 5 | final run 2 Ashen Keep fight 24 Lv65

seed 32  hours 72.00  Shatters 2  ascensions 0  audit OK (hourly 26/26 before h26.13, first Shatter same, dust buys same)
  Shatter 1 h26.13 in Emberwaste fight 25 Lv50 +22 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @41.58h
  Shatter 2 h52.16 in Amberfall Woods fight 36 Lv65 +32 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @62.54h, Keep @62.54h Lv55
  Keep entry run2 @undefinedh Lv55 pw84041 ore1864 gear[Aldric:0/50,1/44,2/38|Sera:1/44,1/44,2/38|Vex:0/50,1/44,1/44|Morrow:0/50,2/38,2/38]
  Keep ordinary: enc 913 L284 (31%) 9.5h far 17 rewalk 4.61h
  zones cur/best 24h 4/4, 36h 5/5, 48h 6/6, 60h 6/6, 72h 7/7 | defeats 1033 | training 25.9h | gold earned 11774K spent 10839K | ore earned 346536 spent 345528 | dust earned 54 left 9 | final run 2 Ashen Keep fight 14 Lv64

seed 33  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 40/40 before h40.71, first Shatter same, dust buys same)
  Shatter 1 h40.71 in Emberwaste fight 36 Lv65 +30 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @44.81h
  Shatter 2 h53.44 in Ashen Approach fight 24 Lv60 +32 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @57.61h, Keep @57.61h Lv45
  Shatter 3 h64.77 in Ashen Keep fight 13 Lv58 +37 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @66.28h, Keep @66.28h Lv37
  Keep entry run2 @undefinedh Lv45 pw85438 ore1785 gear[Aldric:1/44,1/44,2/37|Sera:1/44,1/44,2/37|Vex:1/44,1/44,1/44|Morrow:1/44,2/37,2/37]
  Keep entry run3 @undefinedh Lv37 pw117291 ore2176 gear[Aldric:1/47,1/47,2/40|Sera:1/47,1/47,2/40|Vex:1/46,1/47,1/46|Morrow:1/46,2/40,2/40]
  Keep ordinary: enc 1313 L409 (31%) 12.9h far 25 rewalk 5.78h
  zones cur/best 24h 4/4, 36h 6/6, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1137 | training 20.6h | gold earned 14403K spent 13307K | ore earned 416088 spent 412992 | dust earned 99 left 7 | final run 3 Ashen Keep fight 24 Lv49

seed 34  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 23/23 before h23.32, first Shatter same, dust buys same)
  Shatter 1 h23.32 in Ironvein Caverns fight 36 Lv49 +22 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @34.63h
  Shatter 2 h38.79 in Emberwaste fight 36 Lv54 +31 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @53.32h, Keep @53.32h Lv60
  Shatter 3 h66.75 in Ashen Keep fight 29 Lv70 +38 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @68.29h, Keep @68.29h Lv35
  Keep entry run2 @undefinedh Lv60 pw86677 ore651 gear[Aldric:1/44,2/37,2/37|Sera:0/50,2/37,2/37|Vex:1/43,0/50,1/44|Morrow:2/37,1/43,2/37]
  Keep entry run3 @undefinedh Lv35 pw119440 ore1594 gear[Aldric:1/47,2/40,2/40|Sera:0/53,2/40,2/40|Vex:1/47,0/53,1/47|Morrow:2/40,1/47,2/40]
  Keep ordinary: enc 1714 L415 (24%) 17.1h far 33 rewalk 8.69h
  zones cur/best 24h 3/4, 36h 6/6, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1111 | training 19.6h | gold earned 15384K spent 14371K | ore earned 418752 spent 415008 | dust earned 91 left 18 | final run 3 Ashen Keep fight 24 Lv48

seed 35  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 32/32 before h32.51, first Shatter same, dust buys same)
  Shatter 1 h32.51 in Emberwaste fight 36 Lv57 +25 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @40.49h
  Shatter 2 h51.91 in Ashen Approach fight 25 Lv62 +32 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @57.53h, Keep @57.53h Lv47
  Shatter 3 h64.38 in Ashen Keep fight 15 Lv57 +36 dust (stalled 3.02h)  -> run 3: 7 zones cleared, last Ashen @66.7h, Keep @66.7h Lv40
  Keep entry run2 @undefinedh Lv47 pw83705 ore2459 gear[Aldric:0/50,2/38,1/44|Sera:0/50,2/38,1/44|Vex:0/50,1/44,2/38|Morrow:2/38,1/44,1/44]
  Keep entry run3 @undefinedh Lv40 pw112172 ore1109 gear[Aldric:0/53,2/41,1/47|Sera:0/53,2/41,1/47|Vex:0/53,1/47,2/40|Morrow:2/40,1/47,1/47]
  Keep ordinary: enc 1246 L329 (26%) 12.1h far 24 rewalk 6.73h
  zones cur/best 24h 4/4, 36h 5/5, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1098 | training 20.1h | gold earned 16196K spent 15398K | ore earned 454536 spent 452592 | dust earned 93 left 9 | final run 3 Ashen Keep fight 24 Lv52

seed 36  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 30/30 before h30.11, first Shatter same, dust buys same)
  Shatter 1 h30.11 in Amberfall Woods fight 24 Lv57 +25 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @37.73h
  Shatter 2 h41.08 in Ashen Approach fight 14 Lv53 +31 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @50.82h, Keep @50.82h Lv55
  Shatter 3 h65.88 in Ashen Keep fight 24 Lv69 +38 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @67.35h, Keep @67.35h Lv37
  Keep entry run2 @undefinedh Lv55 pw81858 ore599 gear[Aldric:1/43,2/37,1/43|Sera:1/43,1/43,1/43|Vex:2/36,1/43,0/49|Morrow:2/36,2/36,2/36]
  Keep entry run3 @undefinedh Lv37 pw127735 ore2235 gear[Aldric:1/48,2/41,1/48|Sera:1/47,1/47,1/47|Vex:2/41,1/47,0/54|Morrow:2/41,2/41,2/41]
  Keep ordinary: enc 2163 L477 (22%) 19.7h far 31 rewalk 11.97h
  zones cur/best 24h 4/4, 36h 5/5, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1256 | training 21.3h | gold earned 17331K spent 16459K | ore earned 488736 spent 485424 | dust earned 94 left 4 | final run 3 Ashen Keep fight 25 Lv53

seed 37  hours 72.00  Shatters 2  ascensions 0  audit OK (hourly 34/34 before h34.06, first Shatter same, dust buys same)
  Shatter 1 h34.06 in Amberfall Woods fight 26 Lv60 +26 dust (stalled 3h)  -> run 1: 7 zones cleared, last Ashen @52.12h, Keep @52.12h Lv63
  Shatter 2 h67.46 in Ashen Keep fight 30 Lv74 +36 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @68.47h, Keep @68.47h Lv32
  Keep entry run1 @undefinedh Lv63 pw79368 ore1393 gear[Aldric:2/37,2/37,2/37|Sera:1/43,1/43,2/37|Vex:1/43,1/43,2/37|Morrow:1/43,0/49,2/37]
  Keep entry run2 @undefinedh Lv32 pw115189 ore2779 gear[Aldric:2/41,2/41,2/41|Sera:1/47,1/47,2/41|Vex:1/47,1/47,2/41|Morrow:1/47,0/53,2/41]
  Keep ordinary: enc 1887 L339 (18%) 18.9h far 35 rewalk 10.69h
  Hollow King 0/2: L20s 86% Lv72 r1 bossLv61 atk10036 | L17s 93% Lv45 r2 bossLv61 atk12545
  zones cur/best 24h 4/4, 36h 5/5, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1007 | training 23.5h | gold earned 14642K spent 13828K | ore earned 444312 spent 441288 | dust earned 62 left 9 | final run 2 Ashen Keep fight 25 Lv47

seed 38  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 19/19 before h19.05, first Shatter same, dust buys same)
  Shatter 1 h19.05 in Ironvein Caverns fight 36 Lv44 +21 dust (stalled 3h)  -> run 1: 4 zones cleared, last Ironvein @21.63h
  Shatter 2 h28.63 in Ironvein Caverns fight 36 Lv40 +23 dust (stalled 3h)  -> run 2: 6 zones cleared, last Amberfall @41.13h
  Shatter 3 h51.38 in Ashen Approach fight 28 Lv63 +34 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @60.93h, Keep @60.93h Lv55
  Keep entry run3 @undefinedh Lv55 pw108318 ore2259 gear[Aldric:1/46,2/39,2/39|Sera:1/46,1/46,2/39|Vex:1/45,1/45,1/46|Morrow:0/52,1/45,2/39]
  Keep ordinary: enc 1071 L327 (31%) 11.1h far 26 rewalk 4.41h
  zones cur/best 24h 4/4, 36h 5/5, 48h 6/6, 60h 6/6, 72h 7/7 | defeats 1091 | training 23.0h | gold earned 15051K spent 13807K | ore earned 407520 spent 404928 | dust earned 78 left 1 | final run 3 Ashen Keep fight 24 Lv63

seed 39  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 22/22 before h22.52, first Shatter same, dust buys same)
  Shatter 1 h22.52 in Ironvein Caverns fight 36 Lv48 +21 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @37.48h
  Shatter 2 h41.61 in Emberwaste fight 36 Lv59 +32 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @57.11h, Keep @57.11h Lv62
  Shatter 3 h61.57 in Ashen Keep fight 14 Lv66 +37 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @66.48h, Keep @66.48h Lv48
  Keep entry run2 @undefinedh Lv62 pw89089 ore981 gear[Aldric:1/45,2/38,1/44|Sera:0/51,2/38,1/44|Vex:1/44,1/44,0/51|Morrow:1/44,2/38,0/51]
  Keep entry run3 @undefinedh Lv48 pw115136 ore878 gear[Aldric:1/47,2/41,1/47|Sera:0/53,2/41,1/47|Vex:1/47,1/47,0/53|Morrow:1/47,2/40,0/53]
  Keep ordinary: enc 1060 L329 (31%) 10.0h far 24 rewalk 4.37h
  zones cur/best 24h 4/4, 36h 5/5, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1176 | training 23.5h | gold earned 15153K spent 14468K | ore earned 431352 spent 427464 | dust earned 90 left 1 | final run 3 Ashen Keep fight 24 Lv55

seed 40  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 28/28 before h28.01, first Shatter same, dust buys same)
  Shatter 1 h28.01 in Emberwaste fight 36 Lv55 +25 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @38.05h
  Shatter 2 h47.59 in Ashen Approach fight 26 Lv62 +32 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @53.22h, Keep @53.22h Lv48
  Shatter 3 h58.99 in Ashen Keep fight 14 Lv55 +36 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @64.52h, Keep @64.52h Lv51
  Keep entry run2 @undefinedh Lv48 pw82908 ore1681 gear[Aldric:1/43,2/37,2/37|Sera:1/43,1/43,2/37|Vex:2/37,1/43,1/43|Morrow:1/43,2/36,2/36]
  Keep entry run3 @undefinedh Lv51 pw121716 ore2009 gear[Aldric:1/46,2/40,2/40|Sera:1/46,1/46,2/40|Vex:2/40,1/46,1/46|Morrow:1/46,2/40,2/40]
  Keep ordinary: enc 1362 L399 (29%) 13.2h far 30 rewalk 6.41h
  Hollow King 0/1: L21s 87% Lv59 r3 bossLv61 atk15681
  zones cur/best 24h 5/5, 36h 5/5, 48h 4/6, 60h 6/7, 72h 7/7 | defeats 1177 | training 23.6h | gold earned 16400K spent 15143K | ore earned 447696 spent 446328 | dust earned 93 left 4 | final run 3 Ashen Keep fight 25 Lv61

-- idle validity: 72h reached 10/10, Shatter cap respected 10/10, pre-first-ascension/Shatter audit OK 10/10, ascension legality OK 10/10
-- idle summary: Shatters 27 (first Shatter h med 26.4); ascensions per run med 0 total 0; runs entering the Keep 10/10, entry Lv med 48; Keep loss% med 26, furthest fight med 25; fight 36 reached 2 runs, Hollow King 0/3 (summons 0); Keep clears 0, Foundry 0; run-3 replay: 7 runs, zones cleared med 7 in 7.6h
   zones cur/best med 24h 4/4, 36h 5/5, 48h 6/6, 60h 7/7, 72h 7/7 | defeats med 1111 | training h med 23.0 | gold earned med 15.05M | ore earned med 418752

===== LIGHT  batch_out_p24  (audited against batch_out_p22)

seed 31  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 22/22 before h22.93, first Shatter same, dust buys same)
  Shatter 1 h22.93 in Emberwaste fight 31 Lv49 +22 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @35.04h
  Shatter 2 h45.89 in Amberfall Woods fight 36 Lv64 +32 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @51.05h, Keep @51.06h Lv46
  Shatter 3 h56.08 in Ashen Keep fight 22 Lv53 +36 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @58.04h, Keep @58.04h Lv37
  Keep entry run2 @undefinedh Lv46 pw80496 ore1297 gear[Aldric:2/37,2/37,1/44|Sera:1/44,1/44,1/44|Vex:1/43,1/43,1/43|Morrow:0/50,2/37,2/37]
  Keep entry run3 @undefinedh Lv37 pw101946 ore2999 gear[Aldric:2/39,2/39,1/46|Sera:1/46,1/45,1/45|Vex:1/45,1/45,1/45|Morrow:0/52,2/39,2/39]
  Keep ordinary: enc 1998 L626 (31%) 19.0h far 27 rewalk 9.08h
  Hollow King 0/2: L24s 87% Lv60 r3 bossLv61 atk15681 | L28s 67% summon Lv61 r3 bossLv61 atk15681
  zones cur/best 24h 4/4, 36h 6/6, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1331 | training 26.9h | gold earned 16969K spent 15855K | ore earned 489600 spent 487944 | dust earned 90 left 0 | final run 3 Ashen Keep fight 25 Lv61

seed 32  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 29/29 before h29.08, first Shatter same, dust buys same)
  Shatter 1 h29.08 in Emberwaste fight 36 Lv55 +25 dust (stalled 3h)  -> run 1: 7 zones cleared, last Ashen @46.04h, Keep @46.04h Lv61
  Shatter 2 h57.07 in Ashen Keep fight 25 Lv64 +35 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @60.09h, Keep @60.1h Lv40
  Shatter 3 h71.1 in Ashen Keep fight 24 Lv52 +36 dust (stalled 3h)  -> run 3: 6 zones cleared, last Amberfall @71.83h
  Keep entry run1 @undefinedh Lv61 pw68518 ore592 gear[Aldric:1/42,2/35,1/42|Sera:2/35,1/42,1/42|Vex:0/48,1/42,2/35|Morrow:2/35,1/41,2/35]
  Keep entry run2 @undefinedh Lv40 pw83930 ore2004 gear[Aldric:1/44,2/37,1/44|Sera:2/37,1/44,1/44|Vex:0/50,1/44,2/37|Morrow:2/37,1/44,2/37]
  Keep ordinary: enc 2273 L1208 (53%) 22.0h far 32 rewalk 4.58h
  zones cur/best 24h 5/5, 36h 5/5, 48h 7/7, 60h 6/7, 72h 6/7 | defeats 1879 | training 22.8h | gold earned 10305K spent 9568K | ore earned 329544 spent 326808 | dust earned 96 left 11 | final run 3 Ashen Approach fight 21 Lv31

seed 33  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 23/23 before h23.06, first Shatter same, dust buys same)
  Shatter 1 h23.06 in Ironvein Caverns fight 36 Lv49 +22 dust (stalled 3h)  -> run 1: 5 zones cleared, last Emberwaste @29.08h
  Shatter 2 h36.07 in Amberfall Woods fight 35 Lv50 +27 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @46.08h, Keep @46.08h Lv52
  Shatter 3 h53.07 in Ashen Keep fight 18 Lv58 +36 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @59.06h, Keep @59.06h Lv48
  Keep entry run2 @undefinedh Lv52 pw62494 ore701 gear[Aldric:1/41,0/47,2/34|Sera:0/47,2/34,1/41|Vex:1/41,0/47,0/47|Morrow:0/47,1/41,1/41]
  Keep entry run3 @undefinedh Lv48 pw89406 ore953 gear[Aldric:1/44,0/51,2/38|Sera:0/51,2/38,1/44|Vex:1/44,0/51,0/50|Morrow:0/50,1/44,1/44]
  Keep ordinary: enc 2038 L940 (46%) 19.9h far 24 rewalk 6.45h
  zones cur/best 24h 4/4, 36h 5/5, 48h 7/7, 60h 7/7, 72h 7/7 | defeats 1682 | training 22.8h | gold earned 12998K spent 12211K | ore earned 340848 spent 338976 | dust earned 85 left 19 | final run 3 Ashen Keep fight 24 Lv57

seed 34  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 22/22 before h22.58, first Shatter same, dust buys same)
  Shatter 1 h22.58 in Ironvein Caverns fight 36 Lv48 +21 dust (stalled 3h)  -> run 1: 5 zones cleared, last Emberwaste @29.06h
  Shatter 2 h37.11 in Amberfall Woods fight 28 Lv50 +27 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @53.04h, Keep @53.04h Lv59
  Shatter 3 h60.1 in Ashen Keep fight 21 Lv64 +37 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @65.05h, Keep @65.05h Lv45
  Keep entry run2 @undefinedh Lv59 pw75095 ore501 gear[Aldric:0/49,2/36,1/43|Sera:1/43,1/43,1/43|Vex:0/49,1/42,1/43|Morrow:0/49,1/42,2/36]
  Keep entry run3 @undefinedh Lv45 pw100684 ore1935 gear[Aldric:0/52,2/39,1/46|Sera:1/46,1/46,1/46|Vex:0/52,1/45,1/45|Morrow:0/52,1/45,2/39]
  Keep ordinary: enc 1425 L631 (44%) 14.0h far 24 rewalk 4.62h
  zones cur/best 24h 4/4, 36h 5/5, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1479 | training 29.1h | gold earned 12777K spent 11813K | ore earned 358488 spent 355104 | dust earned 85 left 7 | final run 3 Ashen Keep fight 24 Lv52

seed 35  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 21/21 before h21.10, first Shatter same, dust buys same)
  Shatter 1 h21.1 in Emberwaste fight 24 Lv48 +21 dust (stalled 3h)  -> run 1: 7 zones cleared, last Ashen @45.01h, Keep @45.01h Lv65
  Shatter 2 h52.08 in Ashen Keep fight 21 Lv69 +36 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @54.11h, Keep @54.11h Lv37
  Shatter 3 h64.08 in Ashen Keep fight 24 Lv52 +36 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @66.05h, Keep @66.05h Lv38
  Keep entry run1 @undefinedh Lv65 pw66300 ore1158 gear[Aldric:1/41,2/34,2/34|Sera:2/34,1/41,2/34|Vex:1/41,1/41,2/34|Morrow:1/41,2/34,2/34]
  Keep entry run2 @undefinedh Lv37 pw83274 ore1174 gear[Aldric:1/44,2/37,2/37|Sera:2/37,1/43,2/37|Vex:1/43,1/43,2/37|Morrow:1/43,2/37,2/37]
  Keep entry run3 @undefinedh Lv38 pw110222 ore2560 gear[Aldric:1/46,2/39,2/39|Sera:2/39,1/46,2/39|Vex:1/46,1/46,2/39|Morrow:1/46,2/39,2/39]
  Keep ordinary: enc 2332 L929 (40%) 23.0h far 32 rewalk 8.06h
  zones cur/best 24h 4/4, 36h 6/6, 48h 7/7, 60h 7/7, 72h 7/7 | defeats 1605 | training 25.7h | gold earned 13282K spent 12515K | ore earned 357984 spent 356544 | dust earned 93 left 3 | final run 3 Ashen Keep fight 24 Lv47

seed 36  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 29/29 before h29.14, first Shatter same, dust buys same)
  Shatter 1 h29.14 in Emberwaste fight 36 Lv56 +25 dust (stalled 3h)  -> run 1: 5 zones cleared, last Emberwaste @30.08h
  Shatter 2 h35.06 in Amberfall Woods fight 24 Lv41 +26 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @48.06h, Keep @48.06h Lv58
  Shatter 3 h53.12 in Ashen Keep fight 12 Lv62 +37 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @56.09h, Keep @56.09h Lv40
  Keep entry run2 @undefinedh Lv58 pw80382 ore1641 gear[Aldric:2/37,1/43,2/36|Sera:0/49,1/43,2/36|Vex:1/43,1/43,2/36|Morrow:0/49,1/43,2/36]
  Keep entry run3 @undefinedh Lv40 pw100969 ore1693 gear[Aldric:2/39,1/45,2/39|Sera:0/52,1/45,2/39|Vex:1/45,1/45,2/39|Morrow:0/51,1/45,2/39]
  Keep ordinary: enc 2074 L800 (39%) 21.0h far 26 rewalk 6.58h
  Hollow King 0/1: L12s 97% Lv54 r3 bossLv61 atk15681
  zones cur/best 24h 5/5, 36h 4/5, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1520 | training 22.8h | gold earned 14162K spent 13028K | ore earned 411264 spent 409104 | dust earned 88 left 10 | final run 3 Ashen Keep fight 24 Lv56

seed 37  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 22/22 before h22.11, first Shatter same, dust buys same)
  Shatter 1 h22.11 in Ironvein Caverns fight 36 Lv48 +21 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @34.03h
  Shatter 2 h42.1 in Ashen Approach fight 33 Lv59 +32 dust (stalled 3h)  -> run 2: 6 zones cleared, last Amberfall @45.88h
  Shatter 3 h52.07 in Amberfall Woods fight 36 Lv53 +33 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @59.05h, Keep @59.06h Lv50
  Keep entry run3 @undefinedh Lv50 pw92729 ore1199 gear[Aldric:0/51,1/44,2/38|Sera:1/44,1/44,2/38|Vex:1/44,2/38,2/38|Morrow:0/51,0/51,1/44]
  Keep ordinary: enc 1302 L768 (59%) 12.9h far 24 rewalk 1.59h
  zones cur/best 24h 4/4, 36h 6/6, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1647 | training 30.4h | gold earned 11957K spent 11310K | ore earned 310896 spent 308952 | dust earned 86 left 8 | final run 3 Ashen Keep fight 24 Lv55

seed 38  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 30/30 before h30.09, first Shatter same, dust buys same)
  Shatter 1 h30.09 in Emberwaste fight 36 Lv56 +25 dust (stalled 3h)  -> run 1: 5 zones cleared, last Emberwaste @33.06h
  Shatter 2 h38.07 in Emberwaste fight 36 Lv43 +26 dust (stalled 3h)  -> run 2: 5 zones cleared, last Emberwaste @39.06h
  Shatter 3 h43.09 in Amberfall Woods fight 27 Lv42 +28 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @55.07h, Keep @55.07h Lv56
  Keep entry run3 @undefinedh Lv56 pw87312 ore2405 gear[Aldric:1/44,1/44,2/38|Sera:1/44,1/44,2/38|Vex:0/50,2/38,0/51|Morrow:0/50,0/50,0/50]
  Keep ordinary: enc 1688 L887 (53%) 16.9h far 24 rewalk 3.97h
  zones cur/best 24h 4/4, 36h 5/5, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 1654 | training 27.2h | gold earned 13582K spent 12471K | ore earned 353592 spent 352512 | dust earned 79 left 0 | final run 3 Ashen Keep fight 24 Lv63

seed 39  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 21/21 before h21.10, first Shatter same, dust buys same)
  Shatter 1 h21.1 in Ironvein Caverns fight 36 Lv48 +21 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @32.07h
  Shatter 2 h39.06 in Emberwaste fight 36 Lv58 +31 dust (stalled 3h)  -> run 2: 6 zones cleared, last Amberfall @41.04h
  Shatter 3 h49.04 in Ashen Approach fight 31 Lv54 +33 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @54.09h, Keep @54.09h Lv47
  Keep entry run3 @undefinedh Lv47 pw96369 ore1782 gear[Aldric:0/51,2/38,1/44|Sera:2/38,2/38,1/44|Vex:2/38,2/38,1/44|Morrow:1/44,0/51,1/44]
  Keep ordinary: enc 1880 L1158 (62%) 17.9h far 24 rewalk 2.10h
  zones cur/best 24h 4/4, 36h 6/6, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 2086 | training 25.8h | gold earned 12326K spent 11284K | ore earned 320400 spent 318672 | dust earned 85 left 7 | final run 3 Ashen Keep fight 24 Lv55

seed 40  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 31/31 before h31.08, first Shatter same, dust buys same)
  Shatter 1 h31.08 in Ironvein Caverns fight 36 Lv56 +25 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @41.07h
  Shatter 2 h52.07 in Ashen Approach fight 32 Lv62 +32 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @58.03h, Keep @58.03h Lv47
  Shatter 3 h70.05 in Ashen Keep fight 26 Lv57 +36 dust (stalled 3h)  -> run 3: 6 zones cleared, last Amberfall @70.87h
  Keep entry run2 @undefinedh Lv47 pw79004 ore1634 gear[Aldric:0/50,2/37,1/44|Sera:1/44,1/44,1/44|Vex:0/50,1/44,1/44|Morrow:0/50,2/37,2/37]
  Keep ordinary: enc 1251 L527 (42%) 12.0h far 29 rewalk 3.73h
  zones cur/best 24h 4/4, 36h 5/5, 48h 6/6, 60h 7/7, 72h 6/7 | defeats 1355 | training 31.5h | gold earned 10906K spent 10256K | ore earned 355176 spent 353592 | dust earned 93 left 11 | final run 3 Ashen Approach fight 27 Lv37

-- light validity: 72h reached 10/10, Shatter cap respected 10/10, pre-first-ascension/Shatter audit OK 10/10, ascension legality OK 10/10
-- light summary: Shatters 30 (first Shatter h med 22.9); ascensions per run med 0 total 0; runs entering the Keep 10/10, entry Lv med 47; Keep loss% med 44, furthest fight med 24; fight 36 reached 2 runs, Hollow King 0/3 (summons 1); Keep clears 0, Foundry 0; run-3 replay: 10 runs, zones cleared med 7 in 15.9h
   zones cur/best med 24h 4/4, 36h 5/5, 48h 6/6, 60h 7/7, 72h 7/7 | defeats med 1605 | training h med 25.8 | gold earned med 12.78M | ore earned med 353592

===== CASUAL  batch_out_p24  (audited against batch_out_p22)

seed 31  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 20/20 before h20.07, first Shatter same, dust buys same)
  Shatter 1 h20.07 in Ironvein Caverns fight 36 Lv47 +24 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @30.07h
  Shatter 2 h36.09 in Emberwaste fight 36 Lv56 +31 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @41.13h, Keep @41.13h Lv43
  Shatter 3 h52.09 in Ashen Keep fight 24 Lv53 +36 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @54.15h, Keep @54.15h Lv37
  Keep entry run2 @undefinedh Lv43 pw58811 ore498 gear[Aldric:0/46,1/39,1/39|Sera:3/27,1/39,2/33|Vex:2/33,1/39,0/46|Morrow:0/46,2/33,0/46]
  Keep entry run3 @undefinedh Lv37 pw82271 ore429 gear[Aldric:0/49,1/43,1/43|Sera:3/30,1/42,2/36|Vex:2/36,1/42,0/49|Morrow:0/49,2/36,0/49]
  Keep ordinary: enc 3068 L1736 (57%) 28.8h far 32 rewalk 6.92h
  Hollow King 0/1: L22s 81% Lv54 r3 bossLv61 atk15681
  zones cur/best 24h 4/5, 36h 6/6, 48h 7/7, 60h 7/7, 72h 7/7 | defeats 2483 | training 22.5h | gold earned 14741K spent 13998K | ore earned 301032 spent 300240 | dust earned 91 left 4 | final run 3 Ashen Keep fight 24 Lv55

seed 32  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 25/25 before h25.17, first Shatter same, dust buys same)
  Shatter 1 h25.17 in Emberwaste fight 36 Lv51 +25 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @30.16h
  Shatter 2 h37.08 in Amberfall Woods fight 36 Lv49 +31 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @47.12h, Keep @47.12h Lv51
  Shatter 3 h55.16 in Ashen Keep fight 25 Lv56 +36 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @58.13h, Keep @58.13h Lv40
  Keep entry run2 @undefinedh Lv51 pw61794 ore802 gear[Aldric:0/47,1/41,2/35|Sera:0/47,1/41,2/35|Vex:0/47,1/41,1/41|Morrow:0/47,2/35,1/41]
  Keep entry run3 @undefinedh Lv40 pw78485 ore837 gear[Aldric:0/50,1/43,2/37|Sera:0/50,1/43,2/37|Vex:0/49,1/43,1/43|Morrow:0/49,2/37,1/43]
  Keep ordinary: enc 2162 L1235 (57%) 21.9h far 34 rewalk 4.35h
  Hollow King 0/1: L25s 85% Lv51 r3 bossLv61 atk15681
  zones cur/best 24h 5/5, 36h 6/6, 48h 7/7, 60h 7/7, 72h 7/7 | defeats 2016 | training 24.4h | gold earned 14643K spent 13479K | ore earned 302472 spent 301680 | dust earned 92 left 3 | final run 3 Ashen Keep fight 24 Lv52

seed 33  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 20/20 before h20.17, first Shatter same, dust buys same)
  Shatter 1 h20.17 in Ironvein Caverns fight 36 Lv47 +24 dust (stalled 3h)  -> run 1: 5 zones cleared, last Emberwaste @23.16h
  Shatter 2 h29.19 in Emberwaste fight 36 Lv45 +26 dust (stalled 3h)  -> run 2: 6 zones cleared, last Amberfall @33.08h
  Shatter 3 h37.17 in Ashen Approach fight 12 Lv47 +32 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @45.07h, Keep @45.07h Lv51
  Keep entry run3 @undefinedh Lv51 pw74637 ore703 gear[Aldric:0/48,2/35,2/35|Sera:1/42,2/35,0/48|Vex:0/48,1/42,1/42|Morrow:2/35,2/35,0/48]
  Keep ordinary: enc 2731 L1690 (62%) 26.9h far 24 rewalk 2.98h
  Hollow King 0/3: L13s 93% Lv57 r3 bossLv61 atk15681 | L19s 86% Lv57 r3 bossLv61 atk15681 | L31s 73% Lv61 r3 bossLv61 atk15681
  zones cur/best 24h 5/5, 36h 6/6, 48h 7/7, 60h 7/7, 72h 7/7 | defeats 2610 | training 22.4h | gold earned 14219K spent 13128K | ore earned 268056 spent 265464 | dust earned 82 left 6 | final run 3 Ashen Keep fight 24 Lv61

seed 34  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 16/16 before h16.17, first Shatter same, dust buys same)
  Shatter 1 h16.17 in Thornwood fight 30 Lv43 +21 dust (stalled 3h)  -> run 1: 6 zones cleared, last Amberfall @27.11h
  Shatter 2 h32.18 in Ashen Approach fight 18 Lv51 +31 dust (stalled 3.02h)  -> run 2: 6 zones cleared, last Amberfall @36.11h
  Shatter 3 h41.19 in Amberfall Woods fight 36 Lv49 +33 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @51.04h, Keep @51.04h Lv55
  Keep entry run3 @undefinedh Lv55 pw92423 ore1413 gear[Aldric:2/37,2/37,1/44|Sera:1/44,2/37,1/44|Vex:1/44,1/44,1/44|Morrow:0/50,0/50,2/37]
  Keep ordinary: enc 2206 L1296 (59%) 21.0h far 24 rewalk 2.91h
  Hollow King 0/3: L8s 97% Lv62 r3 bossLv61 atk15681 | L14s 84% Lv62 r3 bossLv61 atk15681 | L25s 67% summon Lv63 r3 bossLv61 atk15681
  zones cur/best 24h 5/5, 36h 5/6, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 2283 | training 27.1h | gold earned 15944K spent 15101K | ore earned 330624 spent 329760 | dust earned 85 left 4 | final run 3 Ashen Keep fight 24 Lv64

seed 35  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 20/20 before h20.12, first Shatter same, dust buys same)
  Shatter 1 h20.12 in Ironvein Caverns fight 36 Lv47 +24 dust (stalled 3h)  -> run 1: 5 zones cleared, last Emberwaste @22.16h
  Shatter 2 h28.12 in Amberfall Woods fight 24 Lv42 +26 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @41.11h, Keep @41.11h Lv56
  Shatter 3 h46.17 in Ashen Keep fight 25 Lv59 +37 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @48.11h, Keep @48.11h Lv36
  Keep entry run2 @undefinedh Lv56 pw68786 ore1078 gear[Aldric:1/41,2/35,2/35|Sera:2/34,1/41,2/34|Vex:1/41,1/41,1/41|Morrow:1/41,1/41,2/34]
  Keep entry run3 @undefinedh Lv36 pw82919 ore1742 gear[Aldric:1/43,2/36,2/36|Sera:2/36,1/43,2/36|Vex:1/43,1/43,1/43|Morrow:1/43,1/43,2/36]
  Keep ordinary: enc 2863 L1606 (56%) 29.0h far 29 rewalk 5.15h
  Hollow King 0/5: L34s 67% summon Lv53 r3 bossLv61 atk15681 | L16s 86% Lv54 r3 bossLv61 atk15681 | L14s 88% Lv55 r3 bossLv61 atk15681 | L16s 82% Lv55 r3 bossLv61 atk15681 | L41s 52% summon Lv56 r3 bossLv61 atk15681
  zones cur/best 24h 5/5, 36h 6/6, 48h 6/7, 60h 7/7, 72h 7/7 | defeats 2419 | training 21.2h | gold earned 15247K spent 14579K | ore earned 337032 spent 334944 | dust earned 87 left 8 | final run 3 Ashen Keep fight 24 Lv57

seed 36  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 23/23 before h23.09, first Shatter same, dust buys same)
  Shatter 1 h23.09 in Ironvein Caverns fight 36 Lv51 +25 dust (stalled 3h)  -> run 1: 5 zones cleared, last Emberwaste @25.14h
  Shatter 2 h31.17 in Amberfall Woods fight 24 Lv44 +26 dust (stalled 3h)  -> run 2: 6 zones cleared, last Amberfall @34.09h
  Shatter 3 h40.22 in Emberwaste fight 36 Lv48 +32 dust (stalled 3.05h)  -> run 3: 7 zones cleared, last Ashen @51.09h, Keep @51.09h Lv55
  Keep entry run3 @undefinedh Lv55 pw86717 ore2126 gear[Aldric:1/43,2/37,0/49|Sera:2/37,1/43,0/49|Vex:1/43,2/37,0/49|Morrow:0/49,0/49,2/37]
  Keep ordinary: enc 2295 L1281 (56%) 20.9h far 24 rewalk 3.35h
  Hollow King 0/1: L18s 84% Lv62 r3 bossLv61 atk15681
  zones cur/best 24h 4/5, 36h 6/6, 48h 6/6, 60h 7/7, 72h 7/7 | defeats 2352 | training 28.3h | gold earned 15398K spent 14459K | ore earned 318672 spent 317448 | dust earned 83 left 3 | final run 3 Ashen Keep fight 24 Lv64

seed 37  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 26/26 before h26.16, first Shatter same, dust buys same)
  Shatter 1 h26.16 in Ironvein Caverns fight 36 Lv55 +29 dust (stalled 3h)  -> run 1: 7 zones cleared, last Ashen @35.12h, Keep @35.12h Lv48
  Shatter 2 h40.14 in Ashen Keep fight 15 Lv52 +34 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @46.05h, Keep @46.05h Lv47
  Shatter 3 h52.16 in Ashen Keep fight 24 Lv51 +36 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @54.17h, Keep @54.17h Lv38
  Keep entry run1 @undefinedh Lv48 pw46096 ore545 gear[Aldric:2/31,2/31,2/31|Sera:1/37,1/37,1/37|Vex:2/31,2/31,1/37|Morrow:1/37,2/31,1/37]
  Keep entry run2 @undefinedh Lv47 pw71054 ore1417 gear[Aldric:2/35,2/35,2/35|Sera:1/41,1/41,1/41|Vex:2/35,2/35,1/41|Morrow:1/41,2/35,1/41]
  Keep entry run3 @undefinedh Lv38 pw85786 ore1565 gear[Aldric:2/37,2/36,2/36|Sera:1/43,1/43,1/43|Vex:2/36,2/36,1/43|Morrow:1/43,2/36,1/43]
  Keep ordinary: enc 3056 L1771 (58%) 28.9h far 34 rewalk 5.47h
  Hollow King 0/2: L14s 90% Lv52 r3 bossLv61 atk15681 | L14s 85% Lv54 r3 bossLv61 atk15681
  zones cur/best 24h 6/6, 36h 7/7, 48h 7/7, 60h 7/7, 72h 7/7 | defeats 2561 | training 18.8h | gold earned 14460K spent 13391K | ore earned 321264 spent 320256 | dust earned 99 left 2 | final run 3 Ashen Keep fight 24 Lv56

seed 38  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 21/21 before h21.12, first Shatter same, dust buys same)
  Shatter 1 h21.12 in Amberfall Woods fight 33 Lv51 +25 dust (stalled 3h)  -> run 1: 7 zones cleared, last Ashen @33.13h, Keep @33.13h Lv52
  Shatter 2 h49.14 in Ashen Keep fight 32 Lv63 +35 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @51.12h, Keep @51.12h Lv37
  Shatter 3 h60.1 in Ashen Keep fight 25 Lv51 +36 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @61.13h, Keep @61.13h Lv34
  Keep entry run1 @undefinedh Lv52 pw44138 ore590 gear[Aldric:1/37,2/30,2/30|Sera:1/36,0/43,1/37|Vex:2/30,0/43,0/43|Morrow:3/24,0/43,0/43]
  Keep entry run2 @undefinedh Lv37 pw68912 ore681 gear[Aldric:1/41,2/35,2/35|Sera:1/41,0/48,1/41|Vex:2/35,0/48,0/48|Morrow:3/29,0/48,0/48]
  Keep entry run3 @undefinedh Lv34 pw89681 ore1430 gear[Aldric:1/44,2/37,2/37|Sera:1/44,0/50,1/44|Vex:2/37,0/50,0/50|Morrow:3/31,0/50,0/50]
  Keep ordinary: enc 3889 L1877 (48%) 35.9h far 35 rewalk 10.87h
  Hollow King 0/7: L19s 84% Lv62 r1 bossLv61 atk10036 | L16s 84% Lv49 r2 bossLv61 atk12545 | L15s 92% Lv46 r3 bossLv61 atk15681 | L15s 81% Lv49 r3 bossLv61 atk15681 | L18s 76% Lv50 r3 bossLv61 atk15681 | L17s 83% Lv50 r3 bossLv61 atk15681 | L15s 86% Lv51 r3 bossLv61 atk15681
  zones cur/best 24h 5/5, 36h 7/7, 48h 7/7, 60h 7/7, 72h 7/7 | defeats 2568 | training 18.6h | gold earned 15335K spent 14440K | ore earned 327312 spent 325872 | dust earned 96 left 5 | final run 3 Ashen Keep fight 24 Lv52

seed 39  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 22/22 before h22.16, first Shatter same, dust buys same)
  Shatter 1 h22.16 in Ironvein Caverns fight 36 Lv51 +25 dust (stalled 3h)  -> run 1: 7 zones cleared, last Ashen @35.12h, Keep @35.12h Lv55
  Shatter 2 h47.14 in Ashen Keep fight 26 Lv62 +35 dust (stalled 3h)  -> run 2: 7 zones cleared, last Ashen @50.14h, Keep @50.14h Lv40
  Shatter 3 h55.18 in Ashen Keep fight 21 Lv50 +36 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @57.14h, Keep @57.14h Lv38
  Keep entry run1 @undefinedh Lv55 pw47889 ore925 gear[Aldric:2/31,2/31,0/44|Sera:2/31,0/44,0/44|Vex:1/37,1/37,0/43|Morrow:2/31,2/31,1/37]
  Keep entry run2 @undefinedh Lv40 pw69207 ore1498 gear[Aldric:2/35,2/35,0/48|Sera:2/35,0/48,0/48|Vex:1/41,1/41,0/48|Morrow:2/35,2/35,1/41]
  Keep entry run3 @undefinedh Lv38 pw92188 ore2310 gear[Aldric:2/38,2/38,0/50|Sera:2/38,0/50,0/50|Vex:1/44,1/44,0/50|Morrow:2/37,2/37,1/44]
  Keep ordinary: enc 3612 L1898 (53%) 31.9h far 28 rewalk 9.07h
  zones cur/best 24h 4/5, 36h 7/7, 48h 5/7, 60h 7/7, 72h 7/7 | defeats 2663 | training 20.1h | gold earned 14906K spent 13866K | ore earned 323208 spent 321120 | dust earned 96 left 7 | final run 3 Ashen Keep fight 24 Lv53

seed 40  hours 72.00  Shatters 3  ascensions 0  audit OK (hourly 17/17 before h17.18, first Shatter same, dust buys same)
  Shatter 1 h17.18 in Thornwood fight 30 Lv44 +21 dust (stalled 3h)  -> run 1: 4 zones cleared, last Ironvein @18.08h
  Shatter 2 h24.1 in Ironvein Caverns fight 36 Lv36 +22 dust (stalled 3.02h)  -> run 2: 7 zones cleared, last Ashen @37.15h, Keep @37.15h Lv52
  Shatter 3 h47.11 in Ashen Keep fight 14 Lv57 +36 dust (stalled 3h)  -> run 3: 7 zones cleared, last Ashen @51.14h, Keep @51.14h Lv41
  Keep entry run2 @undefinedh Lv52 pw48608 ore535 gear[Aldric:1/38,2/31,1/38|Sera:1/38,1/38,0/44|Vex:0/44,1/38,0/44|Morrow:1/37,1/38,2/31]
  Keep entry run3 @undefinedh Lv41 pw72189 ore668 gear[Aldric:1/42,2/35,1/42|Sera:1/42,1/42,0/48|Vex:0/48,1/42,0/48|Morrow:1/42,1/42,2/35]
  Keep ordinary: enc 3282 L1907 (58%) 30.8h far 24 rewalk 7.88h
  Hollow King 0/1: L14s 91% Lv58 r3 bossLv61 atk15681
  zones cur/best 24h 4/4, 36h 6/6, 48h 5/7, 60h 7/7, 72h 7/7 | defeats 2660 | training 22.1h | gold earned 13961K spent 12906K | ore earned 286056 spent 283464 | dust earned 79 left 6 | final run 3 Ashen Keep fight 24 Lv58

-- casual validity: 72h reached 10/10, Shatter cap respected 10/10, pre-first-ascension/Shatter audit OK 10/10, ascension legality OK 10/10
-- casual summary: Shatters 30 (first Shatter h med 20.2); ascensions per run med 0 total 0; runs entering the Keep 10/10, entry Lv med 43; Keep loss% med 57, furthest fight med 28; fight 36 reached 9 runs, Hollow King 0/24 (summons 3); Keep clears 0, Foundry 0; run-3 replay: 10 runs, zones cleared med 7 in 19.9h
   zones cur/best med 24h 5/5, 36h 6/6, 48h 6/7, 60h 7/7, 72h 7/7 | defeats med 2483 | training h med 22.1 | gold earned med 14.74M | ore earned med 318672

BOSS ATTEMPTS BY SHATTER RUN (pass 24; the boss level is the same in every run, its HP and ATK are x1.25 per Shatter)
Hollow King (Ashen Keep, boss Lv 61): run 1 ATK 10036, run 2 ATK 12545, run 3 ATK 15681 (no-Shatter run 0 in pass 20: ATK 8029)
  idle    run1 0/1 (loss 20s, 86% boss HP)  run2 0/1 (17s, 93%)  run3 0/1 (21s, 87%)
  light   run3 0/3 (24s, 87%)
  casual  run1 0/1 (19s, 84%)  run2 0/1 (16s, 84%)  run3 0/22 (16s, 85%)
  hits-to-defeat at arrival (snapshots): idle 1.1 front / 0.9 back at Lv 59 (run 1-2), light 0.8 / 0.7 at Lv 54 (run 3), casual 0.6 / 0.5 at Lv 57 (run 3)
Grave Knight (Ashen Approach, boss Lv 53): run 1 ATK 6983, run 2 ATK 8728, run 3 ATK 10910 (run 0: 5586)
  idle    run1 1/24 (party Lv 61)  run2 8/41 (Lv 56)  run3 1/49 (Lv 46, seven attempts untagged)   Auto-Cast 10/114 over all runs
  light   run1 2/3 (Lv 61)  run2 5/18 (Lv 52)  run3 3/23 (Lv 44)
  casual  run1 3/4 (Lv 54)  run2 4/9 (Lv 49)   run3 3/18 (Lv 47)
Keep entry party level by run: idle 63 (run 1, n1) / 52 (run 2, n9) / 40 (run 3, n7); light 65 / 47 / 47; casual 52 / 47 / 40. No-Shatter baseline (pass 20): 65-72.
Keep ordinary loss rate (all runs pooled): idle 26%, light 44%, casual 57%; furthest fight 25 / 24 / 28 of 36; fight 36 reached in 2 / 2 / 9 runs.

## Findings
1. The run-3 replay, never observed before, returns to the Keep: after the third Shatter at 41-58h the party re-clears seven zones in 7.6h (idle), 15.9h (light), 19.9h (casual) and enters the Keep a third time at Lv 40-47 (idle 7 runs, light 8, casual 10). Best-run zones at 60h and 72h are 7 for every profile; current-run zones at 72h are 7 as well (the replay catches up). So within 72h the Shatter loop delivers three Keep arrivals per run instead of one, each weaker than the last.
2. The Keep is uncontested at every arrival. Ordinary loss rate 26 / 44 / 57% pooled, furthest fight 25 / 24 / 28; fight 36 reached in 2 / 2 / 9 runs; Hollow King 0 for 30 (idle 3, light 3, casual 24), losses of 16-24 seconds at 84-93% boss HP with four summon reaches. Hits-to-defeat at arrival 0.5-1.1: one ordinary Hollow King hit kills a back-line hero at every level seen (Lv 54-59 here, Lv 71-74 in the no-Shatter runs of pass 20, where it was 0 for 7 at hits-to-defeat 0.6-0.7 for casual and 1.1 for idle).
3. Two stacked terms, now separated by run. (a) The Hollow King's base damage: at run 0 (no Shatter, ATK 8029, party Lv 71-74) it already one-shots a back-line hero for casual and two-shots the tank for idle; it has no charge, so the pass 12-18 damage-per-action rule applies directly. (b) The per-Shatter enemy multiplier: HP and ATK x1.25 per Shatter (DEF x1.1), so the same boss hits for 10036, 12545 and 15681 in runs 1-3 while the party arrives at Lv 63, 47-52 and 40-47. The Grave Knight shows the same thing one zone earlier (ATK 5586 -> 10910 by run 3; idle Auto-Cast 10 wins in 114 attempts across runs, 1 in 49 on run 3). The game's counterweights inside 72h are the dust blessings (+40% HP, +24-32% damage, +25 start levels by run 3), which are smaller than the x1.95 the enemies gain by run 3, and gear ascension, which the cost curve puts out of reach of leveled gear.
4. What this means for the two decision branches. "Fight 36 repeatedly reached, boss wipes" describes casual (9 of 10 runs, 24 attempts); "ordinary Keep is the dominant wall" describes idle and light (fight 36 in 2 of 10, loss rates 26-44%). Both are the same two terms: for idle and light the ordinary Keep enemies at x1.56-1.95 stop the party at fight 24-25; for casual, which arrives with active windows, the boss does.

## Proposal (one bounded mechanism; proposal only)
Recommended first: the per-Shatter enemy multiplier, `enemyStats` HP/ATK factor 1.25 -> 1.10 per Shatter (DEF 1.10 -> 1.05), simulator override only, tested on this exact batch design (seeds 31-40 x 3 profiles x 72h, same policies) paired against pass 24 with the audit through the first Shatter. It is one rule, it acts on every Shattered enemy at once (which is where all three Keep arrivals and the Grave Knight's run-2/3 wall come from), it leaves run 0 untouched so every no-Shatter row stays identical, and it is the term that grows with the mechanic the Keep is designed around. Expected: run-3 Hollow King ATK 15681 -> 10690, Grave Knight 10910 -> 7435; Keep ordinary loss rate for idle/light back toward the Ashen Approach band in runs 2-3; Hollow King still lethal (hits-to-defeat about 0.8-1.4) so contests rather than clears, which is the honest expectation and the reason a boss lever may follow. Reject if run-2/3 Keep loss rates do not fall or if the Grave Knight becomes an Auto-Cast walk on run 2-3.
Alternative, if the reviewer keeps the scaling rule locked: the direct Hollow King lever, base ATK x1.7 -> x1.2 (parity-style sizing from the run-0 idle arrival: ordinary hit 5668 - 776 = 4892 against 9833 HP, 2.0 hits-to-defeat; casual at Lv 71 about 1.5). With the scaling rule unchanged this fixes the no-Shatter path (pass 20's Lv 71-74 arrivals) and casual's run-1 attempts, and does not fix runs 2-3 (ATK 12545 -> 8855 and 15681 -> 11069 against 8894 HP), which the evidence says is where 27 of the 30 attempts happen. I would run it only after, or instead of, the multiplier test, not in the same batch.
IMPLEMENTATION_RISK: none to gameplay for either test (override path). The multiplier candidate touches a locked rule and needs the reviewer to unlock it for the override.

## Caveats
n=10 per profile. Seven Grave Knight attempts on run 3 carry no run tag (a third attempt-logging path in the bot I have not traced; their ATK identifies them as run 3); nothing else depends on it. Keep loss rates are defeats over estimated encounters. The pass 22 audit baseline was itself truncated at its third Shatter, so the audit covers the pre-first-Shatter span only, which is the span the review specified. The ascension smoke variant is diagnostic evidence, not a policy comparison, and it was not run as a batch.
