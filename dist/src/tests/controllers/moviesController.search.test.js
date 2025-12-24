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
const moviesController_1 = __importDefault(require("../../controllers/moviesController"));
// Mock the services
jest.mock("../../services/llmService", () => ({
    parseSearchQuery: jest.fn()
}));
jest.mock("../../services/searchService", () => ({
    searchMovies: jest.fn(),
    simpleTextSearch: jest.fn()
}));
const llmService_1 = __importDefault(require("../../services/llmService"));
const searchService_1 = __importDefault(require("../../services/searchService"));
const mockLlmService = llmService_1.default;
const mockSearchService = searchService_1.default;
describe("MoviesController - searchMovies Unit Tests", () => {
    let mockRequest;
    let mockResponse;
    let mockJson;
    let mockStatus;
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
        test("should return 400 when query field is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = {};
            yield moviesController_1.default.searchMovies(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "query field is required" });
        }));
        test("should return 400 when query is null", () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = { query: null };
            yield moviesController_1.default.searchMovies(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "query field is required" });
        }));
        test("should return 400 when query is not a string", () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = { query: 123 };
            yield moviesController_1.default.searchMovies(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "query must be a string" });
        }));
        test("should return 400 when query is empty string", () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = { query: "" };
            yield moviesController_1.default.searchMovies(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: "query cannot be empty" });
        }));
    });
    describe("Successful Search Flow", () => {
        test("should return 200 with mocked search results", () => __awaiter(void 0, void 0, void 0, function* () {
            const testQuery = "sci-fi movies from 2010";
            mockRequest.body = { query: testQuery };
            yield moviesController_1.default.searchMovies(mockRequest, mockResponse);
            expect(mockLlmService.parseSearchQuery).toHaveBeenCalledWith(testQuery);
            expect(mockSearchService.searchMovies).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                query: testQuery,
                results: []
            });
        }));
        test("should handle search service errors with fallback", () => __awaiter(void 0, void 0, void 0, function* () {
            const testQuery = "test query";
            mockRequest.body = { query: testQuery };
            // Mock search service to throw error
            mockSearchService.searchMovies.mockRejectedValue(new Error("Search failed"));
            mockSearchService.simpleTextSearch.mockResolvedValue([]);
            yield moviesController_1.default.searchMovies(mockRequest, mockResponse);
            expect(mockSearchService.searchMovies).toHaveBeenCalled();
            expect(mockSearchService.simpleTextSearch).toHaveBeenCalledWith(testQuery);
            expect(mockStatus).toHaveBeenCalledWith(200);
        }));
    });
});
//# sourceMappingURL=moviesController.search.test.js.map