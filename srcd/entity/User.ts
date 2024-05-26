import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
    JoinColumn
  } from "typeorm";
  import { Length, IsNotEmpty } from "class-validator";
  import * as bcrypt from "bcryptjs";
import { UserBills } from "./UserBills";
import { Orders } from "./Orders";
import { Staff } from "./Staff";
  

 


@Entity()
  export  class User {
    @PrimaryGeneratedColumn()
    id: number;
  


    
    @Column()
    @Length(4, 20)
    username: string;
  
    @Column()
    @Length(4, 100)
    password: string;

  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(()=>UserBills, UserBills=> UserBills.User)
    UserBills: UserBills[]

   /* @OneToMany(()=>Orders, Orders=> Orders.User)
    Orders: Orders[];*/
    @OneToMany(()=>Orders, Orders=> Orders.user,{
      cascade: ["insert","update"]
    })
    orders: Orders[];
  
   

    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }
  }