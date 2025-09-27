import { GitHubModelsClient } from "./githubModelsClient";
import { StudySubmission } from "@/lib/types/database";

export interface RawResearchData {
  title?: string;
  content: string;
  metadata?: {
    author?: string;
    date?: string;
    source?: string;
    [key: string]: unknown;
  };
}

export interface StructuringResult {
  success: boolean;
  data?: Partial<StudySubmission>;
  error?: string;
  confidence?: number;
}

export class ResearchStructurer {
  private llmClient: GitHubModelsClient;

  constructor() {
    this.llmClient = new GitHubModelsClient();
  }

  /**
   * Check if the LLM service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      return await this.llmClient.checkConnection();
    } catch (error) {
      console.error("ResearchStructurer: LLM service unavailable:", error);
      return false;
    }
  }

  /**
   * Structure raw research data into our standardized format
   */
  async structureResearch(
    rawData: RawResearchData
  ): Promise<StructuringResult> {
    try {
      if (!(await this.isAvailable())) {
        return {
          success: false,
          error: "LLM service is not available. Please try again later.",
        };
      }

      const prompt = this.buildStructuringPrompt(rawData);
      const response = await this.llmClient.generateText(prompt, {
        temperature: 0.3, // Lower temperature for more consistent structuring
        maxTokens: 2000,
      });

      const structuredData = this.parseLLMResponse(response);

      return {
        success: true,
        data: structuredData,
        confidence: this.calculateConfidence(structuredData),
      };
    } catch (error) {
      console.error("ResearchStructurer: Error structuring research:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to structure research data",
      };
    }
  }

  /**
   * Build a comprehensive prompt for the LLM to structure research data
   */
  private buildStructuringPrompt(rawData: RawResearchData): string {
    return `You are an expert market research analyst. Your task is to structure raw research data into a standardized JSON format for the Open Market Research platform.

RAW RESEARCH DATA:
Title: ${rawData.title || "Not provided"}
Content: ${rawData.content}
Metadata: ${JSON.stringify(rawData.metadata || {}, null, 2)}

Please analyze this research and extract the following information in JSON format. If information is not available, use null or empty arrays as appropriate.

REQUIRED OUTPUT FORMAT (return ONLY valid JSON):
{
  "title": "Clear, descriptive title of the research study",
  "summary": "2-3 sentence summary of the research",
  "industry": "Primary industry category (e.g., 'Technology', 'Healthcare', 'Finance')",
  "countries": ["List of countries where research was conducted"],
  "cities": ["List of cities where research was conducted"],
  "target_audience": ["List of target audience segments (e.g., 'startups', 'enterprises', 'consumers')"],
  "contributors": [{"name": "Author name", "profile_url": "Optional profile URL"}],
  "methodology": {
    "type": "Research method (e.g., 'survey', 'interview', 'focus_group', 'observation')",
    "sample_size": "Number of participants (as number)",
    "collection_start": "Start date in YYYY-MM-DD format",
    "collection_end": "End date in YYYY-MM-DD format",
    "additional_notes": "Any additional methodology details"
  },
  "top_findings": [
    "Key finding 1",
    "Key finding 2",
    "Key finding 3"
  ],
  "insights": [
    "Strategic insight 1",
    "Strategic insight 2"
  ],
  "links": {
    "landing_page": "Optional project landing page URL",
    "research_paper": "Optional research paper URL",
    "data_source": "Optional raw data source URL"
  },
  "license": "CC-BY-4.0",
  "tags": ["Relevant tags for categorization"],
  "raw_data": "Original raw research content",
  "company_size": "Target company size (startup/small/medium/large/enterprise)",
  "budget_range": "Budget range (under_10k/10k_50k/50k_100k/100k_500k/over_500k)"
}

GUIDELINES:
1. Extract factual information only - do not make assumptions
2. Use clear, professional language
3. Ensure all dates are in YYYY-MM-DD format
4. Make findings actionable and specific
5. Choose appropriate tags for discoverability
6. If information is unclear, use your best judgment but mark with low confidence
7. Ensure the JSON is valid and complete

Return ONLY the JSON object, no additional text or formatting.`;
  }

  /**
   * Parse the LLM response and validate the structure
   */
  private parseLLMResponse(response: string): Partial<StudySubmission> {
    try {
      // Clean the response to extract JSON
      const cleanedResponse = response
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(cleanedResponse) as Record<string, unknown>;

      // Validate and clean the parsed data
      return this.validateAndCleanData(parsed);
    } catch (error) {
      console.error("ResearchStructurer: Failed to parse LLM response:", error);
      throw new Error("Failed to parse structured data from LLM response");
    }
  }

  /**
   * Validate and clean the structured data
   */
  private validateAndCleanData(
    data: Record<string, unknown>
  ): Partial<StudySubmission> {
    const cleaned: Partial<StudySubmission> = {};

    // Basic info
    if (data.title && typeof data.title === "string") {
      cleaned.title = data.title.trim();
    }
    if (data.summary && typeof data.summary === "string") {
      cleaned.summary = data.summary.trim();
    }
    if (data.industry && typeof data.industry === "string") {
      cleaned.industry = data.industry.trim();
    }

    // Location data
    if (Array.isArray(data.countries)) {
      cleaned.countries = data.countries
        .filter((c) => typeof c === "string")
        .map((c) => c.trim());
    }
    if (Array.isArray(data.cities)) {
      cleaned.cities = data.cities
        .filter((c) => typeof c === "string")
        .map((c) => c.trim());
    }

    // Target audience
    if (Array.isArray(data.target_audience)) {
      cleaned.target_audience = data.target_audience
        .filter((a) => typeof a === "string")
        .map((a) => a.trim());
    }

    // Contributors
    if (Array.isArray(data.contributors)) {
      cleaned.contributors = data.contributors
        .filter((c) => c && typeof c === "object" && c.name)
        .map((c) => ({
          name: c.name.trim(),
          profile_url: c.profile_url ? c.profile_url.trim() : undefined,
        }));
    }

    // Methodology
    if (data.methodology && typeof data.methodology === "object") {
      const methodology = data.methodology as Record<string, unknown>;
      cleaned.methodology = {
        type:
          (methodology.type as
            | "interview"
            | "survey"
            | "focus_group"
            | "observation"
            | "mixed_methods"
            | "other") || "other",
        sample_size:
          typeof methodology.sample_size === "number"
            ? methodology.sample_size
            : 0,
        collection_start: methodology.collection_start
          ? new Date(methodology.collection_start as string)
          : new Date(),
        collection_end: methodology.collection_end
          ? new Date(methodology.collection_end as string)
          : new Date(),
        additional_notes: (methodology.additional_notes as string) || undefined,
      };
    }

    // Findings and insights
    if (Array.isArray(data.top_findings)) {
      cleaned.top_findings = data.top_findings
        .filter((f) => typeof f === "string")
        .map((f) => f.trim());
    }
    if (Array.isArray(data.insights)) {
      cleaned.insights = data.insights
        .filter((i) => typeof i === "string")
        .map((i) => i.trim());
    }

    // Links
    if (data.links && typeof data.links === "object") {
      const links = data.links as Record<string, unknown>;
      cleaned.links = {
        landing_page: (links.landing_page as string) || undefined,
        report: (links.report as string) || undefined,
        raw_data: (links.raw_data as string) || undefined,
      };
    }

    // Metadata
    if (data.license && typeof data.license === "string") {
      cleaned.license = data.license as StudySubmission["license"];
    }
    if (Array.isArray(data.tags)) {
      cleaned.tags = data.tags
        .filter((t) => typeof t === "string")
        .map((t) => t.trim());
    }
    if (data.raw_data && typeof data.raw_data === "string") {
      cleaned.raw_data = data.raw_data.trim();
    }
    if (data.company_size && typeof data.company_size === "string") {
      cleaned.company_size =
        data.company_size as StudySubmission["company_size"];
    }
    if (data.budget_range && typeof data.budget_range === "string") {
      cleaned.budget_range =
        data.budget_range as StudySubmission["budget_range"];
    }

    return cleaned;
  }

  /**
   * Calculate confidence score based on data completeness
   */
  private calculateConfidence(data: Partial<StudySubmission>): number {
    const requiredFields = [
      "title",
      "summary",
      "industry",
      "countries",
      "target_audience",
      "methodology",
      "top_findings",
      "tags",
    ];

    const presentFields = requiredFields.filter((field) => {
      const value = data[field as keyof StudySubmission];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    });

    return Math.round((presentFields.length / requiredFields.length) * 100);
  }

  /**
   * Get suggested improvements for structured data
   */
  async getImprovementSuggestions(
    data: Partial<StudySubmission>
  ): Promise<string[]> {
    try {
      const prompt = `Review this structured research data and suggest 3-5 specific improvements to make it more valuable for market research:

${JSON.stringify(data, null, 2)}

Provide specific, actionable suggestions for improving the research quality, clarity, or completeness.`;

      const response = await this.llmClient.generateText(prompt, {
        temperature: 0.4,
        maxTokens: 500,
      });

      // Parse suggestions from response
      const suggestions = response
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((line) => line.length > 10);

      return suggestions.slice(0, 5); // Limit to 5 suggestions
    } catch (error) {
      console.error(
        "ResearchStructurer: Error getting improvement suggestions:",
        error
      );
      return ["Unable to generate suggestions at this time"];
    }
  }
}

// Export a singleton instance
export const researchStructurer = new ResearchStructurer();
