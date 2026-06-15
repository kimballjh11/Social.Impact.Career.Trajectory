"use client"

import { useState } from "react"
import FileUpload from "@/components/ui/FileUpload"
import Textarea from "@/components/ui/Textarea"

interface StepThreeData {
  inlineStory: string
  inlineComeToYouFor: string
  inlineLostTrackOfTime: string
  questionnaireText: string
  resumeText: string
}

interface StepThreeProps {
  data: StepThreeData
  onChange: (data: Partial<StepThreeData>) => void
  errors: Partial<Record<keyof StepThreeData, string>>
}

export default function StepThree({ data, onChange, errors }: StepThreeProps) {
  // If a questionnaire is already present (e.g. user navigated back), stay in questionnaire mode
  const [mode, setMode] = useState<"inline" | "questionnaire">(
    data.questionnaireText.trim() ? "questionnaire" : "inline"
  )
  // Incrementing this key remounts FileUpload so its internal state resets on removal
  const [uploadKey, setUploadKey] = useState(0)

  function switchToQuestionnaire() {
    setMode("questionnaire")
  }

  function switchToInline() {
    onChange({ questionnaireText: "" })
    setUploadKey((k) => k + 1)
    setMode("inline")
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl mb-1" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          Now, a few questions.
        </h2>
        <p className="text-[var(--medium-gray)] text-base">
          Don&rsquo;t polish your answers. There are no right ones here, only true ones.
        </p>
      </div>

      <hr className="rule" />

      {mode === "inline" ? (
        <div className="flex flex-col gap-6">
          <Textarea
            label="Tell the story of how you got here."
            hint="Not the version you'd put in a bio, the one with the part you usually skip."
            placeholder="Start anywhere..."
            value={data.inlineStory}
            onChange={(e) => onChange({ inlineStory: e.target.value })}
            error={errors.inlineStory}
            className="min-h-[140px]"
          />

          <Textarea
            label="What do people come to you for?"
            placeholder="A few sentences is plenty..."
            value={data.inlineComeToYouFor}
            onChange={(e) => onChange({ inlineComeToYouFor: e.target.value })}
            error={errors.inlineComeToYouFor}
            className="min-h-[100px]"
          />

          <Textarea
            label="What's the last thing you worked on where you lost track of time?"
            placeholder="What was it, and what pulled you in..."
            value={data.inlineLostTrackOfTime}
            onChange={(e) => onChange({ inlineLostTrackOfTime: e.target.value })}
            error={errors.inlineLostTrackOfTime}
            className="min-h-[100px]"
          />

          <button
            type="button"
            onClick={switchToQuestionnaire}
            className="self-start text-sm text-[var(--steel-blue)] hover:text-[var(--warm-black)] transition-colors duration-150 underline underline-offset-4"
          >
            Already completed your Pre-Daybreak Questionnaire? Use it instead &rarr;
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--medium-gray)]">
            Your full questionnaire covers these questions and more, so we&rsquo;ll use it instead
            of asking you to answer them again here.
          </p>

          <FileUpload
            key={uploadKey}
            label="Pre-Daybreak Questionnaire Answers"
            hint="Upload your completed questionnaire as a PDF, DOCX, or text file."
            accept=".pdf,.doc,.docx,.txt"
            onExtracted={(text) => onChange({ questionnaireText: text })}
          />

          <Textarea
            label="Or paste your answers here"
            hint="If you filled out the questionnaire digitally, paste the full text below."
            placeholder="Paste your questionnaire responses..."
            value={data.questionnaireText}
            onChange={(e) => onChange({ questionnaireText: e.target.value })}
            error={errors.questionnaireText}
            className="min-h-[180px]"
          />

          <button
            type="button"
            onClick={switchToInline}
            className="self-start text-sm text-[var(--steel-blue)] hover:text-[var(--warm-black)] transition-colors duration-150 underline underline-offset-4"
          >
            &larr; Answer the short questions instead
            {data.questionnaireText.trim() ? " (removes your questionnaire)" : ""}
          </button>
        </div>
      )}

      <hr className="rule" />

      <div className="flex flex-col gap-3">
        <FileUpload
          label="Resume or CV"
          hint="We'll extract the text and use it to personalize your trajectory."
          accept=".pdf,.doc,.docx"
          onExtracted={(text) => onChange({ resumeText: text })}
        />
        <Textarea
          label="Or paste your resume text here"
          hint="Copy and paste the text content of your resume if you prefer."
          placeholder="Paste your resume content..."
          value={data.resumeText}
          onChange={(e) => onChange({ resumeText: e.target.value })}
          error={errors.resumeText}
          className="min-h-[140px]"
        />
      </div>

      <div className="bg-[var(--off-white)] border border-[var(--rule-gray)] px-5 py-4 text-sm text-[var(--medium-gray)]">
        <span className="font-medium text-[var(--charcoal)]">Before you submit: </span>
        your trajectory is not saved to your account &mdash; because there is no account. Download your
        results when they appear, or copy them to a document. If you refresh or close the page, they will be gone.
      </div>
    </div>
  )
}
