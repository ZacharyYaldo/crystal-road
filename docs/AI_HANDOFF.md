STATUS: OWNER_CHANGES_ON_TUNING_BRANCH_AFTER_RELEASE
RESPONSE_TYPE: OWNER_CONTENT_CHANGES
PASS_ID: PASS_54_RAIN_VOLLEYS_AND_CAMP
BASED_ON_REVIEW_PASS: OWNER_REQUESTS_2026-09-30 after the release of 2aadf75 to main
BUILD: 20260930 (tuning branch; main at 2aadf75, live build 20260929-173949)
HEAD_COMMIT_SHA: see git log (this handoff is committed with the code)
PULL_REQUEST: #2
SUPERSEDES: PASS_53E (released)

# Crystal Road AI Handoff - Pass 54 (Rain of Fire volleys, no screen flash on Ash's regular shot, Send a hero layout, Camp panel for five quest slots)

## Rain of Fire (balance change, owner's design)
- Before: one hit per living enemy, whatever the count.
- Now: at least three volleys. Every living enemy is hit once; when fewer than three enemies stand, the remaining volleys go round again in order. One enemy takes three volleys, two enemies take two and one, three or more take one each. Damage per volley is unchanged (1.1 x AB_BOOST x power). The bleed is set once per enemy per cast, never extended by the repeat volleys. A volley whose enemy already fell goes to the next living enemy. Damage still lands at the game's hit frame; the effect shows the same volley order.
- Ability text: "3 volleys of X% spread across the enemies, each hit at least once; bleeds them N turns."
- Against packs of three or more nothing changes. Against one or two enemies the ability deals up to three times what it did, so this is a buff to the ranger in small fights and needs the next batches before any balance claim. Ash is benched in the default bot party; a --party batch would show it.

## Ash's regular shot
No warm screen flash any more (the effect raised it on every arrow). Rain of Fire keeps its flash and its shake, as the owner asked.

## Send a hero sheet
With the longer favoured-class lists the "favors" text ran under the Send button. Each quest row is taller and shows three lines: name and duration, the reward, then "Class bonus for <class>" or "Favors A, B, C" wrapped inside the space left of the button.

## Camp panel: every Bunks rank usable (owner's rules, second version)
Bunks stacks to five quest slots, but the Camp panel drew three fixed rows, so a fourth or fifth hero could never be sent. Now: quests fill from the top (returned first, then running by return time), and every row below them is an ordinary Empty slot with Send hero until more quests are out than the three rows hold. Only then does the third row become a summary: the heroes away on the hidden quests stand where a row's hero would, "n more on quests", Quests n / slots, and Send another while a slot is open or Full when none is. A returned hidden quest jumps to the top row with Collect. Without Bunks the two empty slots and the locked third row are as before. The audit suite renders the panel at ranks 0, 1 and 3 with zero to five quests and reads the rows, the drawn heroes and the tappable buttons.

## Tests and evidence
- heroes.test.js: the Rain of Fire block now covers the volley order, one hit each in a large pack, three volleys on a lone enemy, two and one on a pair, the fallen-enemy redirect, bleed once per enemy, the ability text, and that the regular shot clears the flash while Rain of Fire keeps it.
- 9 suites pass, 2,696 assertions; parity PASS.
- Exact equivalence against 2aadf75 (same game.js on both sides): default 24 pairs, real-player configuration 12 pairs, recorded in the commit message.
- Checked in the page: three regular shots by Ash with the screen flash at 0; Rain of Fire on two enemies made three hitting volleys, bleed 3 on each, flash 0.6 on the ability; the Send a hero sheet lays out cleanly.

## Open
- main stays at 2aadf75 until the owner says otherwise. Criterion 7b and fresh batches (with a --party batch that fields the newcomers and Ash) remain open.
- Harness nit from the reviewer: two equiv.js gates at once share one temporary directory; sequential runs are valid.
