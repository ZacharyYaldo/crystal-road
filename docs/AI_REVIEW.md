STATUS: READY
REVIEW_FOR_PASS: PASS_17_LATE_BOSS_ATK_NORMALIZATION_CANDIDATE
REVIEWED_HANDOFF_PASS: PASS_16_SAND_TYRANT_ATK_CANDIDATE
REVIEWED_HANDOFF_SHA: 036e34d66b7bfc4939f1728943c6f33cb54ddfaa
BASE_COMMIT: e7906f36a3f8c871158c7faaa45b6291369f64bd
CONFIDENCE: HIGH

# Decision

Do not lock Sand Tyrant ATK x1.35.

Accept the developer's counterproposal in principle: the evidence now supports one scoped late-boss ATK-normalization experiment instead of another Sand-only pass followed by a separate Hunter King cycle.

Pass 16 established:

- x1.35 is causal and improves idle attempts in all 10 paired seeds;
- idle attempts fall 22 -> 7 and maximum streak 21 -> 6;
- idle Auto-Cast efficiency rises 4.6% -> 14%;
- idle stall improves only 28%, short of the good-enough target;
- light does not improve and its distribution becomes less stable;
- candidate losses simply move into the summon phase while charge kills remain extremely high;
- upstream systems remain unchanged;
- production still correctly remains at x1.9.

This is useful diagnostic evidence, but x1.35 is not a finished balance point. Do not ship it as an interim value and do not run another x1.35 batch.

# System-Level Finding

The later bosses show the same worsening damage-per-action curve:

- locked Warlord: about 2.3 front-hero ordinary hits to defeat and charge around 121% of front-hero HP;
- Sand Tyrant x1.9: about 1.3 hits and 208% charge damage;
- Hunter King x2.0: about 1.0 hit and 221% volley damage at idle arrival;
- Grave Knight x2.0: about 0.6 hit and roughly 415% charge damage in the limited casual data.

The problem is not merely one bad Sand Tyrant constant. Boss ATK scaling is outpacing natural hero durability after Ironvein. Treat the next test as one design lever: normalize post-Ironvein boss damage to the locked Warlord's contested-fight shape.

Grave Knight remains excluded because it is tied to the Shatter wall and lacks adequate realistic-profile evidence.

# Authorized Candidate

Use simulator-only overrides:

- Sand Tyrant base ATK: x1.9 -> x1.1;
- Hunter King base ATK: x2.0 -> x1.0;
- Grave Knight: unchanged.

These are one scoped rule-based candidate, not two independently tuned values. They target approximately 2.3 front-hero ordinary hits to defeat at natural realistic arrival.

Keep the production enemy table unchanged until review.

# Pass 17 Test

Run:

- paired seeds 31-40;
- idle, light, and casual;
- 48 hours so Emberwaste and Amberfall are both meaningfully observed;
- 30 control + 30 candidate runs;
- production Road, normal Auto Training, hordes, and catacombs;
- zero simulation errors.

Do not add other ATK arms, values, or a separate sizing harness. Do not run Stress as a tuning target.

Use the corrected ranged-volley telemetry. Validate it with the smallest focused replay needed; do not create a separate full batch for instrumentation.

# Required Results

For Sand Tyrant and Hunter King, report:

- reach and clear counts;
- first-try clears;
- attempts and maximum loss streak;
- combat, retry, and total stall;
- Auto-Cast and active-window wins/attempts;
- ordinary hits;
- charge/volley telegraphs, hits, kills, parries, and interrupts;
- summon reached and loss boss-HP distribution;
- winning survivors and party HP;
- arrival level, power, hero HP/DEF, charge, and Surge;
- actual boss ATK and calculated hits-to-defeat at first attempt.

For the Road, report:

- per-zone median/P90 clear times;
- zones cleared at 24h, 36h, and 48h;
- ordinary and boss rewalk burden by zone;
- Auto Training hours and triggers by source zone;
- total defeats;
- upstream locked-boss outcomes;
- downstream results only where reach counts are adequate;
- hordes, catacombs, and simulation errors.

Use paired direction/counts where distributions are bimodal. Keep reach denominators visible.

# Good-Enough Decision Criteria

The combined candidate is promising if:

Sand Tyrant:

- idle median attempts are 1-4 and P90 <=8;
- idle stall improves at least 40%;
- idle Auto-Cast no longer has a low-single-digit win rate;
- light median attempts are <=3 and P90 <=6;
- idle, light, and casual still record losses;
- active-window win rates for light and casual stay below 95%.

Hunter King:

- idle and light no longer show execution-wall attempt counts when adequately reached;
- Auto-Cast viability materially improves from its current low-single-digit rate;
- light and casual active-window win rates stay below 95%;
- the fight still produces losses in realistic profiles;
- ranged volley remains meaningfully lethal but no longer dominates every attempt.

Whole Road:

- Stillwater, Thornwood, Ironvein, and their locked bosses remain identical;
- no adequately sampled downstream median clear time worsens more than 10% or P90 more than 15%;
- no profile regresses in median zones cleared at 24h, 36h, or 48h;
- total defeats do not worsen more than 10%;
- no material Auto Training, horde, catacomb, telemetry, or mechanical regression appears.

Do not require every secondary percentage to hit a theoretically perfect band. The player-facing question is whether both bosses become contested progression checks instead of repeated execution walls while active play retains an advantage.

# Decision After Pass 17

Pass 17 is the one adequately sized candidate test for this scoped rule.

If the primary effect is clear and regressions are absent, propose locking both values directly. Do not add separate Sand Tyrant and Hunter King confirmation passes.

Request one final validation only if the combined change produces genuinely ambiguous results or if release confidence specifically requires it. Otherwise lock or reject and move to the next whole-Road bottleneck.

# Locked Systems

Keep locked:

- Warlord ATK x1.2 and all other Warlord mechanics;
- Sand Tyrant HP x6.5, DEF x1.0, speed 10, charge x2.5, enrage at 25%, summon at 50%, and two sandorcs;
- Hunter King HP x6.0, DEF x0.9, speed 11, volley x2.2, summon at 60%, and two skeleton archers;
- Grave Knight and every other boss;
- ordinary enemies and global enemy curves;
- AUTO_REACT = false;
- all Auto Training constants and protections;
- all previously locked progression, economy, tap, Renown, rarity, promotion, travel, recovery, and UI systems.

# What Not To Do

- Do not put x1.35 into production.
- Do not change production Sand Tyrant or Hunter King values before review.
- Do not tune the two bosses independently in this pass.
- Do not change HP, charge/volley, summons, adds, enrage, speed, or DEF.
- Do not change Grave Knight or the Shatter wall.
- Do not add another sizing or confirmation phase.
- Do not tune toward Stress.
