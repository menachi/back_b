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
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield commentsModel_1.default.deleteMany();
}));
afterAll((done) => {
    done();
});
const commentsList = [
    { message: "this is my comment", movieId: "11111", userId: "22222" },
    { message: "this is my second comment", movieId: "22222", userId: "111111" },
    { message: "this is my third comment", movieId: "33333", userId: "33333" },
    { message: "this is my fourth comment", movieId: "33333", userId: "33333" },
];
describe("Sample Test Suite", () => {
    test("Create Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const comment of commentsList) {
            const response = yield (0, supertest_1.default)(app).post("/comment").send(comment);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe(comment.message);
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
        expect(response.body[0].message).toBe(commentsList[0].message);
        commentsList[0]._id = response.body[0]._id;
    }));
    test("Get Comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comment/" + commentsList[0]._id);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(commentsList[0].message);
        expect(response.body.movieId).toBe(commentsList[0].movieId);
        expect(response.body._id).toBe(commentsList[0]._id);
    }));
    test("Update Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        commentsList[0].message = "This is an updated comment";
        commentsList[0].movieId = "44444";
        const response = yield (0, supertest_1.default)(app)
            .put("/comment/" + commentsList[0]._id)
            .send(commentsList[0]);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(commentsList[0].message);
        expect(response.body.movieId).toBe(commentsList[0].movieId);
        expect(response.body._id).toBe(commentsList[0]._id);
    }));
    test("Delete Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/comment/" + commentsList[0]._id);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(commentsList[0]._id);
        const getResponse = yield (0, supertest_1.default)(app).get("/comment/" + commentsList[0]._id);
        expect(getResponse.status).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map