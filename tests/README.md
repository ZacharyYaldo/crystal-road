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
node tests/sim/bot.js --hours 10 --idle                # a player who never taps
node tests/sim/bot.js --hours 10 --taps 4 --seed 7 --quiet --json out.json
```

Speed: roughly one simulated hour per 15 to 25 real seconds.

### What the bot does

Every 5 simulated seconds it equips the best gear and salvages the rest, upgrades the cheapest equipped item with ore, buys buildings, villagers, ability ranks and tree nodes under budget fractions, learns talents and promotes when eligible, garrisons idle heroes, prepares and fights hordes when due, runs the catacombs when a key is ready, takes the first Omen offered, and advances to the next zone when the current one is cleared. After four defeats in a zone it farms the previous zone until the party gains three levels. When stuck for three hours after Shatter unlocks, or 100 fights into the Endless Road, it Shatters.

While active it casts every charged ability (using the parry, interrupt and cleanse reactions when an enemy is winding up), fires the Crystal Surge when full, and taps the weakest or focused enemy `--taps` times per second (default 2). `--idle` turns all of that off.

Endless mode (`--endless N`) synthesizes a late-game party: all zones cleared, every hero at `--lvl` (120) with `--rank` (40), tier 3, all talents, legendary gear at `--gear` (60), tree HP and attack at `--tree` (60), `--reforged` (2) past Shatters. It stops at N milestones.

### What it reports

Hours to each recruit, zone clear, promotion and talent; each Shatter with its dust; boss attempts and fail rate per zone; drop counts by rarity per zone; best catacomb floor; best Endless fight and milestone count; where the party got stuck and at what level; hourly gold, ore, dust, zone and level. `--json` writes all of it.

### Caveats

The bot is a competent but simple player: it does not choose Oaths, it does not time hordes or delves around the road, it never buys Boosts or watches ads, and it plays continuously with no offline stretches. Treat its hour counts as a floor for a focused player, not a typical one. Seeds make runs reproducible; compare seeds before trusting a small difference.
