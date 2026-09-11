STATUS: READY
REVIEW_FOR_PASS: PASS_28_HOLLOW_KING_ATK_CANDIDATE
REVIEWED_HANDOFF_PASS: PASS_27_POST_KEEP_PROGRESSION_DIAGNOSTIC
REVIEWED_HANDOFF_SHA: fce0f266f2713848db5997ec2f8e93696cab8ce6
BASE_COMMIT: 671c898699da59b4cf440297a29b69440cfb3e48
CONFIDENCE: HIGH

# Decision

Accept the Pass 27 ranking and causal diagnosis.

The immediate priority is the repeated post-Keep boss damage-per-action wall, beginning with the Hollow King and then recurring at the Foundry Core. This ranks ahead of Endless Road for the next test because it creates the largest repeated player-facing delay across all four profiles and the only unresolved non-interactive failure state:

- Hollow King stalls were 7-15 hours across profiles;
- idle required 596 Auto-Cast attempts for 10 clears;
- the Foundry Core then produced 0 wins in 766 idle Auto-Cast attempts, leaving every idle run in Foundry at 96 hours;
- boss attacks supplied 94-97% of damage in Hollow King losses;
- many active losses ended before the first summon, and armored skeleton damage was negligible;
- ordinary Foundry progression was not the wall.

The evidence rejects summon count, summon damage, and drain as the primary Hollow King mechanism. The boss's own AoE damage gives arriving heroes only 0.4-1.1 ordinary hits to defeat. A direct boss-ATK candidate is justified.

The Endless Road is a confirmed high-priority systemic issue, not dismissed. Time-normalized gold per kill rose about 16x over 24 hours, party power rose about 8x, and deaths per hour stayed flat. That is accelerating progression without increasing resistance. It does not rank first for this pass because it produces no stall and is not reached by idle, but it must remain open for whole-game triage after the bounded boss candidate. Do not describe the whole game as tuned or ready to ship.

# Pass 28 Candidate

Test only the Ashen Keep Hollow King's base ATK multiplier:

- target the Ashen Keep boss entry `ENEMIES.necromancer.atk`;
- baseline `1.7`;
- candidate `1.3`;
- simulator override only;
- production source and bundle remain at `1.7`;
- do not alter the separate `ENEMIES.hollowking` lord entry.

Reuse the completed Pass 27 production batch as the fixed baseline. Do not rerun or duplicate its 40 control runs.

Run one candidate batch:

- seeds 51-60;
- idle, light, casual, and engaged profiles;
- 96 simulated hours;
- 40 candidate runs total;
- production build `20260911-163721`;
- post-Shatter HP/ATK factor `1.10`;
- post-Shatter DEF factor `1.10`;
- `--stallRule far --stallHours 3`;
- `--shatters 3` as a cap, with no early stop;
- Pass 22 dust policy;
- literal Pass 24 ascension policy;
- Ashen Keep level `50`;
- zero simulation errors.

This is one candidate test, not a new diagnostic and not a production implementation.

# Validity Gate

Before interpreting balance, demonstrate:

- all 40 candidate runs reach 96 simulated hours within one simulation step;
- no run exceeds three Shatters or stops merely because it reaches three;
- each paired candidate matches its Pass 27 baseline exactly through the first Ashen Keep entry;
- Hollow King HP, DEF, speed, drain, summon thresholds/counts/stats, rewards, and every non-ATK field are unchanged;
- the only gameplay divergence begins when the Ashen Keep `necromancer` boss uses ATK `1.3` instead of `1.7`;
- Foundry Core and all earlier bosses retain their locked production values;
- production source and bundle remain unchanged at Hollow King ATK `1.7`;
- the override does not affect the distinct lord-cycle `hollowking` entry.

If any gate fails, stop balance interpretation and report the defect. Do not run a replacement batch without review.

# Required Evidence

Report paired candidate-versus-Pass-27-baseline results by profile and run number for:

- Hollow King entry hour, party level/power, attempts, wins, and stall-to-clear;
- Auto-Cast and active-window attempts/wins separately;
- loss duration, boss HP remaining, hero deaths, and survivors/party HP on wins;
- opening, first-summon, and second-summon loss phases;
- boss, skeleton, and armored-skeleton damage shares;
- estimated hits-to-defeat at arrival;
- Keep clear hour and total time in Ashen Keep;
- Foundry entry hour, ordinary progression, Core attempts/wins, and final zone at 96 hours;
- Endless entry hour and time in-zone where reached;
- current/best zone at 24, 48, 72, and 96 hours;
- total defeats, training time, party level/power, earned/spent gold and ore, and final state;
- paired outliers, especially first-attempt Hollow clears or unusually large downstream time gains.

Do not rerun the Pass 27 baseline. Use its committed raw outputs directly.

# Candidate Rule

Treat `1.3` as promising only if the player-facing results show all of the following together:

- idle Hollow King Auto-Cast win rate reaches a meaningful two-digit percentage rather than remaining in the low single digits;
- idle median Hollow King stall falls by at least one third from the 10.3-hour baseline;
- light, casual, and engaged active Hollow King win rates remain below 90%;
- active profiles still show repeated losses and meaningful fight duration rather than broadly automatic or first-attempt clears;
- opening-phase wipes decline and more attempts reach the intended summon phases;
- earlier Road progression is identical and downstream progression does not reveal a severe collapse.

Reject `1.3` if idle remains effectively blocked, if the active profiles become broadly automatic, or if downstream progression collapses. Do not test another Hollow King ATK value after this candidate.

A secondary rate narrowly missing a threshold is not grounds for another sizing pass. Weigh stall time, attempts, active-versus-idle experience, fight phases, and downstream reach together. After this result, the next review will lock or reject the candidate, or authorize one final fresh-seed validation only if release confidence genuinely requires it.

# Locked Systems

Keep locked:

- production Hollow King ATK `1.7` pending review of the candidate;
- Hollow King HP, DEF, speed, drain, summons, rewards, and all other mechanics;
- Foundry Core stats and mechanics;
- Endless Road level, reward, renown, omen, enemy, pacing, and economy formulas;
- post-Shatter enemy HP/ATK multiplier `1.10`;
- post-Shatter enemy DEF multiplier `1.10`;
- Ashen Keep base level `50`, ordinary enemy pool, fight count, and rewards;
- every Shatter availability, gain, blessing cost/effect, dust priority, and far-mark stall rule;
- production gear ranks, item stats, ascension costs/caps, drop ranks, ore economy, and upgrade formulas;
- Auto Training target `1.0`, threshold `4`, and all Auto Training behavior;
- Warlord ATK x1.2, Sand Tyrant ATK x1.1, Hunter King ATK x1.0, and Grave Knight ATK x2.0;
- all ordinary enemy base stats, other boss base stats, zone levels, global level curves, progression, economy, tap, Renown, rarity, promotion, travel, recovery, UI, and save-format systems;
- `AUTO_REACT = false`.

# What Not To Do

- Do not change production gameplay code or rebuild the bundle.
- Do not rerun the Pass 27 baseline.
- Do not test a second Hollow King ATK value.
- Do not change summon count, summon stats, drain, HP, DEF, speed, or boss mechanics.
- Do not tune the Foundry Core or Endless Road in Pass 28.
- Do not change Auto-Cast, Auto Training, Shatter, dust, gear, ascension, or economy behavior.
- Do not add seeds, profiles, hours, control arms, stress profiles, or a confirmation batch.
- Do not merge or ship before review.
