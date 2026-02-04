# Shayan Mudassar - Portfolio

Interactive, event-driven portfolio built with Astro + React islands. The output is fully static HTML/CSS/JS and deploys to GitHub Pages.

## Quick start

> Requires Node.js 20+.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The static output is generated in `dist/`.

## Deployment

- Static hosting: deploy the `dist/` folder to any static host.
- GitHub Pages: see the workflow details below.

## Lint / Typecheck / Tests

```bash
npm run lint
npm run typecheck
npm run test
```

## Project structure

- `src/pages/index.astro` - page layout and section composition
- `src/components/` - interactive islands and UI blocks
- `src/data/profile.ts` - single source of truth for content
- `src/styles/global.css` - site theme and layout

## GitHub Pages deployment

This repo includes `.github/workflows/deploy.yml`, which on every push to `main`:

1. Installs dependencies
2. Runs lint + typecheck + tests
3. Builds to `dist/`
4. Deploys to GitHub Pages using the official Pages actions

### Base path and repo name

`astro.config.mjs` automatically sets the correct `base` for GitHub Pages using `GITHUB_REPOSITORY`:

- User site (`username.github.io`) -> base `/`
- Project site (`username/portfolio`) -> base `/portfolio/`

If you change the repo name, the base path updates automatically on GitHub Actions.

### Sitemap

The sitemap uses `SITE_URL`. The workflow computes it automatically. If you build locally and want a correct sitemap, set:

```bash
SITE_URL="https://yourdomain.com/" npm run build
```

## Customizing content

Edit `src/data/profile.ts` to change:

- Experience timeline (used for hero micro-metrics)
- Projects and links
- Skills clusters
- Certifications and education
- Email address
- Architecture node labels and details

Hero proof bar copy lives in `src/pages/index.astro` (`proofBar`).

## Updating assets

- CV: replace `public/assets/Shayan_Mudassar_CV.pdf` with your latest PDF.
- Project screenshots: replace the placeholders in `public/assets/projects/`:
  - `public/assets/projects/sentinel-placeholder.svg`
  - `public/assets/projects/anomaly-placeholder.svg`

## Deep links & shareable state

Sections:

- `/#playground`
- `/#experience`
- `/#projects`
- `/#skills`
- `/#certifications`
- `/#contact`

Project deep links:

- `/#projects?project=sentinel`
- `/#projects?project=anomaly`

Anomaly shareable state:

- `/#projects?project=anomaly&model=iforest&cont=0.08&sigma=2.1`

## Notes

- All interactivity runs client-side.
- Accessibility: keyboard navigation, focus states, reduced motion toggle.
- Performance: no heavy dependencies, SVG-driven visuals, minimal islands.
