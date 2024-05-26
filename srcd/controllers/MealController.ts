import { Request, Response } from "express";
import { FileLogger, getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { Meals } from "../entity/Meal";
import { getManager } from "typeorm";
import { log } from "console";
import { MealIngredients } from "../entity/MealIngredients";
import console = require("console");
const fs = require("fs");
const path = require("path");
import { multiparty } from "multiparty";
//import * as multer from 'multer';

import * as moment from "moment";
class MealController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const Meal = await queryRunner.manager
      .createQueryBuilder()
      .select("meals")
      .from(Meals, "meals")
      .where("meals.available= :availables", { availables: 1 })
      .getMany();

    res.send({ message: "meal listAll was successful", Meal: Meal });
  };
  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const Meal = await queryRunner.manager
        .createQueryBuilder()
        .select("meals")
        .from(Meals, "meals")
        .where("meals.id= :ids", { ids: id })
        .getOne();
      res.send({ message: "meal listAll was successful", Meal: Meal });
    } catch (error) {
      res.status(404).send({ message: "meal not found", error: error });
    }
  };

  static getManyBySectionId = async (req: Request, res: Response) => {
    const sectionId: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const meals = await queryRunner.manager
        .createQueryBuilder()
        .select("meal")
        .from(Meals, "meal")
        .where("meal.available=1 and meal.sectionId= :ids", { ids: sectionId })
        .getMany();

      if (meals == null || meals.length == 0) {
        res.send({ message: "no ingredients for this meal", meals });
        return;
      }
      res.send({
        message: "meal getManyBySectionId was successful",
        meals: meals,
      });
    } catch (error) {
      res.status(404).send({ message: "meal not found", error: error });
    }
  };

  static newMeal = async (req, res) => {
    let reqMeal = req.body;
    const meal = new Meals();
    meal.name = reqMeal.name;
    meal.description = reqMeal.description;
    meal.price = reqMeal.price;
    if(meal.price==null || meal.name==null||meal.description ==null){
      return {error:"all fields are requierd"};

    }
    if (reqMeal.section == null) reqMeal.section = 1;

    meal.section = reqMeal.section;

    if (reqMeal.available != null) meal.available = reqMeal.available;
    else meal.available = true;

    //Validade if the parameters are ok
    const errors = await validate(meal);
    if (errors.length > 0) {
      res
        .status(400)
        .send({ message: "meal newMeal was unsuccessful", error: errors });
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");
    let savedMeal, MealIngredient;
    try {
      savedMeal = await queryRunner.manager.save(meal);

      for (var mealIngredient of reqMeal.mealIngredients) {
        const MealIngredient = new MealIngredients();
        MealIngredient.quantity = mealIngredient.quantity;
        MealIngredient.meal = savedMeal;
        MealIngredient.ingredient = mealIngredient.ingredientId;
     //   console.log(MealIngredient);
        const errors = await validate(MealIngredient);
        if (errors.length > 0) {
          res
            .status(400)
            .send({ message: "meal newMeal was unsuccessful", error: errors });
          return;
        }
        await queryRunner.manager.save(MealIngredient);
      }
      await queryRunner.commitTransaction();
      MealIngredient = await queryRunner.manager
        .createQueryBuilder()
        .select(
          "MealIngredient.mealId , MealIngredient.id as  mealIngredientId, MealIngredient.quantity, MealIngredient.ingredientId"
        )
        .from(MealIngredients, "MealIngredient")
        .where("MealIngredient.mealId= :ids", { ids: savedMeal.id })
        .getRawMany();

      savedMeal.MealIngredients = MealIngredients;
     // console.log("kokoko");
   //   console.log(savedMeal.MealIngredients);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send({
        message: "meal creation was unsuccessful, it already exists",
        error: err,
      });
    } finally {
      const MealIngredient = await queryRunner.manager
        .createQueryBuilder()
        .select(
          "MealIngredient.mealId , MealIngredient.id as  mealIngredientId, MealIngredient.quantity, MealIngredient.ingredientId"
        )
        .from(MealIngredients, "MealIngredient")
        .where("MealIngredient.mealId= :ids", { ids: savedMeal.id })
        .getRawMany();
      savedMeal.mealIngredients = MealIngredient;
      //console.log(MealIngredient);
      return savedMeal;

      res.status(201).send({ message: "meal created", meal: savedMeal });
      await queryRunner.release();
      
    }
  };
  static editMeal = async (req: Request, res: Response) => {
    const id = req.params.id;
    let reqMeal = req.body;
    let meal;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      meal = await queryRunner.manager
        .createQueryBuilder()
        .select("meals")
        .from(Meals, "meals")
        .where("meals.id= :ids", { ids: id })
        .getOneOrFail();
    } catch (error) {
      res.status(404).send({ message: "meal not found", error: error });
    }
    /*if(reqMeal.available!=null)
        meal.available=(req.available);*/
    if (reqMeal.name != null) meal.name = reqMeal.name;
    if (reqMeal.description != null) meal.description = reqMeal.description;
    if (reqMeal.price != null) meal.price = reqMeal.price;
    if (reqMeal.section != null) meal.section = reqMeal.section;

    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");
    if (reqMeal.mealIngredients != null) {
      for (var mealIngredient of reqMeal.mealIngredients) {
        if (mealIngredient.mealIngredientId != null) {
          try {
            let MealIngredient = await queryRunner.manager
              .createQueryBuilder()
              .select("MealIngredients")
              .from(MealIngredients, "MealIngredients")
              .where("MealIngredients.id= :ids", {
                ids: mealIngredient.mealIngredientId,
              })
              .getOne();
            if (mealIngredient.quantity != null) {
              MealIngredient.quantity = mealIngredient.quantity;
            }
            if (mealIngredient.ingredientId != null) {
              MealIngredient.ingredient = mealIngredient.ingredientId;
            }
            await queryRunner.manager.save(MealIngredient);
          } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(409).send({
              message: "meal edit was unsuccessful mealIngredient ",
              error: error,
            });
          }
        } else {
          try {
            if (
              mealIngredient.ingredientId != null &&
              mealIngredient.quantity != null
            ) {
              const MealIngredient = new MealIngredients();
              MealIngredient.quantity = mealIngredient.quantity;
              MealIngredient.meal = meal;
              MealIngredient.ingredient = mealIngredient.ingredientId;
              const errors = await validate(MealIngredient);
              if (errors.length > 0) {
                res.status(400).send({
                  message: "meal edit was unsuccessful",
                  error: errors,
                });
                return;
              }
              await queryRunner.manager.save(MealIngredient);
            } else {
              res.status(404).send({ message: "meal not found" });
            }
          } catch (err) {
            await queryRunner.rollbackTransaction();
            res.status(409).send({
              message: "meal edit was unsuccessful mealIngredient new",
              error: err,
            });
            return;
          }
        }
      }
    }
    const errors = await validate(meal);
    if (errors.length > 0) {
      res
        .status(400)
        .send({ message: "meal edit was unsuccessful", error: errors });
      return;
    }

    let editedMeal;
    try {
      editedMeal = await queryRunner.manager.save(meal);
      const MealIngredient = await queryRunner.manager
        .createQueryBuilder()
        .select(
          "MealIngredient.mealId , MealIngredient.id as  mealIngredientId, MealIngredient.quantity, MealIngredient.ingredientId"
        )
        .from(MealIngredients, "MealIngredient")
        .where("MealIngredient.mealId= :ids", { ids: id })
        .getRawMany();
      editedMeal.mealIngredients = MealIngredient;

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({ message: "meal edit was unsuccessful", error: err });
    } finally {
      await queryRunner.release();

      res.status(201).send({ message: "meal edited", meal: editedMeal });
    }
  };
  static deleteMeal = async (req: Request, res: Response) => {
    const id = req.params.id;
    let meal, deletedMeal;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      meal = await connection
        .createQueryBuilder()
        .select("meals")
        .from(Meals, "meals")
        .where("meals.id= :ids", { ids: id })
        .getOne();
    } catch (error) {
      res.status(404).send({ message: "meal not found", error: error });
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      meal.available = false;
      deletedMeal = await queryRunner.manager.save(meal);

      // await queryRunner.manager.remove(meal);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({ message: "meal deletion was unsuccessful", error: err });
    } finally {
      await queryRunner.release();
      res.status(201).send({
        message: "meal was deleted successfuly",
        deletedMeal: deletedMeal,
      });
    }
  };

  static uploadImage = async (req: Request, res: Response) => {
    console.log(req.file.filename);

    let avatar = req.file.filename;
 //   console.log(avatar);
    const id = req.params.id;
    let meal;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      meal = await queryRunner.manager
        .createQueryBuilder()
        .select("meals")
        .from(Meals, "meals")
        .where("meals.id= :ids", { ids: id })
        .getOneOrFail();
        meal.imageUrl="http://localhost:3307/images/"+avatar
    } catch (error) {
      res.status(404).send({ message: "meal not found", error: error });
    }
    let editedMeal;
    try {
      editedMeal = await queryRunner.manager.save(meal);
     
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({ message: "meal edit was unsuccessful", error: err });
    } finally {
      await queryRunner.release();

      res.status(201).send({ message: "meal edited", meal: editedMeal });
    }

  };
}

export default MealController;
