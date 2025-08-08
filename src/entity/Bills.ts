import { length } from "class-validator";
import { userInfo } from "os";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    OneToOne,
    JoinColumn
  } from "typeorm";
import { Booking } from "./Booking";
import { Orders } from "./Orders";
import { User } from "./User";
import { UserBills } from "./UserBills";

// status instead of type: paid /unpaid
  @Entity()
  export class Bills{
      @PrimaryGeneratedColumn()
      id: number

      @Column()
      total: number;

      @Column()
      discount: number;

      @Column()
      fee: number

      @Column()
      totalWithFee: number

      @Column({default: "bill"})
      type: string;

      @Column("datetime")
      datetime: Date
      
      @OneToOne(()=> Orders,Orders=> Orders.Bill, {
        cascade: ["insert", "update"]})
      Order :number;

      @OneToOne(()=>UserBills, UserBills=> UserBills.bills,{
        cascade: ["insert","update"]
      })
      UserBills: UserBills;

  }