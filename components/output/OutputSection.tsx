"use client"

import TeachMeMore from "./TeachMeMore"

interface OutputSectionProps {
  label: string
  content: string
  isPower?: boolean
  noTeachMe?: boolean
}

export default function OutputSection({ label, content, isPower, noTeachMe }: OutputSectionProps) {
  return (
    <div className="py-10 border-b border-[var(--rule-gray)] last:border-b-0">
      <div className="label mb-4">{label}</div>
      <div
        className={`whitespace-pre-line leading-relaxed ${
          isPower
            ? "text-xl text-[var(--warm-black)] italic"
            : "text-base text-[var(--charcoal)]"
        }`}
        style={isPower ? { fontFamily: "'Instrument Serif', Georgia, serif" } : {}}
      >
        {content}
      </div>
      {!noTeachMe && <TeachMeMore section={label} content={content} />}
    </div>
  )
}
