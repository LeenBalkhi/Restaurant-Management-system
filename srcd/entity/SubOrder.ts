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
import { OrderMeals } from "./OrderMeals";
import { SubOrderIngredient } from "./SubOrderIngredient";

enum action{
    SUBTRACT= "subtract",
    ADD = "add"
}

  @Entity()
  export class SubOrder{
      @PrimaryGeneratedColumn()
      id:number;

      @Column()
      quantity: number;

     
      @Column({
        type: "enum",
        enum: action
      })
      action: action
      
      @ManyToOne(()=>OrderMeals)
      OrderMeals: OrderMeals;

      @OneToMany(()=> SubOrderIngredient, SubOrderIngredient=> SubOrderIngredient.subOrder,{
        cascade: ["insert", "update"]})
      subOrderIngredients: SubOrderIngredient[];

  }