import { Request, Response } from "express";
import MoviesController from "../../controllers/moviesController";
import { AuthRequest } from "../../middleware/authMiddleware";

// Mock the services
jest.mock("../../services/llmService", () => ({
    parseSearchQuery: jest.fn()
}));

jest.mock("../../services/searchService", () => ({
    searchMovies: jest.fn(),
    simpleTextSearch: jest.fn()
}));

import llmService from "../../services/llmService";
import searchService from "../../services/searchService";

const mockLlmService = llmService as jest.Mocked<typeof llmService>;
const mockSearchService = searchService as jest.Mocked<typeof searchService>;

describe("MoviesController - searchMovies Unit Tests", () => {
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });

        mockRequest = {
            user: { _id: "user123" },
            body: {}
        };

        mockResponse = {
            status: mockStatus,
            json: mockJson
        };

        // Setup default mock responses
        mockLlmService.parseSearchQuery.mockResolvedValue({
            titleKeywords: ["test"],
            originalQuery: "test query"
        });

        mockSearchService.searchMovies.mockResolvedValue([]);
        mockSearchService.simpleTextSearch.mockResolvedValue([]);
    });

    describe("Input Validation", () => {
        test("should return 400 when query field is missing", async () => {
            mockRequest.body = {};

            await MoviesController.searchMovies(mockRequest as AuthRequest, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "query field is required" });
        });

        test("should return 400 when query is null", async () => {
            mockRequest.body = { query: null };

            await MoviesController.searchMovies(mockRequest as AuthRequest, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "query field is required" });
        });

        test("should return 400 when query is not a string", async () => {
            mockRequest.body = { query: 123 };

            await MoviesController.searchMovies(mockRequest as AuthRequest, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "query must be a string" });
        });

        test("should return 400 when query is empty string", async () => {
            mockRequest.body = { query: "" };

            await MoviesController.searchMovies(mockRequest as AuthRequest, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "query cannot be empty" });
        });
    });

    describe("Successful Search Flow", () => {
        test("should return 200 with mocked search results", async () => {
            const testQuery = "sci-fi movies from 2010";
            mockRequest.body = { query: testQuery };

            await MoviesController.searchMovies(mockRequest as AuthRequest, mockResponse as Response);

            expect(mockLlmService.parseSearchQuery).toHaveBeenCalledWith(testQuery);
            expect(mockSearchService.searchMovies).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                query: testQuery,
                results: []
            });
        });

        test("should handle search service errors with fallback", async () => {
            const testQuery = "test query";
            mockRequest.body = { query: testQuery };

            // Mock search service to throw error
            mockSearchService.searchMovies.mockRejectedValue(new Error("Search failed"));
            mockSearchService.simpleTextSearch.mockResolvedValue([]);

            await MoviesController.searchMovies(mockRequest as AuthRequest, mockResponse as Response);

            expect(mockSearchService.searchMovies).toHaveBeenCalled();
            expect(mockSearchService.simpleTextSearch).toHaveBeenCalledWith(testQuery);
            expect(mockStatus).toHaveBeenCalledWith(200);
        });
    });
});