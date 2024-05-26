import { length } from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    PrimaryColumn,
    OneToOne,
    JoinColumn
  } from "typeorm";
import { User } from "./User";

  @Entity()
  export class Customer {
    @PrimaryColumn()
    id: number;
    @OneToOne(() => User, {
      cascade:  ["insert", "update"]}) // specify inverse side as a second parameter
    @JoinColumn({ name: "id" })
    user: User;
    
  }