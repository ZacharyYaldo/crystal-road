STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: APPLIED_CHANGES_NO_BASELINE
PASS_ID: PASS_40_TREE_AUDIT_ROUND_2_APPLIED
BASED_ON_REVIEW_PASS: REVIEWER_MESSAGES_RELAYED_BY_HUMAN_2026-09-14 (pass 39 invalid; PDF audit; tree round 2)
BUILD: 20260914-202157
HEAD_COMMIT_SHA: 73fcde16a64b86cf03da2232dba5c289e2e1acba
RESULTS_COMMIT: 73fcde16a64b86cf03da2232dba5c289e2e1acba (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_39 (its baselines were validated through a provenance bypass and are withdrawn as reference)

# Crystal Road AI Handoff - Pass 40 (tree audit round 2 applied and merged to main by the human; validator hardened; no baseline run)

HUMAN_APPROVAL: "go for it" / "you can do all of them except 7, don't restart the reruns" / "stop the testing and apply changes, for future changes don't test in 1x, just 2x and 4x" (2026-09-14). Item 7 (flatten the price curve after rank 10-15 or replace the 99/999 caps) is HELD. The Shatter income scheme remains HELD.

DEVELOPER_POSITION: AGREE with the reviewer's PDF audit; all items but 7 are applied at this commit and the human merged the branch to main (Pages build 20260914-202157). No batch ran on this build by the human's instruction; the pass 39 reruns that were in progress were stopped and discarded. Future batches: speeds 2x and 4x only (the human's rule); --speed 4 in the harness runs the toggle at 4x for the whole session, i.e. it assumes the boost is held continuously, unless the reviewer wants the timed 4x-then-2x model built first.

## Applied (source/game.js)
1. Long Stride: the encounter timer now counts down at march speed (G.enc -= dt x marchSpeed/28), so +4% march speed is 4% more fights per hour. No refund needed.
2. Bunks: base quest slots 2 (a full party leaves two heroes at camp); Bunks +1 per rank, cap 3.
3. Remembered Strength: +3 levels per rank, cap 5, base 6 dust; migration version 2 refunds ranks above 5 at the historical 6-dust prices (a save already at migration 1 receives only migration 2).
4. Momentum: +0.5 charge per weighted tap per rank (max 5.4 charge/s at full tapping, was 10.75).
5. Keen Edge +2% crit per rank at 350 gold base; Crystal Edge +3% per rank at 5 dust; Sharp Taps +4% triple-hit per rank at 180 gold. Crit cap 95% unchanged.
6. Descriptions: Quickstep "+2% gauge speed"; Vanguard "+5% front hero DEF" with the total shown as bought vs the 15% base; Warm Fire "road fight heal"; Provisions "primary quest reward"; Swift Return's total shown as a speed factor (rank 20: quests x2.50 faster).
8. Stale assets/game.js removed.

## Testing state
- Validator (tests/sim/validate38.js): no bypass; exact matrix; unexpected files rejected; explicit speed required; commit, game hash and harness hash verified against command-line values; manifest.json with per-file sha256 required; batch.js writes the manifest and a tracked copy under tests/sim/manifests/.
- Provenance for a run from this tree: commit 73fcde16a64b86cf03da2232dba5c289e2e1acba, gameHash 6098ed2e7ceb3c83, harnessHash d49fb1a3dad2dc8b:95f1ef4104ced67a.
- Contract suites: tests/contract/tree.test.js 1619 assertions and tests/contract/sources.test.js 42 assertions (reward-source matrix), all passing on this commit. Harness RNG seeds are now mixed and burned (nearby seeds diverge from the first draw).

## Open
- Item 7 (price curve) and the Shatter income scheme: held for the human.
- Reference baselines on this build: not run; when the human asks, they run at 2x and 4x (not 1x) on fresh seeds with provenance recorded, and the strict gate decides validity.
- Ask of the reviewer: the pacing proposal in real hours at 2x and 4x; whether --speed 4 held continuously is acceptable for the 4x baseline or the timed-boost model is required first; and any objection to the round-2 values as applied.
