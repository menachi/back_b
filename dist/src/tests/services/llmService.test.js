"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const llmService_1 = __importDefault(require("../../services/llmService"));
describe("LlmService - parseSearchQuery", () => {
    test("should return correct parsed query format", () => __awaiter(void 0, void 0, void 0, function* () {
        const testQuery = "sci-fi action movies from 2010";
        const result = yield llmService_1.default.parseSearchQuery(testQuery);
        // Verify the response structure matches ParsedQuery interface
        expect(result).toHaveProperty("originalQuery", testQuery);
        expect(result).toHaveProperty("titleKeywords");
        expect(Array.isArray(result.titleKeywords)).toBe(true);
        // Verify it extracts keywords (movies/from are filtered out, 2010 should be in yearRange)
        expect(result.titleKeywords).toContain("sci-fi");
        expect(result.titleKeywords).toContain("action");
        // 2010 should NOT be in titleKeywords as it's a year, not a title keyword
        // Verify year range extraction ("from 2010" means start from 2010)
        expect(result).toHaveProperty("yearRange");
        expect(result.yearRange).toHaveProperty("start", 2010);
        // "from 2010" doesn't specify an end year, so it might not have one
        // Verify genre detection (LLM might extract genres separately from titleKeywords)
        if (result.genres) {
            expect(result.genres.length).toBeGreaterThan(0);
            // The LLM might identify sci-fi and action as genres
        }
        // The key test is that we get structured output with the originalQuery preserved
        expect(result.originalQuery).toBe(testQuery);
    }));
});
//# sourceMappingURL=llmService.test.js.map