# Tic Tac Toe React Frontend – Architecture Overview

## System Overview
This SPA is implemented with React 18 and has no backend. The UI presents a header, a live status panel, a 3×3 board, and a restart action using the Ocean Professional theme. Game state is held locally in App.jsx. Rules are encapsulated in pure functions within src/utils/gameLogic.js for testability. A lightweight audit logger (src/utils/auditLogger.js) emits structured console entries for actions and errors.

Quality attributes:
- Simplicity: Minimal component hierarchy and separation of UI versus pure utilities.
- Testability: Deterministic pure functions and predictable state transitions.
- Accessibility: Keyboard-operable buttons, ARIA labeling, aria-live status announcements, and visible focus rings.
- Observability: Structured console logs provide session-level traceability.
- Theming: Centralized tokens and CSS classes in src/styles/theme.css.

## Architecture Diagram (Textual)
- Browser (User)
  - React SPA (App.jsx)
    - Status Banner (status-card)
    - Board (Board.jsx)
      - 9× Square (Square.jsx)
    - Restart Control (button)
  - Utilities
    - gameLogic.js (calculateWinner, isDraw, isValidMove, initialBoard, getNextPlayer)
    - auditLogger.js (auditLog)
  - Styles
    - styles/theme.css (Ocean Professional tokens and classes)

Data and control flow:
- User interacts with Square → Board forwards index → App.handleMove(index)
- App validates via isValidMove and either updates state or logs move_ignored
- App recomputes winner/draw and advances the turn when applicable
- Restart resets board and player and emits restart_game

## Component Design
- App (src/App.jsx): Owns board and currentPlayer; derives winner and draw via useMemo. Provides handleMove and handleRestart with try/catch and audit logging. Renders header, status card with aria-live and a screen-reader-only heading, Board, and Restart button.
- Board (src/components/Board.jsx): Renders a 3×3 grid of Square components; forwards onMove(index); disables interaction when finished or when the cell is occupied.
- Square (src/components/Square.jsx): Button cell with ARIA label and disabled state; displays X/O or empty text content.

## State Management
- State
  - board: Array(9) of 'X' | 'O' | null
  - currentPlayer: 'X' | 'O'
- Derived
  - winner: 'X' | 'O' | 'null' via calculateWinner(board)
  - draw: boolean via isDraw(board, winner)
- Effects/Handlers
  - handleMove(index): Validates, updates board, logs place_mark and (when applicable) turn_advance; prevents moves after finish.
  - handleRestart(): Resets to initialBoard() and X; logs restart_game.

## Data Flow and Game Logic
- Input: Square index (0–8) via user click.
- Validation: isValidMove ensures bounds, non-occupied cells, and no play after finish.
- Winner Detection: calculateWinner checks rows, columns, and diagonals.
- Draw Detection: isDraw returns true for full board with no winner.
- Restart: initialBoard() and currentPlayer = 'X'.

## Styling and Theme (Ocean Professional)
styles/theme.css defines:
- Colors: primary #3b82f6, secondary #64748b, success #06b6d4, error #EF4444, background #f9fafb, surface #ffffff, text #111827
- Components: status-card, board, square, btn-restart
- Aesthetics: rounded corners, subtle shadows, smooth transitions, and focus-visible rings
- Layout: centered board with header above and restart action below

## Validation, Error Handling, and Audit
- Validation: Rules enforced through isValidMove and pure logic utilities.
- Error Handling: try/catch within App handlers; errors emit audit ERROR entries and are logged via console.error with minimal, non-PII messages.
- Audit: auditLogger.js writes structured logs with ISO timestamp, user “anonymous-user,” action, event, and metadata. No persistence is used in this scope.

## Testing Strategy
- Unit/Component (src/App.test.jsx):
  - Logic: calculateWinner, isDraw, isValidMove
  - UI: rendering of status and board; invalid move ignored; winner/draw states; restart behavior
- Coverage goal: ≥80% overall; utilities near 100%.
- Tooling: React Testing Library and jest-dom (setup in src/setupTests.js).

## Compliance Considerations (GxP-Inspired)
- ALCOA+ Adaptation:
  - Attributable: anonymous-user field in logs.
  - Contemporaneous: emitted at action time.
  - Accurate/Complete/Consistent: include before/after board states and reasons for ignored moves.
  - Enduring/Available: not applicable without persistence; a future backend could add durable log storage, retention, and access controls.
- Access Controls & E-Signatures: Not applicable in current scope; document forward path if scope expands.

## Operational Considerations
- Build/Serve: react-scripts for start/test/build; no external services are required.
- Dev Server: http://localhost:3000
- Observability: Console logs only; no retention beyond the browser session.
- Security: No PII or network calls.

## Traceability and Mapping
- REQ-UI-001 → App/Board/Square layout and theme classes
- REQ-GAME-001 → gameLogic.js and App handlers
- REQ-ACC-001 → aria-live status and ARIA labels in Board/Square
- REQ-CTRL-001 → restart handler and state reset
- REQ-AUD-001 → auditLogger.js events for moves/restart

## Source References
- src/App.jsx
- src/components/Board.jsx
- src/components/Square.jsx
- src/utils/gameLogic.js
- src/utils/auditLogger.js
- src/styles/theme.css
- src/App.test.jsx

## Related Documentation
For testing approach, coverage targets, and traceability, see:
- docs/TEST_STRATEGY.md
