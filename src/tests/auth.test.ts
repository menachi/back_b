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
    //check refresh token
    expect(response.body).toHaveProperty("refreshToken");
    userData.refreshToken = response.body.refreshToken;
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
    expect(response.body).toHaveProperty("refreshToken");
    userData.token = response.body.token;
    userData.refreshToken = response.body.refreshToken;
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

    //refresh the token
    const refreshResponse = await request(app).post("/auth/refresh").send(
      { "refreshToken": userData.refreshToken }
    );
    console.log("Refresh response body:", refreshResponse.body);
    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body).toHaveProperty("token");
    userData.token = refreshResponse.body.token;
    userData.refreshToken = refreshResponse.body.refreshToken;

    //try to create movie again
    const retryResponse = await request(app)
      .post("/movie")
      .set("Authorization", "Bearer " + userData.token)
      .send(movieData);
    expect(retryResponse.status).toBe(201);
  });

  //test double use of refresh token fails
  test("Test double use of refresh token fails", async () => {
    //use the current refresh token to get a new token
    const refreshResponse1 = await request(app).post("/auth/refresh").send(
      { "refreshToken": userData.refreshToken }
    );
    expect(refreshResponse1.status).toBe(200);
    expect(refreshResponse1.body).toHaveProperty("token");
    const newRefreshToken = refreshResponse1.body.refreshToken;

    //try to use the same refresh token again
    const refreshResponse2 = await request(app).post("/auth/refresh").send(
      { "refreshToken": userData.refreshToken }
    );
    expect(refreshResponse2.status).toBe(401);

    //try to use the new refresh token also fails
    const refreshResponse3 = await request(app).post("/auth/refresh").send(
      { "refreshToken": newRefreshToken }
    );
    expect(refreshResponse3.status).toBe(401);
  });
});
