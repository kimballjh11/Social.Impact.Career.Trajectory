"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
  inlineStory: string
  inlineComeToYouFor: string
  inlineLostTrackOfTime: string
  questionnaireText: string
  resumeText: string
}

// Rotates every 20 seconds while a trajectory is generating. Sized to cover
// the full 1-2 minute window; index clamps at the last message so users who
// wait longer than expected don't see the sequence loop back to the start
// (which reads as "stuck"). First message matches the original copy so
// nothing flickers at the moment generation begins.
const LOADING_MESSAGES = [
  "Building your trajectory. This usually takes one to two minutes.",
  "Pulling together what's true about your sector.",
  "Drafting your power statement.",
  "Mapping your 30-60-90 day plan.",
  "Surfacing the people and resources for your path.",
  "Tightening the language. Almost there.",
]
const LOADING_ROTATION_MS = 20_000

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  careerStage: "",
  sector: "",
  subSector: "",
  causeArea: "",
  inlineStory: "",
  inlineComeToYouFor: "",
  inlineLostTrackOfTime: "",
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
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0)

  // Reset on stop, advance every LOADING_ROTATION_MS while generating.
  // Clamped at the last message so the sequence never wraps.
  useEffect(() => {
    if (!generating) {
      setLoadingMessageIdx(0)
      return
    }
    const id = setInterval(() => {
      setLoadingMessageIdx((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1))
    }, LOADING_ROTATION_MS)
    return () => clearInterval(id)
  }, [generating])

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
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          careerStage: data.careerStage,
          sector: data.sector,
          subSector: data.subSector,
          causeArea: data.causeArea,
          inlineStory: data.inlineStory,
          inlineComeToYouFor: data.inlineComeToYouFor,
          inlineLostTrackOfTime: data.inlineLostTrackOfTime,
          questionnaireText: data.questionnaireText,
          resumeText: data.resumeText,
        }),
      })

      const resData = await res.json()
      if (resData.error) throw new Error(resData.error)

      sessionStorage.setItem(
        "trajectory",
        JSON.stringify({ ...data, output: resData.output, id: resData.id })
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
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-end">
          <Image
            src="/daybreak-logo.png"
            alt="Daybreak Collaborative"
            width={2659}
            height={984}
            priority
            className="h-10 w-auto"
          />
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
            <div className="mt-8 flex flex-col gap-3">
              <div className="label" style={{ color: "var(--steel-blue)" }}>At no cost, you&rsquo;ll receive</div>
              <ul className="flex flex-col gap-2 max-w-xl">
                {[
                  "A Power Statement to help you better articulate where you are and where you want to go",
                  "A 30-60-90 day plan to make tangible steps in the right direction",
                  "A list of people, resources and tools to get started",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base" style={{ color: "var(--charcoal)" }}>
                    <span aria-hidden style={{ color: "var(--terracotta)", marginTop: "2px" }}>&mdash;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
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
            <p
              key={loadingMessageIdx}
              className="text-sm text-center max-w-xs transition-opacity duration-500"
              style={{ color: "var(--medium-gray)" }}
            >
              {LOADING_MESSAGES[loadingMessageIdx]}
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
            For the changemakers who aren&apos;t waiting.
          </span>
        </div>
      </footer>
    </div>
  )
}
