import { getRepository, Repository } from "typeorm";

import { OperationType, Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    type,
    amount,
    description,
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      type,
      amount,
      description,
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({
    statement_id,
    user_id,
  }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id },
    });
  }

  async getUserBalance({
    user_id,
    with_statement = false,
  }: IGetBalanceDTO): Promise<
    { balance: number } | { balance: number; statement: Statement[] }
  > {
    const statement = await this.repository.find({
      where: { user_id },
    });

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === "deposit") {
        return acc + Number(operation.amount);
      }
      if (operation.type === "withdraw") {
        return acc - Number(operation.amount);
      }
      if (operation.type === "transfer" && operation.sender_id !== null) {
        return acc + Number(operation.amount);
      }

      return acc - Number(operation.amount);
    }, 0);
    if (with_statement) {
      return {
        statement,
        balance,
      };
    }

    return { balance };
  }
  async createTransfer({
    amount,
    description,
    receiver_id,
    sender_id,
  }: ICreateTransferDTO): Promise<Statement[]> {
    const senderTransfer = this.repository.create({
      user_id: sender_id,
      receiver_id,
      amount,
      description,
      type: OperationType.TRANSFER as OperationType,
    });

    const ReceiverTransfer = this.repository.create({
      user_id: receiver_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER as OperationType,
    });
    console.log(senderTransfer);
    await this.repository.save(senderTransfer);
    await this.repository.save(ReceiverTransfer);

    return [senderTransfer, ReceiverTransfer];
  }
}
