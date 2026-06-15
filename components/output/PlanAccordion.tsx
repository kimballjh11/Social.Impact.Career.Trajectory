"use client"

import { useState } from "react"
import { Plan306090 } from "@/lib/claude"

interface PlanAccordionProps {
  plan: Plan306090
}

const SECTIONS: Array<{ key: keyof Plan306090; label: string }> = [
  { key: "days_1_30", label: "Days 1-30" },
  { key: "days_31_60", label: "Days 31-60" },
  { key: "days_61_90", label: "Days 61-90" },
]

export default function PlanAccordion({ plan }: PlanAccordionProps) {
  // One month at a time — first month open by default
  const [open, setOpen] = useState<keyof Plan306090 | null>("days_1_30")

  return (
    <div className="py-10 border-b border-[var(--rule-gray)]">
      <div className="label mb-4">30-60-90 Day Plan</div>

      <div className="flex flex-col border border-[var(--rule-gray)]">
        {SECTIONS.map(({ key, label }, i) => {
          const isOpen = open === key
          return (
            <div key={key} className={i > 0 ? "border-t border-[var(--rule-gray)]" : ""}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : key)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150 hover:bg-[var(--off-white)]"
                style={{ background: isOpen ? "var(--off-white)" : "transparent" }}
              >
                <span
                  className="text-base font-medium"
                  style={{ color: isOpen ? "var(--terracotta)" : "var(--warm-black)" }}
                >
                  {label}
                </span>
                <span
                  aria-hidden
                  className={`text-xl leading-none transition-transform duration-150 ${isOpen ? "rotate-45" : ""}`}
                  style={{ color: "var(--medium-gray)" }}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div
                  className="px-5 pb-5 whitespace-pre-line text-base leading-relaxed"
                  style={{ color: "var(--charcoal)", background: "var(--off-white)" }}
                >
                  {plan[key]}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
