import { NextRequest, NextResponse } from "next/server"
import { generateTrajectory, generateTeachMe } from "@/lib/claude"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { mode, ...data } = body

    if (mode === "teach_me") {
      const { section, content } = data
      const expansion = await generateTeachMe(section, content)
      return NextResponse.json({ expansion })
    }

    // Default: generate full trajectory
    const output = await generateTrajectory(data)
    return NextResponse.json({ output })
  } catch (err) {
    console.error("Generate error:", err)
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 })
  }
}
