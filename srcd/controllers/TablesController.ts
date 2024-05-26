import { Request, Response } from "express";
import { getConnection, getRepository, Table } from "typeorm";
import { validate } from "class-validator";
import { Resttables } from "../entity/Table";
import { state } from "../entity/Table";


class tableController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const table = await queryRunner.manager
      .createQueryBuilder()
      .select("Resttables")
      .from(Resttables, "Resttables")
      .getMany();

    res.send(table);
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const table = await queryRunner.manager
        .createQueryBuilder()
        .select("Resttables")
        .from(Resttables, "Resttables")
        .where("Resttables.id= :ids", { ids: id })
        .getMany();
      res.send(table);
    } catch (error) {
      res.status(404).send("table not found");
    }
  };

  static newtable = async (req, res: Response) => {
    let tableReq = req.body;
    const table = new Resttables();
    table.tableNumber = tableReq.tableNumber;
    table.seatsNumber = tableReq.seatsNumber;

    table.state = state.AVAILABLE;
    if(table.tableNumber==null||table.seatsNumber==null){
      res.status(409);//.send({ error: err });
    
      return {error:"all fields are requierd"};
    }

    //Validade if the parameters are ok
    const errors = await validate(table);
    if (errors.length > 0) {
      res.status(400).send({error:errors});
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(table);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({message:"table creation was unsuccessful, it already exists",error:err});
        
    } finally {
      await queryRunner.release();
      res.status(201);
      return({message:"table created"});
    }
  };
  static edittable = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { TableNumber, state, booking } = req.body;
    let table;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      const Meal = await queryRunner.manager
        .createQueryBuilder()
        .select("meals")
        .from(Resttables, "meals")
        .where("meals.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("meal not found");
    }
    table.TableNumber = TableNumber;
    table.state = state;
    table.booking = booking;
    const errors = await validate(table);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(table);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("table edit was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("table created");
    }
  };
  static deletetable = async (req: Request, res: Response) => {
    const id = req.params.id;
    let table;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      table = await connection
        .createQueryBuilder()
        .select("Resttables")
        .from(Resttables, "Resttables")
        .where("Resttables.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("table not found");
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(table);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("table deletion was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("table deleted");
    }
  };
}

export default tableController;
