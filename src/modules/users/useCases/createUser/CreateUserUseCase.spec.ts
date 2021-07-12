import { compare } from "bcryptjs";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create an user", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const pass = "test";
    const user = await createUserUseCase.execute({
      name: "UserName",
      email: "email@email.com",
      password: pass,
    });
    const passworMatch = await compare(pass, user.password);
    expect(user).toHaveProperty("id");
    expect(passworMatch).toBe(true);
  });
  it("should not be able to create a new user with the same email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "UserName1",
        email: "email@email.com",
        password: "test1",
      });
      await createUserUseCase.execute({
        name: "UserName2",
        email: "email@email.com",
        password: "teste2",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
