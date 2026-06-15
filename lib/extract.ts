import mammoth from "mammoth"

export async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    // pdf-parse v2 exports a PDFParse class (no default function export like v1)
    const { PDFParse } = await import("pdf-parse")
    const parser = new PDFParse({ data: new Uint8Array(buffer) })
    try {
      const result = await parser.getText()
      return result.text.trim()
    } finally {
      await parser.destroy?.()
    }
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
