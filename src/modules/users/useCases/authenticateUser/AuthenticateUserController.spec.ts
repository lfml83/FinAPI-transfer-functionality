import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate an user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id = uuid();

    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at)
    values('${id}', 'admin', 'admin@admin.com.br','${password}' , 'now()')
    `
    );
  });
  it("should be able to authenticate an user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@admin.com.br",
      password: "admin",
    });

    expect(responseToken.status).toBe(200);
    expect(responseToken.body).toHaveProperty("token");
  });
  it("should not be able to authenticate with incorrect password", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@admin.com.br",
      password: "WrongPass",
    });

    expect(responseToken.status).toBe(401);
  });
  it("should not be able to authenticate with incorrect email", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "wrong@wrong.com.br",
      password: "admin",
    });

    expect(responseToken.status).toBe(401);
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
