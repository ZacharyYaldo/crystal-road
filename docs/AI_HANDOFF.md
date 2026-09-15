STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: FEATURE_ON_BRANCH_CALIBRATED_CLAIMS_DISABLED
PASS_ID: PASS_46_TRAINING_DUMMY_PRACTICE_AND_CHALLENGE
BASED_ON_REVIEW_PASS: HUMAN_SPEC_2026-09-15 (practice drill; deterministic party Challenge; reviewer's bracket design with corrections)
BUILD: 20260915-174858
HEAD_COMMIT_SHA: 3f02f9742986a4f34216908a5c6ebd66779a78fe
RESULTS_COMMIT: 3f02f9742986a4f34216908a5c6ebd66779a78fe (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_45 (its balance candidates stand, untested; main untouched at 1aacfbf)

# Crystal Road AI Handoff - Pass 46 (Training Dummy: practice drill and standardized Challenge on the tuning branch; targets measured; claims disabled until the payout table is approved)

HUMAN_DECISIONS (2026-09-15): practice drill = one selected hero, zero-defense dummy, live tapping and abilities, no rewards, hero/tap/total stored separately, local board, only the first three taps per second score; Challenge = current full party, 30 s at standardized 1x, deterministic isolated RNG, two scripted taps a second, zone defense, no attention/oath/omen/temporary boost, player triggers and watches, one-time cumulative rewards per zone or Shatter bracket; calibration from measured production output on at least 30 seeds per bracket, Crystal = P90, Bronze/Silver/Gold at 25/50/75%, Overdrive 125% badge only; rewards in existing gold, ore and dust, no new currencies, dust small and concentrated late; one canonical permanent income-rate helper shared by offline earnings and rewards; claims, progress and scores save atomically; bring the exact payout table before enabling claims. Road tapping unchanged.

DEVELOPER_POSITION: built as specified; claims are disabled (CHALLENGE.claims=false) pending the payout table below. Three choices made and stated to the human: Auto-Cast is always on in the Challenge; Shatter-bracket defense is the Foundry pool at the Endless base level with the road's Shatter scaling; brackets 7-10 are provisional because the depth rule keeps them out of reach within 96 h.

## On the branch (source/game.js)
- Battle loop extracted into tickUnits() and battleStep(); the drill runs the same code on a swapped context (DRILL_KEYS, withDrill). Bot results before and after the extraction, the late-bound rand() and the offline refactor: identical RNG-call counts and canonical hashes on idleboost and engaged (3 h, seed 900, 2x).
- Practice drill (Vael yard, "Drill"): hero picker with the road's Auto-Cast option, 30 real seconds, results sheet (total, DPS, basic, ability, tap, crit with counts, tap rate, Auto-Cast used), board of five (hero, damage) saved. Taps beyond the third in a wall-clock second animate and do not score (tapsExtra counted). %-of-max-HP damage over time is skipped on the dummy; burn's damage-taken multiplier counts.
- Challenge (Vael yard, "Challenge"): party clones at x 128/152/176/200, dummy def = challengeDef(bracket), G.drill.rng = seededRng(20260915) consumed by rand() only while the drill context is active, taps at 0.25 s + k/2 (exactly 60), Auto-Cast on, omens and oath swapped out of the context, 1x regardless of speedNow(). Bracket = highest unlocked zone until Endless is unlocked, then the Shatter count (challengeBracket). End: total = party + taps, tier from CHALLENGE.targets, best and Overdrive badge recorded, claim paid as the difference between cumulative bundles from the highest tier already claimed (challengeBundleDiff), all inside one synchronous block followed by saveGame(). Results sheet lists the four tier thresholds, Overdrive, best here, and the payout or the reason none was paid.
- incomeRate(zi, prog): gold, ore and XP per minute at 1x (a fight every 22 s, 1.8 enemies) with permGoldMult()/permOreMult() (Gilded Road, Prospecting, Deep Veins, Shatter compounding and flat bonus, renown) and no attention, omen or oath. offlineGains() now uses it: fights unchanged; gold and ore no longer carry an Endless omen or the Poverty oath.
- Tests: tests/contract/drill.test.js (25) and tests/contract/challenge.test.js (29): determinism, exact tap count, party/tap split, bracket selection, zone defense and its Shatter scaling, immunity to omens/oath/attention/speed, context restoration, no payout while disabled, Gold then Crystal claims paying only the difference, no reset by a weaker run, persistence, practice cap of three scored taps per second, incomeRate equal to the offline decomposition and immune to temporary modifiers. tests/run_tests.js: 6 suites green.

## Calibration (tests/sim/drillbench.js --mode challenge; production Challenge run headlessly on saved states)
- Zone brackets: 40 states per zone (first boss attempt, four profiles x seeds 81-90, tests/sim/snapshots_p45x2). Crystal = P90 rounded to three significant figures: Greenhollow 775, Stillwater 3,560, Thornwood 9,750, Ironvein 19,600, Emberwaste 45,900, Amberfall 77,100, Ashen Approach 141,000, Ashen Keep 286,000, Foundry 617,000 (medians 627 / 3.1K / 8.0K / 14.7K / 35.9K / 56.7K / 111K / 208K / 487K).
- Shatter brackets: 40 states per bracket saved just before the next Shatter, i.e. the peak of the run with that many Shatters (tests/sim/snapshots_calib, four profiles x seeds 81-90, 48 h at 2x, manifest tests/sim/manifests/calib.json). Crystal: bracket 3 = 3.71M (median 2.52M), 4 = 11.8M (8.98M), 5 = 71.4M (44.9M), 6 = 4.20B (977M). Brackets 7-10 provisional: previous x10.42 (the mean measured growth per bracket): 43.8B, 456B, 4.75T, 49.5T; unreachable within 96 h under the depth rule, to be re-measured if that changes.
- The reviewer's estimated table was 3x to 70x above measurement and is discarded, as the human decided.
- Engine property: the party Challenge scores within a few percent of the best single hero's practice drill, because combat runs one action at a time (units take turns); party size barely changes a 30-second score.

## Proposed payout table (claims disabled until the human approves; bundles are cumulative, a claim pays the difference from the highest tier already claimed in that bracket)
Minutes of the bracket's permanent income rate (incomeRate at the zone's boss level, or Endless level 70 for Shatter brackets) plus one-time dust.
- Zone brackets: Bronze 3 min gold; Silver 7 min gold; Gold 12 min gold + 2 min ore + 1 dust; Crystal 20 min gold + 5 min ore + 2 dust. Overdrive: badge.
- Shatter brackets: Bronze 3 min gold; Silver 7 min gold + 1 min ore + 1 dust; Gold 12 min gold + 2 min ore + 3 dust; Crystal 20 min gold + 5 min ore + 6 dust. Overdrive: badge.
- Example amounts at a median state (gold / ore per minute measured on the calibration states): Ironvein 2.5K gold/min, 55 ore/min -> Crystal 50K gold + 276 ore + 1 dust... (see the human-facing table); Foundry 105K gold/min -> Crystal 2.1M gold + 5.0K ore + 2 dust; Shatter bracket 3 88K gold/min, 1.0K ore/min -> Crystal 1.8M gold + 5.0K ore + 6 dust; bracket 6 239K gold/min -> Crystal 4.8M gold + 13.5K ore + 6 dust. Dust per Shatter for comparison: 20-65.

## Open
- Payout table approval, then CHALLENGE.claims=true (one constant) and a claims contract test already exists.
- Visual placement in the yard not yet eyeballed by the human (dummy at the right edge, party left of it, villagers and garrison hidden during a Challenge).
- Reward tiers for the practice drill: none by decision (practice has no rewards).
- Pass 45 balance candidates still untested; the pre-run checklist in pass 45 applies.
