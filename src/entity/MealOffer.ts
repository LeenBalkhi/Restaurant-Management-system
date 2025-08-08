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
import { Meals } from "./Meal";
import { Offers } from "./Offers";
  @Entity()
  export class MealOffer{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity:number;

    @ManyToOne(()=>Meals, Meals=>Meals.MealOffers,{
      cascade: ["insert", "update"]})
    Meals: Meals;

    @ManyToOne(()=> Offers, Offers=> Offers.mealOffers,{
      cascade: ["insert", "update"]})
    Offers: Offers;
  }