const movieModel = require("../model/moviesModel");

const getAllMovies = async (req, res) => {
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

const getMovieById = async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await movieModel.findById(id);
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving movie by ID");
  }
};

const createMovie = async (req, res) => {
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

const deleteMovie = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedMovie = await movieModel.findByIdAndDelete(id);
    res.status(200).json(deletedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting movie");
  }
};

const updateMovie = async (req, res) => {
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

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  deleteMovie,
  updateMovie,
};
