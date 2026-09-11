# Crystal Road AI Tuning Protocol

## Roles
- **Developer AI**: implements isolated tuning changes, runs simulations, commits code/results, and updates `docs/AI_HANDOFF.md`.
- **Reviewer AI (ChatGPT)**: reviews the latest handoff and relevant commits, then writes the next approved tuning instructions to `docs/AI_REVIEW.md`.

## Persistent tuning pull request
- The active autonomous tuning loop uses the persistent branch `ai-tuning-loop` and its open pull request into `main`.
- Keep the pull request open while tuning is active.
- The Developer AI commits implementation, simulator, and `docs/AI_HANDOFF.md` changes to `ai-tuning-loop`.
- The Reviewer AI is the single writer for `docs/AI_REVIEW.md` and commits review updates to `ai-tuning-loop` only.
- Each new commit on the pull request branch emits a synchronize event that may wake the reviewer.
- A synchronize event authorizes a review only when `docs/AI_HANDOFF.md` has `STATUS: READY_FOR_REVIEW`, its `PASS_ID` / `HEAD_COMMIT_SHA` has not already been reviewed, and the handoff is newer than `docs/AI_REVIEW.md`.
- If any guard fails, the reviewer performs no write and exits. This prevents the reviewer's own `AI_REVIEW.md` commit from creating a review loop.
- Exactly one enabled Systems/Balance Reviewer may write `docs/AI_REVIEW.md`.

## Developer loop
1. Read `docs/AI_REVIEW.md` and only act when `STATUS: READY` and `REVIEW_FOR_PASS` is newer than the last review already applied.
2. Implement the requested isolated change(s). Do not introduce unrelated balance changes.
3. Run the requested simulation tier.
4. Analyze results, but do not silently broaden scope. If a bug invalidates telemetry, fix the bug, document it, and rerun the smallest diagnostic needed.
5. Commit code and simulator changes.
6. Replace `docs/AI_HANDOFF.md` with the latest pass summary and set `STATUS: READY_FOR_REVIEW`.
7. Push the handoff commit to `ai-tuning-loop`. The pull-request synchronize event wakes the reviewer.
8. Wait for a newer `docs/AI_REVIEW.md` commit on `ai-tuning-loop`. When it appears, continue from step 1.

## Handoff requirements
Always include:
- `PASS_ID`
- `BUILD`
- `HEAD_COMMIT_SHA`
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
