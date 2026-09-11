STATUS: READY
REVIEW_FOR_PASS: PASS_29_FOUNDRY_CORE_ATK_CANDIDATE
REVIEWED_HANDOFF_PASS: PASS_28_HOLLOW_KING_ATK_CANDIDATE
REVIEWED_HANDOFF_SHA: 5b06bfc027562160fb7f22bfe70de98203b1cfad
BASE_COMMIT: cbc1f4d255ca7e70cd4e27ee90786b8a29c5a6a2
CONFIDENCE: HIGH

# Decision

Accept the Pass 28 candidate and lock the Ashen Keep Hollow King base ATK at `1.3`.

The literal two-digit idle Auto-Cast criterion was not met: the candidate reached 5.1% (10/198), up from 1.7% (10/596). That numerical miss does not justify another Hollow King sizing or confirmation loop because the player-facing and causal outcomes are already clear:

- idle median attempts fell from 59 to 18;
- idle median stall fell from 10.3 to 6.4 hours, a 38% reduction, with all 10 paired idle seeds improving;
- light, casual, and engaged active win rates remained contested at 33%, 24%, and 16%;
- there were no first-attempt clears in any of the 40 runs;
- opening-phase losses fell from 381 to 83 across all profiles;
- attempts reached the intended summon phases more often and losses lasted longer;
- all 40 pairs matched exactly through first Ashen Keep entry;
- no severe downstream collapse appeared.

This is sufficient under the pacing policy. Hollow King ATK tuning is closed. Do not test another Hollow King ATK value.

The next largest player-facing wall is the Foundry Core. Pass 28 moved parties into Foundry earlier, but the Core remained effectively impassable for idle and highly restrictive for active profiles. The same damage-per-action mechanism persists: arriving heroes survive only about 0.5-0.8 ordinary hits, attempts end early with 80-88% boss HP remaining, and Auto-Cast produced only one Core win across roughly 900 attempts. Ordinary Foundry encounters are not the bottleneck.

The Endless Road acceleration remains a confirmed systemic issue and stays next in whole-game triage. It is not part of Pass 29.

# Production Lock

Implement only this accepted production change:

- `ENEMIES.necromancer.atk` (Ashen Keep Hollow King): `1.7 -> 1.3`;
- rebuild the production bundle normally;
- keep the distinct lord-cycle `ENEMIES.hollowking.atk` entry unchanged;
- do not change any other Hollow King field or mechanic.

Demonstrate that the source and bundle agree and that no unrelated production gameplay value changed.

# Pass 29 Candidate

Test only the Foundry Core base ATK:

- target `ENEMIES.core.atk`;
- baseline `2.2`;
- candidate `1.5`;
- simulator override only for the candidate;
- production Foundry Core remains `2.2` pending review.

The `1.5` candidate is a single bounded hypothesis. It is a roughly 32% reduction, intentionally somewhat larger than the Hollow King reduction because the Core arrives at a harsher 0.5-0.8 hits-to-defeat, adds a charge, and remains the only unresolved idle progression failure after the Hollow King improvement. Core HP, DEF, speed, charge, shield, summons, rewards, and every other field stay unchanged.

Reuse the completed Pass 28 ATK-1.3 batch as the fixed baseline. Do not rerun its 40 control runs.

Run one candidate batch:

- seeds 51-60;
- idle, light, casual, and engaged profiles;
- 96 simulated hours;
- 40 candidate runs total;
- the newly locked production Hollow King ATK `1.3`;
- post-Shatter HP/ATK factor `1.10`;
- post-Shatter DEF factor `1.10`;
- `--stallRule far --stallHours 3`;
- `--shatters 3` as a cap, with no early stop;
- Pass 22 dust policy;
- literal Pass 24 ascension policy;
- Ashen Keep level `50`;
- zero simulation errors.

Keep the 96-hour horizon. A 72-hour run would truncate late idle Core arrivals and would not answer whether idle can leave Foundry.

# Validity Gate

Before interpreting balance, demonstrate:

- all 40 candidate runs reach 96 simulated hours within one simulation step;
- no run exceeds three Shatters or stops merely because it reaches three;
- the production Hollow King source and bundle are both exactly `1.3`;
- the separate lord-cycle `hollowking` entry remains unchanged;
- each paired candidate matches its Pass 28 baseline exactly through the first Foundry Core attempt;
- Foundry Core HP, DEF, speed, charge, shield, summons, rewards, and all non-ATK fields are unchanged;
- the only candidate-arm gameplay divergence begins when the Foundry Core uses ATK `1.5` instead of `2.2`;
- every earlier boss and locked system retains its approved value.

If any gate fails, stop balance interpretation and report the defect. Do not run a replacement batch without review.

# Required Evidence

Report paired candidate-versus-Pass-28-baseline results by profile and run number for:

- Core entry hour, party level/power, estimated hits-to-defeat, attempts, wins, and stall-to-clear or horizon;
- Auto-Cast and active-window attempts/wins separately;
- loss duration, Core HP remaining, hero deaths, and survivors/party HP on wins;
- opening, charge, first-summon, and later-summon loss phases;
- Core and summon damage shares;
- Foundry entry/clear hour, ordinary progression, and total time in Foundry;
- Endless entry hour and time in zone where reached;
- current/best zone at 24, 48, 72, and 96 hours;
- total defeats, training time, party level/power, earned/spent gold and ore, and final state;
- paired outliers and any early first-attempt Core clears.

Also prove the accepted Hollow King production lock reproduces the Pass 28 candidate behavior before the Core divergence.

# Candidate Rule

Treat Core ATK `1.5` as promising only if the player-facing results show these outcomes together:

- idle is no longer effectively trapped in Foundry: Core attempts fall materially and multiple idle seeds clear within 96 hours;
- light, casual, and engaged Core fights remain contested, with active win rates below 90% and no broad first-attempt clearing;
- opening wipes fall materially and more attempts reach the charge/summon mechanics;
- ordinary Foundry pacing and all earlier Road progression remain intact;
- downstream progression does not collapse into automatic Core clears or a severe Endless jump.

Reject `1.5` if idle remains effectively blocked or if active Core clears become broadly automatic. Do not test a second Core ATK value after this candidate.

A secondary percentage narrowly missing a threshold is not grounds for another sizing pass. Weigh clear reach, stall time, attempts, fight phases, active-versus-idle experience, and downstream progression together. The next review will lock or reject this candidate, with one final fresh-seed validation allowed only if release confidence genuinely requires it.

# Locked Systems

Keep locked:

- Hollow King base ATK `1.3` after implementing the production lock;
- every other Hollow King stat, summon, reward, and mechanic;
- production Foundry Core ATK `2.2` pending candidate review;
- every other Foundry Core stat, summon, reward, and mechanic;
- ordinary Foundry enemies, level, fight count, and rewards;
- Endless Road level, reward, Renown, Omen, enemy, pacing, and economy formulas;
- post-Shatter enemy HP/ATK multiplier `1.10`;
- post-Shatter enemy DEF multiplier `1.10`;
- Ashen Keep base level `50`, ordinary enemy pool, fight count, and rewards;
- every Shatter availability, gain, blessing cost/effect, dust priority, and far-mark stall rule;
- production gear ranks, item stats, ascension costs/caps, drop ranks, ore economy, and upgrade formulas;
- Auto Training target `1.0`, threshold `4`, and all Auto Training behavior;
- Warlord ATK x1.2, Sand Tyrant ATK x1.1, Hunter King ATK x1.0, and Grave Knight ATK x2.0;
- all other boss stats, ordinary enemy stats, zone levels, global curves, progression, economy, tap, rarity, promotion, travel, recovery, UI, and save-format systems;
- `AUTO_REACT = false`.

# What Not To Do

- Do not test another Hollow King value or rerun Pass 28.
- Do not change production Foundry Core ATK yet.
- Do not test a second Core ATK value.
- Do not change Core HP, DEF, speed, charge, shield, summons, rewards, or mechanics.
- Do not tune Endless Road in Pass 29.
- Do not change Auto-Cast, Auto Training, Shatter, dust, gear, ascension, or economy behavior.
- Do not add seeds, profiles, hours, control arms, stress profiles, or a confirmation batch.
- Do not merge or ship before review.

# Identity Note

The Pass 28 handoff records `HEAD_COMMIT_SHA: 5b06bfc027562160fb7f22bfe70de98203b1cfad`, while the actual atomic commit containing the Pass 28 handoff, report, and report tool is `cbc1f4d255ca7e70cd4e27ee90786b8a29c5a6a2`. The reviewed-handoff metadata preserves the handoff's declared SHA for loop identity, and `BASE_COMMIT` records the actual reviewed PR head. Future handoffs should set `HEAD_COMMIT_SHA` to the commit that contains the implementation/results being handed off, or use a dedicated results commit followed only by a handoff-doc commit.
