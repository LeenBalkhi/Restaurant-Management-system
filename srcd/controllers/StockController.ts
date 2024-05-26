import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";

import { Stock } from "../entity/Stock";

class StockController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get stock from database

    const stock = await queryRunner.manager
      .createQueryBuilder()
      .select("stocks")
      .from(Stock, "stocks")
      .getMany();
    //Send the stock object
    res.send(stock);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get the stock from database
    try {
      const stock = await queryRunner.manager
        .createQueryBuilder()
        .select("stocks")
        .from(Stock, "stocks")
        .where("stocks.id= :ids", { ids: id })
        .getMany();
      res.send(stock);
    } catch (error) {
      res.status(404).send("stock not found");
    }
  };

  static newStock = async (req: Request, res: Response) => {
    //Get parameters from the body
    let stock = new Stock();
    //Validade if the parameters are ok
    const errors = await validate(stock);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(stock);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({ error: "stock creation was unsuccessful, it already exists" });
    } finally {
      await queryRunner.release();
      res.status(201).send({ successful: "stock created" });
    }
  };

  static deleteStock = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    let stock;
    try {
      stock = await queryRunner.manager
        .createQueryBuilder()
        .select("stocks")
        .from(Stock, "stocks")
        .where("stocks.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("stock not found");
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(stock);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send({ error: "stock deletion was unsuccessful" });
    } finally {
      await queryRunner.release();
      res.status(201).send({ successful: "stock deleted" });
    }
  };
}

export default StockController;
