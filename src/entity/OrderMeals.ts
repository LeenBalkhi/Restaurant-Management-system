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
import { Meals } from "./Meal";
import { MealOffer } from "./MealOffer";
import { Orders } from "./Orders";

  @Entity()
  export class OrderMeals{
      @PrimaryGeneratedColumn()
      id: number

      @Column()
      quantity: number;

      @Column({nullable:true})
      mealPrice: number;
      
      @ManyToOne(()=>Meals,{
        cascade: ["insert", "update"]})
      Meals: Meals;

      @ManyToOne(()=>Orders,{
        cascade: ["insert", "update"]})
      Orders: Orders;


  }