import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationsUseCase: GetStatementOperationUseCase;
enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("get statement operation", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    statementsRepositoryInMemory = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );

    getStatementOperationsUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });
  it("should be able to get a statement Operation", async () => {
    // const getBalance = await getBalanceUseCase.execute();
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

    const statement_id = statement.id as string;

    const statementOperation = await getStatementOperationsUseCase.execute({
      user_id,
      statement_id,
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.amount).toBe(200);
    expect(statementOperation.type).toBe("deposit");
  });
  it("should not be able to get statement operation with invalid User", () => {
    expect(async () => {
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

      const statement_id = statement.id as string;

      await getStatementOperationsUseCase.execute({
        user_id: "InvalidId",
        statement_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
  it("should not be able to get statement operation with invalid statement id", () => {
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

      await getStatementOperationsUseCase.execute({
        user_id,
        statement_id: "InvalidId",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
