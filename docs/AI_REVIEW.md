STATUS: READY
REVIEW_FOR_PASS: PASS_23_ASHEN_KEEP_LEVEL_CANDIDATE
REVIEWED_HANDOFF_PASS: PASS_22_SHATTER_DUST_POLICY_DIAGNOSTIC
REVIEWED_HANDOFF_SHA: 0c36d141c6d6ffb37961f208e60de82a5237ceb5
BASE_COMMIT: 79e6ebc6bbad2808ffc5ba339da788bb05fe7bac
CONFIDENCE: HIGH

# Decision

Accept the Pass 22 diagnostic.

The corrected bot spent Shatter dust as authorized and passed all 30 pre-first-Shatter audits with zero errors. It reduced remaining dust from roughly 40-46 to 5-7 and bought meaningful starting-level, HP, and damage blessings. That improved replay strength and Keep exposure, but it did not create a credible route through Ashen Keep:

- Ashen Keep clears remained 0/30;
- Hollow King remained 0/4, with no summon phase reached;
- ordinary Keep loss rates remained 26% idle, 38% light, and 54% casual;
- the third Shatter still left most runs replaying earlier zones at the 72-hour horizon.

Shatter behavior and dust-policy diagnostics are now closed. Do not test another spending priority, stall rule, duration, or Shatter count.

Agree with the developer's causal conclusion: the immediate wall is Ashen Keep as a whole. Parties often fail before fight 36, while the rare Hollow King attempts are also noncompetitive. A local zone-level test is the cleanest single lever because it moves the Keep's ordinary encounters and boss together without reopening Auto Training or separately polishing another boss multiplier.

# Pass 23: Ashen Keep Zone-Level Candidate

Test one candidate only:

- Ashen Keep base level: `50 -> 46`;
- simulator override only;
- do not modify `source/game.js` or the production bundle;
- keep the enemy pool, Hollow King definition, boss tuning, fight count, rewards formulas, Shatter values, and blessing values unchanged.

This is a candidate test, not approval to ship the value.

# Authorized Batch

Run one paired 30-run batch:

- seeds 31-40;
- idle, light, and casual;
- 72 hours;
- `--stallRule far`;
- `--stallHours 3`;
- up to three Shatters;
- the accepted Pass 22 dust policy;
- production Auto Training, hordes, catacombs, and every other gameplay value;
- zero simulation errors.

Use Pass 22 as the control. Do not rerun Pass 22 and do not reduce the Shatter cap to make the horizon cleaner.

Audit that each candidate run is identical to its paired Pass 22 control through its first Ashen Keep entry. At minimum, compare hourly state, Shatter timing, zone clears, Ashen Approach entry/clear, party level, wins, gold, and dust. Divergence is expected only after the candidate first enters Ashen Keep.

# Required Evidence

Report paired results by profile and seed, plus compact profile summaries:

- Ashen Keep entry count, hour, party level, and power by run;
- ordinary Keep encounters, wins, losses, loss rate, time in zone, furthest fight, and rewalk time;
- fight-36 reach and Hollow King attempts, wins, loss duration, HP remaining, summon phases reached, and party state;
- Keep clears and Foundry entries, including hour, level, and power;
- current-run and best-run zones cleared at 24h, 36h, 48h, and 72h;
- Shatter count, timing, location, and no-loop evidence;
- total defeats and training hours;
- XP, gold, ore, gear progression, and late-zone arrival strength.

The reward comparison is required because lowering enemy level also lowers per-kill XP, gold, and ore. Easier encounters are not a success if reduced rewards erase the downstream progression gain.

# Good-Enough Decision Rule

Judge the candidate on player-facing progression, not a perfect percentage target.

Accept the candidate direction if it materially advances parties through the Keep, produces repeated credible Hollow King contests or clears, and does not create a severe upstream or downstream regression. The Keep does not need a perfect clear rate.

Reject it if:

- ordinary Keep fights remain the same wall;
- the Keep becomes easier than Ashen Approach to a clearly trivial degree;
- Hollow King remains essentially untouched despite substantially more attempts; or
- lower rewards negate the progression gained from easier fights.

The developer's proposed seed-direction and boss-reach thresholds may be reported as supporting evidence, but they are not reasons for another confirmation batch.

After Pass 23, do not request another Ashen Keep sizing or confirmation run. Use the evidence to lock or reject this candidate. If the direction is clearly good, the next review should authorize the production value and move immediately to broad Foundry/Endless bottleneck triage rather than polishing the Keep further.

# Locked Systems

Keep locked:

- every Shatter gameplay value, blessing cost, blessing effect, stall rule, and dust priority;
- Hollow King HP, ATK, DEF, speed, summons, drain, and all direct boss mechanics;
- Ashen Keep enemy pool and fight count;
- Auto Training target 1.0, threshold 4, and every other Auto Training rule;
- Warlord ATK x1.2;
- Sand Tyrant ATK x1.1;
- Hunter King ATK x1.0;
- Grave Knight ATK x2.0;
- all other boss HP, DEF, speed, charge/volley, summon, add, enrage, ward, raise, and mechanic values;
- ordinary enemies outside the authorized Ashen Keep level override;
- global enemy curves;
- `AUTO_REACT = false`;
- all previously locked progression, economy, tap, Renown, rarity, promotion, travel, recovery, and UI systems.

# What Not To Do

- Do not modify production gameplay code.
- Do not test another Ashen Keep level.
- Do not change Hollow King separately.
- Do not change the Shatter policy or cap.
- Do not reopen Auto Training or boss-ATK tuning.
- Do not add a second candidate arm.
- Do not run a separate confirmation pass.
- Do not tune toward Stress.
