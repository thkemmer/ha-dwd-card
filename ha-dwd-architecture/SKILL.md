---
name: ha-dwd-architecture
description: Architecture guidelines for the HA DWD Card project. Enforces descriptive naming, component decomposition, synthetic data usage, and specific testing/debugging workflows. Use when adding new components, modifying data structures, or improving the local development experience.
---

# HA DWD Card Architecture

This skill provides the architectural principles and development workflows for the `ha-dwd-card` project.

## 1. Component Naming & Structure

Maintain descriptive and self-explanatory names to ensure clarity and easy discovery.

- **Class Names:** Use `HaDwd[Purpose]` (e.g., `HaDwdCard`, `HaDwdDetailsCard`).
- **Custom Elements:** Use `ha-dwd-[purpose]` (e.g., `ha-dwd-card`, `ha-dwd-details-card`).
- **Suffixing:** Always use the `DEV_SUFFIX` constant for element names to allow side-by-side installation of dev versions in Home Assistant:
  ```typescript
  const DEV_SUFFIX = __DEV__ ? '-dev' : '';
  const CUSTOM_ELEMENT_NAME = `ha-dwd-component${DEV_SUFFIX}`;
  ```
- **Refactoring:** When a component exceeds ~500 lines or takes on multiple responsibilities (e.g., summary view vs. detailed breakdown), refactor it into a separate file and component.

## 2. External Data & Synthetic Testing

When adding support for new entities or data attributes from Home Assistant:

- **Data Parsing:** Logic should be centralized in `src/dwd-data.ts`. Use the `Warning` interface for individual warnings.
- **Synthetic Data:** Always provide a YAML representation of the entity attributes in `example_data/`. This serves as documentation and a source for manual verification.
- **Vitest Tests:** Update `src/dwd-data.test.ts` and `src/ha-dwd-card.test.ts` with mock data that reflects the new structures.
- **Demo Scenarios:** Add the new data as a scenario in `demo/index.html`'s `SCENARIOS` object to enable local browser previewing.

## 3. Feature Development Workflow

When the user requests a new feature or a significant architectural change, follow this strict **Planning -> Branching -> Iterative Execution** workflow.

### Phase 1: Planning Mode (Inquiry & Strategy)
Do not start implementing immediately. First, ensure the goals are fully understood.
1.  **Inquiry:** Ask targeted questions about the feature's purpose, the intended User Experience (UX), and any specific constraints or edge cases.
2.  **Strategy:** Propose a high-level implementation strategy and a comprehensive testing plan. This plan must include:
    *   Proposed file structure changes or new components.
    *   Necessary updates to `dwd-data.ts`.
    *   Verification steps (Unit tests, Demo scenarios, Manual HA testing).

### Phase 2: Branching
Once the plan is approved, create a new Git branch using a descriptive, self-explanatory name:
*   **Pattern:** `feature/[descriptive-name]` or `fix/[bug-description]`.
*   **Command:** `git checkout -b feature/my-new-component`.

### Phase 3: Iterative Execution (Step-by-Step)
Execute the approved plan one step at a time.
1.  **Atomic Changes:** Focus each step on a single responsibility (e.g., "Add parsing logic," "Create UI component," "Add demo scenario").
2.  **Mandatory Verification:** After *every* implementation step, you MUST:
    *   Run `npm test` to ensure no regressions and verify new logic.
    *   Run `npm run build` to ensure the project still compiles.
3.  **Synchronization:** Confirm the success of the step with the user before proceeding to the next item in the plan.

## 4. Local & Debug Workflows

### Demo Mode (Local Preview)
Use this for rapid UI/UX iteration without needing a Home Assistant instance.
- **Command:** `npm start`
- **URL:** [http://localhost:8000/demo/](http://localhost:8000/demo/)
- **Mechanism:** Mocks the Home Assistant environment and uses `SCENARIOS` in `demo/index.html`.

### Debug Mode (Local HA Testing)
Use this to test the card within a real Home Assistant instance.
- **Command:** `npm run build:dev` or `npm run watch:dev`.
- **Mechanism:** Sets `__DEV__` to `true`, which appends `-dev` to the component names (e.g., `ha-dwd-card-dev`).
- **Installation:** Add the generated `dist/ha-dwd-card.js` as a Lovelace resource with the URL `/local/ha-dwd-card.js?v=dev`.

## 5. Optimization Standards

- **LitElement Best Practices:** Minimize re-renders by carefully managing `@property` and `@state`.
- **Layout Options:** Implement `getLayoutOptions()` for better compatibility with Home Assistant's dashboard grid.
- **Conditional Rendering:** Use `hide_empty` config option where applicable to keep dashboards clean.

## 6. Verification

Before finalizing any change, always run:
- `npm test` (Logic and component rendering)
- `npm run lint` (Code style and standards)
- `npm run build` (Production build verification)
