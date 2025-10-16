const LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * PUBLIC_INTERFACE
 * Returns a fresh board with 9 null cells.
 * @returns {Array<null>} new board array
 */
export function initialBoard() {
  return Array(9).fill(null);
}

/**
 * PUBLIC_INTERFACE
 * Safely get next player given the current player.
 * @param {'X'|'O'} player
 * @returns {'X'|'O'}
 */
export function getNextPlayer(player) {
  return player === 'X' ? 'O' : 'X';
}

/**
 * PUBLIC_INTERFACE
 * Determine the winner of the board, if any.
 *
 * @param {Array<('X'|'O'|null)>} board - 9 cell array
 * @returns {'X'|'O'|null} - Winner symbol or null if no winner
 */
export function calculateWinner(board) {
  if (!Array.isArray(board) || board.length !== 9) return null;

  for (const [a, b, c] of LINES) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) {
      return v;
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Check for draw: all cells filled and no winner.
 *
 * @param {Array<('X'|'O'|null)>} board
 * @param {'X'|'O'|null} winner
 * @returns {boolean}
 */
export function isDraw(board, winner) {
  if (!Array.isArray(board) || board.length !== 9) return false;
  if (winner) return false;
  return board.every((c) => c !== null);
}

/**
 * PUBLIC_INTERFACE
 * Validate whether a move is allowed.
 *
 * @param {Array<('X'|'O'|null)>} board
 * @param {number} index - 0..8
 * @param {'X'|'O'|null} winner
 * @returns {boolean} true if the move can proceed
 */
export function isValidMove(board, index, winner) {
  if (!Array.isArray(board) || board.length !== 9) return false;
  if (typeof index !== 'number' || index < 0 || index > 8) return false;
  if (winner) return false;
  if (board[index] !== null) return false;
  return true;
}
