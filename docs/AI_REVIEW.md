STATUS: READY
REVIEW_FOR_PASS: PASS_31_ENDLESS_GOLD_EXPONENT_CANDIDATE
REVIEWED_HANDOFF_PASS: PASS_30_FOUNDRY_CORE_VOLLEY_CANDIDATE
REVIEWED_HANDOFF_SHA: 87d15a4c4132f2b8382e6eca1f7c1cab4ab56647
BASE_COMMIT: 8222960c9eed6f6694cd14e158d64a4da2b777c6
CONFIDENCE: HIGH

# Decision

Lock the coupled Foundry Core package:

- Foundry Core base ATK: 2.2 -> 1.5.
- Foundry Core unreacted ranged-volley multiplier: 2.2 -> 0.9.
- The parried ranged-volley multiplier remains 0.9.
- Every non-Core ranged charge remains at the global unreacted multiplier 2.2.

Pass 30 is valid and materially meets the player-facing goal. Idle Core clears rose from 2/10 to 9/10, median attempts fell from 75 to 13, median cleared-run stall fell from 13.4h to 6.1h, and median Foundry time fell from 15.2h to 7.4h. The volley changed from a full-health one-shot to a heavy hit: candidate median damage was 53% of target max HP, 39% against the front hero, with no idle hit at or above 100%. Light, casual, and engaged attempt win rates remained below 90%, the fight continued to reach charge and summon phases, and earlier Road progression was unchanged in all 40 audits.

The weak secondary result does not justify another Core pass. Idle volley kills per attempt fell only 3.50 -> 3.29 because surviving parties encountered about twice as many volley hits; kills per hit fell much more clearly, 0.81 -> 0.37. Casual first-attempt clears reached exactly 5/10, the allowed boundary, but its 59% attempt win rate and continued losses do not establish an automatic fight. Record both as watch items. Do not run another Core candidate or confirmation batch.

The Core-specific 0.9 unreacted value means a successful parry does not further reduce this Core's volley damage; active advantage still exists through interrupts, timing, abilities, and recovery. This is acceptable for this local exception because the global parry rule and all other enemies remain unchanged, and the measured Core encounter remains interactive.

Pass 30 completes Foundry tuning for this cycle. Move now to the diagnosed Endless Road economy acceleration.

# Production Lock Implementation

Implement the accepted Core package in production source, then rebuild the bundle:

- set ENEMIES.core.atk to 1.5;
- add a per-enemy ranged-charge multiplier field to the Core entry with value 0.9;
- in the unreacted ranged-charge path, read that field when present and otherwise fall back to 2.2;
- keep the existing parried value at 0.9;
- do not use an enemy-name string check in production;
- do not alter charge cadence, target count, HP, DEF, speed, shield, summons, rewards, AUTO_REACT, or any non-Core charge.

The Pass 31 whole-run audit below is the production-lock reproduction check. Do not add a separate full confirmation batch.

# Endless Diagnosis

The existing broad telemetry is sufficient diagnosis: over roughly 24 hours in Endless, time-normalized gold per kill rose about 16x, party power rose about 8x, and deaths per hour stayed roughly flat. Source inspection identifies the primary local lever: kill gold uses 1.05^enemy level while Endless enemy level rises with progress, then the result is compounded by Shatter, Renown, and Omen multipliers. This can create a self-reinforcing gold-to-power loop even when combat pressure is not increasing meaningfully.

Do not run another diagnostic pass. Test one local candidate against this mechanism.

# Pass 31 Candidate

After applying the production Core lock, test one simulator-only Endless reward candidate:

- Endless Road kill-gold level exponent: 1.05 -> 1.04.
- All pre-Endless kill gold retains 1.05.
- XP remains 1.04.
- Ore scaling remains 1.035.
- Renown gain/stat/gold formulas, Omens, Shatter multipliers, enemy scaling, Endless level slope, encounter composition, milestones, champions, drops, and all costs remain unchanged.
- Production Endless reward code remains unchanged during the candidate.

Use the completed Pass 30 batch as the fixed baseline. Do not rerun its 40 control runs.

Run one candidate batch:

- seeds 51-60;
- idle, light, casual, and engaged profiles;
- 96 simulated hours;
- 40 candidate runs total;
- production Core ATK 1.5 and Core-only unreacted volley multiplier 0.9;
- Hollow King ATK 1.3;
- post-Shatter HP/ATK and DEF factors 1.10;
- far-mark stall rule at 3 hours;
- three Shatters as a cap with no early stop;
- Pass 22 dust policy and literal Pass 24 ascension policy;
- Ashen Keep level 50;
- zero simulation errors.

This is the first and only Endless gold-exponent candidate after diagnosis. Do not test another exponent or another economy lever in Pass 31.

# Validity Gate

Before interpreting balance, demonstrate:

- all 40 runs reach 96 simulated hours within one simulation step;
- no run exceeds three Shatters or stops merely because it reaches three;
- source and rebuilt bundle contain the accepted Core production implementation;
- Core behavior reproduces the Pass 30 candidate through Foundry exit, including ATK, volley multiplier, attempts, wins, fight phases, clear time, and all earlier hourly state;
- every paired run is identical through Endless entry and through the state immediately before its first Endless kill reward;
- the first permitted candidate divergence is Endless kill gold computed with exponent 1.04 instead of 1.05;
- pre-Endless gold rewards and every non-gold reward are identical;
- no non-Core charge behavior changes;
- runs that do not reach Endless remain fully identical to baseline.

If any gate fails, stop balance interpretation and report the defect. Do not run a replacement batch without review.

# Required Evidence

Report paired candidate-versus-Pass-30 results by profile and seed for:

- Endless entry hour, party level/power, gold balance and relevant tree ranks at entry;
- hours in Endless, best wave, wins, losses, deaths, fights per hour, and milestone/champion reach;
- gold earned, gold spent, ending balance, purchases, and party power;
- XP, party level, ore, gear upgrades, Renown, Omens, and Shatter count;
- current/best zone and power at 24, 48, 72, and 96 hours;
- Core attempts, clears, and Foundry exit as the production-lock reproduction audit;
- paired outliers and any profile that fails to reach Endless.

For runs with at least 12 hours in Endless, split telemetry into time-since-entry windows 0-6h, 6-12h, 12-18h, and 18-24h where available. For each window report gold per kill, gold per hour, kills/fights/deaths per hour, party power, level, best-wave gain, purchases, Renown, and active Omens. Compare late-versus-early growth within each arm and paired between arms. Do not compare raw totals without normalizing for time in Endless.

# Candidate Rule

Treat the Endless 1.04 candidate as promising only if the outcomes hold together:

- late-versus-early gold-per-kill and gold-per-hour acceleration is materially reduced, with the roughly 24-hour growth ratio cut by about half where that exposure exists;
- party-power acceleration is also materially reduced rather than gold merely accumulating unspent;
- Endless still feels progressively rewarding: gold per kill and purchasing power continue to rise, purchases continue across windows, and progression does not flatten into a static grind;
- median best wave, wins, and fights per hour do not fall by more than about 20% versus baseline for profiles with comparable Endless exposure;
- losses and meaningful failure states remain present rather than disappearing or exploding;
- XP, ore, Renown, Omens, and pre-Endless progression show no unintended regression.

Do not chase an exact secondary percentage. Decide from the player-facing progression curve, purchasing cadence, power growth, failure states, and causal telemetry together.

Pass 31 is the one adequately sized candidate test. If it is materially promising and release confidence genuinely requires it, the next review may authorize one final validation. Otherwise lock or reject it and move to the next largest cross-map bottleneck.

# Locked Systems

Keep locked:

- Hollow King ATK 1.3 and all other Hollow King fields;
- Foundry Core ATK 1.5 and Core-only unreacted ranged-volley multiplier 0.9;
- Foundry Core HP, DEF, speed, charge cadence, target count, shield, summons, rewards, and all other mechanics;
- global unreacted/parried charge multipliers 2.2/0.9 and AUTO_REACT false;
- ordinary Foundry enemies, level, fight count, and rewards;
- Endless enemy scaling, level slope, encounter pools, milestones, champions, Renown, Omens, XP, ore, gear, costs, and all rewards except the simulator-only kill-gold exponent candidate;
- post-Shatter enemy HP/ATK and DEF multipliers 1.10;
- Ashen Keep level 50 and all Shatter/dust/stall rules;
- Auto Training target 1.0, threshold 4, and behavior;
- all previously locked boss values and every unrelated progression, economy, tap, rarity, promotion, travel, recovery, UI, and save-format system.

# What Not To Do

- Do not run another Core test or confirmation.
- Do not change a second Endless lever.
- Do not change production Endless rewards during Pass 31.
- Do not rerun the Pass 30 baseline.
- Do not add seeds, profiles, hours, stress profiles, or control arms.
- Do not tune Renown, Omens, XP, ore, enemy scaling, level slope, costs, or encounter pacing.
- Do not merge or ship before review.
