STATUS: PARTY_PATH_AND_BINDING_DONE_TUNING_BRANCH_ONLY
RESPONSE_TYPE: DEFECT_FIXES_AND_VALIDATION_BINDING
PASS_ID: PASS_53C_PARTY_PATH
BASED_ON_REVIEW_PASS: REVIEWER_VERDICT_2026-09-29 on 6fb4845 (Hymn, quests and metadata cleared; --party not cleared) and the owner's "Go" with two acceptance details
BUILD: 20260929 (tuning branch; main untouched at f8c2a81)
HEAD_COMMIT_SHA: see git log (this handoff is committed with the code)
PULL_REQUEST: #2
SUPERSEDES: PASS_53B

# Crystal Road AI Handoff - Pass 53c (one production party path, strict reservation, size check, lineup bound into validation and manifests)

## Correction to the pass 53b handoff
The counts were 71 party assertions and 2,549 in total, not 69 and 2,547.

## One production party path (source/game.js)
- partyReorder(i, j), partyToCamp(i) and partyBringIn(hero, slot) now hold the Party sheet's logic, moved verbatim with every side effect: the replaced or departing marcher's action is cancelled, statuses are cleared, a fallen newcomer is revived at half health, the newcomer enters from the left with the walk or idle animation, a posted hero is recalled, layout and the build-changed hook run exactly where they ran before, the same messages are shown. The sheet calls these three and writes nothing to the party itself.
- partyCanField(hero): recruited, and either marching, at camp, or on the walls with the post finished. Never a hero on a quest, never someone outside the roster.
- partySetOrder(ids): enforces the current partyMax(); fields every requested hero that can legally be fielded, in the requested order from the front; the other places keep their marchers in their order; repeated and unknown ids are ignored; an order that already holds changes nothing (no swap, no side effect). Every change it makes is one of the three steps above.

## Simulator (tests/sim)
- party.js: the canonical form shared by bot.js, batch.js, bounded.js and validate38.js. canonParty gives an ordered lower-case id list, or the explicit value "default" when the flag is missing; partyKey compares exactly; partyProblems rejects unknown ids, duplicates and lists above the legal party size; lineupOk states the rule a lineup must obey.
- bot.js: the request is validated before the run (exit 2 on unknown, duplicate, empty or more than partyMax heroes). The lineup is applied only through S.partySetOrder, on the walk, with the requested order authoritative and the cleric last only among the other members; the default cleric reorder never runs together with --party. Requested heroes are strictly reserved: never posted to the garrison, never sent into the Catacombs; with nobody else to send the bot skips that run and counts it (partyDelveSkips). config.party and model.party are always explicit; partyRequested, partyAvailable (as of the last application), partyActual (final, ordered) and partyChanges (hour, available, lineup) are in every result.
- batch.js: the manifest carries the canonical request in config.model.party, plus partySets and partyActualSets.
- bounded.js: the requested party is part of the behavioural signature and is compared exactly (a run without the field counts as absent, never as default); every run must record lineups that obey its request, including every entry of the history; the manifest must carry the same party.
- validate38.js: takes --party (nothing means the explicit default) and rejects a run whose config.party, result or model differ from it, whose lineup is not recorded or breaks the request, and a manifest with another party. Legacy batches that never recorded a party therefore fail this gate by design.
- equiv.js: a key of config or model that exists on one side only is listed and not compared, like a top-level one. Default-run gate: tests/sim/equiv.js --ref 6fb4845 --mode exact, EQUIV PASS, 24 pairs identical (RNG call counts and canonical hashes); the listed one-sided fields are the party telemetry and config.party / model.party.

## Tests (all 9 suites pass, 2,605 assertions; parity PASS)
tests/contract/party.test.js, 127 assertions:
- every side effect of reorder, bring in (on the walk and in a battle), send to camp, join, and the refusals (full party, quest, held post, last marcher, outside the roster);
- partySetOrder: nothing touched when the order holds, Osric then Idris then Perrin taking their requested places as they are recruited, repeated and unknown ids, a request longer than the party, the Oath of Solitude cap;
- source contract: the sheet block and the bot's party line contain no direct write to the party;
- the bot: five heroes and an empty list rejected, canonical recording of " Osric , ALDRIC ", the explicit default, the default bot entering the Catacombs where the reserved run makes 0 runs and counts its skips, no requested hero posted;
- adversarial validation on a real two-run batch and tampered copies: another order, a missing field, a final lineup out of order, a broken history entry, a model that disagrees, a manifest with another party, a recorded request of five. The evaluator and the strict validator refuse each one and accept the untouched batch.
Verified in the page as well: the Party sheet's own tap handlers reorder, swap in, send to camp and add through the shared functions, no console errors.

## Still open
- Reviewer item 1 of the earlier verdict (developer rows visible in Settings): parked by the owner.
- Fresh 2x and continuous 4x batches from the final head: not run in this pass, as instructed.
- Criterion 7b: the owner's decision. main stays at f8c2a81.
