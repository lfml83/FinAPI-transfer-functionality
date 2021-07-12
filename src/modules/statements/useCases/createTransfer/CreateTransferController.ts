import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { amount, description } = request.body;
    const { id: sender_id } = request.user;
    const { user_id: receiver_id } = request.params;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const statement = await createTransfer.execute({
      amount,
      description,
      sender_id,
      receiver_id,
    });

    return response.status(201).json(statement);
  }
}
