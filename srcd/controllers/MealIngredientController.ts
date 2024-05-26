import { Request, Response } from "express";
import {
  createQueryBuilder,
  getConnection,
  getManager,
  getRepository,
} from "typeorm";
import { validate } from "class-validator";
import { MealIngredients } from "../entity/MealIngredients";

class MealIngredientsController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const MealIngredient = await queryRunner.manager
      .createQueryBuilder()
      .select("MealIngredients")
      .from(MealIngredients, "MealIngredients")
      .getMany();

    res.send({
      message: "meal listAll was successful",
      MealIngredient: MealIngredients,
    });
  };
  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const MealIngredient = await queryRunner.manager
        .createQueryBuilder()
        .select("MealIngredient")
        .from(MealIngredients, "MealIngredient")
        .where("MealIngredient.id= :ids", { ids: id })
        .getOne();
      res.send({
        message: "meal meal ing was successful",
        MealIngredient: MealIngredients,
      });
    } catch (error) {
      res.status(404).send({ message: "meal not found", error: error });
    }
  };

  static getManyByMealId = async (req: Request, res: Response) => {
    const mealId: string = req.params.id;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      console.log("koko1");

      /* const MealIngredient = await queryRunner.manager.createQueryBuilder().
        select("MealIngredient.mealId , MealIngredient.id as  mealIngredientId, MealIngredient.quantity, MealIngredient.ingredientId")
        .from(MealIngredients, "MealIngredient")
        .where("MealIngredient.mealId= :ids", {ids : mealId}).getRawMany(); */
      const MealIngredient = await createQueryBuilder("ingredients")
        .select(
          "MealIngredients.mealId , MealIngredients.id as  mealIngredientId, MealIngredients.quantity, MealIngredients.ingredientId,ingredients.name, ingredients.measurment "
        )
        .leftJoin("ingredients.MealIngredients", "MealIngredients")
        .where("MealIngredients.mealId= :ids", { ids: mealId })
        .getRawMany();
      console.log(MealIngredient);

      if (MealIngredient == null || MealIngredient.length == 0) {
        res.send({
          message: "no ingredients for this meal",
          MealIngredient: MealIngredient,
        });
        return;
      }
      res.send({
        message: "meal listAll was successful",
        MealIngredient: MealIngredient,
      });
    } catch (error) {
      res.status(404).send({ message: "meal not found", error: error });
    }
  };

  static newMealIngredients = async (req: Request, res: Response) => {
    let mealIngredientreq = req.body;
    const MealIngredient = new MealIngredients();
    MealIngredient.quantity = mealIngredientreq.quantity;
    MealIngredient.meal = mealIngredientreq.mealId;
    MealIngredient.ingredient = mealIngredientreq.ingredientId;

    //Validade if the parameters are ok
    const errors = await validate(MealIngredient);
    if (errors.length > 0) {
      res
        .status(400)
        .send({ message: "meal new  was unsuccessful", error: errors });
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      mealIngredientreq = await queryRunner.manager.save(MealIngredient);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({
          message: "meal creation was unsuccessful, it already exists",
          error: err,
        });
    } finally {
      await queryRunner.release();
      res
        .status(201)
        .send({ message: "meal ingredient created", mealIngredientreq });
    }
  };
  static editMealIngredients = async (req: Request, res: Response) => {
    const id = req.params.id;
    let mealIngredientreq = req.body;
    let MealIngredient, editedMeal; // = new MealIngredients();

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      const Meal = await queryRunner.manager
        .createQueryBuilder()
        .select("MealIngredients")
        .from(MealIngredients, "MealIngredients")
        .where("MealIngredients.id= :ids", { ids: id })
        .getOne();
      MealIngredient = Meal;
    } catch (error) {
      res.status(404).send({ message: "meal not found", error: error });
    }
    if (mealIngredientreq.quantity != null)
      MealIngredient.quantity = mealIngredientreq.quantity;
    if (mealIngredientreq.meal != null)
      MealIngredient.meal = mealIngredientreq.meal;
    if (mealIngredientreq.ingredient != null)
      MealIngredient.ingredient = mealIngredientreq.ingredient;
    const errors = await validate(MealIngredient);
    if (errors.length > 0) {
      res
        .status(400)
        .send({ message: "meal ebit was unsuccessful", error: errors });
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      editedMeal = await queryRunner.manager.save(MealIngredient);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({ message: "meal edit was unsuccessful", error: err });
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "meal edited", editedMeal });
    }
  };
  static deleteMealIngredients = async (req: Request, res: Response) => {
    const id = req.params.id;
    let MealIngredient;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      MealIngredient = await connection
        .createQueryBuilder()
        .select("MealIngredients")
        .from(MealIngredients, "MealIngredients")
        .where("MealIngredients.id= :ids", { ids: id })
        .getOne();
    } catch (error) {
      res.status(404).send({ message: "meal not found", error: error });
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(MealIngredient);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({ message: "meal deletion was unsuccessful", error: err });
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "meal deleted" });
    }
  };
}

export default MealIngredientsController;
