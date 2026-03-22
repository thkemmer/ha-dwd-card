---
name: ha-dwd-architecture
description: Technical architecture guidelines for the HA DWD Card project. Covers naming conventions, data structures, and implementation patterns for Home Assistant custom cards.
---

# HA DWD Card Technical Architecture

This document defines the technical standards and patterns to ensure consistency across the project.

## 1. Component Naming & Structure
- **Class Names:** Use PascalCase with the prefix `HaDwd` (e.g., `HaDwdCard`, `HaDwdPollenCard`).
- **Custom Elements:** Use kebab-case with the prefix `ha-dwd-` (e.g., `ha-dwd-card`).
- **Dev Suffixing:** Always use the `DEV_SUFFIX` constant for element names to allow side-by-side installation of dev versions:
  ```typescript
  const DEV_SUFFIX = __DEV__ ? '-dev' : '';
  customElements.define(`ha-dwd-component${DEV_SUFFIX}`, HaDwdComponent);
  ```

## 2. Data Management & Parsing
- **Centralized Logic:** All logic for parsing Home Assistant entity states and attributes must reside in `src/dwd-data.ts` (for weather warnings) or `src/pollen-data.ts`.
- **Interfaces:** Use TypeScript interfaces (defined in `src/types.d.ts`) to ensure type safety across the data pipeline.
- **YAML Mocks:** When adding support for new entities or attributes, create a representative YAML file in `example_data/`.

## 3. UI Implementation Patterns (LitElement)
- **Attribute Binding:** Always use attribute binding (`icon="${icon}"`) instead of property binding (`.icon="${icon}"`) for `ha-icon` elements to ensure full compatibility.
- **CSS Variable Usage:** Prefer Home Assistant's built-in CSS variables (e.g., `--primary-text-color`, `--secondary-text-color`, `--card-background-color`) for theming.
- **Performance:** 
  - Minimize re-renders by using `@property` only for external configuration.
  - Implement `getLayoutOptions()` to support the Home Assistant dashboard grid system.

## 4. Visual Editor Standards
- **Component Decomposition:** Every card should have a corresponding editor component in the same file or a separate file if it exceeds 500 lines.
- **User Experience:** The editor must provide intuitive controls (switches, dropdowns) for all configuration options defined in the YAML schema.

## 5. Testing Patterns
- **Vitest:** All business logic (parsing, formatting) must have 100% test coverage.
- **Mocking:** Use `createMockHass` (or similar helpers) in tests to simulate the Home Assistant environment.
- **Regression Testing:** Always add a test case for reported bugs before fixing them.
