# Project Agent Notes (Local)

## Purpose
- This repository builds a custom Home Assistant Lovelace frontend card package for Deutscher Wetterdienst (DWD) weather warnings.
- It provides two cards:
- `custom:ha-dwd-card` (compact overview)
- `custom:ha-dwd-details-card` (detailed warning view)

## Core Stack
- TypeScript + ES modules
- Lit (`lit`) Web Components
- Home Assistant integration helpers (`custom-card-helpers`)
- Rollup bundling + Terser minification for production
- ESLint + Prettier
- Vitest + `@open-wc/testing` + jsdom for tests

## Important Files
- `/Users/mact/ai/ha-dwd-card/src/ha-dwd-card.ts`
- `/Users/mact/ai/ha-dwd-card/src/ha-dwd-details-card.ts`
- `/Users/mact/ai/ha-dwd-card/src/dwd-data.ts`
- `/Users/mact/ai/ha-dwd-card/src/warning-icons.ts`
- `/Users/mact/ai/ha-dwd-card/rollup.config.js`
- `/Users/mact/ai/ha-dwd-card/package.json`
- `/Users/mact/ai/ha-dwd-card/hacs.json`

## Data Model (Home Assistant Entity Attributes)
- Card data is parsed from DWD sensor attributes such as:
- `warning_count`
- `warning_1_headline`, `warning_1_start`, `warning_1_end`, `warning_1_type`, etc.
- Optional prewarning entity can be explicit or derived from `_aktuelle_warnstufe` -> `_vorwarnstufe`.

## Build, Test, Dev Commands
- `npm run build` -> production bundle (`dist/ha-dwd-card.js`)
- `npm run build:dev` -> dev bundle (`dist/ha-dwd-card-dev.js`)
- `npm run watch` / `npm run watch:dev`
- `npm run test`
- `npm run test:coverage`
- `npm run lint`
- `npm run format:check`
- `npm start` -> local preview at `http://localhost:8000/demo/`

## CI/CD (GitHub Actions)
- CI workflow: `/Users/mact/ai/ha-dwd-card/.github/workflows/ci.yml`
- Triggers on push (all branches) and PRs to `main`
- Uses Node.js 20 + `npm ci`
- Runs format check, lint, tests with coverage threshold, coverage gist update, and build check
- Note: format and lint are currently non-blocking (`continue-on-error: true`)

- Release workflow: `/Users/mact/ai/ha-dwd-card/.github/workflows/release.yml`
- Triggers on GitHub Release `published`
- Builds and uploads `dist/ha-dwd-card.js` as release asset

## Distribution
- HACS-compatible frontend plugin (`hacs.json` with `filename: ha-dwd-card.js`)
- Manual install also supported via Home Assistant `/local/ha-dwd-card.js`

## Review Habit
- Re-check this file periodically and update when project architecture, tooling, or CI/CD behavior changes.
