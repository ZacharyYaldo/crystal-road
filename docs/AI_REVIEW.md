STATUS: READY
REVIEW_FOR_PASS: PASS_32_PRODUCTION_RELEASE_VALIDATION
REVIEWED_HANDOFF_PASS: PASS_31_ENDLESS_GOLD_EXPONENT_CANDIDATE
REVIEWED_HANDOFF_SHA: 585fcce0eecb095fa463b35e47d565bd6178a8de
BASE_COMMIT: 93e591bc9df263ed84791edb07f5d158f09dad9e
CONFIDENCE: HIGH

# Decision

Reject the simulator-only Endless kill-gold exponent 1.04 and keep the production exponent at 1.05.

Pass 31 is valid and answers the candidate question. All 40 runs completed 96 simulated hours with zero errors; all 40 paired audits were identical through Endless entry; the two runs that never reached Endless were identical end to end; the first divergence was the first Endless kill reward; and the accepted Foundry Core production package reproduced in 40/40 runs. No telemetry defect blocks interpretation.

The candidate fails the primary causal and player-facing rule. It cuts gold per kill and purchasing cadence by roughly half throughout Endless, but it reduces late-versus-early gold growth only about 20-25% rather than about half. Engaged gold-per-kill growth changed from x5.84 to x4.54, casual from x4.88 to x4.00, and light from x4.88 to x4.30. Party-power growth barely changed: x3.82 to x3.49 engaged, x3.42 to x3.18 casual, and x3.20 to x3.09 light. Kills, waves, and deaths per hour remained close to baseline. The result is substantially poorer rewards with almost the same play curve, not a meaningfully better progression curve.

Source and telemetry agree on the mechanism. Endless enemy level rises by 0.15 per wave, kill XP uses 1.04^level, and party level rises about 32 levels over 24 hours while enemy level rises about 23. The party-level/XP curve is the dominant power engine. The 1.05 gold exponent amplifies visible reward magnitude, but lowering it does not materially control the progression engine. Do not test another gold exponent and do not replace it with a flat gold multiplier in this cycle.

Pass 31 closes the Endless gold-lever cycle. This is a current-lever decision, not a claim that Endless or the whole game is perfectly tuned.

# Locked Outcome

Keep in production:

- Endless kill-gold exponent 1.05.
- Endless XP exponent 1.04.
- Endless enemy-level slope 0.15 per wave.
- Foundry Core base ATK 1.5.
- Foundry Core-only unreacted ranged-volley multiplier 0.9.
- Global non-Core unreacted/parried ranged-charge multipliers 2.2/0.9.
- Hollow King ATK 1.3.
- Post-Shatter enemy HP/ATK and DEF multipliers 1.10.
- Ashen Keep level 50.
- Auto Training target 1.0 and threshold 4.

Do not implement the Pass 31 simulator override in production. No production balance value changes are authorized by this review.

# Pass 32: Production Release-Confidence Validation

Run one broad, fresh-seed validation of the complete production tuning set. Its purpose is to check release confidence and rank the next material cross-map bottleneck after the Ashen Keep, Hollow King, Foundry Core, and Endless gold cycles have been closed.

Use:

- current production source and rebuilt bundle only;
- no simulator balance replacement map;
- seeds 61-80;
- idle, light, casual, and engaged profiles;
- 96 simulated hours;
- 80 runs total;
- far-mark stall rule at three hours;
- three Shatters as a cap with no early stop;
- Pass 22 dust policy and literal Pass 24 ascension policy;
- zero balance changes, zero control reruns, and zero extra profiles or batches.

This is one release-confidence validation, not a new diagnostic for a chosen lever. Do not tune XP, Endless level slope, gold, Renown, Omens, bosses, Auto Training, ascension, or any other value during Pass 32.

# Validity Gate

Before interpreting balance, demonstrate:

- all 80 runs reach 96 simulated hours within one simulation step;
- no run exceeds three Shatters or stops merely because it reaches three;
- source and bundle contain every locked production value above;
- the Pass 31 Endless override is not active;
- Core-only volley lookup still falls back to 2.2 for every non-Core enemy and keeps parried damage at 0.9;
- no simulator replacement, stale bundle, missing profile, or mechanical error affects the batch.

If a validity gate fails, stop balance interpretation and report the defect. Do not silently fix it or run a replacement batch without review.

# Required Evidence

Report by profile, with per-seed outliers:

- current and best zone, party level and power at 24, 48, 72, and 96 hours;
- Shatter count and timing;
- time spent in each zone;
- boss attempts, wins, clear hour, and longest stall for Grave Knight, Hollow King, and Foundry Core;
- active-versus-idle differences in attempts, recovery, charge/volley outcomes, and meaningful failures;
- Foundry exit and Endless entry rate/time;
- Endless exposure, best wave, milestone reach, deaths per hour, gold earned/spent, purchases, level, power, ore, Renown, and Omens;
- any non-Endless boss that becomes a repeated multi-hour wall;
- any regression relative to the established Pass 27-31 ranges.

Use the fresh batch to rank the largest remaining player-facing bottleneck across the Road. Do not reopen a closed map merely because a secondary percentage narrowly misses an earlier gate. A new candidate is justified only by a genuine mechanical failure, severe regression, or a clearly larger progression wall.

# Completion Rule

If the production validation shows no severe regression or material new hard wall, report that the current tuning cycle is ready for human merge consideration. That means this tuning cycle is complete; it does not mean every map, Endless scaling, or the whole game is permanently complete.

If the validation finds a material blocker, identify exactly one largest cross-map bottleneck and propose one bounded hypothesis and experiment. Do not implement it during Pass 32 and do not run a second validation.

# Locked Systems

Keep all previously locked systems unchanged, including:

- all accepted boss stats and local mechanics;
- all Shatter, dust, stall, ascension-policy, and Auto Training behavior;
- Endless enemy scaling, level slope, encounter pools, milestones, champions, XP, gold, ore, Renown, Omens, gear, and costs;
- tap balance, rarity, promotion, travel, recovery, UI, monetization, and save format.

# What Not To Do

- Do not implement Endless exponent 1.04.
- Do not test another Endless gold exponent, flat multiplier, XP exponent, or level slope.
- Do not run another Core or Hollow King candidate.
- Do not add a control arm or confirmation loop.
- Do not make gameplay changes during Pass 32.
- Do not merge the pull request before the Pass 32 handoff is reviewed.
