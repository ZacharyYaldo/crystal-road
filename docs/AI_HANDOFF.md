STATUS: READY_FOR_REVIEW
RESPONSE_TYPE: BASELINES_ON_FRAME_COUNTED_CLOCK
PASS_ID: PASS_43_CLOCK_MIGRATION_AND_2X_4X_BASELINES
BASED_ON_REVIEW_PASS: REVIEWER_CLOCK_INSTRUCTIONS_RELAYED_BY_HUMAN_2026-09-14
BUILD: 20260914-222955
HEAD_COMMIT_SHA: ba95deae8a19e1a9636036ccf2b85853afe22350
RESULTS_COMMIT: ba95deae8a19e1a9636036ccf2b85853afe22350 (this handoff document is committed separately on top of it)
PULL_REQUEST: #2
SUPERSEDES: PASS_42 (its harness changes stand; pass 39 and earlier baselines were already withdrawn)

# Crystal Road AI Handoff - Pass 43 (frame-counted clock; statistical migration gate; fresh 2x and 4x reference baselines, both GATE PASS 40/40)

HUMAN_APPROVAL (2026-09-14): fix the clock drift now with an integer frame counter (simNow = start + frames * (1000/60), no running sum, no per-frame rounding); confirm RNG counts and non-time state remain exact; allow time differences of at most one frame during the migration; refresh canonical hashes; add light and casual runs to the equivalence gate; run the fresh 2x and continuously boosted 4x late-Endless batch; label 4x as an upper-bound profile with immediate boost repurchases.

DEVELOPER_POSITION: AGREE on the clock and the batches; PARTIAL on "RNG counts and non-time state remain exact", which turned out to be unattainable in principle, not because of a defect. Details below. The 4x column is an UPPER BOUND: the bot rebuys the two-hour 4x boost the frame it lapses, 48 purchases per 96 real hours, which no real player matches.

## Clock (commit f38518b, harness only)
- Game clock: start + extra + (frames * 1000) / fps, integer frame counter, fps 60 (--dt must be 1/N). The division form is exact at whole seconds and milliseconds; verified over 200,000 seconds: frames*1000/60 never misses an integer millisecond, while frames*(1000/60) misses 29% of them.
- Simulated seconds are frames / fps and the game's RT follows the same count. Boss replay saves and restores the entire clock state (mark/restore).
- What the old running sum did: simMs += 16.666... drifted about 34 ms per two hours, and RT += 1/60 put 69% of whole-second boundaries one frame off. The only production logic on integer time is the tap limiter (Math.floor(RT) buckets), so tapping profiles diverged from the first minute; idle profiles diverged through the Auto-Cast and garrison timers.
- Why per-seed exactness cannot hold: the runs are chaotic. Any one-frame move of any timer changes the next random draw and everything after it. Old and new harnesses diverged within 15 minutes on every seed (engaged seed 901 at 1x: 10205 vs 10100 RNG calls after 15 minutes). The one-frame allowance was met at the source (no timer moved by more than one frame), but the consequence is a different trajectory, not a shifted copy.

## Migration gate (tests/sim/equiv.js --mode stat)
- Distributions over seeds per profile and speed instead of per-seed equality: idleboost, light, casual, engaged x seeds 900-904 x 1x and 2x, 6 simulated hours, 10 metrics per group (party level, gold and ore per hour, fights won, defeats, zones cleared, hours to clear Thornwood, boss attempts, RNG calls, taps per active second): 80 Mann-Whitney rank tests, 1 flagged (idleboost 2x hours to clear Thornwood, 2.54 vs 2.11 h, U=0). Re-tested on 10 fresh seeds (905-914, 3 h): direction reversed (1.93 vs 2.12 h), U=25, not significant; chance.
- Determinism: the first seed of every group ran twice on the new harness; identical canonical hashes and RNG-call counts in all 8 groups.
- The exact mode (--mode exact) remains the rule for every harness change from here on; its default matrix now includes light and casual. The canonical hashes of the 40 stat-mode runs are printed by the gate and recorded in the pass 42 to 43 session log; the reference for future exact gates is any run from commit f38518b onward.

## Reference baselines (this commit's tree: game 41d8ae2490bafb24, harness f5c407044ac1127c:748490ec731a5c7d, commit f38518b)
Matrix: idleboost, light, casual, engaged x seeds 81-90 x 96 real hours, dt 1/60, Shatter cap 3, 4 workers. Validator: tests/sim/validate38.js with the provenance on the command line, GATE PASS 40/40 for both batches; manifests in tests/sim/manifests/base43x2.json and base43x4.json; reports tests/sim/base43x2_release.txt and base43x4_release.txt (the 4x report shows 2x after the arrow).
- 2x (the reference): Endless entered at h 11.9 / 11.9 / 11.3 / 11.3 (idleboost / light / casual / engaged, medians); third Shatter at 9.7 / 9.6 / 9.0 / 9.1 h; hours in Endless 84 in every profile; Lv at 96 h 331 / 328 / 337 / 337; best Endless wave 1331 / 1331 / 1405 / 1400; deaths per hour in Endless 9.4 / 8.8 / 10.0 / 9.5; no boss walls, no outliers.
- 4x UPPER BOUND (boost rebought the frame it lapses; 48 purchases per run; every completed boost measured exactly 7200 real s and 28800 game s; taps per active second 0 / 0.90 / 1.36 / 1.84, unchanged by game speed): Endless entered at h 6.0 / 6.3 / 6.2 / 5.9; third Shatter at 4.8 / 5.0 / 5.0 / 4.9 h; hours in Endless 90; Lv at 96 h 394 / 390 / 394 / 396; best wave 1599 / 1576 / 1589 / 1609; deaths per hour 16.8 / 15.2 / 17.0 / 16.9.
- Between profiles the pacing is nearly flat: idle with the Auto-Cast boost reaches Endless within 35 minutes of engaged play at both speeds.
- 4x batch wall time about 2 hours, 2x about 70 minutes, at 4 workers.

## Caveat the reviewer should weigh
The reference matrix caps the bot at three Shatters, so neither batch exercises the pass 41 income scheme from the fourth Shatter onward (gold 1.17, ore 1.05 compounding). A supplementary batch with a higher cap (for example --shatters 6) would be needed to observe it; not started, pending the human.

## Also on this commit
- Vael market stall icon redrawn at 30 x 20 pixels and drawn at integer scale (UI, no gameplay effect; the human's request).

## Open
- Supplementary batch with a higher Shatter cap (above).
- Item 7 (price curve) held.
- Ask of the reviewer: the pacing proposal in real hours against these 2x medians, with 4x read as the upper bound; whether a timed-purchase 4x profile (for example one or two purchases per session, --speed4Buys) should join the matrix as the realistic 4x column.
