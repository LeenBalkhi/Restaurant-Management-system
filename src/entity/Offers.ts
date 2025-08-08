import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable
  } from "typeorm";
import { Meals } from "./Meal";
import { MealOffer } from "./MealOffer";
import { OrderOffers } from "./OrderOffers";


  @Entity()
  export class Offers{
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      name:string;

      @Column()
      price: number;
      
      @Column({ type: 'date' })
      expirationDate: Date;

      @OneToMany(()=> MealOffer, MealOffer=> MealOffer.Offers,{
        cascade: ["insert", "update"]})
      mealOffers: MealOffer[];
      
      @OneToMany(()=>OrderOffers, OrderOffers=> OrderOffers.offers,{
        cascade: ["insert", "update"]})
        OrderOffers: OrderOffers[];


  }