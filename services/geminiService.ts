import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeWebsite = async (url: string): Promise<string> => {
  try {
    const prompt = `
      You are an expert website-analysis AI. Visit the following website and extract every possible detail without missing anything:
      ${url}

      Your task is to thoroughly scan and analyze all visible pages, sections, menus, headers, footers, internal links, and any content found on the site and its location-specific subpages. Then produce a full, structured, comprehensive summary in Markdown format.

      Use Google Search Grounding to verify details like current menus, hours, and addresses if needed.

      Include all of the following in your output:

      1. Business Overview
      - Business name
      - Type of business
      - Locations
      - History & heritage
      - Mission, brand identity, core themes

      2. All Locations Details
      - Address
      - Contact numbers
      - Hours
      - Special services
      - Dress code
      - Parking info
      - Reservation details
      - Any unique selling points

      3. Menus & Food Items
      - All food categories (seafood, steaks, brunch, cocktails, wine list, specials, etc.)
      - Signature dishes
      - Seasonal or limited menus
      - Any descriptions provided

      4. Services & Features
      - Reservations system
      - Private dining details
      - Event hosting
      - Gift cards
      - Newsletter
      - Jobs/Career opportunities
      - Social media pages

      5. Design & Branding Elements
      - Style or theme of photography
      - Colors and visuals
      - Tone of writing
      - Typography cues (if identifiable)

      6. Technical Information
      - Website navigation structure
      - Footer links
      - Forms and required fields
      - Any third-party integrations (e.g., OpenTable, BentoBox, etc.)

      7. Full Clean Summary
      Create a final full report with:
      - Bullet points
      - Organized sections
      - Clear headings
      - No missing information

      Format the response as clean, structured Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Low temperature for factual extraction
      },
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Failed to analyze the website. Please check the URL and try again.");
  }
};
