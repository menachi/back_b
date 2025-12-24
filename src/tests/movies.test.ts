import request from "supertest";
import initApp from "../index";
import moviesModel from "../model/moviesModel";
import { Express } from "express";
import { getLogedInUser, UserData, MovieData, moviesList } from "./utils"

let app: Express;
let loginUser: UserData;
let movieId = "";

beforeAll(async () => {
  app = await initApp();
  await moviesModel.deleteMany();
  loginUser = await getLogedInUser(app);
});

afterAll((done) => {
  done();
});

describe("Sample Test Suite", () => {
  test("Sample Test Case", async () => {
    const response = await request(app).get("/movie");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("Create Movie", async () => {
    for (const movie of moviesList) {
      const response = await request(app).post("/movie")
        .set("Authorization", "Bearer " + loginUser.token)
        .send(movie);
      expect(response.status).toBe(201);
      expect(response.body.title).toBe(movie.title);
      expect(response.body.year).toBe(movie.year);
    }
  });

  test("Get All Movies", async () => {
    const response = await request(app).get("/movie");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(moviesList.length);
  });

  test("Get Movies by Year", async () => {
    const response = await request(app).get(
      "/movie?year=" + moviesList[0].year
    );
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe(moviesList[0].title);
    // moviesList[0]._id = response.body[0]._id;
    movieId = response.body[0]._id;
  });

  //get movie by id
  test("Get Movie by ID", async () => {
    const response = await request(app).get("/movie/" + movieId);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(moviesList[0].title);
    expect(response.body.year).toBe(moviesList[0].year);
    expect(response.body._id).toBe(movieId);
  });

  test("Update Movie", async () => {
    moviesList[0].title = "Inception Updated";
    moviesList[0].year = 2011;
    const response = await request(app)
      .put("/movie/" + movieId)
      .set("Authorization", "Bearer " + loginUser.token)
      .send(moviesList[0]);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(moviesList[0].title);
    expect(response.body.year).toBe(moviesList[0].year);
    expect(response.body._id).toBe(movieId);
  });

  test("Delete Movie", async () => {
    const response = await request(app).delete("/movie/" + movieId)
      .set("Authorization", "Bearer " + loginUser.token);
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body._id).toBe(movieId);

    const getResponse = await request(app).get("/movie/" + movieId);
    expect(getResponse.status).toBe(404);
  });
});

describe("Movie Search API Tests", () => {
  let searchLoginUser: UserData;

  beforeAll(async () => {
    searchLoginUser = await getLogedInUser(app);
    // Create test movies for search
    await moviesModel.deleteMany();
    for (const movie of moviesList) {
      await request(app).post("/movie")
        .set("Authorization", "Bearer " + searchLoginUser.token)
        .send(movie);
    }
  });

  test("Search movies - requires authentication", async () => {
    const searchQuery = { query: "action movies from 2010" };
    const response = await request(app)
      .post("/movie/search")
      .send(searchQuery);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("Search movies - fails with invalid token", async () => {
    const searchQuery = { query: "action movies from 2010" };
    const response = await request(app)
      .post("/movie/search")
      .set("Authorization", "Bearer invalidtoken123")
      .send(searchQuery);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("Search movies - validates request body has query field", async () => {
    const response = await request(app)
      .post("/movie/search")
      .set("Authorization", "Bearer " + searchLoginUser.token)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("query");
  });

  test("Search movies - validates query is not empty", async () => {
    const searchQuery = { query: "" };
    const response = await request(app)
      .post("/movie/search")
      .set("Authorization", "Bearer " + searchLoginUser.token)
      .send(searchQuery);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("Search movies - validates query is a string", async () => {
    const searchQuery = { query: 123 };
    const response = await request(app)
      .post("/movie/search")
      .set("Authorization", "Bearer " + searchLoginUser.token)
      .send(searchQuery);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("Search movies - successful search returns proper format", async () => {
    const searchQuery = { query: "sci-fi movies from the 2010s" };
    const response = await request(app)
      .post("/movie/search")
      .set("Authorization", "Bearer " + searchLoginUser.token)
      .send(searchQuery);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(response.body).toHaveProperty("query", searchQuery.query);
    expect(Array.isArray(response.body.results)).toBe(true);
  });

  test("Search movies - results contain movie properties", async () => {
    const searchQuery = { query: "any movie" };
    const response = await request(app)
      .post("/movie/search")
      .set("Authorization", "Bearer " + searchLoginUser.token)
      .send(searchQuery);

    expect(response.status).toBe(200);

    // If results exist, they should have proper movie structure
    if (response.body.results.length > 0) {
      const movie = response.body.results[0];
      expect(movie).toHaveProperty("_id");
      expect(movie).toHaveProperty("title");
      expect(movie).toHaveProperty("year");
      expect(movie).toHaveProperty("creatredBy");
    }
  });

  test("Search movies - handles server errors gracefully", async () => {
    const searchQuery = { query: "test query for error handling" };
    const response = await request(app)
      .post("/movie/search")
      .set("Authorization", "Bearer " + searchLoginUser.token)
      .send(searchQuery);

    // Should either succeed or return 500 with proper error message
    if (response.status === 500) {
      expect(response.body).toHaveProperty("message");
    } else {
      expect(response.status).toBe(200);
    }
  });
});
