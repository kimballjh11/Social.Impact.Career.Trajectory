import Anthropic from "@anthropic-ai/sdk"
import { SYSTEM_PROMPT, buildUserPrompt, TrajectoryInput } from "./prompts"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Handles the server-side search loop. The web_search tool runs on Anthropic's
// infrastructure; when it hits its iteration limit mid-run the API returns
// pause_turn instead of end_turn. Re-send the original user message plus the
// assistant turn so the server can resume where it left off.
async function callWithSearch(
  system: string,
  userPrompt: string,
  maxTokens: number,
): Promise<Anthropic.Message> {
  let messages: Anthropic.MessageParam[] = [{ role: "user", content: userPrompt }]

  for (;;) {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system,
      messages,
      tools: [{ type: "web_search_20260209", name: "web_search" }],
    })

    if (message.stop_reason !== "pause_turn") return message

    messages = [
      { role: "user", content: userPrompt },
      { role: "assistant", content: message.content as Anthropic.MessageParam["content"] },
    ]
  }
}

// Web search adds server_tool_use and web_search_tool_result blocks before the
// final text. Scan backwards to find the last text block, which holds the JSON.
function extractResponseText(message: Anthropic.Message): string {
  for (let i = message.content.length - 1; i >= 0; i--) {
    const block = message.content[i]
    if (block.type === "text") return block.text
  }
  return ""
}

export type Plan306090 = {
  days_1_30: string
  days_31_60: string
  days_61_90: string
}

export type TrajectoryOutput = {
  power_statement: string
  plan_306090: Plan306090
  practitioners: string
  organizations: string
  resources: string
}

// Renders the structured plan as labeled text for the database, emails, and PDF.
export function formatPlanText(plan: Plan306090): string {
  return [
    `DAYS 1-30\n${plan.days_1_30}`,
    `DAYS 31-60\n${plan.days_31_60}`,
    `DAYS 61-90\n${plan.days_61_90}`,
  ].join("\n\n")
}

// Capitalized display labels for each list's fields (Walker's spec).
const LIST_LABELS: Record<string, Record<string, string>> = {
  practitioners: { name: "Name", role: "Role", why: "Why" },
  organizations: { name: "Name", description: "Description", relevance: "Relevance" },
  resources: { title: "Title", format: "Format", value: "Value" },
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Normalizes a list field (array of objects, array of strings, or plain string)
// into display text with capitalized labels.
function listToText(value: unknown, field: keyof typeof LIST_LABELS): string {
  if (typeof value === "string") return value
  if (!Array.isArray(value)) return String(value ?? "")

  const labels = LIST_LABELS[field]
  return value
    .map((item) => {
      if (typeof item === "string") return item
      if (typeof item === "object" && item !== null) {
        return Object.entries(item as Record<string, unknown>)
          .map(([k, v]) => `${labels[k] ?? capitalize(k)}: ${v}`)
          .join("\n")
      }
      return String(item)
    })
    .join("\n\n")
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : String(value ?? "")
}

function parseJson(text: string): Record<string, unknown> {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error("No JSON object found in model output")
  }
}

function normalize(parsed: Record<string, unknown>): TrajectoryOutput {
  const rawPlan = parsed.plan_306090
  let plan: Plan306090
  if (rawPlan && typeof rawPlan === "object" && !Array.isArray(rawPlan)) {
    const p = rawPlan as Record<string, unknown>
    plan = {
      days_1_30: asString(p.days_1_30).trim(),
      days_31_60: asString(p.days_31_60).trim(),
      days_61_90: asString(p.days_61_90).trim(),
    }
  } else {
    // Model returned the plan as one string — keep it usable rather than failing
    plan = { days_1_30: asString(rawPlan).trim(), days_31_60: "", days_61_90: "" }
  }

  return {
    power_statement: asString(parsed.power_statement).trim(),
    plan_306090: plan,
    practitioners: listToText(parsed.practitioners, "practitioners").trim(),
    organizations: listToText(parsed.organizations, "organizations").trim(),
    resources: listToText(parsed.resources, "resources").trim(),
  }
}

// Every section must be present and non-empty — this is the guard against the
// "only got a 30-day plan" failure mode.
function isComplete(o: TrajectoryOutput): boolean {
  return Boolean(
    o.power_statement &&
    o.plan_306090.days_1_30 &&
    o.plan_306090.days_31_60 &&
    o.plan_306090.days_61_90 &&
    o.practitioners &&
    o.organizations &&
    o.resources
  )
}

export async function generateTrajectory(data: TrajectoryInput): Promise<TrajectoryOutput> {
  const basePrompt = buildUserPrompt(data)
  let lastError = "incomplete output"

  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt =
      attempt === 0
        ? basePrompt
        : basePrompt +
          "\n\nIMPORTANT: Your previous attempt was missing required fields. Return EVERY field in the schema, including all three plan_306090 sections (days_1_30, days_31_60, days_61_90), each with real content."

    const message = await callWithSearch(SYSTEM_PROMPT, prompt, 8000)
    const text = extractResponseText(message)

    try {
      const output = normalize(parseJson(text))
      if (isComplete(output)) return output
      lastError = "incomplete output (missing sections)"
    } catch {
      lastError = "malformed output"
    }
  }

  throw new Error(`Claude returned ${lastError}. Please try again.`)
}
