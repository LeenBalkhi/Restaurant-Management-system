import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    Timestamp,
    Table,
    OneToOne
  } from "typeorm";
import { ingredients } from "./Ingredients";
import { Meals } from "./Meal";

@Entity()
@Unique(["meal", "ingredient"])
  export class MealIngredients{
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      quantity: number;

      @Column({nullable: true})
      unit: string;

      @ManyToOne(()=> Meals, Meals => Meals.MealIngredients,{
        cascade: ["insert", "update"]})
      meal:Meals;

      @ManyToOne(()=>ingredients, ingredients => ingredients.MealIngredients,{
        cascade: ["insert", "update"]})
      ingredient: ingredients;
      
  }