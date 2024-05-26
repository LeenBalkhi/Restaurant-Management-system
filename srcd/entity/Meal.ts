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
import { MealIngredients } from "./MealIngredients";
import { MealOffer } from "./MealOffer";
import { OrderMeals } from "./OrderMeals";
import { Section } from "./Section";

  @Entity()
  export class Meals{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({default: true})
    available: boolean;
    @Column({default: "http://localhost:3307/images/dish.JPG"})
    imageUrl: string;
    

    @Column()
    description: string;
    
    @Column()
    price: number

    @ManyToOne(()=> Section, Section => Section.meals ,{
      cascade: ["insert", "update"]})
    section: Section

    @OneToMany(()=>MealOffer, MealOffer=> MealOffer.Meals,{
      cascade: ["insert", "update"]})
    MealOffers: MealOffer[]

    @OneToMany(()=>OrderMeals, OrderMeals=> OrderMeals.Meals,{
      cascade: ["insert", "update"]})
    OrderMeals: OrderMeals[]

    @OneToMany(()=>MealIngredients, MealIngredients => MealIngredients.meal,{
      cascade: ["insert", "update"]})
    MealIngredients : MealIngredients[];
  
    //meal ingredients

  }