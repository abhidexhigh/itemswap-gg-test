import { NextResponse } from "next/server";
import cache from "@/utils/cache";

const JSDELIVR_BASE_URL =
  "https://cdn.jsdelivr.net/gh/abhidexhigh/Patch-Notes@main/patch-notes";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Validate patch note structure
function validatePatchNote(data) {
  const requiredFields = ["version", "title", "highlights", "categories"];
  const requiredCategoryFields = ["name", "changes"];

  // Check required fields
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate highlights array
  if (!Array.isArray(data.highlights)) {
    throw new Error("Highlights must be an array");
  }

  // Validate categories
  if (!Array.isArray(data.categories)) {
    throw new Error("Categories must be an array");
  }

  // Validate each category
  data.categories.forEach((category, index) => {
    for (const field of requiredCategoryFields) {
      if (!category[field]) {
        throw new Error(
          `Category ${index} is missing required field: ${field}`,
        );
      }
    }
    if (!Array.isArray(category.changes)) {
      throw new Error(`Category ${index} changes must be an array`);
    }
  });
}

export async function GET() {
  // Check cache first
  const cachedPatchNotes = cache.get("patchNotes");
  if (cachedPatchNotes) {
    return NextResponse.json({
      success: true,
      patchNotes: cachedPatchNotes,
    });
  }

  try {
    // Check if GitHub token is available
    if (!process.env.GITHUB_TOKEN) {
      console.error("GitHub token is not configured");
      return NextResponse.json(
        { success: false, error: "GitHub token is not configured" },
        { status: 500 },
      );
    }

    // First, fetch the list of files from GitHub API (this is still needed to get the file list)
    const githubResponse = await fetch(
      "https://api.github.com/repos/abhidexhigh/Patch-Notes/contents/patch-notes",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
        cache: "no-store",
        next: { revalidate: 0 },
      },
    );

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error("GitHub API error:", {
        status: githubResponse.status,
        statusText: githubResponse.statusText,
        body: errorText,
      });
      throw new Error(
        `GitHub API error: ${githubResponse.status} ${githubResponse.statusText}`,
      );
    }

    const files = await githubResponse.json();
    console.log(`Found ${files.length} files in the repository`);

    // Filter for .json files and fetch their contents using jsDelivr
    const patchNotes = await Promise.all(
      files
        .filter((file) => file.name.endsWith(".json"))
        .map(async (file) => {
          try {
            const jsDelivrUrl = `${JSDELIVR_BASE_URL}/${file.name}`;
            console.log(`Fetching from jsDelivr: ${jsDelivrUrl}`);

            const contentResponse = await fetch(jsDelivrUrl, {
              cache: "no-store",
              next: { revalidate: 0 },
            });

            if (!contentResponse.ok) {
              const errorText = await contentResponse.text();
              console.error(`jsDelivr error for ${file.name}:`, {
                status: contentResponse.status,
                statusText: contentResponse.statusText,
                body: errorText,
              });
              throw new Error(
                `Failed to fetch content for ${file.name}: ${contentResponse.status} ${contentResponse.statusText}`,
              );
            }

            const content = await contentResponse.json();

            // Validate the patch note structure
            validatePatchNote(content);

            // Extract date from filename (format: YYYY-MM-DD-patch.json)
            const [date] = file.name.split("-patch.json");

            return {
              ...content,
              date,
              latest: false, // We'll set this based on version comparison
            };
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            return null;
          }
        }),
    );

    // Filter out any failed patch notes
    const validPatchNotes = patchNotes.filter((note) => note !== null);
    console.log(`Successfully processed ${validPatchNotes.length} patch notes`);

    // Sort by date in descending order
    validPatchNotes.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Mark the most recent as latest
    if (validPatchNotes.length > 0) {
      validPatchNotes[0].latest = true;
    }

    // Cache the patch notes before returning
    cache.set("patchNotes", validPatchNotes);

    return NextResponse.json({
      success: true,
      patchNotes: validPatchNotes,
    });
  } catch (error) {
    console.error("Error fetching patch notes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch patch notes" },
      { status: 500 },
    );
  }
}
