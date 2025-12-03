import movieModel from "../model/moviesModel";
import { Request, Response } from "express";

const getAllMovies = async (req: Request, res: Response) => {
  try {
    const year = req.query.year;
    if (year) {
      const moviesByYear = await movieModel.find({ year: year });
      return res.json(moviesByYear);
    } else {
      const movies = await movieModel.find();
      res.json(movies);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving movies");
  }
};

const getMovieById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const movie = await movieModel.findById(id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    } else {
      res.json(movie);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving movie by ID");
  }
};

const createMovie = async (req: Request, res: Response) => {
  const movieData = req.body;
  console.log(movieData);
  try {
    const newMovie = await movieModel.create(movieData);
    res.status(201).json(newMovie);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating movie");
  }
};

const deleteMovie = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedMovie = await movieModel.findByIdAndDelete(id);
    res.status(200).json(deletedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting movie");
  }
};

const updateMovie = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  try {
    const movie = await movieModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating movie");
  }
};

export default {
  getAllMovies,
  getMovieById,
  createMovie,
  deleteMovie,
  updateMovie,
};
