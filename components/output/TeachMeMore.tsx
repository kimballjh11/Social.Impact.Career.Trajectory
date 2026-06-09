"use client"

import { useState } from "react"

interface TeachMeMoreProps {
  section: string
  content: string
}

export default function TeachMeMore({ section, content }: TeachMeMoreProps) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expansion, setExpansion] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (expanded) {
      setExpanded(false)
      return
    }

    if (expansion) {
      setExpanded(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "teach_me", section, content }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setExpansion(data.expansion)
      setExpanded(true)
    } catch {
      setError("Could not load more. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-2 text-sm text-[var(--steel-blue)] hover:text-[var(--warm-black)] transition-colors duration-150 disabled:opacity-50"
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border border-[var(--steel-blue)] border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className={`text-lg leading-none transition-transform duration-150 ${expanded ? "rotate-45" : ""}`}>+</span>
        )}
        <span className="tracking-wider uppercase text-[10px] font-medium">
          {loading ? "Loading..." : expanded ? "Close" : "Teach me more about this"}
        </span>
      </button>

      {expanded && expansion && (
        <div className="mt-4 pl-4 border-l-2 border-[var(--rule-gray)] text-[var(--charcoal)] text-base leading-relaxed whitespace-pre-line">
          {expansion}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
