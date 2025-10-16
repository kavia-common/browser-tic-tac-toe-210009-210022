# Tic Tac Toe React Frontend – Architecture Overview

## System Architecture Overview
This is a single-page React application with no backend. The application renders a modern Ocean Professional UI with a header, a status panel, a 3x3 board, and a restart action. All game state resides in memory within the App component. Game rules are implemented in pure functions in src/utils/gameLogic.js for easy testing and reuse. Minimal audit-style logging is implemented in src/utils/auditLogger.js and invoked by App to record actions.

Quality attributes:
- Simplicity: Minimal component hierarchy for clarity and maintainability.
- Testability: Pure logic functions; UI tested with React Testing Library.
- Accessibility: Keyboard-navigable buttons with ARIA labels and focus-visible styling.
- Observability: Structured console logs for demo traceability.
- Theming: Centralized style variables and classes in styles/theme.css.

## Component Design and State Management
### Top-Level Components
- App (src/App.jsx): Owns game state (board array of length 9; currentPlayer). Derives winner and draw via compute functions. Handles user interactions (handleMove, handleRestart) with validation and logging. Renders status, Board, and actions.
- Board (src/components/Board.jsx): Presentational component mapping nine Square components. Disables interaction when game is finished or when a square is occupied.
- Square (src/components/Square.jsx): Button representing a single cell. Emits onClick to request a move. Shows current value (X/O/empty).

### State and Derived Data
- State:
  - board: Array(9) of 'X' | 'O' | null
  - currentPlayer: 'X' | 'O'
- Derived:
  - winner: 'X' | 'O' | null (calculateWinner(board))
  - draw: boolean (isDraw(board, winner))

### Data Flow
- User clicks a Square → Board forwards onMove(index) → App.handleMove(index)
- App.validate via isValidMove(board, index, winner)
- If valid:
  - App clones board, sets cell to currentPlayer
  - App logs place_mark
  - App sets board
  - App recomputes winner/draw
  - If no winner/draw, App sets currentPlayer = getNextPlayer(currentPlayer) and logs turn_advance
- If invalid:
  - App logs move_ignored with reason

Sequence (ASCII):
```
User
  |
  v
Square (button) --> Board (forwards index) --> App.handleMove(index)
                                                     |
                                                     v
                                          gameLogic.isValidMove
                                                     |
                                +--------------------+---------------------+
                                |                                          |
                              true                                        false
                                |                                          |
                                v                                          v
                        Update board state                          auditLog(move_ignored)
                        auditLog(place_mark)
                        recompute winner/draw
                        advance turn if needed
                        auditLog(turn_advance)
```

## Data and Validation
- Inputs: Square index (0..8) from user clicks.
- Validation:
  - isValidMove(board, index, winner) enforces bounds, occupancy, and finished-game rules.
  - calculateWinner(board) scans rows, columns, diagonals using predefined line sets.
  - isDraw(board, winner) checks full board with no winner.
- Restart logic resets board to initialBoard() and currentPlayer to 'X'.

## Error Handling Strategy
- App.handleMove and App.handleRestart are wrapped in try/catch to capture runtime errors.
- On error, the app:
  - Logs a technical error entry via auditLog('ERROR', 'move_error' | 'restart_error', { message, stack })
  - Fails gracefully without crashing the UI

## UI/UX and Style Guide Alignment
- Ocean Professional theme defined in src/styles/theme.css
- Rounded corners, card-like status, focused rings, hover transitions
- Accessible ARIA roles and labels: banner, main, contentinfo, aria-live status updates, labeled board and squares

## Testing Strategy
- Unit tests (src/App.test.jsx):
  - gameLogic: calculateWinner rows/diagonals; isDraw when full; isValidMove for occupancy/finished game
  - UI flows: renders status and board; validates move rules; shows winner; restart clears board
- Coverage goals: ≥80% overall; near 100% for game logic functions
- Integration tests: N/A (no backend)
- Tooling: React Testing Library and jest-dom (configured in src/setupTests.js)

## GxP Compliance Mapping
- Audit Trail: Implemented via auditLogger.js, producing structured JSON logs with ISO timestamps, user, action, event, and metadata. Current scope logs to console only.
- Validation Controls: Input validation and business rules enforced in gameLogic.js and App.jsx. Turn advancement and move rules are consistently applied.
- Access Controls: N/A; no users or roles. If expanded, introduce auth and RBAC.
- Electronic Signatures: N/A; not applicable to a local game without critical data operations.
- Data Integrity (ALCOA+):
  - Attributable: Logs include a user field (anonymous-user).
  - Contemporaneous: Logged at action time.
  - Original/Accurate/Complete/Consistent: Logs include before/after board states and reasons for ignored moves.
  - Enduring/Available: N/A without persistence. Future architecture would add a backend log store with durability, retention, and access controls.

## Traceability Matrix (High-Level)
- REQ-TTT-001 (3x3 grid) → Board.jsx, Square.jsx → App.test.jsx “renders status and board”
- REQ-TTT-002 (current player) → App.jsx (statusText) → App.test.jsx
- REQ-TTT-003 (validation) → gameLogic.isValidMove, App.handleMove → App.test.jsx “repeat click ignored”
- REQ-TTT-004 (winner detection) → gameLogic.calculateWinner → App.test.jsx “shows winner”
- REQ-TTT-005 (draw detection) → gameLogic.isDraw → App.test.jsx logic tests
- REQ-TTT-006 (restart) → App.handleRestart → App.test.jsx “restart clears the board”
- REQ-TTT-007 (theme) → styles/theme.css + class usage → visual review
- REQ-TTT-008 (audit logs) → auditLogger.js + App.jsx calls → manual console review
- REQ-TTT-009 (tests) → App.test.jsx → jest pass

## Release Gate Checklist (Architecture/Quality)
- [ ] Component contracts stable (App, Board, Square)
- [ ] Logic utilities pure and covered by unit tests
- [ ] Error handling implemented (try/catch) and audit logs on errors
- [ ] Theme and accessibility checks verified
- [ ] Linting clean and tests passing with target coverage
- [ ] Documentation updated: PRD and Architecture
- [ ] Forward-looking GxP posture documented for persistence, RBAC, e-signatures

## Future Enhancements (Forward-Looking)
- Persistence and backend audit trail with immutable storage and retention
- Authentication and RBAC for multi-user scenarios
- Session save/resume and match history with durable logs
- E-signatures for critical operations if scope expands to regulated data
- Visual and audio accessibility options (high-contrast mode, ARIA live regions for detailed announcements)

## Source References
- src/App.jsx
- src/components/Board.jsx
- src/components/Square.jsx
- src/utils/gameLogic.js
- src/utils/auditLogger.js
- src/styles/theme.css
- src/App.test.jsx
