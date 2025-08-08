import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";

import config from "../config/config";
import { Staff } from "../entity/Staff";
import { User } from "../entity/User";
import { Customer } from "../entity/Customer";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let userreq = req.body;
    let username = userreq.username,
      password = userreq.password;
    if (!(username && password)) {
      res.status(400).send();
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");
    try {
      //  user = await userRepository.findOneOrFail({ where: { username } });
      user = await queryRunner.manager
        .createQueryBuilder()
        .select("User")
        .from(User, "User")
        .where("User.username= :names", { names: username })
        .getOneOrFail();
    } catch (error) {
      await queryRunner.commitTransaction();
      await queryRunner.release();

      res.status(401).send(error);
      return;
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      await queryRunner.commitTransaction();
      await queryRunner.release();

      res.status(401).send({ message: "password not valid" });
      return;
    }


    
    
    let role;
    let customer = await queryRunner.manager
      .createQueryBuilder()
      .select("Customer")
      .from(Customer, "Customer")
      .where("Customer.id= :ids", { ids: user.id })
      .getOne();
    if (customer == null) {
      let staff = await queryRunner.manager
        .createQueryBuilder()
        .select("Staff")
        .from(Staff, "Staff")
        .where("Staff.id= :ids", { ids: user.id })
        .getOne();
      role = staff.role;
    } else {
      role = "customer";
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: role },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    const jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    console.log("10000koko");

    console.log(jwtPayload);

    await queryRunner.commitTransaction();
    await queryRunner.release();

    //Send the jwt in the response
    res.status(200).send({
      userId: user.id,
      username: user.username,
      token: token,
      role: role,
    });
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;
