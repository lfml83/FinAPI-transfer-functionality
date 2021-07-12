import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("get statement operation", () => {
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
  it("should be able to get a statement Operation", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@admin.com.br",
      password: "admin",
    });
    const { token } = responseToken.body;
    const createStatement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: `deposit 200`,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    const statement = await request(app)
      .get(`/api/v1/statements/${createStatement.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(statement.status).toBe(200);
    expect(statement.body).toHaveProperty("id");
    expect(statement.body).toHaveProperty("user_id");
    expect(statement.body.description).toEqual(`deposit 200`);
    expect(statement.body.type).toEqual("deposit");
  });
  it("should not be able to get statement operation with invalid User", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@admin.com.br",
      password: "admin",
    });
    const { token } = responseToken.body;
    const createStatement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: `deposit 200`,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    const statement = await request(app)
      .get(`/api/v1/statements/${createStatement.body.id}`)
      .set({
        Authorization: `Bearer WrongUser`,
      });
    expect(statement.status).toBe(401);
  });
  it("should not be able to get statement operation with invalid statement id", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@admin.com.br",
      password: "admin",
    });
    const { token } = responseToken.body;
    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: `deposit 200`,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    const statement = await request(app)
      .get(`/api/v1/statements/WrongStatement`)
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(statement.status).toBe(500);
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
