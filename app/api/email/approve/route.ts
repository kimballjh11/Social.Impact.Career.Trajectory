import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { sendWalkerFollowUp } from "@/lib/email"

// GET — email scanners hit this automatically. Show a confirmation page only;
// do NOT send the email here. The actual send requires a POST (the button below).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return new NextResponse("Missing submission ID.", { status: 400 })
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data: row, error } = await supabaseAdmin
      .from("submissions")
      .select("name, email, sector, email_sent")
      .eq("id", id)
      .single()

    if (error || !row) {
      return new NextResponse("Submission not found.", { status: 404 })
    }

    if (row.email_sent) {
      return new NextResponse(
        `<html><body style="font-family:Arial;padding:48px;background:#F5F0EB;">
          <h2 style="color:#1A1A1A;">Already sent.</h2>
          <p style="color:#2D2D2D;">The follow-up to ${row.name} was already delivered.</p>
        </body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      )
    }

    // Confirmation page — Walker must click the button to actually send.
    return new NextResponse(
      `<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #F5F0EB; margin: 0; padding: 48px; }
    .card { max-width: 480px; background: #FAF8F5; padding: 40px; border-radius: 4px; }
    h2 { color: #1A1A1A; font-size: 20px; margin: 0 0 8px; }
    p { color: #2D2D2D; font-size: 15px; line-height: 1.6; margin: 0 0 28px; }
    .meta { font-size: 13px; color: #5A5A5A; margin-bottom: 28px; line-height: 1.7; }
    button {
      background: #C4763A; color: white; border: none; padding: 14px 32px;
      font-size: 15px; cursor: pointer; border-radius: 3px; letter-spacing: 0.02em;
    }
    button:hover { background: #b36830; }
    .sent { color: #335C67; font-style: italic; margin-top: 20px; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Send follow-up to ${row.name}?</h2>
    <div class="meta">
      Email: ${row.email}<br>
      Sector: ${row.sector}
    </div>
    <p>This will send your Day-2 follow-up email to ${row.name}. It cannot be unsent.</p>
    <form method="POST" action="/api/email/approve?id=${id}">
      <button type="submit" id="btn">Send follow-up</button>
    </form>
    <p class="sent" id="sent">Sending&hellip;</p>
  </div>
  <script>
    document.querySelector('form').addEventListener('submit', function() {
      document.getElementById('btn').disabled = true;
      document.getElementById('btn').textContent = 'Sending…';
    });
  </script>
</body>
</html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    )
  } catch (err) {
    console.error("Approve GET error:", err)
    return new NextResponse("Something went wrong.", { status: 500 })
  }
}

// POST — only reached when Walker clicks the button on the confirmation page.
// Email scanners never auto-submit POST requests.
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return new NextResponse("Missing submission ID.", { status: 400 })
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data: row, error } = await supabaseAdmin
      .from("submissions")
      .select("name, email, sector, email_sent")
      .eq("id", id)
      .single()

    if (error || !row) {
      return new NextResponse("Submission not found.", { status: 404 })
    }

    if (row.email_sent) {
      return new NextResponse(
        `<html><body style="font-family:Arial;padding:48px;background:#F5F0EB;">
          <h2 style="color:#1A1A1A;">Already sent.</h2>
          <p style="color:#2D2D2D;">The follow-up to ${row.name} was already delivered.</p>
        </body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      )
    }

    await sendWalkerFollowUp({ to: row.email, name: row.name, sector: row.sector })

    await supabaseAdmin
      .from("submissions")
      .update({ email_sent: true })
      .eq("id", id)

    return new NextResponse(
      `<html><body style="font-family:Arial;padding:48px;background:#F5F0EB;">
        <h2 style="color:#C4763A;">Follow-up sent.</h2>
        <p style="color:#2D2D2D;">Your message to ${row.name} has been delivered.</p>
        <p style="color:#5A5A5A;font-style:italic;margin-top:32px;">For the changemakers who aren’t waiting.</p>
      </body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    )
  } catch (err) {
    console.error("Approve POST error:", err)
    return new NextResponse("Failed to send email.", { status: 500 })
  }
}
