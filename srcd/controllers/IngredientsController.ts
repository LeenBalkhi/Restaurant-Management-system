import { Request, Response } from "express";
import { createQueryBuilder, getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";

import { ingredients } from "../entity/Ingredients";
import { StockIngredient } from "../entity/StockIngredient";
import { SubOrderIngredient } from "../entity/SubOrderIngredient";
import { MealIngredients } from "../entity/MealIngredients";
import console = require("console");
import { Orders } from "../entity/Orders";
import { Meals } from "../entity/Meal";

class IngredientsController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get ingredients from database

    const ingredient = await queryRunner.manager
      .createQueryBuilder()
      .select("ingredients")
      .from(ingredients, "ingredients")
      .getMany();
    //Send the ingredients object
    res.send(ingredient);
  };
  static hasEnough = async (order:Orders )=>{
    //console.log("the one and only")
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");
    try {

      const orderOffers = await createQueryBuilder("Offers")
        .select(
          "OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price "
        )
        .leftJoin("Offers.OrderOffers", "OrderOffers")
        .where("OrderOffers.ordersId= :ids", { ids: order.id })
        .getRawMany();

      const orderMeals = await createQueryBuilder("Meals")
        .select(
          "OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity ,  Meals.name, Meals.price,MealIngredients.ingredientsId as ingredientsId ,MealIngredients.quantity as mealQuantity"
        )
        .leftJoin("Meals.OrderMeals", "OrderMeals")
        .leftJoin("Meals.MealIngredients", "MealIngredients")
        .where("OrderMeals.ordersId= :ids", { ids: order.id })
        .getRawMany();  
        for(var mealIngredient of orderMeals){
          const ingredient = await queryRunner.manager
          .createQueryBuilder()
          .select("ingredients")
          .from(ingredients, "ingredients")
          .where("ingredients.id= :ids", { ids: mealIngredient.ingredientsId })
          .getOneOrFail();
          if(ingredient.quantity<(mealIngredient.quantity*mealIngredient.mealQuantity)){
            console.log(ingredient.quantity+"  k  "+(mealIngredient.quantity*mealIngredient.mealQuantity))
            ingredient.quantity=ingredient.quantity-(mealIngredient.quantity*mealIngredient.mealQuantity);
            await queryRunner.manager.save(ingredient);

          }
          else{
            await queryRunner.rollbackTransaction();

            return false;
          }
          await queryRunner.manager.save(ingredient);

        }


     
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
      return true;   
     }


    
    

  }

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get the ingredient from database
    try {
      const ingredient = await queryRunner.manager
        .createQueryBuilder()
        .select("ingredients")
        .from(ingredients, "ingredients")
        .where("ingredients.id= :ids", { ids: id })
        .getOneOrFail();
      res.send(ingredient);
    } catch (error) {
      res.status(404).send({ error: error });
    }
  };

  static newIngredient = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { name, measurment, price, quantity, minthreshold } = req.body;
    let ingredient = new ingredients();
    ingredient.name = name;
    ingredient.measurment = measurment;
    ingredient.price = price;
    ingredient.quantity = quantity;
    ingredient.minthreshold = minthreshold;

    //Validade if the parameters are ok
    const errors = await validate(ingredient);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(ingredient);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({
          message: "ingredient creation was unsuccessful, it already exists",
          error: err,
        });
    } finally {
      await queryRunner.release();
      res.status(201).send(ingredient);
    }
  };

  static editIngredient = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    const reqIngredient = req.body;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get values from the body

    //Try to find ingredient on database
    const IngredientsRepository = getRepository(ingredients);
    let ingredient;
    try {
      ingredient = await queryRunner.manager
        .createQueryBuilder()
        .select("ingredients")
        .from(ingredients, "ingredients")
        .where("ingredients.id= :ids", { ids: id })
        .getOneOrFail();
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send({ message: "ingredient not found", error: error });
      return;
    }

    console.log(reqIngredient);
    //Validate the new values on model
    if (reqIngredient.hasOwnProperty("name"))
      ingredient.name = reqIngredient.name;
    if (reqIngredient.measurment != null)
      ingredient.measurment = reqIngredient.measurment;
    if (reqIngredient.price != null) ingredient.price = reqIngredient.price;
    if (reqIngredient.quantity != null) {
      ingredient.quantity = reqIngredient.quantity;
      console.log(reqIngredient.quantity);
    }
    if (reqIngredient.minthreshold != null)
      ingredient.minthreshold = reqIngredient.minthreshold;
    const errors = await validate(ingredient);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      console.log(ingredient);
      const a = await queryRunner.manager.save(ingredient);
      console.log("koko  ");
      console.log(a);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({ message: "ingredient edit was unsuccessful", error: err });
    } finally {
      ingredient = await queryRunner.manager
        .createQueryBuilder()
        .select("ingredients")
        .from(ingredients, "ingredients")
        .where("ingredients.id= :ids", { ids: id })
        .getOne();
      await queryRunner.release();
      res
        .status(201)
        .send({ message: "ingredient created", ingredient: ingredient });
    }
  };

  static deleteIngredient = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    console.log("koko");

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    let ingredient;
    try {
      ingredient = await queryRunner.manager
        .createQueryBuilder()
        .select("ingredients")
        .from(ingredients, "ingredients")
        .where("ingredients.id= :ids", { ids: id })
        .getOne();

      console.log(ingredient);
    } catch (error) {
      res.status(404).send({ message: "ingredient not found", error: error });
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");
    console.log("koko2");

    try {
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(StockIngredient)
        .where("ingredientsId= :ids", { ids: id })
        .execute();
      //delete SubOrderIngredient
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(SubOrderIngredient)
        .where("ingredientId= :ids", { ids: id })
        .execute();
      //delete MealIngredients
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(MealIngredients)
        .where("ingredientId= :ids", { ids: id })
        .execute();

      await queryRunner.manager.remove(ingredient);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({ message: "ingredient deletion was unsuccessful", error: err });
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "ingredient deleted" });
    }
  };
}

export default IngredientsController;
