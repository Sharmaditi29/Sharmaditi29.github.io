# WortSpiel

WortSpiel is a playful German vocabulary MVP built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- A1 starter deck with 40 German vocabulary cards
- Flashcard mode with meaning reveal, example sentences, and review buttons
- Sentence practice with saved answers in local storage
- Quiz mode with meaning checks and article challenges
- Progress dashboard with review stats, sentence count, and daily streak
- Daily practice goals for 5 new words, 10 reviews, and 3 sentences

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

## Notes for future versions

- Add AI sentence feedback after submission
- Add audio pronunciation buttons for each card
- Add spaced repetition scheduling beyond simple known/practice tracking
