import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}
describe("Create a statement", () => {
  beforeEach(async () => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });
  it("should be able to create a deposit statement", async () => {
    const registredUser = await createUserUseCase.execute({
      name: "UserName",
      email: "email@email.com",
      password: "userTest",
    });
    const user_id = registredUser.id as string;

    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 200,
      type: "deposit" as OperationType,
      description: "deposit at bank",
    });

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toBe(200);
    expect(statement.type).toEqual("deposit");
  });
  it("should be able to create a withdraw statement", async () => {
    const registredUser = await createUserUseCase.execute({
      name: "UserName",
      email: "email@email.com",
      password: "userTest",
    });
    const user_id = registredUser.id as string;

    await createStatementUseCase.execute({
      user_id,
      amount: 200,
      type: "deposit" as OperationType,
      description: "deposit at bank",
    });
    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      type: "withdraw" as OperationType,
      description: "withdraw at bank",
    });

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toBe(100);
    expect(statement.type).toEqual("withdraw");
  });
  it("should not be able to create a statement with invalid user", () => {
    expect(async () => {
      const registredUser = await createUserUseCase.execute({
        name: "UserName",
        email: "email@email.com",
        password: "userTest",
      });
      const user_id = registredUser.id as string;

      await createStatementUseCase.execute({
        user_id,
        amount: 200,
        type: "deposit" as OperationType,
        description: "deposit at bank",
      });
      await createStatementUseCase.execute({
        user_id: "InvalidId",
        amount: 100,
        type: "deposit" as OperationType,
        description: "deposito at bank",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
  it("should not be able to create a statement with insufficient funds", () => {
    expect(async () => {
      const registredUser = await createUserUseCase.execute({
        name: "UserName",
        email: "email@email.com",
        password: "userTest",
      });
      const user_id = registredUser.id as string;

      await createStatementUseCase.execute({
        user_id,
        amount: 100,
        type: "withdraw" as OperationType,
        description: "withdraw at bank",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
