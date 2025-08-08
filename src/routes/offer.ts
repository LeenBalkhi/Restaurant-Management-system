import { Router } from "express";
import OffersController from "../controllers/OffersController";
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";

 const router =  Router();
//Get all Offerss
router.get("/", [checkJwt, checkRole(["admin","waiter","customer","cashier"])], OffersController.listAll);

// Get one Offers
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],OffersController.getOneById);

//Create a new Offers
router.post("/", [checkJwt, checkRole(["admin"])], OffersController.newOffers);

//Edit one Offers
router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],OffersController.editOffers);

//get meals By OfferlId
router.get("/getmealsByOfferlId/:id([0-9]+)",[checkJwt, checkRole(["admin","waiter","customer","cashier"])],OffersController.getmealsByOfferlId);

//Delete one Offers
router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],OffersController.deleteOffers);

 export default router;