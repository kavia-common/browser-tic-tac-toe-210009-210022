# Tic Tac Toe – Ocean Professional

A lightweight React implementation of Tic Tac Toe with a modern Ocean Professional theme, basic audit-style console logging, and minimal tests.

## Features

- 3x3 grid with clickable squares
- Current player indicator
- Win and draw detection (rows, columns, diagonals)
- Restart button
- Ocean Professional styling (rounded corners, shadows, subtle gradient)
- Minimal audit-style console logs with ISO timestamps on moves and restart

## Project Layout

- src/App.jsx – Main application (state, status, restart)
- src/components/Board.jsx – 3x3 board
- src/components/Square.jsx – Board cell
- src/utils/gameLogic.js – Pure helpers (winner, draw, validation)
- src/utils/auditLogger.js – Console audit-style logger
- src/styles/theme.css – Ocean Professional theme
- src/App.test.jsx – Basic unit tests

## Getting Started

- npm start – Start dev server (http://localhost:3000)
- npm test – Run unit tests
- npm run build – Production build

## Dependency and Security Notes

- Direct dependencies updated to latest compatible minor/patch versions (React 18.3.x).
- Legacy "eslintConfig" in package.json removed; ESLint flat config (eslint.config.mjs) is the source of truth.
- Added safe npm overrides to mitigate critical/high transitive advisories in the CRA toolchain:
  - form-data >= 3.0.4, brace-expansion >= 2.0.2, @babel/runtime/helpers >= 7.26.10,
    http-proxy-middleware >= 2.0.9, on-headers >= 1.0.2.
- Remaining advisories tied to react-scripts 5.x chain (svgo 1.x, @svgr/*) are acknowledged; resolution typically requires migrating off CRA.

See docs/static-analysis-report-latest.md for details.

## Audit Notes

This is a frontend-only demo. Audit-style entries are printed to the browser console with:

- ISO timestamp, user (anonymous-user), action type, event name
- Minimal metadata (e.g., before/after board states)

No external services or persistence are used.

## Assumptions

- Two-player local game (no auth)
- No backend, no database
- Basic input validation on moves
