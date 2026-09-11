STATUS: READY
REVIEW_FOR_PASS: PASS_27_POST_KEEP_PROGRESSION_DIAGNOSTIC
REVIEWED_HANDOFF_PASS: PASS_26_SHATTER_ENEMY_SCALING_VALIDATION
REVIEWED_HANDOFF_SHA: 614b659040e369c0d3c4142c085831dbe4e6f37c
BASE_COMMIT: 91c4dc438effdd6e6c7f779584178313aee0fd5b
CONFIDENCE: HIGH

# Decision

Lock the production post-Shatter enemy HP/ATK multiplier at `1.10`. Keep the post-Shatter DEF multiplier at `1.10`.

Pass 26 is valid and reproduces the player-facing Pass 25 result on fresh seeds:

- all 80 runs completed the authorized horizon with zero errors;
- all 40 paired audits matched exactly through the first Shatter, and run 0 was identical;
- ordinary Ashen Keep loss rates fell by 8-12 points across all four profiles;
- fight 36 reach improved from 1/10, 0/10, 8/10, and 10/10 to 7/10, 9/10, 10/10, and 10/10 for idle, light, casual, and engaged;
- Keep clears improved from 0/10, 0/10, 0/10, and 2/10 to 1/10, 4/10, 8/10, and 10/10;
- active Hollow King fights became credible contests rather than immediate wipes;
- idle advanced materially through the Keep even though Hollow King remained a severe Auto-Cast wall;
- earlier replay bosses retained meaningful resistance for idle and light;
- Foundry still required 12-15 hours and 95 Core attempts for 10 wins, so the downstream zone was not trivialized;
- no broad early-Road regression appeared.

The global scaling lever is now closed. Do not test another factor, add another confirmation arm, or use the local Hollow King result to weaken global scaling further.

Ashen Keep is good enough for the active profiles and this map-level scaling cycle is complete. This is not whole-game completion. The next work moves to the newly exposed post-Keep progression landscape: Hollow King for idle play, the Foundry/Core transition, and the Endless Road economy.

# Evidence Weighed

The candidate produced the intended cross-map improvement without erasing all friction. Hollow King candidate results were 1/178 Auto-Cast for idle, 1/36 Auto-Cast plus 3/29 active for light, 8/103 active for casual, and 10/144 active for engaged. Casual's run-2 Grave Knight row at 7/7 active is soft, but it is a seven-attempt local row, while Auto-Cast replay bosses remain resistant and the player-facing Road outcomes are healthy. Record it as a watch item; do not reopen Grave Knight tuning.

Engaged players entered Endless Road in 9/10 runs at 65-71 hours and showed large late gold, ore, and level gains. The evidence does not show that `1.10` caused an economy defect: the factor exposed a new zone, while Foundry itself remained a 12-15-hour contest. Endless exposure lasted only 1-7 hours, so its sustained economy is not yet measured. This is the next largest unknown and should be diagnosed rather than inferred from cumulative 72-hour totals.

One reporting correction does not invalidate the batch: the detailed rows include a few minimum re-clear intervals of five zones, despite the summary saying every interval was six or more. Together with 6-15-hour gaps and mostly six or seven zones re-cleared, the raw evidence still rules out rapid Shatter churn. Use the raw rows in future summaries.

# Pass 27: Post-Keep Progression Diagnostic

Run one production-only, broad telemetry diagnostic. Make no gameplay or balance change.

Configuration:

- production build `20260911-163721` with HP/ATK factor `1.10` and DEF factor `1.10`;
- seeds 51-60;
- idle, light, casual, and engaged profiles;
- 96 simulated hours;
- 40 runs total;
- `--stallRule far --stallHours 3`;
- `--shatters 3` as a cap, with no early stop;
- Pass 22 dust policy;
- literal Pass 24 ascension policy;
- Ashen Keep level `50`;
- no control arm, no balance override, and zero simulation errors.

This is a new whole-road diagnostic, not another validation of `1.10`. Do not compare or retest `1.25`.

Instrumentation-only simulator/report changes are allowed if needed to attribute resources and time to a zone. Production source and bundle must remain unchanged.

# Diagnostic Questions

Use the 96-hour horizon to answer one question: after the locked scaling change, which mechanism is now the largest repeated player-facing progression bottleneck across profiles?

Rank these with evidence:

1. Hollow King Auto-Cast survival for idle and light;
2. Foundry ordinary progression and Foundry Core;
3. Endless Road difficulty, pacing, and economy.

For Hollow King, report attempts and wins by run and activity window, loss duration, boss HP remaining, summon thresholds reached, party deaths, and the damage source or phase that ends the attempt. Separate opening boss hits from first-wave skeletons and second-wave armored skeletons. Do not propose an Auto-Cast reaction rule; that systemic avenue is already closed.

For Foundry, report entry and clear time, ordinary encounters/losses, furthest fight, Core attempts/wins, loss duration, Core HP remaining, summon reaches, party level/power on entry and clear, and hours stalled there. Distinguish lack of exposure from inability to progress.

For Endless Road, report by hour since entry rather than only by absolute simulation hour:

- wave reached and wins per hour;
- enemy level and player party level/power;
- gold, ore, and XP earned per hour;
- gold and ore spent per hour and the systems receiving those spends;
- item ranks and upgrade progression;
- deaths, recovery/training time, and any stable stall or acceleration pattern;
- cumulative resources carried into Endless versus resources earned inside it.

Audit the production formulas that determine Endless enemy level, rewards, encounter cadence, and segment rotation. State whether the observed economy comes from intended Endless rewards, faster encounter throughput, inherited resources, upgrade feedback, or a telemetry/accounting artifact.

# Decision Rule for the Next Review

Do not tune anything in Pass 27. Return one ranked bottleneck with a causal mechanism and at most one bounded candidate proposal.

Prefer the bottleneck that creates the largest repeated delay or non-interactive failure state across the measured profiles. Do not rank a system first merely because it has the largest cumulative currency number. If Endless gains remain high after normalizing by time in-zone and they create accelerating power without meaningful resistance, rank Endless first. If gains are exposure-driven and progression stabilizes, treat them as expected and rank the repeated Hollow King or Foundry stall instead.

One diagnostic pass is enough. Do not add more seeds, a second horizon, a control arm, a candidate arm, or a confirmation batch before review.

# Locked Systems

Keep locked:

- post-Shatter enemy HP/ATK multiplier `1.10`;
- post-Shatter enemy DEF multiplier `1.10`;
- Ashen Keep base level `50`, enemy pool, fight count, and reward formulas;
- Hollow King HP, ATK, DEF, speed, summons, drain, and mechanics;
- Foundry/Core and Endless Road stats, levels, rewards, pacing, and mechanics;
- every Shatter availability, gain, blessing cost/effect, dust priority, and far-mark stall rule;
- production gear ranks, item stats, ascension costs/caps, drop ranks, ore economy, and upgrade formulas;
- Auto Training target `1.0`, threshold `4`, and all Auto Training behavior;
- Warlord ATK x1.2, Sand Tyrant ATK x1.1, Hunter King ATK x1.0, and Grave Knight ATK x2.0;
- all ordinary enemy base stats, boss base stats, zone levels, global level curves, progression, economy, tap, Renown, rarity, promotion, travel, recovery, UI, and save-format systems;
- `AUTO_REACT = false`.

# What Not To Do

- Do not reopen or validate the post-Shatter scaling factor.
- Do not tune Hollow King, Foundry Core, Endless Road, Grave Knight, or any other boss in this pass.
- Do not change Auto-Cast, Auto Training, Shatter, dust, gear, ascension, or economy behavior.
- Do not use cumulative 72/96-hour currency alone as evidence of a runaway economy.
- Do not describe Ashen Keep completion as whole-game completion.
- Do not merge or ship before the next review.
