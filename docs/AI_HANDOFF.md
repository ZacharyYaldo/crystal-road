STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: PARITY_REPAIR_RESULTS
PASS_ID: PASS_34_SIM_PARITY_REPAIR
BASED_ON_REVIEW_PASS: REVIEWER_MESSAGE_RELAYED_BY_HUMAN_2026-09-13 (parity repair request)
BUILD: 20260913-175615
HEAD_COMMIT_SHA: ed6cd01bf5ad5ef455e30cc949307a2927d82dcc
RESULTS_COMMIT: ed6cd01bf5ad5ef455e30cc949307a2927d82dcc (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
PREVIOUS_HANDOFF: PASS_33_CYCLE_2_OPEN at commit f2f5bce (gated baselines on the current and pass 32 builds; still the reference tables)

# Crystal Road AI Handoff - Pass 34 (simulator parity repair, testing only; no gameplay, gear, economy, boss or progression value changed)

HUMAN_APPROVAL: "fix the simulator if it makes sense to you" (2026-09-13). Scope as the reviewer proposed: parity repair only on ai-tuning-loop.

DEVELOPER_POSITION: AGREE with all six items; all implemented in tests/sim only. CONFIDENCE: HIGH (syntax clean; three smoke runs on seed 61 pass every new assertion: idle 14h, idleboost 14h, synthetic Endless 2h).

## What changed (tests/sim/bot.js, tests/sim/headless.js, tests/README.md)
1. Zone travel: the bot's travelTo now calls the game's goZone (exported from the harness), so arrival snaps to the zone's highest reached checkpoint and heals the party exactly as the map does; the bot's private copy of that logic is gone.
2. Boss-level telemetry: a hero recruited in the current tick (recruits join at a zone clear) is excluded from the sampled party level, so zone-clear and boss-attempt levels are no longer dragged down by a level-1 newcomer. Recruit detection moved to the top of the tick so the mark exists before any record is written.
3. Synthetic Endless (--endless): campfireDone is set before the roster is filled, so the game no longer adds a second Sera at two wins; the fill also dedupes by id or name; the mode starts with three Shatters (the Foundry/Endless gate).
4. Assertions after every update: legal zone (zoneUnlocked, outside hordes and the Delve), unique roster names, every active hero in the roster, no Auto-Cast on an unboosted profile, no boost longer than one four-hour purchase, and numeric lv/power/bossLv on the latest boss attempt record. A failure ends the run with an ERROR event and assertFail in the JSON (also reported as profile, boost, boostBuys).
5. Profiles: idle = no taps, no Auto-Cast ever; idleboost = no taps, re-buys the production four-hour Auto-Cast boost whenever it lapses; light/casual/engaged/stress/active keep Auto-Cast outside their active minutes but now through the same four-hour purchase model (autoUntil is never set to infinity). --boost 0|1 overrides a profile.
6. README: profile lines, Endless default, the boost caveat, and a new "Parity with the game" section.

## Smoke results (seed 61, current build, gated route)
- idle 14h: boost false, 0 purchases, no assertion failure, first Shatter 13.66h (sealed after Ironvein), in Ironvein at 14h on run 1.
- idleboost 14h: boost true, 4 purchases, Shatters 6.79h and 12.04h (both sealed), Ashen Approach at 14h.
- endless 2h (--endless 5): no assertion failure, one Sera, best wave 125.

## Not changed
No value in source/game.js. The pass 33 baselines (batch_out_owner2 / batch_out_refgated, n=10, seeds 61-70) were run before this repair with the previous travel and permanent-Auto-Cast idle; they remain the reference until fresh baselines are run. The developer will not run baselines until the human asks.

## Request
Reviewer: confirm the repair covers the four defects you listed, and state the baseline batch you want (profiles, seeds, horizon) so the human can approve it in one line.
