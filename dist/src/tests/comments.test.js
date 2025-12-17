"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const commentsModel_1 = __importDefault(require("../model/commentsModel"));
const utils_1 = require("./utils");
let app;
let loginUser;
let commentId = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield commentsModel_1.default.deleteMany();
    loginUser = yield (0, utils_1.getLogedInUser)(app);
}));
afterAll((done) => {
    done();
});
const commentsList = [
    { content: "this is my comment", movieId: "507f1f77bcf86cd799439011" },
    { content: "this is my second comment", movieId: "507f1f77bcf86cd799439012" },
    { content: "this is my third comment", movieId: "507f1f77bcf86cd799439013" },
    { content: "this is my fourth comment", movieId: "507f1f77bcf86cd799439013" },
];
describe("Sample Test Suite", () => {
    test("Initial empty comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comment");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    }));
    test("Create Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const comment of commentsList) {
            const response = yield (0, supertest_1.default)(app).post("/comment")
                .set("Authorization", "Bearer " + loginUser.token)
                .send(comment);
            expect(response.status).toBe(201);
            expect(response.body.content).toBe(comment.content);
            expect(response.body.movieId).toBe(comment.movieId);
        }
    }));
    test("Get All Comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comment");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(commentsList.length);
    }));
    test("Get Comments by movieId", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comment?movieId=" + commentsList[0].movieId);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].content).toBe(commentsList[0].content);
        commentId = response.body[0]._id;
    }));
    test("Get Comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comment/" + commentId);
        expect(response.status).toBe(200);
        expect(response.body.content).toBe(commentsList[0].content);
        expect(response.body.movieId).toBe(commentsList[0].movieId);
        expect(response.body._id).toBe(commentId);
    }));
    test("Update Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        commentsList[0].content = "This is an updated comment";
        commentsList[0].movieId = "507f1f77bcf86cd799439044";
        const response = yield (0, supertest_1.default)(app)
            .put("/comment/" + commentId)
            .set("Authorization", "Bearer " + loginUser.token)
            .send(commentsList[0]);
        expect(response.status).toBe(200);
        expect(response.body.content).toBe(commentsList[0].content);
        expect(response.body.movieId).toBe(commentsList[0].movieId);
        expect(response.body._id).toBe(commentId);
    }));
    test("Delete Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/comment/" + commentId)
            .set("Authorization", "Bearer " + loginUser.token);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(commentId);
        const getResponse = yield (0, supertest_1.default)(app).get("/comment/" + commentId);
        expect(getResponse.status).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map