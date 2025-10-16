import React from 'react';

/**
 * Square component representing a single cell in the board.
 *
 * PUBLIC_INTERFACE
 * @component
 * @param {Object} props
 * @param {('X'|'O'|null)} props.value - Current mark on the square.
 * @param {() => void} props.onClick - Click handler to request a move.
 * @param {boolean} [props.disabled=false] - When true, the square is not interactive.
 * @returns {JSX.Element}
 */
export default function Square({ value, onClick, disabled = false, ...rest }) {
  return (
    <button
      type="button"
      className={`square ${value ? `square-${value}` : ''}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {value}
    </button>
  );
}
