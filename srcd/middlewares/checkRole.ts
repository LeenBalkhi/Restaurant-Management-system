import { Request, Response, NextFunction } from "express";
import { StatOptions } from "http2";
import { CustomRepositoryCannotInheritRepositoryError, getRepository } from "typeorm";
import { Customer } from "../entity/Customer";
import { Role, Staff } from "../entity/Staff";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;
    console.log(id);
    let userRole;
    //Get user role from the database
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne(id);
    if(customer!=null){
      userRole=Role.CUSTOMER;
    }
    else{
      const staffRepository = getRepository(Staff);
    
      let staff: Staff;
      try {
        staff = await staffRepository.findOneOrFail(id);
        userRole=staff.role;
        
      } catch (id) {
        res.status(401).send({message :"you are not authorized "});
        return;
      }
    }


    

    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(userRole) > -1) next();
    else res.status(401).send();
  };
};