STATUS: PARTY_PROVENANCE_AND_OWNER_CHANGES_DONE_TUNING_BRANCH_ONLY
RESPONSE_TYPE: DEFECT_FIXES_AND_OWNER_CONTENT_CHANGES
PASS_ID: PASS_53D
BASED_ON_REVIEW_PASS: REVIEWER_VERDICT_2026-09-29 on e4c2e76 (four areas to fix before batches) plus three owner requests made during the pass (no screen shake on regular attacks, the updated fire archer bundle, the hero renames)
BUILD: 20260929 (tuning branch; main untouched at f8c2a81)
HEAD_COMMIT_SHA: see git log (this handoff is committed with the code)
PULL_REQUEST: #2
SUPERSEDES: PASS_53C

# Crystal Road AI Handoff - Pass 53d (harness provenance, forward equivalence, no direct party writes, post lock, roster-derived lineup validation; owner: no shake on regular attacks, fire archer update, hero renames)

## Reviewer items on e4c2e76
1. Provenance (high). tests/sim/harness.js names the harness files (bot.js, headless.js, party.js, harness.js). harnessHash is one 16-hex hash per file in that order; the dirty-tree check watches all of them plus source/game.js and build/assets.json. provenance.js prints the same values.
   - Found while fixing: the bot's dirty flag never fired. Its git paths were relative to tests/sim, so it watched nothing and always recorded a clean tree. It now runs from the repository root. Every earlier "clean tree" line in a batch was therefore unverified by that flag; the game and harness hashes of those batches were real and still identify what ran.
2. Forward equivalence (high). equiv.js copies every harness file that exists at the reference: that commit's own HARNESS_FILES list, or bot.js and headless.js plus any helper already present. It takes --model clericBack,drills,double,boosts, --schedule and --party and passes them to both sides.
3. Direct party writes (high). The cleric-to-the-back rule now reorders through the production partySetOrder. bot.js contains no write to the party anywhere; a source test checks the whole file.
   - Gate on the real-player configuration: equiv.js --ref e4c2e76 --mode exact --speeds 2 --model clericBack,drills,double,boosts --schedule 2:2,2:8,2:8 --hours 6: EQUIV PASS, 12 pairs identical. Default configuration, speeds 1 and 2, 3 h: EQUIV PASS, 24 pairs identical. So moving the cleric rule onto the production path changed no frame.
4. Garrison lock (medium). partyBringIn stops when recallHero could not release the hero: he stays on the wall and out of the party, for a replacement and for a free place alike. Nobody can march and hold a post at once. This also corrects the Party sheet, which had the same hole.
5. Validator trust (medium). Lineups are judged against facts the run records independently of the party code: the roster and the recruit hours. party.lineupProblems requires the recruited part of the request at the front of the final party in the requested order, partyAvailable equal to that same list, every history entry consistent with the recruit hours (nobody fielded before his hour, nobody recruited well before left out), no unrecruited hero, the party size, and a recorded roster. The bot fails fast: after every application it compares the marching party with the heroes the game itself says can be fielded (partyCanField), checks that no requested hero is posted or questing, applies the lineup once more at the end of the run, and records the road party even when the run ends inside the Catacombs or a horde fight. The lineup is never applied inside either.

## Owner requests during this pass
- No screen shake on regular attacks. Correction to an earlier statement of mine: the road does draw screen shake from G.shake; the new effects were setting it on every basic hit. Basic attacks of the engineer, summoner, bard, ranger and the knight's slash now go through fxTouch (flash and sprite nudge only). Abilities keep their shake. A source test pins both. Checked in the page: shake stays at 0 through basic attacks and reaches 0.35 on Rain of Fire.
- Fire archer bundle, second version: new sheets for all four tiers (new cast rows, deeper flames), new effect script (steeper and slower burning arrows with streaks, extra visual arrows per rank, ground glow under each target through the new fireFxDrawUnder call). Rain of Fire still deals its damage and bleed at the game's hit frame; the hero suite's Rain of Fire tests pass unchanged. The no-shake rule above is kept.
- Renames: Knight Hale (hale), Ranger Ash (ash), Bard Lark (lark), Summoner Kit (kit), Engineer Fitz (fitz); Sera, Vex, Morrow and Bram unchanged. Saves written under the old ids are renamed on load (roster, party order, quests, garrison); levels, ranks and sheets are kept and the next save carries only the new ids.
- Old-name sweep: no old name is left in any player-facing text. A test scans source/game.js (one permitted line, the save rename table), the shell, the five effect scripts, the text of build/assets.json, every text line of the built page, and the hero, class, ability, talent, title, quest and zone strings. Banners, toasts and the tutorial build hero names from the hero list, so they follow the rename.
- The one-time recruit grant on load is removed at the owner's word. Loading a save never adds a hero; the newcomers join where production recruits them, when their zone's boss falls. A save already past those zones meets them on its next run through those zones.

## Tests (all 9 suites pass; parity PASS for game.js and the five effect scripts)
- party.test.js, 157 assertions: adds the post lock, provenance (hash per file, the dirty flag equal to git status, a changed party.js reported and hashed, restored byte for byte), the forward gate against HEAD with --model clericBack, the cleric rule through the production path, and six adversarial lineup cases that pass an empty or false partyAvailable, an early or late history entry, a never-recruited hero or no roster: all refused by the evaluator and the strict validator.
- heroes.test.js, 548 assertions: adds the no-shake source contract, the roster table, id equals lower-case name, recruit order by zone, the rename of an old save through a real load, no grant on load, and the old-name sweep.
- Total: 2,657 assertions across the 9 suites.

## Not done, by instruction
No full batches. Developer rows in Settings, criterion 7b and the main fast-forward remain the owner's open items. The art mock scripts under assets/ and source/ still print the old names; they are not part of the game.
