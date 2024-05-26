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
import { OrderMeals } from "./OrderMeals";
import { OrderOffers } from "./OrderOffers";
import { User } from "./User";

export enum Status {
  UNVERIFIED="unverified",
  VERIFIED = "verified",
  CANCELD =  "canceled",
  PREPARE =  "prepare",
  FINISHED = "finished"
}


  @Entity()
  export class Orders{
      @PrimaryGeneratedColumn()
      id: number
      

      @Column({
        type: "enum",
        enum: Status
      })
      status: Status
      
      @Column()
      @CreateDateColumn()
      createdAt: Date;
      
      @OneToMany(()=>OrderMeals, OrderMeals=> OrderMeals.Orders,{
        cascade: ["insert", "update"]})
      OrderMeals: OrderMeals[];

      @OneToMany(()=>OrderOffers, OrderOffers=> OrderOffers.Orders,{
        cascade: ["insert", "update"]})
        OrderOffers: OrderOffers[];
      
      

      @OneToOne(()=>Bills, Bills=> Bills.Order,{
        cascade: ["insert", "update"]})
      Bill : Bills;

      @Column({    nullable: false,
      })
      @ManyToOne(()=> User, User=>User.orders)
      user: number;

  }
