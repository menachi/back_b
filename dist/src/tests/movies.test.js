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
const moviesModel_1 = __importDefault(require("../model/moviesModel"));
const utils_1 = require("./utils");
let app;
let loginUser;
let movieId = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield moviesModel_1.default.deleteMany();
    loginUser = yield (0, utils_1.getLogedInUser)(app);
}));
afterAll((done) => {
    done();
});
describe("Sample Test Suite", () => {
    test("Sample Test Case", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/movie");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    }));
    test("Create Movie", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const movie of utils_1.moviesList) {
            const response = yield (0, supertest_1.default)(app).post("/movie")
                .set("Authorization", "Bearer " + loginUser.token)
                .send(movie);
            expect(response.status).toBe(201);
            expect(response.body.title).toBe(movie.title);
            expect(response.body.year).toBe(movie.year);
        }
    }));
    test("Get All Movies", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/movie");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(utils_1.moviesList.length);
    }));
    test("Get Movies by Year", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/movie?year=" + utils_1.moviesList[0].year);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe(utils_1.moviesList[0].title);
        // moviesList[0]._id = response.body[0]._id;
        movieId = response.body[0]._id;
    }));
    //get movie by id
    test("Get Movie by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/movie/" + movieId);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(utils_1.moviesList[0].title);
        expect(response.body.year).toBe(utils_1.moviesList[0].year);
        expect(response.body._id).toBe(movieId);
    }));
    test("Update Movie", () => __awaiter(void 0, void 0, void 0, function* () {
        utils_1.moviesList[0].title = "Inception Updated";
        utils_1.moviesList[0].year = 2011;
        const response = yield (0, supertest_1.default)(app)
            .put("/movie/" + movieId)
            .set("Authorization", "Bearer " + loginUser.token)
            .send(utils_1.moviesList[0]);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(utils_1.moviesList[0].title);
        expect(response.body.year).toBe(utils_1.moviesList[0].year);
        expect(response.body._id).toBe(movieId);
    }));
    test("Delete Movie", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/movie/" + movieId)
            .set("Authorization", "Bearer " + loginUser.token);
        expect(response.status).toBe(200);
        console.log(response.body);
        expect(response.body._id).toBe(movieId);
        const getResponse = yield (0, supertest_1.default)(app).get("/movie/" + movieId);
        expect(getResponse.status).toBe(404);
    }));
});
//# sourceMappingURL=movies.test.js.map