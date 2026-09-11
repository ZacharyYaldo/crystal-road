STATUS: READY
REVIEW_FOR_PASS: PASS_10_IRONVEIN_FAILURE_MODE_DIAGNOSTIC
REVIEWED_HANDOFF_PASS: PASS_9_AUTOTRAIN_RETRIGGER_TARGET_DIAGNOSTIC
REVIEWED_HANDOFF_SHA: b30bb6e967f1bf779fbbeaa6089d39c5b6ed9dc3
BASE_COMMIT: 572ecd1fbb6035e31c57e2dcabb986985198c578
CONFIDENCE: MEDIUM

# Decision

Reject the conditional +2 training target as a shippable mechanic. Keep production Auto Training at a universal +1 party level with `AT_LOSSES = 4`.

Accept the developer's recommendation to stop tuning global Auto Training for now. Pass 9 shows that training frequency is largely structural and that more training can convert ordinary defeat/rewalk time into productive progression, but it does not establish that repeated +2 escalation is safe.

Authorize one no-balance-change Ironvein failure-mode diagnostic. Do not change Warlord, adds, Auto Training, or any other gameplay value in Pass 10.

# Pass 9 Assessment

The implementation and corrected instrumentation are adequate for this diagnostic:

- Boss fights no longer increment the ordinary-fight retrigger counter.
- A retrigger on ordinary fight 20 is classified before the observation window clears.
- The selected target is persisted on active training state and missing targets default to +1.
- Production remains at +1; the +2 behavior is isolated to the candidate simulator source replacement.

The +2 candidate demonstrated a real causal effect, but missed the predeclared bar:

- Retriggers within 20 ordinary fights fell 37% / 38% / 18%, satisfying that criterion in two profiles.
- Total triggers fell 8% / 13% / 16%, satisfying the 15% criterion in only one profile.
- Training time/share rose 13% / 2% / 8%; idle exceeded the 10% limit.
- Training levels earned rose 15% / 8% / 9%.
- Repeated or back-to-back +2 cycles occurred, with medians of 1 / 2 / 2 and P90 of roughly 4-5. That is an explicit failure condition.
- Ordinary defeats fell 8% / 11% / 10%, and estimated ordinary rewalk hours fell 10% / 14% / 14%.
- Median zones cleared did not improve and casual declined from 6 to 5.

The mechanic therefore diagnoses insufficient recovery from some quick retriggers, but it is not a clean global solution. It buys fewer retriggers by assigning more training and can recursively select +2 again. Do not validate or ship it.

# Interpretation

The developer's broader conclusion is accepted with one qualification.

A 40-55% training share is not automatically dead time. Under the current reward model, training is progression: it awards normal combat rewards, raises party level, and reduces subsequent ordinary defeats and rewalk. Trigger count or training share alone should not be minimized when player-facing progress is stable or better.

That does not prove every training cycle is desirable. Repeated +2 cycles show that escalation can absorb more of the session without resolving the underlying encounter structure. Keep universal +1 and evaluate future Auto Training changes only against player-facing harm, not an arbitrary frequency target.

Pass 9 also does not justify an immediate Ironvein balance change. The profile-level first-try and stall results are directionally inconsistent, and the current telemetry does not identify whether Warlord failures are near-kills, early damage checks, or summon-phase collapses. Diagnose that mechanism before choosing a lever.

# Authorized Pass 10

`PASS_10_IRONVEIN_FAILURE_MODE_DIAGNOSTIC`

Purpose: identify the dominant Warlord failure mode at comparable first-arrival states. This is an observation pass, not a balance candidate.

Use current production behavior:

- `AT_LOSSES = 4`
- universal +1 training target
- corrected Pass 9 retrigger instrumentation
- all current production boss and Road values

Profiles:

- Idle
- Light
- Casual
- Engaged

The Light profile is required because prior evidence suggests Ironvein may be most problematic there, and its omission would leave the player-facing gap unresolved.

# Diagnostic Method

Prefer an exact first-arrival snapshot harness for Ironvein. Preserve, at minimum:

- party level and power
- equipment and derived combat stats
- current and maximum party HP
- charge/focus state
- Surge state
- profile and active/automatic-play state
- relevant progression and combat flags

Replay the production Warlord encounter from each snapshot across independent combat RNG seeds. Target 10 representative arrival snapshots per profile x 10 combat seeds each (100 boss fights per profile, 400 total), or an equivalent construction with the same coverage.

Use retained current-production +1 arrival snapshots only if they contain the required state and are exactly comparable. Otherwise run the minimum full-Road production simulations needed to generate them. Do not restart or duplicate unrelated validation work.

The harness must be checked against full-Road first-try results. If its clear rate or failure shape is materially unrepresentative, stop balance interpretation and correct the harness.

# Required Telemetry

For every replay record:

- arrival party level, power, equipment, HP fraction, minimum member HP, charge/focus, Surge, and active/automatic state
- win/loss and encounter duration
- boss HP remaining on loss
- party survivors and remaining HP on win
- wipe timing
- phase reached
- whether the 50% summon occurred
- whether the summon action was interrupted
- adds alive at wipe or victory
- damage received from Warlord versus adds
- charge attack hits and kills
- shield contribution, if reliably measurable

Report by profile and overall:

- clear rate with uncertainty
- median / P90 duration
- boss-HP-remaining distribution on losses
- early-wipe, pre-summon, summon-phase, and post-summon failure shares
- outcome stratified by arrival power and active/automatic state
- full-Road versus snapshot-harness first-try comparison

Telemetry validity is a gate. If phase, summon, damage-source, or arrival-state fields are unreliable, report the defect and do not recommend a balance lever.

# Decision Rules

Pass 10 selects no balance value. The next handoff may propose exactly one bounded lever using these rules:

- If losses cluster near the kill with low boss HP remaining and the party survives deep into the fight: propose an HP-only candidate.
- If early wipes or Warlord charge damage dominate while substantial boss HP remains: propose an ATK-only candidate.
- If failure begins specifically at the 50% summon/add phase: propose a summon-only candidate.
- If arrival power or active-state differences explain most outcomes and the boss performs acceptably at comparable states: make no boss change and investigate arrival/training state instead.
- If evidence is mixed or the harness is unrepresentative: request more diagnosis; do not combine levers.

Debate the evidence in the next handoff and recommend one experiment. Do not implement that experiment until reviewed.

# Locked Systems

- `AT_LOSSES = 4`, `AT_WINDOW = 10`, and `AT_MIN = 8`
- universal +1 Auto Training target; no conditional +2
- no Auto Training cooldown
- Auto Training rewards, minimum fights, deeper fallback, protections, and Keep Pushing
- Stillwater Alpha HP x0.55 and ATK x0.70
- summoned werewolf HP x0.75 and ATK x0.85
- one wolf at 60%; Howl at 30%
- Greenhollow tuning
- tap damage x0.22 and tap charge/focus
- boss retry cadence 9
- polynomial Renown
- rarity and promotion progression
- all downstream boss values, including Warlord and its summoned adds
- no special active-play multiplier, global XP change, or unrelated balance/UI change

# What Not To Do

- Do not ship or validate the conditional +2 training target.
- Do not alter Warlord HP, ATK, defense, speed, charge, shield, summon threshold, add count, or add stats.
- Do not change Auto Training frequency, threshold, target, cooldown, or rewards.
- Do not tune Stillwater or any other boss.
- Do not combine boss levers.
- Do not implement balance code in this pass.
