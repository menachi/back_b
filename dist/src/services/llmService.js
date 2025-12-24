"use strict";
// LLM Service for parsing free text search queries
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class LlmService {
    parseSearchQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // TODO: Implement actual LLM API call
                // For now, return a simple parsed structure
                // Simple keyword extraction for demonstration
                const words = query.toLowerCase().split(/\s+/);
                // Extract potential year information
                const yearMatches = query.match(/\b(19|20)\d{2}\b/g);
                const years = yearMatches ? yearMatches.map(y => parseInt(y)) : [];
                // Basic genre detection
                const genres = [];
                if (query.toLowerCase().includes('sci-fi') || query.toLowerCase().includes('science fiction')) {
                    genres.push('sci-fi');
                }
                if (query.toLowerCase().includes('action')) {
                    genres.push('action');
                }
                if (query.toLowerCase().includes('comedy')) {
                    genres.push('comedy');
                }
                if (query.toLowerCase().includes('drama')) {
                    genres.push('drama');
                }
                const parsedQuery = {
                    titleKeywords: words.filter(word => word.length > 2 &&
                        !['the', 'and', 'or', 'in', 'from', 'with', 'by', 'movies', 'film', 'films'].includes(word)),
                    originalQuery: query
                };
                if (years.length > 0) {
                    parsedQuery.yearRange = {
                        start: Math.min(...years),
                        end: Math.max(...years)
                    };
                }
                if (genres.length > 0) {
                    parsedQuery.genres = genres;
                }
                return parsedQuery;
            }
            catch (error) {
                console.error('LLM service error:', error);
                // Return minimal parsed query on error
                return {
                    titleKeywords: [query],
                    originalQuery: query
                };
            }
        });
    }
}
exports.default = new LlmService();
//# sourceMappingURL=llmService.js.map