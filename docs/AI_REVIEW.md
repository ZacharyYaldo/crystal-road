STATUS: READY
REVIEW_FOR_PASS: PASS_20_LATE_ROAD_TRAINING_TRIGGER_CANDIDATE
REVIEWED_HANDOFF_PASS: PASS_19_LATE_ROAD_TRAINING_TARGET_CANDIDATE
REVIEWED_HANDOFF_SHA: acd4723f53bf178080ca09a6353c453c07013d10
BASE_COMMIT: 69370dd3f3eaf663d90248fac7f0edf67660f5e9
CONFIDENCE: HIGH

# Decision

Reject the late-Road Auto Training target 0.5 candidate.

Keep the production target at 1.0. Do not implement 0.5 for any profile, zone, or play window.

The candidate is not a robust systemic improvement:

- casual saved a real 5.2 training hours and cleared Ashen Approach 5.0 hours earlier in all 10 paired seeds;
- idle and light saved only 0.9-1.2 hours while training episodes rose from 8-9 to 13-15;
- ordinary Ashen Approach defeats rose 51% for idle and 68% for light;
- light Grave Knight first-try clears fell from 7/8 to 2/8 and boss stall rose by about 1.9 hours;
- casual total defeats rose 47% because it reached the Hollow King five hours earlier and six levels lower;
- no profile gained median zones cleared at 24, 36, or 48 hours.

The casual result is valuable evidence, but it does not justify a playstyle-dependent production target or accepting worse idle/light fight quality with no horizon progression gain. The flat 0.5 target mostly shortens each retreat while preserving the rapid retrigger mechanism.

Accept the developer's corrected mechanism: late-Road loop count, not episode length alone, is the remaining Auto Training question.

# Telemetry Assessment

The Pass 19 result is valid for this decision:

- 60 paired runs, zero simulation errors;
- candidate/control target separation audited;
- Grave Knight stayed mechanically identical at x2.0;
- every result through Amberfall was identical;
- the snapshot-prefix repair was observation-only;
- paired directions and player-facing effects are large enough that no confirmation run is needed.

The casual Hollow King defeat increase is exposure-driven and should not be read as a direct Hollow King regression. It does show that saving training time without preserving arrival strength merely moves the wall forward.

# Pass 20: One Final Late-Road Auto Training Test

Run one final systemic candidate, then close Auto Training tuning regardless of outcome.

Hypothesis:

> Raising the late-Road danger trigger from four losses to five will reduce repeated retreats without shortening each training episode or lowering the intended +1-level recovery target.

Test exactly:

- control: production danger threshold = 4 losses in the rolling 10-fight window;
- candidate: danger threshold = 5 only when the return zone is Ashen Approach or later and is otherwise eligible for Auto Training;
- keep the training target at 1.0 in both arms;
- implement the candidate as a simulator-only override;
- Ashen Keep remains excluded by the existing production rule;
- do not change the rolling window, minimum-fight rule, quick-retrigger behavior, Keep Pushing, XP, ordinary enemies, bosses, or any other value.

Use the same bounded batch:

- paired seeds 31-40;
- idle, light, and casual;
- 48 hours;
- 30 control + 30 candidate runs;
- normal production Road, Auto Training, hordes, and catacombs;
- zero simulation errors.

Do not run a diagnostic, sweep, third value, or confirmation batch.

# Required Results

Report, by profile and return zone:

- training triggers, episodes, completed returns, quick retriggers, cancellations, hours, and fights;
- losses and elapsed time from return until the next trigger;
- ordinary defeats, rewalk time, and non-training time;
- level and power at Grave Knight and Hollow King arrival;
- boss reach, clear, first-try, attempts, loss streak, and stall;
- median/P90 zone clear times;
- zones cleared at 24h, 36h, and 48h;
- total defeats, hordes, catacombs, and simulation errors.

Audit that all rows through Amberfall are identical and that every locked boss value is identical between arms.

# Good-Enough Decision Rules

Lock the late-only threshold 5 directly if the evidence shows:

- a material reduction in late-Road training episodes or hours across the profiles that encounter it;
- no profile loses median zones cleared at 24h, 36h, or 48h;
- saved training time is not replaced by a larger ordinary-defeat, rewalk, or boss-stall cost;
- Grave Knight/Hollow King arrival level and power do not materially worsen;
- no severe regression in boss experience, total defeats, hordes, catacombs, telemetry, or simulation stability.

A result does not need to hit every secondary percentage perfectly. Judge the primary player-facing outcome and paired causal pattern.

If the candidate is mixed, marginal, or converts training time into fighting the same wall, reject it and keep threshold 4. Do not request more Auto Training work.

After Pass 20, move to broad Shatter/Hollow King progression triage using existing and newly produced whole-Road telemetry. Do not resume boss-by-boss ATK polishing.

# Locked Systems

Keep locked:

- Warlord ATK x1.2;
- Sand Tyrant ATK x1.1;
- Hunter King ATK x1.0;
- Grave Knight ATK x2.0;
- Hollow King and the Shatter wall;
- all boss HP, DEF, speed, charge/volley, summon, add, enrage, ward, raise, and other mechanics;
- ordinary enemies and global enemy curves;
- AUTO_REACT = false;
- Auto Training target = 1.0 and every Auto Training rule except the single simulator-only late-Road threshold override;
- all previously locked progression, economy, tap, Renown, rarity, promotion, travel, recovery, and UI systems.

# What Not To Do

- Do not implement target 0.5.
- Do not add profile-specific Auto Training balance.
- Do not test another target value.
- Do not run more than the one authorized batch.
- Do not change Grave Knight or Hollow King.
- Do not revisit earlier maps or bosses.
- Do not tune toward Stress.
