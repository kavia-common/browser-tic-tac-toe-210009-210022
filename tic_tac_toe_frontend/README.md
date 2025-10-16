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

## Audit Notes

This is a frontend-only demo. Audit-style entries are printed to the browser console with:

- ISO timestamp, user (anonymous-user), action type, event name
- Minimal metadata (e.g., before/after board states)

No external services or persistence are used.

## Assumptions

- Two-player local game (no auth)
- No backend, no database
- Basic input validation on moves
