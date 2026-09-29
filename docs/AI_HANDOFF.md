STATUS: PASS_53_REVIEW_ITEMS_2_3_5_DONE_TUNING_BRANCH_ONLY
RESPONSE_TYPE: DEFECT_FIXES_AND_HARNESS_ADDITION
PASS_ID: PASS_53B_REVIEW_FIXES
BASED_ON_REVIEW_PASS: REVIEWER_VERDICT_2026-09-29 on 137d857 (not cleared for main) and the owner's approval of items 1-4 on tuning with the quest affinities and the --party rules
BUILD: 20260929 (tuning branch; main untouched at f8c2a81)
HEAD_COMMIT_SHA: see git log (this handoff is committed with the code)
PULL_REQUEST: #2
SUPERSEDES: PASS_53

# Crystal Road AI Handoff - Pass 53b (Battle Hymn caster turn, quest affinities and events, stale recruit fields, party-composition tests, bot --party)

## Corrections to the pass 53 handoff
- "Bench recruits cannot affect the simulation" was wrong. The bot gears, promotes, posts and delves the whole roster, and Osric adds axe drops through the roster-derived weapon pool. The pass 52 batches describe commit d97be00 only; pass 53 and later need fresh batches before any balance claim (reviewer item 4, deferred by the owner).

## Fixes (source/game.js)
- Battle Hymn (reviewer, medium): the caster's own action ended right after the cast and took a turn off him, so Perrin got 2 future turns to everyone's 3 (Encore 4 vs 5). He now receives one extra count, the same way Shield Wall does, so a completed cast leaves the caster and every ally on the same number: 3, or 5 with Encore. Test: a full cast driven by the production update loop, then the counts.
- Quests (reviewer, medium; owner's design): Engineer favours Hunt and Scout, Summoner Forage and Pilgrimage, Bard Scout and Pilgrimage (questBonus 1.3 on those, as for the originals). Class events, pushed twice into the event pool like every original class: Engineer "Salvaged old machinery" pays round((8 + level) x 1.5 x oreMult) ore; Summoner "Communed with a spirit" pays 40% of a level x xpMult; Bard "Played a roadside performance" pays round(0.8 x (30 + 8 x level) x goldMult) gold. No dust from any of them.
- Recruit metadata (reviewer, low): the unused zone fields on the hero list are gone; the zone table's recruit fields are the one source.

## Simulator (tests/sim)
- bot.js --party a,b,c,d: a preferred ordered lineup, front first. A hero is swapped in only after production has recruited them and only while they are at camp; the rest of the party keeps its current members; the cleric-to-the-back rule still applies afterwards. Preferred heroes are reserved: the bot never posts them to the garrison and does not pick them for the Catacombs while anyone else can go. Duplicate or unknown ids are rejected before the run (exit 2). Provenance: config.party and model.party carry the request; partyRequested, partyActual (ordered, at the end) and partyChanges (hour and lineup at every change) are in the result; batch.js forwards the flag and records it in the manifest model. Without the flag the result is byte-identical to the previous harness: tests/sim/equiv.js --ref 137d857 --mode exact PASS, 24 pairs identical (RNG call counts and canonical hashes). The gate now treats the dirty-tree flag as provenance like the commit, because the reference harness runs from a checkout without git and reports it as unknown.
- Verified on seed 81 casual 2x: Osric recruited at 2.68 h and fielded within the quarter hour, holding the requested slot.

## Tests
- tests/contract/party.test.js (69 assertions): six lineups fielded through six minutes of live road encounters each (every newcomer beside originals, the four bundled heroes together, the three newcomers with the knight): invariants (finite currencies, HP in range, party cap, well-formed projectiles), the party wins fights, every hero attacks, every bundled hero casts its ability, basic and ability damage both counted. Then the bot with --party: exit 0, request recorded, every fielded hero recruited first, Osric never fielded before his recruitment hour and fielded within a quarter hour of it, the front follows the request, duplicate and unknown ids rejected.
- tests/contract/heroes.test.js grew to 526 assertions (hymn through a full cast, quest affinities, bonuses, events, weighting, payouts and no dust, no stale zone fields).
- All 9 suites pass (2,547 assertions); parity PASS (game.js and the five effect scripts embedded verbatim).

## Still open
- Reviewer item 1 (developer rows visible in Settings): parked by the owner.
- Item 4: fresh 2x and continuous 4x batches from the final head, parked by the owner; when run, consider a matched --party batch that fields the newcomers.
- Item 6: criterion 7b, the owner's decision.
- main stays at f8c2a81.
