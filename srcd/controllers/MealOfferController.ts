import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { MealOffer } from "../entity/MealOffer";

class MealOfferController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const mealOffeer = await queryRunner.manager
      .createQueryBuilder()
      .select("MealOffer")
      .from(MealOffer, "MealOffer")
      .getMany();

    res.send(mealOffeer);
  };
  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const mealOffer = await queryRunner.manager
        .createQueryBuilder()
        .select("MealOffer")
        .from(MealOffer, "MealOffer")
        .where("MealOffer.id= :ids", { ids: id })
        .getMany();
      res.send(mealOffer);
    } catch (error) {
      res.status(404).send("meal not found");
    }
  };
  static newMealOffer = async (req: Request, res: Response) => {
    
    
  };
  static editMealOffer = async (req: Request, res: Response) => {
    const id = req.params.id;
    const mealOfferReq = req.body;
    let mealOffer;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      mealOffer = await queryRunner.manager
        .createQueryBuilder()
        .select("MealOffer")
        .from(MealOffer, "MealOffer")
        .where("MealOffer.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("meal not found");
    }

    if(mealOfferReq.quantity!=null)
    mealOffer.quantity = mealOfferReq.quantity;
    if(mealOfferReq.mealId!=null)
    mealOffer.Meals =mealOfferReq.mealId;
    if(mealOfferReq.offerId!=null)
    mealOffer.Offers = mealOfferReq.offerId;
    const errors = await validate(mealOffer);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(mealOffer);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("meal edit was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("meal created");
    }
  };
  static deleteMealOffer = async (req: Request, res: Response) => {
    const id = req.params.id;
    let mealOffer;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      mealOffer = await connection
        .createQueryBuilder()
        .select("MealOffer")
        .from(MealOffer, "MealOffer")
        .where("MealOffer.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("meal not found");
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(mealOffer);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("meal deletion was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("meal deleted");
    }
  };
}

export default MealOfferController;
