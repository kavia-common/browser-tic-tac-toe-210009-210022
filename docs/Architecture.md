# Tic Tac Toe React Frontend – Architecture Overview

## System Overview
The application is a single-page React application (SPA) with no backend. It renders a modern Ocean Professional UI consisting of a header, a status panel with live updates, a 3x3 board, and a restart action. All game state is held in-memory within the App component. Game rules are encapsulated as pure functions in src/utils/gameLogic.js to maximize testability. A lightweight audit-style logger in src/utils/auditLogger.js emits structured console logs for actions and errors.

Quality attributes:
- Simplicity: A shallow component hierarchy and pure utilities reduce complexity.
- Testability: Pure computation functions and deterministic state transitions enable robust unit tests.
- Accessibility: Buttons, ARIA labels, and focus-visible styling support keyboard and screen reader users.
- Observability: Console-based structured logs provide basic traceability in the absence of a backend.
- Theming: Centralized theme tokens and classes in styles/theme.css ensure consistency and easy tuning.

## Architecture Diagram (Textual)
- Browser (User)
  - React SPA (App.jsx)
    - Status Banner (status-card)
    - Board (Board.jsx)
      - 9x Square (Square.jsx)
    - Restart Control (button)
  - Utilities
    - gameLogic.js (calculateWinner, isDraw, isValidMove, initialBoard, getNextPlayer)
    - auditLogger.js (auditLog)
  - Styles
    - styles/theme.css (Ocean Professional tokens and component classes)

Data and control flow:
- User interacts with Square (button) → Board forwards index → App.handleMove(index)
- App validates via isValidMove and updates state or logs move_ignored
- App recomputes winner/draw and advances turn when applicable
- Restart triggers state reset and an audit-style restart log

## Component Design (Board, Square/Cell, Game Controller/State, Status Banner, Restart)
- App (src/App.jsx): Owns board and currentPlayer state; derives winner and draw. Implements handleMove and handleRestart with try/catch and audit logging. Renders header, status card, Board, and restart button.
- Board (src/components/Board.jsx): Presentational grid mapping nine Square components. Forwards onMove(index). Disables interaction when the game is finished or a cell is occupied.
- Square (src/components/Square.jsx): A button representing a cell. Renders the current value and exposes a click handler. Accessible label includes index and content.
- Status Banner: A themed card displaying “Current Player,” “Winner,” or “Draw,” and a colored status dot.
- Restart: A themed button below the board resetting state to initial values.

## State Management Approach
- State
  - board: Array(9) of 'X' | 'O' | null
  - currentPlayer: 'X' | 'O'
- Derived
  - winner: 'X' | 'O' | null via calculateWinner(board)
  - draw: boolean via isDraw(board, winner)
- Effects
  - handleMove(index): validates input, writes to board, logs place_mark and potentially turn_advance, and ends interaction on win/draw.
  - handleRestart(): resets board and player to initial values and logs restart.

## Data Flow and Game Logic
- Input: Square index (0–8) via click.
- Validation: isValidMove enforces index bounds, non-occupied cells, and end-of-game prevention.
- Winner Detection: calculateWinner scans predefined line combinations for matches.
- Draw Detection: isDraw returns true when all cells are filled with no winner.
- Restart: initialBoard and player reset to 'X'.

## Styling and Theme (Ocean Professional)
The UI is styled via styles/theme.css using the Ocean Professional palette:
- Colors: primary #3b82f6, secondary #64748b, success #06b6d4, error #EF4444, background #f9fafb, surface #ffffff, text #111827
- Components: status-card, board, square, btn-restart
- Aesthetics: rounded corners, subtle shadows, smooth transitions, and accessible focus rings
- Layout: centered 3x3 grid with header and a restart button

## Validation, Error Handling, and Audit
- Validation: isValidMove prevents invalid state transitions (occupied cell, out of bounds, post-win/draw).
- Error Handling: try/catch in handleMove and handleRestart logs errors to audit with move_error or restart_error and keeps UI responsive.
- Audit: auditLogger.js prints structured logs with ISO timestamps, user “anonymous-user,” action type, event, and metadata. No persistence.

## Compliance Considerations (GxP-inspired)
- ALCOA+ Adaptation:
  - Attributable: “anonymous-user” attribution in logs
  - Contemporaneous: emitted at action time
  - Accurate/Complete/Consistent: includes before/after board states and reasons for ignored moves
  - Enduring/Available: not applicable without persistence in this scope
- Access Controls & E-Signatures: N/A, as there is no authentication or backend. If scope expands, introduce auth, RBAC, and a durable audit store.

## Operational Considerations
- Build/Serve: react-scripts; no external services required.
- Dev server: http://localhost:3000
- Observability: console logs only
- Security: no PII or network calls

## Source References
- src/App.jsx
- src/components/Board.jsx
- src/components/Square.jsx
- src/utils/gameLogic.js
- src/utils/auditLogger.js
- src/styles/theme.css
- src/App.test.jsx

## Related Documentation
For the testing approach, coverage goals, and traceability mapping, see:
- docs/Testing-Strategy.md
