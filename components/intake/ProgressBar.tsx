"use client"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const labels = ["You", "Your Sector", "Your Background"]

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-0 mb-12">
      {labels.map((label, i) => {
        const step = i + 1
        const isComplete = step < currentStep
        const isCurrent = step === currentStep

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-200 ${
                  isComplete
                    ? "bg-[var(--steel-blue)] text-white"
                    : isCurrent
                    ? "bg-[var(--terracotta)] text-white"
                    : "bg-[var(--rule-gray)] text-[var(--light-gray)]"
                }`}
              >
                {isComplete ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-[10px] tracking-widest uppercase whitespace-nowrap ${
                  isCurrent ? "text-[var(--warm-black)]" : "text-[var(--light-gray)]"
                }`}
              >
                {label}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-px mx-3 mt-[-12px] transition-colors duration-200 ${
                  isComplete ? "bg-[var(--steel-blue)]" : "bg-[var(--rule-gray)]"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
