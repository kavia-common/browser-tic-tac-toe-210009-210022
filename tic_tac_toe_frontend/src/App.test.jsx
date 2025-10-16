/**
 * Basic unit tests for Tic Tac Toe logic and UI affordances.
 * Note: CRA includes React Testing Library and jest-dom via setupTests.js.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App.jsx';
import { calculateWinner, isDraw, isValidMove, initialBoard } from './utils/gameLogic';

describe('gameLogic', () => {
  test('calculateWinner detects row win', () => {
    const board = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(calculateWinner(board)).toBe('X');
  });

  test('calculateWinner detects diagonal win', () => {
    const board = ['O', null, null, null, 'O', null, null, null, 'O'];
    expect(calculateWinner(board)).toBe('O');
  });

  test('isDraw true when board filled without winner', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(calculateWinner(board)).toBeNull();
    expect(isDraw(board, null)).toBe(true);
  });

  test('isValidMove prevents playing on occupied cell or finished game', () => {
    const board = initialBoard();
    board[0] = 'X';
    expect(isValidMove(board, 0, null)).toBe(false); // occupied
    expect(isValidMove(board, 1, 'X')).toBe(false); // already has winner
    expect(isValidMove(board, 1, null)).toBe(true); // valid
  });
});

describe('App UI', () => {
  test('renders status and board', () => {
    render(<App />);
    expect(screen.getByTestId('status-panel')).toBeInTheDocument();
    // Squares are role=button; 9 of them
    const buttons = screen.getAllByRole('button');
    // Buttons include one restart button; ensure at least 10 buttons (9 squares + 1 restart)
    expect(buttons.length).toBeGreaterThanOrEqual(10);
  });

  test('enforces move rules and shows winner', () => {
    render(<App />);
    const squares = screen.getAllByRole('button').filter((b) => b.className.includes('square'));
    // X moves
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[0]); // repeat click ignored
    // O moves
    fireEvent.click(squares[3]); // O
    // X moves
    fireEvent.click(squares[1]); // X
    // O moves
    fireEvent.click(squares[4]); // O
    // X moves for win
    fireEvent.click(squares[2]); // X wins on top row

    expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();
  });

  test('restart clears the board', () => {
    render(<App />);
    const squares = screen.getAllByRole('button').filter((b) => b.className.includes('square'));
    fireEvent.click(squares[0]); // X
    const restart = screen.getByRole('button', { name: /restart/i });
    fireEvent.click(restart);
    // After restart, square should be empty (no text content)
    expect(squares[0].textContent).toBe('');
    expect(screen.getByText(/Current Player: X/i)).toBeInTheDocument();
  });
});
