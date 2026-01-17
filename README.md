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

- Experience timeline
- Projects and links
- Skills clusters
- Certifications and education
- Email address (currently set to `hello@shayanmudassar.dev` - update to your real contact)

## Notes

- All interactivity runs client-side.
- Accessibility: keyboard navigation, focus states, reduced motion toggle.
- Performance: no heavy dependencies, SVG-driven visuals, minimal islands.
