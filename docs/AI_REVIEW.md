STATUS: READY
REVIEW_FOR_PASS: PASS_12_WARLORD_ATK_ROAD_DIAGNOSTIC
REVIEWED_HANDOFF_PASS: PASS_11_AUTOCAST_CHARGE_REACTION_DIAGNOSTIC
REVIEWED_HANDOFF_SHA: a40ebf70d9b997ec57ca04d0b480f6723b94454d
BASE_COMMIT: 1b6032d604f1e85fdf130edaeb3d0366ead26069
CONFIDENCE: MEDIUM

# Decision

Accept the counterproposal.

Reject the exact Auto-Cast reaction candidate. It failed its predeclared Phase A gate and must remain disabled.

Authorize one Warlord-local road diagnostic with base ATK changed from x1.7 to x1.2 in the candidate arm only. Keep HP, defense, speed, charge multiplier, ward, summon, and every other gameplay value unchanged.

The x1.2 value is an experiment, not approval to ship.

# Pass 11 Assessment

The candidate was implemented consistently with the review:

- Both melee and ranged charge telegraphs were eligible.
- At most one ready Knight, Rogue, or Mage responded.
- Sanctuary and non-counter abilities were excluded.
- No charge was granted or reserved.
- Six possible additional responses were prevented; no double response or same-tick double cast occurred.
- Production remains `AUTO_REACT = false`.

The result clearly fails the gate:

- Charge kills fell only 26% / 20% / 29% / 24%, not the required 60% in three profiles.
- Idle Auto-Cast clear rate rose only 3% -> 8%.
- Light remained 5% -> 5%.
- Reactions were available for only about 0.67 of roughly 2.0 telegraphs per fight because ordinary Auto-Cast had already spent most ready abilities.
- Losses shifted later, but not enough to produce reliable clears.

Do not proceed to a Road test of automatic reactions. Do not validate or ship `AUTO_REACT`.

# Counterargument Evaluation

The new evidence corrects the Pass 10 interpretation.

Active play is not winning mainly because it reacts to more telegraphs. Light, casual, and engaged active play shortens the fight through taps, Surge, additional charge generation, more ability casts, and the manual-cast bonus, so the party faces fewer Warlord actions. Idle-active still sees about two telegraphs and wins more often through the remaining active-mode benefits.

At natural arrivals, Warlord base damage is itself an execution-level check:

- Warlord ATK is about 978 against heroes with approximately 930-1,258 maximum HP and 118-156 defense.
- Ordinary Warlord hits remove a large share of a hero's health.
- Charge hits kill almost once per hit.
- Reducing the charge multiplier from x2.5 to x2.0, x1.75, or x1.5 did not materially change outcomes because all remained lethal.

Therefore a charge-multiplier test is not justified. If the design intent is to preserve the one-shot telegraph while allowing an automatic party enough time to contest the boss, base ATK is the correct single lever because it changes the ordinary hits between charges.

The harness sizing supports x1.2 as the hardest tested value that materially moves idle/light Auto-Cast. It also makes active Warlord fights easier, so the Road test must gate against trivialization. The harness sweeps are proposal-sizing evidence only and do not replace the authorized Road diagnostic.

# Authorized Experiment

Control:

- Warlord base ATK x1.7
- `AUTO_REACT = false`

Candidate:

- Warlord base ATK x1.2
- `AUTO_REACT = false`

Implementation requirements:

- Use one source build with the candidate isolated behind the simulator's existing boss-ATK override or an equivalent test-only constant.
- Production source must remain at Warlord ATK x1.7 during this diagnostic.
- Do not retain any accidental candidate value in `index.html` or `source/game.js`.
- The Pass 11 reaction code may remain disabled for measurement continuity, but it must not execute in either arm.
- Use identical telemetry in both arms.
- Record actual Warlord ATK at fight start so the separation can be audited.

# Simulation Plan

QUICK ROAD DIAGNOSTIC:

- paired seeds 1-10
- Idle / Light / Casual / Engaged
- 24 hours
- 40 control + 40 candidate runs
- current production Road and Auto Training behavior
- 0 simulation errors

Do not test x1.0, x1.4, a second ATK value, or any combined lever in this pass.

# Required Results

Report median / P90 and paired change for:

- Ironvein first-try clear rate
- attempts to clear and maximum loss streak
- combat stall, retry stall, and total boss stall
- Ironvein and total zone-clear time
- party level, power, HP, charge, Surge, and active/Auto-Cast window at first attempt
- active-window and Auto-Cast Warlord attempt win rates
- normal hits, charge telegraphs, charge hits, charge kills, parries, and interrupts per Warlord attempt
- boss HP remaining and phase on losses
- survivors and party HP on wins
- all early-Road boss first-try rates, attempts, stalls, and clear times
- zones cleared and party level at 24h
- ordinary and boss defeats
- ordinary and boss rewalk fights/hours
- Auto Training triggers, returns, hours/share, and levels earned
- horde outcomes and catacomb depth/runs
- ability casts and active/Auto-Cast damage share

Also report how much of the candidate's Ironvein improvement comes from Auto-Cast attempts versus active-window attempts.

# Success Criteria

The x1.2 candidate is promising only if all are true:

- idle median attempts fall from 7 toward 3-4 and P90 falls materially from 18;
- idle total Ironvein stall falls at least 35%;
- idle first-try rises above 0% and light first-try rises above 10% on these paired seeds;
- Auto-Cast Warlord attempt win rate improves materially for idle and light;
- active-window Warlord attempt win rate remains below 95% for idle, light, and casual, with engaged allowed to remain at its existing ceiling;
- Warlord still produces losses in at least three profiles and does not become a universal first-try clear;
- no early-Road median clear time worsens more than 10% or P90 more than 15%;
- Stillwater remains in its locked Pass 7 bands;
- median zones cleared at 24h do not decline;
- ordinary defeat, rewalk, and Auto Training metrics do not worsen more than 10%;
- no downstream boss or zone accelerates more than 15% without a clear propagation explanation; and
- no horde, catacomb, telemetry, or mechanical regression appears.

# Failure Criteria

Reject or revise x1.2 if:

- idle/light Auto-Cast results remain effectively unchanged;
- the improvement is confined to active attempts;
- active Warlord attempts become effectively automatic;
- Ironvein becomes a universal first-try clear;
- the party simply reaches a new summon/add wall with no meaningful stall improvement;
- progression or downstream content accelerates beyond the limits above; or
- telemetry cannot distinguish active from Auto-Cast attempts.

# Decision Rules

- If all success criteria pass: propose a normal validation of Warlord ATK x1.2.
- If x1.2 helps Auto-Cast but trivializes active Warlord: return one bounded counterproposal; do not silently test another number.
- If x1.2 is still too weak: retain x1.7 and explain whether arrival level or the global post-Lv25 damage curve is the remaining cause.
- If the effect appears across later enemies or bosses: propose a separate global damage-curve diagnostic. Do not change the curve in this pass.
- If the candidate fails: do not fall back to Auto-Cast reactions without new evidence.

# Locked Systems

- Warlord HP x6.0, DEF x1.2, speed 8, charge x2.5, ward behavior, summon threshold, and two-orc summon
- production Warlord ATK x1.7 until validation is explicitly approved
- `AUTO_REACT = false`
- all other boss and ordinary-enemy values
- `AT_LOSSES = 4`, `AT_WINDOW = 10`, and `AT_MIN = 8`
- universal +1 Auto Training target; no conditional +2 and no cooldown
- Auto Training rewards, minimum fights, fallback, protections, and Keep Pushing
- Stillwater Alpha HP x0.55 and ATK x0.70
- summoned werewolf HP x0.75 and ATK x0.85
- one wolf at 60%; Howl at 30%
- Greenhollow tuning
- tap damage x0.22 and tap charge/focus
- boss retry cadence 9
- polynomial Renown
- rarity and promotion progression
- no global XP, gold, drop, gear, travel, recovery, or unrelated UI change

# What Not To Do

- Do not ship Auto-Cast reactions.
- Do not change the charge multiplier.
- Do not change Warlord HP, defense, speed, ward, summon, or adds.
- Do not test multiple ATK values.
- Do not change the global enemy ATK curve.
- Do not alter Auto Training.
- Do not treat the prior harness sweep or this quick Road diagnostic as release validation.
