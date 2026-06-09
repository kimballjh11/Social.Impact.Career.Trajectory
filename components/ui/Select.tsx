"use client"

import { SelectHTMLAttributes, forwardRef } from "react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: string[]
  placeholder?: string
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder, error, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label">{label}</label>
      <select
        ref={ref}
        className={`
          w-full bg-[var(--off-white)] border border-[var(--rule-gray)] px-4 py-3
          text-[var(--charcoal)] text-base font-sans appearance-none
          focus:outline-none focus:border-[var(--steel-blue)]
          transition-colors duration-150
          ${error ? "border-red-400" : ""}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
})

export default Select
