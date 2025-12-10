"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const moviesRoute_1 = __importDefault(require("./routes/moviesRoute"));
const commentsRoute_1 = __importDefault(require("./routes/commentsRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.dev" });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/movie", moviesRoute_1.default);
app.use("/comment", commentsRoute_1.default);
app.use("/auth", authRoute_1.default);
const initApp = () => {
    const pr = new Promise((resolve, reject) => {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            reject("DATABASE_URL is not defined");
            return;
        }
        mongoose_1.default
            .connect(dbUrl, {})
            .then(() => {
            resolve(app);
        });
        const db = mongoose_1.default.connection;
        db.on("error", (error) => console.error(error));
        db.once("open", () => console.log("Connected to Database"));
    });
    return pr;
};
exports.default = initApp;
//# sourceMappingURL=index.js.map