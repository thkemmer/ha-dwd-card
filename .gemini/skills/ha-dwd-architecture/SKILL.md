---
name: ha-dwd-architecture
description: Holistic architecture and implementation guidelines. Mandatory for every feature development task. Covers naming, data structures, UI patterns, and the two-stage validation workflow.
---

# HA DWD Card: Architecture & Implementation Protocol

This document is the **mandatory reference** for every development task in this project. It ensures technical consistency and operational reliability.

## 1. MANDATORY: Development Workflow (Validation Chain)
Every UI-related change must pass through this validation before completion:
1.  **Stage 0: Immediate Verification:** Run `npm test` and `npm run build` after EVERY source code change, no matter how small or "visual only" it is. Never assume a change is safe without verification.
2.  **Stage 1: Local Demo:** Verify the UI in `demo/index.html` via `npm start`. All scenarios and config options must be showcased.
3.  **Stage 2: Real Hardware/HA:** Build a dev version (`npm run build:dev`) and verify it on a real Home Assistant instance to ensure CSS/API compatibility and visual editor availability.

## 2. Component Structure & Registration
- **Card Registration:** Always register the card in `window.customCards` at the **top of the file** (after imports/constants, before the class definition). This ensures HA discovers the card immediately during module load.
- **Class Names:** Use PascalCase with the prefix `HaDwd` (e.g., `HaDwdCard`).
- **Custom Elements:** Use kebab-case with the prefix `ha-dwd-` (e.g., `ha-dwd-card`).
- **Dev Suffixing:** Always use the `DEV_SUFFIX` constant for element names:
  ```typescript
  const DEV_SUFFIX = __DEV__ ? '-dev' : '';
  customElements.define(`ha-dwd-component${DEV_SUFFIX}`, HaDwdComponent);
  ```

## 3. Data Management & Parsing
- **Centralized Logic:** All parsing logic must reside in `src/dwd-data.ts` or `src/pollen-data.ts`.
- **YAML Mocks:** Create representative YAML files in `example_data/` for any new entity types or attributes.

## 4. UI Implementation Patterns (LitElement)
- **Attribute Binding:** Always use attribute binding (`icon="${icon}"`) instead of property binding for `ha-icon`.
- **Theming:** Strictly use Home Assistant CSS variables (e.g., `--primary-text-color`).
- **Layout:** Implement `getLayoutOptions()` for dashboard grid support.

## 5. Visual Editor Standards
- **Sync Requirement:** Every new configuration option *must* be added to the corresponding editor component.
- **Location:** The editor can be in the same file or a separate file if it exceeds 500 lines.

## 6. Testing & Quality
- **Coverage:** Aim for 100% coverage on parsing and formatting logic.
- **Linting:** Resolve all linting issues before committing.
- **Local Demo Requirement:** Every component must have a dedicated section in `demo/index.html` with:
  - Navigation links in the header.
  - Buttons for all data scenarios.
  - Real-time configuration controls.
