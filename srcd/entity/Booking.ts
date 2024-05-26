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
import staffController from "../controllers/StaffController";
import { Bills } from "./Bills";
import { Staff } from "./Staff";
import { Resttables } from "./Table";
import { UserBills } from "./UserBills";
// type confirmed / pending
@Entity()
export class Booking{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column({ type: 'time' })
    time: string;
     
    @Column({ type: 'date' })
    date: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

      @ManyToOne(()=> UserBills, UserBills => UserBills.Booking ,{
        cascade: ["insert", "update"]})
        UserBills: UserBills


      @ManyToOne(()=>Resttables, Resttables=> Resttables.Booking)
      Resttables: Resttables;


  }
