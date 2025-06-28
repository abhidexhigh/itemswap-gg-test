// lib/patchParser.js

/**
 * Parses patch note text provided as a single-line string and returns a JSON object in the expected format.
 *
 * Expected input example:
 * "v1.3.0 Winter Festival Update [December 10, 2024] Highlights: - Limited-time Winter Festival event - New Frost magic tree - Holiday-themed items and quests Categories: * Winter Festival - Added Winter Festival event (running until January 15) - Added 5 festival-exclusive quests - Added Snow Fox companion with unique abilities - Added festival currency and vendor with exclusive items - Transformed main cities with winter decorations and events * New Magic - Added complete Frost magic skill tree with 15 abilities - Added 8 craftable Frost-enchanted weapons - Added Frost resistance stat to appropriate armor - New frost elemental enemies throughout the world * Other Changes - Rebalanced all magic damage scaling - Added 3 new cooking recipes with winter ingredients - Updated world map with winter visual effects - Added snowball fight mini-game in main towns"
 *
 * @param {string} input - The patch note text.
 * @returns {Object} The parsed patch notes as JSON.
 */
export function parsePatchNotes(input) {
  // Remove extra whitespace at the beginning/end.
  const trimmedInput = input.trim();

  // --- Extract header: version and title ---
  // The header is the part before the first "[".
  const headerRegex = /^([^[]+)/;
  const headerMatch = trimmedInput.match(headerRegex);
  let version = "";
  let title = "";
  if (headerMatch) {
    const header = headerMatch[1].trim();
    // Assume the first token is the version, and the remainder is the title.
    const headerParts = header.split(" ");
    version = headerParts[0];
    title = headerParts.slice(1).join(" ");
  }

  // --- Extract date ---
  // The date is within square brackets.
  const dateRegex = /\[([^\]]+)\]/;
  const dateMatch = trimmedInput.match(dateRegex);
  const date = dateMatch ? dateMatch[1].trim() : "";

  // --- Extract Highlights ---
  // Get the substring between "Highlights:" and "Categories:".
  let highlights = [];
  const highlightsStart = trimmedInput.indexOf("Highlights:");
  const categoriesStart = trimmedInput.indexOf("Categories:");
  if (highlightsStart !== -1 && categoriesStart !== -1) {
    const highlightsSection = trimmedInput
      .substring(highlightsStart + "Highlights:".length, categoriesStart)
      .trim();
    // Highlights are separated by " - " tokens.
    // Split and filter out any empty strings.
    highlights = highlightsSection
      .split(" - ")
      .map((item) => item.trim())
      .filter((item) => item);
  }

  // --- Extract Categories and their changes ---
  let categories = [];
  if (categoriesStart !== -1) {
    const categoriesSection = trimmedInput
      .substring(categoriesStart + "Categories:".length)
      .trim();
    // Categories are separated by "*" characters.
    const categoryChunks = categoriesSection
      .split("*")
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk);
    categories = categoryChunks.map((chunk) => {
      // In each chunk, the first part (up to the first " - ") is the category name.
      // The subsequent parts are the change items.
      const parts = chunk
        .split(" - ")
        .map((part) => part.trim())
        .filter((part) => part);
      const name = parts.shift() || "";
      const changes = parts;
      return { name, changes };
    });
  }

  return {
    version,
    date,
    title,
    latest: false,
    highlights,
    categories,
  };
}
