STATUS: READY
REVIEW_FOR_PASS: PASS_30_FOUNDRY_CORE_VOLLEY_CANDIDATE
REVIEWED_HANDOFF_PASS: PASS_29_FOUNDRY_CORE_ATK_CANDIDATE
REVIEWED_HANDOFF_SHA: e9de63abf942122753cefbf01645f03040c406bf
BASE_COMMIT: fd803889cf30264d00f48e9ced8196b745847de5
CONFIDENCE: HIGH

# Decision

Reject the Foundry Core base-ATK `1.5` candidate as a standalone balance change. Keep production Foundry Core ATK at `2.2`.

The candidate fails the primary player-facing requirement:

- idle Auto-Cast improved only from 1/736 to 2/703 wins;
- only 2 of 10 idle seeds cleared, both during the final three hours of the 96-hour horizon;
- idle median attempts remained 75 and idle remained effectively trapped in Foundry;
- light and casual active play moved close to a formality, with median attempts falling to 2 and first-attempt clears appearing in 2/10 and 4/10 runs.

Do not test another Foundry Core base-ATK value.

Pass 29 also establishes a genuine mechanical failure, which is the pacing-policy exception for one final Core experiment before moving on. The Core's ranged charged volley uses the global unreacted multiplier `2.2` against every living hero. At Core ATK `1.5`, ordinary attacks become survivable enough to expose the volley, but each volley still deals roughly 190-290% of a hero's HP. Idle then absorbs about 4.2 volley hits and 3.5 volley kills per attempt. Active play can parry or interrupt the telegraph; Auto-Cast has no equivalent response because `AUTO_REACT` is locked off.

The evidence therefore supports one coupled, Core-specific mechanic hypothesis: retain the already measured Core ATK `1.5` candidate and reduce only the Core's unreacted ranged-volley multiplier to the existing parried value `0.9`. This targets the measured active-versus-idle asymmetry without changing global charge behavior or reopening ATK sizing.

This is the second and final Core candidate pass after diagnosis. After Pass 30, lock or reject the coupled Core package and move to Endless Road. Do not run another Core value, mechanic, or confirmation batch unless human escalation explicitly authorizes it.

# Production State

Keep these accepted production values:

- Ashen Keep Hollow King `ENEMIES.necromancer.atk = 1.3`;
- Foundry Core `ENEMIES.core.atk = 2.2`;
- global unreacted ranged-charge multiplier `2.2`;
- global parried ranged-charge multiplier `0.9`;
- `AUTO_REACT = false`.

The Hollow King production lock is valid: the source contains `1.3`, the rebuilt bundle reproduces Pass 28 in all 40 paired runs, and the separate lord-cycle `hollowking` entry remains unchanged.

# Pass 30 Candidate

Test one simulator-only coupled Foundry Core candidate:

- Foundry Core base ATK: `2.2 -> 1.5`;
- Foundry Core unreacted ranged-volley multiplier: `2.2 -> 0.9`;
- the existing parried multiplier remains `0.9`;
- every other Core field and mechanic remains unchanged;
- production source and bundle remain at Core ATK `2.2` and global unreacted ranged-charge `2.2`.

Implement the volley override only in the simulator candidate copy. It must apply only when the attacking enemy is the Foundry Core. Do not change the production combat function and do not affect ranged charges from any other enemy, elite, lord, delve, horde, or Endless encounter.

Reuse the completed Pass 29 Core-ATK-`1.5` batch as the fixed baseline. Do not rerun its 40 control runs.

Run one candidate batch:

- seeds 51-60;
- idle, light, casual, and engaged profiles;
- 96 simulated hours;
- 40 candidate runs total;
- production build `20260911-174928`;
- Hollow King ATK `1.3`;
- simulator-only Core ATK `1.5`;
- simulator-only Core unreacted ranged-volley multiplier `0.9`;
- post-Shatter HP/ATK factor `1.10`;
- post-Shatter DEF factor `1.10`;
- `--stallRule far --stallHours 3`;
- `--shatters 3` as a cap, with no early stop;
- Pass 22 dust policy;
- literal Pass 24 ascension policy;
- Ashen Keep level `50`;
- zero simulation errors.

# Validity Gate

Before interpreting balance, demonstrate:

- all 40 candidate runs reach 96 simulated hours within one simulation step;
- no run exceeds three Shatters or stops merely because it reaches three;
- each paired candidate matches its Pass 29 ATK-`1.5` baseline exactly through the first Foundry Core charged-volley telegraph;
- Foundry Core ATK remains `1.5` in both compared arms;
- the first and only candidate-arm divergence is the Core's unreacted ranged-volley damage multiplier `0.9` instead of `2.2`;
- parried Core volleys remain at `0.9`;
- Core ordinary attacks, HP, DEF, speed, charge cadence, target count, shield, summons, rewards, and all other fields are identical;
- every non-Core ranged charge retains the production unreacted multiplier `2.2`;
- the production source and bundle remain unchanged during this candidate;
- Hollow King rows and all progression through Foundry entry remain identical.

If any gate fails, stop balance interpretation and report the defect. Do not run a replacement batch without review.

# Required Evidence

Report paired candidate-versus-Pass-29-candidate results by profile and run number for:

- Foundry entry and first Core-attempt hour, party level/power, attempts, wins, and stall-to-clear or horizon;
- Auto-Cast and active-window attempts/wins separately;
- first-attempt clears;
- loss duration, Core HP remaining, hero deaths, and survivors/party HP on wins;
- ordinary-hit damage, charged-volley hits, damage, kills, damage as a percentage of target max HP, and parried/unparried counts;
- opening, charged-volley, first-summon, and later-summon loss phases;
- Core and summon damage shares;
- Foundry clear hour, time in Foundry, and ordinary encounter loss rate;
- Endless entry hour and time in zone where reached;
- current/best zone at 24, 48, 72, and 96 hours;
- total defeats, training time, party level/power, earned/spent gold and ore, and final state;
- paired outliers, especially idle clears and active first-attempt clears.

Explicitly audit at least one non-Core ranged-charge encounter to prove its unreacted multiplier remains `2.2`.

# Candidate Rule

Treat the coupled Core candidate as promising only if these outcomes hold together:

- idle is no longer effectively trapped: at least half of idle seeds clear the Core within 96 hours and attempts/stall fall materially from the Pass 29 ATK-`1.5` arm;
- the median unreacted Core volley no longer kills a full-health hero outright, and volley kills per idle attempt fall materially;
- light, casual, and engaged remain meaningfully interactive rather than broadly automatic;
- no active profile exceeds 90% attempt win rate;
- active first-attempt clears do not exceed half of seeds in any profile;
- the fight still reaches its charge and summon mechanics;
- ordinary Foundry pacing and all earlier Road progression remain intact;
- downstream progression does not show a severe collapse.

Reject the coupled candidate if idle still remains effectively blocked, or if active play becomes broadly automatic. A secondary percentage narrowly missing a threshold is not grounds for another Core pass; weigh clear reach, attempts, stall, fight phases, volley lethality, and active-versus-idle experience together.

# Next Step After Pass 30

Pass 30 ends Foundry Core tuning for this cycle.

- If promising, the next review will lock the coupled Core package without an extra confirmation run unless release confidence genuinely requires fresh seeds.
- If rejected, keep production Core at `2.2`, record the idle wall as an explicit unresolved design limitation, and move on.
- In either case, the next material systems target is Endless Road economy acceleration.

The existing Endless diagnosis remains open: time-normalized gold per kill rose about 16x over 24 hours, party power rose about 8x, and deaths per hour stayed flat. Do not change Endless in Pass 30.

# Locked Systems

Keep locked:

- Hollow King base ATK `1.3` and all other Hollow King fields;
- production Foundry Core ATK `2.2` pending review;
- production global charge multipliers and `AUTO_REACT = false`;
- Foundry Core HP, DEF, speed, charge cadence, target count, shield, summons, rewards, and every other mechanic;
- ordinary Foundry enemies, level, fight count, and rewards;
- Endless Road level, reward, Renown, Omen, enemy, pacing, and economy formulas;
- post-Shatter enemy HP/ATK multiplier `1.10`;
- post-Shatter enemy DEF multiplier `1.10`;
- Ashen Keep base level `50`, ordinary enemy pool, fight count, and rewards;
- every Shatter availability, gain, blessing cost/effect, dust priority, and far-mark stall rule;
- production gear ranks, item stats, ascension costs/caps, drop ranks, ore economy, and upgrade formulas;
- Auto Training target `1.0`, threshold `4`, and all Auto Training behavior;
- Warlord ATK x1.2, Sand Tyrant ATK x1.1, Hunter King ATK x1.0, and Grave Knight ATK x2.0;
- all other boss stats, ordinary enemy stats, zone levels, global curves, progression, economy, tap, rarity, promotion, travel, recovery, UI, and save-format systems.

# What Not To Do

- Do not change production Core gameplay code or rebuild the bundle.
- Do not test another Core base-ATK value.
- Do not test another Core volley multiplier.
- Do not change volley cadence or target count.
- Do not enable Auto-Reaction or change Auto-Cast.
- Do not change Core HP, DEF, speed, shield, summons, rewards, or mechanics beyond the candidate override.
- Do not tune Endless Road in Pass 30.
- Do not rerun the Pass 29 baseline.
- Do not add seeds, profiles, hours, control arms, stress profiles, or a confirmation batch.
- Do not merge or ship before review.
