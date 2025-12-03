"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moviesController_1 = __importDefault(require("../controllers/moviesController"));
const router = express_1.default.Router();
router.get("/", moviesController_1.default.getAll.bind(moviesController_1.default));
router.get("/:id", moviesController_1.default.getById.bind(moviesController_1.default));
router.post("/", moviesController_1.default.create.bind(moviesController_1.default));
router.delete("/:id", moviesController_1.default.del.bind(moviesController_1.default));
router.put("/:id", moviesController_1.default.update.bind(moviesController_1.default));
exports.default = router;
//# sourceMappingURL=moviesRoute.js.map