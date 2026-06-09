import Anthropic from "@anthropic-ai/sdk"
import { SYSTEM_PROMPT, buildUserPrompt, buildTeachMePrompt } from "./prompts"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export type TrajectoryOutput = {
  power_statement: string
  plan_306090: string
  practitioners: string
  organizations: string
  resources: string
}

export async function generateTrajectory(data: {
  name: string
  careerStage: string
  sector: string
  subSector: string
  causeArea: string
  questionnaireText: string
  resumeText: string
}): Promise<TrajectoryOutput> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(data),
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : ""

  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        parsed = JSON.parse(match[0])
      } catch {
        throw new Error("Claude returned malformed output. Please try again.")
      }
    } else {
      throw new Error("Claude returned malformed output. Please try again.")
    }
  }

  // Claude sometimes returns arrays of objects instead of strings — normalize everything to text
  function stringify(value: unknown): string {
    if (typeof value === "string") return value
    if (Array.isArray(value)) {
      return value
        .map((item, i) => {
          if (typeof item === "string") return item
          if (typeof item === "object" && item !== null) {
            return Object.entries(item as Record<string, unknown>)
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n")
          }
          return String(item)
        })
        .join("\n\n")
    }
    if (typeof value === "object" && value !== null) {
      return Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    }
    return String(value ?? "")
  }

  return {
    power_statement: stringify(parsed.power_statement),
    plan_306090: stringify(parsed.plan_306090),
    practitioners: stringify(parsed.practitioners),
    organizations: stringify(parsed.organizations),
    resources: stringify(parsed.resources),
  }
}

export async function generateTeachMe(section: string, content: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: buildTeachMePrompt(section, content),
      },
    ],
  })

  return message.content[0].type === "text" ? message.content[0].text : ""
}
