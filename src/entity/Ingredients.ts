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
  import { Length, IsNotEmpty } from "class-validator";
import { StockIngredient } from "./StockIngredient";
import { Categories } from "./Categories";
import { SubOrderIngredient } from "./SubOrderIngredient";
import { SubOrder } from "./SubOrder";
import { MealIngredients } from "./MealIngredients";


  @Entity()
  export class ingredients{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
  
    @Column()
    measurment: string;
//unit price
    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column()
    minthreshold: number;

 
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
    
    @OneToMany(() => StockIngredient, stockIngredient => stockIngredient.ingredients,{
      cascade: ["insert", "update"]})
    stockIngredient: StockIngredient[];

    @ManyToOne(()=> Categories, Categories => Categories.ingredient,{
      cascade: ["insert", "update"]} )
    categories: Categories

    @OneToMany(()=>SubOrderIngredient, SubOrderIngredient=> SubOrderIngredient.ingredient,{
      cascade: ["insert", "update"]})
    subOrderIngredients: SubOrderIngredient[];

    @OneToMany(()=> MealIngredients, MealIngredients=>MealIngredients.ingredient,{
      cascade: ["insert", "update"]})
    MealIngredients: MealIngredients[];
  }