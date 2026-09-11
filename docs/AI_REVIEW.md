STATUS: READY
REVIEW_FOR_PASS: PASS_21_SHATTER_BEHAVIOR_DIAGNOSTIC
REVIEWED_HANDOFF_PASS: PASS_20_LATE_ROAD_TRAINING_TRIGGER_CANDIDATE
REVIEWED_HANDOFF_SHA: 6f3bf2070eae2d81b39dd803afe9750db1c7a55e
BASE_COMMIT: 5deaeb1c84929d1971676eb23146ff7c0fef3b48
CONFIDENCE: HIGH

# Decision

Reject the late-Road danger-threshold candidate.

Keep production Auto Training at:

- target = 1.0 average party level;
- trigger = 4 losses in the rolling 10-fight window.

Auto Training tuning is now closed. Do not test another target, threshold, window, quick-retrigger rule, profile-specific rule, or confirmation batch.

The rejection is decisive:

- casual improved, but idle paid more than the saved training time in ordinary defeats and rewalking;
- idle Ashen Approach defeats rose 69 -> 108 and rewalk time rose 1.28 hours while training fell only 1.04 hours;
- idle Grave Knight clears fell 3/10 -> 1/10 and two paired seeds lost a zone at 48 hours;
- light was marginal rather than a clear systemic gain;
- total defeats rose 7% idle, 11% light, and 20% casual;
- no profile gained median zones cleared at 24, 36, or 48 hours.

This is exactly the mixed, wall-shifting outcome the Pass 20 rules required us to reject. No confirmation is needed.

# Telemetry Assessment

The Pass 20 Auto Training result is valid:

- 60 runs, zero simulation errors;
- threshold 4/5 separation audited at every late trigger;
- the control reproduced Pass 19 run-for-run;
- all rows through Amberfall were identical;
- bosses, hordes, catacombs, and other locked systems were unchanged.

Stop balance interpretation at Ashen Keep/Hollow King, however. The current Road telemetry omits Shatter entirely because the simulator's normal-Road Shatter condition is unreachable under the production setup:

- bot retreat defaults to disabled;
- the bot defines a Road stall as three hours without progress AND an active bot-retreat timer;
- therefore the stall condition cannot become true;
- Shatter remains limited to the Endless branch even though the game exposes it after Ironvein.

This is a simulator-policy bug, not evidence that Shatter, Ashen Keep, or Hollow King needs a balance change. The observed Keep wall is real for the simulated no-Shatter path, but it cannot be used to choose a production balance lever yet.

# Pass 21: One Shatter Behavior Diagnostic

Repair only the simulator's Shatter decision and run one diagnostic batch. Do not change gameplay values.

The repair is a simulator-policy change, not merely observation-only. Implement it only in the bot:

- on the production Road, define stalled as at least three simulated hours without a zone clear;
- do not require the obsolete bot-retreat timer;
- retain the game's own eligibility check;
- retain minimum Shatter gain >= 15;
- retain the existing Endless behavior;
- reset the stall clock after a Shatter so the bot cannot chain immediate Shatters;
- do not add a new retreat, training, boss, or combat rule.

Add telemetry for every Shatter:

- hour and current zone;
- party level and power;
- current zone progress and cleared-zone count;
- projected gain, dust before, and dust after;
- state immediately before the Shatter and on the first return to each late-Road zone.

Run exactly one fresh batch:

- seeds 31-40;
- idle, light, and casual;
- 72 hours;
- 30 total runs;
- production gameplay values;
- normal Auto Training, hordes, and catacombs;
- up to three Shatters;
- zero simulation errors.

There is no candidate balance arm and no separate control rerun. Audit that each run exactly matches its Pass 20 production control up to the first newly triggered Shatter.

# Required Results

Report by profile:

- Shatter count, timing, zone, gain, and dust;
- reason each Shatter fired and hours since the prior zone clear;
- zones cleared at 24h, 36h, 48h, and 72h;
- Ashen Keep entry/re-entry level and power before and after each Shatter;
- ordinary Keep defeats, loss rate, hours, and rewalk time before and after the first Shatter;
- Hollow King reach, attempts, first-try, losses, boss HP remaining, summons reached, clears, and stall;
- the same late-Road summary for Ashen Approach so we can detect regressions;
- total defeats, training hours, hordes, catacombs, and errors;
- evidence that no immediate Shatter loop occurred.

# Diagnostic Decision Rules

This pass answers one question only:

> Does the existing Shatter system, when the simulator actually uses it, turn Ashen Keep/Hollow King into a meaningfully contestable second-day progression wall?

Treat the answer as good enough when the player-facing pattern is clear; do not chase an exact ideal percentage.

- If Shatters occur and materially improve Keep/Hollow progression without a severe earlier-Road regression, use the result to choose at most one bounded Shatter/Keep candidate next.
- If Shatters occur but the wall remains essentially uncontested, identify whether the remaining mechanism is ordinary Keep damage, post-Shatter recovery/progression, or Hollow King combat. Propose one systemic experiment; do not change a value yet.
- If eligible three-hour stalls still do not produce Shatters, stop interpretation and report the simulator defect. Do not compensate with balance changes.

After this diagnostic, do not repeat it. The next pass must either authorize one candidate or close the Shatter wall as good enough and move forward.

# Locked Systems

Keep locked:

- Warlord ATK x1.2;
- Sand Tyrant ATK x1.1;
- Hunter King ATK x1.0;
- Grave Knight ATK x2.0;
- Hollow King and all Shatter gameplay values;
- all boss HP, DEF, speed, charge/volley, summon, add, enrage, ward, raise, and other mechanics;
- ordinary enemies and global enemy curves;
- AUTO_REACT = false;
- every Auto Training value and rule;
- all previously locked progression, economy, tap, Renown, rarity, promotion, travel, recovery, and UI systems.

# What Not To Do

- Do not implement threshold 5.
- Do not reopen Auto Training.
- Do not change Hollow King.
- Do not change Shatter values.
- Do not run another boss-ATK test.
- Do not tune Ashen Approach again.
- Do not add a candidate arm to Pass 21.
- Do not tune toward Stress.
