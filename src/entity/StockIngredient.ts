
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    Double
  } from "typeorm";
  import { Length, IsNotEmpty } from "class-validator";
  import { ingredients } from "./Ingredients";
  import { Stock } from "./Stock";

import { Categories } from "./Categories";

@Entity()
export class StockIngredient{

    @PrimaryGeneratedColumn()
    id: number;


    @Column({ type: 'date' })
    expirationDate: Date;
     
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
    
    @Column()
    quantity: number;
    @Column({ type: 'double' })
    price: Double;

    @ManyToOne(()=> Stock, Stock=> Stock.stockIngredient,{
      cascade: ["insert", "update"]
    })
    stock: Stock;
    @ManyToOne(()=> ingredients, ingredients=> ingredients.stockIngredient,{
      cascade: ["insert", "update"]})
    ingredients: ingredients;

  
  
}