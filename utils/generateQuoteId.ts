/**
 * Generates a unique quote ID for tracking carrier responses
 * Format: qt_xxxxxxxx (8 random alphanumeric characters)
 * Used as the email address prefix for inbound routing
 */
export function generateQuoteId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'qt_';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}


