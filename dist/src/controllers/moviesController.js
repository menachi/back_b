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
const getAllMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = req.query.year;
        if (year) {
            const moviesByYear = yield moviesModel_1.default.find({ year: year });
            return res.json(moviesByYear);
        }
        else {
            const movies = yield moviesModel_1.default.find();
            res.json(movies);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving movies");
    }
});
const getMovieById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const movie = yield moviesModel_1.default.findById(id);
        if (!movie) {
            return res.status(404).send("Movie not found");
        }
        else {
            res.json(movie);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving movie by ID");
    }
});
const createMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movieData = req.body;
    console.log(movieData);
    try {
        const newMovie = yield moviesModel_1.default.create(movieData);
        res.status(201).json(newMovie);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error creating movie");
    }
});
const deleteMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deletedMovie = yield moviesModel_1.default.findByIdAndDelete(id);
        res.status(200).json(deletedMovie);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error deleting movie");
    }
});
const updateMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    try {
        const movie = yield moviesModel_1.default.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        res.json(movie);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error updating movie");
    }
});
exports.default = {
    getAllMovies,
    getMovieById,
    createMovie,
    deleteMovie,
    updateMovie,
};
//# sourceMappingURL=moviesController.js.map