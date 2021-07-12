import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  it("should be able to authentica an user", async () => {
    const user: ICreateUserDTO = {
      name: "UserName",
      email: "email@email.com",
      password: "test",
    };
    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate a non existent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@false.com",
        password: "false",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with incorrect password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "UserName",
        email: "email@email.com",
        password: "test",
      };
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.name,
        password: "incorrectPass",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
  it("should not be able to authenticate with incorrect email", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "UserName",
        email: "email@email.com",
        password: "test",
      };
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "IncorrectEmail",
        password: user.email,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
