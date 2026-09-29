STATUS: RELEASE_BLOCKER_FIXED_TUNING_BRANCH_AWAITING_OWNER_WORD_FOR_MAIN
RESPONSE_TYPE: DEFECT_FIX
PASS_ID: PASS_53E_DEV_ROWS
BASED_ON_REVIEW_PASS: REVIEWER_VERDICT_2026-09-29 on fe3c8a9 (one release blocker: developer controls visible to normal users; minor: old names in the mock scripts)
BUILD: 20260929 (tuning branch; main untouched at f8c2a81)
HEAD_COMMIT_SHA: see git log (this handoff is committed with the code)
PULL_REQUEST: #2
SUPERSEDES: PASS_53D (its content stands; see git history)

# Crystal Road AI Handoff - Pass 53e (developer rows really gated, rendered-row test, mock names)

## The defect and its cause
The pass 51 handoff said the developer rows of Settings appear only on a ?dev page. That was false. The filter I added then was inserted into the click handler of one row ("reset all promotions") instead of onto the row list, so the sheet kept drawing all sixteen rows for every player, and the test only checked the value of the flag. The reviewer was right on both counts.

## The fix (source/game.js)
- settingsRows() is the one list the Settings sheet draws. Every row is built lazily and tagged; a developer row is built and returned only when DEV_TOOLS is true (a ?dev page). A player gets five rows: Music, Sound effects, Statistics, Backup or restore your save, Reset the road. The eleven developer rows are: +1T gold, ore and dust; horde arrives now; Layout; Dev timer; music loop seam; reset all promotions; Endless Road back to fight 1; skip to the next milestone boss; +4h auto-cast boost; Dev road speed; Fast quests and castle.
- The sheet height follows the number of rows.
- The broken handler is restored.
- A save cannot carry the testing speed into a normal page: the saved fast flag is honoured only on a ?dev page. Anything a player already took through the public rows (gold, skips) stays in that save; nothing is removed.

## Tests
tests/contract/audit.test.js, 44 assertions (was 26). The new block renders the real sheet in both page modes and reads what was drawn and what can be tapped:
- normal page: no developer text among the drawn strings; exactly five rows drawn; exactly five tappable row regions; tapping every one of them except the wipe adds no currency, sets no testing or road speed, gives no boost, summons no horde, resets no promotion and skips no progress;
- ?dev page: sixteen rows drawn and tappable, eleven of them developer rows, the player rows in their places, and the treasury row works;
- a save written with the testing speed loads with it off on a normal page and on with ?dev;
- source: the eleven developer labels exist only inside settingsRows, and the sheet draws settingsRows and nothing else.
The headless loader takes the page's query string (opts.search) and exposes the hit regions, so a test can render either page.
Checked in the built page as well: index.html shows five rows, index.html?dev shows sixteen.

## Minor
The mock scripts (source/mock.py, source/mock_vael.py and their copies under assets/) use the new hero names.

## Evidence on the final tree
- 9 suites pass, 2,675 assertions. Source and bundle parity PASS (game.js and the five effect scripts).
- Exact equivalence against fe3c8a9: default runs, speeds 1 and 2, 24 pairs; real-player configuration (clericBack, drills, double, boosts, schedule 2:2,2:8,2:8, 6 h, speed 2), 12 pairs. Results are recorded in the commit message of this pass.

## Open
- main stays at f8c2a81 until the owner gives the word; the reviewer asks for no balance batch before that push.
- Criterion 7b and fresh batches remain open items after the push.
