import request from "supertest";
import initApp from "../index";
import moviesModel from "../model/moviesModel";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await moviesModel.deleteMany();
});

afterAll((done) => {
  done();
});

type MovieData = { title: string, year: number, _id?: string };

const moviesList: MovieData[] = [
  { title: "Inception", year: 2010 },
  { title: "The Matrix", year: 1999 },
  { title: "Interstellar", year: 2014 },
];

describe("Sample Test Suite", () => {
  test("Sample Test Case", async () => {
    const response = await request(app).get("/movie");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("Create Movie", async () => {
    for (const movie of moviesList) {
      const response = await request(app).post("/movie").send(movie);
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
    moviesList[0]._id = response.body[0]._id;
  });

  //get movie by id
  test("Get Movie by ID", async () => {
    const response = await request(app).get("/movie/" + moviesList[0]._id);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(moviesList[0].title);
    expect(response.body.year).toBe(moviesList[0].year);
    expect(response.body._id).toBe(moviesList[0]._id);
  });

  test("Update Movie", async () => {
    moviesList[0].title = "Inception Updated";
    moviesList[0].year = 2011;
    const response = await request(app)
      .put("/movie/" + moviesList[0]._id)
      .send(moviesList[0]);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(moviesList[0].title);
    expect(response.body.year).toBe(moviesList[0].year);
    expect(response.body._id).toBe(moviesList[0]._id);
  });

  test("Delete Movie", async () => {
    const response = await request(app).delete("/movie/" + moviesList[0]._id);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(moviesList[0]._id);

    const getResponse = await request(app).get("/movie/" + moviesList[0]._id);
    expect(getResponse.status).toBe(404);
  });
});
