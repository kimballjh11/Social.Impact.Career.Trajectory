"use client"

import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"

const CAREER_STAGES = [
  "Student (undergraduate or graduate)",
  "Recent Graduate (0-1 years)",
  "Early Career (1-3 years)",
  "Career Changer",
]

interface StepOneData {
  name: string
  email: string
  phone: string
  careerStage: string
}

interface StepOneProps {
  data: StepOneData
  onChange: (data: Partial<StepOneData>) => void
  errors: Partial<Record<keyof StepOneData, string>>
}

export default function StepOne({ data, onChange, errors }: StepOneProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl mb-1" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          Let's start with you.
        </h2>
        <p className="text-[var(--medium-gray)] text-base">
          This is how we reach you and how we frame your trajectory.
        </p>
      </div>

      <hr className="rule" />

      <Input
        label="Full Name"
        placeholder="Your name"
        value={data.name}
        onChange={(e) => onChange({ name: e.target.value })}
        error={errors.name}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={data.email}
        onChange={(e) => onChange({ email: e.target.value })}
        error={errors.email}
      />

      <Input
        label="Phone Number"
        optional
        hint="Share if you'd like Walker to be able to reach you directly."
        type="tel"
        placeholder="(555) 000-0000"
        value={data.phone}
        onChange={(e) => onChange({ phone: e.target.value })}
        error={errors.phone}
      />

      <Select
        label="Where are you in your career?"
        options={CAREER_STAGES}
        placeholder="Select your stage"
        value={data.careerStage}
        onChange={(e) => onChange({ careerStage: e.target.value })}
        error={errors.careerStage}
      />
    </div>
  )
}
