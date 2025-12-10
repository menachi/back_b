import express from "express";
import moviesController from "../controllers/moviesController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", moviesController.getAll.bind(moviesController));

router.get("/:id", moviesController.getById.bind(moviesController));

router.post("/", authenticate, moviesController.create.bind(moviesController));

router.delete("/:id", authenticate, moviesController.del.bind(moviesController));

router.put("/:id", authenticate, moviesController.update.bind(moviesController));

export default router;