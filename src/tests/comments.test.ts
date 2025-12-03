import request from "supertest";
import initApp from "../index";
import commentsModel from "../model/commentsModel";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await commentsModel.deleteMany();
});

afterAll((done) => {
  done();
});

type CommentData = { message: string, movieId: string, userId: string, _id?: string };

const commentsList: CommentData[] = [
  { message: "this is my comment", movieId: "11111", userId: "22222" },
  { message: "this is my second comment", movieId: "22222", userId: "111111" },
  { message: "this is my third comment", movieId: "33333", userId: "33333" },
  { message: "this is my fourth comment", movieId: "33333", userId: "33333" },
];

describe("Sample Test Suite", () => {

  test("Create Comment", async () => {
    for (const comment of commentsList) {
      const response = await request(app).post("/comment").send(comment);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe(comment.message);
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
    expect(response.body[0].message).toBe(commentsList[0].message);
    commentsList[0]._id = response.body[0]._id;
  });

  test("Get Comment by ID", async () => {
    const response = await request(app).get("/comment/" + commentsList[0]._id);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(commentsList[0].message);
    expect(response.body.movieId).toBe(commentsList[0].movieId);
    expect(response.body._id).toBe(commentsList[0]._id);
  });

  test("Update Comment", async () => {
    commentsList[0].message = "This is an updated comment";
    commentsList[0].movieId = "44444";
    const response = await request(app)
      .put("/comment/" + commentsList[0]._id)
      .send(commentsList[0]);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(commentsList[0].message);
    expect(response.body.movieId).toBe(commentsList[0].movieId);
    expect(response.body._id).toBe(commentsList[0]._id);
  });

  test("Delete Comment", async () => {
    const response = await request(app).delete("/comment/" + commentsList[0]._id);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(commentsList[0]._id);

    const getResponse = await request(app).get("/comment/" + commentsList[0]._id);
    expect(getResponse.status).toBe(404);
  });
});
