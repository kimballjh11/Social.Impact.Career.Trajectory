"use client"

import { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "secondary" | "ghost"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
}

export default function Button({
  variant = "primary",
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-sans text-sm tracking-wide transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"

  const variants: Record<Variant, string> = {
    primary:
      "bg-[var(--terracotta)] text-white px-8 py-3.5 hover:bg-[var(--terracotta-light)] active:scale-[0.98]",
    secondary:
      "border border-[var(--steel-blue)] text-[var(--steel-blue)] px-8 py-3.5 hover:bg-[var(--steel-blue)] hover:text-white",
    ghost: "text-[var(--medium-gray)] px-4 py-2 hover:text-[var(--warm-black)]",
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
