/**
 * Simple In-Memory Rate Limiter
 * Suitable for serverless environments like Vercel
 *
 * Note: This uses in-memory storage, so counters reset on cold starts.
 * For production with multiple instances, consider using Redis (e.g., Upstash).
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// Set up periodic cleanup
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of rateLimitStore.entries()) {
            if (now > entry.resetTime) {
                rateLimitStore.delete(key);
            }
        }
    }, CLEANUP_INTERVAL);
}

export interface RateLimitConfig {
    /** Maximum number of requests allowed in the window */
    maxRequests: number;
    /** Time window in milliseconds */
    windowMs: number;
}

export interface RateLimitResult {
    /** Whether the request is allowed */
    allowed: boolean;
    /** Number of remaining requests in the current window */
    remaining: number;
    /** Timestamp when the rate limit resets */
    resetTime: number;
    /** Error message if rate limited */
    error?: string;
}

/**
 * Check if a request is allowed based on rate limiting rules
 *
 * @param identifier - Unique identifier for the requester (e.g., IP address)
 * @param config - Rate limiting configuration
 * @returns RateLimitResult indicating if the request is allowed
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 5, windowMs: 10 * 60 * 1000 }
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // If no entry exists or window has expired, create a new one
    if (!entry || now > entry.resetTime) {
        const newEntry: RateLimitEntry = {
            count: 1,
            resetTime: now + config.windowMs,
        };
        rateLimitStore.set(identifier, newEntry);

        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime: newEntry.resetTime,
        };
    }

    // Check if we've exceeded the limit
    if (entry.count >= config.maxRequests) {
        const waitTimeMinutes = Math.ceil((entry.resetTime - now) / 60000);
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime,
            error: `Terlalu banyak percobaan. Silakan coba lagi dalam ${waitTimeMinutes} menit.`,
        };
    }

    // Increment the counter
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime,
    };
}

/**
 * Get client IP from request headers
 * Works with Vercel's x-forwarded-for header
 *
 * @param headersList - Headers object from Next.js
 * @returns The client IP address or a fallback
 */
export function getClientIP(headersList: Headers): string {
    // Vercel passes the real client IP in x-forwarded-for
    const forwardedFor = headersList.get("x-forwarded-for");
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, the first one is the client
        return forwardedFor.split(",")[0].trim();
    }

    // Fallback headers
    const realIp = headersList.get("x-real-ip");
    if (realIp) {
        return realIp;
    }

    // Final fallback
    return "unknown";
}
