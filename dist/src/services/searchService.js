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
const moviesModel_1 = __importDefault(require("../model/moviesModel"));
class SearchService {
    searchMovies(parsedQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Build MongoDB query based on parsed query
                const mongoQuery = {};
                // Search by title keywords
                if (parsedQuery.titleKeywords && parsedQuery.titleKeywords.length > 0) {
                    // Create regex patterns for title search
                    const titleRegexes = parsedQuery.titleKeywords.map(keyword => new RegExp(keyword, 'i'));
                    mongoQuery.$or = titleRegexes.map(regex => ({
                        title: { $regex: regex }
                    }));
                }
                // Search by year range
                if (parsedQuery.yearRange) {
                    const yearConditions = {};
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
                const results = yield moviesModel_1.default.find(mongoQuery).populate('creatredBy', 'email');
                return results;
            }
            catch (error) {
                console.error('Search service error:', error);
                throw new Error('Search operation failed');
            }
        });
    }
    // Fallback simple text search
    simpleTextSearch(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield moviesModel_1.default.find({
                    title: { $regex: query, $options: 'i' }
                }).populate('creatredBy', 'email');
                return results;
            }
            catch (error) {
                console.error('Simple search error:', error);
                return [];
            }
        });
    }
}
exports.default = new SearchService();
//# sourceMappingURL=searchService.js.map