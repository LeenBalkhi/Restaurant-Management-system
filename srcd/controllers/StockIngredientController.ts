import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";

import { StockIngredient } from "../entity/StockIngredient";
import { ingredients } from "../entity/Ingredients";
import { SSL_OP_TLS_ROLLBACK_BUG } from "constants";
import console = require("console");
import { error } from "console";

class StockIngredientController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const stockIngredients = await queryRunner.manager
      .createQueryBuilder()
      .select("stockIngredient")
      .from(StockIngredient, "stockIngredient")
      .getMany();

    res.send(stockIngredients);
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const stockIngredient = await queryRunner.manager
        .createQueryBuilder()
        .select("stockIngredient")
        .from(StockIngredient, "stockIngredient")
        .where("stockIngredient.id= :ids", { ids: id })
        .getMany();
      res.send(stockIngredient);
    } catch (error) {
      res
        .status(404)
        .send({ message: "stock Ingredient not found", error: error });
    }
  };

  static getOneByIngredientId = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const stockIngredient = await queryRunner.manager
        .createQueryBuilder()
        .select("stockIngredient")
        .from(StockIngredient, "stockIngredient")
        .where("stockIngredient.ingredientsId= :ids", { ids: id })
        .getMany();

  //    console.log(stockIngredient);
      res.send(stockIngredient);
    } catch (error) {
      res
        .status(404)
        .send({ message: "stock Ingredient not found", error: error });
    }
  };

  static newStockIngredient = async (req, res: Response) => {
    let reqStockIngredient = req.body;
    const StockIngr = new StockIngredient();
    StockIngr.expirationDate =new Date( reqStockIngredient.expirationDate);
    StockIngr.quantity = reqStockIngredient.quantity;
    StockIngr.ingredients = reqStockIngredient.ingredientId;
    StockIngr.stock = reqStockIngredient.stockId;
    StockIngr.price = reqStockIngredient.price;
    if(StockIngr.stock ==null||StockIngr.quantity==null||StockIngr.expirationDate==null||StockIngr.ingredients ==null)
    {
   //   console.log(StockIngr)
      res.status(409);//.send({ error: err });

      return {error:"all fields are requierd"};
        }
    //Validade if the parameters are ok
    const errors = await validate(StockIngr);
    if (errors.length > 0) {
      res.status(400).send({ error: errors });
      return errors;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      const Ingredient = await queryRunner.manager
        .createQueryBuilder()
        .select("ingredients")
        .from(ingredients, "ingredients")
        .where("ingredients.id= :ids", { ids: StockIngr.ingredients })
        .getOne();
        if(Ingredient==null){

       //   console.log("koko not")

         // console.log(Ingredient);

          await queryRunner.rollbackTransaction();
          await queryRunner.release();
          res.status(404);//.send({ error: err });

          return {error:"all fields are requierd"};
        }
        else{
          //console.log(Ingredient);
        //  console.log("koko")


          await queryRunner.manager.save(StockIngr);
          Ingredient.quantity = Ingredient.quantity + StockIngr.quantity;
         // console.log(Ingredient);
          const t = await queryRunner.manager.save(Ingredient);
          //console.log(t);
        //  console.log("koko")
          await queryRunner.commitTransaction();
          await queryRunner.release();
          res.status(201);//.send({ stockIngredient: StockIngr });
    
          return {message:"new stock stockIngredient ",StockIngredient: StockIngr};
        }
       
      
   
    } catch (err) {
      await queryRunner.rollbackTransaction();
         //  console.log(err);
            await queryRunner.release();


      res.status(404);//.send({ error: err });

      return {error:"all fields are requierd"};

    } 
  };

  static editStockIngredient = async (req: Request, res: Response) => {
    const id = req.params.id;

    let reqStockIngredient = req.body;
    console.log(reqStockIngredient);
    var y: number = +id;
    console.log(id);

    let StockIngr = new StockIngredient();

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const stockIngredient = await queryRunner.manager
        .createQueryBuilder()
        .select("stockIngredient")
        .from(StockIngredient, "stockIngredient")
        .where("stockIngredient.id= :ids", { ids: id })
        .getOne();
      StockIngr = stockIngredient;
    } catch (error) {
      res.status(404).send({ error: error });
    }
    const oldQuantity = StockIngr.quantity;
    console.log(StockIngr);
    StockIngr.id = y;
    console.log(StockIngr);

    if (reqStockIngredient.expirationDate != null)
      StockIngr.expirationDate = reqStockIngredient.expirationDate;
    console.log(StockIngr);

    if (reqStockIngredient.quantity != null)
      StockIngr.quantity = reqStockIngredient.quantity;
    console.log(StockIngr);

    if (reqStockIngredient.ingredientId != null)
      StockIngr.ingredients = reqStockIngredient.ingredientId;
    console.log(StockIngr);
    if (reqStockIngredient.price != null)
      StockIngr.price = reqStockIngredient.price;

    const errors = await validate(StockIngr);
    if (errors.length > 0) {
      res.status(400).send({ error: errors });
      return;
    }
    await queryRunner.connect();

    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(StockIngr);
      if (reqStockIngredient.quantity != null) {
        const Ingredient = await queryRunner.manager
          .createQueryBuilder()
          .select("ingredients")
          .from(ingredients, "ingredients")
          .where("ingredients.id= :ids", { ids: StockIngr.ingredients })
          .getOne();
        Ingredient.quantity =
          Ingredient.quantity + StockIngr.quantity - oldQuantity;
        await queryRunner.manager.save(Ingredient);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send({ error: err });
    } finally {
      await queryRunner.release();
      res.status(201).send({
        message: "stock Ingredient created",
        stockIngredient: StockIngr,
      });
    }
  };

  static deleteStockIngredient = async (req: Request, res: Response) => {
    const id = req.params.id;
    let StockIngr;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      StockIngr = await connection
        .createQueryBuilder()
        .select("stockIngredient")
        .from(StockIngredient, "stockIngredient")
        .where("stockIngredient.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res
        .status(404)
        .send({ message: "stock Ingredient not found", error: error });
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(StockIngr);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send({
        message: "stock Ingredient deletion was unsuccessful",
        error: error,
      });
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "stock Ingredient deleted" });
    }
  };
}

export default StockIngredientController;
