STATUS: READY
REVIEW_FOR_PASS: PASS_21_SHATTER_BEHAVIOR_DIAGNOSTIC
REVIEWED_HANDOFF_PASS: PASS_21_SHATTER_BEHAVIOR_DIAGNOSTIC
REVIEWED_HANDOFF_SHA: 924850c9de1aa44b8f1d3ac01f84fcf9e9623a1b
BASE_COMMIT: 333111b3e6ff90dd974003146ae1fe3d61586945
CONFIDENCE: HIGH

# Counterproposal Decision

Accept the developer's counterproposal.

Supersede the earlier literal rule "three hours without a zone clear." Use the furthest-fight rule for the single authorized Pass 21 diagnostic.

The smoke evidence is decisive for rule selection:

- normal late zones routinely take more than three hours to clear;
- the literal clear-clock rule fires during healthy Emberwaste progression;
- it spends all three Shatters before the party reaches the intended Keep wall;
- a new furthest-fight mark distinguishes slow forward progress from an actual stall;
- under the proposed rule, smoke Shatters occur at boss/training walls and inside Ashen Keep rather than mid-zone.

The smoke runs authorize the diagnostic rule only. They are not balance evidence and do not replace the full batch.

# Simulator Repair Assessment

The following simulator-only changes are accepted:

- default Shatter stall rule = no zone clear and no new furthest-fight mark for three simulated hours;
- no dependency on the obsolete bot-retreat timer;
- reset the clear counter, furthest-fight marks, and stall clock after each Shatter;
- retain game eligibility, projected gain >= 15, and existing Endless behavior;
- record per-run zone entries/clears and tag boss attempts by Shatter run;
- record the requested before/after Shatter state.

The reset repair is necessary. Without it, re-clears after a Shatter do not register as progress and create artificial three-hour Shatter chains.

Keep the literal clear-clock implementation available for debugging only. Do not use it for the authorized batch.

# Pass 21 Authorized Diagnostic

Run exactly one fresh batch with:

- `--stallRule far`;
- `--stallHours 3`;
- seeds 31-40;
- idle, light, and casual;
- 72 hours;
- 30 total runs;
- production gameplay values;
- normal Auto Training, hordes, and catacombs;
- up to three Shatters;
- zero simulation errors.

Do not add a balance candidate, alternative stall duration, alternative trigger, extra seeds, or confirmation batch.

Audit each run against its Pass 20 production control up to the exact first Shatter. Before that event, gameplay state and hourly telemetry must be deterministic matches.

# Required Results

Report by profile and by Shatter run:

- Shatter count, timing, zone, progress, projected gain, and dust;
- reason and exact hours since the last zone clear or furthest-fight advance;
- the last furthest-fight mark before each Shatter;
- time required to re-clear Ironvein and return to the zone left;
- zones cleared at 24h, 36h, 48h, and 72h;
- Ashen Approach and Ashen Keep entry/re-entry level and power;
- ordinary Keep wins/losses, hours, rewalk time, and loss rate before and after the first Shatter;
- Hollow King reach, attempts, loss duration, HP remaining, summons reached, clears, and stall;
- total defeats, training hours, hordes, catacombs, and errors;
- evidence that no Shatter fired while the party had advanced its furthest mark during the prior three hours;
- evidence that no immediate or periodic artificial Shatter loop occurred.

# Interpretation Rules

This diagnostic asks whether the existing Shatter system makes the Keep/Hollow King meaningfully contestable on the second day.

A Shatter is not automatically beneficial merely because it fires. Include the replay cost and the party's level/power when it returns.

- If existing Shatters materially improve Keep/Hollow progression, use the result to propose at most one bounded systemic candidate.
- If existing Shatters leave the wall uncontested, identify whether the main cause is ordinary Keep damage, post-Shatter recovery/progression, or Hollow King combat. Propose one experiment only.
- If the new rule still fires during genuine forward progress or fails during eligible stalls, stop interpretation and report the simulator defect.

Do not repeat this diagnostic. After it, authorize one candidate or close the Shatter wall as good enough and move forward.

# Locked Systems

Keep locked:

- Auto Training target 1.0, threshold 4, and every other Auto Training rule;
- Warlord ATK x1.2;
- Sand Tyrant ATK x1.1;
- Hunter King ATK x1.0;
- Grave Knight ATK x2.0;
- Hollow King and all Shatter gameplay values;
- all boss HP, DEF, speed, charge/volley, summon, add, enrage, ward, raise, and other mechanics;
- ordinary enemies and global enemy curves;
- AUTO_REACT = false;
- all previously locked progression, economy, tap, Renown, rarity, promotion, travel, recovery, and UI systems.

# What Not To Do

- Do not use `--stallRule clear` for the batch.
- Do not change `--stallHours 3`.
- Do not reopen Auto Training.
- Do not change Hollow King or Shatter values.
- Do not run another boss-ATK test.
- Do not add a candidate arm.
- Do not tune toward Stress.
