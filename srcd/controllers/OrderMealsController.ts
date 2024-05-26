import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { OrderMeals } from "../entity/OrderMeals";
import { Orders } from "../entity/Orders";

class OrderMealsController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const orderMeals = await queryRunner.manager
      .createQueryBuilder()
      .select("OrderMeals")
      .from(OrderMeals, "OrderMeals")
      .getMany();

    res.send(orderMeals);
  };
  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const orderMeals = await queryRunner.manager
        .createQueryBuilder()
        .select("OrderMeals")
        .from(OrderMeals, "OrderMeals")
        .where("OrderMeals.id= :ids", { ids: id })
        .getMany();
      res.send(orderMeals);
    } catch (error) {
      res.status(404).send("order-meal not found");
    }
  };

  static newOrderMeals = async (req: Request, res: Response) => {
    let reqOrder = req.body;
    const orderMeal = new OrderMeals();
    orderMeal.quantity = reqOrder.quantity;
    //orderMeal.unitprice = reqOrder.unitprice;
    orderMeal.Meals = reqOrder.mealsId;
    orderMeal.Orders = reqOrder.ordersId;

    //Validade if the parameters are ok
    const errors = await validate(orderMeal);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      let savedOrder = await queryRunner.manager.save(orderMeal);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send("order-meal creation was unsuccessful, it already exists");
    } finally {
      await queryRunner.release();
      res.status(201).send("order-meal created");
    }
  };
  static editOrderMeals = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { quantity, unitprice, meals, orders } = req.body;
    let orderMeal;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      const Meal = await queryRunner.manager
        .createQueryBuilder()
        .select("OrderMeals")
        .from(OrderMeals, "OrderMeals")
        .where("OrderMeals.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("order-meal not found");
    }

    orderMeal.quantity = quantity;
    orderMeal.unitprice = unitprice;
    orderMeal.Meals = meals;
    orderMeal.Orders = orders;
    const errors = await validate(orderMeal);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(orderMeal);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("order-meal edit was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("order-meal created");
    }
  };
  static deleteOrderMeals = async (req: Request, res: Response) => {
    const id = req.params.id;
    let orderMeal;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      orderMeal = await connection
        .createQueryBuilder()
        .select("OrderMeals")
        .from(OrderMeals, "OrderMeals")
        .where("OrderMeals.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("order-meal not found");
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(orderMeal);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("order-meal deletion was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("order-meal deleted");
    }
  };
}

export default OrderMealsController;
