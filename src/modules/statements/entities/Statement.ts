import { Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UniqueMetadataArgs } from "typeorm/metadata-args/UniqueMetadataArgs";
import { v4 as uuid } from "uuid";

import { User } from "../../users/entities/User";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

@Entity("statements")
class Statement {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column("uuid")
  user_id: string;

  @ManyToOne(() => User, (user) => user.statement)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column("uuid")
  sender_id: string;

  @Column("uuid")
  receiver_id: string;

  @Column()
  description: string;

  @Column("decimal", { precision: 5, scale: 2 })
  amount: number;

  @Column({ type: "enum", enum: OperationType })
  type: OperationType;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @Expose({ name: "type_Custom" })
  // eslint-disable-next-line consistent-return
  typeCustom(): string {
    if (this.type === OperationType.TRANSFER && this.receiver_id !== null) {
      return `${this.type} sended`;
    }
    if (this.type === OperationType.TRANSFER && this.sender_id !== null) {
      return `${this.type} received`;
    }
    return this.type;
  }

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { OperationType, Statement };
