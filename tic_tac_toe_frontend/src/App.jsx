import React, { useMemo, useState, useCallback } from 'react';
import './styles/theme.css';
import Board from './components/Board';
import { auditLog } from './utils/auditLogger';
import {
  calculateWinner,
  isDraw,
  getNextPlayer,
  initialBoard,
  isValidMove,
} from './utils/gameLogic';

/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
Requirement ID: REQ-TTT-001
User Story: As two players, we want to play Tic Tac Toe in the browser with clear status, reset, and modern styling.
Acceptance Criteria:
- 3x3 grid, clickable squares
- Current player indicator
- Win/Draw detection across rows, columns, diagonals
- Restart clears board and status
- Ocean Professional theme
- Basic audit logs (ISO timestamps)
GxP Impact: NO - Frontend-only demo, no persistence. Basic audit-style console logs included.
Risk Level: LOW
Validation Protocol: VP-TTT-001 (basic unit tests)
// ============================================================================ 
*/

/**
// ============================================================================
// IMPORTS AND DEPENDENCIES
// ============================================================================
// React 18.x
// Local modules: Board, auditLogger, gameLogic, theme.css
// ============================================================================
 */

// PUBLIC_INTERFACE
export default function App() {
  /** Game state: an array of 9 cells ('X' | 'O' | null) */
  const [board, setBoard] = useState(initialBoard());
  /** Current player: 'X' or 'O' */
  const [currentPlayer, setCurrentPlayer] = useState('X');

  /** Derived state: winner and draw flags */
  const winner = useMemo(() => calculateWinner(board), [board]);
  const draw = useMemo(() => isDraw(board, winner), [board, winner]);

  /**
   * Handle a user move on a specific index.
   * Validates:
   * - Game not finished
   * - Cell not occupied
   * Logs audit-style info to console with ISO timestamp.
   */
  const handleMove = useCallback(
    (index) => {
      try {
        // Input validation and business rules
        if (!isValidMove(board, index, winner)) {
          auditLog('UPDATE', 'move_ignored', {
            reason: 'invalid_move',
            index,
            boardBefore: board,
            currentPlayer,
            winner,
          });
          return; // Ignore invalid moves without throwing
        }

        const nextBoard = board.slice();
        nextBoard[index] = currentPlayer;

        // Audit: capture before/after (no PII, frontend only)
        auditLog('UPDATE', 'place_mark', {
          index,
          player: currentPlayer,
          boardBefore: board,
          boardAfter: nextBoard,
        });

        setBoard(nextBoard);

        // If the game has not ended, advance to next player
        const w = calculateWinner(nextBoard);
        if (!w && !isDraw(nextBoard, w)) {
          const next = getNextPlayer(currentPlayer);
          setCurrentPlayer(next);
          auditLog('UPDATE', 'turn_advance', {
            from: currentPlayer,
            to: next,
          });
        }
      } catch (err) {
        // Minimal user-friendly handling and technical log
        // eslint-disable-next-line no-console
        console.error('An error occurred while handling move:', err);
        auditLog('ERROR', 'move_error', {
          message: err?.message || 'unknown_error',
          stack: err?.stack || '',
        });
      }
    },
    [board, currentPlayer, winner]
  );

  /** Reset the game to initial state and log the action */
  const handleRestart = useCallback(() => {
    try {
      const before = board;
      setBoard(initialBoard());
      setCurrentPlayer('X');
      auditLog('UPDATE', 'restart_game', {
        boardBefore: before,
        boardAfter: initialBoard(),
        nextPlayer: 'X',
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while restarting:', err);
      auditLog('ERROR', 'restart_error', {
        message: err?.message || 'unknown_error',
        stack: err?.stack || '',
      });
    }
  }, [board]);

  /** Human-readable status text */
  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (draw) return 'Draw';
    return `Current Player: ${currentPlayer}`;
  }, [winner, draw, currentPlayer]);

  return (
    <div className="app-root">
      <header className="app-header" role="banner" aria-label="Tic Tac Toe Header">
        <h1 className="app-title">Tic Tac Toe</h1>
        <p className="app-subtitle">Ocean Professional Edition</p>
      </header>

      <main className="app-main" role="main">
        <section
          className="status-card"
          aria-live="polite"
          aria-atomic="true"
          data-testid="status-panel"
        >
          <span
            className={`status-dot ${winner ? 'status-win' : draw ? 'status-draw' : 'status-play'}`}
          />
          <span className="status-text">{statusText}</span>
        </section>

        <Board
          board={board}
          onMove={handleMove}
          disabled={Boolean(winner) || draw}
          aria-label="Tic Tac Toe Board"
        />

        <div className="actions">
          <button
            type="button"
            className="btn-restart"
            onClick={handleRestart}
            aria-label="Restart game"
          >
            Restart
          </button>
        </div>
      </main>

      <footer className="app-footer" role="contentinfo">
        <small>No backend. Actions logged locally with ISO timestamps.</small>
      </footer>
    </div>
  );
}

/**
// ============================================================================
// VALIDATION REQUIREMENTS
// ============================================================================
// - Move validation: cannot play on occupied or finished board.
// - Result computation: rows, columns, diagonals recognized.
// - Restart returns to initial state.
// Test protocol: VP-TTT-001
// ============================================================================
 */
