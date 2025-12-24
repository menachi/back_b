import llmService from "../../services/llmService";

describe("LlmService - parseSearchQuery", () => {
    test("should return correct parsed query format", async () => {
        const testQuery = "sci-fi action movies from 2010";

        const result = await llmService.parseSearchQuery(testQuery);

        // Verify the response structure matches ParsedQuery interface
        expect(result).toHaveProperty("originalQuery", testQuery);
        expect(result).toHaveProperty("titleKeywords");
        expect(Array.isArray(result.titleKeywords)).toBe(true);

        // Verify it extracts keywords (movies/from are filtered out by current implementation)
        expect(result.titleKeywords).toContain("sci-fi");
        expect(result.titleKeywords).toContain("action");
        expect(result.titleKeywords).toContain("2010");

        // Verify year range extraction (when specific year is mentioned)
        expect(result).toHaveProperty("yearRange");
        expect(result.yearRange).toHaveProperty("start", 2010);
        expect(result.yearRange).toHaveProperty("end", 2010);

        // Verify genre detection
        expect(result).toHaveProperty("genres");
        expect(result.genres).toContain("sci-fi");
        expect(result.genres).toContain("action");
    });
});