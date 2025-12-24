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
const baseController_1 = __importDefault(require("./baseController"));
const llmService_1 = __importDefault(require("../services/llmService"));
const searchService_1 = __importDefault(require("../services/searchService"));
class MoviesController extends baseController_1.default {
    constructor() {
        super(moviesModel_1.default);
    }
    // Override create method to associate movie with authenticated user
    create(req, res) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user) {
                req.body.creatredBy = req.user._id; // Associate movie with user ID from token
            }
            return _super.create.call(this, req, res);
        });
    }
    //OVERRIDE DELETE to ensure only creator can delete
    del(req, res) {
        const _super = Object.create(null, {
            del: { get: () => super.del }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const movie = yield this.model.findById(id);
                if (!movie) {
                    res.status(404).send("Movie not found");
                    return;
                }
                // Check if the authenticated user is the creator of the movie
                if (req.user && movie.creatredBy.toString() === req.user._id) {
                    _super.del.call(this, req, res);
                    return;
                }
                else {
                    res.status(403).send("Forbidden: You are not the creator of this movie");
                    return;
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).send("Error deleting movie");
            }
        });
    }
    ;
    //override put to prevent changing creatredBy
    update(req, res) {
        const _super = Object.create(null, {
            update: { get: () => super.update }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const movie = yield this.model.findById(id);
                if (!movie) {
                    res.status(404).send("Movie not found");
                    return;
                }
                // Prevent changing creatredBy field
                if (req.body.creatredBy && req.body.creatredBy !== movie.creatredBy.toString()) {
                    res.status(400).send("Cannot change creator of the movie");
                    return;
                }
                _super.update.call(this, req, res);
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).send("Error updating movie");
            }
        });
    }
    ;
    // Movie search method
    searchMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = req.body;
            // Validate request body
            if (query === undefined || query === null) {
                return res.status(400).json({ message: "query field is required" });
            }
            if (typeof query !== 'string') {
                return res.status(400).json({ message: "query must be a string" });
            }
            if (query.trim() === '') {
                return res.status(400).json({ message: "query cannot be empty" });
            }
            try {
                // Parse the query using LLM service
                const parsedQuery = yield llmService_1.default.parseSearchQuery(query);
                // Search movies using the parsed query
                let results = [];
                try {
                    results = yield searchService_1.default.searchMovies(parsedQuery);
                }
                catch (searchError) {
                    console.warn('Advanced search failed, falling back to simple search:', searchError);
                    // Fallback to simple text search
                    results = yield searchService_1.default.simpleTextSearch(query.trim());
                }
                res.status(200).json({
                    query: query,
                    results: results
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Error searching movies" });
            }
        });
    }
}
exports.default = new MoviesController();
//# sourceMappingURL=moviesController.js.map