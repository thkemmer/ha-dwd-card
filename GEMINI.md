# HA DWD Card Project Rules & Development Lifecycle

This project follows a rigorous, phase-based development process. Each phase is separated by a "Quality Gate" that must be passed before moving forward. If issues are found later, the process must backtrack to the relevant phase.

## Phase 1: Discovery (Inquiry)
**Goal:** Complete understanding of the requirements and constraints.
- **Actions:** Ask targeted questions about the feature's purpose, UX, and edge cases.
- **Focus:** Identify Home Assistant entity types and required attributes.
- **Quality Gate:** **Requirement Clarity** (The user confirms the scope and intended behavior).

## Phase 2: Blueprint (Architecture & Strategy)
**Goal:** Design a sustainable solution that fits into the existing codebase.
- **Actions:** 
  - Propose file structure changes or new components (prefer decomposition over large files).
  - Define data parsing logic in `src/dwd-data.ts`.
  - **Performance Strategy:** Plan how to minimize re-renders (only update on relevant state changes).
- **Quality Gate:** **Design Review & Strategy Approval** (A high-level plan is agreed upon).

## Phase 3: Development Loop (Implementation & TDD)
**Goal:** Build a robust, tested implementation.
- **Actions:**
  - **TDD-ish Loop:** Implementation -> Unit Test -> Automated Verification.
  - **Visual Editor Sync:** Every new config option *must* be added to the `HaDwdCardEditor`.
  - **Accessibility (a11y):** Ensure proper contrast and use of `aria-labels` for tablet/dashboard use.
- **Quality Gate:** **Automated Verification** (`npm test` passes with high coverage).

## Phase 4: Polishing & Quality
**Goal:** Meet project standards and ensure long-term maintainability.
- **Actions:**
  - **Quality Criteria:** Run `npm run lint` and ensure `npm run build` succeeds.
  - **Breaking Changes Check:** Verify compatibility with current HA stable/beta (CSS variables, HA APIs).
  - **Documentation:** Update `README.md`, `example_data/` (YAML), and `demo/index.html` (SCENARIOS).
- **Quality Gate:** **Quality Criteria Met** (Clean code, full documentation, and passing build).

## Phase 5: Validation (Dev-Build & Hardware)
**Goal:** Real-world verification of the feature.
- **Actions:**
  - **Dev-Build:** Use `npm run build:dev` to test with `-dev` suffix.
  - **Real Hardware Test:** Deploy to a real Home Assistant instance and verify on actual hardware/tablets.
  - **Local Preview:** Verify via `npm start` (demo mode).
- **Quality Gate:** **Visual & Functional Acceptance** (Feature works perfectly in HA environment).

## Phase 6: Deployment (Pre-Release & Release)
**Goal:** Safe delivery to users.
- **Actions:**
  - **Pre-Release:** Create a GitHub pre-release.
  - **Validation:** Verify HACS compatibility and `hacs.json` structure.
  - **Final Release:** Tag and publish the stable version.
- **Quality Gate:** **Successful Deployment** (Release is live and functional via HACS).

---

# Operational Commands
- **Clean:** `npm run clean` (Removes `dist` and `coverage`).
- **Test:** `npm test` (Runs vitest).
- **Coverage:** `npm run test:coverage` (Check test coverage).
- **Lint:** `npm run lint` (Check code style).
- **Build (Dev):** `npm run build:dev` (Appends `-dev` to component names).
- **Local Preview:** `npm start` (Open http://localhost:8000/demo/).
