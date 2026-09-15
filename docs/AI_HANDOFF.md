STATUS: CANDIDATE_ON_BRANCH_NOT_TESTED
RESPONSE_TYPE: APPROVED_CANDIDATE_COMMITTED_AWAITING_MORE_HUMAN_CHANGES
PASS_ID: PASS_45_GEOMETRIC_SHATTER_RULE_AND_GEAR_CAP_20
BASED_ON_REVIEW_PASS: HUMAN_DECISIONS_2026-09-15 (six balance calls; linear/30 candidate rejected; bounded-growth criteria)
BUILD: 20260915-162318
HEAD_COMMIT_SHA: 20f3c814f1fdc87708c5974f2ee94b50c11fd402
RESULTS_COMMIT: 20f3c814f1fdc87708c5974f2ee94b50c11fd402 (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_44 (its analysis stands; the pass 43 baselines remain the reference for release.js comparisons)

# Crystal Road AI Handoff - Pass 45 (approved candidate on the tuning branch; NOT tested; main untouched at 1aacfbf; the human is making further changes before the next batch)

HUMAN_DECISIONS (2026-09-15, verbatim intent): 1 geometric Shatter requirement, requiredWave = 100 x 2^(nextShatter - 4), so Shatters 4-10 need waves 100, 200, 400, 800, 1600, 3200, 6400; 2 gear cap 20 levels per rank (20 / 40 / 60 / 80 / 100), keep the proposed flat ascension costs for this test; 3 accept 1T gold at about 35-40 h at 2x, no tripling rule; 4 keep the interaction candidate (attention +25%, Auto-Cast at 75% power); 5 keep the 1.75 price curve, cap the eight unlimited nodes at 50; 6 the reference matrix is 2x and continuous 4x. The linear/30 candidate is rejected. The "within 3x of the reference" criterion is replaced by bounded-growth checks. Commit to the tuning branch, keep main unchanged until results pass. Then: do not test yet, more changes are coming.

DEVELOPER_POSITION: AGREE on every item. Everything below is committed on ai-tuning-loop only. No batch has run on this build.

## On the branch (source/game.js, since the pass 44 handoff)
1. Shatter depth rule: canReforge() requires the Warlord AND G.run.endless >= reforgeNeedWave(), where reforgeNeedWave() = 0 for Shatters 1-3 and 100 x 2^(n-4) for the n-th Shatter from the fourth. The map button reads "Shatter at wave N" once the Warlord is beaten but the depth is short.
2. Attention: a deliberate tap (an enemy tap, an ability tap, a reaction) sets G.attnUntil = RT + 10 s; goldMult() and xpMult() carry x1.25 while it holds; a "+25% attention" label shows in battle. Not saved; RT is the real-time counter.
3. Cast power: AUTO_CAST_POWER 0.75 and MANUAL_CAST_POWER 1.3 in abilityAction() for damage abilities (heals and shields use abRise as before). The manual cast has ALWAYS been 1.3x in this code; the change is the Auto-Cast side. tapCastHero(h) is the production manual cast used by the ability button and the simulator.
4. Gear: itemLvlCap(it) = 20 x (rank + 1); upgradeItem() stops at the cap and the gear sheet button reads "Lv cap N"; ascendCost(it) = ASCEND_COST[rank] = 1500 / 150000 / 15000000 / 200000000 ore, independent of item level; ascendCap() unchanged (rank 1 needs no Shatter, ranks 2-4 need one to three).
5. Tree: Vigor, Might, Bulwark, Vanguard, Long Stride, Strike, Prospecting, Provisions cap at 50 (were 999). No migration: no save can be above 50 (rank 50 costs about 1e14 gold).
6. Contract tests: tests/contract/balance.test.js pins all of the above (depth rule at every Shatter 1-10 including the one-wave-short refusal, attention on/off/expiry, cast power ratio, caps, flat ascension, tree caps); tests/run_tests.js: 4 suites green.

## Evidence behind the decisions (all at 2x, seeds 81-90, zero assertion failures)
- Linear/30 candidate, 96 h, GATE PASS 40/40 (tests/sim/batch_out_p45x2, manifest committed): Shatter 10 at 19-23 h, 1T at 26-30 h, power at 96 h 92-121x the cap-3 reference, item level 138-141 at rank 4. REJECTED. Engaged reached Endless 25.7% sooner than boosted idle, with fewer boss walls than the reference.
- Simulator-override experiments (48 h, idleboost + engaged, --replaceFile, not committed): geometric rule alone (30/rank): 7 Shatters by 48 h, the eighth needs wave 1600 and is not reached, power at 48 h 15x / 53x; geometric + 22/rank: 7x / 11x; geometric + 20/rank: 4.8x / 6.6x at 48 h, engaged 20% ahead. The 48 h ratios overstate 96 h because the reference keeps levelling past 100 while the capped party cannot.
- Why 1T cannot be 50 h: Endless depth sets gold per kill (1.05 per enemy level); seven Shatters' income multipliers reach that depth earlier than three. Every variant landed 1T at 30-39 h. The human accepted 35-40 h.

## Bounded-growth evaluator (tests/sim/bounded.js, committed)
node tests/sim/bounded.js --dir <batch> prints PASS/FAIL per profile: 1 Shatter 8 not before 48 h; 2 Shatter 10 not within 96 h; 3 gear at its cap (median share of equipped items within 2 levels of 20 x (rank+1) >= 50%); 4 power log-growth in 72-96 h <= 0.6 of 48-72 h; 5 Endless waves gained 72-96 h < 48-72 h; 6 no softlock (a Road boss never cleared after >= 3 attempts) and a usable ore economy (>= 1 ascension per run, ore spent in the last 24 h), with cleared loss streaks >= 8 listed as walls; 7 engaged 15-30% ahead of boosted idle on Endless entry. Smoke-tested on the rejected batch: fails 1 and 2 in every profile, passes 3-7; one Ashen Keep wall (eight losses, cleared on the ninth) in one seed per profile, worth watching once Auto-Cast is at 75%.

## Before the next simulation run (checklist)
1. The human's further changes land on ai-tuning-loop with contract tests; node tests/run_tests.js green (never read a verdict through a pipe).
2. python source/build.py, commit, push; node tests/sim/provenance.js for the expected commit, gameHash, harnessHash.
3. No simulator overrides (no --replace / --replaceFile). Fresh 2x batch: node tests/sim/batch.js --seeds 10 --seedStart 81 --hours 96 --shatters 10 --profiles idleboost,light,casual,engaged --speed 2 --tag <tag>x2 --workers 4; then the same with --speed 4 --tag <tag>x4 (continuous 4x, the labelled upper bound). Keep the worktree untouched while workers run (use cr-main for anything else).
4. Validate each: node tests/sim/validate38.js --dir batch_out_<tag>x2 --dt 0.016666667 --speed 2 --hours 96 --profiles idleboost,light,casual,engaged --seedStart 81 --seeds 10 --commit <sha> --gameHash <h> --harnessHash <h:h> (GATE PASS required); then node tests/sim/bounded.js --dir batch_out_<tag>x2 (BOUNDED PASS required at 2x; 4x reported as the upper bound); then node tests/sim/release.js --dir batch_out_<tag>x2 --ref batch_out_base43x2 --refStart 81 --refSeeds 10 --profiles idleboost,light,casual,engaged --seedStart 81 --seeds 10 for the side-by-side.
5. Commit reports and manifests, write the handoff, and only if bounded PASS at 2x: fast-forward main (the human's call).

## Open
- The human's pending changes (unspecified as of this pass).
- Ascension table 1.5K / 150K / 15M / 200M is provisional for this test.
- The reviewer's pacing proposal in real hours against the 2x results, once they exist.
