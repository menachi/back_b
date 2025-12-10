import request from "supertest";
import { Express } from "express";

export type UserData = {
    email: string,
    password: string,
    _id: string,
    token: string
};

export const userData = {
    email: "test@test.com",
    password: "testpass",
    _id: "",
    token: ""
};

export const getLogedInUser = async (app: Express): Promise<UserData> => {
    const email = userData.email;
    const password = userData.password;
    let response = await request(app).post("/auth/register").send(
        { "email": email, "password": password }
    );
    if (response.status !== 201) {
        response = await request(app).post("/auth/login").send(
            { "email": email, "password": password });
    }
    const logedUser = {
        _id: response.body._id,
        token: response.body.token,
        email: email,
        password: password
    };
    return logedUser;
}

export type MovieData = { title: string, year: number, _id?: string };

export const moviesList: MovieData[] = [
    { title: "Inception", year: 2010 },
    { title: "The Matrix", year: 1999 },
    { title: "Interstellar", year: 2014 },
];
