"use client"

import { useEffect, useState } from "react"
import Select from "@/components/ui/Select"
import Input from "@/components/ui/Input"
import { sectorNames, getSubSectors } from "@/lib/sectors"

interface StepTwoData {
  sector: string
  subSector: string
  causeArea: string
}

interface StepTwoProps {
  data: StepTwoData
  onChange: (data: Partial<StepTwoData>) => void
  errors: Partial<Record<keyof StepTwoData, string>>
}

export default function StepTwo({ data, onChange, errors }: StepTwoProps) {
  const [subSectors, setSubSectors] = useState<string[]>([])

  useEffect(() => {
    if (data.sector) {
      const subs = getSubSectors(data.sector)
      setSubSectors(subs)
      if (!subs.includes(data.subSector)) {
        onChange({ subSector: "" })
      }
    }
  }, [data.sector])

  function handleSectorChange(sector: string) {
    onChange({ sector, subSector: "" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl mb-1" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          Where is your work?
        </h2>
        <p className="text-[var(--medium-gray)] text-base">
          The more specific you are, the more useful your trajectory will be.
        </p>
      </div>

      <hr className="rule" />

      <Select
        label="Primary Sector"
        options={sectorNames}
        placeholder="Select a sector"
        value={data.sector}
        onChange={(e) => handleSectorChange(e.target.value)}
        error={errors.sector}
      />

      {subSectors.length > 0 && (
        <Select
          label="Sub-Sector"
          options={subSectors}
          placeholder="Select a sub-sector"
          value={data.subSector}
          onChange={(e) => onChange({ subSector: e.target.value })}
          error={errors.subSector}
        />
      )}

      {data.sector === "Other" && (
        <Input
          label="Describe your sector"
          placeholder="Tell us where your work lives"
          value={data.sector === "Other" ? data.subSector : ""}
          onChange={(e) => onChange({ subSector: e.target.value })}
        />
      )}

      <Input
        label="Cause Area"
        placeholder="e.g. youth homelessness, climate adaptation, civic tech..."
        value={data.causeArea}
        onChange={(e) => onChange({ causeArea: e.target.value })}
        error={errors.causeArea}
      />
      <p className="text-sm text-[var(--medium-gray)] -mt-4">
        The specific problem or population you care most about within your sector.
      </p>
    </div>
  )
}
