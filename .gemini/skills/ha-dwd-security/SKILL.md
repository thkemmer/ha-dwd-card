---
name: ha-dwd-maintenance
description: Protocol for security updates and dependency maintenance. Focuses on vulnerability identification and remediation, leveraging the central development workflow for verification.
---

# Security & Dependency Maintenance

This protocol ensures the project remains secure and up to date.

## 1. Identification (Audit)
- **Action**: Run `npm audit` regularly.
- **Priority**: Focus on 'Critical' and 'High' severity.

## 2. Remediation
- **Atomic Fixes**: Use `npm audit fix` for non-breaking updates.
- **Manual Updates**: If major version bumps are needed, update individually: `npm install [package]@[version]`.
- **Commit Pattern**: Commits MUST include CVE IDs or GHSA links (e.g., `security: update flatted to 3.5.2 to fix GHSA-25h7-pfq9-p65f`).

## 3. Mandatory Verification
Every maintenance change MUST follow the **ha-dwd-development** workflow:
1. **Stage 0**: Run tests, build, and lint.
2. **CI Check**: Verify via `gh run list` after pushing to a temporary branch.
3. **Merge**: Only merge to `main` after local and remote validation is successful.
