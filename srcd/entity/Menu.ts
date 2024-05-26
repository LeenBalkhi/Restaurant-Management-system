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
import { Section } from "./Section";

@Entity()
export class Menu{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name:string;

    @OneToMany(()=> Section, Section=> Section.menu,{
      cascade: ["insert", "update"]})
    sections: Section[];
}