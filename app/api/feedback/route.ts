import { NextRequest, NextResponse } from "next/server"

const supabaseReady =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("paste_") &&
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  !process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("paste_")

export async function POST(req: NextRequest) {
  try {
    const { submissionId, rating, feedback } = await req.json()

    if (!submissionId) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 })
    }
    if (rating != null && (typeof rating !== "number" || rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 })
    }

    if (supabaseReady && !String(submissionId).startsWith("local-")) {
      const { getSupabaseAdmin } = await import("@/lib/supabase")
      const supabaseAdmin = getSupabaseAdmin()
      const { error } = await supabaseAdmin
        .from("submissions")
        .update({
          feedback_rating: rating ?? null,
          feedback_text: typeof feedback === "string" ? feedback.slice(0, 5000) : null,
        })
        .eq("id", submissionId)
      if (error) throw error
    } else {
      console.log("Feedback (not persisted — local dev):", { submissionId, rating, feedback })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Feedback error:", err)
    return NextResponse.json({ error: "Could not save feedback" }, { status: 500 })
  }
}
