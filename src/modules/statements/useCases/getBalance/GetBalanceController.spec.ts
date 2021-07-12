import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("get account balance", () => {
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
  it("should be able to get balance from account properly", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@admin.com.br",
      password: "admin",
    });
    const { token } = responseToken.body;

    const amount1 = 500;
    const amount2 = 300;
    const amount3 = 150;
    const amount4 = 100;
    const total = amount1 + amount2 - amount3 - amount4;
    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: amount1,
        description: `deposit ${amount1}`,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: amount2,
        description: `deposit ${amount2}`,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: amount3,
        description: `withdraw ${amount3}`,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: amount4,
        description: `withdraw ${amount4}`,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const getBalance = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(getBalance.status).toBe(200);
    expect(getBalance.body.balance).toEqual(total);
  });
  it("should note be able to get a balance from a non existent user", async () => {
    const getBalanceError = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer WrongToken`,
      });
    expect(getBalanceError.status).toBe(401);
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
