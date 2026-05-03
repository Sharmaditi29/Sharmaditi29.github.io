# WortSpiel

WortSpiel is a playful language-learning MVP built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Goethe-based German A1 deck with 813 translated practice cards
- Aalto-based Finnish beginner deck with 313 public glossary cards
- Compact revision area with dropdown-based themes, grammar refreshers, and a searchable word bank
- Flashcard mode with meaning reveal, example sentences, and review buttons
- Sentence practice with saved answers in local storage
- Quiz mode with meaning checks and article challenges
- Progress dashboard with review stats, sentence count, and daily streak
- Local language switching between German and Finnish

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

If you want to work on WortSpiel while also viewing the Hugo site locally, run:

```bash
cd /Users/aditis/Documents/GitHub/Sharmaditi29.github.io
./scripts/dev-site.sh
```

That helper does two things:

- rebuilds WortSpiel when `src/` and `public/` change
- rebuilds the Hugo site and serves the built `public/` folder locally

Then open:

- `http://localhost:1314/`
- `http://localhost:1314/Experiments/wortspiel/`

## Refresh the source decks

The expanded German deck is generated from a public translated deck based on the Goethe A1 list.
The expanded Finnish deck is generated from Aalto OpenLearning's public Finnish-English glossary.

```bash
pnpm run sync:goethe-a1
pnpm run sync:finnish-a1
```

Sources:

- Official Goethe A1 list: `https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf`
- Public translated deck by patsytau, licensed CC BY-SA 4.0: `https://github.com/patsytau/anki_german_a1_vocab`
- Aalto Basic Finnish 1 course materials: `https://openlearning.aalto.fi/course/view.php?id=272&lang=en&section=2`
- Aalto Finnish-English glossary: `https://openlearning.aalto.fi/mod/glossary/view.php?fullsearch=0&hook=ALL&id=3370&mode=letter&page=-1&sortkey=&sortorder=asc`
- Aalto Finnish Online Grammar: `https://openlearning.aalto.fi/course/view.php?id=158`

## Notes for future versions

- Add AI sentence feedback after submission
- Add audio pronunciation buttons for each card
- Add spaced repetition scheduling beyond simple known/practice tracking
