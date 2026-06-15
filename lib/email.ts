import { Resend } from "resend"

// Lazy initialization so importing this module never crashes a build or a
// route when env vars are missing (local dev without Resend configured).
let _resend: Resend | null = null
function getResend(): Resend {
  if (_resend) return _resend
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error("Email is not configured. Set RESEND_API_KEY.")
  _resend = new Resend(key)
  return _resend
}

// ─── Email sent to user immediately after generation ─────────────────────────
export async function sendUserConfirmation(params: {
  to: string
  name: string
  sector: string
  output: {
    power_statement: string
    plan_306090: string
    practitioners: string
    organizations: string
    resources: string
  }
}) {
  await getResend().emails.send({
    from: "Daybreakers <hello@daybreakcollaborative.com>",
    to: params.to,
    subject: "Your Daybreakers Career Trajectory",
    html: userEmailHtml(params),
  })
}

// ─── Notification sent to Walker with one-click approve button ────────────────
export async function sendWalkerNotification(params: {
  submissionId: string
  name: string
  email: string
  sector: string
  inlineAnswers?: { story?: string; comeToYouFor?: string; lostTrackOfTime?: string }
  hasFullQuestionnaire?: boolean
  output: {
    power_statement: string
    plan_306090: string
    practitioners: string
    organizations: string
    resources: string
  }
}) {
  const approveUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/approve?id=${params.submissionId}`

  await getResend().emails.send({
    from: "Daybreakers <hello@daybreakcollaborative.com>",
    to: process.env.WALKER_EMAIL!,
    subject: `New trajectory: ${params.name} — ${params.sector}`,
    html: walkerNotificationHtml({ ...params, approveUrl }),
  })
}

// ─── Day-2 follow-up sent to user when Walker clicks approve ─────────────────
// Edit the body of this function to change what Walker's follow-up says.
export async function sendWalkerFollowUp(params: {
  to: string
  name: string
  sector: string
}) {
  await getResend().emails.send({
    from: "Walker <walker@daybreakcollaborative.com>",
    to: params.to,
    subject: `A note from Walker`,
    html: walkerFollowUpHtml(params),
  })
}

// ─── Templates ───────────────────────────────────────────────────────────────

function userEmailHtml(params: {
  name: string
  sector: string
  output: {
    power_statement: string
    plan_306090: string
    practitioners: string
    organizations: string
    resources: string
  }
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #1A1A1A; background: #F5F0EB; margin: 0; padding: 0; }
    .container { max-width: 640px; margin: 40px auto; background: #FAF8F5; padding: 48px; border-radius: 4px; }
    .wordmark { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #335C67; margin-bottom: 40px; }
    h1 { font-size: 28px; color: #1A1A1A; margin-bottom: 8px; font-family: Georgia, serif; }
    .intro { color: #2D2D2D; line-height: 1.7; margin-bottom: 40px; }
    .section-label { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #335C67; margin-bottom: 8px; font-weight: 600; }
    .section-content { color: #2D2D2D; line-height: 1.7; margin-bottom: 32px; white-space: pre-line; }
    .power { font-size: 17px; color: #C4763A; font-family: Georgia, serif; font-style: italic; line-height: 1.6; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #D4D4D4; font-size: 13px; color: #5A5A5A; }
    .cta { font-style: italic; color: #335C67; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="wordmark">DAYBREAK COLLABORATIVE &middot; DAYBREAKERS</div>
    <h1>Your Career Trajectory</h1>
    <p class="intro">Here is everything we built for you, ${params.name}. This is your path in ${params.sector}. Download or save this email — it has everything from your session.</p>

    <div class="section-label">Your Power Statement</div>
    <div class="section-content power">${params.output.power_statement}</div>

    <div class="section-label">30-60-90 Day Plan</div>
    <div class="section-content">${params.output.plan_306090}</div>

    <div class="section-label">Practitioners to Follow</div>
    <div class="section-content">${params.output.practitioners}</div>

    <div class="section-label">Organizations to Know</div>
    <div class="section-content">${params.output.organizations}</div>

    <div class="section-label">Resources to Dig Into</div>
    <div class="section-content">${params.output.resources}</div>

    <div class="footer">
      <div>Walker</div>
      <div>Daybreak Collaborative</div>
      <div class="cta">For the changemakers who aren’t waiting.</div>
    </div>
  </div>
</body>
</html>`
}

function walkerNotificationHtml(params: {
  name: string
  email: string
  sector: string
  approveUrl: string
  inlineAnswers?: { story?: string; comeToYouFor?: string; lostTrackOfTime?: string }
  hasFullQuestionnaire?: boolean
  output: {
    power_statement: string
    plan_306090: string
    practitioners: string
    organizations: string
    resources: string
  }
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #1A1A1A; background: #F5F0EB; margin: 0; padding: 0; }
    .container { max-width: 640px; margin: 40px auto; background: #FAF8F5; padding: 48px; border-radius: 4px; }
    h2 { font-size: 22px; color: #1A1A1A; }
    .meta { color: #5A5A5A; font-size: 14px; margin-bottom: 32px; line-height: 1.7; }
    .approve-btn { display: inline-block; background: #C4763A; color: white; padding: 14px 32px; border-radius: 3px; text-decoration: none; font-size: 15px; margin: 24px 0; font-family: Arial, sans-serif; letter-spacing: 0.02em; }
    .section-label { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #335C67; margin: 24px 0 6px; font-weight: 600; }
    .section-content { color: #2D2D2D; line-height: 1.7; white-space: pre-line; }
    .note { font-size: 13px; color: #5A5A5A; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>New submission: ${params.name}</h2>
    <div class="meta">
      Email: ${params.email}<br>
      Sector: ${params.sector}
    </div>

    <a href="${params.approveUrl}" class="approve-btn">Send Follow-Up to ${params.name}</a>
    <div class="note">Clicking the button above sends your Day-2 follow-up email to ${params.name}. Review their output below first.</div>

    ${inTheirOwnWordsHtml(params)}

    <div class="section-label">Power Statement</div>
    <div class="section-content">${params.output.power_statement}</div>

    <div class="section-label">30-60-90 Day Plan</div>
    <div class="section-content">${params.output.plan_306090}</div>

    <div class="section-label">Practitioners</div>
    <div class="section-content">${params.output.practitioners}</div>

    <div class="section-label">Organizations</div>
    <div class="section-content">${params.output.organizations}</div>

    <div class="section-label">Resources</div>
    <div class="section-content">${params.output.resources}</div>
  </div>
</body>
</html>`
}

// Edit this function directly to change Walker's Day-2 follow-up message.
function walkerFollowUpHtml(params: { name: string; sector: string }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #1A1A1A; background: #F5F0EB; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 40px auto; background: #FAF8F5; padding: 48px; border-radius: 4px; }
    p { color: #2D2D2D; line-height: 1.8; font-size: 16px; margin-bottom: 20px; }
    .signature { margin-top: 40px; color: #1A1A1A; }
    .cta { font-style: italic; color: #335C67; margin-top: 24px; font-size: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <p>${params.name},</p>

    <p>I wanted to follow up after you built your trajectory in ${params.sector}. The tool gives you a map. What it cannot give you is the willingness to move.</p>

    <p>The 30-60-90 plan is the place to start. Pick one thing from the first 30 days and do it before the week is out. Not because it will change everything immediately, but because starting is the hardest part and you will feel the difference once you have.</p>

    <p>If you find yourself stuck, or if something in your trajectory raised a question you want to think through with someone, I am available. This is exactly the kind of conversation Daybreakers exists for.</p>

    <div class="signature">
      <div>Walker</div>
      <div style="font-size:13px; color:#5A5A5A; margin-top:4px;">Daybreak Collaborative</div>
    </div>
    <div class="cta">For the changemakers who aren’t waiting.</div>
  </div>
</body>
</html>`
}

// Renders the applicant's own answers (or notes a full questionnaire) in Walker's notification.
function inTheirOwnWordsHtml(params: {
  inlineAnswers?: { story?: string; comeToYouFor?: string; lostTrackOfTime?: string }
  hasFullQuestionnaire?: boolean
}): string {
  if (params.hasFullQuestionnaire) {
    return `
    <div class="section-label">In Their Own Words</div>
    <div class="section-content">Submitted their full Pre-Daybreak Questionnaire. See the submission record for the complete text.</div>`
  }

  const answers = params.inlineAnswers
  const pairs: Array<[string, string | undefined]> = [
    ["How they got here", answers?.story],
    ["What people come to them for", answers?.comeToYouFor],
    ["Last thing they lost track of time on", answers?.lostTrackOfTime],
  ]
  const filled = pairs.filter(([, v]) => v && v.trim())

  if (filled.length === 0) return ""

  const rows = filled
    .map(
      ([label, value]) =>
        `<div style="margin-bottom:16px;"><div style="font-size:13px;color:#5A5A5A;margin-bottom:2px;">${label}</div><div class="section-content" style="margin-bottom:0;">${value}</div></div>`
    )
    .join("")

  return `
    <div class="section-label">In Their Own Words</div>
    ${rows}`
}
