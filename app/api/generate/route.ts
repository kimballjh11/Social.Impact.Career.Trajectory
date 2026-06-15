import { NextRequest, NextResponse } from "next/server"
import { generateTrajectory, formatPlanText } from "@/lib/claude"
import {
  checkOrigin,
  validateTrajectoryInput,
  getClientIp,
  MAX_BODY_BYTES,
} from "@/lib/requestGuards"
import { checkRateLimit } from "@/lib/rateLimit"

const supabaseReady =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("paste_") &&
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  !process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("paste_")

const emailReady =
  process.env.RESEND_API_KEY &&
  !process.env.RESEND_API_KEY.startsWith("paste_") &&
  process.env.WALKER_EMAIL &&
  !process.env.WALKER_EMAIL.startsWith("paste_")

export async function POST(req: NextRequest) {
  // 1. Origin — cheapest check, fails curl/cross-site abuse before anything else.
  const originCheck = checkOrigin(req)
  if (!originCheck.ok) {
    return NextResponse.json({ error: originCheck.message }, { status: originCheck.status })
  }

  // 2. Body size — read raw so a single oversized request can't blow up JSON.parse.
  const raw = await req.text()
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large." }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 })
  }

  // 3. Per-field length caps — bounds the input before it ever reaches Claude.
  const inputCheck = validateTrajectoryInput(body)
  if (!inputCheck.ok) {
    return NextResponse.json({ error: inputCheck.message }, { status: inputCheck.status })
  }

  // 4. Per-IP rate limit — last gate before we spend Anthropic credits.
  const ip = getClientIp(req)
  const verdict = await checkRateLimit(ip)
  if (!verdict.allowed) {
    const message =
      verdict.window === "hour"
        ? "You've hit the hourly limit. Please try again later."
        : "You've hit the daily limit. Please try again tomorrow."
    return NextResponse.json(
      { error: message },
      { status: 429, headers: { "Retry-After": String(verdict.retryAfter) } }
    )
  }

  try {
    const b = body as Record<string, string>
    const output = await generateTrajectory(b as Parameters<typeof generateTrajectory>[0])

    const planText = formatPlanText(output.plan_306090)
    const displaySector = b.sector === "Other" && b.subSector?.trim() ? b.subSector : b.sector

    let submissionId = "local-" + Date.now()

    if (supabaseReady) {
      const { getSupabaseAdmin } = await import("@/lib/supabase")
      const supabaseAdmin = getSupabaseAdmin()
      const { data: row, error } = await supabaseAdmin
        .from("submissions")
        .insert({
          name: b.name,
          email: b.email,
          phone: b.phone,
          career_stage: b.careerStage,
          sector: b.sector,
          sub_sector: b.subSector,
          cause_area: b.causeArea,
          inline_story: b.inlineStory,
          inline_come_to_you_for: b.inlineComeToYouFor,
          inline_lost_track_of_time: b.inlineLostTrackOfTime,
          questionnaire_text: b.questionnaireText,
          resume_text: b.resumeText,
          power_statement: output.power_statement,
          plan_306090: planText,
          practitioners: output.practitioners,
          organizations: output.organizations,
          resources: output.resources,
          email_sent: false,
        })
        .select("id")
        .single()

      if (error) throw error
      submissionId = row.id
    } else {
      console.log("Supabase not configured — skipping database save (local dev mode)")
    }

    if (emailReady) {
      const { sendUserConfirmation, sendWalkerNotification } = await import("@/lib/email")
      await Promise.all([
        sendUserConfirmation({
          to: b.email,
          name: b.name,
          sector: displaySector,
          output: { ...output, plan_306090: planText },
        }),
        sendWalkerNotification({
          submissionId,
          name: b.name,
          email: b.email,
          sector: displaySector,
          output: { ...output, plan_306090: planText },
          inlineAnswers: {
            story: b.inlineStory,
            comeToYouFor: b.inlineComeToYouFor,
            lostTrackOfTime: b.inlineLostTrackOfTime,
          },
          hasFullQuestionnaire: Boolean(b.questionnaireText?.trim()),
        }),
      ])
    } else {
      console.log("Email not configured — skipping emails (local dev mode)")
    }

    return NextResponse.json({ output, id: submissionId })
  } catch (err) {
    console.error("Generate error:", err)
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 })
  }
}
