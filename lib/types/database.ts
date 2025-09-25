// Database types for Open Market Research platform
// Based on the JSON schema defined in README.md

export interface Market {
  countries: string[];
  cities: string[];
}

export interface Contributor {
  name: string;
  profile_url?: string;
  email?: string;
}

export interface Methodology {
  type:
    | "interview"
    | "survey"
    | "focus_group"
    | "observation"
    | "mixed_methods"
    | "other";
  sample_size: number;
  collection_start: string; // ISO date string
  collection_end: string; // ISO date string
  additional_notes?: string;
}

export interface Links {
  raw_data?: string;
  report?: string;
  landing_page?: string;
  presentation?: string;
  other?: string;
}

export interface Study {
  id: string;
  title: string;
  summary: string;
  published_date: string; // ISO date string
  market: Market;
  target_audience: string[]; // Array of audience types
  contributors: Contributor[];
  methodology: Methodology;
  top_findings: string[];
  insights: string[];
  links: Links;
  license:
    | "CC-BY-4.0"
    | "CC-BY-SA-4.0"
    | "CC-BY-NC-4.0"
    | "MIT"
    | "Apache-2.0"
    | "other";
  tags: string[];
  verification_status: "pending" | "verified" | "rejected" | "needs_revision";
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  created_by: string; // User ID
  raw_data?: string; // Raw text/data submitted by user
  industry?: string; // Industry category
  company_size?: "startup" | "small" | "medium" | "large" | "enterprise";
  budget_range?:
    | "under_10k"
    | "10k_50k"
    | "50k_100k"
    | "100k_500k"
    | "over_500k";
}

export interface User {
  id: string;
  email: string;
  name?: string;
  profile_url?: string;
  bio?: string;
  company?: string;
  role?: string;
  created_at: string;
  updated_at: string;
  submission_count?: number;
}

// Form types for submission
export interface StudySubmission {
  // Basic Info
  title: string;
  summary: string;

  // Market Info
  countries: string[];
  cities: string[];
  industry: string;

  // Target Audience
  target_audience: string[];

  // Contributors
  contributors: Omit<Contributor, "email">[];

  // Methodology
  methodology: Omit<Methodology, "collection_start" | "collection_end"> & {
    collection_start: Date;
    collection_end: Date;
  };

  // Findings
  top_findings: string[];
  insights: string[];

  // Links
  links: Links;

  // Metadata
  license: Study["license"];
  tags: string[];
  raw_data: string;
  company_size?: Study["company_size"];
  budget_range?: Study["budget_range"];
}

// Dropdown options for consistent data entry
export const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bangladesh",
  "Belarus",
  "Belgium",
  "Brazil",
  "Bulgaria",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Croatia",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Estonia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Latvia",
  "Lebanon",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
];

export const INDUSTRIES = [
  "Agriculture",
  "Automotive",
  "Banking & Finance",
  "Construction",
  "Education",
  "Energy",
  "Entertainment",
  "Food & Beverage",
  "Healthcare",
  "Hospitality",
  "Insurance",
  "Manufacturing",
  "Media",
  "Real Estate",
  "Retail",
  "Technology",
  "Telecommunications",
  "Transportation",
  "Travel",
  "Other",
];

export const TARGET_AUDIENCES = [
  "real_estate_agent",
  "small_business_owner",
  "startup_founder",
  "product_manager",
  "marketing_manager",
  "sales_representative",
  "customer_service_rep",
  "developer",
  "designer",
  "consultant",
  "investor",
  "student",
  "researcher",
  "freelancer",
  "enterprise_executive",
  "non_profit_worker",
  "government_employee",
  "other",
];

export const METHODOLOGY_TYPES = [
  "interview",
  "survey",
  "focus_group",
  "observation",
  "mixed_methods",
  "other",
] as const;

export const COMPANY_SIZES = [
  "startup",
  "small",
  "medium",
  "large",
  "enterprise",
] as const;

export const BUDGET_RANGES = [
  "under_10k",
  "10k_50k",
  "50k_100k",
  "100k_500k",
  "over_500k",
] as const;

export const LICENSES = [
  "CC-BY-4.0",
  "CC-BY-SA-4.0",
  "CC-BY-NC-4.0",
  "MIT",
  "Apache-2.0",
  "other",
] as const;

export const VERIFICATION_STATUSES = [
  "pending",
  "verified",
  "rejected",
  "needs_revision",
] as const;

// Common tags for suggestions
export const COMMON_TAGS = [
  "user-research",
  "market-validation",
  "customer-interviews",
  "survey-data",
  "competitive-analysis",
  "pricing-research",
  "product-market-fit",
  "user-experience",
  "customer-journey",
  "pain-points",
  "opportunities",
  "trends",
  "demographics",
  "behavioral-insights",
  "quantitative",
  "qualitative",
  "mixed-methods",
];

// Form validation schemas
export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
}

export const SUBMISSION_STEPS: FormStep[] = [
  {
    id: "basic-info",
    title: "Basic Information",
    description: "Tell us about your research study",
    fields: ["title", "summary", "industry"],
  },
  {
    id: "market",
    title: "Market & Location",
    description: "Where was this research conducted?",
    fields: ["countries", "cities"],
  },
  {
    id: "audience",
    title: "Target Audience",
    description: "Who did you research?",
    fields: ["target_audience"],
  },
  {
    id: "methodology",
    title: "Research Methodology",
    description: "How did you conduct this research?",
    fields: ["methodology"],
  },
  {
    id: "findings",
    title: "Key Findings",
    description: "What did you discover?",
    fields: ["top_findings", "insights"],
  },
  {
    id: "metadata",
    title: "Additional Information",
    description: "Links, tags, and other details",
    fields: ["links", "tags", "license", "raw_data"],
  },
];
