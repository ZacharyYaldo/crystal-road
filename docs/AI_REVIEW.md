STATUS: READY
REVIEW_FOR_PASS: PASS_7_VALIDATION

# Reviewer Decision

Proceed with Variant G as the production-validation candidate.

## Apply
- Stillwater Alpha HP x0.55
- Stillwater Alpha ATK x0.70
- Summoned werewolf HP x0.75
- Summoned werewolf ATK x0.85

## Keep locked
- 1 werewolf at 60%
- Howl at 30%
- Auto Training logic and exploit protections
- boss cadence 9
- Tap damage x0.22
- all other zone/boss values

## Validation goal
Use the full production Road simulation as authoritative. Do not manually blend boss-harness Active/Auto results.

Run VALIDATION:
- 20 paired seeds x 5 profiles x 24h
- Idle / Light / Casual / Engaged / Stress

Report:
- Stillwater first-try %, median/P90 attempts, real streak, stall, clear time, level at first attempt/clear, HP/charge at first attempt, Auto Training triggers before clear
- downstream Thornwood/Ironvein/Emberwaste/Amberfall arrival level, first-try %, attempts, clear time, Auto Training triggers
- Ironvein/Emberwaste clear time, first T1, first Legendary, first Shatter, throughput vs Idle
- Auto Training triggers by zone, time spent training, level gain, win-rate before/after

## Decision rules after validation
- Casual Stillwater target: ~15–40% first-try
- Engaged: ~20–45%
- Median attempts: ~1–3
- P90 attempts: preferably <=4–5
- Idle may be easier (~40–70%) and that is acceptable

If Stillwater is too easy, first try increasing Alpha HP while keeping ATK 0.70 (0.58, then 0.60). Do not immediately raise ATK.

If Stillwater is still too hard, inspect pre/post-summon loss location and arrival HP before changing Auto Training or global XP.

Do not retune downstream bosses in the same pass; measure propagation only.

## SIM RUN GUIDELINES
QUICK DIAGNOSTIC
- 5–10 paired seeds
- relevant profiles only
- ~10–30 total runs / boss-harness equivalent

VALIDATION
- 20 paired seeds x 5 profiles
- 100 total runs

FULL REGRESSION
- 50+ seeds and/or longer-duration runs
- major milestones/release only

Always keep seeds paired between variants where possible.
