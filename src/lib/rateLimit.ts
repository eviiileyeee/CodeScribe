const rateLimitMap = new Map<string, { count: number; last: number }>();
const LIMIT = 20;
const WINDOW = 24 * 60 * 60 * 1000; // 24 hours

export function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, last: now };
  if (now - entry.last > WINDOW) {
    // Reset window
    entry.count = 0;
    entry.last = now;
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  if (entry.count > LIMIT) {
    return false;
  }
  return true;
} 