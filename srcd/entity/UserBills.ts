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
    OneToOne
  } from "typeorm";
import { Bills } from "./Bills";
import { Booking } from "./Booking";
import { Resttables } from "./Table";
import { User } from "./User";

  @Entity()
  export class UserBills{
      @PrimaryGeneratedColumn()
      id: number;

      @OneToOne(()=> Bills, Bills=> Bills.UserBills,{
          cascade: ["insert", "update"]
      })
      bills: Bills;

      @ManyToOne(()=> User, User=> User.UserBills)
      User: User;

      @OneToMany(()=>Booking, Booking=> Booking.UserBills,{
        cascade: ["insert", "update"]})
        Booking: Booking[]

     

  }