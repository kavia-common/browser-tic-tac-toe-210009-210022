# Tic Tac Toe Frontend – Architecture Overview

## Introduction
This document outlines the architecture for a lightweight React-based Tic Tac Toe application. It covers component structure, state management, data flow, key modules, UI layout/styling, and build/run guidance. The app is purely client-side with no backend and adheres to the “Ocean Professional” theme.

## High-Level Architecture
- Client-only React application rendered in the browser.
- A small set of stateless and stateful components:
  - App: Top-level shell, theme provider, and layout.
  - Header: Displays current player or result.
  - Board: Renders a 3x3 grid of Cell components and orchestrates click handling.
  - Cell: An interactive button representing a single board position.
  - Controls: Contains Restart button.
- Game logic housed in lightweight helpers for turn management, win detection, and draw detection.
- State kept at the board/app level to allow straightforward data flow down to presentational children.

```mermaid
flowchart TD
  A["App"] --> B["Header"]
  A["App"] --> C["Board"]
  C["Board"] --> C1["Cell x9"]
  A["App"] --> D1["Controls"]

  subgraph State
    S1["board: string[9]"]
    S2["currentPlayer: 'X'|'O'"]
    S3["winner: 'X'|'O'|null"]
    S4["isDraw: boolean"]
  end

  A -. provides props .-> B
  A -. provides props .-> C
  A -. provides props .-> D1

  C -->|onCellClick(index)| A
  A -->|setState| C
  A -->|result props| B
  A -->|reset| C
```

## Component Structure
### App (Stateful)
- Responsibilities:
  - Initialize and own game state: board (array of 9), currentPlayer, winner, isDraw.
  - Provide handlers for cell clicks and restart.
  - Decide what the Header displays based on state.
- Props: None (root component).
- Children: Header, Board, Controls.

### Header (Stateless)
- Displays “Current player: X/O” during play; shows “Player X/O wins!” or “It’s a draw!” when applicable.
- May include aria-live for result announcements.

### Board (Stateless/Light Stateful)
- Receives board state (string[9]) and disabled state when game is over.
- Renders a 3x3 grid of Cell components.
- Passes onCellClick(index) up to App.

### Cell (Stateless)
- A button representing a single cell.
- Props: value ('X'|'O'|''), disabled, onClick.
- Uses focus ring, hover/active transitions, and disables when filled or game over.

### Controls (Stateless)
- Contains Restart button.
- Calls onRestart to reset game in App.

## State Management
- Local component state using React useState in App:
  - board: string[9] initialized to empty values.
  - currentPlayer: 'X' starts.
  - winner: null initially; set when a winning line is found.
  - isDraw: false initially; true when all cells filled and no winner.
- Derived state logic:
  - After each move, checkWinner(board) returns 'X', 'O', or null.
  - If no winner, checkDraw(board) returns true if all filled.
  - Toggle currentPlayer if game continues.
- No external state library required.

## Data Flow
- Top-down props: App passes board, currentPlayer, and status flags to Header and Board; passes onRestart to Controls.
- Bottom-up events: Board/Cell invokes onCellClick(index) to request a state change; App validates and updates state.
- Unidirectional data flow ensures predictable rendering and easy debugging.

## Key Modules and Helpers
- helpers/checkWinner.ts|js:
  - Input: board: string[9]
  - Output: 'X' | 'O' | null
  - Implementation: Evaluate 8 winning combinations (3 rows, 3 columns, 2 diagonals).
- helpers/checkDraw.ts|js:
  - Input: board: string[9]
  - Output: boolean
  - Implementation: Return true if no empty cells and winner is null.
- components/:
  - App.tsx|jsx: Root; owns state, wires handlers.
  - Header.tsx|jsx: Presentational.
  - Board.tsx|jsx: Grid composition.
  - Cell.tsx|jsx: Accessible button.
  - Controls.tsx|jsx: Restart button.
- styles/:
  - theme.ts|js or CSS variables with the Ocean Professional palette.
  - Global styles for background gradient, typography, and base spacing.
  - Component-level styles using CSS Modules, styled-components, or Tailwind (see Styling Approach).

## UI Layout
- Header at top center within a card-like surface.
- Board centered with fixed square cells (maintain aspect ratio).
- Controls beneath board with Restart button.
- Responsive:
  - Mobile: Grid stretches to width with safe margins; cells remain square via aspect-ratio.
  - Desktop: Constrain board width (e.g., 320–420px) and center vertically with comfortable spacing.

## Styling Approach (Ocean Professional Theme)
- Colors:
  - Primary: #3b82f6 (focus, hover accents, action button).
  - Secondary: #64748b (subtle borders/text).
  - Success: #06b6d4 (optional highlight of winning line).
  - Error: #EF4444 (rare; invalid action if needed).
  - Background: #f9fafb with subtle gradient (from-blue-500/10 to-gray-50).
  - Surface: #ffffff for cards/board with soft shadow and 12px radius.
  - Text: #111827 high contrast.
- Effects:
  - Subtle shadows (e.g., 0 10px 15px -3px rgba(0,0,0,0.1)).
  - Rounded corners (8–12px).
  - Transitions: 150–250ms for color/transform.
  - Focus ring on interactive elements using primary color.
- Implementation Options:
  - CSS-in-JS (styled-components/emotion).
  - Tailwind CSS with custom theme tokens.
  - CSS Modules with variables.
- Recommendation:
  - For minimal footprint, use CSS Modules or simple CSS variables in :root (e.g., --color-primary) and scoped classNames for components.

## Accessibility
- Use button elements for cells and Restart for native semantics and keyboard support.
- Apply aria-pressed for filled cells and aria-live="polite" on the status message area.
- Ensure focus is visible and tab order is logical (Header status → first cell → … → Restart).
- Provide sufficient color contrast with chosen palette.

## Build and Run Notes
- Tooling: React app scaffold (e.g., Vite or CRA). No backend needed.
- Scripts (example, adjust per chosen tooling):
  - Development: npm run dev
  - Build: npm run build
  - Preview: npm run preview
- Static hosting friendly (e.g., GitHub Pages, Netlify, Vercel).
- No environment variables required (container_env: None).
- Dependencies: Keep minimal (React, ReactDOM; optional dev tooling for linting/formatting).

## Testing Strategy (Lightweight)
- Unit tests:
  - checkWinner: all 8 winning lines + no-win scenarios.
  - checkDraw: full board with and without winner.
- Component tests:
  - App/Board: placing marks toggles players; cannot play in filled cell; game ends on win/draw; restart clears state.
- Manual checks:
  - Responsiveness and visual polish per theme.
  - Keyboard navigation and focus visibility.

## Future Enhancements (Non-Blocking)
- Highlight winning line cells with Success color.
- Add simple AI opponent (minimax or heuristic).
- Move history and time travel (undo).
- Multiple rounds with score tracking.
