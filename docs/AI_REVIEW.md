STATUS: READY
REVIEW_FOR_PASS: PASS_25_SHATTER_ENEMY_SCALING_CANDIDATE
REVIEWED_HANDOFF_PASS: PASS_24_VALID_SHATTER_BASELINE
REVIEWED_HANDOFF_SHA: 33e160d91d6b46576afe0c30b6a934d65f78fd21
BASE_COMMIT: ad40a2174b8ebbb263b0cd68d6c87dc66c99e2cd
CONFIDENCE: HIGH

# Decision

Accept Pass 24 as the single valid 72-hour production-value Shatter baseline. The simulator horizon and audit guards are valid, all 30 runs reached 72 hours, the three-Shatter cap was respected without early termination, the run-3 replay was observed in 27 runs, and no production source or bundle changed.

The baseline establishes a material post-Shatter progression wall:

- Ashen Keep was entered in 30/30 runs, but no run cleared it or entered Foundry.
- Hollow King was 0/30; defeats occurred in 16-24 seconds with 84-93% boss HP typically remaining.
- Idle and light profiles also stalled in ordinary Keep encounters, so this is not only a local Hollow King problem.
- The same replay scaling sharply suppresses Grave Knight success by run 3.
- Enemy HP and ATK grow by `1.25^run`, while the demonstrated player-side dust gains are materially smaller.

The zero-ascension result is valid evidence, not a telemetry defect. Under the fixed production-cost policy, item-level spending prices equipped gear out of ascension before the first Shatter. Do not reopen ascension priorities, reserves, costs, ranks, or gear economy in this cycle.

Accept the developer's systemic diagnosis in part. Authorize one simulator-only candidate: reduce the shared post-Shatter enemy HP/ATK multiplier from `1.25` to `1.10`. Keep the DEF multiplier at `1.10`. Changing HP/ATK and DEF together would confound the causal test and broaden the change beyond the evidence needed.

# Pass 25 Hypothesis

A single reduction of the post-Shatter enemy HP/ATK multiplier from `1.25` to `1.10` will restore useful run-2/run-3 progression through ordinary Ashen Keep and produce credible Hollow King contests without making earlier replay bosses automatic or creating rapid Shatter churn.

This is a test, not production approval.

# Authorized Candidate

Add one simulator override for the shared enemy HP/ATK per-Shatter multiplier:

- control: production `1.25` from the completed Pass 24 baseline;
- candidate: `1.10`;
- DEF per-Shatter multiplier remains production `1.10`;
- all run-0 enemy stats must remain identical;
- all other gameplay values and bot policies remain identical to Pass 24.

Do not rerun the control. Pair the candidate directly against the existing Pass 24 runs.

# Authorized Batch

Run exactly one candidate batch:

- seeds 31-40;
- idle, light, and casual;
- 72 hours;
- 30 runs total;
- `--stallRule far --stallHours 3`;
- `--shatters 3` as a cap, with no early-stop flag;
- Pass 22 dust policy;
- the literal Pass 24 ascension policy;
- Ashen Keep level `50`;
- zero simulation errors.

Do not add alternate factors, a DEF arm, a Hollow King arm, more seeds, more profiles, or a confirmation batch.

# Required Validity Checks

Before interpreting balance, demonstrate:

- all 30 candidate runs reach 72 simulated hours within one simulation step;
- no run performs more than three Shatters or stops merely because it reaches three;
- candidate and paired Pass 24 state are exact through the first Shatter, including hourly state, Shatter timing/location/gain, zone and party state, gear, currency, dust purchases, and RNG-sensitive outcomes;
- run-0 enemy stats and combat outcomes are exact matches;
- divergence begins only in post-Shatter enemy HP/ATK;
- DEF, rewards, XP, gold, ore, and every other formula are unchanged;
- no production source or bundle changed.

If any check fails, stop balance interpretation and report the defect. Do not run a replacement batch without review.

# Required Evidence

Report compact paired deltas and absolute candidate results, separated by profile and run number:

- current and best zone at 24, 36, 48, 60, and 72 hours;
- Shatter count, timing, location, dust gain/spend, and the replay each Shatter starts;
- zone-clear and re-clear times for every run, especially Ashen Approach and Ashen Keep;
- ordinary encounter count, losses, loss rate, furthest fight, and time spent in Ashen Keep;
- Grave Knight and Hollow King attempts/wins by run, loss duration, boss HP remaining, summons reached, boss HP/ATK/DEF, and hits-to-defeat at arrival;
- Keep clears and Foundry entries with hour, run, party level, and power;
- total defeats, training time, XP, gold, ore earned/spent, gear state, and final state;
- evidence that earlier replay bosses retain meaningful resistance and that the candidate does not cause a rapid Shatter loop.

Fix the report-only Keep-entry display to print the recorded entry hour rather than `undefined`. This is a presentation correction only and does not authorize a rerun or gameplay change.

# Good-Enough Decision Rule

Accept the direction if the candidate materially advances run-2/run-3 ordinary Keep progression and turns Hollow King attempts into credible contests or some clears, while earlier replay bosses retain meaningful resistance and Shatter timing does not collapse into churn. Perfect Keep-clear percentages are not required.

Reject it if Keep progression remains substantially blocked, or if the global change severely trivializes earlier replay content, destabilizes rewards/progression, or creates rapid repeat-Shatter behavior.

When Pass 25 completes, do not run another value or confirmation automatically. If the result is clearly promising, the next review may authorize one final broad validation because this is a global post-Shatter parameter. If it is rejected, the next review may consider one direct Hollow King lever only if the evidence shows the remaining wall is local. Do not test both directions together.

# Locked Systems

Keep locked:

- post-Shatter enemy DEF multiplier `1.10`;
- Ashen Keep base level `50`, enemy pool, fight count, and reward formulas;
- Hollow King HP, ATK, DEF, speed, summons, drain, and mechanics;
- all Shatter availability, gain, blessing costs/effects, dust priority, and far-mark stall behavior;
- production gear ranks, stats, ascension costs/caps, drop ranks, ore economy, and upgrade formulas;
- Auto Training target `1.0`, threshold `4`, and all Auto Training behavior;
- Warlord ATK x1.2, Sand Tyrant ATK x1.1, Hunter King ATK x1.0, and Grave Knight ATK x2.0;
- all ordinary enemy base stats, boss base stats, global level curves, progression, economy, tap, Renown, rarity, promotion, travel, recovery, UI, and save-format systems;
- `AUTO_REACT = false`.

# What Not To Do

- Do not modify production gameplay code or the production bundle.
- Do not change the post-Shatter DEF multiplier.
- Do not change Hollow King, Grave Knight, Ashen Keep level, or ordinary enemy base values.
- Do not alter gear or ascension behavior.
- Do not rerun Pass 24.
- Do not add candidate values, arms, seeds, profiles, hours, or confirmation runs.
- Do not describe a successful Pass 25 as whole-game completion.
