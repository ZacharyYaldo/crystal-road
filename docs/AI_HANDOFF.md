STATUS: PARITY_BATCH_PASSED_TUNING_BRANCH_ONLY
RESPONSE_TYPE: DEFECT_FIXES_AND_PARITY_BATCH
PASS_ID: PASS_51_AUDIT_FIXES
BASED_ON_REVIEW_PASS: REVIEWER_COMBINED_VERDICT_2026-09-16 and the owner's "Go" (confirmed defects only; owner rules preserved; reset-on-Shatter kept; scalar removed; no main push and no full batches until a parity batch passes)
BUILD: 20260916-181649 (tuning branch; main untouched at f8c2a81)
HEAD_COMMIT_SHA: afc2736 (the code the parity batch ran; this handoff, the evaluator window fix and the raw results are committed on top)
PULL_REQUEST: #2
SUPERSEDES: PASS_50

# Crystal Road AI Handoff - Pass 51 (confirmed defects fixed; repeat-dust reduction per bracket and tier portion; simulator pricing, provenance and telemetry repaired; parity batch with committed raw results)

## Owner rules kept unchanged
Ten scoring taps per second; tier thresholds 7.5 / 15 / 25 / 100% of Crystal; formula targets from the bracket's own enemies; rewards on every unlocked zone and Endless bracket; claims reopen after every Shatter; Auto-Cast at 75% for damaging abilities only; evaluator criteria 4 at 0.8 and 7a as restated. The pass 50 Shatter combat scalar is removed (tests/contract/audit.test.js pins that dust ranks do not move a target).

## Production fixes (source/game.js, each with a production-path test in tests/contract/audit.test.js, 26 assertions)
- Attention multiplies kill XP through xpMult, exactly like kill gold (was the blessing only). The Time Warp is computed with attention switched off and restored, so a tap before the warp cannot inflate four hours of income.
- Training Drill isolation: stats, roundTick and shake are now on the swapped-key list with fresh values in the drill context; a Mage drill leaves road casts, taps, damage tallies, the round counter and shake untouched.
- Horde loss at the gate unassigns the lost villagers (idle can no longer go negative).
- Castle storage: the eight-hour cap only limits growth; a falling rate never deletes stored output.
- Catacomb key and horde window use are saved before the activity blocks saving; a reload cannot refund them.
- Developer rows in Settings (+1T, horde now, layout, timers, promotion reset, loop seam) appear only on a ?dev page (DEV_TOOLS).
- Source/bundle parity: index.html embeds source/game.js verbatim; tests/sim/parity.js checks it and the manifest's game hash.

## Training Drill: repeat dust reduction (owner spec, second version; tests/contract/dust.test.js, 24 assertions)
Dust is tracked per bracket AND per dust-bearing tier portion. Each portion pays base x 0.5^(its previous payouts), once per Shatter cycle; reaching a higher tier pays every unpaid portion through it at each portion's own history; Gold then Crystal in one cycle pays Gold once and Crystal only its own portion. Fractions accumulate in a persistent carry that pays whole dust when it fills; the results plate shows the exact credit ("+0.5 dust progress"). A Shatter clears only the cycle flags; payout history and the carry persist. Existing saves initialise history from dust-bearing tiers claimed in the saved cycle only, no dust is removed. Gold and ore pay their full listed values every cycle. Player-facing wording, verbatim: "Gold and ore rewards reset after each Shatter. Dust reward is halved each time it has previously paid dust." The sheet shows a portion's multiplier next to its dust when below 100%.

## Simulator fixes (tests/sim/bot.js, batch.js, bounded.js, parity.js)
- Tree ranks and dust blessings are bought through the production buyTreeRank at nodeCost prices (the bot had hardcoded 1.75 and mutated ranks; Prospecting was underpaid up to 5x in passes 49-50). Gate: tests/sim/equiv.js --mode stat, 80 distribution tests, 0 shifts, new harness deterministic (EQUIV PASS).
- Hourly rows are labelled with the hour they close (no repeated labels after an offline jump) and carry played hours under a schedule.
- No road inputs at all while a drill runs; every profile does a three-minute check-in at each session start (boosts and drills), so idleboost follows the routine too; the drill hero is chosen by attack x (1 + ability power) x speed.
- Provenance: the game hash is the hash of the source that ran (after --replace), the config records the whole behavioural model plus a dirty-tree flag; batch manifests record it; bounded.js requires one configuration across the batch and a clean tree, and adds check 8 (drill dust < 20% of all dust) with first-cycle vs repeat claim telemetry (M.drills.first / repeat, drillLog.firstCycle).
- bounded.js evaluates the two closing 24-hour windows of whatever batch length it is given.

## Parity batch (tag p51parity: 2x, idleboost/light/casual/engaged, seeds 81-83, 48 wall hours, schedule 2:2,2:8,2:8, drills, double, boosts, clericBack)
- Raw results committed: tests/sim/results/p51parity/ (12 run files, summary, manifest); their sha256 hashes match tests/sim/manifests/p51parity.json.
- Provenance: one set, commit afc2736, game 9327f718e0d073d6, dirty tree [] in every run; tests/sim/parity.js PASS (bundle embeds the source; manifest hash equals the source hash).
- Zero assertion failures, zero softlocks, zero batch errors; one behavioural configuration across all 12 runs.
- Check 8: drill dust 2.5% (idleboost), 6.4% (light), 6.9% (casual), 5.5% (engaged) of all dust, all under 20%; repeat claims already pay less than first-cycle claims.
- Checks 4 and 5 fail on a 48-hour batch by construction (the first day is the early-game acceleration and Endless is entered at hour 26-28), and 7b is 9.3% (want 15-30) as in pass 49; these are the 96-hour reference batch's questions, not this batch's. 7a passes (9.8%).

## Next
On the owner's word: the 2x reference and the labelled continuous-4x upper bound (96 wall hours, seeds 81-90) on commit afc2736 or later, with raw results committed the same way. main stays at f8c2a81 until then.
