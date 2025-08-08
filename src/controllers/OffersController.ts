import { Request, Response } from "express";
import { createQueryBuilder, getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { Offers } from "../entity/Offers";
import { MealOffer } from "../entity/MealOffer";

class OffersController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const offers = await queryRunner.manager
      .createQueryBuilder()
      .select("Offers")
      .from(Offers, "Offers")
      .getMany();
      for (const offer of offers) {
        const offerMeals = await createQueryBuilder("Meals")
        .select(
          "MealOffer.mealsId as mealId , MealOffer.quantity as quantity ,Meals.name as name"
        )
        .leftJoin("Meals.MealOffers", "MealOffer")
        .where("MealOffer.offersId= :ids", { ids: offer.id })
        .getRawMany();
        offer.mealOffers=offerMeals;
        
      }
    res.send(offers);
  };
  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const offer = await queryRunner.manager
        .createQueryBuilder()
        .select("Offers")
        .from(Offers, "Offers")
        .where("Offers.id= :ids", { ids: id })
        .getMany();
      res.send(offer);
    } catch (error) {
      res.status(404).send("offer not found");
    }
  };
  static newOffers = async (req, res: Response) => {
    let reqOffer = req.body;
    const offer = new Offers();
    offer.name = reqOffer.name;
    offer.price = reqOffer.price;
    offer.expirationDate = reqOffer.expirationDate;
    if(offer.name ==null||offer.price==null||offer.expirationDate==null)
    {
      res.status(409);//.send({ error: err });

      return {error:"all fields are requierd"};
        }

    //Validade if the parameters are ok
    const errors = await validate(offer);
    if (errors.length > 0) {

      res.status(400).send({ messsage: "unvalid input", error: errors });
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");
    let savedOffer;
    try {
      savedOffer = await queryRunner.manager.save(offer);

      if (reqOffer.mealOffers != null) {
        for (var reqmealOffer of reqOffer.mealOffers) {
          const mealOffer = new MealOffer();
          mealOffer.quantity = reqmealOffer.quantity;
          mealOffer.Meals = reqmealOffer.mealId;
          mealOffer.Offers = savedOffer;
         // console.log(mealOffer);
          const errors = await validate(mealOffer);
          if (errors.length > 0) {
            await queryRunner.rollbackTransaction();

            res
              .status(404)
              ;return{
                message: "mealoffer newoffer was unsuccessful",
                error: errors,
              };
            ;
          }
          await queryRunner.manager.save(mealOffer);
        }
      
      }
      await queryRunner.commitTransaction();
      
      await queryRunner.release();
      res.status(201);//.send({ message: "offer created", offer: savedOffer });
      return{ message: "offer created", offer: savedOffer };
    } catch (err) {

      await queryRunner.rollbackTransaction();
      res
        .status(404);
        return{
          message: "offer creation was unsuccessful, it already exists",
          error: err,
        };
    } finally {

    }
  };
  static getmealsByOfferlId = async (req: Request, res: Response) => {
    const offerId: string = req.params.id;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      //console.log("koko1");

      const offerMeals = await createQueryBuilder("Meals")
        .select(
          "MealOffer.mealsId , MealOffer.id as  mealOfferId, MealOffer.quantity, MealOffer.offersId,Meals.name as mealName"
        )
        .leftJoin("Meals.MealOffers", "MealOffer")
        .where("MealOffer.offersId= :ids", { ids: offerId })
        .getRawMany();
   //   console.log(offerMeals);
      const offer = await queryRunner.manager
        .createQueryBuilder()
        .select("Offers")
        .from(Offers, "Offers")
        .where("Offers.id= :ids", { ids: offerId })
        .getOneOrFail();

      res.send({
        message: "offer and offer meals was successful",
        offer: offer,
        mealOffer: offerMeals,
      });
    } catch (error) {
      res.status(404).send({ message: "offer not found", error });
    }
  };
  static editOffers = async (req: Request, res: Response) => {
    const id = req.params.id;
    const offerReq= req.body;
    let offer;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
       offer = await queryRunner.manager
        .createQueryBuilder()
        .select("Offers")
        .from(Offers, "Offers")
        .where("Offers.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send({error:"offer not found"});
    }

    if(offerReq.name!=null)
    offer.name =offerReq.name;
    if(offerReq.mealOffeer!=null)
    offer.MealOffers =offerReq.mealOffeer ;
    if(offerReq.price!=null)
    offer.price = offerReq.price;
    const errors = await validate(offer);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(offer);
      if(req.body.mealOffers!=null){
        let mealOfferReqs = req.body.mealOffers;
        for (const mealOfferReq of mealOfferReqs) {
          const mealOffer = new MealOffer();
        mealOffer.quantity = mealOfferReq.quantity;
        mealOffer.Meals = mealOfferReq.mealId;
        mealOffer.Offers =mealOfferReq.offerId;
    
        //Validade if the parameters are ok
        const errors = await validate(mealOffer);
        if (errors.length > 0) {
          await queryRunner.rollbackTransaction();
          res.status(400).send(errors);
          return;
        }
        try {
          await queryRunner.manager.save(mealOffer);
        } catch (err) {
          await queryRunner.rollbackTransaction();
          res.status(409).send("meal creation was unsuccessful, it already exists");
        }
        }
      }
    
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("offer edit was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("offer created");
    }
  };
  static deleteOffers = async (req: Request, res: Response) => {
    const id = req.params.id;
    let offer;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      offer = await connection
        .createQueryBuilder()
        .select("Offers")
        .from(Offers, "Offers")
        .where("Offers.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      await queryRunner.release();

      res.status(404).send({message:"offer not found",error:error});
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(offer);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send({message:"offer deletion was unsuccessful",error:err});
    } finally {
      await queryRunner.release();
      res.status(201).send({message:"offer deleted"});
    }
  };
}

export default OffersController;
