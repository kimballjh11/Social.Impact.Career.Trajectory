import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { sendWalkerFollowUp } from "@/lib/email"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return new NextResponse("Missing submission ID.", { status: 400 })
  }

  try {
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
        <p style="color:#5A5A5A;font-style:italic;margin-top:32px;">The bridge won't build itself.</p>
      </body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    )
  } catch (err) {
    console.error("Approve error:", err)
    return new NextResponse("Failed to send email.", { status: 500 })
  }
}
