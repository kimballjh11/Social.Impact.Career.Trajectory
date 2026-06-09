"use client"

import { useRef, useState, DragEvent, ChangeEvent } from "react"

interface FileUploadProps {
  label: string
  hint?: string
  accept?: string
  onExtracted: (text: string) => void
  onRawFile?: (file: File) => void
}

export default function FileUpload({ label, hint, accept, onExtracted, onRawFile }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  async function handleFile(file: File) {
    setFileName(file.name)
    setError(null)
    setLoading(true)
    onRawFile?.(file)

    const form = new FormData()
    form.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      onExtracted(data.text)
    } catch (err) {
      setError("Could not read this file. Try a PDF, DOCX, or paste your text below.")
      setFileName(null)
    } finally {
      setLoading(false)
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="label">{label}</label>
      {hint && <p className="text-sm text-[var(--medium-gray)] -mt-0.5">{hint}</p>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          border border-dashed cursor-pointer transition-colors duration-150
          px-6 py-8 text-center
          ${dragging
            ? "border-[var(--steel-blue)] bg-[var(--off-white)]"
            : "border-[var(--rule-gray)] bg-[var(--off-white)] hover:border-[var(--steel-blue)]"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onChange}
        />
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-[var(--steel-blue)] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[var(--medium-gray)]">Reading file...</span>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-[var(--steel-blue)] font-medium">{fileName}</span>
            <span className="text-xs text-[var(--medium-gray)]">Click to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-[var(--charcoal)]">Drop your file here, or click to browse</span>
            <span className="text-xs text-[var(--medium-gray)]">PDF, DOCX, or TXT</span>
          </div>
        )}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
}
