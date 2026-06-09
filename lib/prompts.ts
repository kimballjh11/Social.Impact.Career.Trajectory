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

export function buildUserPrompt(data: {
  name: string
  careerStage: string
  sector: string
  subSector: string
  causeArea: string
  questionnaireText: string
  resumeText: string
}): string {
  return `Here is everything I know about the person you are writing for:

Name: ${data.name}
Career Stage: ${data.careerStage}
Sector: ${data.sector}
Sub-Sector: ${data.subSector}
Cause Area: ${data.causeArea}

--- QUESTIONNAIRE ANSWERS ---
${data.questionnaireText || "Not provided."}

--- RESUME / PROFESSIONAL BACKGROUND ---
${data.resumeText || "Not provided."}

---

Now generate a career trajectory for this person. Return a JSON object with exactly these five fields.
Do not include any text outside the JSON object. Do not use markdown code fences.

{
  "power_statement": "A 2-3 sentence personal power statement. This is their positioning in the sector — who they are, what they bring, and where they are headed. It should feel like something they could say out loud at the start of a conversation that would make the other person lean in.",

  "plan_306090": "A 30-60-90 day action plan written in three clearly labeled sections: Days 1-30, Days 31-60, Days 61-90. Each section has 3-4 specific, actionable items tailored to their sector and stage. Not vague goals — real moves they can make this week.",

  "practitioners": "3-5 real practitioners or thought leaders in their specific sector worth following. For each: their name, their role or organization, and one sentence on why this person matters and what following them will actually give the reader.",

  "organizations": "5-7 real organizations working in their sector that they should know. For each: the organization name, a one-sentence description of what they do, and why it is relevant to where this person is headed.",

  "resources": "3-5 specific resources — books, podcasts, reports, or programs — that are genuinely useful for someone at their stage in their sector. For each: the title, format (book/podcast/report/program), and one sentence on what it gives the reader."
}`
}

export function buildTeachMePrompt(section: string, content: string): string {
  return `A user is reading their career trajectory report and wants to learn more about one section.

Section: ${section}
Content they are looking at:
${content}

Write 2-3 paragraphs that expand on this section. Go deeper on the ideas, give more context on why it matters,
and give the reader something they can act on or think about differently.
Use the same voice: direct, warm, plain-spoken. No dashes. Write to this specific person, not a general audience.`
}
