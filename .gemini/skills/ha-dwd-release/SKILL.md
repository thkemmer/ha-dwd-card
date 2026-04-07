---
name: ha-dwd-release
description: Standardized release process for HACS-compliant Home Assistant cards. Includes CI verification, version bumping, and GitHub release automation.
---

# HACS Release Protocol

This skill defines the mandatory steps for releasing a new version of the `ha-dwd-card` project to the community via HACS.

## 1. Preparation Phase (Quality Gates)

Before initiating a release, all quality gates must be passed:

- **CI Status Check:** Verify that the latest GitHub Actions run on the `main` branch was successful.
  *Command:* `gh run list --branch main --limit 1`
- **Local Verification:** Run the test suite and linter one last time.
  *Command:* `npm test && npm run lint`
- **Clean Build:** Ensure the project compiles into a clean `dist/` directory.
  *Command:* `npm run clean && npm run build`
- **Documentation Sync:** Verify that 'Stage 3: Documentation Proofing' from the `ha-dwd-architecture` protocol is complete:
  - `README.md` reflects all current config options and YAML examples.
  - `docs/ROADMAP.md` is updated.
  - Source code `@property` and `interface` definitions match the documentation.
- **Version Bump:** Synchronize the version in `package.json` with the target release tag.

## 2. Publication Phase
... rest of methods unchanged ...

Automate the release to ensure consistency:

- **Git Tagging:** Create a lightweight tag and push it to the remote.
  *Pattern:* `v1.x.x` (e.g., `v1.1.0`)
- **GitHub Release:** Create a release via the GitHub CLI or Web UI.
  *Best Practice:*
  - **Release Title:** Must communicate **user-facing value** (e.g., "v1.1.0 - New Pollen Forecast Card"). Avoid technical jargon or internal process updates (like "Guidelines" or "Refactoring") in the title.
  - **Changelog:** Use "Generate release notes" for the automated changelog, but add a brief, human-readable summary of the key features/fixes at the top.
  - **Asset Check:** Ensure the `release.yml` workflow triggers and attaches the `dist/ha-dwd-card.js` asset.

## 3. Post-Release & HACS Sync

- **Asset Verification:** Verify that the release asset is present and accessible.
- **Readme Audit:** Check if new features require updated screenshots or configuration examples in `README.md`.
- **HACS Refresh:** If the version does not appear in HACS, use the "Update information" tool in the HACS settings for this repository.

## 4. Pre-Release Strategy (Beta Testing)

For all **Minor** or **Major** updates, a mandatory pre-release phase is required to ensure stability:

- **Naming Convention:** Append `-beta` to the version (e.g., `1.1.0-beta`). If multiple beta versions are needed, use numeric suffixes: `1.1.0-beta.1`.
- **GitHub Configuration:** When creating the release on GitHub, the "Set as a pre-release" checkbox **must** be checked.
- **HACS Behavior:** HACS will only show these versions to users who have "Show beta" enabled for the repository.
- **Promotion to Stable:** A pre-release is promoted to stable (by removing the suffix) once no critical bugs are reported for at least 48 hours.

## 5. SemVer Rules for this Project

- **Major (x.0.0):** Breaking changes in the YAML configuration or fundamental architectural shifts. **Requires Pre-Release.**
- **Minor (1.x.0):** New card types (e.g., `ha-dwd-pollen-card`) or significant new features. **Requires Pre-Release.**
- **Patch (1.1.x):** Bug fixes, new icons, or minor UI adjustments. (Can be released directly to stable).
