import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    amount,
    description,
    sender_id,
    receiver_id,
  }: ICreateTransferDTO): Promise<Statement[]> {
    const sender = await this.usersRepository.findById(sender_id as string);

    if (!sender) {
      throw new CreateTransferError.UserNotFound();
    }

    const receiver = await this.usersRepository.findById(receiver_id as string);

    if (!receiver) {
      throw new CreateTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id as string,
    });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }

    const transferOperation = await this.statementsRepository.createTransfer({
      sender_id,
      receiver_id,
      amount,
      description,
    });
    return transferOperation;
  }
}

export { CreateTransferUseCase };
