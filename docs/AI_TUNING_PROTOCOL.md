# Crystal Road AI Tuning Protocol

## Roles
- **Developer AI**: implements isolated tuning changes, runs simulations, commits code/results, and updates `docs/AI_HANDOFF.md`.
- **Reviewer AI (ChatGPT)**: reviews the latest handoff and relevant commits, then writes the next approved tuning instructions to `docs/AI_REVIEW.md`.

## Developer loop
1. Read `docs/AI_REVIEW.md` and only act when `STATUS: READY` and `REVIEW_FOR_PASS` is newer than the last review already applied.
2. Implement the requested isolated change(s). Do not introduce unrelated balance changes.
3. Run the requested simulation tier.
4. Analyze results, but do not silently broaden scope. If a bug invalidates telemetry, fix the bug, document it, and rerun the smallest diagnostic needed.
5. Commit code and simulator changes.
6. Replace `docs/AI_HANDOFF.md` with the latest pass summary and set `STATUS: READY_FOR_REVIEW`.
7. Push the handoff commit.
8. Poll `docs/AI_REVIEW.md` periodically. When a new review for the current pass appears, continue from step 1.

## Handoff requirements
Always include:
- `PASS_ID`
- `BUILD`
- exact code/balance changes made
- currently locked values/systems
- simulator configuration and seed count
- raw/compact result tables
- bugs or measurement caveats discovered
- your interpretation
- proposed next action, clearly labeled as a proposal rather than an applied change
- commit SHA(s)

## Guardrails
- Change one independent balance lever at a time whenever possible.
- Never tune around known-bad telemetry.
- Prefer production game logic in the simulator; avoid simulator-only balance behavior.
- Do not optimize around the continuous 2 taps/sec stress profile; it is a ceiling/exploit benchmark.
- Keep seeds paired between variants whenever possible.
- Do not change systems listed as locked in the current review.
- If a proposed change could alter progression globally, prefer a local mechanic/stat fix when the problem is local.
- Stop and request review rather than making a large redesign, adding a new currency/system, changing monetization, deleting content, or making an irreversible progression/save-format change.

## Simulation tiers
### QUICK DIAGNOSTIC
- 5–10 paired seeds
- relevant profiles only
- about 10–30 full runs, or boss-harness equivalent
- use while investigating causes or comparing candidates

### VALIDATION
- 20 paired seeds x 5 profiles
- 100 total runs
- use after a candidate change looks correct

### FULL REGRESSION
- 50+ seeds and/or longer-duration runs
- use only for major balance milestones or release validation

Always use the smallest tier that can answer the current question.
