import mammoth from "mammoth"

export async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    // Dynamically import pdf-parse to avoid issues with Next.js edge runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParse = (await import("pdf-parse")) as any
    const parse = pdfParse.default ?? pdfParse
    const result = await parse(buffer)
    return result.text.trim()
  }

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value.trim()
  }

  // Plain text fallback
  return buffer.toString("utf-8").trim()
}
