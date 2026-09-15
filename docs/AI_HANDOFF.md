STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: ANALYSIS_AND_PROPOSALS_NO_GAME_CHANGE
PASS_ID: PASS_44_SHATTER10_SUPPLEMENT_AND_BALANCE_REVIEW
BASED_ON_REVIEW_PASS: REVIEWER_EIGHT_ITEM_LIST_RELAYED_BY_HUMAN_2026-09-15
BUILD: 20260914-222955
HEAD_COMMIT_SHA: 780efb81d1998744161a3a9b31e7aca511815bd6
RESULTS_COMMIT: 780efb81d1998744161a3a9b31e7aca511815bd6 (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_43 (its baselines stand as the reference)

# Crystal Road AI Handoff - Pass 44 (Shatter-10 supplement; balance findings on the pass 43 data; proposals awaiting the human's approval; runner hardened)

HUMAN_APPROVAL: none for game changes in this pass. The human asked for the Shatter-10 supplement and the analysis; every proposal below waits for a one-line approval. The runner hardening (item 7) is harness only and is applied.

DEVELOPER_POSITION per item: 1 AGREE that the approved income scheme, combined with the Endless Shatter loop, runs away (numbers below) and PROPOSE a pacing rule rather than reverting the multipliers; 2 and 3 data supplied, decision is the human's; 4 AGREE, three levers proposed; 5 AGREE, gear-level cap per ascension rank proposed; 6 DISAGREE with flattening the price curve while Endless income compounds, PROPOSE honest caps instead; 7 done; 8 conflict between the reviewer's 1x/2x and the human's 2x/4x rule, flagged.

## 1. Shatter-10 supplement (tests/sim/batch_out_shat10x2, 2x, seeds 81-90 x idleboost/light/casual/engaged x 96 h, Shatter cap 10; GATE PASS 40/40 against commit d91c4036249492af, game d81891b964e49fc1, harness f5c407044ac1127c:748490ec731a5c7d; the only game.js difference from the pass 43 reference build is the two-line market-icon redraw; report tests/sim/shat10x2_release.txt, manifest tests/sim/manifests/shat10x2.json)
- Cadence: Shatters 1-3 as in the reference (3.1 / 6.0 / 9.7 h medians, gated by the sealed zones). Shatters 4-10 all happen in Endless at wave 100, every 41 to 64 minutes, the tenth at 17.0 h median; dust per Shatter 53 to 65. Nothing in the game discourages this loop: canReforge needs only Ironvein cleared, the gain threshold (15) is met at wave 100, and the run keeps heroes, gear, gold, ore and tree.
- 1T gold: reached at 27 to 30 h (reference 52 to 57 h); 10T at 39 to 45 h (reference 82 to 93 h); gold earned by 96 h 241T / 242T / 400T / 494T (reference 6.5T / 6.4T / 10.7T / 13.0T), a 37x increase against a 6x income multiplier, because the extra gold buys tree ranks and ability ranks that push Endless deeper, where gold per kill grows 1.05 per enemy level.
- Gear: item level at 96 h 143 / 141 / 144 / 144 (reference 125 / 123 / 126 / 126): 18 more levels, 1.12^18 = 7.7x item stats. Ascension rank unchanged (1.33 to 1.50 average) because ascension is unaffordable at any cap: cost scales 1.14 per item level, so rank 3 at item level 140 costs about 4.6e10 ore; zero ascensions were bought in any of the 80 runs at either cap, and all 224B ore went to level upgrades (engaged seed 81).
- Endless: power at 96 h 186B / 164B / 217B / 232B (reference 13.5B / 11.6B / 16.5B / 16.1B, about 14x); best wave 1584 / 1585 / 1617 / 1651 (reference 1331 / 1331 / 1405 / 1400); defeats down 20 to 25%; renown about 1.8x.
- Verdict: 1T is reachable in either configuration; the scheme accelerates gear and deepens the Endless runaway substantially, and the driver is the 40-minute Shatter loop in Endless rather than the 1.17 and 1.05 factors themselves.
- Proposal (needs approval): pace the loop instead of reverting the multipliers. Each Shatter beyond the third requires the run to reach a new Endless depth: wave 100 x (n - 2) for the n-th Shatter (4th at 100, 5th at 200, 6th at 300 ...). Waves per hour fall from 48 to 5 as Endless deepens, so each further Shatter takes longer than the last and the loop cannot be spammed. Alternative if the human prefers a numeric brake: cap the linear +25% at three Shatters (gold at ten Shatters 4.9x instead of 16x). Either is a small change with contract tests; a 2x batch with cap 10 would confirm.

## 2 and 3. Road pacing (pass 43 reference, 2x)
- Road plus three Shatters: about 11.5 real hours in every profile (Endless entered at 11.3 to 11.9 h), so about 23 h at 1x and 6 h at 4x; the third Shatter at 9.0 to 9.7 h. The remaining 84 of 96 hours are Endless.
- Engaged play versus boosted idle: identical trajectories within noise (Endless at 11.3 vs 11.9 h; level 337 vs 331 at 96 h; boosted idle is ahead at 8 h because it never turns Auto-Cast off).
- Whether the Road is too short is the human's decision. Levers: fights per zone (36 on the later zones; each +33% adds about 3 h at 2x), the in-zone level slope (0.3 per fight), a fourth Shatter gate before the Foundry.

## 4. Interaction problem (why tapping and active decisions add nothing)
- Auto-Cast fires every ability, so an active player only replaces the same casts. Damage shares over the run: abilities 66 to 68%, basic 28 to 33%, taps 0 / 1 / 2 / 5% (idleboost / light / casual / engaged), Surge 0 to 1%; inside the active window taps reach 9 / 11 / 14%. Tap damage is avgAtk x 0.3 x 0.22 = 6.6% of one hero's attack per tap.
- Ablation confirms it: Pickpocket is the only node that rewards tapping strongly (+152% arena gold at rank 5, +304% at rank 10); Strike rank 10 is +28% kills at 3 taps/s.
- Proposed levers (approve any subset): (a) attention bonus: +25% XP and gold while the player tapped within the last 10 s; (b) Auto-Cast casts at 75% ability power, manual casts at 100%; (c) Crystal Surge strikes for 30% of every enemy's max HP (manual only) instead of 2.5x party attack. Recommended: (a) + (b). Target after the change: engaged reaches Endless 15 to 25% sooner than boosted idle at 2x. Simulation note: (b) needs a production manualCast() the bot can call, since the bot currently emulates manual casts by zeroing charge.

## 5. Endless control lever
- Mechanism: enemy level rises 0.15 per wave with HP 1.06 per level, so the party must grow exponentially and does, through gear (1.12 per item level; item level 84 at Endless entry, 126 at 96 h). Levels are not the driver (the XP curve slows them to about 1 per hour by 72 h). Power grows 1.46x per hour in the first 12 Endless hours and still 1.03x per hour at 72 h; gold per hour doubles every day.
- Proposal: cap item upgrade level by ascension rank, 30 levels per rank (rank 0 caps at 30, rank 4 at 150). Because ascension is unaffordable (item 1), the cap only bites if ascension is repriced at the same time: proposed ascension cost independent of item level (flat per rank, for example 40 / 160 / 500 / 1000 ore x 3^rank) so the ladder becomes rank up, then level up, then rank up, tied to the Shatter-gated ascension cap. Secondary: Endless enemy level slope 0.15 to 0.2 per wave.

## 6. Held price curve (ablation, current build, tests/sim/ablate.js seed 1)
- Ranks 5 to 10 cost about 17x ranks 1 to 5 and add a fraction of the benefit: Might +30% kills for 3.1K then +80% for 53.7K; Vigor +22% for 2.5K then +26% for 42.9K; Focus +18% for 4.6K then +22% for 80.5K; Quickstep +10% for 9.2K then +21% for 161K; Bulwark +5% then +9%; Vanguard +5% then +10%.
- Position: DISAGREE with flattening while Endless income compounds (cheaper deep ranks feed item 5). Propose caps of 50 on the 999-cap nodes (Vigor, Might, Bulwark, Vanguard, Long Stride, Strike, Prospecting, Provisions), above anything reachable in 96 h, so the UI stops implying endless stacking. Reopen the curve once item 5 lands.
- Side findings: Bulwark and Vanguard barely move outcomes at any rank; Pickpocket is the strongest node per gold in the tree.

## 7. Test runner (applied, commit be7884b)
- tests/run_tests.js runs every contract suite in its own process and exits 1 on any failing or crashing suite; verified with a deliberately failing suite. README: never read a verdict through a pipe (a pipe returns the last command's exit code, which hid a failing speed test on 2026-09-15 for one push).

## 8. Final reference matrix
- The reviewer asks for 1x and 2x; the human's standing rule is 2x and 4x, never 1x. The human decides. Provenance and validator are ready for either.

## Open
- Approvals: item 1 pacing rule (or the +25% cap), items 4 and 5 levers, item 3 (lengthen the Road or not), item 6 caps, item 8 speeds.
- Ascension pricing (found in item 1): dead at every cap; needs a decision with item 5.
