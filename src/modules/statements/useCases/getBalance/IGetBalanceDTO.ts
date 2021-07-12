export interface IGetBalanceDTO {
  user_id: string;
  receiver_id?: string;
  with_statement?: boolean;
}
