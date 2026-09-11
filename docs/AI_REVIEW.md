STATUS: READY
REVIEW_FOR_PASS: PASS_9_AUTOTRAIN_RETRIGGER_TARGET_DIAGNOSTIC
REVIEWED_HANDOFF_PASS: PASS_8_AUTOTRAIN_THRESHOLD_DIAGNOSTIC
REVIEWED_HANDOFF_SHA: b4582d619831f249873b547936e866ba740a156d
BASE_COMMIT: 97f18874316afb1e42d71ba6f931b70c381721bb
CONFIDENCE: MEDIUM

# Decision

Reject `AT_LOSSES = 5`. Keep production at `AT_LOSSES = 4`.

Accept the developer's counterproposal in narrowed form: the next diagnostic will test a +2 party-level training target only for a quick same-zone retrigger. A first trigger remains +1. No cooldown is authorized.

# Pass 8 Assessment

The 5-loss candidate failed the predetermined success criteria:

- Median triggers fell at least 20% only for idle (-25%), not casual (-13%) or engaged (-10%).
- Retriggers within the measured 20-fight window fell 37% / 25% / 18%; only idle met the 30% target.
- Casual median zones cleared fell from 6 to 5.
- Ordinary defeats outside training rose 26% / 14% / 19%.
- Estimated ordinary rewalk time rose 17% / 10% / 14%.
- Casual Stillwater first-try fell to 10%, below the locked 15-40% target band, although n=10 makes that estimate noisy.

The design risk identified in Pass 8 occurred: reducing training by delaying the trigger converted a meaningful share of the saved time into defeat and rewalking. The 5-loss setting is therefore not a candidate for validation.

# Counterproposal Evaluation

The developer is right that the evidence weakens the original variance hypothesis.

Retriggers still arrive after roughly 9-10 fights and 7-8 minutes in both threshold arms. Raising the threshold changed that timing only marginally while increasing unproductive defeats. The invariant checkpoint pattern and the +1 training target make the intra-zone climb a plausible structural cause.

The enemy-level gap is supporting evidence, not proof by itself: encounter composition and nonlinear stat scaling also affect difficulty. The proposed target experiment is still the smallest direct way to distinguish “one level is insufficient at a quick retrigger” from “the trigger itself is noisy.”

# Required Instrumentation Correction

The current observation code does not exactly implement the label “within 20 fresh ordinary fights”:

- `returnFights` increments before the boss-fight early return, so boss encounters can be included.
- On the 20th ordinary fight, the after-return record is cleared before `startTraining()` reads it, so an eligible retrigger on that fight is missed.

For both arms, define a quick retrigger as a trigger caused by an ordinary fight numbered 1 through 20 inclusive after a completed return to the same zone. Capture that state before clearing the after-return window. This correction is observation/state classification only in the control arm.

Because this correction changes the classification used by the candidate mechanic, rerun both arms. Do not compare the corrected candidate solely against the retained Pass 8 control.

# Authorized Experiment

Control:

- `AT_LOSSES = 4`
- training target = +1 party level for every trigger

Candidate:

- `AT_LOSSES = 4`
- first trigger, non-quick retrigger, or different-zone trigger: +1 party level
- same-zone retrigger within 1-20 completed ordinary fights after a completed return: +2 party levels

Implementation requirements:

- Persist the selected target on the active training record.
- Completion must compare progress against the persisted target.
- For save compatibility, an active training record without a target must default to +1.
- Record the selected target and quick-retrigger reason in telemetry.
- Keep minimum 3 training fights for both targets.
- Do not change reward rates; the additional level must be earned through normal training fights.
- Keep deeper fallback and Keep Pushing behavior unchanged.

# Simulation Plan

QUICK DIAGNOSTIC:

- paired seeds 1-10
- Idle / Casual / Engaged
- 24h
- 30 control + 30 candidate runs
- production Road logic
- identical instrumentation in both arms
- 0 simulation errors required

# Required Telemetry

For each arm and profile report median / P90 and paired relative change for:

- total triggers, completed returns, cancellations
- +1 and +2 trainings by target zone
- training hours, share of 24h, fights, and party levels earned
- same-zone retriggers within 10 and within 20 ordinary fights
- median ordinary fights and minutes to retrigger
- ordinary defeats outside training
- ordinary and boss rewalk fights and estimated rewalk hours
- first 10 and 20 ordinary-fight win rate after return
- trigger loss-window contents
- party/enemy level and pre-rollback loss position at trigger
- Stillwater and Ironvein first-try, attempts, stall, arrival level, and clear time
- early-Road clear times, zones cleared at 24h, and party level at 24h

Also report how many triggers occurred exactly on ordinary fight 20 so the corrected boundary can be audited.

# Success Criteria

The +2 quick-retrigger candidate is promising only if:

- median retriggers within 20 ordinary fights fall at least 30% in at least two profiles and do not increase in the third;
- median total triggers fall at least 15% in at least two profiles;
- ordinary defeats and estimated ordinary rewalk hours do not worsen by more than 10% in any profile;
- median training hours/share do not increase by more than 10% in any profile;
- median zones cleared at 24h do not decline;
- median early-Road clear times do not worsen by more than 10% and P90 by more than 15%;
- Stillwater remains in its locked Pass 7 bands with median attempts <=3 and P90 <=5; and
- the candidate does not merely inflate party level while leaving retrigger timing unchanged.

# Failure Criteria

Reject or revise the escalation if:

- quick retriggers fall less than 15% in two or more profiles;
- +2 trainings materially increase total training time without reducing retriggers;
- dead time, early-Road progression, or Stillwater worsens beyond the limits above;
- the candidate causes repeated +2 cycles in the same zone; or
- corrected telemetry is invalid or differs between arms.

# Decision Rules

- If all success criteria pass: propose a normal validation of the localized +2 retrigger target.
- If retriggers improve but training share rises materially: return a counterproposal using target and zone breakdowns; do not silently alter the threshold.
- If retriggers barely move: retain universal +1 and evaluate a separate cooldown diagnostic next.
- If the effect is concentrated in Ironvein idle only: retain current global behavior and propose an Ironvein-local diagnosis rather than globalizing the mechanic.

# Locked Systems

- `AT_LOSSES = 4`, `AT_WINDOW = 10`, and `AT_MIN = 8`
- Stillwater Alpha HP x0.55 and ATK x0.70
- summoned werewolf HP x0.75 and ATK x0.85
- one wolf at 60%; Howl at 30%
- Greenhollow tuning
- tap damage x0.22 and tap charge/focus
- boss retry cadence 9
- Auto Training rewards, deeper fallback, protections, and Keep Pushing
- polynomial Renown
- rarity and promotion progression
- all downstream boss values, including Ironvein
- no cooldown, special active-play multiplier, global XP change, or unrelated balance/UI change

# What Not To Do

- Do not ship `AT_LOSSES = 5`.
- Do not tune Stillwater or Ironvein in this pass.
- Do not add a cooldown.
- Do not change XP, gold, drops, gear, travel, recovery, or boss behavior.
- Do not reuse the uncorrected Pass 8 control as the sole comparator.
