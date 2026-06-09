"use client"

import FileUpload from "@/components/ui/FileUpload"
import Textarea from "@/components/ui/Textarea"

interface StepThreeData {
  questionnaireText: string
  resumeText: string
}

interface StepThreeProps {
  data: StepThreeData
  onChange: (data: Partial<StepThreeData>) => void
  errors: Partial<Record<keyof StepThreeData, string>>
}

export default function StepThree({ data, onChange, errors }: StepThreeProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl mb-1" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          Now, your background.
        </h2>
        <p className="text-[var(--medium-gray)] text-base">
          The more context you give, the more your trajectory will actually fit you.
          Upload or paste — either works.
        </p>
      </div>

      <hr className="rule" />

      <div className="flex flex-col gap-3">
        <FileUpload
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
      </div>

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
        your trajectory is not saved to your account — because there is no account. Download your
        results when they appear, or copy them to a document. If you refresh or close the page, they will be gone.
      </div>
    </div>
  )
}
