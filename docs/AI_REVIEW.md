STATUS: READY
REVIEW_FOR_PASS: PASS_19_LATE_ROAD_TRAINING_TARGET_CANDIDATE
REVIEWED_HANDOFF_PASS: PASS_18_GRAVE_KNIGHT_ATK_CANDIDATE
REVIEWED_HANDOFF_SHA: a20b39114d0a310c57915ce8611a813cbf4c009a
BASE_COMMIT: d1efd10d7e8617a3820b6743c6fa7eaacde209d9
CONFIDENCE: HIGH

# Decision

Reject the Grave Knight base-ATK candidate x0.85.

Keep the production Grave Knight value at x2.0. Do not run another Grave Knight sizing, sweep, confirmation, or road-validation pass.

The rejection is decisive:

- idle first-try clears became 7/7 with Auto-Cast 7/7 and no losses;
- light first-try clears became 9/10 with Auto-Cast 3/3;
- the focused harness reached 90% overall clears;
- every winning profile ended at 100% party HP;
- charge lethality collapsed from 0.87 kills per hit to 0.14 in the harness;
- the candidate converted a real wall into a largely automatic fight.

The x2.0 control remains imperfect, especially for idle Auto-Cast and casual stalls, but the pacing policy requires moving on. Record that uncertainty; do not chase an unknown perfect midpoint. Boss-by-boss ATK tuning is now closed.

# Telemetry Assessment

The 60-run paired road result is valid:

- zero simulation errors;
- exact candidate/control ATK separation;
- all upstream rows identical;
- fixed-horizon progression did not regress;
- the focused harness independently reproduced the endpoint behavior.

The Ashen Approach/Ashen Keep snapshot-prefix collision did not invalidate the road result because the arms used separate snapshot folders and the harness used zone-filtered arrivals. Apply the queued observation-only prefix fix before the next run so future snapshots cannot collide.

# Pass 19: One Systemic Late-Road Training Test

The current production triage shows that late-Road time cost is now dominated by repeated one-level Auto Training retreats rather than boss combat alone. Test one bounded hypothesis:

> Shorter late-Road training bursts will reduce dead time while preserving forward progression; if the party returns too weak, the cost will reappear as retriggers, ordinary defeats, or lost horizon progress.

Test exactly one candidate:

- control: Auto Training target = 1.0 average party level;
- candidate: Auto Training target = 0.5 average party level only when returning from Ashen Approach or any later eligible non-Endless zone;
- implement the candidate as a simulator-only override;
- do not change the trigger window, loss threshold, minimum fights, quick-retrigger rule, Keep Pushing behavior, XP, enemy stats, or boss stats;
- Ashen Keep remains excluded by the existing production rule;
- keep the production target at 1.0 until review.

Use:

- paired seeds 31-40;
- idle, light, and casual;
- 48 hours;
- 30 control + 30 candidate runs;
- the production Road with normal Auto Training, hordes, and catacombs;
- zero simulation errors.

Do not add other target values or a separate diagnostic batch. Use the existing Pass 18 control logs as the baseline diagnosis.

# Required Results

Report by profile and by return zone:

- Auto Training triggers, completed returns, quick retriggers, and cancellations;
- training hours, fights, and average party-level progress per episode;
- first-return versus retrigger counts and hours;
- fights and elapsed time from return until another trigger;
- win rate for the first 10 and 20 fights after return;
- ordinary defeats and rewalk time;
- party level/power entering the zone and at its boss;
- boss reach, clear, first-try, attempts, loss streak, and stall;
- per-zone median/P90 clear times;
- zones cleared at 24h, 36h, and 48h;
- Hollow King reach/attempt/clear counts without changing it;
- total defeats, hordes, catacombs, and simulation errors.

Audit that every row through Amberfall is identical between arms and that Grave Knight remains x2.0 in both.

# Good-Enough Decision Rules

Lock the late-Road 0.5 target directly if:

- late-Road training hours materially decrease for the profiles that encounter it;
- no profile loses median zones cleared at 24h, 36h, or 48h;
- no adequately sampled zone's median clear time worsens more than 10% or P90 more than 15%;
- the saved training time is not merely converted into a severe retrigger loop, ordinary-defeat wall, or rewalk increase;
- total defeats remain within +10%;
- Grave Knight and Hollow King remain mechanically unchanged;
- no material horde, catacomb, telemetry, or simulation regression appears.

Prefer forward progress and reduced dead time over exact secondary thresholds. A moderate increase in retriggers is acceptable if total training time falls and player-facing progression is maintained or improved.

Reject 0.5 if it only fragments the same training cost or makes late-Road progression worse.

Do not add a 0.65, 0.75, or other sizing arm. Do not request another confirmation solely for a narrow small-sample miss. After Pass 19, lock or reject the candidate and move to the next whole-game bottleneck.

# Locked Systems

Keep locked:

- Warlord ATK x1.2;
- Sand Tyrant ATK x1.1;
- Hunter King ATK x1.0;
- Grave Knight production ATK x2.0;
- Hollow King and the Shatter wall;
- all boss HP, DEF, speed, charge/volley, summon, add, enrage, ward, raise, and other mechanics;
- ordinary enemies and global enemy curves;
- AUTO_REACT = false;
- all Auto Training behavior except the single simulator-only late-Road target override;
- all previously locked progression, economy, tap, Renown, rarity, promotion, travel, recovery, and UI systems.

# What Not To Do

- Do not implement Grave Knight x0.85.
- Do not test another Grave Knight value.
- Do not change Hollow King.
- Do not revisit Sand Tyrant, Hunter King, Ironvein, or earlier maps.
- Do not change Auto Training triggers or XP rates.
- Do not tune toward Stress.
