STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: REVIEW_RESPONSE_AND_OWNER_REQUIREMENTS
PASS_ID: PASS_56_DEFECTS_BATCHES_SAVING_FIRST_FIVE_MINUTES
BASED_ON_REVIEW_PASS: reviewer list of 2026-09-30 (six defects, fresh batches, open checks) and the owner's MVP release requirements 1 and 5-7 (2026-10-01)
BUILD: 20261001 (tuning branch ai-tuning-loop; main is behind, at 2c84646, until the owner says push)
HEAD_COMMIT_SHA: see git log (this handoff is committed on top of ee5d429)
PULL_REQUEST: #2
SUPERSEDES: PASS_54_RAIN_VOLLEYS_AND_CAMP

# Crystal Road AI Handoff - Passes 54 to 56

## 1. Reviewer defects: AGREE on all six (commit 241028a)
Each was confirmed in the code before it was changed.

| Defect | Finding | Fix |
|---|---|---|
| Settings corrupts the save | The Settings footer called `storeSet('__probe')` on every frame it was drawn | `storeProbe()` writes, reads back and deletes its own key; `storeSet` refuses anything that is not a serialized save |
| Reset Road has no confirmation | One tap cleared the save and reloaded | Two taps at least 0.6 s apart; the row says what the second tap does and disarms after 5 s or when the sheet closes |
| Garrison heroes enter the Catacombs | The sheet only skipped questing heroes; `startDelve` had no guard | `delveBlock(h)` is used by the sheet and by `startDelve` (posted and questing heroes refused, no key spent) |
| 4x lost on reload | The road speed was never saved (2x was lost as well) | `speed` is saved; 4x returns only while its boost is running, otherwise 2x |
| Dedupe discards the better hero | Only level and rank were compared | The survivor takes the best ability rank, promotion, talents and gear per slot; spare gear goes to the pack |
| Import validation incomplete | Only version and roster presence were checked | See section 3: shape and value checks, then a boot on an isolated copy, before the stored save is touched |

Also: the bot sends only heroes the game allows into the Catacombs; `equiv.js` uses its own temporary directory per run (the pass 53e nit).

## 2. Batches (owner rules: 2x and continuous 4x only, schedule 2:2,2:8,2:8, seeds 81-90, 96 h)
All raw run files, manifests, validator and bounded outputs are under `tests/sim/results/`. Every batch: GATE PASS, zero assertion failures, clean tree, one provenance set.

### 2a. Default party, historical bot policy (comparable to pass 52), commit 241028a
| | p54x2 | p52x2 | p54x4 |
|---|---|---|---|
| Bounded | FAIL: 7a and 7b only | FAIL: check 4 and 7b | PASS |
| Check 4, boosted idle (want <= 0.80) | 0.60 | 0.81 | 0.71 |
| 7a engaged lead, wall hours (want 5-12%) | 3.7% | 9.5% | recorded only |
| 7b engaged lead, played hours (want 15-30%) | 11.8% | 8.5% | recorded only |
| Power at 96 h, boosted idle | 1.1B | 3.9B | 5.6B |
| Best wave at 96 h, boosted idle | 796 | 991 | 1048 |

Check 4 (the borderline 0.81) is resolved: every 2x profile is between 0.56 and 0.67.

### 2b. Why the default party looked 3.5x weaker than pass 52: the bot, not the game
The bot levelled gear and ability ranks cheapest-first across the WHOLE roster. The roster grew from 6 to 9, so the party's share of ore fell from 12 of 18 items to 12 of 27. Measured medians, boosted idle at 96 h:

| | p52x2 (6 heroes) | p54x2 (9 heroes) | p54fx2 (9 heroes, party only) |
|---|---|---|---|
| Party gear level | 91 | 81 | 92 |
| Bench gear level | 104 | 94 | 0 |
| Party ability rank | 23 | 22 | 23 |
| Bench ability rank | 25 | 23 | 1 |

`--focus` (commit 6683881, opt-in) spends ore and rank gold on the fielded party only. Runs without the flag are byte-identical (equivalence exact on default and party configurations); the flag is recorded in config, model and manifest only when given, and `bounded.js` binds it.

### 2c. Default party with --focus (commit 6683881)
| | p54fx2 | p54fx4 |
|---|---|---|
| Bounded | FAIL: 7a 1.9%, 7b 6.3% | PASS |
| Check 4 | 0.47 to 0.56 | 0.50 to 0.54 |
| Power at 96 h, idle / engaged | 3.3B / 8.0B | 23B / 27B |
| Best wave, idle / engaged | 946 / 1111 | 1216 / 1221 |
| 1T gold | 14 of 40 runs, hour 79-87 | 40 of 40, hour 55 |

With a player who invests in the party, pacing matches pass 52.

### 2d. Lineup screen (16 lineups x 20 runs, 2x, --focus, seeds 81-85; `results/p54F`)
Power at 96 h relative to the default party on the same seeds and profiles ranged from 0.76x (Hale, Fitz, Kit, Sera) to 1.88x (Hale, Kit, Ash, Sera). Every lineup reached 7 Shatters; best wave 948 to 1050. A rough additive fit puts Ash at about 1.3x an average damage slot, Lark 1.24x, Morrow and Kit about 1.0x, Vex 0.9x, Fitz and Bram about 0.8x. No-tank and no-healer lineups work with about 55% more defeats. Full table: `results/p54F/p54_lineups.txt`.

The strongest lineup as full batches (p54Dx2, p54Dx4): 2x FAIL on 7a 1.6% and 7b 5.2% only; 4x PASS; power at 96 h 5.1B (idle) against 3.3B for the default.

### 2e. Criterion 7a/7b: DEVELOPER POSITION
The Endless-entry lead is capped by the play/offline schedule: every profile enters Endless inside the same play session (the 24-26 h block), so the lead cannot exceed about two hours whatever the player does. At 96 h the engaged player is clearly ahead (power 8.0B against 3.3B, wave 1111 against 946, gold 1.97T against 503B). Proposal: replace the Endless-entry criterion with an end-state one, for example engaged at least 15% deeper in Endless at 96 h (17% in p54fx2). The owner decides.

## 3. MVP requirement 1: trustworthy saving (commit 4420c27)
- One write to the save key (`storeSet`), which refuses anything but a serialized save. Autosave, saves after player actions, Shatter, the Catacombs key and export codes use the same `serialize()`.
- Import: `checkImport` = parse, `saveProblems` (sections, finite numbers, no negative currencies, legal levels and ranks, zone and progress, party, gear, quest and garrison references), then `trialBoot`: the live state is set aside, the save is loaded by the real loader on a fresh state, the game runs 45 frames and draws once, and the live state is restored exactly. Only then is the stored save replaced (the old one kept under a side key). Failure line: "Import failed. Your existing save was not changed."
- Player actions are noticed at the input layer (`playerDid` around every tap handler and the party drag), so the simulator never pays for a save. A burst is saved once it pauses; a Saved plate shows for about a second after major actions, "Not saved" if the device refuses the write.
- Reload restores 1x/2x, a running 4x boost with its true remaining time, Auto-Cast and its end time, zone and progress, quests, garrison, Catacombs keys, drill claims and records. A run in progress inside the Catacombs is still abandoned on reload (unchanged; restoring it would be a gameplay change).

## 4. MVP requirements 5-7 (commit 51987a5)
- The opening is three live steps inside the first fight: watch (Next), tap the enemy (required), cast the ability (required). `tutFloor` keeps the practice slime at 30% health and the hero at 1 while a step is up; `G.tut` is null in every simulator run, and bot runs on the old and new builds are identical (RNG calls, state, results).
- Gear, the Tree, the Training Drill and the Shatter each get one card when they first matter.
- `nextObjective()` drives one line under the zone plate, tappable when it leads to another screen.
- Larger tap areas for Settings, Boosts, the speed selector, sheet close, tree purchases, gear actions, pack buttons and villager plus/minus; small text 5.5 to 6 and 4.75 to 5.25; brighter muted and dim text.

## Tests and evidence
- 9 suites pass; the audit suite went from 63 to 352 assertions. Parity PASS.
- Harness equivalence exact at each harness change (default, real-player and party configurations).
- `.gitattributes` pins LF: CRLF checkouts had broken parity and the provenance hashes.

## Open (owner decisions)
- Push to main (main is at 2c84646).
- Criterion 7a/7b (section 2e).
- Hero spread from the lineup screen: accept, or a balance pass on Ash (strong) and Fitz and Bram (weak). The owner has said to revisit this after the MVP requirement chunks.
- Drill Shatters 7-10 calibration: still disabled, "Calibration pending".
- Optional: analytics, real ad integration, Gear Devour.
