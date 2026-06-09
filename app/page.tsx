"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ProgressBar from "@/components/intake/ProgressBar"
import StepOne from "@/components/intake/StepOne"
import StepTwo from "@/components/intake/StepTwo"
import StepThree from "@/components/intake/StepThree"
import Button from "@/components/ui/Button"

type FormData = {
  name: string
  email: string
  phone: string
  careerStage: string
  sector: string
  subSector: string
  causeArea: string
  questionnaireText: string
  resumeText: string
}

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  careerStage: "",
  sector: "",
  subSector: "",
  causeArea: "",
  questionnaireText: "",
  resumeText: "",
}

export default function HomePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)

  function update(patch: Partial<FormData>) {
    setData((prev) => ({ ...prev, ...patch }))
    setErrors((prev) => {
      const next = { ...prev }
      Object.keys(patch).forEach((k) => delete next[k as keyof FormData])
      return next
    })
  }

  function validateStep(): boolean {
    const next: Partial<FormData> = {}

    if (step === 1) {
      if (!data.name.trim()) next.name = "Required"
      if (!data.email.trim()) next.email = "Required"
      else if (!/\S+@\S+\.\S+/.test(data.email)) next.email = "Enter a valid email"
      if (!data.phone.trim()) next.phone = "Required"
      if (!data.careerStage) next.careerStage = "Required"
    }

    if (step === 2) {
      if (!data.sector) next.sector = "Required"
      if (!data.causeArea.trim()) next.causeArea = "Required"
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function nextStep() {
    if (validateStep()) setStep((s) => s + 1)
  }

  function prevStep() {
    setStep((s) => s - 1)
    setErrors({})
  }

  async function handleSubmit() {
    if (!validateStep()) return

    setGenerating(true)
    setGenError(null)

    try {
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          careerStage: data.careerStage,
          sector: data.sector,
          subSector: data.subSector,
          causeArea: data.causeArea,
          questionnaireText: data.questionnaireText,
          resumeText: data.resumeText,
        }),
      })

      const genData = await genRes.json()
      if (genData.error) throw new Error(genData.error)

      const submitRes = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, output: genData.output }),
      })

      const submitData = await submitRes.json()
      if (submitData.error) throw new Error(submitData.error)

      sessionStorage.setItem(
        "trajectory",
        JSON.stringify({ ...data, output: genData.output, id: submitData.id })
      )
      router.push("/output")
    } catch (err: unknown) {
      setGenError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--warm-white)" }}>
      <nav className="border-b border-[var(--rule-gray)]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="label" style={{ color: "var(--steel-blue)" }}>DAYBREAK COLLABORATIVE</span>
          <span className="label" style={{ color: "var(--light-gray)" }}>DAYBREAKERS</span>
        </div>
      </nav>

      {step === 1 && (
        <div className="border-b border-[var(--rule-gray)]" style={{ background: "var(--off-white)" }}>
          <div className="max-w-3xl mx-auto px-6 py-16">
            <div className="label mb-4" style={{ color: "var(--terracotta)" }}>Career Trajectory Tool</div>
            <h1 className="text-5xl mb-6" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "var(--warm-black)" }}>
              Build your path in social impact.
            </h1>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: "var(--charcoal)" }}>
              Answer a few questions about where you are and where you want to go. In a few minutes,
              you will have a personalized career trajectory built for the specific work you care about.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-16">
        <ProgressBar currentStep={step} totalSteps={3} />

        {step === 1 && <StepOne data={data} onChange={update} errors={errors} />}
        {step === 2 && <StepTwo data={data} onChange={update} errors={errors} />}
        {step === 3 && <StepThree data={data} onChange={update} errors={errors} />}

        {genError && (
          <div className="mt-6 p-4 border border-red-200 text-red-700 text-sm" style={{ background: "#fff5f5" }}>
            {genError}
          </div>
        )}

        {generating && (
          <div className="mt-8 flex flex-col items-center gap-4 py-8">
            <div
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "var(--terracotta)", borderTopColor: "transparent" }}
            />
            <p className="text-sm text-center max-w-xs" style={{ color: "var(--medium-gray)" }}>
              Building your trajectory. This usually takes 20-30 seconds.
            </p>
          </div>
        )}

        {!generating && (
          <div className="mt-10 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="ghost" onClick={prevStep}>&larr; Back</Button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <Button variant="primary" onClick={nextStep}>Continue &rarr;</Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit}>Build My Trajectory</Button>
            )}
          </div>
        )}
      </div>

      <footer className="border-t border-[var(--rule-gray)] mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="label" style={{ color: "var(--light-gray)" }}>DAYBREAK COLLABORATIVE</span>
          <span className="text-sm italic" style={{ color: "var(--light-gray)" }}>
            The bridge won&apos;t build itself.
          </span>
        </div>
      </footer>
    </div>
  )
}
