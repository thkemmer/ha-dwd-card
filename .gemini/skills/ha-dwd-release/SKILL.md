---
name: ha-dwd-release
description: Standardized release process for HACS-compliant Home Assistant cards. Defines preparation, publication, and pre-release strategies.
---

# HACS Release Protocol

Mandatory steps for releasing new versions via HACS.

## 1. Preparation Phase (Quality Gates)
Before releasing, verify that all **ha-dwd-development** stages are complete:
- **CI Status**: `gh run list --branch main --limit 1` must be green.
- **Stage 0-3**: All tests pass, build is clean, and documentation is synced.
- **Version**: Bump version in `package.json` according to SemVer.

## 2. Publication Phase
- **Git Tagging**: Create tag `v1.x.x` and push to origin.
- **GitHub Release**:
  - **Title**: Must be user-facing (e.g., "v1.2.0 - New Pollen Card").
  - **Pre-release**: Check "Set as a pre-release" for ALL Major/Minor updates (Beta phase).
  - **Asset**: Ensure `dist/ha-dwd-card.js` is attached.

## 3. SemVer Rules
- **Major (x.0.0)**: Breaking changes. *Requires Beta.*
- **Minor (1.x.0)**: New features/cards. *Requires Beta.*
- **Patch (1.1.x)**: Bug fixes/minor UI. *Stable release allowed.*
