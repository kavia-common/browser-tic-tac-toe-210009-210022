# Tic Tac Toe React Frontend – Testing Strategy

## Introduction and Alignment
This Testing Strategy describes the quality approach for the Tic Tac Toe React frontend. It aligns with the PRD and Architecture Overview documents, emphasizing unit and component tests with React Testing Library and Jest. The application is a self-contained SPA with no backend. All state is in-memory within App.jsx; pure logic resides in utils/gameLogic.js; audit-style logging is provided by utils/auditLogger.js.

References:
- PRD: docs/PRD.md
- Architecture: docs/Architecture.md
- Traceability Matrix: docs/Traceability-Matrix.md
- Source files: src/App.jsx, src/components/Board.jsx, src/components/Square.jsx, src/utils/gameLogic.js, src/utils/auditLogger.js, src/styles/theme.css, src/App.test.jsx

## Objectives
- Verify all PRD functional requirements (REQ-TTT-001..009).
- Maintain a reliable automated test suite focused on unit and component tests.
- Validate accessibility fundamentals and Ocean Professional UI affordances.
- Provide traceability between requirements, implementation, and tests.
- Enforce coverage and lint gates to prevent regressions.

## Scope
In scope:
- Game logic: move validation, winner and draw detection, restart.
- UI interactions: rendering, moves, disabled states, restart.
- Accessibility basics: keyboard access, aria-live updates, focus-visible.
- Linting and basic static analysis.
Out of scope:
- APIs, persistence, authentication/authorization, network flows, and performance benchmarking beyond SPA responsiveness.

## Test Levels and Types
### Unit Tests (Utilities)
- src/utils/gameLogic.js
  - calculateWinner: rows, columns, diagonals.
  - isDraw: full board without winner.
  - isValidMove: bounds, occupancy, post-finish prevention.
  - initialBoard, getNextPlayer: correctness and invariants.

### Component Tests (React Testing Library)
- App.jsx: status rendering, move enforcement, win/draw states, restart behavior, error handling paths.
- Board.jsx: click propagation, disabling when finished or occupied.
- Square.jsx: aria-label correctness, disabled state, value rendering.

### Integration-lite (Within SPA)
- End-to-end user flows across the component tree (no external services):
  - Winning sequence; draw sequence; restart path.
  - Attempts of invalid moves produce no state change.

### Accessibility Checks
- Manual checks: keyboard navigation, focus-visible rings, aria-live status updates.
- Optional automation: jest-axe/axe-core for common violations.

### Visual Consistency (Optional)
- If adopted, Playwright/Cypress baseline screenshots for:
  - Initial state, mid-game, winner, draw, post-restart.

## Coverage Targets and Gates
- Overall coverage: ≥ 80% (statements, lines, functions). Branches ≥ 75% recommended.
- Utilities: aim near 100% due to pure/deterministic logic.
- Components: cover primary render states and interaction paths.
- CI command (example): CI=true react-scripts test --watchAll=false --coverage

## Tooling
- Jest (via react-scripts).
- React Testing Library with @testing-library/jest-dom (configured in src/setupTests.js).
- ESLint using flat config (eslint.config.mjs).
- Prettier for formatting checks.
- Optional: jest-axe and axe-core; Playwright/Cypress for visual regression.

## Test Data Strategy
- Synthetic, privacy-safe board arrays.
- Edge boards:
  - Empty board: Array(9).fill(null)
  - Imminent wins: e.g., ['X','X',null, null,null,null, null,null,null]
  - Full draw: ['X','O','X','X','O','O','O','X','X']
  - Negative tests: out-of-bounds indices, attempts after winner, repeated clicks.

## Requirement-to-Test Mapping (Summary)
- REQ-TTT-001 → App renders 9 squares + restart; board accessible via buttons.
- REQ-TTT-002 → Status shows current player starting at X; alternates on valid moves.
- REQ-TTT-003 → Repeated click ignored; no state change; invalid moves blocked.
- REQ-TTT-004 → Top-row win sequence; shows “Winner: X”; disables board.
- REQ-TTT-005 → Fill board to draw; shows “Draw”; disables board.
- REQ-TTT-006 → Restart resets board to empty, current player to X.
- REQ-TTT-007 → Themed classes present; manual visual confirmation for Ocean Professional.
- REQ-TTT-008 → Audit paths exercised; optional console spies validate log calls.
- REQ-TTT-009 → Unit tests present and enforced via coverage gates.

## GxP-inspired Validation Points (Frontend-only)
- Attributable: user field “anonymous-user” in audit logs.
- Contemporaneous: audit entries generated at action time.
- Accurate/Complete/Consistent: include before/after board states, reasons for ignored moves.
- Error handling: try/catch around move/restart; audit ERROR entries on exceptions.
- Enduring/Available: out of scope without persistence; documented rationale.

## Reporting and Quality Gates
- Lint: npm run lint must pass.
- Coverage: thresholds enforced; utilities near 100%.
- Tests: all passing; failure blocks merge.
- Static analysis: see tic_tac_toe_frontend/docs/static-analysis-report-latest.md for advisory status and remediation notes.

## Release Readiness Checklist
- All mapped tests pass; manual visual/a11y checks completed.
- Lint and Prettier checks pass.
- Coverage ≥ 80% overall; utilities near 100%.
- Documentation (PRD, Architecture, Traceability Matrix, Testing Strategy) up to date.
- Audit-style logs verified during user flows.

