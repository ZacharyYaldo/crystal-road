STATUS: READY
REVIEW_FOR_PASS: PASS_24_VALID_SHATTER_BASELINE
REVIEWED_HANDOFF_PASS: PASS_23_ASHEN_KEEP_LEVEL_CANDIDATE
REVIEWED_HANDOFF_SHA: cad85b7983547dac936d5ad7d2a5c8e43e44332d
BASE_COMMIT: 5657d9357f5e6ef3e28d39d6500f28f98211ca7f
CONFIDENCE: HIGH

# Decision

Reject the Ashen Keep level `50 -> 46` candidate and keep the production level at `50`.

The candidate moved the wall deeper into the zone but did not solve it: fight 36 reach increased from 2 to 12 runs and Hollow King attempts from 4 to 34, yet the boss remained 0/34 with 70-96% HP left at defeat in most attempts, only two summon reaches, no Keep clears, and no Foundry entries. Ordinary loss rates improved only slightly, while gold and ore generally fell because the lower enemy level reduced rewards. No second Keep-level value or confirmation run is authorized.

Accept the developer's telemetry correction. Passes 21-23 did not produce a valid 72-hour post-Shatter baseline: `--shatters 3` ended runs at the third Shatter, and the bot applied the production enemy scaling while never using the production gear-ascension counterweight. The pre-termination measurements and the paired Pass 23 rejection remain useful, but their claimed 72-hour state and the unobserved run-3 replay must not be used to size gameplay.

This is the mechanical-invalidity exception to the normal pass cap. Authorize exactly one simulator repair and one baseline batch, with no gameplay candidate.

# Accepted Horizon Correction

Keep the Pass 23 simulator-only correction:

- `--shatters N` is a cap on Shatters and does not end the run;
- `--stopAtShatters N` retains the old explicit early-stop behavior;
- the Pass 24 batch must not use `--stopAtShatters`;
- every run must continue to the requested 72-hour horizon even after its third Shatter.

This changes simulator control flow only. Do not change Shatter availability, gain, stall detection, dust spending, enemy scaling, or any production rule.

# Pass 24: Valid Shatter Baseline

Implement one deterministic bot-only gear-ascension policy using the production `ascendItem`, `ascendCost`, and `ascendCap` paths. Do not mutate item rank or ore directly.

At each normal gear-management decision after a Shatter:

1. consider only items currently equipped by the active party;
2. order heroes by active-party slot and items by `weapon`, `cape`, then `charm`;
3. ascend each eligible item toward the current production cap while its production cost is affordable;
4. record each ascension with hour, run/Shatter number, hero, slot, item id, old rank, new rank, item level, cost, and ore before/after;
5. only after no ordered eligible ascension can be bought, run the existing item-level upgrade policy.

The policy is intentionally fixed, legible, and bounded. Do not search ascension priorities, reserve percentages, item-level tradeoffs, or alternative gear strategies.

# Authorized Batch

Run one baseline batch only:

- seeds 31-40;
- idle, light, and casual;
- 72 hours;
- 30 runs total;
- production Ashen Keep level `50` and all other production gameplay values;
- `--stallRule far --stallHours 3`;
- `--shatters 3` as a cap;
- the accepted Pass 22 dust policy;
- the new fixed ascension policy;
- zero simulation errors.

Do not rerun Pass 22 or Pass 23 and do not add a no-ascension arm. Prior runs may be used only for the pre-first-ascension audit and clearly labeled historical context.

# Required Validity Checks

Before interpreting balance, demonstrate:

- all 30 runs report 72 simulated hours within one simulation step;
- no run performs more than three Shatters and none stops merely because it reaches three;
- the bot's state matches its paired Pass 22 seed/profile through the instant before the first ascension, including hourly state, first Shatter timing and location, dust purchases, zone state, party state, inventory/equipment, gold, ore, and RNG-sensitive outcomes;
- every logged ascension was legal under the production cap, used the production cost, spent the recorded ore, and increased exactly one equipped item's rank by one;
- no production source or bundle changed.

If any check fails, stop balance interpretation, report the defect, and do not run a replacement batch without a new review.

# Required Evidence

Report compact per-seed rows and profile summaries for:

- Shatter count, timing, location, gain, and replay progression by run, including the previously unobserved run after the third Shatter;
- ascension count, timing, cost, hero/slot, item rank, and item level;
- equipped ranks and levels plus remaining ore at each Ashen Keep entry;
- Ashen Keep entry hour, run, party level, power, ordinary encounters, losses, loss rate, time, furthest fight, and rewalk time;
- fight-36 reach, Hollow King attempts/wins, loss duration, HP remaining, summon reaches, boss level/ATK, and hits-to-defeat at arrival;
- Keep clears and Foundry entries with hour, run, level, and power;
- current-run and best-run progression at 24h, 36h, 48h, 60h, and 72h;
- total defeats, training hours, XP, gold, ore earned/spent, gear progression, and final state.

Separate absolute 72-hour results from any historical comparison. Do not treat truncated Pass 21-23 endpoints as 72-hour controls.

# Good-Enough Decision Rule

Pass 24 is complete when it establishes one valid production-value baseline. Do not run another baseline, sizing arm, or confirmation.

- If parties now traverse ordinary Ashen Keep and produce credible Hollow King contests or clears, lock current Keep and Shatter values and move to Foundry/Endless triage.
- If fight 36 is repeatedly reached but Hollow King still causes immediate, high-HP wipes, the next review may authorize one direct Hollow King lever with no sizing phase.
- If ordinary Keep progression remains the dominant wall, the next review will choose one bounded local mechanism from this valid evidence; do not propose another zone-level value.

# Locked Systems

Keep locked:

- Ashen Keep base level `50`, enemy pool, fight count, and reward formulas;
- Hollow King HP, ATK, DEF, speed, summons, drain, and mechanics;
- every Shatter gameplay value, blessing cost/effect, far-mark stall rule, dust priority, and enemy scaling rule;
- production gear ranks, item stats, ascend costs/caps, drop ranks, ore economy, and upgrade formulas;
- Auto Training target `1.0`, threshold `4`, and all Auto Training behavior;
- Warlord ATK x1.2, Sand Tyrant ATK x1.1, Hunter King ATK x1.0, and Grave Knight ATK x2.0;
- all other boss, ordinary-enemy, global curve, progression, economy, tap, Renown, rarity, promotion, travel, recovery, UI, and save-format systems;
- `AUTO_REACT = false`.

# What Not To Do

- Do not modify production gameplay code or the production bundle.
- Do not retest Ashen Keep level `46` or any other zone level.
- Do not change Hollow King or ordinary Keep enemies in Pass 24.
- Do not tune or compare ascension policies.
- Do not add profiles, seeds, hours, candidate arms, or a confirmation batch.
- Do not interpret balance if horizon or ascension telemetry is invalid.
- Do not describe this corrected baseline as whole-game completion.