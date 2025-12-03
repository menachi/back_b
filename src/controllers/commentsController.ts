import commentsModel from "../model/commentsModel";
import { Request, Response } from "express";
import baseController from "./baseController";

const commentsController = new baseController(commentsModel);

export default commentsController;
