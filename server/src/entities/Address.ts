import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column("float")
  lng: number;

  @Column("float")
  lat: number;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
