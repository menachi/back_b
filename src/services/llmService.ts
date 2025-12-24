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
    private readonly baseUrl: string;
    private readonly credentials: string;

    constructor() {
        this.baseUrl = process.env.LLM_SERVICE_URL || 'http://10.10.248.41';
        const username = process.env.LLM_SERVICE_USERNAME || 'student1';
        const password = process.env.LLM_SERVICE_PASSWORD || 'pass123';
        this.credentials = Buffer.from(`${username}:${password}`).toString('base64');
    }

    async parseSearchQuery(query: string): Promise<ParsedQuery> {
        try {
            // Create structured prompt for movie query parsing
            const prompt = `Parse this movie search query and extract the following information as JSON:

Query: "${query}"

Extract:
- titleKeywords: array of relevant keywords for movie titles (exclude common words like 'movies', 'films', 'the', 'and')
- yearRange: object with start and end years if mentioned (e.g., "2010s" = {start: 2010, end: 2019}, "from 1990" = {start: 1990})
- genres: array of movie genres if mentioned (action, comedy, drama, sci-fi, horror, thriller, romance, etc.)

Return only valid JSON in this exact format:
{
  "titleKeywords": ["keyword1", "keyword2"],
  "yearRange": {"start": 2010, "end": 2019},
  "genres": ["genre1", "genre2"]
}

If no information is found for a field, omit it from the JSON.`;

            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${this.credentials}`
                },
                body: JSON.stringify({
                    model: 'llama3.1:8b',
                    prompt: prompt,
                    format: 'json',
                    stream: false,
                    options: {
                        temperature: 0.2,
                        top_p: 0.9,
                        num_predict: 500
                    }
                }),
                // 30 second timeout
                signal: AbortSignal.timeout(30000)
            });

            if (!response.ok) {
                throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.response) {
                throw new Error('No response from LLM API');
            }

            // Parse the LLM's JSON response
            let llmParsed;
            try {
                llmParsed = JSON.parse(data.response);
            } catch (parseError) {
                console.warn('Failed to parse LLM JSON response, falling back to simple parsing');
                return this.fallbackParsing(query);
            }

            // Map LLM response to our ParsedQuery interface
            const parsedQuery: ParsedQuery = {
                originalQuery: query
            };

            if (llmParsed.titleKeywords && Array.isArray(llmParsed.titleKeywords)) {
                parsedQuery.titleKeywords = llmParsed.titleKeywords;
            }

            if (llmParsed.yearRange && typeof llmParsed.yearRange === 'object') {
                parsedQuery.yearRange = {
                    start: llmParsed.yearRange.start,
                    end: llmParsed.yearRange.end
                };
            }

            if (llmParsed.genres && Array.isArray(llmParsed.genres)) {
                parsedQuery.genres = llmParsed.genres;
            }

            return parsedQuery;

        } catch (error) {
            console.error('LLM service error:', error);
            // Fallback to simple parsing on any error
            return this.fallbackParsing(query);
        }
    }

    private fallbackParsing(query: string): ParsedQuery {
        // Simple keyword extraction for fallback
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
    }
}

export default new LlmService();