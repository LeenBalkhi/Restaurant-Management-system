import { Length } from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    PrimaryColumn
  } from "typeorm";
import { Booking } from "./Booking";
  import { User } from "./User";
  
  export enum Role {
    ADMIN = "admin",
    CHEF = "chef",
    WAITER = "waiter",
    CASHIER = "cashier",
    CUSTOMER = "customer"
}

  @Entity()
  export class Staff  {

    @PrimaryColumn()
    id: number;
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
    @OneToOne(() => User, {
      cascade:  ["insert", "update"]}) // specify inverse side as a second parameter
    @JoinColumn({ name: "id" })
    user: User;

    @Column({
      type: "enum",
      enum: Role
    })
    role: Role
  
    


  }