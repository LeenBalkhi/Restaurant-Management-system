import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { Customer } from "../entity/Customer";

class CustomerController{
    static listAll = async (req: Request, res: Response) => {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        //Get staffs from database
        
        const customers =  await queryRunner.manager.createQueryBuilder().
              select(['Customer.username']).from(Customer, "Customer").getMany();
        //Send the staffs object
        res.send(customers);
    };
    static getOneById = async (req: Request, res: Response) => {
          //Get the ID from the url
        const id: string = req.params.id;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        //Get the staff from database
        try {
          const customer = await queryRunner.manager.createQueryBuilder().
          select(['Customer.username']).from(Customer, "Customer").where("Customer.id= :ids", {ids : id}).getMany(); 
          res.send(customer);
         } catch (error) {
          res.status(404).send("staff not found");
        }
    };
    static newCustomer = async (req: Request, res: Response) => {
          //Get parameters from the body
        let { username, password } = req.body;
        let customer = new Customer();
        customer.username = username;

        //Validade if the parameters are ok
        const errors = await validate(customer);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }
    
        //Hash the password, to securely store on DB
        customer.hashPassword();
    
              const connection = getConnection();
              const queryRunner = connection.createQueryRunner();
              await queryRunner.connect();
              await queryRunner.startTransaction("SERIALIZABLE");
    
              try {
                  await queryRunner.manager.save(customer);
                  await queryRunner.commitTransaction();

              } catch (err) {
                  await queryRunner.rollbackTransaction();
                  res.status(409).send("staff creation was unsuccessful, it already exists");

              } finally {
                  await queryRunner.release();
                  res.status(201).send("staff created");
              }
    };
    static editCustomer = async (req: Request, res: Response) => {
        //??
    };
    static deleteCustomer = async (req: Request, res: Response) => {};

};

export default CustomerController;