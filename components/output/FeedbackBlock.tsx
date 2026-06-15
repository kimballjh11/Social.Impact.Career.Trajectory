"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"

interface FeedbackBlockProps {
  submissionId: string
}

export default function FeedbackBlock({ submissionId }: FeedbackBlockProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [text, setText] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")

  async function submit() {
    if (!rating && !text.trim()) return
    setStatus("sending")
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, rating, feedback: text.trim() }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col gap-1">
        <div className="label" style={{ color: "var(--steel-blue)" }}>Feedback</div>
        <p className="text-base" style={{ color: "var(--charcoal)" }}>
          Noted. Thank you &mdash; this is how the tool gets better.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="label" style={{ color: "var(--steel-blue)" }}>Rate this tool</div>
        <p className="text-sm" style={{ color: "var(--medium-gray)" }}>
          One tap. It helps more than you&rsquo;d think.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`Rate ${n} out of 5`}
            className="w-10 h-10 border text-sm font-medium transition-colors duration-150"
            style={{
              borderColor: rating === n ? "var(--terracotta)" : "var(--rule-gray)",
              background: rating === n ? "var(--terracotta)" : "var(--off-white)",
              color: rating === n ? "white" : "var(--charcoal)",
            }}
          >
            {n}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share any feedback you have..."
        className="w-full bg-[var(--off-white)] border border-[var(--rule-gray)] px-4 py-3 text-base resize-y min-h-[90px] placeholder:text-[var(--light-gray)] focus:outline-none focus:border-[var(--steel-blue)]"
        style={{ color: "var(--charcoal)" }}
      />

      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={submit}
          loading={status === "sending"}
          disabled={!rating && !text.trim()}
        >
          Send feedback
        </Button>
        {status === "error" && (
          <span className="text-sm text-red-500">Could not send. Try again.</span>
        )}
      </div>
    </div>
  )
}
