import { NextRequest, NextResponse } from "next/server"
import { extractTextFromFile } from "@/lib/extract"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const text = await extractTextFromFile(buffer, file.type)

    return NextResponse.json({ text })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Failed to extract text from file" }, { status: 500 })
  }
}
