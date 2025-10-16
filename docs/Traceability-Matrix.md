# Tic Tac Toe React Frontend – Requirement Traceability Matrix

## Introduction
This matrix links the Product Requirements (REQ-TTT-001..009) to the implementation components and the corresponding verification activities. It adapts GxP-inspired data integrity concepts to a frontend-only context without persistence.

## Traceability Table

| Requirement ID | Requirement Summary | Implementation (Files/Areas) | Verification (Tests/Checks) | GxP/ALCOA+ Notes |
|---|---|---|---|---|
| REQ-TTT-001 | Render a 3x3 grid of clickable squares | src/components/Board.jsx, src/components/Square.jsx, styles/theme.css (board, square) | src/App.test.jsx “renders status and board” | Legible, Consistent UI layout via theme.css |
| REQ-TTT-002 | Track/display current player starting with X | src/App.jsx (state: currentPlayer, statusText) | src/App.test.jsx (status checks) | Accurate state display; contemporaneous status updates (aria-live) |
| REQ-TTT-003 | Validate moves (no occupied/after-finish) | src/utils/gameLogic.js:isValidMove, src/App.jsx:handleMove | src/App.test.jsx “repeat click ignored” | Accurate/Consistent validation; audit move_ignored with reason |
| REQ-TTT-004 | Detect winners (rows/cols/diagonals) | src/utils/gameLogic.js:calculateWinner | src/App.test.jsx win scenario | Accurate calculation; post-win disabled board |
| REQ-TTT-005 | Detect draws (full board, no winner) | src/utils/gameLogic.js:isDraw | src/App.test.jsx draw scenario | Accurate detection; consistent end-state |
| REQ-TTT-006 | Restart action resets board and turn | src/App.jsx:handleRestart | src/App.test.jsx restart scenario | Audit restart_game with before/after |
| REQ-TTT-007 | Apply Ocean Professional theme | styles/theme.css, class usage in App/Board/Square | Visual review; optional visual regression | Legible, consistent theme tokens (primary #3b82f6, etc.) |
| REQ-TTT-008 | Emit audit-style console logs | src/utils/auditLogger.js, calls in src/App.jsx | Manual console review; optional console spies | Attributable (anonymous-user), contemporaneous ISO timestamps; includes metadata |
| REQ-TTT-009 | Provide unit tests (≥80% target overall) | src/App.test.jsx + utilities | CI coverage (test:ci) | Complete/Consistent coverage; critical logic near 100% |

## Coverage and Quality Gates
- Overall coverage target: ≥ 80%; utilities aim near 100%.
- Linting clean via eslint.config.mjs.
- Optional accessibility checks (jest-axe) may be added to complement manual review.

## Compliance Scope Notes
- Attributable: Logs contain user field “anonymous-user.”
- Contemporaneous: Logs are generated at action time.
- Accurate/Complete/Consistent: Entries include event names and relevant metadata (before/after states; reasons for ignored moves).
- Enduring/Available: Persistence not in scope for this frontend-only app; future backend could add durability, retention, and access controls.
- Access control & e-signatures: Not applicable in current scope; rationale documented.

## References
- PRD: docs/PRD.md
- Architecture Overview: docs/Architecture.md
- Testing Strategy: docs/Testing-Strategy.md
- Static Analysis: tic_tac_toe_frontend/docs/static-analysis-report-latest.md

