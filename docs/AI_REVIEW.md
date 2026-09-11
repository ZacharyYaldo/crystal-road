STATUS: READY
REVIEW_FOR_PASS: PASS_26_SHATTER_ENEMY_SCALING_VALIDATION
REVIEWED_HANDOFF_PASS: PASS_25_SHATTER_ENEMY_SCALING_CANDIDATE
REVIEWED_HANDOFF_SHA: ff02bf335a4065f4b5deedb235d6e962784e3ad7
BASE_COMMIT: 05b8ecaf4b06f89f9d28ff7e36d78774aab7bd85
CONFIDENCE: HIGH

# Decision

Accept the Pass 25 direction. The post-Shatter enemy HP/ATK factor `1.10` materially improves the player-facing wall without erasing replay resistance:

- every profile advanced deeper through ordinary Ashen Keep;
- fight 36 reach rose from 13/30 to 27/30 runs;
- Hollow King moved from immediate wipes and 0/30 to credible active-play contests and 10 Keep clears;
- all 10 clears entered Foundry;
- earlier replay bosses remained meaningful for idle and light;
- Shatters remained separated by substantial replay progress rather than collapsing into churn;
- progression rewards generally improved rather than falling.

The result is not a complete Hollow King solution. Auto-Cast remained 0/177 while every clear occurred during an active window. That is a distinct local idle-facing boss issue; do not weaken the global factor further to solve it.

Casual run-2 Grave Knight at 7/8 and one casual run reaching Endless Road within 72 hours are the two material regression risks. Because the candidate changes every post-Shatter enemy, one final fresh-seed validation is justified. This is the final pass for this scaling lever: no further sizing value or confirmation pass is authorized.

# Pass 26 Implementation

Change the production post-Shatter enemy HP/ATK multiplier from `1.25` to `1.10` in the canonical game source and rebuild the production bundle.

Keep the post-Shatter DEF multiplier at `1.10`.

The candidate arm must exercise the production code with no balance override. The paired control may use the validated simulator override to restore only the HP/ATK factor to `1.25` on the same build.

This is validation on the pull-request branch, not approval to merge or ship before the results are reviewed.

# Final Validation Batch

Run one paired fresh-seed validation only:

- seeds 41-50;
- idle, light, casual, and engaged profiles;
- 72 hours;
- 40 control runs at HP/ATK factor `1.25`;
- 40 production-candidate runs at HP/ATK factor `1.10`;
- 80 runs total;
- `--stallRule far --stallHours 3`;
- `--shatters 3` as a cap, with no early-stop flag;
- Pass 22 dust policy;
- the literal Pass 24 ascension policy;
- Ashen Keep level `50`;
- zero simulation errors.

Do not add the continuous-tap stress profile, more seeds, more hours, another factor, a DEF arm, a Hollow King arm, or a follow-up confirmation.

# Required Validity Checks

Before interpreting balance, demonstrate:

- all 80 runs reach 72 simulated hours within one simulation step;
- no run performs more than three Shatters or stops merely because it reaches three;
- paired control and candidate state are exact through the first Shatter;
- all run-0 stats and outcomes are exact matches;
- the candidate arm uses the rebuilt production source/bundle with no balance override;
- the control differs only by the validated HP/ATK factor override;
- divergence begins only in post-Shatter enemy HP/ATK;
- DEF, rewards, XP, gold, ore, Shatter behavior, bot policy, and every other gameplay formula are identical;
- canonical source and production bundle contain the same `1.10` factor.

If any check fails, stop balance interpretation and report the defect. Do not run a replacement batch without review.

# Required Evidence

Report paired deltas and absolute results by profile and run number for:

- current and best zone at 24, 36, 48, 60, and 72 hours;
- Shatter count, timing, location, dust gain/spend, minimum gaps, and zones re-cleared between Shatters;
- zone clear/re-clear times across the full Road;
- ordinary Ashen Keep encounters, losses, loss rate, time, furthest fight, and fight-36 reach;
- Hollow King attempts/wins split by Auto-Cast and active windows, loss duration, HP remaining, summon reaches, arrival hits-to-defeat, clear time, and run number;
- Sand Tyrant, Hunter King, and Grave Knight attempts/wins split by run and activity window, with enough context to identify automatic replay clears;
- Keep clears and Foundry entries with hour, level, and power;
- Foundry clears, Endless Road entries, Endless progress, and time spent after Keep;
- total defeats, training time, party level, XP, gold, ore earned/spent, gear state, and final state;
- outlier runs with unusually fast downstream progression or large economy deltas.

Do not judge the global factor by Hollow King Auto-Cast wins alone. The factor's purpose is to restore cross-map replay progression; the remaining 0/177 Auto-Cast result is tracked separately as a local boss-facing issue.

# Good-Enough Validation Rule

Lock `1.10` if fresh seeds reproduce the main Pass 25 pattern:

- ordinary run-2/run-3 Keep progression materially improves across the normal profiles;
- active profiles produce credible Hollow King contests and some clears without near-universal immediate clears;
- idle meaningfully advances through the Keep even if Hollow King remains uncleared;
- earlier replay bosses retain meaningful resistance, and casual/engaged play does not make Grave Knight or another replay boss broadly automatic;
- Shatter timing still represents substantial replay progress rather than rapid cycling;
- Foundry and Endless progress do not reveal a severe downstream difficulty collapse or runaway economy.

A thin-sample percentage narrowly missing a secondary threshold is not grounds for another pass. Weigh progression time, attempts, stalls, activity-window experience, downstream reach, and regressions together.

Reject `1.10` only if the fresh paired evidence shows little cross-map benefit or a severe broad regression. If rejected, do not test another scaling factor. Report the evidence and wait for review.

After Pass 26, this global scaling lever is closed. No additional confirmation is allowed. The next review will either lock `1.10` and choose between one direct Hollow King idle-facing candidate and the next larger whole-game bottleneck, or reject it and move to a local mechanism.

# Locked Systems

Keep locked:

- post-Shatter enemy DEF multiplier `1.10`;
- Ashen Keep base level `50`, enemy pool, fight count, and reward formulas;
- Hollow King HP, ATK, DEF, speed, summons, drain, and mechanics;
- every Shatter availability, gain, blessing cost/effect, dust priority, and far-mark stall rule;
- production gear ranks, item stats, ascension costs/caps, drop ranks, ore economy, and upgrade formulas;
- Auto Training target `1.0`, threshold `4`, and all Auto Training behavior;
- Warlord ATK x1.2, Sand Tyrant ATK x1.1, Hunter King ATK x1.0, and Grave Knight ATK x2.0;
- all ordinary enemy base stats, boss base stats, zone levels, global level curves, progression, economy, tap, Renown, rarity, promotion, travel, recovery, UI, and save-format systems;
- `AUTO_REACT = false`.

# What Not To Do

- Do not change the post-Shatter factor to any value other than `1.10`.
- Do not change the DEF multiplier.
- Do not tune Hollow King or Grave Knight in Pass 26.
- Do not change Ashen Keep level or ordinary enemy base values.
- Do not alter gear, ascension, dust, Shatter, or Auto Training behavior.
- Do not add profiles, seeds, hours, candidate arms, or another validation.
- Do not merge or describe this as whole-game completion before review.
