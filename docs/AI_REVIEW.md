STATUS: READY
REVIEW_FOR_PASS: PASS_13_WARLORD_ATK_CONFIRMATION
REVIEWED_HANDOFF_PASS: PASS_12_WARLORD_ATK_ROAD_DIAGNOSTIC
REVIEWED_HANDOFF_SHA: f1d3f50a45563e00a5709861296653187b9ae95d
BASE_COMMIT: 66bf3b270dc7dc5b44b72faad8ee97bccb4b6c77
CONFIDENCE: MEDIUM

# Decision

Pass 12 produced a strong positive signal for Warlord ATK x1.2, but it did not pass the predeclared gate. Do not call this a successful diagnostic or begin release validation yet.

Authorize one bounded confirmation diagnostic of the same x1.2 candidate. The purpose is to resolve the small-sample first-try result and the downstream regression signals. This is not approval to ship x1.2.

Production remains Warlord ATK x1.7. Keep `AUTO_REACT = false`.

# Pass 12 Assessment

The experiment separation is credible:

- Warlord ATK was 978 in every control first attempt and 691 in every candidate first attempt.
- Arrival level, party power, HP, charge, and Surge were effectively matched.
- Production source remains Warlord ATK x1.7.
- The candidate used only the simulator override.
- Automatic reactions executed zero times.
- The run completed 40 control and 40 candidate Road simulations with zero errors.

The core effect is real and correctly attributed to Auto-Cast:

- Idle attempts fell 7 -> 2; P90 fell 18 -> 5.
- Idle Ironvein stall fell 52%, and boss-loss rewalk time fell 72%.
- Idle Auto-Cast attempt win rate rose 12% -> 42%.
- Light Auto-Cast attempt win rate rose 21% -> 38%.
- Light first-try rose 10% -> 20%.
- Active light remained 57% and casual 90%, below the 95% ceiling.
- Warlord continued to produce losses in idle, light, and casual.
- Stillwater and Thornwood were unchanged.

This supports the causal premise: lowering ordinary Warlord hit damage lets automatic parties survive long enough to contest the late phase while the x2.5 charge remains lethal and mechanically important.

# Gate Correction

The handoff says two of twelve criteria missed. Three predeclared criteria were not fully met:

1. The combined first-try criterion failed because idle remained 0 of 10.
2. Casual median zones cleared at 24 hours fell 6 -> 5.
3. Engaged ordinary rewalk increased 14% by fights and 18% by estimated hours, beyond the 10% limit.

The latter two are plausibly small-sample/cutoff effects, but they cannot be dismissed as artifacts yet. Once the Warlord fight consumes different time and random draws, downstream divergence is part of the simulated consequence of the lever, even if it is not a direct stat effect.

The idle first-try miss is also an observed miss, not an artifact. It may be underpowered at n=10, but the evidence currently says x1.2 converts the idle experience from a long execution wall into a likely two-attempt check; it does not yet show natural-arrival first-try clears.

Accordingly, Pass 12 is a 9-of-12 screen with a strong primary signal, not a passed validation gate.

# Authorized Experiment

Control:

- Warlord base ATK x1.7
- `AUTO_REACT = false`

Candidate:

- Warlord base ATK x1.2 through the existing simulator-only override
- `AUTO_REACT = false`

Run a CONFIRMATION DIAGNOSTIC:

- fresh paired seeds 11-30
- Idle / Light / Casual / Engaged
- 24 hours
- 80 control + 80 candidate runs
- current production Road, Auto Training, horde, and catacomb behavior
- zero simulation errors

Do not reuse seeds 1-10 in the primary scorecard. They may be shown separately as prior evidence.

Do not add Stress in this pass. Do not test x1.0, x1.4, another ATK value, or a combined lever.

# Required Results

Report the same Pass 12 tables, plus:

- per-seed paired deltas for Ironvein attempts, stall, clear time, zones cleared, ordinary rewalk fights/hours, and total defeats;
- idle first-attempt outcomes with boss HP remaining, party level, party HP, charge, Surge, and normal-hit/charge counts;
- candidate and control first-try counts, not only percentages;
- zones cleared at both 20 and 24 hours;
- time to the sixth-zone clear, including runs that do not reach it by 24 hours;
- engaged downstream rewalk deltas by seed and the number of positive, zero, and negative paired deltas;
- pooled Auto-Cast and active-window attempt counts and wins, with denominators.

Do not describe downstream differences as RNG artifacts unless the new paired distribution supports that claim.

# Confirmation Gate

Advance x1.2 to normal validation only if all are true on fresh seeds 11-30:

- idle candidate produces at least 2 first-try clears and exceeds control first-try;
- idle median attempts are <=3 and P90 <=8;
- idle total Ironvein stall falls at least 35%;
- idle Auto-Cast attempt win rate improves by at least 20 percentage points;
- light candidate first-try is at least 15% and exceeds control;
- light Auto-Cast attempt win rate improves by at least 10 percentage points;
- active-window win rate remains below 95% for light and casual; engaged may remain at its existing ceiling;
- Warlord produces losses in at least three profiles;
- Stillwater and Thornwood remain within their locked bands;
- no profile's ordinary rewalk fights or estimated hours worsens more than 10%;
- median zones cleared at 20 and 24 hours do not decline;
- no downstream median clear time worsens more than 10% or P90 more than 15%;
- no horde, catacomb, telemetry, or mechanical regression appears.

If all pass, propose the normal 20-seed, five-profile validation with production candidate code. Do not apply the production value before that review.

If idle first-try remains below the gate but attempts and stall again improve strongly, report x1.2 as a deliberate two-attempt checkpoint option and stop for reviewer judgment. Do not test x1.0 automatically.

If downstream rewalk or progression regressions repeat beyond the limits, reject x1.2 rather than labeling them noise.

# Locked Systems

- production Warlord ATK x1.7
- Warlord HP x6.0, DEF x1.2, speed 8, charge x2.5, ward, summon threshold, and two-orc summon
- `AUTO_REACT = false`
- all other boss and ordinary-enemy values
- `AT_LOSSES = 4`, `AT_WINDOW = 10`, and `AT_MIN = 8`
- universal +1 Auto Training target; no conditional +2 and no cooldown
- Auto Training rewards, fallback, protections, and Keep Pushing
- Stillwater Alpha HP x0.55 and ATK x0.70
- summoned werewolf HP x0.75 and ATK x0.85
- one wolf at 60%; Howl at 30%
- Greenhollow tuning
- tap damage x0.22 and tap charge/focus
- boss retry cadence 9
- polynomial Renown
- rarity and promotion progression
- no global XP, gold, drop, gear, travel, recovery, or unrelated UI change

# What Not To Do

- Do not ship Warlord ATK x1.2 yet.
- Do not revive Auto-Cast reactions.
- Do not change charge damage, Warlord HP/DEF/speed, ward, summons, or adds.
- Do not alter Auto Training.
- Do not test a second ATK value.
- Do not change the global enemy ATK curve.
- Do not call this confirmation pass release validation.
