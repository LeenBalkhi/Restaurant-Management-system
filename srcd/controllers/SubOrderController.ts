import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { SubOrder } from "../entity/SubOrder";

class SubOrderController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const Suborder = await queryRunner.manager
      .createQueryBuilder()
      .select("SubOrder")
      .from(SubOrder, "SubOrder")
      .getMany();

    res.send(Suborder);
  };
  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const suborder = await queryRunner.manager
        .createQueryBuilder()
        .select("SubOrder")
        .from(SubOrder, "SubOrder")
        .where("SubOrder.id= :ids", { ids: id })
        .getMany();
      res.send(suborder);
    } catch (error) {
      res.status(404).send("suborder not found");
    }
  };
  static newSubOrder = async (req: Request, res: Response) => {
    let { quantity, action, OrderMeals, subOrderIngredients } = req.body;
    const suborder = new SubOrder();
    suborder.quantity = quantity;
    suborder.action = action;
    suborder.OrderMeals = OrderMeals;
    suborder.subOrderIngredients = subOrderIngredients;

    //Validade if the parameters are ok
    const errors = await validate(suborder);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(suborder);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send("suborder creation was unsuccessful, it already exists");
    } finally {
      await queryRunner.release();
      res.status(201).send("suborder created");
    }
  };
  static editSubOrder = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { quantity, action, OrderMeals, subOrderIngredients } = req.body;
    let suborder;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      const Meal = await queryRunner.manager
        .createQueryBuilder()
        .select("SubOrder")
        .from(SubOrder, "SubOrder")
        .where("SubOrder.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("meal not found");
    }

    suborder.quantity = quantity;
    suborder.action = action;
    suborder.OrderMeals = OrderMeals;
    suborder.subOrderIngredients = subOrderIngredients;
    const errors = await validate(suborder);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(suborder);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("suborder edit was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("suborder created");
    }
  };
  static deleteSubOrder = async (req: Request, res: Response) => {
    const id = req.params.id;
    let suborder;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      suborder = await connection
        .createQueryBuilder()
        .select("SubOrder")
        .from(SubOrder, "SubOrder")
        .where("SubOrder.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("suborder not found");
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(suborder);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("suborder deletion was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("suborder deleted");
    }
  };
}

export default SubOrderController;
