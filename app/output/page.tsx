"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import OutputSection from "@/components/output/OutputSection"
import DownloadButton from "@/components/output/DownloadButton"

type TrajectoryData = {
  name: string
  sector: string
  output: {
    power_statement: string
    plan_306090: string
    practitioners: string
    organizations: string
    resources: string
  }
}

export default function OutputPage() {
  const router = useRouter()
  const [data, setData] = useState<TrajectoryData | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem("trajectory")
    if (!raw) {
      router.push("/")
      return
    }
    setData(JSON.parse(raw))
  }, [router])

  if (!data) return null

  return (
    <div className="min-h-screen" style={{ background: "var(--warm-white)" }}>
      <nav className="border-b border-[var(--rule-gray)]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="label" style={{ color: "var(--steel-blue)" }}>DAYBREAK COLLABORATIVE</span>
          <span className="label" style={{ color: "var(--light-gray)" }}>DAYBREAKERS</span>
        </div>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--rule-gray)]" style={{ background: "var(--off-white)" }}>
        <div className="max-w-3xl mx-auto px-6 py-14">
          <div className="label mb-3" style={{ color: "var(--terracotta)" }}>Your Career Trajectory</div>
          <h1 className="text-4xl mb-2" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "var(--warm-black)" }}>
            {data.name}.
          </h1>
          <p className="text-base" style={{ color: "var(--medium-gray)" }}>{data.sector}</p>
        </div>
      </div>

      {/* Data loss warning */}
      <div className="border-b border-[var(--rule-gray)]" style={{ background: "#FFF8F0", borderColor: "#E8D5C0" }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-start gap-3">
          <span style={{ color: "var(--terracotta)", fontSize: "16px", marginTop: "1px", flexShrink: 0 }}>⚠</span>
          <p className="text-sm" style={{ color: "var(--charcoal)" }}>
            <span className="font-medium">Your trajectory is not saved.</span> Download it now or copy the sections you need.
            If you refresh or close this page, everything here will be gone.
          </p>
          <div className="ml-auto flex-shrink-0">
            <DownloadButton name={data.name} sector={data.sector} output={data.output} />
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <OutputSection
          label="Your Power Statement"
          content={data.output.power_statement}
          isPower
        />
        <OutputSection
          label="30-60-90 Day Plan"
          content={data.output.plan_306090}
        />
        <OutputSection
          label="Practitioners to Follow"
          content={data.output.practitioners}
        />
        <OutputSection
          label="Organizations to Know"
          content={data.output.organizations}
        />
        <OutputSection
          label="Resources to Dig Into"
          content={data.output.resources}
        />
      </div>

      {/* Bottom download + CTA */}
      <div className="border-t border-[var(--rule-gray)]" style={{ background: "var(--off-white)" }}>
        <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="text-base" style={{ color: "var(--charcoal)" }}>
              Check your email — a copy of this trajectory was sent to you.
              Walker will also be in touch in the next day or two.
            </p>
            <DownloadButton name={data.name} sector={data.sector} output={data.output} />
          </div>

          <hr className="rule" />

          <div className="flex flex-col gap-2">
            <div className="label" style={{ color: "var(--steel-blue)" }}>Want to go deeper?</div>
            <p className="text-base max-w-lg" style={{ color: "var(--charcoal)" }}>
              Daybreakers works directly with students and early-career professionals in social impact.
              If you want to build your path with someone who has been in the sector, that is exactly what we do.
            </p>
            <a
              href="https://daybreakcollaborative.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium tracking-wide"
              style={{ color: "var(--terracotta)" }}
            >
              Learn about Daybreakers &rarr;
            </a>
          </div>
        </div>
      </div>

      <footer className="border-t border-[var(--rule-gray)]">
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
