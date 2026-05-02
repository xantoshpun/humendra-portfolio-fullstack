const CAPACITY = 30;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

type Bucket = { tokens: number; windowStart: number };

const buckets = new Map<string, Bucket>();

export class RateLimitedError extends Error {
  constructor() {
    super("RATE_LIMITED");
    this.name = "RateLimitedError";
  }
}

export function checkRateLimit(userId: string, action: string): void {
  const key = `${userId}:${action}`;
  const now = Date.now();

  let bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    bucket = { tokens: CAPACITY, windowStart: now };
    buckets.set(key, bucket);
  }

  if (bucket.tokens <= 0) {
    throw new RateLimitedError();
  }

  bucket.tokens -= 1;
}
