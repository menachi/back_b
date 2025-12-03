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
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield moviesModel_1.default.deleteMany();
}));
afterAll((done) => {
    done();
});
const moviesList = [
    { title: "Inception", year: 2010 },
    { title: "The Matrix", year: 1999 },
    { title: "Interstellar", year: 2014 },
];
describe("Sample Test Suite", () => {
    test("Sample Test Case", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/movie");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    }));
    test("Create Movie", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const movie of moviesList) {
            const response = yield (0, supertest_1.default)(app).post("/movie").send(movie);
            expect(response.status).toBe(201);
            expect(response.body.title).toBe(movie.title);
            expect(response.body.year).toBe(movie.year);
        }
    }));
    test("Get All Movies", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/movie");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(moviesList.length);
    }));
    test("Get Movies by Year", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/movie?year=" + moviesList[0].year);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe(moviesList[0].title);
        moviesList[0]._id = response.body[0]._id;
    }));
    //get movie by id
    test("Get Movie by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/movie/" + moviesList[0]._id);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(moviesList[0].title);
        expect(response.body.year).toBe(moviesList[0].year);
        expect(response.body._id).toBe(moviesList[0]._id);
    }));
    test("Update Movie", () => __awaiter(void 0, void 0, void 0, function* () {
        moviesList[0].title = "Inception Updated";
        moviesList[0].year = 2011;
        const response = yield (0, supertest_1.default)(app)
            .put("/movie/" + moviesList[0]._id)
            .send(moviesList[0]);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(moviesList[0].title);
        expect(response.body.year).toBe(moviesList[0].year);
        expect(response.body._id).toBe(moviesList[0]._id);
    }));
    test("Delete Movie", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/movie/" + moviesList[0]._id);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(moviesList[0]._id);
        const getResponse = yield (0, supertest_1.default)(app).get("/movie/" + moviesList[0]._id);
        expect(getResponse.status).toBe(404);
    }));
});
//# sourceMappingURL=movies.test.js.map