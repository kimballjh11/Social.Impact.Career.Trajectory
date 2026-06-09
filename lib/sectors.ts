export type Sector = {
  name: string
  subSectors: string[]
}

export const sectors: Sector[] = [
  {
    name: "Education and Youth Development",
    subSectors: ["K-12 Education", "Higher Education Access", "Early Childhood", "After-School Programs", "Tutoring and Mentorship", "Education Policy"],
  },
  {
    name: "Public Health and Healthcare Access",
    subSectors: ["Community Health", "Global Health", "Maternal and Child Health", "Health Equity", "Public Health Policy", "Healthcare Access and Insurance"],
  },
  {
    name: "Housing and Homelessness",
    subSectors: ["Affordable Housing Development", "Homelessness Services", "Housing Policy", "Tenant Rights", "Community Land Trusts"],
  },
  {
    name: "Climate and Environmental Justice",
    subSectors: ["Climate Advocacy", "Clean Energy", "Environmental Policy", "Conservation", "Environmental Justice", "Sustainability Programs"],
  },
  {
    name: "Criminal Justice Reform",
    subSectors: ["Reentry and Reintegration", "Advocacy and Policy", "Legal Aid", "Juvenile Justice", "Decarceration", "Victim Services"],
  },
  {
    name: "Economic Mobility and Workforce Development",
    subSectors: ["Job Training and Placement", "Financial Literacy", "Entrepreneurship Support", "Poverty Alleviation", "Labor Rights", "Small Business Development"],
  },
  {
    name: "Food Security and Sustainable Agriculture",
    subSectors: ["Food Banks and Pantries", "Urban Agriculture", "Food Policy", "Nutrition Programs", "Community Gardens", "Anti-Hunger Advocacy"],
  },
  {
    name: "Immigration and Refugee Services",
    subSectors: ["Legal Services", "Resettlement", "Language Access", "Advocacy and Policy", "Integration Programs", "Asylum Support"],
  },
  {
    name: "Racial Equity and Civil Rights",
    subSectors: ["Policy and Advocacy", "Community Organizing", "DEI Consulting", "Voting Rights", "Anti-Discrimination Law", "Racial Justice Programs"],
  },
  {
    name: "Mental Health and Substance Use",
    subSectors: ["Crisis Intervention", "Community Mental Health", "Substance Use Recovery", "Policy and Advocacy", "Youth Mental Health", "Peer Support Programs"],
  },
  {
    name: "Disability Rights and Inclusion",
    subSectors: ["Advocacy and Policy", "Independent Living", "Assistive Technology", "Employment Support", "Inclusive Education", "Disability Justice"],
  },
  {
    name: "Gender Equity and Women's Rights",
    subSectors: ["Domestic Violence Services", "Economic Empowerment", "Reproductive Rights", "Leadership Development", "Policy and Advocacy", "Girls' Education"],
  },
  {
    name: "LGBTQ+ Rights and Services",
    subSectors: ["Youth Services", "Legal Advocacy", "Community Center Programs", "Healthcare Access", "Policy and Advocacy", "Housing and Safety"],
  },
  {
    name: "Community and Urban Development",
    subSectors: ["Neighborhood Revitalization", "Community Organizing", "Urban Planning", "Infrastructure Advocacy", "Rural Development", "Participatory Budgeting"],
  },
  {
    name: "International Development and Global Health",
    subSectors: ["Global Health Programs", "Economic Development", "Humanitarian Aid", "Capacity Building", "Water and Sanitation", "Women and Girls Globally"],
  },
  {
    name: "Arts and Culture for Social Change",
    subSectors: ["Arts Access and Education", "Cultural Preservation", "Creative Placemaking", "Arts Advocacy", "Museum and Gallery Programs", "Community Arts"],
  },
  {
    name: "Civic Engagement and Democracy",
    subSectors: ["Voter Registration and Turnout", "Civic Education", "Community Organizing", "Election Administration", "Campaign Finance Reform", "Government Accountability"],
  },
  {
    name: "Veterans and Military Families",
    subSectors: ["Reintegration Support", "Mental Health Services", "Housing and Employment", "Legal Aid", "Family Support Programs", "Advocacy and Policy"],
  },
  {
    name: "Elder Care and Aging",
    subSectors: ["Senior Services", "Aging in Place Programs", "Long-Term Care Advocacy", "Intergenerational Programs", "Elder Abuse Prevention", "Caregiver Support"],
  },
  {
    name: "Tech for Good and Digital Equity",
    subSectors: ["Digital Literacy", "Broadband Access", "Civic Technology", "AI Ethics and Policy", "Open Source for Nonprofits", "Data for Social Impact"],
  },
  {
    name: "Philanthropy and Foundation Strategy",
    subSectors: ["Program Officer and Grantmaking", "Foundation Strategy", "Impact Investing", "Nonprofit Capacity Building", "Community Foundation Work", "Donor Advising"],
  },
  {
    name: "Child Welfare and Family Services",
    subSectors: ["Foster Care and Adoption", "Family Preservation", "Early Intervention", "Child Abuse Prevention", "Child Policy and Advocacy", "Kinship Care"],
  },
  {
    name: "Disaster Relief and Emergency Response",
    subSectors: ["Emergency Management", "Disaster Recovery", "Climate Resilience", "Community Preparedness", "International Humanitarian Response", "Volunteer Coordination"],
  },
  {
    name: "Animal Welfare and Conservation",
    subSectors: ["Animal Shelters and Rescue", "Wildlife Conservation", "Advocacy and Policy", "Habitat Preservation", "Anti-Poaching", "Humane Education"],
  },
  {
    name: "Other",
    subSectors: [],
  },
]

export const sectorNames = sectors.map((s) => s.name)

export function getSubSectors(sectorName: string): string[] {
  const sector = sectors.find((s) => s.name === sectorName)
  return sector?.subSectors ?? []
}
