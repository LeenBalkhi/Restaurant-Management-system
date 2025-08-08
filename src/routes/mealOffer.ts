import { Router } from "express";
import MealOfferController from "../controllers/MealOfferController";
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";

 const router =  Router();
//Get all Offerss
router.get("/", [checkJwt, checkRole(["admin",])], MealOfferController.listAll);

// Get one Offers
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],MealOfferController.getOneById);

//Create a new Offers
router.post("/", [checkJwt, checkRole(["admin"])], MealOfferController.newMealOffer);

//Edit one Offers
router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],MealOfferController.editMealOffer);


//Delete one Offers
router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],MealOfferController.deleteMealOffer);

 export default router;