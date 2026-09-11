STATUS: READY
REVIEW_FOR_PASS: PASS_14_WARLORD_ATK_VALIDATION
REVIEWED_HANDOFF_PASS: PASS_13_WARLORD_ATK_CONFIRMATION
REVIEWED_HANDOFF_SHA: 7a39a037d0d754291cab407b06742e7bc43aa750
BASE_COMMIT: eee8a0d6f1c125e63d291fdc683fce9f1457d98a
CONFIDENCE: MEDIUM

# Decision

Accept the developer's causal argument and advance Warlord base ATK x1.2 to normal validation.

Pass 13 confirms the primary effect on a fresh seed set: x1.2 converts Ironvein from a long Auto-Cast execution wall into a contested boss check without removing the lethal charge or erasing the active-play advantage.

This authorizes a validation build on `ai-tuning-loop`. It is not approval to merge or ship x1.2 to `main`.

# Gate Accounting

The handoff reports 12 of 13 criteria met. On the conservative, denominator-based reading, 11 of 13 were met:

1. Engaged ordinary rewalk hours rose 12%, above the 10% threshold.
2. Light pooled Auto-Cast attempt win rate rose from 5/56 (8.9%) to 4/23 (17.4%), an 8.5-point increase rather than the required 10 points.

The second miss is marginal and the attempt denominator is itself changed by earlier success. Light's player-facing outcomes moved clearly in the intended direction: first-try 15% -> 35%, attempts 3/10 -> 2/5, and stall 1.56h -> 0.95h.

The engaged rewalk miss is real, not random noise. The developer's explanation is supported by the paired progression evidence: engaged reaches later zones earlier, the median paired rewalk-hours delta is 0.00h, total defeats remain within the limit, and no downstream median clear time worsens. Raw 24-hour rewalk totals therefore mix encounter difficulty with additional exposure to later content.

These exceptions are documented rather than relabeled as passed gates. They do not outweigh the replicated primary effect, but validation must measure rewalk cost at matched zone exposure.

# Pass 13 Assessment

Credible replicated effects on fresh seeds 11-30:

- Idle first-try: 1/20 -> 4/20.
- Idle attempts: 8/16 -> 3/5.
- Idle stall: 1.94h -> 1.23h (-37%).
- Idle pooled Auto-Cast wins: 20/175 -> 20/64; the same number of clears required 111 fewer losing attempts.
- Light first-try: 3/20 -> 7/20.
- Light attempts: 3/10 -> 2/5.
- Light stall: 1.56h -> 0.95h (-39%).
- Active-window win rates remained non-automatic for light and casual.
- Stillwater and Thornwood were identical between arms.
- Median progression did not decline at 20 or 24 hours.
- Hordes, catacombs, Auto Training, and core damage-share metrics showed no mechanical regression.

The fight retains its identity:

- Charge remains lethal and unchanged at x2.5.
- Candidate losses reach the summon/late phase much more often.
- Warlord still produces losses in idle, light, and casual.
- Automatic reactions remain disabled.

# Authorized Validation Build

Change only the production Warlord base ATK:

- x1.7 -> x1.2

Apply the candidate to the canonical production source and any generated runtime artifact required for the game to execute the same value. Keep the control arm at x1.7 through the simulator's existing test-only override or an equivalent isolated mechanism.

Audit actual Warlord ATK at every first attempt:

- control expected: 978 at boss level 31;
- candidate expected: 691 at boss level 31.

Keep `AUTO_REACT = false` in both arms.

Observation-only telemetry may be added to record ordinary defeats, rewalk fights, and estimated rewalk time by zone. Do not add or change gameplay behavior for that measurement.

# Validation Plan

NORMAL VALIDATION:

- fresh paired seeds 31-50
- Idle / Light / Casual / Engaged / Stress
- 24 hours
- 100 control + 100 candidate runs
- three Shatters
- production Road, Auto Training, hordes, and catacombs
- zero simulation errors

Use the candidate production path with no ATK override for the candidate arm. Use the isolated x1.7 override only for the control arm.

Do not reuse seeds 1-30 in the primary validation scorecard. They may be summarized separately as prior diagnostic evidence.

# Required Results

Report median / P90, counts with denominators, and paired deltas for:

- Ironvein first-try, attempts, maximum loss streak, combat stall, retry stall, and total stall;
- active-window and Auto-Cast Warlord attempts and wins;
- Warlord ordinary hits, charge telegraphs, charge hits/kills, parries, interrupts, loss phase/HP, and win survivors/HP;
- arrival level, power, HP, charge, Surge, and activity window;
- every early-Road boss first-try, attempts, stall, and clear time;
- zones cleared at 20 and 24 hours and party level at 24 hours;
- time to the sixth zone, including censored/not-reached runs;
- ordinary and boss defeats and rewalk fights/hours;
- ordinary rewalk fights/hours by zone;
- hours spent in each zone;
- rewalk fights and estimated hours per hour of exposure in each zone;
- Auto Training triggers, returns, hours/share, levels earned, and zone;
- horde and catacomb outcomes;
- ability casts and active/Auto-Cast damage share.

For Stress, report results as an exploit/ceiling benchmark. Do not tune toward continuous tapping.

# Validation Gate

Approve x1.2 for final lock only if all are true:

- idle first-try is 10-35%;
- idle median attempts are 2-4 and P90 <=8;
- idle total Ironvein stall improves at least 30%;
- idle Auto-Cast attempt efficiency materially improves, with at least 15 percentage points of pooled improvement or an equivalent reduction in losing attempts per clear;
- light first-try is 20-45%;
- light median attempts are <=3 and P90 <=6;
- light total Ironvein stall improves at least 20%;
- active-window Warlord win rate stays below 95% for light and casual;
- Warlord produces losses in idle, light, and casual;
- charge remains lethal enough to preserve reaction value and is not indirectly disabled;
- Stillwater and Thornwood remain within their locked bands;
- no profile declines in median zones cleared at 20 or 24 hours;
- no downstream median clear time worsens more than 10% or P90 more than 15%;
- raw total defeats do not worsen more than 10%;
- within-zone ordinary rewalk fights/hours per hour of exposure do not worsen more than 10% in any adequately sampled zone;
- no Auto Training, horde, catacomb, telemetry, or mechanical regression appears.

A raw engaged 24-hour rewalk increase is acceptable only if all three are true:

- the within-zone exposure-normalized rewalk rate remains within 10%;
- median progression is faster or unchanged; and
- total defeats remain within 10%.

Do not excuse a within-zone regression merely because the candidate progresses farther.

# Decision Rules After Validation

- If all gates pass: propose locking Warlord ATK x1.2 and removing the control-only validation override.
- If x1.2 fixes idle/light but active light or casual reaches 95%+: do not ship; return for reviewer judgment.
- If within-zone rewalk cost worsens beyond 10%: reject x1.2 and retain x1.7.
- If the primary effect fails to reproduce: reject x1.2 and retain x1.7.
- Do not test x1.0 automatically.
- Do not return to Auto-Cast reactions without new evidence.
- Do not begin a global enemy-ATK curve change in this pass.

# Locked Systems

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

- Do not merge or ship x1.2 before review of Pass 14.
- Do not change charge damage, Warlord HP/DEF/speed, ward, summons, or adds.
- Do not revive Auto-Cast reactions.
- Do not alter Auto Training.
- Do not test another Warlord ATK value.
- Do not change the global enemy ATK curve.
