# LingoGarden

LingoGarden is a simple German study app built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Goethe-based German A1, A2, and B1 deck with 7277 practice cards
- Compact revision area with dropdown-based themes and grammar refreshers
- Flashcard mode with meaning reveal, example sentences, and review buttons
- Sentence practice with saved answers in local storage
- Quiz mode with meaning checks and article challenges
- Daily study targets with review stats, sentence count, and streak tracking

## Local setup

```bash
pnpm install
pnpm dev
```

If you prefer npm and have it available on your machine, the standard Vite scripts also work:

```bash
npm install
npm run dev
```

## Build for the website

```bash
pnpm build
```

The production build is written to `../../static/Experiments/wortspiel/` so the Hugo site can publish it at `/Experiments/wortspiel/`.

## Local editing with the website

If you want to work on LingoGarden while also viewing the Hugo site locally, run:

```bash
cd /Users/aditis/Documents/GitHub/Sharmaditi29.github.io
./scripts/dev-site.sh
```

That helper does two things:

- rebuilds LingoGarden when `src/` and `public/` change
- rebuilds the Hugo site and serves the built `public/` folder locally

Then open:

- `http://localhost:1314/`
- `http://localhost:1314/Experiments/wortspiel/`

## Refresh the source deck

The expanded German deck is generated from official Goethe A1, A2, and B1 materials plus a public TSV extraction used to keep example-based English clues attached to the cards.

```bash
'/Users/aditis/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3' ./scripts/generate-german-a1-a2-b1.py
```

Sources:

- Official Goethe A1 list: `https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf`
- Official Goethe A2 list: `https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_A2_Wortliste.pdf`
- Official Goethe B1 list: `https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_B1_Wortliste.pdf`
- Public TSV extraction of Goethe word lists: `https://github.com/ilkermeliksitki/goethe-institute-wordlist`

## Notes for future versions

- Add AI sentence feedback after submission
- Add audio pronunciation buttons for each card
- Add spaced repetition scheduling beyond simple known/practice tracking
