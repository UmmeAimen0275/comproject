// Neon (free) sleeps when idle. The first request can fail while it wakes up,
// so we retry a few times before giving up.
export async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1))); // wait 1.5s, 3s...
    }
  }
  throw lastError;
}