import movieModel from "../model/moviesModel";
import { ParsedQuery } from "./llmService";

class SearchService {
    async searchMovies(parsedQuery: ParsedQuery): Promise<any[]> {
        try {
            // Build MongoDB query based on parsed query
            const mongoQuery: any = {};

            // Search by title keywords
            if (parsedQuery.titleKeywords && parsedQuery.titleKeywords.length > 0) {
                // Create regex patterns for title search
                const titleRegexes = parsedQuery.titleKeywords.map(keyword =>
                    new RegExp(keyword, 'i')
                );

                mongoQuery.$or = titleRegexes.map(regex => ({
                    title: { $regex: regex }
                }));
            }

            // Search by year range
            if (parsedQuery.yearRange) {
                const yearConditions: any = {};
                if (parsedQuery.yearRange.start) {
                    yearConditions.$gte = parsedQuery.yearRange.start;
                }
                if (parsedQuery.yearRange.end) {
                    yearConditions.$lte = parsedQuery.yearRange.end;
                }
                if (Object.keys(yearConditions).length > 0) {
                    mongoQuery.year = yearConditions;
                }
            }

            // TODO: Add genre search when genre field is added to movie model

            // Execute the search
            const results = await movieModel.find(mongoQuery).populate('creatredBy', 'email');

            return results;
        } catch (error) {
            console.error('Search service error:', error);
            throw new Error('Search operation failed');
        }
    }

    // Fallback simple text search
    async simpleTextSearch(query: string): Promise<any[]> {
        try {
            const results = await movieModel.find({
                title: { $regex: query, $options: 'i' }
            }).populate('creatredBy', 'email');

            return results;
        } catch (error) {
            console.error('Simple search error:', error);
            return [];
        }
    }
}

export default new SearchService();