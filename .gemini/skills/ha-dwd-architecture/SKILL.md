---
name: ha-dwd-development
description: Central development protocol for all changes (features, fixes, maintenance). Defines the mandatory lifecycle stages, architectural standards, and the QA review protocol.
---

# HA DWD Card: Development & Architecture Protocol

This is the **Single Source of Truth** for modifying the codebase. Every change (including security updates) must follow this protocol.

## 1. MANDATORY: Workflow & Validation Chain
No change is complete until it has passed all stages:

### Stage 0: Immediate Verification (The Loop)
After **every** source change (`src/`), run:
1. `npm test` (Verify logic)
2. `npm run build` (Verify compilation)
3. `npm run lint` (Verify style)
*Never assume a visual-only change is safe.*

### Stage 1: Local Demo (Visual Proof)
Verify in `demo/index.html` via `npm start`.
- Must showcase all new config options.
- Must test at least two different data scenarios.

### Stage 2: Real Hardware (Integration)
Build a dev version (`npm run build:dev`) and verify on a real HA instance.
- Check visual editor availability.
- Verify CSS variable compatibility.

### Stage 3: Documentation Proofing
- **README.md**: Sync configuration tables and YAML examples.
- **ROADMAP.md**: Move items to "Done".
- **Source Sync**: Definitions in code must match documentation.

## 2. Component Standards
- **Registration**: Card registration (`window.customCards`) MUST be at the **top of the file**.
- **Naming**: PascalCase for classes (`HaDwdCard`), kebab-case for elements (`ha-dwd-card`).
- **Dev Suffix**: Always use the `DEV_SUFFIX` constant for element names.

## 3. Data & UI Patterns
- **Centralized Logic**: All parsing in `src/dwd-data.ts` or `src/pollen-data.ts`.
- **Lit Patterns**: Use attribute binding (`icon="${icon}"`) for `ha-icon`.
- **Theming**: Use HA CSS variables (e.g., `--primary-text-color`).

## 4. Quality Assurance & Review Protocol
Reviews must verify:
- **Coverage**: Business logic MUST maintain 100% coverage (`npm run test:coverage`).
- **Technical Debt**: No new `any` casts or suppressed warnings without explicit justification.
- **Resilience**: Graceful handling of missing entity attributes.
