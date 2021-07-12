import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("create count balance from account", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });
  it("should be able to get balance from account", async () => {
    // const getBalance = await getBalanceUseCase.execute();
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

    const balance = await getBalanceUseCase.execute({ user_id });
    expect(balance).toHaveProperty("statement");
    expect(balance.statement[0].user_id).toEqual(user_id);
    expect(balance.statement[0].amount).toEqual(200);
    expect(balance.statement[0].type).toEqual("deposit");
    expect(balance.balance).toEqual(200);
  });
  it("should note be able to get a balance from a non existent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "Invalid" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
  it("should be able to get balance correctly", async () => {
    const registredUser = await createUserUseCase.execute({
      name: "UserName",
      email: "email@email.com",
      password: "userTest",
    });
    const user_id = registredUser.id as string;

    const amount1 = 500;
    const amount2 = 300;
    const amount3 = 150;
    const amount4 = 100;

    await createStatementUseCase.execute({
      user_id,
      amount: amount1,
      type: "deposit" as OperationType,
      description: "deposit at bank",
    });
    await createStatementUseCase.execute({
      user_id,
      amount: amount2,
      type: "withdraw" as OperationType,
      description: "deposit at bank",
    });
    await createStatementUseCase.execute({
      user_id,
      amount: amount3,
      type: "deposit" as OperationType,
      description: "deposit at bank",
    });
    await createStatementUseCase.execute({
      user_id,
      amount: amount4,
      type: "withdraw" as OperationType,
      description: "deposit at bank",
    });
    const getBalance = await getBalanceUseCase.execute({ user_id });
    const total = amount1 - amount2 + amount3 - amount4;

    expect(getBalance.balance).toEqual(total);
  });
});
