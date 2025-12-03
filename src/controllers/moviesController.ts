import movieModel from "../model/moviesModel";
import { Request, Response } from "express";
import baseController from "./baseController";

const moviesController = new baseController(movieModel);

export default moviesController
