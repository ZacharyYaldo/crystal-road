# Crystal Road test tools

Two tools, both running the real game logic from `source/game.js`.

## 1. In-page harness (`tests/harness.js`)

Runs inside the game tab against the live build and restores your save after every test.

```
await (await fetch('/tests/harness.js?v='+Date.now())).text().then(eval); await T.runAll();
```

Runs in about 30 seconds. `T.runAll(['fights','horde'])` runs a subset. Results are also kept on `T.last`.

| Test | What it proves |
|---|---|
| tapSweep | Thousands of grid taps across every screen and sheet throw nothing |
| purchases | Every hold button spends the same via single taps, a hold, and spam taps, on every tree tab and multiplier |
| saveRoundTrip | Save, load, save again gives identical data |
| fights | Every zone resolves fights with no exceptions or stalls |
| horde | A manual horde fight ends, the volley fires, the count and window update, a passive resolution counts |
| shatter | Keeps gold, ore, gear levels and talents; resets levels and zone; talents sleep below their level |
| offline | Offline gains are non-negative and grow with hours |
| fmtNum | No raw or broken numbers from 0 to septillions |
| textOverflow | No drawn text runs past the canvas edge on any screen or sheet |
| toasts | One banner per hold; toasts drop on screen change |
| speedIndependence | Toasts and sparks age one frame per frame at x64 |
| delve | A catacomb run plays through to the end |
| endless | Omens offer three distinct picks; milestone gear order is sound |

## 2. Headless balance simulator (`tests/sim/`)

`headless.js` boots the game in Node with browser stubs and a virtual clock, no rendering.
`bot.js` plays it like a player and reports timings.

```
node tests/sim/bot.js --hours 24                      # a fresh account, 24 active hours
node tests/sim/bot.js --hours 60 --shatters 3          # stop after the third Shatter
node tests/sim/bot.js --endless 300 --hours 48         # strong synthetic party, run 300 milestones
node tests/sim/bot.js --hours 10 --profile idle        # never taps, never has Auto-Cast
node tests/sim/bot.js --hours 10 --profile idleboost   # never taps, keeps the four-hour Auto-Cast boost bought
node tests/sim/bot.js --hours 10 --taps 4 --seed 7 --quiet --json out.json
```

Speed: about 8 real seconds per simulated hour at 2x on one core of the i7-1255U. Total throughput saturates at 4 concurrent workers (22 sim-hours per real minute with 1 worker, 42 with 4, 40 to 43 with 6 to 10), so `batch.js` defaults to 4 workers.

`--speed 1|2|4` is the production toggle state. The bot reads the game's `speedNow()` every frame and runs `update()` that many times per real frame, exactly as the production loop does; taps, boosts and the active window are scheduled per real frame, never per game frame. At `--speed 4` the bot buys the production two-hour boost through `buySpeed4()` (the same function the ad sheet calls) and rebuys it whenever it lapses; `--speed4Buys N` caps the purchases, and after the last one the road runs at 2x, as in the game. Every purchase is recorded in `speedBoosts` with its real and game duration, and the effective speed is asserted every frame. Boss replays (`--replayBoss`) run at the same effective speed. `tests/contract/speed.test.js` pins the boost to exactly two real hours, eight game hours per two real hours at 4x, and the fall-back to 2x.

Optimization-equivalence gate: `node tests/sim/equiv.js --ref <commit>` runs the harness committed at `<commit>` and the working tree on identical seeds, profiles and speeds (default idleboost, light, casual and engaged, seeds 900 to 902, 1x and 2x, 3 hours) and demands identical assertions, RNG-call counts and final RNG state, currencies and progress, milestones, roster and gear, boss outcomes, hourly series, events, and the canonical hash of the whole result. Every harness change goes through it before it is committed.

Frame-counted time (since pass 43): the simulated clock is start + frames * 1000 / fps with an integer frame counter (never a running float sum), simulated seconds are frames / fps, and RT follows the same count, so whole seconds and milliseconds land on exact values. The old running sum drifted about 34 ms per two hours and put 69% of second boundaries one frame off, which moved the tap limiter's per-second buckets. Because the runs are chaotic, a one-frame move anywhere changes every later random draw, so the migration was gated statistically (equiv.js --mode stat: distributions over seeds per profile and speed, rank tests, determinism check) rather than by per-seed equality; results from harnesses before the migration are not comparable seed by seed, only in distribution. --dt must be 1/N for an integer N.

### What the bot does

Every 5 simulated seconds it equips the best gear and salvages the rest, upgrades the cheapest equipped item with ore, buys buildings, villagers, ability ranks and tree nodes under budget fractions, learns talents and promotes when eligible, garrisons idle heroes, prepares and fights hordes when due, runs the catacombs when a key is ready, takes the first Omen offered, and advances to the next zone when the current one is cleared. After four defeats in a zone it farms the previous zone until the party gains three levels. When stuck for three hours after Shatter unlocks, or 100 fights into the Endless Road, it Shatters.

While active it casts every charged ability (using the parry, interrupt and cleanse reactions when an enemy is winding up), fires the Crystal Surge when full, and taps the weakest or focused enemy `--taps` times per second (default 2). `--idle` turns all of that off.

Endless mode (`--endless N`) synthesizes a late-game party: all zones cleared, every hero at `--lvl` (120) with `--rank` (40), tier 3, all talents, legendary gear at `--gear` (60), tree HP and attack at `--tree` (60), `--reforged` (3) past Shatters. It stops at N milestones.

### What it reports

Hours to each recruit, zone clear, promotion and talent; each Shatter with its dust; boss attempts and fail rate per zone; drop counts by rarity per zone; best catacomb floor; best Endless fight and milestone count; where the party got stuck and at what level; hourly gold, ore, dust, zone and level. `--json` writes all of it.

### Caveats

The bot is a competent but simple player: it does not choose Oaths, it does not time hordes or delves around the road, boosted profiles (idleboost, light, casual, engaged) re-buy the production four-hour Auto-Cast boost whenever it lapses outside their active minutes, the idle profile never has Auto-Cast, and no other Boost or ad is used, and it plays continuously with no offline stretches. Treat its hour counts as a floor for a focused player, not a typical one. Seeds make runs reproducible; compare seeds before trusting a small difference.

### Parity with the game

Zone travel goes through the game's own `goZone`, so arriving in a zone snaps to its highest reached checkpoint and heals the party exactly as the map does. The bot may only enter a zone the map would allow (`zoneUnlocked`: previous boss beaten and enough Shatters, zones 5-6 need 1, 7-8 need 2, the Foundry and Endless need 3) and it Shatters when the next zone is sealed (`reason: 'sealed'`). Every tick asserts legal zone entry, a unique roster, that no unboosted profile has Auto-Cast, that no boost exceeds one four-hour purchase, and that boss telemetry is numeric; a failed assertion ends the run with an `ERROR` event and `assertFail` in the JSON. Levels sampled at a zone clear exclude a hero recruited in that same tick.

Timestep: the bot advances the game in `--dt` second steps, default 1/60 (a phone's frame). Production's emergency cap is 0.05 (20 fps); the bot asserts `dt <= 0.05` unless `--allowCoarseDt`. Fight timing is step-sensitive: the old 0.1 default made fights slower and every timing later. Every tick asserts that the game's clock equals the simulated clock, and every garrison post goes through the game's `postHero` with an assertion that the post timer counts down on the simulated clock and the hero can be recalled one simulated hour later.
