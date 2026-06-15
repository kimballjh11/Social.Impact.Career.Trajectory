export type TrajectoryInput = {
  name: string
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

export const SYSTEM_PROMPT = `You are the voice of Walker, founder of Daybreak Collaborative — a social impact consultancy.
You are writing a personalized career trajectory for a student or early-career professional in the social impact space.

Your voice is direct, grounded, and warm. You write like a mentor who has been where this person is standing.
You treat the reader as a peer — not a student to instruct, but someone whose path you take seriously.

Tone rules you must follow without exception:
- No dashes (-- or —) anywhere in the output
- Sentences can be longer and developed, but every word must earn its place
- No jargon. No generic consulting language. Say what you mean plainly
- Write to one specific person, not a general audience
- Be honest about what is hard. Name the real challenges in their sector
- Avoid phrases like "unlock your potential", "leverage your skills", "impactful journey"
- Sound like a person, not a product

You will be given the person's sector, sub-sector, cause area, career stage, answers to a reflective questionnaire,
and their resume or professional background. Use all of it. The output should feel like it was written for this exact person.`

// The three Identity questions asked inline when no full questionnaire is provided.
// Question text must stay verbatim with the Pre-Daybreak Questionnaire.
const INLINE_QUESTIONS = {
  inlineStory:
    "Tell the story of how you got here. Not the version you'd put in a bio, the one with the part you usually skip.",
  inlineComeToYouFor: "What do people come to you for?",
  inlineLostTrackOfTime: "What's the last thing you worked on where you lost track of time?",
} as const

// One source of truth per submission: the full questionnaire supersedes the
// inline answers because it contains those questions (and six more).
export function formatQuestionnaireSection(data: TrajectoryInput): string {
  if (data.questionnaireText?.trim()) {
    return data.questionnaireText.trim()
  }

  const pairs = (Object.keys(INLINE_QUESTIONS) as Array<keyof typeof INLINE_QUESTIONS>)
    .map((key) => ({ question: INLINE_QUESTIONS[key], answer: data[key]?.trim() }))
    .filter((p) => p.answer)

  if (pairs.length === 0) return "Not provided."

  return pairs.map((p) => `Q: ${p.question}\nA: ${p.answer}`).join("\n\n")
}

export function buildUserPrompt(data: TrajectoryInput): string {
  return `Here is everything I know about the person you are writing for:

Name: ${data.name}
Career Stage: ${data.careerStage}
Sector: ${data.sector}
Sub-Sector: ${data.subSector}
Cause Area: ${data.causeArea}

--- QUESTIONNAIRE ANSWERS ---
${formatQuestionnaireSection(data)}

--- RESUME / PROFESSIONAL BACKGROUND ---
${data.resumeText || "Not provided."}

---

Now generate a career trajectory for this person. Return a JSON object with exactly this structure.
Do not include any text outside the JSON object. Do not use markdown code fences.

{
  "power_statement": "A 2-3 sentence personal power statement. This is their positioning in the sector — who they are, what they bring, and where they are headed. It should feel like something they could say out loud at the start of a conversation that would make the other person lean in.",

  "plan_306090": {
    "days_1_30": "3-4 specific, actionable items for days 1-30, tailored to their sector and stage. Not vague goals — real moves they can make this week.",
    "days_31_60": "3-4 specific, actionable items for days 31-60 that build on the first month.",
    "days_61_90": "3-4 specific, actionable items for days 61-90 that turn momentum into trajectory."
  },

  "practitioners": [
    { "name": "Full name", "role": "Their role or organization", "why": "One sentence on why this person matters and what following them will actually give the reader." }
  ],

  "organizations": [
    { "name": "Organization name", "description": "One sentence on what they do.", "relevance": "Why it is relevant to where this person is headed." }
  ],

  "resources": [
    { "title": "Resource title", "format": "book, podcast, report, or program", "value": "One sentence on what it gives the reader." }
  ]
}

Web search budget: you have at most 3 web_search calls for this entire response. Use them efficiently — broad, consolidated queries that surface multiple practitioners and organizations at once (for example: one search for the sector's current leaders, one for the most active organizations in this cause area). Do not search one name at a time. Skip searches entirely if you are already confident the people and organizations you would list are real and still active. Anyone or anything you cannot confirm with the searches you have, leave out.

Requirements:
- ALL THREE plan_306090 sections are required for every person, no matter how early in their career they are. For someone with little or no experience, days 31-60 and 61-90 shift toward exploration, conversations, volunteering, and first reps — they never disappear. Never return fewer than three sections.
- practitioners: 3-5 entries of real practitioners or thought leaders in their specific sector. Only include names you are confident are real and currently active.
- organizations: 5-7 entries of real organizations working in their sector. Only include organizations you are confident exist and are currently active.
- resources: 3-5 entries that are genuinely useful for someone at their stage in their sector.`
}

