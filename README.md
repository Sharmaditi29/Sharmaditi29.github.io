### Personal website & blog

Based on Hugo & utilising Github actions for deployment.

Deployed at -> https://sharmaditi29.github.io

## Local development

To view the site locally with LingoGarden auto-rebuilding while you edit:

```bash
./scripts/dev-site.sh
```

That script:

- rebuilds LingoGarden when files under `apps/wortspiel/src` or `apps/wortspiel/public` change
- rebuilds the Hugo site when site files change
- serves the built `public/` folder locally

The local site then runs at:

- `http://localhost:1314/`
- `http://localhost:1314/Experiments/wortspiel/`
