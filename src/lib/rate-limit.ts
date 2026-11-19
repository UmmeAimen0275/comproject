// WHY: stops password guessing. A Map remembers the attempts per key.
// Honest note: memory is per server instance. For production use Redis/Upstash.
type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  // WHY: stop the Map from growing forever.
  if (store.size > 1000) {
    for (const [k, v] of store) if (v.resetAt < now) store.delete(k);
  }

  const entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMin: 0 };
  }
  if (entry.count >= limit) {
    return { ok: false, retryAfterMin: Math.ceil((entry.resetAt - now) / 60000) };
  }
  entry.count += 1;
  return { ok: true, retryAfterMin: 0 };
}

// WHY: after a successful login the user starts fresh.
export function resetRateLimit(key: string) {
  store.delete(key);
}