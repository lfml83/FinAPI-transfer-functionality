import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserprofileUserUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("information about authenticated user", () => {
  beforeEach(() => {
    // criando na memoria
    usersRepositoryInMemory = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserprofileUserUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
  });

  it("should be able to show atuhenticated user profile", async () => {
    const pass = "test";
    const user: ICreateUserDTO = {
      name: "UserName",
      email: "email@email.com",
      password: pass,
    };
    const registredUser = await createUserUseCase.execute(user);

    const userProfile = await showUserprofileUserUseCase.execute(
      registredUser.id as string
    );
    expect(userProfile).toHaveProperty("id");
    expect(userProfile).toHaveProperty("name");
    expect(userProfile).toHaveProperty("email");
  });
  it("should not be to show user profile a non existen user ", async () => {
    expect(async () => {
      await showUserprofileUserUseCase.execute("InvalidID");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
