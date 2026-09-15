STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: APPLIED_CHANGES_NO_BASELINE
PASS_ID: PASS_41_SHATTER_INCOME_APPLIED
BASED_ON_REVIEW_PASS: REVIEWER_SHATTER_WARNING_RELAYED_BY_HUMAN_2026-09-14
BUILD: 20260914-203414
HEAD_COMMIT_SHA: 4baf197ccb570a3448a67ab1e0f8493892e1be0c
RESULTS_COMMIT: 4baf197ccb570a3448a67ab1e0f8493892e1be0c (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_40 (its applied items stand; this pass adds the Shatter income scheme)

# Crystal Road AI Handoff - Pass 41 (Shatter income compounding applied and merged to main by the human; no baseline run)

HUMAN_APPROVAL (2026-09-14, verbatim decision): Shatters 1-3 gold compounds at 1.15x; Shatter 4 onward gold compounds at 1.17x; Shatter 4 onward ore compounds at 1.05x; the existing linear +25% per Shatter stays for both; implemented through one shared helper and contract-tested at the Shatter 3 and 4 boundary. The human corrected the developer's table: gold at 7 Shatters is 7.84x (the developer had written 7.75x).

DEVELOPER_POSITION: AGREE. Applied at this commit; the human's rule is that the branch is fast-forwarded to main once approved, so the change is live on Pages. Enemy scaling per Shatter (1.10 HP and ATK, 1.10 DEF) is unchanged.

## Applied (source/game.js)
1. shatterGoldComp(n) = 1.15^min(n,3) x 1.17^max(0,n-3), used by bless('gold') in place of the former flat 1.15^n; shatterOreComp(n) = 1.05^max(0,n-3), multiplied into oreMult(). refMult() still carries the linear (1 + 0.25n) x renownGold() for both currencies. XP is untouched (Shatters never scaled it).
2. Resulting income multipliers with no tree nodes and renown 0 (gold / ore):
   0: 1.00 / 1.00; 1: 1.44 / 1.25; 2: 1.98 / 1.50; 3: 2.66 / 1.75 (unchanged through here); 4: 3.56 / 2.10; 5: 4.68 / 2.48; 6: 6.09 / 2.89; 7: 7.84 / 3.34; 8: 10.00 / 3.83; 9: 12.68 / 4.36; 10: 15.98 / 4.92.
   Before this change ore at 10 Shatters was 3.50x and gold 14.15x.

## Testing state
- tests/contract/tree.test.js now 1648 assertions (was 1619): goldMult and oreMult pinned at every Shatter count 0-10 against the formula, the step from 3 to 4 asserted as the flat step times 1.17 (gold) and 1.05 (ore), and the 7- and 10-Shatter values pinned. tests/contract/sources.test.js 42 assertions. Both pass on this commit.
- Provenance for a run from this tree: commit 4baf197ccb570a3448a67ab1e0f8493892e1be0c, gameHash 761ab3323ad5971b, harnessHash d49fb1a3dad2dc8b:68e97bb0b8cca4dd.
- No batch ran on this build (the human's instruction). Late-Endless runs are the first thing to rerun on this build when the human asks: 2x and 4x only, fresh seeds, provenance recorded, strict gate.

## Open
- Item 7 (price curve): held for the human.
- Reference baselines on this build: not run; same conditions as pass 40 (2x and 4x, never 1x).
- Ask of the reviewer: the pacing proposal in real hours at 2x and 4x; whether --speed 4 held continuously is acceptable for the 4x baseline or the timed-boost model is required first; whether the late-Endless rerun should target a specific Shatter count (the scheme only differs from the old one from the fourth Shatter, about 20+ real hours at the current pace).
