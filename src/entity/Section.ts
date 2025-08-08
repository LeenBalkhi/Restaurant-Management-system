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
import { Menu } from "./Menu";
  @Entity()
export class Section{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @OneToMany(()=> Meals, Meals=> Meals.section,{
      cascade: ["insert", "update"]})
    meals:Meals[];
    cascade: ["insert", "update"]

    @ManyToOne(()=> Menu, Menu=>Menu.sections,{
      cascade: ["insert", "update"]})
    menu:Menu;

}