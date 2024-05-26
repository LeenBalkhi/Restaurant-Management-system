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
import { Booking } from "./Booking";
  import { UserBills } from "./UserBills";


  export enum state{
      OCCUPIED ="occupied",
      AVAILABLE = "available",
      BOOKED = "booked",
      DIRTY = "dirty"
  }
  @Entity()
  export class Resttables{
      @PrimaryGeneratedColumn()
      id: number

      @Column()
      tableNumber:number

      @Column()
      seatsNumber:number

      @Column({
        type: "enum",
        enum: state
      })
      state: state
 
      @Column()
      @CreateDateColumn()
      createdAt: Date;
    
      @Column()
      @UpdateDateColumn()
      updatedAt: Date;
      
     

      @OneToMany(()=>Booking,Booking=>Booking.Resttables)
      Booking: Booking[];
  }
