import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { SubOrderIngredient } from "../entity/SubOrderIngredient";
import { SubOrder } from "../entity/SubOrder";

class SubOrderIngredientController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const subOrderIngredients = await queryRunner.manager
      .createQueryBuilder()
      .select("SubOrderIngredient")
      .from(SubOrderIngredient, "SubOrderIngredient")
      .getMany();

    res.send(subOrderIngredients);
  };
  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const subOrderIngredients = await queryRunner.manager
        .createQueryBuilder()
        .select("SubOrderIngredient")
        .from(SubOrderIngredient, "SubOrderIngredient")
        .where("SubOrderIngredientid= :ids", { ids: id })
        .getMany();
      res.send(subOrderIngredients);
    } catch (error) {
      res.status(404).send("SubOrderIngredient not found");
    }
  };
  static newSubOrderIngredient = async (req: Request, res: Response) => {
    let { ingredient, subOrder } = req.body;
    const subOrderIngredients = new SubOrderIngredient();
    subOrderIngredients.ingredient = ingredient;
    subOrderIngredients.subOrder = subOrder;

    //Validade if the parameters are ok
    const errors = await validate(subOrderIngredients);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(subOrderIngredients);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send(
          "subOrderIngredients creation was unsuccessful, it already exists"
        );
    } finally {
      await queryRunner.release();
      res.status(201).send("subOrderIngredients created");
    }
  };
  static editSubOrderIngredient = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { ingredient, subOrder } = req.body;
    let subOrderIngredients;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      const Meal = await queryRunner.manager
        .createQueryBuilder()
        .select("SubOrderIngredient")
        .from(SubOrderIngredient, "SubOrderIngredient")
        .where("SubOrderIngredient.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("SubOrderIngredient not found");
    }

    subOrderIngredients.ingredient = ingredient;
    subOrderIngredients.subOrder = subOrder;
    const errors = await validate(subOrderIngredients);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(subOrderIngredients);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("subOrderIngredients edit was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("subOrderIngredients created");
    }
  };
  static deleteSubOrderIngredient = async (req: Request, res: Response) => {
    const id = req.params.id;
    let subOrderIngredients;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      subOrderIngredients = await connection
        .createQueryBuilder()
        .select("SubOrderIngredient")
        .from(SubOrderIngredient, "SubOrderIngredient")
        .where("SubOrderIngredient.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("SubOrderIngredient not found");
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(subOrderIngredients);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("subOrderIngredients deletion was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("subOrderIngredients deleted");
    }
  };
}

export default SubOrderIngredientController;
