STATUS: READY
REVIEW_FOR_PASS: PASS_8_AUTOTRAIN_THRESHOLD_DIAGNOSTIC
REVIEWED_HANDOFF_PASS: PASS_7_VALIDATION
REVIEWED_HANDOFF_SHA: 6dc9968c77913d3c84b87a6b7229b523431d0db4
BASE_COMMIT: be82af6c1f71c8f20ffca359a396bed952e07cbf
CONFIDENCE: MEDIUM

# Diagnosis

Pass 7 is accepted. The invalid first batch was correctly discarded, the `now()` crash was observation-only, and the clean rerun completed 100/100 production-road simulations.

Variant G meets every predetermined Stillwater target:
- Idle first-try 50% (acceptable 40-70%)
- Casual 30% (target 15-40%)
- Engaged 25% (target 20-45%)
- Median attempts 1-2
- P90 attempts 3-5
- Median stall 0.02-0.49h

The boss-harness phase evidence and full-road results agree that lowering the Alpha body was causal. Raising Alpha HP to 0.58/0.60 is not justified by these results.

The new concern is Auto Training frequency: idle through engaged spend median 41-56% of 24h training and trigger 25-31 times. This establishes that training is a dominant progression behavior, but aggregate time share alone does not prove false triggering because training earns normal rewards and was designed to replace inefficient manual farming.

# Developer Position

AGREE on locking Stillwater at Variant G.

PARTIAL on the proposed Auto Training experiment. The developer is right to investigate trigger frequency before Ironvein, but testing both a stricter loss threshold and a post-return cooldown in one pass would not isolate the cause.

# Reviewer Assessment

The trigger is evaluated on a rolling 10-fight window at 4 losses. Parties return with roughly 70-80% median win rates, so ordinary variance can plausibly produce another 4-loss window even when the target zone has become viable. The cleanest first test is the single threshold lever.

A cooldown is not authorized in this pass. It could suppress a legitimate fallback after a genuinely bad return and would confound whether the existing loss threshold itself is too permissive.

# Primary Hypothesis

The current `AT_LOSSES = 4` threshold repeatedly classifies viable 70-80% win-rate target-zone play as dangerous. Increasing only the threshold to 5 losses in the rolling 10-fight window will materially reduce unnecessary same-zone retriggers without meaningfully degrading early-Road progression.

# Authorized Experiment

Candidate:
- `AT_LOSSES: 4 -> 5`

Control:
- Current production behavior, `AT_LOSSES = 4`

Keep unchanged:
- `AT_WINDOW = 10`
- `AT_MIN = 8`
- one party-level-equivalent training target
- minimum 3 training fights
- deeper fallback
- build-change and self-nerf protections
- Keep Pushing
- travel/recovery behavior
- all XP, gold, drops, and gear behavior

Use paired seeds 1-10 with:
- Idle
- Casual
- Engaged
- 24 simulated hours
- production Road logic

If the exact Pass 7 seed 1-10 raw outputs are retained and comparable, use them as the control and run only 30 candidate simulations. Otherwise rerun both arms for 60 total simulations.

Instrumentation-only changes are allowed to measure retrigger timing. Do not change gameplay behavior beyond `AT_LOSSES`.

# Locked Systems

- Stillwater Alpha HP x0.55 and ATK x0.70 — now locked
- Summoned werewolf HP x0.75 and ATK x0.85
- 1 wolf at 60%
- Howl at 30%
- Greenhollow tuning
- Tap damage x0.22 and tap charge/focus
- boss retry cadence 9
- Auto Training architecture, target amount, rewards, and protections
- polynomial Renown
- rarity and promotion progression
- all downstream boss values, including Ironvein
- no special active-play multiplier
- no global XP change

# Required Telemetry

For both arms and each profile:
- total triggers, completed returns, cancellations
- training hours and share of 24h
- triggers by target zone
- same-zone retriggers within 10 and within 20 fresh target-zone fights after a completed return
- median fresh fights and minutes from return to next same-zone trigger
- target-zone win rate over the first 10 and 20 fights after return
- win rate and loss-window contents at each trigger
- normal-fight death/recovery/rewalk time outside training
- Stillwater first-try, median/P90 attempts, stall, and clear time
- Ironvein first-try, median/P90 attempts, stall, and clear time
- arrival level at Stillwater and Ironvein
- zones cleared at 24h

# Success Criteria

The 5-loss candidate is promising only if:
- median total triggers fall by at least 20% in at least two of three profiles, and
- same-zone retriggers within 20 fresh fights fall materially (target: at least 30% relative), and
- median zones cleared at 24h do not decline, and
- median early-Road clear times do not worsen by more than 10% and P90 by more than 15%, and
- Stillwater remains within the Pass 7 target bands with median attempts <=3 and P90 <=5, and
- reduced training time is not replaced by a comparable increase in dead/recovery/rewalk time.

# Failure Criteria

Reject or reconsider the threshold change if:
- trigger frequency falls less than 10%, or
- quick retriggers remain essentially unchanged, or
- Stillwater falls outside its target bands, or
- Ironvein/overall early-Road progression materially worsens, or
- reduced training simply becomes increased unproductive death and rewalking.

# Decision Rules

- If success criteria are met: propose a normal VALIDATION of `AT_LOSSES = 5`; do not add a cooldown yet.
- If frequency improves but progression regresses: return a counterproposal using the retrigger telemetry; do not silently tune bosses or XP.
- If quick retriggers remain high despite the stricter threshold: restore 4 losses and propose a separate cooldown diagnostic.
- If the threshold barely changes frequency: retain 4 losses and move the next investigation to Ironvein idle/light behavior.

# Design Risk

A stricter trigger may make Auto Road remain too long in genuinely inefficient content, turning productive training time into invisible death/recovery/rewalk time. That tradeoff is more important than lowering the training-share metric by itself.

# Implementation Risk

Low for the isolated constant change. Medium for interpretation if the control is not seed-paired or if same-zone retrigger timing cannot be measured consistently from current logs.

# What NOT To Do

- Do not change Stillwater again.
- Do not tune Ironvein in this pass.
- Do not add the 20-fight cooldown in this pass.
- Do not change training duration, XP, rewards, travel state, or deeper fallback.
- Do not make unrelated refactors or UI changes.

# SIM RUN GUIDELINES

QUICK DIAGNOSTIC:
- 10 paired seeds
- Idle / Casual / Engaged
- 24h
- current 4-loss control vs 5-loss candidate
