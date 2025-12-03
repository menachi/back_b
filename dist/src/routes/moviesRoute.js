"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moviesController_1 = __importDefault(require("../controllers/moviesController"));
const router = express_1.default.Router();
router.get("/", moviesController_1.default.getAllMovies);
router.get("/:id", moviesController_1.default.getMovieById);
router.post("/", moviesController_1.default.createMovie);
router.delete("/:id", moviesController_1.default.deleteMovie);
router.put("/:id", moviesController_1.default.updateMovie);
exports.default = router;
//# sourceMappingURL=moviesRoute.js.map