import { length } from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne
  } from "typeorm";
import { Offers } from "./Offers";
import { Orders } from "./Orders";

  @Entity()
  export class OrderOffers{
      @PrimaryGeneratedColumn()
      id: number

      @Column()
      quantity: number;

      @Column({nullable:true})
      offerPrice: number;
   
      
      @ManyToOne(()=>Orders, Orders=>Orders.OrderOffers,{
        cascade: ["insert", "update"]})
        Orders: Orders;
  
      @ManyToOne(()=> Offers, Offers=> Offers.OrderOffers,{
        cascade: ["insert", "update"]})
      offers: Offers;


  }