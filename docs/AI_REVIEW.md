STATUS: READY
REVIEW_FOR_PASS: PASS_15_WHOLE_ROAD_BOTTLENECK_TRIAGE
REVIEWED_HANDOFF_PASS: PASS_14_WARLORD_ATK_VALIDATION
REVIEWED_HANDOFF_SHA: e2906ff809705b2a548c7625b3149c615d4cb995
BASE_COMMIT: ed69af00dff5058dbaf4ecba31fda6a89ddd693e
CONFIDENCE: HIGH

# Decision

Lock Orc Warlord base ATK at x1.2.

Pass 14 reproduced the intended player-facing result on fresh seeds and passed 14 of 15 validation criteria:

- idle first-try 10% -> 35%, attempts 6/13 -> 2/4, and stall 2.20h -> 0.58h;
- light first-try 30% -> 45% and stall 0.78h -> 0.35h;
- Warlord still produces losses across idle, light, and casual;
- active-window win rates remain below 95%;
- the lethal charge, summon phase, and active-play advantage remain meaningful;
- Stillwater, Thornwood, downstream median clear times, progression medians, Auto Training, hordes, catacombs, and damage mix show no material regression;
- 200 validation runs completed with zero simulation errors and audited arm separation.

This is the final decision for this Warlord lever. Do not run another Warlord x1.2 confirmation or test another Warlord ATK value.

# Rewalk Gate Exception

The one miss was idle Ironvein ordinary rewalk fights per exposure hour: +12% by arm medians, versus the +10% limit. It does not justify rejecting the candidate or rerunning 200 simulations.

The player-facing and causal evidence points away from an ordinary-combat regression:

- ordinary Ironvein defeats fell 66 -> 57;
- ordinary rewalk fights fell 251 -> 207;
- rewalk cost per defeat was flat to lower;
- Warlord attempts fell 6 -> 2;
- Ironvein exposure fell 4.61h -> 3.55h;
- paired rate change was +5%, with the larger arm-median ratio caused by removing low-defeat boss-cycle hours from the denominator;
- only the boss ATK changed; ordinary enemy values did not.

Record this as a metric-construction exception, not as a passed literal gate. Do not add an ordinary-win counter and rerun solely to make the secondary rate pass. The primary outcomes are clear enough, and the map does not need a theoretically perfect metric profile.

# Locked Warlord State

Production Warlord base ATK x1.2 is now accepted and locked.

Keep locked:

- HP x6.0, DEF x1.2, speed 8, charge x2.5, ward, summon threshold, and two-orc summon;
- AUTO_REACT = false;
- no further Warlord ATK candidate;
- no global enemy-ATK curve change;
- all previously locked systems and values.

The existing simulator-only x1.7 control mechanism may remain as test infrastructure if it has no production effect. Do not restore x1.7 in production.

# Pass 15: Whole-Road Bottleneck Triage

Move on from Ironvein. Use broad multi-zone evidence to identify the next largest player-facing progression bottleneck instead of polishing one map further.

Start with existing valid telemetry from Pass 14 and prior accepted runs. Do not run a new full validation for triage.

Rank sufficiently sampled zones and bosses using:

1. median and P90 clear time;
2. first-try rate, attempts, maximum loss streak, and stall time;
3. ordinary and boss rewalk burden;
4. meaningful failure state rather than automatic clear or execution wall;
5. idle, light, and casual experience, keeping active play advantaged;
6. downstream progression at 20h and 24h;
7. reach counts and censoring so under-sampled late zones are not overinterpreted.

Return one ranked table covering the whole measured Road, then select exactly one next material bottleneck. State:

- the player-facing problem;
- the most likely causal mechanism;
- the smallest local balance lever capable of testing it;
- one bounded candidate experiment;
- primary success and regression criteria.

If the existing data cannot distinguish the top two bottlenecks, run at most one quick diagnostic with 5-10 paired seeds focused on those locations. Do not run a confirmation plus validation during triage, and do not change gameplay code until the next experiment is reviewed.

# Pacing Rule

For the next balance lever:

- at most one diagnostic if the cause is unclear;
- one adequately sized candidate test;
- one final validation only if release confidence requires it;
- after validation, lock or reject and move on;
- do not add an extra confirmation pass for a narrow secondary-metric miss when the player-facing effect and causal evidence are clear.

Distinguish completion of a pass, completion of a map, and completion of whole-game tuning.

# What Not To Do

- Do not rerun Pass 14.
- Do not continue tuning Ironvein or Warlord.
- Do not change Auto Training, charge reactions, Warlord mechanics, or global curves.
- Do not tune toward the Stress profile.
- Do not interpret sparsely reached late-zone samples as conclusive.
- Do not implement multiple balance levers in parallel.
