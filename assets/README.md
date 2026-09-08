# Crystal Road - handoff bundle

- index.html            playable build (assets embedded). Push this to the GitHub repo.
- source/game.js        all game logic (vael/save/delve are merged in)
- source/shell.html     HTML wrapper; __ASSETS__ and __GAME__ are replaced at assemble time
- source/build_atlas.py builds atlas.json from the Zerie sprite pack (+ drone from the background pack)
- source/build_assets.py builds assets.json (atlas + 9 scenes + music mp3)
- source/remix.py, mock.py, mock_vael.py   sprite recolor helpers and screen mockups
- build/music_greenhollow.mp3   encoded track used in assets.json
- build/atlas.json      last generated atlas (regenerate with build_atlas.py if packs are present)
- build/sim_harness.js  headless node simulation used for balance checks

Assemble: read shell.html, replace __ASSETS__ with assets.json contents and __GAME__ with game.js, write index.html.
Asset packs (not included): Zerie Tiny RPG Character Asset Pack v2, ansimuz Battle Backgrounds Pack 1.
