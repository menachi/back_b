import movieModel from "../model/moviesModel";
import { Request, Response } from "express";
import baseController from "./baseController";
import { AuthRequest } from "../middleware/authMiddleware";
import llmService from "../services/llmService";
import searchService from "../services/searchService";

class MoviesController extends baseController {
    constructor() {
        super(movieModel);
    }

    // Override create method to associate movie with authenticated user
    async create(req: AuthRequest, res: Response) {
        if (req.user) {
            req.body.creatredBy = req.user._id; // Associate movie with user ID from token
        }
        return super.create(req, res);
    }

    //OVERRIDE DELETE to ensure only creator can delete
    async del(req: AuthRequest, res: Response) {
        const id = req.params.id;
        try {
            const movie = await this.model.findById(id);
            if (!movie) {
                res.status(404).send("Movie not found");
                return;
            }
            // Check if the authenticated user is the creator of the movie
            if (req.user && movie.creatredBy.toString() === req.user._id) {
                super.del(req, res);
                return
            } else {
                res.status(403).send("Forbidden: You are not the creator of this movie");
                return;
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Error deleting movie");
        }
    };

    //override put to prevent changing creatredBy
    async update(req: AuthRequest, res: Response) {
        const id = req.params.id;
        try {
            const movie = await this.model.findById(id);
            if (!movie) {
                res.status(404).send("Movie not found");
                return;
            }
            // Prevent changing creatredBy field
            if (req.body.creatredBy && req.body.creatredBy !== movie.creatredBy.toString()) {
                res.status(400).send("Cannot change creator of the movie");
                return;
            }
            super.update(req, res);
            return;
        }
        catch (err) {
            console.error(err);
            res.status(500).send("Error updating movie");
        }
    };

    // Movie search method
    async searchMovies(req: AuthRequest, res: Response) {
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
            const parsedQuery = await llmService.parseSearchQuery(query);

            // Search movies using the parsed query
            let results: any[] = [];

            try {
                results = await searchService.searchMovies(parsedQuery);
            } catch (searchError) {
                console.warn('Advanced search failed, falling back to simple search:', searchError);
                // Fallback to simple text search
                results = await searchService.simpleTextSearch(query.trim());
            }

            res.status(200).json({
                query: query,
                results: results
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error searching movies" });
        }
    }
}

export default new MoviesController();
