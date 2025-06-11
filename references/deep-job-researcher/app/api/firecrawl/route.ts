import { NextRequest, NextResponse } from "next/server";
import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";
import { resumeSchema, jobSchema } from "../../services/firecrawl";

// Server-side only - API key from environment
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

// Define request schemas
const extractProfileRequestSchema = z.object({
  url: z.string().url(),
});

const findJobsRequestSchema = z.object({
  profile: resumeSchema,
  maxResults: z.number().min(1).max(50).default(10),
  filters: z.object({
    workType: z.array(z.string()).optional(),
    location: z.string().nullable().optional(),
    salaryRange: z.string().nullable().optional(),
    experienceLevel: z.string().nullable().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (!FIRECRAWL_API_KEY) {
      return NextResponse.json(
        { error: "Firecrawl API key not configured on server" },
        { status: 500 }
      );
    }

    const firecrawl = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

    switch (action) {
      case "extractProfile": {
        const body = await request.json();
        const { url } = extractProfileRequestSchema.parse(body);

        try {
          const result = await firecrawl.extractSchema({
            url,
            schema: resumeSchema,
            mode: "llm",
          });

          if (!result.success) {
            throw new Error("Failed to extract profile data");
          }

          return NextResponse.json({ profile: result.data });
        } catch (error) {
          console.error("Error extracting profile:", error);
          return NextResponse.json(
            { error: "Failed to extract profile from URL" },
            { status: 500 }
          );
        }
      }

      case "findJobs": {
        const body = await request.json();
        const { profile, maxResults, filters } = findJobsRequestSchema.parse(body);

        try {
          // Build search query based on profile
          const skillsQuery = profile.skills?.join(" OR ") || "";
          const titleQuery = profile.title || "";
          const searchQuery = `(${titleQuery}) AND (${skillsQuery}) site:linkedin.com/jobs OR site:indeed.com OR site:glassdoor.com`;

          // Apply filters to the search query
          let enhancedQuery = searchQuery;
          if (filters?.location) {
            enhancedQuery += ` AND location:"${filters.location}"`;
          }
          if (filters?.experienceLevel) {
            enhancedQuery += ` AND experience:"${filters.experienceLevel}"`;
          }
          if (filters?.workType?.length) {
            const workTypeQuery = filters.workType.map(type => `"${type}"`).join(" OR ");
            enhancedQuery += ` AND (${workTypeQuery})`;
          }

          const results = await firecrawl.search({
            query: enhancedQuery,
            limit: maxResults,
          });

          if (!results.success || !results.data) {
            throw new Error("Failed to search for jobs");
          }

          // Process results into job format
          const jobs = results.data.map((result: any) => ({
            title: result.title || "Unknown Position",
            company: result.company || "Unknown Company",
            description: result.description || result.content || "",
            location: result.location || "Not specified",
            url: result.url || "",
            requirements: [],
            salaryRange: filters?.salaryRange || null,
          }));

          // Generate analysis
          const analysis = `Based on your profile as a ${profile.title || "professional"} with skills in ${
            profile.skills?.slice(0, 3).join(", ") || "various areas"
          }, I found ${jobs.length} potential job matches. The search focused on positions that align with your experience and the filters you specified.`;

          return NextResponse.json({ jobs, analysis });
        } catch (error) {
          console.error("Error finding jobs:", error);
          return NextResponse.json(
            { error: "Failed to find job matches" },
            { status: 500 }
          );
        }
      }

      default:
        return NextResponse.json(
          { error: "Invalid action parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Firecrawl API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}