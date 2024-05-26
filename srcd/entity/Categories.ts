import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne
  } from "typeorm"
import { ingredients } from "./Ingredients";

  @Entity()
  export class Categories{
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      category:string

      @OneToMany(()=> ingredients, ingredients=>ingredients.categories,{
        cascade: ["insert", "update"]})
       ingredient: ingredients[];
    }