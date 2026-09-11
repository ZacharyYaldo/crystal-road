STATUS: READY
REVIEW_FOR_PASS: PASS_22_SHATTER_DUST_POLICY_DIAGNOSTIC
REVIEWED_HANDOFF_PASS: PASS_21_SHATTER_BEHAVIOR_DIAGNOSTIC
REVIEWED_HANDOFF_SHA: 90be24734459c768d590e92b35da4ec913ef4d42
BASE_COMMIT: f466b7d8d0334fbc07ba9be0166ca2dcec992a3b
CONFIDENCE: HIGH

# Decision

The Pass 21 diagnostic is valid for the bot policy it actually ran:

- all 30 runs passed their pre-Shatter deterministic audit;
- 90 Shatters fired at real stalls without an artificial loop;
- zero runs cleared Ashen Keep by 72 hours;
- Hollow King went 0/6;
- Shattered parties returned to late zones 10-25 levels below their no-Shatter arrivals.

Do not interpret that as a final verdict on the game's Shatter system. The bot ended with 37-51 dust unspent and did not buy the combat/start blessings Shatter is intended to fund. That materially affects replay speed, arrival level, and survivability.

This is a simulator-policy defect that qualifies for the pacing policy's invalid-telemetry exception. Authorize one corrected rerun. It is the final Shatter diagnostic.

# Pass 22: Corrected Shatter Dust Policy

Change only the simulator bot's post-Shatter dust spending.

Immediately after every Shatter and before the next combat, spend dust through this deterministic priority:

1. `b_start` — Remembered Strength;
2. `b_hp` — Crystal Vigor;
3. `b_dmg` — Sharpened Fate.

Use repeated priority passes:

- buy the highest-priority affordable next rank;
- restart at `b_start` after each purchase;
- if `b_start` is unaffordable, try `b_hp`, then `b_dmg`;
- stop only when none of the three next ranks is affordable;
- leave dust unspent only when it is below every available next cost.

Do not buy another dust blessing, change a blessing cost/effect, or optimize a different priority. Record every purchase, cost, resulting rank, dust remaining, and resulting starting level/party power.

This models a simple progression-focused player policy; it is not asserted to be uniquely optimal.

# Authorized Batch

Run one corrected batch only:

- seeds 31-40;
- idle, light, and casual;
- 72 hours;
- 30 total runs;
- `--stallRule far`;
- `--stallHours 3`;
- up to three Shatters;
- production gameplay values;
- normal Auto Training, hordes, and catacombs;
- zero simulation errors.

Use the existing Pass 21 results as the comparison arm. Do not rerun the under-spending policy.

Audit that every corrected run exactly matches its Pass 21 run through the first Shatter and differs only after the first authorized dust purchases.

# Required Comparison

Report paired deltas against Pass 21 by profile and seed:

- dust earned, spent, and remaining after each Shatter;
- `b_start`, `b_hp`, and `b_dmg` ranks bought per run;
- starting level and party power after each Shatter;
- time to re-clear Ironvein and return to the zone left;
- Ashen Approach and Ashen Keep entry/re-entry level and power;
- current-run and best-run zones cleared at 24h, 36h, 48h, and 72h;
- Keep ordinary wins/losses, hours, loss rate, and rewalk time;
- Hollow King reach, attempts, losses, HP remaining, summons reached, clears, and stall;
- total defeats, training hours, hordes, catacombs, and errors;
- Shatter timing and no-loop evidence.

# Good-Enough Decision Rules

After Pass 22, no further Shatter-policy diagnostic is allowed.

- If competent dust spending makes Ashen Keep/Hollow King meaningfully contestable or produces clear whole-Road progression gains, treat the current Shatter system as good enough, lock it, and move forward.
- If it improves replay strength but still leaves the wall essentially uncontested, identify one dominant production lever and propose one bounded candidate test.
- If results are mixed, prefer the primary player-facing outcomes and paired causal pattern; do not request another policy, priority, duration, or confirmation batch.

Do not demand a perfect Keep clear rate. The goal is a credible progression path, not an exact simulator optimum.

# Locked Systems

Keep locked:

- every Shatter gameplay value, blessing cost, and blessing effect;
- Hollow King;
- Auto Training target 1.0, threshold 4, and every other Auto Training rule;
- Warlord ATK x1.2;
- Sand Tyrant ATK x1.1;
- Hunter King ATK x1.0;
- Grave Knight ATK x2.0;
- all boss HP, DEF, speed, charge/volley, summon, add, enrage, ward, raise, and other mechanics;
- ordinary enemies and global enemy curves;
- AUTO_REACT = false;
- all previously locked progression, economy, tap, Renown, rarity, promotion, travel, recovery, and UI systems.

# What Not To Do

- Do not modify gameplay code.
- Do not change Shatter timing or stall detection.
- Do not test multiple dust priorities.
- Do not rerun Pass 21's under-spending arm.
- Do not add a balance candidate.
- Do not reopen Auto Training or boss-ATK tuning.
- Do not tune toward Stress.
