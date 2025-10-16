# Tic Tac Toe React Frontend – Product Requirements Document (PRD)

## Executive Summary
This document defines the product requirements for a lightweight React-based Tic Tac Toe game playable in the browser. The application implements a modern Ocean Professional theme, provides clear status indicators, validates moves, detects wins and draws, and supports restarting the game. There is no backend or persistence. For GxP mapping, the application adopts a documented stance: certain compliance elements (e.g., durable audit trail, electronic signatures, role-based access control) are Not Applicable (N/A) in the current scope, but a forward-looking approach is outlined should these be added later.

## Goals and Non-Goals
### Goals
- Provide a fully functional local Tic Tac Toe game in the browser.
- Display a 3x3 grid of squares that can be marked by two local players, X and O, taking turns.
- Show a clear status indicating the current player, winner, or draw.
- Validate moves to prevent marking occupied squares and moves after game completion.
- Detect winner across rows, columns, and diagonals; detect draws when all cells are filled with no winner.
- Offer a restart button to reset the game to initial state.
- Apply the Ocean Professional theme for a modern, accessible UI.
- Produce minimal audit-style logs to the console with ISO timestamps for user actions, suitable for demo traceability.

### Non-Goals
- No user accounts, authentication, or role-based access control (RBAC).
- No server-side components, persistence, or databases.
- No network communication, APIs, or external services.
- No electronic signature support in current scope.
- No multi-device synchronization.

## User Personas and User Stories
### Personas
- Casual Player: Wants a quick, simple game experience locally in a single browser session.
- QA/Reviewer: Needs to verify game logic, UI behavior, and minimal audit-style logs for traceability demonstration.
- Developer/Maintainer: Needs clear, concise code structure and documentation for quick onboarding.

### User Stories
- As two local players, we want to click squares alternately to place X and O so that we can play Tic Tac Toe.
- As a player, I want to see whose turn it is and whether someone has won or the game is a draw so that I can understand the game state at a glance.
- As a player, I want a restart button so I can quickly start a new game.
- As a QA/reviewer, I want basic audit-style console logs to show when moves happen and when a restart occurs to support demo traceability.

## Functional Requirements
- REQ-TTT-001: The app shall render a 3x3 grid of clickable squares. Each square indicates its current value (X, O, or empty).
- REQ-TTT-002: The app shall track the current player turn and display it prominently.
- REQ-TTT-003: The app shall validate moves such that:
  - A move cannot be made on an occupied square.
  - A move cannot be made if the game has a winner or is a draw.
- REQ-TTT-004: The app shall detect winners on any row, column, or diagonal.
- REQ-TTT-005: The app shall detect draw states when all squares are filled without a winner.
- REQ-TTT-006: The app shall provide a restart button that clears the board, resets the current player to X, and returns the status to initial.
- REQ-TTT-007: The app shall apply the Ocean Professional theme, including colors, rounded corners, subtle shadows, and accessible contrasts.
- REQ-TTT-008: The app shall produce audit-style console logs for:
  - Place mark action with before/after board states.
  - Invalid move attempts (ignored) with reason.
  - Turn advancement.
  - Restart action with before/after states.
  - Errors captured in try/catch blocks with message and stack (if available).
- REQ-TTT-009: The app shall expose unit tests validating game logic and key UI flows (render, move, win, restart).

## Non-Functional Requirements
- NFR-TTT-001: Performance: user interactions (clicks, renders) shall update UI within 100ms on typical modern browsers.
- NFR-TTT-002: Accessibility: core controls (squares, restart) shall be keyboard accessible and labeled.
- NFR-TTT-003: Maintainability: code shall use modular components (App, Board, Square) and pure game logic utilities for easy testability.
- NFR-TTT-004: Reliability: move validation and win/draw detection must be deterministic and unit-tested.
- NFR-TTT-005: Security/Privacy: no PII captured; only anonymous ‘anonymous-user’ is included in audit-style logs; no data leaves the browser.
- NFR-TTT-006: Observability: audit-style logs utilize ISO timestamps and structured JSON for easy reading during local review.

## Acceptance Criteria
- AC-001: On load, the app shows an empty 3x3 grid, status “Current Player: X,” and a restart button.
- AC-002: Clicking an empty square marks it with the current player’s symbol and advances turn when appropriate.
- AC-003: Clicking an occupied square or attempting a move after game completion does nothing; an audit-style “move_ignored” log is produced with reason.
- AC-004: When three consecutive marks by the same player align in a row, column, or diagonal, the status changes to “Winner: [X|O],” and the board becomes non-interactive.
- AC-005: When all nine squares are filled with no winner, the status changes to “Draw,” and the board becomes non-interactive.
- AC-006: Clicking restart resets the board to all empty, sets the current player to X, and updates the status; an audit-style “restart_game” log is produced with before/after states.
- AC-007: The UI styling follows the Ocean Professional theme as defined in styles/theme.css.
- AC-008: Unit tests pass for winner detection, draw detection, invalid/valid move validation, and basic UI flows (render, move, win, restart).
- AC-009: Audit-style logs appear in the browser console with ISO timestamp, action type, event, and structured details.

## UI/UX and Style Guide Alignment (Ocean Professional theme)
The UI implements the Ocean Professional theme defined in src/styles/theme.css, using:
- Primary Blue (#3b82f6), Secondary Slate (#64748b), Success Cyan (#06b6d4), Error Red (#EF4444)
- Background (#f9fafb), Surface (#ffffff), Text (#111827)
- Rounded corners, subtle drop shadows, and hover/focus states with visible rings
- A centered grid layout with a header and status panel above, and a restart action below
Interactive elements use accessible contrasts and focus-visible outlines for keyboard navigation.

## GxP Compliance Mapping (ALCOA+, validation controls, audit trail stance)
- Attributable: Actions logged with timestamp and user identifier (anonymous-user) via src/utils/auditLogger.js.
- Legible: Code is modular and documented; variables and components are named clearly.
- Contemporaneous: Logs are emitted in real-time upon user actions.
- Original and Accurate: Logs are generated at the time of actions and include before/after states to reflect accurate context.
- Complete and Consistent: Core user actions (valid/invalid moves, turn advancement, restart, errors) are logged consistently.
- Enduring and Available: N/A in current scope since logs are console-only and not persisted; documented forward path: add backend logging with storage durability, retention, and RBAC if scope expands.

Validation Controls:
- Input Validation: isValidMove checks array bounds, occupancy, and prevents play after a win.
- Business Rules: Turn changes only when move valid; winner/draw detection via calculateWinner and isDraw.
- Error Handling: try/catch around move and restart paths; logs errors to audit trail.

Access Controls and E-Signatures:
- N/A in current scope; forward-looking plan: introduce authentication, role checks before critical actions, and electronic signature ceremony if elevated GxP scope is introduced with persistence.

Audit Trail:
- Implemented locally with structured logs (JSON) containing ISO timestamp, user, action type, event, and details. Future: persist to secure backend store with immutability guarantees, retention policies, and audit reports.

## Testing Strategy and Coverage Goals
- Unit tests focus on gameLogic.js (winner detection, draw, move validation) and core UI flows in App.test.jsx.
- Coverage goal: logic utilities target near 100% line coverage; overall project aims for 80%+.
- Integration/API tests: N/A (no backend).
- UI tests: Render checks, interaction flows (place mark, win, restart).
- Validation tests: Ensure invalid moves are prevented; game completion halts further interaction.
- Tooling: React Testing Library with jest-dom via setupTests.js.

## Traceability Matrix (REQ IDs to components/tests)
- REQ-TTT-001 → Implementation: Board.jsx, Square.jsx; Verification: App.test.jsx (renders board, buttons)
- REQ-TTT-002 → Implementation: App.jsx (statusText); Verification: App.test.jsx (status visible)
- REQ-TTT-003 → Implementation: gameLogic.js:isValidMove, App.jsx:handleMove; Verification: App.test.jsx “repeat click ignored”
- REQ-TTT-004 → Implementation: gameLogic.js:calculateWinner; Verification: App.test.jsx “enforces move rules and shows winner”
- REQ-TTT-005 → Implementation: gameLogic.js:isDraw; Verification: App.test.jsx “isDraw true when board filled without winner”
- REQ-TTT-006 → Implementation: App.jsx:handleRestart; Verification: App.test.jsx “restart clears the board”
- REQ-TTT-007 → Implementation: styles/theme.css and usage in App/Board/Square; Verification: visual review and class usage
- REQ-TTT-008 → Implementation: auditLogger.js and App.jsx auditLog calls; Verification: manual console review during tests/run
- REQ-TTT-009 → Implementation: App.test.jsx and utilities; Verification: jest results passing locally

## Release Criteria
- All acceptance criteria met and verified.
- All unit tests pass with target coverage thresholds met or exceeded.
- Linting passes without errors.
- Manual exploratory testing confirms move validation, win/draw detection, and restart behavior.
- Visual verification confirms Ocean Professional theme adherence and accessible focus states.
- Documented GxP stance with forward-looking compliance plan is present.

## Release Gate Checklist
- [ ] Functional: Board renders, moves valid, winner/draw detection, restart works
- [ ] Non-Functional: Accessibility affordances present; performance acceptable
- [ ] Tests: All unit tests pass; coverage ≥ 80% overall and near 100% for game logic
- [ ] Linting: No lint errors; warnings triaged
- [ ] GxP Mapping: ALCOA+ mapping documented; validation controls and audit logging implemented (console)
- [ ] Security/Privacy: No PII; anonymous user only; no data egress
- [ ] Documentation: PRD and Architecture docs updated and stored under docs/
- [ ] Sign-offs: Product/QA review completed

## Appendices
- Code References:
  - src/App.jsx
  - src/components/Board.jsx
  - src/components/Square.jsx
  - src/utils/gameLogic.js
  - src/utils/auditLogger.js
  - src/styles/theme.css
  - src/App.test.jsx
