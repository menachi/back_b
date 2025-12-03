import express from "express";
import moviesController from "../controllers/moviesController";

const router = express.Router();

router.get("/", moviesController.getAllMovies);

router.get("/:id", moviesController.getMovieById);

router.post("/", moviesController.createMovie);

router.delete("/:id", moviesController.deleteMovie);

router.put("/:id", moviesController.updateMovie);

export default router;