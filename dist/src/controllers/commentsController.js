"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commentsModel_1 = __importDefault(require("../model/commentsModel"));
const baseController_1 = __importDefault(require("./baseController"));
const commentsController = new baseController_1.default(commentsModel_1.default);
exports.default = commentsController;
//# sourceMappingURL=commentsController.js.map