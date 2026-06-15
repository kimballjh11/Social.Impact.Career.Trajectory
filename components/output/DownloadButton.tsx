"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"
import { Plan306090 } from "@/lib/claude"

interface DownloadButtonProps {
  name: string
  sector: string
  output: {
    power_statement: string
    plan_306090: Plan306090
    practitioners: string
    organizations: string
    resources: string
  }
}

const COLORS = {
  steelBlue: [51, 92, 103] as [number, number, number],
  warmBlack: [26, 26, 26] as [number, number, number],
  charcoal: [45, 45, 45] as [number, number, number],
  mediumGray: [90, 90, 90] as [number, number, number],
  terracotta: [196, 118, 58] as [number, number, number],
  ruleGray: [212, 212, 212] as [number, number, number],
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
      const pageHeight = doc.internal.pageSize.getHeight()
      const contentWidth = pageWidth - margin * 2
      let y = margin

      function ensureRoom(needed: number) {
        if (y + needed > pageHeight - margin) {
          doc.addPage()
          y = margin
        }
      }

      function addWrappedText(
        text: string,
        fontSize: number,
        color: [number, number, number],
        opts: { bold?: boolean; italic?: boolean; lineHeight?: number; charSpace?: number } = {}
      ) {
        doc.setFontSize(fontSize)
        doc.setTextColor(...color)
        doc.setFont("helvetica", opts.bold ? "bold" : opts.italic ? "italic" : "normal")
        if (opts.charSpace) doc.setCharSpace(opts.charSpace)

        const lh = fontSize * (opts.lineHeight ?? 1.55)
        const lines = doc.splitTextToSize(text, contentWidth)
        lines.forEach((line: string) => {
          ensureRoom(lh)
          doc.text(line, margin, y)
          y += lh
        })
        if (opts.charSpace) doc.setCharSpace(0)
      }

      function addSectionLabel(label: string) {
        ensureRoom(60)
        addWrappedText(label.toUpperCase(), 8.5, COLORS.steelBlue, { bold: true, charSpace: 0.8 })
        y += 10
      }

      function addRule(spaceBefore = 24, spaceAfter = 28) {
        y += spaceBefore
        ensureRoom(spaceAfter + 10)
        doc.setDrawColor(...COLORS.ruleGray)
        doc.setLineWidth(0.5)
        doc.line(margin, y, pageWidth - margin, y)
        y += spaceAfter
      }

      // ── Header ──────────────────────────────────────────────────────────
      addWrappedText("DAYBREAK COLLABORATIVE \u00B7 DAYBREAKERS", 8.5, COLORS.steelBlue, {
        bold: true,
        charSpace: 0.8,
      })
      y += 22 // breathing room between eyebrow and title
      addWrappedText("Your Career Trajectory", 28, COLORS.warmBlack, { lineHeight: 1.2 })
      y += 8
      addWrappedText(`${name} \u00B7 ${sector}`, 11, COLORS.mediumGray)
      addRule(20, 30)

      // ── Power Statement ─────────────────────────────────────────────────
      addSectionLabel("Your Power Statement")
      addWrappedText(output.power_statement, 13, COLORS.warmBlack, { italic: true, lineHeight: 1.6 })
      addRule()

      // ── 30-60-90 Plan, one labeled block per month ──────────────────────
      addSectionLabel("30-60-90 Day Plan")
      const months: Array<[string, string]> = [
        ["Days 1-30", output.plan_306090.days_1_30],
        ["Days 31-60", output.plan_306090.days_31_60],
        ["Days 61-90", output.plan_306090.days_61_90],
      ]
      months.forEach(([label, body], i) => {
        if (i > 0) y += 14
        ensureRoom(50)
        addWrappedText(label, 11, COLORS.terracotta, { bold: true })
        y += 4
        addWrappedText(body, 11, COLORS.charcoal)
      })
      addRule()

      addSectionLabel("Practitioners to Follow")
      addWrappedText(output.practitioners, 11, COLORS.charcoal)
      addRule()

      addSectionLabel("Organizations to Know")
      addWrappedText(output.organizations, 11, COLORS.charcoal)
      addRule()

      addSectionLabel("Resources to Dig Into")
      addWrappedText(output.resources, 11, COLORS.charcoal)

      y += 40
      ensureRoom(30)
      addWrappedText("For the changemakers who aren\u2019t waiting.", 11, COLORS.steelBlue, {
        italic: true,
      })

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
