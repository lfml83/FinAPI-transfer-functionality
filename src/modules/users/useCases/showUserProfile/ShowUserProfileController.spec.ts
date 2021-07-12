import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("show user profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id1 = uuid();

    const password = await hash("admin", 8);
    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at)
    values('${id1}', 'admin', 'admin@admin.com.br','${password}' , 'now()')
    `
    );
  });
  it("should be able to show atuhenticated user profile", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@admin.com.br",
      password: "admin",
    });
    const { token } = responseToken.body;

    const showUser = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(showUser.statusCode).toBe(200);
    expect(showUser.body).toHaveProperty("id");
    expect(showUser.body.email).toEqual("admin@admin.com.br");
    expect(showUser.body.name).toEqual("admin");
  });

  it("should not be able to show a non authenticated user", async () => {
    const showUser = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer WrongNumber`,
    });
    expect(showUser.status).toBe(401);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
