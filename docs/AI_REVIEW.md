STATUS: READY
REVIEW_FOR_PASS: PASS_16_SAND_TYRANT_ATK_CANDIDATE
REVIEWED_HANDOFF_PASS: PASS_15_WHOLE_ROAD_BOTTLENECK_TRIAGE
REVIEWED_HANDOFF_SHA: a78e43a5a5eb246ea6ed4b2fb2d3a357e20dce44
BASE_COMMIT: 4d8e48951b42309b362d1d45e96776bcd9df7b18
CONFIDENCE: HIGH

# Decision

Accept Emberwaste / Sand Tyrant as the next material bottleneck.

The ranking is convincing enough to act:

- idle spends about 13 hours from Emberwaste entry to clear;
- idle has 0% first-try clears, 22 median attempts, P90 29, a 21-loss streak, and 4.49h of boss stall;
- idle Auto-Cast wins only 10 of 216 attempts;
- light clears mainly when an active window happens to overlap the fight;
- this wall appears around 15-28h, substantially earlier than the late-Road training-cost problem;
- Ironvein now sits mid-table after its lock, so additional Ironvein work is not justified.

Accept the causal diagnosis: Sand Tyrant damage per action is too high at natural arrival. Parties reach the summon and active play can win, so HP, summons, enrage, and progression strength are not the first levers to change.

# Pacing Correction

Do not run the proposed four-arm sizing harness.

The triage plus the prior Warlord evidence already serve as the diagnostic. Testing x1.9, x1.5, x1.35, and x1.2 before the Road test would add another optimization loop without a clear player-facing need.

Test one candidate directly:

- control Sand Tyrant base ATK: x1.9;
- candidate Sand Tyrant base ATK: x1.35.

Use an isolated simulator override for the candidate. Do not change the production enemy table yet.

# Pass 16 Candidate Test

Run:

- paired seeds 31-40;
- idle, light, and casual profiles;
- 36 hours;
- 30 control + 30 candidate runs;
- production Road, normal Auto Training, hordes, and catacombs;
- zero simulation errors.

This is the adequately sized candidate test. Do not add a separate boss-harness sizing phase, x1.5 arm, or x1.2 arm.

Report counts, medians/P90, and paired direction for:

- Emberwaste reach and clear counts;
- first-try clears;
- attempts and maximum loss streak;
- boss combat, retry, and total stall;
- Auto-Cast and active-window wins/attempts;
- ordinary hits, charge telegraphs/hits/kills, summon reached, loss phase/HP, and win survivors/HP;
- arrival level, power, party HP, charge, and Surge;
- clear times and zones cleared through the 36h horizon;
- ordinary and boss rewalk burden;
- Auto Training hours/triggers;
- upstream locked bosses;
- downstream zones with adequate reach;
- hordes, catacombs, and simulation errors.

# Good-Enough Success Criteria

Treat x1.35 as promising if the primary player-facing result is clear:

- idle median attempts fall to 2-5 and P90 is no more than 10;
- idle total Emberwaste stall improves at least 40%;
- idle gets a meaningful Auto-Cast clear rate instead of a low-single-digit execution wall;
- light median attempts are no more than 3 and P90 no more than 6;
- light and casual active-window win rates remain below 95%;
- the boss still produces losses in idle, light, and casual;
- the charge remains lethal when it lands;
- Stillwater, Thornwood, and Ironvein are unchanged;
- no adequately sampled downstream median clear time worsens more than 10% or P90 more than 15%;
- no material Auto Training, horde, catacomb, or mechanical regression appears.

Do not reject a clear improvement because one secondary percentage narrowly misses an arbitrary threshold. Document uncertainty. Likewise, do not search for a more “perfect” ATK value if x1.35 produces a contested, meaningful fight without regression.

After Pass 16, the reviewer will either lock x1.35, reject it, or request one final validation only if the evidence is genuinely ambiguous or release-critical.

# Avoid Repeating This Boss By Boss

Alongside the Pass 16 report, use existing Pass 15 snapshots and telemetry to include a compact, observation-only comparison for:

- Sand Tyrant;
- Hunter King;
- Grave Knight.

For each, report base ATK, actual ATK at first attempt, party HP at natural arrival, ordinary hits to defeat a typical hero, charge/volley lethality, active versus Auto-Cast outcomes, and whether losses show the same damage-per-action wall.

This comparison does not authorize changes to Hunter King or Grave Knight. Its purpose is to decide whether the next action should be one scoped late-boss normalization experiment instead of separate multi-pass polishing cycles for every map.

You may correct the ranged-volley hit/kill telemetry as an observation-only instrumentation fix. Do not rerun a full batch solely for that fix; validate it with the smallest focused replay available.

# Locked Systems

Keep locked:

- Warlord base ATK x1.2 and all other Warlord values/mechanics;
- Sand Tyrant HP x6.5, DEF x1.0, speed 10, charge x2.5, enrage at 25%, summon at 50%, and two sandorcs;
- all other boss and ordinary-enemy values;
- AUTO_REACT = false;
- AT_LOSSES = 4, AT_WINDOW = 10, AT_MIN = 8;
- universal +1 Auto Training target and all exploit protections;
- Stillwater, Thornwood, and Greenhollow tuning;
- tap, Renown, rarity, promotion, XP, gold, gear, travel, recovery, and unrelated UI systems.

# What Not To Do

- Do not change production Sand Tyrant ATK before review.
- Do not test multiple Sand Tyrant ATK values.
- Do not alter charge, HP, summons, adds, enrage, or Auto Training.
- Do not tune Hunter King or Grave Knight in this pass.
- Do not run another Ironvein pass.
- Do not tune toward Stress.
- Do not start a global enemy-ATK curve change.
