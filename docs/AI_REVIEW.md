STATUS: READY
REVIEW_FOR_PASS: PASS_18_GRAVE_KNIGHT_ATK_CANDIDATE
REVIEWED_HANDOFF_PASS: PASS_17_LATE_BOSS_ATK_NORMALIZATION_CANDIDATE
REVIEWED_HANDOFF_SHA: 8e63b0e91971a43382ba980129b37cf4e94451eb
BASE_COMMIT: 48c383b43632fba5b7994307c199580ac587534e
CONFIDENCE: HIGH

# Decision

Lock the scoped late-boss normalization values:

- Sand Tyrant base ATK x1.1;
- Hunter King base ATK x1.0.

Pass 17 is sufficient evidence. Do not run separate confirmation or validation passes for either boss.

The combined candidate changed both fights from repeated execution walls into contested checks:

- idle Sand Tyrant attempts 22/29 -> 3/6, stall -67%, Auto-Cast efficiency 4.6% -> 31%;
- idle Hunter King attempts 32/64 -> 3/8, stall -66%, Auto-Cast efficiency 2.8% -> 29%;
- light and casual retain meaningful losses;
- charges and volleys remain lethal;
- active play remains advantageous;
- Stillwater, Thornwood, and Ironvein are identical;
- no profile loses median Road progress at 24h, 36h, or 48h;
- total defeats remain within the regression limit;
- downstream clear times remain within limits;
- 60 runs completed with zero errors and audited arm separation.

Apply x1.1 and x1.0 to the canonical production source and generated runtime bundle before the next test. Remove or disable their candidate overrides so both Pass 18 arms use the production locks.

# Documented Exceptions

Do not retune the accepted values for these two literal misses:

1. Hunter King casual active-window wins were 8/8. This is only eight attempts, the fight still recorded a casual loss, and the result is partly driven by earlier Emberwaste progression changing arrival timing and power.
2. Idle Auto Training hours rose 19%. Auto Training behavior did not change. Idle reaches Ashen Approach roughly four hours earlier and therefore has more time to encounter the next wall and trigger training.

These are downstream exposure effects, not evidence that Sand Tyrant or Hunter King remain mis-tuned. Record them and move on.

# Correction Accepted

Accept the developer's correction:

- Grave Knight guards Ashen Approach and is the next measurable boss wall.
- Hollow King guards Ashen Keep and remains the Shatter wall.
- The earlier exclusion of Grave Knight as Shatter-linked was based on mislabeled telemetry.
- The corrected mapping does not invalidate the Sand Tyrant or Hunter King decisions.

# Pass 18: Final Extension of the ATK Rule

Test one candidate:

- Grave Knight control base ATK: x2.0;
- Grave Knight candidate base ATK: x0.85.

Use a simulator-only override for Grave Knight. Keep its production value at x2.0 until review.

Run on top of the newly locked production Sand Tyrant x1.1 and Hunter King x1.0 values:

- paired seeds 31-40;
- idle, light, and casual;
- 48 hours;
- 30 control + 30 candidate runs;
- production Road, normal Auto Training, hordes, and catacombs;
- zero simulation errors.

This is the final per-boss extension of the current damage-normalization rule. Do not add other Grave Knight values, sizing arms, or a separate confirmation phase.

# Required Results

Report for Grave Knight:

- reach and clear counts;
- first-try clears;
- attempts and maximum loss streak;
- combat, retry, and total stall;
- Auto-Cast and active-window wins/attempts;
- ordinary hits;
- charge telegraphs/hits/kills, parries, and interrupts;
- raised units and summon phase reached;
- loss boss-HP distribution;
- winning survivors and party HP;
- arrival level, power, hero HP/DEF, charge, and Surge;
- actual boss ATK and calculated hits-to-defeat at first attempt.

Report for the Road:

- Sand Tyrant and Hunter King production values and outcome rows;
- per-zone median/P90 clear times;
- zones cleared at 24h, 36h, and 48h;
- ordinary and boss rewalk burden;
- Auto Training hours/triggers by source zone;
- total defeats;
- Hollow King reach/clear counts without changing it;
- hordes, catacombs, and simulation errors.

# Good-Enough Criteria

The Grave Knight candidate is acceptable if:

- adequately reached idle runs have median attempts 1-4 and P90 <=8;
- idle Auto-Cast clears are no longer a low-single-digit execution wall;
- light and casual median attempts are <=3 and P90 <=6;
- active-window win rates remain below 95% where there are at least 10 attempts; smaller denominators must be reported, not treated as decisive;
- the boss still produces losses across realistic profiles;
- charge remains meaningfully lethal;
- Sand Tyrant, Hunter King, and everything upstream are identical between arms;
- no adequately sampled downstream median clear time worsens more than 10% or P90 more than 15%;
- no profile regresses in median zones cleared at 24h, 36h, or 48h;
- total defeats stay within +10%;
- no material Auto Training, horde, catacomb, telemetry, or mechanical regression appears.

Prefer player-facing outcomes and paired direction over chasing every small-sample percentage. If x0.85 produces a meaningful fight without regression, propose locking it directly.

# Decision After Pass 18

After this test:

- lock x0.85 if the effect is clearly good enough;
- reject it if it creates an automatic clear or meaningful regression;
- request a final validation only if evidence is genuinely ambiguous or release-critical.

Do not start another Grave Knight sizing or confirmation pass.

After the Grave Knight decision, stop boss-by-boss ATK polishing and return to whole-Road triage. The next likely systemic question is late-Road Auto Training cost, not another attempt to perfect these boss values.

# Locked Systems

Keep locked:

- Warlord ATK x1.2;
- Sand Tyrant ATK x1.1;
- Hunter King ATK x1.0;
- all HP, DEF, speed, charge/volley, summon, add, enrage, ward, raise, and other boss mechanics;
- Hollow King and the Shatter wall;
- ordinary enemies and global enemy curves;
- AUTO_REACT = false;
- all Auto Training constants and protections;
- all previously locked progression, economy, tap, Renown, rarity, promotion, travel, recovery, and UI systems.

# What Not To Do

- Do not change production Grave Knight ATK before review.
- Do not change Hollow King.
- Do not test multiple Grave Knight values.
- Do not change HP, charge, raise, summons, adds, speed, or DEF.
- Do not revisit Sand Tyrant, Hunter King, or Ironvein.
- Do not start another boss-by-boss cycle after Pass 18.
- Do not tune toward Stress.
