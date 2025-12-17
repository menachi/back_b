import request from "supertest";
import initApp from "../index";
import commentsModel from "../model/commentsModel";
import { Express } from "express";
import { getLogedInUser, UserData } from "./utils";

let app: Express;
let loginUser: UserData;
let commentId = "";

beforeAll(async () => {
  app = await initApp();
  await commentsModel.deleteMany();
  loginUser = await getLogedInUser(app);
});

afterAll((done) => {
  done();
});

type CommentData = { content: string, movieId: string, _id?: string };

const commentsList: CommentData[] = [
  { content: "this is my comment", movieId: "507f1f77bcf86cd799439011" },
  { content: "this is my second comment", movieId: "507f1f77bcf86cd799439012" },
  { content: "this is my third comment", movieId: "507f1f77bcf86cd799439013" },
  { content: "this is my fourth comment", movieId: "507f1f77bcf86cd799439013" },
];

describe("Sample Test Suite", () => {
  test("Initial empty comments", async () => {
    const response = await request(app).get("/comment");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("Create Comment", async () => {
    for (const comment of commentsList) {
      const response = await request(app).post("/comment")
        .set("Authorization", "Bearer " + loginUser.token)
        .send(comment);
      expect(response.status).toBe(201);
      expect(response.body.content).toBe(comment.content);
      expect(response.body.movieId).toBe(comment.movieId);
    }
  });

  test("Get All Comments", async () => {
    const response = await request(app).get("/comment");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(commentsList.length);
  });

  test("Get Comments by movieId", async () => {
    const response = await request(app).get(
      "/comment?movieId=" + commentsList[0].movieId
    );
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].content).toBe(commentsList[0].content);
    commentId = response.body[0]._id;
  });

  test("Get Comment by ID", async () => {
    const response = await request(app).get("/comment/" + commentId);
    expect(response.status).toBe(200);
    expect(response.body.content).toBe(commentsList[0].content);
    expect(response.body.movieId).toBe(commentsList[0].movieId);
    expect(response.body._id).toBe(commentId);
  });

  test("Update Comment", async () => {
    commentsList[0].content = "This is an updated comment";
    commentsList[0].movieId = "507f1f77bcf86cd799439044";
    const response = await request(app)
      .put("/comment/" + commentId)
      .set("Authorization", "Bearer " + loginUser.token)
      .send(commentsList[0]);
    expect(response.status).toBe(200);
    expect(response.body.content).toBe(commentsList[0].content);
    expect(response.body.movieId).toBe(commentsList[0].movieId);
    expect(response.body._id).toBe(commentId);
  });

  test("Delete Comment", async () => {
    const response = await request(app).delete("/comment/" + commentId)
      .set("Authorization", "Bearer " + loginUser.token);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(commentId);

    const getResponse = await request(app).get("/comment/" + commentId);
    expect(getResponse.status).toBe(404);
  });
});
