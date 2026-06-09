import { NextRequest, NextResponse } from "next/server"

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
  try {
    const body = await req.json()
    const { name, email, phone, careerStage, sector, subSector, causeArea, questionnaireText, resumeText, output } = body

    let submissionId = "local-" + Date.now()

    if (supabaseReady) {
      const { supabaseAdmin } = await import("@/lib/supabase")
      const { data: row, error } = await supabaseAdmin
        .from("submissions")
        .insert({
          name, email, phone,
          career_stage: careerStage,
          sector, sub_sector: subSector, cause_area: causeArea,
          questionnaire_text: questionnaireText,
          resume_text: resumeText,
          power_statement: output.power_statement,
          plan_306090: output.plan_306090,
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
        sendUserConfirmation({ to: email, name, sector, output }),
        sendWalkerNotification({ submissionId, name, email, sector, output }),
      ])
    } else {
      console.log("Email not configured — skipping emails (local dev mode)")
    }

    return NextResponse.json({ id: submissionId })
  } catch (err) {
    console.error("Submit error:", err)
    return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 })
  }
}
