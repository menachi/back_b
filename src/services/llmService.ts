// LLM Service for parsing free text search queries

export interface ParsedQuery {
    titleKeywords?: string[];
    yearRange?: {
        start?: number;
        end?: number;
    };
    genres?: string[];
    originalQuery: string;
}

class LlmService {
    async parseSearchQuery(query: string): Promise<ParsedQuery> {
        try {
            // TODO: Implement actual LLM API call
            // For now, return a simple parsed structure

            // Simple keyword extraction for demonstration
            const words = query.toLowerCase().split(/\s+/);

            // Extract potential year information
            const yearMatches = query.match(/\b(19|20)\d{2}\b/g);
            const years = yearMatches ? yearMatches.map(y => parseInt(y)) : [];

            // Basic genre detection
            const genres: string[] = [];
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

            const parsedQuery: ParsedQuery = {
                titleKeywords: words.filter(word =>
                    word.length > 2 &&
                    !['the', 'and', 'or', 'in', 'from', 'with', 'by', 'movies', 'film', 'films'].includes(word)
                ),
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
        } catch (error) {
            console.error('LLM service error:', error);
            // Return minimal parsed query on error
            return {
                titleKeywords: [query],
                originalQuery: query
            };
        }
    }
}

export default new LlmService();