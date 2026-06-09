"use client"

import { TextareaHTMLAttributes, forwardRef } from "react"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label">{label}</label>
      {hint && <p className="text-sm text-[var(--medium-gray)] -mt-0.5">{hint}</p>}
      <textarea
        ref={ref}
        className={`
          w-full bg-[var(--off-white)] border border-[var(--rule-gray)] px-4 py-3
          text-[var(--charcoal)] text-base font-sans resize-y min-h-[140px]
          placeholder:text-[var(--light-gray)]
          focus:outline-none focus:border-[var(--steel-blue)]
          transition-colors duration-150
          ${error ? "border-red-400" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
})

export default Textarea
