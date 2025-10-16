import React from 'react';
import Square from './Square';

/**
 * Board component renders a 3x3 grid of squares.
 *
 * PUBLIC_INTERFACE
 * @component
 * @param {Object} props
 * @param {Array<('X'|'O'|null)>} props.board - The 9-cell game board.
 * @param {(index:number)=>void} props.onMove - Callback when a square is clicked.
 * @param {boolean} [props.disabled=false] - If true, board interactions are disabled.
 * @returns {JSX.Element}
 */
export default function Board({ board, onMove, disabled = false, ...rest }) {
  return (
    <div className={`board ${disabled ? 'board-disabled' : ''}`} {...rest}>
      {board.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onMove(idx)}
          disabled={disabled || value !== null}
          aria-label={`Square ${idx + 1}${value ? `, ${value}` : ''}`}
        />
      ))}
    </div>
  );
}
