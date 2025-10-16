const DEFAULT_USER = 'anonymous-user';

/**
 * PUBLIC_INTERFACE
 * Logs an audit-style entry to the console with ISO timestamp.
 * Note: Frontend-only; no persistence. Suitable for demo traceability.
 *
 * @param {'CREATE'|'READ'|'UPDATE'|'DELETE'|'ERROR'} actionType - Type of action performed.
 * @param {string} event - Short event name, e.g., 'place_mark', 'restart_game'.
 * @param {Record<string, unknown>} details - Additional metadata (before/after state, reasons).
 * @param {string} [userId=DEFAULT_USER] - User identifier (no auth in this app; default to anonymous).
 */
export function auditLog(actionType, event, details = {}, userId = DEFAULT_USER) {
  const timestamp = new Date().toISOString();
  // Structured log for easy parsing
  // eslint-disable-next-line no-console
  console.log(
    '[AUDIT]',
    JSON.stringify({
      ts: timestamp,
      user: userId,
      action: actionType,
      event,
      details,
    })
  );
}
