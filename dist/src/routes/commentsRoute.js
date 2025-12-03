"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentsController_1 = __importDefault(require("../controllers/commentsController"));
const router = express_1.default.Router();
router.get("/", commentsController_1.default.getAll.bind(commentsController_1.default));
router.get("/:id", commentsController_1.default.getById.bind(commentsController_1.default));
router.post("/", commentsController_1.default.create.bind(commentsController_1.default));
router.delete("/:id", commentsController_1.default.del.bind(commentsController_1.default));
router.put("/:id", commentsController_1.default.update.bind(commentsController_1.default));
exports.default = router;
//# sourceMappingURL=commentsRoute.js.map