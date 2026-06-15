"use client"

import { InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  optional?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, optional, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label">
        {label}
        {optional && (
          <span className="ml-2 normal-case tracking-normal text-[var(--light-gray)]">
            (optional)
          </span>
        )}
      </label>
      <input
        ref={ref}
        className={`
          w-full bg-[var(--off-white)] border border-[var(--rule-gray)] px-4 py-3
          text-[var(--charcoal)] text-base font-sans
          placeholder:text-[var(--light-gray)]
          focus:outline-none focus:border-[var(--steel-blue)]
          transition-colors duration-150
          ${error ? "border-red-400" : ""}
          ${className}
        `}
        {...props}
      />
      {hint && !error && (
        <span className="text-sm text-[var(--medium-gray)]">{hint}</span>
      )}
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
})

export default Input
