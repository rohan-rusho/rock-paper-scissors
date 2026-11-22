# Rock Paper Scissors ✊✋✌️

Play Rock Paper Scissors against the computer. First to 5 wins the match.

## Features

- Play vs the computer — click a choice or press **1 / 2 / 3** on your keyboard
- Live scoreboard with your pick vs the computer's pick each round
- Best-of indicator: progress pips show how close each side is to 5
- Match-winner state with a Play again button, plus a Reset match button
- Round history — your last 10 rounds, newest first (wins, losses, draws)

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

No build step, no dependencies except Google Fonts. Just open `index.html` or serve the folder.

## Deploy

Any static host works — GitHub Pages, Netlify, Vercel: publish this folder as-is.
