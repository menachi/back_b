import express from "express";
import moviesController from "../controllers/moviesController";

const router = express.Router();

router.get("/", moviesController.getAll.bind(moviesController));

router.get("/:id", moviesController.getById.bind(moviesController));

router.post("/", moviesController.create.bind(moviesController));

router.delete("/:id", moviesController.del.bind(moviesController));

router.put("/:id", moviesController.update.bind(moviesController));

export default router;