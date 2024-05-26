
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
  import { StockIngredient } from "./StockIngredient";

@Entity()
export class Stock{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
    
    @OneToMany(()=>StockIngredient, StockIngredient=> StockIngredient.stock,{
      cascade: ["insert","update"]
    })
    stockIngredient: StockIngredient[];

  
}