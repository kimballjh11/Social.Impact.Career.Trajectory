// Daybreakers sector taxonomy — six clusters, 26 sectors.
// Language locked June 2026 (see daybreakers-sector-taxonomy.md).
// Cluster and sector descriptions are client-facing copy in the Daybreakers voice.

export type Sector = {
  name: string
  description: string
  subSectors: string[]
}

export type Cluster = {
  name: string
  description: string
  sectors: Sector[]
}

export const clusters: Cluster[] = [
  {
    name: "Education & Opportunity",
    description: "Learning, work, and the systems that shape students.",
    sectors: [
      {
        name: "Education and Youth Development",
        description: "Schools, after-school programs, and the people working to make learning work for every kid.",
        subSectors: ["K-12 Education", "Higher Education Access", "Early Childhood", "After-School Programs", "Tutoring and Mentorship", "Education Policy"],
      },
      {
        name: "Economic Mobility and Workforce Development",
        description: "Job training, financial security, and the on-ramps into stable work.",
        subSectors: ["Job Training and Placement", "Financial Literacy", "Entrepreneurship Support", "Poverty Alleviation", "Labor Rights", "Small Business Development"],
      },
      {
        name: "Child Welfare and Family Services",
        description: "Foster care, family preservation, and keeping kids safe and supported.",
        subSectors: ["Foster Care and Adoption", "Family Preservation", "Early Intervention", "Child Abuse Prevention", "Child Policy and Advocacy", "Kinship Care"],
      },
    ],
  },
  {
    name: "Health & Care",
    description: "Physical and mental health, and the people who need someone in their corner.",
    sectors: [
      {
        name: "Public Health and Healthcare Access",
        description: "Community health, prevention, and getting care to people locked out of it.",
        subSectors: ["Community Health", "Global Health", "Maternal and Child Health", "Health Equity", "Public Health Policy", "Healthcare Access and Insurance"],
      },
      {
        name: "Mental Health",
        description: "Community mental health, crisis response, and the systems behind them.",
        subSectors: ["Community Mental Health", "Crisis Intervention", "Youth Mental Health", "Peer Support Programs", "Policy and Advocacy"],
      },
      {
        name: "Substance Use and Recovery",
        description: "Recovery programs, harm reduction, and access to treatment.",
        subSectors: ["Recovery Programs", "Harm Reduction", "Prevention and Education", "Treatment Access", "Policy and Advocacy"],
      },
      {
        name: "Elder Care and Aging",
        description: "Services, advocacy, and dignity for older adults and their caregivers.",
        subSectors: ["Senior Services", "Aging in Place Programs", "Long-Term Care Advocacy", "Intergenerational Programs", "Elder Abuse Prevention", "Caregiver Support"],
      },
      {
        name: "Veterans and Military Families",
        description: "Reintegration, services, and support for the people who served.",
        subSectors: ["Reintegration Support", "Mental Health Services", "Housing and Employment", "Legal Aid", "Family Support Programs", "Advocacy and Policy"],
      },
    ],
  },
  {
    name: "Rights & Justice",
    description: "Civil rights, legal systems, and the fights over who gets protected.",
    sectors: [
      {
        name: "Criminal Justice Reform",
        description: "Reentry, legal aid, and changing how the justice system treats people.",
        subSectors: ["Reentry and Reintegration", "Advocacy and Policy", "Legal Aid", "Juvenile Justice", "Decarceration", "Victim Services"],
      },
      {
        name: "Racial Equity and Civil Rights",
        description: "Organizing, policy, and the long fight for equal treatment.",
        subSectors: ["Policy and Advocacy", "Community Organizing", "DEI Consulting", "Voting Rights", "Anti-Discrimination Law", "Racial Justice Programs"],
      },
      {
        name: "Immigration and Refugee Services",
        description: "Legal services, resettlement, and helping people build a life here.",
        subSectors: ["Legal Services", "Resettlement", "Language Access", "Advocacy and Policy", "Integration Programs", "Asylum Support"],
      },
      {
        name: "Gender Equity and Women's Rights",
        description: "Safety, economic equality, and the rights still being fought for.",
        subSectors: ["Domestic Violence Services", "Economic Empowerment", "Reproductive Rights", "Leadership Development", "Policy and Advocacy", "Girls' Education"],
      },
      {
        name: "LGBTQ+ Rights and Services",
        description: "Expansion of services, legal advocacy, and community support.",
        subSectors: ["Youth Services", "Legal Advocacy", "Community Center Programs", "Healthcare Access", "Policy and Advocacy", "Housing and Safety"],
      },
      {
        name: "Disability Rights and Inclusion",
        description: "Access, independence, and the advocacy that makes both real.",
        subSectors: ["Advocacy and Policy", "Independent Living", "Assistive Technology", "Employment Support", "Inclusive Education", "Disability Justice"],
      },
    ],
  },
  {
    name: "Place & Planet",
    description: "Housing, climate, food, and the places people live.",
    sectors: [
      {
        name: "Climate and Environmental Justice",
        description: "Climate advocacy, clean energy, and the communities hit first and hardest.",
        subSectors: ["Climate Advocacy", "Clean Energy", "Environmental Policy", "Conservation", "Environmental Justice", "Sustainability Programs"],
      },
      {
        name: "Housing and Homelessness",
        description: "Affordable housing, homelessness services, and the right to a stable place to live.",
        subSectors: ["Affordable Housing Development", "Homelessness Services", "Housing Policy", "Tenant Rights", "Community Land Trusts"],
      },
      {
        name: "Food Security and Sustainable Agriculture",
        description: "Food access, nutrition, and the systems that feed communities.",
        subSectors: ["Food Banks and Pantries", "Urban Agriculture", "Food Policy", "Nutrition Programs", "Community Gardens", "Anti-Hunger Advocacy"],
      },
      {
        name: "Community and Urban Development",
        description: "Neighborhoods, organizing, and the places people share.",
        subSectors: ["Neighborhood Revitalization", "Community Organizing", "Urban Planning", "Infrastructure Advocacy", "Rural Development", "Participatory Budgeting"],
      },
      {
        name: "Disaster Relief and Emergency Response",
        description: "Preparedness, recovery, and showing up when things break.",
        subSectors: ["Emergency Management", "Disaster Recovery", "Climate Resilience", "Community Preparedness", "International Humanitarian Response", "Volunteer Coordination"],
      },
      {
        name: "Animal Welfare and Conservation",
        description: "Shelters, wildlife, and the habitats we share.",
        subSectors: ["Animal Shelters and Rescue", "Wildlife Conservation", "Advocacy and Policy", "Habitat Preservation", "Anti-Poaching", "Humane Education"],
      },
    ],
  },
  {
    name: "Civic Life & Global Impact",
    description: "Democracy, culture, and work that crosses borders.",
    sectors: [
      {
        name: "Civic Engagement and Democracy",
        description: "Voting, civic education, constructive dialogue, and keeping democracy a participatory sport.",
        subSectors: ["Voter Registration and Turnout", "Civic Education", "Community Organizing", "Election Administration", "Campaign Finance Reform", "Government Accountability"],
      },
      {
        name: "Arts and Culture for Social Change",
        description: "Art, culture, and creative work in service of community.",
        subSectors: ["Arts Access and Education", "Cultural Preservation", "Creative Placemaking", "Arts Advocacy", "Museum and Gallery Programs", "Community Arts"],
      },
      {
        name: "International Development and Global Health",
        description: "Humanitarian work, global health, and development across borders.",
        subSectors: ["Global Health Programs", "Economic Development", "Humanitarian Aid", "Capacity Building", "Water and Sanitation", "Women and Girls Globally"],
      },
    ],
  },
  {
    name: "Strategy & the Sector at Large",
    description: "The funders, consultants, and builders who work on the sector, not just in it.",
    sectors: [
      {
        name: "Social Impact Consulting",
        description: "Strategy, program design, and helping mission-driven organizations figure out what's next.",
        subSectors: ["Strategy Consulting", "Program Design", "Impact Measurement and Evaluation", "Corporate Social Impact", "Nonprofit Capacity Building"],
      },
      {
        name: "Philanthropy and Foundation Strategy",
        description: "Grantmaking, impact investing, and moving money where it matters.",
        subSectors: ["Program Officer and Grantmaking", "Foundation Strategy", "Impact Investing", "Nonprofit Capacity Building", "Community Foundation Work", "Donor Advising"],
      },
      {
        name: "Tech for Good and Digital Equity",
        description: "Civic tech, digital access, and technology built for public benefit.",
        subSectors: ["Digital Literacy", "Broadband Access", "Civic Technology", "AI Ethics and Policy", "Open Source for Nonprofits", "Data for Social Impact"],
      },
    ],
  },
]

// ─── Exploration mode ("I'm not sure yet") copy ──────────────────────────────
export const explorationMode = {
  cardTitle: "I\u2019m not sure yet.",
  cardDescription:
    "That\u2019s a real answer. Choose this and we\u2019ll build your trajectory around finding your direction, not guessing one.",
  cardLabel: "EXPLORATION MODE",
  headerTitle: "Not sure yet. That works.",
  headerDescription:
    "You don\u2019t need a sector to start. Tell us what you care about, and your trajectory will be built around finding the direction, not guessing one.",
  fieldLabel: "What problem do you care about?",
  fieldPlaceholder: "In your own words. Messy is fine.",
  fieldHelper: "No sector names needed. We\u2019ll map what you write to the areas it fits.",
}

// ─── Flat views and helpers (backward compatible) ─────────────────────────────

// "Other" remains available for people who know their sector but don't see it.
const OTHER: Sector = { name: "Other", description: "", subSectors: [] }

export const sectors: Sector[] = [...clusters.flatMap((c) => c.sectors), OTHER]

export const sectorNames = sectors.map((s) => s.name)

export const clusterNames = clusters.map((c) => c.name)

export function getSubSectors(sectorName: string): string[] {
  const sector = sectors.find((s) => s.name === sectorName)
  return sector?.subSectors ?? []
}

export function getCluster(clusterName: string): Cluster | undefined {
  return clusters.find((c) => c.name === clusterName)
}

export function getClusterForSector(sectorName: string): Cluster | undefined {
  return clusters.find((c) => c.sectors.some((s) => s.name === sectorName))
}
