// Lightweight request-time validation for /api/generate. Two guards:
//   1) checkOrigin — rejects cross-site / no-origin requests so the route
//      cannot be used as a free Claude proxy from a curl script.
//   2) validateTrajectoryInput — per-field length caps so a single request
//      cannot stuff megabytes of prompt-injection payload into the model.

// Per-field byte caps. Tuned generous enough to never bite a real user
// (a long resume sits well under 50 KB) but small enough to cap blast radius.
const FIELD_CAPS: Record<string, number> = {
  name: 200,
  email: 200,
  phone: 50,
  careerStage: 100,
  sector: 100,
  subSector: 200,
  causeArea: 500,
  inlineStory: 5_000,
  inlineComeToYouFor: 5_000,
  inlineLostTrackOfTime: 5_000,
  questionnaireText: 50_000,
  resumeText: 50_000,
}

// Hard cap on total request body size (~sum of caps with headroom).
export const MAX_BODY_BYTES = 120_000

export type GuardResult = { ok: true } | { ok: false; status: number; message: string }

// Allow requests whose Origin matches this app's own origin. Missing Origin
// is rejected — modern browsers always send Origin on POST, so a missing
// header means a non-browser client (curl, server-to-server abuse).
export function checkOrigin(req: Request): GuardResult {
  const origin = req.headers.get("origin")
  if (!origin) {
    return { ok: false, status: 403, message: "Missing origin." }
  }

  const allowed = new Set<string>()
  try {
    allowed.add(new URL(req.url).origin)
  } catch {
    // request.url is always well-formed in Next.js route handlers; ignore
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      allowed.add(new URL(process.env.NEXT_PUBLIC_APP_URL).origin)
    } catch {
      // ignore malformed env var rather than block all traffic
    }
  }

  if (!allowed.has(origin)) {
    return { ok: false, status: 403, message: "Origin not allowed." }
  }

  return { ok: true }
}

// Per-field length caps. Returns the first violation found so the error
// message points at the right field.
export function validateTrajectoryInput(body: unknown): GuardResult {
  if (!body || typeof body !== "object") {
    return { ok: false, status: 400, message: "Invalid request body." }
  }
  const obj = body as Record<string, unknown>

  for (const [field, cap] of Object.entries(FIELD_CAPS)) {
    const value = obj[field]
    if (value == null) continue
    if (typeof value !== "string") {
      return { ok: false, status: 400, message: `Field "${field}" must be a string.` }
    }
    // Byte length, not character count — multi-byte chars (emoji, accents)
    // should count against the cap by what they actually cost on the wire.
    if (Buffer.byteLength(value, "utf8") > cap) {
      return {
        ok: false,
        status: 413,
        message: `Field "${field}" exceeds the ${cap.toLocaleString()} character limit.`,
      }
    }
  }

  return { ok: true }
}

// Best-effort client IP. Vercel and most proxies set x-forwarded-for as a
// comma-separated list with the client first. Falls back to x-real-ip, then
// a shared "unknown" bucket — sharing one bucket is the safe failure mode
// (anonymous traffic gets collectively rate-limited rather than waved through).
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }
  const real = req.headers.get("x-real-ip")
  if (real) return real.trim()
  return "unknown"
}
