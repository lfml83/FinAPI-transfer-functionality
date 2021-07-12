import { Statement } from "../entities/Statement";

export class BalanceMap {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static toDTO({
    statement,
    balance,
  }: {
    statement: Statement[];
    balance: number;
  }) {
    const parsedStatement = statement.map(
      ({
        id,
        amount,
        description,
        type,
        created_at,
        updated_at,
        typeCustom,
        sender_id,
        receiver_id,
      }) => ({
        id,
        sender_id,
        receiver_id,
        amount,
        description,
        type,
        typeCustom,
        created_at,
        updated_at,
      })
    );

    return {
      statement: parsedStatement,
      balance: Number(balance),
    };
  }
}
