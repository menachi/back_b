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
