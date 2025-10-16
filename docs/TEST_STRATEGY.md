# Tic Tac Toe React Frontend – Test Strategy

## Introduction and Alignment
This Test Strategy defines the quality approach for the Tic Tac Toe React frontend. It aligns with the approved Product Requirements Document (PRD) and the Architecture Overview. The application is a single-page application (SPA) with no backend and no persistence. All state is in-memory inside the App component, with pure game-logic utilities and a lightweight audit-style console logger.

This strategy emphasizes unit and component testing using Jest and React Testing Library, accessibility checks using jest-axe/axe-core, and optional visual regression for UI drift detection. It adopts GxP-inspired validation points adapted to a frontend-only scope to promote traceability and robust error handling without implying formal regulatory controls.

References:
- PRD: docs/PRD.md
- Architecture: docs/ARCHITECTURE.md
- Source files: src/App.jsx, src/components/Board.jsx, src/components/Square.jsx, src/utils/gameLogic.js, src/utils/auditLogger.js, src/styles/theme.css, src/App.test.jsx

## Objectives
The objectives are to:
- Verify that all functional requirements in the PRD are implemented correctly and remain stable as code evolves.
- Establish a maintainable automated test suite focused on unit and component tests.
- Ensure accessibility fundamentals are continuously checked.
- Provide traceability between requirements, implementation, and tests.
- Enforce quality gates that prevent regressions and ensure minimum coverage levels.

## Scope
In scope:
- Game logic verification: move validation, winner detection, draw detection, state reset.
- Component rendering and interactions: Board and Square behavior, App status updates, and restart functionality.
- Accessibility checks for interactive controls and live status updates.
- Linting and basic static analysis.

Out of scope:
- Backend, APIs, persistence, authentication, role-based access control, e-signatures, multi-user networking, and performance benchmarking beyond basic responsiveness expected of an SPA.

## Test Levels and Types
### Unit Tests
- Target functions in src/utils/gameLogic.js: calculateWinner, isDraw, isValidMove, initialBoard, getNextPlayer.
- Verify pure logic including standard paths and edge cases.
- Example checks include:
  - Winner detection across rows, columns, and diagonals.
  - Draw detection when all cells are filled without a winner.
  - Move validity constraints for occupied cells, completed games, and index bounds.

### Component Tests (React Testing Library)
- App.jsx: rendering of status, board, and restart control; enforcing move rules; state transitions; audit error handling paths.
- Board.jsx: correctly disables squares when the game is finished and propagates clicks to onMove.
- Square.jsx: correct ARIA labeling, disabled state, and rendering of X/O.

### Integration-lite (SPA)
- Within the SPA, validate that App orchestrates utilities and UI:
  - Click flows for a full winning sequence and draw scenario.
  - Restart resets board and status.
  - Attempting invalid moves does not change board state.

### Accessibility Tests
- Use jest-axe/axe-core to check for common violations:
  - Buttons are accessible via keyboard, have visible focus, and appropriate aria-labels.
  - Status panel announces changes via aria-live="polite".
- Note: Accessibility checks complement, not replace, manual audits.

### Visual Regression (Optional)
- If adopted, use Playwright or Cypress with screenshot comparison (e.g., Playwright’s toHaveScreenshot or a snapshot plugin).
- Baseline screens: initial load, mid-game state, winner state, draw state, and post-restart state.

## Coverage Targets
- Overall project coverage minimum: 80%.
- Game logic utilities: strive for near 100% due to pure and deterministic nature.
- Key components (App, Board, Square): coverage sufficient to cover primary user flows and rendering states. Rationale: Component logic is thinner than utilities; we target high coverage of rendering conditions and event paths rather than exhaustive style assertions.

Recommended coverage gate configuration (example):
- Statements: >= 80%
- Branches: >= 75%
- Functions: >= 80%
- Lines: >= 80%
- Utilities (src/utils/*): aim >= 95%

## Tooling
- Test runner: Jest (via react-scripts).
- DOM testing: React Testing Library with @testing-library/jest-dom.
- Accessibility: jest-axe with axe-core.
- Linting: ESLint with flat config (eslint.config.mjs) already present; use npm run lint / lint:fix.
- Formatting: Prettier (optional scripts exist).
- Optional e2e/visual: Playwright or Cypress can be introduced later if needed.

Notes on current repository setup:
- Tests are in src/, e.g., src/App.test.jsx.
- setupTests.js configures jest-dom.
- ESLint flat config includes globals for browser and Jest to avoid false positives.

## Test Environment and Setup
- Execution: Local via npm test (react-scripts test). CI should run in watchAll=false mode.
- Environment: Browser-like JS DOM provided by Jest. No real network or server interactions.
- Setup files:
  - src/setupTests.js: loads jest-dom matchers.
- Static assets: styles/theme.css and SVG assets are loaded in the React environment.

Assumptions:
- No environment variables are required for tests.
- Tests must be deterministic and isolated; no state is shared between tests beyond default Jest environment.

## Test Data Strategy
- Use privacy-safe, synthetic data in test cases. For Tic Tac Toe, test data are board arrays of length nine.
- Provide explicit configurations for key edge boards:
  - Empty board: Array(9).fill(null)
  - Imminent win patterns: e.g., ['X','X',null, null,null,null, null,null,null]
  - Full draw boards: e.g., ['X','O','X','X','O','O','O','X','X']
  - Invalid scenarios for negative testing: out-of-bounds index (e.g., 9), attempts after winner is set, repeated clicks on occupied squares.

No PII or sensitive information is used or produced. All logs are local to the browser console.

## Detailed Test Cases Matrix
Below is a matrix mapping PRD requirements to representative automated tests. Test names are indicative; actual test IDs can be aligned with filenames and describe blocks.

- REQ-TTT-001 (Render 3x3 grid)
  - Test: App renders nine square buttons and a restart button; board has role=button squares.
- REQ-TTT-002 (Track/display current player)
  - Test: Initial status shows “Current Player: X”; alternates after valid moves.
- REQ-TTT-003 (Validate moves)
  - Test: Repeated click on same square is ignored; no state change; board remains valid; expect move_ignored audit path to be exercised indirectly.
- REQ-TTT-004 (Detect winners)
  - Test: Simulate top-row X win sequence; status displays “Winner: X”; board becomes non-interactive.
- REQ-TTT-005 (Detect draws)
  - Test: Fill board into draw state; status displays “Draw”; board becomes non-interactive.
- REQ-TTT-006 (Restart)
  - Test: After some moves, click restart; board resets to empty; status shows “Current Player: X”.
- REQ-TTT-007 (Theme usage)
  - Test: Presence of themed classes and structure verified by rendering; visual confirmation remains a manual check or optional visual regression baseline.
- REQ-TTT-008 (Audit-style logs)
  - Test: Exercise move, invalid move, turn advance, and restart flows to cover audit logger calls; console interception can be added to assert audit calls (optional to avoid brittle tests).
- REQ-TTT-009 (Provide unit tests)
  - Test: Existing suite covers logic utilities and primary UI flows; enforce coverage gates.

Example additional tests to add over time:
- Board disabled state when winner/draw is present.
- Square aria-label correctness and disabled state for occupied cells.
- Error handling paths in App.handleMove and App.handleRestart emit audit ERROR entries when exceptions occur (use jest.spyOn(console, 'error') and mock auditLog).

## GxP-inspired Validation Points (Frontend-only Adaptation)
While the app is not a regulated system and lacks persistence, we adopt a pragmatic subset of validation concepts:
- Attributable: Audit logs include a user identifier (“anonymous-user”) and ISO timestamp.
- Contemporaneous: Logs are emitted at the time of the action.
- Accurate/Consistent/Complete: For updates, audit entries include before/after board states when applicable, reasons for ignored moves, and action/event names.
- Error Handling: try/catch around move and restart flows; on error, console.error is called and an audit ERROR event is logged.
- Input Validation: isValidMove enforces index bounds, occupancy checks, and end-of-game constraints.
- Enduring/Available: Not applicable in a frontend-only context without persistence; this is documented as out of scope.

Validation checks to be verified by tests:
- Input validation blocks invalid moves.
- Audit path is exercised during normal and error flows (optional direct assertions).
- UI remains responsive despite exceptions, and state remains consistent.

## Reporting and Quality Gates
- CI should run:
  - Linting: npm run lint
  - Unit tests with coverage: CI=true react-scripts test --watchAll=false --coverage
- Coverage thresholds:
  - Overall >= 80% (statements, lines, functions); branches >= 75% as guidance.
  - Utils near 100% where reasonable.
- Failure gates:
  - Lint errors fail the pipeline.
  - Coverage below thresholds fails the pipeline.
  - Test failures fail the pipeline.

Reports:
- Jest coverage reports in text-summary and lcov formats (default via react-scripts).
- ESLint output summarized in CI logs. A static analysis report exists under tic_tac_toe_frontend/docs/static-analysis-report.md.

## Traceability Mapping
Representative mapping from PRD → Implementation → Tests (abridged):
- REQ-TTT-001 → Board.jsx, Square.jsx → App.test.jsx “renders status and board”
- REQ-TTT-002 → App.jsx (statusText) → App.test.jsx
- REQ-TTT-003 → gameLogic.isValidMove, App.handleMove → App.test.jsx “repeat click ignored”
- REQ-TTT-004 → gameLogic.calculateWinner → App.test.jsx winner scenario
- REQ-TTT-005 → gameLogic.isDraw → App.test.jsx draw scenario
- REQ-TTT-006 → App.handleRestart → App.test.jsx restart test
- REQ-TTT-007 → styles/theme.css + class usage → Visual inspection and optional visual regression
- REQ-TTT-008 → auditLogger.js + App.jsx calls → Console review and optional console interception tests
- REQ-TTT-009 → App.test.jsx + utilities tests → Jest suite passing with coverage thresholds

## Risks and Mitigations
- Risk: Over-reliance on DOM class assertions can lead to brittle tests.
  - Mitigation: Prefer role/aria and text-based queries over class names; assert behavior rather than styling.
- Risk: Accessibility issues undetected without automation.
  - Mitigation: Integrate jest-axe checks for common violations; maintain manual checks for keyboard navigation and focus management.
- Risk: Limited observability beyond console.
  - Mitigation: Keep audit logging minimal but structured; consider adding tests that spy on console methods to verify error logs for critical paths.

## Maintenance Plan
- Keep tests updated with any changes to App, Board, Square, and game logic functions.
- Extend tests alongside new features or refactors to maintain coverage thresholds.
- Review accessibility checks when UI structure changes.
- Revisit optional tooling (Playwright/Cypress) if the scope grows to require end-to-end coverage or visual regressions.

## Appendix: Suggested Implementation Details
- Accessibility testing:
  - Install dev dependencies: jest-axe and axe-core.
  - Example usage:
    ```javascript
    import { render } from '@testing-library/react';
    import { axe, toHaveNoViolations } from 'jest-axe';
    expect.extend(toHaveNoViolations);
    test('App has no major a11y violations', async () => {
      const { container } = render(<App />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
    ```
- Console interception (optional):
  - Use jest.spyOn(global.console, 'log') and jest.spyOn(global.console, 'error') to assert audit and error paths, restoring mocks after each test.
- Visual regression (optional):
  - If using Playwright, create screenshot baselines for initial, mid-game, winner, draw, and post-restart states. Guard expected deltas through reviews.

## Release Readiness Checklist
- All PRD requirements have passing tests or verified manual checks where automation is not applicable.
- Lint passes with zero errors.
- Coverage thresholds met or exceeded; utilities near 100% coverage.
- Accessibility checks run and pass; manual checks completed.
- Test Strategy and Architecture documentation updated; traceability maintained.
