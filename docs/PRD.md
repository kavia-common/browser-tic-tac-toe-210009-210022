# Tic Tac Toe React Frontend – Product Requirements Document (PRD)

## Overview
This PRD defines requirements for a simple, local two‑player Tic Tac Toe game built in React 18 with no backend or persistence. The UI follows the Ocean Professional theme and prioritizes accessibility and responsiveness. The application validates inputs, detects winners and draws, and supports a restart flow. In line with a lightweight, GxP‑inspired approach suitable for a frontend‑only demo, the app emits structured, audit‑like console logs for moves, ignored moves, turn advancement, restarts, and errors attributed to an anonymous local user.

## Product Context
The game runs entirely in the browser as a single‑page app. Two players share the same device and alternate placing X and O on a 3×3 grid. The first player to align three marks wins. In the absence of any backend, all state and audit‑like logs are ephemeral to the current session.

## Goals and Non‑Goals
### Goals
- Deliver a complete local gameplay loop with clear status feedback and restart.
- Present an accessible, responsive UI themed with Ocean Professional tokens and components.
- Enforce input validation with deterministic rules managed by pure utility functions.
- Provide structured audit‑like console logs to support basic traceability for demonstration.
- Maintain quality with linting, formatting, and a test suite that targets ≥80% coverage.

### Non‑Goals
- No authentication, RBAC, e‑signatures, or persistent identity.
- No backend, database, or networked multiplayer.
- No data persistence beyond in‑memory session state.

## Objectives
- Provide a clean, accessible, responsive UI consistent with the Ocean Professional theme.
- Implement core gameplay with clear status indicators, restart, and audit‑style event logging.
- Maintain code quality via ESLint/Prettier and tests with ≥80% overall coverage.

## Personas and User Stories
### Personas
- Casual Player: Quickly plays a round on a shared device with intuitive controls.
- QA/Reviewer: Verifies rule enforcement, accessibility basics, and console audit‑like logs.
- Developer/Maintainer: Needs modular utilities, simple state management, and tests.

### User Stories
- As two local players, we alternate placing marks on a 3×3 board until win or draw.
- As a player, I want the UI to show the current player, the winner, or a draw clearly.
- As a player, I want a Restart button to reset the state and begin a new round.
- As a reviewer, I expect audit‑like logs in the console for moves, invalid attempts, and restarts.

## Functional Requirements and Acceptance Criteria
- REQ‑TTT‑001: Render a 3×3 grid of interactive squares.
  - AC‑001: On load, nine empty keyboard‑accessible buttons are visible.
- REQ‑TTT‑002: Track and display current player, starting at X.
  - AC‑002: Status shows “Current Player: X” initially and alternates on valid moves.
- REQ‑TTT‑003: Validate moves (no out‑of‑bounds, no occupied squares, no moves after finish).
  - AC‑003: Invalid attempts produce no state change and emit a move_ignored audit entry with reason.
- REQ‑TTT‑004: Detect winners across rows, columns, and diagonals.
  - AC‑004: On a win, status shows “Winner: X|O” and the board becomes non‑interactive.
- REQ‑TTT‑005: Detect draws when the board is full with no winner.
  - AC‑005: On a draw, status shows “Draw” and the board becomes non‑interactive.
- REQ‑TTT‑006: Provide a restart action that resets board and current player to X.
  - AC‑006: Clicking Restart returns to the initial state and emits restart_game with before/after details.
- REQ‑TTT‑007: Apply the Ocean Professional theme.
  - AC‑007: Visual inspection confirms color tokens, rounded corners, shadows, and focus rings from styles/theme.css.
- REQ‑TTT‑008: Emit structured audit‑like console logs.
  - AC‑008: Logs contain ISO timestamp, anonymous user, action type, event, and relevant metadata.
- REQ‑TTT‑009: Provide unit/component tests for core logic and UI flows.
  - AC‑009: Tests cover winner/draw detection, invalid moves, rendering, and restart flows with ≥80% coverage.

## UX/UI Requirements (Ocean Professional)
The layout centers the board with a simple header and a restart action below. The status panel appears as a card with a colored status dot and live‑updating text (aria‑live=polite). Buttons use rounded corners, subtle shadows, accessible contrast, and focus‑visible outlines. The theme uses:
- Colors: primary #3b82f6, secondary #64748b, success #06b6d4, error #EF4444, background #f9fafb, surface #ffffff, text #111827.
- Components/classes: status‑card, board, square, btn‑restart.
All are defined in src/styles/theme.css and consumed by App/Board/Square.

## GxP‑Inspired Compliance (Lightweight Adaptation)
Although this demo handles no sensitive data or persistence, it demonstrates adapted ALCOA+ concepts:
- Attributable: Audit‑like logs include user “anonymous‑user.”
- Contemporaneous: Logs are emitted at action time.
- Accurate/Complete/Consistent: Entries include event names and context such as before/after boards and reasons for ignored moves.
- Enduring/Available: Not applicable without persistence; out of scope for this frontend‑only app and documented as such.
- Access Controls & E‑Signatures: Not applicable in the current scope; if expanded, introduce auth, RBAC, durable audit storage, and e‑signature mechanisms.

## Non‑Functional Requirements
- Performance: Interactions and updates feel immediate under normal client hardware.
- Accessibility: Squares and Restart are keyboard accessible with ARIA labels; status changes announce via aria‑live. A screen‑reader‑only heading is included in the status card.
- Security/Privacy: No PII; no network calls; console logs remain in the local session.
- Reliability: Pure utilities and explicit validation enforce deterministic behavior.
- Maintainability: Small component tree; game logic in src/utils/gameLogic.js; centralized theme CSS.
- Observability: Console logs only within the session.

## Validation and Error Handling Strategy
Move validation is handled by isValidMove; calculateWinner and isDraw determine outcomes. App wraps move and restart flows in try/catch. On exceptions, the UI remains responsive, console.error captures the technical error, and auditLog records an ERROR event with message and stack.

## Game Rules and Edge Cases
Players alternate starting with X. Clicking an occupied square, clicking after a win/draw, or providing an invalid index (guarded by UI) is ignored and logged. The game ends immediately when a winner or draw is detected. Restart returns to a fresh board and sets current player to X.

## Testing Strategy Summary
- Unit: calculateWinner, isDraw, isValidMove, initialBoard, getNextPlayer with happy paths and edge cases.
- Component: App status and board rendering; valid/invalid moves; winner/draw states; restart.
- Accessibility: Presence of aria‑live status updates and ARIA labels; recommend adding jest‑axe checks.
- Coverage Target: ≥80% overall, utilities near 100%.

## Requirement Traceability
- REQ‑UI‑001 → App/Board/Square layout and theme classes.
- REQ‑GAME‑001 → gameLogic.js functions and App handlers.
- REQ‑ACC‑001 → aria‑live and ARIA labels in status/Board/Square.
- REQ‑CTRL‑001 → restart logic in App.
- REQ‑AUD‑001 → auditLogger.js events for moves and restart.

## Traceability Matrix
- REQ‑TTT‑001 → Implementation: Board.jsx, Square.jsx → Verification: App.test.jsx “renders status and board”
- REQ‑TTT‑002 → Implementation: App.jsx (statusText) → Verification: App.test.jsx
- REQ‑TTT‑003 → Implementation: gameLogic.isValidMove, App.handleMove → Verification: App.test.jsx “repeat click ignored”
- REQ‑TTT‑004 → Implementation: gameLogic.calculateWinner → Verification: App.test.jsx winner tests
- REQ‑TTT‑005 → Implementation: gameLogic.isDraw → Verification: App.test.jsx draw tests
- REQ‑TTT‑006 → Implementation: App.handleRestart → Verification: App.test.jsx restart test
- REQ‑TTT‑007 → Implementation: styles/theme.css + class usage → Verification: visual review
- REQ‑TTT‑008 → Implementation: auditLogger.js + App.jsx calls → Verification: console review
- REQ‑TTT‑009 → Implementation: App.test.jsx + utilities → Verification: Jest suite passing

## Release Criteria
All acceptance criteria pass. Unit/component tests meet ≥80% coverage and linting/formatting are clean. Manual checks confirm Ocean Professional theming and accessibility basics. Compliance scope and rationale for non‑applicable controls are documented.

## Release Gate Checklist
- [ ] All functional acceptance criteria met (REQ‑TTT‑001..009)
- [ ] Unit tests passing with ≥80% overall coverage; utilities near 100%
- [ ] Linting and Prettier checks pass
- [ ] Visual adherence to Ocean Professional theme verified
- [ ] Accessibility basics verified (keyboard focus, aria‑live status)
- [ ] Audit‑like logs observed for moves, ignored moves, turn advance, restart, and errors
- [ ] Documentation updated (PRD, Architecture, Testing Strategy, Traceability)
- [ ] Known CRA chain advisories acknowledged; no external services used

## Appendices
- Source References:
  - src/App.jsx
  - src/components/Board.jsx
  - src/components/Square.jsx
  - src/utils/gameLogic.js
  - src/utils/auditLogger.js
  - src/styles/theme.css
  - src/App.test.jsx
