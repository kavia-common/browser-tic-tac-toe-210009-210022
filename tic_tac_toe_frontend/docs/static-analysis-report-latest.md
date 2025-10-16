Static Analysis Report – tic_tac_toe_frontend (Latest)
Date: 2025-10-16T00:00:00Z

Scope
- Entire frontend repo: linting, formatting check, and security audit.
- Tools executed:
  - ESLint (flat config: eslint.config.mjs)
  - Prettier --check
  - npm audit --audit-level=high --json (summarized)

Summary of Findings
1) Linting (ESLint)
- Command: npm run lint
- Result: Clean (0 errors, 0 warnings)
- Notes:
  - Flat config enables browser and Jest globals; no-undef issues from earlier report are resolved.

2) Formatting (Prettier)
- Command: npm run format:check
- Result: Code style differences detected in 5 files:
  - docs/static-analysis-report-latest.md
  - docs/static-analysis-report.md
  - src/App.jsx
  - src/index.js
  - src/utils/auditLogger.js
- Impact: Style-only; fix via: npm run format

3) Dependency & Security Audit (npm audit)
- Command: npm audit --audit-level=high --json
- High/Critical vulnerabilities: 5 total (approximate, per audit output)
  - Critical: form-data (3.0.0–3.0.3) uses unsafe randomness; fix available in >=3.0.4
  - High: svgo 1.x, @svgr/webpack 4–5.x, @svgr/plugin-svgo <=5.5.0, css-select <=3.1.0 (transitive via CRA/react-scripts ecosystem)
- Additional (moderate/low): Several advisories including @babel/runtime/helpers <7.26.10, http-proxy-middleware <2.0.9, on-headers <1.1.0, brace-expansion ranges.
- Likely root cause: react-scripts 5.x dependency chain pins older tooling (svgo 1.x, webpack-dev-server ranges).

High-level Recommendations
- Short-term:
  - Run npm run format to fix Prettier issues.
  - Keep dev server non-exposed beyond localhost in CI/dev environments.
- Medium-term:
  - Consider package.json overrides to bump transitive dependencies (success not guaranteed under CRA pins):
    - form-data to ^3.0.4
    - brace-expansion to ^2.0.2
    - http-proxy-middleware to >=2.0.9
    - @babel/runtime/helpers >=7.26.10
  - Remove legacy "eslintConfig" from package.json to avoid confusion with flat config (optional hygiene).
- Long-term (preferred):
  - Migrate off react-scripts (e.g., to Vite) or adopt an updated toolchain to reduce svgo/@svgr/webpack/webpack-dev-server advisories.

Details
A) ESLint
- Command output: no issues found.

B) Prettier differences
- Files with formatting diffs:
  - docs/static-analysis-report-latest.md
  - docs/static-analysis-report.md
  - src/App.jsx
  - src/index.js
  - src/utils/auditLogger.js
- Resolution: npm run format (pre-commit/CI hook recommended)

C) npm audit (abridged high/critical summary)
- Critical:
  - form-data (3.0.0–3.0.3): unsafe randomness for multipart boundaries. Fix: >=3.0.4
- High:
  - svgo 1.x (transitive via @svgr): known vulnerabilities in SVG optimization
  - @svgr/webpack 4–5.x, @svgr/plugin-svgo <=5.5.0: affected via CRA chain
  - css-select <=3.1.0: upstream dependency used by svgo
- Moderate/Low highlights:
  - @babel/helpers/runtime <7.26.10: inefficient RegExp complexity
  - http-proxy-middleware <2.0.9: issues around request body handling
  - on-headers <1.1.0
  - brace-expansion known ReDoS ranges
- Note: Many fixes require updating the build toolchain (react-scripts) or migrating away from CRA.

Action Plan Checklist
- [ ] Run npm run format and commit changes
- [ ] Optionally update package.json to remove legacy "eslintConfig" (flat config already in use)
- [ ] Evaluate dependency overrides for critical/high issues (form-data and others)
- [ ] Plan migration path away from CRA to modern tooling to address transitive vulnerabilities at scale

End of Report
