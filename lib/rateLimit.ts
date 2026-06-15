import { getSupabaseAdmin } from "./supabase"

// Per-IP rate limit thresholds for /api/generate.
// Tuned permissively for beta — 5 per hour gives a real user room to retry
// after a bad generation; 20 per day caps the worst-case daily blast radius.
export const RATE_LIMITS = {
  hour: { max: 5, windowSeconds: 60 * 60 },
  day: { max: 20, windowSeconds: 60 * 60 * 24 },
} as const

export type RateLimitVerdict =
  | { allowed: true }
  | { allowed: false; window: "hour" | "day"; retryAfter: number }

type RpcRow = { allowed: boolean; current_count: number; retry_after: number }

// Atomic check + increment against the Supabase `rate_limits` table via the
// `check_rate_limit` RPC (defined in supabase-schema.sql). One RPC call per
// window; we run both in parallel and reject on the first failure.
//
// Fails OPEN on infrastructure errors — if Supabase is unreachable, a real
// user's submission would fail at insert time anyway, so blocking generation
// here only degrades UX without protecting credits in any meaningful way.
// The error is logged loudly so the failure is visible.
export async function checkRateLimit(ip: string): Promise<RateLimitVerdict> {
  try {
    const supabase = getSupabaseAdmin()

    const [hourRes, dayRes] = await Promise.all([
      supabase.rpc("check_rate_limit", {
        p_ip: ip,
        p_window: "hour",
        p_max_count: RATE_LIMITS.hour.max,
        p_window_seconds: RATE_LIMITS.hour.windowSeconds,
      }),
      supabase.rpc("check_rate_limit", {
        p_ip: ip,
        p_window: "day",
        p_max_count: RATE_LIMITS.day.max,
        p_window_seconds: RATE_LIMITS.day.windowSeconds,
      }),
    ])

    if (hourRes.error) throw hourRes.error
    if (dayRes.error) throw dayRes.error

    const hour = (hourRes.data as RpcRow[] | null)?.[0]
    const day = (dayRes.data as RpcRow[] | null)?.[0]

    if (hour && !hour.allowed) {
      return { allowed: false, window: "hour", retryAfter: hour.retry_after }
    }
    if (day && !day.allowed) {
      return { allowed: false, window: "day", retryAfter: day.retry_after }
    }

    return { allowed: true }
  } catch (err) {
    console.error("[rateLimit] Supabase check failed, failing open:", err)
    return { allowed: true }
  }
}
