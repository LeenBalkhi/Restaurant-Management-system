import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";

import { Staff } from "../entity/Staff";
import { getManager } from "typeorm";
import { User } from "../entity/User";
class staffController {
  static listAll = async (req: Request, res: Response) => {
    //here we can add an option to get only a certain number of rows
    // this can be used in the front end in order for the laoding to not take
    // a long time. this way a certin number of rows will load per page
    //we can aslo cash and order by DESc or ASC

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get staffs from database

    const staffs = await queryRunner.manager
      .createQueryBuilder()
      .select(["staff.username", "staff.role"])
      .from(Staff, "staff")
      .where("staff.role != :role", { role: "customer" })
      .getMany();
    //Send the staffs object
    res.send(staffs);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get the staff from database
    try {
      const staff = await queryRunner.manager
        .createQueryBuilder()
        .select(["staff.username", "staff.role"])
        .from(Staff, "staff")
        .where("staff.id= :ids", { ids: id })
        .getMany();
      res.send(staff);
    } catch (error) {
      res.status(404).send("staff not found");
    }
  };

  static newstaff = async (req: Request, res: Response) => {
    //Get parameters from the body
    let reqStaff = req.body;
    let user = new User();
    let staff = new Staff();
    user.username = reqStaff.staffName;
    user.password = reqStaff.password;
    staff.role = reqStaff.role;

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({ message: "not valid input", error: errors });
      return;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      let savedUser = await queryRunner.manager.save(user);
      staff.id = savedUser.id;
      const errors = await validate(user);
      if (errors.length > 0) {
        await queryRunner.rollbackTransaction();
        res.status(400).send({ message: "not valid input", error: errors });
        return;
      }
      await queryRunner.manager.save(staff);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({
          message: "staff creation was unsuccessful, it already exists",
          error: err,
        });
    } finally {
      let newStaff = {
        username: user.username,
        id: staff.id,
        role: staff.role,
      };
      await queryRunner.release();
      res.status(201).send({ message: "staff created", staff: newStaff });
    }
  };

  static editstaff = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get values from the body
    const { staffname, role } = req.body;

    //Try to find staff on database
    let staff;
    try {
      staff = await queryRunner.manager
        .createQueryBuilder()
        .select("staff")
        .from(Staff, "staff")
        .where("staff.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("staff not found");
      return;
    }

    //Validate the new values on model
    staff.staffname = staffname;
    staff.role = role;
    const errors = await validate(staff);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(staff);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("staff edit was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("staff created");
    }
  };
  static editstaffRole = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get values from the body
    const role = req.body.role;
    if(role==null){
      res.status(401).send({error:"new role is requerd"});
      return;


    }

    //Try to find staff on database
    let staff;
    try {
      staff = await queryRunner.manager
        .createQueryBuilder()
        .select("staff")
        .from(Staff, "staff")
        .where("staff.id= :ids", { ids: id })
        .getOneOrFail();
         //Validate the new values on model
    staff.role = role;
    console.log(role);
    console.log(staff);
    const errors = await validate(staff);
    if (errors.length > 0) {
      res.status(400).send({error:errors});
      return;
    }

    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(staff);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send({error:err,message:"staff edit was unsuccessful"});
    } finally {
      await queryRunner.release();
      res.status(201).send({message:"staff roles  updated"});
    }
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send({error:error,message:"staff not found"});
      return;
    }

   
  };

  static deletestaff = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    let staff;
    try {
      staff = await queryRunner.manager
        .createQueryBuilder()
        .select("staff")
        .from(Staff, "staff")
        .where("staff.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("staff not found");
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(staff);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("staff deletion was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("staff deleted");
    }
  };
}

export default staffController;
