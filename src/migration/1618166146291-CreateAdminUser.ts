import { userInfo } from "os";
import {CustomRepositoryCannotInheritRepositoryError, MigrationInterface, QueryRunner} from "typeorm";
import { getRepository } from "typeorm";
import { Customer } from "../entity/Customer";
import { Role, Staff } from "../entity/Staff";
import { User } from "../entity/User";

export class CreateAdminUser1618166146291 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      let user=new User();
        let staff = new Staff();
        user.username = "admin";
        user.password = "admin";
        user.hashPassword();
        staff.role = Role.ADMIN;
        const userRepository = getRepository(User);
        let newuser=  await userRepository.save(user);
        staff.id=newuser.id;
        const staffRepository = getRepository(Staff);
        await staffRepository.save(staff);
        let witer = new Staff();
        user=new User();
        user.username = "waiter";
        user.password = "waiter";
        user.hashPassword();
        staff.role = Role.WAITER;
         newuser=  await userRepository.save(user);
        staff.id=newuser.id;
        await staffRepository.save(staff);
        user=new User();
        user.username = "customer";
        user.password = "customer";
        user.hashPassword();
         newuser=  await userRepository.save(user);
         let customer = new Customer();
         customer.id=newuser.id;

         const custommerRepository = getRepository(Customer);
         await custommerRepository.save(customer);

      }
    
      public async down(queryRunner: QueryRunner): Promise<any> {}
    }
