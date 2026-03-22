---
name: ha-dwd-security
description: Automated security maintenance and dependency updates for the HA DWD Card project. Ensures vulnerabilities are fixed without breaking core functionality.
---

# Security Maintenance Protocol

This skill provides a standardized workflow to detect, fix, and validate security vulnerabilities in the project's dependencies.

## 1. Audit Phase (Identification)
**Goal:** Map all security risks and their severity.
- **Action:** Run `npm audit` for local dependency checks.
- **Action:** (Optional) Check `gh api repos/:owner/:repo/dependabot/alerts` for GitHub-detected vulnerabilities.
- **Priority:** Focus on 'Critical' and 'High' severity first.

## 2. Remediation Phase (Atomic Fixes)
**Goal:** Apply fixes without introducing regressions.
- **Action:** Try `npm audit fix` for automatic, non-breaking updates.
- **Action:** If `npm audit fix` fails or requires a major version bump, update packages individually using `npm install [package]@[version]`.
- **Constraint:** One update (or small logical group) at a time. Do not update unrelated dependencies in the same commit.

## 3. Local Verification Loop
**Goal:** Confirm the fix works and the project is stable.
After *each* update step:
1.  **Install:** `npm install`
2.  **Test:** `npm test`
3.  **Lint:** `npm run lint`
4.  **Build:** `npm run build`
- **Backtrack:** If a test or build fails, revert the change and mark the dependency for a manual architectural review (it might be a breaking change).

## 4. Remote Validation (GitHub CI)
**Goal:** Final confirmation in the "Source of Truth" environment.
- **Action:** Push the fixes to a temporary branch (e.g., `security-updates`).
- **Action:** Wait for the GitHub CI (`ci.yml`) to complete successfully.
  *Command:* `gh run list --branch security-updates --limit 1`

## 5. Finalization
**Goal:** Secure the codebase.
- **Action:** Merge the validated `security-updates` branch into `main`.
- **Action:** Commit message must include the CVE IDs or a brief description of the fixed packages (e.g., `security: update flatted to 3.5.2 to fix GHSA-25h7-pfq9-p65f`).

## 6. Proactive Security
- **Action:** Keep Node.js and npm versions up to date.
- **Action:** Minimize the number of production dependencies.
