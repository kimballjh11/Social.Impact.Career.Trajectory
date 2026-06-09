"use client"

import { InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label">{label}</label>
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
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
})

export default Input
