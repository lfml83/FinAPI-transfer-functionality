import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create user controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "luiz",
      email: "luiz@lfml.com",
      password: "1234",
    });

    expect(response.status).toBe(201);
  });
  it("should not be able to create a new user with the same email", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "luiz",
      email: "luiz@lfml.com",
      password: "1234",
    });
    expect(response.status).toBe(400);
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
