"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"

interface DownloadButtonProps {
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

export default function DownloadButton({ name, sector, output }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)

    try {
      const jsPDF = (await import("jspdf")).default

      const doc = new jsPDF({ unit: "pt", format: "letter" })
      const margin = 72
      const pageWidth = doc.internal.pageSize.getWidth()
      const contentWidth = pageWidth - margin * 2
      let y = margin

      function addWrappedText(text: string, fontSize: number, color: [number, number, number], bold = false) {
        doc.setFontSize(fontSize)
        doc.setTextColor(...color)
        doc.setFont("helvetica", bold ? "bold" : "normal")

        const lines = doc.splitTextToSize(text, contentWidth)
        lines.forEach((line: string) => {
          if (y > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage()
            y = margin
          }
          doc.text(line, margin, y)
          y += fontSize * 1.5
        })
      }

      function addSectionLabel(label: string) {
        y += 16
        addWrappedText(label.toUpperCase(), 8, [51, 92, 103], true)
        y += 4
      }

      function addRule() {
        doc.setDrawColor(212, 212, 212)
        doc.line(margin, y, pageWidth - margin, y)
        y += 16
      }

      // Header
      addWrappedText("DAYBREAK COLLABORATIVE · DAYBREAKERS", 8, [51, 92, 103], true)
      y += 8
      addWrappedText("Your Career Trajectory", 28, [26, 26, 26])
      y += 4
      addWrappedText(`${name} · ${sector}`, 11, [90, 90, 90])
      y += 24
      addRule()

      addSectionLabel("Your Power Statement")
      addWrappedText(output.power_statement, 13, [26, 26, 26])
      y += 24
      addRule()

      addSectionLabel("30-60-90 Day Plan")
      addWrappedText(output.plan_306090, 11, [45, 45, 45])
      y += 24
      addRule()

      addSectionLabel("Practitioners to Follow")
      addWrappedText(output.practitioners, 11, [45, 45, 45])
      y += 24
      addRule()

      addSectionLabel("Organizations to Know")
      addWrappedText(output.organizations, 11, [45, 45, 45])
      y += 24
      addRule()

      addSectionLabel("Resources to Dig Into")
      addWrappedText(output.resources, 11, [45, 45, 45])
      y += 48

      addWrappedText("The bridge won't build itself.", 11, [51, 92, 103])

      doc.save(`daybreakers-trajectory-${name.toLowerCase().replace(/\s+/g, "-")}.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} loading={loading} variant="primary">
      Download as PDF
    </Button>
  )
}
