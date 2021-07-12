import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create a statement operation", () => {
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
  it("should be able to create a deposit statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@admin.com.br",
      password: "admin",
    });
    const { token } = responseToken.body;

    const responseDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "deposit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseDeposit.statusCode).toBe(201);
    expect(responseDeposit.body).toHaveProperty("id");
    expect(responseDeposit.body).toHaveProperty("user_id");
    expect(responseDeposit.body.description).toEqual("deposit test");
    expect(responseDeposit.body.amount).toBe(100);
  });
  it("should be able to create a withdraw statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@admin.com.br",
      password: "admin",
    });
    const { token } = responseToken.body;

    const responseDeposit = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "withdraw test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(responseDeposit.statusCode).toBe(201);
    expect(responseDeposit.body).toHaveProperty("id");
    expect(responseDeposit.body).toHaveProperty("user_id");
    expect(responseDeposit.body.description).toEqual("withdraw test");
    expect(responseDeposit.body.amount).toBe(100);
  });
  it("should not be able to create a statement withdraw with invalid user", async () => {
    const responseDeposit = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "withdraw test",
      })
      .set({
        Authorization: `Bearer InvalidToken`,
      });
    expect(responseDeposit.status).toBe(401);
  });
  it("should not be able to create a statement deposit with invalid user", async () => {
    const responseDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "deposit test",
      })
      .set({
        Authorization: `Bearer InvalidToken`,
      });
    expect(responseDeposit.status).toBe(401);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
