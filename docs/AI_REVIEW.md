STATUS: READY
REVIEW_FOR_PASS: PASS_11_AUTOCAST_CHARGE_REACTION_DIAGNOSTIC
REVIEWED_HANDOFF_PASS: PASS_10_IRONVEIN_FAILURE_MODE_DIAGNOSTIC
REVIEWED_HANDOFF_SHA: c43d92429713451cfbc9188053a7b404fa31c6e0
BASE_COMMIT: 0c8f5e6875e52d6d2ebcbd7c0e7dcbf2645e14b6
CONFIDENCE: HIGH

# Decision

Accept the Pass 10 diagnosis: Ironvein's dominant wall is not Warlord HP, summons, or arrival power. It is the discontinuity between active play, which can answer the telegraphed charge, and Auto-Cast, which casts abilities but never uses a ready defensive response.

Do not tune Warlord. Authorize one bounded Auto-Cast charge-reaction diagnostic. This is a candidate behavior experiment, not approval to ship.

# Pass 10 Assessment

The observation-only counters and snapshot harness are sufficient for causal diagnosis:

- The harness used 10 real first-arrival snapshots per profile, 10 combat seeds per snapshot, and both active and Auto-Cast modes: 800 fights total.
- Auto-Cast clear rates were 3% / 5% / 0% / 1% for idle / light / casual / engaged.
- Active clear rates from the same arrival states were 40% / 84% / 82% / 98%.
- Auto-Cast suffered 1.9-2.2 charge hits and 1.95-2.18 charge kills per fight. Parries and interrupts were zero.
- Active light/casual/engaged suffered only 0.1-0.3 charge hits per fight. Most active losses reached the summon or near-kill phase.
- Auto losses commonly occurred before the summon with 44-62% boss HP remaining. Boss damage supplied 88-100% of damage received.
- Arrival power and HP do not explain the mode gap. Idle arrived with the highest median power and still performed worst; mode moved outcomes far more than within-profile power terciles.

The full-Road mode samples are small, but their ordering and failure shape agree with the harness. Treat the harness as representative enough to test the mechanism, not precise enough to set release balance.

The active harness is somewhat mechanically aggressive because it checks every ready hero during the telegraph. That does not invalidate the diagnosis, but the candidate must explicitly prevent multiple automatic reactions to one charge.

# Proposal Evaluation

The developer's proposed direction is better than reducing the Warlord's charge multiplier.

A Warlord-only ATK or charge nerf would lower difficulty for active players who already have effective counterplay and would leave the same Auto-Cast blind spot on later charge enemies. Auto-Cast is advertised as casting abilities on its own, so using an already-ready ability to answer a visible telegraph is coherent with the feature.

Two corrections are required:

- The proposal names only `chargeM` while describing a system-wide charge response. The experiment must handle both `chargeM` and `chargeR`.
- Sanctuary does not stop a charge. It must not consume charge as an automatic “reaction” merely because `reactTo()` returns true during the telegraph.

# Authorized Candidate

Control: current production Auto-Cast.

Candidate: while Auto-Cast is enabled, if the current enemy action is in `phase === 'tele'` and is `chargeM` or `chargeR`, Auto-Cast may immediately spend one already-ready counter ability.

Exact rule:

1. At most one automatic response per enemy telegraph.
2. Consider living heroes in current party order.
3. The first ready eligible hero responds:
   - Knight: Shield Wall parry
   - Rogue: Shadowstep interrupt
   - Mage: Meteor interrupt
4. Cleric Sanctuary, Ranger Rain of Arrows, and Berserker Rage are not charge counters and must continue through ordinary Auto-Cast behavior.
5. A reaction uses the same 100 charge and the same parry/interrupt behavior as the corresponding manual reaction.
6. Do not grant charge, reserve abilities in anticipation of a charge, add a reaction probability, or add a timing parameter.
7. If a reaction fires, that hero must not also normal-cast in the same tick. Mark the telegraph as handled so another hero cannot react to it.
8. Manual input and the existing 30% manual-cast damage bonus remain unchanged.
9. Instrument automatic reaction attempts, responder class, charge kind, success, and any prevented double response.

This entire deterministic rule is the single lever. Do not optimize responder priority in this pass.

# Phase A: Boss-Harness Gate

Run paired control and candidate from the same 40 Pass 10 Ironvein snapshots:

- Idle / Light / Casual / Engaged
- Auto-Cast mode only
- 10 combat seeds per snapshot
- 400 control + 400 candidate fights
- identical observation telemetry
- 0 simulation errors

Retain the Pass 10 active-mode results only as a reference ceiling; the candidate must not touch active/manual behavior.

Report by profile, control -> candidate:

- clear rate and 95% interval
- charge telegraphs, reactions, hits, kills, parries, and interrupts per fight
- reaction responder-class distribution
- boss HP remaining on loss
- pre-summon / summon-phase / near-kill loss shares
- duration, survivors, and party HP on wins
- boss-versus-add damage share
- normal ability casts displaced by reactions
- double-response or same-tick double-cast count

Phase A passes only if all are true:

- charge kills per fight fall at least 60% in at least three profiles and do not materially increase in the fourth;
- Auto-Cast clear rate improves by at least 20 percentage points in idle and light;
- losses materially shift away from pre-summon wipes toward summon-phase or near-kill outcomes;
- no profile's Auto-Cast clear rate exceeds its Pass 10 active reference by more than 5 percentage points;
- zero double responses, same-tick double casts, invalid reactions, or telemetry errors; and
- the result is not driven by free charge, extra ability casts, changed arrival state, or any boss-value change.

If Phase A fails, stop. Return the evidence and one counterproposal; do not run the Road candidate and do not tune Warlord.

# Phase B: Conditional Road Diagnostic

Run this only if Phase A passes.

Use one source build with the candidate behind an explicit simulator/test constant. Production remains control until a later validation is approved.

Paired seeds 1-10:

- Idle / Light / Casual / Engaged
- 24 hours
- 4 profiles x 10 seeds x 2 arms = 80 runs
- current production Road, Auto Training, boss, horde, and catacomb logic
- 0 simulation errors

Report median / P90 and paired change for:

- Ironvein first-try rate, attempts, stall, clear time, and mode at each attempt
- charge hits, kills, parries, interrupts, and automatic reactions by zone and boss
- all early-Road boss first-try rates, attempts, stalls, and clear times
- zones cleared and party level at 24h
- ordinary and boss defeats, rewalk fights, and rewalk hours
- Auto Training triggers, returns, hours/share, and levels earned
- active-window versus Auto-Cast combat outcomes
- horde wins/losses and catacomb depth/runs
- ability casts and damage share

Road success requires:

- Ironvein idle and light first-try/attempt/stall outcomes improve directionally without making Warlord Auto-Cast stronger than active play at comparable states;
- no early-Road median clear time worsens by more than 10% or P90 by more than 15%;
- Stillwater remains inside its locked Pass 7 bands;
- no median zones-cleared decline at 24h;
- ordinary defeat, rewalk, and Auto Training metrics do not worsen by more than 10%;
- active/manual outcomes remain unchanged within seed noise;
- no boss or zone accelerates by more than 15% without a clear charge-causality explanation; and
- horde and catacomb results show no new trivialization, lockout, or mechanical error.

# Decision Rules

- If both phases pass: propose a normal validation of the same exact reaction rule. Do not ship it yet.
- If reactions work but Auto-Cast approaches or exceeds active performance: reject the exact rule and present one bounded counterproposal that preserves an active-play advantage.
- If reactions suppress charge kills but Ironvein remains a wall: return the failure shape; do not silently add an HP, ATK, or summon change.
- If later charge encounters become trivial or progression accelerates beyond the limit: reject global release and identify where the effect concentrates.
- If the candidate has little effect: retain current Auto-Cast and propose one Warlord-local lever based on the Pass 10 evidence.

# Locked Systems

- Warlord HP x6.0, ATK x1.7, DEF x1.2, speed 8, charge x2.5, ward behavior, summon threshold, and two-orc summon
- all other boss and ordinary-enemy values
- `AT_LOSSES = 4`, `AT_WINDOW = 10`, and `AT_MIN = 8`
- universal +1 Auto Training target; no conditional +2 and no cooldown
- Auto Training rewards, minimum fights, fallback, protections, and Keep Pushing
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

- Do not change Warlord or any boss stat.
- Do not implement multiple reactions, reaction probabilities, delays, ability reservation, or responder optimization.
- Do not let Sanctuary consume charge as a charge response.
- Do not apply manual-cast damage bonuses to automatic reactions.
- Do not alter Auto Training.
- Do not treat a passing quick diagnostic as release approval.
