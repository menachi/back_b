import request from "supertest";
import initApp from "../index";
import { Express } from "express";
import User from "../model/userModel";
import { userData, moviesList } from "./utils"
let app: Express;

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();
});

afterAll((done) => {
  done();
});

describe("Test Auth Suite", () => {
  test("Test post a movie without token fails", async () => {
    const movieData = moviesList[0];
    const response = await request(app).post("/movie").send(movieData);
    expect(response.status).toBe(401);
  });

  test("Test Registration", async () => {
    const email = userData.email;
    const password = userData.password;
    const response = await request(app).post("/auth/register").send(
      { "email": email, "password": password }
    );
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    userData.token = response.body.token;
    userData._id = response.body._id;
  });

  test("create a movie with token succeeds", async () => {
    const movieData = moviesList[0];
    const response = await request(app)
      .post("/movie")
      .set("Authorization", "Bearer " + userData.token)
      .send(movieData);
    expect(response.status).toBe(201);
  });

  test("create a movie with comporomised token fails", async () => {
    const movieData = moviesList[0];
    const compromizedToken = userData.token + "a";
    const response = await request(app)
      .post("/movie")
      .set("Authorization", "Bearer " + compromizedToken)
      .send(movieData);
    expect(response.status).toBe(401);
  });

  test("Test Login", async () => {
    const email = userData.email;
    const password = userData.password;
    const response = await request(app).post("/auth/login").send(
      { "email": email, "password": password }
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  jest.setTimeout(10000);

  test("Test using token after expiration fails", async () => {
    //sleep for 5 seconds to let the token expire
    await new Promise((r) => setTimeout(r, 5000));
    const movieData = moviesList[0];
    const response = await request(app)
      .post("/movie")
      .set("Authorization", "Bearer " + userData.token)
      .send(movieData);
    expect(response.status).toBe(401);
  });
});
