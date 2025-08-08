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
import { ingredients } from "./Ingredients";
import { SubOrder } from "./SubOrder";

  @Entity()
  export class SubOrderIngredient{
      @PrimaryGeneratedColumn()
      id : number

      @ManyToOne(()=>ingredients, ingredients=> ingredients.subOrderIngredients,{
        cascade: ["insert", "update"]})
      ingredient: ingredients;

      @ManyToOne(()=>SubOrder, SubOrder=> SubOrder.subOrderIngredients,{
        cascade: ["insert", "update"]})
      subOrder: SubOrder;
  }